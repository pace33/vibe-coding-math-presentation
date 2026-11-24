/* Direct GitHub Pages browser API: no secrets or Worker; same-input retries resume the persisted job. */
window.localcheckGemmaReview=async function(endpoint,input,{signal,onProgress=()=>{}}={}){
 const json=JSON.stringify(input),bytes=new TextEncoder().encode(json);
 const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
 const slot='localcheck-gemma-browser-pending:'+hash;
 let pending;
 try{pending=JSON.parse(localStorage.getItem(slot)||'null')}catch{}
 if(!pending||Date.now()-pending.created>7*86400000){pending={requestId:crypto.randomUUID().replace(/-/g,''),created:Date.now()};localStorage.setItem(slot,JSON.stringify(pending))}
 const pause=ms=>new Promise((resolve,reject)=>{
  if(signal?.aborted){reject(new DOMException('Aborted','AbortError'));return}
  const stop=()=>{clearTimeout(timer);reject(new DOMException('Aborted','AbortError'))};
  const timer=setTimeout(()=>{signal?.removeEventListener('abort',stop);resolve()},ms);
  signal?.addEventListener('abort',stop,{once:true});
 });
 for(;;){
  if(signal?.aborted)throw new DOMException('Aborted','AbortError');
  let url=endpoint,options={mode:'cors',signal,headers:{'Content-Type':'application/json'}};
  if(pending.jobId){const u=new URL(endpoint);u.searchParams.set('job',pending.jobId);url=u.href;options.method='GET'}
  else{options.method='POST';options.body=JSON.stringify({...input,requestId:pending.requestId})}
  const response=await fetch(url,options),raw=await response.json().catch(()=>({}));
  if(!response.ok){
   if(response.status===404||['SERVER_RESTARTED','PROCESSING_FAILED','MODEL_INVALID_JSON','MODEL_INCOMPLETE','MODEL_IDENTITY','CONTEXT_LIMIT','JOB_CANCELLED'].includes(raw.code))localStorage.removeItem(slot);
   const code=/^[A-Z0-9_]{1,64}$/.test(raw.code||'')?raw.code:'GEMMA_CONNECTION';
   throw Error('AI 생성에 실패했습니다. 오류 코드: '+code);
  }
  if(response.status!==202){localStorage.removeItem(slot);return raw}
  if(!/^[a-f0-9]{32}$/.test(raw.jobId||''))throw Error('AI 생성에 실패했습니다. 오류 코드: INVALID_JOB_ID');
  pending.jobId=raw.jobId;localStorage.setItem(slot,JSON.stringify(pending));onProgress(raw);
  await pause(2000);
 }
};
