import assert from 'node:assert/strict';
import test from 'node:test';
import { setupGuideCarousel } from '../../site/shared/guide-carousel.js';

function fixture() {
  const node = () => ({ listeners: {}, attributes: {}, addEventListener(type, fn) { this.listeners[type] = fn; }, setAttribute(key, value) { this.attributes[key] = value; } });
  const track = { ...node(), scrollLeft: 0, getBoundingClientRect: () => ({ left: 12 }) };
  const cards = [0, 1, 2].map(index => ({ getBoundingClientRect: () => ({ left: 16 + index * 300 - track.scrollLeft }), focus() { this.focused = true; } }));
  track.querySelectorAll = () => cards;
  track.scrollTo = options => { track.scrollLeft = options.left; track.behavior = options.behavior; track.listeners.scroll?.(); };
  const selectors = { '#top-guide-cards': track, '.guide-controls': node(), '[data-guide-previous]': node(), '[data-guide-next]': node(), '[data-guide-position]': node() };
  const mobile = { ...node(), matches: true };
  const reducedMotion = { matches: true };
  setupGuideCarousel({ querySelector: key => selectors[key] }, mobile, reducedMotion);
  return { track, cards, mobile, controls: selectors['.guide-controls'], previous: selectors['[data-guide-previous]'], next: selectors['[data-guide-next]'], position: selectors['[data-guide-position]'] };
}

test('手動スクロールに現在位置が追従し，端では移動せず，PC復帰で操作を隠す', () => {
  const f = fixture();
  assert.equal(f.previous.attributes['aria-disabled'], 'true');
  f.previous.listeners.click();
  assert.equal(f.track.scrollLeft, 0);
  f.track.scrollTo({ left: 305 });
  assert.equal(f.position.textContent, '2 / 3');
  f.next.listeners.click();
  assert.equal(f.position.textContent, '3 / 3');
  assert.equal(f.next.attributes['aria-disabled'], 'true');
  f.next.listeners.click();
  assert.equal(f.track.scrollLeft, 600);
  assert.equal(f.track.behavior, 'instant');
  f.mobile.matches = false;
  f.mobile.listeners.change();
  assert.equal(f.controls.hidden, true);
  assert.equal(f.track.scrollLeft, 0);
});

test('カードのキーボード移動で焦点を保持し，Enterのリンク操作は妨げない', () => {
  const f = fixture();
  let prevented = false;
  f.track.listeners.keydown({ target: f.cards[0], key: 'End', preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(f.cards[2].focused, true);
  assert.equal(f.position.textContent, '3 / 3');
  prevented = false;
  f.track.listeners.keydown({ target: f.cards[2], key: 'Enter', preventDefault() { prevented = true; } });
  assert.equal(prevented, false);
  f.track.listeners.focusin({ target: f.cards[0] });
  assert.equal(f.position.textContent, '1 / 3');
});
