(async () => {
  document.querySelector('.screen').style.opacity = '1';
  document.querySelector('.screen').style.filter = 'none';

  const params = new URLSearchParams(window.location.search);
  const pageId = parseInt(params.get('page')) || 1;

  let pages;
  try {
    const response = await fetch('content.json');
    if (!response.ok) throw new Error(`content.json: ${response.status}`);
    pages = await response.json();
  } catch (e) {
    console.error('Ошибка загрузки content.json:', e);
    return;
  }

  // load book text
  let bookParagraphs = [];
  try {
    const bookResponse = await fetch('text/ОкеанВКонцеДороги.txt');
    if (!bookResponse.ok) throw new Error(`book text: ${bookResponse.status}`);
    const bookText = await bookResponse.text();
    bookParagraphs = bookText.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 0);
  } catch (e) {
    console.error('Ошибка загрузки текста книги:', e);
  }

  const page = pages.find(p => p.id === pageId);
  if (!page) {
    console.error(`Страница id=${pageId} не найдена в content.json`);
    return;
  }

  const animationEnabled = localStorage.getItem('animationEnabled') !== 'false';

  // bg
  const chapterBg = document.querySelector('.chapter-bg');
  if (page.bg) chapterBg.classList.add(page.bg);

  // videos
  const video1 = document.getElementById('video1');
  const video2 = document.getElementById('video2');
  const video3 = document.getElementById('video3');
  const video4 = document.getElementById('video4');

  function loadVideo(el, src) {
    if (!src) return;
    el.src = src;
    if (!animationEnabled) {
      el.pause();
      el.removeAttribute('autoplay');
    }
  }

  loadVideo(video1, page.video1);
  loadVideo(video2, page.video2);
  loadVideo(video3, page.video3);
  loadVideo(video4, page.video4);

  // text — iterate bookParagraphs strictly from bookStart to bookEnd
  const textLeft  = document.querySelector('.chapter-text--left');
  const textRight = document.querySelector('.chapter-text--right');

  if (page.type === 'scene') {
    await document.fonts.ready;
    const containerRect = textLeft.getBoundingClientRect();
    for (let i = page.bookStart; i < page.bookEnd; i++) {
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
  } else {
    // text: show right column, split evenly
    textRight.style.display = '';
    const total = page.bookEnd - page.bookStart;
    const half  = Math.ceil(total / 2);
    for (let i = page.bookStart; i < page.bookEnd; i++) {
      const p = document.createElement('p');
      p.textContent = bookParagraphs[i];
      (i - page.bookStart < half ? textLeft : textRight).appendChild(p);
    }
  }

  // crossfade on click — video1→video2 и video3→video4 одновременно + glow state 2
  if (page.hasClick && page.video2) {
    const scene = document.querySelector('.chapter-scene');
    const glow  = document.querySelector('.chapter-glow');
    let clicked = false;
    scene.addEventListener('click', () => {
      if (clicked) return;
      clicked = true;
      [video1, video2, video3, video4].forEach(v => {
        v.style.transition = 'opacity 1s';
      });
      video1.style.opacity = '0';
      video2.style.opacity = '1';
      if (page.video3) {
        video3.style.opacity = '0';
        video4.style.opacity = '1';
      }
      if (glow) glow.classList.add('glow-state-2');
    });
  }

  // navigation
  document.querySelector('.chapter-nav__prev').addEventListener('click', () => {
    if (pageId > 1) window.location.href = `chapter.html?page=${pageId - 1}`;
  });

  document.querySelector('.chapter-nav__next').addEventListener('click', () => {
    window.location.href = `chapter.html?page=${pageId + 1}`;
  });
})();

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

initWave();
