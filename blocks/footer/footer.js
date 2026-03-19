import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('footer-footer');
  wrapper.setAttribute('data-component', 'footer');
  wrapper.setAttribute('aria-label', 'desktop altext');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    item.classList.add('footer-cmp-footer');
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.classList.add('footer-cmp-footer__nav-logo', 'footer-logo', 'footer-image', 'footer-cmp-footer__logo', 'footer-logofssai', 'footer-cmp-footer__fssai_logo');
      } else if (div.querySelector('a')) {
        div.classList.add('footer-cmp-navigation__item', 'footer-cmp-navigation__item--level-0', 'footer-desc-1', 'footer-icon-instagram', 'footer-icon-facebok', 'footer-icon-twitter', 'footer-icon-youtube');
      } else {
        div.classList.add('footer-cmp-footer__top-content', 'footer-cmp-footer__nav-subscribe', 'footer-cmp-footer__nav', 'footer-cmp-footer__bottom-content');
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
