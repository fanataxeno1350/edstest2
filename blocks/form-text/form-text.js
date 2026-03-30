import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const label = document.createElement('label');
  const input = document.createElement('input');

  // Extract authored content
  const authoredLabel = block.querySelector('label');
  const authoredInput = block.querySelector('input');

  // Set attributes for the input field
  input.type = authoredInput?.type || 'text';
  input.placeholder = authoredInput?.placeholder || '';
  input.name = authoredInput?.name || '';
  input.className = 'cmp-form-text-cmp-form-text__text';

  // Set attributes for the label
  label.htmlFor = authoredInput?.id || ''; // Assuming label's for attribute matches input's id

  // Move instrumentation for authored elements
  if (authoredLabel) {
    moveInstrumentation(authoredLabel, label);
  }
  if (authoredInput) {
    moveInstrumentation(authoredInput, input);
  }

  // Append elements to the block
  block.textContent = '';
  block.append(label, input);

  // Set block classes and status
  block.className = 'form-text block';
  block.dataset.blockStatus = 'loaded';
}
