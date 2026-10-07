/* Slide layouts for original browser captures. No interface illustrations. */
(() => {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

  function capture(slide, cover = false) {
    const shot = slide.screenshot;
    if (!shot || typeof shot.src !== 'string' || !shot.src) return '';
    const alt = shot.alt || slide.title.replace(/\n/g, ' ');
    const originalSrc = typeof shot.originalSrc === 'string' && shot.originalSrc ? shot.originalSrc : shot.src;
    const externalHref = typeof shot.href === 'string' && shot.href ? shot.href : '';
    const href = externalHref || originalSrc;
    const dialogAttribute = externalHref ? '' : ` data-capture-open="${escape(originalSrc)}"`;
    const linkLabel = externalHref ? (shot.linkLabel || `${alt} 관련 페이지 열기`) : `${alt} 원본 크게 보기`;
    return `<figure class="cap-figure${cover ? ' cap-cover-figure' : ''}"><a class="cap-shot" href="${escape(href)}" target="_blank" rel="noopener"${dialogAttribute} aria-label="${escape(linkLabel)}"><img src="${escape(shot.src)}" alt="${escape(alt)}" decoding="sync"></a></figure>`;
  }

  function steps(entries = [], compact = false) {
    if (!entries.length) return '';
    return `<ol class="cap-steps${compact ? ' cap-steps-compact' : ''}">${entries.map((item, index) => `<li><span class="cap-step-number" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><div><h3>${item.href ? `<a href="${escape(item.href)}" target="_blank" rel="noopener noreferrer">${escape(item.heading)} <span aria-hidden="true">↗</span></a>` : escape(item.heading)}</h3><p>${escape(item.body)}</p></div></li>`).join('')}</ol>`;
  }

  function prompt(slide) {
    const key = slide.prompt;
    if (!key || !window.TRAINING?.prompts?.[key]) return '';
    const text = slide.promptPreview || (key === 'starter' ? window.TRAINING.prompts.starter : '');
    const label = key === 'starter' ? '실습 요청문 열기 / 복사' : key === 'pokemonSprite' ? '그림 적용 요청문 열기 / 복사' : key === 'aiFeatures' ? 'AI 기능 요청문 열기 / 복사' : '수정 요청문 열기 / 복사';
    return `<div class="cap-prompt${key === 'pokemonSprite' ? ' cap-prompt-field' : ''}">${text ? `<blockquote>${escape(text)}</blockquote>` : ''}<button class="primary" data-prompt="${escape(key)}">${label}</button></div>`;
  }

  const icons = {
    laptop:'<rect x="6" y="5" width="20" height="16" rx="2"/><path d="M6 21 2 27h28l-4-6M12 24h8"/>',
    wifi:'<path d="M3 11a20 20 0 0 1 26 0M7 16a14 14 0 0 1 18 0M11 21a8 8 0 0 1 10 0"/><circle cx="16" cy="26" r="1"/>',
    image:'<rect x="4" y="4" width="24" height="24" rx="4"/><circle cx="11" cy="11" r="2"/><path d="m5 24 7-8 5 5 5-7 6 10"/>',
    spark:'<path d="m16 3 3.5 9.5L29 16l-9.5 3.5L16 29l-3.5-9.5L3 16l9.5-3.5Z"/>',
    heart:'<path d="M16 27 5.5 17C-2 9 9 1 16 10 23 1 34 9 26.5 17Z"/>',
    money:'<rect x="3" y="7" width="26" height="19" rx="4"/><path d="M5 7V5h20v2M22 14h7v7h-7a3.5 3.5 0 0 1 0-7Z"/>',
    clock:'<circle cx="16" cy="16" r="12"/><path d="M16 8v9l6 3"/>',
    game:'<path d="M10 9h12c4 0 5 5 6 10s-1 8-5 4l-3-3h-8l-3 3c-4 4-6 1-5-4s2-10 6-10Z"/><path d="M10 12v7m-3-3h6m8-2h.1m3 3h.1"/>',
    music:'<path d="M13 24V7l14-3v17M13 12l14-3"/><ellipse cx="9" cy="25" rx="4" ry="3"/><ellipse cx="23" cy="22" rx="4" ry="3"/>',
    train:'<rect x="7" y="3" width="18" height="23" rx="5"/><path d="M7 16h18M16 4v12M11 26l-3 4m13-4 3 4M11 21h.1M21 21h.1"/>'
  };
  const icon = name => `<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.spark}</svg>`;
  const pokemon = (id,name) => `<img src="assets/pokemon/${id}-art.png" alt="${escape(name)}" data-sprite decoding="sync">`;
  function cover(slide) {
    const cells=[[25,'피카츄'],'＋',[133,'이브이'],'1 2 3',[7,'꼬부기'],'−',[1,'이상해씨'],'＝',[4,'파이리']];
    return `<div class="cap-cover intro-cover"><div class="cap-cover-copy"><h1>${escape(slide.title)}</h1><div class="cap-instructors"><p><strong>원남초등학교 특수교사 이진구</strong></p></div></div><div class="intro-mosaic" role="img" aria-label="피카츄, 이브이, 꼬부기, 이상해씨, 파이리와 수학 기호">${cells.map((x,i)=>`<div class="mosaic-cell cell-${i}">${Array.isArray(x)?pokemon(...x):`<span aria-hidden="true">${x}</span>`}</div>`).join('')}</div></div>`;
  }

  function intro(slide) {
    if(slide.visual==='intro-characters') return `<div class="character-trio"><section><div class="character-picture pokemon-friends">${pokemon(25,'피카츄')}${pokemon(133,'이브이')}${pokemon(7,'꼬부기')}</div><h3>포켓몬</h3></section><section><img class="character-picture" src="assets/characters/pororo.png" alt="뽀로로와 친구들"><h3>뽀로로</h3></section><section><img class="character-picture" src="assets/characters/tayo.png" alt="타요와 버스 친구들"><h3>타요</h3></section></div>`;
    if(slide.visual==='intro-preparation') return `<div class="intro-icons preparation-icons"><section><div class="intro-icon">${icon('laptop')}</div><h3>노트북</h3></section><section><div class="intro-icon">${icon('wifi')}</div><h3>인터넷</h3></section><section><div class="intro-icon google-account"><img src="assets/brands/google.png" alt="Google 공식 로고"></div><h3>구글 계정</h3></section></div>`;
    if(slide.visual==='intro-google') return `<div class="google-welcome"><a href="https://www.google.com/" target="_blank" rel="noopener" aria-label="구글 열기"><img src="assets/brands/google.png" alt="Google 공식 로고"></a></div>`;
    if(slide.visual==='intro-models') return `<div class="intro-models"><div class="model-pair"><section><img src="assets/brands/openai.svg" alt="OpenAI 공식 로고"><h3>GPT-6</h3><p>OpenAI</p></section><section><img src="assets/brands/anthropic.png" alt="Anthropic 공식 로고"><h3>Claude 5.1</h3><p>Anthropic</p></section></div><p class="intro-takeaway">${escape(slide.takeaway)}</p></div>`;
    if(slide.visual==='intro-pokemon') return `<div class="intro-pokemon">${slide.art.map(x=>`<div>${pokemon(x.id,x.name)}</div>`).join('')}</div>`;
return `<div class="intro-icons ${slide.visual==='intro-question'?'intro-question':''}${slide.id==='interactive-repetition'?' intro-icons-feedback-centered':''}">${slide.items.map(x=>`<section>${x.href?`<a class="intro-icon-link" href="${escape(x.href)}" target="_blank" rel="noopener noreferrer" aria-label="${escape(x.heading)} 학습자료 열기" title="${escape(x.heading)} 학습자료 열기"><div class="intro-icon">${icon(x.icon)}</div></a>`:`<div class="intro-icon">${icon(x.icon)}</div>`}<h3>${escape(x.heading)}</h3>${x.body?`<p>${escape(x.body)}</p>`:''}</section>`).join('')}</div>`;
  }

  function render(slide) {
    if(slide.visual?.startsWith('intro-')) return intro(slide);
    if (slide.type === 'links' || slide.visual === 'sources' || slide.type === 'worksheet') return null;
    const shot = capture(slide);
    if (shot) return `<div class="cap-layout cap-image-only">${shot}</div>`;
    return `<div class="cap-text-only${slide.type === 'section' ? ' cap-section' : ''}">${steps(slide.items)}${prompt(slide)}</div>`;
  }

  window.TrainingVisuals = { cover, render };
})();
