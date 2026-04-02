import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('page-title');

  const h1 = document.createElement('h1');
  if (headingRow) {
    moveInstrumentation(headingRow, h1);
    while (headingRow.firstChild) {
      h1.append(headingRow.firstChild);
    }
  }

  header.append(h1);
  block.textContent = '';
  block.append(header);
}
