import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('text-content-wrapper');

  const content = block.querySelector('[data-aue-prop="content"]') || block.querySelector('h2') || block.querySelector('p');

  if (content) {
    contentWrapper.append(content);
    moveInstrumentation(content, contentWrapper);
  }

  block.textContent = '';
  block.append(contentWrapper);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
