const sliders = document.querySelectorAll('.slider-wrap');

sliders.forEach(slider => {
  const input = slider.querySelector('input');
  const fill = slider.querySelector('.fill');

  const thumb = document.createElement('div');
  thumb.className = 'slider-thumb';
  slider.appendChild(thumb);

    function update() {
        const min = parseFloat(input.min) || 0;
        const max = parseFloat(input.max) || 100;
        const val = parseFloat(input.value);
        const percent = (val - min) / (max - min);
        
        // учитываем padding 16px с каждой стороны
        const trackWidth = input.offsetWidth - 32;
        fill.style.width = (percent * trackWidth) + 'px';

        thumb.style.left = (16 + percent * trackWidth - 6) + 'px';
    }

  update();
  input.addEventListener('input', update);
});

const screen = document.body;

// появление страницы
window.addEventListener('load', () => {
  document.body.classList.add('show');
});

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
const menuBtn = document.querySelector('.menu-btn .round-button');

menuBtn.addEventListener('click', () => {
  document.body.classList.toggle('menu-open');
});

function initializeSaveButtonShader() {
    const canvas = document.querySelector('.btn-save .btn-canvas');
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
    canvas.style.opacity = '0.2';

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
                float alpha = mix(0.1, 0.2, uHover);

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

window.addEventListener('load', () => {
    initializeSaveButtonShader();
});