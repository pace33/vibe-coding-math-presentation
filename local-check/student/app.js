(() => {
"use strict";
const TOPICS=Array.isArray(window.STUDENT_FACTS)?window.STUDENT_FACTS:[];
const $=id=>document.getElementById(id);
const steps=[["💭","예상해요"],["📰","찾아봐요"],["⚖️","비교해요"],["🔍","판단해요"],["🏅","발표해요"]];
const names={"3-4":"3~4학년","5-6":"5~6학년",easy:"쉬운 문장"};
const state={region:"전체",grade:"3-4",category:"전체",filter:"",topic:null,step:0,
  draft:{prediction:"",evidence:"",newTitle:"",newUrl:"",newPublisher:"",newDate:"",checked:[],comparison:"",difference:"",verdict:"",reason:"",visited:[]}};
const esc=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clean=(s,n=1000)=>String(s??"").trim().slice(0,n);
function safeLink(x){try{const u=new URL(String(x));return ["https:","http:"].includes(u.protocol)?u.href:"";}catch{return "";}}
function toast(s){const el=$("toast");el.textContent=s;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2800);}
function readAloud(s){
 if(!("speechSynthesis" in window)){toast("이 기기에서 음성 읽기를 지원하지 않아요.");return;}
 speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(clean(s,1400));u.lang="ko-KR";u.rate=.88;speechSynthesis.speak(u);
}
function newDraft(){return {prediction:"",evidence:"",newTitle:"",newUrl:"",newPublisher:"",newDate:"",checked:[],comparison:"",difference:"",verdict:"",reason:"",visited:[]};}
function store(){try{sessionStorage.setItem("localcheck-student-v1",JSON.stringify({id:state.topic?.id,grade:state.grade,step:state.step,draft:state.draft}));}catch{}}
function restore(){
 try{
  const o=JSON.parse(sessionStorage.getItem("localcheck-student-v1")||"null");
  if(!o||!TOPICS.some(t=>t.id===o.id))return;
  if(["3-4","5-6","easy"].includes(o.grade))state.grade=o.grade;
  state.topic=TOPICS.find(t=>t.id===o.id);state.region=state.topic.region;
  state.step=Math.min(4,Math.max(0,Number(o.step)||0));
  state.draft={...newDraft(),...o.draft};
  $("region").value=state.region;$("grade").value=state.grade;
 }catch{}
}
function currentSourceSearch(kind,region=state.region,topic=""){
 const year=new Date().getFullYear();
 const loc=region==="전체"?"충청북도":"충청북도 "+region;
 const q=[loc,topic,year,kind==="news"?"축제 보도 행사 뉴스":"공지사항 행사 보도자료 site:go.kr"].filter(Boolean).join(" ");
 const url=new URL("https://www.google.com/search");url.searchParams.set("q",q);
 if(kind==="news")url.searchParams.set("tbm","nws");
 url.searchParams.set("tbs","qdr:m");
 return url.href;
}
function renderSearchLinks(){
 const region=$("region").value;
 const item=state.topic?.region===region?state.topic:null;
 const topic=item?.topic||clean($("filter").value,55);
 const container=$("searchLinks");
 container.innerHTML='<a href="'+esc(currentSourceSearch("official",region,topic))+'" target="_blank" rel="noopener noreferrer">🏛️ 시·군청 최신 공지 ↗</a><a href="'+esc(currentSourceSearch("news",region,topic))+'" target="_blank" rel="noopener noreferrer">📰 최근 1개월 기사 ↗</a>';
}
function renderTopics(){
 state.region=$("region").value;state.grade=$("grade").value;state.filter=$("filter").value.toLowerCase().trim();
 let items=TOPICS.filter(t=>(state.region==="전체"||t.region===state.region)&&
 (state.category==="전체"||t.category===state.category)&&
 (!state.filter||[t.region,t.topic,t.hook,t.terms,t.category].join(" ").toLowerCase().includes(state.filter)));
 if(state.region==="전체"&&!state.filter&&state.category==="전체")items=[...items].sort((a,b)=>Number(b.featured)-Number(a.featured));
 const grid=$("topicGrid");grid.replaceChildren();
 items.forEach(t=>{
  const card=document.createElement("article");card.className="topic-card";
  card.innerHTML='<div class="card-top"><div class="topic-icon" aria-hidden="true">'+esc(t.icon)+'</div><span class="tag">'+esc(t.region)+' · '+esc(t.category)+'</span></div>'+
   '<h3>'+esc(t.topic)+'</h3><p>'+esc(t.hook)+'</p><div class="card-bottom"><span>'+esc(t.sources.length)+'개의 실제 참고자료</span><button class="select-topic" type="button" data-topic="'+esc(t.id)+'">미션 시작 →</button></div>';
  grid.appendChild(card);
 });
 $("empty").hidden=items.length>0;
 $("matchCount").textContent="추천 주제 "+items.length+"개 · 주제를 고르면 원문을 확인할 수 있어요.";
 renderSearchLinks();
}
function chooseTopic(id,reset=true){
 const t=TOPICS.find(x=>x.id===id);if(!t)return;
 state.topic=t;state.region=t.region;$("region").value=t.region;
 state.step=0;if(reset)state.draft=newDraft();
 $("mission").hidden=false;renderTopics();renderMission();store();
 setTimeout(()=>$("mission").scrollIntoView({behavior:"smooth",block:"start"}),60);
}
function renderProgress(){
 $("missionProgress").innerHTML=steps.map(([icon,name],i)=>'<div class="progress-step '+(i===state.step?"active":i<state.step?"done":"")+'">'+icon+' '+name+'</div>').join("");
}
function pickButton(label,val,attr,current,cls="choice"){
 return '<button type="button" class="'+cls+(current===val?" selected":"")+'" '+attr+'="'+esc(val)+'" aria-pressed="'+String(current===val)+'">'+esc(label)+'</button>';
}
function stageGuess(t,d){
 return '<div class="task-pane"><div class="task-kicker">01 · 문제 발견과 예상</div><h3>먼저 생각해 보세요!</h3>'+
  '<p>아직 정답을 보지 말고, 이 말이 맞을지 예상해 봐요.</p>'+
  '<div class="claim-box"><small>🔎 오늘의 탐정 질문</small><p class="claim">'+esc(t.claim)+'</p></div>'+
  '<div class="choice-grid">'+pickButton("👍 맞는 것 같아요","맞을 것 같아요","data-pred",d.prediction)+pickButton("👀 다른 것 같아요","다른 것 같아요","data-pred",d.prediction)+pickButton("🤔 잘 모르겠어요","잘 모르겠어요","data-pred",d.prediction)+'</div>'+
  '<div class="hint">💡 예상은 틀려도 괜찮아요. 진짜 중요한 것은 <b>자료를 찾아 확인하는 과정</b>이에요.</div>'+
  '<button type="button" class="secondary-button" data-speak="'+esc("이 주장이 맞을까요? "+t.claim)+'">🔊 질문 듣기</button></div>';
}
function sourceCards(t){
 return t.sources.map((s,i)=>'<article class="source-card"><div class="source-head"><span class="source-num">'+(i+1)+'</span><span class="source-kind">'+esc(s.type)+'</span></div><h4>'+esc(s.name)+'</h4><p>🗓️ '+esc(s.date||"기준일은 원문에서 확인")+'</p><a class="external-link" href="'+esc(safeLink(s.url))+'" data-source="'+i+'" target="_blank" rel="noopener noreferrer">원문 직접 읽기 ↗</a></article>').join("");
}
function customSource(d){
 return '<details class="detail-form"><summary>➕ 내가 새로 찾은 기사·공지 추가하기 (선택)</summary>'+
  '<div><label for="newTitle">자료 제목</label><input id="newTitle" class="input" maxlength="180" placeholder="예: 우리 고장 축제 안내" value="'+esc(d.newTitle)+'"></div>'+
  '<div><label for="newPublisher">발표한 곳</label><input id="newPublisher" class="input" maxlength="100" placeholder="예: ○○시청, 지역 신문" value="'+esc(d.newPublisher)+'"></div>'+
  '<div><label for="newDate">발표일</label><input type="date" id="newDate" class="input" value="'+esc(d.newDate)+'"></div>'+
  '<div><label for="newUrl">원문 주소</label><input type="url" id="newUrl" class="input" placeholder="https://..." maxlength="1200" value="'+esc(d.newUrl)+'"></div><p class="tips">주소만 입력하면 사실이 확인되는 것은 아니에요. 원문을 직접 읽어야 해요.</p></details>';
}
function stageFind(t,d){
 return '<div class="task-pane"><div class="task-kicker">02 · 자료 수집</div><h3>진짜 자료를 찾아봐요 📰</h3><p>실제로 공개된 자료예요. 제목을 눌러 새 창에서 원문을 열어 보세요.</p>'+
  '<div class="source-grid">'+sourceCards(t)+'</div>'+
  '<div class="hint">📆 <b>발표한 날</b>과 <b>행사가 열린 날·통계를 조사한 날</b>은 서로 다를 수 있어요.</div>'+
  '<div class="live-actions" style="justify-content:flex-start;margin:14px 0"><a href="'+esc(currentSourceSearch("official",t.region,t.topic))+'" target="_blank" rel="noopener noreferrer">🏛️ 더 최신 공지 찾기 ↗</a><a href="'+esc(currentSourceSearch("news",t.region,t.topic))+'" target="_blank" rel="noopener noreferrer">🗞️ 최근 뉴스 찾기 ↗</a></div>'+
  customSource(d)+
  '<div class="detail-form"><div><label for="evidence">✏️ 원문에서 찾은 중요한 사실 한 가지</label><textarea id="evidence" class="textarea" maxlength="1200" rows="3" placeholder="예: 군청 안내에 9월 3일부터 6일까지 열린다고 써 있어요.">'+esc(d.evidence)+'</textarea></div></div></div>';
}
function stageCompare(t,d){
 const a=t.sources[0],b=t.sources[1]||t.sources[0];
 return '<div class="task-pane"><div class="task-kicker">03 · 자료 분석과 비교</div><h3>두 자료를 비교해요 ⚖️</h3><p>두 자료가 말하는 날짜와 내용을 비교해 보고, 다른 점이 있는지 살펴보세요.</p>'+
  '<div class="compare-box"><div class="compare-col"><strong>📄 자료 A</strong><p>'+esc(a.name)+'<br>'+esc(a.date)+'</p></div><div class="compare-col"><strong>📃 자료 B</strong><p>'+esc(d.newTitle&&safeLink(d.newUrl)?d.newTitle:b.name)+'<br>'+esc(d.newTitle&&safeLink(d.newUrl)?(d.newDate||"날짜 확인 필요"):b.date)+'</p></div></div>'+
  '<div class="check-list">'+[["source","👤 누가 발표했는지"],["date","📅 발표 날짜와 기준일"],["content","📝 내용이 같은지"]].map(([v,l])=>'<label><input type="checkbox" data-check="'+v+'" '+(d.checked.includes(v)?"checked":"")+'>'+l+'</label>').join("")+'</div>'+
  '<h4>두 자료를 비교한 결과는?</h4><div class="choice-grid">'+pickButton("같은 내용이에요","같아요","data-compare",d.comparison)+pickButton("다른 부분이 있어요","달라요","data-compare",d.comparison)+pickButton("아직 모르겠어요","잘 모르겠어요","data-compare",d.comparison)+'</div>'+
  '<div class="detail-form"><div><label for="difference">어떤 점을 발견했나요?</label><textarea id="difference" class="textarea" rows="3" maxlength="900" placeholder="예: 하나는 5월이라고 했는데 다른 하나는 6월이에요.">'+esc(d.difference)+'</textarea></div></div>'+
  '<div class="hint">🔍 같은 기관의 자료라도 <b>작성한 날이나 조사 기준</b>이 다르면 내용이 달라질 수 있어요.</div></div>';
}
function stageJudge(t,d){
 const opts=[["✅ 확인할 수 있어요","확인할 수 있어요"],["🟠 일부만 맞아요","일부만 맞아요"],["❌ 사실과 달라요","사실과 달라요"],["❔ 더 확인해야 해요","더 확인해야 해요"]];
 return '<div class="task-pane"><div class="task-kicker">04 · 결론 내리기</div><h3>이제 나의 판단을 내려요 🔍</h3>'+
  '<p>처음 예상한 내용과 원문에서 확인한 사실을 떠올려 보세요.</p>'+
  '<div class="claim-box"><small>검증하는 문장</small><p class="claim">'+esc(t.claim)+'</p></div>'+
  '<div class="verdicts">'+opts.map(([l,v])=>pickButton(l,v,"data-verdict",d.verdict,"verdict")).join("")+'</div>'+
  '<div class="detail-form"><div><label for="reason">🖊️ 왜 이렇게 생각했나요? 근거를 적어 보세요.</label><textarea id="reason" class="textarea" rows="4" maxlength="1000" placeholder="예: 군청 자료에 날짜가 이렇게 나와 있기 때문이에요.">'+esc(d.reason)+'</textarea></div></div>'+
  '<div class="hint">🏅 정답을 빨리 맞히는 것보다 <b>왜 그렇게 판단했는지 설명하는 것</b>이 중요해요.</div></div>';
}
function reportText(){
 const t=state.topic,d=state.draft;
 return [
 "로컬체크 탐험대 · 나의 지역정보 탐구 카드",
 "지역: 충청북도 "+t.region,
 "주제: "+t.topic,
 "탐구 문장: "+t.claim,
 "처음 생각: "+d.prediction,
 "원문에서 찾은 사실: "+d.evidence,
 "비교한 결과: "+d.comparison,
 "발견한 점: "+(d.difference||"기록 없음"),
 "나의 판단: "+d.verdict,
 "판단한 이유: "+d.reason,
 "원문 출처:",
 ...t.sources.map(s=>"- "+s.name+" : "+s.url),
 ...(d.newUrl?["내가 찾은 자료: "+d.newTitle+" : "+d.newUrl]:[]),
 "확인할 점: 원문 발표일·기준일·내용을 다시 확인하기",
 "참고 설명: "+t.fact
 ].join("\n");
}
function stageReport(t,d){
 const sources=[...t.sources];
 if(d.newUrl&&safeLink(d.newUrl))sources.push({name:d.newTitle||"내가 찾은 자료",url:d.newUrl});
 return '<div class="report-wrap task-pane"><div class="task-kicker">05 · 발표와 성찰</div><h3>🎉 지역정보 탐정 임무 완료!</h3>'+
  '<p>내가 찾은 근거를 가지고 친구에게 설명해 보세요. 아래 카드는 인쇄하거나 저장할 수 있어요.</p>'+
  '<article class="report"><div class="report-head"><span class="report-badge">'+esc(t.icon)+'</span><div><div class="report-region">충북 '+esc(t.region)+' · '+esc(names[state.grade])+'</div><h4>'+esc(t.topic)+' 탐구 카드</h4></div></div>'+
  '<div class="report-row"><strong>🔎 확인한 문장</strong><p>'+esc(t.claim)+'</p></div>'+
  '<div class="report-row"><strong>💭 처음 생각</strong><p>'+esc(d.prediction)+'</p></div>'+
  '<div class="report-row"><strong>📰 찾아낸 사실</strong><p>'+esc(d.evidence)+'</p></div>'+
  '<div class="report-row"><strong>⚖️ 두 자료 비교</strong><p>'+esc(d.comparison)+(d.difference?" · "+esc(d.difference):"")+'</p></div>'+
  '<div class="report-row"><strong>🔍 나의 판단과 이유</strong><p>'+esc(d.verdict)+'\n'+esc(d.reason)+'</p></div>'+
  '<div class="report-row"><strong>📚 내가 참고한 자료</strong><div class="report-links">'+sources.map(s=>'<a href="'+esc(safeLink(s.url))+'" target="_blank" rel="noopener noreferrer">'+esc(s.name)+' ↗</a>').join("")+'</div></div>'+
  '</article>'+
  '<details class="detail-form"><summary>💡 자료의 핵심 내용을 다시 확인해요 (선택)</summary><div class="hint">'+esc(t.fact)+'</div><p class="tips">'+esc(t.check)+'</p></details>'+
  '<div class="report-buttons"><button type="button" data-finish="print">🖨️ 인쇄 / PDF</button><button type="button" data-finish="download">📥 결과 저장</button><button type="button" data-finish="copy">📋 글 복사</button><button type="button" data-finish="share">🔗 우리 반 미션 링크 복사</button><button type="button" data-finish="reset">🔄 다른 미션</button></div></div>';
}
function renderMission(){
 if(!state.topic){$("mission").hidden=true;return;}
 $("mission").hidden=false;
 $("missionHeading").textContent=state.topic.icon+" "+state.topic.topic;
 $("missionSub").textContent="충청북도 "+state.topic.region+" · "+names[state.grade]+" · 실제 출처 탐색";
 renderProgress();
 const d=state.draft,t=state.topic;
 $("missionContent").innerHTML=[stageGuess,stageFind,stageCompare,stageJudge,stageReport][state.step](t,d);
 $("prevStep").hidden=state.step===0;$("nextStep").hidden=state.step===4;
 $("nextStep").textContent=state.step===3?"탐구 카드 완성하기 🏅":"다음 단계 →";
 $("saveStatus").textContent="※ 판단은 학생이 하는 것이에요. AI가 자동 채점하지 않아요.";
}
function saveInputs(){
 const d=state.draft;
 for(const [id,key] of [["evidence","evidence"],["difference","difference"],["reason","reason"],["newTitle","newTitle"],["newUrl","newUrl"],["newPublisher","newPublisher"],["newDate","newDate"]]){
  const el=$(id);if(el)d[key]=clean(el.value,key==="newUrl"?1200:1200);
 }
 store();
}
function next(){
 saveInputs();const d=state.draft,s=state.step;
 if(s===0&&!d.prediction){toast("먼저 나의 생각을 하나 골라주세요!");return;}
 if(s===1&&d.evidence.length<(state.grade==="easy"?3:5)){toast("원문을 열어 보고 찾은 사실을 짧게 적어 주세요.");return;}
 if(s===2&&!d.comparison){toast("두 자료가 같은지 다른지 골라주세요.");return;}
 if(s===3&&(!d.verdict||d.reason.length<(state.grade==="easy"?2:5))){toast("나의 판단과 그 이유를 적어 주세요.");return;}
 if(s<4){state.step=s+1;renderMission();store();$("mission").scrollIntoView({behavior:"smooth",block:"start"});}
}
function prev(){saveInputs();if(state.step>0){state.step--;renderMission();store();}}
function leave(){saveInputs();$("mission").hidden=true;$("choose").scrollIntoView({behavior:"smooth",block:"start"});}
function handleChoose(e){
 const btn=e.target.closest("[data-topic]");if(btn)chooseTopic(btn.dataset.topic);
}
function handleMissionClick(e){
 const el=e.target.closest("button,a");if(!el)return;
 if(el.dataset.pred){state.draft.prediction=el.dataset.pred;renderMission();store();}
 if(el.dataset.compare){state.draft.comparison=el.dataset.compare;saveInputs();renderMission();store();}
 if(el.dataset.verdict){saveInputs();state.draft.verdict=el.dataset.verdict;renderMission();store();}
 if(el.dataset.source!==undefined){const idx=Number(el.dataset.source);if(Number.isInteger(idx)&&!state.draft.visited.includes(idx))state.draft.visited.push(idx);store();}
 if(el.dataset.speak){readAloud(el.dataset.speak);}
 if(el.dataset.finish)finish(el.dataset.finish);
}
function handleMissionInput(e){
 const d=state.draft;
 const el=e.target;
 if(el.dataset.check){d.checked=el.checked?[...new Set([...d.checked,el.dataset.check])]:d.checked.filter(x=>x!==el.dataset.check);}
 saveInputs();
}
async function copyText(t){
 try{await navigator.clipboard.writeText(t);toast("복사했어요!");}
 catch{
  const txt=document.createElement("textarea");txt.value=t;document.body.appendChild(txt);txt.select();
  try{document.execCommand("copy");toast("복사했어요!");}catch{toast("복사할 수 없어요. 직접 선택해 주세요.");}
  txt.remove();
 }
}
function downloadText(text){
 const blob=new Blob(["\uFEFF"+text],{type:"text/plain;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="로컬체크_"+state.topic.region+"_"+state.topic.topic+".txt";a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function shareMission(){
 const u=new URL(location.href);u.searchParams.set("topic",state.topic.id);u.searchParams.set("grade",state.grade);u.hash="";copyText(u.href);
}
function finish(type){
 if(type==="copy")copyText(reportText());
 if(type==="download")downloadText(reportText());
 if(type==="print")window.print();
 if(type==="share")shareMission();
 if(type==="reset"){
  state.topic=null;state.step=0;state.draft=newDraft();
  try{sessionStorage.removeItem("localcheck-student-v1");}catch{}
  $("mission").hidden=true;$("choose").scrollIntoView({behavior:"smooth",block:"start"});
 }
}
function init(){
 const deep=new URLSearchParams(location.search);
 $("region").addEventListener("change",renderTopics);
 $("grade").addEventListener("change",()=>{state.grade=$("grade").value;renderTopics();if(state.topic){renderMission();store();}});
 $("filter").addEventListener("input",renderTopics);
 $("topicGrid").addEventListener("click",handleChoose);
 document.querySelectorAll("[data-category]").forEach(b=>b.addEventListener("click",()=>{
  state.category=b.dataset.category;document.querySelectorAll("[data-category]").forEach(el=>el.classList.toggle("active",el===b));renderTopics();
 }));
 $("missionContent").addEventListener("click",handleMissionClick);
 $("missionContent").addEventListener("input",handleMissionInput);
 $("missionContent").addEventListener("change",handleMissionInput);
 $("prevStep").addEventListener("click",prev);
 $("nextStep").addEventListener("click",next);
 $("backChoose").addEventListener("click",leave);
 $("readIntro").addEventListener("click",()=>readAloud("로컬체크 탐험대에 오신 것을 환영해요. 우리 지역을 고르고, 뉴스와 공지사항을 찾아보세요. 자료가 맞는지 출처, 날짜, 내용을 비교하고, 내 생각을 근거와 함께 기록해 봐요."));
 renderTopics();
 const specified=deep.get("topic");
 if(specified&&TOPICS.some(x=>x.id===specified)){
  const grade=deep.get("grade");if(names[grade]){$("grade").value=grade;state.grade=grade;}
  chooseTopic(specified);
 }else{restore();if(state.topic){renderTopics();renderMission();}}
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();