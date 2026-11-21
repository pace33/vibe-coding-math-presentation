(() => {
"use strict";
const $=id=>document.getElementById(id);
const facts=Array.isArray(window.STUDENT_FACTS)?window.STUDENT_FACTS:[];
const companies=[
 ...(Array.isArray(window.LOCALCHECK_BUSINESSES)?window.LOCALCHECK_BUSINESSES:[]).map(c=>({...c,group:"대표 기업"})),
 ...(Array.isArray(window.LOCALCHECK_SMALL_BUSINESSES)?window.LOCALCHECK_SMALL_BUSINESSES:[])
];
let businessExpanded=false;
let activeMenu="news";
let businessFilter="all";
const state={news:[],updated:null,story:null,report:null,candidates:[],liveNews:[],liveMode:null,evidenceNews:[],evidenceSearching:false,evidenceError:"",selectedEvidence:null};
let liveController=null,liveSequence=0;
let evidenceController=null,evidenceSequence=0;
const safe=(s,n=1800)=>String(s??"").trim().slice(0,n);
const esc=s=>safe(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const url=s=>{try{const u=new URL(String(s));return ["https:","http:"].includes(u.protocol)?u.href:"";}catch{return ""}};
function place(){return $("region").value==="전체"?"충청북도":"충청북도 "+$("region").value}
function query(kind,area=place(),topic=$("keyword").value){
 const q=[area,safe(topic),kind==="official"?"공지사항 보도자료 site:go.kr":"when:7d"].filter(Boolean).join(" ");
 if(kind==="official"){const x=new URL("https://www.google.com/search");x.searchParams.set("q",q);x.searchParams.set("tbs","qdr:m");return x.href;}
 const x=new URL("https://news.google.com/search");x.searchParams.set("q",q);x.searchParams.set("hl","ko");x.searchParams.set("gl","KR");x.searchParams.set("ceid","KR:ko");return x.href;
}
function updateLinks(){
 $("newsSearch").textContent="🔎 "+(activeMenu==="business"?"기업 뉴스 검색":activeMenu==="local"?"축제 뉴스 검색":"뉴스 검색");
}
function chooseMenu(menu){
 if(menu==="board"){window.LocalCheckBoard?.renderBoard?.();show("board");return;}
 if(menu==="explore")menu="business";
 if(!["news","business","local"].includes(menu))return;
 activeMenu=menu;
 clearLiveResults();
 const isExplore=menu!=="news";
 $("newsSection").hidden=isExplore;
 $("businessSection").hidden=menu!=="business";
 $("localSection").hidden=menu!=="local";
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
 $("keyword").value="";
 $("keyword").placeholder=menu==="business"?"예: 김치, 반도체, 중소기업":menu==="local"?"예: 축제, 문화, 역사":"예: 축제, 인구, 학교";
 updateLinks();renderBusinesses();renderNews();renderTopics();
 if($("home").hidden)show("home");
}
function show(screen){
 for(const id of ["home","verify","result","board","shared"])$(id).hidden=id!==screen;
 window.scrollTo({top:0,behavior:"smooth"});
}

function clearLiveResults(){
 liveSequence++;
 if(liveController){liveController.abort();liveController=null;}
 state.liveNews=[];state.liveMode=null;
 $("liveResults").hidden=true;
 $("newsSearch").disabled=false;
 $("retryNews").hidden=true;
}
function fallbackRows(region,keyword){
 const key=String(keyword||"").trim().toLowerCase();
 return state.news.filter(x=>(region==="전체"||x.region===region)&&
  (!key||[x.title,x.publisher,x.region].join(" ").toLowerCase().includes(key))).slice(0,10);
}
function renderLiveResults(items,mode){
 state.liveNews=items;
 state.liveMode=mode;
 const box=$("liveNewsList");box.replaceChildren();
 $("liveCount").textContent=items.length+"건";
 if(!items.length){
  box.innerHTML='<div class="news-empty">조건에 맞는 기사를 찾지 못했어요. 다른 검색어를 입력하거나 검색 범위를 바꿔 보세요.</div>';
  return;
 }
 for(let i=0;i<items.length;i++){
  const x=items[i],card=document.createElement("article");
  card.className="news-card";
  const valid=url(x.url);if(!valid)continue;
  card.innerHTML='<div class="meta"><span class="tag">'+esc(x.region)+" · "+esc(x.sourceType||"뉴스")+'</span><span>'+esc(x.published||"날짜 확인")+'</span></div>'+
   '<h3>'+esc(x.title)+'</h3><p>'+esc(x.publisher||"발행기관 확인")+'</p>'+
   '<div class="news-actions"><a href="'+esc(valid)+'" target="_blank" rel="noopener noreferrer">원문 읽기 ↗</a>'+
   '<button type="button" data-live-news="'+i+'">이 뉴스 검증하기 →</button></div>';
  box.appendChild(card);
 }
}
function fromLiveNews(index){
 const item=state.liveNews[index];if(!item)return;
 chooseStory({title:item.title,url:item.url,publisher:item.publisher,date:item.published,region:item.region,topic:item.title});
}
function googleNewsUrl(region,keyword,menu){
 const area=region==="전체"?"충청북도":"충북 "+region;
 const type={news:"",business:"기업 산업",local:"축제 문화"}[menu]||"";
 const q=[area,keyword||type,"when:30d"].filter(Boolean).join(" ");
 const u=new URL("https://news.google.com/search");
 u.searchParams.set("q",q);u.searchParams.set("hl","ko");
 u.searchParams.set("gl","KR");u.searchParams.set("ceid","KR:ko");
 return u.href;
}
async function searchNewsInside(){
 const region=$("region").value;
 const keyword=safe($("keyword").value,90);
 const category=activeMenu;
 const seq=++liveSequence;
 if(liveController)liveController.abort();
 const controller=new AbortController();
 liveController=controller;
 const timer=setTimeout(()=>controller.abort(),12000);
 const searchButton=$("newsSearch");
 searchButton.disabled=true;
 searchButton.textContent="뉴스 찾는 중…";
 $("liveResults").hidden=false;
 $("liveNewsList").replaceChildren();
 $("liveCount").textContent="검색 중";
 $("liveStatus").textContent="구글 뉴스 RSS에서 기사를 찾고 있어요.";
 $("liveExplanation").textContent="검색어와 관련된 기사를 원문에서 읽고 확인하세요.";
 $("googleNewsFallback").href=googleNewsUrl(region,keyword,category);
 $("retryNews").hidden=true;
 try{
  if(!window.LocalCheckLiveNews)throw new Error("RSS 검색 연결을 준비하지 못했어요.");
  const result=await window.LocalCheckLiveNews.search({region,keyword,category,signal:controller.signal});
  if(seq!==liveSequence)return;
  renderLiveResults(result.items,"live");
  $("liveStatus").textContent=result.items.length?
   "공개 구글 뉴스 RSS 검색 결과입니다. 게시일과 내용은 원문에서 확인하세요. (최대 10건, RSS 변환 서비스 경유)":
   "해당 검색어로 표시할 새 기사가 없어요. 다른 단어로 다시 찾아보세요.";
 }catch(err){
  if(seq!==liveSequence)return;
  const fallback=fallbackRows(region,keyword);
  renderLiveResults(fallback,"saved");
  $("liveStatus").textContent=fallback.length?
   "현재 새 뉴스 조회가 연결되지 않아 저장된 기사 "+fallback.length+"건을 표시합니다. 저장 기준일: "+(state.updated||"확인 필요"):
   "새 뉴스 조회 서비스가 연결되지 않았고 저장된 기사도 조건에 맞지 않아요. 아래 '구글 뉴스에서도 보기'를 이용해 주세요.";
  $("retryNews").hidden=false;
 }finally{
  clearTimeout(timer);
  if(seq===liveSequence){
   searchButton.disabled=false;
   updateLinks();
   liveController=null;
  }
 }
}
function renderNews(){
 const area=$("region").value;
 const keyword=safe($("keyword").value).toLowerCase();
 const found=state.news.filter(x=>(area==="전체"||x.region===area)&&(!keyword||[x.title,x.publisher,x.region].join(" ").toLowerCase().includes(keyword))).slice(0,4);
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
  card.innerHTML='<div class="meta"><span class="tag">'+esc(item.region)+' · '+esc(item.sourceType||"자료")+'</span><span>'+esc(item.published||"날짜 확인 필요")+'</span></div>'+
   '<h3>'+esc(item.title)+'</h3><p>'+esc(item.publisher||"발행기관 확인 필요")+'</p>'+
   '<div class="news-actions"><a href="'+esc(url(item.url))+'" target="_blank" rel="noopener noreferrer">원문 읽기 ↗</a><button type="button" data-news="'+state.news.indexOf(item)+'">이 뉴스 확인하기 →</button></div>';
  root.appendChild(card);
 }
}

function businessNewsUrl(region,name){
 const q=region+" "+name+" when:90d";
 const target=new URL("https://news.google.com/search");
 target.searchParams.set("q",q);
 target.searchParams.set("hl","ko");target.searchParams.set("gl","KR");target.searchParams.set("ceid","KR:ko");
 return target.href;
}
function renderBusinesses(){
 const area=$("region").value;
 const keyword=safe($("keyword").value,150).toLowerCase();
 const items=companies.filter(c=>(area==="전체"||c.region===area)&&
   (businessFilter==="all"||(businessFilter==="small"&&c.group!=="대표 기업")||(businessFilter==="featured"&&c.group==="대표 기업"))&&
   (!keyword||[c.region,c.name,c.produces,c.type,c.summary,c.group].join(" ").toLowerCase().includes(keyword)));
 const visible=businessExpanded?items:items.slice(0,4);
 const list=$("businessList");list.replaceChildren();
 $("businessCount").textContent=items.length+"개 사업장·사례";
 const more=$("moreBusinesses");
 more.hidden=items.length<=4;
 more.textContent=businessExpanded?"접기 ↑":"기업 "+(items.length-visible.length)+"곳 더 보기 ↓";
 if(!visible.length){
  const empty=document.createElement("div");empty.className="news-empty";empty.textContent="이 조건에 맞는 기업 사례가 없어요. 지역이나 검색어를 바꿔 보세요.";list.appendChild(empty);return;
 }
 for(const c of visible){
  const card=document.createElement("article");card.className="business-card";
  card.innerHTML='<div class="business-meta"><span class="business-emoji" aria-hidden="true">'+esc(c.emoji)+'</span><span class="business-tag">'+esc(c.region)+' · '+esc(c.type)+'</span></div>'+
   '<h3>'+esc(c.name)+'</h3><div class="business-product">'+esc(c.produces)+'</div>'+
   '<div class="business-buttons"><button type="button" data-business="'+esc(c.id)+'">자료 확인 →</button>'+
   
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
function renderTopics(){
 const area=$("region").value;
 const keyword=safe($("keyword").value).toLowerCase();
 let chosen=facts.filter(x=>(area==="전체"||x.region===area)&&(!keyword||[x.topic,x.region,x.hook,x.terms].join(" ").toLowerCase().includes(keyword)));
 if(area==="전체"&&!keyword)chosen=chosen.filter(x=>x.featured);
 chosen=chosen.slice(0,6);
 const root=$("topicList");root.replaceChildren();
 if(!chosen.length){root.textContent="이 지역의 탐구 주제가 아직 없어요.";return;}
 for(const item of chosen){
  const button=document.createElement("button");button.type="button";button.className="topic";button.dataset.topic=item.id;
  button.innerHTML=esc(item.icon)+" "+esc(item.region)+" · "+esc(item.topic);
  root.appendChild(button);
 }
}
function refresh(){clearLiveResults();updateLinks();renderNews();renderBusinesses();renderTopics();}
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
function chooseStory(story){
 if(!story||!url(story.url))return;
 state.story={title:safe(story.title),url:url(story.url),publisher:safe(story.publisher||"발행기관 확인"),date:safe(story.date||""),region:safe(story.region||$("region").value),topic:safe(story.topic||""),kind:story.kind==="business"?"business":"news",inquiry:safe(story.inquiry||""),suggested:url(story.suggested||"")};
 state.report=null;
 const isBusiness=state.story.kind==="business";
 $("verifyHeading").textContent=isBusiness?"기업 정보가 정말 맞을까?":"뉴스가 정말 맞을까?";
 $("storyType").textContent=isBusiness?"🏭 우리 고장 기업 자료":"📰 내가 고른 뉴스";
 $("findingHeading").textContent=isBusiness?"① 이 기업에 대해 무엇을 알게 되었나요?":"① 뉴스에서 어떤 내용을 찾았나요?";
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
 $("detailEvidence").open=false;
 document.querySelector('input[name="verdict"][value="아직 모르겠어요"]').checked=true;
 $("formMessage").textContent="";
 const location=state.story.region==="전체"?"충청북도":"충청북도 "+state.story.region;
 $("officialLink").href=query("official",location,story.topic||story.title);
 $("newsCompareLink").href=query("news",location,story.topic||story.title);
 show("verify");
 searchEvidence();
}
function fromTopic(id){
 const t=facts.find(x=>x.id===id);if(!t)return;
 const s=t.sources[0];
 chooseStory({title:"지역 탐구: "+t.topic,url:s.url,publisher:s.name,date:s.date||t.date,region:t.region,topic:t.topic,suggested:t.sources[1]?.url});
}
function fromNews(index){
 const row=state.news[index];if(!row)return;
 chooseStory({title:row.title,url:row.url,publisher:row.publisher,date:row.published,region:row.region,topic:row.title});
}
function makeReport(){
 if(!state.story)return;
 const verdict=document.querySelector('input[name="verdict"]:checked')?.value||"아직 모르겠어요";
 const govUrl=url($("officialUrl").value);
 if(verdict!=="아직 모르겠어요"&&!govUrl){
  $("formMessage").textContent="먼저 비교할 근거 자료를 하나 골라 주세요. 못 찾으면 '모르겠어요'를 선택해도 좋아요.";
  $("evidenceCandidates").scrollIntoView({block:"center",behavior:"smooth"});
  return;
 }
 const newsFact=safe($("articleFinding").value,500)||"검증할 뉴스 제목: "+safe(state.story.title,200);
 const chosen=state.selectedEvidence;
 const govFact=safe($("officialFinding").value,500)||(chosen?"비교자료 제목: "+safe(chosen.title,190):"비교자료 내용을 아직 적지 않았어요.");
 const reason=safe($("reason").value,220)||"판단한 이유는 아직 적지 않았어요.";
 state.report={...state.story,newsFact,govFact,govUrl,verdict,reason};
 if(window.LocalCheckBoard){
  const saved=window.LocalCheckBoard.save(state.report);
  if(saved)state.report=saved;
 }
 renderReport();show("result");
}
function renderReport(){
 if(!state.report)return;
 const d=state.report;
 const root=$("report");
 root.innerHTML='<h2>🔎 우리 고장 탐정 카드</h2>'+
  '<div class="report-row"><strong>지역</strong><p>'+esc(d.region)+'</p></div>'+
  '<div class="report-row"><strong>선택한 탐구 자료</strong><p>'+esc(d.title)+'</p></div>'+
  '<div class="report-row"><strong>검증할 뉴스·자료</strong><p>'+esc(d.newsFact)+'</p></div>'+
  '<div class="report-row"><strong>비교자료 제목·확인 내용</strong><p>'+esc(d.govFact||"아직 찾지 못했어요")+'</p></div>'+
  '<div class="report-row"><strong>나의 판단</strong><p>'+esc(d.verdict)+'</p></div>'+
  '<div class="report-row"><strong>판단한 이유</strong><p>'+esc(d.reason)+'</p></div>'+
  '<div class="report-row"><strong>참고한 원문</strong><a href="'+esc(d.url)+'" target="_blank" rel="noopener noreferrer">뉴스·기사 원문 ↗</a>'+
   (d.govUrl?'<a href="'+esc(d.govUrl)+'" target="_blank" rel="noopener noreferrer">비교 자료 원문 ↗</a>':'')+'</div>'+
  '<p class="note">이 카드는 학생이 찾은 근거와 판단을 기록한 것이며, 정보의 사실 여부를 자동으로 검증한 결과가 아닙니다.</p>';
}
function reportText(){
 const d=state.report;
 return [
  "우리 고장 뉴스 탐정 카드","지역: "+d.region,"제목: "+d.title,
  "검증할 뉴스·자료: "+d.newsFact,"비교자료 제목·내용: "+(d.govFact||"아직 못 찾음"),
  "나의 판단: "+d.verdict,"판단한 이유: "+d.reason,
  "뉴스 원문: "+d.url,"비교 자료: "+(d.govUrl||"추가 확인 필요"),
  "※ 학생이 작성한 판단이며, 자동 사실 검증은 아닙니다."
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
 $("region").addEventListener("change",refresh);$("keyword").addEventListener("input",refresh);
 $("keyword").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();searchNewsInside();}});
 $("newsSearch").addEventListener("click",searchNewsInside);
 $("retryNews").addEventListener("click",searchNewsInside);
 $("liveNewsList").addEventListener("click",e=>{const b=e.target.closest("[data-live-news]");if(b)fromLiveNews(Number(b.dataset.liveNews));});
 document.querySelectorAll("[data-menu]").forEach(button=>{
  button.addEventListener("click",()=>chooseMenu(button.dataset.menu));
 });
 document.querySelectorAll("[data-explore]").forEach(button=>{
  button.addEventListener("click",()=>chooseMenu(button.dataset.explore));
 });
 document.querySelectorAll("[data-business-filter]").forEach(button=>button.addEventListener("click",()=>{
  businessFilter=button.dataset.businessFilter;
  businessExpanded=false;
  document.querySelectorAll("[data-business-filter]").forEach(el=>{
   const selected=el===button;el.classList.toggle("active",selected);el.setAttribute("aria-pressed",String(selected));
  });
  renderBusinesses();
 }));
 $("topicList").addEventListener("click",e=>{const b=e.target.closest("[data-topic]");if(b)fromTopic(b.dataset.topic);});
 $("businessList").addEventListener("click",e=>{
  const check=e.target.closest("[data-business]");if(check){fromBusiness(check.dataset.business);return;}
  const find=e.target.closest("[data-business-news]");if(!find)return;
  const company=companies.find(c=>c.id===find.dataset.businessNews);if(!company)return;
  $("region").value=company.region;
  $("keyword").value=company.name.replace(/\s+(?:본사·공장|청주사업장|진천공장|제천공장|보은공장|옥천공장|상우공장)$/,"").trim();
  refresh();searchNewsInside();
 });
 $("moreBusinesses").addEventListener("click",()=>{businessExpanded=!businessExpanded;renderBusinesses();});
 $("newsList").addEventListener("click",e=>{const b=e.target.closest("[data-news]");if(b)fromNews(Number(b.dataset.news));});
 $("evidenceCandidates").addEventListener("click",e=>{const b=e.target.closest("[data-choose-candidate]");if(b)selectCandidate(Number(b.dataset.chooseCandidate));});
 $("retryEvidence").addEventListener("click",searchEvidence);
 $("back").addEventListener("click",()=>show("home"));
 $("backVerify").addEventListener("click",()=>show("verify"));
 $("again").addEventListener("click",()=>show("home"));
 $("finish").addEventListener("click",makeReport);
 $("print").addEventListener("click",()=>window.print());
 $("download").addEventListener("click",download);
 if(window.LocalCheckBoard)window.LocalCheckBoard.init({show,getReport:()=>state.report});
 chooseMenu("news");loadNews();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();