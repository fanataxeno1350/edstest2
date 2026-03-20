import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('stats-cmp-stats-by-the-number', 'stats-animate-ready', 'stats-animate-in');
  wrapper.setAttribute('role', 'region');
  wrapper.setAttribute('aria-label', 'Statistics by the numbers');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    item.classList.add('stats-cmp-stats-by-the-number__tab-content');
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'stats-cmp-stats-by-the-number__image-section';
      } else if (div.querySelector('a')) {
        div.className = 'stats-cmp-stats-by-the-number__cta';
      } else {
        div.classList.add('stats-cmp-stats-by-the-number__description', 'stats-cmp-stats-by-the-number__cards');
      }
    });
    wrapper.append(item);
  });

  wrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(wrapper);
}
