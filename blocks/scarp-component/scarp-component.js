import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const scarpComponentDiv = document.createElement('div');
  scarpComponentDiv.classList.add('scarp-component', 'scarp-fade-in');
  if (block.hasAttribute('data-fade-in')) {
    scarpComponentDiv.setAttribute('data-fade-in', '');
  }

  const scarpContainerDiv = document.createElement('div');
  scarpContainerDiv.classList.add('scarp-scarp_container');

  const imageElement = block.querySelector('[data-aue-prop="image"]');
  if (imageElement) {
    const picture = createOptimizedPicture(imageElement.src, imageElement.alt);
    const img = picture.querySelector('img');
    if (img) {
      img.classList.add('scarp-separator__scarp', 'scarp-green-scarp');
      img.setAttribute('aria-hidden', 'true');
    }
    scarpContainerDiv.append(picture);
    moveInstrumentation(imageElement, picture);
  }

  scarpComponentDiv.append(scarpContainerDiv);
  moveInstrumentation(block.firstElementChild, scarpComponentDiv);

  block.textContent = '';
  block.append(scarpComponentDiv);
  block.className = 'scarp-component block';
  block.dataset.blockStatus = 'loaded';
}
