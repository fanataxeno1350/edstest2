import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.classList.add('cmp-breadcrumb');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  ol.classList.add('breadcrumb'); // Use class from ORIGINAL HTML

  // Process each item row
  [...block.children].forEach((row) => {
    const [nameCell, linkCell, positionCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('breadcrumb-item'); // Use class from ORIGINAL HTML

    const anchor = document.createElement('a');
    // Correctly read href from aem-content cell
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    // nameCell is type=text, so .textContent is correct
    anchor.textContent = nameCell.textContent.trim();

    moveInstrumentation(row, li);
    li.append(anchor);
    ol.append(li);
  });

  nav.append(ol);
  block.innerHTML = '';
  block.append(nav);
  block.classList.add('breadcrumb'); // Add the top-level class from ORIGINAL HTML
}
