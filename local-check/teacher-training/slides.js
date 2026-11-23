(() => {
"use strict";
/* 사회과 성취기준은 국립특수교육원 2022 개정 공통교육과정 사회과 성취수준 자료 참고.
 * 국어 매체 영역은 경기도교육청 2025 자료의 [6국06-02] 참고.
 * '사용자 요청 원문'은 실제 프로젝트 대화에서 확인한 문장만 표기합니다.
 * 초기 설계 프롬프트는 원문 전문을 확인하지 못했으므로 '취지 재구성'으로 표시합니다.
 */
const SOCIAL_SRC="https://www.nise.go.kr/ebook/src/viewer/download.php?host=main&no=1&site=20240819_172144";
const SCHOOL_SRC="https://www.ice.go.kr/upload/ice/na/bbs_1630/2026/02/99349a5278e3ed9b63bb236e6ca06d29.pdf";
const KOREAN_SRC="https://www.goe.go.kr/resource/old/BBSMSTR_000000030222/BBS_202504210452515481.pdf";
const SITE="https://pace33.github.io/vibe-coding-math-presentation/local-check/student/";
const github="https://github.com/pace33/vibe-coding-math-presentation/tree/main/local-check";
const code=(id,text,summary,ref)=>'<div class="standard-block"><div class="standard-head"><span class="standard-code">'+id+'</span><span>2022 개정 교육과정</span></div><strong class="standard-text">'+text+'</strong><p>'+summary+'</p><a href="'+ref+'" target="_blank" rel="noopener noreferrer">성취기준 원문·설명자료 확인 ↗</a></div>';
const quote=(s,kind)=>'<div class="prompt-example"><span class="prompt-type">'+kind+'</span><blockquote>'+s+'</blockquote></div>';
const small=(s)=>'<p class="fineprint">'+s+'</p>';
const list=(items)=>'<div class="big-list">'+items.map((v,i)=>'<div class="big-list-row"><span>'+String(i+1).padStart(2,"0")+'</span><strong>'+v+'</strong></div>').join("")+'</div>';
const compare=(a,b)=>'<div class="comparison"><div><small>'+a[0]+'</small><strong>'+a[1]+'</strong><p>'+a[2]+'</p></div><div><small>'+b[0]+'</small><strong>'+b[1]+'</strong><p>'+b[2]+'</p></div></div>';
const newsCompare=(articles,conclusion,detail,learning=[])=>'<div class="news-comparison">'+
 '<div class="news-comparison-grid">'+articles.map((a,i)=>
 '<article class="news-comparison-paper">'+
 '<div class="news-paper-top"><span>기사 '+(i+1)+'</span><b>'+a.source+'</b><time>'+a.date+'</time></div>'+
 '<h3>'+a.title+'</h3>'+
 '<p class="news-paper-summary">'+a.summary+'</p>'+
 '<div class="news-paper-bottom"><span>'+a.focus+'</span><a href="'+a.url+'" target="_blank" rel="noopener noreferrer">기사 원문 ↗</a></div>'+
 '</article>').join("")+'</div>'+
 '<div class="news-compare-result"><span class="news-result-label">비교 결과</span><strong>'+conclusion+'</strong><p>'+detail+'</p>'+
 (learning.length?'<div class="news-compare-learning"><b>학생이 배울 점</b>'+learning.map(v=>'<span>'+v+'</span>').join("")+'</div>':'')+'</div></div>';
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
 id:"textbook-problems",section:"교과서 근거",kicker:"4학년 2학기 · 지역 문제 해결",title:"교과서 단원은 문제 발견에서\n주민 참여까지 이어집니다",
 body:flow(["우리 주변의<br>문제 알아보기","문제가 생긴<br>원인 찾기","해결 방안<br>비교하기","해결에<br>참여하기"])+small('<a href="'+SCHOOL_SRC+'" target="_blank" rel="noopener noreferrer">출처: 인천광역시교육청(2026) 초등 사회 4-2 단원 연계 서·논술형 평가자료 ↗</a>'),
 note:"인천광역시교육청의 2026년 초등 사회 4학년 2학기 2단원 연계 자료는 '지역 문제를 해결하고 지역을 알리는 노력'을 다룹니다. 탐구의 순서는 지역 문제 발견, 원인 찾기, 해결 방안, 주민 참여입니다. 이것은 출판사별 교과서 원문을 그대로 보여 주는 화면이 아니라 교육청의 단원 연계 자료를 바탕으로 정리한 활동 흐름입니다."
},
{

 id:"social-region",section:"교과서 근거",kicker:"사회 3~4학년군 · 지역 이해",title:"지역의 자연·역사·문화·생산물을\n살펴봅니다",
 body:code("[4사09-02]","지역의 자연환경, 역사, 문화, 생산물 등을 알리려는 지역사회의 노력을 알고 관심을 갖는다.","지역의 특징을 조사하고 문화·축제·생산물을 찾아보는 활동으로 연결했습니다.",SOCIAL_SRC),
 note:"[4사09-02]는 지역 이해와 지역사회 활동을 탐구하는 성취기준입니다. 그래서 자연환경·생활시설·산업과 경제·역사와 문화 등의 대표 정보를 학생용 카드로 보여주도록 설계했습니다. 이 6개 분야는 웹앱을 위해 재구성한 메뉴이지 교과서의 공식 여섯 영역이라는 뜻은 아닙니다."
},
{
 id:"textbook-pride",section:"교과서 근거",kicker:"4학년 2학기 · 우리 지역 알리기",title:"지역 자랑거리 한 곳을 고르고\n왜 소중한지 설명합니다",
 body:list(["소개할 장소와 이름 정하기","그곳의 특징·좋아하는 이유 찾기","다른 사람에게 지역을 소개하기"])+small('<a href="'+SCHOOL_SRC+'" target="_blank" rel="noopener noreferrer">출처: 인천광역시교육청(2026) 사회과 4-2 단원 연계 평가 문항 ↗</a>'),
 note:"인천광역시교육청의 실제 평가 문항은 우리 지역의 자랑거리 중 장소를 정하고 이름·특징·좋아하는 이유를 설명하는 과제로 구성됩니다. 우리 지역 탐정의 자연환경·역사와 문화·관광·특산물 정보는 학생이 설명할 구체적인 근거를 모으도록 한 것입니다. 학생용 웹앱에는 완성된 지역 홍보 포스터 제작 기능은 없으므로 수업에서 교사가 별도로 표현 활동을 설계해야 합니다."
},
{

 id:"korean-media",section:"교과서 근거",kicker:"국어 5~6학년군 · 매체",title:"뉴스가 믿을 만한지\n따져 보는 기준도 있습니다",
 body:code("[6국06-02]","뉴스 및 각종 정보 매체 자료의 신뢰성을 평가한다.","작성 주체 · 정보 출처 · 근거를 종합적으로 살펴보도록 안내합니다.",KOREAN_SRC),
 note:"뉴스의 신뢰성 평가를 직접적으로 명시하는 성취기준은 사회가 아니라 국어과 [6국06-02]입니다. 사회의 지역문제 탐구를 국어의 매체 신뢰성 평가와 연결하는 교과 연계 설계라는 점을 정확하게 설명합니다."
},
{
 id:"textbook-news-task",section:"교과서 근거",kicker:"신문 기사 + 통계 · 지역 문제 해결",title:"신문 기사를 읽고\n지역 문제와 원인을 찾습니다",
 body:flow(["기사에서<br>문제 찾기","통계·조사<br>자료 읽기","원인과<br>영향 생각","해결 방안<br>제안하기"])+small('<a href="'+SCHOOL_SRC+'" target="_blank" rel="noopener noreferrer">출처: 인천광역시교육청(2026), 「초등 서·논술형 평가도구 자료집」 사회 4-2 평가 예시 ↗</a>'),
 note:"인천광역시교육청 2026 사회과 평가 예시에는 신문 기사 속 지역 문제 2가지를 찾고, 지역 문제를 조사한 그래프에서 심각한 문제를 찾고, 그 원인과 해결 방법을 글로 표현하는 활동이 있습니다. 이것은 현재 제공된 특정 출판사의 사회 교과서 원문이 아닌, 2022 개정 사회과 단원에 근거해 개발된 교육청 평가 예시 자료입니다. 학생 웹앱은 뉴스/공식자료를 찾고 검증을 기록하는 과정까지 지원하며 그래프 자동 해석이나 해결책 자동 생성 기능은 없다고 구분합니다."
},
{

 id:"curriculum-model",section:"교과서 근거",kicker:"사회 × 국어 연계",title:"교과서의 탐구 과정을\n웹앱의 학습 흐름으로",
 body:flow(["지역 문제 발견","기사·공공자료 수집","출처·근거 비교","판단하고 기록"]),
 note:"사회과에서 지역 문제를 발견하고 뉴스와 공공기관 자료를 찾습니다. 국어과 매체 역량으로 출처와 근거를 평가한 다음 판단의 이유를 기록합니다. 이 4단계 흐름은 교육과정 성취기준들을 결합해 교사가 설계한 모델이지 어느 한 교과서에 그대로 제시된 4단계 명칭이 아닙니다."
},
{
 id:"social-environment",section:"교과서 근거",kicker:"사회 3~4학년군 · 지역의 여러 환경",title:"지역의 자연·인구·교통·산업도\n탐구 내용입니다",
 body:'<div class="double-standards">'+
 code("[4사10-01]","여러 지역의 자연환경과 인문환경의 특징을 살펴보고, 환경의 이용과 개발에 따른 변화를 탐구한다.","우리 지역·다른 지역의 자연환경을 비교하는 근거",SOCIAL_SRC)+
 code("[4사10-02]","사례에서 도시의 인구, 교통, 산업 등의 특징을 탐구하고, 도시에서의 삶의 모습을 이해한다.","기본정보·생활시설·산업의 구분 근거",SOCIAL_SRC)+
 '</div>',
 note:"이전 발표는 [4사09-01]과 [4사09-02]만으로 여섯 분야 전체를 설명해 일부 연결이 억지스러웠습니다. [4사10-01]은 자연환경과 인문환경의 특징 및 개발의 변화를, [4사10-02]는 도시의 인구·교통·산업을 다룹니다. 기본 정보/자연환경/생활시설/산업을 나누는 설계 의도를 보충해 줍니다. 우리 지역을 조사하는 것과 다른 여러 지역을 비교하는 것은 별도 활동임을 안내합니다."
},
{

 id:"gap",section:"교과서 근거",kicker:"사회과 교수학습 참고자료 · [4사09-01]",title:"지역 문제 조사의 방법으로\n‘뉴스’를 제시합니다",
 body:list(["지역 뉴스를 살펴본다.","지역신문의 기사를 살펴본다.","공공기관 누리집에서 주민 의견을 살펴본다."])+
 small('<a href="'+SOCIAL_SRC+'" target="_blank" rel="noopener noreferrer">출처: 2022 개정 사회과 성취수준·교수학습 참고자료 [4사09-01] ↗</a>'),
 note:"사회과의 [4사09-01] 교수학습 참고자료에는 지역의 문제를 조사하는 방법으로 '지역신문의 기사를 살펴본다', '지역 뉴스를 살펴본다', '인터넷으로 공공기관 누리집에 접속하여 주민이 요청한 내용을 살펴본다'가 제시되어 있습니다. 특정 출판사 교과서의 문구가 아니라 2022 사회과 성취수준 지도 자료의 예시입니다."
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
 id:"app-nature",section:"완성된 수업 도구",type:"image",kicker:"자연환경 · 사회 [4사10-01]",title:"산과 하천을 '직접 찾는 탐구'로",
 lead:"자연환경 이름 → 지도·공식자료 → 변화 관련 뉴스",
 image:"assets/16-nature.svg",
 note:"사회과 [4사10-01]은 자연환경과 인문환경의 특징, 이용·개발에 따른 변화를 살펴보는 활동과 연결됩니다. 지역 산·하천·저수지 이름을 학생이 바로 볼 수 있도록 했습니다. 이름에 관한 정보는 기초 카드에서, 변화 상황과 환경문제는 관련 뉴스에서 확인하도록 구분했습니다. 그림은 실제 웹앱 자료를 바탕으로 재구성했습니다."
},
{
 id:"app-public",section:"완성된 수업 도구",type:"image",kicker:"생활시설 · 사회 [4사09-01] · [4사10-02]",title:"공공기관의 역할을 자료로 확인합니다",
 lead:"도서관·안전체험관·공공기관 → 역할 이해와 지역 문제 해결",
 image:"assets/13-community.svg",
 note:"[4사10-02]의 도시 인구·교통·생활의 모습과 [4사09-01]의 지역 문제 해결을 연결합니다. 학생에게 공공기관 홈페이지를 무조건 찾게 하기보다 구체적인 도서관·안전체험관 등의 이름과 체험 안내를 제공하고, 지역 문제를 조사할 때 관련 기관의 공식 자료를 비교하게 합니다."
},
{
 id:"app-industry",section:"완성된 수업 도구",type:"image",kicker:"산업과 경제 · 사회 [4사09-02] · [4사10-02]",title:"우리 지역은 무엇을 생산할까요?",
 lead:"기업·지역 업체·특산물 → 생산 활동 → 견학·체험",
 image:"assets/11-industry.svg",
 note:"[4사09-02] 지역의 생산물과 알리기 활동, [4사10-02] 도시의 산업 특징을 학습과 연결했습니다. 업체 목록을 단순히 나열하지 않고 생산하는 제품, 관련 뉴스, 학생 견학 정보를 살펴보도록 구성했습니다. 견학과 일반 방문, 학교 단체 사전 협의는 다르므로 학교가 실제 예약 가능 여부를 확인해야 합니다."
},
{
 id:"app-culture",section:"완성된 수업 도구",type:"image",kicker:"역사와 문화 · 사회 [4사09-02]",title:"축제·박물관·유적이 필요한 이유",
 lead:"지역의 문화 자원을 조사하고, 그 가치를 소개하는 활동",
 image:"assets/12-culture.svg",
 note:"[4사09-02]는 지역의 자연환경·역사·문화·생산물과 지역사회의 노력을 탐구하는 내용이므로, 문화유산 이름만 제공하는 것으로 부족합니다. 전시·체험이 가능한 박물관·미술관과 지역 축제·예술 행사 정보를 추가했습니다. 다만 축제 개최일과 운영 정보는 해마다 변경되므로 최신 공지로 확인하도록 안내합니다."
},
{
 id:"app-issues",section:"완성된 수업 도구",type:"image",kicker:"지역문제 · 사회 [4사09-01]",title:"이 분야는 뉴스를 먼저 보여줍니다",
 lead:"환경 · 교통 안전 · 교육·복지 · 지역 생활 문제",
 image:"assets/10-issues.svg",
 note:"다른 세부 분야는 지명·시설명처럼 변동이 적은 기초정보를 먼저 보여 주지만 지역문제 영역은 현재 지역에서 일어나는 문제를 조사하는 교과 활동에 맞춰 뉴스 검색을 우선 배치했습니다. 교사는 기사 제목이 사실 검증 완료가 아니라는 점을 분명히 하고 공공기관 자료와 비교하는 절차를 지도합니다."
},
{

 id:"app-news",section:"완성된 수업 도구",type:"image",kicker:"지역 문제 발견 · [4사09-01]",title:"지역 뉴스에서 문제를 찾습니다",
 lead:"뉴스 검색은 탐구의 시작이지 사실 판정의 끝이 아닙니다",
 image:"assets/04-news.svg",
 note:"학생은 자신이 선택한 지역의 뉴스와 공공기관 자료를 찾아봅니다. 실시간 뉴스 검색은 외부 제공자의 응답에 의존하고, 검색 결과에는 검증 완료 표시가 붙지 않습니다. 제공처는 실제 구글/빙 RSS에 따라 달라집니다."
},
{
 id:"app-article-traffic",section:"완성된 수업 도구",kicker:"실제 기사 비교 ① · 사회 [4사09-01]",
 title:"두 기사는 무엇이 같고\n어떤 점을 더 확인해야 할까요?",
 lead:"음성군 불법 주정차 단속 · 같은 정책을 다룬 두 언론사",
 body:newsCompare([
  {source:"연합뉴스",date:"2026. 8. 4. 11:24",title:"음성군, 혁신도시 버스터미널 인근 불법주정차 24시간 단속",summary:"음성군 발표: 8월 5일부터 버스터미널 인근의 단속 시간을 24시간으로 확대.",focus:"단속 시기·정책 목적",url:"https://www.yna.co.kr/amp/view/AKR20260804078900064"},
  {source:"아이뉴스24",date:"2026. 8. 4. 10:15",title:"충북혁신도시 버스터미널 앞 불법 주정차 ‘24시간 단속’",summary:"단속 방법: 주말·공휴일과 점심시간에도 CCTV 단속을 실시한다는 내용.",focus:"구체적 단속 방법",url:"https://v.daum.net/v/20260804101508047"}
 ],"두 기사 모두 음성군의 동일한 단속 발표를 전합니다.","언론사는 달라도 공통 원천은 음성군 발표입니다. 공식 공고로 시행일·단속 구간을 확인해야 합니다.",[
  "① 공통 사실 찾기","② 기사마다 강조한 내용 비교","③ 원자료까지 확인하기"
 ]),
 note:"연수 진행 예시: ‘두 기사가 공통으로 말하는 것은 음성군의 24시간 불법 주정차 단속 계획입니다. 연합뉴스는 시행 시기와 취지를, 아이뉴스24는 CCTV 단속 방식과 적용 시간을 더 설명합니다. 그러나 두 기사가 모두 음성군의 발표를 바탕으로 하므로 독립적인 증거가 두 개인 것은 아닙니다. 학생에게는 공통점과 차이점을 정리하게 하고 음성군 공식 안내로 시행일과 구간을 확인하게 합니다.’ 두 기사의 문장은 수업용 요약입니다."
},
{
 id:"app-article-environment",section:"완성된 수업 도구",kicker:"실제 기사 비교 ② · 국어 [6국06-02]",
 title:"같은 지역의 뉴스라도\n같은 사건은 아닙니다",
 lead:"옥천군의 환경 기사 · 4월 무단 투기와 9월 추석맞이 청소",
 body:newsCompare([
  {source:"뉴스1",date:"2026. 4. 1.",title:"종량제봉투 파장 탓?…옥천군 곳곳 몰래 버린 쓰레기 몸살",summary:"대청호 주변 야산과 낚시터에서 생활쓰레기 무단 투기가 이어지는 문제를 보도.",focus:"문제 발견 · 대청호 주변",url:"https://v.daum.net/v/20260401103225867"},
  {source:"국제뉴스",date:"2026. 9. 18.",title:"옥천군, 추석 앞두고 200여 공직자와 국토대청결 활동",summary:"추석을 앞두고 공직자 200여 명이 주요 시가지에서 환경 정화 활동을 진행한 내용.",focus:"환경 개선 활동 · 주요 시가지",url:"https://www.gukjenews.com/news/articleView.html?idxno=3699363"}
 ],"두 기사는 날짜·장소·사건이 다르므로 직접적인 원인과 결과가 아닙니다.","9월의 청소 활동만으로 4월 대청호 무단 투기 문제가 해결되었다고 말할 수 없습니다.",[
  "① 언제·어디서·무슨 일인지 구별","② 제목의 추측과 사실 구분","③ 근거 없는 ‘문제 해결’ 단정 피하기"
 ]),
 note:"교사 설명: ‘4월 뉴스1 기사는 대청호 주변 야산·낚시터의 불법 쓰레기 투기를 문제로 지적합니다. 기사 제목 속 “종량제봉투 파장 탓?”은 의문형으로 원인을 확정한 표현이 아닙니다. 9월 국제뉴스 기사는 추석을 앞둔 옥천군 주요 시가지의 환경 정화 활동을 전합니다. 같은 옥천군의 환경 뉴스지만 날짜와 장소와 사건이 달라 9월의 청소가 4월 문제를 해결한 증거는 아닙니다.’ 학생이 배울 점은 시간·장소·사건 확인, 사실과 추측 구별, 근거가 부족할 때 판단 유보입니다. 이어지는 활동은 ‘문제가 계속되는지 옥천군 공식 자료와 현장 자료를 더 찾아보기’로 안내합니다."
},
{
 id:"app-article-check",section:"완성된 수업 도구",kicker:"교실에서 학생이 익히는 검증 절차 · 국어 [6국06-02]",
 title:"뉴스를 비교할 때\n이 세 가지를 확인합니다",
 body:flow(["기사 날짜·장소·<br>사건 구분하기","공통 내용과<br>다른 내용 찾기","공식 자료로 확인하고<br>모르는 것은 남겨두기"])+
 small("음성군: 같은 발표를 다룬 기사 2개 ≠ 독립된 증거 2개 / 옥천군: 같은 지역의 환경 뉴스 2개 ≠ 같은 사건"),
 note:"앞의 두 비교 사례를 연결해 학생이 실제로 배울 방법을 정리하는 페이지입니다. 음성군은 동일한 정책 발표를 서로 다른 언론이 보도한 사례, 옥천군은 같은 지역의 환경 주제이지만 시점과 장소가 다른 별개의 사건입니다. 따라서 기사 개수만 세는 것이 아니라 언제·어디서·무엇이 일어났는지와 원자료가 같은지를 구분한 뒤 확인된 사실만 결론으로 말하도록 안내합니다."
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

/* 2026-11-23 교실 현장 중심 개정:
 * 교재를 비판하는 것이 아니라, 교재의 '실제 자료 조사' 과제를 지역별 최신 자료로
 * 수행할 때 발생하는 준비·탐색·검증의 어려움을 웹앱이 어떻게 보조하는지 보여줍니다.
 * 특정 출판사 사회 교과서의 원문·이미지를 자칭하지 않습니다.
 */
const LOCAL_TEXTBOOK="https://www.goe.go.kr/resource/old/BBSMSTR_000000030222/BBS_202503311108019371.pdf";
const LOCAL_ASSESS="https://www.ice.go.kr/upload/ice/na/bbs_1630/2026/02/99349a5278e3ed9b63bb236e6ca06d29.pdf";
const PUBLISHER_FEST="https://e.m-teacher.co.kr/pages/ele/bbs/tabList.mrn/TBM-ltnof1j6-7IXkb99ZR3/55669";
const refLink=(label,href)=>'<a class="field-source" href="'+href+'" target="_blank" rel="noopener noreferrer">'+label+' ↗</a>';
const fieldGap=(task,block,solution)=>'<div class="field-reality">'+
 '<div class="field-cell"><span>교재에서 요구하는 활동</span><strong>'+task+'</strong></div>'+
 '<div class="field-cell"><span>교실에서 발생할 수 있는 어려움</span><strong>'+block+'</strong></div>'+
 '<div class="field-cell solved"><span>웹앱에 반영한 해결 방식</span><strong>'+solution+'</strong></div></div>';
const lessonPreview=(line1,line2,prompt,source)=>'<div class="lesson-preview">'+
 '<div class="lesson-page"><div class="lesson-page-top">경기도 지역화 교재 예시 · 4학년 2학기</div>'+
 '<h3>'+line1+'</h3><p>'+line2+'</p><div class="lesson-page-task">'+prompt+'</div></div>'+
 '<div class="lesson-page-explain"><span>수업 준비에서 실제로 필요한 것은?</span>'+
 '<strong>우리 시·군의 기사,<br>최신 날짜, 확인 가능한 근거</strong>'+
 '<p>교재가 제시한 활동을 우리 지역 자료로 실행할 수 있어야 합니다.</p></div></div>'+
 refLink("교육청 지역화 교재·활동 페이지 확인",source);
const regionalTask=(line1,line2,source)=>'<div class="regional-task">'+
 '<div><span>사회 수업 활동</span><strong>'+line1+'</strong><p>'+line2+'</p></div>'+
 '<div><span>학생이 직접 찾을 정보</span><strong>실제 지역의 장소 이름<br>특징 · 선택한 이유</strong><p>교재 예시를 우리 고장의 실제 장소로 바꿔 보는 활동</p></div>'+
 '</div>'+refLink("교육청 사회과 서·논술형 활동 예시 확인",source);
const classes={
 "field-textbook-news":{
  id:"field-textbook-news",section:"현장 수업의 문제",kicker:"사회 4학년 2학기 · 교재 활동에서 출발",
  title:"교재는 ‘우리 지역 뉴스를\n찾아보자’고 합니다",
  lead:"신문기사·뉴스를 읽고, 지역 문제의 원인을 조사하는 활동",
  body:lessonPreview("지역문제를 확인하는 방법","지역 뉴스와 시·군청 누리집을 찾아보고, 신문기사를 읽어 문제 원인을 조사해 봅니다.","교재 속 예시: OO시의 출퇴근 문제를 기사로 읽고 원인 파악",LOCAL_TEXTBOOK),
  note:"출처는 2022 개정 교육과정에 맞춰 공개된 경기도교육청 지역화 교재 「경기도의 생활」 4학년 2학기 118~119쪽입니다. (교재 기준 표기이며 다른 시도 교과서의 쪽수와 동일하지 않습니다.) 교재가 지역 뉴스와 공공기관 사이트를 살펴보라고 요청한다는 사실과, 우리 충북 학생이 자기 지역의 기사를 직접 찾아야 한다는 수업 운영상의 부담을 구별해서 설명합니다. 교재의 'OO시' 기사는 학습용 예시이며 실제 음성군 기사와 구분합니다."
 },
 "field-gap-news":{
  id:"field-gap-news",section:"현장 수업의 문제",kicker:"교재 활동을 실제로 진행할 때",
  title:"기사를 찾는 데\n수업 시간이 다 지나간다면?",
  body:fieldGap("지역 뉴스·신문기사 찾기","광역 기사·예전 기사·관련 없는 검색 결과가 함께 나옴","시·군 선택 → 지역 뉴스 검색 → 기사 제목·날짜·언론사 확인"),
  note:"교과서 자체의 결함을 주장하는 슬라이드가 아닙니다. 실제 수업에서 학생들이 인터넷 검색으로 지역과 시점을 구분하는 데 많은 안내를 필요로 할 수 있다는 예상 가능한 교수학습상의 문제입니다. 웹앱은 기사 검색의 출발점을 한 화면으로 묶습니다. 자동으로 뉴스의 진위를 확인해 주지는 않습니다."
 },
 "field-compare-gap":{
  id:"field-compare-gap",section:"현장 수업의 문제",kicker:"실제 기사 2개 다음에 물어볼 질문",
  title:"기사 두 개가 같아도\n근거가 두 개인 것은 아닙니다",
  body:fieldGap("기사를 읽고 문제·원인 파악","두 언론사가 동일한 지자체 발표를 보도할 수 있음","원문 읽기 → 공식 보도자료 확인 → 같은 점·다른 점 기록"),
  note:"앞의 음성군 기사 2개는 동일한 정책 발표를 다룹니다. 제목이 비슷하다고 바로 사실이 확정되지는 않습니다. 서로 독립된 자료인지, 발표 주체가 동일한지, 정책의 대상·시점을 원문에서 확인해야 합니다. 학생은 '맞아요 / 달라요 / 아직 모르겠어요' 중 선택하고 이유를 기록할 수 있습니다. 사회 [4사09-01], 국어 [6국06-02]의 교과 연계입니다."
 },
 "field-textbook-region":{
  id:"field-textbook-region",section:"현장 수업의 문제",kicker:"사회 4학년 2학기 · 우리 지역 알리기",
  title:"지역의 자랑거리 한 곳을\n소개해 봅시다",
  lead:"장소 이름 · 특징 · 사람들이 좋아하는 이유를 조사하고 표현하기",
  body:regionalTask("자랑할 만한 장소를 정해 소개하기","이름과 특징을 찾아보고 사람들이 좋아하는 이유를 자기 말로 표현합니다.",LOCAL_ASSESS)+
  '<p class="fineprint">관련 교과서 활동: 미래엔 사회 4-2 ‘다양한 지역 축제 조사하기’(81쪽) · '+refLink("수업자료",PUBLISHER_FEST)+'</p>',
  note:"인천광역시교육청 2026 초등 사회 서·논술형 평가도구의 4학년 2학기 2단원(137쪽)에서 장소 이름·특징·좋아하는 이유를 조사하여 소개하는 예시를 확인했습니다. 미래엔 사회 4-2 교사용 자료에서는 다양한 지역 축제 조사하기(81쪽)를 안내합니다. 이는 서로 다른 출판사·시도의 자료를 보여 주는 사례이지 충북 특정 교과서의 81쪽·137쪽이라는 뜻이 아닙니다. 웹앱은 실제 장소·축제 정보를 찾는 일을 돕지만 최종 발표문·그림을 자동으로 만들어 주지 않습니다."
 },
 "field-gap-region":{
  id:"field-gap-region",section:"현장 수업의 문제",kicker:"교실에서 실제 자료 찾기의 어려움",
  title:"‘우리 지역’이라는 말에\n학생마다 다른 자료가 나옵니다",
  body:fieldGap("우리 고장의 장소·축제 조사하기","교재의 다른 지역 예시와 실제 시·군 자료가 다름. 기관 사이트도 흩어져 있음","충북 11개 시·군 선택 → 6개 분야에서 실제 명칭·출처 확인"),
  note:"교과서는 지역 탐구 절차를 안내합니다. 그런데 학생이 사는 충북 음성군·옥천군·진천군 등에서는 구체적 장소·행사·기업이 달라져 지역별 자료 수집이 필요합니다. 웹앱은 기본 정보·자연환경·생활시설·산업과 경제·역사와 문화·지역문제를 나눠 실제 명칭을 카드에서 먼저 제시합니다. 목록은 대표 사례로 한정되며 완전한 지역 백과사전은 아닙니다."
 },
 "field-standards":{
  id:"field-standards",section:"현장 수업의 문제",kicker:"교과서 활동과 웹앱 설계의 실제 연결",
  title:"그래서 이런 기능을 만들었습니다",
  body:'<div class="field-matrix">'+
  '<div><span>사회 [4사09-01]</span><strong>지역의 문제 조사</strong><b>지역 뉴스 검색 · 공공자료 비교</b></div>'+
  '<div><span>사회 [4사09-02]</span><strong>지역의 자랑거리 알리기</strong><b>11개 시·군 · 축제·문화·생산물</b></div>'+
  '<div><span>국어 [6국06-02]</span><strong>뉴스의 신뢰성 살펴보기</strong><b>출처·날짜·근거 확인 · 탐정 카드</b></div>'+
  '</div>'+
  '<p class="fineprint">성취기준은 수업 설계의 근거이며, 웹앱의 6개 메뉴가 교과서의 공식 분류라는 뜻은 아닙니다.</p>',
  note:"사회 [4사09-01]은 지역 문제 파악과 해결, [4사09-02]는 자연·역사·문화·생산물에 대한 지역사회의 노력을 다룹니다. 국어 [6국06-02]는 뉴스 및 정보매체 자료의 신뢰성 평가입니다. 사회 탐구의 자료 수집과 국어 신뢰성 평가를 연계한 수업 사례라는 점을 보여줍니다. 과도한 성취기준 해설 대신 학생이 무엇을 수행하는지와 실제 기능을 연결합니다."
 }
};

/* 교사 연수용 '이 웹앱을 만드는 과정' — 실제 파일 구조와 작동 방식에서 도출한
 * 단계별 제작 안내. 요청문은 재사용할 수 있게 재작성한 예시이며, 최초 제작 원문이 아닙니다.
 * 참가자는 직접 코딩하지 않고 PPT 화면과 화면 시연을 관찰합니다.
 */
const makePrompt=(lines,foot)=>'<div class="build-prompt-layout"><div class="build-prompt">'+
 '<div class="build-prompt-top"><span>교사용 단계별 요청문 예시</span><b>복사해 응용 가능</b></div>'+
 '<div class="build-prompt-lines">'+lines.map((x,i)=>'<p><span>'+String(i+1).padStart(2,"0")+'</span>'+x+'</p>').join("")+'</div></div>'+
 '<div class="build-prompt-foot">'+foot+'</div></div>';
const buildRow=(arr)=>'<div class="build-rows">'+arr.map((x,i)=>'<div class="build-row"><span>'+String(i+1).padStart(2,"0")+'</span><strong>'+x[0]+'</strong><p>'+x[1]+'</p></div>').join("")+'</div>';
const systemFlow=(arr)=>'<div class="build-system">'+arr.map(x=>'<div class="build-system-card"><small>'+x[0]+'</small><strong>'+x[1]+'</strong><p>'+x[2]+'</p></div>').join("")+'</div>';
const spec=(items)=>'<div class="build-spec">'+items.map(x=>'<div><span>'+x[0]+'</span><strong>'+x[1]+'</strong><p>'+x[2]+'</p></div>').join("")+'</div>';
const twoStep=(left,right)=>'<div class="build-two"><section><span>'+left[0]+'</span><strong>'+left[1]+'</strong><p>'+left[2]+'</p></section><section><span>'+right[0]+'</span><strong>'+right[1]+'</strong><p>'+right[2]+'</p></section></div>';
Object.assign(classes,{
 "build-overview":{
  id:"build-overview",section:"웹앱 제작 방법",kicker:"제작 과정 01 · 전체 흐름",
  title:"교사가 설명하면\nAI가 만들고 함께 고칩니다",
  body:buildRow([
   ["수업 목표 정하기","학생이 지역 뉴스를 찾고 비교하는 활동 구상"],
   ["AI에게 요청하기","원하는 화면과 기능을 평소 말로 설명"],
   ["결과 직접 확인하기","학생처럼 눌러 보고 자료와 버튼 확인"],
   ["부족한 부분 고치기","어떤 점이 불편한지 말하고 수정 요청"],
   ["수업에서 활용하기","완성한 웹앱 주소를 학생에게 안내"]
  ]),
  note:"교사는 코드를 읽거나 직접 입력할 필요가 없습니다. 수업에 필요한 활동을 설명하고 AI가 제작을 돕습니다. 결과를 직접 눌러 보고 수정하는 과정이 중요합니다."
 },
 "build-spec":{
  id:"build-spec",section:"웹앱 제작 방법",kicker:"개발 과정 02 · 수업 목표를 기능으로 바꾸기",
  title:"‘무엇을 만들까’보다\n‘학생이 무엇을 할까’",
  body:spec([
   ["학습 활동","지역 뉴스 읽기","사회 [4사09-01] · 지역 문제 조사"],
   ["학생의 행동","지역 선택 → 기사 열기","언론사·날짜·출처 살펴보기"],
   ["학습의 증거","비교·판단 기록","같아요 / 달라요 / 아직 모르겠어요"]
  ]),
  note:"수업 문제를 UI 요구사항으로 번역하는 단계입니다. '뉴스 검색 앱 만들어줘'는 목표가 분명하지 않습니다. 초등 4학년 학생이 지역을 선택하고 원문을 읽고 근거자료와 비교해 판단의 이유를 남기도록 명세를 만듭니다. 이 세 가지 행위가 다음 구현 단계의 테스트 기준이 됩니다."
 },
 "build-toolmap":{
  id:"build-toolmap",section:"웹앱 제작 방법",kicker:"제작 과정 03 · 교사와 AI의 역할",
  title:"코딩보다 중요한 것은\n원하는 수업을 설명하는 일",
  body:systemFlow([
   ["교사가 할 일","어떤 활동이 필요한지 말하기","예: 지역을 선택하고 뉴스를 비교하게 해줘"],
   ["AI가 도울 일","웹앱 화면과 기능 만들기","프로그램 작성과 오류 수정은 AI에게 요청"],
   ["함께 확인할 일","실제 학생처럼 사용해 보기","기사·출처·버튼·기록이 제대로 되는지 확인"]
  ]),
  note:"파일 이름이나 프로그램 언어보다 교사와 AI의 역할을 쉽게 설명합니다. 외부 뉴스 연결과 사이트 공개에는 별도 설정이 필요할 수 있어 실제 작동을 확인해야 합니다."
 },
 "build-first-prompt":{
  id:"build-first-prompt",section:"웹앱 제작 방법",kicker:"개발 과정 04 · 첫 화면 제작 요청 예시",
  title:"첫 요청은 ‘완성’이 아닌\n작동하는 기본 화면까지",
  body:makePrompt([
   "초등 4학년 사회 수업용 지역 탐구 웹앱을 만들고 싶어요.",
   "학생은 시·군을 선택하고 지역 뉴스와 기초자료를 살펴봅니다.",
   "상단 메뉴는 뉴스 찾기 / 우리 지역 / 탐정 게시판 3개로 해주세요.",
   "우리 지역에는 기초정보·자연·생활시설·산업·역사문화·지역문제 탭을 둡니다.",
   "이번 단계는 메뉴·지역 선택이 실제로 바뀌는 화면만 구현하세요."
  ],"확인할 결과: 메뉴가 전환되는가? 지역을 바꾸면 선택값이 유지되는가?"),
  note:"이것은 실제 최초 요청 원문이 아니라, 본 앱의 구조를 기준으로 재사용할 수 있게 설계한 교육용 1단계 프롬프트입니다. 프롬프트를 한 번에 다 넣을수록 결과의 오류가 커질 수 있어 기본 화면과 기능 구현을 분리합니다. 원하는 산출물은 index.html, style.css, app.js 같은 파일과 실행 가능한 화면입니다. 참가자에게 직접 따라 하도록 요구하지 않고 화면과 문장만 제시합니다."
 },
 "build-first-result":{
  id:"build-first-result",section:"웹앱 제작 방법",type:"image",kicker:"1차 결과 · 구조 먼저 확인",
  title:"메뉴가 실제로 움직이는지\n먼저 확인합니다",
  lead:"처음에는 기능보다 화면 구조와 이동 흐름부터",
  image:"assets/02-menu.svg",
  note:"슬라이드 이미지는 학생용 웹앱의 현재 메뉴 구성을 재구성한 시연 자료입니다. 최초 버전의 실제 캡처라고 주장하지 않습니다. 이 단계에서는 탭 이동, 지역 선택, 글자 길이와 화면 여백 등을 확인합니다. 학교 현장에서 화면이 읽히는지 판단하고 나서 다음 단계로 진행합니다."
 },
 "build-data-prompt":{
  id:"build-data-prompt",section:"웹앱 제작 방법",kicker:"개발 과정 05 · 지역자료 연결 요청",
  title:"두 번째 요청은\n실제 지역 데이터입니다",
  body:makePrompt([
   "충북 11개 시·군의 지역정보 카드를 구성해주세요.",
   "기초정보·자연·생활시설·산업·역사문화·지역문제로 분류하세요.",
   "카드에는 실제 명칭, 학생용 짧은 설명, 출처 기관, 원문 주소를 넣으세요.",
   "인구 같은 통계는 값과 기준일을 함께 표시하세요.",
   "확인되지 않은 수치·주소·견학 가능 여부는 만들어내지 마세요."
  ],"확인할 결과: 실제 지명·공식자료 링크·기준일이 학생 화면에 보이는가?"),
  note:"이 내용은 교사용 예시 요청문입니다. 실제 데이터는 지역별 안내문과 공식 누리집을 확인해 채웁니다. 저장소에서 지역카드를 만드는 파일은 regional-basics.js, regional-landmarks.js, regional-visits.js, businesses.js 및 관련 파일로 분리되어 있습니다. AI가 제시한 지명과 숫자는 자동으로 사실이 되는 것이 아닙니다. 특히 11개 시·군의 인구 수치는 기준일·집계 기준을 동일하게 확인해야 합니다."
 },
 "build-data-result":{
  id:"build-data-result",section:"웹앱 제작 방법",type:"image",kicker:"2차 결과 · 기초자료 카드",
  title:"숫자만 넣는 것이 아니라\n‘근거’를 붙입니다",
  lead:"값 · 기준일 · 출처 · 공식 상세자료 링크",
  image:"assets/03-basics.svg",
  note:"이 예시 화면은 기초정보 카드를 시각적으로 재구성한 것입니다. 실제 웹앱에서는 기본정보 카드와 기초 지역자료가 여러 JS 데이터 파일에 저장됩니다. 교사가 인구나 면적 같은 값이 맞는지 원문을 열어 확인하고, 누락 항목이 있으면 출처를 재조사합니다. 외부 뉴스 검색과 달리 변동이 적은 기초 자료를 먼저 표시해 수업 시작 시간을 줄인 설계입니다."
 },
 "build-news-structure":{
  id:"build-news-structure",section:"웹앱 제작 방법",kicker:"제작 과정 06 · 뉴스 검색 연결",
  title:"학생이 검색하면\n어떻게 뉴스가 나올까요?",
  body:systemFlow([
   ["학생 화면","지역과 검색어 입력","예: 음성군 + 반도체"],
   ["뉴스 찾기","입력한 말로 관련 기사 검색","구글·빙에서 실제 뉴스 정보를 찾아 연결"],
   ["검색 결과","제목·날짜·언론사 보여주기","원문을 읽고 다른 기사와 비교"]
  ]),
  note:"검색 서버·RSS·API라는 기술 용어를 외우지 않아도 됩니다. 학생이 검색어를 입력하면 웹앱이 뉴스 제공처에서 기사 정보를 가져와 제목·날짜·원문 링크를 보여줍니다. RSS는 뉴스 기사 목록을 전달받는 방법이며 검색 결과 자체는 사실 검증 완료를 뜻하지 않습니다."
 },
 "build-news-prompt":{
  id:"build-news-prompt",section:"웹앱 제작 방법",kicker:"제작 과정 07 · AI에게 뉴스 기능 요청하기",
  title:"검색 기능도\n평소 말로 부탁하면 됩니다",
  body:makePrompt([
   "학생이 지역과 검색어를 입력하면 실제 뉴스를 검색하게 해줘.",
   "구글·빙 등 실제 뉴스 정보에 연결하고, 없는 기사를 만들어내지 마.",
   "결과에 기사 제목·언론사·날짜·원문 링크를 보여줘.",
   "기사가 없거나 검색이 안 되면 학생이 이해할 안내를 보여줘.",
   "필요한 프로그램 작성과 연결 작업은 네가 하고, 내가 확인할 방법을 알려줘."
  ],"확인할 결과: ‘음성군 반도체’를 검색하면 실제 기사와 원문 링크가 나오는가?"),
  note:"연수용으로 재구성한 교사 요청문 예시입니다. AI가 프로그램 작성을 도와도 뉴스 서비스 연결에는 별도 설정이 필요할 수 있습니다. 실제 기사 검색과 원문 열기를 직접 확인합니다."
 },
 "build-check-prompt":{
  id:"build-check-prompt",section:"웹앱 제작 방법",kicker:"개발 과정 08 · 검증 학습 흐름 요청",
  title:"기사를 보여준 다음\n‘비교 활동’을 연결합니다",
  body:makePrompt([
   "학생이 뉴스 기사를 선택하면 원문과 발행일을 확인하게 하세요.",
   "관련 공공기관 자료와 다른 기사 링크를 함께 찾도록 돕고,",
   "뉴스 주장·비교 자료·판단 이유를 직접 적게 해주세요.",
   "선택지는 같아요 / 달라요 / 아직 모르겠어요로 제공하세요.",
   "근거를 자동 판정하지 말고 학생의 판단 과정을 기록하세요."
  ],"확인할 결과: 기사 선택 → 출처 비교 → 판단 이유 기록이 끊기지 않는가?"),
  note:"4단계 프롬프트도 재구성한 교사용 요청문입니다. 실제 앱의 검증 방식은 원문·공공자료 링크를 추천하고 학생이 직접 '같아요 / 달라요 / 아직 모르겠어요'를 선택하며 이유를 적는 구조입니다. AI 모델이 기사의 참과 거짓을 자동 판정하지 않습니다. 자료와 학생의 판단을 구분하는 것이 수업 설계의 중심입니다."
 },
 "build-board":{
  id:"build-board",section:"웹앱 제작 방법",type:"image",kicker:"제작 과정 09 · 학생의 탐구 기록",
  title:"비교한 결과를\n탐정 카드로 남깁니다",
  lead:"기사의 출처와 판단 이유를 기록하고 다시 확인",
  image:"assets/06-board.svg",
  note:"탐정 카드는 현재 사용 중인 기기에 저장됩니다. 모든 학생의 글이 한 공용 게시판에 자동 수집되지는 않습니다. 수업에서 개인정보를 기록하지 않도록 안내합니다."
 },
 "build-test":{
  id:"build-test",section:"웹앱 제작 방법",kicker:"개발 과정 11 · 검증은 별도 단계",
  title:"실행 후 다시 검사해야\n수업에 사용할 수 있습니다",
  body:buildRow([
   ["기초 정보","11개 시·군이 빠지지 않았는지 확인"],
   ["기사 검색","원문·날짜·제공처와 링크 확인"],
   ["검증·저장","판단 이유 입력·기기별 기록 확인"],
   ["수업 화면","글자 겹침·모바일·수업용 프로젝터 점검"]
  ]),
  note:"코드 구문 검사를 통과했다고 수업 운영 테스트가 끝난 것은 아닙니다. 실제 기사 검색과 공공기관 외부 링크는 통신 상태·운영 사이트 변경에 영향받습니다. 테스트에는 정상 검색, 기사 없음, 연결 실패, 원문 링크, 저장·새로고침, 지역 변경, 모바일 화면, 화면 글자 겹침 등을 포함해야 합니다. 본 발표에는 테스트 항목을 가르치는 것이며 모든 브라우저·외부 링크에 대해 지금 실시간 테스트를 완료했다는 주장은 하지 않습니다."
 },
 "build-deploy":{
  id:"build-deploy",section:"웹앱 제작 방법",kicker:"제작 과정 12 · 학생에게 공유하기",
  title:"완성한 웹앱은\n주소 하나로 공유합니다",
  body:buildRow([
   ["AI에게 공개 요청","완성한 웹앱을 인터넷 주소로 열 수 있게 해줘"],
   ["직접 접속하기","받은 주소에서 화면이 제대로 보이는지 확인"],
   ["학생처럼 시험하기","뉴스 검색·원문 열기·탐정 카드 저장 점검"],
   ["학생에게 안내하기","웹주소를 공유하고 탐구 활동 시작"]
  ]),
  note:"학생용 웹앱 주소는 https://pace33.github.io/vibe-coding-math-presentation/local-check/student/ 입니다. 저장소와 서버 경로 대신 AI에게 공개를 요청하고 실제 주소와 기능이 작동하는지 확인하는 순서를 설명합니다."
 }
});
const oldSlides=new Map(SLIDES.map(s=>[s.id,s]));
const order=[
 "cover","section-need",
 "field-textbook-news","field-gap-news","app-issues",
 "app-article-traffic","app-article-environment","field-compare-gap","app-verify",
 "field-textbook-region","field-gap-region","app-menu","app-basics","field-standards",
 "section-build",
 "build-overview","build-spec","build-toolmap","build-first-prompt","build-first-result",
 "build-data-prompt","build-data-result","build-news-structure","build-news-prompt",
 "build-check-prompt","build-board","build-test","build-deploy",
 "section-app","app-nature","app-public","app-industry","app-culture","app-news",
 "app-article-check","app-record","boundaries",
 "section-class","sample-question","lesson-40","assessment","closing","sources"
]
if(new Set(order).size!==order.length)throw Error("Duplicate slide id in classroom deck");
const classroomSlides=order.map(id=>{
 const slide=classes[id]||oldSlides.get(id);
 if(!slide)throw Error("Missing slide "+id);
 if(id==="cover")return {...slide,title:"교과서의 뉴스 탐구,\n우리 지역 수업으로",lead:"자료 찾기에서 막힌 수업을 어떻게 연결했을까?",note:"이 사례는 교육과정의 일반적인 구호나 웹앱 홍보로 출발하지 않습니다. 초등 4학년 사회에서 지역 뉴스·공공기관 자료 찾기와 지역 자랑거리 알리기를 실제 수업에서 수행할 때, 해당 지역의 자료를 찾고 신뢰성을 비교하는 과정에 어떤 어려움이 있는지를 보여주고 그 해결을 위해 웹앱을 만든 기록입니다."};
 if(id==="section-need")return {...slide,section:"현장 수업의 문제",title:"교재 활동을\n우리 교실에서 해보면?",lead:"학생에게 어떤 자료를 주고, 무엇부터 찾게 해야 할까요?",note:"공식 사회과 지역화 교재의 탐구 활동을 그대로 출발점으로 삼습니다. 교재에 최신 충북 기사가 없어서 교재가 잘못됐다는 주장이 아니라, 교사는 학급과 지역 실정에 맞는 조사 자료를 매번 준비해야 한다는 뜻입니다."};
 if(id==="section-build")return {...slide,section:"웹앱 제작 방법",title:"이 웹앱은\n어떤 순서로 만들었을까요?",lead:"수업 목표 → AI에게 요청 → 직접 확인 → 수정 → 학생과 공유",note:"15쪽부터는 교사 입장에서 AI로 웹앱을 만드는 과정을 소개합니다. 코드는 AI에게 맡기고, 교사는 수업 목적과 학생 활동을 설명하고 결과를 확인합니다."};
 if(id==="section-app")return {...slide,title:"그 밖의 지역 조사 활동도\n웹앱에 연결했습니다",lead:"지역의 자연·생활시설·산업·문화와 관련 뉴스를 살펴봅니다.",note:"앞에서 주요 문제였던 뉴스 검색·검증·기본정보를 소개했습니다. 이 절은 지역의 다른 활동에 대응하기 위해 어떤 내용을 더 넣었는지 실제 메뉴 단위로 보여 줍니다."};
 return slide;
});
if(classroomSlides.filter(s=>s.type==="section").length!==4)throw Error("Section covers were changed");
window.TRAINING_SLIDES=classroomSlides;

window.TRAINING_META={title:"교과서 속 뉴스 탐구, 우리 지역 웹앱으로",date:"2026. 11. 25.(수)",time:"15:00–17:00",originalUrl:SITE};
})();