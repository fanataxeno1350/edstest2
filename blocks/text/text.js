import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const content = block.querySelector('[data-aue-prop="content"]') || block.querySelector('p');

  if (content) {
    const textWrapper = document.createElement('div');
    textWrapper.classList.add('text-wrapper');
    moveInstrumentation(content, textWrapper);
    textWrapper.append(...content.children);

    block.textContent = '';
    block.append(textWrapper);
  }

  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}