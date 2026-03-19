import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('dynamiccardsvertwo-dynamicCardsVertwo-cmp-recipe-group');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    item.classList.add('dynamiccardsvertwo-dynamicCardsVertwo-cmp-recipe-group__carousel-item', 'dynamiccardsvertwo-dynamicCardsVertwo-cmp-carousel__item', 'dynamiccardsvertwo-dynamicCardsVertwo-slick-slide', 'dynamiccardsvertwo-dynamicCardsVertwo-slick-current', 'dynamiccardsvertwo-dynamicCardsVertwo-slick-active');
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.querySelector('h2')) {
        div.className = 'dynamiccardsvertwo-dynamicCardsVertwo-cmp-recipe-group__title';
      } else if (div.querySelector('div')) {
        div.className = 'dynamiccardsvertwo-dynamicCardsVertwo-cmp-recipe-group__subtitle';
      } else if (div.querySelector('a')) {
        div.classList.add('dynamiccardsvertwo-dynamicCardsVertwo-card', 'dynamiccardsvertwo-dynamicCardsVertwo-cmp-card--recipe', 'dynamiccardsvertwo-dynamicCardsVertwo-cmp-card--aashirvaad-recipe', 'dynamiccardsvertwo-dynamicCardsVertwo-color-background-background-2');
      } else if (div.querySelector('button')) {
        div.className = 'dynamiccardsvertwo-dynamicCardsVertwo-cmp-button';
      } else {
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
