import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('banner-banner', 'banner-aem-GridColumn', 'banner-aem-GridColumn--default--12');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    item.classList.add('banner-carousel-item');
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.querySelector('img')) {
        div.classList.add('banner-d-none', 'banner-d-sm-block', 'banner-w-100', 'banner-desktop-image');
      } else if (div.querySelector('img')) {
        div.classList.add('banner-d-block', 'banner-d-sm-none', 'banner-w-100', 'banner-mobile-image');
      } else if (div.querySelector('a')) {
        div.classList.add('banner-koi-carousel-cta', 'banner-btn', 'banner-btn-primary', 'banner-btn-start-now');
      } else {
        div.classList.add('banner-content-wrapper', 'banner-position-absolute');
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
