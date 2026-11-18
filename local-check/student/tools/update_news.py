#!/usr/bin/env python3
"""Refresh public RSS headlines for the student regional inquiry website.

No API keys. Headlines are NOT fact-checked, full article text is never copied.
Failures leave the previous file unchanged to avoid replacing good data with an outage.
"""
from __future__ import annotations
import datetime as dt
import email.utils
import json
import pathlib
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

REGIONS = (
    "청주시", "충주시", "제천시", "보은군", "옥천군", "영동군",
    "증평군", "진천군", "괴산군", "음성군", "단양군"
)
DATA = pathlib.Path(__file__).resolve().parents[1] / "latest.json"
NOW = dt.datetime.now(dt.timezone.utc)
AFTER = NOW - dt.timedelta(days=45)

def valid_url(raw: str) -> str:
    p = urllib.parse.urlsplit(raw.strip())
    return raw if p.scheme == "https" and p.netloc.endswith(("google.com", "googleusercontent.com", "news.google.com")) else ""

def query(region: str) -> str:
    q = f"충북 {region} 축제 OR 문화 OR 교육 OR 지역사회 when:45d"
    return "https://news.google.com/rss/search?" + urllib.parse.urlencode({
        "q": q, "hl": "ko", "gl": "KR", "ceid": "KR:ko"
    })

def fetch(region: str) -> list[dict]:
    req = urllib.request.Request(
        query(region),
        headers={"User-Agent": "Mozilla/5.0 (compatible; LocalCheckEdu/1.0; educational RSS reader)", "Accept": "application/rss+xml, text/xml"}
    )
    with urllib.request.urlopen(req, timeout=15) as response:
        xml_data = response.read(512000)
    root = ET.fromstring(xml_data)
    items = []
    token = region[:-1]
    for node in root.findall(".//channel/item")[:45]:
        title = (node.findtext("title") or "").strip()
        link = (node.findtext("link") or "").strip()
        publisher = (node.findtext("source") or "뉴스 제공처").strip()
        date_str = node.findtext("pubDate") or ""
        if not title or not valid_url(link) or token not in title:
            continue
        try:
            published = email.utils.parsedate_to_datetime(date_str).astimezone(dt.timezone.utc)
            if published < AFTER or published > NOW + dt.timedelta(days=1):
                continue
        except (TypeError, ValueError, OverflowError):
            continue
        headline = title.removesuffix(" - " + publisher).strip()[:180]
        if not headline or len(headline) < 7:
            continue
        items.append({
            "region": region,
            "title": headline,
            "publisher": publisher[:75],
            "published": published.date().isoformat(),
            "url": link,
            "verified": False,
            "sourceType": "언론 기사 검색 결과"
        })
        if len(items) == 4:
            break
    return items

def main() -> None:
    found = []
    succeeded = 0
    for region in REGIONS:
        try:
            found.extend(fetch(region))
            succeeded += 1
        except (urllib.error.URLError, TimeoutError, ET.ParseError, ValueError) as exc:
            print(f"{region}: RSS 자료를 가져오지 못했습니다: {type(exc).__name__}")
        time.sleep(0.35)
    # Do not wipe good data on feed outage.
    if succeeded == 0:
        raise RuntimeError("No valid RSS responses; the existing latest.json is preserved.")
    uniq = {}
    for row in found:
        key = (row["region"], row["title"])
        uniq.setdefault(key, row)
    result = {
        "version": 1,
        "origin": "Google 뉴스 RSS 공개 검색 결과",
        "updatedAt": NOW.date().isoformat(),
        "note": "검색 결과 제목만 제공합니다. 기사 원문·발행일·사실 여부는 학생이 직접 확인해야 합니다.",
        "regionsChecked": succeeded,
        "items": sorted(uniq.values(), key=lambda x: x["published"], reverse=True)[:44]
    }
    DATA.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Saved {len(result['items'])} headline links for {succeeded} of {len(REGIONS)} regions.")

if __name__ == "__main__":
    main()
