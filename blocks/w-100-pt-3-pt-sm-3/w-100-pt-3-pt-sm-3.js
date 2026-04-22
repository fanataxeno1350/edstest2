import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('w-100', 'pt-3', 'pt-sm-3');

  // There are no fields defined in the block model, so no content to process.
  // The block itself only serves as a container for styling.
}
