/* Mobile text input visibility and optional, local button feedback. */
(() => {
"use strict";
const storageKey="localcheck-ui-sound-v1";
let enabled=true, audio=null, lastTone=0;
try{enabled=localStorage.getItem(storageKey)!=="off"}catch{}
function syncSound(){
 const toggle=document.getElementById("soundToggle");
 if(!toggle)return;
 toggle.setAttribute("aria-pressed",String(enabled));
 toggle.setAttribute("aria-label",enabled?"버튼 효과음 끄기":"버튼 효과음 켜기");
 toggle.textContent=enabled?"🔊 소리 켜짐":"🔇 소리 꺼짐";
}
// Short, distinct feedback for action types. Peak gain stays below 0.2.
const tones={
 menu:[[480,620,.095,0]],
 search:[[520,660,.085,0],[740,880,.11,.085]],
 select:[[820,820,.075,0]],
 back:[[650,390,.13,0]],
 ai:[[440,550,.09,0],[660,830,.11,.095],[880,1040,.13,.19]],
 complete:[[523,523,.11,0],[659,659,.12,.10],[784,1047,.20,.21]],
 link:[[660,880,.12,0]],
 share:[[580,740,.09,0],[740,990,.13,.09]],
 remove:[[350,240,.13,0]],
 detail:[[570,570,.085,0],[720,720,.075,.08]],
 default:[[650,490,.095,0]]
};
function soundKind(control){
 if(control.matches("#finish,#addShared,#compareSave,#saveComparison"))return "complete";
 if(control.matches("#askAi,#singleAi")||/AI로 더 알아보기/.test(control.textContent||""))return "ai";
 if(control.matches(".back,#editFirst,#again,#sharedHome"))return "back";
 if(control.matches("[data-card-action=remove]"))return "remove";
 if(control.matches("#shareCard,#shareAgain,[data-card-action=share],#download,#downloadBoard,#print"))return "share";
 if(control.matches("[data-menu],[data-explore],#inquiryBoard,#resultBoard"))return "menu";
 if(control.matches("#newsSearch,#inquiryNews,#showMoreNews,#retryNews,#retryEvidence,[data-card-news],[data-business-news],[data-issue-term],#moreBusinesses"))return "search";
 if(control.matches("input[type=radio],input[type=checkbox],[data-choose-candidate],[data-business-filter]"))return "select";
 if(control.matches("[data-live-news],[data-news],[data-card-action=view],summary"))return "detail";
 if(control.matches("a[href]"))return "link";
 return "default";
}
function playTone(kind="default"){
 if(!enabled)return;
 const now=performance.now();
 if(now-lastTone<90)return;
 lastTone=now;
 try{
  const Audio=window.AudioContext||window.webkitAudioContext;
  if(!Audio)return;
  if(!audio||audio.state==="closed")audio=new Audio();
  const play=()=>{
   if(!enabled||audio.state!=="running")return;
   const t=audio.currentTime;
   for(const [from,to,duration,offset] of tones[kind]||tones.default){
    const at=t+offset,osc=audio.createOscillator(),gain=audio.createGain();
    osc.type="sine";osc.frequency.setValueAtTime(from,at);
    if(from!==to)osc.frequency.exponentialRampToValueAtTime(to,at+duration*.9);
    gain.gain.setValueAtTime(.0001,at);
    gain.gain.exponentialRampToValueAtTime(.14,at+.009);
    gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
    osc.connect(gain);gain.connect(audio.destination);osc.start(at);osc.stop(at+duration+.005);
   }
  };
  if(audio.state==="running")play();else audio.resume().then(play).catch(()=>{});
 }catch{}
}
function init(){
 const toggle=document.getElementById("soundToggle");
 syncSound();
 toggle?.addEventListener("click",()=>{
  enabled=!enabled;
  try{localStorage.setItem(storageKey,enabled?"on":"off")}catch{}
  syncSound();
  if(enabled)playTone("menu");
 });
 document.addEventListener("click",event=>{
  if(!event.isTrusted||!enabled||!(event.target instanceof Element))return;
  const control=event.target.closest("button,a[href],summary,input[type=radio],input[type=checkbox]");
  if(!control||control===toggle||control.matches(":disabled,[aria-disabled=true]"))return;
  playTone(soundKind(control));
 },true);
 const viewport=window.visualViewport;
 let timer=0;
 const editable=el=>el instanceof HTMLElement&&el.matches("textarea,input:not([type]),input[type=text],input[type=search]")&&!el.readOnly&&!el.disabled;
 function updateVisibility(){
  const field=document.activeElement;
  if(!editable(field)){document.documentElement.style.removeProperty("--keyboard-space");return;}
  if(!viewport||Math.abs(viewport.scale-1)>.05)return;
  const gap=Math.max(0,document.documentElement.clientHeight-viewport.height);
  document.documentElement.style.setProperty("--keyboard-space",gap>100?Math.round(gap)+"px":"0px");
  const rect=field.getBoundingClientRect(),top=viewport.offsetTop+16,bottom=viewport.offsetTop+viewport.height-24;
  if(rect.bottom>bottom||rect.top<top){
   field.scrollIntoView({block:"center",inline:"nearest",behavior:"instant"});
  }
 }
 function schedule(){
  clearTimeout(timer);
  timer=setTimeout(updateVisibility,150);
 }
 document.addEventListener("focusin",event=>{if(editable(event.target))schedule()});
 document.addEventListener("focusout",()=>{schedule()});
 viewport?.addEventListener("resize",schedule,{passive:true});
 window.addEventListener("resize",schedule,{passive:true});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();
})();
