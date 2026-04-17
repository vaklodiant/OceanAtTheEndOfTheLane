// ---- Intro + loader boot ----
(function boot() {
    const introScreen = document.querySelector('.intro-screen');
    const hasIntro = document.documentElement.classList.contains('show-intro');

    if (hasIntro) {
        sessionStorage.setItem('introShown', 'true');
        introScreen.addEventListener('click', function onIntroClick() {
            introScreen.classList.add('fade-out');
            introScreen.addEventListener('transitionend', () => {
                introScreen.style.display = 'none';
                showLogoMoment(startLoader);
            }, { once: true });
        }, { once: true });
    } else {
        startLoader();
    }
})();

function showLogoMoment(callback) {
    const loader = document.querySelector('.loader');
    const bubble = loader.querySelector('.loader__bubble');
    bubble.style.opacity = '0';

    const video = document.createElement('video');
    video.src = 'video/ocean.webm';
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.style.cssText = 'width:33vw;min-width:280px;max-width:460px;height:auto;display:block;';
    loader.appendChild(video);

    setTimeout(() => {
        loader.removeChild(video);
        bubble.style.opacity = '';
        callback();
    }, 2000);
}

function startLoader() {
    const loader = document.querySelector('.loader');
    const videos = Array.from(document.querySelectorAll('video'));
    let pending = videos.length;

    function onReady() {
        if (--pending > 0) return;
        loader.classList.add('fade-out');
        loader.addEventListener('transitionend', () => {
            loader.style.display = 'none';
        }, { once: true });
        document.querySelector('.screen').classList.add('active');
        document.body.classList.add('show');
        initializeButtonShader();
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

roundButton.addEventListener("click", () => {
    screen.classList.toggle("menu-open")
})

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

// настройки

// переход
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');

    if (!href || href.startsWith('#')) return;

    e.preventDefault();

    document.body.classList.remove('show');
    document.body.classList.add('hide');

    setTimeout(() => {
      window.location.href = href;
    }, 800);
  });
});