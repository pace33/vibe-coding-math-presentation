(() => {
"use strict";
const slides=Array.isArray(window.TRAINING_SLIDES)?window.TRAINING_SLIDES:[];
const meta=window.TRAINING_META||{};
const $=id=>document.getElementById(id);
let index=0;
let notesOpen=false,overviewOpen=false;
const escaped=s=>String(s||"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const lineTitle=title=>escaped(title).replace(/\n/g,"<br>");
const commonTop=s=>'<div class="slide-kicker"><span>'+escaped(s.kicker||"")+'</span><span class="section-mini">'+escaped(s.section||"")+'</span></div>';
const commonFooter=(i,total)=>'<div class="slide-footer"><span>우리 지역 탐정 · 2026.11.25</span><span>'+String(i+1).padStart(2,"0")+' / '+String(total).padStart(2,"0")+'</span></div>';
function slideMarkup(s,i){
 const header=commonTop(s);
 const footer=commonFooter(i,slides.length);
 const body=s.body||"";
 const image=s.image?'<img src="'+escaped(s.image)+'" alt="'+escaped(s.title.replace(/\n/g," " )+' 관련 예시 이미지')+'" loading="eager">':"";
 let inside="";
 if(s.type==="cover"){
  inside='<div class="cover-grid"><div class="cover-copy"><h1 class="slide-title">'+lineTitle(s.title)+'</h1>'+
    (s.lead?'<p class="slide-lead">'+escaped(s.lead)+'</p>':"")+body+'</div>'+
    (image?'<figure class="cover-image">'+image+'</figure>':"")+'</div>';
 }else if(s.type==="section"){
  inside='<div class="section-grid"><div><h1 class="slide-title">'+lineTitle(s.title)+'</h1>'+
    (s.lead?'<p class="slide-lead">'+escaped(s.lead)+'</p>':"")+body+'</div>'+
    (image?'<figure class="section-image">'+image+'</figure>':"")+'</div>';
 }else if(s.type==="image"){
  inside='<h1 class="slide-title">'+lineTitle(s.title)+'</h1>'+
    (s.lead?'<p class="slide-lead">'+escaped(s.lead)+'</p>':"")+
    '<div class="slide-body"><figure class="slide-visual">'+image+'</figure>'+body+'</div>';
 }else{
  inside='<h1 class="slide-title">'+lineTitle(s.title)+'</h1>'+
    (s.lead?'<p class="slide-lead">'+escaped(s.lead)+'</p>':"")+
    '<div class="slide-body">'+body+'</div>';
 }
 return '<div class="slide-main">'+header+inside+footer+'</div>';
}
function writeAddress(i){
 const hash="#slide="+String(i+1);
 if(location.hash!==hash)history.replaceState(null,"",hash);
}

/* Load the real, same-origin student interface for the active feature slide.
   The printed slide keeps its labelled static reference, not a simulated capture. */
let previewResize=null;
function mountStudentPreview(frame){
 previewResize?.disconnect();previewResize=null;
 const host=frame.querySelector(".feature-media[data-preview]");
 if(!host)return;
 const mode=host.dataset.preview;
 const isVerify=mode==="verify"||mode.startsWith("verify-")||mode==="ai";
 const live=document.createElement("iframe");
 live.className="feature-live";
 live.title="실제 학생용 웹앱 화면";
 live.tabIndex=-1;
 live.setAttribute("aria-hidden","true");
 const badge=document.createElement("span");
 badge.className="feature-live-label";
 badge.textContent=isVerify?"실제 웹앱 화면 · 실제 기사 고정 사례":"실제 웹앱 화면 · 실시간";
 let completed=false,started=false,timeout=null;
 const active=()=>host.isConnected&&!completed;
 const fail=()=>{
  if(!active())return;
  completed=true;clearTimeout(timeout);
  host.classList.remove("feature-live-ready");
  host.classList.add("feature-live-error");
  live.remove();badge.remove();
 };
 const fit=()=>{
  const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;
  const scale=Math.min(w/1100,h/720);
  live.style.transform="translate(-50%,-50%) scale("+scale+")";
 };
 function reveal(doc,stage){
  if(!active())return;
  const view=doc.defaultView;
  const position=()=>{
   if(!active())return;
   if(stage){
    const target=doc.querySelector(stage.anchor);
    if(target&&view)view.scrollTo({top:Math.max(0,target.getBoundingClientRect().top+view.scrollY-18),behavior:"instant"});
   }
   fit();
  };
  // Set the final viewport before making the iframe visible.
  position();
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   if(!active())return;
   position();completed=true;clearTimeout(timeout);
   host.classList.add("feature-live-ready");
  }));
 }
 function waitForEvidence(doc,stage,startedAt){
  if(!active())return;
  const retry=doc.getElementById("retryEvidence");
  if(retry?.disabled&&Date.now()-startedAt<12000){
   setTimeout(()=>waitForEvidence(doc,stage,startedAt),150);
   return;
  }
  reveal(doc,stage);
 }
 live.addEventListener("load",()=>{
  if(started||!active())return;
  let attempts=0;
  const activate=()=>{
   if(!active())return;
   try{
    const doc=live.contentDocument;
    const home=doc?.getElementById("home");
    if(!home){if(++attempts<30)setTimeout(activate,250);else fail();return;}
    const preview=live.contentWindow?.LocalCheckTrainingPreview;
    if(isVerify&&typeof preview!=="function"){if(++attempts<30)setTimeout(activate,250);else fail();return;}
    started=true;
    const style=doc.createElement("style");
    style.textContent="html,body{scroll-behavior:auto!important}";
    if(host.querySelector('img[src$="00-overview.svg"]')){
     style.textContent+='[data-menu="news"]{outline:6px solid #21b65a!important;outline-offset:1px!important}[data-menu="explore"]{outline:6px solid #2583dc!important;outline-offset:1px!important}[data-menu="board"]{outline:6px solid #f28b16!important;outline-offset:1px!important}';
    }
    // Emphasize all six regional categories in the presentation preview only.
    if(mode==="overview"||mode==="nature"){
     style.textContent+='#exploreTabs{padding:7px!important;gap:10px!important;overflow:visible!important}#exploreTabs [data-explore]{outline:5px solid #f28b16!important;outline-offset:1px!important;border-radius:9px!important}';
    }
    doc.head.appendChild(style);
    if(mode==="overview"||mode==="nature"){
     doc.querySelector('[data-menu="explore"]')?.click();
     doc.querySelector('[data-explore="'+mode+'"]')?.click();
    }else if(mode==="board"){
     doc.querySelector('[data-menu="board"]')?.click();
    }else if(isVerify){
     preview(mode);
     const stage={
      "verify":{anchor:".selected-story",highlights:"#articleLink, .evidence-heading"},
      "verify-evidence":{anchor:".selected-story",highlights:".selected-story, #evidenceCandidates .candidate-card, #evidenceCandidates [data-choose-candidate]"},
      "verify-writing":{anchor:"#detailEvidence",highlights:"#articleFinding, #officialFinding"},
      "verify-judgement":{anchor:"#manualCompare",highlights:".verdict-choices, #reason"},
      "ai":{anchor:"#aiReviewStage",highlights:"#askAi, #finish"}
     }[mode];
     style.textContent+="\n"+stage.highlights.split(",").map(x=>x.trim()+"{outline:5px solid #f28b16!important;outline-offset:2px!important;border-radius:8px!important}").join("\n");
     if(mode==="verify-evidence"){
      style.textContent+='\n#verify .selected-story{margin-bottom:12px!important;padding:16px 20px!important}#verify .verify-panel{padding:16px 20px!important}#verify .selected-story .verification-guide,#verify .verify-panel>.verification-guide{margin:4px 0 8px!important}#verify .candidate-grid{grid-template-columns:1fr!important}#verify .candidate-card{padding:14px 18px!important}#verify #evidenceCandidates{margin:8px 0!important}';
     }
     reveal(doc,stage);return;
    }
    reveal(doc,null);
   }catch(error){fail();}
  };
  activate();
 });
 live.addEventListener("error",fail);
 // Set the URL before inserting the iframe to avoid an initial blank navigation.
 const studentUrl=new URL("../student/",location.href);
 if(isVerify)studentUrl.searchParams.set("trainingPreview","wolf");
 live.src=studentUrl.href;
 timeout=setTimeout(fail,22000);
 host.append(live,badge);
 if(typeof ResizeObserver!=="undefined"){previewResize=new ResizeObserver(fit);previewResize.observe(host);}
 fit();
}

