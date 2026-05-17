(function () {
  var savedPageId = null;
  try { savedPageId = localStorage.getItem('bookLastPageId'); } catch (_) {}
  if (!savedPageId) return;

  var menuPanel = document.querySelector('.menu-panel');
  if (!menuPanel) return;

  var sep = document.createElement('div');
  sep.className = 'menu-separator';

  var link = document.createElement('a');
  link.href = 'chapter.html?page=' + savedPageId;
  link.className = 'menu-item';
  link.textContent = 'Продолжить чтение';
  link.addEventListener('click', function (e) {
    e.preventDefault();
    document.body.classList.remove('show');
    document.body.classList.add('hide');
    setTimeout(function () { window.location.href = link.href; }, 800);
  });

  menuPanel.appendChild(sep);
  menuPanel.appendChild(link);
})();
