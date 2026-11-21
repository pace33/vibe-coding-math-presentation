const REGIONS = ['전체','청주시','충주시','제천시','보은군','옥천군','영동군','증평군','진천군','괴산군','음성군','단양군'];
const ORIGIN = 'https://pace33.github.io';
const requests = new Map();
const responses = new Map();

async function fetchFeed(target, service, signal) {
  const upstream = await fetch(target,{signal,redirect:'manual',headers:{Accept:'application/rss+xml, application/xml, text/xml'}});
  if (!upstream.ok) throw Error(service+' HTTP '+upstream.status);
  const reader = upstream.body.getReader();
  const chunks = [];
  let size = 0;
  while (true) {
    const {done,value} = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 650000) { await reader.cancel(); throw Error('RSS size limit'); }
    chunks.push(value);
  }
  const xml = await new Blob(chunks).text();
  if (!/<rss[\s>]/.test(xml) || !/<channel[\s>]/.test(xml) || !/<\/rss>\s*$/.test(xml) || /<!DOCTYPE|<!ENTITY/i.test(xml)) throw Error('Invalid RSS');
  return {xml,service};
}

export async function news(request, edgeCache) {
  const headers = {'Access-Control-Allow-Origin': ORIGIN, 'Access-Control-Allow-Methods':'GET, OPTIONS', 'X-Content-Type-Options':'nosniff', 'Cache-Control':'no-store'};
  const fail = (status, error) => Response.json({error}, {status, headers});
  const origin = request.headers.get('Origin');
  if (origin && origin !== ORIGIN && origin !== new URL(request.url).origin) return fail(403, '허용되지 않은 웹사이트입니다.');
  if (request.method === 'OPTIONS') return new Response(null, {status:204, headers});
  if (request.method !== 'GET') return fail(405, 'GET 요청만 지원합니다.');
  const params = new URL(request.url).searchParams;
  const region = params.get('region') || '전체';
  const category = params.get('category') || 'news';
  const keyword = (params.get('keyword') || '').trim();
  if (!REGIONS.includes(region) || !['news','local','business'].includes(category) || keyword.length > 85 || /[\u0000-\u001f]/.test(keyword)) return fail(400, '검색 조건을 확인해 주세요.');
  const term = keyword.replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g,' ').trim() || ({business:'기업',local:'축제'}[category] || '');
  const feed = new URL('https://news.google.com/rss/search');
  feed.search = new URLSearchParams({q:[region === '전체' ? '충북' : '충북 '+region,term,'when:30d'].filter(Boolean).join(' '),hl:'ko',gl:'KR',ceid:'KR:ko'});
  const cacheKey = new Request(new URL('/cached?'+feed.searchParams.toString(), request.url));
  const stored = responses.get(feed.href);
  if (stored && stored.expires > Date.now()) return stored.response.clone();
  if (edgeCache) { try { const cached = await edgeCache.match(cacheKey); if (cached) return cached; } catch {} }
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) {
    const now = Date.now();
    const previous = requests.get(ip);
    const bucket = previous && now < previous.until ? previous : {count:0,until:now+60000};
    bucket.count++;
    requests.set(ip,bucket);
    if (requests.size > 2000) requests.delete(requests.keys().next().value);
    if (bucket.count > 30) return new Response(JSON.stringify({error:'잠시 후 다시 검색해 주세요.'}),{status:429,headers:{...headers,'Content-Type':'application/json','Retry-After':'60'}});
  }
  const controller = new AbortController();
  const timeout = setTimeout(()=>controller.abort(),8000);
  try {
    const bing = new URL('https://www.bing.com/news/search');
    bing.search = new URLSearchParams({q:[region === '전체' ? '충북' : region,term].filter(Boolean).join(' '),format:'rss',setlang:'ko',cc:'kr'});
    let empty;
    const attempts = [[feed,'Google News RSS'],[bing,'Bing News RSS']].map(async ([target,service])=>{
      const result = await fetchFeed(target,service,controller.signal);
      if (!/<item[\s>]/.test(result.xml)) { empty=result; throw Error('Empty RSS'); }
      return result;
    });
    let result;
    try { result = await Promise.any(attempts); } catch (error) { if (!empty) throw error; result=empty; }
    controller.abort();
    const response = new Response(result.xml,{headers:{...headers,'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=60, s-maxage=300','X-News-Provider':result.service,'X-News-Fetched-At':new Date().toISOString(),'Access-Control-Expose-Headers':'X-News-Fetched-At, X-News-Provider'}});
    responses.set(feed.href,{response:response.clone(),expires:Date.now()+300000});
    if (responses.size > 20) responses.delete(responses.keys().next().value);
    if (edgeCache) { try { await edgeCache.put(cacheKey,response.clone()); } catch {} }
    return response;
  } catch (error) {
    console.error('news_upstream_error',error.name,error.message);
    return fail(controller.signal.aborted ? 504 : 502,'뉴스 검색 연결이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.');
  } finally { clearTimeout(timeout); }
}

export default {
  async fetch(request) {
    if (new URL(request.url).pathname !== '/api/news') return Response.json({service:'LocalCheck News',endpoint:'/api/news',provider:'Google News RSS'});
    let edgeCache;
    try { edgeCache = await globalThis.caches?.open('localcheck-news-v1'); } catch {}
    return news(request,edgeCache);
  }
};
