import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The block.children structure is:
  // [0] closeIconRow
  // [1] closeLabelRow
  // [2...] menuItemRows

  // Find closeIconRow and closeLabelRow using content detection, not fixed indices
  let closeIconRow;
  let closeLabelRow;
  const menuItemRows = [];

  [...block.children].forEach((row) => {
    if (row.querySelector('picture') && !closeIconRow) {
      closeIconRow = row;
    } else if (row.textContent.trim() === 'Close Label value' && !closeLabelRow) { // Assuming 'Close Label value' is unique to the label row
      closeLabelRow = row;
    } else {
      menuItemRows.push(row);
    }
  });

  const innerDiv = document.createElement('div');
  innerDiv.classList.add('inner'); // Class from ORIGINAL HTML

  const ul = document.createElement('ul');

  menuItemRows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const linkEl = document.createElement('a');
    let headingEl = document.createElement('h2');
    let descriptionEl = document.createElement('p');

    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const headingCell = cells.find(cell => cell.querySelector('h2') || (cell.textContent.trim().length > 0 && cell.textContent.trim().length < 50 && !cell.querySelector('a') && !cell.querySelector('p')));
    const descriptionCell = cells.find(cell => cell.querySelector('p') || (cell.textContent.trim().length >= 50 && !cell.querySelector('a') && !cell.querySelector('h2')));

    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        linkEl.href = foundLink.href;
        // Move link content to linkEl, then append heading and description later
        moveInstrumentation(linkCell, linkEl);
        // Preserve existing content within the link if any, or just move the link itself
        while (foundLink.firstChild) linkEl.append(foundLink.firstChild);
      }
    }

    if (headingCell) {
      const h2 = headingCell.querySelector('h2');
      if (h2) {
        headingEl = h2;
      } else {
        headingEl.textContent = headingCell.textContent.trim();
      }
      moveInstrumentation(headingCell, headingEl);
    }

    if (descriptionCell) {
      const p = descriptionCell.querySelector('p');
      if (p) {
        descriptionEl = p;
      } else {
        descriptionEl.textContent = descriptionCell.textContent.trim();
      }
      moveInstrumentation(descriptionCell, descriptionEl);
    }

    // Append heading and description to the link element
    if (headingEl.textContent.trim()) {
      linkEl.append(headingEl);
    }
    if (descriptionEl.textContent.trim()) {
      linkEl.append(descriptionEl);
    }
    li.append(linkEl);
    ul.append(li);
  });

  innerDiv.append(ul);

  const nav = document.createElement('nav');
  const closeLink = document.createElement('a');
  closeLink.href = '#menu'; // From ORIGINAL HTML

  // Close Icon
  if (closeIconRow) {
    const closeIconPicture = closeIconRow.querySelector('picture');
    if (closeIconPicture) {
      const img = closeIconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt || 'Close Icon', false, [{ width: '24' }]); // Assuming a small icon size
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        closeLink.append(optimizedPic);
      }
    }
    moveInstrumentation(closeIconRow, closeLink); // Move instrumentation from the row to the link
  }


  // Close Label
  if (closeLabelRow) {
    const closeLabelSpan = document.createElement('span');
    closeLabelSpan.classList.add('label'); // Class from ORIGINAL HTML
    closeLabelSpan.textContent = closeLabelRow.textContent.trim();
    moveInstrumentation(closeLabelRow, closeLabelSpan);
    closeLink.append(closeLabelSpan);
  }

  nav.append(closeLink);

  block.textContent = '';
  block.append(innerDiv, nav);

  // Add event listener to toggle the menu overlay
  // The original HTML has a section with id="menu" and class="menu-overlay"
  // The closeLink href is "#menu", suggesting it targets this section.
  // The original HTML also has `tabindex="-1"` on the section, implying it can be focused.
  // The JS should toggle a class on the block itself to show/hide the overlay.
  closeLink.addEventListener('click', (e) => {
    e.preventDefault();
    block.classList.toggle('active'); // Assuming 'active' class shows/hides the overlay
    // Optionally, manage focus for accessibility if the overlay is truly a modal
    if (block.classList.contains('active')) {
      block.focus();
    }
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
