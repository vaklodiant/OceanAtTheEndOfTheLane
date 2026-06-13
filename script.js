(function () {
  document.documentElement.style.setProperty('--cover-max-height', window.innerHeight + 'px');
})();

(function () {
  function checkFullscreen() {
    var fs = window.innerHeight >= window.screen.height - 5;
    document.body.classList.toggle('is-fullscreen', fs);
  }
  checkFullscreen();
  window.addEventListener('resize', checkFullscreen);
})();

(function () {
  var _rt;
  window.addEventListener('resize', function () {
    document.documentElement.classList.add('no-transition');
    clearTimeout(_rt);
    _rt = setTimeout(function () {
      document.documentElement.classList.remove('no-transition');
    }, 200);
  });
})();

(function boot() {
    const introScreen = document.querySelector('.intro-screen');
    const hasIntro = document.documentElement.classList.contains('show-intro');

    if (hasIntro) {
        sessionStorage.setItem('introShown', 'true');
        let introDismissed = false;
        function dismissIntro() {
            if (introDismissed) return;
            introDismissed = true;
            introScreen.classList.add('fade-out');
            introScreen.addEventListener('transitionend', () => {
                introScreen.style.display = 'none';
                startLoader();
            }, { once: true });
        }
        introScreen.addEventListener('click', dismissIntro, { once: true });
        document.addEventListener('keydown', function onIntroKeydown(e) {
            if (e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                document.removeEventListener('keydown', onIntroKeydown);
                dismissIntro();
            }
        });
    } else {
        startLoader();
    }
})();

function startLoader() {
    const loader = document.querySelector('.loader');
    const videos = Array.from(document.querySelectorAll('video'));
    let pending = videos.length;

    function onReady() {
        if (--pending > 0) return;
        loader.classList.add('fade-out');
        setTimeout(function () { loader.style.display = 'none'; }, 700);
        document.querySelector('.screen').classList.add('active');
        document.body.classList.add('show');
        initializeButtonShader();
        if (document.documentElement.classList.contains('no-animations')) {
            videos.forEach(function (video) { video.pause(); });
        }
    }

    if (pending === 0) {
        window.addEventListener('load', onReady);
        return;
    }

    videos.forEach(video => {
        if (video.readyState >= 4) {
            onReady();
            return;
        }
        const fallback = setTimeout(onReady, 4000);
        video.addEventListener('canplaythrough', () => {
            clearTimeout(fallback);
            onReady();
        }, { once: true });
    });
}

const roundButton = document.querySelector(".menu-btn .round-button")
const screen = document.querySelector(".screen")

if (roundButton && screen) {
    roundButton.addEventListener("click", () => {
        screen.classList.toggle("menu-open")
    })
}

function initializeButtonShader() {
    const canvas = document.querySelector('.btn-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const button = canvas.closest('.button');
    if (!button) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    const material = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            uHover: { value: 0 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            precision highp float;
            varying vec2 vUv;
            uniform float uHover;

            void main() {
                vec2 uv = vUv;
                vec2 center = vec2(0.5);
                vec2 dir = uv - center;
                float dist = length(dir);

                float lens = dist * dist * 0.38;
                lens *= mix(1.0, 0.86, uHover);

                uv += normalize(dir) * lens;

                vec2 lightDir = normalize(vec2(-0.3, -1.0));
                float spec = dot(normalize(vec2(uv.x - 0.5, uv.y - 0.05)), lightDir);
                spec = pow(max(spec, 0.0), 62.0);

                float soft = pow(max(spec, 0.0), 4.0) * 0.38;
                float highlight = spec + soft;

                float rim = smoothstep(0.82, 0.35, dist) * 0.12;
                highlight += rim;

                highlight *= mix(1.0, 0.6, uHover);
                float alpha = mix(0.2, 0.38, uHover);

                vec3 color = vec3(1.0);
                color += highlight;

                gl_FragColor = vec4(color, alpha);
            }
        `
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    let hoverTarget = 0;

    button.addEventListener('pointerenter', () => {
        hoverTarget = 1;
    });

    button.addEventListener('pointerleave', () => {
        hoverTarget = 0;
    });

    function render() {
        material.uniforms.uHover.value += (hoverTarget - material.uniforms.uHover.value) * 0.1;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    render();
}

(function () {
  var savedPageId = null;
  try { savedPageId = localStorage.getItem('bookLastPageId'); } catch (_) {}

  var overlay   = document.getElementById('resumeOverlay');
  var resumeYes = document.getElementById('resumeYes');
  var resumeNo  = document.getElementById('resumeNo');

  var startBtn = document.querySelector('.btn-start');
  if (startBtn) {
    startBtn.addEventListener('click', function () {
      if (savedPageId && overlay) {
        overlay.classList.add('visible');
        overlay.setAttribute('aria-hidden', 'false');
        return;
      }
      navigateFade('chapter.html?page=1');
    });
  }

  if (resumeYes) {
    resumeYes.addEventListener('click', function () {
      window.AudioManager?.playSound('music/sounds/toggler.mp3');
      navigateFade('chapter.html?page=' + savedPageId);
    });
  }
  if (resumeNo) {
    resumeNo.addEventListener('click', function () {
      window.AudioManager?.playSound('music/sounds/toggler.mp3');
      navigateFade('chapter.html?page=1');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.classList.remove('visible');
        overlay.setAttribute('aria-hidden', 'true');
      }
    });
  }

  function navigateFade(href) {
    document.body.classList.remove('show');
    document.body.classList.add('hide');

    var isLeavingChapter = /chapter\.html/i.test(window.location.pathname) && !/chapter\.html/i.test(href);
    var isEnteringChapter = !/chapter\.html/i.test(window.location.pathname) && /chapter\.html/i.test(href);
    var shouldFadeMusic = (isEnteringChapter || isLeavingChapter) && window.AudioManager;

    var audioFadePromise = shouldFadeMusic
      ? window.AudioManager.fadeMusicOut(600)
      : Promise.resolve();

    audioFadePromise.then(function () {
      setTimeout(function () {
        window.GlobalLoader?.show();
        setTimeout(function () { window.location.href = href; }, 400);
      }, 150);
    });
  }

  window.addEventListener('beforeunload', function () {
    if (/chapter\.html/i.test(window.location.pathname)) {
      try {
        if (window.AudioManager) {
          window.AudioManager.fadeMusicOut(0);
        }
      } catch (_) {}
    }
  });
})();

document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');

    if (!href || href.startsWith('#')) return;

    e.preventDefault();

    document.body.classList.remove('show');
    document.body.classList.add('hide');

    var isLeavingChapter = /chapter\.html/i.test(window.location.pathname) && !/chapter\.html/i.test(href);
    var isEnteringChapter = !/chapter\.html/i.test(window.location.pathname) && /chapter\.html/i.test(href);
    var shouldFadeMusic = (isLeavingChapter || isEnteringChapter) && window.AudioManager;

    var audioFadePromise = shouldFadeMusic
      ? window.AudioManager.fadeMusicOut(600)
      : Promise.resolve();

    audioFadePromise.then(function () {
      setTimeout(() => {
        window.location.href = href;
      }, 200);
    });
  });
});
