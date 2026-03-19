import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('slickcarousel-cmp-carousel');
  wrapper.setAttribute('id', 'slickcarousel-45c1cf16aa');
  wrapper.setAttribute('data-placeholder-text', 'false');
  wrapper.setAttribute('data-cmp-is', 'carousel');
  wrapper.setAttribute('data-show-infinite-scroll', 'false');
  wrapper.setAttribute('data-show-arrows', 'true');
  wrapper.setAttribute('data-show-dots', 'true');
  wrapper.setAttribute('data-item-count-per-slide', '1');
  wrapper.setAttribute('data-auto-play-is-enabled', 'false');
  wrapper.setAttribute('data-auto-play-speed-in-ms', '2000');
  wrapper.setAttribute('data-reveal-next-item-partially', 'false');
  wrapper.setAttribute('data-component', 'carousel');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    item.classList.add('slickcarousel-cmp-carousel__item', 'slickcarousel-cmp-carousel__item--active', 'slickcarousel-slick-slide', 'slickcarousel-slick-current', 'slickcarousel-slick-active');
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.querySelector('img')) {
        div.className = 'slickcarousel-banner-cmp-banner__item-logo';
      } else if (div.querySelector('h2')) {
        div.className = 'slickcarousel-banner-cmp-banner__title';
      } else if (div.querySelector('h3')) {
        div.className = 'slickcarousel-banner-cmp-banner__sub-title';
      } else if (div.children.length === 1 && div.querySelector('picture')) {
        div.classList.add('slickcarousel-w-100', 'slickcarousel-d-block');
      } else if (div.querySelector('a')) {
        div.classList.add('slickcarousel-null', 'slickcarousel-button', 'slickcarousel-cmp-button--primary-anchor');
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
