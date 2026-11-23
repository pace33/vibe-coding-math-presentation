(() => {
"use strict";
// 발표용 정적 콘텐츠입니다. 기존 학생용 앱의 코드·주소와 분리되어 있습니다.
const card=(label,title,desc,accent="")=>'<article class="info-card '+accent+'"><span class="card-label">'+label+'</span><h3>'+title+'</h3><p>'+desc+'</p></article>';
const pill=(title,desc)=>'<div class="pill-row"><b>'+title+'</b><span>'+desc+'</span></div>';
const stat=(val,label,unit="")=>'<div class="stat"><strong>'+val+'</strong><span>'+unit+'</span><p>'+label+'</p></div>';
const steps=(pairs)=>'<div class="step-list">'+pairs.map(([a,b],i)=>'<div class="step"><span class="step-n">'+String(i+1).padStart(2,"0")+'</span><div><b>'+a+'</b><p>'+b+'</p></div></div>').join("")+'</div>';
const split=(left,right)=>'<div class="cols cols-2">'+left+right+'</div>';
const bullets=arr=>'<ul class="clean-list">'+arr.map(s=>'<li>'+s+'</li>').join("")+'</ul>';
const quote=(text,by="")=>'<div class="quote"><span>“</span><p>'+text+'</p>'+(by?'<small>'+by+'</small>':"")+'</div>';
const SLIDES=[
{
 id:"cover",section:"시작",type:"cover",kicker:"2026 초등교원 연수 · 지역 가치중심 AI 데이터 교육",
 title:"우리 지역을\n탐정처럼 읽다",
 lead:"AI와 함께 만든 지역 뉴스 검증 웹앱의 교육적 필요성부터 제작 과정, 수업 적용까지",
 body:'<div class="cover-tags"><span>지역 교육</span><span>디지털 소양</span><span>인성교육</span><span>검증하는 시민</span></div><div class="cover-date">2026. 11. 25.(수) 15:00–17:00<br>인성교육 현장적용 활동 사례 연구 1</div>',
 image:"assets/02-menu.svg",note:"첫 화면에서는 이번 연수가 코딩 연수가 아니라 지역 가치와 사실 검증을 중심으로 수업을 설계해 온 사례 발표임을 강조합니다."
},
{
 id:"goals",section:"시작",kicker:"연수의 방향",title:"오늘 얻어 갈 세 가지",
 lead:"‘기능을 배우는 시간’을 넘어, 수업의 근거와 설계 의도를 함께 살펴봅니다.",
 body:'<div class="cols cols-3">'+
 card("01","필요성 이해","지역 자료와 뉴스의 차이를 이해하고, 왜 사실 확인이 필요한지 설명할 수 있습니다.","mint")+
 card("02","제작 과정 파악","AI 대화 → 정보 구조 → 검증 → 배포의 과정을 이미지로 살펴봅니다.","blue")+
 card("03","수업 적용 구상","학생의 수준에 맞는 질문·활동·평가 흐름을 가져갑니다.","sand")+
 '</div>',note:"참가자 실습은 없습니다. 이미지를 보고 설계 결정을 이해하는 시연형 연수입니다."
},
{
 id:"agenda",section:"시작",kicker:"15:00–17:00 · 총 120분",title:"오늘의 흐름",
 lead:"필요성에서 출발해, 완성된 웹앱을 보고, 제작 과정을 시각적으로 따라갑니다.",
 body:'<div class="agenda-grid">'+
 pill("15:00–15:20","왜 지역 가치중심 AI 데이터 교육인가")+
 pill("15:20–15:40","교육적 설계: 탐색·비교·판단·공유")+
 pill("15:40–16:10","우리 지역 탐정 웹앱 기능과 구조")+
 pill("16:10–16:40","이미지로 보는 제작 과정·개선 사례")+
 pill("16:40–17:00","초등 수업 적용, 평가, 윤리와 마무리")+
 '</div><p class="foot-emphasis">직접 코딩·앱 제작 활동은 진행하지 않습니다.</p>',
 note:"프로그램 안내 자료의 15:00~17:00, 연구과제 2 주제에 맞춘 구성입니다."
},
{
 id:"why",section:"필요성",kicker:"01 · 왜 필요한가",title:"우리 지역의 정보는\n한곳에 있지 않습니다",
 lead:"학생에게는 ‘우리 고장’이 친숙하지만, 정보는 여러 사이트에 흩어져 있습니다.",
 body:'<div class="cols cols-3">'+
 card("자료의 분산","정보를 찾기 어렵다","인구와 면적은 통계, 지역 행사와 시설은 지자체, 기업은 별도 홈페이지에 있습니다.","mint")+
 card("시간의 차이","같은 정보도 달라진다","축제 날짜와 인구, 기업 운영 현황처럼 기준 시점이 중요한 정보가 많습니다.","blue")+
 card("정보의 신뢰","검색 결과가 답은 아니다","뉴스 제목과 AI의 답변을 그대로 믿기보다 원문과 근거를 확인해야 합니다.","sand")+
 '</div>',note:"지역 자료의 분산은 이 웹앱을 만들게 된 교실의 실천적 문제였습니다."
},
{
 id:"question",section:"필요성",kicker:"수업의 출발 질문",title:"검색 결과를\n‘사실’이라고 해도 될까요?",
 lead:"AI가 그럴듯하게 답하거나 여러 뉴스가 비슷한 말을 해도 확인이 필요합니다.",
 body:split(
 '<div class="scenario-card"><div class="scenario-top">수업 상황 · 예시</div><h3>“우리 시의 인구는 몇 명일까요?”</h3><p>학생 A: “검색 맨 위에 나온 숫자예요.”</p><p>학생 B: “다른 사이트 숫자는 조금 달라요.”</p></div>',
 '<div class="info-panel"><h3>교사의 되묻기</h3>'+bullets(["언제 기준의 인구일까요?","누가 발표한 자료일까요?","집계 대상이 같을까요?","근거를 확인한 뒤 어떻게 공유할까요?"])+'</div>'
 ),note:"숫자가 다르다는 이유만으로 어느 하나가 틀렸다고 단정하지 않습니다. 기준일, 주민등록/총인구, 집계 방식 차이부터 봅니다."
},
{
 id:"curriculum",section:"필요성",kicker:"2022 개정 교육과정 연결",title:"지역 탐구와 디지털 소양은\n같은 수업 안에서 만납니다",
 lead:"개정 교육과정은 기초 디지털 소양, 학생 주도성, 탐구 역량과 인성을 강조합니다.",
 body:split(
 '<div class="info-panel panel-accent"><h3>교육과정이 말하는 방향</h3>'+bullets(["디지털 기초소양을 여러 교과에서 기르기","지식을 외우는 수업을 넘어 탐구하고 판단하기","학습자 삶·지역과 연계하여 배움 구성하기"])+'</div>',
 '<div class="info-panel"><h3>우리 지역 탐정의 연결</h3>'+steps([["사회","지역의 위치·산업·자연·문화 탐색"],["국어","뉴스 읽기·정보의 타당성 확인"],["창체·인성","책임 있게 판단하고 표현·공유"]])+'</div>'
 )+'<p class="source-line">출처: 교육부, 「2022 개정 초·중등학교 및 특수교육 교육과정 확정·발표」(2022)</p>',
 note:"특정 성취기준 번호를 단정하는 대신 2022 개정 교육과정 총론의 핵심 방향을 활용했습니다."
},
{
 id:"character",section:"필요성",kicker:"인성교육의 실제 장면",title:"‘진짜인가?’를 묻는 태도가\n곧 인성의 실천입니다",
 lead:"비판적인 읽기와 공동체를 존중하는 태도는 서로 반대가 아닙니다.",
 body:'<div class="cols cols-4">'+
 card("진실성","확인하기","추측과 사실을 구별하고 출처를 숨기지 않습니다.","mint")+
 card("존중","다르게 보기","다른 사람의 의견을 비웃지 않고 이유를 듣습니다.","blue")+
 card("책임","신중히 공유","확인되지 않은 소문을 퍼뜨리지 않습니다.","sand")+
 card("참여","함께 바꾸기","지역의 문제를 알고 해결을 생각합니다.","mint")+
 '</div><p class="foot-emphasis">인성교육은 별도 활동이 아니라 ‘어떤 정보를 어떻게 다루는가’에서 시작됩니다.</p>',
 note:"수업에서 학생의 판단을 단순히 맞다/틀리다로만 채점하지 않도록 안내합니다."
},
{
 id:"data-principle",section:"필요성",kicker:"설계 원칙",title:"변하지 않는 정보와\n달라지는 정보를 구분합니다",
 lead:"웹앱의 정보 구조는 이 한 가지 질문에서 시작했습니다.",
 body:split(
 '<div class="compare-side stable"><span class="side-label">기초정보 · 먼저 보여주기</span><h3>이미 알려진 지역 자료</h3>'+bullets(["산·강·하천·저수지의 이름","박물관·미술관·문화유산","주요 산업과 기업 사례","인구·면적의 기준일이 있는 수치"])+'</div>',
 '<div class="compare-side changing"><span class="side-label">변화 정보 · 뉴스 확인하기</span><h3>날짜에 따라 달라지는 자료</h3>'+bullets(["최근 지역 문제와 정책","축제 일정과 관람 안내","기업의 운영·견학 신청 가능 여부","당시 기사에 나온 주장과 숫자"])+'</div>'
 ),note:"기초자료도 영원히 변하지는 않습니다. 수치와 운영 정보에는 기준일을 분명히 제시하도록 했습니다."
},
{
 id:"section-app",section:"웹앱 살펴보기",type:"section",kicker:"02 · 완성된 결과",title:"우리 지역 탐정,\n학생 화면을 들여다보다",
 lead:"지역 탐색에서 뉴스 검증, 기록까지 한 가지 흐름으로 연결했습니다.",
 body:'<div class="section-number">02 <span>WEB APP TOUR</span></div>',image:"assets/02-menu.svg",note:"실제 사이트 주소를 소개하고, 설명은 사진·이미지 중심으로 진행합니다."
},
{
 id:"purpose",section:"웹앱 살펴보기",kicker:"프로젝트 한눈에 보기",title:"지역을 알고, 뉴스를 읽고,\n근거를 남기는 웹앱",
 lead:"정보를 많이 나열하는 서비스보다 학생이 ‘판단하기’까지 이어지는 흐름을 목표로 했습니다.",
 body:'<div class="flow-bar"><span>지역 선택</span><i>→</i><span>기초정보</span><i>→</i><span>관련 뉴스</span><i>→</i><span>출처·근거 비교</span><i>→</i><span>탐정 카드</span></div>'+
 '<div class="cols cols-3">'+
 stat("11","충북 시·군 선택")+
 stat("6","지역 정보 분야")+
 stat("3","주요 메뉴")+
 '</div><p class="foot-emphasis">실제 서비스: <a href="https://pace33.github.io/vibe-coding-math-presentation/local-check/student/" target="_blank" rel="noopener">우리 지역 탐정 웹앱 열기 ↗</a></p>',
 note:"앱의 수치는 코드의 현재 자료 범위이지 해당 지역의 모든 자료를 망라했다는 뜻은 아닙니다."
},
{
 id:"main-menu",section:"웹앱 살펴보기",kicker:"정보 구조",title:"상단 메뉴는 세 개로\n과감하게 정리했습니다",
 lead:"학생이 처음 봤을 때 ‘무엇을 해야 하는지’ 보이도록 했습니다.",
 body:'<div class="cols cols-3">'+
 card("01","뉴스 찾기","지역과 검색어를 선택해 관련 기사를 찾습니다.","blue")+
 card("02","우리 지역","6개 세부 분야의 대표 정보를 먼저 확인합니다.","mint")+
 card("03","탐정 게시판","검증하며 만든 카드와 판단을 다시 봅니다.","sand")+
 '</div><div class="tip-line">화면이 복잡하면 학생은 내용보다 메뉴를 먼저 해독해야 합니다.</div>',
 note:"실제 개선 과정에서 중복 글자와 불필요한 메뉴를 제거했습니다."
},
{
 id:"six-fields",section:"웹앱 살펴보기",kicker:"교과 내용에 가까운 분류",title:"‘우리 지역’에는 여섯 분야",
 lead:"교육과정의 지역 이해에서 익숙하게 다루는 주제로 묶었습니다.",
 body:'<div class="fields-grid">'+
 ['<b>01</b><strong>기본 정보</strong><small>위치·행정구역·인구·면적</small>',
 '<b>02</b><strong>자연환경</strong><small>산·강·호수·숲</small>',
 '<b>03</b><strong>생활시설</strong><small>공공기관·교통·도서관</small>',
 '<b>04</b><strong>산업과 경제</strong><small>기업·농산물·견학</small>',
 '<b>05</b><strong>역사와 문화</strong><small>유적·박물관·축제</small>',
 '<b>06</b><strong>지역문제</strong><small>최신 현안 뉴스</small>'].map(s=>'<div class="field-card">'+s+'</div>').join("")+
 '</div>',note:"세부 분야는 상단 주요 메뉴보다 작은 탭으로 표현해 두 단계가 헷갈리지 않게 했습니다."
},
{
 id:"data-cards",section:"웹앱 살펴보기",type:"image",kicker:"기초정보 화면",title:"숫자는 카드 안에서 바로 보입니다",
 lead:"‘통계 사이트에서 확인하세요’ 대신 실제 값을 보여주고 기준일과 출처를 함께 남겼습니다.",
 image:"assets/03-basics.svg",
 body:'<div class="image-caption">예: 위치 / 행정구역 / 인구 / 면적 — 기준일이 없는 숫자 비교는 피합니다.</div>',
 note:"이미지는 발표를 위해 재구성한 예시 화면입니다. 최신값은 해당 공식 통계 원문에서 재확인하도록 안내합니다."
},
{
 id:"news-search",section:"웹앱 살펴보기",type:"image",kicker:"뉴스 검색 화면",title:"뉴스는 ‘검색된 기사’일 뿐,\n검증 결과가 아닙니다",
 lead:"구글·빙 뉴스 RSS 가운데 먼저 정상 응답한 제공자의 기사를 보여주고 제공처를 표시합니다.",
 image:"assets/04-news.svg",
 body:'<div class="image-caption">검색 중에는 제공자를 단정하지 않으며, 결과에서 실제 제공자와 원문 링크를 확인합니다.</div>',
 note:"연수용 그림의 기사 제목은 실제 사건이 아닙니다. 구글/빙 제공자와 원문 데이터 구조만 보여주는 재현 이미지입니다."
},
{
 id:"three-steps",section:"웹앱 살펴보기",type:"image",kicker:"학생 검증 흐름",title:"‘검색 → 검증’은\n세 가지 질문으로 정리합니다",
 lead:"누가 말했는지, 어떤 자료를 근거로 삼았는지, 다른 자료와 같은지 살펴봅니다.",
 image:"assets/05-verify.svg",
 body:'<div class="image-caption">출처 확인 → 근거 확인 → 기사 비교. ‘아직 모르겠어요’도 허용합니다.</div>',
 note:"학생이 정답을 맞히는 퀴즈가 아니라 이유와 출처를 기록하는 과정임을 강조합니다."
},
{
 id:"board",section:"웹앱 살펴보기",type:"image",kicker:"검증 결과의 기록",title:"판단을 끝내면\n‘탐정 카드’로 남깁니다",
 lead:"어떤 기사와 자료를 비교했는지, 무엇을 더 확인하고 싶은지 기록합니다.",
 image:"assets/06-board.svg",
 body:'<div class="image-caption">현재 게시판은 브라우저·기기별 저장입니다. 학급 전체가 자동으로 공유되는 서버형 게시판은 아닙니다.</div>',
 note:"실제 기능 범위를 과장하지 않습니다. 개인 정보를 기록하거나 공유하지 않도록 안내합니다."
},
{
 id:"visits",section:"웹앱 살펴보기",type:"image",kicker:"지역 가치 확장",title:"온라인 탐구를\n오프라인 지역 체험으로",
 lead:"기업·공장, 자연환경, 공공기관, 박물관·미술관의 방문 정보를 분류해 안내합니다.",
 image:"assets/09-visit.svg",
 body:'<div class="image-caption">공개 관람 가능과 학교 단체 체험 가능은 다릅니다. 예약·이동·안전은 기관 확인이 우선입니다.</div>',
 note:"기업 19곳과 자연/공공/문화시설 37곳에 방문·견학 안내를 연결한 현 버전 구성입니다. 정보는 기준 시점에 따라 변합니다."
},
{
 id:"limits",section:"웹앱 살펴보기",kicker:"교사가 알고 사용해야 할 것",title:"웹앱이 알려주는 것과\n교사가 확인해야 할 것",
 lead:"보기 좋은 화면만으로 자료의 신뢰성이 완성되지는 않습니다.",
 body:split(
 '<div class="info-panel panel-accent"><h3>웹앱이 돕는 일</h3>'+bullets(["지역별 대표 자료 묶어 보여주기","뉴스 기사 검색과 원문 연결","근거 비교 문항 제시","검증 카드 기록·확인"])+'</div>',
 '<div class="info-panel"><h3>교사가 확인할 일</h3>'+bullets(["링크가 지금도 열리는지","시설 운영·견학 신청 조건","기사의 원문·날짜·문맥","학생 기록의 표현·개인정보"])+'</div>'
 ),note:"공식자료 링크도 변경될 수 있으며, 뉴스 검색 연결도 제공자 정책에 따라 실패할 수 있습니다."
},
{
 id:"section-build",section:"제작 이미지 시연",type:"section",kicker:"03 · 제작의 기록",title:"코딩 실습 대신,\n화면 이미지로 따라가다",
 lead:"처음부터 완성된 것이 아닙니다. 질문하고, 만들고, 고치는 과정을 살펴봅니다.",
 image:"assets/01-prompt.svg",
 body:'<div class="section-number">03 <span>BUILD STORY</span></div>',
 note:"앞으로의 제작 과정 슬라이드는 이미지 기반 시연입니다. 참가자의 계정·코딩·실습은 요구하지 않습니다."
},
{
 id:"build-1",section:"제작 이미지 시연",type:"image",kicker:"제작 과정 01 / 요구 정의",title:"첫 번째 일은\n코드를 쓰는 것이 아니었습니다",
 lead:"교사의 문제를 구체적인 요구로 바꾸는 AI 대화가 시작점이었습니다.",
 image:"assets/01-prompt.svg",
 body:'<div class="image-caption">요구 문장: 학생 수준 / 지역 범위 / 출처 표시 / 뉴스 검증 / 결과 공유를 명확히 합니다.</div>',
 note:"AI가 작성한 첫 버전을 최종 결과로 받아들이지 않았습니다. 교사가 요구와 범위를 반복해서 정리했습니다."
},
{
 id:"build-2",section:"제작 이미지 시연",type:"image",kicker:"제작 과정 02 / 화면 구조",title:"‘더 넣기’보다\n‘덜 복잡하게’ 만드는 과정",
 lead:"메뉴를 3개로 단순화하고, 6개 지역 분야를 별도 단계로 구분했습니다.",
 image:"assets/02-menu.svg",
 body:'<div class="image-caption">사용자의 질문: “학생에게 지금 가장 먼저 보여줘야 하는 것은 무엇인가?”</div>',
 note:"실제 대화에서는 메뉴 중복과 길게 늘어선 설명을 제거하고, 기능을 분류해 주었습니다."
},
{
 id:"build-3",section:"제작 이미지 시연",type:"image",kicker:"제작 과정 03 / 데이터 구성",title:"실제 지명과 시설명은\n미리 넣었습니다",
 lead:"하천·저수지·박물관·문화유산·기업은 카드에서 바로 보이고, 변경 정보는 확인하도록 했습니다.",
 image:"assets/03-basics.svg",
 body:'<div class="image-caption">교사의 피드백: “이미 정해진 정보는 검색부터 시키지 말고 화면에서 보여줘.”</div>',
 note:"기초정보와 뉴스/예약정보의 구분이 웹앱 품질을 높인 핵심 수정 사례였습니다."
},
{
 id:"build-4",section:"제작 이미지 시연",type:"image",kicker:"제작 과정 04 / 뉴스 기능",title:"뉴스 검색이 안 되면\n어디가 문제인지 나눠 봅니다",
 lead:"구글과 빙 RSS의 실제 응답 제공자를 표시하고, 실패할 때는 외부 검색으로 안내했습니다.",
 image:"assets/04-news.svg",
 body:'<div class="image-caption">뉴스 검색 서비스는 외부 의존성이 있으므로 연결 실패와 ‘기사 없음’을 다르게 안내합니다.</div>',
 note:"구글과 빙을 둘 다 요청합니다. 먼저 정상 응답한 제공자를 사용하되, 무엇을 썼는지 정확히 표시하도록 수정했습니다."
},
{
 id:"build-5",section:"제작 이미지 시연",type:"image",kicker:"제작 과정 05 / 검증 연결",title:"검색만 되면\n수업 앱은 완성일까요?",
 lead:"기사 검색 이후 ‘출처 확인 → 근거 확인 → 비교 → 기록’까지 이어지게 했습니다.",
 image:"assets/05-verify.svg",
 body:'<div class="image-caption">뉴스 기사를 자동으로 참·거짓 판정하지 않습니다. 판단은 학생의 몫입니다.</div>',
 note:"정보 탐색을 수업 과정으로 만들려면 학습자의 행동과 증거가 남아야 한다는 점을 강조합니다."
},
{
 id:"build-6",section:"제작 이미지 시연",type:"image",kicker:"제작 과정 06 / 피드백·검사",title:"완성도는\n수정 대화에서 높아졌습니다",
 lead:"링크가 첫 화면으로만 가거나, 메뉴가 겹치거나, 카드 내용이 비어 있는 문제를 찾아 고쳤습니다.",
 image:"assets/07-revision.svg",
 body:'<div class="image-caption">대표 점검: 지역 누락 / 중복 메뉴 / 연결 경로 / 기사 제공처 / 학생에게 쉬운 문장</div>',
 note:"실제 사용자 피드백에서 ‘직접 링크’, ‘구글/빙 구분’, ‘실제 수치 바로 표시’와 같은 구체적 개선을 거듭했습니다."
},
{
 id:"build-7",section:"제작 이미지 시연",type:"image",kicker:"제작 과정 07 / 배포",title:"공유 가능한 주소로\n수업 자료를 완성합니다",
 lead:"학생용 웹앱 주소는 유지하고, 오늘의 발표 자료는 새로운 주소로 분리했습니다.",
 image:"assets/08-deploy.svg",
 body:'<div class="image-caption">학생용 /student/와 연수용 /teacher-training/을 구분해 기존 기능을 손대지 않습니다.</div>',
 note:"웹에서 공유·접속하는 장점과 동시에 버전 관리, 외부 링크 점검의 책임도 강조합니다."
},
{
 id:"build-sequence",section:"제작 이미지 시연",kicker:"이미지로만 보는 제작 흐름",title:"직접 만드는 실습 없이\n‘설계의 순서’를 가져갑니다",
 lead:"코드를 따라 치는 것이 아니라 교사가 AI에 무엇을 요청하고 무엇을 확인했는지 관찰합니다.",
 body:'<div class="image-triptych">'+
 '<figure><img src="assets/01-prompt.svg" alt="AI 대화 화면 재구성 이미지"><figcaption>1 · 문제를 말로 설명</figcaption></figure>'+
 '<figure><img src="assets/02-menu.svg" alt="메뉴 설계 이미지"><figcaption>2 · 정보 구조 설계</figcaption></figure>'+
 '<figure><img src="assets/07-revision.svg" alt="수정 전후 화면 이미지"><figcaption>3 · 오류 수정과 정리</figcaption></figure>'+
 '</div><div class="tip-line">한 번에 멋진 앱을 만드는 것이 아니라, 수업 목적에 맞게 ‘교사 판단’을 반복했습니다.</div>',
 note:"참가자에게 별도 계정 생성, 설치, 코딩, 실습 링크 입력을 요구하지 않습니다. 시각 자료로만 설명합니다."
},
{
 id:"lesson-model",section:"수업 적용",kicker:"04 · 교실에 가져가기",title:"초등 사회 한 차시에\n어떻게 적용할 수 있을까요?",
 lead:"40분 수업의 예시입니다. 지역별 주제에 맞게 시간과 활동을 조정합니다.",
 body:'<div class="lesson-grid">'+
 pill("5분","우리 지역의 소식 질문하기")+
 pill("10분","기초정보 카드에서 사실 확인하기")+
 pill("10분","뉴스 원문에서 출처·날짜 찾기")+
 pill("10분","다른 자료와 비교하고 판단하기")+
 pill("5분","탐정 카드 정리·소감 나누기")+
 '</div>',note:"초등 3~4학년에는 하천·축제·도서관 같은 친숙한 주제, 5~6학년에는 지역 현안·산업·정책 등으로 확장할 수 있습니다."
},
{
 id:"examples",section:"수업 적용",kicker:"학년군별 질문 예시",title:"같은 도구라도\n학생 질문은 달라집니다",
 body:split(
 '<div class="info-panel"><h3>초등 3~4학년</h3>'+steps([["관찰","우리 지역에는 어떤 강이 있나요?"],["비교","뉴스와 지도의 이름이 같은가요?"],["표현","찾은 사실을 한 문장으로 말해요."]])+'</div>',
 '<div class="info-panel panel-accent"><h3>초등 5~6학년</h3>'+steps([["탐구","지역 기업·산업이 바뀌는 까닭은?"],["검증","기사가 사용한 통계의 기준일은?"],["판단","지역 문제의 해결 방법은 무엇일까요?"]])+'</div>'
 ),note:"사례는 학년군에 맞춘 응용 아이디어이며, 특정 교과서의 성취기준에 1:1 대응한다고 단정하지 않습니다."
},
{
 id:"inclusion",section:"수업 적용",kicker:"학습자 다양성 고려",title:"모든 학생이\n같은 방식으로 기록할 필요는 없습니다",
 lead:"학생의 읽기·쓰기·의사소통 수준에 따라 참여의 문턱을 낮춥니다.",
 body:'<div class="cols cols-3">'+
 card("시각 지원","보고 고르기","지역 이름·사진·아이콘을 보고 중요한 정보를 선택합니다.","mint")+
 card("언어 지원","짧게 말하기","‘누가 / 언제 / 어디서’ 질문 틀과 문장 시작어를 제공합니다.","blue")+
 card("표현 다양화","다르게 남기기","말하기·그림·단어 선택·문장 기록 중 가능한 방식으로 표현합니다.","sand")+
 '</div><p class="source-line">※ 위 지원 방식은 교실 적용 제안이며, 현재 웹앱에 모두 구현된 기능은 아닙니다.</p>',
 note:"장애학생이나 읽기 어려운 학생을 위한 수업 변형을 소개하되, 미구현 앱 기능과 구분합니다."
},
{
 id:"assessment",section:"수업 적용",kicker:"과정을 보는 평가",title:"‘정답’보다\n검증하는 행동을 관찰합니다",
 body:'<div class="rubric-grid">'+
 '<div class="rubric-head">평가 관점</div><div class="rubric-head">학생 행동의 예</div>'+
 '<div>정보 탐색</div><div>지역을 선택하고 관련 자료를 찾는다.</div>'+
 '<div>출처 확인</div><div>작성 기관·발행일 또는 기준일을 말한다.</div>'+
 '<div>근거 비교</div><div>두 자료에서 같은 점·다른 점을 찾는다.</div>'+
 '<div>책임 있는 공유</div><div>확인하지 못한 내용은 ‘더 알아볼래요’로 표시한다.</div>'+
 '</div><div class="tip-line">점수화 전 교사의 관찰 기록과 학생의 탐정 카드를 함께 활용할 수 있습니다.</div>',
 note:"수행 수준은 학생마다 다를 수 있으므로 말하기·선택하기·문장 쓰기 등 다양한 수행 증거를 인정합니다."
},
{
 id:"ethics",section:"수업 적용",kicker:"현장에서 반드시",title:"AI가 만든 결과는\n교사가 검토해야 합니다",
 body:'<div class="cols cols-2">'+
 card("출처와 날짜","원문에서 재확인","공공기관 링크라고 해도 페이지가 바뀌거나 기준일이 오래되었을 수 있습니다.","mint")+
 card("정보와 개인정보","학생 기록 최소화","탐정 카드에 학생 이름·연락처를 입력하거나 공유하지 않게 합니다.","sand")+
 card("검색 제공자","구글·빙을 구분","뉴스 검색 결과의 제공자와 검색 링크가 서로 일치하는지 확인합니다.","blue")+
 card("시설 방문","예약·접근성 확인","학생 견학은 참여 학년, 인원, 안전, 이동·편의시설을 기관과 협의합니다.","mint")+
 '</div>',note:"AI의 결과를 그대로 게시하지 않는 태도가 오히려 본 연수의 핵심 가치입니다."
},
{
 id:"closing",section:"마무리",type:"closing",kicker:"오늘의 핵심",title:"AI는 만드는 속도를 높이고,\n교사는 배움의 방향을 정합니다",
 lead:"지역을 알아보는 수업이, 정보를 책임 있게 판단하는 수업으로 이어지도록.",
 body:'<div class="closing-points"><span>지역의 실제 자료에서 시작하기</span><span>뉴스를 그대로 믿지 않고 근거 확인하기</span><span>판단의 이유를 존중하며 공유하기</span></div>'+
 '<a class="hero-link" href="https://pace33.github.io/vibe-coding-math-presentation/local-check/student/" target="_blank" rel="noopener noreferrer">완성된 우리 지역 탐정 웹앱 열기 ↗</a>',
 note:"마무리 발문: 우리 교실에서 지역 문제를 탐구할 때 학생이 가장 먼저 확인해야 할 것은 무엇일까요?"
},
{
 id:"references",section:"마무리",kicker:"참고와 확인",title:"출처와 자료",
 lead:"교육과정과 사례 자료는 발표 시점의 공개자료·제작 기록을 기준으로 정리했습니다.",
 body:'<div class="ref-list">'+
 '<a href="https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&amp;boardSeq=93459&amp;lev=0&amp;m=020402&amp;opType=N&amp;s=moe&amp;statusYN=W" target="_blank" rel="noopener">교육부 · 2022 개정 교육과정 확정·발표 ↗</a>'+
 '<a href="https://www.goe.go.kr/resource/old/BBSMSTR_000000000126/BBS_202402261130401580.pdf" target="_blank" rel="noopener">경기도교육청 · 2022 개정 교육과정의 디지털 소양 내용 ↗</a>'+
 '<a href="https://pace33.github.io/vibe-coding-math-presentation/local-check/student/" target="_blank" rel="noopener">우리 지역 탐정 · 학생용 웹앱 ↗</a>'+
 '<a href="https://github.com/pace33/vibe-coding-math-presentation/tree/main/local-check" target="_blank" rel="noopener">프로젝트 제작 파일 · GitHub 저장소 ↗</a>'+
 '</div><p class="source-line">제작 이미지들은 실제 UI 기능과 기록을 바탕으로 재구성한 교육용 예시이며, 실제 뉴스 검색 결과의 캡처가 아닙니다.</p>',
 note:"제작 화면은 예시 이미지이며 실시간 구글·빙 뉴스 기사는 포함하지 않았음을 다시 안내합니다."
}
];
window.TRAINING_SLIDES=SLIDES;
window.TRAINING_META={title:"우리 지역을 탐정처럼 읽다",date:"2026. 11. 25.(수)",time:"15:00–17:00",originalUrl:"https://pace33.github.io/vibe-coding-math-presentation/local-check/student/"};
})();