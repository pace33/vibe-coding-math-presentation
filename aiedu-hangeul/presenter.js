(function () {
  'use strict';
  function navigationFor(event) {
    if (event.defaultPrevented || event.repeat || event.ctrlKey || event.altKey || event.metaKey || event.isComposing) return null;
    const target = event.target;
    if (target?.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="tab"],[role="slider"],[role="combobox"],video,audio')) return null;
    if ((event.key === ' ' || event.key === 'Enter') && target?.closest?.('button,a,summary,[role="button"]')) return null;
    if (['ArrowRight','ArrowDown','PageDown'].includes(event.key)) return 'next';
    if (['ArrowLeft','ArrowUp','PageUp'].includes(event.key)) return 'previous';
    if (event.key === ' ' || event.key === 'Enter') return event.shiftKey ? 'previous' : 'next';
    if (event.key === 'Home') return 'first';
    if (event.key === 'End') return 'last';
    if (event.key.toLowerCase() === 'f') return 'fullscreen';
    return null;
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = {navigationFor};
  if (typeof document === 'undefined') return;

  const main = document.querySelector('main');
  const originalSections = [...main.children].filter(element => element.tagName === 'SECTION');
  const overview = document.getElementById('stages');
  const stageGrid = overview.querySelector('.stage-grid');
  const stageCards = [...stageGrid.querySelectorAll('[data-stage-card]')];
  const stagePages = stageCards.map((article, i) => {
    const placeholder = document.createComment('lecture-stage-' + i);
    article.before(placeholder);
    const section = document.createElement('section');
    section.id = 'stage-' + article.dataset.stageCard;
    section.className = 'section stages lecture-stage-page';
    section.hidden = true;
    const inner = document.createElement('div');
    inner.className = 'section-inner';
    const heading = document.createElement('header');
    heading.className = 'lecture-stage-heading';
    const label = document.createElement('p');
    label.className = 'section-label';
    label.textContent = 'CORE FUNCTION · ' + (i + 1);
    const title = document.createElement('h2');
    title.className = 'section-title';
    title.id = section.id + '-title';
    title.textContent = (i + 1) + '단계 · ' + article.querySelector('h3').textContent;
    const description = document.createElement('p');
    description.textContent = article.querySelector(':scope > p').textContent;
    heading.append(label, title, description);
    section.setAttribute('aria-labelledby',title.id);
    inner.append(heading);
    section.append(inner);
    return {section, inner, article, placeholder, title:title.textContent};
  });
  let after = overview;
  stagePages.forEach(page => { after.after(page.section); after = page.section; });
  const titles = {top:'강의 소개',need:'연구의 필요성',bridge:'한글과 교과의 연결',stages:'4단계 한눈에 보기','review-records':'오늘의 복습',cycle:'수업 적용 흐름',cases:'실제 수업 사례',results:'연구 결과',takeaway:'핵심 정리'};
  const pages = [];
  originalSections.forEach(element => {
    pages.push({id:element.id,element,title:titles[element.id] || element.querySelector('h2')?.textContent,navId:element.id,review:element.id === 'review-records'?'review':null});
    if (element === overview) stagePages.forEach(page=>pages.push({id:page.section.id,element:page.section,title:page.title,navId:'stages'}));
    if (element.id === 'review-records') pages.push({id:'student-records',element,title:'학생 학습 기록',navId:'review-records',review:'records'});
  });
  pages.forEach(page => page.element.tabIndex = -1);
  const toolbar = document.createElement('nav');
  toolbar.className = 'lecture-controls';
  toolbar.setAttribute('aria-label','발표 페이지 넘기기');
  toolbar.hidden = true;
  toolbar.innerHTML = '<button type="button" data-slide-prev aria-label="이전 발표 페이지">← 이전</button><label class="lecture-page-picker"><select data-slide-picker aria-label="발표 페이지 선택"></select><small class="lecture-shortcuts" data-slide-hint role="status" aria-live="polite">프리젠터 · ← → · Page Up/Down · F 전체화면</small></label><button type="button" data-slide-next aria-label="다음 발표 페이지">다음 →</button><output class="lecture-count" data-slide-count aria-live="polite" aria-atomic="true"></output><div class="lecture-options"><button type="button" data-slide-fullscreen>전체화면</button><button type="button" data-slide-scroll>전체 보기</button></div>';
  const picker = toolbar.querySelector('[data-slide-picker]');
  pages.forEach((page,i) => {
    const option = document.createElement('option');
    option.value = page.id;
    option.textContent = (i+1) + '. ' + page.title;
    picker.append(option);
  });
  const launcher = document.createElement('button');
  launcher.className = 'lecture-launch';
  launcher.type = 'button';
  launcher.textContent = '▶ 발표 모드';
  launcher.hidden = true;
  document.body.append(toolbar,launcher);
  let enabled = false;
  let current = 0;
  let switchingReview = false;
  let drawing = false;
  const previousButton = toolbar.querySelector('[data-slide-prev]');
  const nextButton = toolbar.querySelector('[data-slide-next]');
  const fullscreenButton = toolbar.querySelector('[data-slide-fullscreen]');

  function resizeChrome() {
    document.documentElement.style.setProperty('--lecture-header-height',document.querySelector('.site-header').getBoundingClientRect().height + 'px');
    document.documentElement.style.setProperty('--lecture-controls-height',toolbar.getBoundingClientRect().height + 'px');
  }
  const chromeObserver = new ResizeObserver(resizeChrome);
  chromeObserver.observe(document.querySelector('.site-header'));
  chromeObserver.observe(toolbar);
  function indexFor(hash) {
    const id = hash.replace(/^#/,'');
    if (/^\d+$/.test(id)) return Math.max(0,Math.min(pages.length-1,Number(id)-1));
    const found = pages.findIndex(page=>page.id===id);
    if (found >= 0) return found;
    const target = document.getElementById(id);
    return target ? pages.findIndex(page=>page.element.contains(target)) : -1;
  }
  function updateControls() {
    const page = pages[current];
    main.dataset.lecturePage = page.id;
    picker.value = page.id;
    previousButton.disabled = current === 0;
    nextButton.disabled = current === pages.length-1;
    toolbar.querySelector('[data-slide-count]').textContent = (current+1) + ' / ' + pages.length;
    document.querySelector('#progressBar').style.width = ((current+1)/pages.length*100) + '%';
    document.querySelectorAll('.nav-links a').forEach(link=> {
      const active = link.getAttribute('href') === '#' + page.navId;
      link.classList.toggle('active',active);
      if(active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
    });
    document.title = (current+1) + '. ' + page.title + ' | 에이두 한글 강의자료';
  }
  function showPage(index, options={}) {
    if (!enabled) return;
    const target = Math.max(0,Math.min(pages.length-1,index));
    if (target !== current) window.AieduLecture?.pauseMedia();
    const page = pages[target];
    const oldElement = pages[current].element;
    current = target;
    new Set(pages.map(item=>item.element)).forEach(element=>element.hidden = element !== page.element);
    if (page.element !== oldElement || options.resetScroll) page.element.scrollTop = 0;
    if (page.review && options.review !== false) {
      switchingReview = true;
      try { window.AieduLecture?.showReview(page.review); } finally { switchingReview = false; }
    }
    updateControls();
    if (options.history !== false && location.hash !== '#' + page.id) history.pushState(null,'','#' + page.id);
    if (options.focus !== false) page.element.focus({preventScroll:true});
    resizeChrome();
  }
  function changeMode(on, index=current) {
    window.AieduLecture?.pauseMedia();
    enabled = on;
    if (on) {
      stagePages.forEach(page=>page.inner.append(page.article));
      document.body.classList.add('presenting');
      toolbar.hidden = false;
      launcher.hidden = true;
      window.scrollTo({top:0,behavior:'instant'});
      const url = new URL(location.href);
      url.searchParams.delete('view');
      history.replaceState(null,'',url);
      showPage(index,{resetScroll:true});
    } else {
      const page = pages[current];
      document.body.classList.remove('presenting');
      toolbar.hidden = true;
      launcher.hidden = false;
      originalSections.forEach(element=>element.hidden = false);
      stagePages.forEach(page=>{page.placeholder.after(page.article); page.section.hidden = true;});
      const stage = stagePages.find(item=>item.section === page.element);
      const element = stage?.article || page.element;
      const url = new URL(location.href);
      url.searchParams.set('view','scroll');
      url.hash = stage?'stages':page.element.id;
      history.replaceState(null,'',url);
      document.title = '에이두 한글 | 교과는 함께, 문해 수준은 맞춤으로';
      requestAnimationFrame(()=>{element.scrollIntoView({behavior:'instant'}); window.AieduLecture?.updateScrollProgress();});
    }
  }
  async function toggleFullscreen() {
    try {
      if(document.fullscreenElement) await document.exitFullscreen();
      else if(document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else throw new Error('Fullscreen not supported');
    } catch {
      const hint = toolbar.querySelector('[data-slide-hint]');
      hint.classList.add('is-notice');
      hint.textContent = '이 환경은 전체화면을 지원하지 않아요. PC 브라우저에서는 F11도 사용할 수 있어요.';
    }
  }
  previousButton.addEventListener('click',()=>showPage(current-1));
  nextButton.addEventListener('click',()=>showPage(current+1));
  picker.addEventListener('change',()=>showPage(indexFor(picker.value)));
  fullscreenButton.addEventListener('click',toggleFullscreen);
  toolbar.querySelector('[data-slide-scroll]').addEventListener('click',()=>changeMode(false));
  launcher.addEventListener('click',()=>changeMode(true));
  document.addEventListener('fullscreenchange',()=> {
    fullscreenButton.textContent = document.fullscreenElement?'전체화면 종료':'전체화면';
    resizeChrome();
  });
  document.addEventListener('pointerdown',event=>{if(event.target.tagName === 'CANVAS') drawing = true;},true);
  ['pointerup','pointercancel','blur'].forEach(type=>window.addEventListener(type,()=>drawing = false));
  document.addEventListener('keydown',event=> {
    if(!enabled || drawing) return;
    const action = navigationFor(event);
    if(!action) return;
    event.preventDefault();
    if(action === 'fullscreen') { toggleFullscreen(); return; }
    showPage(action === 'next'?current+1:action === 'previous'?current-1:action === 'first'?0:pages.length-1);
  });
  document.addEventListener('click',event=> {
    const anchor = event.target.closest?.('a[href^="#"]');
    if(!enabled || !anchor) return;
    if(anchor.hash === '#main') { event.preventDefault(); pages[current].element.focus({preventScroll:true}); return; }
    const index = indexFor(anchor.hash);
    if(index < 0) return;
    event.preventDefault();
    showPage(index);
  });
  const handleHistory = () => {
    const on = new URL(location.href).searchParams.get('view') !== 'scroll';
    const index = indexFor(location.hash);
    if(on !== enabled) changeMode(on,index >= 0?index:current);
    else if(enabled && index >= 0) showPage(index,{history:false});
  };
  window.addEventListener('hashchange',handleHistory);
  window.addEventListener('popstate',handleHistory);
  window.addEventListener('aiedu:reviewview',event=> {
    if(!enabled || switchingReview || pages[current].navId !== 'review-records') return;
    const id = event.detail.view === 'review'?'review-records':'student-records';
    const index = indexFor(id);
    if(index !== current) showPage(index,{review:false,focus:false});
  });
  overview.querySelectorAll('.live-stage-card').forEach((card,i)=> {
    card.setAttribute('role','button');
    card.setAttribute('aria-label',stagePages[i].title+' 페이지 열기');
    card.tabIndex = 0;
    const jump = () => { if(enabled) showPage(indexFor(stagePages[i].section.id)); else stagePages[i].article.scrollIntoView({behavior:'smooth'}); };
    card.addEventListener('click',jump);
    card.addEventListener('keydown',event=> { if(event.key === 'Enter' || event.key === ' ') {event.preventDefault(); jump();} });
  });
  window.AieduPresenter = {get enabled(){return enabled;},goTo(id){const index=indexFor(id);if(index>=0)showPage(index);}};
  const initial = indexFor(location.hash);
  if(new URL(location.href).searchParams.get('view') === 'scroll') { launcher.hidden = false; }
  else changeMode(true,initial >= 0?initial:0);
})();
