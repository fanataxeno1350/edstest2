import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...actionRows] = [...block.children];

  block.classList.add('cta-wrapper', 'style2');

  // Heading
  if (headingRow) {
    const heading = headingRow.querySelector('div');
    if (heading) {
      const h2 = document.createElement('h2');
      moveInstrumentation(headingRow, h2);
      h2.append(...heading.childNodes);
      block.append(h2);
    }
  }

  // Description
  if (descriptionRow) {
    const description = descriptionRow.querySelector('div');
    if (description) {
      const p = document.createElement('p');
      moveInstrumentation(descriptionRow, p);
      p.append(...description.childNodes);
      block.append(p);
    }
  }

  // Actions
  if (actionRows.length > 0) {
    const ul = document.createElement('ul');
    ul.classList.add('action-list', 'stacked');

    actionRows.forEach((row) => {
      const li = document.createElement('li');
      moveInstrumentation(row, li);

      const linkCell = row.querySelector('div');
      const foundLink = linkCell ? linkCell.querySelector('a') : null;

      if (foundLink) {
        const link = document.createElement('a');
        link.href = foundLink.href;
        link.classList.add('button', 'special', 'wide');
        moveInstrumentation(foundLink, link);
        link.append(...foundLink.childNodes);
        li.append(link);
      }
      ul.append(li);
    });
    block.append(ul);
  }

  // Remove original rows
  block.querySelectorAll(':scope > div').forEach((row) => row.remove());
}
