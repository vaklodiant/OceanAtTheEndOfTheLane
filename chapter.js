(async () => {
  // Screen starts at opacity:0 (CSS rule). It will be faded in at end of init.
  // body.chapter-page already sets filter:none via CSS, so no inline override needed.

  if (localStorage.getItem('a11yMode') === '1') {
    document.body.classList.add('a11y-mode');
  }

  // Smooth fade-out when navigating from chapter page via the chapter menu.
  // Registered as a capturing listener so it fires before loader.js's own capture handler,
  // allowing us to cancel the instant loader popup and do a graceful page exit instead.
  document.addEventListener('click', function _chMenuNav(e) {
    var link = e.target.closest('.chapter-menu-panel a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    e.preventDefault();
    e.stopImmediatePropagation();
    document.body.classList.add('hide');          // body.chapter-page.hide → fade/blur out
    setTimeout(function () {
      if (window.GlobalLoader) window.GlobalLoader.show();
      setTimeout(function () { window.location.href = href; }, 180);
    }, 480);
  }, true);

  {
    
    const BUBBLE_P = [
      {d:0,n:26},{d:2,n:20},{d:4,n:29},{d:0,n:23},{d:3,n:32},
      {d:5,n:25},{d:6,n:21},{d:1,n:36},{d:7,n:28},{d:3,n:18},
      {d:8,n:31},{d:2,n:26},{d:4,n:34},{d:9,n:21},{d:1,n:39},
      {d:6,n:25},{d:3,n:29},{d:7,n:18},{d:5,n:37},{d:0,n:26},
    ];
    try {
      const EPOCH_KEY = 'bubbleEpoch';
      let epoch = parseInt(localStorage.getItem(EPOCH_KEY) || '');
      if (!epoch || isNaN(epoch)) {
        
        epoch = Date.now() - 120000;
        localStorage.setItem(EPOCH_KEY, String(epoch));
      }
      const sec = (Date.now() - epoch) / 1000;
      document.querySelectorAll('.bubbles span').forEach((span, i) => {
        if (i >= BUBBLE_P.length) return;
        const {d, n} = BUBBLE_P[i];
        const run = sec - d; 
        span.style.animationDelay = run < 0
          ? `${(-run).toFixed(2)}s`       
          : `-${(run % n).toFixed(2)}s`;  
      });
    } catch (_) {  }
  }

  const isCrossFade = sessionStorage.getItem('chapterCrossFade') === '1';
  if (isCrossFade) sessionStorage.removeItem('chapterCrossFade');

  const isLoaderActive = sessionStorage.getItem('chapterLoaderActive') === '1';
  if (isLoaderActive) {
    sessionStorage.removeItem('chapterLoaderActive');
    const loader = document.querySelector('.chapter-loader');
    if (loader) {
      loader.style.opacity       = '1';
      loader.style.pointerEvents = 'auto';
    }
  }

  const params = new URLSearchParams(window.location.search);
  const pageId = parseFloat(params.get('page')) || 1;

  let pages;
  try {
    const response = await fetch('content.json');
    if (!response.ok) throw new Error(`content.json: ${response.status}`);
    pages = await response.json();
  } catch (e) {
    console.error('Ошибка загрузки content.json:', e);
    return;
  }

  let bookParagraphs = [];
  try {
    const bookResponse = await fetch('text/ОкеанВКонцеДороги.txt');
    if (!bookResponse.ok) throw new Error(`book text: ${bookResponse.status}`);
    const bookText = await bookResponse.text();
    const normalizedBookText = bookText
      .replace(/\r\n/g, '\n')
      .replace(/(^|\n)(\s*(?:-\s*[^\n]+?\s*-|=\s*[^\n]+?\s*=|\d+)\s*)(\n|$)/g, '$1\n$2\n');
    bookParagraphs = normalizedBookText.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 0);
  } catch (e) {
    console.error('Ошибка загрузки текста книги:', e);
  }

  const enabledPages = pages.filter(p => !p.disabled).sort((a, b) => a.id - b.id);
  const pageFromUrl = pages.find(p => p.id === pageId);
  if (!pageFromUrl) {
    console.error(`Страница id=${pageId} не найдена в content.json`);
    return;
  }

  if (pageFromUrl.disabled) {
    const fallback = enabledPages.find(p => p.id > pageId) || enabledPages[enabledPages.length - 1] || enabledPages[0];
    if (fallback) {
      window.location.replace(`chapter.html?page=${fallback.id}`);
    }
    return;
  }

  const page = pageFromUrl;

  let currentPage = page;
  let isPrologueTransitioning = false;
  let isChapterOneTransitioning = false;
  let isChapterTwoTransitioning = false;
  let isChapterThreeTransitioning = false;
  let chapter1NextStart = null; 
  let chapter2NextStart = null;
  let chapter3NextStart = null;
  
  const chapter1PageStarts = new Map();
  const chapter2PageStarts = new Map();
  const chapter3PageStarts = new Map();
  let isChapterFourTransitioning = false;
  let _audioLayoutPass = false; 
  let isChapterFiveTransitioning = false;
  let isChapterSixTransitioning = false;
  let chapter4NextStart = null;
  let chapter5NextStart = null;
  let chapter6NextStart = null;
  const chapter4PageStarts = new Map();
  const chapter5PageStarts = new Map();
  const chapter6PageStarts = new Map();
  let isChapterSevenTransitioning = false;
  let chapter7NextStart = null;
  const chapter7PageStarts = new Map();
  let isChapterEightTransitioning = false;
  let chapter8NextStart = null;
  const chapter8PageStarts = new Map();
  let isChapterNineTransitioning = false;
  let chapter9NextStart = null;
  const chapter9PageStarts = new Map();
  let isChapterTenTransitioning = false;
  let chapter10NextStart = null;
  const chapter10PageStarts = new Map();
  let isChapterElevenTransitioning = false;
  let chapter11NextStart = null;
  const chapter11PageStarts = new Map();
  let isChapterTwelveTransitioning = false;
  let chapter12NextStart = null;
  const chapter12PageStarts = new Map();
  let isChapterThirteenTransitioning = false;
  let chapter13NextStart = null;
  const chapter13PageStarts = new Map();
  let isChapterFourteenTransitioning = false;
  let chapter14NextStart = null;
  const chapter14PageStarts = new Map();
  let isChapterFifteenTransitioning = false;
  let chapter15NextStart = null;
  const chapter15PageStarts = new Map();
  let isEpilogueTransitioning = false;
  let epilogueNextStart = null;
  const epiloguePageStarts = new Map();
  const flowStateStorageKey = 'bookFlowState.v25';

  function mapToObject(map) {
    const obj = {};
    for (const [key, value] of map.entries()) {
      obj[String(key)] = value;
    }
    return obj;
  }

  function hydrateMap(map, obj) {
    if (!obj || typeof obj !== 'object') return;
    Object.entries(obj).forEach(([key, value]) => {
      const pageNum = Number(key);
      const startNum = Number(value);
      if (Number.isFinite(pageNum) && Number.isFinite(startNum)) {
        map.set(pageNum, startNum);
      }
    });
  }

  function saveFlowState() {
    try {
      sessionStorage.setItem(flowStateStorageKey, JSON.stringify({
        chapter1PageStarts: mapToObject(chapter1PageStarts),
        chapter2PageStarts: mapToObject(chapter2PageStarts),
        chapter3PageStarts: mapToObject(chapter3PageStarts),
        chapter4PageStarts: mapToObject(chapter4PageStarts),
        chapter5PageStarts: mapToObject(chapter5PageStarts),
        chapter6PageStarts: mapToObject(chapter6PageStarts),
        chapter7PageStarts: mapToObject(chapter7PageStarts),
        chapter8PageStarts: mapToObject(chapter8PageStarts),
        chapter9PageStarts: mapToObject(chapter9PageStarts),
        chapter10PageStarts: mapToObject(chapter10PageStarts),
        chapter11PageStarts: mapToObject(chapter11PageStarts),
        chapter12PageStarts: mapToObject(chapter12PageStarts),
        chapter13PageStarts: mapToObject(chapter13PageStarts),
        chapter14PageStarts: mapToObject(chapter14PageStarts),
        chapter15PageStarts: mapToObject(chapter15PageStarts),
        epiloguePageStarts: mapToObject(epiloguePageStarts),
        chapter1NextStart,
        chapter2NextStart,
        chapter3NextStart,
        chapter4NextStart,
        chapter5NextStart,
        chapter6NextStart,
        chapter7NextStart,
        chapter8NextStart,
        chapter9NextStart,
        chapter10NextStart,
        chapter11NextStart,
        chapter12NextStart,
        chapter13NextStart,
        chapter14NextStart,
        chapter15NextStart,
        epilogueNextStart
      }));
      try { localStorage.setItem('bookLastPageId', currentPage.id); } catch (_) {}
    } catch (e) {
      
    }
  }

  function loadFlowState() {
    try {
      const raw = sessionStorage.getItem(flowStateStorageKey);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      hydrateMap(chapter1PageStarts, parsed.chapter1PageStarts);
      hydrateMap(chapter2PageStarts, parsed.chapter2PageStarts);
      hydrateMap(chapter3PageStarts, parsed.chapter3PageStarts);
      hydrateMap(chapter4PageStarts, parsed.chapter4PageStarts);
      hydrateMap(chapter5PageStarts, parsed.chapter5PageStarts);
      hydrateMap(chapter6PageStarts, parsed.chapter6PageStarts);
      hydrateMap(chapter7PageStarts, parsed.chapter7PageStarts);
      hydrateMap(chapter8PageStarts, parsed.chapter8PageStarts);
      hydrateMap(chapter9PageStarts, parsed.chapter9PageStarts);
      hydrateMap(chapter10PageStarts, parsed.chapter10PageStarts);
      hydrateMap(chapter11PageStarts, parsed.chapter11PageStarts);
      hydrateMap(chapter12PageStarts, parsed.chapter12PageStarts);
      hydrateMap(chapter13PageStarts, parsed.chapter13PageStarts);
      hydrateMap(chapter14PageStarts, parsed.chapter14PageStarts);
      hydrateMap(chapter15PageStarts, parsed.chapter15PageStarts);
      hydrateMap(epiloguePageStarts, parsed.epiloguePageStarts);
      if (Number.isFinite(parsed.chapter1NextStart)) chapter1NextStart = parsed.chapter1NextStart;
      if (Number.isFinite(parsed.chapter2NextStart)) chapter2NextStart = parsed.chapter2NextStart;
      if (Number.isFinite(parsed.chapter3NextStart)) chapter3NextStart = parsed.chapter3NextStart;
      if (Number.isFinite(parsed.chapter4NextStart)) chapter4NextStart = parsed.chapter4NextStart;
      if (Number.isFinite(parsed.chapter5NextStart)) chapter5NextStart = parsed.chapter5NextStart;
      if (Number.isFinite(parsed.chapter6NextStart)) chapter6NextStart = parsed.chapter6NextStart;
      if (Number.isFinite(parsed.chapter7NextStart)) chapter7NextStart = parsed.chapter7NextStart;
      if (Number.isFinite(parsed.chapter8NextStart)) chapter8NextStart = parsed.chapter8NextStart;
      if (Number.isFinite(parsed.chapter9NextStart)) chapter9NextStart = parsed.chapter9NextStart;
      if (Number.isFinite(parsed.chapter10NextStart)) chapter10NextStart = parsed.chapter10NextStart;
      if (Number.isFinite(parsed.chapter11NextStart)) chapter11NextStart = parsed.chapter11NextStart;
      if (Number.isFinite(parsed.chapter12NextStart)) chapter12NextStart = parsed.chapter12NextStart;
      if (Number.isFinite(parsed.chapter13NextStart)) chapter13NextStart = parsed.chapter13NextStart;
      if (Number.isFinite(parsed.chapter14NextStart)) chapter14NextStart = parsed.chapter14NextStart;
      if (Number.isFinite(parsed.chapter15NextStart)) chapter15NextStart = parsed.chapter15NextStart;
      if (Number.isFinite(parsed.epilogueNextStart)) epilogueNextStart = parsed.epilogueNextStart;
    } catch (e) {
      
    }
  }

  loadFlowState();

  function resetAllFlowCaches() {
    chapter1NextStart = null; chapter2NextStart = null; chapter3NextStart = null;
    chapter4NextStart = null; chapter5NextStart = null; chapter6NextStart = null;
    chapter7NextStart = null; chapter8NextStart = null; chapter9NextStart = null;
    chapter10NextStart = null; chapter11NextStart = null; chapter12NextStart = null;
    chapter13NextStart = null; chapter14NextStart = null; chapter15NextStart = null;
    epilogueNextStart = null;
    chapter1PageStarts.clear(); chapter2PageStarts.clear(); chapter3PageStarts.clear();
    chapter4PageStarts.clear(); chapter5PageStarts.clear(); chapter6PageStarts.clear();
    chapter7PageStarts.clear(); chapter8PageStarts.clear(); chapter9PageStarts.clear();
    chapter10PageStarts.clear(); chapter11PageStarts.clear(); chapter12PageStarts.clear();
    chapter13PageStarts.clear(); chapter14PageStarts.clear(); chapter15PageStarts.clear();
    epiloguePageStarts.clear();
    try { sessionStorage.removeItem(flowStateStorageKey); } catch (e) {}
  }

  async function reRenderCurrentPage() {
    const pg = currentPage;
    const start = pg.bookStart;
    if (pg.type === 'prologue') {
      await populatePrologueText(pg);
    } else if (pg.type === 'birthday' || pg.type === 'chapter1') {
      await populateChapterOneText(pg, start);
      chapter1PageStarts.set(pg.id, start);
    } else if (pg.type === 'chapter2-opening' || pg.type === 'chapter2') {
      await populateChapterTwoText(pg, start);
      chapter2PageStarts.set(pg.id, start);
    } else if (pg.type === 'chapter3') {
      await populateChapterThreeText(pg, start);
      chapter3PageStarts.set(pg.id, start);
    } else if (pg.type === 'chapter4') {
      await populateChapterFourText(pg, start);
      chapter4PageStarts.set(pg.id, start);
    } else if (pg.type === 'chapter5') {
      await populateChapterFiveText(pg, start);
      chapter5PageStarts.set(pg.id, start);
    } else if (pg.type === 'chapter6') {
      await populateChapterSixText(pg, start);
      chapter6PageStarts.set(pg.id, start);
    } else if (pg.type === 'chapter7') {
      await populateChapterSevenText(pg, start);
      chapter7PageStarts.set(pg.id, start);
    } else if (pg.type === 'chapter8') {
      await populateChapterEightText(pg, start);
      chapter8PageStarts.set(pg.id, start);
    } else if (pg.type === 'chapter9') {
      await populateChapterNineText(pg, start);
      chapter9PageStarts.set(pg.id, start);
    } else if (pg.type === 'chapter10') {
      await populateChapterTenText(pg, start);
      chapter10PageStarts.set(pg.id, start);
    } else if (pg.type === 'chapter11') {
      await populateChapterElevenText(pg, start);
      chapter11PageStarts.set(pg.id, start);
    } else if (pg.type === 'chapter12') {
      await populateChapterTwelveText(pg, start);
      chapter12PageStarts.set(pg.id, start);
    } else if (pg.type === 'chapter13') {
      await populateChapterThirteenText(pg, start);
      chapter13PageStarts.set(pg.id, start);
    } else if (pg.type === 'chapter14') {
      await populateChapterFourteenText(pg, start);
      chapter14PageStarts.set(pg.id, start);
    } else if (pg.type === 'chapter15') {
      await populateChapterFifteenText(pg, start);
      chapter15PageStarts.set(pg.id, start);
    } else if (pg.type === 'epilogue') {
      await populateEpilogueText(pg, start);
      epiloguePageStarts.set(pg.id, start);
    }
    saveFlowState();
  }

  function updateNavButtons() {
    const prevBtn = document.querySelector('.chapter-nav__prev');
    const hasPrev = Boolean(findPrevPage(currentPage.id));
    prevBtn.disabled = !hasPrev;
  }

  const animationEnabled = localStorage.getItem('animationEnabled') !== 'false';

  const chapterBg = document.querySelector('.chapter-bg');
  if (page.bg) chapterBg.classList.add(page.bg);

  function mkVideo(id, hiddenByDefault) {
    const v = document.createElement('video');
    v.id = id;
    v.autoplay = true;
    v.loop = true;
    v.muted = true;
    v.preload = 'metadata';
    v.setAttribute('playsinline', '');
    if (hiddenByDefault) v.style.opacity = '0';
    return v;
  }

  const sceneEl = document.createElement('div');
  sceneEl.className = 'chapter-scene';

  const waterlight = document.createElement('video');
  waterlight.className = 'scene-waterlight';
  waterlight.src = 'video/page0/waterLight.webm';
  waterlight.autoplay = true;
  waterlight.loop = true;
  waterlight.muted = true;
  waterlight.preload = 'metadata';
  waterlight.setAttribute('playsinline', '');
  sceneEl.appendChild(waterlight);

  const sceneGroup = document.createElement('div');
  sceneGroup.className = 'scene-group';
  const video1 = mkVideo('video1', false);
  const video2 = mkVideo('video2', true);
  const video3 = mkVideo('video3', false);
  const video4 = mkVideo('video4', true);
  sceneGroup.append(video1, video2, video3, video4);
  sceneEl.appendChild(sceneGroup);
  
  function loadVideo(el, src) {
    if (!src) return;
    
    el.preload = 'metadata';
    
    var deferLoad = typeof requestIdleCallback !== 'undefined'
      ? function (cb) { requestIdleCallback(cb); }
      : function (cb) { setTimeout(cb, 50); };
    
    deferLoad(function () {
      el.src = src;
    });

    if (!animationEnabled) {
      el.pause();
      el.removeAttribute('autoplay');
    }
  }

  loadVideo(video1, page.video1);
  loadVideo(video2, page.video2);
  loadVideo(video3, page.video3);
  loadVideo(video4, page.video4);

  if (page.type === 'scene') {
    // Keep chapter-loader visible until ALL visible scene videos are buffered.
    // loader.js hides #global-loader on window.load (before videos are ready), so we need
    // chapter-loader as a secondary cover to prevent a flash of empty/blank video areas.
    // isLoaderActive=true means crossChapterNavigate already showed chapter-loader (lines 58-65);
    // otherwise we show it ourselves here.
    var _sceneLoader = document.querySelector('.chapter-loader');
    if (_sceneLoader && !isLoaderActive) {
      _sceneLoader.style.opacity       = '1';
      _sceneLoader.style.pointerEvents = 'auto';
    }

    var _vidReady  = 0;
    var _vidNeeded = (page.video1 ? 1 : 0) + (page.video3 ? 1 : 0);
    var _sceneHidden = false;

    function _hideSceneLoader() {
      if (_sceneHidden) return;
      _sceneHidden = true;
      if (_sceneLoader) {
        requestAnimationFrame(function () {
          _sceneLoader.style.transition = 'opacity 500ms ease';
          requestAnimationFrame(function () {
            _sceneLoader.style.opacity = '0';
            setTimeout(function () {
              _sceneLoader.style.transition    = '';
              _sceneLoader.style.pointerEvents = 'none';
            }, 550);
          });
        });
      }
    }

    function _onVidReady() {
      if (++_vidReady < _vidNeeded) return;
      _hideSceneLoader();
    }

    if (page.video1 && window.GlobalLoader) {
      // Also hide global-loader when first video is ready (in case window.load is slow)
      video1.addEventListener('canplaythrough', function () { window.GlobalLoader.hide(); }, { once: true });
    }
    if (page.video1) {
      video1.addEventListener('canplaythrough', _onVidReady, { once: true });
      video1.addEventListener('error',          _onVidReady, { once: true });
    }
    if (page.video3) {
      video3.addEventListener('canplaythrough', _onVidReady, { once: true });
      video3.addEventListener('error',          _onVidReady, { once: true });
    }
    setTimeout(_hideSceneLoader, 8000);  // safety: reveal even if videos never fire
  }

  if (page.type === 'birthday' && page.video2) {
    video2.style.opacity = '1';
  }
  if (page.type === 'birthday' && page.video3) {
    video3.style.opacity = '0';
    
    video3.pause();
    try {
      video3.currentTime = 0;
    } catch (e) {
      
    }
  }

  const textLeft  = document.querySelector('.chapter-text--left');
  const textRight = document.querySelector('.chapter-text--right');
  const screen = document.querySelector('.screen');
  screen.appendChild(sceneEl);

  if (document.documentElement.classList.contains('no-animations')) {
    screen.querySelectorAll('video').forEach(function (v) { v.pause(); });
    new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        m.addedNodes.forEach(function (node) {
          if (!(node instanceof HTMLElement)) return;
          if (node.tagName === 'VIDEO') {
            node.pause();
          }
          node.querySelectorAll && node.querySelectorAll('video').forEach(function (v) { v.pause(); });
        });
      });
    }).observe(screen, { childList: true, subtree: true });
  }

  function findPageById(id) {
    return pages.find(p => p.id === id && !p.disabled);
  }

  function findPrevPage(fromId) {
    for (let i = enabledPages.length - 1; i >= 0; i -= 1) {
      if (enabledPages[i].id < fromId) return enabledPages[i];
    }
    return null;
  }

  function findNextPage(fromId) {
    for (let i = 0; i < enabledPages.length; i += 1) {
      if (enabledPages[i].id > fromId) return enabledPages[i];
    }
    return null;
  }

  function isSkippableParagraph(raw) {
    return !raw || raw.startsWith('-') || raw.startsWith('=') || /^\d+$/.test(raw.trim());
  }

  function isChapterOneFlowPage(p) {
    return p && (p.type === 'birthday' || p.type === 'chapter1');
  }

  function isChapterTwoFlowPage(p) {
    return p && (p.type === 'chapter2-opening' || p.type === 'chapter2');
  }

  function isChapterThreeFlowPage(p) {
    return p && p.type === 'chapter3';
  }

  function isChapterFourFlowPage(p) {
    return p && p.type === 'chapter4';
  }

  function isChapterFiveFlowPage(p) {
    return p && p.type === 'chapter5';
  }

  function isChapterSixFlowPage(p) {
    return p && p.type === 'chapter6';
  }

  function isChapterSevenFlowPage(p) {
    return p && p.type === 'chapter7';
  }

  function isChapterEightFlowPage(p) {
    return p && p.type === 'chapter8';
  }

  function isChapterNineFlowPage(p) {
    return p && p.type === 'chapter9';
  }

  function isChapterTenFlowPage(p) {
    return p && p.type === 'chapter10';
  }

  function isChapterElevenFlowPage(p) {
    return p && p.type === 'chapter11';
  }

  function isChapterTwelveFlowPage(p) {
    return p && p.type === 'chapter12';
  }

  function isChapterThirteenFlowPage(p) {
    return p && p.type === 'chapter13';
  }

  function isChapterFourteenFlowPage(p) {
    return p && p.type === 'chapter14';
  }

  function isChapterFifteenFlowPage(p) {
    return p && p.type === 'chapter15';
  }

  function isEpilogueFlowPage(p) {
    return p && p.type === 'epilogue';
  }

  function hintsEnabled() {
    return localStorage.getItem('hintsEnabled') !== 'false';
  }

  function createRippleHint(sceneClass) {
    const hint = document.createElement('div');
    hint.className = 'ripple-hint ' + sceneClass;
    const ring3 = document.createElement('div');
    ring3.className = 'ring3';
    hint.appendChild(ring3);
    hint.style.opacity = '0';
    const animEnabled = localStorage.getItem('animationEnabled') !== 'false';
    if (!animEnabled) { hint.style.animation = 'none'; }
    return hint;
  }

  function showRippleHint(hint) {
    if (!hint || !hintsEnabled()) return;
    hint.style.opacity = '1';
  }

  function hideRippleHint(hint, permanent) {
    if (!hint) return;
    hint.style.opacity = '0';
    if (permanent) {
      setTimeout(() => { if (hint.parentNode) hint.parentNode.removeChild(hint); }, 600);
    }
  }

  function positionHintOver(hint, targetEl) {
    if (!hint || !targetEl) return;
    var parent = hint.parentElement;
    if (!parent) return;
    var tr = targetEl.getBoundingClientRect();
    var pr = parent.getBoundingClientRect();
    if (tr.width === 0 && tr.height === 0) return;
    
    hint.style.setProperty('--_hx', (tr.left - pr.left + tr.width / 2) + 'px');
    hint.style.setProperty('--_hy', (tr.top  - pr.top  + tr.height / 2) + 'px');
    hint._target = targetEl;
  }

  window.addEventListener('resize', function () {
    screen.querySelectorAll('.ripple-hint').forEach(function (h) {
      if (h._target) positionHintOver(h, h._target);
    });
  });
  
  function findParagraphIndex(fromIndex, predicate) {
    for (let i = Math.max(0, fromIndex); i < bookParagraphs.length; i += 1) {
      if (predicate(bookParagraphs[i], i)) return i;
    }
    return -1;
  }

  function getPrologueTitle() {
    return document.querySelector('.chapter-prologue-title');
  }

  function getChapterOneTitle() {
    return document.querySelector('.chapter-one-title');
  }

  function getChapterTwoTitle() {
    return document.querySelector('.chapter-two-title');
  }

  function ensurePrologueDecor() {
    if (screen.querySelector('.prologue-tree--1')) return Promise.resolve();

    const tree1 = document.createElement('div');
    tree1.className = 'prologue-illus prologue-tree prologue-tree--1';
    const tree2 = document.createElement('div');
    tree2.className = 'prologue-illus prologue-tree prologue-tree--2';
    const house = document.createElement('div');
    house.className = 'prologue-illus prologue-house';

    return new Promise(function (resolve) {
      let loaded = 0;
      let done = false;
      function finish() {
        if (done) return;
        done = true;
        if (!screen.querySelector('.prologue-tree--1')) {
          screen.appendChild(tree1);
          screen.appendChild(tree2);
          screen.appendChild(house);
        }
        resolve();
      }
      // Safety: don't block the page forever on slow connections
      setTimeout(finish, 2000);
      ['./svg/prologue/tree01.svg', './svg/prologue/tree02.svg', './svg/prologue/house0.svg'].forEach(function (src) {
        const img = new Image();
        img.onload = img.onerror = function () {
          if (++loaded < 3) return;
          finish();
        };
        img.src = src;
      });
    });
  }

  function syncPrologueTitle(prologuePage) {
    const existingTitle = getPrologueTitle();

    if (prologuePage.showTitle) {
      if (existingTitle) return;

      const title = document.createElement('div');
      title.className = 'chapter-prologue-title';
      title.innerHTML = '<img class="chapter-title-img" src="./images/titles/prologue.png" alt="Пролог">';
      textLeft.parentElement.insertBefore(title, textLeft);
      return;
    }

    if (existingTitle) existingTitle.remove();
  }

  function syncChapterOneTitle(chapterPage) {
    const existingTitle = getChapterOneTitle();

    if (chapterPage.showTitle) {
      if (existingTitle) return;

      const title = document.createElement('div');
      title.className = 'chapter-one-title';
      title.innerHTML = '<img class="chapter-title-img" src="./images/titles/1.png" alt="Глава 1">';
      textLeft.parentElement.insertBefore(title, textLeft);
      return;
    }

    if (existingTitle) existingTitle.remove();
  }

  function syncChapterTwoTitle(chapterPage) {
    const existingTitle = getChapterTwoTitle();

    if (chapterPage.showTitle) {
      if (existingTitle) return;

      const title = document.createElement('div');
      title.className = 'chapter-two-title';
      title.innerHTML = '<img class="chapter-title-img" src="./images/titles/2.png" alt="Глава 2">';
      textLeft.parentElement.insertBefore(title, textLeft);
      return;
    }

    if (existingTitle) existingTitle.remove();
  }

  function ensureChapterTwoSceneDecor() {
    if (screen.querySelector('.chapter2-scene-decor')) return;

    const decor = document.createElement('div');
    decor.className = 'chapter2-scene-decor';

    const group = document.createElement('div');
    group.className = 'chapter2-scene-group';

    const parts = [
      'bg',
      'cloud1',
      'cloud2',
      'road',
      'people',
      'bush1',
      'bush2',
      'bush3',
      'bush4',
      'bush5',
      'bush6',
      'bush7',
      'video'
    ];

    parts.forEach(part => {
      if (part === 'video') {
        const el = document.createElement('video');
        el.className = 'chapter2-scene-decor__video';
        el.src = './video/chapter2/chapter2.webm';
        el.autoplay = true;
        el.loop = true;
        el.muted = true;
        el.playsInline = true;
        el.preload = 'metadata';
        group.appendChild(el);
        return;
      }

      const el = document.createElement('div');
      el.className = `chapter2-scene-decor__${part}`;
      group.appendChild(el);
    });

    decor.appendChild(group);
    screen.appendChild(decor);
  }

  async function populatePrologueText(prologuePage) {
    textLeft.innerHTML = '';
    textRight.innerHTML = '';
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    textRight.style.display = '';
    document.body.classList.add('prologue-page');
    document.body.classList.toggle('prologue-opening', Boolean(prologuePage.showTitle));
    if (window.AudioManager && !_audioLayoutPass) AudioManager.setSceneAmbient(null);

    syncPrologueTitle(prologuePage);
    await ensurePrologueDecor();

    await document.fonts.ready;
    
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const leftRect  = textLeft.getBoundingClientRect();

    const rightStyle  = window.getComputedStyle(textRight);
    const rightTop    = textRight.getBoundingClientRect().top;
    const rightMaxH   = parseFloat(rightStyle.maxHeight) || window.innerHeight * 0.45;
    const rightBottom = rightTop + rightMaxH;

    let col = 'left';

    for (let i = prologuePage.bookStart; i < prologuePage.bookEnd; i++) {
      const raw = bookParagraphs[i];
      if (!raw || raw.startsWith('-') || raw.startsWith('=')) continue;
      const p = document.createElement('p');
      p.textContent = raw;

      if (col === 'left') {
        textLeft.appendChild(p);
        if (p.getBoundingClientRect().bottom > leftRect.bottom) {
          textLeft.removeChild(p);
          col = 'right';
          textRight.appendChild(p);
        }
      } else {
        textRight.appendChild(p);
        if (p.getBoundingClientRect().bottom > rightBottom) {
          textRight.removeChild(p);
          break;
        }
      }
    }
  }

  function ensureChapterOneDecor(chapterPage) {
    let decor = screen.querySelector('.chapter1-decor');
    if (!decor) {
      decor = document.createElement('div');
      decor.className = 'chapter1-decor';

      const flags = document.createElement('div');
      flags.className = 'chapter1-flags';
      decor.appendChild(flags);

      const clouds = document.createElement('div');
      clouds.className = 'chapter1-clouds';
      decor.appendChild(clouds);

      const balloonClasses = [
        'chapter1-balloon--1',
        'chapter1-balloon--2',
        'chapter1-balloon--3',
        'chapter1-balloon--4',
        'chapter1-balloon--5',
        'chapter1-balloon--6',
        'chapter1-balloon--7'
      ];

      balloonClasses.forEach(className => {
        const balloon = document.createElement('div');
        balloon.className = `chapter1-balloon ${className}`;
        decor.appendChild(balloon);
      });

      for (let index = 1; index <= 12; index += 1) {
        const star = document.createElement('div');
        star.className = `chapter1-star chapter1-star--${index}`;
        decor.appendChild(star);
      }

      screen.appendChild(decor);
    }

      const existingHero = decor.querySelector('.chapter1-hero');
      if (existingHero) existingHero.remove();
  }

  function ensureChapterOneScene9Decor() {
    if (screen.querySelector('.ch1-scene9-decor')) return;
    const container = document.createElement('div');
    container.className = 'ch1-scene9-decor';
    const group = document.createElement('div');
    group.className = 'ch1-scene9-group';
    const curtain = document.createElement('img');
    curtain.src = './svg/ch1/leftcurtain.svg';
    curtain.alt = '';
    curtain.className = 'ch1-curtain';

    const windowVid = document.createElement('video');
    windowVid.src = './video/chapter1/window.webm';
    windowVid.className = 'ch1-window';
    windowVid.autoplay = true;
    windowVid.loop = true;
    windowVid.muted = true;
    windowVid.playsInline = true;
    windowVid.preload = 'auto';
    windowVid.playbackRate = 0.7;
    windowVid.style.opacity = '0';
    windowVid.style.transition = 'opacity 0.7s ease';

    const catVid = document.createElement('video');
    catVid.src = './video/chapter1/cat.webm';
    catVid.className = 'ch1-cat';
    catVid.autoplay = true;
    catVid.loop = true;
    catVid.muted = true;
    catVid.playsInline = true;
    catVid.preload = 'auto';
    catVid.style.cursor = 'pointer';
    catVid.style.opacity = '0';
    catVid.style.transition = 'opacity 0.7s ease';

    // Fade in both videos together once either is ready (with fallback)
    let scene9Ready = false;
    function showScene9Videos() {
      if (scene9Ready) return;
      scene9Ready = true;
      windowVid.style.opacity = '1';
      catVid.style.opacity = '1';
    }
    windowVid.addEventListener('canplay', showScene9Videos, { once: true });
    catVid.addEventListener('canplay', showScene9Videos, { once: true });
    setTimeout(showScene9Videos, 3000);

    let catClicked = false;
    let catRafId = null;

    function stopCatLoop() {
      if (catRafId !== null) { cancelAnimationFrame(catRafId); catRafId = null; }
    }

    function startCatLoop() {
      catVid.loop = true;
      catVid.playbackRate = 1;
      if (catVid.paused) catVid.play().catch(() => {});
      function tick() {
        if (catVid.currentTime >= 1) catVid.currentTime = 0;
        catRafId = requestAnimationFrame(tick);
      }
      catRafId = requestAnimationFrame(tick);
    }

    catVid.addEventListener('canplay', () => {
      if (!catClicked) startCatLoop();
    }, { once: true });

    const catHint = createRippleHint('ripple-hint--cat');
    group.appendChild(catHint);

    catVid.addEventListener('click', () => {
      if (catClicked) return;
      catClicked = true;
      hideRippleHint(catHint, false);
      stopCatLoop();
      catVid.loop = false;
      catVid.play();
    });

    catVid.addEventListener('ended', () => {
      if (!catClicked) return;
      catVid.currentTime = 0;
      startCatLoop();
      setTimeout(() => {
        catClicked = false;
        positionHintOver(catHint, catVid);
        showRippleHint(catHint);
      }, 600);
    });

    group.appendChild(curtain);
    group.appendChild(windowVid);
    group.appendChild(catVid);
    container.appendChild(group);
    screen.appendChild(container);
  }

  async function populateChapterOneText(chapterPage, startOverride = null) {
    const isScene9 = chapterPage.scene === 'ch1-scene9';
    if (!isScene9) screen.querySelectorAll('.ch1-scene9-decor').forEach(el => el.remove());

    textLeft.innerHTML = '';
    textRight.innerHTML = '';
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    textRight.style.display = '';
    document.body.classList.add('chapter1-page');
    document.body.classList.toggle('chapter1-opening', Boolean(chapterPage.showTitle));
    document.body.classList.toggle('chapter1-scene9-mode', isScene9);
    if (window.AudioManager && !_audioLayoutPass) AudioManager.setSceneAmbient(isScene9 ? 'music/ambient/birds.mp3' : null);
    if (isScene9) ensureChapterOneScene9Decor();

    syncChapterOneTitle(chapterPage);
    ensureChapterOneDecor(chapterPage);

    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const leftRect = textLeft.getBoundingClientRect();
    const rightRect = textRight.getBoundingClientRect();
    let col = 'left';

    const start = (startOverride !== null) ? startOverride : chapterPage.bookStart;
    
    let lastRendered = start;

    for (let i = start; i < bookParagraphs.length; i++) {
      const raw = bookParagraphs[i];
      
      if (raw && /^\d+$/.test(raw.trim())) break;
      if (isSkippableParagraph(raw)) continue;

      const p = document.createElement('p');
      p.textContent = raw;

      if (col === 'left') {
        textLeft.appendChild(p);
        if (p.getBoundingClientRect().bottom > leftRect.bottom) {
          textLeft.removeChild(p);
          col = 'right';
          textRight.appendChild(p);
          if (p.getBoundingClientRect().bottom > rightRect.bottom) {
            textRight.removeChild(p);
            lastRendered = i;
            break;
          }
        }
      } else {
        textRight.appendChild(p);
        if (p.getBoundingClientRect().bottom > rightRect.bottom) {
          textRight.removeChild(p);
          lastRendered = i;
          break;
        }
      }
      if (isScene9 && col === 'left' && raw && raw.includes('У меня были книги, а теперь')) {
        textLeft.removeChild(p);
        col = 'right';
        textRight.appendChild(p);
      }
      lastRendered = i + 1;
      if (isScene9 && raw && raw.includes('меня не было дома')) break;
    }

    chapter1NextStart = lastRendered;
    saveFlowState();
  }

  async function populateChapterTwoText(chapterPage, startOverride = null) {
    textLeft.innerHTML = '';
    textRight.innerHTML = '';
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    textRight.style.display = '';
    document.body.classList.add('chapter2-page');
    document.body.classList.toggle('chapter2-opening', Boolean(chapterPage.showTitle));
    if (window.AudioManager && !_audioLayoutPass) AudioManager.setSceneAmbient('music/ambient/birds.mp3');

    syncChapterTwoTitle(chapterPage);

    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const scenePageId = 14;
    const scenePageMarker = 'Она была намного взрослее меня, одиннадцати лет';
    const sceneStartIndex = findParagraphIndex(chapterPage.bookStart, raw => Boolean(raw && raw.includes(scenePageMarker)));

    let start = (startOverride !== null) ? startOverride : chapterPage.bookStart;
    const isScenePage = chapterPage.type === 'chapter2' && chapterPage.id === scenePageId;
    if (isScenePage && sceneStartIndex !== -1 && start < sceneStartIndex) {
      start = sceneStartIndex;
    }

    document.body.classList.toggle('chapter2-scene-mode', isScenePage);
    ensureChapterTwoSceneDecor();

    const leftRect = textLeft.getBoundingClientRect();
    const rightRect = textRight.getBoundingClientRect();
    let col = 'left';

    let lastRendered = start;

    if (isScenePage) {
      textRight.innerHTML = '';
      textRight.style.display = 'none';

      for (let i = start; i < bookParagraphs.length; i++) {
        const raw = bookParagraphs[i];
        if (raw && /^\d+$/.test(raw.trim())) break;
        if (isSkippableParagraph(raw)) continue;

        const p = document.createElement('p');
        p.textContent = raw;
        textLeft.appendChild(p);

        if (p.getBoundingClientRect().bottom > leftRect.bottom) {
          textLeft.removeChild(p);
          lastRendered = i;
          break;
        }
        lastRendered = i + 1;
      }
    } else {
      for (let i = start; i < bookParagraphs.length; i++) {
        if (chapterPage.type === 'chapter2' && chapterPage.id < scenePageId && sceneStartIndex !== -1 && i >= sceneStartIndex) {
          lastRendered = i;
          break;
        }
        const raw = bookParagraphs[i];
        if (raw && /^\d+$/.test(raw.trim())) break;
        if (isSkippableParagraph(raw)) continue;

        const p = document.createElement('p');
        p.textContent = raw;

        if (col === 'left') {
          textLeft.appendChild(p);
          if (p.getBoundingClientRect().bottom > leftRect.bottom) {
            textLeft.removeChild(p);
            col = 'right';
            textRight.appendChild(p);
            if (p.getBoundingClientRect().bottom > rightRect.bottom) {
              textRight.removeChild(p);
              lastRendered = i;
              break;
            }
          }
        } else {
          textRight.appendChild(p);
          if (p.getBoundingClientRect().bottom > rightRect.bottom) {
            textRight.removeChild(p);
            lastRendered = i;
            break;
          }
        }
        lastRendered = i + 1;
      }
    }

    chapter2NextStart = lastRendered;
    saveFlowState();
  }

  async function buildPageStartsForward(targetPageId, flowFilter, pageStartsMap, populateFn, getNextStart) {
    const chPages = enabledPages.filter(flowFilter).sort((a, b) => a.id - b.id);
    if (chPages.length === 0) return;
    let ns = chPages[0].bookStart;
    _audioLayoutPass = true;
    try {
      for (const pg of chPages) {
        if (pg.id >= targetPageId) {
          if (!pageStartsMap.has(pg.id)) pageStartsMap.set(pg.id, ns);
          break;
        }
        const pgStart = pageStartsMap.has(pg.id) ? pageStartsMap.get(pg.id) : ns;
        await populateFn(pg, pgStart);
        pageStartsMap.set(pg.id, pgStart);
        ns = getNextStart() ?? ns;
      }
    } finally {
      _audioLayoutPass = false;
    }
    saveFlowState();
  }

  async function transitionWithinPrologue(nextPage, updateHistory = true) {
    if (isPrologueTransitioning) return;
    isPrologueTransitioning = true;

    document.body.classList.add('prologue-text-transition');
    await new Promise(resolve => setTimeout(resolve, 260));

    await populatePrologueText(nextPage);
    currentPage = nextPage;

    if (updateHistory) {
      history.pushState({ pageId: nextPage.id }, '', `chapter.html?page=${nextPage.id}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('prologue-text-transition');
        setTimeout(() => {
          isPrologueTransitioning = false;
        }, 260);
      });
    });
  }

  async function transitionWithinChapterOne(nextPage, updateHistory = true) {
    if (isChapterOneTransitioning) return;
    isChapterOneTransitioning = true;

    const goingForward = nextPage.id > currentPage.id;
    const isEnteringScene9 = nextPage.scene === 'ch1-scene9' && currentPage.scene !== 'ch1-scene9';
    const isLeavingScene9  = currentPage.scene === 'ch1-scene9' && nextPage.scene !== 'ch1-scene9';

    if (isLeavingScene9) {
      const decor = screen.querySelector('.ch1-scene9-decor');
      if (decor) { decor.style.transition = 'opacity 260ms ease'; decor.style.opacity = '0'; }
    }

    document.body.classList.add('chapter1-text-transition');
    const _waitMs = new Promise(r => setTimeout(r, 260));
    if (!goingForward && !chapter1PageStarts.has(nextPage.id)) {
      await Promise.all([_waitMs, buildPageStartsForward(nextPage.id, isChapterOneFlowPage, chapter1PageStarts, populateChapterOneText, () => chapter1NextStart)]);
    } else {
      await _waitMs;
    }

    const cachedStart = chapter1PageStarts.get(nextPage.id);
    let startOverride = cachedStart !== undefined ? cachedStart : nextPage.bookStart;

    if (goingForward) {
      const candidateStart = chapter1NextStart !== null ? chapter1NextStart : startOverride;
      startOverride = candidateStart;
    }

    await populateChapterOneText(nextPage, startOverride);
    chapter1PageStarts.set(nextPage.id, startOverride);
    saveFlowState();

    if (isEnteringScene9) {
      const decor = screen.querySelector('.ch1-scene9-decor');
      if (decor) decor.style.opacity = '0';
    }

    if (nextPage.type === 'birthday') {
      if (nextPage.video1) loadVideo(video1, nextPage.video1);
      if (nextPage.video2) {
        loadVideo(video2, nextPage.video2);
        video2.style.transition = '';
        video2.style.opacity = '1';
      }
      if (nextPage.video3) {
        loadVideo(video3, nextPage.video3);
        video3.style.transition = '';
        video3.style.opacity = '0';
        video3.loop = false;
        video3.pause();
        try { video3.currentTime = 0; } catch (e) {  }
      }

      const glow = document.querySelector('.chapter-glow');
      if (glow) glow.classList.remove('glow-state-2');
      if (video2._sceneClickHandler) {
        video2.removeEventListener('click', video2._sceneClickHandler);
      }
      let clickedBirthday = false;
      const birthdayHandler = () => {
        if (clickedBirthday) return;
        clickedBirthday = true;
        if (window.AudioManager) AudioManager.playSound('music/ambient/candle.mp3');
        try { video3.currentTime = 0; } catch (e) {}
        video3.loop = false;
        video3.play().catch(() => {});
        video3.style.transition = 'opacity 0.3s ease';
        video3.style.opacity = '1';
        setTimeout(() => {
          video2.style.transition = 'opacity 0.3s ease';
          video2.style.opacity = '0';
        }, 250);
        if (glow) glow.classList.add('glow-state-2');
      };
      video2._sceneClickHandler = birthdayHandler;
      video2.addEventListener('click', birthdayHandler);
    }

    currentPage = nextPage;

    if (updateHistory) {
      history.pushState({ pageId: nextPage.id }, '', `chapter.html?page=${nextPage.id}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('chapter1-text-transition');

        if (isEnteringScene9) {
          const decor = screen.querySelector('.ch1-scene9-decor');
          if (decor) {
            decor.style.transition = 'opacity 600ms ease';
            decor.style.opacity = '1';
            setTimeout(() => { decor.style.transition = ''; }, 640);
          }
          const catH = screen.querySelector('.ripple-hint--cat');
          setTimeout(() => { positionHintOver(catH, screen.querySelector('.ch1-cat')); showRippleHint(catH); }, 700);
        }

        setTimeout(() => { isChapterOneTransitioning = false; }, 260);
      });
    });
  }

  async function transitionWithinChapterTwo(nextPage, updateHistory = true) {
    if (isChapterTwoTransitioning) return;
    isChapterTwoTransitioning = true;

    const goingForward = nextPage.id > currentPage.id;

    document.body.classList.add('chapter2-text-transition');
    const _waitMs = new Promise(r => setTimeout(r, 260));
    if (!goingForward && !chapter2PageStarts.has(nextPage.id)) {
      await Promise.all([_waitMs, buildPageStartsForward(nextPage.id, isChapterTwoFlowPage, chapter2PageStarts, populateChapterTwoText, () => chapter2NextStart)]);
    } else {
      await _waitMs;
    }

    const cachedStart = chapter2PageStarts.get(nextPage.id);
    let startOverride = cachedStart !== undefined ? cachedStart : nextPage.bookStart;

    if (goingForward) {
      const candidateStart = chapter2NextStart !== null ? chapter2NextStart : startOverride;
      startOverride = candidateStart;
    }

    await populateChapterTwoText(nextPage, startOverride);
    chapter2PageStarts.set(nextPage.id, startOverride);
    saveFlowState();
    currentPage = nextPage;

    if (updateHistory) {
      history.pushState({ pageId: nextPage.id }, '', `chapter.html?page=${nextPage.id}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('chapter2-text-transition');
        setTimeout(() => { isChapterTwoTransitioning = false; }, 260);
      });
    });
  }

  function syncChapterThreeTitle(chapterPage) {
    const existingTitle = document.querySelector('.chapter-three-title');
    if (chapterPage.showTitle) {
      if (existingTitle) return;
      const title = document.createElement('div');
      title.className = 'chapter-three-title';
      title.innerHTML = '<img class="chapter-title-img" src="./images/titles/3.png" alt="Глава 3">';
      textLeft.parentElement.insertBefore(title, textLeft);
      return;
    }
    if (existingTitle) existingTitle.remove();
  }

  function ensureChapterThreeSceneDecor() {
    if (screen.querySelector('.chapter3-scene-decor')) return;

    const decor = document.createElement('div');
    decor.className = 'chapter3-scene-decor';

    const hand1 = document.createElement('video');
    hand1.className = 'chapter3-scene-decor__hand1';
    hand1.src = './video/chapter3/hand1.webm';
    hand1.autoplay = true;
    hand1.loop = true;
    hand1.muted = true;
    hand1.playsInline = true;
    hand1.style.cursor = 'pointer';

    const hand2 = document.createElement('video');
    hand2.className = 'chapter3-scene-decor__hand2';
    hand2.src = './video/chapter3/hand2.webm';
    hand2.muted = true;
    hand2.loop = true;
    hand2.playsInline = true;

    const handHint = createRippleHint('ripple-hint--hand');
    decor.appendChild(handHint);

    let handClicked = false;
    hand1.addEventListener('click', () => {
      if (handClicked) return;
      handClicked = true;
      hideRippleHint(handHint, true);
      hand2.play().catch(() => {});
      hand2.style.transition = 'opacity 0.8s ease';
      hand2.style.opacity = '1';
      hand1.style.transition = 'opacity 0.35s ease';
      hand1.style.opacity = '0';
    });

    const decorHand = document.createElement('video');
    decorHand.className = 'chapter3-scene-decor__decorHand';
    decorHand.src = './video/chapter3/decorHand.webm';
    decorHand.autoplay = true;
    decorHand.loop = true;
    decorHand.muted = true;
    decorHand.playsInline = true;

    decor.appendChild(hand1);
    decor.appendChild(hand2);
    decor.appendChild(decorHand);
    screen.appendChild(decor);
  }

  async function populateChapterThreeText(chapterPage, startOverride = null) {
    textLeft.innerHTML = '';
    textRight.innerHTML = '';
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    textRight.style.display = '';
    document.body.classList.add('chapter3-page');
    document.body.classList.toggle('chapter3-opening', Boolean(chapterPage.showTitle));
    if (window.AudioManager && !_audioLayoutPass) AudioManager.setSceneAmbient(null);

    syncChapterThreeTitle(chapterPage);

    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const chapter3SceneMarker = 'Я проснулся, задыхаясь';
    const sceneStartIndex = findParagraphIndex(chapterPage.bookStart, raw => Boolean(raw && raw.includes(chapter3SceneMarker)));
    const sceneEndIndex = sceneStartIndex !== -1 
      ? findParagraphIndex(sceneStartIndex, raw => Boolean(raw && raw.includes('серебряный шиллинг')))
      : -1;

    const start = (startOverride !== null) ? startOverride : chapterPage.bookStart;
    
    const isScenePage = sceneStartIndex !== -1 && start >= sceneStartIndex && 
      (sceneEndIndex === -1 || start <= sceneEndIndex);

    document.body.classList.toggle('chapter3-scene-mode', isScenePage);
    ensureChapterThreeSceneDecor();

    const leftRect = textLeft.getBoundingClientRect();
    const rightRect = textRight.getBoundingClientRect();
    let lastRendered = start;
    let col = 'left';

    if (isScenePage) {
      textRight.innerHTML = '';
      textRight.style.display = 'none';

      for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
        const raw = bookParagraphs[i];
        if (raw && /^\d+$/.test(raw.trim())) break;
        if (isSkippableParagraph(raw)) continue;

        const p = document.createElement('p');
        p.textContent = raw;
        textLeft.appendChild(p);

        if (p.getBoundingClientRect().bottom > leftRect.bottom) {
          textLeft.removeChild(p);
          lastRendered = i;
          break;
        }
        lastRendered = i + 1;
        
        if (sceneEndIndex !== -1 && i >= sceneEndIndex) {
          lastRendered = i + 1;
          break;
        }
      }
    } else {
      for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
        
        if (sceneStartIndex !== -1 && start < sceneStartIndex && i >= sceneStartIndex) {
          lastRendered = i;
          break;
        }
        const raw = bookParagraphs[i];
        if (raw && /^\d+$/.test(raw.trim())) break;
        if (isSkippableParagraph(raw)) continue;

        const p = document.createElement('p');
        p.textContent = raw;

        if (col === 'left') {
          textLeft.appendChild(p);
          if (p.getBoundingClientRect().bottom > leftRect.bottom) {
            textLeft.removeChild(p);
            col = 'right';
            textRight.appendChild(p);
            if (p.getBoundingClientRect().bottom > rightRect.bottom) {
              textRight.removeChild(p);
              lastRendered = i;
              break;
            }
          }
        } else {
          textRight.appendChild(p);
          if (p.getBoundingClientRect().bottom > rightRect.bottom) {
            textRight.removeChild(p);
            lastRendered = i;
            break;
          }
        }
        lastRendered = i + 1;
      }
    }

    chapter3NextStart = lastRendered;
    saveFlowState();
  }

  async function transitionWithinChapterThree(nextPage, updateHistory = true) {
    if (isChapterThreeTransitioning) return;
    isChapterThreeTransitioning = true;

    const goingForward = nextPage.id > currentPage.id;

    document.body.classList.add('chapter3-text-transition');
    const _waitMs = new Promise(r => setTimeout(r, 260));
    if (!goingForward && !chapter3PageStarts.has(nextPage.id)) {
      await Promise.all([_waitMs, buildPageStartsForward(nextPage.id, isChapterThreeFlowPage, chapter3PageStarts, populateChapterThreeText, () => chapter3NextStart)]);
    } else {
      await _waitMs;
    }

    const cachedStart = chapter3PageStarts.get(nextPage.id);
    let startOverride = cachedStart !== undefined ? cachedStart : nextPage.bookStart;

    if (goingForward) {
      const candidateStart = chapter3NextStart !== null ? chapter3NextStart : startOverride;
      startOverride = candidateStart;
    }

    await populateChapterThreeText(nextPage, startOverride);
    chapter3PageStarts.set(nextPage.id, startOverride);
    saveFlowState();
    currentPage = nextPage;

    if (updateHistory) {
      history.pushState({ pageId: nextPage.id }, '', `chapter.html?page=${nextPage.id}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('chapter3-text-transition');
        if (document.body.classList.contains('chapter3-scene-mode')) {
          const handH = screen.querySelector('.ripple-hint--hand');
          setTimeout(() => { positionHintOver(handH, screen.querySelector('.chapter3-scene-decor__hand1')); showRippleHint(handH); }, 300);
        }
        setTimeout(() => { isChapterThreeTransitioning = false; }, 260);
      });
    });
  }

  function syncChapterFourTitle(chapterPage) {
    const existingTitle = document.querySelector('.chapter-four-title');
    if (chapterPage.showTitle) {
      if (existingTitle) return;
      const title = document.createElement('div');
      title.className = 'chapter-four-title';
      title.innerHTML = '<img class="chapter-title-img" src="./images/titles/4.png" alt="Глава 4">';
      textLeft.parentElement.insertBefore(title, textLeft);
      return;
    }
    if (existingTitle) existingTitle.remove();
  }

  function ensureChapterFourSceneDecor() {
    if (screen.querySelector('.ch4-decor')) return;

    const animEnabled = localStorage.getItem('animationEnabled') !== 'false';

    const container = document.createElement('div');
    container.className = 'ch4-decor';

    const group = document.createElement('div');
    group.className = 'ch4-scene-group';

    function layer(src, cls) {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      if (cls) img.classList.add(cls);
      return img;
    }

    group.appendChild(layer('./svg/ch4/ch4bg.svg', 'ch4-bg'));

    group.appendChild(layer('./svg/ch4/whiteBgLeaf.svg', 'ch4-white-bg-leaf'));

    group.appendChild(layer('./svg/ch4/ground.png', 'ch4-ground'));

    const cloud1 = layer('./svg/ch4/cloud1.svg', 'ch4-cloud1');
    if (animEnabled) cloud1.style.animation = 'cloudFloat1 28s linear infinite';
    group.appendChild(cloud1);

    const cloud2 = layer('./svg/ch4/cloud2.svg', 'ch4-cloud2');
    if (animEnabled) {
      cloud2.style.animation      = 'cloudFloat2 38s linear infinite';
      cloud2.style.animationDelay = '-14s';
    }
    group.appendChild(cloud2);

    group.appendChild(layer('./svg/ch4/TreesBack.svg', 'ch4-trees-back'));

    group.appendChild(layer('./svg/ch4/arcBush1.svg', 'ch4-arc-bush-1'));
    group.appendChild(layer('./svg/ch4/arcBush2.svg', 'ch4-arc-bush-2'));

    group.appendChild(layer('./svg/ch4/TreesFront.svg', 'ch4-trees-front'));

    const videoSide = document.createElement('video');
    videoSide.className = 'ch4-video-side';
    videoSide.src = './video/chapter4/totheside.webm';
    videoSide.autoplay = true;
    videoSide.loop = true;
    videoSide.muted = true;
    videoSide.playsInline = true;
    group.appendChild(videoSide);

    const bushL = layer('./svg/ch4/bushL.svg', 'ch4-bush-l');
    group.appendChild(bushL);

    const leafL3 = layer('./svg/ch4/leafL3.svg', 'ch4-leaf-l3');
    if (!animEnabled) leafL3.style.animation = 'none';
    group.appendChild(leafL3);

    const stampL = layer('./svg/ch4/stampL.svg', 'ch4-stamp-l');
    group.appendChild(stampL);

    const leafL2 = layer('./svg/ch4/LeafL2.svg', 'ch4-leaf-l2');
    if (!animEnabled) leafL2.style.animation = 'none';
    group.appendChild(leafL2);

    const leafR3 = layer('./svg/ch4/leafR3.svg', 'ch4-leaf-r3');
    if (!animEnabled) leafR3.style.animation = 'none';
    group.appendChild(leafR3);

    const leafR2 = layer('./svg/ch4/leafR2.svg', 'ch4-leaf-r2');
    if (!animEnabled) leafR2.style.animation = 'none';
    group.appendChild(leafR2);

    const bushR = layer('./svg/ch4/BushR.svg', 'ch4-bush-r');
    group.appendChild(bushR);

    group.appendChild(layer('./svg/ch4/sun.svg', 'ch4-sun'));

    container.appendChild(group);
    screen.appendChild(container);
  }

  async function populateChapterFourText(chapterPage, startOverride = null) {
    textLeft.innerHTML = '';
    textRight.innerHTML = '';
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    textRight.style.display = '';
    screen.querySelectorAll('.ch4-decor').forEach(el => el.remove());
    document.body.classList.add('chapter4-page');
    document.body.classList.toggle('chapter4-opening', Boolean(chapterPage.showTitle));
    if (window.AudioManager && !_audioLayoutPass) AudioManager.setSceneAmbient('music/ambient/birds.mp3');

    const chapter4ScenePageId = 27;
    const chapter4SceneStopMarker = 'одинокий колокольчик';
    const isScenePage = chapterPage.id === chapter4ScenePageId;

    document.body.classList.toggle('chapter4-scene-mode', isScenePage);
    if (isScenePage) ensureChapterFourSceneDecor();

    syncChapterFourTitle(chapterPage);

    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const leftRect = textLeft.getBoundingClientRect();
    const rightRect = textRight.getBoundingClientRect();
    const start = (startOverride !== null) ? startOverride : chapterPage.bookStart;
    let lastRendered = start;

    if (isScenePage) {
      textRight.innerHTML = '';
      textRight.style.display = 'none';

      for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
        const raw = bookParagraphs[i];
        if (raw && /^\d+$/.test(raw.trim())) break;
        if (isSkippableParagraph(raw)) continue;

        const p = document.createElement('p');
        p.textContent = raw;
        textLeft.appendChild(p);

        if (p.getBoundingClientRect().bottom > leftRect.bottom) {
          textLeft.removeChild(p);
          lastRendered = i;
          break;
        }
        lastRendered = i + 1;

        if (raw.includes(chapter4SceneStopMarker)) break;
      }
    } else {
      let col = 'left';
      for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
        const raw = bookParagraphs[i];
        if (raw && /^\d+$/.test(raw.trim())) break;
        if (isSkippableParagraph(raw)) continue;

        const p = document.createElement('p');
        p.textContent = raw;

        if (col === 'left') {
          textLeft.appendChild(p);
          if (p.getBoundingClientRect().bottom > leftRect.bottom) {
            textLeft.removeChild(p);
            col = 'right';
            textRight.appendChild(p);
            if (p.getBoundingClientRect().bottom > rightRect.bottom) {
              textRight.removeChild(p);
              lastRendered = i;
              break;
            }
          }
        } else {
          textRight.appendChild(p);
          if (p.getBoundingClientRect().bottom > rightRect.bottom) {
            textRight.removeChild(p);
            lastRendered = i;
            break;
          }
        }
        lastRendered = i + 1;
      }
    }

    chapter4NextStart = lastRendered;
    saveFlowState();
  }

  async function transitionWithinChapterFour(nextPage, updateHistory = true) {
    if (isChapterFourTransitioning) return;
    isChapterFourTransitioning = true;

    const goingForward = nextPage.id > currentPage.id;
    const ch4SceneId = 26;
    const isEnteringScene4 = nextPage.id === ch4SceneId && currentPage.id !== ch4SceneId;
    const isLeavingScene4  = currentPage.id === ch4SceneId && nextPage.id !== ch4SceneId;

    if (isLeavingScene4) {
      const decor = screen.querySelector('.ch4-decor');
      if (decor) { decor.style.transition = 'opacity 260ms ease'; decor.style.opacity = '0'; }
    }

    document.body.classList.add('chapter4-text-transition');
    const _waitMs = new Promise(r => setTimeout(r, 260));
    if (!goingForward && !chapter4PageStarts.has(nextPage.id)) {
      await Promise.all([_waitMs, buildPageStartsForward(nextPage.id, isChapterFourFlowPage, chapter4PageStarts, populateChapterFourText, () => chapter4NextStart)]);
    } else {
      await _waitMs;
    }

    const cachedStart = chapter4PageStarts.get(nextPage.id);
    let startOverride = cachedStart !== undefined ? cachedStart : nextPage.bookStart;

    if (goingForward) {
      const candidateStart = chapter4NextStart !== null ? chapter4NextStart : startOverride;
      startOverride = candidateStart;
    }

    await populateChapterFourText(nextPage, startOverride);
    chapter4PageStarts.set(nextPage.id, startOverride);
    saveFlowState();

    if (isEnteringScene4) {
      const decor = screen.querySelector('.ch4-decor');
      if (decor) decor.style.opacity = '0';
    }

    currentPage = nextPage;

    if (updateHistory) {
      history.pushState({ pageId: nextPage.id }, '', `chapter.html?page=${nextPage.id}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('chapter4-text-transition');

        if (isEnteringScene4) {
          const decor = screen.querySelector('.ch4-decor');
          if (decor) {
            decor.style.transition = 'opacity 600ms ease';
            decor.style.opacity = '1';
            setTimeout(() => { decor.style.transition = ''; }, 640);
          }
        }

        setTimeout(() => { isChapterFourTransitioning = false; }, 260);
      });
    });
  }

  function syncChapterFiveTitle(chapterPage) {
    const existingTitle = document.querySelector('.chapter-five-title');
    if (chapterPage.showTitle) {
      if (existingTitle) return;
      const title = document.createElement('div');
      title.className = 'chapter-five-title';
      title.innerHTML = '<img class="chapter-title-img" src="./images/titles/5.png" alt="Глава 5">';
      textLeft.parentElement.insertBefore(title, textLeft);
      return;
    }
    if (existingTitle) existingTitle.remove();
  }

  async function populateChapterFiveText(chapterPage, startOverride = null) {
    textLeft.innerHTML = '';
    textRight.innerHTML = '';
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    textRight.style.display = '';
    document.body.classList.add('chapter5-page');
    document.body.classList.toggle('chapter5-opening', Boolean(chapterPage.showTitle));
    if (window.AudioManager && !_audioLayoutPass) AudioManager.setSceneAmbient(null);

    syncChapterFiveTitle(chapterPage);

    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const leftRect = textLeft.getBoundingClientRect();
    const rightRect = textRight.getBoundingClientRect();
    const start = (startOverride !== null) ? startOverride : chapterPage.bookStart;
    let lastRendered = start;
    let col = 'left';

    for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
      const raw = bookParagraphs[i];
      if (raw && /^\d+$/.test(raw.trim())) break;
      if (isSkippableParagraph(raw)) continue;

      const p = document.createElement('p');
      p.textContent = raw;

      if (col === 'left') {
        textLeft.appendChild(p);
        if (p.getBoundingClientRect().bottom > leftRect.bottom) {
          textLeft.removeChild(p);
          col = 'right';
          textRight.appendChild(p);
          if (p.getBoundingClientRect().bottom > rightRect.bottom) {
            textRight.removeChild(p);
            lastRendered = i;
            break;
          }
        }
      } else {
        textRight.appendChild(p);
        if (p.getBoundingClientRect().bottom > rightRect.bottom) {
          textRight.removeChild(p);
          lastRendered = i;
          break;
        }
      }
      lastRendered = i + 1;
    }

    chapter5NextStart = lastRendered;
    saveFlowState();
  }

  async function transitionWithinChapterFive(nextPage, updateHistory = true) {
    if (isChapterFiveTransitioning) return;
    isChapterFiveTransitioning = true;

    const goingForward = nextPage.id > currentPage.id;

    document.body.classList.add('chapter5-text-transition');
    const _waitMs = new Promise(r => setTimeout(r, 260));
    if (!goingForward && !chapter5PageStarts.has(nextPage.id)) {
      await Promise.all([_waitMs, buildPageStartsForward(nextPage.id, isChapterFiveFlowPage, chapter5PageStarts, populateChapterFiveText, () => chapter5NextStart)]);
    } else {
      await _waitMs;
    }

    const cachedStart = chapter5PageStarts.get(nextPage.id);
    let startOverride = cachedStart !== undefined ? cachedStart : nextPage.bookStart;

    if (goingForward) {
      const candidateStart = chapter5NextStart !== null ? chapter5NextStart : startOverride;
      startOverride = candidateStart;
    }

    await populateChapterFiveText(nextPage, startOverride);
    chapter5PageStarts.set(nextPage.id, startOverride);
    saveFlowState();
    currentPage = nextPage;

    if (updateHistory) {
      history.pushState({ pageId: nextPage.id }, '', `chapter.html?page=${nextPage.id}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('chapter5-text-transition');
        setTimeout(() => { isChapterFiveTransitioning = false; }, 260);
      });
    });
  }

  function syncChapterSixTitle(chapterPage) {
    const existingTitle = document.querySelector('.chapter-six-title');
    if (chapterPage.showTitle) {
      if (existingTitle) return;
      const title = document.createElement('div');
      title.className = 'chapter-six-title';
      title.innerHTML = '<img class="chapter-title-img" src="./images/titles/6.png" alt="Глава 6">';
      textLeft.parentElement.insertBefore(title, textLeft);
      return;
    }
    if (existingTitle) existingTitle.remove();
  }

  function ensureChapterSixSceneDecor() {
    if (screen.querySelector('.chapter6-scene-decor')) return;
    const decor = document.createElement('div');
    decor.className = 'chapter6-scene-decor';

    const video = document.createElement('video');
    video.className = 'chapter6-scene-decor__bg';
    video.src = './video/chapter6/ursula.webm';
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    let isActive = false;
    let rafId = null;

    function startIdleLoop() {
      function tick() {
        if (video.currentTime >= 2) {
          video.currentTime = 0;
        }
        rafId = requestAnimationFrame(tick);
      }
      rafId = requestAnimationFrame(tick);
    }

    function stopIdleLoop() {
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    }

    startIdleLoop();

    const ursulaHint = createRippleHint('ripple-hint--ursula');
    decor.appendChild(ursulaHint);

    video.addEventListener('click', () => {
      if (isActive) return;
      isActive = true;
      hideRippleHint(ursulaHint, false);
      stopIdleLoop();
      video.loop = false;
      video.play();
    });

    video.addEventListener('ended', () => {
      video.loop = true;
      video.currentTime = 0;
      video.play();
      startIdleLoop();
      setTimeout(() => {
        isActive = false;
        showRippleHint(ursulaHint);
      }, 600);
    });

    const tentacles = document.createElement('video');
    tentacles.className = 'chapter6-scene-decor__tentacles';
    tentacles.src = './video/chapter6/tentacles.webm';
    tentacles.autoplay = true;
    tentacles.loop = true;
    tentacles.muted = true;
    tentacles.playsInline = true;

    const decorUrsula = document.createElement('video');
    decorUrsula.className = 'chapter6-scene-decor__decorUrsula';
    decorUrsula.src = './video/chapter6/decorUrsula.webm';
    decorUrsula.autoplay = true;
    decorUrsula.loop = true;
    decorUrsula.muted = true;
    decorUrsula.playsInline = true;

    decor.appendChild(tentacles);
    decor.appendChild(decorUrsula);
    decor.appendChild(video);
    screen.appendChild(decor);
  }

  async function populateChapterSixText(chapterPage, startOverride = null) {
    textLeft.innerHTML = '';
    textRight.innerHTML = '';
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    textRight.style.display = '';
    document.body.classList.add('chapter6-page');
    document.body.classList.toggle('chapter6-opening', Boolean(chapterPage.showTitle));
    if (window.AudioManager && !_audioLayoutPass) AudioManager.setSceneAmbient(null);

    const chapter6SceneStartMarker = '\u00abКто вы?';
    const chapter6SceneEndMarker = 'Мне никогда еще не было так одиноко';
    const sceneStartIndex = findParagraphIndex(chapterPage.bookStart, raw => Boolean(raw && raw.includes(chapter6SceneStartMarker)));
    const sceneEndIndex = sceneStartIndex !== -1
      ? findParagraphIndex(sceneStartIndex, raw => Boolean(raw && raw.includes(chapter6SceneEndMarker)))
      : -1;

    const start = (startOverride !== null) ? startOverride : chapterPage.bookStart;
    
    const isScenePage = sceneStartIndex !== -1 && start >= sceneStartIndex &&
      start <= (sceneEndIndex !== -1 ? sceneEndIndex : chapterPage.bookEnd - 1);

    document.body.classList.toggle('chapter6-scene-mode', isScenePage);
    ensureChapterSixSceneDecor();

    syncChapterSixTitle(chapterPage);

    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const leftRect = textLeft.getBoundingClientRect();
    const rightRect = textRight.getBoundingClientRect();
    const stop = isScenePage && sceneEndIndex !== -1 ? sceneEndIndex : chapterPage.bookEnd;
    let lastRendered = start;
    let col = 'left';

    if (!isScenePage && sceneStartIndex !== -1 && start < sceneStartIndex) {
      for (let i = start; i < bookParagraphs.length; i++) {
        if (i >= sceneStartIndex) { lastRendered = i; break; }
        const raw = bookParagraphs[i];
        if (raw && /^\d+$/.test(raw.trim())) break;
        if (isSkippableParagraph(raw)) continue;

        const p = document.createElement('p');
        p.textContent = raw;

        if (col === 'left') {
          textLeft.appendChild(p);
          if (p.getBoundingClientRect().bottom > leftRect.bottom) {
            textLeft.removeChild(p); col = 'right';
            textRight.appendChild(p);
            if (p.getBoundingClientRect().bottom > rightRect.bottom) {
              textRight.removeChild(p); lastRendered = i; break;
            }
          }
        } else {
          textRight.appendChild(p);
          if (p.getBoundingClientRect().bottom > rightRect.bottom) {
            textRight.removeChild(p); lastRendered = i; break;
          }
        }
        lastRendered = i + 1;
      }
    } else if (isScenePage) {
      for (let i = start; i < stop + 1 && i < bookParagraphs.length; i++) {
        const raw = bookParagraphs[i];
        if (raw && /^\d+$/.test(raw.trim())) break;
        if (isSkippableParagraph(raw)) continue;

        const p = document.createElement('p');
        p.textContent = raw;

        if (col === 'left') {
          textLeft.appendChild(p);
          if (p.getBoundingClientRect().bottom > leftRect.bottom) {
            textLeft.removeChild(p); col = 'right';
            textRight.appendChild(p);
            if (p.getBoundingClientRect().bottom > rightRect.bottom) {
              textRight.removeChild(p); lastRendered = i; break;
            }
          }
        } else {
          textRight.appendChild(p);
          if (p.getBoundingClientRect().bottom > rightRect.bottom) {
            textRight.removeChild(p); lastRendered = i; break;
          }
        }
        lastRendered = i + 1;

        if (sceneEndIndex !== -1 && i >= sceneEndIndex) {
          lastRendered = sceneEndIndex + 1;
          break;
        }
      }
    } else {
      
      for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
        const raw = bookParagraphs[i];
        if (raw && /^\d+$/.test(raw.trim())) break;
        if (isSkippableParagraph(raw)) continue;

        const p = document.createElement('p');
        p.textContent = raw;

        if (col === 'left') {
          textLeft.appendChild(p);
          if (p.getBoundingClientRect().bottom > leftRect.bottom) {
            textLeft.removeChild(p); col = 'right';
            textRight.appendChild(p);
            if (p.getBoundingClientRect().bottom > rightRect.bottom) {
              textRight.removeChild(p); lastRendered = i; break;
            }
          }
        } else {
          textRight.appendChild(p);
          if (p.getBoundingClientRect().bottom > rightRect.bottom) {
            textRight.removeChild(p); lastRendered = i; break;
          }
        }
        lastRendered = i + 1;
      }
    }

    chapter6NextStart = lastRendered;
    saveFlowState();
  }

  async function transitionWithinChapterSix(nextPage, updateHistory = true) {
    if (isChapterSixTransitioning) return;
    isChapterSixTransitioning = true;

    const goingForward = nextPage.id > currentPage.id;

    document.body.classList.add('chapter6-text-transition');
    const _waitMs = new Promise(r => setTimeout(r, 260));
    if (!goingForward && !chapter6PageStarts.has(nextPage.id)) {
      await Promise.all([_waitMs, buildPageStartsForward(nextPage.id, isChapterSixFlowPage, chapter6PageStarts, populateChapterSixText, () => chapter6NextStart)]);
    } else {
      await _waitMs;
    }

    const cachedStart = chapter6PageStarts.get(nextPage.id);
    let startOverride = cachedStart !== undefined ? cachedStart : nextPage.bookStart;

    if (goingForward) {
      const candidateStart = chapter6NextStart !== null ? chapter6NextStart : startOverride;
      startOverride = candidateStart;
    }

    await populateChapterSixText(nextPage, startOverride);
    chapter6PageStarts.set(nextPage.id, startOverride);
    saveFlowState();
    currentPage = nextPage;

    if (updateHistory) {
      history.pushState({ pageId: nextPage.id }, '', `chapter.html?page=${nextPage.id}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('chapter6-text-transition');
        if (document.body.classList.contains('chapter6-scene-mode')) {
          const ursulaH = screen.querySelector('.ripple-hint--ursula');
          setTimeout(() => showRippleHint(ursulaH), 300);
        }
        setTimeout(() => { isChapterSixTransitioning = false; }, 260);
      });
    });
  }

  function syncChapterSevenTitle(chapterPage) {
    const existingTitle = document.querySelector('.chapter-seven-title');
    if (chapterPage.showTitle) {
      if (existingTitle) return;
      const title = document.createElement('div');
      title.className = 'chapter-seven-title';
      title.innerHTML = '<img class="chapter-title-img" src="./images/titles/7.png" alt="Глава 7">';
      textLeft.parentElement.insertBefore(title, textLeft);
      return;
    }
    if (existingTitle) existingTitle.remove();
  }

  async function populateChapterSevenText(chapterPage, startOverride = null) {
    textLeft.innerHTML = '';
    textRight.innerHTML = '';
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    textRight.style.display = '';
    document.body.classList.add('chapter7-page');
    document.body.classList.toggle('chapter7-opening', Boolean(chapterPage.showTitle));
    if (window.AudioManager && !_audioLayoutPass) AudioManager.setSceneAmbient(null);

    syncChapterSevenTitle(chapterPage);

    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const leftRect = textLeft.getBoundingClientRect();
    const rightRect = textRight.getBoundingClientRect();
    const start = (startOverride !== null) ? startOverride : chapterPage.bookStart;
    let lastRendered = start;
    let col = 'left';

    for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
      const raw = bookParagraphs[i];
      if (raw && /^\d+$/.test(raw.trim())) break;
      if (isSkippableParagraph(raw)) continue;

      const p = document.createElement('p');
      p.textContent = raw;

      if (col === 'left') {
        textLeft.appendChild(p);
        if (p.getBoundingClientRect().bottom > leftRect.bottom) {
          textLeft.removeChild(p);
          col = 'right';
          textRight.appendChild(p);
          if (p.getBoundingClientRect().bottom > rightRect.bottom) {
            textRight.removeChild(p);
            lastRendered = i;
            break;
          }
        }
      } else {
        textRight.appendChild(p);
        if (p.getBoundingClientRect().bottom > rightRect.bottom) {
          textRight.removeChild(p);
          lastRendered = i;
          break;
        }
      }
      lastRendered = i + 1;
    }

    chapter7NextStart = lastRendered;
    saveFlowState();
  }

  async function transitionWithinChapterSeven(nextPage, updateHistory = true) {
    if (isChapterSevenTransitioning) return;
    isChapterSevenTransitioning = true;

    const goingForward = nextPage.id > currentPage.id;

    document.body.classList.add('chapter7-text-transition');
    const _waitMs = new Promise(r => setTimeout(r, 260));
    if (!goingForward && !chapter7PageStarts.has(nextPage.id)) {
      await Promise.all([_waitMs, buildPageStartsForward(nextPage.id, isChapterSevenFlowPage, chapter7PageStarts, populateChapterSevenText, () => chapter7NextStart)]);
    } else {
      await _waitMs;
    }

    const cachedStart = chapter7PageStarts.get(nextPage.id);
    let startOverride = cachedStart !== undefined ? cachedStart : nextPage.bookStart;

    if (goingForward) {
      const candidateStart = chapter7NextStart !== null ? chapter7NextStart : startOverride;
      startOverride = candidateStart;
    }

    await populateChapterSevenText(nextPage, startOverride);
    chapter7PageStarts.set(nextPage.id, startOverride);
    saveFlowState();
    currentPage = nextPage;

    if (updateHistory) {
      history.pushState({ pageId: nextPage.id }, '', `chapter.html?page=${nextPage.id}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('chapter7-text-transition');
        setTimeout(() => { isChapterSevenTransitioning = false; }, 260);
      });
    });
  }

  function syncChapterEightTitle(chapterPage) {
    const existingTitle = document.querySelector('.chapter-eight-title');
    if (chapterPage.showTitle) {
      if (existingTitle) return;
      const title = document.createElement('div');
      title.className = 'chapter-eight-title';
      title.innerHTML = '<img class="chapter-title-img" src="./images/titles/8.png" alt="Глава 8">';
      textLeft.parentElement.insertBefore(title, textLeft);
      return;
    }
    if (existingTitle) existingTitle.remove();
  }

  function ensureChapterEightScene54Decor() {
    if (screen.querySelector('.ch8-54-decor')) return;

    const container = document.createElement('div');
    container.className = 'ch8-54-decor';

    const cnv = document.createElement('canvas');
    cnv.className = 'ch8-54-canvas';
    container.appendChild(cnv);

    const group = document.createElement('div');
    group.className = 'ch8-54-group';

    const vid = document.createElement('video');
    vid.src = './video/chapter8/ursula.webm';
    vid.className = 'ch8-54-ursula';
    vid.autoplay = true;
    vid.loop = true;
    vid.muted = true;
    vid.playsInline = true;
    group.appendChild(vid);
    container.appendChild(group);
    screen.appendChild(container);

    const ctx = cnv.getContext('2d');
    function resizeCanvas() {
      cnv.width  = window.innerWidth;
      cnv.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function drawLightning(sx, sy, ex, ey, displace, branch = 0) {
      if (displace < 2 || branch > 4) {
        ctx.beginPath();
        ctx.lineWidth = Math.max(2.5, displace * 0.8);
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        return;
      }
      const mx = (sx + ex) / 2 + (Math.random() - 0.5) * displace * 1.6;
      const my = (sy + ey) / 2 + (Math.random() - 0.5) * displace * 1.6;
      drawLightning(sx, sy, mx, my, displace / 2, branch);
      drawLightning(mx, my, ex, ey, displace / 2, branch);
      if (branch < 4 && Math.random() < 0.55) {
        const bx = mx + (Math.random() - 0.5) * displace * 2;
        const by = my + (Math.random() - 0.5) * displace * 2;
        drawLightning(mx, my, bx, by, displace * 0.7, branch + 1);
      }
    }

    function lightningStrike(x, y) {
      const origins = [
        { x: x - 150 + Math.random() * 300, y: 0 },
        { x: 0,           y: y - 80 + Math.random() * 160 },
        { x: cnv.width,   y: y - 80 + Math.random() * 160 }
      ];
      const origin = origins[Math.floor(Math.random() * origins.length)];
      const bolts = 5 + Math.floor(Math.random() * 4);

      ctx.strokeStyle = '#72b6ff';
      ctx.shadowColor  = '#00aaff';
      ctx.shadowBlur   = 140;
      ctx.lineCap = 'round';

      for (let i = 0; i < bolts; i++) {
        setTimeout(() => {
          ctx.globalAlpha = 1;
          ctx.clearRect(0, 0, cnv.width, cnv.height);
          ctx.fillStyle = 'rgba(173,216,230,0.35)';
          ctx.fillRect(0, 0, cnv.width, cnv.height);
          drawLightning(origin.x, origin.y,
            x + (Math.random() - 0.5) * 80,
            y + (Math.random() - 0.5) * 80, 55);

          let op = 1;
          const fade = setInterval(() => {
            op -= 0.06;
            if (op <= 0) { clearInterval(fade); ctx.clearRect(0, 0, cnv.width, cnv.height); return; }
            ctx.globalAlpha = op;
            ctx.clearRect(0, 0, cnv.width, cnv.height);
            ctx.fillStyle = `rgba(173,216,230,${op * 0.35})`;
            ctx.fillRect(0, 0, cnv.width, cnv.height);
          }, 40);
        }, i * 100);
      }
    }

    const lightningHint = createRippleHint('ripple-hint--lightning');
    container.appendChild(lightningHint);

    let _thunderIdx = 0;
    const _THUNDER = ['music/ambient/thunder1.mp3', 'music/ambient/thunder2.mp3', 'music/ambient/thunder3.mp3'];
    const clickHandler = (e) => {
      if (e.target.closest('.chapter-nav') ||
          e.target.closest('.menu-btn') ||
          e.target.closest('.chapter-menu-panel')) return;
      hideRippleHint(lightningHint, false);
      lightningStrike(e.clientX, e.clientY);
      if (window.AudioManager) AudioManager.playSound(_THUNDER[_thunderIdx++ % 3]);
      setTimeout(() => showRippleHint(lightningHint), 1500);
    };
    screen.addEventListener('click', clickHandler);
    container._cleanup = () => {
      screen.removeEventListener('click', clickHandler);
      window.removeEventListener('resize', resizeCanvas);
    };
  }

  async function populateChapterEightText(chapterPage, startOverride = null) {
    
    const existing54 = screen.querySelector('.ch8-54-decor');
    if (existing54) {
      if (chapterPage.scene !== 'ch8-scene54') {
        if (existing54._cleanup) existing54._cleanup();
        existing54.remove();
      }
    }

    textLeft.innerHTML = '';
    textRight.innerHTML = '';
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    textRight.style.display = '';
    document.body.classList.add('chapter8-page');
    document.body.classList.toggle('chapter8-opening', Boolean(chapterPage.showTitle));
    if (window.AudioManager && !_audioLayoutPass) AudioManager.setSceneAmbient('music/ambient/rain.mp3', 1000, 800, 0.35);

    const isScene54 = chapterPage.scene === 'ch8-scene54';
    document.body.classList.toggle('chapter8-scene54-mode', isScene54);
    if (isScene54) ensureChapterEightScene54Decor();

    syncChapterEightTitle(chapterPage);

    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const leftRect = textLeft.getBoundingClientRect();
    const rightRect = textRight.getBoundingClientRect();
    let start = (startOverride !== null) ? startOverride : chapterPage.bookStart;
    let lastRendered = start;

    if (isScene54) {
      const idx = findParagraphIndex(chapterPage.bookStart, raw => Boolean(raw && raw.includes('Она плыла надо мной')));
      if (idx !== -1) start = idx;
      let col54 = 'left';
      for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
        const raw = bookParagraphs[i];
        if (!raw || isSkippableParagraph(raw)) continue;
        if (!raw.includes('Она плыла надо мной') && col54 === 'left' && textLeft.children.length === 0) continue;
        const p = document.createElement('p');
        p.textContent = raw;
        if (col54 === 'left') {
          textLeft.appendChild(p);
          if (raw.includes('подчиняюсь ее желанию и бегу')) { col54 = 'right'; }
        } else { textRight.appendChild(p); }
        lastRendered = i + 1;
        if (raw.includes('в ушах звенел ее голос')) break;
      }
      chapter8NextStart = lastRendered;
      saveFlowState();
      return;
    }

    let col = 'left';
    for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
      const raw = bookParagraphs[i];
      if (raw && /^\d+$/.test(raw.trim())) break;
      if (isSkippableParagraph(raw)) continue;

      const p = document.createElement('p');
      p.textContent = raw;

      if (col === 'left') {
        textLeft.appendChild(p);
        if (p.getBoundingClientRect().bottom > leftRect.bottom) {
          textLeft.removeChild(p);
          col = 'right';
          textRight.appendChild(p);
          if (p.getBoundingClientRect().bottom > rightRect.bottom) {
            textRight.removeChild(p);
            lastRendered = i;
            break;
          }
        }
      } else {
        textRight.appendChild(p);
        if (p.getBoundingClientRect().bottom > rightRect.bottom) {
          textRight.removeChild(p);
          lastRendered = i;
          break;
        }
      }
      lastRendered = i + 1;
    }

    chapter8NextStart = lastRendered;
    saveFlowState();
  }

  async function transitionWithinChapterEight(nextPage, updateHistory = true) {
    if (isChapterEightTransitioning) return;
    isChapterEightTransitioning = true;

    const goingForward = nextPage.id > currentPage.id;
    const isLeavingScene54  = currentPage.scene === 'ch8-scene54' && nextPage.scene !== 'ch8-scene54';
    const isEnteringScene54 = currentPage.scene !== 'ch8-scene54' && nextPage.scene === 'ch8-scene54';

    if (isLeavingScene54) {
      const decor = screen.querySelector('.ch8-54-decor');
      if (decor) { decor.style.transition = 'opacity 260ms ease'; decor.style.opacity = '0'; }
    }
    if (isLeavingScene54 || isEnteringScene54) {
      chapterBg.style.transition = 'opacity 260ms ease';
      chapterBg.style.opacity = '0';
    }

    document.body.classList.add('chapter8-text-transition');
    const _waitMs = new Promise(r => setTimeout(r, 260));
    if (!goingForward && !chapter8PageStarts.has(nextPage.id)) {
      await Promise.all([_waitMs, buildPageStartsForward(nextPage.id, isChapterEightFlowPage, chapter8PageStarts, populateChapterEightText, () => chapter8NextStart)]);
    } else {
      await _waitMs;
    }

    const cachedStart = chapter8PageStarts.get(nextPage.id);
    let startOverride = cachedStart !== undefined ? cachedStart : nextPage.bookStart;

    if (goingForward) {
      const candidateStart = chapter8NextStart !== null ? chapter8NextStart : startOverride;
      startOverride = candidateStart;
    }

    await populateChapterEightText(nextPage, startOverride);

    if (isEnteringScene54) {
      const decor = screen.querySelector('.ch8-54-decor');
      if (decor) decor.style.opacity = '0';
    }

    chapter8PageStarts.set(nextPage.id, startOverride);
    saveFlowState();
    currentPage = nextPage;

    if (updateHistory) {
      history.pushState({ pageId: nextPage.id }, '', `chapter.html?page=${nextPage.id}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('chapter8-text-transition');

        if (isLeavingScene54 || isEnteringScene54) {
          chapterBg.style.transition = 'opacity 500ms ease';
          chapterBg.style.opacity = '1';
          setTimeout(() => { chapterBg.style.transition = ''; chapterBg.style.opacity = ''; }, 540);
        }

        if (isEnteringScene54) {
          const decor = screen.querySelector('.ch8-54-decor');
          if (decor) {
            decor.style.transition = 'opacity 600ms ease';
            decor.style.opacity = '1';
            setTimeout(() => { decor.style.transition = ''; }, 640);
          }
          const lh = screen.querySelector('.ripple-hint--lightning');
          setTimeout(() => showRippleHint(lh), 700);
        }

        setTimeout(() => { isChapterEightTransitioning = false; }, 260);
      });
    });
  }

  function syncChapterNineTitle(chapterPage) {
    const existingTitle = document.querySelector('.chapter-nine-title');
    if (chapterPage.showTitle) {
      if (existingTitle) return;
      const title = document.createElement('div');
      title.className = 'chapter-nine-title';
      title.innerHTML = '<img class="chapter-title-img" src="./images/titles/9.png" alt="Глава 9">';
      textLeft.parentElement.insertBefore(title, textLeft);
      return;
    }
    if (existingTitle) existingTitle.remove();
  }

  function ensureChapterNineMoonDecor() {
    if (screen.querySelector('.ch9-moon-decor')) return;

    const container = document.createElement('div');
    container.className = 'ch9-moon-decor';

    const starsCanvas = document.createElement('canvas');
    starsCanvas.className = 'ch9-stars-canvas';
    container.appendChild(starsCanvas);

    const group = document.createElement('div');
    group.className = 'ch9-moon-group';

    const wrapper = document.createElement('div');
    wrapper.className = 'ch9-moon-wrapper';

    const img = document.createElement('img');
    img.src = './svg/ch9/moon.svg';
    img.alt = '';
    img.className = 'ch9-moon-img';
    img.style.opacity = '0';
    img.style.transition = 'opacity 2s ease';

    const light = document.createElement('div');
    light.className = 'ch9-moon-light';
    light.style.background = 'radial-gradient(circle at 35% 35%, rgba(220,242,255,0.22) 0%, rgba(220,242,255,0) 45%, rgba(10,28,54,0.32) 72%, transparent 100%)';

    wrapper.appendChild(img);
    wrapper.appendChild(light);
    group.appendChild(wrapper);
    container.appendChild(group);
    screen.appendChild(container);
    requestAnimationFrame(() => requestAnimationFrame(() => { img.style.opacity = '1'; }));

    const sCtx = starsCanvas.getContext('2d');
    let sW, sH;

    function resizeStars() {
      sW = starsCanvas.width  = window.innerWidth;
      sH = starsCanvas.height = window.innerHeight;
    }
    resizeStars();

    const COUNT = 355;
    const stars = Array.from({ length: COUNT }, () => {
      const angle = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: Math.cos(angle) * 0.018,
        vy: Math.sin(angle) * 0.018,
        r:  Math.random() * 1.5 + 0.4,          
        rPh:  Math.random() * Math.PI * 2,     
        rSpd: (0.333 / 60) * (0.5 + Math.random()),
        op:   Math.random() * 0.49 + 0.05,        
        opPh: Math.random() * Math.PI * 2,        
        opSpd:(0.25  / 60) * (0.5 + Math.random()),
      };
    });

    let mouseX = -9999, mouseY = -9999;
    const BUBBLE_DIST = 83.9;
    let starsRafId;

    function tickStars() {
      sCtx.clearRect(0, 0, sW, sH);
      for (const p of stars) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -4) p.x = sW + 4;
        else if (p.x > sW + 4) p.x = -4;
        if (p.y < -4) p.y = sH + 4;
        else if (p.y > sH + 4) p.y = -4;

        p.rPh  += p.rSpd;
        p.opPh += p.opSpd;

        const rAnim  = (Math.sin(p.rPh)  + 1) / 2;
        const opAnim = (Math.sin(p.opPh) + 1) / 2;
        let r  = p.r  * rAnim;
        let op = p.op * opAnim;
        if (r < 0.1) continue;

        const dx = p.x - mouseX, dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < BUBBLE_DIST) {
          const t = 1 - dist / BUBBLE_DIST;
          r  = Math.max(r,  1 + t * 1.5);
          op = Math.min(1,  op + t * 0.5);
        }

        sCtx.beginPath();
        sCtx.arc(p.x, p.y, r, 0, Math.PI * 2);
        sCtx.fillStyle = `rgba(255,255,255,${op.toFixed(3)})`;
        sCtx.fill();
      }
      starsRafId = requestAnimationFrame(tickStars);
    }
    tickStars();

    function onMouseMove(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const rect = img.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const raw_cx = 50 + ((e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2)) * 38;
      const raw_cy = 50 + ((e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2)) * 38;
      const cx = Math.max(8, Math.min(92, raw_cx)).toFixed(1);
      const cy = Math.max(8, Math.min(92, raw_cy)).toFixed(1);
      light.style.background = `radial-gradient(circle at ${cx}% ${cy}%, rgba(220,242,255,0.22) 0%, rgba(220,242,255,0) 45%, rgba(10,28,54,0.32) 72%, transparent 100%)`;
    }

    window.addEventListener('resize', resizeStars);
    document.addEventListener('mousemove', onMouseMove);
    container._cleanup = () => {
      document.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', resizeStars);
      cancelAnimationFrame(starsRafId);
    };
  }

  async function populateChapterNineText(chapterPage, startOverride = null) {
    const isMoonPage = chapterPage.scene === 'ch9-moon';
    const existingMoon = screen.querySelector('.ch9-moon-decor');
    if (existingMoon && !isMoonPage) {
      if (existingMoon._cleanup) existingMoon._cleanup();
      existingMoon.remove();
    }

    textLeft.innerHTML = '';
    textRight.innerHTML = '';
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    textRight.style.display = '';
    document.body.classList.add('chapter9-page');
    document.body.classList.toggle('chapter9-opening', Boolean(chapterPage.showTitle));
    document.body.classList.toggle('chapter9-moon-mode', isMoonPage);
    if (window.AudioManager && !_audioLayoutPass) AudioManager.setSceneAmbient(null);
    if (isMoonPage) ensureChapterNineMoonDecor();

    syncChapterNineTitle(chapterPage);

    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const leftRect = textLeft.getBoundingClientRect();
    const rightRect = textRight.getBoundingClientRect();
    let start = (startOverride !== null) ? startOverride : chapterPage.bookStart;
    
    if (isMoonPage) {
      while (start < bookParagraphs.length && bookParagraphs[start] && /^\d+$/.test(bookParagraphs[start].trim())) {
        start++;
      }
    }
    let lastRendered = start;
    let col = 'left';

    for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
      const raw = bookParagraphs[i];
      if (raw && /^\d+$/.test(raw.trim())) break;
      if (isSkippableParagraph(raw)) continue;

      const p = document.createElement('p');
      p.textContent = raw;

      if (col === 'left') {
        textLeft.appendChild(p);
        if (p.getBoundingClientRect().bottom > leftRect.bottom) {
          textLeft.removeChild(p);
          col = 'right';
          textRight.appendChild(p);
          if (p.getBoundingClientRect().bottom > rightRect.bottom) {
            textRight.removeChild(p);
            lastRendered = i;
            break;
          }
        }
      } else {
        textRight.appendChild(p);
        if (p.getBoundingClientRect().bottom > rightRect.bottom) {
          textRight.removeChild(p);
          lastRendered = i;
          break;
        }
      }
      lastRendered = i + 1;
    }

    chapter9NextStart = lastRendered;
    saveFlowState();
  }

  async function transitionWithinChapterNine(nextPage, updateHistory = true) {
    if (isChapterNineTransitioning) return;
    isChapterNineTransitioning = true;

    const goingForward = nextPage.id > currentPage.id;
    const isLeavingMoon  = currentPage.scene === 'ch9-moon' && nextPage.scene !== 'ch9-moon';
    const isEnteringMoon = currentPage.scene !== 'ch9-moon' && nextPage.scene === 'ch9-moon';

    if (isLeavingMoon) {
      const decor = screen.querySelector('.ch9-moon-decor');
      if (decor) { decor.style.transition = 'opacity 260ms ease'; decor.style.opacity = '0'; }
    }
    if (isLeavingMoon || isEnteringMoon) {
      chapterBg.style.transition = 'opacity 260ms ease';
      chapterBg.style.opacity = '0';
    }

    document.body.classList.add('chapter9-text-transition');
    const _waitMs = new Promise(r => setTimeout(r, 260));
    if (!goingForward && !chapter9PageStarts.has(nextPage.id)) {
      await Promise.all([_waitMs, buildPageStartsForward(nextPage.id, isChapterNineFlowPage, chapter9PageStarts, populateChapterNineText, () => chapter9NextStart)]);
    } else {
      await _waitMs;
    }

    const cachedStart = chapter9PageStarts.get(nextPage.id);
    let startOverride = cachedStart !== undefined ? cachedStart : nextPage.bookStart;

    if (goingForward) {
      const candidateStart = chapter9NextStart !== null ? chapter9NextStart : startOverride;
      startOverride = candidateStart;
    }

    await populateChapterNineText(nextPage, startOverride);

    if (isEnteringMoon) {
      const decor = screen.querySelector('.ch9-moon-decor');
      if (decor) decor.style.opacity = '0';
    }

    chapter9PageStarts.set(nextPage.id, startOverride);
    saveFlowState();
    currentPage = nextPage;

    if (updateHistory) {
      history.pushState({ pageId: nextPage.id }, '', `chapter.html?page=${nextPage.id}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('chapter9-text-transition');

        if (isLeavingMoon || isEnteringMoon) {
          chapterBg.style.transition = 'opacity 500ms ease';
          chapterBg.style.opacity = '1';
          setTimeout(() => { chapterBg.style.transition = ''; chapterBg.style.opacity = ''; }, 540);
        }

        if (isEnteringMoon) {
          const decor = screen.querySelector('.ch9-moon-decor');
          if (decor) {
            decor.style.transition = 'opacity 700ms ease';
            decor.style.opacity = '1';
            setTimeout(() => { decor.style.transition = ''; }, 740);
          }
        }

        setTimeout(() => { isChapterNineTransitioning = false; }, 260);
      });
    });
  }

  function syncChapterTenTitle(chapterPage) {
    const existingTitle = document.querySelector('.chapter-ten-title');
    if (chapterPage.showTitle) {
      if (existingTitle) return;
      const title = document.createElement('div');
      title.className = 'chapter-ten-title';
      title.innerHTML = '<img class="chapter-title-img" src="./images/titles/10.png" alt="Глава 10">';
      textLeft.parentElement.insertBefore(title, textLeft);
      return;
    }
    if (existingTitle) existingTitle.remove();
  }

  const CH10_WORM_PAGES = new Set([75, 76, 77]);
  let wormAnimFrame  = null;
  let wormFadeTimer  = null;

  function destroyWormCanvas(fade = false) {
    
    if (wormFadeTimer) { clearTimeout(wormFadeTimer); wormFadeTimer = null; }

    const el = screen.querySelector('.ch10-worm-canvas');

    if (fade && el) {
      
      if (wormAnimFrame) { cancelAnimationFrame(wormAnimFrame); wormAnimFrame = null; }
      el.style.opacity    = '0';
      wormFadeTimer = setTimeout(() => { el.remove(); wormFadeTimer = null; }, 750);
    } else {
      if (wormAnimFrame) { cancelAnimationFrame(wormAnimFrame); wormAnimFrame = null; }
      if (el) el.remove();
    }
  }

  function ensureWormCanvas() {
    if (screen.querySelector('.ch10-worm-canvas')) return;

    const canvas = document.createElement('canvas');
    canvas.className = 'ch10-worm-canvas';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    screen.appendChild(canvas);

    const ctx   = canvas.getContext('2d');
    const W     = canvas.width;
    const H     = canvas.height;
    const COLOR = 'rgba(85, 116, 173, 0.09)';
    const COUNT = 15 + Math.floor(Math.random() * 6); 
    const DRIFT_MS = 1600; 

    const tentacles = Array.from({ length: COUNT }, (_, i) => {
      const slot  = W / COUNT;
      const baseX = slot * (i + 0.5) + (Math.random() - 0.5) * slot * 0.55;
      return {
        x:  baseX,
        len: H * (0.40 + Math.random() * 0.35),
        hw:  6 + Math.random() * 14,
        a1: 18 + Math.random() * 32,  s1: 0.00055 + Math.random() * 0.00035,  p1: Math.random() * Math.PI * 2,
        a2: 28 + Math.random() * 48,  s2: 0.00038 + Math.random() * 0.00028,  p2: Math.random() * Math.PI * 2,
        a3: 22 + Math.random() * 42,  s3: 0.00065 + Math.random() * 0.00040,  p3: Math.random() * Math.PI * 2,
      };
    });

    let driftProgress = 0;
    let lastTs = null;

    function draw(ts) {
      if (!canvas.parentNode) return;

      if (lastTs === null) lastTs = ts;
      const dt = ts - lastTs;
      lastTs = ts;
      if (driftProgress < 1) driftProgress = Math.min(1, driftProgress + dt / DRIFT_MS);

      const ease = 1 - Math.pow(1 - driftProgress, 2.5);

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = COLOR;

      for (const t of tentacles) {
        const ax  = t.x;
        const hw  = t.hw;
        const len = t.len * ease; 

        const d1 = t.a1 * Math.sin(ts * t.s1 + t.p1);
        const d2 = t.a2 * Math.sin(ts * t.s2 + t.p2);
        const d3 = t.a3 * Math.sin(ts * t.s3 + t.p3);

        const cp1x = ax + d1;  const cp1y = len * 0.30;
        const cp2x = ax + d2;  const cp2y = len * 0.65;
        const tipx  = ax + d3; const tipy  = len;

        const w1 = hw * 0.52;
        const w2 = hw * 0.16;

        ctx.beginPath();
        ctx.moveTo(ax - hw, 0);
        ctx.bezierCurveTo(cp1x - w1, cp1y, cp2x - w2, cp2y, tipx, tipy);
        ctx.bezierCurveTo(cp2x + w2, cp2y, cp1x + w1, cp1y, ax + hw, 0);
        ctx.closePath();
        ctx.fill();
      }

      wormAnimFrame = requestAnimationFrame(draw);
    }

    wormAnimFrame = requestAnimationFrame(draw);
  }

  async function populateChapterTenText(chapterPage, startOverride = null) {
    textLeft.innerHTML = '';
    textRight.innerHTML = '';
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    textRight.style.display = '';
    document.body.classList.add('chapter10-page');
    document.body.classList.toggle('chapter10-opening', Boolean(chapterPage.showTitle));
    if (window.AudioManager && !_audioLayoutPass) AudioManager.setSceneAmbient(null);

    syncChapterTenTitle(chapterPage);

    if (CH10_WORM_PAGES.has(chapterPage.id)) {
      ensureWormCanvas();
    } else {
      destroyWormCanvas(true);
    }

    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const leftRect = textLeft.getBoundingClientRect();
    const rightRect = textRight.getBoundingClientRect();
    const start = (startOverride !== null) ? startOverride : chapterPage.bookStart;
    let lastRendered = start;
    let col = 'left';

    for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
      const raw = bookParagraphs[i];
      if (raw && /^\d+$/.test(raw.trim())) break;
      if (isSkippableParagraph(raw)) continue;

      const p = document.createElement('p');
      p.textContent = raw;

      if (col === 'left') {
        textLeft.appendChild(p);
        if (p.getBoundingClientRect().bottom > leftRect.bottom) {
          textLeft.removeChild(p);
          col = 'right';
          textRight.appendChild(p);
          if (p.getBoundingClientRect().bottom > rightRect.bottom) {
            textRight.removeChild(p);
            lastRendered = i;
            break;
          }
        }
      } else {
        textRight.appendChild(p);
        if (p.getBoundingClientRect().bottom > rightRect.bottom) {
          textRight.removeChild(p);
          lastRendered = i;
          break;
        }
      }
      lastRendered = i + 1;
    }

    chapter10NextStart = lastRendered;
    saveFlowState();
  }

  async function transitionWithinChapterTen(nextPage, updateHistory = true) {
    if (isChapterTenTransitioning) return;
    isChapterTenTransitioning = true;

    const goingForward = nextPage.id > currentPage.id;

    document.body.classList.add('chapter10-text-transition');
    const _waitMs = new Promise(r => setTimeout(r, 260));
    if (!goingForward && !chapter10PageStarts.has(nextPage.id)) {
      await Promise.all([_waitMs, buildPageStartsForward(nextPage.id, isChapterTenFlowPage, chapter10PageStarts, populateChapterTenText, () => chapter10NextStart)]);
    } else {
      await _waitMs;
    }

    const cachedStart = chapter10PageStarts.get(nextPage.id);
    let startOverride = cachedStart !== undefined ? cachedStart : nextPage.bookStart;

    if (goingForward) {
      const candidateStart = chapter10NextStart !== null ? chapter10NextStart : startOverride;
      startOverride = candidateStart;
    }

    await populateChapterTenText(nextPage, startOverride);
    chapter10PageStarts.set(nextPage.id, startOverride);
    saveFlowState();
    currentPage = nextPage;

    if (updateHistory) {
      history.pushState({ pageId: nextPage.id }, '', `chapter.html?page=${nextPage.id}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('chapter10-text-transition');
        setTimeout(() => { isChapterTenTransitioning = false; }, 260);
      });
    });
  }

  function ensureChapterElevenSceneDecor() {
    let decor = screen.querySelector('.chapter11-scene-decor');
    if (decor) return;
    decor = document.createElement('div');
    decor.className = 'chapter11-scene-decor';

    const video = document.createElement('video');
    video.className = 'chapter11-scene-decor__bg';
    video.src = './video/chapter11/bird.webm';
    video.autoplay = true;
    video.muted = true;
    video.playsInline = true;
    video.loop = true;

    let isBiting = false;
    let rafId = null;

    function stopIdleLoop() {
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    }

    function startIdleLoop() {
      video.loop = true;
      video.playbackRate = 1;
      if (video.paused) video.play().catch(() => {});
      function tick() {
        if (video.currentTime >= 1.625) video.currentTime = 0;
        rafId = requestAnimationFrame(tick);
      }
      rafId = requestAnimationFrame(tick);
    }

    video.addEventListener('canplay', () => {
      if (!isBiting) startIdleLoop();
    }, { once: true });

    const birdHint = createRippleHint('ripple-hint--bird');
    decor.appendChild(birdHint);

    video.addEventListener('click', () => {
      if (isBiting) return;
      isBiting = true;
      if (window.AudioManager) AudioManager.playSound('music/ambient/angrybird.mp3');
      hideRippleHint(birdHint, false);
      stopIdleLoop();
      video.loop = false;
      video.play();
      video.classList.add('chapter11-bird--bite');
    });

    video.addEventListener('ended', () => {
      if (!isBiting) return;
      video.currentTime = 0;
      startIdleLoop();
      setTimeout(() => {
        video.classList.remove('chapter11-bird--bite');
        isBiting = false;
        positionHintOver(birdHint, video);
        showRippleHint(birdHint);
      }, 600);
    });

    decor.appendChild(video);
    screen.appendChild(decor);
  }

  function syncChapterElevenTitle(chapterPage) {
    const existingTitle = document.querySelector('.chapter-eleven-title');
    if (chapterPage.showTitle) {
      if (existingTitle) return;
      const title = document.createElement('div');
      title.className = 'chapter-eleven-title';
      title.innerHTML = '<img class="chapter-title-img" src="./images/titles/11.png" alt="Глава 11">';
      textLeft.parentElement.insertBefore(title, textLeft);
      return;
    }
    if (existingTitle) existingTitle.remove();
  }

  async function populateChapterElevenText(chapterPage, startOverride = null) {
    const scenePageId = 81;
    const sceneParaStart = 1107; 
    const isScenePage = chapterPage.id === scenePageId;

    textLeft.innerHTML = '';
    textRight.innerHTML = '';
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    textRight.style.display = '';
    document.body.classList.add('chapter11-page');
    document.body.classList.toggle('chapter11-opening', Boolean(chapterPage.showTitle));
    document.body.classList.toggle('chapter11-scene-mode', isScenePage);
    if (window.AudioManager && !_audioLayoutPass) AudioManager.setSceneAmbient(null);

    syncChapterElevenTitle(chapterPage);
    ensureChapterElevenSceneDecor();

    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const leftRect = textLeft.getBoundingClientRect();
    const rightRect = textRight.getBoundingClientRect();

    if (isScenePage) {
      textRight.style.display = 'none';
      const sceneStart = Math.max(startOverride !== null ? startOverride : sceneParaStart, sceneParaStart);
      let lastRendered = sceneStart;

      for (let i = sceneStart; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
        const raw = bookParagraphs[i];
        if (raw && /^\d+$/.test(raw.trim())) break;
        if (isSkippableParagraph(raw)) continue;

        const p = document.createElement('p');
        p.textContent = raw;
        textLeft.appendChild(p);

        if (p.getBoundingClientRect().bottom > leftRect.bottom) {
          textLeft.removeChild(p);
          lastRendered = i;
          break;
        }
        lastRendered = i + 1;
      }

      chapter11NextStart = lastRendered;
      saveFlowState();
      return;
    }

    const start = (startOverride !== null) ? startOverride : chapterPage.bookStart;
    let lastRendered = start;
    let col = 'left';

    for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
      if (chapterPage.id < scenePageId && i >= sceneParaStart) {
        lastRendered = i;
        break;
      }

      const raw = bookParagraphs[i];
      if (raw && /^\d+$/.test(raw.trim())) break;
      if (isSkippableParagraph(raw)) continue;

      const p = document.createElement('p');
      p.textContent = raw;

      if (col === 'left') {
        textLeft.appendChild(p);
        if (p.getBoundingClientRect().bottom > leftRect.bottom) {
          textLeft.removeChild(p);
          col = 'right';
          textRight.appendChild(p);
          if (p.getBoundingClientRect().bottom > rightRect.bottom) {
            textRight.removeChild(p);
            lastRendered = i;
            break;
          }
        }
      } else {
        textRight.appendChild(p);
        if (p.getBoundingClientRect().bottom > rightRect.bottom) {
          textRight.removeChild(p);
          lastRendered = i;
          break;
        }
      }
      lastRendered = i + 1;
    }

    chapter11NextStart = lastRendered;
    saveFlowState();
  }

  async function transitionWithinChapterEleven(nextPage, updateHistory = true) {
    if (isChapterElevenTransitioning) return;
    isChapterElevenTransitioning = true;

    const goingForward = nextPage.id > currentPage.id;
    const sceneId11 = 81;
    const isLeavingScene11  = currentPage.id === sceneId11 && nextPage.id !== sceneId11;
    const isEnteringScene11 = currentPage.id !== sceneId11 && nextPage.id === sceneId11;

    if (isLeavingScene11) {
      const decor = screen.querySelector('.chapter11-scene-decor');
      if (decor) { decor.style.transition = 'opacity 260ms ease'; decor.style.opacity = '0'; }
    }

    document.body.classList.add('chapter11-text-transition');
    const _waitMs = new Promise(r => setTimeout(r, 260));
    if (!goingForward && !chapter11PageStarts.has(nextPage.id)) {
      await Promise.all([_waitMs, buildPageStartsForward(nextPage.id, isChapterElevenFlowPage, chapter11PageStarts, populateChapterElevenText, () => chapter11NextStart)]);
    } else {
      await _waitMs;
    }

    const cachedStart = chapter11PageStarts.get(nextPage.id);
    let startOverride = cachedStart !== undefined ? cachedStart : nextPage.bookStart;

    if (goingForward) {
      const candidateStart = chapter11NextStart !== null ? chapter11NextStart : startOverride;
      startOverride = candidateStart;
    }

    await populateChapterElevenText(nextPage, startOverride);

    if (isEnteringScene11) {
      const decor = screen.querySelector('.chapter11-scene-decor');
      if (decor) decor.style.opacity = '0';
    }

    chapter11PageStarts.set(nextPage.id, startOverride);
    saveFlowState();
    currentPage = nextPage;

    if (updateHistory) {
      history.pushState({ pageId: nextPage.id }, '', `chapter.html?page=${nextPage.id}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('chapter11-text-transition');

        if (isEnteringScene11) {
          const decor = screen.querySelector('.chapter11-scene-decor');
          if (decor) {
            decor.style.transition = 'opacity 600ms ease';
            decor.style.opacity = '1';
            setTimeout(() => { decor.style.transition = ''; }, 640);
          }
          const bh = screen.querySelector('.ripple-hint--bird');
          setTimeout(() => { positionHintOver(bh, screen.querySelector('.chapter11-scene-decor__bg')); showRippleHint(bh); }, 700);
        }

        setTimeout(() => { isChapterElevenTransitioning = false; }, 260);
      });
    });
  }

  function syncChapterTwelveTitle(chapterPage) {
    const existingTitle = document.querySelector('.chapter-twelve-title');
    if (chapterPage.showTitle) {
      if (existingTitle) return;
      const title = document.createElement('div');
      title.className = 'chapter-twelve-title';
      title.innerHTML = '<img class="chapter-title-img" src="./images/titles/12.png" alt="Глава 12">';
      textLeft.parentElement.insertBefore(title, textLeft);
      return;
    }
    if (existingTitle) existingTitle.remove();
  }

  async function populateChapterTwelveText(chapterPage, startOverride = null) {
    textLeft.innerHTML = '';
    textRight.innerHTML = '';
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    textRight.style.display = '';
    document.body.classList.add('chapter12-page');
    document.body.classList.toggle('chapter12-opening', Boolean(chapterPage.showTitle));
    if (window.AudioManager && !_audioLayoutPass) AudioManager.setSceneAmbient(null);

    syncChapterTwelveTitle(chapterPage);

    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const leftRect = textLeft.getBoundingClientRect();
    const rightRect = textRight.getBoundingClientRect();
    const start = (startOverride !== null) ? startOverride : chapterPage.bookStart;
    let lastRendered = start;
    let col = 'left';

    for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
      const raw = bookParagraphs[i];
      if (raw && /^\d+$/.test(raw.trim())) break;
      if (isSkippableParagraph(raw)) continue;

      const p = document.createElement('p');
      p.textContent = raw;

      if (col === 'left') {
        textLeft.appendChild(p);
        if (p.getBoundingClientRect().bottom > leftRect.bottom) {
          textLeft.removeChild(p);
          col = 'right';
          textRight.appendChild(p);
          if (p.getBoundingClientRect().bottom > rightRect.bottom) {
            textRight.removeChild(p);
            lastRendered = i;
            break;
          }
        }
      } else {
        textRight.appendChild(p);
        if (p.getBoundingClientRect().bottom > rightRect.bottom) {
          textRight.removeChild(p);
          lastRendered = i;
          break;
        }
      }
      lastRendered = i + 1;
    }

    chapter12NextStart = lastRendered;
    saveFlowState();
  }

  async function transitionWithinChapterTwelve(nextPage, updateHistory = true) {
    if (isChapterTwelveTransitioning) return;
    isChapterTwelveTransitioning = true;

    const goingForward = nextPage.id > currentPage.id;

    document.body.classList.add('chapter12-text-transition');
    const _waitMs = new Promise(r => setTimeout(r, 260));
    if (!goingForward && !chapter12PageStarts.has(nextPage.id)) {
      await Promise.all([_waitMs, buildPageStartsForward(nextPage.id, isChapterTwelveFlowPage, chapter12PageStarts, populateChapterTwelveText, () => chapter12NextStart)]);
    } else {
      await _waitMs;
    }

    const cachedStart = chapter12PageStarts.get(nextPage.id);
    let startOverride = cachedStart !== undefined ? cachedStart : nextPage.bookStart;

    if (goingForward) {
      const candidateStart = chapter12NextStart !== null ? chapter12NextStart : startOverride;
      startOverride = candidateStart;
    }

    await populateChapterTwelveText(nextPage, startOverride);
    chapter12PageStarts.set(nextPage.id, startOverride);
    saveFlowState();
    currentPage = nextPage;

    if (updateHistory) {
      history.pushState({ pageId: nextPage.id }, '', `chapter.html?page=${nextPage.id}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('chapter12-text-transition');
        setTimeout(() => { isChapterTwelveTransitioning = false; }, 260);
      });
    });
  }

  function syncChapterThirteenTitle(chapterPage) {
    const existingTitle = document.querySelector('.chapter-thirteen-title');
    if (chapterPage.showTitle) {
      if (existingTitle) return;
      const title = document.createElement('div');
      title.className = 'chapter-thirteen-title';
      title.innerHTML = '<img class="chapter-title-img" src="./images/titles/13.png" alt="Глава 13">';
      textLeft.parentElement.insertBefore(title, textLeft);
      return;
    }
    if (existingTitle) existingTitle.remove();
  }

  function preloadDecorAssets(imgSrcs, videoSrcs) {
    const total = imgSrcs.length + videoSrcs.length;
    if (total === 0) return Promise.resolve();
    return new Promise(function (resolve) {
      let loaded = 0;
      let done = false;
      function finish() {
        if (done) return;
        done = true;
        resolve();
      }
      function tick() {
        if (++loaded >= total) finish();
      }
      setTimeout(finish, 2000);
      imgSrcs.forEach(function (src) {
        const img = new Image();
        img.onload = img.onerror = tick;
        img.src = src;
      });
      videoSrcs.forEach(function (src) {
        const v = document.createElement('video');
        v.preload = 'auto';
        v.muted = true;
        v.oncanplaythrough = v.onerror = tick;
        v.src = src;
      });
    });
  }

  function ensureChapterThirteenScene2Decor() {
    if (screen.querySelector('.ch13-2-decor')) return Promise.resolve();

    const container = document.createElement('div');
    container.className = 'ch13-2-decor';

    const group = document.createElement('div');
    group.className = 'ch13-2-scene-group';

    const bg2 = document.createElement('img');
    bg2.src = './svg/ch13/ch13bg2.svg';
    bg2.alt = '';
    bg2.className = 'ch13-2-bg';

    const wave1 = document.createElement('img');
    wave1.src = './svg/ch13/wavebg1.svg';
    wave1.alt = '';
    wave1.className = 'ch13-wavebg ch13-wavebg1';

    const wave2 = document.createElement('img');
    wave2.src = './svg/ch13/wavebg2.svg';
    wave2.alt = '';
    wave2.className = 'ch13-wavebg ch13-wavebg2';

    const underwater = document.createElement('video');
    underwater.src = './video/chapter13/underwater.webm';
    underwater.className = 'ch13-underwater';
    underwater.autoplay = true;
    underwater.loop = true;
    underwater.muted = true;
    underwater.playsInline = true;

    group.appendChild(bg2);
    group.appendChild(wave1);
    group.appendChild(wave2);
    group.appendChild(underwater);
    container.appendChild(group);

    return preloadDecorAssets(
      ['./svg/ch13/ch13bg2.svg', './svg/ch13/wavebg1.svg', './svg/ch13/wavebg2.svg'],
      ['./video/chapter13/underwater.webm']
    ).then(function () {
      if (!screen.querySelector('.ch13-2-decor')) screen.appendChild(container);
    });
  }

  function ensureChapterThirteenScene3Decor() {
    if (screen.querySelector('.ch13-3-decor')) return Promise.resolve();
    const container = document.createElement('div');
    container.className = 'ch13-3-decor';
    container.innerHTML = `<svg class="wave-bg" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wFar" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#B8D4F0"/>
      <stop offset="100%" stop-color="#9AAAC8"/>
    </linearGradient>
    <linearGradient id="wMid" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#AACBE6"/>
      <stop offset="100%" stop-color="#9FBBD6"/>
    </linearGradient>
    <linearGradient id="wNear" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#BDD8EE" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#7A98BF" stop-opacity="0.9"/>
    </linearGradient>
    <pattern id="goldTex" x="0" y="0" width="600" height="600" patternUnits="userSpaceOnUse">
      <image href="./textures/gold.png" x="0" y="0" width="600" height="600" preserveAspectRatio="xMidYMid slice"/>
      <animate attributeName="x" from="0" to="600" dur="55s" repeatCount="indefinite"/>
    </pattern>
  </defs>
  <g class="wFar" opacity="0.40">
    <path d="M-300 550 Q480 340 960 450 Q1440 560 2220 330 L2220 1080 L-300 1080 Z" fill="url(#wFar)"/>
  </g>
  <g class="wMid" opacity="0.48">
    <path d="M-300 680 Q480 560 960 620 Q1440 690 2220 555 L2220 1080 L-300 1080 Z" fill="url(#wMid)"/>
  </g>
  <g class="wNear" opacity="0.55">
    <path d="M-300 800 Q480 745 960 768 Q1440 805 2220 740 L2220 1080 L-300 1080 Z" fill="url(#wNear)"/>
  </g>
  <g class="sh sh-upper">
    <path d="M-300 672 Q480 552 960 612 Q1440 682 2220 547" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.2"/>
    <path d="M-300 672 Q480 552 960 612 Q1440 682 2220 547" fill="none" stroke="url(#goldTex)" stroke-width="0.8" opacity="0.5"/>
  </g>
  <g class="sh sh-lower">
    <path d="M-300 684 Q480 564 960 624 Q1440 694 2220 559" fill="none" stroke="rgba(255,255,255,0.28)" stroke-width="2.5"/>
    <path d="M-300 684 Q480 564 960 624 Q1440 694 2220 559" fill="none" stroke="url(#goldTex)" stroke-width="1.6" opacity="0.65"/>
  </g>
</svg>`;
    const lettie = document.createElement('video');
    lettie.src = './video/chapter13/lettieandmс.webm';
    lettie.className = 'ch13-3-lettie';
    lettie.autoplay = true;
    lettie.loop = true;
    lettie.muted = true;
    lettie.playsInline = true;
    container.appendChild(lettie);

    const scenedecor = document.createElement('img');
    scenedecor.src = './svg/ch13/scenedecor.svg';
    scenedecor.alt = '';
    scenedecor.className = 'ch13-scenedecor';
    container.insertBefore(scenedecor, container.firstChild);

    const weeds = document.createElement('div');
    weeds.className = 'waterweeds-bg';
    weeds.innerHTML = '<img src="./svg/waterweeds.svg" alt="" aria-hidden="true">';
    container.appendChild(weeds);

    return preloadDecorAssets(
      ['./svg/ch13/scenedecor.svg', './svg/waterweeds.svg'],
      ['./video/chapter13/lettieandmс.webm']
    ).then(function () {
      if (!screen.querySelector('.ch13-3-decor')) screen.appendChild(container);
    });
  }

  function ensureChapterThirteenSceneDecor() {
    if (screen.querySelector('.ch13-decor')) return Promise.resolve();

    const container = document.createElement('div');
    container.className = 'ch13-decor';

    const group = document.createElement('div');
    group.className = 'ch13-scene-group';

    const bg = document.createElement('img');
    bg.src = './svg/ch13/ch13bg.svg';
    bg.alt = '';
    bg.className = 'ch13-bg';

    const light = document.createElement('img');
    light.src = './svg/ch13/ch13light.svg';
    light.alt = '';
    light.className = 'ch13-light';

    const vedro = document.createElement('video');
    vedro.src = './video/chapter13/vedro.webm';
    vedro.className = 'ch13-vedro';
    vedro.autoplay = true;
    vedro.loop = true;
    vedro.muted = true;
    vedro.playsInline = true;

    group.appendChild(bg);
    group.appendChild(light);
    group.appendChild(vedro);
    container.appendChild(group);

    return preloadDecorAssets(
      ['./svg/ch13/ch13bg.svg', './svg/ch13/ch13light.svg'],
      ['./video/chapter13/vedro.webm']
    ).then(function () {
      if (!screen.querySelector('.ch13-decor')) screen.appendChild(container);
    });
  }

  async function populateChapterThirteenText(chapterPage, startOverride = null) {
    if (chapterPage.scene !== 'ch13') {
      screen.querySelectorAll('.ch13-decor').forEach(el => el.remove());
    }
    if (chapterPage.scene !== 'ch13-2') {
      screen.querySelectorAll('.ch13-2-decor').forEach(el => el.remove());
    }
    if (chapterPage.scene !== 'ch13-3') {
      screen.querySelectorAll('.ch13-3-decor').forEach(el => el.remove());
    }

    textLeft.innerHTML = '';
    textRight.innerHTML = '';
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    textRight.style.display = '';
    document.body.classList.add('chapter13-page');
    document.body.classList.toggle('chapter13-opening', Boolean(chapterPage.showTitle));

    const isScenePage = chapterPage.scene === 'ch13';
    const isScene2Page = chapterPage.scene === 'ch13-2';
    const isScene3Page = chapterPage.scene === 'ch13-3';
    document.body.classList.toggle('chapter13-scene-mode', isScenePage);
    document.body.classList.toggle('chapter13-scene2-mode', isScene2Page);
    document.body.classList.toggle('chapter13-scene3-mode', isScene3Page);
    if (window.AudioManager && !_audioLayoutPass) {
      var _a13 = isScenePage ? 'music/ambient/vedro.mp3'
        : (isScene2Page || isScene3Page) ? 'music/ambient/underwater.mp3' : null;
      AudioManager.setSceneAmbient(_a13);
    }
    if (isScenePage) await ensureChapterThirteenSceneDecor();
    if (isScene2Page) await ensureChapterThirteenScene2Decor();
    if (isScene3Page) await ensureChapterThirteenScene3Decor();

    syncChapterThirteenTitle(chapterPage);

    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const leftRect = textLeft.getBoundingClientRect();
    const rightRect = textRight.getBoundingClientRect();
    let start = (startOverride !== null) ? startOverride : chapterPage.bookStart;
    if (isScene2Page && startOverride === null) {
      const idx = findParagraphIndex(chapterPage.bookStart, raw => Boolean(raw && raw.includes('Могла ли свеча гореть')));
      if (idx !== -1) start = idx;
    }
    if (isScene3Page && startOverride === null) {
      const idx = findParagraphIndex(chapterPage.bookStart, raw => Boolean(raw && raw.includes('Лэтти Хэмпсток превратилась в туманный шелк')));
      if (idx !== -1) start = idx;
    }
    let lastRendered = start;
    let col = 'left';

    if (isScene2Page) {
      for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
        const raw = bookParagraphs[i];
        if (!raw || isSkippableParagraph(raw)) continue;
        if (raw.includes('Могла ли свеча гореть')) {
          const splitAt = 'Перед моим внутренним взором';
          const splitIdx = raw.indexOf(splitAt);
          const pLeft = document.createElement('p');
          const pRight = document.createElement('p');
          if (splitIdx !== -1) {
            pLeft.textContent = raw.substring(0, splitIdx).trim();
            pRight.textContent = raw.substring(splitIdx).trim();
          } else {
            pLeft.textContent = raw;
          }
          textLeft.appendChild(pLeft);
          if (pRight.textContent) textRight.appendChild(pRight);
          lastRendered = i + 1;
          break;
        }
      }
      chapter13NextStart = lastRendered;
      saveFlowState();
      return;
    }

    if (isScene3Page) {
      let sceneCol = 'left';
      for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
        const raw = bookParagraphs[i];
        if (!raw || isSkippableParagraph(raw)) continue;
        if (!raw.includes('Лэтти Хэмпсток превратилась в туманный шелк') && sceneCol === 'left' && textLeft.children.length === 0) continue;
        const p = document.createElement('p');
        p.textContent = raw;
        if (sceneCol === 'left') {
          textLeft.appendChild(p);
          if (raw.includes('«Мне очень жаль»')) sceneCol = 'right';
        } else {
          textRight.appendChild(p);
        }
        lastRendered = i + 1;
        if (raw.includes('Он разрушит тебя')) break;
      }
      chapter13NextStart = lastRendered;
      saveFlowState();
      return;
    }

    const sceneLeftBreak = isScenePage
      ? (chapterPage.showTitle ? 'О чем ты болтаешь?' : 'позабыл свой голод и страх')
      : null;
    const sceneStopMarker = isScenePage
      ? (chapterPage.showTitle ? '«Я хочу есть, Лэтти' : 'сомкнулся над моей головой')
      : null;

    for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
      const raw = bookParagraphs[i];
      if (raw && /^\d+$/.test(raw.trim())) break;
      if (isSkippableParagraph(raw)) continue;

      const p = document.createElement('p');
      p.textContent = raw;

      if (col === 'left') {
        textLeft.appendChild(p);
        const overflows = p.getBoundingClientRect().bottom > leftRect.bottom;
        const forceBreak = sceneLeftBreak && raw && raw.includes(sceneLeftBreak);
        if (overflows || forceBreak) {
          if (overflows) textLeft.removeChild(p);
          col = 'right';
          if (overflows) {
            textRight.appendChild(p);
            if (p.getBoundingClientRect().bottom > rightRect.bottom) {
              textRight.removeChild(p);
              lastRendered = i;
              break;
            }
          }
        }
      } else {
        textRight.appendChild(p);
        if (p.getBoundingClientRect().bottom > rightRect.bottom) {
          textRight.removeChild(p);
          lastRendered = i;
          break;
        }
      }
      lastRendered = i + 1;
      if (sceneStopMarker && raw && raw.includes(sceneStopMarker)) break;
    }

    chapter13NextStart = lastRendered;
    saveFlowState();
  }

  async function transitionWithinChapterThirteen(nextPage, updateHistory = true) {
    if (isChapterThirteenTransitioning) return;
    isChapterThirteenTransitioning = true;

    const goingForward = nextPage.id > currentPage.id;
    const ch13DecorMap = { 'ch13': '.ch13-decor', 'ch13-2': '.ch13-2-decor', 'ch13-3': '.ch13-3-decor' };
    const curScene13 = currentPage.scene in ch13DecorMap ? currentPage.scene : null;
    const nxtScene13 = nextPage.scene   in ch13DecorMap ? nextPage.scene   : null;
    const isLeavingScene13  = curScene13 && curScene13 !== nxtScene13;
    const isEnteringScene13 = nxtScene13 && nxtScene13 !== curScene13;
    const needsBgFade = isLeavingScene13 || isEnteringScene13;

    if (isLeavingScene13) {
      const decor = screen.querySelector(ch13DecorMap[curScene13]);
      if (decor) { decor.style.animation = 'none'; decor.style.transition = 'opacity 500ms ease'; decor.style.opacity = '0'; }
    }
    if (needsBgFade) {
      chapterBg.style.transition = 'opacity 500ms ease';
      chapterBg.style.opacity = '0';
    }

    document.body.classList.add('chapter13-text-transition');
    const _waitMs = new Promise(r => setTimeout(r, needsBgFade ? 500 : 260));
    if (!goingForward && !chapter13PageStarts.has(nextPage.id)) {
      await Promise.all([_waitMs, buildPageStartsForward(nextPage.id, isChapterThirteenFlowPage, chapter13PageStarts, populateChapterThirteenText, () => chapter13NextStart)]);
    } else {
      await _waitMs;
    }

    const cachedStart = chapter13PageStarts.get(nextPage.id);
    let startOverride = cachedStart !== undefined ? cachedStart : nextPage.bookStart;

    if (goingForward) {
      const candidateStart = chapter13NextStart !== null ? chapter13NextStart : startOverride;
      startOverride = candidateStart;
    }

    await populateChapterThirteenText(nextPage, startOverride);

    if (isEnteringScene13) {
      const decor = screen.querySelector(ch13DecorMap[nxtScene13]);
      if (decor) decor.style.opacity = '0';
    }

    chapter13PageStarts.set(nextPage.id, startOverride);
    saveFlowState();
    currentPage = nextPage;

    if (updateHistory) {
      history.pushState({ pageId: nextPage.id }, '', `chapter.html?page=${nextPage.id}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('chapter13-text-transition');

        if (needsBgFade) {
          chapterBg.style.transition = 'opacity 500ms ease';
          chapterBg.style.opacity = '1';
          setTimeout(() => { chapterBg.style.transition = ''; chapterBg.style.opacity = ''; }, 540);
        }

        if (isEnteringScene13) {
          const decor = screen.querySelector(ch13DecorMap[nxtScene13]);
          if (decor) {
            decor.style.transition = 'opacity 600ms ease';
            decor.style.opacity = '1';
            setTimeout(() => { decor.style.transition = ''; }, 640);
          }
        }

        setTimeout(() => { isChapterThirteenTransitioning = false; }, 260);
      });
    });
  }

  function syncChapterFourteenTitle(chapterPage) {
    const existingTitle = document.querySelector('.chapter-fourteen-title');
    if (chapterPage.showTitle) {
      if (existingTitle) return;
      const title = document.createElement('div');
      title.className = 'chapter-fourteen-title';
      title.innerHTML = '<img class="chapter-title-img" src="./images/titles/14.png" alt="Глава 14">';
      textLeft.parentElement.insertBefore(title, textLeft);
      return;
    }
    if (existingTitle) existingTitle.remove();
  }

  function ensureChapterFourteenScene1Decor() {
    if (screen.querySelector('.ch14-scene1-decor')) return;
    const container = document.createElement('div');
    container.className = 'ch14-scene1-decor';
    const vid = document.createElement('video');
    vid.src = './video/chapter14/threebirds.webm';
    vid.className = 'ch14-birds';
    vid.autoplay = true;
    vid.loop = true;
    vid.muted = true;
    vid.setAttribute('playsinline', '');
    container.appendChild(vid);
    screen.appendChild(container);
  }

  async function populateChapterFourteenText(chapterPage, startOverride = null) {
    const isCh14Scene1 = chapterPage.scene === 'ch14-1';
    if (!isCh14Scene1) screen.querySelectorAll('.ch14-scene1-decor').forEach(el => el.remove());

    textLeft.innerHTML = '';
    textRight.innerHTML = '';
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    textRight.style.display = '';
    document.body.classList.add('chapter14-page');
    document.body.classList.toggle('chapter14-opening', Boolean(chapterPage.showTitle));

    document.body.classList.toggle('chapter14-scene1-mode', isCh14Scene1);
    if (window.AudioManager && !_audioLayoutPass) {
      AudioManager.setSceneAmbient(null);
      if (isCh14Scene1) AudioManager.playPeriodic('music/ambient/scarybirds.mp3', 12000);
    }
    if (isCh14Scene1) ensureChapterFourteenScene1Decor();

    syncChapterFourteenTitle(chapterPage);

    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const leftRect = textLeft.getBoundingClientRect();
    const rightRect = textRight.getBoundingClientRect();
    let start = (startOverride !== null) ? startOverride : chapterPage.bookStart;
    if (isCh14Scene1 && startOverride === null) {
      const idx = findParagraphIndex(chapterPage.bookStart, raw => Boolean(raw && raw.includes('Здесь, на этой земле, они больше не казались тенями')));
      if (idx !== -1) start = idx;
    }
    let lastRendered = start;
    let col = 'left';

    if (isCh14Scene1) {
      for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
        const raw = bookParagraphs[i];
        if (!raw || isSkippableParagraph(raw)) continue;
        if (!raw.includes('Здесь, на этой земле') && textLeft.children.length === 0) continue;
        const p = document.createElement('p');
        p.textContent = raw;
        textLeft.appendChild(p);
        lastRendered = i + 1;
        if (raw.includes('алчные глаза устремлены на меня')) break;
      }
      chapter14NextStart = lastRendered;
      saveFlowState();
      return;
    }

    for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
      const raw = bookParagraphs[i];
      if (raw && /^\d+$/.test(raw.trim())) break;
      if (isSkippableParagraph(raw)) continue;

      const p = document.createElement('p');
      p.textContent = raw;

      if (col === 'left') {
        textLeft.appendChild(p);
        if (p.getBoundingClientRect().bottom > leftRect.bottom) {
          textLeft.removeChild(p);
          col = 'right';
          textRight.appendChild(p);
          if (p.getBoundingClientRect().bottom > rightRect.bottom) {
            textRight.removeChild(p);
            lastRendered = i;
            break;
          }
        }
      } else {
        textRight.appendChild(p);
        if (p.getBoundingClientRect().bottom > rightRect.bottom) {
          textRight.removeChild(p);
          lastRendered = i;
          break;
        }
      }
      lastRendered = i + 1;
    }

    chapter14NextStart = lastRendered;
    saveFlowState();
  }

  async function transitionWithinChapterFourteen(nextPage, updateHistory = true) {
    if (isChapterFourteenTransitioning) return;
    isChapterFourteenTransitioning = true;

    const goingForward = nextPage.id > currentPage.id;
    const isLeavingScene14  = currentPage.scene === 'ch14-1' && nextPage.scene !== 'ch14-1';
    const isEnteringScene14 = currentPage.scene !== 'ch14-1' && nextPage.scene === 'ch14-1';

    if (isLeavingScene14) {
      const decor = screen.querySelector('.ch14-scene1-decor');
      if (decor) { decor.style.transition = 'opacity 260ms ease'; decor.style.opacity = '0'; }
    }

    document.body.classList.add('chapter14-text-transition');
    const _waitMs = new Promise(r => setTimeout(r, 260));
    if (!goingForward && !chapter14PageStarts.has(nextPage.id)) {
      await Promise.all([_waitMs, buildPageStartsForward(nextPage.id, isChapterFourteenFlowPage, chapter14PageStarts, populateChapterFourteenText, () => chapter14NextStart)]);
    } else {
      await _waitMs;
    }

    const cachedStart = chapter14PageStarts.get(nextPage.id);
    let startOverride = cachedStart !== undefined ? cachedStart : nextPage.bookStart;

    if (goingForward) {
      const candidateStart = chapter14NextStart !== null ? chapter14NextStart : startOverride;
      startOverride = candidateStart;
    }

    await populateChapterFourteenText(nextPage, startOverride);

    if (isEnteringScene14) {
      const decor = screen.querySelector('.ch14-scene1-decor');
      if (decor) decor.style.opacity = '0';
    }

    chapter14PageStarts.set(nextPage.id, startOverride);
    saveFlowState();
    currentPage = nextPage;

    if (updateHistory) {
      history.pushState({ pageId: nextPage.id }, '', `chapter.html?page=${nextPage.id}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('chapter14-text-transition');

        if (isEnteringScene14) {
          const decor = screen.querySelector('.ch14-scene1-decor');
          if (decor) {
            decor.style.transition = 'opacity 600ms ease';
            decor.style.opacity = '1';
            setTimeout(() => { decor.style.transition = ''; }, 640);
          }
        }

        setTimeout(() => { isChapterFourteenTransitioning = false; }, 260);
      });
    });
  }

  function syncChapterFifteenTitle(chapterPage) {
    const existingTitle = document.querySelector('.chapter-fifteen-title');
    if (chapterPage.showTitle) {
      if (existingTitle) return;
      const title = document.createElement('div');
      title.className = 'chapter-fifteen-title';
      title.innerHTML = '<img class="chapter-title-img" src="./images/titles/15.png" alt="Глава 15">';
      textLeft.parentElement.insertBefore(title, textLeft);
      return;
    }
    if (existingTitle) existingTitle.remove();
  }

  async function populateChapterFifteenText(chapterPage, startOverride = null) {
    textLeft.innerHTML = '';
    textRight.innerHTML = '';
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    textRight.style.display = '';
    document.body.classList.add('chapter15-page');
    document.body.classList.toggle('chapter15-opening', Boolean(chapterPage.showTitle));
    if (window.AudioManager && !_audioLayoutPass) AudioManager.setSceneAmbient(null);

    syncChapterFifteenTitle(chapterPage);

    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const leftRect = textLeft.getBoundingClientRect();
    const rightRect = textRight.getBoundingClientRect();
    const start = (startOverride !== null) ? startOverride : chapterPage.bookStart;
    let lastRendered = start;
    let col = 'left';

    for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
      const raw = bookParagraphs[i];
      if (raw && /^\d+$/.test(raw.trim())) break;
      if (isSkippableParagraph(raw)) continue;

      const p = document.createElement('p');
      p.textContent = raw;

      if (col === 'left') {
        textLeft.appendChild(p);
        if (p.getBoundingClientRect().bottom > leftRect.bottom) {
          textLeft.removeChild(p);
          col = 'right';
          textRight.appendChild(p);
          if (p.getBoundingClientRect().bottom > rightRect.bottom) {
            textRight.removeChild(p);
            lastRendered = i;
            break;
          }
        }
      } else {
        textRight.appendChild(p);
        if (p.getBoundingClientRect().bottom > rightRect.bottom) {
          textRight.removeChild(p);
          lastRendered = i;
          break;
        }
      }
      lastRendered = i + 1;
    }

    chapter15NextStart = lastRendered;
    saveFlowState();
  }

  async function transitionWithinChapterFifteen(nextPage, updateHistory = true) {
    if (isChapterFifteenTransitioning) return;
    isChapterFifteenTransitioning = true;

    const goingForward = nextPage.id > currentPage.id;

    document.body.classList.add('chapter15-text-transition');
    const _waitMs = new Promise(r => setTimeout(r, 260));
    if (!goingForward && !chapter15PageStarts.has(nextPage.id)) {
      await Promise.all([_waitMs, buildPageStartsForward(nextPage.id, isChapterFifteenFlowPage, chapter15PageStarts, populateChapterFifteenText, () => chapter15NextStart)]);
    } else {
      await _waitMs;
    }

    const cachedStart = chapter15PageStarts.get(nextPage.id);
    let startOverride = cachedStart !== undefined ? cachedStart : nextPage.bookStart;

    if (goingForward) {
      const candidateStart = chapter15NextStart !== null ? chapter15NextStart : startOverride;
      startOverride = candidateStart;
    }

    await populateChapterFifteenText(nextPage, startOverride);
    chapter15PageStarts.set(nextPage.id, startOverride);
    saveFlowState();
    currentPage = nextPage;

    if (updateHistory) {
      history.pushState({ pageId: nextPage.id }, '', `chapter.html?page=${nextPage.id}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('chapter15-text-transition');
        setTimeout(() => { isChapterFifteenTransitioning = false; }, 260);
      });
    });
  }

  function syncEpilogueTitle(chapterPage) {
    const existingTitle = document.querySelector('.epilogue-title');
    if (chapterPage.showTitle) {
      if (existingTitle) return;
      const title = document.createElement('div');
      title.className = 'epilogue-title';
      title.innerHTML = '<img class="chapter-title-img" src="./images/titles/epilogue.png" alt="Эпилог">';
      textLeft.parentElement.insertBefore(title, textLeft);
      return;
    }
    if (existingTitle) existingTitle.remove();
  }

  async function populateEpilogueText(chapterPage, startOverride = null) {
    textLeft.innerHTML = '';
    textRight.innerHTML = '';
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    textRight.style.display = '';
    document.body.classList.add('epilogue-page');
    document.body.classList.toggle('epilogue-opening', Boolean(chapterPage.showTitle));
    if (window.AudioManager && !_audioLayoutPass) AudioManager.setSceneAmbient(null);

    syncEpilogueTitle(chapterPage);

    await document.fonts.ready;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    const leftRect = textLeft.getBoundingClientRect();
    const rightRect = textRight.getBoundingClientRect();
    const start = (startOverride !== null) ? startOverride : chapterPage.bookStart;
    let lastRendered = start;
    let col = 'left';

    for (let i = start; i < chapterPage.bookEnd && i < bookParagraphs.length; i++) {
      const raw = bookParagraphs[i];
      if (raw && /^\d+$/.test(raw.trim())) break;
      if (isSkippableParagraph(raw)) continue;

      const p = document.createElement('p');
      p.textContent = raw;

      if (col === 'left') {
        textLeft.appendChild(p);
        if (p.getBoundingClientRect().bottom > leftRect.bottom) {
          textLeft.removeChild(p);
          col = 'right';
          textRight.appendChild(p);
          if (p.getBoundingClientRect().bottom > rightRect.bottom) {
            textRight.removeChild(p);
            lastRendered = i;
            break;
          }
        }
      } else {
        textRight.appendChild(p);
        if (p.getBoundingClientRect().bottom > rightRect.bottom) {
          textRight.removeChild(p);
          lastRendered = i;
          break;
        }
      }
      lastRendered = i + 1;
    }

    epilogueNextStart = lastRendered;
    saveFlowState();
  }

  async function transitionWithinEpilogue(nextPage, updateHistory = true) {
    if (isEpilogueTransitioning) return;
    isEpilogueTransitioning = true;

    const goingForward = nextPage.id > currentPage.id;

    document.body.classList.add('epilogue-text-transition');
    const _waitMs = new Promise(r => setTimeout(r, 260));
    if (!goingForward && !epiloguePageStarts.has(nextPage.id)) {
      await Promise.all([_waitMs, buildPageStartsForward(nextPage.id, isEpilogueFlowPage, epiloguePageStarts, populateEpilogueText, () => epilogueNextStart)]);
    } else {
      await _waitMs;
    }

    const cachedStart = epiloguePageStarts.get(nextPage.id);
    let startOverride = cachedStart !== undefined ? cachedStart : nextPage.bookStart;

    if (goingForward) {
      const candidateStart = epilogueNextStart !== null ? epilogueNextStart : startOverride;
      startOverride = candidateStart;
    }

    await populateEpilogueText(nextPage, startOverride);
    epiloguePageStarts.set(nextPage.id, startOverride);
    saveFlowState();
    currentPage = nextPage;

    if (updateHistory) {
      history.pushState({ pageId: nextPage.id }, '', `chapter.html?page=${nextPage.id}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.body.classList.remove('epilogue-text-transition');
        setTimeout(() => { isEpilogueTransitioning = false; }, 260);
      });
    });
  }

  if (currentPage.type !== 'chapter10') destroyWormCanvas(true);

  if (currentPage.type === 'scene') {
    document.body.classList.add('scene-page');
    await document.fonts.ready;
    const containerRect = textLeft.getBoundingClientRect();
    for (let i = currentPage.bookStart; i < currentPage.bookEnd; i++) {
      const raw = bookParagraphs[i];
      if (!raw || raw.startsWith('-') || raw.startsWith('=')) continue;
      const p = document.createElement('p');
      p.textContent = raw;
      textLeft.appendChild(p);
      const pRect = p.getBoundingClientRect();
      if (pRect.bottom > containerRect.bottom) {
        textLeft.removeChild(p);
        break;
      }
    }
    if (window.GlobalLoader) window.GlobalLoader.show();
    initWave();
    setTimeout(function () { if (window.GlobalLoader) window.GlobalLoader.hide(); }, 350);

  } else if (currentPage.type === 'prologue') {
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    await populatePrologueText(currentPage);

  } else if (currentPage.type === 'birthday' || currentPage.type === 'chapter1' || currentPage.type === 'chapter1-opening') {
    if (!chapter1PageStarts.has(currentPage.id)) {
      const _first = enabledPages.filter(isChapterOneFlowPage).sort((a, b) => a.id - b.id)[0];
      if (_first && _first.id !== currentPage.id) {
        await buildPageStartsForward(currentPage.id, isChapterOneFlowPage, chapter1PageStarts, populateChapterOneText, () => chapter1NextStart);
      }
    }
    const initialStart = chapter1PageStarts.get(currentPage.id) ?? currentPage.bookStart;
    await populateChapterOneText(currentPage, initialStart);
    chapter1PageStarts.set(currentPage.id, initialStart);
    saveFlowState();
    if (currentPage.scene === 'ch1-scene9') {
      const catH = screen.querySelector('.ripple-hint--cat');
      setTimeout(() => { positionHintOver(catH, screen.querySelector('.ch1-cat')); showRippleHint(catH); }, 400);
    }

  } else if (currentPage.type === 'chapter2-opening' || currentPage.type === 'chapter2') {
    if (!chapter2PageStarts.has(currentPage.id)) {
      const _first = enabledPages.filter(isChapterTwoFlowPage).sort((a, b) => a.id - b.id)[0];
      if (_first && _first.id !== currentPage.id) {
        await buildPageStartsForward(currentPage.id, isChapterTwoFlowPage, chapter2PageStarts, populateChapterTwoText, () => chapter2NextStart);
      }
    }
    const initialStart = chapter2PageStarts.get(currentPage.id) ?? currentPage.bookStart;
    await populateChapterTwoText(currentPage, initialStart);
    chapter2PageStarts.set(currentPage.id, initialStart);
    saveFlowState();

  } else if (currentPage.type === 'chapter3-opening' || currentPage.type === 'chapter3') {
    if (!chapter3PageStarts.has(currentPage.id)) {
      const _first = enabledPages.filter(isChapterThreeFlowPage).sort((a, b) => a.id - b.id)[0];
      if (_first && _first.id !== currentPage.id) {
        await buildPageStartsForward(currentPage.id, isChapterThreeFlowPage, chapter3PageStarts, populateChapterThreeText, () => chapter3NextStart);
      }
    }
    const initialStart = chapter3PageStarts.get(currentPage.id) ?? currentPage.bookStart;
    await populateChapterThreeText(currentPage, initialStart);
    chapter3PageStarts.set(currentPage.id, initialStart);
    saveFlowState();

  } else if (currentPage.type === 'chapter4-opening' || currentPage.type === 'chapter4') {
    if (!chapter4PageStarts.has(currentPage.id)) {
      const _first = enabledPages.filter(isChapterFourFlowPage).sort((a, b) => a.id - b.id)[0];
      if (_first && _first.id !== currentPage.id) {
        await buildPageStartsForward(currentPage.id, isChapterFourFlowPage, chapter4PageStarts, populateChapterFourText, () => chapter4NextStart);
      }
    }
    const initialStart = chapter4PageStarts.get(currentPage.id) ?? currentPage.bookStart;
    await populateChapterFourText(currentPage, initialStart);
    chapter4PageStarts.set(currentPage.id, initialStart);
    saveFlowState();

  } else if (currentPage.type === 'chapter5-opening' || currentPage.type === 'chapter5') {
    if (!chapter5PageStarts.has(currentPage.id)) {
      const _first = enabledPages.filter(isChapterFiveFlowPage).sort((a, b) => a.id - b.id)[0];
      if (_first && _first.id !== currentPage.id) {
        await buildPageStartsForward(currentPage.id, isChapterFiveFlowPage, chapter5PageStarts, populateChapterFiveText, () => chapter5NextStart);
      }
    }
    const initialStart = chapter5PageStarts.get(currentPage.id) ?? currentPage.bookStart;
    await populateChapterFiveText(currentPage, initialStart);
    chapter5PageStarts.set(currentPage.id, initialStart);
    saveFlowState();

  } else if (currentPage.type === 'chapter6-opening' || currentPage.type === 'chapter6') {
    if (!chapter6PageStarts.has(currentPage.id)) {
      const _first = enabledPages.filter(isChapterSixFlowPage).sort((a, b) => a.id - b.id)[0];
      if (_first && _first.id !== currentPage.id) {
        await buildPageStartsForward(currentPage.id, isChapterSixFlowPage, chapter6PageStarts, populateChapterSixText, () => chapter6NextStart);
      }
    }
    const initialStart = chapter6PageStarts.get(currentPage.id) ?? currentPage.bookStart;
    await populateChapterSixText(currentPage, initialStart);
    chapter6PageStarts.set(currentPage.id, initialStart);
    saveFlowState();

  } else if (currentPage.type === 'chapter7-opening' || currentPage.type === 'chapter7') {
    if (!chapter7PageStarts.has(currentPage.id)) {
      const _first = enabledPages.filter(isChapterSevenFlowPage).sort((a, b) => a.id - b.id)[0];
      if (_first && _first.id !== currentPage.id) {
        await buildPageStartsForward(currentPage.id, isChapterSevenFlowPage, chapter7PageStarts, populateChapterSevenText, () => chapter7NextStart);
      }
    }
    const initialStart = chapter7PageStarts.get(currentPage.id) ?? currentPage.bookStart;
    await populateChapterSevenText(currentPage, initialStart);
    chapter7PageStarts.set(currentPage.id, initialStart);
    saveFlowState();

  } else if (currentPage.type === 'chapter8-opening' || currentPage.type === 'chapter8') {
    if (!chapter8PageStarts.has(currentPage.id)) {
      const _first = enabledPages.filter(isChapterEightFlowPage).sort((a, b) => a.id - b.id)[0];
      if (_first && _first.id !== currentPage.id) {
        await buildPageStartsForward(currentPage.id, isChapterEightFlowPage, chapter8PageStarts, populateChapterEightText, () => chapter8NextStart);
      }
    }
    const initialStart = chapter8PageStarts.get(currentPage.id) ?? currentPage.bookStart;
    await populateChapterEightText(currentPage, initialStart);
    chapter8PageStarts.set(currentPage.id, initialStart);
    saveFlowState();

  } else if (currentPage.type === 'chapter9-opening' || currentPage.type === 'chapter9') {
    if (!chapter9PageStarts.has(currentPage.id)) {
      const _first = enabledPages.filter(isChapterNineFlowPage).sort((a, b) => a.id - b.id)[0];
      if (_first && _first.id !== currentPage.id) {
        await buildPageStartsForward(currentPage.id, isChapterNineFlowPage, chapter9PageStarts, populateChapterNineText, () => chapter9NextStart);
      }
    }
    const initialStart = chapter9PageStarts.get(currentPage.id) ?? currentPage.bookStart;
    await populateChapterNineText(currentPage, initialStart);
    chapter9PageStarts.set(currentPage.id, initialStart);
    saveFlowState();

  } else if (currentPage.type === 'chapter10-opening' || currentPage.type === 'chapter10') {
    if (!chapter10PageStarts.has(currentPage.id)) {
      const _first = enabledPages.filter(isChapterTenFlowPage).sort((a, b) => a.id - b.id)[0];
      if (_first && _first.id !== currentPage.id) {
        await buildPageStartsForward(currentPage.id, isChapterTenFlowPage, chapter10PageStarts, populateChapterTenText, () => chapter10NextStart);
      }
    }
    const initialStart = chapter10PageStarts.get(currentPage.id) ?? currentPage.bookStart;
    await populateChapterTenText(currentPage, initialStart);
    chapter10PageStarts.set(currentPage.id, initialStart);
    saveFlowState();

  } else if (currentPage.type === 'chapter11-opening' || currentPage.type === 'chapter11') {
    if (!chapter11PageStarts.has(currentPage.id)) {
      const _first = enabledPages.filter(isChapterElevenFlowPage).sort((a, b) => a.id - b.id)[0];
      if (_first && _first.id !== currentPage.id) {
        await buildPageStartsForward(currentPage.id, isChapterElevenFlowPage, chapter11PageStarts, populateChapterElevenText, () => chapter11NextStart);
      }
    }
    const initialStart = chapter11PageStarts.get(currentPage.id) ?? currentPage.bookStart;
    await populateChapterElevenText(currentPage, initialStart);
    chapter11PageStarts.set(currentPage.id, initialStart);
    saveFlowState();

    if (currentPage.id === 81) {
      const decor = screen.querySelector('.chapter11-scene-decor');
      if (decor) {
        decor.style.opacity = '0';
        requestAnimationFrame(() => {
          decor.style.transition = 'opacity 700ms ease';
          decor.style.opacity = '1';
          setTimeout(() => { decor.style.transition = ''; }, 740);
        });
      }
      const bh = screen.querySelector('.ripple-hint--bird');
      setTimeout(() => { positionHintOver(bh, screen.querySelector('.chapter11-scene-decor__bg')); showRippleHint(bh); }, 800);
    }

  } else if (currentPage.type === 'chapter12-opening' || currentPage.type === 'chapter12') {
    if (!chapter12PageStarts.has(currentPage.id)) {
      const _first = enabledPages.filter(isChapterTwelveFlowPage).sort((a, b) => a.id - b.id)[0];
      if (_first && _first.id !== currentPage.id) {
        await buildPageStartsForward(currentPage.id, isChapterTwelveFlowPage, chapter12PageStarts, populateChapterTwelveText, () => chapter12NextStart);
      }
    }
    const initialStart = chapter12PageStarts.get(currentPage.id) ?? currentPage.bookStart;
    await populateChapterTwelveText(currentPage, initialStart);
    chapter12PageStarts.set(currentPage.id, initialStart);
    saveFlowState();

  } else if (currentPage.type === 'chapter13-opening' || currentPage.type === 'chapter13') {
    if (!chapter13PageStarts.has(currentPage.id)) {
      const _first = enabledPages.filter(isChapterThirteenFlowPage).sort((a, b) => a.id - b.id)[0];
      if (_first && _first.id !== currentPage.id) {
        await buildPageStartsForward(currentPage.id, isChapterThirteenFlowPage, chapter13PageStarts, populateChapterThirteenText, () => chapter13NextStart);
      }
    }
    const initialStart = chapter13PageStarts.get(currentPage.id) ?? currentPage.bookStart;
    await populateChapterThirteenText(currentPage, initialStart);
    chapter13PageStarts.set(currentPage.id, initialStart);
    saveFlowState();

    {
      const ch13DecorMap = { 'ch13': '.ch13-decor', 'ch13-2': '.ch13-2-decor', 'ch13-3': '.ch13-3-decor' };
      const sceneKey = currentPage.scene in ch13DecorMap ? currentPage.scene : null;
      if (sceneKey && isCrossFade) {
        // On cross-chapter fade-in, the screen fades in from opacity 0
        // The decor is inside the screen and fades in with it
        const decor = screen.querySelector(ch13DecorMap[sceneKey]);
        if (decor) decor.style.opacity = '';
      }
    }

  } else if (currentPage.type === 'chapter14-opening' || currentPage.type === 'chapter14') {
    if (!chapter14PageStarts.has(currentPage.id)) {
      const _first = enabledPages.filter(isChapterFourteenFlowPage).sort((a, b) => a.id - b.id)[0];
      if (_first && _first.id !== currentPage.id) {
        await buildPageStartsForward(currentPage.id, isChapterFourteenFlowPage, chapter14PageStarts, populateChapterFourteenText, () => chapter14NextStart);
      }
    }
    const initialStart = chapter14PageStarts.get(currentPage.id) ?? currentPage.bookStart;
    await populateChapterFourteenText(currentPage, initialStart);
    chapter14PageStarts.set(currentPage.id, initialStart);
    saveFlowState();

    if (currentPage.scene === 'ch14-1') {
      const decor = screen.querySelector('.ch14-scene1-decor');
      if (decor) {
        decor.style.opacity = '0';
        requestAnimationFrame(() => {
          decor.style.transition = 'opacity 700ms ease';
          decor.style.opacity = '1';
          setTimeout(() => { decor.style.transition = ''; }, 740);
        });
      }
    }

  } else if (currentPage.type === 'chapter15') {
    if (!chapter15PageStarts.has(currentPage.id)) {
      const _first = enabledPages.filter(isChapterFifteenFlowPage).sort((a, b) => a.id - b.id)[0];
      if (_first && _first.id !== currentPage.id) {
        await buildPageStartsForward(currentPage.id, isChapterFifteenFlowPage, chapter15PageStarts, populateChapterFifteenText, () => chapter15NextStart);
      }
    }
    const initialStart = chapter15PageStarts.get(currentPage.id) ?? currentPage.bookStart;
    await populateChapterFifteenText(currentPage, initialStart);
    chapter15PageStarts.set(currentPage.id, initialStart);
    saveFlowState();

  } else if (currentPage.type === 'epilogue-opening' || currentPage.type === 'epilogue') {
    if (!epiloguePageStarts.has(currentPage.id)) {
      const _first = enabledPages.filter(isEpilogueFlowPage).sort((a, b) => a.id - b.id)[0];
      if (_first && _first.id !== currentPage.id) {
        await buildPageStartsForward(currentPage.id, isEpilogueFlowPage, epiloguePageStarts, populateEpilogueText, () => epilogueNextStart);
      }
    }
    const initialStart = epiloguePageStarts.get(currentPage.id) ?? currentPage.bookStart;
    await populateEpilogueText(currentPage, initialStart);
    epiloguePageStarts.set(currentPage.id, initialStart);
    saveFlowState();

    if (currentPage.scene === 'ch8-scene54') {
      const decor = screen.querySelector('.ch8-54-decor');
      if (decor) {
        decor.style.opacity = '0';
        requestAnimationFrame(() => {
          decor.style.transition = 'opacity 700ms ease';
          decor.style.opacity = '1';
          setTimeout(() => { decor.style.transition = ''; }, 740);
        });
      }
      const lh = screen.querySelector('.ripple-hint--lightning');
      setTimeout(() => showRippleHint(lh), 800);
    }

  } else {
    textLeft.style.paddingTop = '';
    textRight.style.paddingTop = '';
    console.warn(`[chapter.js] Unknown page type: "${currentPage.type}" (id=${currentPage.id}). Falling back to raw text split.`);
    textRight.style.display = '';
    const total = currentPage.bookEnd - currentPage.bookStart;
    const half  = Math.ceil(total / 2);
    for (let i = currentPage.bookStart; i < currentPage.bookEnd; i++) {
      const p = document.createElement('p');
      p.textContent = bookParagraphs[i];
      (i - currentPage.bookStart < half ? textLeft : textRight).appendChild(p);
    }
  }

  // Always top-align text (no bottom padding)
  textLeft.style.paddingTop = '';
  textRight.style.paddingTop = '';

  if (isLoaderActive && currentPage.type !== 'scene') {
    // For scene pages, _hideSceneLoader() manages chapter-loader based on video readiness.
    // For non-scene pages, hide chapter-loader now that content is ready.
    const loader = document.querySelector('.chapter-loader');
    if (loader) {
      requestAnimationFrame(() => {
        loader.style.transition = 'opacity 600ms ease';
        loader.style.opacity    = '0';
        setTimeout(() => {
          loader.style.transition    = '';
          loader.style.opacity       = '';
          loader.style.pointerEvents = '';
        }, 640);
      });
    }
  }

  {
    // Fade in the whole screen at once — bg, text, decorations all appear together.
    // The screen starts at opacity:0 (CSS). We keep the inline opacity:'1' permanently
    // so the CSS default doesn't snap it back to 0 after the transition ends.
    //
    // crossDecorSel elements (prologue house/trees, chapter titles, ch1 decor) are handled
    // explicitly via JS transition on every reveal — both initial load and cross-chapter fade.
    // The CSS animation (prologueFadeIn etc.) is cancelled so the JS transition is the sole
    // driver. This guarantees they appear in sync with the screen reveal regardless of timing.
    const crossDecorSel = '.prologue-illus, .chapter-prologue-title, .chapter-one-title, .chapter1-decor';
    screen.querySelectorAll(crossDecorSel).forEach(el => {
      el.style.animation = 'none';  // cancel CSS keyframe; JS transition drives reveal
      el.style.opacity   = '0';
    });

    requestAnimationFrame(() => {
      screen.style.transition = 'opacity 0.65s ease';
      screen.style.opacity = '1';
      screen.querySelectorAll(crossDecorSel).forEach(el => {
        el.style.transition = 'opacity 600ms ease';
        el.style.opacity = '1';
      });
      setTimeout(() => {
        screen.style.transition = '';
        // opacity stays at '1' inline — intentional, overrides CSS opacity:0 rule
        screen.querySelectorAll(crossDecorSel).forEach(el => {
          el.style.transition = '';
          el.style.opacity    = '';
          // animation:none stays inline → element holds at CSS default (opacity:1)
        });
      }, 700);
    });
  }

  if (currentPage.hasClick && currentPage.video2) {
    const scene = document.querySelector('.chapter-scene');
    const glow  = document.querySelector('.chapter-glow');

    [video1, video2, video3, video4].forEach(v => { v.style.transition = ''; });
    if (currentPage.type === 'birthday') {
      
      video1.style.opacity = '1';
      video2.style.opacity = '1';
      if (currentPage.video3) { video3.style.opacity = '0'; video3.pause(); }
    } else {
      
      video1.style.opacity = '1';
      video2.style.opacity = '0';
      if (currentPage.video3) video3.style.opacity = '1';
      if (currentPage.video4) video4.style.opacity = '0';
    }
    if (glow) glow.classList.remove('glow-state-2');

    let clicked = false;
    const clickTarget = currentPage.type === 'birthday' ? video2 : scene;
    if (clickTarget) clickTarget.style.cursor = 'pointer';

    if (clickTarget._sceneClickHandler) {
      clickTarget.removeEventListener('click', clickTarget._sceneClickHandler);
    }

    const hintClass = currentPage.type === 'birthday' ? 'ripple-hint--birthday' : 'ripple-hint--scene1';
    const hintParent = scene || (clickTarget && clickTarget.parentElement);
    let hasClickHint = null;
    if (hintParent) {
      screen.querySelectorAll('.' + hintClass).forEach(el => el.remove());
      hasClickHint = createRippleHint(hintClass);
      hintParent.appendChild(hasClickHint);

      if (currentPage.type === 'birthday') {
        setTimeout(function () {
          positionHintOver(hasClickHint, clickTarget);
          showRippleHint(hasClickHint);
        }, 600);
      } else {
        setTimeout(() => showRippleHint(hasClickHint), 600);
      }
    }

    const handler = () => {
      if (clicked) return;
      clicked = true;
      hideRippleHint(hasClickHint, true);
      if (currentPage.type === 'birthday') {
        if (window.AudioManager) AudioManager.playSound('music/ambient/candle.mp3');
        try {
          video3.currentTime = 0;
        } catch (e) {
          
        }
        video3.loop = false;
        video3.play().catch(() => {});
        
        video3.style.transition = 'opacity 0.3s ease';
        video3.style.opacity = '1';
        setTimeout(() => {
          video2.style.transition = 'opacity 0.3s ease';
          video2.style.opacity = '0';
        }, 250);
      } else {
        [video1, video2, video3, video4].forEach(v => {
          v.style.transition = 'opacity 1s';
        });
        video1.style.opacity = '0';
        video2.style.opacity = '1';
        if (currentPage.video3) {
          video3.style.opacity = '0';
          video4.style.opacity = '1';
        }
      }
      if (glow) glow.classList.add('glow-state-2');
    };
    clickTarget._sceneClickHandler = handler;
    clickTarget.addEventListener('click', handler);
  }

  function _resetAllTransitioningFlags() {
    isPrologueTransitioning = false;
    isChapterOneTransitioning = false;
    isChapterTwoTransitioning = false;
    isChapterThreeTransitioning = false;
    isChapterFourTransitioning = false;
    isChapterFiveTransitioning = false;
    isChapterSixTransitioning = false;
    isChapterSevenTransitioning = false;
    isChapterEightTransitioning = false;
    isChapterNineTransitioning = false;
    isChapterTenTransitioning = false;
    isChapterElevenTransitioning = false;
    isChapterTwelveTransitioning = false;
    isChapterThirteenTransitioning = false;
    isChapterFourteenTransitioning = false;
    isChapterFifteenTransitioning = false;
    isEpilogueTransitioning = false;
  }

  async function crossChapterNavigate(nextPage) {
    const bg = document.querySelector('.chapter-bg');
    screen.querySelectorAll('video').forEach(v => { try { v.pause(); } catch (_) {} });
    textLeft.style.transition  = 'opacity 300ms ease';
    textRight.style.transition = 'opacity 300ms ease';
    textLeft.style.opacity  = '0';
    textRight.style.opacity = '0';
    bg.style.transition = 'opacity 600ms ease';
    bg.style.opacity = '0';

    screen.querySelectorAll('.prologue-illus, .chapter-prologue-title, .chapter-one-title, .chapter1-decor').forEach(el => {
      el.style.transition = 'opacity 600ms ease';
      el.style.opacity = '0';
    });
    const _moonDecor = screen.querySelector('.ch9-moon-decor');
    if (_moonDecor) {
      if (_moonDecor._cleanup) _moonDecor._cleanup();
      _moonDecor.style.transition = 'opacity 600ms ease';
      _moonDecor.style.opacity = '0';
    }

    screen.querySelectorAll('[class*="-decor"], [class*="-wavebg"], [class*="wave-bg"]').forEach(el => {
      if (el === _moonDecor) return;
      el.style.transition = 'opacity 300ms ease';
      el.style.opacity = '0';
    });

    if (currentPage.type === 'scene') {
      const scene  = document.querySelector('.chapter-scene');
      const canvas = document.getElementById('wave-canvas');
      const glow   = document.querySelector('.chapter-glow');
      const loader = document.querySelector('.chapter-loader');
      if (scene)  { scene.style.transition  = 'opacity 600ms ease'; scene.style.opacity  = '0'; }
      if (canvas) { canvas.style.transition = 'opacity 600ms ease'; canvas.style.opacity = '0'; }
      if (glow)   { glow.style.transition   = 'opacity 600ms ease'; glow.style.opacity   = '0'; }
      if (loader) {
        loader.style.transition    = 'opacity 600ms ease';
        loader.style.opacity       = '1';
        loader.style.pointerEvents = 'auto';
      }
      sessionStorage.setItem('chapterLoaderActive', '1');
    }

    sessionStorage.setItem('chapterCrossFade', '1');
    await new Promise(r => setTimeout(r, 600));
    window.location.href = `chapter.html?page=${nextPage.id}`;
  }

  history.replaceState({ pageId: currentPage.id }, '', `chapter.html?page=${currentPage.id}`);
  try { localStorage.setItem('bookLastPageId', currentPage.id); } catch (_) {}

  document.querySelector('.chapter-nav__prev').addEventListener('click', async () => {
    try {
    const nextPage = findPrevPage(currentPage.id);
    if (!nextPage) return;

    if (currentPage.type === 'prologue' && nextPage.type === 'prologue') {
      await transitionWithinPrologue(nextPage);
      return;
    }

    if (isChapterOneFlowPage(currentPage) && isChapterOneFlowPage(nextPage)) {
      await transitionWithinChapterOne(nextPage);
      return;
    }

    if (isChapterTwoFlowPage(currentPage) && isChapterTwoFlowPage(nextPage)) {
      await transitionWithinChapterTwo(nextPage);
      return;
    }

    if (isChapterThreeFlowPage(currentPage) && isChapterThreeFlowPage(nextPage)) {
      await transitionWithinChapterThree(nextPage);
      return;
    }

    if (isChapterFourFlowPage(currentPage) && isChapterFourFlowPage(nextPage)) {
      await transitionWithinChapterFour(nextPage);
      return;
    }

    if (isChapterFiveFlowPage(currentPage) && isChapterFiveFlowPage(nextPage)) {
      await transitionWithinChapterFive(nextPage);
      return;
    }

    if (isChapterSixFlowPage(currentPage) && isChapterSixFlowPage(nextPage)) {
      await transitionWithinChapterSix(nextPage);
      return;
    }

    if (isChapterSevenFlowPage(currentPage) && isChapterSevenFlowPage(nextPage)) {
      await transitionWithinChapterSeven(nextPage);
      return;
    }

    if (isChapterEightFlowPage(currentPage) && isChapterEightFlowPage(nextPage)) {
      await transitionWithinChapterEight(nextPage);
      return;
    }

    if (isChapterNineFlowPage(currentPage) && isChapterNineFlowPage(nextPage)) {
      await transitionWithinChapterNine(nextPage);
      return;
    }

    if (isChapterTenFlowPage(currentPage) && isChapterTenFlowPage(nextPage)) {
      await transitionWithinChapterTen(nextPage);
      return;
    }

    if (isChapterElevenFlowPage(currentPage) && isChapterElevenFlowPage(nextPage)) {
      await transitionWithinChapterEleven(nextPage);
      return;
    }

    if (isChapterTwelveFlowPage(currentPage) && isChapterTwelveFlowPage(nextPage)) {
      await transitionWithinChapterTwelve(nextPage);
      return;
    }

    if (isChapterThirteenFlowPage(currentPage) && isChapterThirteenFlowPage(nextPage)) {
      await transitionWithinChapterThirteen(nextPage);
      return;
    }

    if (isChapterFourteenFlowPage(currentPage) && isChapterFourteenFlowPage(nextPage)) {
      await transitionWithinChapterFourteen(nextPage);
      return;
    }

    if (isChapterFifteenFlowPage(currentPage) && isChapterFifteenFlowPage(nextPage)) {
      await transitionWithinChapterFifteen(nextPage);
      return;
    }

    if (isEpilogueFlowPage(currentPage) && isEpilogueFlowPage(nextPage)) {
      await transitionWithinEpilogue(nextPage);
      return;
    }

    await crossChapterNavigate(nextPage);
    } catch (err) {
    console.error('[nav] prev error:', err);
    _resetAllTransitioningFlags();
    } finally { updateNavButtons(); }
  });

  document.querySelector('.chapter-nav__next').addEventListener('click', async () => {
    try {
    const nextPage = findNextPage(currentPage.id);
    if (!nextPage) {
      if (window.AudioManager) {
        window.AudioManager.fadeMusicOut(450);
      }
      showEndOfBookOverlay(function () { window.location.href = 'index.html'; });
      return;
    }

    if (currentPage.type === 'prologue' && nextPage.type === 'prologue') {
      await transitionWithinPrologue(nextPage);
      return;
    }

    if (isChapterOneFlowPage(currentPage) && isChapterOneFlowPage(nextPage)) {
      await transitionWithinChapterOne(nextPage);
      return;
    }

    if (isChapterTwoFlowPage(currentPage) && isChapterTwoFlowPage(nextPage)) {
      await transitionWithinChapterTwo(nextPage);
      return;
    }

    if (isChapterThreeFlowPage(currentPage) && isChapterThreeFlowPage(nextPage)) {
      await transitionWithinChapterThree(nextPage);
      return;
    }

    if (isChapterFourFlowPage(currentPage) && isChapterFourFlowPage(nextPage)) {
      await transitionWithinChapterFour(nextPage);
      return;
    }

    if (isChapterFiveFlowPage(currentPage) && isChapterFiveFlowPage(nextPage)) {
      await transitionWithinChapterFive(nextPage);
      return;
    }

    if (isChapterSixFlowPage(currentPage) && isChapterSixFlowPage(nextPage)) {
      await transitionWithinChapterSix(nextPage);
      return;
    }

    if (isChapterSevenFlowPage(currentPage) && isChapterSevenFlowPage(nextPage)) {
      await transitionWithinChapterSeven(nextPage);
      return;
    }

    if (isChapterEightFlowPage(currentPage) && isChapterEightFlowPage(nextPage)) {
      await transitionWithinChapterEight(nextPage);
      return;
    }

    if (isChapterNineFlowPage(currentPage) && isChapterNineFlowPage(nextPage)) {
      await transitionWithinChapterNine(nextPage);
      return;
    }

    if (isChapterTenFlowPage(currentPage) && isChapterTenFlowPage(nextPage)) {
      await transitionWithinChapterTen(nextPage);
      return;
    }

    if (isChapterElevenFlowPage(currentPage) && isChapterElevenFlowPage(nextPage)) {
      await transitionWithinChapterEleven(nextPage);
      return;
    }

    if (isChapterTwelveFlowPage(currentPage) && isChapterTwelveFlowPage(nextPage)) {
      await transitionWithinChapterTwelve(nextPage);
      return;
    }

    if (isChapterThirteenFlowPage(currentPage) && isChapterThirteenFlowPage(nextPage)) {
      await transitionWithinChapterThirteen(nextPage);
      return;
    }

    if (isChapterFourteenFlowPage(currentPage) && isChapterFourteenFlowPage(nextPage)) {
      await transitionWithinChapterFourteen(nextPage);
      return;
    }

    if (isChapterFifteenFlowPage(currentPage) && isChapterFifteenFlowPage(nextPage)) {
      await transitionWithinChapterFifteen(nextPage);
      return;
    }

    if (isEpilogueFlowPage(currentPage) && isEpilogueFlowPage(nextPage)) {
      await transitionWithinEpilogue(nextPage);
      return;
    }

    await crossChapterNavigate(nextPage);
    } catch (err) {
    console.error('[nav] next error:', err);
    _resetAllTransitioningFlags();
    } finally { updateNavButtons(); }
  });

  window.addEventListener('popstate', async () => {
    const statePageId = parseFloat(new URLSearchParams(window.location.search).get('page')) || 1;
    const targetPage = findPageById(statePageId);
    if (!targetPage) {
      const fallback = findNextPage(statePageId) || findPrevPage(statePageId);
      if (fallback) {
        window.location.replace(`chapter.html?page=${fallback.id}`);
      }
      return;
    }

    if (currentPage.type === 'prologue' && targetPage.type === 'prologue') {
      await transitionWithinPrologue(targetPage, false);
      return;
    }

    if (isChapterNineFlowPage(currentPage) && isChapterNineFlowPage(targetPage)) {
      await transitionWithinChapterNine(targetPage, false);
      return;
    }

    if (isChapterTenFlowPage(currentPage) && isChapterTenFlowPage(targetPage)) {
      await transitionWithinChapterTen(targetPage, false);
      return;
    }

    if (isChapterElevenFlowPage(currentPage) && isChapterElevenFlowPage(targetPage)) {
      await transitionWithinChapterEleven(targetPage, false);
      return;
    }

    if (isChapterTwelveFlowPage(currentPage) && isChapterTwelveFlowPage(targetPage)) {
      await transitionWithinChapterTwelve(targetPage, false);
      return;
    }

    if (isChapterOneFlowPage(currentPage) && isChapterOneFlowPage(targetPage)) {
      await transitionWithinChapterOne(targetPage, false);
      return;
    }

    if (isChapterTwoFlowPage(currentPage) && isChapterTwoFlowPage(targetPage)) {
      await transitionWithinChapterTwo(targetPage, false);
      return;
    }

    if (isChapterThreeFlowPage(currentPage) && isChapterThreeFlowPage(targetPage)) {
      await transitionWithinChapterThree(targetPage, false);
      return;
    }

    if (isChapterFourFlowPage(currentPage) && isChapterFourFlowPage(targetPage)) {
      await transitionWithinChapterFour(targetPage, false);
      return;
    }

    if (isChapterFiveFlowPage(currentPage) && isChapterFiveFlowPage(targetPage)) {
      await transitionWithinChapterFive(targetPage, false);
      return;
    }

    if (isChapterSixFlowPage(currentPage) && isChapterSixFlowPage(targetPage)) {
      await transitionWithinChapterSix(targetPage, false);
      return;
    }

    if (isChapterSevenFlowPage(currentPage) && isChapterSevenFlowPage(targetPage)) {
      await transitionWithinChapterSeven(targetPage, false);
      return;
    }

    if (isChapterEightFlowPage(currentPage) && isChapterEightFlowPage(targetPage)) {
      await transitionWithinChapterEight(targetPage, false);
      return;
    }

    if (isChapterNineFlowPage(currentPage) && isChapterNineFlowPage(targetPage)) {
      await transitionWithinChapterNine(targetPage, false);
      return;
    }

    if (isChapterTenFlowPage(currentPage) && isChapterTenFlowPage(targetPage)) {
      await transitionWithinChapterTen(targetPage, false);
      return;
    }

    if (isChapterElevenFlowPage(currentPage) && isChapterElevenFlowPage(targetPage)) {
      await transitionWithinChapterEleven(targetPage, false);
      return;
    }

    if (isChapterTwelveFlowPage(currentPage) && isChapterTwelveFlowPage(targetPage)) {
      await transitionWithinChapterTwelve(targetPage, false);
      return;
    }

    if (isChapterThirteenFlowPage(currentPage) && isChapterThirteenFlowPage(targetPage)) {
      await transitionWithinChapterThirteen(targetPage, false);
      return;
    }

    if (isChapterFourteenFlowPage(currentPage) && isChapterFourteenFlowPage(targetPage)) {
      await transitionWithinChapterFourteen(targetPage, false);
      return;
    }

    if (isChapterFifteenFlowPage(currentPage) && isChapterFifteenFlowPage(targetPage)) {
      await transitionWithinChapterFifteen(targetPage, false);
      return;
    }

    if (isEpilogueFlowPage(currentPage) && isEpilogueFlowPage(targetPage)) {
      await transitionWithinEpilogue(targetPage, false);
      return;
    }

    window.location.reload();
  });

  updateNavButtons();

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) return;
    e.preventDefault();
    if (e.key === 'ArrowLeft') {
      document.querySelector('.chapter-nav__prev').click();
    } else {
      document.querySelector('.chapter-nav__next').click();
    }
  });

  let _fsChangeTimer = null;
  async function onFullscreenChange() {
    clearTimeout(_fsChangeTimer);
    _fsChangeTimer = setTimeout(async () => {
      resetAllFlowCaches();
      await reRenderCurrentPage();
    }, 100);
  }
  document.addEventListener('fullscreenchange', onFullscreenChange);
  document.addEventListener('webkitfullscreenchange', onFullscreenChange);
})();

function showEndOfBookOverlay(callback) {
  var overlay = document.createElement('div');
  overlay.id = 'end-loader';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML =
    '<div class="el-text el-text--top">Конец книги.</div>' +
    '<div class="gl-rings">' +
      '<div class="gl-ring"></div>' +
      '<div class="gl-ring"></div>' +
      '<div class="gl-ring"></div>' +
    '</div>' +
    '<div class="el-text el-text--bottom">Вы возвращаетесь на поверхность.</div>';
  document.documentElement.appendChild(overlay);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      overlay.classList.add('el-show');
    });
  });

  setTimeout(callback, 2200);
}

function initWave() {
  const canvas = document.getElementById('wave-canvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const layers = [
    { amp: 28, freq: 0.012, speed: 0.6,  phase: 0,   color: 'rgba(90, 155, 195, 0.35)' },
    { amp: 20, freq: 0.018, speed: 0.45, phase: 2.1,  color: 'rgba(75, 140, 185, 0.25)' },
    { amp: 16, freq: 0.009, speed: 0.8,  phase: 4.3,  color: 'rgba(70, 125, 175, 0.20)' },
  ];

  function loop(ts) {
    const t = ts * 0.001;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    for (const layer of layers) {
      ctx.beginPath();

      for (let x = 0; x <= W; x += 3) {
        const tilt = 60;
        const baseY = H * 0.58 + (1 - x / W) * tilt;
        const y = baseY
          + Math.sin(x * layer.freq + t * layer.speed + layer.phase) * layer.amp
          + Math.sin(x * layer.freq * 1.6 + t * layer.speed * 0.7) * layer.amp * 0.35;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }

      ctx.strokeStyle = layer.color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
