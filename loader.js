(function () {
  'use strict';

  var loader = document.getElementById('global-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.setAttribute('aria-hidden', 'true');
    loader.innerHTML =
      '<div class="gl-rings">' +
        '<div class="gl-ring"></div>' +
        '<div class="gl-ring"></div>' +
        '<div class="gl-ring"></div>' +
      '</div>';
    document.documentElement.appendChild(loader);
  }

  var isVisible = !loader.classList.contains('gl-hidden');
  var navStart = (window.performance && performance.now)
    ? (Date.now() - performance.now())
    : Date.now();
  var showTime = isVisible ? navStart : 0;
  var MIN_SHOW_MS = 600;
  var hideTimer = null;

  function show() {
    if (isVisible) return;
    if (hideTimer !== null) {
      clearTimeout(hideTimer);
      hideTimer = null;
    }
    loader.classList.remove('gl-hidden', 'gl-bursting');
    loader.style.animation = 'none';
    loader.style.opacity = '0';
    loader.style.transition = 'opacity 0.32s ease';
    loader.style.pointerEvents = 'none';
    showTime = Date.now();
    isVisible = true;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        loader.style.opacity = '1';
        loader.style.pointerEvents = '';
        setTimeout(function () {
          loader.style.transition = '';
        }, 350);
      });
    });
  }

  function doHide() {
    loader.classList.add('gl-bursting');

    loader.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';

        hideTimer = setTimeout(function () {
          loader.classList.add('gl-hidden');
          loader.classList.remove('gl-bursting');
          loader.style.opacity = '';
          loader.style.transition = '';
          loader.style.pointerEvents = '';
          isVisible = false;
          hideTimer = null;
        }, 540);
      });
    });
  }

  function hide() {
    if (!isVisible) return;
    var elapsed = Date.now() - showTime;
    var wait = MIN_SHOW_MS - elapsed;
    if (wait <= 0) {
      doHide();
    } else {
      hideTimer = setTimeout(doHide, wait);
    }
  }

  window.GlobalLoader = { show: show, hide: hide };

  if (document.readyState === 'complete') {
    hide();
  } else {
    window.addEventListener('load', function () {
      setTimeout(hide, 80);
    });
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href) return;
    if (href.charAt(0) === '#') return;
    if (href.indexOf('javascript:') === 0) return;
    if (link.target === '_blank') return;
    if (e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (href.indexOf('://') > -1 && href.indexOf(location.host) === -1) return;
    show();
  }, true);

}());
