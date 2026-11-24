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
 '<div class="news-paper-top"><span>'+(a.kind||'기사 '+(i+1))+'</span><b>'+a.source+'</b><time>'+a.date+'</time></div>'+
 '<h3>'+a.title+'</h3>'+
 '<p class="news-paper-summary">'+a.summary+'</p>'+
 '<div class="news-paper-bottom"><span>'+a.focus+'</span><a href="'+a.url+'" target="_blank" rel="noopener noreferrer">'+(a.linkLabel||'기사 원문')+' ↗</a></div>'+
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
 body:'<p class="cover-caption">인성교육 현장적용 활동 사례 연구 1<br>15:00–17:00</p>',
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
 id:"section-build",section:"웹앱 제작 과정",type:"section",kicker:"PART 04",title:"AI에게 어떤 말을 했고,\n어떻게 고쳤을까요?",
 lead:"실제 사용한 수정 요청을 중심으로 제작 과정을 보여줍니다.",
 body:'<div class="section-number">04 <span>WEB APP → PROCESS</span></div>',
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
 id:"app-menu",section:"완성된 수업 도구",type:"image",kicker:"우리 지역 탐정 · 전체 화면",title:"우리 지역 탐정은\n어떤 화면으로 구성되었을까요?",
 lead:"상단의 세 가지 메뉴: 뉴스 찾기 · 우리 지역 · 탐정 게시판",
 image:"assets/00-overview.svg",
 note:"학생용 웹앱의 전체 구성을 소개합니다. 이미지는 실제 메뉴와 뉴스 검색 화면을 바탕으로 재구성한 발표용 예시이며 실시간 화면 캡처는 아닙니다. 상단에 뉴스 찾기, 우리 지역, 탐정 게시판이 있습니다. 먼저 전체 화면을 보여준 뒤 각 기능을 순서대로 시연합니다. 실제 웹앱 주소는 https://pace33.github.io/vibe-coding-math-presentation/local-check/student/ 입니다."
},
{
 id:"app-basics",section:"완성된 수업 도구",type:"image",kicker:"지역 공공자료 확인 · [4사09-02]",title:"공식 통계를 읽을 때\n기준일을 확인합니다",
 lead:"인구·면적 등 통계 수치와 공식 자료의 출처를 함께 제공",
 image:"assets/03-basics.svg",
 note:"인구·면적과 같은 기초정보는 카드에 직접 표시하고 공식 출처로 연결합니다. 수치 기준일이 다른 정보를 단순 비교하면 왜곡될 수 있음을 학생에게 안내합니다. 이미지는 발표용 재구성입니다."
},
{
 id:"app-nature",section:"완성된 수업 도구",type:"image",kicker:"자연환경 · 사회 [4사10-01]",title:"우리 지역의\n자연환경 조사하기",
 lead:"산·하천 등 자연환경의 특징과 관련 자료 조사",
 image:"assets/16-nature.svg",
 note:"사회과 [4사10-01]은 자연환경과 인문환경의 특징, 이용·개발에 따른 변화를 살펴보는 활동과 연결됩니다. 지역 산·하천·저수지 이름을 학생이 바로 볼 수 있도록 했습니다. 이름에 관한 정보는 기초 카드에서, 변화 상황과 환경문제는 관련 뉴스에서 확인하도록 구분했습니다. 그림은 실제 웹앱 자료를 바탕으로 재구성했습니다."
},
{
 id:"app-public",section:"완성된 수업 도구",type:"image",kicker:"생활시설 · 사회 [4사09-01] · [4사10-02]",title:"우리 지역의 생활시설과\n공공기관 조사하기",
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
 id:"app-culture",section:"완성된 수업 도구",type:"image",kicker:"역사와 문화 · 사회 [4사09-02]",title:"우리 지역의\n역사와 문화 조사하기",
 lead:"지역의 문화 자원을 조사하고, 그 가치를 소개하는 활동",
 image:"assets/12-culture.svg",
 note:"[4사09-02]는 지역의 자연환경·역사·문화·생산물과 지역사회의 노력을 탐구하는 내용이므로, 문화유산 이름만 제공하는 것으로 부족합니다. 전시·체험이 가능한 박물관·미술관과 지역 축제·예술 행사 정보를 추가했습니다. 다만 축제 개최일과 운영 정보는 해마다 변경되므로 최신 공지로 확인하도록 안내합니다."
},
{
 id:"app-issues",section:"완성된 수업 도구",type:"image",kicker:"① 뉴스 찾기 · 지역별 기사 탐색",
 title:"우리 지역 뉴스를\n쉽게 찾을 수 있도록",
 lead:"우리 시·군 선택 → 관심 주제·검색어 입력 → 기사·언론사·날짜 확인",
 image:"assets/10-issues.svg",
 note:"뉴스 찾기의 검색 예시를 보여줍니다. 충북 시·군과 검색어를 입력하고 기사 제목·언론사·날짜·원문 링크를 확인합니다. 지역문제 메뉴를 활용하면 환경·교통안전·교육복지·지역 생활 관련 검색도 가능합니다. 검색 결과 자체가 사실 확인 완료를 뜻하지 않으므로 원문과 비교 자료를 살펴보도록 안내합니다. 화면에 보이는 기사는 수업용 예시이며 뉴스 검색은 외부 뉴스 서비스 연결 상태에 따라 달라질 수 있습니다."
},
{
 id:"app-problem-features",section:"완성된 수업 도구",kicker:"우리 지역 탐정 · 세 가지 주요 메뉴",
 title:"세 가지 메뉴에서는\n어떤 활동을 할까요?",
 lead:"뉴스를 찾고, 우리 지역을 살펴보고, 탐구 결과를 기록합니다.",
 body:'<div class="solution-grid menu-feature-grid">'+
 '<article class="solution-card"><small>01 · 📰 뉴스 찾기</small><p>“우리 지역 뉴스를 찾아볼까요?”</p><strong>기사 검색과 근거 비교</strong><span>시·군과 검색어 선택 → 기사·출처·날짜 확인 → 다른 자료와 비교</span></article>'+
 '<article class="solution-card"><small>02 · 🗺️ 우리 지역</small><p>“우리 고장에는 어떤 특징이 있을까요?”</p><strong>6개 분야 지역 정보 조사</strong><span>기본 정보 · 자연환경 · 생활시설 · 산업과 경제 · 역사와 문화 · 지역문제</span></article>'+
 '<article class="solution-card"><small>03 · 🗂️ 탐정 게시판</small><p>“내가 조사한 내용을 함께 볼까요?”</p><strong>탐정 카드 확인과 공유</strong><span>학생이 직접 작성한 판단·근거 확인 → 기기에 저장 → 링크로 공유</span></article>'+
 '</div>',
 note:"이 슬라이드는 네 단계의 검증 절차가 아니라 웹앱 화면 맨 위에 있는 세 가지 실제 메뉴를 설명합니다. 뉴스 찾기에서 원문과 근거를 살펴보고, 우리 지역에서 6개 분야의 정보를 조사하며, 탐정 게시판에서 완성한 카드를 확인할 수 있습니다. 탐정 카드는 기기에 저장되며 친구에게 링크를 보낼 수 있지만 학급 전체의 게시물이 자동으로 모이는 공용 서버는 아닙니다."
},
{

 id:"app-news",section:"완성된 수업 도구",type:"image",kicker:"① 뉴스 찾기 · 관련 기사 검색",title:"우리 지역의 뉴스는\n어떻게 찾아볼까요?",
 lead:"시·군과 검색어를 선택해 기사 제목·출처·날짜·원문 확인하기",
 image:"assets/04-news.svg",
 note:"학생은 자신이 선택한 지역의 뉴스와 공공기관 자료를 찾아봅니다. 실시간 뉴스 검색은 외부 제공자의 응답에 의존하고, 검색 결과에는 검증 완료 표시가 붙지 않습니다. 제공처는 실제 구글/빙 RSS에 따라 달라집니다."
},
{
 id:"app-article-traffic",section:"실제 뉴스 검증 사례",kicker:"같은 사건 · 서로 다른 보도 · 국어 [6국06-02]",
 title:"같은 사건,\n서로 다른 보도 내용",
 lead:"2025년 10월 24일 음성군 삼성면 행사 · 최초 주장과 정정보도 비교",
 body:newsCompare([
  {kind:"처음 보도된 주장",source:"A인터넷신문 · 후속 기사에 인용",date:"2025년 10월",title:"“삼겹살 파티에 군수가 참석했다”는 취지의 보도",summary:"행사 종류를 ‘삼겹살 파티’로, 군수가 행사에 참석한 것으로 보도한 내용.",focus:"후속 보도에 인용된 최초 주장",linkLabel:"최초 주장 확인",url:"https://v.daum.net/v/ZT9S6qIkMa"},
  {kind:"사실관계 정정",source:"정정보도 · 충청타임즈가 소개",date:"2025. 12. 8.",title:"“행사는 소스 품평회, 군수는 참석하지 않았다”",summary:"주최는 음성군농촌활력지원센터. 언론중재위원회 조정에 따라 잘못된 내용을 바로잡음.",focus:"정정된 사실 · 행사 종류·참석 여부",linkLabel:"정정보도 확인",url:"https://v.daum.net/v/pu0bTou5yU"}
 ],"행사 종류와 참석 여부에 대한 정보가 서로 달랐고, 이후 정정보도로 바로잡혔습니다.","언론중재위원회 조정 후 원 보도 언론사가 정정보도문을 게시했습니다. ※ 처음 기사의 원문 대신 후속 기사에 인용된 주장을 사용했습니다.",[
  "① 서로 다른 주장 표시","② 정정보도 확인","③ 행사 기록·공식 자료 대조"
 ]),
 note:"교사 연수 설명: ‘실제 음성군 삼성면의 2025년 10월 24일 행사에 관해 잘못된 보도가 있었고, 언론중재위원회 조정으로 같은 언론사가 12월 8일 정정보도문을 냈습니다. 후속 기사들에 따르면 처음에는 삼겹살 파티에 군수가 참석했다는 취지로 보도했지만, 정정보도에서 실제 행사는 지역경제 활성화를 위한 로컬푸드 소스 품평회이고 군수는 참석하지 않았다고 바로잡았습니다. 주최 역시 음성군이 아닌 음성군농촌활력지원센터입니다.’ 처음 보도된 A인터넷신문의 원문은 직접 확인되지 않아, 이 화면의 왼쪽 카드는 충청투데이 후속 기사에 인용된 원래 주장입니다. 오른쪽은 충청타임즈가 인용한 정정보도문 내용입니다. 기사 제목을 임의로 실제 원문 제목처럼 보이지 않도록 모두 수업용 요약 문구로 구성했습니다. 자료: 충청투데이 2025.12.12. https://v.daum.net/v/ZT9S6qIkMa , 충청타임즈 2025.12.11. https://v.daum.net/v/pu0bTou5yU , 뉴스로 2025.12.11. https://www.newsro.kr/articles/1480900"
},
{
 id:"app-article-environment",section:"실제 뉴스 검증 사례",kicker:"검증 결과 · 사회 [4사09-01] · 국어 [6국06-02]",
 title:"정정보도로 확인한\n세 가지 사실",
 lead:"행사의 성격·참석 여부·주최 기관에 관한 보도 내용 비교",
 body:'<div class="news-correction-table">'+
  '<div class="correction-head"><span>확인할 내용</span><span>처음 보도된 주장</span><span>정정보도로 확인한 사실</span></div>'+
  '<div class="correction-row"><strong>행사의 성격</strong><p>삼겹살 파티</p><b>로컬푸드 소스 품평회</b></div>'+
  '<div class="correction-row"><strong>행사 참석 여부</strong><p>군수가 참석</p><b>군수는 참석하지 않음</b></div>'+
  '<div class="correction-row"><strong>행사 주최</strong><p>음성군이 진행한 행사</p><b>음성군농촌활력지원센터 주최</b></div>'+
  '<div class="correction-evidence"><span>확인한 근거</span><strong>언론중재위원회 조정 → 12월 8일 정정보도 → 음성군 환경과 상황보고서 등</strong></div>'+
  '<div class="correction-lesson"><span>학생이 배우는 것</span><strong>두 기사 내용이 다르면 바로 믿지 말고, 정정보도와 원자료를 찾아 사실을 확인합니다.</strong></div>'+
  '</div>',
 note:"학생이 확인하는 순서는 ① 서로 다른 문장에 표시하기(삼겹살 파티/소스 품평회, 참석/불참, 행사 주최) ② 두 번째 기사와 정정보도 내용 읽기 ③ 누가 무엇을 근거로 정정했는지 확인하기입니다. 공개된 보도에 따르면 언론중재위원회가 2025년 12월 4일 정정보도 수용으로 조정했고 12월 8일 A언론사가 정정보도문을 게시했습니다. 행사 종류·주최·참석 여부는 이 정정보도문과 화학사고 상황보고서 등으로 확인됐다고 보도됐습니다. 교사는 언론중재위 조정과 정정보도라는 확인 절차의 중요성을 강조하되 처음부터 기사를 모두 거짓이라고 단정하는 것이 아니라 검증 대상 문장을 정확히 한정하도록 지도합니다. 출처 https://www.newsro.kr/articles/1480900"
},
{
 id:"app-article-check",section:"완성된 수업 도구",kicker:"실제 오류 보도를 통해 익힌 검증 방법 · 국어 [6국06-02]",
 title:"서로 다른 기사 내용을\n검증하는 세 가지 방법",
 body:flow([
  "서로 다른 문장과<br>숫자·날짜 표시하기",
  "정정보도와<br>공식 자료 찾아보기",
  "확인된 사실과<br>아직 모르는 점 기록하기"
 ])+
 small("음성군 실제 사례: ‘삼겹살 파티 / 소스 품평회’, ‘군수 참석 / 불참’ → 정정보도문으로 바로잡힌 내용 확인"),
 note:"학생에게 기사를 많이 읽히는 것보다, 어느 문장이 서로 다른지를 찾고 정정보도 및 공공기관의 원자료를 비교하게 하는 것이 수업의 목적입니다. 2025년 음성군 삼성면 사례에서는 행사 성격과 참석 여부·주최의 정보가 정정보도에서 정정됐습니다. 내용이 같은 기사 두 건만으로 사실이 입증되는 것은 아니며, 공식 자료와 정정 기록을 확인하도록 안내합니다."
},
{

 id:"app-verify",section:"완성된 수업 도구",type:"image",kicker:"매체 신뢰성 평가 · [6국06-02]",title:"기사의 출처와 근거를\n다른 자료와 비교하기",
 lead:"언론사·발행일 확인 → 기사 원문 읽기 → 관련 자료 비교",
 image:"assets/05-verify.svg",
 note:"[6국06-02]는 국어과 매체 영역의 성취기준임을 명확히 언급합니다. 3단계 검증 절차는 웹앱을 위해 교사가 구현한 활동 단계입니다. AI가 사실 여부를 자동 채점하지 않습니다."
},
{
 id:"app-record",section:"완성된 수업 도구",type:"image",kicker:"③ 탐정 게시판 · 기록 확인과 공유",title:"탐정 게시판에서는\n무엇을 확인할까요?",
 lead:"학생의 판단·근거를 탐정 카드로 확인하고, 링크로 공유하기",
 image:"assets/06-board.svg",
 note:"탐정 게시판의 모아 둔 카드에서 완성한 카드의 출처·날짜·비교 근거·판단 이유를 다시 확인합니다. 자세히 보기를 통해 카드 내용을 열고, 친구에게 공유 버튼으로 링크를 전달할 수 있습니다. 자료는 현재 브라우저 기기에 저장되며 공용 게시판 서버에 자동으로 모이지 않습니다. AI 검토를 하지 않은 카드도 완성할 수 있습니다. 이름·연락처 등 개인정보를 카드에 쓰지 않도록 안내합니다."
},
{
 id:"boundaries",section:"완성된 수업 도구",kicker:"수업자료의 한계도 함께 설명",title:"웹앱의 역할과\n학생의 판단 과정",
 body:compare(["웹앱이 하는 일","자료 접근","지역 자료·기사 원문·비교 기록을 연결합니다."],["학생과 교사가 할 일","근거에 따른 판단","기사의 사실 관계와 출처를 확인합니다."]),
 note:"자동 팩트체크 도구라고 설명하지 않습니다. 검색엔진에 뜬 순서나 공식기관 로고만으로 뉴스의 신뢰성을 확정하지 않습니다. 학생이 판단하고 교사가 근거의 질을 지도해야 합니다."
},
{
 id:"section-class",section:"사회과 수업 적용",type:"section",kicker:"PART 02",title:"실제 수업에서는\n어떻게 활용할까요?",
 lead:"사회 교과서의 지역 탐구 활동과 국어 매체 평가를 연결합니다.",
 body:'<div class="section-number">02 <span>CLASSROOM</span></div>',
 note:"지역 뉴스·우리 고장 자료를 조사하는 활동을 실제 수업에 어떻게 적용할지, 교사의 수업 질문과 40분 학습 흐름, 탐구 과정 평가를 먼저 살펴봅니다. 이어서 웹앱의 세 가지 메뉴와 제작 과정을 소개합니다."
},
{
 id:"sample-question",section:"수업 적용",kicker:"초등 사회 수업 질문 · 예시 상황",title:"“우리 동네 길은\n정말 안전할까요?”",
 body:flow(["지역 안전 뉴스 찾기","시청·경찰 자료 확인","보도와 자료 비교","근거로 의견 쓰기"]),
 note:"학교 주변 어린이 보호구역 안전 문제를 예시로 제시합니다. 특정 지역의 실제 사고가 있었다고 단정하는 사례는 아닙니다. [4사09-01]과 [6국06-02]을 결합한 교사 설계 수업 사례입니다."
},
{
 id:"lesson-40",section:"수업 적용",kicker:"40분 수업 예시",title:"지역 뉴스 검증을 위한\n40분 수업 구성",
 body:list(["도입 5분 · 궁금한 지역 문제 고르기","탐구 15분 · 기사와 공식자료 찾기","검증 15분 · 출처·날짜·근거 비교","정리 5분 · 판단 이유 기록하기"]),
 note:"수업 시간은 운영 예시이며 학생 연령과 디지털 접근성에 따라 교사의 모델링 시간이 더 필요할 수 있습니다. 앱 기능을 설명하는 시간보다 학생이 증거를 찾는 시간에 비중을 둡니다."
},
{
 id:"assessment",section:"수업 적용",kicker:"성취의 증거 · 과정평가",title:"학생의 탐구 과정에서\n무엇을 평가할까요?",
 body:list(["정보의 출처와 날짜를 찾았는가?","주장을 뒷받침하는 근거를 비교했는가?","자신의 판단을 이유와 함께 표현했는가?"]),
 note:"빠르게 검색하거나 예쁘게 글을 쓰는 능력만 평가하지 않습니다. 초등학생의 수준에 따라 선택하기·말하기·짧은 문장 쓰기 등 다양한 방식의 표현을 인정할 수 있습니다. 이는 교사 적용 방안이며 앱이 해당 모든 접근성 지원을 자동 제공하는 것은 아닙니다."
},
{
 id:"closing",section:"마무리",type:"closing",kicker:"연수의 결론",title:"교과서 속 탐구 활동을\n우리 지역의 실제 자료로",
 lead:"학생이 직접 찾고 비교하며 근거를 바탕으로 판단하는 수업",
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
 '<div class="field-cell"><span>수업에서 함께 살펴볼 점</span><strong>'+block+'</strong></div>'+
 '<div class="field-cell solved"><span>웹앱에 반영한 해결 방식</span><strong>'+solution+'</strong></div></div>';
const lessonPreview=(line1,line2,prompt,source)=>'<div class="lesson-preview">'+
 '<div class="lesson-page"><div class="lesson-page-top">경기도 지역화 교재 예시 · 4학년 2학기</div>'+
 '<h3>'+line1+'</h3><p>'+line2+'</p><div class="lesson-page-task">'+prompt+'</div></div>'+
 '<div class="lesson-page-explain"><span>수업 준비에는 어떤 자료가 필요할까요?</span>'+
 '<strong>우리 시·군의 기사,<br>최신 날짜, 확인 가능한 근거</strong>'+
 '<p>교재의 조사 활동을 위해 우리 지역의 실제 자료가 필요합니다.</p></div></div>'+
 refLink("교육청 지역화 교재·활동 페이지 확인",source);
const regionalTask=(line1,line2,source)=>'<div class="regional-task">'+
 '<div><span>사회 수업 활동</span><strong>'+line1+'</strong><p>'+line2+'</p></div>'+
 '<div><span>학생이 직접 찾을 정보</span><strong>실제 지역의 장소 이름<br>특징 · 선택한 이유</strong><p>우리 고장의 실제 장소를 조사하고 소개하는 활동</p></div>'+
 '</div>'+refLink("교육청 사회과 서·논술형 활동 예시 확인",source);
const classes={
 "field-textbook-news":{
  id:"field-textbook-news",section:"수업에서 살펴볼 점",kicker:"사회 4학년 2학기 · 교재 활동에서 출발",
  title:"우리 지역의 문제를\n어떻게 조사할까요?",
  lead:"신문기사·뉴스를 읽고, 지역 문제의 원인을 조사하는 활동",
  body:lessonPreview("지역문제를 확인하는 방법","지역 뉴스와 시·군청 누리집을 찾아보고, 신문기사를 읽어 문제 원인을 조사해 봅니다.","교재 속 예시: OO시의 출퇴근 문제를 기사로 읽고 원인 파악",LOCAL_TEXTBOOK),
  note:"출처는 2022 개정 교육과정에 맞춰 공개된 경기도교육청 지역화 교재 「경기도의 생활」 4학년 2학기 118~119쪽입니다. (교재 기준 표기이며 다른 시도 교과서의 쪽수와 동일하지 않습니다.) 교재가 지역 뉴스와 공공기관 사이트를 살펴보라고 요청한다는 사실과, 우리 충북 학생이 자기 지역의 기사를 직접 찾아야 한다는 수업 운영상의 부담을 구별해서 설명합니다. 교재의 'OO시' 기사는 학습용 예시이며 실제 음성군 기사와 구분합니다."
 },
 "field-gap-news":{
  id:"field-gap-news",section:"수업에서 살펴볼 점",kicker:"지역 뉴스 조사에서 살펴볼 점",
  title:"우리 지역의 뉴스를\n찾기 어려운 이유는 무엇일까요?",
  body:fieldGap("지역 뉴스·신문기사 찾기","광역 기사·예전 기사·관련 없는 검색 결과가 함께 나옴","시·군 선택 → 지역 뉴스 검색 → 기사 제목·날짜·언론사 확인"),
  note:"교과서 자체의 결함을 주장하는 슬라이드가 아닙니다. 실제 수업에서 학생들이 인터넷 검색으로 지역과 시점을 구분하는 데 많은 안내를 필요로 할 수 있다는 예상 가능한 교수학습상의 문제입니다. 웹앱은 기사 검색의 출발점을 한 화면으로 묶습니다. 자동으로 뉴스의 진위를 확인해 주지는 않습니다."
 },
 "field-compare-gap":{
  id:"field-compare-gap",section:"수업에서 살펴볼 점",kicker:"실제 기사 비교에서 확인한 필요성",
  title:"기사 내용이 다를 때,\n무엇을 확인해야 할까요?",
  body:fieldGap("뉴스의 출처와 사실 관계 확인하기","같은 사건인데 행사 내용·참석 여부처럼 서로 다른 정보를 전달할 수 있음","엇갈린 내용 표시 → 정정보도 확인 → 공식 기록과 대조"),
  note:"앞의 2025년 음성군 삼성면 행사 사례에서 학생들은 행사 종류와 참석 여부를 두고 처음 보도된 주장과 정정보도에 차이가 있음을 확인했습니다. 서로 다른 문장을 발견한 다음 해당 언론의 정정보도문, 언론중재위원회 조정, 음성군 행정 자료와 같은 근거를 살펴보는 단계가 필요함을 안내합니다. 기사의 진위 여부는 웹앱이 자동으로 판정하지 않습니다."
 },
 "field-textbook-region":{
  id:"field-textbook-region",section:"수업에서 살펴볼 점",kicker:"사회 4학년 2학기 · 우리 지역 알리기",
  title:"우리 지역의 자랑거리를\n어떻게 조사할까요?",
  lead:"자랑할 장소를 정한 뒤 이름·특징·소개할 이유를 찾아봅니다.",
  body:regionalTask("우리 고장의 장소 한 곳을 정해 소개하기","장소의 이름과 특징을 찾아보고 선택한 이유를 말하거나 글로 표현합니다.",LOCAL_ASSESS)+
  '<p class="fineprint">관련 수업자료: 미래엔 사회 4-2 ‘다양한 지역 축제 조사하기’(81쪽) · '+refLink("수업자료",PUBLISHER_FEST)+'</p>',
  note:"실제 사회과 학습 활동에서 장소를 정하고 이름·특징·좋아하는 이유를 조사해 소개합니다. 우리 지역의 구체적인 장소를 찾으려면 누리집이나 검색을 활용하게 되는데, 초등학생의 일반 검색에서는 광고·홍보글·다른 지역 자료·오래된 정보가 함께 보여 자료를 가려내는 안내가 필요할 수 있습니다. 교과서가 부족하다는 뜻이 아니라 학생의 자료 탐색을 돕기 위한 수업 운영상의 필요를 설명합니다. 출처: 인천광역시교육청(2026) 초등 사회 4-2 연계 평가도구 및 미래엔 관련 수업자료."
 },
 "field-gap-region":{
  id:"field-gap-region",section:"수업에서 살펴볼 점",kicker:"일반 웹 검색 · 학생의 자료 탐색",
  title:"인터넷 검색에서 어떤 자료가\n함께 나올까요?",
  lead:"장소나 뉴스를 찾을 때 검색 결과를 구분할 필요가 있습니다.",
  body:fieldGap("우리 고장 장소·축제·뉴스 조사","광고·홍보글 / 다른 지역 검색 결과 / 오래된 기사·정보","시·군별 지역 정보 카드와 관련 뉴스 검색을 한 화면에서 제공"),
  note:"일반 검색에서 '청주 축제'처럼 지역명을 입력해도 광고·홍보성 게시물, 다른 지역 기사, 예전 행사를 다룬 자료가 함께 나올 수 있습니다. 초등학생은 내용이 지역과 맞는지, 언제 작성됐는지, 출처가 어디인지 확인할 필요가 있습니다. 실제 웹앱은 충북 11개 시·군을 선택하고 기본 정보·자연환경·생활시설·산업과 경제·역사와 문화·지역문제를 분야별로 볼 수 있게 구성했습니다. 관련 뉴스는 구글·빙 뉴스 RSS 기반 검색으로 연결됩니다. 검색 결과의 정확성을 자동 보장하지 않으므로 원문 확인은 계속 필요합니다."
 },
 "field-standards":{
  id:"field-standards",section:"수업에서 살펴볼 점",kicker:"그래서 만든 웹앱 · 우리 지역 탐정",
  title:"수업에 필요한 기능을\n어떻게 담았을까요?",
  lead:"검색 결과를 학생이 읽고 비교할 수 있도록 세 가지 메뉴로 구성했습니다.",
  body:'<div class="field-matrix">'+
   '<div><span>① 뉴스 찾기</span><strong>시·군·검색어로 기사 찾기</strong><b>언론사·날짜·원문 확인 → 다른 기사와 비교</b></div>'+
   '<div><span>② 우리 지역</span><strong>지역 정보 6개 분야 살펴보기</strong><b>기본 정보·자연환경·생활시설·산업·문화 등</b></div>'+
   '<div><span>③ 탐정 게시판</span><strong>내 판단을 탐정 카드로 기록</strong><b>근거와 이유 저장 · 자세히 보기 · 링크 공유</b></div>'+
   '</div>'+
   '<p class="fineprint">실제 학생용 웹앱 기능입니다. 기사 내용의 사실 여부는 학생이 원문과 근거를 보고 판단하며 자동 판정하지 않습니다.</p>',
  note:"웹앱의 실제 메뉴 이름과 동작을 소개합니다. ① 뉴스 찾기: 시·군과 검색어로 구글·빙 RSS 기사를 찾아 제목·출처·날짜·원문을 보고 비교 자료를 살펴봅니다. ② 우리 지역: 충북 11개 시·군의 6개 분야 카드에서 자료 이름·출처와 기준일을 확인합니다. ③ 탐정 게시판: 학생이 기사·근거를 비교하고 작성한 탐정 카드를 기기에 저장해 다시 열거나 링크로 공유합니다. 게시판은 공용 서버에 자동으로 모이는 방식이 아니며, AI 검토 없이도 학생의 직접 판단을 기록할 수 있습니다. 웹앱의 검색 결과가 모두 정확하거나 광고·무관한 자료를 완전히 차단하는 것은 아닙니다."
 }
};

/* 교사 연수용 '이 웹앱을 만드는 과정' — 실제 파일 구조와 작동 방식에서 도출한
 * 단계별 제작 안내. 요청문은 재사용할 수 있게 재작성한 예시이며, 최초 제작 원문이 아닙니다.
 * 참가자는 직접 코딩하지 않고 PPT 화면과 화면 시연을 관찰합니다.
 */
const escPrompt=s=>String(s??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
/* All lines form one copyable chat message. These are executable prompts, not claimed historic verbatim originals. */
const makePrompt=(lines,foot,heading="ChatGPT에 입력하는 명령어")=>{
 const prompt=lines.join("\n");
 return '<div class="gpt-preview" role="group" aria-label="ChatGPT 화면 형식으로 구성한 명령어 예시">'+
  '<div class="gpt-preview-header">'+
   '<div class="gpt-preview-brand"><span class="gpt-preview-logo" aria-hidden="true">✳</span><strong>ChatGPT</strong><span class="gpt-preview-caret" aria-hidden="true">⌄</span></div>'+
   '<span class="gpt-preview-kind">채팅 입력 화면 예시</span>'+
   '<button type="button" class="chat-prompt-copy" data-copy-prompt="'+encodeURIComponent(prompt)+'" aria-label="채팅 명령어 전체 복사">명령어 복사</button>'+
  '</div>'+
  '<div class="gpt-preview-main">'+
   '<h2 class="gpt-preview-greeting">무엇을 도와드릴까요?</h2>'+
   '<div class="gpt-preview-composer">'+
    '<div class="gpt-preview-input" aria-label="입력할 명령어">'+lines.map(line=>'<p>'+escPrompt(line)+'</p>').join("")+'</div>'+
    '<div class="gpt-preview-toolbar"><span class="gpt-preview-add" aria-hidden="true">＋</span><span class="gpt-preview-tools" aria-hidden="true">도구</span><span class="gpt-preview-toolbar-space"></span><span class="gpt-preview-mic" aria-hidden="true">◉</span><span class="gpt-preview-send" aria-hidden="true">↑</span></div>'+
   '</div>'+
   '<p class="gpt-preview-disclaimer">ChatGPT 입력 화면을 재구성한 연수용 예시입니다.</p>'+
  '</div>'+
 '</div><p class="chat-prompt-foot">'+escPrompt(foot)+'</p>';
};
const buildRow=(arr)=>'<div class="build-rows">'+arr.map((x,i)=>'<div class="build-row"><span>'+String(i+1).padStart(2,"0")+'</span><strong>'+x[0]+'</strong><p>'+x[1]+'</p></div>').join("")+'</div>';
const systemFlow=(arr)=>'<div class="build-system">'+arr.map(x=>'<div class="build-system-card"><small>'+x[0]+'</small><strong>'+x[1]+'</strong><p>'+x[2]+'</p></div>').join("")+'</div>';
const spec=(items)=>'<div class="build-spec">'+items.map(x=>'<div><span>'+x[0]+'</span><strong>'+x[1]+'</strong><p>'+x[2]+'</p></div>').join("")+'</div>';
const twoStep=(left,right)=>'<div class="build-two"><section><span>'+left[0]+'</span><strong>'+left[1]+'</strong><p>'+left[2]+'</p></section><section><span>'+right[0]+'</span><strong>'+right[1]+'</strong><p>'+right[2]+'</p></section></div>';
Object.assign(classes,{
 "build-overview":{
  id:"build-overview",section:"웹앱 제작 과정",type:"image",kicker:"제작 과정 · 우리 지역 탐정 구성도",
  title:"우리 지역 탐정은\n어떻게 연결되어 있을까요?",
  lead:"뉴스 찾기 · 우리 지역 · 탐정 게시판",
  image:"assets/07-webapp-architecture.svg",
  note:"웹앱을 만들기 전에 전체 구성부터 확인합니다. 학생 화면은 3개 메뉴로 구성되며, 뉴스 찾기는 별도의 RSS 검색 서버를 통해 실제 기사를 받고, 지역 정보는 시·군별 데이터 카드에서 제시합니다. 학생이 직접 기사와 근거를 비교한 뒤 판단을 저장합니다. AI 검토는 선택 기능입니다. 실제 학생 앱 소스코드에서 확인한 기능으로 만든 설명용 구성도입니다."
 },
 "build-spec":{
  id:"build-spec",section:"웹앱 제작 과정",kicker:"핵심 명령어 ① · 첫 화면",
  title:"첫 채팅에는\n무엇을 입력할까요?",
  body:makePrompt([
   "초등학생용 '우리 지역 탐정' 웹앱을 만들어줘.",
   "상단에는 뉴스 찾기·우리 지역·탐정 게시판 메뉴를 넣고 충북 11개 시·군을 선택하게 해줘.",
   "모바일에서도 편하게 보고 모든 메뉴 버튼이 작동하도록 만들어줘."
  ],"첫 요청: 학생용 웹앱의 화면과 세 가지 메뉴를 만듭니다."),
  note:"실제 웹앱의 메뉴 이름, 시·군 선택 기능과 화면 이동을 재현하는 짧은 첫 입력 예시입니다. 지금까지의 대화 원문을 그대로 복제한 역사적 최초 프롬프트가 아니라, 현행 웹앱 기능을 바탕으로 다시 작성한 사용 가능한 명령어입니다."
 },
 "build-data-prompt":{
  id:"build-data-prompt",section:"웹앱 제작 과정",kicker:"핵심 명령어 ② · 우리 지역",
  title:"지역 정보는\n어떻게 넣을까요?",
  body:makePrompt([
   "'우리 지역' 메뉴에 충북 11개 시·군의 정보를 넣어줘.",
   "기본 정보·자연환경·생활시설·산업과 경제·역사와 문화·지역문제 6개로 나눠줘.",
   "각 카드에는 실제 정보와 출처·기준일·공식 자료 링크를 표시하고 없는 정보는 만들지 마."
  ],"확인: 지역별 정보·원문 링크·통계 기준일을 직접 살펴봅니다."),
  note:"지역 정보는 student/regional-basics.js, regional-landmarks.js 등 지역별 자료 파일로 관리합니다. 인구와 면적의 수치·기준일은 시·군청이나 통계 원문에서 다시 확인해야 합니다. 학생에게 보여줄 항목만 간단히 지정하도록 만든 실제 구현용 명령어입니다."
 },
 "build-news-prompt":{
  id:"build-news-prompt",section:"웹앱 제작 과정",kicker:"핵심 명령어 ③ · 실제 뉴스 검색",
  title:"뉴스 검색은\n어떻게 구현할까요?",
  body:makePrompt([
   "'뉴스 찾기'에서 지역과 검색어로 실제 뉴스를 검색하게 해줘.",
   "구글·빙 뉴스 RSS 검색 서버와 연결하고, 제목·언론사·날짜·짧은 요약·원문 링크를 최신순으로 보여줘.",
   "검색 결과가 없거나 서버 오류가 나면 안내하고 실제 검색까지 테스트해줘."
  ],"중요: 실제 뉴스를 보여주려면 별도 RSS 검색 서버 연결이 필요합니다."),
  note:"뉴스 카드는 단순한 HTML 예시가 아니라 student/live-news.js에서 외부 /api/news 검색 서버에 접속해 RSS 결과를 받아 표시합니다. 별도 서버의 배포·연결·실제 응답 확인이 필요한 단계입니다. RSS 검색 결과가 모두 사실 확인된 기사라는 뜻은 아닙니다."
 },
 "build-check-prompt":{
  id:"build-check-prompt",section:"웹앱 제작 과정",kicker:"핵심 명령어 ④ · 기사 비교",
  title:"기사 검증 화면은\n어떻게 만들까요?",
  body:makePrompt([
   "기사의 '검증하기'를 누르면 출처 확인 → 근거 확인 → 기사 비교 화면이 열리게 해줘.",
   "다른 기사나 공식 자료를 찾아 보여주고 학생이 같아요·달라요·더 알아볼래요를 선택한 뒤 이유를 쓰게 해줘.",
   "AI 검토는 선택으로 두고 AI 없이도 탐정 카드를 완성하게 해줘."
  ],"확인: 출처·근거·학생 판단을 기록하고 카드 완성이 되는지 살펴봅니다."),
  note:"실제 기사 검증 화면에서 학생이 첫 기사의 언론사·날짜·원문을 확인하고 비교할 다른 기사를 선택할 수 있습니다. 같은 내용·다른 내용 판단에는 비교한 자료의 링크가 필요합니다. AI가 없어도 직접 판단과 이유를 기록한 탐정 카드를 만들 수 있습니다."
 },
 "build-board":{
  id:"build-board",section:"웹앱 제작 과정",kicker:"핵심 명령어 ⑤ · 탐정 게시판",
  title:"완성한 카드는\n어떻게 저장할까요?",
  body:makePrompt([
   "학생이 완성한 뉴스 탐정 카드를 '탐정 게시판'에 저장해줘.",
   "기사 출처·날짜·비교 근거·판단 이유를 보여주고 자세히 보기와 친구 공유 버튼을 만들어줘.",
   "로그인 없이 이 브라우저에 저장하고, 공유받은 카드도 볼 수 있게 해줘."
  ],"현재 방식: 기기 안에 저장하며 학급 전체 게시물이 자동으로 모이지 않습니다."),
  note:"student/board.js는 localStorage를 사용해 기기에 카드를 저장하고 #card= 공유 링크를 만듭니다. 중앙 서버 게시판이 아니므로 전체 학생 기록의 자동 수합을 지원한다고 안내하지 않습니다. 카드에 이름·연락처 등 개인정보를 입력하지 않도록 지도합니다."
 },
 "build-test":{
  id:"build-test",section:"웹앱 제작 과정",kicker:"실제 대화 · 수정 요청 예시",
  title:"직접 사용하며\n무엇을 고쳤을까요?",
  body:buildRow([
   ["기사 정렬","“검색했을때 날짜 순으로 정렬”"],
   ["기사 미리보기","“뉴스카드에 키워드가 들어간 한 두줄 기사 내용 넣어줘”"],
   ["AI 없이 완성","“ai검증없이도 뉴스 탐정카드 완성하기 버튼 활성화되게”"]
  ]),
  note:"이 문구들은 실제 대화에서 사용자가 요청한 수정 사항을 발췌했습니다. 단순히 기능 구현을 요구하는 것보다, 화면을 눌러 보고 원하는 행동을 구체적으로 말하는 것이 수정에 도움이 됩니다. 지역 정보 카드 이미지처럼 이미 앞에서 설명한 화면은 제작 과정에서 반복하지 않았습니다."
 },
 "build-deploy":{
  id:"build-deploy",section:"웹앱 제작 과정",kicker:"핵심 명령어 ⑥ · 배포 및 확인",
  title:"학생이 쓰도록\n어떻게 공개할까요?",
  body:makePrompt([
   "완성한 웹앱을 GitHub Pages에 배포하고 학생용 주소를 알려줘.",
   "메뉴·뉴스 검색·기사 비교·탐정 카드 저장을 실제로 눌러 테스트해줘.",
   "모바일 글씨 잘림과 링크 오류도 점검하고 고쳐줘."
  ],"배포 확인: 학생용 화면 공개와 뉴스 검색 서버 연결을 각각 점검합니다."),
  note:"현재 학생용 주소는 https://pace33.github.io/vibe-coding-math-presentation/local-check/student/ 입니다. GitHub Pages는 화면과 정적 파일을 공개하며 실시간 RSS 검색은 별도 뉴스 서버를 필요로 합니다. 실제 기사 응답을 확인하지 않았다면 배포 완료와 기능 동작 확인을 구분해야 합니다."
 }
});
const oldSlides=new Map(SLIDES.map(s=>[s.id,s]));
const order=[
 "cover","section-need","field-textbook-news","field-gap-news","app-article-traffic",
 "app-article-environment","field-compare-gap","field-textbook-region","field-gap-region","field-standards",
 "section-class","sample-question","lesson-40","assessment","section-app",
 "app-menu","app-problem-features","app-news","app-issues","app-verify",
 "app-article-check","app-basics","app-nature","app-public","app-industry",
 "app-culture","app-record","boundaries","section-build","build-overview",
 "build-spec","build-data-prompt","build-news-prompt","build-check-prompt","build-board",
 "build-test","build-deploy","closing","sources"
]
if(new Set(order).size!==order.length)throw Error("Duplicate slide id in classroom deck");
const classroomSlides=order.map(id=>{
 const slide=classes[id]||oldSlides.get(id);
 if(!slide)throw Error("Missing slide "+id);
 if(id==="cover")return {...slide,title:"우리 지역 탐구 수업,\nAI로 만든 웹앱과 함께",lead:"지역 자료 조사와 뉴스 검증을 돕는 웹앱 제작 사례",note:"이 사례는 교육과정의 일반적인 구호나 웹앱 홍보로 출발하지 않습니다. 초등 4학년 사회에서 지역 뉴스·공공기관 자료 찾기와 지역 자랑거리 알리기를 실제 수업에서 수행할 때, 해당 지역의 자료를 찾고 신뢰성을 비교하는 과정에 어떤 어려움이 있는지를 보여주고 그 해결을 위해 웹앱을 만든 기록입니다."};
 if(id==="section-need")return {...slide,section:"수업에서 살펴볼 점",title:"우리 지역 조사하기,\n무엇이 어려울까요?",lead:"지역 자료를 찾고 뉴스의 신뢰성을 확인하는 과정에서 겪는 어려움",note:"공식 사회과 지역화 교재의 탐구 활동을 그대로 출발점으로 삼습니다. 교재에 최신 충북 기사가 없어서 교재가 잘못됐다는 주장이 아니라, 교사는 학급과 지역 실정에 맞는 조사 자료를 매번 준비해야 한다는 뜻입니다."};
 if(id==="section-build")return {...slide,section:"웹앱 제작 과정",title:"이러한 웹앱은\n어떻게 만들었을까요?",lead:"세 가지 메뉴 → 실제 자료 연결 → 기사 비교 → 탐정 카드 → 배포",note:"제작 과정은 전체 구성도와 핵심 명령문 6가지, 실제 수정 사례만 소개합니다. 이미 사용 방법에서 보여준 카드 결과 화면은 반복하지 않습니다. 현재 작동하는 웹앱에 맞춘 재현용 명령문이며 최초 대화 원문과 구분합니다."};
 if(id==="section-app")return {...slide,title:"우리 지역 탐정,\n어떤 기능을 담았을까요?",lead:"지역 정보 조사부터 기사 검색·검증·기록까지",note:"앞에서 주요 문제였던 뉴스 검색·검증·기본정보를 소개했습니다. 이 절은 지역의 다른 활동에 대응하기 위해 어떤 내용을 더 넣었는지 실제 메뉴 단위로 보여 줍니다."};
 if(id==="section-class")return {...slide,section:"사회과 수업 적용",title:"우리 지역 탐구 활동을\n수업에 어떻게 연결할까요?",lead:"교과서 활동을 바탕으로 수업 질문과 탐구 흐름 살펴보기"};
 return slide;
});
if(classroomSlides.filter(s=>s.type==="section").length!==4)throw Error("Section covers were changed");
const textbookTitles={
  "cover": "우리 지역 탐구 수업,\nAI와 어떻게 함께할까요?",
  "section-need": "우리 지역 조사하기,\n무엇이 어려울까요?",
  "field-textbook-news": "우리 지역의 문제를\n어떻게 조사해 볼까요?",
  "field-gap-news": "우리 지역의 뉴스를\n어떻게 찾으면 좋을까요?",
  "app-issues": "① 뉴스 찾기\n검색 결과는 어떻게 살펴볼까요?",
  "app-problem-features": "세 가지 주요 메뉴에서\n무엇을 할 수 있을까요?",
  "app-article-traffic": "같은 사건을 다룬 기사들은\n어떤 점이 다를까요?",
  "app-article-environment": "정정보도를 살펴보면\n어떤 사실을 알 수 있을까요?",
  "field-compare-gap": "뉴스의 내용은\n어떻게 확인해 볼까요?",
  "app-verify": "① 뉴스 찾기\n기사의 근거는 어떻게 비교할까요?",
  "field-textbook-region": "우리 고장의 자랑거리는\n어떻게 찾아볼까요?",
  "field-gap-region": "인터넷 검색에서 어떤 자료가\n함께 나올까요?",
  "app-menu": "우리 지역 탐정의 전체 화면을\n함께 살펴볼까요?",
  "app-basics": "② 우리 지역\n어떤 기본 정보를 살펴볼까요?",
  "field-standards": "그래서 어떤 웹앱을\n만들었을까요?",
  "section-build": "이러한 웹앱은\n어떻게 만들었을까요?",
  "build-overview": "웹앱 전체 구성은\n어떻게 연결될까요?",
  "build-spec": "첫 채팅에는\n무엇을 입력할까요?",
  "build-data-prompt": "지역 정보는\n어떻게 넣을까요?",
  "build-news-prompt": "뉴스 검색은\n어떻게 구현할까요?",
  "build-check-prompt": "기사 검증 화면은\n어떻게 만들까요?",
  "build-board": "완성한 카드는\n어떻게 저장할까요?",
  "build-test": "직접 사용하며\n무엇을 고쳤을까요?",
  "build-deploy": "학생이 쓰도록\n어떻게 공개할까요?",
  "section-app": "우리 지역 탐정의 세 가지 메뉴를\n어떻게 활용할까요?",
  "app-nature": "② 우리 지역\n자연환경은 어떻게 살펴볼까요?",
  "app-public": "② 우리 지역\n생활시설과 공공기관은 무엇이 있을까요?",
  "app-industry": "② 우리 지역\n산업과 생산물을 어떻게 알아볼까요?",
  "app-culture": "② 우리 지역\n역사와 문화를 어떻게 살펴볼까요?",
  "app-news": "① 뉴스 찾기\n우리 지역 기사를 어떻게 찾을까요?",
  "app-article-check": "① 뉴스 찾기\n서로 다른 자료를 어떻게 비교할까요?",
  "app-record": "③ 탐정 게시판\n탐구 결과는 어떻게 확인할까요?",
  "boundaries": "학생이 직접 탐구하려면\n어떤 도움이 필요할까요?",
  "section-class": "우리 지역 탐구 수업은\n어떻게 구성할까요?",
  "sample-question": "우리 지역의 교통안전은\n어떻게 살펴볼까요?",
  "lesson-40": "지역 문제 탐구 수업은\n어떻게 진행해 볼까요?",
  "assessment": "학생의 탐구 과정은\n어떻게 살펴볼까요?",
  "closing": "교과서 속 탐구를\n우리 지역과 어떻게 이을까요?",
  "sources": "발표 자료의 출처는\n어디에서 확인할까요?"
};
const textbookLeads={
  "section-need": "지역 자료 수집과 정보의 신뢰성 확인",
  "section-build": "세 가지 메뉴와 자료 검색·비교·기록 기능을 구현한 과정",
  "section-app": "지역 정보 조사, 뉴스의 신뢰성 평가 및 탐구 결과 기록",
  "section-class": "지역 문제 조사와 자료 비교를 활용한 수업 흐름"
};
window.TRAINING_SLIDES=classroomSlides.map(slide=>({...slide,title:textbookTitles[slide.id],...(textbookLeads[slide.id]?{lead:textbookLeads[slide.id]}:{})}));

window.TRAINING_META={title:"AI를 활용한 우리 지역 탐구 수업",date:"2026. 11. 25.(수)",time:"15:00–17:00",originalUrl:SITE};
})();