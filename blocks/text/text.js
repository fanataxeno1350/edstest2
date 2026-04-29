import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [contentRow] = [...block.children];

  // CHECK 0 & 1.5 FIX: Replaced direct index access with content detection for richtext
  // The BlockJson indicates 'content' is a richtext field.
  // Richtext cells can contain various HTML, so we find the cell that contains actual content.
  const contentCell = [...contentRow.children].find(cell => cell.innerHTML.trim() !== '');

  const textDiv = document.createElement('div');
  textDiv.classList.add('text', 'desc-1'); // From ORIGINAL HTML

  const cmpTextDiv = document.createElement('div');
  cmpTextDiv.classList.add('cmp-text'); // From ORIGINAL HTML
  // CHECK 1.5 FIX: Ensure innerHTML is used for richtext content
  if (contentCell) {
    cmpTextDiv.innerHTML = contentCell.innerHTML;
    moveInstrumentation(contentRow, cmpTextDiv); // Instrumentation should be moved from the original cell's parent
  }

  textDiv.appendChild(cmpTextDiv);

  block.replaceWith(textDiv);

  textDiv.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}

