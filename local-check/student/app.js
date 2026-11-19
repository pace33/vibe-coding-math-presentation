(() => {
"use strict";
const $=id=>document.getElementById(id);
const facts=Array.isArray(window.STUDENT_FACTS)?window.STUDENT_FACTS:[];
const state={news:[],updated:null,story:null,report:null};
const safe=s=>String(s??"").trim().slice(0,1800);
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
 for(const id of ["home","verify","result"])$(id).hidden=id!==screen;
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
function chooseStory(story){
 if(!story||!url(story.url))return;
 state.story={title:safe(story.title),url:url(story.url),publisher:safe(story.publisher||"발행기관 확인"),date:safe(story.date||""),region:safe(story.region||$("region").value),suggested:url(story.suggested||"")};
 state.report=null;
 $("articleTitle").textContent=state.story.title;
 $("articlePublisher").textContent="발행한 곳: "+state.story.publisher;
 $("articleDate").textContent=state.story.date;
 setLink($("articleLink"),state.story.url);
 setLink($("suggestedLink"),state.story.suggested);
 for(const id of ["articleFinding","officialFinding","officialUrl","reason"])$(id).value="";
 document.querySelector('input[name="verdict"][value="아직 모르겠어요"]').checked=true;
 $("formMessage").textContent="";
 const location=state.story.region==="전체"?"충청북도":"충청북도 "+state.story.region;
 $("officialLink").href=query("official",location,story.topic||story.title);
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
function fromCustom(){
 const title=safe($("newTitle").value),link=url($("newUrl").value);
 if(title.length<4){alert("새로 찾은 기사의 제목을 적어 주세요.");$("newTitle").focus();return;}
 if(!link){alert("실제 기사나 공지의 주소(https://...)를 입력해 주세요.");$("newUrl").focus();return;}
 chooseStory({title,url:link,publisher:"직접 찾은 자료 · 발표기관 확인 필요",date:"원문에서 발표일 확인",region:$("region").value});
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
  $("formMessage").textContent="두 자료가 같거나 다르다고 판단하려면 공식 자료의 주소와 확인 내용을 적어 주세요.";
  $("officialUrl").focus();return;
 }
 if(reason.length<3){$("formMessage").textContent="왜 그렇게 생각했는지 적어 주세요.";$("reason").focus();return;}
 state.report={...state.story,newsFact,govFact,govUrl,verdict,reason};
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
  '<div class="report-row"><strong>공식 자료에서 찾은 사실</strong><p>'+esc(d.govFact||"아직 찾지 못했어요")+'</p></div>'+
  '<div class="report-row"><strong>나의 판단</strong><p>'+esc(d.verdict)+'</p></div>'+
  '<div class="report-row"><strong>판단한 이유</strong><p>'+esc(d.reason)+'</p></div>'+
  '<div class="report-row"><strong>참고한 원문</strong><a href="'+esc(d.url)+'" target="_blank" rel="noopener noreferrer">뉴스·기사 원문 ↗</a>'+
   (d.govUrl?'<a href="'+esc(d.govUrl)+'" target="_blank" rel="noopener noreferrer">공식 자료 원문 ↗</a>':'')+'</div>'+
  '<p class="note">이 카드는 학생이 찾은 근거와 판단을 기록한 것이며, 정보의 사실 여부를 자동으로 검증한 결과가 아닙니다.</p>';
}
function reportText(){
 const d=state.report;
 return [
  "우리 고장 뉴스 탐정 카드","지역: "+d.region,"제목: "+d.title,
  "뉴스에서 찾은 사실: "+d.newsFact,"공식 자료에서 찾은 사실: "+(d.govFact||"아직 못 찾음"),
  "나의 판단: "+d.verdict,"판단한 이유: "+d.reason,
  "뉴스 원문: "+d.url,"공식 자료: "+(d.govUrl||"추가 확인 필요"),
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
 $("startCustom").addEventListener("click",fromCustom);
 $("topicList").addEventListener("click",e=>{const b=e.target.closest("[data-topic]");if(b)fromTopic(b.dataset.topic);});
 $("newsList").addEventListener("click",e=>{const b=e.target.closest("[data-news]");if(b)fromNews(Number(b.dataset.news));});
 $("back").addEventListener("click",()=>show("home"));
 $("backVerify").addEventListener("click",()=>show("verify"));
 $("again").addEventListener("click",()=>show("home"));
 $("finish").addEventListener("click",makeReport);
 $("print").addEventListener("click",()=>window.print());
 $("download").addEventListener("click",download);
 refresh();loadNews();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();