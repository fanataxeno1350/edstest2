import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('hero-cmp-hero-full-width', 'hero-parallax-child-2');
  wrapper.setAttribute('data-media-type', 'videoTypeSelected');
  wrapper.setAttribute('aria-label', '<p>Qiddiya City:&nbsp;</p>
<p><span class="heading-weight-bolder">First city</span> <span class="heading-weight-bolder">built</span><span class="heading-weight-boldest"> for play</span></p>
');
  wrapper.setAttribute('aria-hidden', 'true');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.querySelector('video') || div.querySelector('a[href$=".mp4"]')) {
        div.className = 'hero-cmp-hero-full-width__background';
      } else if (div.querySelector('a')) {
        div.className = 'hero-cmp-hero-full-width__content--ctas';
      } else {
        div.className = 'hero-cmp-hero-full-width__content';
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
