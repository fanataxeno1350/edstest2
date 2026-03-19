import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('header-cmp-header');
  wrapper.setAttribute('data-component', 'header');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.querySelector('input')) {
        div.className = 'header-cmp-header__hamburger';
      } else if (div.children.length === 1 && div.querySelector('picture')) {
        div.classList.add('header-logo', 'header-image', 'header-cmp-header__logo');
      } else if (div.querySelector('nav')) {
        div.className = 'header-cmp-header__nav-links';
      } else {
        div.className = 'header-cmp-header__nav-icons';
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
