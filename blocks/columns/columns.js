import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The first child of the block is the 'items' container, which is just a wrapper.
  // The actual content rows start from the second child.
  const [itemsContainer, ...itemRows] = [...block.children];
  moveInstrumentation(itemsContainer, block); // Move instrumentation from the first row to the block itself

  // Clear the block's existing content to rebuild it
  block.textContent = '';

  // Create a container for all the content from the item rows
  const contentWrapper = document.createElement('div');

  // Process each item row
  itemRows.forEach((row) => {
    // According to the BlockJson, each 'columns-item' has a single 'richtext' field.
    // This means each item row will have one cell containing rich text.
    const richTextCell = row.querySelector('div'); // Get the first (and only) cell in the row
    if (richTextCell) {
      // Append all children from the rich text cell directly to the contentWrapper
      while (richTextCell.firstChild) {
        contentWrapper.append(richTextCell.firstChild);
      }
    }
    moveInstrumentation(row, contentWrapper); // Move instrumentation from the row to the contentWrapper
  });

  // Append the contentWrapper to the block
  block.append(contentWrapper);

  // Add the specific classes from the original HTML to the block itself
  // The original HTML already has 'columns', 'block', 'columns-1-cols' on the main block div.
  // We only need to ensure these are present if they were not already.
  // The block itself already has 'columns' from the block name.
  block.classList.add('block', 'columns-1-cols');

  // Image optimization (if any images were present, though not in this specific example)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
