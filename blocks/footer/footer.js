import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('footer-itc-footer-section');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    item.classList.add('footer-row');
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.classList.add('footer-logo', 'footer-image');
      } else if (div.querySelector('a')) {
        div.classList.add('footer-footer-links', 'footer-cmp-list__item-link');
      } else {
        div.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-d-flex', 'footer-d-lg-block', 'footer-justify-content-center', 'footer-col-lg-3', 'footer-justify-content-xl-between', 'footer-footer-page-links-wrapper', 'footer-pt-md-0', 'footer-pt-4', 'footer-px-1', 'footer-itc-footer-link-left', 'footer-align-items-md-end', 'footer-flex-column', 'footer-itc-footer-link-right', 'footer-list-1', 'footer-list', 'footer-list-2', 'footer-list-4', 'footer-list-3', 'footer-contact-details', 'footer-itc-footer-secondary-lists');
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
