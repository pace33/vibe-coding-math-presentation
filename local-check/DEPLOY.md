# 로컬체크 · 전국 실시간 검색 배포 안내

## 원본 코드
- GitHub: https://github.com/pace33/vibe-coding-math-presentation/tree/main/local-check
- 기존 공개 체험판: https://pace33.github.io/vibe-coding-math-presentation/local-check/
- 체험판은 GitHub Pages이므로 실시간 API 실행이 불가능합니다.

## Vercel 배포
1. https://vercel.com/new 에서 GitHub 계정으로 로그인합니다.
2. **Import Git Repository**에서 `pace33/vibe-coding-math-presentation`를 선택합니다.
3. **Project Name**: 예) `local-check-korea`
4. **Root Directory**를 정확히 `local-check`로 지정합니다. 최상위 경로가 아닙니다.
5. Framework Preset: **Other**, Build Command: 없음, Output Directory: 기본값 유지.
6. Environment Variables에 아래를 추가합니다.
   - `GEMINI_API_KEY`: Google AI Studio에서 발급한 Gemini API 키
   - `APP_ACCESS_CODE`: 사용자에게 별도 안내할 강력한 접근 코드 (API 오남용 방지)
   - `GEMINI_MODEL`: 생략 가능, 기본값 `gemini-2.5-flash`
7. Deploy를 누른 뒤 발급된 `*.vercel.app` 주소로 접속합니다.
8. `https://<프로젝트주소>/api/status`를 열어 `"connected": true`인지 확인합니다. 그렇지 않으면 환경 변수 또는 재배포 상태를 확인합니다.
9. 검색창에 `충청북도 음성군`, `경기도 수원시` 등을 입력하고 접근 코드를 넣어 검색해 봅니다.

**주의:** 키와 접근 코드는 GitHub 코드·HTML·채팅창에 붙여 넣지 말고 Vercel 서버 환경 변수에만 저장하세요.  공개 서비스는 Gemini 사용량·요금 제한을 꼭 설정하세요. `APP_ACCESS_CODE`가 비어 있으면 서버 검색이 작동하지 않도록 만들었습니다.

## 확인된 사항과 남은 검증
- GitHub 저장소의 HTML, API 코드, PWA 자산은 등록되었습니다.
- Vercel에 프로젝트가 실제 배포됐는지, 외부 Gemini API가 호출되는지는 배포 후에 확인해야 합니다.
- AI가 링크를 제시해도 해당 사실이 검증 완료된 것은 아닙니다. 발표일·기준일·근거를 직접 확인하세요.
