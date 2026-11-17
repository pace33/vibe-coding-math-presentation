(() => {
"use strict";
const data=Array.isArray(window.LOCAL_CLASS_DATA)?window.LOCAL_CLASS_DATA:[];
const byId=x=>document.getElementById(x);
const clean=(x,max=1000)=>String(x??"").trim().slice(0,max);
const storageKey="localcheck-classroom-checks-v1";
const stage={selected:null,logs:[],found:[],region:"전체"};
const find=id=>data.find(x=>x.id===id);
const li=(tag,cls,content)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(content!==undefined)el.textContent=content;return el;};
function safeURL(value){
 try{const p=new URL(String(value));return ["https:","http:"].includes(p.protocol)?p.href:null;}
 catch{return null;}
}
function openLink(text,url,cls){
 const a=li("a",cls,text+" ↗");const safe=safeURL(url);
 if(safe){a.href=safe;a.target="_blank";a.rel="noopener noreferrer";}else{a.setAttribute("aria-disabled","true");}
 return a;
}
function loadLogs(){
 try{const r=JSON.parse(localStorage.getItem(storageKey)||"[]");stage.logs=Array.isArray(r)?r.slice(0,80):[];}
 catch{stage.logs=[];}
}
function saveLogs(){
 try{localStorage.setItem(storageKey,JSON.stringify(stage.logs));return true;}
 catch{alert("브라우저 저장 공간에 기록을 저장하지 못했습니다. 인쇄 또는 CSV로 기록을 보관하세요.");return false;}
}
function searchLinks(){
 const region=byId("region").value==="전체"?"충청북도":("충청북도 "+byId("region").value);
 const q=t=>"https://www.google.com/search?q="+encodeURIComponent(t);
 const el=byId("externalLinks");el.replaceChildren();
 el.appendChild(openLink("공식기관 검색",q(region+" "+clean(byId("keyword").value,45)+" site:go.kr"),""));
 el.appendChild(openLink("2026 행사·뉴스",q(region+" 2026 행사 보도자료 site:go.kr"),""));
 el.appendChild(openLink("행안부 인구통계","https://jumin.mois.go.kr/",""));
}
function renderResults(){
 const region=byId("region").value,keyword=clean(byId("keyword").value,60).toLowerCase(),cat=byId("category").value;
 stage.region=region;
 stage.found=data.filter(x=>(region==="전체"||region===x.region)&&(cat==="전체"||cat===x.category)&&(!keyword||[x.title,x.claim,x.category,x.region,x.watch].join(" ").toLowerCase().includes(keyword)));
 const root=byId("results");root.replaceChildren();
 byId("resultCount").textContent=stage.found.length+"건의 실제 자료가 있습니다";
 byId("emptyResults").hidden=stage.found.length!==0;
 stage.found.forEach(x=>{
  const card=li("article","fact-card"+(stage.selected?.id===x.id?" selected":""));
  const header=li("div","fact-header");
  header.appendChild(li("span","tag",x.category));
  header.appendChild(li("span","scope","충북 "+x.region));
  card.appendChild(header);
  card.appendChild(li("h3","",x.title));
  card.appendChild(li("p","",x.claim));
  const meta=li("div","card-meta");
  meta.appendChild(li("div","", "발표일: "+x.published));
  meta.appendChild(li("div","", "자료 기준·행사: "+x.reference));
  meta.appendChild(li("div","", "출처: "+x.sourceName));
  card.appendChild(meta);
  const actions=li("div","fact-actions");
  const btn=li("button","","이 자료 검증하기");
  btn.type="button";btn.addEventListener("click",()=>selectFact(x.id));
  actions.appendChild(btn);
  actions.appendChild(openLink("공식자료 원문",x.sourceUrl));
  card.appendChild(actions);
  root.appendChild(card);
 });
 searchLinks();
}
function selectFact(id){
 const x=find(id);if(!x)return;
 stage.selected=x;
 byId("noSelection").hidden=true;byId("verificationForm").hidden=false;
 byId("claimTitle").textContent=x.title;
 byId("claimText").textContent=x.claim;
 byId("claimRegion").textContent="충청북도 "+x.region;
 byId("claimPublished").textContent=x.published;
 byId("claimReference").textContent=x.reference;
 byId("claimNote").textContent="검증 주의: "+x.watch;
 const links=byId("claimLinks");links.replaceChildren();
 links.appendChild(openLink("1차 근거 원문 열기",x.sourceUrl));
 if(x.backupUrl)links.appendChild(openLink("비교 자료 열기",x.backupUrl));
 clearFields();
 renderResults();
 byId("verify").scrollIntoView({behavior:"smooth",block:"start"});
}
function clearFields(){
 byId("evidenceUrl").value="";
 byId("evidenceText").value="";
 byId("reason").value="";
 ["chkSource","chkDate","chkMatch"].forEach(id=>byId(id).checked=false);
 document.querySelector('input[name="verdict"][value="추가 확인 필요"]').checked=true;
 message("");
}
function message(text){byId("verificationMessage").textContent=text;}
function getVerdict(){return document.querySelector('input[name="verdict"]:checked')?.value||"추가 확인 필요";}
function storeVerdict(){
 if(!stage.selected){message("먼저 검색 결과에서 자료를 선택해 주세요.");return;}
 const evidenceUrl=clean(byId("evidenceUrl").value,1200);
 const evidence=clean(byId("evidenceText").value,1800);
 const reason=clean(byId("reason").value,1200);
 const checks=["chkSource","chkDate","chkMatch"].map(id=>byId(id).checked);
 const verdict=getVerdict();
 if(reason.length<8){message("판단한 이유를 8자 이상 적어 주세요.");byId("reason").focus();return;}
 if(verdict!=="추가 확인 필요"){
  if(!safeURL(evidenceUrl)){message("판정을 하려면 실제로 확인한 원문 주소를 입력해야 합니다.");byId("evidenceUrl").focus();return;}
  if(evidence.length<12){message("원문에서 확인한 내용을 12자 이상 적어 주세요.");byId("evidenceText").focus();return;}
  if(checks.filter(Boolean).length<2){message("출처·날짜·내용 중 2개 이상을 점검해 주세요.");return;}
  if(verdict==="확인됨"&&checks.some(x=>!x)){message("‘확인됨’ 판정에는 출처·날짜·내용 3가지를 모두 확인해야 합니다.");return;}
 }
 const record={id:stage.selected.id,title:stage.selected.title,region:stage.selected.region,
  verdict,evidenceUrl,evidence,reason,checks,createdAt:new Date().toLocaleString("ko-KR")};
 stage.logs=[record,...stage.logs.filter(x=>x.id!==record.id)].slice(0,80);
 saveLogs();renderHistory();
 message("이 기기에 검증 기록을 저장했습니다. 서로 다른 사람의 판단을 비교할 때는 원문을 다시 확인하세요.");
}
function renderHistory(){
 const root=byId("history");root.replaceChildren();
 if(!stage.logs.length){const e=li("div","empty");e.appendChild(li("b","","아직 저장한 검증 기록이 없어요."));e.appendChild(li("p","","자료를 선택하고 근거를 확인한 뒤 판단을 기록해 보세요."));root.appendChild(e);return;}
 stage.logs.forEach(r=>{
  const box=li("div","history-item");const l=li("div","");
  l.appendChild(li("strong","",r.region+" · "+r.title));
  l.appendChild(li("p","",r.createdAt+" · "+r.reason));
  if(r.evidenceUrl){l.appendChild(openLink("근거 링크",r.evidenceUrl,"log-link"));}
  box.appendChild(l);
  const color=r.verdict==="확인됨"?"green":r.verdict==="불일치"?"red":r.verdict==="일부 확인"?"blue":"";
  box.appendChild(li("span","verdict-mark "+color,r.verdict));
  root.appendChild(box);
 });
}
const levels={
 "저학년":["우리 고장 사진이나 행사 그림을 보고 예상해요.","공식 자료의 그림·날짜를 교사와 함께 찾아요.","같은 그림과 다른 그림을 구분해요.","확인한 사실을 말이나 그림으로 표현해요."],
 "중학년":["우리 고장 정보 두 가지를 읽고 예상해요.","누가 발표했는지, 날짜는 언제인지 확인해요.","자료와 원문 내용을 비교하고 같거나 다른 부분을 찾아요.","근거 한 가지를 들어 친구에게 설명해요."],
 "고학년":["지역 정보를 검색해 주장의 근거를 먼저 예상해요.","공식 출처·발표일·통계 기준일을 기록해요.","서로 다른 자료를 비교해 수치의 차이와 원인을 설명해요.","검증 결과를 근거와 함께 발표하고 추가 조사 질문을 정해요."],
 "맞춤형":["우리 고장의 익숙한 장소·행사 사진을 보고 선택해요.","교사와 공식 사진·간단한 정보에서 날짜 또는 장소를 찾아요.","사진 두 장 또는 상징 카드를 비교해 같음/다름을 표시해요.","말·AAC·그림카드로 확인 결과를 표현해요."]
};
function lessonText(){
 const level=byId("level").value,topic=clean(byId("question").value,350)||"우리 지역 정보는 정말 맞을까?";
 const source=stage.selected?"선택 자료: "+stage.selected.title+"\n자료 링크: "+stage.selected.sourceUrl+"\n":"";
 return "로컬체크 지역 정보 탐구 수업\n대상: "+level+"\n탐구 질문: "+topic+"\n"+source+
  levels[level].map((s,i)=>(i+1)+". "+s).join("\n")+
  "\n평가 관점: 자료의 출처를 확인하는가? 날짜와 내용을 비교하는가? 근거를 들어 표현하는가?";
}
function renderLesson(){
 const root=byId("lessonResult");root.replaceChildren();
 root.appendChild(li("span","overline","학생 탐구 활동 흐름"));
 root.appendChild(li("h3","",clean(byId("question").value,350)||"우리 고장 정보는 정말 맞을까?"));
 const ol=li("ol","");
 levels[byId("level").value].forEach(t=>ol.appendChild(li("li","",t)));
 root.appendChild(ol);
}
function suggest(){
 const x=stage.selected;
 byId("question").value=x?.question||"우리 고장에 대한 이 정보는 어디에서 확인할 수 있을까?";
 renderLesson();
}
function csvCell(v){let s=String(v??"");if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';}
function downloadCSV(){
 if(!stage.logs.length){alert("먼저 한 건 이상 검증 기록을 저장해 주세요.");return;}
 const rows=[["지역","자료제목","판정","검증날짜","원문 URL","확인내용","판단이유"],...stage.logs.map(x=>[x.region,x.title,x.verdict,x.createdAt,x.evidenceUrl,x.evidence,x.reason])];
 const csv="\uFEFF"+rows.map(r=>r.map(csvCell).join(",")).join("\r\n");
 const link=document.createElement("a"),url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));
 link.href=url;link.download="로컬체크_검증기록.csv";link.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function reset(){
 if(!confirm("이 브라우저의 검증 기록과 입력 내용을 초기화할까요?"))return;
 stage.logs=[];stage.selected=null;saveLogs();
 byId("region").value="전체";byId("keyword").value="";byId("category").value="전체";
 byId("verificationForm").hidden=true;byId("noSelection").hidden=false;
 byId("question").value="";byId("level").value="중학년";
 renderResults();renderHistory();renderLesson();window.scrollTo({top:0,behavior:"smooth"});
}
async function copyLesson(){
 const t=lessonText();
 try{await navigator.clipboard.writeText(t);alert("수업 활동 흐름을 복사했습니다.");}
 catch{const area=document.createElement("textarea");area.value=t;document.body.appendChild(area);area.select();document.execCommand("copy");area.remove();alert("수업 활동 흐름을 복사했습니다.");}
}
function init(){
 loadLogs();renderResults();renderHistory();renderLesson();
 byId("region").addEventListener("change",renderResults);
 byId("keyword").addEventListener("input",renderResults);
 byId("category").addEventListener("change",renderResults);
 byId("searchButton").addEventListener("click",()=>{renderResults();byId("results").scrollIntoView({behavior:"smooth",block:"nearest"});});
 byId("saveVerdict").addEventListener("click",storeVerdict);
 byId("clearVerdict").addEventListener("click",clearFields);
 byId("printButton").addEventListener("click",()=>window.print());
 byId("level").addEventListener("change",renderLesson);
 byId("question").addEventListener("input",renderLesson);
 byId("suggest").addEventListener("click",suggest);
 byId("copyLesson").addEventListener("click",copyLesson);
 byId("downloadResults").addEventListener("click",downloadCSV);
 byId("reset").addEventListener("click",reset);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();