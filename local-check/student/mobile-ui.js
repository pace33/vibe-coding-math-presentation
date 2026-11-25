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
function playTone(){
 if(!enabled)return;
 const now=performance.now();
 if(now-lastTone<65)return;
 lastTone=now;
 try{
  const Audio=window.AudioContext||window.webkitAudioContext;
  if(!Audio)return;
  if(!audio||audio.state==="closed")audio=new Audio();
  const play=()=>{
   if(!enabled||audio.state!=="running")return;
   const t=audio.currentTime,osc=audio.createOscillator(),gain=audio.createGain();
   osc.type="sine";osc.frequency.setValueAtTime(660,t);
   osc.frequency.exponentialRampToValueAtTime(510,t+.075);
   gain.gain.setValueAtTime(.0001,t);
   gain.gain.exponentialRampToValueAtTime(.035,t+.008);
   gain.gain.exponentialRampToValueAtTime(.0001,t+.085);
   osc.connect(gain);gain.connect(audio.destination);osc.start(t);osc.stop(t+.09);
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
  if(enabled)playTone();
 });
 document.addEventListener("click",event=>{
  if(!event.isTrusted||!enabled||!(event.target instanceof Element))return;
  const control=event.target.closest("button,a[href],summary,input[type=radio],input[type=checkbox]");
  if(!control||control===toggle||control.matches(":disabled,[aria-disabled=true]"))return;
  playTone();
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
