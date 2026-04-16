import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The buy-now-card block has no fields defined in its model.
  // This means it's likely a placeholder or a block that is meant
  // to be empty and styled purely by its presence and block name.
  //
  // If there were fields, they would appear as rows within the block element.
  // Since there are no fields, the block element itself is the only content.
  //
  // According to the ORIGINAL HTML, the block itself should have the classes:
  // "buyNowCard aem-GridColumn aem-GridColumn--default--12".
  // The block already has "buyNowCard" from its block name.
  // We need to add the other two classes.

  block.classList.add('aem-GridColumn', 'aem-GridColumn--default--12');

  // If there were any image elements within the block (which there aren't
  // based on the empty model), we would optimize them here.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Since there are no fields, there's no further DOM manipulation needed
  // beyond adding the necessary classes to the block itself.
}
