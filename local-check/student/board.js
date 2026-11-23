/* 로컬체크 탐정 카드 보드
 * GitHub Pages용: 카드 보관은 이 브라우저의 localStorage, 친구 공유는 URL #card=...
 * 서로 다른 기기에서 자동으로 수집하는 중앙 게시판이 아닙니다.
 * 학습 기록의 진실 여부를 검증하거나 공개 승인하는 기능이 아닙니다.
 */
(() => {
"use strict";
const KEY="localcheck-student-board-v1", LIMIT=40, MAX_LINK=16000;
const $=id=>document.getElementById(id);
const allowedVerdicts=new Set(["같아요","달라요","아직 모르겠어요"]);
const trim=(x,n)=>String(x??"").trim().slice(0,n);
const safeUrl=v=>{try{const u=new URL(String(v));return ["https:","http:"].includes(u.protocol)?u.href:"";}catch{return"";}};
const fields=["region","title","publisher","date","url","newsFact","govFact","govUrl","verdict","reason"];
let navigation=null,currentShared=null,reportProvider=null,selectedSaved=null;
function sanitized(item){
 if(!item||typeof item!=="object"||Array.isArray(item))return null;
 const d={};
 for(const field of fields){
  const maximum=["newsFact","govFact","reason"].includes(field)?500:field.endsWith("Url")||field==="url"?1350:220;
  d[field]=trim(item[field],maximum);
 }
 if(!d.title||!d.newsFact||!d.reason||!safeUrl(d.url)||!allowedVerdicts.has(d.verdict))return null;
 d.url=safeUrl(d.url);d.govUrl=safeUrl(d.govUrl);
 d.id=/^[a-z0-9-]{5,70}$/i.test(String(item.id||""))?item.id:String(Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,10));
 d.createdAt=/^\d{4}-\d{2}-\d{2}/.test(String(item.createdAt||""))?trim(item.createdAt,40):new Date().toISOString();
 return d;
}
function personalDataPresent(d){
 const content=[d.title,d.newsFact,d.govFact,d.reason,d.publisher].join(" ");
 return /[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(content)||
  /01[016789][-\s]?\d{3,4}[-\s]?\d{4}/.test(content);
}
function readCards(){
 try{
  const parsed=JSON.parse(localStorage.getItem(KEY)||"[]");
  if(!Array.isArray(parsed))return [];
  return parsed.slice(0,LIMIT).map(sanitized).filter(Boolean);
 }catch{return [];}
}
function writeCards(rows){
 try{localStorage.setItem(KEY,JSON.stringify(rows.slice(0,LIMIT)));return true;}
 catch{alert("브라우저 저장 공간에 기록을 보관할 수 없어요. 탐정 카드 파일로 저장해 주세요.");return false;}
}
function save(record){
 const normalized=sanitized(record);
 if(!normalized)return null;
 const prev=readCards();
 const cards=[normalized,...prev.filter(x=>x.id!==normalized.id)].slice(0,LIMIT);
 writeCards(cards);
 return normalized;
}
function tag(name,cls,content){
 const x=document.createElement(name);if(cls)x.className=cls;
 if(content!==undefined)x.textContent=content;
 return x;
}
function elementLink(label,raw){
 const a=tag("a","",label+" ↗");
 const valid=safeUrl(raw);
 if(!valid)return tag("span","unverified-link","출처 링크 없음");
 a.href=valid;a.target="_blank";a.rel="noopener noreferrer";
 return a;
}
function detailReport(data,target){
 target.replaceChildren();
 const header=tag("div","detective-header");
 header.append(tag("span","detective-region","📍 "+(data.region||"우리 지역")),tag("h2","","🔎 뉴스 탐정 카드"),tag("p","","출처 확인 · 근거 확인 · 기사 비교를 기록했어요."));
 target.appendChild(header);
 const source=tag("section","detective-origin");
 source.append(tag("h3","","① 출처 확인"),tag("p","verification-guide","누가, 언제 쓴 자료인가요? 원문에서 직접 확인해요."));
 const sources=tag("div","detective-comparison");
 const newsSource=tag("div","");
 newsSource.append(tag("strong","detective-label","내가 읽은 뉴스"),tag("p","","발행한 곳: "+(data.publisher||"원문에서 확인해요")),tag("p","","발행 날짜: "+(data.date||"원문에서 확인해요")),elementLink("뉴스 출처 열기",data.url));
 const otherSource=tag("div","");
 otherSource.appendChild(tag("strong","detective-label","비교한 기사·자료"));
 const comparisonUrl=safeUrl(data.govUrl);
 if(comparisonUrl)otherSource.append(tag("p","","사이트: "+new URL(comparisonUrl).hostname),tag("p","","글쓴이와 날짜는 원문에서 확인해요."),elementLink("비교 자료 출처 열기",comparisonUrl));
 else otherSource.appendChild(tag("p","detective-missing","비교할 기사나 자료의 주소를 아직 기록하지 않았어요."));
 sources.append(newsSource,otherSource);source.appendChild(sources);target.appendChild(source);
 const evidence=tag("section","detective-evidence-record");
 evidence.append(tag("h3","","② 근거 확인"),tag("p","verification-guide","주장을 뒷받침하는 숫자·날짜·사진·인터뷰를 찾았나요?"));
 const comparison=tag("div","detective-comparison");
 const first=tag("section","detective-source detective-news");
 first.append(tag("h4","detective-step","내가 읽은 뉴스"),tag("p","detective-title",data.title));
 const titleOnly=/^검증할 뉴스 제목:/.test(data.newsFact)||data.newsFact===data.title;
 first.append(tag("strong","detective-label","뉴스에서 찾은 내용"),tag("p",titleOnly?"detective-missing":"detective-finding",titleOnly?"제목만 기록했어요. 기사에서 확인한 날짜나 숫자도 적어 보세요.":data.newsFact));
 first.appendChild(elementLink("뉴스 원문 읽기",data.url));
 const second=tag("section","detective-source detective-evidence");
 second.appendChild(tag("h4","detective-step","비교한 기사·자료"));
 const evidenceTitle=/^비교자료 제목:/.test(data.govFact||"");
 if(evidenceTitle)second.append(tag("p","detective-title",data.govFact.replace(/^비교자료 제목:\s*/,"")),tag("strong","detective-label","비교 자료에서 찾은 내용"),tag("p","detective-missing","제목만 기록했어요. 같은 내용이 있는지 원문을 읽어 보세요."));
 else second.append(tag("strong","detective-label","비교 자료에서 찾은 내용"),tag("p","detective-finding",data.govFact||"아직 비교 자료를 찾지 못했어요."));
 if(data.govUrl)second.appendChild(elementLink("비교 자료 원문 읽기",data.govUrl));
 else second.appendChild(tag("p","detective-missing","비교 자료의 주소가 아직 없어요."));
 comparison.append(first,second);evidence.appendChild(comparison);target.appendChild(evidence);
 const reminder=tag("aside","detective-reminder");
 reminder.append(tag("strong","","🔎 잠깐! 같은 것을 비교했나요?"),tag("p","","연도 · 날짜 · 장소 · 숫자를 살펴보세요. 같은 이름의 축제라도 열린 해가 다르면 다른 자료일 수 있어요."));
 target.appendChild(reminder);
 const verdicts={"같아요":["same","🟢 두 자료의 내용이 같다고 생각해요"],"달라요":["different","🟠 두 자료의 내용이 다르다고 생각해요"],"아직 모르겠어요":["unsure","🔵 아직 모르겠어요. 더 알아볼래요"]};
 const [tone,label]=verdicts[data.verdict]||verdicts["아직 모르겠어요"];
 const thought=tag("section","detective-thought "+tone);
 thought.append(tag("h3","","③ 기사 비교"),tag("p","verification-guide","다른 기사나 공식 자료와 비교한 결과예요. 내용이 같아도 사실로 확인된 것은 아니에요."),tag("p","detective-verdict",label),tag("strong","detective-label","어떤 내용이 같거나 달랐나요?"),tag("p","detective-reason",data.reason));
 target.appendChild(thought);
 target.appendChild(tag("p","detective-note","💬 이 카드는 학생의 생각을 담은 기록이에요. 정답 표시가 아니에요. 친구도 원문을 읽고 함께 생각해 보세요."));
}
function createCardRow(d){
 const section=tag("article","board-card");
 const top=tag("div","board-card-top");
 top.append(tag("span","board-region",d.region||"우리 지역"),tag("span","board-verdict",d.verdict));
 section.appendChild(top);
 section.appendChild(tag("h3","",d.title));
 section.appendChild(tag("p","",d.reason));
 const btns=tag("div","board-card-buttons");
 const view=tag("button","board-action primary","자세히 보기");view.type="button";view.dataset.cardAction="view";view.dataset.cardId=d.id;
 const share=tag("button","board-action","친구에게 공유");share.type="button";share.dataset.cardAction="share";share.dataset.cardId=d.id;
 const remove=tag("button","board-action subdued","지우기");remove.type="button";remove.dataset.cardAction="remove";remove.dataset.cardId=d.id;
 btns.append(view,share,remove);section.appendChild(btns);
 return section;
}
function renderBoard(){
 const root=$("boardList");root.replaceChildren();
 const cards=readCards();
 buildComparison();
 $("boardCount").textContent=cards.length+"건";
 if(!cards.length){
  const empty=tag("div","board-empty");
  empty.append(tag("strong","","아직 탐정 카드가 없어요!"),
               tag("p","","뉴스를 검증한 뒤 카드를 완성하거나, 친구가 보내 준 탐정 카드 링크를 열어 보세요."));
  root.appendChild(empty);return;
 }
 for(const c of cards)root.appendChild(createCardRow(c));
}
function gotoBoard(){
 currentShared=null;
 try{if(location.hash.startsWith("#card="))history.replaceState(null,"",location.pathname+location.search);}catch{}
 renderBoard();navigation?.("board");
}
function showCard(c){
 currentShared=sanitized(c);
 if(!currentShared)return;
 detailReport(currentShared,$("sharedReport"));
 $("shareStatus").textContent="";
 navigation?.("shared");
}
function encodeCard(d){
 const safe=sanitized(d);
 if(!safe)return null;
 const payload={v:1,record:Object.fromEntries(["id","createdAt",...fields].map(k=>[k,safe[k]]))};
 const bytes=new TextEncoder().encode(JSON.stringify(payload));
 let binary="";
 // Payload is deliberately bounded; do not allow huge peer-generated links.
 if(bytes.length>6500)return null;
 for(let i=0;i<bytes.length;i+=512)binary+=String.fromCharCode(...bytes.subarray(i,i+512));
 return btoa(binary).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function decodeCard(value){
 if(!value||value.length>MAX_LINK||!/^[\w-]+$/.test(value))return null;
 try{
  const binary=atob(value.replace(/-/g,"+").replace(/_/g,"/"));
  if(binary.length>6500)return null;
  const bytes=Uint8Array.from(binary,c=>c.charCodeAt(0));
  const payload=JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(bytes));
  if(payload?.v!==1)return null;
  return sanitized(payload.record);
 }catch{return null;}
}
function buildShareLink(item){
 const d=sanitized(item);
 if(!d)return null;
 if(personalDataPresent(d)){
  alert("탐정 카드에 연락처나 이메일 주소로 보이는 내용이 있어요. 개인정보를 삭제한 뒤 공유해 주세요.");
  return null;
 }
 const code=encodeCard(d);
 if(!code)return alert("탐정 카드 내용이 너무 길어요. 내용을 줄인 후 다시 공유해 주세요."),null;
 const u=new URL(location.href);
 u.search="";u.hash="card="+code;
 return u.href;
}
async function copyShare(item){
 const link=buildShareLink(item);if(!link)return false;
 try{await navigator.clipboard.writeText(link);}
 catch{
  const field=tag("textarea","","");field.value=link;field.setAttribute("aria-label","탐정 카드 공유 링크");
  document.body.appendChild(field);field.select();
  const ok=document.execCommand?.("copy");field.remove();
  if(!ok){window.prompt("이 링크를 복사해서 친구에게 보내 주세요.",link);return false;}
 }
 alert("탐정 카드 링크를 복사했어요! 우리 반 친구에게 보내 주세요.\n이름·연락처 등 개인정보가 들어가지 않았는지 확인하세요.");
 return true;
}
function downloadBoard(){
 const cards=readCards();if(!cards.length){alert("저장된 카드가 없어요.");return;}
 const blob=new Blob([JSON.stringify({version:1,notice:"학급 내에서만 사용하세요. 학생 작성 내용은 사실 검증 완료가 아닙니다.",cards},null,2)],{type:"application/json"});
 const link=document.createElement("a"),href=URL.createObjectURL(blob);
 link.href=href;link.download="로컬체크_나의_탐정게시판.json";link.click();
 setTimeout(()=>URL.revokeObjectURL(href),1500);
}
function importHash(){
 const hash=location.hash;
 if(!hash.startsWith("#card="))return false;
 const record=decodeCard(hash.slice(6));
 if(!record){alert("탐정 카드 링크를 열 수 없어요. 공유 링크를 다시 확인해 주세요.");return false;}
 showCard(record);return true;
}

/* 두 뉴스 비교 활동: 저장한 탐정 카드 두 건의 원문을 나란히 살펴봅니다.
 * 게시판은 개인 브라우저 저장소이므로 비교 기록도 이 기기에만 보관합니다. */
const COMPARE_KEY="localcheck-student-comparison-v1";
let comparisonSelection=["",""];
function buildComparison(){
 const host=$("boardList")?.parentNode;
 if(!host)return;
 let panel=$("newsComparisonPanel");
 if(!panel){
  const style=tag("style");
  style.textContent=`
   .news-compare-panel{margin:1.25rem 0;padding:1.2rem;border:1px solid #c9d9e5;border-radius:18px;background:#f7fbff}
   .news-compare-panel h2{font-size:1.25rem;margin:0 0 .35rem}
   .news-compare-panel .compare-help{color:#526477;margin:.3rem 0 1rem}
   .news-compare-selects,.news-compare-columns{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
   .news-compare-panel label{display:block;font-weight:700;margin-bottom:.35rem}
   .news-compare-panel select,.news-compare-panel textarea{box-sizing:border-box;width:100%;padding:.7rem;border:1px solid #b7c8d6;border-radius:10px;background:#fff;color:#183047;font:inherit}
   .news-compare-columns{margin:1rem 0}
   .news-compare-article{background:#fff;border:1px solid #d7e1e9;border-radius:14px;padding:1rem;min-width:0;overflow-wrap:anywhere}
   .news-compare-article h3{font-size:1.05rem;margin:.4rem 0}
   .news-compare-article p{line-height:1.5;margin:.55rem 0}
   .news-compare-article a{display:inline-block;margin:.3rem 0;color:#135c9b;text-decoration:underline}
   .news-compare-panel .compare-question{margin:.8rem 0}
   .news-compare-panel .compare-question textarea{min-height:65px}
   .news-compare-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:1rem}
   .news-compare-status{font-weight:700;color:#245777}
   @media(max-width:640px){.news-compare-selects,.news-compare-columns{grid-template-columns:1fr}.news-compare-panel{padding:.9rem}}
  `;
  document.head.appendChild(style);
  panel=tag("section","news-compare-panel");panel.id="newsComparisonPanel";
  const heading=tag("h2","","🔎 두 뉴스 비교·검증하기");
  const info=tag("p","compare-help","탐정 카드 두 개를 고르고, 기사 원문을 읽어 공통점과 차이점을 찾으세요. 내용이 같다고 바로 사실이 되는 것은 아니에요.");
  const selects=tag("div","news-compare-selects");
  for(let i=0;i<2;i++){
   const holder=tag("div");
   const label=tag("label","","뉴스 "+(i===0?"A":"B")+" 선택");
   const sel=tag("select");sel.id="compareSelect"+i;label.htmlFor=sel.id;
   sel.addEventListener("change",()=>{comparisonSelection[i]=sel.value;drawComparison();});
   holder.append(label,sel);selects.appendChild(holder);
  }
  const columns=tag("div","news-compare-columns");columns.id="compareColumns";
  panel.append(heading,info,selects,columns);
  const same=tag("div","compare-question");
  const sameLabel=tag("label","","① 두 뉴스의 같은 점은?");
  const sameInput=tag("textarea");sameInput.id="compareSame";sameInput.placeholder="두 뉴스에서 공통으로 말하는 내용을 적어요.";sameLabel.htmlFor=sameInput.id;same.append(sameLabel,sameInput);
  const diff=tag("div","compare-question");
  const diffLabel=tag("label","","② 두 뉴스의 다른 점은?");
  const diffInput=tag("textarea");diffInput.id="compareDiff";diffInput.placeholder="날짜, 장소, 숫자, 표현이 어떻게 다른가요?";diffLabel.htmlFor=diffInput.id;diff.append(diffLabel,diffInput);
  const judgement=tag("div","compare-question");
  const judgementLabel=tag("label","","③ 원문과 근거를 확인한 뒤 판단하기");
  const judgementSelect=tag("select");judgementSelect.id="compareJudgement";judgementLabel.htmlFor=judgementSelect.id;
  for(const [value,label] of [["pending","아직 확인이 필요해요"],["supported","근거로 확인했어요"],["contradicted","근거와 달라요"]]){
   const option=tag("option","",label);option.value=value;judgementSelect.appendChild(option);
  }
  judgement.append(judgementLabel,judgementSelect);
  const basis=tag("div","compare-question");
  const basisLabel=tag("label","","④ 판단의 근거는? (출처·날짜·숫자 등)");
  const basisInput=tag("textarea");basisInput.id="compareBasis";basisInput.placeholder="어떤 원문이나 공식 자료를 보고 판단했나요?";basisLabel.htmlFor=basisInput.id;basis.append(basisLabel,basisInput);
  const actions=tag("div","news-compare-actions");
  const saveBtn=tag("button","btn btn-primary","💾 비교 기록 저장");saveBtn.type="button";
  const status=tag("span","news-compare-status");status.id="compareStatus";status.setAttribute("role","status");
  saveBtn.addEventListener("click",()=>{
   const [a,b]=comparisonSelection;
   if(!a||!b||a===b){status.textContent="서로 다른 탐정 카드 두 개를 선택하세요.";return;}
   const record={a,b,same:trim(sameInput.value,600),different:trim(diffInput.value,600),judgement:judgementSelect.value,basis:trim(basisInput.value,600),savedAt:new Date().toISOString()};
   if(!record.same||!record.different||!record.basis){status.textContent="같은 점·다른 점·판단 근거를 모두 적어 주세요.";return;}
   try{localStorage.setItem(COMPARE_KEY,JSON.stringify(record));status.textContent="이 기기에 비교 기록을 저장했어요.";}
   catch{status.textContent="저장하지 못했어요. 브라우저 저장 공간을 확인하세요.";}
  });
  actions.append(saveBtn,status);panel.append(same,diff,judgement,basis,actions);
  host.insertBefore(panel,$("boardList"));
 }
 const cards=readCards();
 for(let i=0;i<2;i++){
  const sel=$("compareSelect"+i),prior=comparisonSelection[i];
  sel.replaceChildren();
  const blank=tag("option","","탐정 카드를 선택하세요");blank.value="";sel.appendChild(blank);
  for(const c of cards){const opt=tag("option","",c.title);opt.value=c.id;sel.appendChild(opt);}
  const preferred=cards.some(c=>c.id===prior)?prior:(cards[i]?.id||"");
  comparisonSelection[i]=preferred;sel.value=preferred;
 }
 drawComparison();
}
function drawComparison(){
 const container=$("compareColumns");if(!container)return;
 container.replaceChildren();
 const cards=readCards();
 const selected=comparisonSelection.map(id=>cards.find(c=>c.id===id));
 const valid=selected.every(Boolean)&&selected[0].id!==selected[1].id;
 for(let i=0;i<2;i++){
  const c=selected[i],article=tag("article","news-compare-article");
  article.appendChild(tag("strong","","뉴스 "+(i===0?"A":"B")));
  if(c){
   article.append(tag("h3","",c.title),tag("p","","발행: "+(c.publisher||"원문 확인 필요")),tag("p","","날짜: "+(c.date||"원문 확인 필요")));
   article.append(tag("strong","","기사에서 찾은 내용"),tag("p","",c.newsFact));
   article.appendChild(elementLink("뉴스 원문 확인",c.url));
   if(c.govUrl){
    article.appendChild(tag("p","","추가 비교 근거: "+(c.govFact||"원문에서 확인하세요")));
    article.appendChild(elementLink("비교 자료 확인",c.govUrl));
   }
  }else article.appendChild(tag("p","","게시판에 저장한 탐정 카드를 선택하세요."));
  container.appendChild(article);
 }
 const status=$("compareStatus");if(status)status.textContent=valid?"두 원문을 확인하고 아래 내용을 기록하세요.":"서로 다른 카드 두 개가 필요해요.";
 const saved=(()=>{try{return JSON.parse(localStorage.getItem(COMPARE_KEY)||"null");}catch{return null;}})();
 const match=valid&&saved?.a===comparisonSelection[0]&&saved?.b===comparisonSelection[1];
 for(const [id,value] of [["compareSame",match?saved.same:""],["compareDiff",match?saved.different:""],["compareBasis",match?saved.basis:""],["compareJudgement",match?saved.judgement:"pending"]]){
  const input=$(id);if(input)input.value=value;
 }
}

function init({show,getReport}={}){
 navigation=show;reportProvider=getReport;
 if($("openBoard"))$("openBoard").addEventListener("click",gotoBoard);
 $("resultBoard").addEventListener("click",gotoBoard);
 $("boardBack").addEventListener("click",()=>navigation?.("home"));
 $("sharedBack").addEventListener("click",gotoBoard);
 $("sharedHome").addEventListener("click",()=>navigation?.("home"));
 $("shareCard").addEventListener("click",()=>{const d=reportProvider?.();if(d)copyShare(d);});
 $("shareAgain").addEventListener("click",()=>{if(currentShared)copyShare(currentShared);});
 $("addShared").addEventListener("click",()=>{
  if(!currentShared)return;
  const saved=save(currentShared);
  $("shareStatus").textContent=saved?"내 게시판에 보관했어요. '← 게시판으로'를 눌러 확인할 수 있어요.":"카드 보관에 실패했어요.";
 });
 $("downloadBoard").addEventListener("click",downloadBoard);
 $("boardList").addEventListener("click",e=>{
  const btn=e.target.closest("[data-card-action]");if(!btn)return;
  const d=readCards().find(x=>x.id===btn.dataset.cardId);if(!d)return;
  const action=btn.dataset.cardAction;
  if(action==="view")showCard(d);
  if(action==="share")copyShare(d);
  if(action==="remove"&&confirm("이 기기에 저장한 탐정 카드를 삭제할까요?")){
   writeCards(readCards().filter(x=>x.id!==d.id));renderBoard();
  }
 });
 window.addEventListener("hashchange",importHash);
 renderBoard();importHash();
}
window.LocalCheckBoard={init,save,share:copyShare,renderBoard,encodeCard,decodeCard,detailReport};
})();
