import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The original HTML shows multiple link-grid-column elements, each containing a ul.
  // The block.children in this case represent these columns, with the first child being
  // the 'Links' container field which we can skip.
  // Each subsequent child of the block is a 'link-grid-column' in the final output.

  // Clear existing content to rebuild
  block.textContent = '';

  // Skip the first row which is the container field "links"
  const columnRows = [...block.children].slice(1);

  columnRows.forEach((columnRow) => {
    const linkGridColumn = document.createElement('div');
    linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
    moveInstrumentation(columnRow, linkGridColumn); // Move instrumentation from the column row to the new column div

    const ul = document.createElement('ul');
    ul.classList.add('content', 'links-container', 'accordian-content');

    // Each child of the columnRow is an actual "link" item.
    // The structure shows that columnRow itself contains the link items directly.
    // So, we iterate through the children of columnRow.
    [...columnRow.children].forEach((itemRow) => {
      const li = document.createElement('li');
      moveInstrumentation(itemRow, li);

      // According to BlockJson and EDS Block Structure:
      // cell[0]: field="url" label="URL" type=aem-content (contains <a>)
      // cell[1]: field="text" label="Text" type=text
      const urlCell = itemRow.children[0];
      const textCell = itemRow.children[1];

      if (urlCell) {
        const anchor = urlCell.querySelector('a');
        if (anchor) {
          const newAnchor = document.createElement('a');
          newAnchor.href = anchor.href;
          if (anchor.target) newAnchor.target = anchor.target;
          if (anchor.rel) newAnchor.rel = anchor.rel;
          moveInstrumentation(urlCell, newAnchor);

          // Use the text field for the link text if available, otherwise fallback to the anchor's text
          newAnchor.textContent = textCell ? textCell.textContent : anchor.textContent;
          li.append(newAnchor);
        }
      } else if (textCell) { // If only text cell exists, just append its content
        moveInstrumentation(textCell, li);
        while (textCell.firstChild) li.append(textCell.firstChild);
      }

      ul.append(li);
    });

    linkGridColumn.append(ul);
    block.append(linkGridColumn);
  });
}
