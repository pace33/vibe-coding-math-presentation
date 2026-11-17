export function GET() {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  const hasCode = Boolean(process.env.APP_ACCESS_CODE);
  return Response.json({
    connected: hasKey && hasCode,
    codeRequired: true,
    message: !hasKey ? 'GEMINI_API_KEY를 설정해야 합니다.' :
      !hasCode ? 'APP_ACCESS_CODE를 설정해야 합니다.' : '검색 준비 완료'
  }, { headers: { 'Cache-Control': 'no-store' } });
}
export function POST() {
  return Response.json({error:'GET 요청만 허용합니다.'},{status:405});
}
