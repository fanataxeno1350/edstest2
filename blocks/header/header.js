import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('header');
  wrapper.classList.add('header-itc-header-section');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    item.classList.add('header-container');
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.classList.add('header-logo', 'header-image');
      } else if (div.querySelector('a')) {
        div.className = 'header-cmp-navigation__item-link';
      } else {
        div.classList.add('header-d-xl-none', 'header-collapse', 'header-navbar-collapse', 'header-justify-content-center', 'header-itc-header-icon-list', 'header-modal', 'header-fade', 'header-itc-country-selector', 'header-show');
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
