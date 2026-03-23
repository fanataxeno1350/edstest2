import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const scarpComponentDiv = document.createElement('div');
  scarpComponentDiv.className = 'scarp-component scarp-fade-in';
  scarpComponentDiv.setAttribute('data-fade-in', '');

  const scarpContainerDiv = document.createElement('div');
  scarpContainerDiv.className = 'scarp-scarp_container';

  const img = block.querySelector('[data-aue-prop="image"]');
  if (img) {
    const picture = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]);
    const generatedImg = picture.querySelector('img');
    if (generatedImg) {
      generatedImg.className = 'scarp-separator__scarp scarp-green-scarp';
      generatedImg.setAttribute('aria-hidden', 'true');
    }
    scarpContainerDiv.append(picture);
    moveInstrumentation(img, picture);
  }

  scarpComponentDiv.append(scarpContainerDiv);
  moveInstrumentation(block.firstElementChild, scarpComponentDiv);

  block.textContent = '';
  block.append(scarpComponentDiv);
  block.className = 'scarp block';
  block.dataset.blockStatus = 'loaded';
}
