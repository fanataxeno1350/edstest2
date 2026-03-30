import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const textContent = block.querySelector('[data-aue-prop="content"]') || block.querySelector('h1') || block.querySelector('p');

  const textWrapper = document.createElement('div');
  textWrapper.classList.add('text-wrapper');

  if (textContent) {
    moveInstrumentation(textContent, textWrapper);
    textWrapper.append(textContent);
  }

  block.textContent = '';
  block.append(textWrapper);
  block.className = 'text block';
  block.dataset.blockStatus = 'loaded';
}