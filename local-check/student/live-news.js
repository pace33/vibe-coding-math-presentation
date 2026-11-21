/*
 * 로컬체크: 지역 뉴스 검색 (학생용, 개인정보 전송 금지)
 * 1) Google News RSS -> AllOrigins CORS 중계 -> RSS XML 해석
 * 2) RSS 중계 장애 시 GDELT DOC 2.0 뉴스검색 대체
 * 두 외부 서비스 모두 실패하면 상위 app.js에서 명시적으로 저장된 뉴스를 표시.
 * 이것은 Google 공식 API가 아닙니다. 실제 브라우저 가용성은 보장되지 않습니다.
 */
(() => {
"use strict";
const MAX=10;
const CACHE_TTL=4*60*1000;
const GOOGLE_PROXY="https://api.allorigins.win/raw?url=";
const GDELT_URL="https://api.gdeltproject.org/api/v2/doc/doc";
const REGIONS=["청주시","충주시","제천시","보은군","옥천군","영동군","증평군","진천군","괴산군","음성군","단양군"];
const cache=new Map();
function clean(raw,length=240){return String(raw??"").replace(/<[^>]*>/g,"").replace(/[\u0000-\u001f]/g," ").trim().slice(0,length);}
function validUrl(raw){try{const u=new URL(String(raw));return u.protocol==="https:"?u.href:"";}catch{return"";}}
function rssUrl(region,keyword,category){
 const place=region==="전체"?"충북":"충북 "+clean(region,30);
 const term=clean(keyword,85)||({business:"기업",local:"축제"}[category]||"");
 const u=new URL("https://news.google.com/rss/search");
 u.searchParams.set("q",[place,term,"when:30d"].filter(Boolean).join(" "));
 u.searchParams.set("hl","ko");u.searchParams.set("gl","KR");u.searchParams.set("ceid","KR:ko");
 return u.href;
}
function detectRegion(title,region){
 if(region!=="전체")return region;
 return REGIONS.find(r=>title.includes(r)||title.includes(r.slice(0,-1)))||"충청북도";
}
function normalizeGoogle(items,region){
 const output=[],seen=new Set();
 for(const item of items){
  const link=validUrl(item.link)||validUrl(item.guid);
  let title=clean(item.title);
  if(!link||!title||seen.has(link))continue;
  let publisher=clean(item.publisher||item.author,90);
  const parts=title.split(/\s+-\s+/);
  if(!publisher&&parts.length>1)publisher=parts[parts.length-1];
  if(parts.length>1&&parts[parts.length-1]===publisher)title=parts.slice(0,-1).join(" - ");
  let date=clean(item.pubDate||item.published,40);
  if(!/^\d{4}-\d{2}-\d{2}/.test(date)){
   const parsed=Date.parse(date);
   date=Number.isFinite(parsed)?new Date(parsed).toISOString().slice(0,10):"날짜 원문 확인";
  }else date=date.slice(0,10);
  seen.add(link);
  output.push({region:detectRegion(title,region),title,publisher:publisher||"원문에서 확인",published:date,url:link,verified:false,sourceType:"구글 뉴스 RSS"});
  if(output.length===MAX)break;
 }
 return output;
}
function parseRSS(xmlString,region){
 if(typeof DOMParser==="undefined")throw Error("RSS 해석 기능을 사용할 수 없어요");
 const document=new DOMParser().parseFromString(xmlString,"application/xml");
 if(document.querySelector("parsererror"))throw Error("RSS 파일이 아닌 응답이 도착했어요");
 const nodes=[...document.querySelectorAll("channel > item")];
 if(!nodes.length){
  if(!document.querySelector("rss,feed"))throw Error("구글 뉴스에서 RSS를 받지 못했어요");
  return [];
 }
 const rows=nodes.slice(0,45).map(node=>{
  const get=name=>node.querySelector(name)?.textContent?.trim()||"";
  return {title:get("title"),link:get("link"),publisher:get("source"),pubDate:get("pubDate")};
 });
 return normalizeGoogle(rows,region);
}
async function fromGoogleRss(feed,region,signal){
 const response=await fetch(GOOGLE_PROXY+encodeURIComponent(feed),{mode:"cors",credentials:"omit",cache:"no-store",signal,headers:{Accept:"application/xml, text/xml, */*"}});
 if(!response.ok)throw Error("구글 뉴스 RSS 중계 오류 "+response.status);
 const xml=await response.text();
 if(xml.length>650000)throw Error("RSS 응답 크기 초과");
 return {items:parseRSS(xml,region),service:"Google News RSS"};
}
function parseGdelt(body,region){
 if(!body||!Array.isArray(body.articles))throw Error("GDELT 뉴스 응답이 올바르지 않아요");
 const seen=new Set(),items=[];
 for(const item of body.articles){
  const link=validUrl(item.url),title=clean(item.title);
  if(!link||!title||seen.has(link))continue;
  const raw=clean(item.seendate||item.date,20);
  let published=/^\d{8}/.test(raw)?raw.slice(0,4)+"-"+raw.slice(4,6)+"-"+raw.slice(6,8):"원문 확인";
  if(/^\d{4}-\d{2}-\d{2}/.test(raw))published=raw.slice(0,10);
  const publisher=clean(item.domain||item.source,80)||"언론사 원문 확인";
  items.push({region:detectRegion(title,region),title,publisher,published,url:link,verified:false,sourceType:"GDELT 뉴스 검색"});
  seen.add(link);
  if(items.length===MAX)break;
 }
 return items;
}
async function fromGdelt(region,keyword,category,signal){
 const place=region==="전체"?"충북":region;
 const typed=clean(keyword,85)||({business:"기업",local:"축제"}[category]||"지역");
 const q=place+" "+typed;
 const u=new URL(GDELT_URL);
 u.searchParams.set("query",q);
 u.searchParams.set("mode","artlist");
 u.searchParams.set("format","json");
 u.searchParams.set("maxrecords","25");
 u.searchParams.set("timespan","1month");
 u.searchParams.set("sort","datedesc");
 const response=await fetch(u.href,{mode:"cors",credentials:"omit",cache:"no-store",signal,headers:{Accept:"application/json"}});
 if(!response.ok)throw Error("대체 뉴스 검색 오류 "+response.status);
 const data=await response.json();
 return {items:parseGdelt(data,region),service:"GDELT 뉴스 검색"};
}
async function search({region="전체",keyword="",category="news",signal}={}){
 const key=JSON.stringify([region,clean(keyword,85),category]);
 const cached=cache.get(key);
 if(cached&&Date.now()-cached.when<CACHE_TTL)return {...cached.value,fromCache:true};
 const feed=rssUrl(region,keyword,category);
 // First try Google RSS via a distinct proxy; a failing public service must not
 // prevent checking a separate news index.
 const attempts=[fromGoogleRss(feed,region,signal),fromGdelt(region,keyword,category,signal)];
 const results=await Promise.allSettled(attempts);
 // Prefer Google News when both providers succeed with articles.
 const chosen=results.find(r=>r.status==="fulfilled"&&r.value.items.length>0);
 if(chosen){const value={...chosen.value,feed};cache.set(key,{when:Date.now(),value});if(cache.size>30)cache.delete(cache.keys().next().value);return value;}
 const empty=results.find(r=>r.status==="fulfilled");
 if(empty)return {...empty.value,feed};
 throw Error("뉴스 검색 서비스 두 곳에 연결하지 못했습니다");
}
window.LocalCheckLiveNews={search,rssUrl,parseRSS,parseGdelt,normalizeGoogle};
})();
