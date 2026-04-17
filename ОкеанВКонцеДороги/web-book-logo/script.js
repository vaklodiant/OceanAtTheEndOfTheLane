fetch('logo.svg')
  .then(res => res.text())
  .then(svgText => {
    const container = document.getElementById('logo-container');
    container.innerHTML = svgText;

    const svg = container.querySelector('svg');

    // Setup SVG properties
    svg.setAttribute('style', 'background: none !important; background-color: transparent !important;');
    svg.setAttribute('viewBox', svg.getAttribute('viewBox') || '0 0 618 331');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.background = 'none';
    svg.style.backgroundColor = 'transparent';
    svg.style.backgroundImage = 'none';

    // --- Create defs section ---
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    // Create pattern from gold texture
    const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
    image.setAttributeNS("http://www.w3.org/1999/xlink", "href", "textures/gold.png");
    image.setAttribute("width", "200");
    image.setAttribute("height", "200");
    image.setAttribute("preserveAspectRatio", "xMidYMid slice");
    image.id = "goldTextureImage";

    const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
    pattern.setAttribute("id", "goldTexturePattern");
    pattern.setAttribute("x", "0");
    pattern.setAttribute("y", "0");
    pattern.setAttribute("width", "100");
    pattern.setAttribute("height", "100");
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    pattern.appendChild(image);

    defs.innerHTML = `
      <!-- PRIMARY RADIAL GRADIENT - Liquid Gold Base with depth -->
      <radialGradient id="liquidGoldMain" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#fff8dc" stop-opacity="1"/>
        <stop offset="15%" stop-color="#ffe680" stop-opacity="1"/>
        <stop offset="35%" stop-color="#ffd700" stop-opacity="0.98"/>
        <stop offset="60%" stop-color="#d4af37" stop-opacity="0.92"/>
        <stop offset="85%" stop-color="#b8860b" stop-opacity="0.88"/>
        <stop offset="100%" stop-color="#654321" stop-opacity="0.8"/>
        <animate attributeName="cx" values="25%;40%;55%;35%;25%" dur="14s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="15%;45%;35%;50%;15%" dur="16s" repeatCount="indefinite"/>
        <animate attributeName="r" values="55%;70%;75%;65%;55%" dur="18s" repeatCount="indefinite"/>
      </radialGradient>

      <!-- SECONDARY SHIMMER GRADIENT - Liquid sheen -->
      <radialGradient id="liquidGoldShimmer" cx="40%" cy="35%" r="50%">
        <stop offset="0%" stop-color="#fffacd" stop-opacity="0.7"/>
        <stop offset="30%" stop-color="#ffeb99" stop-opacity="0.45"/>
        <stop offset="70%" stop-color="#e6b800" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#997700" stop-opacity="0"/>
        <animate attributeName="cx" values="30%;55%;60%;40%;30%" dur="12s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="20%;50%;40%;35%;20%" dur="14s" repeatCount="indefinite"/>
      </radialGradient>

      <!-- BRIGHT HIGHLIGHT - Realistic light reflection -->
      <radialGradient id="goldHighlight" cx="45%" cy="25%" r="35%">
        <stop offset="0%" stop-color="#fffef0" stop-opacity="0.9"/>
        <stop offset="25%" stop-color="#fff9e6" stop-opacity="0.6"/>
        <stop offset="60%" stop-color="#ffeb99" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#ffd700" stop-opacity="0"/>
        <animate attributeName="cx" values="35%;55%;65%;45%;35%" dur="15s" repeatCount="indefinite"/>
        <animate attributeName="cy" values="20%;40%;30%;45%;20%" dur="17s" repeatCount="indefinite"/>
      </radialGradient>

      <!-- MOVING LIGHT SWEEP - Dynamic light effect -->
      <radialGradient id="lightSweep" cx="50%" cy="50%" r="100%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.3"/>
        <stop offset="50%" stop-color="#ffeb99" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#d4af37" stop-opacity="0"/>
        <animate attributeName="cx" values="0%;150%" dur="8s" repeatCount="indefinite"/>
      </radialGradient>

      <!-- 3D DEPTH FILTER with texture integration -->
      <filter id="goldShine">
        <!-- Fractal noise for realistic surface variation -->
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="3" result="texture">
          <animate attributeName="baseFrequency" values="0.04;0.055;0.045;0.055;0.04" dur="20s" repeatCount="indefinite"/>
        </feTurbulence>
        
        <!-- Subtle displacement for liquid motion -->
        <feDisplacementMap in="SourceGraphic" in2="texture" scale="1.0" xChannelSelector="R" yChannelSelector="G" result="displaced"/>
        
        <!-- Saturation boost for rich color -->
        <feColorMatrix in="displaced" type="saturate" values="1.35" result="saturated"/>
        
        <!-- Brightness and contrast enhancement -->
        <feColorMatrix in="saturated" type="matrix" values="1.15 0 0 0 0.02 1.15 0 0 0.02 0 1.10 0 0 0 0 0 0 0 1 0" result="bright"/>
        
        <!-- Soft glow merge -->
        <feMerge result="final">
          <feMergeNode in="bright"/>
          <feMergeNode in="bright"/>
        </feMerge>
      </filter>

      <!-- Deep shadow filter for 3D effect -->
      <filter id="depthShadow">
        <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
        <feOffset dx="1" dy="3" result="offsetblur"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.3"/>
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    `;

    // Append pattern to defs
    defs.appendChild(pattern);
    svg.prepend(defs);

    // Remove background rectangles
    const rects = svg.querySelectorAll('rect');
    rects.forEach(rect => {
      const fill = rect.getAttribute('fill');
      if (fill && (fill === 'white' || fill === '#ffffff' || fill === '#f5f5f5' || fill.toLowerCase().includes('gray'))) {
        rect.remove();
      }
    });

    // Apply gradients and filters to paths
    const paths = svg.querySelectorAll('path');
    
    paths.forEach((p, index) => {
      // Distribute three different gradients for 3D depth effect
      if (index % 3 === 0) {
        p.setAttribute('fill', 'url(#liquidGoldMain)');
        p.setAttribute('opacity', '1');
      } else if (index % 3 === 1) {
        p.setAttribute('fill', 'url(#liquidGoldShimmer)');
        p.setAttribute('opacity', '0.96');
      } else {
        p.setAttribute('fill', 'url(#liquidGoldMain)');
        p.setAttribute('opacity', '0.99');
      }
      
      // Add slight filter to individual paths
      p.setAttribute('filter', 'url(#depthShadow)');
    });

    // Create realistic highlight clones for depth perception
    paths.forEach((p, index) => {
      if (index % 2 === 0) {
        const clone = p.cloneNode(true);
        clone.setAttribute('fill', 'url(#goldHighlight)');
        clone.setAttribute('opacity', '0.7');
        clone.setAttribute('pointer-events', 'none');
        clone.setAttribute('filter', 'none');
        svg.appendChild(clone);
      }
    });

    // Add moving light sweep layer
    const lightSweepPath = paths[0].cloneNode(true);
    if (lightSweepPath) {
      lightSweepPath.setAttribute('fill', 'url(#lightSweep)');
      lightSweepPath.setAttribute('opacity', '0.4');
      lightSweepPath.setAttribute('pointer-events', 'none');
      svg.appendChild(lightSweepPath);
    }

    // Apply main texture filter to SVG
    svg.setAttribute('filter', 'url(#goldShine)');
    svg.style.backgroundColor = 'transparent';
    svg.style.background = 'transparent';
  });

// Animation controls via JavaScript for advanced effects
window.addEventListener('load', () => {
  const svg = document.querySelector('svg');
  if (svg) {
    // Enhance with dynamic shadow response
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      const lightSweep = svg.querySelector('#lightSweep > animate[attributeName="cx"]');
      if (lightSweep) {
        lightSweep.setAttribute('values', `${x - 50}%;${x + 150}%`);
      }
    });
  }
});