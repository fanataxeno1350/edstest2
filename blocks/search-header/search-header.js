import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const linkContainerSection = document.createElement('div');
  linkContainerSection.classList.add('link-container-section');

  [...block.children].forEach((row) => {
    const linkGridColumn = document.createElement('div');
    linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
    moveInstrumentation(row, linkGridColumn);

    const ul = document.createElement('ul');
    ul.classList.add('content', 'links-container', 'accordian-content');

    // According to BlockJson, each 'link-column' item row has one cell: 'links' (a container of 'link' items).
    // The EDS structure shows this as `<div><div>Links value</div></div>`.
    // The 'Links value' div contains the actual <a> elements.
    const linksCell = row.children[0]; // Get the first (and only) cell of the row
    if (linksCell) {
      moveInstrumentation(linksCell, ul);
      // The links are nested directly within the cell's content div as <a> elements
      [...linksCell.children].forEach((linkEl) => {
        if (linkEl.tagName === 'A') {
          const li = document.createElement('li');
          moveInstrumentation(linkEl, li);
          li.append(linkEl);
          ul.append(li);
        } else if (linkEl.tagName === 'UL') {
          // Handle cases where the author might have put a UL directly
          moveInstrumentation(linkEl, ul);
          while (linkEl.firstChild) {
            ul.append(linkEl.firstChild);
          }
        }
      });
    }

    linkGridColumn.append(ul);
    linkContainerSection.append(linkGridColumn);
  });

  block.textContent = '';
  block.append(linkContainerSection);
}
