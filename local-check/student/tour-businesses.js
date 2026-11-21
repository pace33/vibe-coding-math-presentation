/* 충북 기업·산업 현장 체험처 (2026-11-21 공개자료 확인).
 * 온라인 접수 여부·대상 학년·운영 일정은 반드시 출발 전 업체에 재확인합니다.
 * 충북나드리(충북도 공식 교육체험관광) + 기업·교육청 자료를 우선 인용.
 * status='consult'는 단체 견학 사례/소개를 확인했다는 의미이지
 * 지금 초등학교 단체 예약을 받는다는 뜻이 아닙니다.
 */
(() => {
"use strict";
const tourism="https://tour.chungbuk.go.kr/www/contents.do?key=254";
const visit=(status,program,url,who,contact,source,notes="")=>({
 status,program,url,who,contact,source,notes,
 checked:"2026-11-21"
});
const entry=(id,region,name,type,emoji,produces,summary,src,tour)=>({
 id,region,name,type,emoji,produces,summary,group:"지역 체험기업",
 source:{title:src.title,date:src.date||"견학 소개",url:src.url},
 inquiry:region+"의 "+name+"에서 어떤 일을 하고, 견학 프로그램으로 무엇을 배울 수 있나요?",
 tour
});
const consult=(program,detailUrl,who,phone,notes="")=>visit("consult",program,detailUrl,who,phone,{title:"충북나드리 교육체험관광",url:tourism},notes);
const online=(program,url,who,phone,sourceTitle,sourceUrl,notes="")=>visit("online",program,url,who,phone,{title:sourceTitle,url:sourceUrl},notes);
const school=(program,url,who,phone,sourceTitle,sourceUrl,notes="")=>visit("school",program,url,who,phone,{title:sourceTitle,url:sourceUrl},notes);
window.LOCALCHECK_TOUR_BUSINESSES={
 // 기존 기업 목록과 연결: 중복 카드를 만들지 않고 견학 신청/안내를 추가합니다.
 upgrades:{
 "extra-es-ottogi":online("식품 생산 공정·홍보관·시식","https://www.otoki.com/brand/factory-tour","40명 단체 우선 · 유치원생은 부모 동반","02-2010-0789","오뚜기 공식 공장견학","https://www.otoki.com/brand/factory-tour","3~6월, 9~11월 / 목요일 1회 · 2026년 잔여 신청 마감 안내"),
 "extra-es-handok":online("의약박물관·의약품 생산시설 견학","https://www.handokmuseum.com/edu/edu.php?category=&idx=38038&ptype=view","2026년 방학 특별 프로그램 초등학생 이상 · 프로그램별 접수","043-530-1004","한독의약박물관 공식 2026년 교육 프로그램","https://www.handokmuseum.com/edu/edu.php?category=&idx=38038&ptype=view","2026년 2월 사례로, 현재 해당 회차는 종료. 최신 일정 확인 필수"),
 "extra-cju-kimberly":consult("위생용품 생산공정 단체 견학","https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=87fc17ef-6392-4d24-8e28-b8dc2b90f135","평일 단체 견학 소개 · 초등학교 방문은 사전 협의",null,"한국관광공사 산업관광 안내"),
 "extra-jc-hanwha":school("태양광 발전 원리 교육","https://cutis.cbe.go.kr/hp-jce/cm/cntnts/cntntsView.do?cntntsId=35286&mi=10724","충북교육청 진천온마을배움터 체험처 · 학교 사전 협의",null,"충북교육청 진천온마을배움터","https://cutis.cbe.go.kr/hp-jce/cm/cntnts/cntntsView.do?cntntsId=35286&mi=10724","공장 견학보다는 태양광 원리 교육 프로그램으로 안내")
 },
 // 기존 기업에 없는 실제 기업·체험 생산시설
 listed:[
 entry("tour-cheongju-vegemil","청주시","정식품 청주공장","식품·두유","🥛","콩으로 만드는 두유","베지밀 두유가 생산되는 과정을 알아봐요.",
  {title:"정식품 청주공장 견학 신청",url:"https://www.vegemil.co.kr/rnd/factoryTour"},
  online("두유 생산 과정 및 식품위생 교육","https://www.vegemil.co.kr/rnd/factoryTour","학교 방문 사례 확인 · 초등생 대상은 별도 확인","043-270-8816","정식품 공식 공장견학","https://www.vegemil.co.kr/rnd/factoryTour","신청 시 로그인이 필요할 수 있음")),
 entry("tour-cheongju-hankook","청주시","한국도자기 청주공장","도자기 제조","🏺","그릇·도자기","도자기를 만드는 생산시설과 전시 공간을 알아봐요.",
  {title:"충북나드리 한국도자기 공장 견학",url:tourism},
  consult("도자기 생산공정 견학·전시",tourism,"공식 산업관광 안내 · 학교 단체는 전화 문의","043-262-5251","초등학생 참여 가능 여부·접수일 확인")),
 entry("tour-jeungpyeong-hansamin","증평군","한삼인 증평공장","인삼 가공","🌱","인삼·홍삼 제품","인삼이 가공품으로 만들어지는 과정을 알아봐요.",
  {title:"증평 한삼인 공장 산업관광 소개",url:"https://www.koreatriptips.com/tourist-attractions/2465783.html"},
  consult("홍삼 제품 홍보관·생산시설 견학","https://www.koreatriptips.com/tourist-attractions/2465783.html","관광안내의 방문 사례 · 2026년 운영·학생 대상 재확인",null,"현재 공식 예약 창 확인되지 않음")),
 entry("tour-jincheon-root","진천군","만나씨이에이 뤁스퀘어","스마트농업","🌿","스마트팜·미래농업","식물이 자라는 스마트팜과 자동화 농업 기술을 체험해요.",
  {title:"만나씨이에이 공식 뤁스퀘어 소개",url:"https://mannacea.com/theme/cont_basic/contents/file/sub_05a.php"},
  school("스마트팜 시설 견학·재배 체험","https://www.mannacea.com/bbs/board.php?bo_table=notice&wr_id=77","초등 가족 체험·교육청 체험처 소개 · 단체 별도 협의",null,"충북교육청 진천온마을배움터","https://cutis.cbe.go.kr/hp-jce/cm/cntnts/cntntsView.do?cntntsId=35286&mi=10724","예약 가능한 회차 확인")),
 entry("tour-goesan-icoop","괴산군","괴산자연드림파크","식품 생산·체험","🥬","가공식품·친환경 먹거리","식품 공방과 검사시설의 역할을 살펴보고 만들기 체험을 할 수 있어요.",
  {title:"자연드림파크 공식 체험·견학 안내",url:"https://www.naturaldreampark.co.kr/"},
  online("식품 공방 견학 및 어린이 만들기 체험","https://www.naturaldreampark.co.kr/reservation_new.html","프로그램별 나이·인원 제한 확인","1833-5753","자연드림파크 공식 예약 안내","https://www.naturaldreampark.co.kr/reservation_new.html","공방·체험에 따라 예약 상품과 대상이 다름")),
 entry("tour-eumseong-pulmuone","음성군","풀무원 음성 두부공장","식품 제조","🫘","두부·콩 가공식품","두부를 만드는 과정을 살펴보고 식품 체험에 참여해요.",
  {title:"풀무원 2026 음성공장 견학 모집",url:"https://news.pulmuone.co.kr/pulmuone/newsroom/viewNewsroom.do?id=3747",date:"2026-01-06"},
  online("두부공장·쿠킹클래스·학생 진로 탐방","https://tour.pulmuone.kr/","일반 단체·학생 단체·진로탐방 단체 구분","043-530-4732","풀무원 공식 견학 예약","https://tour.pulmuone.kr/","2026년 프로그램 · 예약 가능 날짜 확인")),
 entry("tour-eumseong-volvik","음성군","볼빅 음성공장","스포츠용품","⛳","골프공","골프공을 만드는 과정을 알아보고 골프공 꾸미기를 체험해요.",
  {title:"충북나드리 볼빅 견학·체험",url:tourism},
  consult("골프공 공장견학·골프공 아트",tourism,"공식 관광 안내 · 학교 단체 전화 협의","043-877-1916","주말 휴무 안내 · 일정 확인")),
 entry("tour-eumseong-interbath","음성군","인터바스 음성공장","건축·생활용품","🧱","욕실 자재·타일","욕실에 쓰는 타일과 제품 전시장을 보고 타일 만들기를 체험해요.",
  {title:"충북나드리 인터바스 체험 안내",url:tourism},
  consult("욕실전시장 투어·타일 만들기",tourism,"현장 운영시간·체험 예약 여부 문의","043-878-0171","전시장 투어 중심")),
 entry("tour-eumseong-semo","음성군","세모 음성공장","생활·위생제품","🧴","손세정제·로션","위생용품을 만들고 나만의 손세정제나 로션을 체험해요.",
  {title:"충북나드리 세모 체험 안내",url:tourism},
  consult("위생용품 공장 견학·핸드워시 만들기",tourism,"공식 관광 안내 · 학교 단체 전화 협의","043-870-6000","주말 휴무 안내")),
 entry("tour-eumseong-wooriwa","음성군","우리와 음성공장","반려동물 먹거리","🐶","반려동물 사료·간식","동물 먹거리를 만드는 과정과 반려동물 간식 체험을 알아봐요.",
  {title:"충북나드리 우리와 학교가자 프로그램",url:tourism},
  school("공장 견학·반려동물 간식 만들기·우리와 학교가자",tourism,"‘우리와 학교가자’ 학교 연계 프로그램 안내","043-870-5200","충북나드리 교육체험관광",tourism,"신청 방법과 초등 대상 여부 담당자 문의")),
 entry("tour-eumseong-kumilk","음성군","건국유업 음성공장","유제품","🥛","우유·요거트","우유가 요거트로 만들어지는 과정을 살펴보고 토핑을 넣어 봐요.",
  {title:"충북나드리 건국유업 체험 안내",url:tourism},
  consult("유제품 공장 견학·토핑 요거트 만들기",tourism,"공식 관광 안내 · 학교 단체 전화 협의","043-530-6024","주말 휴무 안내")),
 entry("tour-eumseong-komega","음성군","코메가 들기름 공방","농산물 가공","🌾","들기름·들깨 가공품","들깨를 가공하고 깻묵을 이용한 공예를 체험해요.",
  {title:"충북나드리 코메가 체험",url:tourism},
  consult("들기름 가공 체험·깻묵 업사이클 공예",tourism,"프로그램 문의 후 예약","043-882-6336","공장 내부 견학 여부 문의")),
 entry("tour-eumseong-yerang","음성군","여명 이랑 스마트팜","스마트농업","🌱","원격 관수·식물 재배","물을 자동으로 주는 스마트팜과 농작물의 성장을 관찰해요.",
  {title:"충북나드리 여명 스마트팜 체험",url:tourism},
  consult("스마트 허브·원격 관수·농장 체험",tourism,"체험 인원·날짜 문의","010-5767-5036","스마트농업 현장 체험")),
 entry("tour-eumseong-center","음성군","음성 팩토리투어센터","산업 체험·교육","🔬","제조업 이해·안전체험","산업과 제품 제조를 배우고 비누·응급처치 체험을 할 수 있어요.",
  {title:"음성군 공식 팩토리투어센터 안내",url:"https://www.eumseong.go.kr/factory/index.do"},
  consult("비누 만들기·심폐소생술·AED 체험","https://www.eumseong.go.kr/factory/index.do","학생 체험센터 · 학교 단체 예약 문의","043-530-2405","기업이 아닌 군 운영 연계 체험센터")),
 entry("tour-danyang-jang","단양군","장익는마을","장류·전통식품","🫘","된장·장류","된장 만드는 곳을 둘러보고 장 담그기나 두부 만들기를 체험해요.",
  {title:"장익는마을 생산시설·체험 관광정보",url:"https://ontrip.kr/travel-guides/details/2465538"},
  consult("장류 시설 견학·장 담그기·두부 만들기","https://ontrip.kr/travel-guides/details/2465538","학교 단체 가능 여부·현장 운영 확인",null,"관광 소개상 체험 안내 · 공식 예약 페이지 미확인"))
 ]
};
window.LOCALCHECK_TOUR_ASOF="2026-11-21";
})();
