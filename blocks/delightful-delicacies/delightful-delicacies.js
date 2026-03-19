import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('makerightshift-makeRightShift-healthgoal', 'makerightshift-makeRightShift-banner', 'makerightshift-aem-GridColumn', 'makerightshift-aem-GridColumn--default--12');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    item.classList.add('makerightshift-mb-md-0', 'makerightshift-mb-3', 'makerightshift-text-center');
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.querySelector('img')) {
        div.className = 'makerightshift-makeRightShift-itc-health-goal-wrapper';
      } else if (div.querySelector('a')) {
        div.classList.add('makerightshift-text-center', 'makerightshift-d-block', 'makerightshift-text-capitalize', 'makerightshift-pt-2', 'makerightshift-makeRightShift-image-label');
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
