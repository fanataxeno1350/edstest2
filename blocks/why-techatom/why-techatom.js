import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...whyCardRows] = [...block.children];

  const whyTechatomContainer = document.createElement('div');
  whyTechatomContainer.classList.add('why-techatom-container', 'shadow-lg');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'justify-content-around', 'gy-5');

  // Heading
  const headingCell = headingRow.firstElementChild;
  if (headingCell) {
    const h2 = document.createElement('h2');
    moveInstrumentation(headingCell, h2);
    // Assuming the heading text contains "Why Choose Techatom?" and "Techatom?" needs curve-underline
    const textContent = headingCell.textContent.trim();
    const parts = textContent.split('Techatom?');
    if (parts.length > 1) {
      h2.append(document.createTextNode(parts[0]));
      const span = document.createElement('span');
      span.classList.add('curve-underline');
      span.textContent = 'Techatom?';
      h2.append(span);
      h2.append(document.createTextNode(parts.slice(1).join('Techatom?')));
    } else {
      h2.textContent = textContent;
    }
    rowDiv.append(h2);
  }

  // Why Cards
  whyCardRows.forEach((row) => {
    const whyCardLink = document.createElement('a');
    moveInstrumentation(row, whyCardLink);
    whyCardLink.classList.add('d-block', 'why-card', 'col-lg-4', 'col-12');
    whyCardLink.href = '#'; // Original HTML has href="#"

    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) {
        const img = cell.querySelector('picture img');
        if (img) {
          const newImg = document.createElement('img');
          newImg.src = img.src;
          newImg.alt = img.alt;
          // Determine specific class based on alt text or other detection if needed
          // For now, using a general approach, but ideally this would be more robust
          if (img.alt === 'expert' || img.alt === 'customer') {
            newImg.classList.add('expert-svg');
          } else if (img.alt === 'badge') {
            newImg.classList.add('badge-svg');
          }
          whyCardLink.append(newImg);
        }
      } else if (cell.querySelector('p')) {
        // Description
        const p = document.createElement('p');
        moveInstrumentation(cell, p);
        while (cell.firstChild) p.append(cell.firstChild);
        whyCardLink.append(p);
      } else {
        // Title (text content)
        const h3 = document.createElement('h3');
        moveInstrumentation(cell, h3);
        while (cell.firstChild) h3.append(cell.firstChild);
        whyCardLink.append(h3);
      }
    });
    rowDiv.append(whyCardLink);
  });

  whyTechatomContainer.append(rowDiv);
  block.textContent = '';
  block.append(whyTechatomContainer);

  // Image optimization for any images that might have been created
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
