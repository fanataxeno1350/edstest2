import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('shiftclub-itc-club-section', 'shiftclub-mx-md-0', 'shiftclub-mx-4');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    item.classList.add('shiftclub-carousel-item');
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.querySelector('img')) {
        div.classList.add('shiftclub-carousel__img', 'shiftclub-d-block', 'shiftclub-w-md-50', 'shiftclub-w-100');
      } else {
        div.classList.add('shiftclub-w-md-50', 'shiftclub-w-100', 'shiftclub-itc-club-right-wrapper', 'shiftclub-read-more');
      }
    });
    section.append(item);
  });

  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(section);
}
