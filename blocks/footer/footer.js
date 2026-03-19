import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('footer-wrapper');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.querySelector('a')) {
        div.className = 'footer-cmp-navigation__logo';
      } else {
        div.classList.add('footer-navigation', 'footer-nav-css-from-wrapper', 'footer-cmp-footer__divider', 'footer-cmp-footer__bottom', 'footer-language-selector', 'footer-lang-css-from-wrapper', 'footer-policy-links', 'footer-policy-css-from-wrapper');
      }
    });
    wrapper.append(item);
  });

  block.textContent = '';
  block.append(wrapper);
}
