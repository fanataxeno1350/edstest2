import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [textRow] = [...block.children];

  const textDiv = document.createElement('div');
  textDiv.classList.add('cmp-text'); // Class name from original HTML
  moveInstrumentation(textRow, textDiv);

  // Append all children from the original textRow to the new textDiv
  while (textRow.firstChild) {
    textDiv.append(textRow.firstChild);
  }

  block.textContent = '';
  // Add block-level classes from original HTML
  block.classList.add('text', 'cta-text', 'font-weight-medium');
  block.append(textDiv);
}
