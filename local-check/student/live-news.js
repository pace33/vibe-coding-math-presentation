(() => {
"use strict";
const MAX=10;
const CACHE_TTL=4*60*1000;
const NEWS_API="https://localcheck-news-pace33.lejinku.chatgpt.site/api/news";
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
function parseRSS(xmlString,region,service="Google News RSS"){
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
  let link=get("link");
  if(service==="Bing News RSS"){
   try{const redirect=new URL(link);if(redirect.hostname==="www.bing.com"&&redirect.pathname==="/news/apiclick.aspx")link=redirect.searchParams.get("url")||"";}catch{link="";}
  }
  const publisher=get("source")||[...node.children].find(child=>child.localName==="Source")?.textContent||"";
  return {title:get("title"),link,publisher,pubDate:get("pubDate")};
 });
 return normalizeGoogle(rows,region).map(item=>({...item,sourceType:service==="Bing News RSS"?"Bing 뉴스 RSS":"구글 뉴스 RSS"}));
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
async function search({region="전체",keyword="",category="news",signal}={}){
 const key=JSON.stringify([region,clean(keyword,85),category]);
 const cached=cache.get(key);
 if(cached&&Date.now()-cached.when<CACHE_TTL)return {...cached.value,fromCache:true};
 signal?.throwIfAborted();
 const endpoint=new URL(NEWS_API);
 endpoint.search=new URLSearchParams({region,keyword:clean(keyword,85),category});
 const response=await fetch(endpoint,{credentials:"omit",signal,headers:{Accept:"application/xml"}});
 if(!response.ok)throw Error("뉴스 검색 서버 연결 오류 "+response.status);
 const xml=await response.text();
 if(xml.length>650000)throw Error("RSS 응답 크기 초과");
 const service=response.headers.get("X-News-Provider")||"Google News RSS";
 const value={items:parseRSS(xml,region,service),service,feed:rssUrl(region,keyword,category),fetchedAt:response.headers.get("X-News-Fetched-At")};
 cache.set(key,{when:Date.now(),value});
 if(cache.size>30)cache.delete(cache.keys().next().value);
 return value;
}
window.LocalCheckLiveNews={search,rssUrl,parseRSS,parseGdelt,normalizeGoogle};
})();
