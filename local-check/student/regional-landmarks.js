(() => {
"use strict";
/* 충북 11개 시·군의 변하지 않는 대표 지명·유산·전시 시설을 수업용으로 정리.
 * 표시되는 명칭은 실제 장소입니다. 관람 시간·운영 여부·최신 지정현황은 원문 확인.
 * 상세 자료가 확인된 경우에만 URL을 입력하고, 나머지는 지역·명칭 구글 검색으로 연결.
 */
const n=(title,value,summary,href="",source="지역 자연환경 공공자료")=>({icon:{"산과 지형":"⛰️","하천과 강":"💧","호수와 저수지":"🌊","숲과 계곡":"🌲","바위와 강 경관":"🏞️"}[title]||"🏞️",title,value,summary,href,source});
const h=(title,value,summary,href="",source="지역 역사·문화 공식자료")=>({icon:{"문화유산·유물":"🏛️","박물관·전시관":"🏺","역사 장소":"📜","미술관·예술":"🎨","대표 축제":"🎉","예술·공연 축제":"🎭"}[title]||"🏛️",title,value,summary,href,source});
window.LOCALCHECK_REGIONAL_LANDMARKS={
"청주시":{
 nature:[
  n("산과 지형","우암산 · 미동산","청주 도심의 우암산과 미원면 미동산의 산지 모습을 살펴보세요."),
  n("하천과 강","무심천 · 미호강","무심천은 청주 시가지를 흐르고, 미호강은 청주와 주변 지역을 지나는 강이에요."),
  n("호수와 저수지","대청호","대청댐으로 생긴 인공 호수로, 청주시 문의면 등과 맞닿아 있어요."),
  n("숲과 계곡","옥화구곡","옥화구곡에서는 계곡과 바위를 볼 수 있어요.")
 ],
 local:[
  h("문화유산·유물","직지 · 상당산성","직지는 옛 금속활자 인쇄 문화를 알려 주는 기록유산이고, 상당산성은 옛 성곽이에요."),
  h("박물관·전시관","국립청주박물관 · 청주고인쇄박물관","청주의 옛 유물과 인쇄 문화를 볼 수 있는 박물관이에요."),
  h("역사 장소","청주 흥덕사지 · 정북동토성","옛 절터와 흙으로 쌓은 성의 흔적을 살펴볼 수 있어요."),
  h("미술관·예술","청주시립미술관","지역 작가와 다양한 예술 작품을 만날 수 있는 미술관이에요.")
 ]},
"충주시":{
 nature:[
  n("산과 지형","계명산 · 월악산","충주의 산지와 월악산의 산줄기 모습을 비교해 보세요."),
  n("하천과 강","남한강 · 달천","남한강이 충주를 지나고, 달천이 남한강과 만나요."),
  n("호수와 저수지","충주호","충주댐 건설로 만들어진 인공 호수예요.","https://access.visitkorea.or.kr/ms/detail.do?cotId=7a186608-ff94-4b2c-9bef-6d97c9712ea1","한국관광공사 충주호"),
  n("숲과 계곡","봉황자연휴양림 · 을궁산","충주시 노은면의 을궁산 자락에 자연휴양림이 있어요.","https://www.foresttrip.go.kr/pot/rm/ri/selectRcrfrIntrdDtlView.do?hmpgId=ID02030051&menuId=002001","산림청 숲나들e")
 ],
 local:[
  h("문화유산·유물","충주 탑평리 칠층석탑 · 충주 고구려비","옛 석탑과 고구려의 흔적이 남은 비석을 살펴보세요.","https://digital.khs.go.kr/heri/heriDetail.do?ctptNo=1113300060000&ctptUid=13898859665736200007","국가유산 디지털 서비스"),
  h("박물관·전시관","충주박물관 · 조동리선사유적박물관","충주에서 나온 옛 도구와 유물을 전시한 박물관이에요.","https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=623","충북나드리 충주박물관"),
  h("역사 장소","탄금대 · 충주 미륵대원지","옛 인물의 이야기와 절터 유적을 살펴볼 수 있는 역사 장소예요.")
 ]},
"제천시":{
 nature:[
  n("산과 지형","월악산 · 금수산","제천의 월악산과 금수산에는 산줄기와 바위가 많아요.","https://tour.jecheon.go.kr/tour/base/tour/contents/view?clturCntntsNo=11&menuLevel=2&menuNo=67","제천시 문화관광 금수산"),
  n("하천과 강","제천천 · 장평천","제천 시내와 주변 지역을 흐르는 하천의 이름을 찾아보세요."),
  n("호수와 저수지","의림지 · 청풍호","의림지는 오래전부터 이용해 온 저수지이고, 청풍호는 충주댐으로 생긴 인공 호수예요.","https://tour.jecheon.go.kr/tour/base/main/view","제천시 문화관광"),
  n("숲과 계곡","송계계곡 · 월악산 숲","계곡물과 숲이 어우러진 월악산의 모습을 살펴보세요.")
 ],
 local:[
  h("문화유산·유물","청풍 한벽루 · 제천 점말동굴 유적","옛 건물과 구석기시대 동굴 유적을 비교해 보세요.","https://tour.jecheon.go.kr/tour/base/tour/contents/view?clturCntntsNo=139&menuLevel=3&menuNo=124","제천시 문화관광 점말동굴"),
  h("박물관·전시관","제천의병전시관","나라를 지키려고 활동한 의병의 역사를 알아볼 수 있어요."),
  h("역사 장소","청풍문화유산단지 · 배론성지","옛 청풍의 건물과 역사적 장소를 둘러볼 수 있어요.","https://tour.jecheon.go.kr/tour/base/tour/contents/view?clturCntntsNo=10&menuLevel=3&menuNo=67","제천시 문화관광")
 ]},
"보은군":{
 nature:[
  n("산과 지형","속리산 · 구병산","보은군에 있는 대표적인 산의 모습을 살펴보세요."),
  n("하천과 강","보청천 · 서원계곡","보청천은 보은에서 옥천을 거쳐 금강으로 흘러가요.","https://archive.chungbuk.re.kr/prog/assetsDetail/00/AS000000044815Cn3fX2/view.do?assetsId=AS000000044815Cn3fX2","충북 아키비움 보청천"),
  n("호수와 저수지","삼가저수지 · 종곡저수지","산에서 내려온 물을 모아 두는 인공 저수지예요."),
  n("숲과 계곡","속리산 숲 · 만수계곡","산의 숲과 계곡에서 물과 나무의 관계를 알아보세요.")
 ],
 local:[
  h("문화유산·유물","법주사 팔상전 · 보은 삼년산성","목조 건물과 옛 산성을 통해 지역의 역사를 알아봐요."),
  h("박물관·전시관","솔향공원 소나무전시관","소나무의 특징과 쓰임새를 알 수 있는 전시 공간이에요."),
  h("역사 장소","법주사 · 삼년산성","오래된 절과 산성은 보은의 역사를 보여 주는 장소예요.")
 ]},
"옥천군":{
 nature:[
  n("산과 지형","장령산 · 둔주봉","둔주봉에서 금강이 굽이치는 모습을 볼 수 있어요."),
  n("하천과 강","금강 · 보청천","옥천 지역을 흐르는 금강과 보청천의 물길을 찾아보세요."),
  n("호수와 저수지","대청호","금강을 막아 만든 댐 호수로 옥천의 일부 지역과 맞닿아 있어요.","https://www.ecotour.go.kr/front/tour/choice/detail/121","환경부 생태관광 대청호 안터지구"),
  n("숲과 계곡","장령산자연휴양림","장령산의 숲과 계곡을 살펴보세요.")
 ],
 local:[
  h("문화유산·유물","용암사 동서삼층석탑 · 옥천 이지당","옛 석탑과 선비들이 공부하던 건물을 알아봐요.","https://etc.oc.go.kr/tour/contents.do?key=4000","옥천군 문화관광"),
  h("박물관·전시관","정지용문학관 · 옥천향토전시관","시인 정지용의 작품과 옥천의 옛 생활을 알아볼 수 있어요."),
  h("역사 장소","정지용 생가 · 육영수 생가","지역 인물의 옛집과 삶의 흔적을 찾아보세요.","https://www.okcheon.go.kr/tour/contents.do?key=3817","옥천군 문화관광")
 ]},
"영동군":{
 nature:[
  n("산과 지형","민주지산 · 백화산","영동에는 민주지산과 백화산 등 산이 있어요."),
  n("하천과 강","금강 · 초강천","금강 상류와 초강천이 영동 지역을 흐르고 있어요.","https://www.chungbuk.go.kr/www/contents.do?key=446","충청북도 자연환경"),
  n("호수와 저수지","송호관광지 금강변","금강 주변의 물길과 강가 풍경을 살펴보세요."),
  n("숲과 계곡","물한계곡 · 민주지산 숲","민주지산 주변의 숲과 물한계곡을 살펴볼 수 있어요.","https://access.visitkorea.or.kr/ms/detail.do?cotId=eaad4a14-6464-4810-b187-3a1d64cecdcb","한국관광공사 물한계곡")
 ],
 local:[
  h("문화유산·유물","영국사 · 영국사 은행나무","옛 절과 오래된 나무가 있는 문화·자연유산 장소예요."),
  h("박물관·전시관","난계국악박물관","영동 출신 음악가 난계 박연과 우리 국악기를 알아볼 수 있어요.","https://www.yd21.go.kr/gugak/html/sub02/020201.html","영동군 국악체험촌"),
  h("역사 장소","난계사 · 영국사","박연을 기리는 장소와 오래된 절의 역사를 살펴보세요.")
 ]},
"증평군":{
 nature:[
  n("산과 지형","좌구산 · 두타산","증평의 좌구산과 인접 지역에 걸친 두타산의 산줄기를 알아봐요."),
  n("하천과 강","보강천 · 삼기천","증평 시가지에는 보강천이 흐르고, 좌구산에서 삼기천이 시작해요.","https://water.jp.go.kr/tour/sub02_09_09.do","증평군 문화관광 보강천"),
  n("호수와 저수지","삼기저수지","좌구산 아래 삼기저수지에는 수변 산책로가 있어요.","https://museum.jp.go.kr/tour/prog/tursmCn/sub01_01_04/view.do?progNo=p00000001483dr1nJ4qv","증평군 삼기저수지 등잔길"),
  n("숲과 계곡","좌구산자연휴양림 · 보강천 미루나무숲","자연휴양림과 사람이 가꾼 하천변 숲의 모습을 비교해 봐요.")
 ],
 local:[
  h("문화유산·유물","남하리사지 삼층석탑 · 남하리사지 마애불상군","고려시대 석탑과 바위에 새긴 불상을 알아봐요.","https://www.jp.go.kr/museum/sub02_01.do","증평민속체험박물관 상설전시"),
  h("박물관·전시관","증평민속체험박물관","증평의 옛 생활과 문화유산을 전시하는 박물관이에요.","https://www.jp.go.kr/museum/sub02_01.do","증평민속체험박물관"),
  h("역사 장소","추성산성 · 연병호 항일역사공원","옛 산성과 독립운동의 역사를 알아볼 수 있어요.","https://water.jp.go.kr/tour/sub05_03.do","증평군 문화관광")
 ]},
"진천군":{
 nature:[
  n("산과 지형","두타산 · 만뢰산","진천에는 두타산과 만뢰산 등 산지가 있어요.","https://www.jincheon.go.kr/site/tour/sub.do?menukey=1613","진천군 관광 생태자연"),
  n("하천과 강","미호강 · 백곡천","진천에 있는 미호강과 백곡천의 흐름을 지도에서 찾아보세요."),
  n("호수와 저수지","초평호 · 백곡저수지","진천의 대표적인 인공 호수와 저수지예요.","https://www.jincheon.go.kr/site/tour/sub.do?menukey=1613","진천군 관광"),
  n("숲과 계곡","만뢰산 숲","만뢰산 주변 숲의 모습을 살펴보세요.")
 ],
 local:[
  h("문화유산·유물","진천 농다리 · 김유신 탄생지와 태실","오래된 돌다리와 신라 장군 김유신 관련 유적을 살펴봐요.","https://www.jincheon.go.kr/site/tour/sub.do?menukey=1617","진천군 관광"),
  h("박물관·전시관","진천종박물관","우리나라 종의 역사와 제작 기술을 살펴볼 수 있어요.","https://www.jincheon.go.kr/site/tour/sub.do?menukey=2153","진천군 관광"),
  h("역사 장소","길상사 · 이상설 생가","지역 인물의 삶과 역사를 알아보는 장소예요.","https://www.jincheon.go.kr/site/tour/sub.do?menukey=2994","진천군 관광"),
  h("미술관·예술","진천군립 생거판화미술관","판화 작품을 전시하고 감상할 수 있는 지역 미술관이에요.","https://www.jincheon.go.kr/site/tour/sub.do?menukey=2994","진천군 관광")
 ]},
"괴산군":{
 nature:[
  n("산과 지형","군자산 · 칠보산","괴산은 산지가 많고 바위와 숲이 어우러져 있어요."),
  n("하천과 강","달천 · 쌍천","달천과 쌍천 등 하천이 괴산 지역을 흘러요.","https://www.goesan.go.kr/DATA/bbs/190/35FD0045-AF08-2987-0478-1CFA933F48B3.pdf","괴산군 환경보전계획"),
  n("호수와 저수지","괴산호","괴산댐으로 만들어진 인공 호수예요.","https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=830","충북나드리 괴산호"),
  n("숲과 계곡","쌍곡계곡 · 산막이옛길","계곡과 괴산호를 따라 이어지는 숲길을 살펴보세요.","https://www.ecotour.go.kr/front/tour/choice/detail/12","환경부 생태관광")
 ],
 local:[
  h("문화유산·유물","홍범식 고가 · 우암 송시열 유적","옛집과 조선시대 학자의 흔적이 남아 있어요.","https://www.goesan.go.kr/tour/contents.do?key=2171","괴산군 문화관광"),
  h("박물관·전시관","괴산농업역사박물관","옛 농기구와 농사짓는 생활을 볼 수 있는 박물관이에요.","https://www.goesan.go.kr/tour/selectTourInfo.do?key=858&tourNo=775","괴산군 문화관광"),
  h("역사 장소","화양서원 · 김시민장군 충민사","조선시대 학문과 역사 인물을 기리는 장소를 알아봐요.","https://www.goesan.go.kr/tour/contents.do?key=2171","괴산군 문화관광")
 ]},
"음성군":{
 nature:[
  n("산과 지형","가섭산 · 부용산","음성의 산과 산자락에 있는 마을의 모습을 살펴보세요.","https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=1604","충북나드리"),
  n("하천과 강","응천 · 미호강","음성군 금왕읍에는 응천, 대소면 일대에는 미호강 수계가 있어요.","https://www.chungbuk.go.kr/here/contents.do?key=1897","충북 보건환경연구원 하천현황"),
  n("호수와 저수지","원남저수지","원남면의 인공 저수지예요. 물이 흐르는 하천과 구분해 봐요.","https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=1603","충북나드리"),
  n("숲과 계곡","봉학골 산림욕장","가섭산 자락의 숲길에서 여러 나무를 관찰해 보세요.","https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=56&pageIndex=140&pageUnit=12&searchCnd=all&searchMainSe=ATTR&tourNo=184","충북나드리")
 ],
 local:[
  h("문화유산·유물","감곡매괴성당 · 음성향교","옛 성당 건물과 전통 교육기관의 모습을 살펴봐요."),
  h("박물관·전시관","반기문평화기념관 · 철박물관","지역 인물의 활동과 철의 역사·문화를 소개하는 시설이에요. 관람 여부는 확인하세요.","https://edu.eumseong.go.kr/www/contents.do?key=114","음성군 평생교육기관 목록"),
  h("역사 장소","감곡매괴성당 · 무극전적국민관광지","지역의 근현대 역사를 알아볼 수 있는 장소예요.")
 ]},
"단양군":{
 nature:[
  n("산과 지형","소백산 · 도락산","단양은 산과 석회암 지형이 발달한 지역이에요."),
  n("하천과 강","남한강 · 단양천","남한강이 단양을 지나고 단양천이 합류해요.","https://encykorea.aks.ac.kr/Article/E0068786","한국학중앙연구원 도담삼봉"),
  n("바위와 강 경관","도담삼봉 · 석문","남한강에 솟아 있는 바위 봉우리와 자연 암석 지형을 살펴보세요.","https://encykorea.aks.ac.kr/Article/E0068786","한국민족문화대백과 도담삼봉"),
  n("숲과 계곡","소백산국립공원 숲","단양 일대의 산지에 있는 숲과 계곡을 살펴보세요.")
 ],
 local:[
  h("문화유산·유물","단양 적성비 · 온달산성","옛 비석과 산성을 통해 삼국시대 역사를 살펴봐요."),
  h("박물관·전시관","수양개선사유물전시관","옛 사람들이 사용한 도구와 선사시대 유물을 전시해요."),
  h("역사 장소","온달관광지 · 구인사","온달 이야기와 지역 종교·역사의 흔적을 알아볼 수 있어요.")
 ]}
};
/* 실제 행사의 '이름'은 지역 문화 기초정보이며, 개최 일시·프로그램은 매년 달라집니다.
 * 지역 축제와 예술·공연 축제를 별도 카드로 추가합니다. 공식 행사 소개 URL 우선.
 * 일부 비정기·격년 행사는 매년 열리는 것으로 표시하지 않습니다.
 * 정보 확인 기준: 2026-11-21 (현재 연도 개최 사실은 해당 연도 공식 안내로 확인).
 */
const festival=(kind,name,summary,href,source="시·군청 또는 행사 주최기관 공식자료",note="")=>({
 ...h(kind,name,summary,href,source),
 primaryLabel:"행사 소개 보기 ↗",
 event:true,
 newsTerm:name,
 ...(note?{note}:{}),
});
const FESTIVALS={
 "청주시":[
  festival("대표 축제","청원생명축제","청주의 농업과 농특산물을 알아보고 다양한 체험을 하는 축제예요.","https://www.cheongju.go.kr/news/webCtznNwsprList.do?ctznNwsprItemNo=1966&ctznNwsprNo=346&key=22512","청주시민신문 2026"),
  festival("예술·공연 축제","청주공예비엔날레","세계 여러 나라의 공예 작품을 보고 체험하는 국제 예술 행사예요.","https://www.cheongju.go.kr/news/webCtznNwsprList.do?ctznNwsprItemNo=1348&ctznNwsprNo=305&key=22512","청주시민신문 2025","격년 개최 · 다음 행사 연도 확인")
 ],
 "충주시":[
  festival("대표 축제","충주 다이브 페스티벌","음악·춤·공연을 즐기고 지역 문화를 만나는 축제예요.","https://tour.chungbuk.go.kr/www/selectBbsNttView.do?bbsNo=10&integrDeptCode=&key=80&nttNo=23292&pageIndex=1&searchCnd=all&searchCtgry=&searchKrwd=","충북나드리 2026 축제"),
  festival("예술·공연 축제","우륵문화제","가야금을 만든 것으로 전해지는 우륵의 음악 정신과 예술을 기리는 축제예요.","https://www.mcst.go.kr/site/s_culture/festival/festivalView.jsp?pRo=40&pSeq=11660","문화체육관광부 2026")
 ],
 "제천시":[
  festival("대표 축제","제천한방천연물산업박람회","제천의 약초와 한방·천연물 산업을 알아보고 체험하는 행사예요.","","제천한방천연물산업진흥재단 2026 자료"),
  festival("예술·공연 축제","제천국제음악영화제","음악을 주제로 한 영화와 공연을 만날 수 있는 예술 축제예요.","https://www.jimff.org/kor/artyboard/mboard.asp?Action=view&intSeq=5118&strBoardID=NNWR_1GN9","제천국제음악영화제 2026")
 ],
 "보은군":[
  festival("대표 축제","보은대추축제","지역 특산물 대추와 보은의 농산물을 살펴보는 축제예요.","https://www.boeunjujube.com/144","보은대추축제 공식 사이트 2026"),
  festival("예술·공연 축제","속리산 가을축제","속리산의 전통 민속놀이와 풍물공연, 영신행차 등을 만나는 행사예요.","https://www.festivalsongni.kr/content/30","속리산 가을축제 주최 측 2026")
 ],
 "옥천군":[
  festival("대표 축제","향수옥천 포도·복숭아축제","옥천의 포도·복숭아를 알리고 체험하는 농특산물 축제예요.","https://oc.go.kr/tour/contents.do?key=2733","옥천군 문화관광 2026"),
  festival("예술·공연 축제","지용제","옥천 출신 시인 정지용의 시와 문학을 즐기는 문화예술 축제예요.","https://www.oc.go.kr/tour/contents.do?key=2708","옥천군 문화관광 2026")
 ],
 "영동군":[
  festival("대표 축제","영동포도축제","영동의 포도를 직접 보고 농산물 가공 체험을 즐기는 축제예요.","https://www.yd21.go.kr/ydft/html/sub01/010101.html","영동군 문화관광재단 2026"),
  festival("예술·공연 축제","영동난계국악축제","국악인 난계 박연을 기리고 전통음악 공연을 즐기는 축제예요.","https://www.yd21.go.kr/ydft/html/sub01/010301.html","영동군 문화관광재단 2026")
 ],
 "증평군":[
  festival("대표 축제","증평인삼골축제","증평 특산물 인삼과 지역 먹거리·체험을 알리는 축제예요.","https://www.jp.go.kr/tour/prog/tursmCn/sub03_01/view.do?progNo=p00000006356hw4uR8as","증평군 문화관광 2026"),
  festival("예술·공연 축제","증평장뜰들노래축제","예전 농사일에 부르던 들노래와 전통 농경문화를 체험하는 축제예요.","https://www.jp.go.kr/tour/prog/tursmCn/sub03_02/view.do?progNo=p00000006370bi3vF1tv","증평군 문화관광 2026")
 ],
 "진천군":[
  festival("대표 축제","생거진천 농다리축제","오래된 돌다리 농다리를 중심으로 전통과 공연을 만나는 축제예요.","https://www.jincheon.go.kr/site/tour/sub.do?menukey=2832","진천군 관광 2026"),
  festival("예술·공연 축제","생거진천 문화축제","지역 전통놀이와 무용·합창·공연을 함께 즐기는 문화축제예요.","https://www.jincheon.go.kr/site/tour/sub.do?menukey=2831","진천군 관광 2026")
 ],
 "괴산군":[
  festival("대표 축제","괴산고추축제","괴산의 고추와 지역 농산물을 알리고 체험하는 축제예요.","https://www.goesan.go.kr/festival/contents.do?key=1267","괴산군 축제 소개 2026"),
  festival("예술·공연 축제","목도백중놀이","옛 나루터를 재현하고 농악·민속놀이·공연을 함께하는 전통 행사예요.","https://www.goesan.go.kr/festival/contents.do?key=992","괴산군 축제 소개 2026")
 ],
 "음성군":[
  festival("대표 축제","음성명작페스티벌","음성의 대표 농산물을 전시·체험하고 지역 공연을 즐기는 축제예요.","https://www.esmjf.com/home/sub.php?menukey=3101","음성명작페스티벌 공식 2026"),
  festival("예술·공연 축제","음성품바축제","품바 공연·길놀이·음악 공연을 통해 나눔과 예술을 만나는 축제예요.","https://www.pumba.kr/page25/festivalas/summary.php","음성품바축제 공식 2026")
 ],
 "단양군":[
  festival("대표 축제","단양 소백산철쭉제","소백산의 철쭉과 자연을 알리고 다양한 공연을 즐기는 봄 축제예요.","https://www.danyang.go.kr/sobaeksan/654","단양군 소백산철쭉제 2026"),
  festival("예술·공연 축제","온달문화축제","온달과 평강공주 이야기를 전통 공연·연극·체험으로 즐기는 축제예요.","https://www.danyang.go.kr/ondal/635","단양군 온달문화축제 2026")
 ]
};
for(const [region,events] of Object.entries(FESTIVALS)){
 const landmark=window.LOCALCHECK_REGIONAL_LANDMARKS[region];
 if(landmark?.local)landmark.local.push(...events);
}

/* 식물과 생태를 알아보는 장소: 2026-11-24 공개 기관 자료 기준. 조성 시설은 자연환경을 관찰하는 장소로 소개합니다. */
const NATURE_LEARNING=[
 [
  "청주시",
  "수목원",
  "미동산수목원",
  "다양한 나무와 야생화, 숲속 생물을 관찰할 수 있어요.",
  "https://midongsan.chungbuk.go.kr/midongsan/contents.do?key=42",
  "충청북도 미동산수목원"
 ],
 [
  "충주시",
  "자연휴양림",
  "계명산자연휴양림",
  "충주호 주변 산림과 숲의 모습을 알아봐요.",
  "https://www.foresttrip.go.kr/indvz/main.do?hmpgId=ID02030042",
  "산림청 숲나들e"
 ],
 [
  "제천시",
  "생태공원·숲길",
  "의림지 솔밭공원",
  "소나무가 모여 자라는 숲과 주변 자연을 관찰해요.",
  "https://tour.jecheon.go.kr/tour/base/contents/view?contentsNo=95&menuLevel=3&menuNo=258",
  "제천시 문화관광"
 ],
 [
  "보은군",
  "식물원",
  "속리산 자생식물원",
  "우리나라에서 자연적으로 자라는 식물을 살펴볼 수 있어요.",
  "https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=1487",
  "충북나드리"
 ],
 [
  "옥천군",
  "식물원·정원",
  "수생식물학습원",
  "물에서 자라는 식물과 대청호 주변의 자연을 알아봐요.",
  "https://www.chungbuk.go.kr/www/contents.do?key=5066",
  "충청북도 정원 안내"
 ],
 [
  "영동군",
  "식물원",
  "레인보우식물원",
  "열대과일과 여러 종류의 식물을 비교해 볼 수 있어요.",
  "https://www.yd21.go.kr/media/html/sub01/0101.html?mng_no=9328&mode=SV",
  "영동군 공식 미디어"
 ],
 [
  "증평군",
  "생태공원",
  "보강천 생태공원",
  "하천 주변의 나무와 녹지 공간을 살펴봐요.",
  "https://www.jp.go.kr/tour/prog/tursmCn/sub01_07/view.do?progNo=p00000006345ew0wJ2td",
  "증평군 문화관광"
 ],
 [
  "진천군",
  "생태공원·수목원",
  "만뢰산자연생태공원",
  "생태연못, 자생수목원, 곤충관찰원에서 다양한 생물을 알아봐요.",
  "https://www.jincheon.go.kr/site/tour/sub.do?menukey=1906",
  "진천군 문화관광"
 ],
 [
  "괴산군",
  "식물 자생지",
  "괴산 송덕리 미선나무 자생지",
  "우리나라 특산식물인 미선나무와 자연 보호의 중요성을 알아봐요.",
  "https://www.goesan.go.kr/tour/selectTourInfo.do?clgn=&key=887&tourNo=598",
  "괴산군 문화관광"
 ],
 [
  "음성군",
  "자연휴양림",
  "백야자연휴양림",
  "숲과 산림휴양시설을 살펴보며 자연환경을 알아봐요.",
  "https://baekya.foresttrip.go.kr/",
  "산림청 숲나들e"
 ],
 [
  "단양군",
  "자연생태 탐방",
  "다리안관광지",
  "소백산 주변 계곡과 숲의 모습을 살펴봐요.",
  "https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=644",
  "충북나드리"
 ]
];
for(const [region,title,value,summary,href,source] of NATURE_LEARNING){
 const list=window.LOCALCHECK_REGIONAL_LANDMARKS[region]?.nature;
 if(list)list.push({...n(title,value,summary,href,source),icon:"🌿",primaryLabel:"시설·자연 안내 ↗",newsTerm:value,placeLearning:true});
}

/* 지역별 생태·식물 관찰 장소: 공식 시설 명칭을 유지하고 같은 장소는 중복 추가하지 않음. */
const ECO_LEARNING_SITES=[
 [
  "청주시",
  "문암생태공원",
  "습지에 사는 식물과 나무를 관찰해요.",
  "https://cjyu.cheongju.go.kr/home/sub.do?code1=apply1&menukey=7104&mode=view&sn=103",
  "청주시 관광"
 ],
 [
  "충주시",
  "호암공원 생태전시관",
  "연못과 습지의 식물, 물가 생태계를 알아봐요.",
  "https://access.visitkorea.or.kr/ms/detail.do?cotId=bd3caa69-cbc5-47a4-8a14-0a6721e76fc9",
  "한국관광공사"
 ],
 [
  "제천시",
  "덕동생태숲",
  "숲의 식물과 연못을 관찰하며 생태환경을 알아봐요.",
  "https://tour.jecheon.go.kr/tour/base/tour/contents/view?clturCntntsNo=279",
  "제천시 문화관광"
 ],
 [
  "보은군",
  "솔향공원 식물원",
  "식물원과 소나무 전시를 통해 여러 식물을 알아봐요.",
  "https://access.visitkorea.or.kr/ms/detail.do?cotId=74669e49-e987-42ba-99b6-39c22d03d282",
  "한국관광공사 솔향공원"
 ],
 [
  "옥천군",
  "청성 별빛수목원",
  "여러 종류의 꽃과 나무를 비교해요. 방문 가능 여부는 미리 확인해요.",
  "https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=1322",
  "충북나드리"
 ],
 [
  "영동군",
  "과일나라테마공원",
  "과일나무의 종류와 자라는 모습을 알아봐요. 레인보우식물원도 이곳에 있어요.",
  "https://www.yd21.go.kr/fruit/html/introduction/0103.html",
  "영동군 과일나라테마공원"
 ],
 [
  "증평군",
  "삼기습지생태공원",
  "삼기저수지 주변 습지와 물가의 자연환경을 알아봐요.",
  "https://water.jp.go.kr/tour/sub01_09.do",
  "증평군 문화관광 도보여행 안내"
 ],
 [
  "진천군",
  "만뢰산자연생태공원",
  "자생수목원, 밀원식물원, 습생초지원과 생태연못에서 식물과 생물의 관계를 알아봐요.",
  "https://www.jincheon.go.kr/site/tour/sub.do?menukey=1906",
  "진천군 문화관광"
 ],
 [
  "괴산군",
  "성불산 생태숲학습관",
  "숲과 자연에 관한 전시와 교육 프로그램을 알아봐요.",
  "https://www.goesan.go.kr/www/selectBbsNttView.do?bbsNo=213&integrDeptCode=&key=136&nttNo=128500&pageIndex=76&pageUnit=9&searchCnd=all&searchCtgry=&searchKrwd=",
  "괴산군청 운영 안내"
 ],
 [
  "음성군",
  "봉학골 정원",
  "야생화정원과 습지원 등 여러 주제의 정원을 알아봐요. 실내 목조식물원은 조성 계획 단계예요.",
  "https://www.yna.co.kr/view/AKR20260709082300064",
  "연합뉴스 2026.7.9 음성군 발표"
 ],
 [
  "단양군",
  "가대 생태습지",
  "습지의 식물과 물을 깨끗하게 하는 습지의 역할을 알아봐요.",
  "https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&pageIndex=7&pageUnit=12&searchAreaSe=11&searchCnd=all&searchMainSe=ATTR&tourNo=679",
  "충북나드리"
 ]
];
for(const [region,value,summary,href,source] of ECO_LEARNING_SITES){
 const list=window.LOCALCHECK_REGIONAL_LANDMARKS[region]?.nature;
 if(!list)continue;
 const card={...n("생태·식물 관찰",value,summary,href,source),icon:"🌱",primaryLabel:"시설 안내 ↗",newsTerm:value,placeLearning:true};
 const old=list.findIndex(x=>x.value===value);
 if(old>=0)list[old]={...list[old],...card};else list.push(card);
}

/* 지역 대표 공원: 자연을 관찰하고 주민의 여가 공간을 알아보는 조성 시설. */
const REGIONAL_PARKS=[
 [
  "청주시",
  "오창호수공원",
  "호수 주변을 걸으며 물과 나무가 어우러진 모습을 살펴봐요.",
  "https://cjyu.cheongju.go.kr/home/sub.do?code1=apply1&menukey=7104&mode=view&sn=773",
  "청주시 문화관광"
 ],
 [
  "청주시",
  "오송호수공원",
  "물가의 경관과 산책로를 살펴봐요.",
  "https://access.visitkorea.or.kr/ms/detail.do?cotId=b1136625-007e-4c71-b9c0-5b8800c41e66",
  "한국관광공사"
 ],
 [
  "충주시",
  "탄금공원",
  "남한강 주변의 산책로와 주민들의 여가 공간을 알아봐요.",
  "https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=a79606eb-a52c-4f7e-b2c3-b79df3ac982d",
  "한국관광공사"
 ],
 [
  "제천시",
  "의림지 수리공원",
  "저수지 주변의 농경문화와 물을 이용하는 모습을 살펴봐요.",
  "https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=2599",
  "충북나드리"
 ],
 [
  "보은군",
  "뱃들공원",
  "보청천 주변에 조성된 주민들의 휴식 공간을 살펴봐요.",
  "https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=306",
  "충북나드리"
 ],
 [
  "옥천군",
  "옥천선사공원",
  "향수호수길 입구의 공원에서 자연과 역사 자료를 함께 살펴봐요.",
  "https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=fecc9eba-3635-4be5-85a0-4b26247757d9",
  "한국관광공사"
 ],
 [
  "영동군",
  "용두공원",
  "야생화와 나무, 주민들의 여가 시설을 살펴봐요.",
  "https://www.yd21.go.kr/tour/html/sub02/020604.html",
  "영동군 문화관광"
 ],
 [
  "증평군",
  "한울공원",
  "주민들이 쉬고 어린이들이 놀이하는 녹색 공간을 알아봐요.",
  "https://new.jp.go.kr/kor/sub05_07_14_01.do",
  "증평군 근린공원 현황"
 ],
 [
  "진천군",
  "화랑공원",
  "주민들이 산책하고 운동하는 공원의 역할을 알아봐요.",
  "https://www.jincheon.go.kr/site/tour/sub.do?menukey=1908",
  "진천군 문화관광"
 ],
 [
  "진천군",
  "한반도지형 전망공원",
  "초평호와 산이 이루는 한반도 모양의 경관을 관찰해요.",
  "https://www.jincheon.go.kr/site/tour/sub.do?menukey=1613&mode=view&no=4510873",
  "진천군 문화관광"
 ],
 [
  "괴산군",
  "청천수변공원",
  "강 주변의 자연과 주민들의 여가 공간을 살펴봐요.",
  "https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=abca374d-adc9-4c8d-862b-c6c17573dd23",
  "한국관광공사"
 ],
 [
  "음성군",
  "설성공원",
  "연못과 정자, 주민들의 휴식 시설을 살펴봐요.",
  "https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=113",
  "충북나드리"
 ],
 [
  "단양군",
  "소금정공원",
  "남한강 주변 장미길과 공원의 경관을 살펴봐요.",
  "https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=9f90295b-eede-48b7-99b3-c0a6eb436277",
  "한국관광공사"
 ]
];
for(const [region,value,summary,href,source] of REGIONAL_PARKS){
 const list=window.LOCALCHECK_REGIONAL_LANDMARKS[region]?.nature;
 if(list&&!list.some(x=>x.value===value))list.push({...n("대표 공원",value,summary,href,source),icon:"🌳",primaryLabel:"공원 안내 ↗",newsTerm:value,placeLearning:true});
}
})();