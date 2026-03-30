import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('text-content');

  const authoredContent = block.querySelector('[data-aue-prop="content"]');

  if (authoredContent) {
    // Move all children of the authored content div into the new contentDiv
    Array.from(authoredContent.children).forEach((child) => {
      contentDiv.append(child);
      moveInstrumentation(child, contentDiv);
    });
    // Remove the original authored content div, as its children have been moved
    moveInstrumentation(authoredContent, contentDiv);
    authoredContent.remove();
  } else {
    // Fallback: if no data-aue-prop="content" is found, move all children of the block
    Array.from(block.children).forEach((child) => {
      contentDiv.append(child);
      moveInstrumentation(child, contentDiv);
    });
  }

  block.textContent = '';
  block.append(contentDiv);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
