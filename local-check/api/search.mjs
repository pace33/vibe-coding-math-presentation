
const BASE='https://generativelanguage.googleapis.com/v1beta/models/';
const CATS=['지역 현황','지역 특징','지역 행사','최신 뉴스','주요 사업'];
const s=(v,max=500)=>String(v??'').trim().slice(0,max);
const error=(message,status=500)=>Response.json({error:message},{status,headers:{'Cache-Control':'no-store'}});
function validURL(raw){try{const u=new URL(String(raw));return ['http:','https:'].includes(u.protocol)?u.href:'';}catch{return '';}}
function date(raw){const x=s(raw,24);return /^\d{4}-\d{2}(-\d{2})?$/.test(x)?x:'확인 필요';}
function sourceType(url){try{const h=new URL(url).hostname.toLowerCase();return h==='korea.kr'||h.endsWith('.go.kr')||h.endsWith('.gov.kr')||h==='kosis.kr'?'official':'other';}catch{return 'other';}}
async function ask(key,model,data,timeout){
  const r=await fetch(BASE+encodeURIComponent(model)+':generateContent',{
    method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':key},
    body:JSON.stringify(data),signal:AbortSignal.timeout(timeout)
  });
  const j=await r.json().catch(()=>({}));
  if(!r.ok){if(r.status===429)throw Error('API 사용량이 초과되었습니다. 할당량 및 결제 설정을 확인해 주세요.');throw Error('Gemini API 오류: '+s(j.error?.message||r.status,220));}
  const c=j.candidates?.[0];
  const body=(c?.content?.parts||[]).map(x=>typeof x.text==='string'?x.text:'').join('\n').trim();
  if(!body)throw Error('AI 검색 응답이 없습니다.');
  return {body,grounding:c?.groundingMetadata||{}};
}
function parseJSON(text){
  const a=s(text,50000),i=a.indexOf('{'),j=a.lastIndexOf('}');
  if(i<0||j<=i)throw Error('검색 내용을 정리하지 못했습니다.');
  return JSON.parse(a.slice(i,j+1));
}
function normalize(raw,region,today,sources){
  const ids=a=>[...new Set((Array.isArray(a)?a:[]).map(Number).filter(x=>Number.isInteger(x)&&x>=0&&x<sources.length))].slice(0,5);
  const items=(Array.isArray(raw.items)?raw.items:[]).slice(0,30).map((x,i)=>{
    const refs=ids(x.source_ids);
    return {id:String(i+1),category:CATS.includes(x.category)?x.category:'지역 특징',
      title:s(x.title,110),summary:s(x.summary,850),
      published:date(x.published),referenceDate:date(x.reference_date),eventDate:date(x.event_date),
      status:refs.length===0?'needs_check':x.status==='planned'?'planned':x.status==='needs_check'?'needs_check':'sourced',
      caution:s(x.caution||'출처 원문을 직접 확인하세요.',330),sourceIds:refs};
  }).filter(x=>x.title&&x.summary);
  const comparisons=(Array.isArray(raw.comparisons)?raw.comparisons:[]).slice(0,5).map((x,i)=>({
    id:String(i+1),title:s(x.title,130),a:s(x.a,260),b:s(x.b,260),explanation:s(x.explanation,500),sourceIds:ids(x.source_ids)
  })).filter(x=>x.title&&x.a&&x.b&&x.explanation&&x.sourceIds.length);
  const highlights=(Array.isArray(raw.highlights)?raw.highlights:[]).slice(0,4).map(x=>({
    label:s(x.label,50),value:s(x.value,70),note:s(x.note,130)
  })).filter(x=>x.label&&x.value);
  return {region,asOf:today,summary:s(raw.summary,650),modelGenerated:true,highlights,items,comparisons,sources,
    categories:CATS};
}
function research(region,today){
  return [
    '오늘은 '+today+'입니다. 대한민국 '+region+'의 지역 정보를 조사합니다.',
    '반드시 실재하는 웹페이지를 검색해 공공기관 원문과 지역 언론을 교차 확인하세요.',
    '지역 현황, 지역 특징, 지역 행사, 최신 뉴스, 주요 사업의 5가지 분야를 각각 2~4건, 총 10~18건 조사하세요.',
    '최근 1년 자료를 우선 활용하고 군청, 시청, 구청, 행정안전부, KOSIS, 교육청 등 공식 자료를 최우선으로 하세요.',
    '발표일과 실제 통계 기준일, 행사 개최일을 구분하고, 모르면 확인 필요라고 쓰세요.',
    '주민등록 인구와 외국인 포함 인구를 혼동하지 마세요.',
    '공약·협약·계획·진행·완공·운영 여부를 엄격히 구분하세요.',
    '서로 수치나 설명이 다른 자료가 있다면 기준일과 포함범위를 비교하세요. 실제 사례가 없으면 비교를 만들지 마세요.',
    '숫자나 링크를 지어내지 마세요. 자료가 없으면 조사하지 못했다고 명시하세요.',
    '내용은 한국어로 분야별 소제목 아래에 조사해 주세요.'
  ].join('\n');
}
function extract(region,today,body,sources){
  return [
    '아래 검색 조사 메모만 참고하여 JSON 객체 하나만 작성하세요. 새로운 정보나 링크를 만들지 마세요.',
    '지역: '+region+' 기준일: '+today,
    '조사메모:\n'+body.slice(0,22000),
    '검색 근거(지정한 번호 외 사용 금지):\n'+sources.map(x=>'['+x.id+'] '+x.title+' '+x.url).join('\n'),
    '반환 JSON 예시: {"summary":"요약","highlights":[{"label":"인구","value":"확인된 수치 또는 확인 필요","note":"기준일"}],"items":[{"category":"지역 현황","title":"제목","summary":"설명","published":"YYYY-MM-DD 또는 확인 필요","reference_date":"YYYY-MM-DD 또는 확인 필요","event_date":"YYYY-MM-DD 또는 확인 필요","status":"sourced|planned|needs_check","caution":"주의사항","source_ids":[0]}],"comparisons":[{"title":"비교 제목","a":"자료 A","b":"자료 B","explanation":"기준과 차이","source_ids":[0,1]}]}',
    'items 10~18개를 목표로 하되 근거 없으면 적게 작성합니다. 5개 분야를 고루 다룹니다.',
    'source_ids는 위 근거가 실제로 그 주장을 뒷받침할 때만 연결합니다. 출처 없으면 빈 배열과 needs_check.',
    '계획·공약·추진·협약 체결 사업은 planned. sourced는 출처 연결만 의미하며 원문 검증 완료가 아닙니다.',
    '상충 사례는 관련 출처가 2개 이상일 때만 작성하세요. 확인되지 않은 날짜에 임의의 일을 붙이지 마세요.',
    '초등 고학년이 이해할 수 있는 한국어로 작성하세요.'
  ].join('\n\n');
}
export async function POST(request){
  if(!(request.headers.get('content-type')||'').includes('application/json'))return error('JSON 요청만 허용됩니다.',415);
  const key=process.env.GEMINI_API_KEY, code=process.env.APP_ACCESS_CODE;
  if(!key||!code)return error('운영자가 Vercel 환경 변수 GEMINI_API_KEY와 APP_ACCESS_CODE를 설정해야 합니다.',503);
  let body;try{body=await request.json();}catch{return error('요청 내용을 읽을 수 없습니다.',400);}
  if(body.accessCode!==code)return error('접근 코드가 올바르지 않습니다.',401);
  const region=s(body.region,60).replace(/[\r\n<>]/g,' ').replace(/\s+/g,' ').trim();
  if(region.length<2||region.length>45||!/^[\p{L}\p{N}\s,().·-]+$/u.test(region))return error('시·군·구 이름을 정확히 입력해 주세요.',400);
  const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const model=process.env.GEMINI_MODEL||'gemini-2.5-flash';
  try{
    const found=await ask(key,model,{contents:[{role:'user',parts:[{text:research(region,today)}]}],
      tools:[{googleSearch:{}}],generationConfig:{temperature:0.2,maxOutputTokens:6000}},33000);
    const sources=[], seen=new Set();
    for(const c of found.grounding.groundingChunks||[]){
      const url=validURL(c.web?.uri);
      if(url&&!seen.has(url)){seen.add(url);sources.push({id:sources.length,title:s(c.web.title||'검색 근거',140),url,type:sourceType(url)});}
      if(sources.length>=35)break;
    }
    if(!sources.length)return error('검색 결과에서 인용 가능한 출처를 찾지 못했습니다. 지역명을 구체적으로 입력해 주세요.',422);
    const parsed=await ask(key,model,{contents:[{role:'user',parts:[{text:extract(region,today,found.body,sources)}]}],
      generationConfig:{temperature:0.1,responseMimeType:'application/json',maxOutputTokens:7400}},19000);
    const result=normalize(parseJSON(parsed.body),region,today,sources);
    if(!result.items.length)return error('검색 자료를 목록으로 구성하지 못했습니다. 다시 시도해 주세요.',422);
    return Response.json(result,{headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
  }catch(e){return error(e.name==='TimeoutError'||e.name==='AbortError'?'검색 시간이 초과되었습니다. 다시 시도해 주세요.':s(e.message,260),502);}
}
export function GET(){return error('POST 요청만 허용합니다.',405);}
