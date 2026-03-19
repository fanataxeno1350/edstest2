import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('header-cmp-navigation-wrapper');
  wrapper.setAttribute('role', 'banner');
  wrapper.setAttribute('aria-label', 'navigation.header.aria.label');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.querySelector('a')) {
        div.className = 'header-cmp-navigation-wrapper__logo';
      } else if (div.querySelector('ul')) {
        div.className = 'header-cmp-navigation-wrapper__navbar';
      } else {
      }
    });
    wrapper.append(item);
  });

  block.textContent = '';
  block.append(wrapper);
}
