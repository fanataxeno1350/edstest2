import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The buy-now-card block has no fields defined in its model.
  // This means it's an empty block or a placeholder.
  // Based on the provided original HTML, it only has container classes.

  // Create a div element to serve as the main container for the block.
  const buyNowCardDiv = document.createElement('div');

  // Apply the classes from the ORIGINAL HTML to the new div.
  // The original HTML shows:
  // <div class="buyNowCard aem-GridColumn aem-GridColumn--default--12">
  buyNowCardDiv.classList.add('buyNowCard', 'aem-GridColumn', 'aem-GridColumn--default--12');

  // Since the block model is empty, there are no children to process or transform.
  // We just replace the original block element with our newly created div.
  moveInstrumentation(block, buyNowCardDiv);
  block.replaceWith(buyNowCardDiv);
}
