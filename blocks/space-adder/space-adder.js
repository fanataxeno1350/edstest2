import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const spaceAdderDiv = document.createElement('div');
  spaceAdderDiv.classList.add('w-100', 'pt-3', 'pt-sm-3');
  spaceAdderDiv.style.background = ''; // No background property in original HTML, so keep it empty or remove if not needed.

  moveInstrumentation(block, spaceAdderDiv);
  block.append(spaceAdderDiv);
}
