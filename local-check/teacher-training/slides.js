(() => {
"use strict";
/* 발표 전용. 한 장에 한 메시지, 상세 설명은 발표자 노트에만 배치. */
const list=(values)=>'<div class="big-list">'+values.map((x,i)=>'<div class="big-list-row"><span>'+String(i+1).padStart(2,"0")+'</span><strong>'+x+'</strong></div>').join("")+'</div>';
const words=(values)=>'<div class="word-grid">'+values.map(x=>'<div class="word-item">'+x+'</div>').join("")+'</div>';
const compare=(left,right)=>'<div class="comparison"><div><small>'+left[0]+'</small><strong>'+left[1]+'</strong><p>'+left[2]+'</p></div><div><small>'+right[0]+'</small><strong>'+right[1]+'</strong><p>'+right[2]+'</p></div></div>';
const line=(txt)=>'<div class="big-quote">'+txt+'</div>';
const flow=(arr)=>'<div class="simple-flow">'+arr.map((x,i)=>'<div class="flow-step"><small>'+String(i+1).padStart(2,"0")+'</small><strong>'+x+'</strong></div>').join("")+'</div>';
const SLIDES=[
{
 id:"cover",section:"시작",type:"cover",kicker:"초등교원 연수 · 2026.11.25",
 title:"우리 지역,\n탐정처럼 읽다",lead:"AI로 만든 지역 뉴스 검증 웹앱과 수업의 변화",
 body:'<p class="cover-caption">인성교육 현장적용 활동 사례 연구 1<br>15:00–17:00</p>',
 image:"assets/02-menu.svg",
 note:"이번 연수는 참가자가 직접 앱을 만드는 실습이 아니라, 교사가 AI와 대화하며 학생용 웹앱을 만든 실제 과정을 이미지로 보여 주는 사례 발표입니다."
},
{
 id:"section-need",section:"필요성",type:"section",kicker:"PART 01",title:"왜 만들었을까요?",lead:"우리 지역을 배우는 데 생기는 작은 어려움에서 시작했습니다.",
 body:'<div class="section-number">01 <span>WHY</span></div>',
 note:"자료를 찾아보는 활동이 종종 검색 결과를 복사하는 것으로 끝나는 문제를 제시합니다. 반드시 사실을 확인하는 과정으로 연결할 필요가 있습니다."
},
{
 id:"question",section:"필요성",kicker:"수업의 시작 질문",title:"검색하면,\n모두 사실일까요?",lead:"검색 결과와 AI 답변이 언제나 같은 것은 아닙니다.",
 body:line('“누가, 언제, 어떤 근거로 말했을까요?”'),
 note:"인터넷 검색과 생성형 AI는 유용하지만, 그럴듯한 문장을 사실이라고 확정하지 않습니다. 기사와 공식자료의 작성자·기준 날짜를 살펴보게 합니다."
},
{
 id:"difficulties",section:"필요성",kicker:"우리 지역 탐구의 현실",title:"지역 정보가 어렵게 느껴지는 이유",
 body:list(["자료가 여러 사이트에 흩어져 있어요.","인구·행사·운영 정보는 계속 달라져요.","검색 결과가 맞는지 판단하기 어려워요."]),
 note:"자연환경·역사문화는 안내 사이트, 인구·면적은 통계, 축제·기업은 다양한 기관에 분산됩니다. 지역 자료를 모아주는 것뿐 아니라 기준일을 확인하게 하는 구조가 필요했습니다."
},
{
 id:"two-kinds",section:"필요성",kicker:"정보를 두 가지로 구분",title:"바로 보여줄 정보,\n다시 확인할 정보",
 body:compare(["기초정보","어떤 곳인가?","산·강·박물관·기업 이름, 기준일이 있는 통계"],["변화하는 정보","지금도 같은가?","최근 뉴스·축제 일정·견학 예약·지역 현안"]),
 note:"기초정보도 수정될 수 있으므로 공식 출처와 시점을 표시합니다. 현재 상태를 묻는 질문에는 최신 자료를 비교하도록 설계했습니다."
},
{
 id:"values",section:"필요성",kicker:"인성교육과 연결",title:"뉴스를 확인하는 태도도\n인성교육입니다",
 body:words(["진실성<br><small>사실과 의견 구별</small>","존중<br><small>다른 판단의 이유 듣기</small>","책임<br><small>확인하고 공유하기</small>"]),
 note:"뉴스의 참·거짓만 맞히는 활동이 아니라, 근거 없이 단정하지 않는 태도, 다른 사람의 의견을 존중하는 태도, 확인하지 않은 소문을 퍼뜨리지 않는 태도와 연결합니다."
},
{
 id:"section-app",section:"웹앱 살펴보기",type:"section",kicker:"PART 02",title:"그래서 만든\n‘우리 지역 탐정’",lead:"정보를 찾는 도구에서, 근거를 확인하는 수업 도구로.",
 body:'<div class="section-number">02 <span>WEB APP</span></div>',
 note:"지금부터 완성된 학생용 화면의 구조를 소개합니다. 실제 웹앱은 https://pace33.github.io/vibe-coding-math-presentation/local-check/student/ 입니다."
},
{
 id:"app-menu",section:"웹앱 살펴보기",type:"image",kicker:"학생 화면 01",title:"메뉴는 세 개만 남겼습니다",
 lead:"뉴스 찾기 · 우리 지역 · 탐정 게시판",
 image:"assets/02-menu.svg",
 note:"처음에는 설명 문구와 기능이 많아 화면이 복잡했습니다. 주요 기능을 세 개로 묶고 우리 지역의 여섯 분야는 아래 탭으로 분리했습니다. 이미지는 실제 구조를 재구성한 예시입니다."
},
{
 id:"six-fields",section:"웹앱 살펴보기",kicker:"학생 화면 02",title:"지역 정보는 여섯 분야",
 body:words(["기본 정보","자연환경","생활시설","산업과 경제","역사와 문화","지역문제"]),
 note:"충청북도 11개 시군의 위치·통계, 자연환경, 도서관·공공기관, 기업·특산물, 역사문화·축제, 최신 지역문제 정보를 탐구하도록 구성했습니다."
},
{
 id:"basics",section:"웹앱 살펴보기",type:"image",kicker:"학생 화면 03",title:"알려진 사실은 바로 보여줍니다",
 lead:"지역의 위치·행정구역·인구·면적과 기준 날짜",
 image:"assets/03-basics.svg",
 note:"학생에게 '검색해 보세요'라고만 안내하는 대신 기본정보 카드에 값과 출처를 표시했습니다. 수치의 기준일이 다르면 서로 바로 비교하지 않도록 강조합니다. 이미지는 시각화 예시입니다."
},
{
 id:"news",section:"웹앱 살펴보기",type:"image",kicker:"학생 화면 04",title:"뉴스를 찾고, 출처를 확인합니다",
 lead:"실제 결과 제공자가 구글이면 구글, 빙이면 빙으로 표시",
 image:"assets/04-news.svg",
 note:"웹앱의 뉴스 검색 서버는 구글 뉴스 RSS와 빙 뉴스 RSS를 모두 요청하여 먼저 정상 응답한 제공자를 사용합니다. 검색 결과는 검증된 뉴스가 아니고, 관련 기사의 원문을 읽기 위한 출발점입니다."
},
{
 id:"verify",section:"웹앱 살펴보기",type:"image",kicker:"학생 화면 05",title:"세 가지 질문으로 검증합니다",
 lead:"출처 확인 → 근거 확인 → 기사 비교",
 image:"assets/05-verify.svg",
 note:"학생이 선택한 기사에 대해 누가 썼는지, 자료가 있는지, 다른 자료와 어떤 점이 같은지를 확인합니다. 정보가 부족하면 아직 모르겠어요라는 판단도 가능합니다."
},
{
 id:"board",section:"웹앱 살펴보기",type:"image",kicker:"학생 화면 06",title:"검증한 이유를 기록합니다",
 lead:"뉴스 탐정 카드로 저장하고 다시 살펴보기",
 image:"assets/06-board.svg",
 note:"게시판은 현재 해당 브라우저 기기에 저장되는 구조입니다. 모든 학생 기록이 서버에 자동으로 공유되는 기능이라고 설명하면 안 됩니다."
},
{
 id:"visits",section:"웹앱 살펴보기",type:"image",kicker:"수업의 확장",title:"화면 속 지역을 현장으로 연결합니다",
 lead:"기업·자연환경·공공기관·박물관·미술관 견학 정보",
 image:"assets/09-visit.svg",
 note:"견학 자료는 예약, 일반 방문, 사전 협의의 종류를 나눠 제시합니다. 학교 단체 신청, 편의시설, 이동 안전은 방문 전에 기관에 꼭 확인해야 합니다."
},
{
 id:"section-build",section:"제작 과정",type:"section",kicker:"PART 03",title:"어떻게 만들었을까요?",lead:"코드 실습 없이, 제작 과정을 이미지로 살펴봅니다.",
 body:'<div class="section-number">03 <span>BUILD</span></div>',
 note:"이제부터는 참여자가 직접 코드를 만드는 것이 아니라 실제 제작 과정에서 교사가 어떤 요구와 피드백을 했는지를 화면 이미지로 살펴봅니다."
},
{
 id:"build-flow",section:"제작 과정",kicker:"제작의 흐름",title:"처음부터 완성하지 않았습니다",
 body:flow(["수업 문제 발견","AI에 요구 설명","화면으로 확인","오류 수정·배포"]),
 note:"AI에 '좋은 웹앱을 만들어 줘'라고 막연하게 말하기보다 학생 수준, 정보의 범위, 실제 수업에서 필요한 기능을 먼저 설명합니다. 수정과 검증을 반복하는 과정이 중요합니다."
},
{
 id:"prompt",section:"제작 과정",type:"image",kicker:"STEP 01 · 요청하기",title:"코드보다 수업의 필요를 말했습니다",
 lead:"“학생이 지역 정보를 보고, 뉴스의 근거를 확인하게 해 줘.”",
 image:"assets/01-prompt.svg",
 note:"교사의 실제 요구를 AI가 이해할 수 있게 구체화합니다. 지역 11개 시군, 학생 수준, 기초정보 즉시 표시, 공식 출처, 뉴스 검증, 기록 기능을 반복해서 요청했습니다. 제시한 이미지는 대화를 재구성한 예시입니다."
},
{
 id:"structure",section:"제작 과정",type:"image",kicker:"STEP 02 · 단순하게 만들기",title:"기능을 더하기보다, 메뉴를 줄였습니다",
 lead:"3개 메뉴와 6개 지역 분야로 정리",
 image:"assets/02-menu.svg",
 note:"자료가 늘수록 정보가 찾기 어려워져, 중복 문구를 제거하고 세부 영역을 작은 탭으로 구별했습니다. 실제 수정 이력에서 중요한 개선입니다."
},
{
 id:"revision",section:"제작 과정",type:"image",kicker:"STEP 03 · 오류 수정하기",title:"좋은 결과는 수정 대화에서 나왔습니다",
 lead:"숫자 바로 표시 · 링크 확인 · 메뉴 간소화",
 image:"assets/07-revision.svg",
 note:"기초정보인데도 숫자 없이 공식 사이트 링크만 있는 문제, 지역 기업이 중복된 문제, 검색 제공자와 버튼 이름이 다른 문제 등을 구체적으로 수정했습니다."
},
{
 id:"publish",section:"제작 과정",type:"image",kicker:"STEP 04 · 공유하기",title:"완성된 화면을 주소로 공유했습니다",
 lead:"학생용 웹앱은 유지하고, 연수 발표 자료는 별도 주소로 제작",
 image:"assets/08-deploy.svg",
 note:"GitHub Pages를 통해 브라우저에서 열 수 있는 주소로 배포했습니다. 이 연수용 주소는 /local-check/teacher-training/이며 원래 학생용 /local-check/student/와 완전히 분리했습니다."
},
{
 id:"teacher-role",section:"제작 과정",kicker:"제작 과정의 핵심",title:"AI가 만든 것이 아니라,\n교사가 판단하며 완성했습니다",
 body:list(["무엇을 배울지 정하고","실제 정보인지 확인하고","학생 수준에 맞게 고쳤습니다."]),
 note:"AI는 구현을 돕지만 정보의 사실성, 학생 수준, 교육과정과 연결되는지, 현장 적용의 안전성 등은 교사가 판단합니다. 이것이 바이브코딩을 교육에 적용할 때의 핵심입니다."
},
{
 id:"section-use",section:"수업 적용",type:"section",kicker:"PART 04",title:"우리 교실에서는\n어떻게 쓸까요?",lead:"지역을 탐구하고, 근거를 읽고, 자신의 생각을 남기는 수업.",
 body:'<div class="section-number">04 <span>CLASSROOM</span></div>',
 note:"마지막 부분에서는 초등학생 수준에 맞게 40분 수업을 구성하는 방법과 다양한 수준의 학생이 참여하도록 하는 접근법을 다룹니다."
},
{
 id:"lesson",section:"수업 적용",kicker:"초등 사회 수업 예시",title:"40분 수업, 이 흐름이면 됩니다",
 body:flow(["질문하기<br><small>5분</small>","지역정보 보기<br><small>10분</small>","기사·근거 비교<br><small>20분</small>","탐정 카드<br><small>5분</small>"]),
 note:"교사 시범을 포함한 40분 예시입니다. 실제 뉴스 검증은 학생 수준에 따라 길어질 수 있습니다. 디지털 도구의 기능 설명보다 학생이 어떤 자료를 비교했는지에 집중합니다."
},
{
 id:"levels",section:"수업 적용",kicker:"학생 수준에 맞게",title:"같은 웹앱,\n서로 다른 탐구 질문",
 body:compare(["3–4학년","무엇이 있나요?","우리 고장의 강과 박물관을 찾고 기사 속 장소와 비교합니다."],["5–6학년","왜 달라졌을까요?","지역 산업·환경 기사와 통계의 근거를 비교하고 판단합니다."]),
 note:"학년군 예시는 제안으로, 학급의 교육과정과 학생 수준에 따라 조절합니다. 말하기, 선택하기, 읽고 쓰기 등 수행 방식도 유연하게 정합니다."
},
{
 id:"check",section:"수업 적용",kicker:"교사 점검 사항",title:"수업 전, 세 가지만 확인합니다",
 body:list(["출처와 기준일이 분명한가?","원문 링크가 지금도 열리는가?","학생의 개인정보가 남지 않는가?"]),
 note:"공공기관 링크도 내용과 주소가 바뀔 수 있습니다. 기기별 저장 게시판이라고 해서 학생 개인정보를 넣어도 된다는 의미는 아닙니다. 뉴스 검색 제공자에 따라 검색 결과가 다를 수 있습니다."
},
{
 id:"closing",section:"마무리",type:"closing",kicker:"오늘의 한 문장",title:"AI는 만드는 속도를 높이고,\n교사는 배움의 방향을 정합니다",
 lead:"학생이 지역을 알고, 정보를 확인하고, 책임 있게 판단하도록.",
 body:'<a class="hero-link" href="https://pace33.github.io/vibe-coding-math-presentation/local-check/student/" target="_blank" rel="noopener noreferrer">우리 지역 탐정 웹앱 살펴보기 ↗</a>',
 note:"전체 메시지를 정리합니다. AI를 활용한 제작 자체가 교육목표가 아니라 학생의 근거 기반 판단이 목표입니다."
},
{
 id:"sources",section:"마무리",kicker:"참고 자료",title:"근거 자료와 제작 기록",
 body:'<div class="source-links"><a href="https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&amp;boardSeq=93459&amp;lev=0&amp;m=020402&amp;opType=N" target="_blank" rel="noopener noreferrer">교육부 · 2022 개정 교육과정 안내 ↗</a><a href="https://pace33.github.io/vibe-coding-math-presentation/local-check/student/" target="_blank" rel="noopener noreferrer">우리 지역 탐정 · 학생용 웹앱 ↗</a><a href="https://github.com/pace33/vibe-coding-math-presentation/tree/main/local-check" target="_blank" rel="noopener noreferrer">프로젝트 제작 기록 · GitHub ↗</a></div>',
 note:"슬라이드의 제작 과정 화면은 실제 개발 경험과 현재 웹앱 기능을 바탕으로 재구성한 이미지입니다. 실제 뉴스 사건과 검색 결과를 그대로 캡처한 것이 아닙니다."
}
];
window.TRAINING_SLIDES=SLIDES;
window.TRAINING_META={title:"우리 지역, 탐정처럼 읽다",date:"2026. 11. 25.(수)",time:"15:00–17:00",originalUrl:"https://pace33.github.io/vibe-coding-math-presentation/local-check/student/"};
})();