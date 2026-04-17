(function () {
  // Selectors that should get ripple effect
  // .button and .round-button already have overflow:hidden
  // .chapter-nav__prev/next and .btn-save get overflow:hidden via CSS
  const SELECTORS = [
    '.button',
    '.round-button',
    '.chapter-nav__prev',
    '.chapter-nav__next',
    '.btn-save .button',
  ].join(', ');

  function attachRipple(el) {
    el.addEventListener('click', function (e) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-wave';
      ripple.style.cssText = [
        'position:absolute',
        'border-radius:50%',
        'pointer-events:none',
        'background:rgba(255,255,255,0.28)',
        `width:${size}px`,
        `height:${size}px`,
        `left:${x - size / 2}px`,
        `top:${y - size / 2}px`,
        'transform:scale(0)',
        'animation:rippleExpand 900ms cubic-bezier(0.4,0,0.2,1) forwards',
        'z-index:999',
      ].join(';');

      el.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  }

  function init() {
    document.querySelectorAll(SELECTORS).forEach(attachRipple);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
