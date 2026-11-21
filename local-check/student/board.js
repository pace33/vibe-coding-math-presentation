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
 header.append(tag("span","detective-region","📍 "+(data.region||"우리 지역")),tag("h2","","🔎 뉴스 탐정 카드"),tag("p","","뉴스와 다른 자료를 비교한 나의 기록이에요."));
 target.appendChild(header);
 const comparison=tag("div","detective-comparison");
 const first=tag("section","detective-source detective-news");
 first.append(tag("span","detective-step","1 · 읽은 뉴스"),tag("h3","","어떤 뉴스를 읽었나요?"),tag("p","detective-title",data.title));
 const metadata=[data.publisher,data.date].filter(Boolean).join(" · ");
 if(metadata)first.appendChild(tag("p","detective-meta",metadata));
 const titleOnly=/^검증할 뉴스 제목:/.test(data.newsFact)||data.newsFact===data.title;
 first.append(tag("strong","detective-label","뉴스에서 찾은 내용"),tag("p",titleOnly?"detective-missing":"detective-finding",titleOnly?"제목만 기록했어요. 기사에서 확인한 날짜나 숫자도 적어 보세요.":data.newsFact));
 first.appendChild(elementLink("뉴스 원문 읽기",data.url));
 const second=tag("section","detective-source detective-evidence");
 second.append(tag("span","detective-step","2 · 비교한 자료"),tag("h3","","다른 자료에는 뭐라고 나왔나요?"));
 const evidenceTitle=/^비교자료 제목:/.test(data.govFact||"");
 if(evidenceTitle)second.append(tag("p","detective-title",data.govFact.replace(/^비교자료 제목:\s*/,"")),tag("strong","detective-label","비교 자료에서 찾은 내용"),tag("p","detective-missing","제목만 기록했어요. 같은 내용이 있는지 원문을 읽어 보세요."));
 else second.append(tag("strong","detective-label","비교 자료에서 찾은 내용"),tag("p","detective-finding",data.govFact||"아직 비교 자료를 찾지 못했어요."));
 if(data.govUrl)second.appendChild(elementLink("비교 자료 원문 읽기",data.govUrl));
 else second.appendChild(tag("p","detective-missing","비교 자료의 주소가 아직 없어요."));
 comparison.append(first,second);target.appendChild(comparison);
 const reminder=tag("aside","detective-reminder");
 reminder.append(tag("strong","","🔎 잠깐! 같은 것을 비교했나요?"),tag("p","","연도 · 날짜 · 장소 · 숫자를 살펴보세요. 같은 이름의 축제라도 열린 해가 다르면 다른 자료일 수 있어요."));
 target.appendChild(reminder);
 const verdicts={"같아요":["same","🟢 두 자료의 내용이 같다고 생각해요"],"달라요":["different","🟠 두 자료의 내용이 다르다고 생각해요"],"아직 모르겠어요":["unsure","🔵 아직 모르겠어요. 더 알아볼래요"]};
 const [tone,label]=verdicts[data.verdict]||verdicts["아직 모르겠어요"];
 const thought=tag("section","detective-thought "+tone);
 thought.append(tag("span","detective-step","3 · 나의 생각"),tag("h3","",label),tag("strong","detective-label","왜 그렇게 생각했나요?"),tag("p","detective-reason",data.reason));
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
