import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const linkElement = block.querySelector('[data-aue-prop="link"]');
  const imageElement = block.querySelector('[data-aue-prop="image"]');
  const altTextElement = block.querySelector('[data-aue-prop="alt"]');

  const picture = imageElement ? createOptimizedPicture(imageElement.src, altTextElement?.textContent || imageElement.alt) : null;

  const link = document.createElement('a');
  link.classList.add('logo-cmp-image__link');
  if (linkElement) {
    link.href = linkElement.href;
    moveInstrumentation(linkElement, link);
  } else {
    link.href = '/';
  }

  if (picture) {
    link.append(picture);
    moveInstrumentation(imageElement, picture);
  }

  block.textContent = '';
  block.append(link);

  block.className = 'logo block';
  block.dataset.blockStatus = 'loaded';
}
