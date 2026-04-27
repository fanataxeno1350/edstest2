import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The buy-now-card block has no fields in its model,
  // which means it's an empty container or a placeholder.
  // As per the provided original HTML, it only has container classes.
  // Therefore, we just apply the necessary classes to the block itself.

  // Apply classes from the ORIGINAL HTML to the block element.
  // The original HTML shows:
  // <div class="buyNowCard aem-GridColumn aem-GridColumn--default--12">
  block.classList.add('buyNowCard', 'aem-GridColumn', 'aem-GridColumn--default--12');

  // Since there are no fields defined in the block's model,
  // there are no child rows or cells to process.
  // The block remains an empty container with the specified classes.
}
