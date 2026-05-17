(function () {
  function initMenuSeparators() {
    const menuPanels = document.querySelectorAll('.menu-panel, .chapter-menu-panel');

    menuPanels.forEach(menuPanel => {
      const menuItems = menuPanel.querySelectorAll('.menu-item');

      menuItems.forEach((item, index) => {
        if (index < menuItems.length - 1) {
          if (item.nextElementSibling && item.nextElementSibling.classList.contains('menu-separator')) {
            return;
          }

          const separator = document.createElement('div');
          separator.className = 'menu-separator';
          item.parentNode.insertBefore(separator, item.nextSibling);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenuSeparators);
  } else {
    initMenuSeparators();
  }

  const roundButton = document.querySelector('.menu-btn .round-button');
  const screen = document.querySelector('.screen');

  if (roundButton && screen) {
    roundButton.addEventListener('click', () => {
      screen.classList.toggle('menu-open');
    });
  }

  (function () {
    var savedPageId = null;
    try { savedPageId = localStorage.getItem('bookLastPageId'); } catch (_) {}
    if (!savedPageId) return;

    var params = new URLSearchParams(window.location.search);
    var currentId = params.get('page');
    if (currentId === String(savedPageId)) return;

    var chapterMenu = document.querySelector('.chapter-menu-panel');
    if (!chapterMenu) return;

    var sep = document.createElement('div');
    sep.className = 'menu-separator';

    var link = document.createElement('a');
    link.href = 'chapter.html?page=' + savedPageId;
    link.className = 'menu-item';
    link.textContent = 'Продолжить чтение';
    link.id = 'chapterMenuContinueReading';
    link.addEventListener('click', function (e) {
      e.preventDefault();
      document.body.classList.remove('show');
      document.body.classList.add('hide');
      setTimeout(function () { window.location.href = link.href; }, 800);
    });

    chapterMenu.appendChild(sep);
    chapterMenu.appendChild(link);
  })();
})();
