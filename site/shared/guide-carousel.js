export function setupGuideCarousel(root, mobile, reducedMotion) {
  const track = root.querySelector('#top-guide-cards');
  if (!track) return;
  const cards = Array.from(track.querySelectorAll('.guide-card'));
  const controls = root.querySelector('.guide-controls');
  const previous = root.querySelector('[data-guide-previous]');
  const next = root.querySelector('[data-guide-next]');
  const position = root.querySelector('[data-guide-position]');
  let current = 0;

  function update() {
    const origin = track.getBoundingClientRect().left + 4;
    current = cards.reduce((best, card, index) =>
      Math.abs(card.getBoundingClientRect().left - origin) < Math.abs(cards[best].getBoundingClientRect().left - origin) ? index : best, 0);
    position.textContent = `${current + 1} / ${cards.length}`;
    previous.setAttribute('aria-disabled', String(current === 0));
    next.setAttribute('aria-disabled', String(current === cards.length - 1));
  }

  function move(index, focus = false) {
    if (!mobile.matches || index < 0 || index >= cards.length) return;
    if (focus) cards[index].focus({ preventScroll: true });
    track.scrollTo({
      left: track.scrollLeft + cards[index].getBoundingClientRect().left - track.getBoundingClientRect().left - 4,
      behavior: focus || reducedMotion.matches ? 'instant' : 'smooth',
    });
  }

  previous.addEventListener('click', () => move(current - 1));
  next.addEventListener('click', () => move(current + 1));
  track.addEventListener('scroll', update, { passive: true });
  track.addEventListener('focusin', (event) => {
    const index = cards.indexOf(event.target);
    if (index >= 0) move(index);
  });
  track.addEventListener('keydown', (event) => {
    if (!mobile.matches || event.altKey || event.ctrlKey || event.metaKey) return;
    const index = cards.indexOf(event.target);
    if (index < 0) return;
    const target = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: cards.length - 1 }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    move(target, true);
  });
  function changeMode() {
    controls.hidden = !mobile.matches;
    if (!mobile.matches) track.scrollTo({ left: 0, behavior: 'instant' });
    update();
  }
  mobile.addEventListener('change', changeMode);
  changeMode();
}

if (typeof document !== 'undefined') {
  setupGuideCarousel(document, matchMedia('(max-width: 40rem)'), matchMedia('(prefers-reduced-motion: reduce)'));
}
