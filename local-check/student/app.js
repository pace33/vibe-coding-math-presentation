(() => {
"use strict";
const $=id=>document.getElementById(id);
const facts=Array.isArray(window.STUDENT_FACTS)?window.STUDENT_FACTS:[];
const regionalTour=window.LOCALCHECK_TOUR_BUSINESSES||{listed:[],upgrades:{}};
const companies=[
 ...(Array.isArray(window.LOCALCHECK_BUSINESSES)?window.LOCALCHECK_BUSINESSES:[]).map(c=>({...c,group:"대표 기업"})),
 ...(Array.isArray(window.LOCALCHECK_ADDITIONAL_BUSINESSES)?window.LOCALCHECK_ADDITIONAL_BUSINESSES:[]).map(c=>({...c,group:"대표 기업"})),
 ...(Array.isArray(window.LOCALCHECK_SMALL_BUSINESSES)?window.LOCALCHECK_SMALL_BUSINESSES:[]),
 ...(Array.isArray(regionalTour.listed)?regionalTour.listed:[])
].map(company=>regionalTour.upgrades?.[company.id]?{...company,tour:regionalTour.upgrades[company.id]}:company);
let businessExpanded=false;
let activeMenu="news";
let businessFilter="all";
const state={news:[],updated:null,story:null,report:null,candidates:[],liveNews:[],liveMode:null,searchIndex:[],indexUpdated:null,evidenceNews:[],evidenceSearching:false,evidenceError:"",selectedEvidence:null,firstReview:null,aiReview:null};
let liveController=null,liveSequence=0;
let keywordTimer=null;
let evidenceController=null,evidenceSequence=0;
let aiController=null,aiSequence=0;
const AI_VERIFY_API='https://localcheck-news-pace33.lejinku.chatgpt.site/api/verify';
const safe=(s,n=1800)=>String(s??"").trim().slice(0,n);
const esc=s=>safe(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const url=s=>{try{const u=new URL(String(s));return ["https:","http:"].includes(u.protocol)?u.href:"";}catch{return ""}};
function place(){return $("region").value==="전체"?"충청북도":"충청북도 "+$("region").value}
function query(kind,area=place(),topic=$("keyword").value){
 const q=[area,safe(topic),kind==="official"?"공지사항 보도자료 site:go.kr":"when:7d"].filter(Boolean).join(" ");
 if(kind==="official"){const x=new URL("https://www.google.com/search");x.searchParams.set("q",q);x.searchParams.set("tbs","qdr:m");return x.href;}
 const x=new URL("https://news.google.com/search");x.searchParams.set("q",q);x.searchParams.set("hl","ko");x.searchParams.set("gl","KR");x.searchParams.set("ceid","KR:ko");return x.href;
}
const EXPLORE_CATEGORIES=window.LOCALCHECK_CATEGORIES||{};
const REGIONAL_BASICS=window.LocalCheckRegionalBasics;
function updateLinks(){
 $("newsSearch").textContent=activeMenu==="news"?"🔎 뉴스 검색":"🔎 "+EXPLORE_CATEGORIES[activeMenu].title+" 뉴스 검색";
}
function chooseMenu(menu){
 if(menu==="board"){window.LocalCheckBoard?.renderBoard?.();show("board");return;}
 if(menu==="explore")menu=EXPLORE_CATEGORIES[activeMenu]?activeMenu:"overview";
 if(menu!=="news"&&!EXPLORE_CATEGORIES[menu])return;
 activeMenu=menu;
 clearLiveResults();
 const isExplore=menu!=="news";
 if(isExplore&&menu!=="issues"&&$("region").value==="전체")$("region").value="음성군";
 $("home").classList.toggle("issues-mode",menu==="issues");
 $("home").classList.toggle("explore-mode",isExplore);
 $("newsSection").hidden=isExplore;
 $("businessSection").hidden=menu!=="business";
 $("exploreTabs").hidden=!isExplore;
 document.querySelectorAll("[data-menu]").forEach(button=>{
  const selected=button.dataset.menu===(isExplore?"explore":"news");
  button.classList.toggle("active",selected);
  button.setAttribute("aria-pressed",String(selected));
 });
 document.querySelectorAll("[data-explore]").forEach(button=>{
  const selected=button.dataset.explore===menu;
  button.classList.toggle("active",selected);
  button.setAttribute("aria-pressed",String(selected));
 });
 $("keyword").value=menu==="issues"?"환경":"";
 $("keyword").placeholder=isExplore?"예: "+EXPLORE_CATEGORIES[menu].prompts[0][2]:"예: 축제, 인구, 학교";
 updateLinks();renderBusinesses();renderNews();renderInquiries();
 if($("home").hidden)show("home");
 if(menu==="issues")searchNewsInside({scroll:false});
}
// 지역 기초정보의 제목·고유 명칭으로 뉴스 탐색어를 만듭니다.
// 학습한 공공자료는 비교 근거이며, 자동으로 뉴스의 진위를 판정하지 않습니다.
function regionalNewsTerm(item,category){
 const title=String(item.title||"");
 if(category==="overview"){
  if(title==="인구")return "인구";
  if(title==="면적")return "면적";
  return "행정구역";
 }
 const name=String(item.value||"").split(/[·,\/]/)[0].trim();
 if(category==="nature")return (name&&!/기온|강수량|날씨/.test(name))?name:"기후";
 if(category==="local")return name||"문화유산";
 if(category==="facilities")return title==="교통"?"버스 교통":title;
 if(category==="business")return "농산물 특산물";
 return EXPLORE_CATEGORIES[category]?.defaultTerm||title||"지역";
}
function searchRegionalNews(term){
 const keyword=safe(term,85)||EXPLORE_CATEGORIES[activeMenu]?.defaultTerm||"지역";
 $("keyword").value=keyword;
 // 지역 선택과 세부 분야를 유지한 채 결과를 바로 아래에 표시합니다.
 searchNewsInside({scroll:true});
}
function renderInquiries(){
 const category=EXPLORE_CATEGORIES[activeMenu],section=$("inquirySection");
 section.hidden=!category;
 const root=$("inquiryList");root.replaceChildren();
 if(!category)return;
 const region=$("region").value;
 const issues=activeMenu==="issues",crops=activeMenu==="business";
 root.classList.toggle("issue-topic-grid",issues);
 root.classList.toggle("crop-only-grid",crops);
 root.classList.toggle("overview-grid",activeMenu==="overview");
 const guide=$("inquiryGuide");
 if(issues){
  $("inquiryTitle").textContent=(region==="전체"?"충청북도":region)+" · 지역문제";
  guide.hidden=false;guide.textContent="주제를 고르면 관련 뉴스를 검색해요.";
  const topics=[["🌱 환경","환경"],["🚦 교통·안전","교통 안전"],["🏫 교육·복지","교육 복지"],["🏘️ 지역 생활","지역 현안"]];
  root.innerHTML=topics.map(([name,term])=>
   '<button class="issue-topic '+($("keyword").value===term?'active':'')+'" type="button" data-issue-term="'+esc(term)+'">'+
   '<strong>'+esc(name)+'</strong></button>').join("");
  return;
 }
 if(region==="전체"){
  $("inquiryTitle").textContent="지역을 선택하세요";
  guide.hidden=true;
  root.textContent="위에서 시·군을 선택해 주세요.";
  return;
 }
 $("inquiryTitle").textContent=crops?region+" · 농산물·특산물":region+" · "+category.title;
 guide.hidden=activeMenu!=="local";
 guide.textContent=activeMenu==="local"?"지역 축제는 해마다 날짜와 프로그램이 달라요. 개최 여부는 공식 안내나 관련 뉴스로 확인하세요.":"";
 const available=REGIONAL_BASICS?.cards(region,activeMenu,companies,facts)||[];
 const basics=crops?available.filter(x=>x.title==="농산물과 특산물"):available;
 for(const [index,item] of basics.entries()){
  const card=document.createElement("article");card.className="inquiry-card";
  if(item.event)card.classList.add("festival-card");
  const allLinks=[{label:item.primaryLabel||"자료 확인 ↗",href:item.href},...(item.more||[])].filter(x=>url(x.href));
  const primary=allLinks[0],other=allLinks.slice(1);
  const searchInputId="regional-google-"+activeMenu+"-"+index;
  const extraLinks=other.length?'<div class="inquiry-actions">'+other.map(link=>
    '<a href="'+esc(url(link.href))+'" target="_blank" rel="noopener noreferrer">'+esc(link.label)+'</a>').join("")+'</div>':"";
  const searchForm=item.searchQuery?
   '<form action="https://www.google.com/search" method="get" target="_blank" rel="noopener noreferrer">'+
   '<label for="'+esc(searchInputId)+'">검색어</label>'+
   '<div class="regional-search-line"><input id="'+esc(searchInputId)+'" name="q" type="search" maxlength="180" value="'+esc(item.searchQuery)+'" required>'+
   '<button type="submit">검색 ↗</button></div></form>':"";
  const extras=(extraLinks||searchForm)?
   '<details class="regional-google-search"><summary>추가 자료·검색</summary>'+extraLinks+searchForm+'</details>':"";
  const mainLink=primary?
   '<a class="basic-primary-link" href="'+esc(url(primary.href))+'" target="_blank" rel="noopener noreferrer">'+esc(primary.label)+'</a>':"";
  const newsTerm=item.newsTerm||regionalNewsTerm(item,activeMenu);
  const checkNews='<button class="regional-card-news" type="button" data-card-news="'+esc(newsTerm)+'">📰 이 정보 관련 뉴스 검증</button>';
  const visit=item.visit;
  const visitMode=visit?.status==="reserve"?"예약·신청 안내":visit?.status==="school"?"학교 단체 안내":visit?.status==="visit"?"방문·관람 안내":"사전 협의 필요";
  const visitTag=visit?'<span class="regional-visit-tag">🏫 견학·체험 · '+esc(visitMode)+'</span>':"";
  const visitNote=visit?.notes?'<div class="regional-visit-note">'+esc(visit.notes)+'</div>':"";
  const visitLink=visit?.url&&url(visit.url)?'<a class="regional-visit-link" href="'+esc(url(visit.url))+'" target="_blank" rel="noopener noreferrer">'+esc(visitMode)+' ↗</a>':"";
  card.innerHTML='<div class="basic-card-title"><span aria-hidden="true">'+esc(item.icon||"📚")+'</span><h3>'+esc(item.title)+'</h3></div>'+
   '<strong class="basic-card-value">'+esc(item.value)+'</strong>'+(item.summary?'<p>'+esc(item.summary)+'</p>':"")+
   visitTag+visitNote+
   (item.note?'<span class="festival-note">'+esc(item.note)+'</span>':"")+
   '<div class="basic-card-source">'+esc(item.linkType==="search"?"검색 결과에서 공식 자료 확인":item.source||"원문 확인 필요")+'</div>'+
   '<div class="basic-card-actions">'+(visit?visitLink:mainLink)+checkNews+extras+'</div>';
  root.appendChild(card);
 }
 if(!basics.length)root.textContent="준비된 자료가 없어요.";
}
function show(screen){
 for(const id of ["home","verify","result","board","shared"])$(id).hidden=id!==screen;
 window.scrollTo({top:0,behavior:"smooth"});
}

function clearLiveResults(){
 if(keywordTimer!==null){clearTimeout(keywordTimer);keywordTimer=null;}
 liveSequence++;
 if(liveController){liveController.abort();liveController=null;}
 state.liveNews=[];state.liveMode=null;
 $("liveResults").hidden=true;
 $("newsSection").hidden=activeMenu!=="news";
 $("newsSearch").disabled=false;
 $("retryNews").hidden=true;
}
function fallbackRows(region,keyword){
 const search=String(keyword||"").trim().toLowerCase();
 const tokens=search.split(/\s+/).filter(w=>w.length>=2&&!["충북","충청북도","지역","우리","고장","뉴스","기사","회사"].includes(w));
 const records=[...state.searchIndex,...state.news];
 const seen=new Set();
 const found=records.filter(x=>{
  if(region!=="전체"&&x.region!==region)return false;
  if(!url(x.url))return false;
  if(seen.has(x.url))return false;
  const text=[x.title,x.publisher,x.topicGroup].join(" ").toLowerCase();
  if(tokens.length&&!tokens.some(w=>text.includes(w)))return false;
  seen.add(x.url);
  return true;
 });
 return found.sort((a,b)=>String(b.published||"").localeCompare(String(a.published||""))).slice(0,10);
}
async function loadSearchIndex(){
 try{
  const u=new URL("search-index.json",location.href);
  u.searchParams.set("v",new Date().toISOString().slice(0,10));
  const response=await fetch(u.href,{cache:"no-store"});
  if(!response.ok)throw Error("index unavailable");
  const parsed=await response.json();
  if(!Array.isArray(parsed.items))return;
  state.searchIndex=parsed.items.filter(x=>x&&url(x.url)&&x.title&&x.region).slice(0,450);
  state.indexUpdated=parsed.updatedAt||null;
 }catch{state.searchIndex=[];state.indexUpdated=null;}
}
function newsDate(value){
 const v=String(value||"").trim();
 return /^\d{4}-\d{2}-\d{2}$/.test(v)?v:"";
}
function newsExcerpt(item,keyword){
 const raw=String(item.snippet||item.description||item.summary||"").replace(/\s+/g," ").trim();
 if(!raw||raw===item.title)return "";
 const tokens=String(keyword||"").toLowerCase().split(/\s+/).filter(x=>x.length>=2&&!["충북","충청북도","지역","뉴스"].includes(x));
 const lower=raw.toLowerCase();
 const found=tokens.map(t=>lower.indexOf(t)).find(i=>i>=0);
 const start=found===undefined?0:Math.max(0,found-45);
 const limit=70;
 let preview=raw.slice(start,start+limit);
 if(raw.length>start+limit){
  const wordEnd=preview.lastIndexOf(" ");
  if(wordEnd>Math.floor(limit*.6))preview=preview.slice(0,wordEnd);
 }
 return (start?"…":"")+preview.trim()+(raw.length>start+limit?"…":"");
}
function renderLiveResults(items,mode){
 const ordered=[...items].sort((a,b)=>newsDate(b.published).localeCompare(newsDate(a.published)));
 state.liveNews=ordered;
 state.liveMode=mode;
 const box=$("liveNewsList");box.replaceChildren();
 $("liveCount").textContent=ordered.length+"건 · 최신 날짜순";
 if(!ordered.length){
  box.innerHTML='<div class="news-empty">조건에 맞는 기사를 찾지 못했어요. 다른 검색어를 입력하거나 검색 범위를 바꿔 보세요.</div>';
  return;
 }
 const searchTerm=$("keyword")?.value||"";
 for(let i=0;i<ordered.length;i++){
  const x=ordered[i],card=document.createElement("article");
  card.className="news-card";
  const valid=url(x.url);if(!valid)continue;
  const excerpt=newsExcerpt(x,searchTerm);
  card.innerHTML='<div class="meta"><span class="tag">'+esc(x.region)+" · "+esc(x.sourceType||"뉴스")+'</span></div>'+
   '<h3>'+esc(x.title)+'</h3>'+
   '<div class="news-source-date"><div class="news-meta-line"><span class="news-meta-label">출처:</span><span class="news-meta-value">'+esc(x.publisher||"발행기관 확인")+'</span></div>'+
   '<div class="news-meta-line"><span class="news-meta-label">날짜:</span><span class="news-meta-value">'+esc(x.published||"날짜 확인")+'</span></div></div>'+
   (excerpt?'<p class="news-excerpt">'+esc(excerpt)+'</p>':'<p class="news-excerpt news-excerpt-empty">기사 요약이 제공되지 않았어요. 원문에서 내용을 확인하세요.</p>')+
   '<div class="news-actions"><a href="'+esc(valid)+'" target="_blank" rel="noopener noreferrer">원문 읽기 ↗</a>'+
   '<button type="button" data-live-news="'+i+'">검증하기 →</button></div>';
  box.appendChild(card);
 }
}
function fromLiveNews(index){
 const item=state.liveNews[index];if(!item)return;
 chooseStory({title:item.title,url:item.url,publisher:item.publisher,date:item.published,region:item.region,topic:item.title});
}
function googleNewsUrl(region,keyword,menu){
 const area=region==="전체"?"충청북도":"충북 "+region;
 const type=EXPLORE_CATEGORIES[menu]?.defaultTerm||"";
 const q=[area,keyword||type,"when:30d"].filter(Boolean).join(" ");
 const u=new URL("https://news.google.com/search");
 u.searchParams.set("q",q);u.searchParams.set("hl","ko");
 u.searchParams.set("gl","KR");u.searchParams.set("ceid","KR:ko");
 return u.href;
}
// 뉴스 서버는 구글·빙 RSS 중 먼저 완료된 제공처를 반환합니다.
// 링크도 실제 응답의 제공처에 맞추고, 검색 전·연결 오류에는 둘 다 표시합니다.
function bingNewsUrl(region,keyword){
 const area=region==="전체"?"충북":region;
 const u=new URL("https://www.bing.com/news/search");
 u.searchParams.set("q",[area,keyword].filter(Boolean).join(" "));
 u.searchParams.set("setlang","ko");
 u.searchParams.set("cc","kr");
 return u.href;
}
function updateNewsSourceLinks(region,keyword,menu,service=""){
 const google=$("googleNewsFallback"),bing=$("bingNewsFallback");
 google.href=googleNewsUrl(region,keyword,menu);
 bing.href=bingNewsUrl(region,keyword);
 google.textContent="구글 뉴스에서 더 찾기 ↗";
 bing.textContent="빙 뉴스에서 더 찾기 ↗";
 google.hidden=service==="Bing News RSS";
 bing.hidden=service==="Google News RSS";
}
async function searchNewsInside({scroll=true}={}){
 if(keywordTimer!==null){clearTimeout(keywordTimer);keywordTimer=null;}
 const region=$("region").value;
 const keyword=safe($("keyword").value,90);
 const category=activeMenu;
 const searchTerm=keyword||(EXPLORE_CATEGORIES[category]?.defaultTerm||"");
 const rssCategory=category==="business"?"business":category==="local"?"local":"news";
 const seq=++liveSequence;
 if(liveController)liveController.abort();
 const controller=new AbortController();
 liveController=controller;
 const timer=setTimeout(()=>controller.abort(),12000);
 const searchButton=$("newsSearch");
 searchButton.disabled=true;
 searchButton.textContent="뉴스 찾는 중…";
 $("liveResults").hidden=false;
 if(category==="news")$("newsSection").hidden=true;
 $("liveHeading").textContent=keyword?"‘"+keyword+"’ 검색 결과":(region==="전체"?"충북":region)+" "+(EXPLORE_CATEGORIES[category]?.title||"뉴스")+" 검색 결과";
 // Automatic typing searches update in place; explicit button searches move to the result.
 if(scroll)$("liveResults").scrollIntoView({behavior:"smooth",block:"start"});
 $("liveNewsList").replaceChildren();
 $("liveCount").textContent="검색 중";
 $("liveStatus").textContent=keyword?"‘"+keyword+"’ 관련 뉴스를 찾고 있어요.":"해당 지역의 뉴스를 찾고 있어요.";
 $("liveExplanation").textContent="검색어와 관련된 기사를 원문에서 읽고 확인하세요.";
 updateNewsSourceLinks(region,searchTerm,category);
 $("retryNews").hidden=true;
 try{
  if(!window.LocalCheckLiveNews)throw new Error("RSS 검색 연결을 준비하지 못했어요.");
  const result=await window.LocalCheckLiveNews.search({region,keyword:searchTerm,category:rssCategory,signal:controller.signal});
  if(seq!==liveSequence)return;
  renderLiveResults(result.items,"live");
  updateNewsSourceLinks(region,searchTerm,category,result.service);
  if(result.items.length){
   const provider=result.service==="Google News RSS"?"구글 뉴스 RSS":result.service==="Bing News RSS"?"빙 뉴스 RSS":"제공처 미확인 뉴스 RSS";
   $("liveStatus").textContent=provider+"에서 찾은 기사입니다. 원문에서 날짜와 사실 여부를 확인하세요.";
  }else{
   const stored=fallbackRows(region,searchTerm);
   if(stored.length){
    renderLiveResults(stored,"saved");
    $("liveStatus").textContent="새 기사 검색 결과가 없어 저장된 자료 "+stored.length+"건을 표시합니다. 최신 검색 결과는 아닙니다. 자료 날짜: "+(state.indexUpdated||state.updated||"확인 필요");
   }else{
    $("liveStatus").textContent="새 기사를 찾지 못했어요. 아래 외부 뉴스 검색도 이용해 보세요.";
   }
  }
 }catch(err){
  if(seq!==liveSequence)return;
  const fallback=fallbackRows(region,searchTerm);
  renderLiveResults(fallback,"saved");
  $("liveStatus").textContent=fallback.length?
   "뉴스 검색 서버에 연결하지 못해 저장된 관련 기사 "+fallback.length+"건을 표시합니다. 실시간 검색 결과가 아닙니다. 저장 날짜: "+(state.indexUpdated||state.updated||"확인 필요"):
   "뉴스 검색에 연결하지 못했고 저장된 자료에도 일치하는 기사가 없습니다. 외부 뉴스 검색을 이용해 주세요.";
  $("retryNews").hidden=false;
  if(!fallback.length){
   $("liveCount").textContent="연결 실패";
   $("liveNewsList").textContent="검색을 완료하지 못했어요. 잠시 후 다시 검색해 주세요.";
  }
 }finally{
  clearTimeout(timer);
  if(seq===liveSequence){
   searchButton.disabled=false;
   updateLinks();
   liveController=null;
  }
 }
}
function onKeywordInput(){
 clearLiveResults();
 renderBusinesses();
 const keyword=safe($("keyword").value,85);
 if(keyword.length<2)return;
 // Wait for a short typing pause to avoid unnecessary RSS requests while composing Korean.
 keywordTimer=setTimeout(()=>searchNewsInside({scroll:false}),650);
}
function onRegionChange(){
 const keyword=safe($("keyword").value,85);
 businessExpanded=false;
 refresh();
 if(activeMenu==="issues"){searchNewsInside({scroll:false});return;}
 if(keyword.length>=2)keywordTimer=setTimeout(()=>searchNewsInside({scroll:false}),250);
}
function renderNews(){
 const area=$("region").value;
 // Recent headlines stay visible while the typed keyword is searched separately below.
 const found=state.news.filter(x=>area==="전체"||x.region===area).slice(0,4);
 const root=$("newsList");
 root.replaceChildren();
 const date=state.updated||"갱신 여부 확인 필요";
 $("updatedAt").textContent="저장 기준일: "+date;
 if(!found.length){
  root.innerHTML='<div class="news-empty">이 지역에 저장된 뉴스가 없어요. 위에서 새 뉴스를 검색해 보세요.</div>';
  return;
 }
 for(const item of found){
  const card=document.createElement("article");card.className="news-card";
  card.innerHTML='<div class="meta"><span class="tag">'+esc(item.region)+' · '+esc(item.sourceType||"자료")+'</span></div>'+
   '<h3>'+esc(item.title)+'</h3>'+
   '<div class="news-source-date"><div class="news-meta-line"><span class="news-meta-label">출처:</span><span class="news-meta-value">'+esc(item.publisher||"발행기관 확인 필요")+'</span></div>'+
   '<div class="news-meta-line"><span class="news-meta-label">날짜:</span><span class="news-meta-value">'+esc(item.published||"날짜 확인 필요")+'</span></div></div>'+
   '<div class="news-actions"><a href="'+esc(url(item.url))+'" target="_blank" rel="noopener noreferrer">원문 읽기 ↗</a><button type="button" data-news="'+state.news.indexOf(item)+'">검증하기 →</button></div>';
  root.appendChild(card);
 }
}

function renderBusinesses(){
 const area=$("region").value;
 $("businessTitle").textContent=(area==="전체"?"충북":area)+" 기업";
 const keyword=safe($("keyword").value,150).toLowerCase();
 const tourTab=document.querySelector('[data-business-filter="tour"]');
 const toursInRegion=companies.filter(c=>c.tour&&(area==="전체"||c.region===area));
 if(tourTab)tourTab.textContent="🏫 견학·체험 ("+toursInRegion.length+")";
 $("tourNotice").hidden=businessFilter!=="tour";
 const items=companies.filter(c=>(area==="전체"||c.region===area)&&
    (businessFilter==="all"||
     (businessFilter==="small"&&c.group!=="대표 기업"&&c.group!=="지역 체험기업")||
     (businessFilter==="featured"&&c.group==="대표 기업")||
     (businessFilter==="tour"&&!!c.tour))&&
    (!keyword||[c.region,c.name,c.produces,c.type,c.summary,c.group,c.tour?.program].join(" ").toLowerCase().includes(keyword)))
    .sort((a,b)=>Number(!!b.tour)-Number(!!a.tour));
 const showAll=businessFilter==="tour";
 const visible=showAll||businessExpanded?items:items.slice(0,6);
 const list=$("businessList");list.replaceChildren();
 $("businessCount").textContent=items.length+(showAll?"개 견학·체험처":"개 사업장·사례");
 const more=$("moreBusinesses");
 more.hidden=showAll||items.length<=6;
 more.textContent=businessExpanded?"접기 ↑":"기업 "+(items.length-visible.length)+"곳 더 보기 ↓";
 if(!visible.length){
  const empty=document.createElement("div");empty.className="news-empty";
  if(showAll){
   const message=document.createElement("p");
   message.textContent="현재 이 지역에서 공개된 기업 견학 안내를 찾지 못했어요. 학교 단체 방문이 가능한지는 업체별로 확인해야 해요.";
   const search=document.createElement("a");
   const u=new URL("https://www.google.com/search");
   u.searchParams.set("q",(area==="전체"?"충청북도":area)+" 학생 단체 공장견학 기업 체험 예약");
   search.href=u.href;search.target="_blank";search.rel="noopener noreferrer";
   search.textContent="기업 견학 자료 더 찾아보기 ↗";search.className="quiet-link";
   empty.append(message,search);
  }else empty.textContent="이 조건에 맞는 기업이 없어요. 지역이나 필터를 바꿔 보세요.";
  list.appendChild(empty);return;
 }
 for(const c of visible){
  const card=document.createElement("article");card.className="business-card";
  const tour=c.tour;
  const tag=tour?'<span class="business-tour-tag">'+(tour.status==="online"?"🏫 견학 신청 안내":tour.status==="school"?"🏫 학교 연계 체험":"🏫 사전 문의 견학")+'</span>':"";
  const info=tour&&showAll?
   '<div class="business-tour-info"><strong>체험</strong> '+esc(tour.program)+
   '<p><strong>대상·방법</strong> '+esc(tour.who)+'</p>'+
   (tour.contact?'<p><strong>문의</strong> '+esc(tour.contact)+'</p>':"")+
   (tour.notes?'<p class="tour-caution">'+esc(tour.notes)+'</p>':"")+'</div>':"";
  const link=tour&&url(tour.url)?
    '<a class="business-tour-link" href="'+esc(url(tour.url))+'" target="_blank" rel="noopener noreferrer">'+
     (tour.status==="online"?"견학 안내·신청 ↗":"견학·체험 안내 ↗")+'</a>':"";
  card.innerHTML='<div class="business-meta"><span class="business-emoji" aria-hidden="true">'+esc(c.emoji)+'</span><span class="business-tag">'+esc(c.type)+'</span></div>'+
   '<h3>'+esc(c.name)+'</h3><div class="business-product">'+esc(c.produces)+'</div>'+tag+info+
   '<div class="business-buttons">'+link+'<button type="button" data-business="'+esc(c.id)+'">자료 검증 →</button>'+
   '<button type="button" class="business-inline-news" data-business-news="'+esc(c.id)+'">관련 뉴스</button></div>';
  list.appendChild(card);
 }
}
function fromBusiness(id){
 const business=companies.find(c=>c.id===id);if(!business)return;
 chooseStory({title:"기업 탐구: "+business.name,
  url:business.source.url,publisher:business.source.title,
  date:business.source.date||"공개자료",region:business.region,
  topic:business.name,suggested:business.secondary?.url||"",
  kind:"business",inquiry:business.inquiry});
}
function refresh(){clearLiveResults();updateLinks();renderNews();renderBusinesses();renderInquiries();}
async function loadNews(){
 const root=$("newsList");
 root.innerHTML='<div class="news-empty">최근 지역 자료를 불러오고 있어요.</div>';
 try{
  const path=new URL("latest.json",location.href);
  path.searchParams.set("v",new Date().toISOString().slice(0,13));
  const response=await fetch(path.href,{cache:"no-store"});
  if(!response.ok)throw Error("자료 요청 실패");
  const j=await response.json();
  if(!Array.isArray(j.items))throw Error("자료 형식 오류");
  state.news=j.items.filter(x=>x&&url(x.url)&&x.title&&x.region).slice(0,90);
  state.updated=j.updatedAt||null;
  renderNews();
 }catch{
  state.news=[];state.updated=null;
  root.innerHTML='<div class="news-empty">저장된 기사 목록을 가져오지 못했어요. 위 버튼을 누르면 실제 최신 뉴스를 검색할 수 있어요.</div>';
 }
}
function setLink(el,link){if(link){el.href=link;el.hidden=false;}else{el.removeAttribute("href");el.hidden=true;}}

const allRegionNames=["청주시","충주시","제천시","보은군","옥천군","영동군","증평군","진천군","괴산군","음성군","단양군"];
const stopWords=new Set(["충북","충청북도","관련","지역","우리","고장","오늘","내일","올해","뉴스","기사","언론","공식","보도","공개","문화","행사","진행","방문객","관광객","지난해","최근","확인","참가","안내","사업","지원","모집","전국","시민","주민","주제","대한","소식","한다","에서","지난","위해","인기"]);
function compact(s){return String(s||"").replace(/\s+/g,"").replace(/[^가-힣a-zA-Z0-9]/g,"").toLowerCase();}
function topicTerms(s,region){
 const noise=new Set([...stopWords,region,...allRegionNames]);
 return [...new Set((String(s||"").toLowerCase().match(/[가-힣a-z0-9]+/g)||[])
   .filter(w=>w.length>=3&&!noise.has(w)&&!w.match(/^\d+$/)))];
}
function matchingCurated(story){
 const text=compact(story.title+" "+story.topic);
 return facts.filter(t=>{
   if(t.region!==story.region)return false;
   const exact=compact(t.topic);
   if(exact.length>=4&&text.includes(exact))return true;
   // Population information is suitable for comparing statistics only.
   if(t.category==="인구·생활"&&/인구|주민등록|고령화/.test(story.title))return true;
   return false;
 }).slice(0,2);
}
function matchingNews(story){
 const terms=topicTerms(story.title,story.region);
 const current=compact(story.title);
 const seen=new Set();
 const news=[...state.evidenceNews,...state.news];
 return news.filter(n=>{
   if(n.url===story.url||n.region!==story.region||!url(n.url))return false;
   const newsTitle=compact(n.title);
   if(newsTitle===current||seen.has(n.url))return false;
   seen.add(n.url);
   const shared=terms.filter(w=>newsTitle.includes(compact(w)));
   return shared.some(w=>w.length>=4)||shared.length>=2;
 }).sort((a,b)=>(a.publisher===story.publisher?1:0)-(b.publisher===story.publisher?1:0)).slice(0,3);
}
function matchingBusinesses(story){
 const text=compact(story.title+" "+story.topic);
 return companies.filter(c=>{
  if(c.region!==story.region)return false;
  const core=c.name.replace(/^(?:청주시|청주|충주시|충주|제천시|제천|진천군|진천|괴산군|괴산|음성군|음성|단양군|단양)\s+/,"").split(/\s+/)[0];
  return core.length>=3&&text.includes(compact(core));
 }).slice(0,2);
}
function getCandidateList(story){
 const sources=[];
 if(story.suggested)sources.push({title:"관련 공개자료",type:"공식·참고 자료",source:"대표 사례 자료집",url:story.suggested,date:"원문 확인 필요"});
 for(const t of matchingCurated(story)){
  for(const entry of t.sources.slice(0,2)){
   if(sources.some(x=>x.url===entry.url)||entry.url===story.url)continue;
   sources.push({title:entry.name,type:entry.type||"지역 관련자료",source:"대표 사례: "+t.topic,url:entry.url,date:entry.date||"원문 확인"});
  }
 }
 for(const b of matchingBusinesses(story)){
  for(const entry of [b.source,b.secondary]){
   if(!entry||entry.url===story.url||sources.some(x=>x.url===entry.url))continue;
   sources.push({title:entry.title,type:"기업·사업장 공개자료",source:b.name,url:entry.url,date:entry.date||"원문 확인"});
  }
 }
 const others=[];
 for(const n of matchingNews(story)){
  if(sources.some(x=>x.url===n.url))continue;
  others.push({title:n.title,type:n.publisher===story.publisher?"비슷한 주제의 기사":"다른 언론사 기사",
   source:n.publisher||"발행기관 확인 필요",url:n.url,date:n.published||"발표일 확인"});
 }
 // Leave room for independently published articles even when archived sources are plentiful.
 return [...sources.filter(c=>url(c.url)).slice(0,2),...others.filter(c=>url(c.url)).slice(0,2)].slice(0,4);
}
function renderEvidenceCandidates(){
 const container=$("evidenceCandidates");
 container.replaceChildren();
 state.candidates=getCandidateList(state.story);
 const status=$("evidenceStatus");
 const selected=state.selectedEvidence;
 if(state.evidenceSearching){
  status.textContent="관련 기사를 자동 검색하고 있어요. 먼저 보이는 자료를 읽어도 좋아요.";
 }else if(state.evidenceError){
  status.textContent=state.candidates.length?
   "새 기사를 찾지 못했어요. 아래 저장된 자료로 비교할 수 있어요.":
   "새 기사 검색이 연결되지 않았어요. '자료를 더 찾아볼래요'에서 직접 확인할 수 있어요.";
 }else{
  status.textContent=state.candidates.length?
   "관련 자료 "+state.candidates.length+"개를 찾았어요. 제목만으로 판단하지 말고 원문을 읽어 보세요.":
   "직접 연결되는 근거가 없어요. '자료를 더 찾아볼래요'에서 찾을 수 있어요.";
 }
 if(selected)status.textContent+=" 선택한 자료: "+selected.title;
 if(!state.candidates.length){
  const empty=document.createElement("p");empty.className="candidates-empty";
  empty.textContent=state.evidenceSearching?"관련 자료를 찾고 있어요…":"지금은 추천할 자료가 없어요. 모르겠어요를 선택해도 괜찮아요.";
  container.appendChild(empty);return;
 }
 const cards=document.createElement("div");cards.className="candidate-grid";
 state.candidates.forEach((candidate,i)=>{
  const card=document.createElement("article");card.className="candidate-card";
  const chosen=!!selected&&selected.url===candidate.url;
  if(chosen)card.classList.add("candidate-selected");
  const tag=document.createElement("span");tag.className="candidate-kind";tag.textContent=candidate.type;
  const title=document.createElement("strong");title.textContent=candidate.title;
  const meta=document.createElement("p");meta.textContent=candidate.source+" · "+candidate.date;
  const actions=document.createElement("div");actions.className="candidate-actions";
  const link=document.createElement("a");link.textContent="원문 읽기 ↗";link.href=candidate.url;link.target="_blank";link.rel="noopener noreferrer";
  const button=document.createElement("button");button.type="button";button.textContent=chosen?"✓ 선택한 근거":"이 자료로 비교하기";
  button.dataset.chooseCandidate=String(i);button.setAttribute("aria-pressed",String(chosen));
  actions.append(link,button);card.append(tag,title,meta,actions);cards.appendChild(card);
 });
 container.appendChild(cards);
}
function selectCandidate(index){
 if(state.firstReview)return;
 const candidate=state.candidates[index];if(!candidate)return;
 state.selectedEvidence=candidate;
 $("officialUrl").value=candidate.url;
 renderEvidenceCandidates();
 $("formMessage").textContent="비교할 자료를 골랐어요! 원문을 읽고 나의 판단을 선택해 보세요.";
}
function evidenceKeyword(story){
 if(story.kind==="business"){
  const company=matchingBusinesses(story)[0];
  if(company)return company.name.replace(/\s+(?:본사·공장|청주사업장|진천공장|제천공장|보은공장|옥천공장|상우공장)$/,"").trim().slice(0,55);
 }
 return topicTerms(story.title,story.region).slice(0,2).join(" ").slice(0,55)||safe(story.title,45);
}
async function searchEvidence(){
 if(!state.story)return;
 const story=state.story,sequence=++evidenceSequence;
 if(evidenceController)evidenceController.abort();
 const controller=new AbortController();evidenceController=controller;
 state.evidenceSearching=true;state.evidenceError="";state.evidenceNews=[];
 renderEvidenceCandidates();
 const timeout=setTimeout(()=>controller.abort(),10000);
 $("retryEvidence").disabled=true;
 try{
  if(!window.LocalCheckLiveNews)throw new Error("뉴스 검색 기능 없음");
  const keyword=evidenceKeyword(story);
  const result=await window.LocalCheckLiveNews.search({
    region:story.region==="충청북도"?"전체":story.region,
    keyword,category:story.kind==="business"?"business":"news",
    signal:controller.signal
  });
  if(sequence!==evidenceSequence)return;
  state.evidenceNews=result.items||[];
 }catch(err){
  if(sequence!==evidenceSequence)return;
  state.evidenceError="새 검색에 연결하지 못함";
 }finally{
  clearTimeout(timeout);
  if(sequence===evidenceSequence){
   evidenceController=null;state.evidenceSearching=false;
   $("retryEvidence").disabled=false;renderEvidenceCandidates();
  }
 }
}

function editFirstJudgement(){
 aiSequence++;
 if(aiController){aiController.abort();aiController=null;}
 state.firstReview=null;
 state.aiReview=null;
 document.querySelectorAll('input[name="verdict"]').forEach(x=>x.disabled=false);
 for(const id of ["reason","articleFinding","officialFinding","officialUrl"])$(id).readOnly=false;
 $("retryEvidence").disabled=false;
 $("askAi").disabled=false;
 $("askAi").textContent="🤖 내 판단을 기록하고 AI 근거 검토하기";
 $("editFirst").hidden=true;
 $("aiReviewMessage").textContent="AI 검토는 선택 사항이에요. 직접 확인한 내용으로도 탐정 카드를 완성할 수 있어요.";
 $("aiReviewResult").hidden=true;
 $("aiReviewLabel").textContent="";
 $("aiReviewSummary").textContent="";
 $("aiReviewComparison").textContent="";
 $("aiReviewSources").replaceChildren();
 $("aiReviewCaution").textContent="";
 $("finalStage").hidden=true;
 $("finalReason").value="";
 document.querySelectorAll('input[name="finalVerdict"]').forEach(x=>x.checked=false);
 $("finish").disabled=false;
 $("formMessage").textContent="";
}
function firstJudgement(){
 if(!state.story)return null;
 const verdict=document.querySelector('input[name="verdict"]:checked')?.value||"아직 모르겠어요";
 const reason=safe($("reason").value,220);
 const compareUrl=url($("officialUrl").value);
 if(reason.length<3){
  $("formMessage").textContent="탐정 카드를 완성하려면 내 판단의 이유를 적어 주세요.";
  $("reason").focus();return null;
 }
 if(verdict!=="아직 모르겠어요"&&!compareUrl){
  $("formMessage").textContent="내용이 같거나 다르다고 판단했다면 비교한 자료 링크를 먼저 골라 주세요. 찾지 못하면 '더 알아볼래요'를 선택해도 돼요.";
  $("evidenceCandidates").scrollIntoView({block:"center",behavior:"smooth"});return null;
 }
 return {
  verdict,reason,govUrl:compareUrl,
  newsFact:safe($("articleFinding").value,500)||"검증할 뉴스 제목: "+safe(state.story.title,200),
  govFact:safe($("officialFinding").value,500)||(state.selectedEvidence?"비교자료 제목: "+safe(state.selectedEvidence.title,190):"비교할 근거를 아직 적지 않았어요.")
 };
}
function showAIReviewResult(review){
 const names={match:"찾은 근거와 일부 내용이 일치해요",conflict:"찾은 근거와 다른 내용이 있어요",insufficient:"확인할 근거가 부족해요",unavailable:"AI 검토에 연결하지 못했어요"};
 const el=$("aiReviewResult");
 el.hidden=false;
 el.dataset.status=review.status;
 $("aiReviewLabel").textContent=names[review.status]||names.insufficient;
 $("aiReviewSummary").textContent=review.summary||"AI가 확인한 내용을 안내하지 못했어요.";
 $("aiReviewComparison").textContent=review.comparison||"";
 $("aiReviewCaution").textContent=review.caution||"AI가 제시한 자료도 원문에서 직접 확인하세요.";
 const list=$("aiReviewSources");list.replaceChildren();
 if(review.sources?.length){
  const heading=document.createElement("strong");heading.textContent="AI가 참고한 자료 (원문 확인 필요)";list.appendChild(heading);
  for(const src of review.sources.slice(0,3)){
   const href=url(src.url);
   if(!href)continue;
   const a=document.createElement("a");a.href=href;a.target="_blank";a.rel="noopener noreferrer";
   a.textContent=(safe(src.title,105)||"근거 자료")+" ↗";
   list.appendChild(a);
  }
 }else{
  const p=document.createElement("p");p.textContent="직접 확인할 수 있는 근거 링크가 제공되지 않았어요.";list.appendChild(p);
 }
 const final=document.querySelector('input[name="finalVerdict"][value="'+state.firstReview.verdict+'"]');
 if(final)final.checked=true;
 $("finalStage").hidden=false;
 $("finish").disabled=false;
 $("editFirst").hidden=false;
}
async function askAIEvidence(){
 if(!state.story)return;
 if(!state.firstReview){
  const first=firstJudgement();
  if(!first)return;
  state.firstReview=first;
  document.querySelectorAll('input[name="verdict"]').forEach(x=>x.disabled=true);
  for(const id of ["reason","articleFinding","officialFinding","officialUrl"])$(id).readOnly=true;
  $("retryEvidence").disabled=true;
 }
 const current=++aiSequence;
 if(aiController)aiController.abort();
 const controller=new AbortController();aiController=controller;
 $("askAi").disabled=true;
 $("editFirst").hidden=false;
 $("aiReviewResult").hidden=true;
 $("finalStage").hidden=true;
 // AI 응답을 기다리지 않고도 학생 판단으로 카드를 완성할 수 있습니다.
 $("finish").disabled=false;
 $("formMessage").textContent="";
 $("aiReviewMessage").textContent="AI가 공개된 근거 자료를 찾고 있어요. 원문 확인 결과가 없으면 '근거 부족'으로 안내합니다.";
 const wait=setTimeout(()=>controller.abort(),45000);
 try{
  const first=state.firstReview,article=state.story;
  const response=await fetch(AI_VERIFY_API,{
   method:"POST",mode:"cors",
   headers:{"Content-Type":"application/json"},
   signal:controller.signal,
   body:JSON.stringify({
    region:safe(article.region,50),
    article:{title:safe(article.title,200),publisher:safe(article.publisher,100),date:safe(article.date,40),url:article.url},
    initial:{verdict:first.verdict,reason:first.reason,claim:first.newsFact,comparison:first.govFact,comparisonUrl:first.govUrl}
   })
  });
  const raw=await response.json().catch(()=>({}));
  if(!response.ok)throw Error(safe(raw.error||"AI 검토 서비스에 연결하지 못했어요.",130));
  if(current!==aiSequence)return;
  if(!["match","conflict","insufficient"].includes(raw.status))throw Error("AI 검토 결과를 해석할 수 없어요.");
  const sources=(Array.isArray(raw.sources)?raw.sources:[]).slice(0,3).map(x=>({title:safe(x.title,110),url:url(x.url),date:safe(x.published,30)})).filter(x=>x.url);
  // AI 의견에 출처가 없다면 불일치/일치 판정을 화면에 보여주지 않습니다.
  const status=sources.length?raw.status:"insufficient";
  state.aiReview={
   status,
   summary:sources.length?safe(raw.summary,550):"검증에 사용할 수 있는 출처 링크가 없어 내용을 판단하지 않았어요.",
   comparison:sources.length?safe(raw.comparison,400):"",
   caution:safe(raw.caution,260)||"AI가 제시한 자료를 직접 확인하세요.",
   sources,
   checkedAt:new Date().toISOString()
  };
  $("aiReviewMessage").textContent="AI의 검토 의견을 읽고 근거 링크를 확인한 뒤 최종 판단을 선택하세요.";
 }catch(err){
  if(current!==aiSequence)return;
  state.aiReview={
   status:"unavailable",
   summary:"AI 검토를 이용하지 못했어요. 지금까지 직접 찾은 자료를 바탕으로 최종 판단을 기록할 수 있어요.",
   comparison:"",
   caution:err.name==="AbortError"?"요청 시간이 지났어요. 필요하면 다시 검토해 주세요.":"AI 기능을 사용하려면 서버 연결과 운영 설정이 필요해요. AI가 검증했다고 표시하지 않습니다.",
   sources:[],
   checkedAt:""
  };
  $("aiReviewMessage").textContent=err.name==="AbortError"?"AI 응답이 지연되고 있어요. 직접 검증을 계속할 수 있어요.":"AI 검토가 불가능해요. 직접 검증 내용은 그대로 남길 수 있어요.";
 }finally{
  clearTimeout(wait);
  if(current===aiSequence){
   aiController=null;
   $("askAi").disabled=false;
   $("askAi").textContent="↻ 같은 판단으로 AI 다시 검토하기";
   showAIReviewResult(state.aiReview);
  }
 }
}

function chooseStory(story){
 if(!story||!url(story.url))return;
 state.story={title:safe(story.title),url:url(story.url),publisher:safe(story.publisher||"발행기관 확인"),date:safe(story.date||""),region:safe(story.region||$("region").value),topic:safe(story.topic||""),kind:story.kind==="business"?"business":"news",inquiry:safe(story.inquiry||""),suggested:url(story.suggested||"")};
 state.report=null;
 editFirstJudgement();
 const isBusiness=state.story.kind==="business";
 $("verifyHeading").textContent=isBusiness?"기업 정보가 정말 맞을까?":"뉴스가 정말 맞을까?";
 $("storyType").textContent=isBusiness?"🏭 우리 지역 기업 자료":"📰 내가 고른 뉴스";
 $("findingHeading").textContent=isBusiness?"기업 자료에서 찾은 근거":"뉴스에서 찾은 근거";
 $("findingLabel").textContent=isBusiness?"기업 소개나 사업장 자료에서 확인한 사실을 적어 보세요.":"기사나 공지에 적힌 중요한 사실을 적어 보세요.";
 $("articleLink").textContent=isBusiness?"기업·사업장 원문 읽기 ↗":"기사 원문 읽기 ↗";
 $("articleTitle").textContent=state.story.title;
 $("articlePublisher").textContent="발행한 곳: "+state.story.publisher;
 $("articleDate").textContent=state.story.date;
 setLink($("articleLink"),state.story.url);
 if(evidenceController){evidenceController.abort();evidenceController=null;}
 evidenceSequence++;
 state.selectedEvidence=null;state.evidenceNews=[];state.evidenceError="";state.evidenceSearching=false;
 for(const id of ["articleFinding","officialFinding","officialUrl","reason"])$(id).value="";
 $("detailEvidence").open=true;
 document.querySelector('input[name="verdict"][value="아직 모르겠어요"]').checked=true;
 $("formMessage").textContent="";
 const location=state.story.region==="전체"?"충청북도":"충청북도 "+state.story.region;
 $("officialLink").href=query("official",location,story.topic||story.title);
 $("newsCompareLink").href=query("news",location,story.topic||story.title);
 show("verify");
 searchEvidence();
}
function fromNews(index){
 const row=state.news[index];if(!row)return;
 chooseStory({title:row.title,url:row.url,publisher:row.publisher,date:row.published,region:row.region,topic:row.title});
}
function makeReport(){
 if(!state.story)return;
 // AI를 사용하지 않아도 학생의 직접 검증 기록만으로 완성할 수 있습니다.
 const first=state.firstReview||firstJudgement();
 if(!first)return;
 const ai=state.aiReview;
 const hasAI=Boolean(ai?.status);
 let finalVerdict=first.verdict;
 let finalReason=first.reason;
 // AI 검토를 받았다면 그 내용을 참고해 최종 판단을 한 번 더 작성합니다.
 if(hasAI&&!$("finalStage").hidden){
  finalVerdict=document.querySelector('input[name="finalVerdict"]:checked')?.value;
  finalReason=safe($("finalReason").value,220);
  if(!finalVerdict){
   $("formMessage").textContent="근거를 살펴본 뒤 최종 판단을 골라 주세요.";return;
  }
  if(finalReason.length<3){
   $("formMessage").textContent="처음 판단을 유지하거나 바꾼 이유를 한 문장으로 적어 주세요.";
   $("finalReason").focus();return;
  }
 }
 if(aiController){aiSequence++;aiController.abort();aiController=null;}
 state.report={
  ...state.story,
  newsFact:first.newsFact,govFact:first.govFact,govUrl:first.govUrl,
  verdict:finalVerdict,reason:finalReason,
  initialVerdict:first.verdict,initialReason:first.reason,
  finalVerdict,finalReason,
  aiStatus:ai?.status||"",aiSummary:ai?.summary||"",aiComparison:ai?.comparison||"",
  aiCaution:ai?.caution||"",aiSources:ai?.sources||[],aiCheckedAt:ai?.checkedAt||""
 };
 if(window.LocalCheckBoard){
  const saved=window.LocalCheckBoard.save(state.report);
  if(saved)state.report=saved;
 }
 renderReport();show("result");
}
function renderReport(){
 if(!state.report)return;
 window.LocalCheckBoard.detailReport(state.report,$("report"));
}
function reportText(){
 const d=state.report;
 return [
  "우리 지역 뉴스 탐정 카드","지역: "+d.region,"제목: "+d.title,
  "① 출처 확인","발행한 곳: "+d.publisher,"발행 날짜: "+(d.date||"원문에서 확인해요"),"뉴스 원문: "+d.url,"비교 자료: "+(d.govUrl||"추가 확인 필요"),
  "② 근거 확인","뉴스에서 찾은 근거: "+d.newsFact,"비교 자료에서 찾은 근거: "+(d.govFact||"아직 못 찾음"),
  "③ 학생의 판단","판단: "+(d.initialVerdict||d.verdict),"이유: "+(d.initialReason||d.reason),
  ...(d.aiStatus?[
   "④ AI 근거 검토","AI 상태: "+d.aiStatus,"AI 요약: "+(d.aiSummary||"검토 기록 없음"),
   ...(d.aiSources||[]).map(x=>"AI 참고 근거: "+x.title+" "+x.url),
   "⑤ 최종 판단","비교 결과: "+d.verdict,"최종 이유: "+d.reason
  ]:[]),
  d.aiStatus?"※ 학생의 판단 기록이며 AI 의견은 정답이나 자동 판정이 아닙니다.":"※ 학생이 기사와 비교 자료를 살펴보고 직접 작성한 판단입니다. AI 검토는 사용하지 않았습니다."
 ].join("\n");
}
function download(){
 if(!state.report)return;
 const data="\uFEFF"+reportText();
 const blob=new Blob([data],{type:"text/plain;charset=utf-8"});
 const href=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=href;a.download="우리_고장_뉴스_탐정_카드.txt";a.click();
 setTimeout(()=>URL.revokeObjectURL(href),1500);
}
function init(){
 $("region").addEventListener("change",onRegionChange);
 $("keyword").addEventListener("input",onKeywordInput);
 $("keyword").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();searchNewsInside({scroll:true});}});
 $("newsSearch").addEventListener("click",()=>searchNewsInside({scroll:true}));
 $("showMoreNews").addEventListener("click",()=>searchNewsInside({scroll:true}));
 $("retryNews").addEventListener("click",()=>searchNewsInside({scroll:true}));
 $("liveNewsList").addEventListener("click",e=>{const b=e.target.closest("[data-live-news]");if(b)fromLiveNews(Number(b.dataset.liveNews));});
 document.querySelectorAll("[data-menu]").forEach(button=>{
  button.addEventListener("click",()=>chooseMenu(button.dataset.menu));
 });
 document.querySelectorAll("[data-explore]").forEach(button=>{
  button.addEventListener("click",()=>chooseMenu(button.dataset.explore));
 });
 $("inquiryList").addEventListener("click",e=>{
  const cardNews=e.target.closest("[data-card-news]");
  if(cardNews){
   searchRegionalNews(cardNews.dataset.cardNews);
   return;
  }
  const topic=e.target.closest("[data-issue-term]");
  if(!topic||activeMenu!=="issues")return;
  document.querySelectorAll("[data-issue-term]").forEach(b=>b.classList.toggle("active",b===topic));
  searchRegionalNews(topic.dataset.issueTerm);
 });
 $("inquiryNews").addEventListener("click",()=>{
  searchRegionalNews($("keyword").value||EXPLORE_CATEGORIES[activeMenu]?.defaultTerm);
 });
 $("inquiryBoard").addEventListener("click",()=>chooseMenu("board"));
 document.querySelectorAll("[data-business-filter]").forEach(button=>button.addEventListener("click",()=>{
  businessFilter=button.dataset.businessFilter;
  businessExpanded=false;
  document.querySelectorAll("[data-business-filter]").forEach(el=>{
   const selected=el===button;el.classList.toggle("active",selected);el.setAttribute("aria-pressed",String(selected));
  });
  renderBusinesses();
 }));
 $("businessList").addEventListener("click",e=>{
  const check=e.target.closest("[data-business]");if(check){fromBusiness(check.dataset.business);return;}
  const find=e.target.closest("[data-business-news]");if(!find)return;
  const company=companies.find(c=>c.id===find.dataset.businessNews);if(!company)return;
  $("region").value=company.region;
  chooseMenu("news");
  $("keyword").value=company.name.replace(/\s+(?:본사·공장|청주사업장|진천공장|제천공장|보은공장|옥천공장|상우공장)$/,"").trim();
  searchNewsInside();
 });
 $("moreBusinesses").addEventListener("click",()=>{businessExpanded=!businessExpanded;renderBusinesses();});
 $("newsList").addEventListener("click",e=>{const b=e.target.closest("[data-news]");if(b)fromNews(Number(b.dataset.news));});
 $("evidenceCandidates").addEventListener("click",e=>{const b=e.target.closest("[data-choose-candidate]");if(b)selectCandidate(Number(b.dataset.chooseCandidate));});
 $("retryEvidence").addEventListener("click",searchEvidence);
 $("back").addEventListener("click",()=>show("home"));
 $("backVerify").addEventListener("click",()=>show("verify"));
 $("again").addEventListener("click",()=>show("home"));
 $("askAi").addEventListener("click",askAIEvidence);
 $("editFirst").addEventListener("click",editFirstJudgement);
 $("finish").addEventListener("click",makeReport);
 $("print").addEventListener("click",()=>window.print());
 $("download").addEventListener("click",download);
 if(window.LocalCheckBoard)window.LocalCheckBoard.init({show,getReport:()=>state.report});
 chooseMenu("news");loadNews();loadSearchIndex();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
