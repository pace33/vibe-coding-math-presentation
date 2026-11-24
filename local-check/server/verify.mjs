const ORIGIN='https://pace33.github.io';
const API='https://aiedue.ddns.net/localcheck-ai/v1';
const validId=id=>/^[a-f0-9]{32}$/.test(id||'');
function reply(body,status,origin){return Response.json(body,{status,headers:{
 'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'POST, GET, OPTIONS',
 'Access-Control-Allow-Headers':'Content-Type','Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff'
}})}
const fail=(code,status,origin)=>{code=/^[A-Z0-9_]{1,64}$/.test(code||'')?code:'GEMMA_UPSTREAM';return reply({error:'AI 생성에 실패했습니다. 오류 코드: '+code,code},status,origin)};
async function readInput(request){
 const reader=request.body?.getReader();if(!reader)throw Error('INVALID_REQUEST');
 let size=0,chunks=[];
 try{for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>262144){await reader.cancel();throw Error('BODY_SIZE')}chunks.push(value)}}finally{reader.releaseLock()}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length}
 return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
}
function mapJob(out,origin){
 if(out.status==='done'&&out.result)return reply(out.result,200,origin);
 if(['failed','cancelled'].includes(out.status))return fail(out.error?.code||'JOB_CANCELLED',502,origin);
 if(!validId(out.id)||!['queued','running'].includes(out.status))return fail('INVALID_JOB_RESPONSE',502,origin);
 return reply({jobId:out.id,status:out.status,phase:out.phase,queuePosition:out.queuePosition,pollAfterMs:2000,model:out.model},202,origin);
}
export async function verifyEvidence(request,env={}){
 const location=new URL(request.url),origin=request.headers.get('Origin');
 const allowOrigin=origin===location.origin?origin:ORIGIN;
 if(origin&&origin!==ORIGIN&&origin!==location.origin)return fail('ORIGIN_DENIED',403,ORIGIN);
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':allowOrigin,'Access-Control-Allow-Methods':'POST, GET, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Cache-Control':'no-store','Vary':'Origin'}});
 if(!['GET','POST'].includes(request.method))return fail('METHOD_NOT_ALLOWED',405,allowOrigin);
 const key=env.GEMMA_API_KEY||env.LFM_API_KEY;
 if(env.AI_VERIFY_ENABLED!=='true'||!key)return fail('NOT_CONFIGURED',503,allowOrigin);
 let endpoint,options;
 if(request.method==='GET'){
  const id=location.searchParams.get('job');if(!validId(id))return fail('INVALID_JOB_ID',400,allowOrigin);
  endpoint=API+'/jobs/'+id;options={method:'GET'};
 }else{
  if(!(request.headers.get('Content-Type')||'').toLowerCase().includes('application/json'))return fail('JSON_REQUIRED',415,allowOrigin);
  let input;try{input=await readInput(request)}catch(e){return fail(e.message==='BODY_SIZE'?'BODY_SIZE':'INVALID_REQUEST',e.message==='BODY_SIZE'?413:400,allowOrigin)}
  if(!input||typeof input!=='object'||Array.isArray(input))return fail('INVALID_REQUEST',400,allowOrigin);
  const requestId=input.requestId;
  if(typeof requestId!=='string'||!/^[a-zA-Z0-9_-]{16,100}$/.test(requestId))return fail('REQUEST_ID_REQUIRED',400,allowOrigin);
  const {requestId:_,...payload}=input;
  const studentText=JSON.stringify(payload.initial||{});
  if(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(studentText)||/01[016789][-\s]?\d{3,4}[-\s]?\d{4}/.test(studentText))return fail('PERSONAL_INFORMATION',400,allowOrigin);
  endpoint=API+'/jobs';options={method:'POST',body:JSON.stringify({kind:'verify',input:payload})};
  options.idempotency='web-'+requestId;
 }
 try{
  const headers={'Authorization':'Bearer '+key,'Content-Type':'application/json'};
  if(options.idempotency)headers['Idempotency-Key']=options.idempotency;
  const response=await fetch(endpoint,{method:options.method,body:options.body,headers,redirect:'error',signal:AbortSignal.timeout(15000)});
  const out=await response.json().catch(()=>({}));
  if(!response.ok)return fail(out.error?.code||'GEMMA_UPSTREAM',[400,404,409,413].includes(response.status)?response.status:502,allowOrigin);
  return mapJob(out,allowOrigin);
 }catch(e){return fail(e.name==='TimeoutError'||e.name==='AbortError'?'GEMMA_NETWORK_TIMEOUT':'GEMMA_CONNECTION',502,allowOrigin)}
}
export default {fetch:verifyEvidence};
