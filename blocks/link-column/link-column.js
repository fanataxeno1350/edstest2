import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, linksContainerRow, ...linkRows] = [...block.children];

  const linkGridColumn = document.createElement('div');
  linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

  // Heading
  const headingEl = document.createElement('h3');
  moveInstrumentation(headingRow.firstElementChild, headingEl);
  headingEl.classList.add('accordian-item', 'link-column__heading');
  headingEl.textContent = headingRow.firstElementChild.textContent;
  linkGridColumn.append(headingEl);

  // Links
  const ul = document.createElement('ul');
  ul.classList.add('content', 'links-container', 'accordian-content', 'collpsable');
  // Instrumentation for the container itself should be moved from the 'linksContainerRow'
  // but the content of 'linksContainerRow' is not rendered, it's just a placeholder for the container.
  // So, we move instrumentation from the row itself, not its first child.
  moveInstrumentation(linksContainerRow, ul); 

  linkRows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    // According to BlockJson, each 'link' item has two fields: 'url' (aem-content) and 'text' (text).
    // The EDS block structure confirms this: cell[0] is URL, cell[1] is Text.
    // The previous logic was trying to detect cells based on content, which is not necessary
    // when the structure is fixed by BlockJson.
    const urlCell = row.children[0]; // First child is the URL cell
    const textCell = row.children[1]; // Second child is the Text cell

    const linkEl = document.createElement('a');
    if (urlCell) {
      const foundLink = urlCell.querySelector('a');
      if (foundLink) {
        linkEl.href = foundLink.href;
        if (foundLink.target) linkEl.target = foundLink.target;
        if (foundLink.rel) linkEl.rel = foundLink.rel;
      }
      moveInstrumentation(urlCell, linkEl);
    }
    
    // The text for the link should come from the 'text' cell, if it exists,
    // otherwise from the link itself in the 'url' cell.
    if (textCell && textCell.textContent.trim() !== '') {
      linkEl.textContent = textCell.textContent;
    } else if (linkEl.textContent === '' && urlCell) { // Fallback if textCell is empty or not present
      const foundLink = urlCell.querySelector('a');
      if (foundLink) {
        linkEl.textContent = foundLink.textContent;
      }
    }
    
    li.append(linkEl);
    ul.append(li);
  });

  linkGridColumn.append(ul);

  // Accordion functionality for heading
  headingEl.addEventListener('click', () => {
    // The 'collpsable' class controls visibility/collapse.
    // The 'accordian-item' class likely controls the visual state (e.g., arrow rotation).
    ul.classList.toggle('collpsable');
    headingEl.classList.toggle('accordian-item'); // Toggle the class on the heading itself
  });

  block.textContent = '';
  block.append(linkGridColumn);
}
