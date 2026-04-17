import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js';

const canvas = document.getElementById('gl');
const button = document.querySelector('.button');

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
  material.uniforms.uHover.value +=
    (hoverTarget - material.uniforms.uHover.value) * 0.1;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();