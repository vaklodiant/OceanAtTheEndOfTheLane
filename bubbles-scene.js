(function(){
  const id = parseInt(new URLSearchParams(location.search).get('page'))||1;
  fetch('content.json').then(r=>r.json()).then(pages=>{
    const p = pages.find(x=>x.id===id);
    if (p && p.type === 'scene') {

(function () {
  const NS = 'http://www.w3.org/2000/svg';

  function rand(a, b) { return Math.random() * (b - a) + a; }
  function ease(t) { return t < 0.5 ? 2*t*t : -1 + (4-2*t)*t; }

  function makeBlob(cx, cy, rx, ry, opts) {
    const sx = opts.squishX||0, sy = opts.squishY||0;
    const lx = opts.leanX||0,   ly = opts.leanY||0;
    const top    = [cx + rand(-rx*.18,rx*.18)+lx*.4,  cy - ry*(1+sy)+rand(-ry*.12,ry*.12)];
    const right  = [cx + rx*(1+sx)+rand(-rx*.1,rx*.1)+lx, cy + rand(-ry*.18,ry*.18)+ly*.3];
    const bottom = [cx + rand(-rx*.18,rx*.18)+lx*.4,  cy + ry*(1+sy)+rand(-ry*.12,ry*.12)];
    const left   = [cx - rx*(1+sx)+rand(-rx*.1,rx*.1)+lx, cy + rand(-ry*.18,ry*.18)+ly*.3];
    const hx  = rx*(0.58+rand(-.08,.08)), hy  = ry*(0.58+rand(-.08,.08));
    const hx2 = rx*(0.58+rand(-.08,.08)), hy2 = ry*(0.58+rand(-.08,.08));
    const f = n => n.toFixed(2);
    return [
      `M ${f(top[0])} ${f(top[1])}`,
      `C ${f(top[0]+hx+lx*.2)} ${f(top[1]+rand(-ry*.1,ry*.1))}, ${f(right[0]+rand(-rx*.1,rx*.1))} ${f(right[1]-hy2)}, ${f(right[0])} ${f(right[1])}`,
      `C ${f(right[0]+rand(-rx*.08,rx*.08))} ${f(right[1]+hy2)}, ${f(bottom[0]+hx+lx*.2)} ${f(bottom[1]+rand(-ry*.1,ry*.1))}, ${f(bottom[0])} ${f(bottom[1])}`,
      `C ${f(bottom[0]-hx2+lx*.1)} ${f(bottom[1]+rand(-ry*.1,ry*.1))}, ${f(left[0]+rand(-rx*.08,rx*.08))} ${f(left[1]+hy)}, ${f(left[0])} ${f(left[1])}`,
      `C ${f(left[0]+rand(-rx*.08,rx*.08))} ${f(left[1]-hy)}, ${f(top[0]-hx2+lx*.1)} ${f(top[1]+rand(-ry*.1,ry*.1))}, ${f(top[0])} ${f(top[1])}`,
      'Z'
    ].join(' ');
  }

  function interpolatePath(a, b, t) {
    const nA = a.match(/-?\d+\.?\d*/g).map(Number);
    const nB = b.match(/-?\d+\.?\d*/g).map(Number);
    let idx = 0;
    return a.replace(/-?\d+\.?\d*/g, () => {
      const v = (nA[idx] + (nB[idx] - nA[idx]) * t).toFixed(2);
      idx++;
      return v;
    });
  }

  function getOpts(t, off, rx, ry) {
    return {
      squishX: Math.sin(t*1.3+off)*0.13,
      squishY: Math.cos(t*0.9+off)*0.10,
      leanX:   Math.sin(t*0.7+off*1.4)*rx*0.22,
      leanY:   Math.cos(t*1.1+off*0.8)*ry*0.10,
    };
  }

  const activeBubbles = [];
  let loopRunning = false;

  function sharedLoop(ts) {
    for (let i = activeBubbles.length - 1; i >= 0; i--) {
      const b = activeBubbles[i];

      if (b._lastTs === null) b._lastTs = ts;
      const dt = (ts - b._lastTs) / 1000;
      b._lastTs = ts;
      b.totalT += dt;

      if (b.startTs === null) b.startTs = ts + b._delay;
      if (ts < b.startTs) continue;

      const prog = Math.min((ts - b.startTs) / b.driftDur, 1);

      if (prog >= 1) {
        if (b.wrapper.parentNode === b._container) b._container.removeChild(b.wrapper);
        activeBubbles.splice(i, 1);
        spawnBubble(b._container, 0);
        continue;
      }

      let op;
      if      (prog < 0.15) op = (prog / 0.15) * b.maxOp;
      else if (prog < 0.80) op = b.maxOp;
      else                  op = b.maxOp * (1 - (prog - 0.80) / 0.20);

      const dy = -prog * b.travelY;
      const dx = Math.sin(prog * Math.PI * 1.3) * b.arcAmp;

      b.wrapper.style.transform = `translate(${dx}px,${dy}px)`;
      b.wrapper.style.opacity   = op.toFixed(3);

      if (b.morphStart === null) b.morphStart = ts;
      const mp = Math.min((ts - b.morphStart) / b.morphDur, 1);
      b.path.setAttribute('d', interpolatePath(b.shapeFrom, b.shapeTo, ease(mp)));

      if (mp >= 1) {
        b.shapeFrom  = b.shapeTo;
        b.shapeTo    = makeBlob(b.cx, b.cy, b.rx, b.ry, getOpts(b.totalT + rand(1, 2), b.off, b.rx, b.ry));
        b.morphStart = ts;
        b.morphDur   = rand(2000, 4000);
      }
    }

    if (activeBubbles.length > 0) {
      requestAnimationFrame(sharedLoop);
    } else {
      loopRunning = false;
    }
  }

  function ensureLoopRunning() {
    if (!loopRunning) {
      loopRunning = true;
      requestAnimationFrame(sharedLoop);
    }
  }

  function spawnBubble(container, initialDelay) {
    const cw = container.offsetWidth  || 200;
    const ch = container.offsetHeight || 300;

    const w   = Math.random() < 0.30 ? rand(3, 7) : rand(8, 18);
    const h   = w * rand(0.78, 1.22);
    const pad = 10;
    const boxW = w + pad, boxH = h + pad;
    const cx = boxW / 2, cy = boxH / 2;
    const rx = w / 2,    ry = h / 2;

    const startX   = rand(0, Math.max(1, cw - boxW));
    const driftDur = rand(9000, 20000);
    const travelY  = ch + boxH * 2;
    const arcAmp   = rand(18, 52) * (Math.random() > 0.5 ? 1 : -1);
    const maxOp    = rand(0.45, 0.80);
    const delay    = (initialDelay !== undefined) ? initialDelay : 0;

    const wrapper = document.createElement('div');
    wrapper.style.cssText = `position:absolute;left:${startX}px;bottom:${-boxH}px;width:${boxW}px;height:${boxH}px;pointer-events:none;opacity:0;`;

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width',  boxW);
    svg.setAttribute('height', boxH);
    svg.setAttribute('viewBox', `0 0 ${boxW} ${boxH}`);
    svg.style.overflow = 'visible';

    const path = document.createElementNS(NS, 'path');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'rgba(210,228,255,0.80)');
    path.setAttribute('stroke-width', (w < 7 ? rand(0.6, 1.1) : rand(1.0, 1.8)).toFixed(1));
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-linecap',  'round');

    svg.appendChild(path);
    wrapper.appendChild(svg);
    container.appendChild(wrapper);

    const off      = rand(0, Math.PI * 2);
    let totalT     = rand(0, 100);
    let shapeFrom  = makeBlob(cx, cy, rx, ry, getOpts(totalT, off, rx, ry));
    let shapeTo    = makeBlob(cx, cy, rx, ry, getOpts(totalT + rand(1, 2), off, rx, ry));
    path.setAttribute('d', shapeFrom);

    activeBubbles.push({
      wrapper, path,
      startTs: null, driftDur, travelY, arcAmp, maxOp,
      morphStart: null, morphDur: rand(2000, 4000),
      shapeFrom, shapeTo,
      off, totalT, rx, ry, cx, cy,
      _container: container,
      _delay: delay,
      _lastTs: null,
    });

    ensureLoopRunning();
  }

  function createZone(cssText, zIndex) {
    const div = document.createElement('div');
    div.style.cssText = `position:absolute;pointer-events:none;overflow:visible;z-index:${zIndex};${cssText}`;
    return div;
  }

  function initBubbles() {
    const cover = document.querySelector('.cover');
    if (!cover) return;

    const leftZone = createZone('left:2%;top:46%;width:26%;height:48%;', 0);
    const rightZone = createZone('left:54%;top:17%;width:27%;height:43%;', 3);

    cover.appendChild(leftZone);
    cover.appendChild(rightZone);

    for (let i = 0; i < 4; i++) spawnBubble(leftZone,  rand(0, 6000));
    for (let i = 0; i < 3; i++) spawnBubble(rightZone, rand(0, 6000));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBubbles);
  } else {
    initBubbles();
  }
})();

    }
  });
})();
