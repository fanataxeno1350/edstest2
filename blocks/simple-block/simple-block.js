import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The simple-block has no fields in its model, so it renders as an empty div.
  // The original HTML shows a div with specific classes and inline style.
  // We will create a new div and apply those classes and style.

  const wrapper = document.createElement('div');
  wrapper.classList.add('w-100', 'pt-3', 'pt-sm-3');
  wrapper.style.background = ''; // Copy the inline style from original HTML

  // Move instrumentation from the original block div to the new wrapper.
  // Since the block has no content, we just move the instrumentation and replace.
  moveInstrumentation(block, wrapper);

  // Replace the original block div with the new wrapper div.
  block.replaceWith(wrapper);

  // Since there are no images in the block content based on the EDS Block Structure,
  // there's no need to call createOptimizedPicture.
}

