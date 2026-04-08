import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('section');
  wrapper.classList.add('highlights-wrapper', 'style1');

  [...block.children].forEach((row) => {
    const section = document.createElement('section');
    moveInstrumentation(row, section);

    const picDiv = document.createElement('div');
    picDiv.classList.add('pic');

    const highlightDiv = document.createElement('div');
    highlightDiv.classList.add('highlight'); // This class is always present in the original HTML

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');

    // Based on BlockJson, each row has exactly two cells: Title and Description
    const cells = [...row.children];
    const titleCell = cells[0]; // Title is the first cell
    const descriptionCell = cells[1]; // Description is the second cell

    if (titleCell) {
      const h2 = document.createElement('h2');
      moveInstrumentation(titleCell, h2);
      while (titleCell.firstChild) {
        h2.append(titleCell.firstChild);
      }
      contentDiv.append(h2);
    }

    if (descriptionCell) {
      moveInstrumentation(descriptionCell, contentDiv);
      while (descriptionCell.firstChild) {
        contentDiv.append(descriptionCell.firstChild);
      }
    }

    // The original HTML shows specific highlight types (simple, responsive, free) with
    // nested structures. This logic is NOT driven by the BlockJson fields provided
    // to `decorate` (which only has title and description).
    // This implies that the specific highlight type (e.g., 'simple', 'responsive', 'free')
    // and its nested elements (templates, phone, site) are either:
    // 1. Handled by CSS based on a parent class (e.g., a class added to 'section' or 'highlightDiv'
    //    that is not part of the current BlockJson model).
    // 2. Driven by an additional, unlisted field in the BlockJson.
    // 3. Part of a different block or component.
    //
    // Given the current BlockJson and EDS structure, the `decorate` function only receives
    // 'Title' and 'Description'. The logic to create 'simple', 'responsive', 'free'
    // highlight structures cannot be derived from these two fields alone.
    //
    // For now, we will add the base 'highlight' class as per the original HTML,
    // but the specific 'simple', 'responsive', 'free' classes and their nested
    // elements cannot be generated from the provided BlockJson.
    // If these are dynamic, the BlockJson needs an additional field (e.g., 'type')
    // to drive this logic.
    //
    // For this review, we are removing the speculative logic that tries to guess
    // the highlight type from the title text, as it's not robust and not driven
    // by the provided model. The `highlightDiv` is created, and if specific
    // sub-classes are needed, they must come from the model.

    // The original HTML shows that 'picDiv' contains 'highlightDiv'.
    // The original HTML also shows that 'highlightDiv' contains the specific
    // structures like 'templates', 'phone', 'site'.
    // Since the BlockJson doesn't provide a field for 'type' or 'image',
    // and the original HTML shows these structures *within* the highlightDiv,
    // we'll assume these are handled by CSS or a different mechanism not
    // exposed in the current BlockJson for this block.
    // We will only create the basic structure that is consistent with the
    // BlockJson and the most generic parts of the original HTML.

    picDiv.append(highlightDiv); // highlightDiv is always inside picDiv
    section.append(picDiv, contentDiv);
    wrapper.append(section);
  });

  // The original HTML does not show any <picture> elements within the input structure
  // that would need optimization by createOptimizedPicture.
  // The 'image' div inside 'responsive' highlight is empty in the original HTML,
  // suggesting it's a placeholder or styled via CSS.
  // Therefore, the createOptimizedPicture loop is removed as it's not applicable
  // to the provided block structure.

  block.textContent = '';
  block.append(wrapper);
}
