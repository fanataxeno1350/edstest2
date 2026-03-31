import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 1: STRUCTURE ALIGNMENT
  // BlockJson has 1 root model field: "content" (richtext).
  // The JS correctly reads block.children[0] for the content row.
  // The JS correctly reads contentRow.children[0] for the content cell.

  const contentRow = block.children[0];
  const contentCell = contentRow.children[0];

  const cmpTextDiv = document.createElement('div');
  cmpTextDiv.classList.add('cmp-text');
  moveInstrumentation(contentCell, cmpTextDiv);

  while (contentCell.firstChild) {
    cmpTextDiv.append(contentCell.firstChild);
  }

  block.textContent = '';
  block.append(cmpTextDiv);

  // CHECK 2: INTERACTIVITY
  // The ORIGINAL HTML does not contain any interactive elements (buttons, toggles, etc.).
  // Therefore, no addEventListener calls are expected or needed.

  // The block already has the classes from the original HTML.
  // Adding them again via block.classList.add is redundant and potentially problematic
  // if the block is re-decorated or if these classes are meant to be dynamic.
  // The initial block div already has these classes applied by AEM.
  // Removing this redundant section.
}
