/* Static presentation: no account, runtime AI, or student-data service required. */
(() => {
  'use strict';
  const { slides, prompts, sources } = window.TRAINING;
  const $ = id => document.getElementById(id);
  const escape = text => String(text ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const labels = { starter: '처음 만드는 프롬프트', count: '포켓몬 세기 수정', add: '포켓몬 덧셈 수정', subtract: '포켓몬 뺄셈 수정', repair: '문제가 생겼을 때', revise: '우리 반에 맞게 수정', aiFeatures: 'AI 기능 추가하기' };
  let current = 0, selectedPrompt = 'starter', toastTimer;
  const worksheet = {};
  const action = (text, href, extra = '') => `<a class="action-link ${extra}" href="${href}" target="_blank" rel="noopener">${text} <span aria-hidden="true">↗</span></a>`;
  const items = entries => `<div class="items ${entries.length === 2 ? 'two' : entries.length === 4 ? 'four' : ''}">${entries.map((item, i) => `<section class="item"><span class="item-number">${String(i + 1).padStart(2, '0')}</span><h3>${escape(item.heading)}</h3><p>${escape(item.body)}</p></section>`).join('')}</div>`;
  const formatVideoTime = seconds => {
    const safe = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0;
    return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
  };
  function videoGallery(s, print = false) {
    const videos = Array.isArray(s.videos) ? s.videos : [];
    if (!videos.length) return '<p class="video-empty">재생할 영상이 없습니다.</p>';
    const first = videos[0];
    const thumbnails = videos.map((video, index) => `<button type="button" class="video-thumb${index === 0 ? ' active' : ''}" data-video-select="${index}" aria-pressed="${index === 0}"><img src="${escape(video.poster)}" alt="${escape(video.title)} 썸네일"><span><b>${String(index + 1).padStart(2, '0')}</b>${escape(video.title)}</span></button>`).join('');
    if (print) return `<div class="video-print-grid">${thumbnails}</div>`;
    return `<div class="video-gallery" data-video-gallery><div class="video-player-column"><div class="video-frame"><video id="training-video" src="${escape(first.src)}" poster="${escape(first.poster)}" controls playsinline preload="metadata" aria-label="${escape(first.title)}"><track id="training-caption" kind="captions" srclang="ko" label="한국어" src="${escape(first.captions)}"></video></div><div class="video-now"><strong id="video-now-title">${escape(first.title)}</strong><span id="video-time">0:00 / 0:00</span></div><div class="video-controls" aria-label="영상 재생 제어"><button type="button" class="primary" data-video-toggle>▶ 재생</button><button type="button" data-video-skip="-5">−5초</button><button type="button" data-video-skip="5">+5초</button><div class="video-segments" aria-label="영상 구간 이동"><button type="button" data-video-segment="0">처음</button><button type="button" data-video-segment="0.25">¼</button><button type="button" data-video-segment="0.5">½</button><button type="button" data-video-segment="0.75">¾</button></div><button type="button" data-video-fullscreen>⛶ 전체화면</button></div><p class="video-key-help">스페이스: 재생·정지 · ← / →: 5초 이동 · 아래 재생 막대에서도 원하는 구간으로 이동할 수 있습니다.</p></div><div class="video-thumbnails" aria-label="수업 영상 선택">${thumbnails}</div></div>`;
  }
  function activeTrainingVideo() { return $('slide').querySelector('#training-video'); }
  function updateVideoControls(video) {
    if (!video) return;
    const toggle = $('slide').querySelector('[data-video-toggle]');
    const time = $('slide').querySelector('#video-time');
    if (toggle) toggle.textContent = video.paused ? '▶ 재생' : '❚❚ 정지';
    if (time) time.textContent = `${formatVideoTime(video.currentTime)} / ${formatVideoTime(video.duration)}`;
  }
  function seekTrainingVideo(seconds) {
    const video = activeTrainingVideo();
    if (!video) return;
    const end = Number.isFinite(video.duration) ? video.duration : Number.MAX_SAFE_INTEGER;
    video.currentTime = Math.max(0, Math.min(end, video.currentTime + seconds));
    updateVideoControls(video);
  }
  function toggleTrainingVideo() {
    const video = activeTrainingVideo();
    if (!video) return;
    if (video.paused) video.play().catch(() => notify('재생 버튼을 한 번 더 눌러 주세요.'));
    else video.pause();
  }
  function selectTrainingVideo(index) {
    const slide = slides[current];
    const videoData = slide?.videos?.[index];
    const video = activeTrainingVideo();
    if (!videoData || !video) return;
    video.pause();
    video.src = videoData.src;
    video.poster = videoData.poster;
    video.setAttribute('aria-label', videoData.title);
    const caption = video.querySelector('#training-caption');
    if (caption) caption.src = videoData.captions;
    video.load();
    $('slide').querySelector('#video-now-title').textContent = videoData.title;
    $('slide').querySelectorAll('[data-video-select]').forEach((button, buttonIndex) => {
      const selected = buttonIndex === index;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    video.play().catch(() => notify('영상이 선택되었습니다. 재생 버튼을 눌러 주세요.'));
    $('slide').focus({ preventScroll: true });
  }
  function setupVideoGallery() {
    const video = activeTrainingVideo();
    if (!video) return;
    ['loadedmetadata', 'timeupdate', 'play', 'pause', 'ended'].forEach(event => video.addEventListener(event, () => updateVideoControls(video)));
    updateVideoControls(video);
  }
  function slideBody(s, print) {
    if (s.type === 'video-gallery') return videoGallery(s, print);
    const entries = s.items || [];
    const visual = window.TrainingVisuals?.render(s, slides.indexOf(s), print);
    if (typeof visual === 'string') return visual;
    if (s.type === 'agenda') return `<div class="steps-list">${entries.map((x, i) => `<section class="step"><b>0${i + 1}</b><h3>${escape(x.heading)}</h3><p>${escape(x.body)}</p></section>`).join('')}</div><p class="fine">실제 연수 시간과 실습 진행에 따라 조정합니다.</p>`;
    if (s.type === 'steps' || s.type === 'checklist') return `<div class="steps-list">${entries.map((x, i) => `<section class="step"><b>${String(i + 1).padStart(2, '0')}</b><h3>${escape(x.heading.replace(/^\d+\s*·\s*/,''))}</h3><p>${escape(x.body)}</p></section>`).join('')}</div>`;
    if (s.type === 'prompt') return `<div class="prompt-layout"><div class="prompt-preview"><span>Gemini에 이렇게 요청해요</span><p>${escape(s.promptPreview || s.lead)}</p><button class="primary" data-prompt="${s.prompt || 'starter'}">요청문 열기 / 복사</button></div><div>${items(entries.slice(0,3))}<div class="actions">${action('Gemini 열기', 'https://gemini.google.com/', 'secondary')}</div></div></div>`;
    if (s.type === 'worksheet') {
      const fields = [['preference','학생이 선택한 소재','포켓몬, 동물, 탈것…'],['goal','연습할 수학 목표','1~5개를 하나씩 세고 숫자 선택'],['response','편한 응답 방법','누르기, 가리키기, 말하기…'],['feedback','시도 / 성공 뒤 피드백','다시 세기 안내 / 짧은 축하'],['observe','교사가 관찰할 행동','하나씩 센 뒤 수를 선택하는가'],['transfer','함께 할 실물 활동','블록 3개 가져오기']];
      return `<div class="worksheet-form">${fields.map(([key,label,hint]) => `<label>${label}<input data-field="${key}" value="${escape(worksheet[key] || '')}" placeholder="${escape(hint)}" ${print ? 'readonly' : ''}></label>`).join('')}</div><p class="worksheet-help">학생 이름 대신 학습 조건만 적습니다. 내용은 이 탭에만 남으며 새로고침하면 초기화됩니다.</p><div class="actions"><button class="primary" data-action="copy-plan">설계 카드 복사</button><button data-action="save-plan">설계 카드 받기</button></div>`;
    }
    if (s.type === 'links') return `<div class="sources">${sources.map(x => `<a class="source" href="${escape(x.url)}" target="_blank" rel="noopener"><span>${escape(x.title)}<small>${escape(new URL(x.url).hostname)}</small></span><span aria-hidden="true">↗</span></a>`).join('')}</div><div class="actions"><button class="primary" data-action="handout">프롬프트·발표 메모 받기</button>${action('Gemini Canvas 열기', 'https://gemini.google.com/', 'secondary')}</div><p class="fine">수업 운영·시간 배분은 이번 연수를 위한 설계안입니다. 이미지 출처: PokeAPI sprites. 이미지 저작권: The Pokémon Company. 공식 제휴 자료가 아닙니다.</p>`;
    if (s.type === 'statement') return `<div class="quote">${escape(s.quote || s.lead)}</div>${items(entries)}`;
    let result = items(entries);
    if (s.prompt) result += `<div class="actions"><button class="primary" data-prompt="${s.prompt}">수정 프롬프트 열기 / 복사</button></div>`;
    return result;
  }
  function achievementStandard(s) {
    if (!s.standard) return '';
    const year = escape(s.standard.year);
    return `<aside class="achievement-standard" data-year="${year}" aria-label="${year} 개정 교육과정 성취기준"><span class="achievement-year">${year} 개정</span><strong class="achievement-code">${escape(s.standard.code)}</strong><span class="achievement-text">${escape(s.standard.text)}</span></aside>`;
  }
  function markup(s, i, print = false) {
    if (s.type === 'thanks') return `<div class="thanks-slide" role="group" aria-label="연수 마무리"><h2>${escape(s.title)}</h2></div>`;
    if(s.type==='cover' && window.TrainingVisuals?.cover) return window.TrainingVisuals.cover(s);
    if (s.type === 'cover') return `<div class="cover"><h1>${escape(s.title)}</h1><p class="lead">${escape(s.lead)}</p></div>`;
    return `<div class="${s.type === 'section' ? 'section-block' : s.type === 'statement' ? 'statement' : s.type === 'video-gallery' ? 'video-gallery-slide' : ''}"><h2>${escape(s.title)}</h2>${s.lead && s.type !== 'statement' ? `<p class="lead">${escape(s.lead)}</p>` : ''}${achievementStandard(s)}<div class="slide-body">${slideBody(s,print)}</div></div>`;
  }
  function imageFallback(root) { root.querySelectorAll('[data-sprite]').forEach(img => { img.addEventListener('error', () => { const replacement=document.createElement('span'); replacement.className='sprite-fallback'; replacement.textContent='★'; replacement.setAttribute('role','img'); replacement.setAttribute('aria-label',img.alt || '친구'); img.replaceWith(replacement); }, {once:true}); }); }
  function render() {
    clearTimeout(toastTimer); $('toast').classList.remove('visible');
    const previousVideo = activeTrainingVideo();
    if (previousVideo) previousVideo.pause();
    const s = slides[current]; $('slide').innerHTML=markup(s,current); imageFallback($('slide')); setupVideoGallery();
    $('slide').querySelectorAll('.cap-shot img').forEach(img=>img.addEventListener('load',fitSlide,{once:true}));
    $('counter').textContent=`${String(current+1).padStart(2,'0')} / ${slides.length}`;
    $('prev').disabled=current===0; $('next').disabled=current===slides.length-1;
    $('progress').style.width=`${(current+1)/slides.length*100}%`;
    $('notes-text').textContent=s.notes || ''; $('notes-speaker').textContent='발표 메모';
    $('toc').querySelectorAll('button').forEach((button,i)=>{button.classList.toggle('current',i===current); if(i===current)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');});
    document.title=`${current+1}. ${s.title.replace(/\n/g,' ')} · 디지털 활용 교육 연수`;
    window.scrollTo({top:0,behavior:'instant'});
    fitSlide();
  }
  function fitSlide(){
    const slide=$('slide');slide.style.zoom='1';
    if(innerWidth<1000)return;
    const padding=getComputedStyle($('stage'));
    const available=innerHeight-document.querySelector('.topbar').getBoundingClientRect().height-document.querySelector('.toolbar').getBoundingClientRect().height-5-parseFloat(padding.paddingTop)-parseFloat(padding.paddingBottom);
    slide.style.zoom=String(Math.min(1,(available-2)/slide.scrollHeight));
  }
  window.addEventListener('resize',fitSlide);
  function go(index) { index=Math.max(0,Math.min(slides.length-1,index)); if(index!==current){current=index;history.replaceState(null,'',`#${current+1}`);render();} }
  function notify(message){$('toast').textContent=message;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2800);}
  async function copy(text){if(navigator.clipboard&&window.isSecureContext){try{await navigator.clipboard.writeText(text);return true;}catch{}}const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';const host=document.querySelector('dialog[open]')||document.body;host.append(t);t.select();const success=document.execCommand('copy');t.remove();return success;}
  function download(text,name,type='text/plain;charset=utf-8'){const url=URL.createObjectURL(new Blob(['\uFEFF',text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function plan(){return `나의 수학 수업 설계 카드\n2026.09.16 충주 혜성학교\n\n학생이 선택한 소재: ${worksheet.preference||'________'}\n학습 목표: ${worksheet.goal||'________'}\n응답 방법: ${worksheet.response||'________'}\n피드백: ${worksheet.feedback||'________'}\n관찰할 행동: ${worksheet.observe||'________'}\n실물 활동: ${worksheet.transfer||'________'}`;}
  function handout(){return `# 디지털 활용 교육 연수\n\n원남초등학교 특수교사 이진구\n\n## 발표 메모\n\n${slides.map((s,i)=>`### ${i+1}. ${s.title.replace(/\n/g,' ')}\n\n${s.lead||''}\n\n${(s.items||[]).map(x=>`- ${x.heading}: ${x.body}`).join('\n')}\n\n발표 메모: ${s.notes||''}`).join('\n\n')}\n\n## 실습 프롬프트\n\n${Object.entries(prompts).map(([key,value])=>`### ${labels[key]||key}\n\n${value}`).join('\n\n')}\n\n## 자료와 출처\n\n${sources.map(x=>`- ${x.title}: ${x.url}`).join('\n')}\n\nPokeAPI sprites의 이미지 저작권은 The Pokémon Company에 있습니다. 공개 배포 전 이미지 이용 범위를 확인하고 필요하면 직접 만든 그림으로 교체하세요.\n`;}
  $('toc').innerHTML=slides.map((s,i)=>`<button data-slide="${i}"><span>${String(i+1).padStart(2,'0')}</span>${escape(s.title.replace(/\n/g,' '))}</button>`).join('');
  $('toc').addEventListener('click',e=>{const b=e.target.closest('[data-slide]');if(b){go(Number(b.dataset.slide));$('menu').close();}});
  $('open-menu').onclick=()=>$('menu').showModal();
  $('open-gallery').onclick=()=>{selectedPrompt='starter';$('prompt-title').textContent=labels.starter;$('prompt-text').value=prompts.starter;$('copy-status').textContent='';$('prompt-dialog').showModal();};
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).close());
  $('prev').onclick=()=>go(current-1);$('next').onclick=()=>go(current+1);
  $('notes-toggle').onclick=()=>{ $('notes').hidden=!$('notes').hidden;$('notes-toggle').setAttribute('aria-expanded',!$('notes').hidden); };
  $('close-notes').onclick=()=>{$('notes').hidden=true;$('notes-toggle').setAttribute('aria-expanded','false');};
  $('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{notify('이 브라우저에서는 전체 화면을 지원하지 않습니다.');}};
  document.addEventListener('fullscreenchange',()=>{
    const active=!!document.fullscreenElement;
    $('fullscreen').textContent=active?'전체 화면 닫기':'전체 화면';
    if(active){$('close-notes').click();$('slide').focus({preventScroll:true});}
    fitSlide();
  });
  function preparePrint(){
    if($('print-slides').children.length)return;
    $('print-slides').innerHTML=slides.map((s,i)=>`<article class="slide">${markup(s,i,true)}</article>`).join('');
  }
  async function readyPrint(){
    preparePrint();
    await Promise.all([...$('print-slides').querySelectorAll('img')].map(img=>img.decode()));
    await document.fonts.ready;
  }
  window.addEventListener('beforeprint',preparePrint);
  $('print').onclick=async()=>{
    const button=$('print');button.disabled=true;button.textContent='이미지 준비 중…';
    try{await readyPrint();window.print();}
    catch{notify('이미지를 불러오지 못했습니다. 인터넷 연결을 확인하고 다시 PDF 저장을 눌러 주세요.');}
    finally{button.disabled=false;button.textContent='PDF 저장';}
  };
  document.addEventListener('keydown',e=>{
    if(document.querySelector('dialog[open]')||e.ctrlKey||e.metaKey||e.altKey)return;
    const video=activeTrainingVideo();
    if(video&&!e.target.closest('input,textarea,select,[contenteditable]')){
      if(e.key===' '&&!e.target.closest('button,a')){e.preventDefault();toggleTrainingVideo();return;}
      if(e.key==='ArrowLeft'){e.preventDefault();seekTrainingVideo(-5);return;}
      if(e.key==='ArrowRight'){e.preventDefault();seekTrainingVideo(5);return;}
    }
    if(e.target.closest('input,textarea,select,button,a,[contenteditable]'))return;
    if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();go(current+1);}else if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(current-1);}else if(e.key==='Home'){e.preventDefault();go(0);}else if(e.key==='End'){e.preventDefault();go(slides.length-1);}else if(e.key==='Escape'){$('close-notes').click();}
  });
  $('slide').addEventListener('click',e=>{
    const select=e.target.closest('[data-video-select]');
    if(select){selectTrainingVideo(Number(select.dataset.videoSelect));return;}
    if(e.target.closest('[data-video-toggle]')){toggleTrainingVideo();$('slide').focus({preventScroll:true});return;}
    const skip=e.target.closest('[data-video-skip]');
    if(skip){seekTrainingVideo(Number(skip.dataset.videoSkip));$('slide').focus({preventScroll:true});return;}
    const segment=e.target.closest('[data-video-segment]');
    if(segment){
      const video=activeTrainingVideo();
      if(video&&Number.isFinite(video.duration)) video.currentTime=video.duration*Number(segment.dataset.videoSegment);
      updateVideoControls(video);$('slide').focus({preventScroll:true});return;
    }
    if(e.target.closest('[data-video-fullscreen]')){
      const video=activeTrainingVideo();
      if(!video)return;
      const request=video.requestFullscreen?.bind(video)||video.webkitEnterFullscreen?.bind(video);
      if(request) Promise.resolve(request()).catch(()=>notify('이 브라우저에서는 영상 전체화면을 지원하지 않습니다.'));
      else notify('이 브라우저에서는 영상 전체화면을 지원하지 않습니다.');
    }
  });
  $('slide').addEventListener('input',e=>{if(e.target.dataset.field)worksheet[e.target.dataset.field]=e.target.value;});
  $('slide').addEventListener('click',e=>{
    const link=e.target.closest('[data-capture-open]');
    if(!link)return;
    e.preventDefault();
    const image=link.querySelector('img');
    $('capture-image').src=link.dataset.captureOpen;
    $('capture-image').alt=image?.alt||'실제 브라우저 화면';
    $('capture-caption').textContent=link.closest('figure')?.querySelector('figcaption')?.textContent||'';
    $('capture-original').href=link.dataset.captureOpen;
    $('capture-dialog').showModal();
  });
  $('slide').addEventListener('click',async e=>{
    const button=e.target.closest('[data-pokemon-copy]');
    if(!button)return;
    const id=Number(button.dataset.pokemonCopy);
    if(!Number.isInteger(id)||id<1)return;
    const url=`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    notify(await copy(url)?'그림 주소를 복사했어요. Gemini 요청문에 붙여 넣으세요.':'복사할 수 없습니다. 그림을 새 탭으로 열어 주소를 복사해 주세요.');
  });
  $('slide').addEventListener('click',async e=>{const promptButton=e.target.closest('[data-prompt]');if(promptButton){selectedPrompt=promptButton.dataset.prompt;$('prompt-title').textContent=labels[selectedPrompt]||'제작 프롬프트';$('prompt-text').value=prompts[selectedPrompt];$('copy-status').textContent='';$('prompt-dialog').showModal();return;}const b=e.target.closest('[data-action]');if(!b)return;switch(b.dataset.action){case 'start':go(1);break;case 'copy-plan':notify(await copy(plan())?'설계 카드를 복사했습니다.':'복사할 수 없습니다. 설계 카드 받기를 이용해 주세요.');break;case 'save-plan':download(plan(),'혜성학교_수업설계카드.txt');break;case 'handout':download(handout(),'20260916_혜성학교_AI연수_진행자료.md');break;}});
  $('copy-prompt').onclick=async()=>{$('copy-status').textContent=await copy($('prompt-text').value)?'전체 프롬프트를 복사했습니다.':'직접 선택해 복사하거나 텍스트로 받아 주세요.';};
  $('save-prompt').onclick=()=>download($('prompt-text').value,`${labels[selectedPrompt]||'제작'}_프롬프트.txt`);
  function hash(){const value=Number(location.hash.slice(1));current=Number.isInteger(value)&&value>=1&&value<=slides.length?value-1:0;render();}
  window.addEventListener('hashchange',hash);hash();preparePrint();
})();
