import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('rscards-rs-cards');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    item.classList.add('rscards-col-xl-4', 'rscards-col-lg-6', 'rscards-pb-md-0', 'rscards-pb-4', 'rscards-row-gap-4', 'rscards-rsCards-koi-rscard-padding');
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.querySelector('img')) {
        div.classList.add('rscards-w-100', 'rscards-rsCards-rightshift-image', 'rscards-w-100', 'rscards-rsCards-kitchens-image');
      } else if (div.querySelector('a')) {
      } else {
        div.className = 'rscards-card-body';
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
