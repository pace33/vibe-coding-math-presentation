/* Direct browser API. Persist the request identity, retry only transient transport failures. */
(() => {
"use strict";
const memory=new Map();
const error=code=>Error("AI 생성에 실패했습니다. 오류 코드: "+code);
const terminal=new Set(["SERVER_RESTARTED","PROCESSING_FAILED","MODEL_INVALID_JSON","MODEL_INCOMPLETE","MODEL_IDENTITY","CONTEXT_LIMIT","JOB_CANCELLED"]);
const pause=(ms,signal)=>new Promise((resolve,reject)=>{
 if(signal?.aborted){reject(new DOMException("Aborted","AbortError"));return;}
 const stop=()=>{clearTimeout(timer);reject(new DOMException("Aborted","AbortError"));};
 const timer=setTimeout(()=>{signal?.removeEventListener("abort",stop);resolve();},ms);
 signal?.addEventListener("abort",stop,{once:true});
});
function read(slot){
 try{return JSON.parse(localStorage.getItem(slot)||"null")||memory.get(slot);}catch{return memory.get(slot);}
}
function store(slot,value){
 memory.set(slot,value);
 try{localStorage.setItem(slot,JSON.stringify(value));}catch{}
}
function clear(slot){memory.delete(slot);try{localStorage.removeItem(slot);}catch{}}
async function request(target,options,signal){
 const controller=new AbortController();
 const abort=()=>controller.abort();
 if(signal?.aborted)abort();else signal?.addEventListener("abort",abort,{once:true});
 const timeout=setTimeout(abort,20000);
 try{
  return await fetch(target,{...options,signal:controller.signal,cache:"no-store",credentials:"omit"});
 }catch(e){
  if(signal?.aborted)throw new DOMException("Aborted","AbortError");
  throw error(controller.signal.aborted?"GEMMA_NETWORK_TIMEOUT":navigator.onLine===false?"GEMMA_OFFLINE":"GEMMA_NETWORK_OR_CORS");
 }finally{clearTimeout(timeout);signal?.removeEventListener("abort",abort);}
}
window.localcheckGemmaReview=async function(endpoint,input,{signal,onProgress=()=>{}}={}){
 if(!globalThis.crypto?.subtle||!crypto.getRandomValues)throw error("GEMMA_SECURE_CONTEXT");
 const bytes=new TextEncoder().encode(JSON.stringify(input));
 const hash=[...new Uint8Array(await crypto.subtle.digest("SHA-256",bytes))].map(x=>x.toString(16).padStart(2,"0")).join("");
 const slot="localcheck-gemma-browser-pending:"+hash;
 function freshRequest(){
  const requestId=[...crypto.getRandomValues(new Uint8Array(16))].map(x=>x.toString(16).padStart(2,"0")).join("");
  const record={requestId,created:Date.now()};
  store(slot,record);return record;
 }
 let pending=read(slot);
 if(!pending||Date.now()-pending.created>7*86400000||!/^[a-zA-Z0-9_-]{16,100}$/.test(pending.requestId||""))pending=freshRequest();
 let retries=0,recovered=false;
 const until=Date.now()+15*60*1000;
 for(;;){
  if(signal?.aborted)throw new DOMException("Aborted","AbortError");
  if(Date.now()>until)throw error("GEMMA_WAIT_LIMIT");
  const target=new URL(endpoint);
  const polling=/^[a-f0-9]{32}$/.test(pending.jobId||"");
  const options={mode:"cors",method:polling?"GET":"POST"};
  if(polling)target.searchParams.set("job",pending.jobId);
  else{options.headers={"Content-Type":"application/json"};options.body=JSON.stringify({...input,requestId:pending.requestId});}
  let response;
  try{
   response=await request(target.href,options,signal);
  }catch(e){
   if(signal?.aborted||retries>=2||e.message.includes("GEMMA_OFFLINE"))throw e;
   retries++;onProgress({status:"reconnecting",attempt:retries});
   await pause(1500*retries,signal);continue;
  }
  const raw=await response.json().catch(()=>null);
  if(!response.ok){
   const code=/^[A-Z0-9_]{1,64}$/.test(raw?.code||"")?raw.code:"GEMMA_HTTP_"+response.status;
   // Re-register a job only when the server explicitly reports it is gone.
   // Uncertain transport failures must keep the same idempotency key.
   const lostJob=code==="SERVER_RESTARTED"||(polling&&[404,410].includes(response.status));
   if(lostJob&&!recovered){
    recovered=true;retries=0;pending=freshRequest();
    onProgress({status:"restarted"});await pause(600,signal);continue;
   }
   if(lostJob||terminal.has(code))clear(slot);
   if([502,503,504].includes(response.status)&&!terminal.has(code)&&retries<2){
    retries++;onProgress({status:"reconnecting",attempt:retries});
    await pause(1500*retries,signal);continue;
   }
   throw error(code);
  }
  if(!raw||typeof raw!=="object")throw error("GEMMA_INVALID_RESPONSE");
  retries=0;
  if(response.status!==202){
   if(!["match","conflict","insufficient"].includes(raw.status))throw error("GEMMA_INVALID_RESPONSE");
   clear(slot);return raw;
  }
  if(!/^[a-f0-9]{32}$/.test(raw.jobId||""))throw error("INVALID_JOB_ID");
  pending.jobId=raw.jobId;store(slot,pending);onProgress(raw);
  await pause(2000,signal);
 }
};
})();
