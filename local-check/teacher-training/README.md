# 교과서의 뉴스 탐구, 우리 지역 수업으로 — 초등교원 연수

- 발표 웹앱: https://pace33.github.io/vibe-coding-math-presentation/local-check/teacher-training/
- 학생용 웹앱: https://pace33.github.io/vibe-coding-math-presentation/local-check/student/
- 원본 발표자료: https://pace33.github.io/vibe-coding-math-presentation/
- 일시: 2026. 11. 25.(수) 15:00–17:00
- 대상: 초등교원 / 발표 방식: 수업사례 소개와 화면 이미지 시연, 참가자 직접 제작 실습 없음

## 전체 흐름 · 44장

| 페이지 | 내용 |
| --- | --- |
| 1~14 | 교재 활동을 우리 지역 자료로 실행하는 어려움, 뉴스 검색, 음성·옥천 실제 기사 비교, 수업 근거 |
| 15 | **구분 슬라이드: 웹앱 제작 방법** |
| **16~29** | 웹앱을 만든 전체 구조, 교사의 기능 명세, 사용 도구의 역할, 실행 가능한 1차 화면, 지역자료 구축, 뉴스 RSS 서버, 검증·기록, 실제 수정 요청, 검사와 배포 |
| 30 | **구분 슬라이드: 지역별 웹앱 기능** |
| 31~38 | 자연환경·생활시설·산업과 경제·역사문화·뉴스·검증·저장 등 기능 소개 |
| 39 | **구분 슬라이드: 실제 수업 적용** |
| 40~44 | 수업 질문, 40분 수업 흐름, 평가, 결론, 출처 |

**4개 구분 슬라이드 유지.** 처음 만족도가 높았던 음성군·옥천군 실제 기사 좌우 비교형 슬라이드는 6~7장에 유지.

## 15~29장 개편 원칙

기존 슬라이드는 짧은 수정 프롬프트를 웹앱 전체 제작 방법처럼 설명해 오해 소지가 있었습니다. 이를 완전히 구분합니다.

1. **교사가 먼저 정하는 일:** 사회 교과서 과제 → 학생 행동 → 화면·자료·저장 방식 → 검사 기준
2. **화면 제작:** 뉴스 찾기 / 우리 지역 / 탐정 게시판의 동작과 11개 시·군 선택 UI
3. **공공자료:** 실제 지명·통계·행사·시설을 출처·기준일과 함께 연결
4. **실시간 뉴스:** GitHub Pages와 별개로 server/news.mjs가 구글 뉴스 RSS·빙 뉴스 RSS를 가져오는 방식. 단순 프롬프트나 정적 파일만으로 해결되지 않음
5. **학생의 검증:** 뉴스 원문 읽기 → 공공자료 비교 → '같아요/달라요/아직 모르겠어요' 판단과 이유 기록
6. **기록·배포:** board.js의 브라우저 localStorage 및 링크 공유(학급 서버 자동 공유 아님), GitHub Pages 배포와 뉴스 서버 운영 구분
7. **검사:** 문법/데이터 개수 검사 외에 실제 뉴스 검색·기사 없음·검색 실패·모바일 화면·출처 링크 검사를 별도로 시행

### 프롬프트 진위 표기

- 발표자료 속 1차 화면, 데이터, 뉴스, 검증 기능 프롬프트는 **재사용 가능한 연수용 예시**입니다. 실제 최초 제작 대화의 원문이라고 표시하지 않습니다.
- 실제 대화에서 나온 짧은 문장은 27쪽에 **이미 만든 앱의 구체적 수정 사례**로 배치했습니다.
- 각 슬라이드의 발표자 메모에 파일 역할, 구현 제약, 교육적 주의사항을 더 자세히 설명했습니다.

## 실제 소스 파일

- [학생용 `index.html`](https://github.com/pace33/vibe-coding-math-presentation/blob/main/local-check/student/index.html) — 메뉴·폼·화면
- [학생용 `app.js`](https://github.com/pace33/vibe-coding-math-presentation/blob/main/local-check/student/app.js) — 메뉴 상태·뉴스 선택·검증 흐름
- [지역 자료 `regional-basics.js`](https://github.com/pace33/vibe-coding-math-presentation/blob/main/local-check/student/regional-basics.js) — 기초정보·지역 자료
- [뉴스 요청 `live-news.js`](https://github.com/pace33/vibe-coding-math-presentation/blob/main/local-check/student/live-news.js) — RSS 서버 요청
- [뉴스 서버 `server/news.mjs`](https://github.com/pace33/vibe-coding-math-presentation/blob/main/local-check/server/news.mjs) — 구글·빙 RSS 제공처 조회
- [탐정 게시판 `board.js`](https://github.com/pace33/vibe-coding-math-presentation/blob/main/local-check/student/board.js) — 브라우저 저장·링크 공유

## 교육과정과 지역교재 근거

- 사회 [4사09-01], [4사09-02]: 2022 개정 사회과 지역 문제 및 지역 탐구
- 국어 [6국06-02]: 뉴스 등 정보 매체의 신뢰성 평가
- 경기도교육청 4학년 2학기 지역화 교재 사례: https://www.goe.go.kr/resource/old/BBSMSTR_000000030222/BBS_202503311108019371.pdf
- 인천광역시교육청 초등 4학년 사회 서·논술형 평가 자료: https://www.ice.go.kr/upload/ice/na/bbs_1630/2026/02/99349a5278e3ed9b63bb236e6ca06d29.pdf

## 발표 조작

←/→ 전후 슬라이드, Home/End 처음·마지막, O 목차, N 발표 메모, F 전체화면. 아래 PDF 저장 메뉴는 전체 슬라이드 인쇄를 호출합니다.

이 발표자료는 학생용 웹앱 및 루트 원본 발표자료와 별도 폴더에 저장됩니다. 학생용 앱 기능이나 뉴스 서버는 이번 발표자료 개편 과정에서 수정하지 않았습니다.
