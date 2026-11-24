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
const commonFooter=(i,total)=>'<div class="slide-footer"><span>우리 지역 탐정 · 초등교원 연수 · 2026.11.25</span><span>'+String(i+1).padStart(2,"0")+' / '+String(total).padStart(2,"0")+'</span></div>';
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
function render(){
 if(!slides.length){
  $("slide").innerHTML='<div class="slide-main"><h1>연수 자료를 불러오지 못했습니다.</h1></div>';return;
 }
 const s=slides[index];
 const frame=$("slide");
 frame.dataset.type=s.type||"standard";
 frame.innerHTML=slideMarkup(s,index);
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
 document.addEventListener("keydown",e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.target?.matches?.("input,textarea,select,button,[contenteditable=true]"))return;
  if(e.key==="Escape"){
   if(overviewOpen){toggleOverview(false);e.preventDefault();}
   else if(notesOpen){toggleNotes(false);e.preventDefault();}
   return;
  }
  if(overviewOpen||notesOpen)return;
  if(["ArrowRight","PageDown"," "].includes(e.key)){e.preventDefault();showSlide(index+1);}
  else if(["ArrowLeft","PageUp"].includes(e.key)){e.preventDefault();showSlide(index-1);}
  else if(e.key==="Home"){e.preventDefault();showSlide(0);}
  else if(e.key==="End"){e.preventDefault();showSlide(slides.length-1);}
  else if(e.key.toLowerCase()==="f"){e.preventDefault();toggleFullscreen();}
  else if(e.key.toLowerCase()==="n"){e.preventDefault();toggleNotes(true);}
  else if(e.key.toLowerCase()==="o"){e.preventDefault();toggleOverview(true);}
 });
});
})();