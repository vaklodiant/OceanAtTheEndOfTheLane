(function () {
  const roundButton = document.querySelector('.menu-btn .round-button');
  const screen = document.querySelector('.screen');

  if (roundButton && screen) {
    roundButton.addEventListener('click', () => {
      screen.classList.toggle('menu-open');
    });
  }
})();
