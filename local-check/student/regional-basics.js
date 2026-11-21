(() => {
"use strict";
/* 지역별 공개자료의 기초정보. 현재 자료가 확인된 항목만 사실로 표기합니다.
 * 이 파일은 자동 갱신되지 않습니다. 방문/행사 시각 등 실시간 정보는 뉴스 찾기에서 다룹니다.
 */
const GOV_STATS="https://www.chungbuk.go.kr/stat/contents.do?key=1404";
const POP="https://jumin.mois.go.kr/";
const CLIMATE="https://data.kma.go.kr/climate/average30Years/selectAverage30YearsList.do";
const WATER="https://www.data.go.kr/data/3039746/fileData.do";
const ECO="https://www.nie-ecobank.kr/";
const TOUR="https://tour.chungbuk.go.kr/";
const REGION_SITES={
 "청주시":"https://www.cheongju.go.kr/",
 "충주시":"https://www.chungju.go.kr/",
 "제천시":"https://www.jecheon.go.kr/",
 "보은군":"https://www.boeun.go.kr/",
 "옥천군":"https://www.oc.go.kr/",
 "영동군":"https://www.yd21.go.kr/",
 "증평군":"https://www.jp.go.kr/",
 "진천군":"https://www.jincheon.go.kr/",
 "괴산군":"https://www.goesan.go.kr/",
 "음성군":"https://www.eumseong.go.kr/",
 "단양군":"https://www.danyang.go.kr/"
};
const spot=(title,summary,source,href)=>({title,summary,source,href});
const NATURE={
 "청주시":spot("미동산수목원","청주시 미원면의 공립수목원에서 여러 식물을 관찰할 수 있어요.","충북나드리","https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=388"),
 "충주시":spot("충주호","충주 지역의 호수와 산지 경관을 살펴볼 수 있어요.","충북나드리",TOUR),
 "제천시":spot("의림지","제천의 대표적인 저수지 주변 자연환경을 살펴보세요.","충북나드리",TOUR),
 "보은군":spot("속리산","보은 지역의 산과 숲을 살펴볼 수 있어요.","충북나드리",TOUR),
 "옥천군":spot("대청호","옥천 지역의 호수 주변 자연환경을 살펴볼 수 있어요.","충북나드리",TOUR),
 "영동군":spot("민주지산","영동군에서 산과 계곡을 관찰할 수 있는 산이에요.","충북나드리","https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=1074"),
 "증평군":spot("좌구산 자연휴양림","좌구산 자락에 숲을 걸을 수 있는 자연휴양림이 있어요.","증평군 문화관광","https://www.jp.go.kr/tour/prog/tursmCn/sub01_03_02/view.do?progNo=p00000001487qw6wG9qk"),
 "진천군":spot("초평호","진천군 초평면에 있는 호수예요. 주변 숲과 물의 모습을 비교해 보세요.","진천군 관광","https://www.jincheon.go.kr/site/tour/sub.do?menukey=4171"),
 "괴산군":spot("괴산호와 산막이옛길","괴산호 주변 산길에서 호수와 산이 어우러진 모습을 볼 수 있어요.","충북나드리","https://tour.chungbuk.go.kr/www/contents.do?key=201"),
 "음성군":spot("가섭산","음성읍 일대에 있는 산이에요. 산 아래 봉학골 숲길도 살펴보세요.","충북나드리","https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=1604"),
 "단양군":spot("도담삼봉과 남한강","남한강에 솟아 있는 바위 봉우리와 강 주변의 모습을 살펴볼 수 있어요.","충북나드리",TOUR)
};
// 각 지역의 공식 세부 페이지. 주소가 없는 임의의 경로는 만들지 않습니다.
const FACILITY_PAGES={
 "청주시":{
  office:["시청 부서 안내","https://www.cheongju.go.kr/jiksok/index.do","청주시 직속부서"],
  safety:["119안전센터 안내","https://cb119.chungbuk.go.kr/db119/sub.do?menukey=2133","청주동부소방서 안전센터","https://cb119.chungbuk.go.kr/sb119/sub.do?menukey=2217"],
  library:["청주기적의도서관","https://library.cheongju.go.kr/lib-ml/index.do","청주기적의도서관"],
  transit:["청주시 버스정보","https://www.cjbus.co.kr/home/sub.php?menukey=3205","청주시 시내버스 준공영제 관리위원회"]
 },
 "충주시":{
  office:["대소원면 행정복지센터","https://www.chungju.go.kr/town/contents.do?key=1456","충주시 대소원면 안내"],
  safety:["119안전센터 안내","https://cb119.chungbuk.go.kr/cj119/sub.do?menukey=1955","충주소방서 안전센터"],
  library:["충주시립도서관","https://www.chungju.go.kr/lib/web/index.do","충주시립도서관"],
  transit:["버스노선·시간표","https://its.chungju.go.kr/bis/","충주시 교통정보센터"]
 },
 "제천시":{
  office:["시청·복지시설 안내","https://www.jecheon.go.kr/bokjidadam/www/index.do","제천시 복지다담"],
  safety:["119안전센터 안내","https://cb119.chungbuk.go.kr/jc119/sub.do?menukey=2300","제천소방서 안전센터"],
  library:["제천시립도서관","https://www.jecheon.go.kr/jclib/index.do","제천시립도서관"],
  transit:["버스 운행시간표","https://its.jecheon.go.kr/bis/time-table.do","제천시 교통정보센터"]
 },
 "보은군":{
  office:["보은읍 행정복지센터","https://www.boeun.go.kr/www/contents.do?key=1029","보은군 읍면 안내"],
  safety:["119안전센터 안내","https://cb119.chungbuk.go.kr/be119/sub.do?menukey=2817","보은소방서 안전센터"],
  library:["보은군립도서관","https://lib.boeun.go.kr/front/","보은군립도서관"],
  transit:["농어촌버스 운행표","https://www.data.go.kr/data/15053571/fileData.do","공공데이터포털(보은군 제공)"]
 },
 "옥천군":{
  office:["읍면 행정복지센터","https://www.oc.go.kr/www/contents.do?key=636","옥천군 읍면소개"],
  safety:["119안전센터 관할","https://cb119.chungbuk.go.kr/oc119/sub.do?menukey=2637","옥천소방서 관할현황"],
  library:["옥천군민도서관","https://tour.chungbuk.go.kr/www/contents.do?key=271","충북나드리 도서관 소개"],
  transit:["버스 시간표","https://www.oc.go.kr/tour/contents.do?key=2595","옥천군 문화관광 버스안내"]
 },
 "영동군":{
  office:["읍면 행정복지센터","https://www.yd21.go.kr/site/kr/html/sub06/06.html","영동군 읍면별 안내"],
  safety:["119안전센터 안내","https://cb119.chungbuk.go.kr/yd119/sub.do?menukey=2384","영동소방서 안전센터"],
  library:["영동 교육·도서관","https://www.yd21.go.kr/kr/html/sub04/040805.html?category2=6","영동군 교육기관 목록"],
  transit:["농어촌버스 시간표","https://www.yd21.go.kr/kr/html/sub05/05070102.html","영동군 오지마을버스 시간표"]
 },
 "증평군":{
  office:["읍면 담당 부서","https://www.jp.go.kr/kor/prog/deptPerson/sub04_04_02/deptList.do","증평군 직원·부서 안내"],
  safety:["119안전센터 안내","https://cb119.chungbuk.go.kr/jp119/sub.do?menukey=2468","증평소방서 안전센터"],
  library:["증평군 도서관 목록","https://new.jp.go.kr/kor/sub04_05_04.do","증평군 관내 도서관"],
  transit:["시내버스 시간표","https://www.jp.go.kr/kor/prog/pbtrnspInfo/sub05_05_01/TM01/list.do","증평군 교통정보"]
 },
 "진천군":{
  office:["행정복지센터 위치","https://www.jincheon.go.kr/home/sub.do?menukey=4019","진천군 민원발급 안내"],
  safety:["119안전센터 안내","https://cb119.chungbuk.go.kr/jcfire119/sub.do?menukey=2552","진천소방서 안전센터"],
  library:["교육·문화시설 안내","https://www.jincheon.go.kr/site/edu/main.do","진천군 교육·문화 페이지"],
  transit:["농어촌버스 시간표","https://www.jincheon.go.kr/site/tour/sub.do?menukey=1622","진천군 관광 교통안내"]
 },
 "괴산군":{
  office:["민원 창구 안내","https://www.goesan.go.kr/www/contents.do?key=101","괴산군 신속민원과"],
  safety:["119안전센터 안내","https://cb119.chungbuk.go.kr/gs119/sub.do?menukey=2721","괴산소방서 안전센터"],
  library:["괴산군립도서관","https://lib.goesan.go.kr/front/","괴산군립도서관"],
  transit:["농어촌버스 시간표","https://www.goesan.go.kr/trenv/contents.do?key=397","괴산군 교통환경 안내"]
 },
 "단양군":{
  office:["단양읍 행정복지센터","https://www.danyang.go.kr/town/271","단양군 통합읍면 안내"],
  safety:["119안전센터 안내","https://cb119.chungbuk.go.kr/dy119/sub.do?menukey=2042","단양소방서 안전센터"],
  library:["단양군립올누림도서관","https://www.danyang.go.kr/lib/front/index.php?g_page=intro&m_page=intro01","단양군립도서관"],
  transit:["농촌버스 시간표","https://www.danyang.go.kr/tour/1919","단양군 관광 교통정보"]
 }
};
const EUMSEONG={
 overview:[
  {icon:"📍",title:"위치",value:"충청북도 음성군",summary:"충청북도에 있는 군이에요.",source:"충청북도 시군현황",href:GOV_STATS},
  {icon:"🗺️",title:"행정구역",value:"3읍 · 6면",summary:"2026년 3월 대소읍 개청으로 3읍 6면이 되었어요. (기준: 2026년 3월)",source:"음성군 행정구역 변경 보도 / 음성군청",href:"https://www.eumseong.go.kr/"},
  {icon:"👥",title:"인구",value:"주민등록 인구 기준",summary:"인구는 매달 달라져요. 공식 통계의 기준월을 확인하세요. 다른 집계 방식과 섞지 않아요.",source:"행정안전부 주민등록 인구통계",href:POP},
  {icon:"📐",title:"면적",value:"군 전체 면적",summary:"시·군별 면적은 충청북도 통계표의 같은 연도 자료를 비교하세요.",source:"충청북도 통계정보",href:GOV_STATS}
 ],
 nature:[
  {icon:"⛰️",title:"산과 지형",value:"가섭산 · 부용산",summary:"음성읍 일대의 산지입니다. 산이 이어진 모습과 골짜기를 살펴보세요.",source:"충북나드리 가섭산·부용산",href:"https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=1604"},
  {icon:"💧",title:"하천과 저수지",value:"응천 · 원남저수지",summary:"응천은 흐르는 하천이고 원남저수지는 물을 저장하는 인공 저수지예요.",source:"공공데이터포털 음성군 하천현황",href:WATER,more:[{label:"원남저수지 공식 관광자료",href:"https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=1603"}]},
  {icon:"🌤️",title:"날씨와 기후",value:"기온 · 강수량",summary:"오늘 날씨가 아니라 오랜 기간의 평균값을 살펴봐요. 기상관측 지점과 평년기간을 꼭 확인해요.",source:"기상청 기후평년값(1991~2020)",href:CLIMATE},
  {icon:"🌲",title:"숲과 생태",value:"봉학골 산림욕장",summary:"가섭산 자락에 숲길과 자연학습 공간이 있어요. 주변 생태환경을 살펴보세요.",source:"충북나드리 봉학골 산림욕장",href:"https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=56&pageIndex=140&pageUnit=12&searchCnd=all&searchMainSe=ATTR&tourNo=184",more:[{label:"국립생태원 생태 정보",href:ECO}]}
 ],
 facilities:[
  {icon:"🏛️",title:"공공기관",value:"음성군청 · 행정복지센터",summary:"주민을 위해 행정 업무를 하는 기관이에요.",source:"음성군청 공식 홈페이지",href:REGION_SITES["음성군"]},
  {icon:"🚒",title:"안전시설",value:"119안전센터 · 보건소",summary:"음성소방서의 119안전센터 위치·담당 업무와 음성군보건소를 각각 살펴보세요.",source:"음성소방서 119안전센터 현황",primaryLabel:"119안전센터 목록 ↗",href:"https://cb119.chungbuk.go.kr/us119/sub.do?menukey=1867",more:[
   {label:"음성군보건소 ↗",href:"https://www.eumseong.go.kr/health/index.do"}
  ]},
  {icon:"📚",title:"교육·문화시설",value:"도서관 · 문화예술회관",summary:"지역별 도서관과 평생교육기관, 문화예술회관의 위치와 시설을 찾아보세요.",source:"음성군 평생교육기관 목록",primaryLabel:"교육기관 목록 ↗",href:"https://edu.eumseong.go.kr/www/contents.do?key=114",more:[
   {label:"음성문화예술회관 시설 ↗",href:"https://www.esart.go.kr/www/contents.do?key=32"},
   {label:"음성군립도서관 ↗",href:"https://lib.eumseong.go.kr/"}
  ]},
  {icon:"🚌",title:"교통",value:"농어촌버스 · 정류소",summary:"버스 노선·시간표와 정류소 위치를 따로 확인해 보세요. 운행시간은 변경될 수 있으므로 게시일을 확인해요.",source:"음성군청 버스시간표 게시판",primaryLabel:"버스시간표 보기 ↗",href:"https://www.eumseong.go.kr/www/selectBbsNttList.do?bbsNo=32&key=216",more:[
   {label:"버스정류소 공공데이터(2026) ↗",href:"https://www.data.go.kr/data/15116426/fileData.do"}
  ]}
 ],
 issues:[
  {icon:"💦",title:"하천 환경",value:"응천 수질 개선",summary:"환경부는 2024년에 응천을 오염하천 집중관리 대상으로 선정했어요. 사업의 현재 성과는 새로운 자료와 비교하세요.",source:"환경부 2024년 보도자료",href:"https://me.go.kr/home/web/board/read.do?boardId=1665320&boardMasterId=1"},
  {icon:"♻️",title:"환경과 쓰레기",value:"분리배출 · 자원순환",summary:"우리 지역에서 사용하는 분리배출 기준을 군청 안내에서 확인하세요.",source:"음성군청 생활정보",href:REGION_SITES["음성군"]},
  {icon:"🚸",title:"지역 안전",value:"도로 안전 · 재난 대비",summary:"학교 주변과 마을의 안전시설을 지도에서 살펴보세요.",source:"음성군청 안전 안내",href:REGION_SITES["음성군"]},
  {icon:"🗳️",title:"주민 참여",value:"지역문제에 의견 내기",summary:"주민은 불편한 점을 알리고 지역문제 해결에 참여할 수 있어요.",source:"국민신문고",href:"https://www.epeople.go.kr/"}
 ]
};
const REGION_SPECIALTIES={
 "청주시":"청원생명쌀 · 딸기",
 "충주시":"사과 · 복숭아",
 "제천시":"황기 · 약초",
 "보은군":"대추 · 사과",
 "옥천군":"포도 · 복숭아",
 "영동군":"포도 · 곶감",
 "증평군":"인삼",
 "진천군":"생거진천쌀",
 "괴산군":"고추 · 대학찰옥수수",
 "음성군":"복숭아 · 수박",
 "단양군":"마늘"
};
// 대표 농산물 이름은 공개된 충북교육청 지역특산물 교육자료 및 충청북도 지역 상품 자료를 참조합니다.
const asCard=(icon,title,value,summary,source,href,more)=>({icon,title,value,summary,source,href,more});

/* 기본 정보 카드에 직접 표시할 수치.
 * 인구: 행정안전부 주민등록 인구통계, 2026-10-31, 외국인 제외(시·군 단위).
 * 면적: 충청북도 2025년 말 지적통계, 초등 학습용 반올림(㎢).
 * 행정구역: 시·군 공식 현황, 음성군 대소읍(2026년 3월 승격) 반영.
 * 자동 갱신 자료가 아니므로 값 옆에 기준 시점을 표시합니다.
 */
const BASIC_REGION_FACTS={
 "청주시":{position:"충북 서부",admin:"3읍 · 10면 · 30동",note:"상당구·서원구·흥덕구·청원구 4개 구",population:861711,area:941},
 "충주시":{position:"충북 북부",admin:"1읍 · 12면 · 12동",note:"도시의 동 지역과 농촌의 읍·면 지역",population:205369,area:983},
 "제천시":{position:"충북 북동부",admin:"1읍 · 7면 · 9동",note:"제천읍과 주변 면·동 지역",population:127751,area:883},
 "보은군":{position:"충북 남부",admin:"1읍 · 10면",note:"보은읍과 10개 면",population:31594,area:584},
 "옥천군":{position:"충북 남부",admin:"1읍 · 8면",note:"옥천읍과 8개 면",population:50812,area:537},
 "영동군":{position:"충북 남단",admin:"1읍 · 10면",note:"영동읍과 10개 면",population:43043,area:847},
 "증평군":{position:"충북 중부",admin:"1읍 · 1면",note:"증평읍과 도안면",population:36780,area:82},
 "진천군":{position:"충북 북서부",admin:"2읍 · 5면",note:"진천읍·덕산읍과 5개 면",population:85608,area:407},
 "괴산군":{position:"충북 동부",admin:"1읍 · 10면",note:"괴산읍과 10개 면",population:36959,area:842},
 "음성군":{position:"충북 북서부",admin:"3읍 · 6면",note:"대소읍 승격 반영(2026년 3월)",population:96297,area:520},
 "단양군":{position:"충북 북동부",admin:"2읍 · 6면",note:"단양읍·매포읍과 6개 면",population:26458,area:780}
};
function overviewCards(region){
 const info=BASIC_REGION_FACTS[region];if(!info)return [];
 const fmt=n=>Number(n).toLocaleString("ko-KR");
 return [
  {...asCard("📍","위치",info.position,"충청북도 "+region+"의 위치예요.","충청북도 시·군 행정구역 지도","https://www.chungbuk.go.kr/www/contents.do?key=450"),primaryLabel:"지도·위치 자료 ↗"},
  {...asCard("🗺️","행정구역",info.admin,info.note,"충청북도 시군현황 · 2026년 3월 이후 변경 반영",GOV_STATS),primaryLabel:"행정구역 자료 ↗"},
  {...asCard("👥","인구",fmt(info.population)+"명","2026년 10월 말 · 외국인 제외","행정안전부 주민등록 인구통계 · 2026.10","https://jumin.mois.go.kr/statMonth.do"),primaryLabel:"인구통계 보기 ↗"},
  {...asCard("📐","면적","약 "+fmt(info.area)+"㎢","2025년 말 지적통계 · ㎢ 단위 반올림","충청북도 지적통계 · 2025년 말","https://www.data.go.kr/data/3075683/fileData.do"),primaryLabel:"면적 통계 보기 ↗"}
 ];
}

function rawCards(region,category,companies=[],facts=[]){
 if(category==="overview")return overviewCards(region);
 const fixed=window.LOCALCHECK_REGIONAL_LANDMARKS?.[region]?.[category];
 if((category==="nature"||category==="local")&&Array.isArray(fixed))return fixed.map(x=>({...x}));
 if(region==="음성군"&&EUMSEONG[category])return EUMSEONG[category].map(x=>({...x}));
 const spot=NATURE[region];
 if(category==="overview")return [
  asCard("📍","위치","충청북도 "+region,"충청북도에 있는 "+(region.endsWith("시")?"시":"군")+"이에요.","충청북도 시군현황",GOV_STATS),
  asCard("🗺️","행정구역","읍·면·동","해당 지역의 행정구역은 공식 안내에서 확인하세요.","시·군청",REGION_SITES[region]),
  asCard("👥","인구","주민등록 인구","월별 공식 통계의 기준일과 집계 대상을 확인하세요.","행정안전부",POP),
  asCard("📐","면적","시·군 전체 면적","같은 연도의 시·군 통계표를 비교해 보세요.","충청북도 통계",GOV_STATS)
 ];
 if(category==="nature")return [
  asCard("⛰️","대표 자연환경",spot.title,spot.summary,spot.source,spot.href),
  asCard("💧","하천과 물","지역의 강 · 하천 · 저수지","우리 지역의 물길과 호수를 공공 지도에서 살펴보세요.","충청북도 관광정보",TOUR),
  asCard("🌤️","날씨와 기후","기온 · 강수량","기후평년값은 오랜 기간 관측한 평균이에요. 관측 지점을 확인하세요.","기상청 기후평년값",CLIMATE),
  asCard("🌳","숲과 생태","숲 · 생물 · 자연환경","지역의 식생과 생태 분포를 공식 생태정보에서 살펴보세요.","국립생태원 EcoBank",ECO)
 ];
 if(category==="facilities"){
  const places=FACILITY_PAGES[region];
  if(!places)return [];
  const [office,safety,library,transit]=["office","safety","library","transit"].map(k=>places[k]);
  const link=(entry)=>({href:entry[1],source:entry[2],primaryLabel:entry[0]+" ↗"});
  return [
   {...asCard("🏛️","행정기관",office[0],"이 지역의 행정기관과 민원 담당 시설을 알아보세요.",office[2],office[1]),primaryLabel:office[0]+" ↗"},
   {...asCard("🚒","안전시설","119안전센터","관할 소방서의 안전센터 위치와 역할을 살펴보세요.",safety[2],safety[1]),primaryLabel:safety[0]+" ↗",more:safety[3]?[{label:"다른 소방서 안전센터 ↗",href:safety[3]}]:[]},
   {...asCard("📚","교육·문화시설","도서관 · 문화시설","지역 도서관과 교육·문화시설을 찾아보세요.",library[2],library[1]),primaryLabel:library[0]+" ↗"},
   {...asCard("🚌","교통","버스 노선 · 시간표","노선과 시간표는 변경될 수 있어요. 이용하기 전에 공식 안내의 게시일을 확인하세요.",transit[2],transit[1]),primaryLabel:transit[0]+" ↗"}
  ];
 }
 if(category==="business"){
  const hits=companies.filter(x=>x.region===region).slice(0,6).map(x=>asCard(x.emoji||"🏭","지역 기업",x.name,x.produces||x.summary||"지역 사업장",x.source?.title||"기업 공개자료",x.source?.url||REGION_SITES[region]));
  return [...hits,asCard("🌾","농산물과 특산물",REGION_SPECIALTIES[region]||"지역 농산물","이 지역에서 생산하는 대표 농산물을 살펴보세요.","충북 지역 농특산물 자료",REGION_SITES[region])];
 }
 if(category==="local"){
  const hits=facts.filter(x=>x.region===region&&["축제·행사","역사·문화","자연·관광"].includes(x.category)).slice(0,3).map(x=>asCard(x.icon||"🏛️","지역 문화",x.topic,x.hook||"지역 문화 소개",x.sources?.[0]?.name||"지역 공식자료",x.sources?.[0]?.url||TOUR));
  return [...hits,asCard("🏛️","문화유산","지역 문화유산","오래전부터 전해 온 지역의 역사와 문화를 확인해요.","국가유산청 국가유산포털","https://www.heritage.go.kr/")];
 }
 if(category==="issues")return [
  asCard("💦","물과 환경","하천·수질 관리","하천의 환경자료를 살펴보고, 뉴스에서는 새 정책을 비교해 보세요.","물환경정보시스템","https://water.nier.go.kr/"),
  asCard("♻️","생활환경","쓰레기 · 자원순환","우리 지역의 생활환경 정보를 시·군청에서 확인해요.","지역 공식 홈페이지",REGION_SITES[region]),
  asCard("🚸","지역 안전","교통 · 재난 대비","주민을 안전하게 지키는 시설과 제도를 찾아봐요.","지역 공식 홈페이지",REGION_SITES[region]),
  asCard("🗳️","주민 참여","의견과 제안","불편한 점을 알리고 지역을 개선하는 참여 방법을 알아봐요.","국민신문고","https://www.epeople.go.kr/")
 ];
 return [];
}

/* 원문이 특정 주제의 세부 페이지가 아니면, 검색어가 입력된 구글 검색을 제공합니다.
 * 검색 결과 자체는 검증된 자료가 아니므로 원문의 기관명, 게시일과 통계 기준일을 확인하세요.
 */
const KNOWN_NATURE={
 "충주시":"https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=594",
 "제천시":"https://tour.jecheon.go.kr/tour/base/tour/contents/view?clturCntntsNo=1117&menuLevel=3&menuNo=67",
 "옥천군":"https://www.ecotour.go.kr/front/tour/choice/detail/121",
 "괴산군":"https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&searchMainSe=ATTR&tourNo=1494",
 "단양군":"https://tour.chungbuk.go.kr/www/selectTourCntnts.do?key=60&pageIndex=1&pageUnit=12&searchAreaSe=11&searchCnd=all&searchMainSe=ATTR&tourNo=2717"
};
function cardSearch(region,category,c,extra=""){
 let phrase=[region,c.title,c.value,extra].filter(Boolean).join(" ").replace(/·/g," ");
 if(category==="overview"&&/인구/.test(c.title))phrase=region+" 주민등록 인구 기준월 통계";
 if(category==="overview"&&/면적/.test(c.title))phrase=region+" 행정구역 면적 통계";
 if(category==="overview"&&/행정구역/.test(c.title))phrase=region+" 읍면동 행정구역 현황";
 if(category==="nature"&&/기후|날씨/.test(c.title))phrase=region+" 기온 강수량 기후평년값";
 if(category==="nature"&&/생태/.test(c.title))phrase=region+" 산림 생태 숲";
 if(category==="business"&&/농산물|특산물/.test(c.title))phrase=region+" "+c.value+" 농산물 특산물 농업기술센터";
 if(category==="local"&&/문화유산/.test(c.title))phrase=region+" 문화유산 국가유산청";
 if(category==="issues"&&/쓰레기|생활환경/.test(c.title))phrase=region+" 생활쓰레기 재활용 분리배출";
 if(category==="issues"&&/지역 안전/.test(c.title))phrase=region+" 교통안전 재난안전";
 if(category==="issues"&&/주민 참여/.test(c.title))phrase=region+" 주민제안 주민참여예산";
 if(category==="issues"&&/물과 환경/.test(c.title))phrase=region+" 하천 수질 환경보전";
 const site=category==="overview"?"site:chungbuk.go.kr OR site:mois.go.kr":
 category==="local"?"site:go.kr OR site:heritage.go.kr":"site:go.kr OR site:or.kr";
 return phrase+" ("+site+")";
}
function googleSearch(q){
 const u=new URL("https://www.google.com/search");u.searchParams.set("q",q);return u.href;
}
function isGeneric(href){
 if(!href)return true;
 let u;try{u=new URL(href);}catch{return true;}
 if(!["http:","https:"].includes(u.protocol))return true;
 if(u.hostname==="www.google.com"&&u.pathname==="/search")return false;
 const p=u.pathname.replace(/\/+$/,"");
 if(!p||["/index.do","/index.html","/index.php","/front","/front/index.do","/www/index.do","/site/edu/main.do","/lib/web/index.do","/lib-ml/index.do","/stat/index.do","/tour/index.do"].includes(p))return true;
 return [POP,ECO,TOUR,CLIMATE].includes(href)||href==="https://www.heritage.go.kr/"||href==="https://www.epeople.go.kr/";
}
function cards(region,category,companies=[],facts=[]){
 return rawCards(region,category,companies,facts).map((item,i)=>{
  const c={...item,more:Array.isArray(item.more)?item.more.map(v=>({...v})):[]};
  if(category==="nature"&&i===0&&!window.LOCALCHECK_REGIONAL_LANDMARKS?.[region]?.nature&&KNOWN_NATURE[region]&&region!=="음성군"){
    c.href=KNOWN_NATURE[region];
    c.primaryLabel="자연환경 상세자료 ↗";
    c.source=region==="제천시"?"제천시 문화관광":region==="옥천군"?"환경부 생태관광":"충북나드리";
  }
  c.searchQuery=cardSearch(region,category,c);
  c.searchHref=googleSearch(c.searchQuery);
  c.more=c.more.map(v=>isGeneric(v.href)?{label:(v.label||"관련 자료")+" · 구글 검색 ↗",href:googleSearch(cardSearch(region,category,c,v.label))}:v);
  if(isGeneric(c.href)){
   c.href=c.searchHref;
   c.primaryLabel="🔎 구글에서 검색 ↗";
   c.source="구글 검색 · 기관·날짜 직접 확인";
   c.linkType="search";
  }else{
   c.linkType="direct";
   c.primaryLabel=c.primaryLabel||"상세자료 확인 ↗";
   if(!c.more.some(v=>v.href===c.searchHref))c.more.push({label:"링크가 안 열리면 구글 검색 ↗",href:c.searchHref});
  }
  return c;
 });
}

window.LocalCheckRegionalBasics={cards,REGION_SITES};
})();