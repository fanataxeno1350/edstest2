import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The first row is the copyright, the rest are menu list items.
  const [copyrightRow, ...menuListRows] = [...block.children];

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');

  menuListRows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    // Each menu list item row should contain exactly one cell with a link.
    // We need to find the cell containing the link, not assume its index.
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));

    if (linkCell) {
      const link = linkCell.querySelector('a');
      if (link) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        moveInstrumentation(link, newLink);
        // Move all children from the original link to the new link
        while (link.firstChild) newLink.append(link.firstChild);
        li.append(newLink);
      }
    }
    menuList.append(li);
  });

  const copyrightParagraph = document.createElement('p');
  copyrightParagraph.classList.add('copyright');
  moveInstrumentation(copyrightRow, copyrightParagraph);
  // Move all content from the copyright row's first child (the cell) to the paragraph
  if (copyrightRow.firstElementChild) {
    while (copyrightRow.firstElementChild.firstChild) {
      copyrightParagraph.append(copyrightRow.firstElementChild.firstChild);
    }
  }


  block.textContent = '';
  block.append(menuList, copyrightParagraph);
}
