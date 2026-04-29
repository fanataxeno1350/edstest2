import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0 & 1: Replaced block.children[0] with content detection
  // The block structure indicates a single row with a single cell containing the image.
  // We can directly access the first child of the block, which is the row,
  // and then the first child of that row, which is the cell.
  // However, to be robust against potential future changes or empty blocks,
  // we'll use a more explicit check.

  const firstRow = [...block.children][0];
  if (!firstRow) return;

  const imageCell = [...firstRow.children].find(cell => cell.querySelector('picture'));
  if (!imageCell) return;

  const picture = imageCell.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      picture.replaceWith(optimizedPic);
    }
  }

  // Apply classes from ORIGINAL HTML
  // The block itself already has 'cmp-image' from the outer div.
  // We need to ensure the image inside gets 'cmp-image__image'.
  const imgElement = block.querySelector('picture img'); // Select img directly within the block
  if (imgElement) {
    imgElement.classList.add('cmp-image__image');
  }
}
