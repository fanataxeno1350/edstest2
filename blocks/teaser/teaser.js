import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('teaser-cmp-teaser');
  wrapper.setAttribute('data-component', 'teaser');
  wrapper.setAttribute('data-show-media-url', 'false');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    item.classList.add('teaser-cmp-teaser__content');
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.querySelector('a')) {
        div.className = 'teaser-cmp-teaser__action-container';
      } else {
        div.classList.add('teaser-cmp-teaser__title', 'teaser-cmp-teaser__description');
      }
    });
    wrapper.append(item);
  });

  block.textContent = '';
  block.append(wrapper);
}
