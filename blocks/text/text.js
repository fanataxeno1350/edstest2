import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const textContent = block.querySelector('[data-aue-prop="content"]') || block.querySelector('p');

  const wrapper = document.createElement('div');
  wrapper.classList.add('text-wrapper');

  if (textContent) {
    moveInstrumentation(textContent, wrapper);
    wrapper.append(textContent);
  }

  block.textContent = '';
  block.append(wrapper);
  block.className = `text block`;
  block.dataset.blockStatus = 'loaded';
}