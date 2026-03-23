import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const content = block.querySelector('[data-aue-prop="content"]') || block.querySelector('h1, p');

  if (content) {
    const textWrapper = document.createElement('div');
    textWrapper.classList.add('text-wrapper');
    moveInstrumentation(content, textWrapper);
    textWrapper.append(content);
    block.textContent = '';
    block.append(textWrapper);
  }

  block.className = 'text block';
  block.dataset.blockStatus = 'loaded';
}