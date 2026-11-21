/* 충북 시·군 대표기업 추가 사례. 확인 자료: 기업 공식 소개, 지자체·공공데이터, 2026년 공시.
   본사는 다른 지역에 있을 수 있습니다. '공장·사업장'으로 표시된 항목은 현지 생산·사업장입니다.
   기업 규모 순위가 아니라, 초등 사회 산업 이해용의 다양한 업종 사례입니다. */
(() => {
"use strict";
const row=(id,region,name,type,emoji,produces,summary,sourceTitle,sourceDate,sourceUrl)=>{
 const google=new URL("https://www.google.com/search");
 google.searchParams.set("q",region+" "+name+" 공식 사업장 공장 생산품 site:go.kr OR site:or.kr");
 return {id,region,name,type,emoji,produces,summary,
  inquiry:"이 기업의 "+region+" 사업장에서 하는 일과 본사의 위치를 공식 자료로 확인할 수 있을까요?",
  source:{title:sourceTitle,date:sourceDate,url:sourceUrl},
  secondary:{title:"지역 사업장 관련 공공자료 다시 찾기",date:"검색일·원문 기준일 확인",url:google.href}};
};
window.LOCALCHECK_ADDITIONAL_BUSINESSES=[
 row("extra-cj-celltrion","청주시","셀트리온제약 청주공장(본사)","제약·바이오","💊","사람의 건강에 필요한 의약품",
  "청주 오창에 본사와 의약품 공장이 있어요.","셀트리온제약 청주공장 소개","공식 사업장 안내","https://www.celltrionph.com/ko-kr/product/facilities"),
 row("extra-cj-lgchem","청주시","LG화학 청주 분리막공장","배터리 소재","🔋","배터리 안에 들어가는 분리막",
  "청주에는 전지에 쓰이는 소재를 만드는 LG화학 사업장이 있어요.","LG화학 2026년 회사소개서 사업장 현황","2026","https://www.lgchem.com/upload/file/introduce/2026_Introduction_of_LGChem_KO.pdf"),
 row("extra-cju-cosmo","충주시","코스모신소재 충주 본사·공장","이차전지·전자 소재","⚡","배터리 양극재와 전자재료",
  "충주에 본사와 생산공장이 있어요. 배터리 소재가 무엇인지 알아봐요.","코스모신소재 2026년 사업보고서","2026-06-02","https://kind.krx.co.kr/external/2026/06/02/000543/20260602001290/11011.htm"),
 row("extra-cju-kimberly","충주시","유한킴벌리 충주공장","위생·생활용품","🧻","생활 속 위생용품",
  "충주공장에서 위생에 필요한 여러 생활용품을 만들어요.","유한킴벌리 공식 충주공장 소개","사업장 안내","https://www.yuhan-kimberly.co.kr/company/workplace/6"),
 row("extra-jc-huons","제천시","휴온스 제천공장","의약품","💊","의약품",
  "제천 바이오밸리에 의약품 생산공장이 있어요.","휴온스 공식 사업장 위치 안내","사업장 안내","https://www.huons.com/kor/home.php?go=location"),
 row("extra-jc-iljin","제천시","일진글로벌 제천공장","자동차 부품","🚘","자동차 바퀴에 쓰는 베어링 부품",
  "제천에 자동차 바퀴가 잘 돌아가도록 돕는 부품을 만드는 공장이 있어요.","일진그룹 공식 계열사·공장 안내","사업장 안내","https://iljin.com/company/subsidiary/"),
 row("extra-bo-hanwha","보은군","한화에어로스페이스 보은사업장","첨단 제조업","🏭","정밀 제조·방위산업 관련 제품",
  "보은 내북면에 있는 사업장이에요. 본사와 공장이 다른 지역에 있는 사례예요.","한화에어로스페이스 공식 국내 사업장 안내","사업장 안내","https://www.hanwhaaerospace.com/kor/whoweare/location/domestic.do"),
 row("extra-bo-temc","보은군","티이엠씨씨엔에스 보은공장","반도체 소재·장비","🧪","반도체 제조에 필요한 장비와 소재",
  "보은에 반도체 산업과 관련된 제조 사업장이 있어요.","티이엠씨씨엔에스 2026년 사업보고서","2026-03-16","https://kind.krx.co.kr/external/2026/03/16/002629/20260316007402/11011.htm"),
 row("extra-oc-gyodong","옥천군","교동식품 옥천 본사·공장","가공식품","🍲","국·탕 등 간편식품",
  "옥천에서 국이나 탕 같은 가공식품을 만들어요.","교동식품 공식 본사·제품 소개","기업 소개","https://www.gdfood.kr/"),
 row("extra-oc-koryeo","옥천군","고려에프앤비 옥천공장","차·음료","🍵","차와 농축음료",
  "옥천 이원면에서 차와 음료 관련 제품을 가공해요.","옥천군 제조업체 현황(공공데이터포털)","2026-09-18","https://www.data.go.kr/data/15167000/fileData.do"),
 row("extra-yd-byucksan","영동군","벽산 영동공장","건축자재","🧱","건물의 보온·단열에 쓰이는 건축자재",
  "영동 용산면에서 건물에 쓰이는 보온재 등을 만들어요.","벽산 공식 영동공장·제품 안내","사업장 안내","https://www.byucksan.com/05_company/network_branch02.asp"),
 row("extra-yd-winekorea","영동군","와인코리아 영동 본사·공장","포도 가공산업","🍇","지역 포도를 이용한 가공 제품",
  "영동의 포도를 이용하는 농산물 가공 기업이에요. 지역 농업과 제조업의 연결을 알아봐요.","와인코리아 공식 사업장 소개","회사 소개","https://winekorea.kr/intro/intro_020100.html"),
 row("extra-jp-skiet","증평군","SK아이이테크놀로지 증평공장","이차전지 소재","🔋","배터리 분리막",
  "증평산업단지에 배터리 소재 관련 공장이 있어요.","증평군 공식 SK아이이테크놀로지 증평공장 소개","2023년 군청 자료","https://www.jp.go.kr/kor/cop/bbs/BBSMSTR_000000000135/selectBoardArticle.do?mno=sitemap_12&nttId=B00000040429la9pX7zf&pageIndex=1&searchCnd=&searchWrd="),
 row("extra-jp-lotte","증평군","롯데쇼핑 신선품질혁신센터","식품 유통·가공","🥕","과일·채소의 손질과 포장",
  "증평 도안면에서 신선식품의 품질을 관리하고 포장하는 사업장이에요.","증평군 2일반산업단지 입주기업 현황","군청 공개자료","https://www.jp.go.kr/kor/sub05_02_02_02.do"),
 row("extra-jc-hanwha","진천군","한화솔루션 큐셀 진천공장","태양광 에너지","☀️","태양광 셀과 모듈",
  "진천에 햇빛을 전기로 바꾸는 태양광 부품을 만드는 공장이 있어요.","한화 공식 큐셀 국내 생산시설 소개","회사 소개","https://www.hanwha.com/companies/hanwha-solutions-qcells-division.do"),
 row("extra-jc-daewon","진천군","대원제약 진천공장","의약품","💊","건강을 위한 의약품",
  "진천 광혜원면에 의약품 공장이 있어요.","대원제약 공식 사업장 안내","사업장 안내","https://www.daewonpharm.com/company/sub02_01.jsp?lang=1&mb=01&mm=12&ms=121"),
 row("extra-jc-celltrion","진천군","셀트리온제약 진천공장","제약·바이오","🧬","의약품",
  "셀트리온제약은 청주 본사 외에 진천에도 공장을 두고 있어요.","셀트리온제약 공식 공장 위치 안내","사업장 안내","https://www.celltrionph.com/ko-kr/contact/map01"),
 row("extra-gs-nepes","괴산군","네패스아크 괴산사업장","반도체 시험","💻","시스템반도체의 성능 검사",
  "괴산 청안면에 반도체를 검사하는 기업의 사업장이 있어요.","네패스 공식 괴산 사업장 채용·시설 안내","사업장 안내","https://careers.nepes.co.kr/job_posting/VieycZf5"),
 row("extra-gs-itchem","괴산군","아이티켐 괴산공장","화학 소재","🧪","산업용 화학 관련 소재",
  "괴산 청안면에 있는 화학 관련 기업이에요. 정확한 생산품은 공식 원문에서 확인해 보세요.","괴산군 공식 지역기업 참여 행사 자료","2026년 군청 자료","https://www.goesan.go.kr/www/selectBbsNttView.do?bbsNo=213&integrDeptCode=&key=136&nttNo=131637&pageIndex=51&pageUnit=9&searchCnd=all&searchCtgry=&searchKrwd="),
 row("extra-es-handok","음성군","한독 음성공장","의약품","💊","의약품",
  "음성 대소읍에 의약품을 생산하는 공장이 있어요.","한독 공식 음성공장 생산시설 안내","회사 소개","https://www.handok.co.kr/page/production"),
 row("extra-es-ace","음성군","에이스침대 음성공장","가구·생활용품","🛏️","침대와 매트리스",
  "음성 삼성면에서 침대와 가구 관련 제품을 만들어요.","에이스침대 공식 공장 위치 안내","사업장 안내","https://www.acebed.com/business/location/index.do"),
 row("extra-es-ottogi","음성군","오뚜기 음성 대풍공장","식품","🍛","소스와 가공식품",
  "음성 대소읍에서 일상에서 먹는 가공식품을 만드는 사업장이에요.","오뚜기 공식 대풍공장 소개","공장 소개","https://www.otoki.com/brand/factory-tour"),
 row("extra-dy-sungshin","단양군","성신양회 단양공장","시멘트·건설 재료","🏗️","시멘트",
  "단양에서 건물을 지을 때 쓰는 시멘트를 만드는 공장이에요.","성신양회 공식 사업보고서","2024-03-13","https://kind.krx.co.kr/external/2024/03/13/002324/20240313005527/11011.htm"),
 row("extra-dy-grm","단양군","GRM 단양공장","자원 재활용·금속","♻️","금속 자원을 재활용한 소재",
  "단양의 재활용 공장은 버려진 금속 자원을 다시 쓰는 산업과 관련돼 있어요.","LS MnM 공식 GRM 단양공장 소개","공식 사업장 안내","https://www.lsmnm.com/about/subsidiary")
];
window.LOCALCHECK_ADDITIONAL_BUSINESSES_ASOF="2026-11-21";
})();
