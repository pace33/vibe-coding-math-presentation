#!/usr/bin/env python3
"""Collect Google News RSS link metadata for local student news inquiry.

No API keys; no article bodies; results are not fact checked.
Provides two cached resources:
  latest.json: four most recent headlines for each Chungbuk municipality
  search-index.json: more article metadata by region/topic, locally searchable
Caching is a fallback; it is not a live Google News API.
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
    "증평군", "진천군", "괴산군", "음성군", "단양군",
)
TOPICS = (
    ("지역생활", "축제 OR 문화 OR 교육 OR 지역사회"),
    ("기업산업", "기업 OR 중소기업 OR 공장 OR 산업"),
    ("특화산업", "반도체 OR 식품 OR 농업 OR 취업"),
    ("관광환경", "관광 OR 생태 OR 여행 OR 교통"),
)
BASE = pathlib.Path(__file__).resolve().parents[1]
NOW = dt.datetime.now(dt.timezone.utc)
AFTER = NOW - dt.timedelta(days=40)
MAX_INDEX = 450

def valid_url(raw: str) -> str:
    p = urllib.parse.urlsplit(raw.strip())
    return raw if p.scheme == "https" and p.hostname == "news.google.com" else ""

def query(region: str, expression: str) -> str:
    q = f"충북 {region} ({expression}) when:40d"
    return "https://news.google.com/rss/search?" + urllib.parse.urlencode({
        "q": q, "hl": "ko", "gl": "KR", "ceid": "KR:ko",
    })

def fetch(region: str, tag: str, expression: str) -> list[dict]:
    req = urllib.request.Request(
        query(region, expression),
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; LocalCheckEdu/2.0; educational RSS metadata reader)",
            "Accept": "application/rss+xml, text/xml",
        },
    )
    with urllib.request.urlopen(req, timeout=12) as response:
        xml_data = response.read(600000)
    root = ET.fromstring(xml_data)
    items = []
    token = region[:-1]
    for node in root.findall(".//channel/item")[:55]:
        title = (node.findtext("title") or "").strip()
        link = valid_url((node.findtext("link") or "").strip())
        publisher = (node.findtext("source") or "뉴스 제공처").strip()
        date_str = node.findtext("pubDate") or ""
        if not title or not link or token not in title:
            continue
        try:
            published = email.utils.parsedate_to_datetime(date_str).astimezone(dt.timezone.utc)
            if not AFTER <= published <= NOW + dt.timedelta(days=1):
                continue
        except (TypeError, ValueError, OverflowError):
            continue
        headline = title.removesuffix(" - " + publisher).strip()[:180]
        if len(headline) < 7:
            continue
        items.append({
            "region": region,
            "title": headline,
            "publisher": publisher[:75],
            "published": published.date().isoformat(),
            "url": link,
            "verified": False,
            "sourceType": "구글 뉴스 RSS 저장 결과",
            "topicGroup": tag,
        })
        if len(items) >= 7:
            break
    return items

def previous_rows() -> list[dict]:
    target = BASE / "search-index.json"
    try:
        old = json.loads(target.read_text(encoding="utf-8"))
        rows = old.get("items", [])
        if not isinstance(rows, list):
            return []
        return [
            r for r in rows
            if isinstance(r, dict)
            and r.get("region") in REGIONS
            and valid_url(str(r.get("url", "")))
            and r.get("published", "") >= AFTER.date().isoformat()
        ]
    except (OSError, ValueError, TypeError):
        return []

def main() -> None:
    collected, successes = [], 0
    for region in REGIONS:
        for tag, terms in TOPICS:
            try:
                collected.extend(fetch(region, tag, terms))
                successes += 1
            except (urllib.error.URLError, TimeoutError, ET.ParseError, ValueError) as exc:
                print(f"{region} {tag}: RSS 응답 실패: {type(exc).__name__}", flush=True)
            time.sleep(0.12)
    if successes == 0:
        raise RuntimeError("RSS 자료가 전부 차단되어 이전 캐시를 그대로 유지합니다.")

    merged = {}
    for row in collected + previous_rows():
        key = (row["region"], row["title"])
        merged.setdefault(key, row)
    indexed = sorted(merged.values(), key=lambda r: r["published"], reverse=True)[:MAX_INDEX]
    latest = []
    for region in REGIONS:
        latest.extend(next((r for r in indexed if r["region"] == region and r["title"] == title), None)
                      for title in list(dict.fromkeys(r["title"] for r in indexed if r["region"] == region))[:4])
    latest = [row for row in latest if row]
    stamp = NOW.date().isoformat()
    (BASE / "search-index.json").write_text(
        json.dumps({
            "version": 1,
            "updatedAt": stamp,
            "requestsSucceeded": successes,
            "source": "Google 뉴스 RSS 정기 저장 자료(실시간 아님)",
            "note": "기사는 자동 검증되지 않았습니다.",
            "items": indexed,
        }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8",
    )
    (BASE / "latest.json").write_text(
        json.dumps({
            "version": 1,
            "origin": "Google 뉴스 RSS 공개 검색 결과",
            "updatedAt": stamp,
            "note": "검색 결과 제목만 제공. 원문과 사실 여부는 학생이 확인.",
            "regionsChecked": len({r["region"] for r in indexed}),
            "items": sorted(latest, key=lambda r: r["published"], reverse=True),
        }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8",
    )
    print(f"Updated {len(indexed)} indexed and {len(latest)} featured headlines using {successes}/{len(REGIONS)*len(TOPICS)} RSS queries.")

if __name__ == "__main__":
    main()
