import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('footprint-cmp-our-foot-print');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    item.classList.add('footprint-item');
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.querySelector('video') || div.querySelector('a[href$=".mp4"]')) {
        div.className = 'footprint-cmp-card__media';
      } else {
        div.className = 'footprint-cmp-card__info';
      }
    });
    wrapper.append(item);
  });

  block.textContent = '';
  block.append(wrapper);
}
