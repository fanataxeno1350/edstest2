import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const spaceAdderDiv = document.createElement('div');
  spaceAdderDiv.classList.add('w-100', 'pt-3', 'pt-sm-3');
  spaceAdderDiv.style.background = ''; // The original HTML has an empty style attribute

  // Move instrumentation from the block to the new div
  moveInstrumentation(block, spaceAdderDiv);

  // Clear the block and append the new div
  block.innerHTML = '';
  block.append(spaceAdderDiv);

  // Apply block-level classes from original HTML
  block.classList.add('spaceAdder', 'aem-GridColumn', 'aem-GridColumn--default--12');
}
