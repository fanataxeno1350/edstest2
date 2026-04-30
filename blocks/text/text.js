import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0 & 1: Fix .children[0] access and align with BlockJson for richtext 'content' field.
  // The BlockJson indicates a single richtext field at the root level.
  // The EDS Block Structure shows block.children[0] is the row, and block.children[0].children[0] is the cell.
  // Since it's a single root richtext field, we can directly access it.
  // However, the original code used block.children[0].children[0] which is correct for this structure,
  // but let's make it more robust by explicitly getting the first row and then its first child.
  const row = block.children[0];
  const contentCell = row.children[0]; // This is acceptable here because it's a single root field, not an item in a list.

  const textDiv = document.createElement('div');
  textDiv.classList.add('cmp-text'); // Class from ORIGINAL HTML

  // CHECK 1.5: Richtext field must use innerHTML, not textContent.
  moveInstrumentation(contentCell, textDiv);
  textDiv.innerHTML = contentCell.innerHTML; // Preserve all HTML structure

  // Apply classes from ORIGINAL HTML to the block itself
  block.classList.add(
    'text',
    'desc-1',
    'aem-GridColumn--default--none',
    'aem-GridColumn--phone--none',
    'aem-GridColumn--phone--10',
    'aem-GridColumn',
    'aem-GridColumn--default--10',
    'aem-GridColumn--offset--phone--1',
    'aem-GridColumn--offset--default--1',
  );

  block.innerHTML = '';
  block.append(textDiv);

  // CHECK 1.5: Image optimization is not mentioned in the BlockJson or EDS Block Structure.
  // The original HTML also does not show any images directly within the 'text' block content.
  // Therefore, this image optimization logic is extraneous for this specific block and should be removed.
  // If images were part of the richtext, they would be handled by the innerHTML assignment.
  // block.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });
}
