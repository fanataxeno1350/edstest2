import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const div = document.createElement('div');
  div.classList.add('w-100', 'pt-3', 'pt-sm-3');
  div.style.background = ''; // The original HTML has an empty style attribute for background

  moveInstrumentation(block, div);
  block.append(div);

  // Image optimization (if there were any images in the block, which there aren't for this model)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
