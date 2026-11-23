(() => {
"use strict";
/* 사회과 성취기준은 국립특수교육원 2022 개정 공통교육과정 사회과 성취수준 자료 참고.
 * 국어 매체 영역은 경기도교육청 2025 자료의 [6국06-02] 참고.
 * '사용자 요청 원문'은 실제 프로젝트 대화에서 확인한 문장만 표기합니다.
 * 초기 설계 프롬프트는 원문 전문을 확인하지 못했으므로 '취지 재구성'으로 표시합니다.
 */
const SOCIAL_SRC="https://www.nise.go.kr/ebook/src/viewer/download.php?host=main&no=1&site=20240819_172144";
const KOREAN_SRC="https://www.goe.go.kr/resource/old/BBSMSTR_000000030222/BBS_202504210452515481.pdf";
const SITE="https://pace33.github.io/vibe-coding-math-presentation/local-check/student/";
const github="https://github.com/pace33/vibe-coding-math-presentation/tree/main/local-check";
const code=(id,text,summary,ref)=>'<div class="standard-block"><div class="standard-head"><span class="standard-code">'+id+'</span><span>2022 개정 교육과정</span></div><strong class="standard-text">'+text+'</strong><p>'+summary+'</p><a href="'+ref+'" target="_blank" rel="noopener noreferrer">성취기준 원문·설명자료 확인 ↗</a></div>';
const quote=(s,kind)=>'<div class="prompt-example"><span class="prompt-type">'+kind+'</span><blockquote>'+s+'</blockquote></div>';
const small=(s)=>'<p class="fineprint">'+s+'</p>';
const list=(items)=>'<div class="big-list">'+items.map((v,i)=>'<div class="big-list-row"><span>'+String(i+1).padStart(2,"0")+'</span><strong>'+v+'</strong></div>').join("")+'</div>';
const compare=(a,b)=>'<div class="comparison"><div><small>'+a[0]+'</small><strong>'+a[1]+'</strong><p>'+a[2]+'</p></div><div><small>'+b[0]+'</small><strong>'+b[1]+'</strong><p>'+b[2]+'</p></div></div>';
const flow=(items)=>'<div class="simple-flow">'+items.map((v,i)=>'<div class="flow-step"><small>'+String(i+1).padStart(2,"0")+'</small><strong>'+v+'</strong></div>').join("")+'</div>';
const target=(social,subject)=>'<div class="goal-line"><span>'+social+'</span><strong>'+subject+'</strong></div>';
const SLIDES=[
{
 id:"cover",section:"시작",type:"cover",kicker:"초등교원 연수 · 2026.11.25",
 title:"교과서 속 뉴스 탐구,\n우리 지역 웹앱으로",
 lead:"사회과 탐구 수업에서 출발한 AI 웹앱 제작 사례",
 body:'<p class="cover-caption">인성교육 현장적용 활동 사례 연구 1<br>15:00–17:00 · 초등교원 대상</p>',
 image:"assets/02-menu.svg",
 note:"연수의 핵심은 웹앱 홍보가 아닙니다. 2022 개정 사회과의 지역 문제 탐구 및 지역 이해, 5~6학년 국어의 뉴스 신뢰성 평가 활동을 실제 교실에서 어떻게 돕는지 보여주는 제작 사례입니다. 참가자 직접 코딩 실습은 없습니다."
},
{
 id:"section-need",section:"교과서 근거",type:"section",kicker:"PART 01",title:"교과서의 어떤 활동에서\n출발했을까요?",
 lead:"교육과정에서 출발해 수업의 불편함을 찾았습니다.",
 body:'<div class="section-number">01 <span>TEXTBOOK → TASK</span></div>',
 note:"개별 검정 교과서의 출판사·판본·쪽수는 현재 특정되지 않았습니다. 따라서 출판사별 교과서 문장을 임의로 만들어 인용하지 않고 2022 개정 사회과 성취기준과 공식 교수학습 도움자료에서 확인되는 탐구 활동을 근거로 사용했습니다."
},
{
 id:"social-problem",section:"교과서 근거",kicker:"사회 3~4학년군 · 지역 문제",title:"지역의 문제를 찾아\n근거를 모으고 해결합니다",
 body:code("[4사09-01]","생활 주변에서 찾을 수 있는 여러 가지 문제를 파악하고, 그 문제를 합리적으로 해결하는 능력을 기른다.","참고자료는 지역 뉴스·신문, 공공기관 누리집 등을 조사 방법으로 제시합니다.",SOCIAL_SRC),
 note:"[4사09-01]은 지역사회 문제의 조사와 합리적인 해결에 관한 사회과 성취기준입니다. 국립특수교육원 자료에는 '지역 뉴스를 살펴본다', '공공기관 누리집을 통해 주민이 요청한 내용을 살펴본다'라는 세분화 활동 예시가 있습니다. 이 부분이 뉴스 찾기 기능의 직접적인 수업 근거입니다."
},
{
 id:"social-region",section:"교과서 근거",kicker:"사회 3~4학년군 · 지역 이해",title:"지역의 자연·역사·문화·생산물을\n살펴봅니다",
 body:code("[4사09-02]","지역의 자연환경, 역사, 문화, 생산물 등을 알리려는 지역사회의 노력을 알고 관심을 갖는다.","지역의 특징을 조사하고 문화·축제·생산물을 찾아보는 활동으로 연결했습니다.",SOCIAL_SRC),
 note:"[4사09-02]는 지역 이해와 지역사회 활동을 탐구하는 성취기준입니다. 그래서 자연환경·생활시설·산업과 경제·역사와 문화 등의 대표 정보를 학생용 카드로 보여주도록 설계했습니다. 이 6개 분야는 웹앱을 위해 재구성한 메뉴이지 교과서의 공식 여섯 영역이라는 뜻은 아닙니다."
},
{
 id:"korean-media",section:"교과서 근거",kicker:"국어 5~6학년군 · 매체",title:"뉴스가 믿을 만한지\n따져 보는 기준도 있습니다",
 body:code("[6국06-02]","뉴스 및 각종 정보 매체 자료의 신뢰성을 평가한다.","작성 주체 · 정보 출처 · 근거를 종합적으로 살펴보도록 안내합니다.",KOREAN_SRC),
 note:"뉴스의 신뢰성 평가를 직접적으로 명시하는 성취기준은 사회가 아니라 국어과 [6국06-02]입니다. 사회의 지역문제 탐구를 국어의 매체 신뢰성 평가와 연결하는 교과 연계 설계라는 점을 정확하게 설명합니다."
},
{
 id:"curriculum-model",section:"교과서 근거",kicker:"사회 × 국어 연계",title:"교과서의 탐구 과정을\n웹앱의 학습 흐름으로",
 body:flow(["지역 문제 발견","기사·공공자료 수집","출처·근거 비교","판단하고 기록"]),
 note:"사회과에서 지역 문제를 발견하고 뉴스와 공공기관 자료를 찾습니다. 국어과 매체 역량으로 출처와 근거를 평가한 다음 판단의 이유를 기록합니다. 이 4단계 흐름은 교육과정 성취기준들을 결합해 교사가 설계한 모델이지 어느 한 교과서에 그대로 제시된 4단계 명칭이 아닙니다."
},
{
 id:"gap",section:"교과서 근거",kicker:"수업 장면의 문제",title:"“뉴스를 찾아보세요” 다음에\n학생은 무엇을 하나요?",
 body:compare(["검색까지만 할 때","기사 발견","제목을 읽고 곧바로 사실로 받아들일 수 있습니다."],["탐구를 이어갈 때","자료 비교","누가 썼는지, 언제인지, 무엇을 근거로 하는지 확인합니다."]),
 note:"교실에서의 문제는 검색 자체가 아니라 검색 이후의 활동이 사라진다는 점입니다. 교과서의 탐구 활동을 학생들이 실제 수행할 수 있도록 단계별 학습 장치를 넣은 것이 제작의 출발점입니다. 학생이 무조건 뉴스가 틀렸다고 판단하게 하는 것은 목표가 아닙니다."
},
{
 id:"design-question",section:"교과서 근거",kicker:"설계의 출발",title:"“뉴스 찾기”가 아니라\n“뉴스 검증하기”가 필요했습니다",
 body:'<div class="big-quote">찾기 → 확인하기 → 비교하기 → 판단하기</div>',
 note:"뉴스를 검색하는 검색창을 만드는 것만으로는 교과서의 비판적 탐구가 구현되지 않습니다. 기사 원문과 날짜, 공식 근거 자료, 다른 기사 등을 찾을 수 있어야 하며, 학생의 생각이 기록으로 남아야 합니다."
},
{
 id:"section-build",section:"실제 프롬프트",type:"section",kicker:"PART 02",title:"AI에게 어떤 말을 했고,\n어떻게 고쳤을까요?",
 lead:"실제 사용한 수정 요청을 중심으로 제작 과정을 보여줍니다.",
 body:'<div class="section-number">02 <span>PROMPT → REVISION</span></div>',
 note:"다음 슬라이드에서 초기 설계 프롬프트는 취지를 재구성해 제시하고, 이후 화면과 기능을 바꾸기 위한 일부 요청문은 과거 실제 대화에서 확인한 문장을 원문 그대로 제시합니다. 둘을 혼동하지 않습니다."
},
{
 id:"seed-prompt",section:"실제 프롬프트",kicker:"초기 설계 의도 · 재구성",title:"첫 요청의 핵심은\n‘학생이 검증하는 웹앱’",
 body:quote("초등학생이 우리 지역의 뉴스와 공공기관 자료를 찾아보고, 출처와 날짜를 확인하고, 서로 비교해 판단할 수 있는 웹앱을 만들어 줘.","초기 요구 취지 재구성 · 최초 프롬프트 원문 아님")+
 small("※ 최초 요청 전문은 확보되지 않아 당시 설계 의도를 요약했습니다."),
 note:"이 문장은 실제 프로젝트 초기의 여러 요구 사항을 강의용으로 묶어 재구성한 예시이며, 따옴표가 있어도 최초 대화의 원문 인용은 아닙니다. 출처 확인, 지역 뉴스, 공공기관 비교, 초등학생용 화면이라는 요구가 결합된 것입니다."
},
{
 id:"prompt-basics",section:"실제 프롬프트",kicker:"실제 수정 요청 ① · 기본정보",title:"정보를 찾게 하기 전에\n핵심 사실을 보여 달라",
 body:quote("이런 기본 정보는 바로 저 공간에서 간단하게라도 정보가 보이게 해줘","실제 제작 대화의 요청 원문")+
 small("결과: 위치·행정구역·인구·면적을 카드에 직접 표시하고 기준일을 추가"),
 note:"처음에는 검색 버튼과 '공식 자료에서 확인하세요'라는 안내가 반복되었습니다. 이후 기초 정보는 화면에 바로 보이게 하고 인구와 면적의 기준일·출처를 제시하도록 수정했습니다. 교사가 화면을 직접 보고 구체적으로 요청한 사례입니다."
},
{
 id:"prompt-verify",section:"실제 프롬프트",kicker:"실제 수정 요청 ② · 검증 흐름",title:"“읽고 끝나는 화면”을\n“검증하고 기록하는 화면”으로",
 body:quote("우리지역메뉴에서 세부분야도 검증뉴스로 검증해야하는데 검증게시판으로 이동하는 방법이 없어 추가해줘","실제 제작 대화의 요청 원문")+
 small("결과: 세부 분야 → 관련 뉴스 → 출처·근거 검증 → 탐정 게시판"),
 note:"지역정보를 보기만 해서는 학생이 탐구의 다음 단계로 넘어갈 수 없었습니다. 지역의 여섯 분야 어느 곳에서도 뉴스 검증과 탐정 게시판으로 이어지도록 요구해 기능을 수정했습니다."
},
{
 id:"prompt-provider",section:"실제 프롬프트",kicker:"실제 수정 요청 ③ · 제공처",title:"AI가 만든 안내 문구도\n사실인지 확인해야 합니다",
 body:quote("빙이면 빙 구글이면 구글링크인지 확인해서 정확히 문구 넣어줘","실제 제작 대화의 요청 원문")+
 small("결과: 실제 RSS 제공자에 따라 구글·빙 뉴스 링크와 문구 변경"),
 note:"뉴스 서버는 구글 뉴스 RSS와 빙 뉴스 RSS를 사용하지만 화면 안내가 구글로 고정돼 있었습니다. 실제 응답 헤더를 확인하고, 구글이면 구글, 빙이면 빙 링크가 보이도록 변경했습니다. 이 사례는 앱 제작 자체에도 검증 능력이 필요하다는 점을 잘 보여줍니다."
},
{
 id:"prompt-coverage",section:"실제 프롬프트",kicker:"실제 수정 요청 ④ · 지역성",title:"축제와 견학 정보도\n교과 내용에서 확장했습니다",
 body:'<div class="double-prompts">'+quote("역사와 문화에서 축제나 예술 축제 이런것들도 추가되게","실제 요청 원문")+
 quote("자연환경 공공기관 박물관 미술관 이런것들도 견학이 가능한곳은 항목에 필수로 넣어줘","실제 요청 원문")+'</div>',
 note:"[4사09-02]에 있는 지역의 역사·문화·생산물 탐색과 연결하여 지역 축제 자료를 확장하고, 지역의 자연 및 공공기관을 현장체험 자료와 연결하도록 요구했습니다. 체험 자료는 예약·단체협의·일반관람 여부를 구별했으며, 실제 예약 여부는 재확인이 필요합니다."
},
{
 id:"prompt-anatomy",section:"실제 프롬프트",kicker:"교사에게 필요한 AI 요청 방식",title:"좋은 요청은\n네 가지가 분명합니다",
 body:list(["누가 사용할지: 초등학생","무엇을 배울지: 지역 뉴스 검증","어떤 근거가 필요한지: 공공기관·원문","어떻게 확인할지: 화면·링크·결과 테스트"]),
 note:"대화에서 드러난 요청 구조를 교사용으로 정리한 슬라이드입니다. AI 도구의 이름이나 명령어를 외우는 것보다 수업 목표, 학생의 행동, 검증해야 할 근거, 결과 확인 기준을 명시하는 것이 핵심입니다."
},
{
 id:"revision-loop",section:"실제 프롬프트",type:"image",kicker:"수정 전후 비교",title:"완성도는 첫 생성이 아니라\n수정 대화에서 높아졌습니다",
 lead:"중복 메뉴 제거 · 실제 숫자 표시 · 정확한 링크 연결",
 image:"assets/07-revision.svg",
 note:"이미지는 실제 앱의 수정 흐름을 재구성한 정적 안내 화면입니다. 실제 대화의 원문은 앞선 슬라이드의 인용에서 구분해 확인할 수 있습니다. GitHub에 저장되는 코드를 바꾼 다음 요소 연결·구문·개수 등을 검사했습니다."
},
{
 id:"verify-created",section:"실제 프롬프트",kicker:"AI 결과를 교사가 점검한 항목",title:"“만들어졌나요?”보다\n“정확하게 작동하나요?”",
 body:list(["지역 11곳에 자료가 빠지지 않았나?","자료의 기준일과 링크가 맞나?","뉴스 제공자·검증·저장 기능이 연결되나?"]),
 note:"코드 검사에서 데이터 개수와 연결 여부를 확인한 것과, 실제 브라우저에서 모든 원문 링크나 외부 예약 시스템까지 클릭해 검증하는 것은 다릅니다. 검증하지 못한 항목은 검증한 척하지 않는 것이 중요합니다."
},
{
 id:"section-app",section:"완성된 수업 도구",type:"section",kicker:"PART 03",title:"교과서의 탐구 흐름이\n화면에서 어떻게 구현됐을까요?",
 lead:"기능 소개보다 학습 활동과 화면의 연결을 보겠습니다.",
 body:'<div class="section-number">03 <span>TASK → INTERFACE</span></div>',
 note:"완성된 웹앱을 소개하되 홍보처럼 화면 기능을 나열하지 않습니다. 각 기능이 교과서의 어떤 활동을 돕는지 확인하며 설명합니다."
},
{
 id:"app-menu",section:"완성된 수업 도구",type:"image",kicker:"지역 주제 탐색 · [4사09-02]",title:"자연·역사·문화·생산물을\n주제별로 찾습니다",
 lead:"충북 11개 시·군 / 지역 정보 6개 분야",
 image:"assets/02-menu.svg",
 note:"웹앱의 메뉴는 교육과정 공식 분류가 아니라 탐구를 돕기 위한 교사의 재구성입니다. '뉴스 찾기 / 우리 지역 / 탐정 게시판'의 큰 메뉴와 여섯 지역 분야로 설계했습니다."
},
{
 id:"app-basics",section:"완성된 수업 도구",type:"image",kicker:"지역 공공자료 확인 · [4사09-02]",title:"공식 통계를 읽을 때\n기준일을 확인합니다",
 lead:"검색 결과 대신, 숫자와 출처를 함께 보여줍니다",
 image:"assets/03-basics.svg",
 note:"인구·면적과 같은 기초정보는 카드에 직접 표시하고 공식 출처로 연결합니다. 수치 기준일이 다른 정보를 단순 비교하면 왜곡될 수 있음을 학생에게 안내합니다. 이미지는 발표용 재구성입니다."
},
{
 id:"app-news",section:"완성된 수업 도구",type:"image",kicker:"지역 문제 발견 · [4사09-01]",title:"지역 뉴스에서 문제를 찾습니다",
 lead:"뉴스 검색은 탐구의 시작이지 사실 판정의 끝이 아닙니다",
 image:"assets/04-news.svg",
 note:"학생은 자신이 선택한 지역의 뉴스와 공공기관 자료를 찾아봅니다. 실시간 뉴스 검색은 외부 제공자의 응답에 의존하고, 검색 결과에는 검증 완료 표시가 붙지 않습니다. 제공처는 실제 구글/빙 RSS에 따라 달라집니다."
},
{
 id:"app-verify",section:"완성된 수업 도구",type:"image",kicker:"매체 신뢰성 평가 · [6국06-02]",title:"출처·근거·다른 기사를\n직접 비교합니다",
 lead:"누가 썼나 → 무엇을 근거로 하나 → 다른 자료는 어떤가",
 image:"assets/05-verify.svg",
 note:"[6국06-02]는 국어과 매체 영역의 성취기준임을 명확히 언급합니다. 3단계 검증 절차는 웹앱을 위해 교사가 구현한 활동 단계입니다. AI가 사실 여부를 자동 채점하지 않습니다."
},
{
 id:"app-record",section:"완성된 수업 도구",type:"image",kicker:"탐구 결과 표현 · 교과 연계 활동",title:"판단의 이유를\n탐정 카드에 남깁니다",
 lead:"믿는다 / 다르게 본다 / 더 확인한다 — 이유와 근거 기록",
 image:"assets/06-board.svg",
 note:"탐정 게시판은 현재 브라우저 기기에 기록을 저장합니다. 모든 학생 기록이 하나의 공용 서버에 자동 공유되는 것은 아닙니다. 탐정 카드에 개인정보를 쓰지 않도록 안내합니다."
},
{
 id:"boundaries",section:"완성된 수업 도구",kicker:"수업자료의 한계도 함께 설명",title:"웹앱은\n진실을 대신 판단하지 않습니다",
 body:compare(["웹앱이 하는 일","자료 접근","지역 자료·기사 원문·비교 기록을 연결합니다."],["학생과 교사가 할 일","근거에 따른 판단","기사의 사실 관계와 출처를 확인합니다."]),
 note:"자동 팩트체크 도구라고 설명하지 않습니다. 검색엔진에 뜬 순서나 공식기관 로고만으로 뉴스의 신뢰성을 확정하지 않습니다. 학생이 판단하고 교사가 근거의 질을 지도해야 합니다."
},
{
 id:"section-class",section:"수업 적용",type:"section",kicker:"PART 04",title:"실제 수업에서는\n어떻게 활용할까요?",
 lead:"사회 교과서의 지역 탐구 활동과 국어 매체 평가를 연결합니다.",
 body:'<div class="section-number">04 <span>CLASSROOM</span></div>',
 note:"교육과정에서 시작해 제작과 기능 연결을 확인했으므로 마지막은 실제 수업 설계와 평가로 연결합니다."
},
{
 id:"sample-question",section:"수업 적용",kicker:"초등 사회 수업 질문 · 예시 상황",title:"“우리 동네 길은\n정말 안전할까요?”",
 body:flow(["지역 안전 뉴스 찾기","시청·경찰 자료 확인","보도와 자료 비교","근거로 의견 쓰기"]),
 note:"학교 주변 어린이 보호구역 안전 문제를 예시로 제시합니다. 특정 지역의 실제 사고가 있었다고 단정하는 사례는 아닙니다. [4사09-01]과 [6국06-02]을 결합한 교사 설계 수업 사례입니다."
},
{
 id:"lesson-40",section:"수업 적용",kicker:"40분 수업 예시",title:"학생의 행동으로\n수업 흐름을 구성합니다",
 body:list(["도입 5분 · 궁금한 지역 문제 고르기","탐구 15분 · 기사와 공식자료 찾기","검증 15분 · 출처·날짜·근거 비교","정리 5분 · 판단 이유 기록하기"]),
 note:"수업 시간은 운영 예시이며 학생 연령과 디지털 접근성에 따라 교사의 모델링 시간이 더 필요할 수 있습니다. 앱 기능을 설명하는 시간보다 학생이 증거를 찾는 시간에 비중을 둡니다."
},
{
 id:"assessment",section:"수업 적용",kicker:"성취의 증거 · 과정평가",title:"평가할 것은\n앱 사용 속도가 아닙니다",
 body:list(["정보의 출처와 날짜를 찾았는가?","주장을 뒷받침하는 근거를 비교했는가?","자신의 판단을 이유와 함께 표현했는가?"]),
 note:"빠르게 검색하거나 예쁘게 글을 쓰는 능력만 평가하지 않습니다. 초등학생의 수준에 따라 선택하기·말하기·짧은 문장 쓰기 등 다양한 방식의 표현을 인정할 수 있습니다. 이는 교사 적용 방안이며 앱이 해당 모든 접근성 지원을 자동 제공하는 것은 아닙니다."
},
{
 id:"closing",section:"마무리",type:"closing",kicker:"연수의 결론",title:"웹앱을 만들기 위해\n교과서를 본 것이 아닙니다",
 lead:"교과서의 탐구를 실현하기 위해 웹앱을 만들었습니다.",
 body:'<a class="hero-link" href="'+SITE+'" target="_blank" rel="noopener noreferrer">학생용 우리 지역 탐정 열기 ↗</a>',
 note:"기술 도입을 목적화하지 않는다는 메시지로 마무리합니다. 사회 지역 문제 탐구와 국어 매체 평가를 학생이 수행할 수 있도록 AI 제작을 활용했고, 교사가 계속 사실과 링크를 검증하며 고쳤다는 점을 강조합니다."
},
{
 id:"sources",section:"마무리",kicker:"성취기준 및 제작 근거",title:"발표 내용의 출처",
 body:'<div class="source-links"><a href="'+SOCIAL_SRC+'" target="_blank" rel="noopener noreferrer">2022 개정 사회과 성취수준·활동 자료 ([4사09-01], [4사09-02]) ↗</a><a href="'+KOREAN_SRC+'" target="_blank" rel="noopener noreferrer">국어 매체 영역 [6국06-02] · 경기도교육청 자료 ↗</a><a href="'+github+'" target="_blank" rel="noopener noreferrer">실제 제작 코드 및 수정 기록 · GitHub ↗</a><a href="'+SITE+'" target="_blank" rel="noopener noreferrer">학생용 웹앱 · 우리 지역 탐정 ↗</a></div>',
 note:"사회과 내용은 국립특수교육원이 제공한 2022 개정 공통교육과정 사회과 성취수준 및 활동 도움자료에서 확인했습니다. 뉴스의 신뢰성 평가 [6국06-02]는 국어과 성취기준입니다. 사회 교과서의 정확한 판본과 페이지가 확인되지 않아 구체적인 교과서 본문 인용은 넣지 않았습니다. 초기 개발 프롬프트는 재구성임을 밝히고, 실제 요청 원문은 별도 슬라이드에 구분하여 제시했습니다."
}
];
window.TRAINING_SLIDES=SLIDES;
window.TRAINING_META={title:"교과서 속 뉴스 탐구, 우리 지역 웹앱으로",date:"2026. 11. 25.(수)",time:"15:00–17:00",originalUrl:SITE};
})();