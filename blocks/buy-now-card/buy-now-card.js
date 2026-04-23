import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The buy-now-card block has no authored content in its model,
  // so the block element will be empty.
  // The original HTML shows only a container div with specific classes.
  // We need to replicate that container with the correct classes.

  // Create a new div element to serve as the container.
  const container = document.createElement('div');

  // Apply the classes from the ORIGINAL HTML to the new container.
  // Rule 2: Apply ALL classes from the ORIGINAL HTML.
  // Rule 12: ALWAYS use the EXACT class names from ORIGINAL HTML.
  container.classList.add('buyNowCard', 'aem-GridColumn', 'aem-GridColumn--default--12');

  // Since the block is empty and we are just creating a container,
  // we can replace the original block element with our new container.
  // Rule 3: Always call moveInstrumentation when replacing an authored row or cell.
  moveInstrumentation(block, container);
  block.replaceWith(container);

  // If there were any child elements in the original block (which there aren't for this block),
  // we would move them to the new container.
  // while (block.firstChild) {
  //   container.append(block.firstChild);
  // }
}
