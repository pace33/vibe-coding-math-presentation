(() => {
"use strict";
const $=id=>document.getElementById(id);
const facts=Array.isArray(window.STUDENT_FACTS)?window.STUDENT_FACTS:[];
const state={news:[],updated:null,story:null,report:null,candidates:[]};
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
 $("newsSearch").href=query("news");
 $("officialSearch").href=query("official");
}
function show(screen){
 for(const id of ["home","verify","result","board","shared"])$(id).hidden=id!==screen;
 window.scrollTo({top:0,behavior:"smooth"});
}
function renderNews(){
 const area=$("region").value;
 const keyword=safe($("keyword").value).toLowerCase();
 const found=state.news.filter(x=>(area==="전체"||x.region===area)&&(!keyword||[x.title,x.publisher,x.region].join(" ").toLowerCase().includes(keyword))).slice(0,6);
 const root=$("newsList");
 root.replaceChildren();
 const date=state.updated||"갱신 여부 확인 필요";
 $("updatedAt").textContent="저장 기준일: "+date;
 if(!found.length){
  root.innerHTML='<div class="news-empty">이 지역에서 저장된 뉴스가 아직 없어요. 위의 <b>지금 새 뉴스 검색하기</b> 버튼으로 찾아보세요.</div>';
  return;
 }
 for(const item of found){
  const card=document.createElement("article");card.className="news-card";
  card.innerHTML='<div class="meta"><span class="tag">'+esc(item.region)+' · '+esc(item.sourceType||"자료")+'</span><span>'+esc(item.published||"날짜 확인 필요")+'</span></div>'+
   '<h3>'+esc(item.title)+'</h3><p>'+esc(item.publisher||"발행기관 확인 필요")+' · 내용은 아직 검증되지 않았어요.</p>'+
   '<div class="news-actions"><a href="'+esc(url(item.url))+'" target="_blank" rel="noopener noreferrer">원문 읽기 ↗</a><button type="button" data-news="'+state.news.indexOf(item)+'">이 뉴스 확인하기 →</button></div>';
  root.appendChild(card);
 }
}
function renderTopics(){
 const area=$("region").value;
 const keyword=safe($("keyword").value).toLowerCase();
 let chosen=facts.filter(x=>(area==="전체"||x.region===area)&&(!keyword||[x.topic,x.region,x.hook,x.terms].join(" ").toLowerCase().includes(keyword)));
 if(area==="전체"&&!keyword)chosen=chosen.filter(x=>x.featured);
 chosen=chosen.slice(0,area==="전체"?7:5);
 const root=$("topicList");root.replaceChildren();
 if(!chosen.length){root.textContent="이 지역에 등록된 대표 주제는 아직 없어요.";return;}
 for(const item of chosen){
  const button=document.createElement("button");button.type="button";button.className="topic";button.dataset.topic=item.id;
  button.innerHTML=esc(item.icon)+" "+esc(item.region)+" · "+esc(item.topic)+"<small>대표 사례로 탐구해요 →</small>";
  root.appendChild(button);
 }
}
function refresh(){updateLinks();renderNews();renderTopics();}
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
 return state.news.filter(n=>{
   if(n.region!==story.region||n.url===story.url)return false;
   const newsTitle=compact(n.title);
   if(newsTitle===current)return false;
   const shared=terms.filter(w=>newsTitle.includes(compact(w)));
   // Prefer distinctive overlapping words; generic city or festival terms alone aren't enough.
   return shared.some(w=>w.length>=4)||shared.length>=2;
 }).slice(0,2);
}
function getCandidateList(story){
 const candidates=[];
 if(story.suggested)candidates.push({title:"이 지역의 대표 사례 비교 자료",type:"관련 공개자료",source:"대표 사례 자료집",url:story.suggested,date:"원문에서 확인"});
 for(const t of matchingCurated(story)){
  for(const entry of t.sources.slice(0,2)){
    if(candidates.some(x=>x.url===entry.url)||entry.url===story.url)continue;
    candidates.push({title:entry.name,type:entry.type||"지역 관련자료",source:"대표 사례: "+t.topic,url:entry.url,date:entry.date||"원문 확인 필요"});
  }
 }
 for(const n of matchingNews(story)){
  if(candidates.some(x=>x.url===n.url))continue;
  candidates.push({title:n.title,type:"비슷한 주제의 다른 기사",source:n.publisher||"발행기관 확인 필요",url:n.url,date:n.published||"발표일 확인"});
 }
 return candidates.filter(x=>url(x.url)).slice(0,4);
}
function renderEvidenceCandidates(){
 const container=$("evidenceCandidates");
 container.replaceChildren();
 state.candidates=getCandidateList(state.story);
 const head=document.createElement("p");head.className="candidates-caption";
 head.textContent="같은 주제일 수 있는 참고자료예요. 실제로 관련이 있는지 원문을 읽고 확인하세요.";
 container.appendChild(head);
 if(!state.candidates.length){
   const message=document.createElement("div");message.className="candidates-empty";
   message.textContent="이 뉴스와 직접 연결된 자료 후보가 아직 없어요. 아래 '공식 자료 더 찾기' 또는 '비슷한 기사 더 찾기'를 이용해 보세요.";
   container.appendChild(message);return;
 }
 const cards=document.createElement("div");cards.className="candidate-grid";
 state.candidates.forEach((c,i)=>{
   const card=document.createElement("article");card.className="candidate-card";
   const tag=document.createElement("span");tag.className="candidate-kind";tag.textContent=c.type;
   const title=document.createElement("strong");title.textContent=c.title;
   const meta=document.createElement("p");meta.textContent=c.source+" · "+c.date;
   const actions=document.createElement("div");actions.className="candidate-actions";
   const link=document.createElement("a");link.textContent="원문 읽기 ↗";link.href=c.url;link.target="_blank";link.rel="noopener noreferrer";
   const select=document.createElement("button");select.type="button";select.textContent="비교자료로 선택";select.dataset.chooseCandidate=String(i);
   actions.append(link,select);card.append(tag,title,meta,actions);cards.appendChild(card);
 });
 container.appendChild(cards);
}
function selectCandidate(index){
 const candidate=state.candidates[index];if(!candidate)return;
 $("officialUrl").value=candidate.url;
 $("officialFinding").focus();
 $("formMessage").textContent="선택한 자료의 주소를 넣었어요. 원문을 읽고 확인한 사실을 직접 적어 주세요.";
}
function chooseStory(story){
 if(!story||!url(story.url))return;
 state.story={title:safe(story.title),url:url(story.url),publisher:safe(story.publisher||"발행기관 확인"),date:safe(story.date||""),region:safe(story.region||$("region").value),topic:safe(story.topic||""),suggested:url(story.suggested||"")};
 state.report=null;
 $("articleTitle").textContent=state.story.title;
 $("articlePublisher").textContent="발행한 곳: "+state.story.publisher;
 $("articleDate").textContent=state.story.date;
 setLink($("articleLink"),state.story.url);
 renderEvidenceCandidates();
 for(const id of ["articleFinding","officialFinding","officialUrl","reason"])$(id).value="";
 document.querySelector('input[name="verdict"][value="아직 모르겠어요"]').checked=true;
 $("formMessage").textContent="";
 const location=state.story.region==="전체"?"충청북도":"충청북도 "+state.story.region;
 $("officialLink").href=query("official",location,story.topic||story.title);
 $("newsCompareLink").href=query("news",location,story.topic||story.title);
 show("verify");
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
 const newsFact=safe($("articleFinding").value,1200);
 const govFact=safe($("officialFinding").value,1200);
 const govUrl=url($("officialUrl").value);
 const verdict=document.querySelector('input[name="verdict"]:checked')?.value||"아직 모르겠어요";
 const reason=safe($("reason").value,1200);
 if(newsFact.length<3){$("formMessage").textContent="뉴스 원문에서 찾은 내용을 먼저 적어 주세요.";$("articleFinding").focus();return;}
 if(verdict!=="아직 모르겠어요"&&(!govUrl||govFact.length<3)){
  $("formMessage").textContent="두 자료를 비교하려면 비교한 자료의 주소와 확인 내용을 적어 주세요.";
  $("officialUrl").focus();return;
 }
 if(reason.length<3){$("formMessage").textContent="왜 그렇게 생각했는지 적어 주세요.";$("reason").focus();return;}
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
 root.innerHTML='<h2>🔎 나의 우리 고장 뉴스 탐정 카드</h2>'+
  '<div class="report-row"><strong>지역</strong><p>'+esc(d.region)+'</p></div>'+
  '<div class="report-row"><strong>선택한 뉴스</strong><p>'+esc(d.title)+'</p></div>'+
  '<div class="report-row"><strong>뉴스에서 찾은 사실</strong><p>'+esc(d.newsFact)+'</p></div>'+
  '<div class="report-row"><strong>비교 자료에서 찾은 사실</strong><p>'+esc(d.govFact||"아직 찾지 못했어요")+'</p></div>'+
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
  "뉴스에서 찾은 사실: "+d.newsFact,"비교 자료에서 찾은 사실: "+(d.govFact||"아직 못 찾음"),
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
 $("topicList").addEventListener("click",e=>{const b=e.target.closest("[data-topic]");if(b)fromTopic(b.dataset.topic);});
 $("newsList").addEventListener("click",e=>{const b=e.target.closest("[data-news]");if(b)fromNews(Number(b.dataset.news));});
 $("evidenceCandidates").addEventListener("click",e=>{const b=e.target.closest("[data-choose-candidate]");if(b)selectCandidate(Number(b.dataset.chooseCandidate));});
 $("back").addEventListener("click",()=>show("home"));
 $("backVerify").addEventListener("click",()=>show("verify"));
 $("again").addEventListener("click",()=>show("home"));
 $("finish").addEventListener("click",makeReport);
 $("print").addEventListener("click",()=>window.print());
 $("download").addEventListener("click",download);
 if(window.LocalCheckBoard)window.LocalCheckBoard.init({show,getReport:()=>state.report});
 refresh();loadNews();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();