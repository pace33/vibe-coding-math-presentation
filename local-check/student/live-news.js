/* 로컬체크 Google 뉴스 웹앱 안 검색.
 * 구글 뉴스 공개 RSS -> rss2json.com의 공개 RSS/JSON 변환 API(키 없는 기본 요금제).
 * API 장애·요청 제한 시 app.js에서 최신 저장 기사로 안전하게 전환한다.
 * 이 API는 Google 공식 검색 API가 아니며 요청 시 검색어가 변환 서비스로 전달된다.
 */
(() => {
"use strict";
const ENDPOINT="https://api.rss2json.com/v1/api.json";
const LIVE_MAX=10;
const REGIONS=["청주시","충주시","제천시","보은군","옥천군","영동군","증평군","진천군","괴산군","음성군","단양군"];
function clean(s,n=180){return String(s??"").replace(/<[^>]*>/g,"").replace(/[\u0000-\u001f]/g," ").trim().slice(0,n);}
function validUrl(v){
 try{const u=new URL(String(v));return u.protocol==="https:"?u.href:"";}catch{return"";}
}
function rssUrl(region,keyword,category){
 const location=region==="전체"?"충청북도 충북":"충북 "+clean(region,30);
 const typed=clean(keyword,85);
 const topic=typed||({"business":"기업 산업 공장","local":"축제 문화 관광"}[category]||"지역 소식");
 const terms=[location,topic,"when:30d"].join(" ");
 const feed=new URL("https://news.google.com/rss/search");
 feed.searchParams.set("q",terms);
 feed.searchParams.set("hl","ko");
 feed.searchParams.set("gl","KR");
 feed.searchParams.set("ceid","KR:ko");
 return feed.href;
}
function parseRows(body,region){
 if(body?.status!=="ok"||!Array.isArray(body.items))throw new Error("RSS 서비스가 검색 결과를 반환하지 않았어요.");
 const rows=[];
 const seen=new Set();
 for(const item of body.items){
  const link=validUrl(item.link)||validUrl(item.guid);
  let title=clean(item.title,240);
  if(!link||!title)continue;
  // Google News RSS article titles often end with a source name.
  let publisher=clean(item.author,70);
  const parts=title.split(/\s+-\s+/);
  if(parts.length>=2){const suffix=parts[parts.length-1];if(suffix.length<75){publisher=publisher||suffix;title=parts.slice(0,-1).join(" - ");}}
  if(seen.has(link))continue;
  seen.add(link);
  const rawDate=clean(item.pubDate,35);
  const date=/^\d{4}-\d{2}-\d{2}/.test(rawDate)?rawDate.slice(0,10):"날짜 원문 확인";
  const detected=region==="전체"?(REGIONS.find(r=>title.includes(r)||title.includes(r.slice(0,-1)))||"충청북도"):region;
  rows.push({region:detected,title,publisher:publisher||"발행기관 원문 확인",published:date,url:link,verified:false,sourceType:"구글 뉴스 검색 결과"});
  if(rows.length===LIVE_MAX)break;
 }
 return rows;
}
async function search({region="전체",keyword="",category="news",signal}={}){
 const feed=rssUrl(region,keyword,category);
 const api=new URL(ENDPOINT);
 api.searchParams.set("rss_url",feed);
 const res=await fetch(api.href,{method:"GET",mode:"cors",credentials:"omit",cache:"no-store",signal,headers:{Accept:"application/json"}});
 if(!res.ok)throw new Error("뉴스 조회 서비스 응답 오류 ("+res.status+")");
 const data=await res.json();
 return {items:parseRows(data,region),feed,service:"rss2json.com",serviceNotice:"공개 RSS 변환 서비스 경유 · 검색 결과가 지연되거나 누락될 수 있음"};
}
window.LocalCheckLiveNews={search,rssUrl,parseRows};
})();