function render(){
 if(!slides.length){
  $("slide").innerHTML='<div class="slide-main"><h1>연수 자료를 불러오지 못했습니다.</h1></div>';return;
 }
 const s=slides[index];
 const frame=$("slide");
 frame.dataset.type=s.type||"standard";
 frame.innerHTML=slideMarkup(s,index);
 mountStudentPreview(frame);
 frame.setAttribute("aria-label",String(index+1)+"/"+slides.length+" "+s.title.replace(/\n/g," "));
 $("pageCounter").textContent=(index+1)+" / "+slides.length;
 $("progressValue").style.width=((index+1)/slides.length*100).toFixed(2)+"%";
 $("prev").disabled=index===0;
 $("next").disabled=index===slides.length-1;
 $("currentSection").textContent=s.section;
 $("pageTitle").textContent=s.title.replace(/\n/g," ");
 $("speakerNote").textContent=s.note||"추가 발표자 노트가 없습니다.";
 document.title=s.title.replace(/\n/g," ")+" | "+meta.title;
 if(overviewOpen)renderOverview();
 writeAddress(index);
}
function showSlide(target){
 const v=Math.max(0,Math.min(slides.length-1,Math.floor(target)));
 if(!Number.isFinite(v)||v===index)return;
 index=v;
 render();
}
function renderOverview(){
 $("overviewGrid").innerHTML=slides.map((s,i)=>
  '<button type="button" class="overview-button" data-jump="'+i+'" '+(i===index?'aria-current="true"':"")+'>'+
  '<small>'+String(i+1).padStart(2,"0")+' · '+escaped(s.section)+'</small>'+
  '<strong>'+escaped(s.title.replace(/\n/g," "))+'</strong>'+
  '</button>').join("");
}
function toggleOverview(open){
 overviewOpen=typeof open==="boolean"?open:!overviewOpen;
 $("overviewSheet").hidden=!overviewOpen;
 $("contentsButton").setAttribute("aria-pressed",String(overviewOpen));
 if(overviewOpen){toggleNotes(false);renderOverview();$("closeOverview").focus();}
 else $("contentsButton").focus();
}
function toggleNotes(open){
 notesOpen=typeof open==="boolean"?open:!notesOpen;
 $("notesSheet").hidden=!notesOpen;
 $("notesButton").setAttribute("aria-pressed",String(notesOpen));
 if(notesOpen){toggleOverview(false);$("speakerNote").textContent=slides[index]?.note||"";$("closeNotes").focus();}
 else $("notesButton").focus();
}
function parseHash(){
 const match=location.hash.match(/^#slide=(\d{1,3})$/);
 if(!match)return 0;
 return Math.max(0,Math.min(slides.length-1,Number(match[1])-1));
}
async function toggleFullscreen(){
 try{
  if(document.fullscreenElement)await document.exitFullscreen();
  else await document.documentElement.requestFullscreen();
 }catch(e){$("notice").textContent="이 브라우저에서는 전체화면 전환을 사용할 수 없습니다.";}
}
async function printAll(){
 const target=$("printDeck");
 target.innerHTML="";
 slides.forEach((s,i)=>{
  const frame=document.createElement("article");
  frame.className="slide print-slide";
  frame.dataset.type=s.type||"standard";
  frame.innerHTML=slideMarkup(s,i);
  target.appendChild(frame);
 });
 // 이미지 파일을 읽기 전에 인쇄 대화상자가 열려 빈 그림이 출력되지 않게 합니다.
 const ready=[...target.querySelectorAll("img")].map(img=>img.complete?Promise.resolve():new Promise(resolve=>{
  img.addEventListener("load",resolve,{once:true});img.addEventListener("error",resolve,{once:true});
 }));
 await Promise.race([Promise.all(ready),new Promise(resolve=>setTimeout(resolve,3500))]);
 window.print();
}
document.addEventListener("DOMContentLoaded",()=>{
 index=parseHash();
 render();
 $("prev").addEventListener("click",()=>showSlide(index-1));
 $("next").addEventListener("click",()=>showSlide(index+1));
 $("contentsButton").addEventListener("click",()=>toggleOverview());
 $("notesButton").addEventListener("click",()=>toggleNotes());
 $("fullscreenButton").addEventListener("click",toggleFullscreen);
 $("printButton").addEventListener("click",printAll);
 $("closeOverview").addEventListener("click",()=>toggleOverview(false));
 $("closeNotes").addEventListener("click",()=>toggleNotes(false));
 // Copy an entire prompt as one message for a ChatGPT conversation.
 $("slide").addEventListener("click",async e=>{
  const button=e.target.closest("[data-copy-prompt]");
  if(!button)return;
  const prompt=decodeURIComponent(button.dataset.copyPrompt||"");
  if(!prompt)return;
  try{
   if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(prompt);
   else{
    const temp=document.createElement("textarea");
    temp.value=prompt;temp.style.position="fixed";temp.style.opacity="0";
    document.body.appendChild(temp);temp.select();
    const copied=document.execCommand("copy");
    temp.remove();
    if(!copied)throw new Error("Clipboard not available");
   }
   button.textContent="복사 완료 ✓";
   button.setAttribute("aria-label","명령문 복사 완료");
  }catch(error){
   button.textContent="복사 실패 · 내용을 선택해 주세요";
   button.setAttribute("aria-label","명령문을 복사하지 못했습니다");
  }
 });
 $("overviewGrid").addEventListener("click",e=>{
  const b=e.target.closest("[data-jump]");if(!b)return;
  const next=Number(b.dataset.jump);toggleOverview(false);showSlide(next);
 });
 $("overviewSheet").addEventListener("click",e=>{if(e.target===$("overviewSheet"))toggleOverview(false);});
 $("notesSheet").addEventListener("click",e=>{if(e.target===$("notesSheet"))toggleNotes(false);});
 window.addEventListener("hashchange",()=>{if(!location.hash.startsWith("#slide="))return;index=parseHash();render();});
 // Presentation remotes normally send PageUp/PageDown or arrow keys.
 document.addEventListener("keydown",e=>{
  if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey||e.isComposing)return;
  if(e.target?.closest?.("input,textarea,select,[contenteditable=true]"))return;
  const legacy={13:"Enter",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown"};
  const key=(!e.key||e.key==="Unidentified")?(legacy[e.keyCode]||e.code||""):e.key;
  if(key==="Escape"){
   if(overviewOpen){toggleOverview(false);e.preventDefault();}
   else if(notesOpen){toggleNotes(false);e.preventDefault();}
   return;
  }
  if(overviewOpen||notesOpen)return;
  // Do not block remote keys when a toolbar button has focus after a click.
  if(["ArrowRight","ArrowDown","PageDown","Enter","NumpadEnter"," ","Space","Spacebar"].includes(key)){
   e.preventDefault();if(!e.repeat)showSlide(index+1);
  }
  else if(["ArrowLeft","ArrowUp","PageUp"].includes(key)){
   e.preventDefault();if(!e.repeat)showSlide(index-1);
  }
  else if(key==="Home"){e.preventDefault();showSlide(0);}
  else if(key==="End"){e.preventDefault();showSlide(slides.length-1);}
  else if(key.toLowerCase()==="f"){e.preventDefault();toggleFullscreen();}
  else if(key.toLowerCase()==="n"){e.preventDefault();toggleNotes(true);}
  else if(key.toLowerCase()==="o"){e.preventDefault();toggleOverview(true);}
 },true);
});
})();