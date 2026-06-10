(function () {

  function checkFullscreen() {
    var fs = window.innerHeight >= window.screen.height - 5;
    document.body.classList.toggle('is-fullscreen', fs);
  }
  checkFullscreen();
  window.addEventListener('resize', checkFullscreen);
})();

(function () {
  'use strict';

  var KEY_MUSIC_VOL  = 'musicVolume';
  var KEY_SOUNDS_VOL = 'soundsVolume';
  var KEY_IDX_TIME   = 'bgMusicIndexTime';
  var KEY_CHR_TIME   = 'bgMusicChapterTime';

  var isChapterPage = /chapter\.html/i.test(window.location.pathname);
  var musicSrc = isChapterPage ? 'music/chaptermusic.mp3' : 'music/index.mp3';
  var timeKey  = isChapterPage ? KEY_CHR_TIME : KEY_IDX_TIME;
  var currentZone = isChapterPage ? 'chapter' : 'index';
  var lastZone = sessionStorage.getItem('musicZone');
  var zoneChanged = lastZone && lastZone !== currentZone;

  sessionStorage.setItem('musicZone', currentZone);

  var musicVol  = parseFloat(localStorage.getItem(KEY_MUSIC_VOL)  || '0.7');
  var soundsVol = parseFloat(localStorage.getItem(KEY_SOUNDS_VOL) || '0.7');

  var bgMusic = new Audio(musicSrc);
  bgMusic.loop   = true;
  bgMusic.preload = 'auto';
  bgMusic.volume = 0;
  bgMusic.crossOrigin = 'anonymous';

  var savedTime = parseFloat(sessionStorage.getItem(timeKey) || '0');
  var isRestoringPosition = !zoneChanged && lastZone && savedTime > 0;

  function initMusicPlayback() {
    if (zoneChanged || !lastZone) {
      try {
        bgMusic.currentTime = 0;
      } catch (e) {}
    } else {
      if (savedTime > 0) {
        var dur = bgMusic.duration;
        try {
          bgMusic.currentTime = (dur && dur > 0) ? (savedTime % dur) : savedTime;
        } catch (e) {}
      }
    }
  }

  if (bgMusic.readyState >= 1) {
    initMusicPlayback();
  } else {
    bgMusic.addEventListener('loadedmetadata', initMusicPlayback, { once: true });
  }


  window.addEventListener('beforeunload', function () {
    sessionStorage.setItem(timeKey, String(bgMusic.currentTime));
  });


  function tryPlayMusic() {
    bgMusic.play().catch(function () {
      document.addEventListener('pointerdown', function onUnlock() {
        bgMusic.play().catch(function () {});
        document.removeEventListener('pointerdown', onUnlock);
      });
    });


    var targetVolume = musicVol;
    var currentVol = bgMusic.volume || 0;
    var fadeStep = (targetVolume - currentVol) / 20;
    var fadeInterval = setInterval(function () {
      bgMusic.volume = Math.min(bgMusic.volume + fadeStep, targetVolume);
      if (bgMusic.volume >= targetVolume) {
        bgMusic.volume = targetVolume;
        clearInterval(fadeInterval);
      }
    }, 25);
  }


  if (document.readyState === 'complete') {
    setTimeout(tryPlayMusic, 100);
  } else {
    window.addEventListener('load', function () {
      setTimeout(tryPlayMusic, 100);
    });
  }


  var soundPool = [];
  var maxPoolSize = 10;

  function playSound(src) {
    if (soundsVol <= 0) return;

    var s;
    if (soundPool.length > 0) {
      s = soundPool.pop();
      s.src = src;
    } else {
      s = new Audio(src);
    }

    s.volume = soundsVol;
    s.currentTime = 0;

    s.onended = function () {
      if (soundPool.length < maxPoolSize) {
        soundPool.push(s);
      }
    };

    s.play().catch(function () {});
  }

  function fadeMusicOut(duration) {
    return new Promise(function (resolve) {
      if (duration <= 0) {
        bgMusic.volume = 0;
        bgMusic.pause();
        resolve();
        return;
      }

      var startTime = Date.now();
      var startVolume = bgMusic.volume;
      var step = function () {
        var elapsed = Date.now() - startTime;
        var progress = Math.min(elapsed / duration, 1);
        bgMusic.volume = startVolume * (1 - progress);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          bgMusic.volume = 0;
          bgMusic.pause();
          resolve();
        }
      };
      step();
    });
  }

  function fadeMusicIn(duration) {
    return new Promise(function (resolve) {
      bgMusic.play().catch(function () {});

      if (duration <= 0) {
        bgMusic.volume = musicVol;
        resolve();
        return;
      }

      var targetVolume = musicVol;
      var startVolume = bgMusic.volume;
      var startTime = Date.now();

      var step = function () {
        var elapsed = Date.now() - startTime;
        var progress = Math.min(elapsed / duration, 1);
        bgMusic.volume = startVolume + (targetVolume - startVolume) * progress;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          bgMusic.volume = targetVolume;
          resolve();
        }
      };
      step();
    });
  }

  var healthCheckInterval = setInterval(function () {
    if (bgMusic.paused && bgMusic.volume > 0) {
      bgMusic.play().catch(function () {});
    }

    if (_ambientAudio && _ambientAudio.paused && _ambientSrc) {
      _ambientAudio.play().catch(function () {});
    }

    if (!bgMusic.paused && bgMusic.volume === 0 && bgMusic.currentTime > 0) {
      if (bgMusic._silentSince === undefined) {
        bgMusic._silentSince = Date.now();
      } else if (Date.now() - bgMusic._silentSince > 300) {
        bgMusic.volume = musicVol;
        bgMusic._silentSince = undefined;
      }
    } else if (bgMusic.volume > 0) {
      bgMusic._silentSince = undefined;
    }
  }, 250);

  var soundsToPreload = [
    'music/sounds/menuitemclick.mp3',
    'music/sounds/menu.mp3',
    'music/sounds/toggler.mp3',
    'music/sounds/save.mp3',
    'music/sounds/startstory.mp3'
  ];

  function preloadSounds() {
    if (soundPool.length >= soundsToPreload.length) return;

    var idleOrDefer = typeof requestIdleCallback !== 'undefined'
      ? requestIdleCallback
      : function (cb) { setTimeout(cb, 0); };

    idleOrDefer(function () {
      soundsToPreload.forEach(function (src) {
        var exists = soundPool.some(function (s) { return s.src === src; });
        if (exists) return;

        var s = new Audio(src);
        s.volume = soundsVol;
        s.preload = 'auto';
        s.load();
        soundPool.push(s);
      });
    });
  }

  if (document.readyState === 'complete') {
    preloadSounds();
  } else {
    window.addEventListener('load', preloadSounds);
  }

  var _ambientSrc        = null;
  var _ambientAudio      = null;
  var _ambientTargetVol  = 0;
  var _periodicInterval  = null;
  var _XFADE_S           = 3;

  function _fadeOut(audio, durationMs, onDone) {
    var sv = audio.volume, t0 = Date.now();
    var id = setInterval(function () {
      var p = Math.min((Date.now() - t0) / durationMs, 1);
      audio.volume = sv * (1 - p);
      if (p >= 1) { audio.volume = 0; clearInterval(id); if (onDone) onDone(); }
    }, 20);
  }

  function _fadeIn(audio, targetVol, durationMs) {
    var t0 = Date.now();
    var id = setInterval(function () {
      if (_ambientAudio !== audio) { clearInterval(id); return; }
      var p = Math.min((Date.now() - t0) / durationMs, 1);
      audio.volume = targetVol * p;
      if (p >= 1) { audio.volume = targetVol; clearInterval(id); }
    }, 20);
  }

  function _startAmbientAudio(src, targetVol, fadeInMs) {
    var a = new Audio(src);
    a.loop = true;
    a.volume = 0;
    _ambientAudio = a;
    _fadeIn(a, targetVol, fadeInMs);

    a.play().catch(function () {
      document.addEventListener('pointerdown', function onUnlock() {
        if (_ambientAudio !== a) return;
        a.currentTime = 0;
        a.volume = 0;
        a.play().catch(function () {});
        _fadeIn(a, targetVol, Math.min(fadeInMs, 800));
      }, { once: true });
    });

    a.addEventListener('timeupdate', function onTU() {
      if (_ambientAudio !== a) { a.removeEventListener('timeupdate', onTU); return; }
      if (!a.duration || a.duration === Infinity || a.duration < _XFADE_S * 2) return;
      if (a.currentTime >= a.duration - _XFADE_S && !a._xfading) {
        a._xfading = true;
        a.loop = false;
        a.removeEventListener('timeupdate', onTU);
        _startAmbientAudio(src, targetVol, _XFADE_S * 1000);
        _fadeOut(a, _XFADE_S * 1000, function () { a.pause(); });
      }
    });
  }

  function clearPeriodic() {
    if (_periodicInterval) { clearInterval(_periodicInterval); _periodicInterval = null; }
  }

  function playPeriodic(src, intervalMs) {
    clearPeriodic();
    if (soundsVol <= 0) return;
    playSound(src);
    _periodicInterval = setInterval(function () { playSound(src); }, intervalMs);
  }

  function setSceneAmbient(src, fadeInMs, fadeOutMs, volumeScale) {
    try {
      if (fadeInMs === undefined) fadeInMs = 1000;
      if (fadeOutMs === undefined) fadeOutMs = 800;
      if (volumeScale === undefined) volumeScale = 0.7;
      clearPeriodic();
      if (src === _ambientSrc && _ambientAudio && !_ambientAudio.paused) return;

      if (_ambientAudio) {
        var old = _ambientAudio;
        _ambientAudio = null;
        _fadeOut(old, fadeOutMs, function () { old.pause(); });
      }
      _ambientSrc = src || null;

      if (src && soundsVol > 0) {
        _ambientTargetVol = soundsVol * volumeScale;
        _startAmbientAudio(src, _ambientTargetVol, fadeInMs);
      }
    } catch (e) {
      console.warn('[AudioManager] setSceneAmbient error:', e);
    }
  }

  window.AudioManager = {
    playSound:       playSound,
    setSceneAmbient: setSceneAmbient,
    playPeriodic:    playPeriodic,
    clearPeriodic:   clearPeriodic,
    fadeMusicOut:    fadeMusicOut,
    fadeMusicIn:     fadeMusicIn,
    preloadSounds:   preloadSounds
  };

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;

    if (t.closest('.menu-item')) {
      playSound('music/sounds/menuitemclick.mp3');
      return;
    }
    if (t.closest('.menu-btn')) {
      playSound('music/sounds/menu.mp3');
      return;
    }
    if (t.closest('.tab-btn')) {
      playSound('music/sounds/toggler.mp3');
      return;
    }
    if (t.closest('.carousel-arrow') || t.closest('.chapter-nav__prev') || t.closest('.chapter-nav__next')) {
      playSound('music/sounds/toggler.mp3');
    }
  });

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented) return;
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#') return;
    if (href.indexOf('javascript:') === 0) return;
    if (link.target === '_blank') return;
    if (e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (href.indexOf('://') > -1 && href.indexOf(location.host) === -1) return;
    var destIsChapter = /chapter\.html/i.test(href);
    if (destIsChapter === isChapterPage) return;
    e.preventDefault();
    document.body.classList.remove('show');
    document.body.classList.add('hide');
    fadeMusicOut(500).then(function () { window.location.href = href; });
  });

  document.querySelectorAll('.hex-toggle input[type="checkbox"]').forEach(function (el) {
    el.addEventListener('change', function () {
      playSound('music/sounds/toggler.mp3');
    });
  });

  var saveBtn = document.querySelector('.btn-save .button');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      playSound('music/sounds/save.mp3');
    });
  }

  var startBtn = document.querySelector('.btn-start .button');
  if (startBtn) {
    startBtn.addEventListener('click', function () {
      playSound('music/sounds/startstory.mp3');
    });
  }

  setTimeout(function () {
    var sliderSoundsEl = document.getElementById('slider-sounds');
    var sliderMusicEl  = document.getElementById('slider-music');

    if (sliderSoundsEl) {
      sliderSoundsEl.value = Math.round(soundsVol * 100);
      sliderSoundsEl.dispatchEvent(new Event('input', { bubbles: true }));
      sliderSoundsEl.addEventListener('input', function () {
        soundsVol = sliderSoundsEl.value / 100;
      });
    }

    if (sliderMusicEl) {
      sliderMusicEl.value = Math.round(musicVol * 100);
      sliderMusicEl.dispatchEvent(new Event('input', { bubbles: true }));
      sliderMusicEl.addEventListener('input', function () {
        musicVol = sliderMusicEl.value / 100;
        bgMusic.volume = musicVol;
      });
    }

    if (saveBtn && (sliderSoundsEl || sliderMusicEl)) {
      saveBtn.addEventListener('click', function () {
        if (sliderSoundsEl) localStorage.setItem(KEY_SOUNDS_VOL, String(soundsVol));
        if (sliderMusicEl)  localStorage.setItem(KEY_MUSIC_VOL,  String(musicVol));
        bgMusic.volume = musicVol;
      });
    }
  }, 0);

})();
