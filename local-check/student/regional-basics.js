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
const asCard=(icon,title,value,summary,source,href,more)=>({icon,title,value,summary,source,href,more});
function cards(region,category,companies=[],facts=[]){
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
 if(category==="facilities")return [
  asCard("🏛️","행정기관",region+(region.endsWith("시")?"청":"청"),"시청·군청과 읍면동 행정복지센터는 주민의 일을 도와요.","지역 공식 홈페이지",REGION_SITES[region]),
  asCard("🚒","안전과 건강","소방 · 보건기관","사람의 안전과 건강을 지키는 시설이에요.","지역 공식 홈페이지",REGION_SITES[region]),
  asCard("📚","교육·문화","학교 · 도서관","학생과 주민이 배우거나 문화 활동을 하는 시설이에요.","지역 공식 홈페이지",REGION_SITES[region]),
  asCard("🚌","교통","도로 · 버스","지역 안팎을 연결하는 교통 시설과 교통수단을 살펴보세요.","지역 공식 홈페이지",REGION_SITES[region])
 ];
 if(category==="business"){
  const hits=companies.filter(x=>x.region===region).slice(0,3).map(x=>asCard(x.emoji||"🏭","지역 기업",x.name,x.produces||x.summary||"지역 사업장",x.source?.title||"기업 공개자료",x.source?.url||REGION_SITES[region]));
  return [...hits,asCard("🌾","농산물과 특산물","지역 농산물","우리 지역의 대표 농산물과 판매 정보는 지자체 자료에서 확인해요.","시·군청",REGION_SITES[region])];
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
window.LocalCheckRegionalBasics={cards,REGION_SITES};
})();