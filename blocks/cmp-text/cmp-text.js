import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The EDS block structure for a simple richtext field is:
  // <div class="cmp-text">
  //   <div>  <-- block.children[0]
  //     <div> <-- This div contains the actual rich text content (e.g., <p>, <h1>, etc.)
  //       <p>Text text content</p>
  //     </div>
  //   </div>
  // </div>

  // The original HTML shows the content directly within the block div,
  // and the EDS structure already provides the content in a way that can be easily
  // flattened if needed, or simply styled.
  // For a simple richtext component, the content is usually just moved up.

  // Get the first child of the block, which is the row for the 'text' field.
  const textRow = block.children[0];

  if (textRow) {
    // The actual rich text content is inside the second div.
    const innerDiv = textRow.children[0];

    if (innerDiv) {
      // Move all children from the innerDiv directly to the block.
      // This flattens the structure to match the original HTML's direct content.
      while (innerDiv.firstChild) {
        block.append(innerDiv.firstChild);
      }
    }
    // Remove the original row div and its parent div, as their content has been moved.
    textRow.remove();
  }

  // Add the class 'cmp-text' to the block itself, as per original HTML.
  // This is usually already present, but good to ensure.
  block.classList.add('cmp-text');

  // Image optimization is not applicable as there are no images in this component.
  // There are no interactive elements in the original HTML, so no event listeners are needed.
}
