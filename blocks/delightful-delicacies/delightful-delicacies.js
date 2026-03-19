import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('makerightshift-makeRightShift-healthgoal', 'makerightshift-makeRightShift-banner', 'makerightshift-aem-GridColumn', 'makerightshift-aem-GridColumn--default--12');

  [...block.children].forEach((row) => {
    const section = document.createElement('section');
    moveInstrumentation(row, section);
    section.classList.add('makerightshift-makeRightShift-itc-how-shift');
    while (row.firstElementChild) section.append(row.firstElementChild);
    [...section.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'makerightshift-makeRightShift-left-image-div';
      } else {
        div.classList.add('makerightshift-makeRightShift-container', 'makerightshift-makeRightShift-read-more');
      }
    });
    wrapper.append(section);
  });

  wrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(wrapper);
}
