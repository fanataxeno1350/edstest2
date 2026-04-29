import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Apply classes from the original HTML to the block wrapper
  block.classList.add('cmp-image', 'sticky__wave');

  // The block structure indicates a single row with a single image cell.
  // Using content detection to be robust, though for a single cell, direct access is less risky.
  const imageRow = block.children[0];
  if (!imageRow) return;

  const cells = [...imageRow.children];
  const imageCell = cells.find(cell => cell.querySelector('picture'));

  if (imageCell) {
    const picture = imageCell.querySelector('picture');
    const img = picture ? picture.querySelector('img') : null;

    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('cmp-image__image'); // Apply class from original HTML
      moveInstrumentation(img, optimizedImg);
      picture.replaceWith(optimizedPic);
    }
  }
}
