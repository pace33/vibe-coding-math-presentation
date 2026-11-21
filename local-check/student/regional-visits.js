(() => {
"use strict";
/* 학교 현장체험학습을 위한 지역별 방문·견학 시설. 2026-11-21 공개 안내 확인.
 * status: "reserve" 공식 예약, "school" 학교 단체 견학 안내,
 *         "visit" 일반 공개관람/공공 탐방, "consult" 방문 사례·시설 소개(사전 전화 협의).
 * 이 정보는 예약 가능 여부나 장애학생 접근성을 실시간 보증하지 않습니다.
 */
const V=(field,name,activity,href,source,status="consult",notes="")=>({
 icon:field==="nature"?"🌿":field==="facilities"?"🏫":"🏛️",
 title:field==="nature"?"자연 체험·견학":field==="facilities"?"공공기관 견학":"박물관·미술관 견학",
 value:name,summary:activity,href,source,
 primaryLabel:"시설·체험 안내 ↗",
 visit:{status,url:href,program:activity,notes:notes||"방문 가능일·학교 단체 인원·편의시설·인솔 조건은 미리 확인하세요.",checked:"2026-11-21"}
});
window.LOCALCHECK_REGIONAL_VISITS={
 "청주시":{
  nature:[
   V("nature","청주랜드 기후변화체험관","기후변화와 탄소중립을 전시·체험하며 배울 수 있어요.","https://ticket.cheongju.go.kr/www/selectExprnWebList.do?key=8","청주시 통합예약","reserve","회차별 접수 대상이 달라요. 학교 단체 이용 여부 확인")
  ],
  facilities:[
   V("facilities","충북자연과학교육원 과학체험관","과학기구와 전시를 보며 관찰·실험 체험을 해요.","https://www.cbnse.go.kr/reserve/sub.php?menukey=16","충북자연과학교육원 통합예약","school","도내 유·초·중·고·특수학교 단체 예약 안내 확인"),
   V("facilities","충북안전체험관","화재·지진·생활·교통안전을 체험해요.","https://safe119.chungbuk.go.kr/safety/sub.do?menukey=1672","충북안전체험관 공식 이용안내","school","단체는 사전 예약, 인솔교사 동행, 프로그램별 연령·장애학생 편의 확인")
  ],
  local:[
   V("local","청주시립미술관","미술 작품을 관람하고 전시 관련 체험을 알아봐요.","https://cmoa.cheongju.go.kr/www/contents.do?key=213","청주시립미술관 단체관람예약","reserve","단체관람은 예약 회차와 운영일 확인"),
   V("local","청주시립대청호미술관","대청호 주변의 미술 작품 전시를 관람해요.","https://cmoa.cheongju.go.kr/daecheongho/contents.do?key=148","청주시립대청호미술관 관람안내","visit","문의문화재단지 입장과 연계되는 관람시설")
  ]
 },
 "충주시":{
  nature:[
   V("nature","봉황자연휴양림","숲길을 걸으며 나무와 산림환경을 관찰해요.","https://www.foresttrip.go.kr/pot/rm/ri/selectRcrfrIntrdDtlView.do?hmpgId=ID02030051&menuId=002001","산림청 숲나들e","visit","산책·방문과 공식 숲해설 프로그램 운영은 구분하여 확인")
  ],
  facilities:[
   V("facilities","충주시립도서관 단체견학","도서관 이용교육과 영상동화·자료 열람을 체험해요.","https://lib.chungju.go.kr/lib/web/program/visitCalendar.do","충주시립도서관 단체견학 신청","reserve","신청 후 담당자의 승인 여부를 확인하세요")
  ],
  local:[
   V("local","충주박물관","충주의 옛 유물과 지역 역사를 관람해요.","https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=623","충북나드리 충주박물관","visit","단체 해설이나 체험은 별도 확인")
  ]
 },
 "제천시":{
  nature:[
   V("nature","의림지 생태 산책","의림지의 물길과 주변 동·식물을 관찰해요.","https://tour.jecheon.go.kr/tour/base/tour/contents/view?clturCntntsNo=93747&menuLevel=3&menuNo=46","제천시 문화관광 의림지","visit","야외 산책은 기상 상태와 이동 동선을 확인")
  ],
  facilities:[
   V("facilities","의림지역사박물관","저수지·관개기술과 자연환경을 디지털 전시로 배워요.","https://tour.jecheon.go.kr/tour/base/tour/contents/view?clturCntntsNo=93747&menuLevel=3&menuNo=46","제천시 문화관광 의림지역사박물관","visit","공공 박물관 관람, 학교 단체 해설은 사전 문의")
  ],
  local:[
   V("local","제천 의병전시관","의병의 역사와 관련 유물을 관람해요.","https://tour.jecheon.go.kr/tour/base/tour/contents/view?clturCntntsNo=120&menuLevel=3&menuNo=103","제천시 문화관광 자양영당·의병전시관","visit","관람 시간과 해설 운영 문의")
  ]
 },
 "보은군":{
  nature:[
   V("nature","국립속리산말티재자연휴양림","숲길 체험과 역사·자연 연계 프로그램을 살펴봐요.","https://www.foresttrip.go.kr/pot/rm/fa/selectPrgrmListView.do?goodsClsscCd=04002&hmpgId=0115&menuId=002003","산림청 숲나들e 숲체험 프로그램","reserve","회차별 대상·인원·신청 가능 여부 확인")
  ],
  facilities:[
   V("facilities","보은군립도서관","책과 전시를 보고 어린이 독서·문화 프로그램에 참여할 수 있어요.","https://lib.boeun.go.kr/front/index.php?g_page=culture&m_page=culture04","보은군립도서관 공식 문화강좌","consult","프로그램별 학년 제한과 개인·단체 접수 구분")
  ],
  local:[
   V("local","보은 법주사","법주사 팔상전과 오래된 문화유산을 관람해요.","https://tour.chungbuk.go.kr/www/contents.do?key=254","충북나드리 교육체험관광","visit","공개 사찰 문화유산 관람. 별도 단체해설·체험 여부 확인")
  ]
 },
 "옥천군":{
  nature:[
   V("nature","장령산자연휴양림","금천계곡과 숲을 걸으며 자연환경을 관찰해요.","https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=1303","충북나드리 장령산자연휴양림","visit","단체 방문 전 현지 시설·탐방로 확인")
  ],
  facilities:[
   V("facilities","옥천군민도서관·지역 도서관","책을 읽고 지역 공공도서관의 역할을 살펴봐요.","https://www.google.com/search?q=%EC%98%A5%EC%B2%9C%EA%B5%B0%EB%AF%BC%EB%8F%84%EC%84%9C%EA%B4%80+2026+%EC%9A%B4%EC%98%81+%EC%9C%84%EC%B9%98+site%3Aoc.go.kr","옥천군청 자료 찾기","consult","도서관 이전·운영 장소 변경 가능성이 있어 방문 전에 군청 확인")
  ],
  local:[
   V("local","정지용문학관","시인 정지용의 작품과 영상·전시를 체험해요.","https://oc.go.kr/jiyong/contents.do?key=2477","옥천군 정지용문학관 공식 소개","visit","문학교실 단체 이용은 사전 신청")
  ]
 },
 "영동군":{
  nature:[
   V("nature","민주지산자연휴양림","민주지산의 숲과 계곡을 체험하며 관찰해요.","https://www.foresttrip.go.kr/indvz/main.do?hmpgId=ID02030107","산림청 숲나들e 휴양림 목록","visit","산림 체험 프로그램은 해당 시설에 운영 여부 문의")
  ],
  facilities:[
   V("facilities","영동국악체험촌","공공 문화체험시설에서 국악기 연주와 전통음악을 체험해요.","https://www.yd21.go.kr/portal/html/sub07/0701.html","영동군 국악체험촌 안내","consult","단체 체험 공연·예약·체류 프로그램 구분 문의")
  ],
  local:[
   V("local","난계국악박물관","옛 국악기와 국악의 역사를 관람하고 해설을 들어요.","https://town.yd21.go.kr/tour/html/sub02/020802.html","영동군 문화관광 박물관 관람·해설","visit","무료 전시해설 일정은 기관에 확인")
  ]
 },
 "증평군":{
  nature:[
   V("nature","좌구산 휴양랜드","숲길과 자연환경을 관찰하며 체험시설을 알아봐요.","https://jp.go.kr/park/sub03_01.do","산림청 숲나들e 좌구산휴양랜드","visit","체험별 정원·연령·이동 지원 확인")
  ],
  facilities:[
   V("facilities","좌구산천문대","별과 우주를 관찰하는 천문·과학체험 프로그램을 알아봐요.","https://jp.go.kr/park/sub03_05.do","증평군 좌구산천문대","reserve","홈페이지 사전 예약 운영, 회차별 대상 확인"),
   V("facilities","증평군립도서관","도서관 시설과 독서문화 활동을 살펴봐요.","https://new.jp.go.kr/kor/sub04_05_04.do","증평군청 관내 도서관 안내","consult","학교 단체 이용교육 가능 여부 문의")
  ],
  local:[
   V("local","증평민속체험박물관","민속 전시와 전통놀이·공예 만들기 프로그램을 체험해요.","https://tour.jp.go.kr/museum/prog/experCate/sub04_03/view.do?exper_no=48&pageIndex=1","증평민속체험박물관 체험 신청","reserve","단체 예약 프로그램은 전화 접수 안내, 프로그램별 대상·비용 확인")
  ]
 },
 "진천군":{
  nature:[
   V("nature","생거진천자연휴양림","숲해설사와 숲속 탐방·자연 관찰 프로그램에 참여해요.","https://www.foresttrip.go.kr/pot/rm/fa/selectPrgrmListView.do?hmpgId=ID02030033","산림청 숲나들e 숲체험 예약","reserve","어린이·청소년 대상, 회차별 인원 제한 확인")
  ],
  facilities:[
   V("facilities","진천군립도서관","지역 도서관과 교육·독서 활동을 알아봐요.","https://www.jincheon.go.kr/site/edu/main.do","진천군 교육·문화 안내","consult","2026년 11월부터 2027년 2월경까지 홈페이지 서비스 중단 공지. 전화나 군청으로 문의")
  ],
  local:[
   V("local","진천군립 생거판화미술관","여러 판화 작품을 관람하고 미술 전시 활동을 알아봐요.","https://www.jincheon.go.kr/site/tour/sub.do?menukey=2781","진천군립 생거판화미술관 단체관람","reserve","일반 관람 가능, 단체는 전화 예약 우선 안내"),
   V("local","진천종박물관","우리나라 종의 역사와 주조 기술을 살펴봐요.","https://www.jincheon.go.kr/site/tour/sub.do?menukey=2153","진천군 관광 진천종박물관","visit","단체 교육·체험은 별도 문의")
  ]
 },
 "괴산군":{
  nature:[
   V("nature","성불산산림휴양단지","숲길·생태숲학습관·자연휴양시설을 체험해요.","https://www.goesan.go.kr/tour/selectTourInfo.do?key=885&tourNo=634","괴산군 문화관광 성불산산림휴양단지","visit","2026년 스탬프 투어는 기간별 운영 확인")
  ],
  facilities:[
   V("facilities","괴산군립도서관","공공도서관의 책과 독서 프로그램을 알아봐요.","https://lib.goesan.go.kr/front/","괴산군립도서관","consult","단체 방문·프로그램은 기관 문의")
  ],
  local:[
   V("local","괴산농업역사박물관","옛 농기구와 농사 생활을 관람하고 체험 활동을 알아봐요.","https://www.goesan.go.kr/museum/index.do","괴산농업역사박물관 교육·체험","reserve","전시 관람과 체험 신청은 구분하여 확인")
  ]
 },
 "음성군":{
  nature:[
   V("nature","봉학골 산림욕장","가섭산 자락 숲길에서 나무와 곤충 등을 관찰해요.","https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=56&pageIndex=140&pageUnit=12&searchCnd=all&searchMainSe=ATTR&tourNo=184","충북나드리 봉학골 산림욕장","visit","야외 공간 방문. 인솔교사·탐방로·이동 편의 확인")
  ],
  facilities:[
   V("facilities","음성 팩토리투어센터","지역 산업·제품을 배우고 안전·제조 체험을 알아봐요.","https://www.eumseong.go.kr/factory/index.do","음성군 팩토리투어센터","consult","공공 체험시설이며 일반 회사와 달라요. 학교 단체 접수 여부 확인")
  ],
  local:[
   V("local","한독의약박물관","의약품·건강 관련 유물과 특별 교육 프로그램을 체험해요.","https://www.handokmuseum.com/edu/edu.php?category=&idx=38038&ptype=view","한독의약박물관 공식 교육안내","consult","연도별 모집 회차 확인, 이전 프로그램 마감 시 새 안내 확인")
  ]
 },
 "단양군":{
  nature:[
   V("nature","황정산자연휴양림","숲길을 걸으며 산림과 자연을 탐방해요.","https://www.foresttrip.go.kr/pot/rm/fa/selectPrgrmListView.do?hmpgId=0242&menuId=002003","산림청 숲나들e 황정산자연휴양림","visit","단체 이용·숲해설은 별도 문의")
  ],
  facilities:[
   V("facilities","단양군립올누림도서관","도서관 시설견학과 도서관 이용교육을 받을 수 있어요.","https://www.danyang.go.kr/lib/front/index.php?g_page=service&m_page=service04","단양군립올누림도서관 견학 신청","reserve","단체 견학 신청 페이지에서 방문일·인원 확인")
  ],
  local:[
   V("local","수양개선사유물전시관","선사시대 유물을 보고 선사문화 체험실을 둘러봐요.","https://www.danyang.go.kr/suyanggae/1148","단양군수양개선사유물전시관 관람안내","visit","단체 관람료 및 교육체험 여부는 공식 안내 확인")
  ]
 }
};
window.LOCALCHECK_REGIONAL_VISITS_ASOF="2026-11-21";
})();