import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use destructuring to access the rows, ensuring content detection if more complex
  // For this simple block, direct destructuring is acceptable as the structure is fixed.
  const [linkRow, titleRow] = [...block.children];

  const linkElement = linkRow.querySelector('a');
  const titleText = titleRow.querySelector('div').textContent.trim();

  const buttonLink = document.createElement('a');
  if (linkElement) {
    buttonLink.href = linkElement.href;
    buttonLink.title = `Go to ${titleText}`; // Use titleText for the title attribute
  }
  // Ensure class names are copied verbatim from ORIGINAL HTML
  buttonLink.classList.add('button', 'intial', 'rounded');
  buttonLink.textContent = titleText; // Use titleText for the button text

  moveInstrumentation(linkRow, buttonLink);
  moveInstrumentation(titleRow, buttonLink);

  block.textContent = '';
  block.append(buttonLink);
}
