import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const imageElement = block.querySelector('[data-aue-prop="image"]');
  const altTextElement = block.querySelector('[data-aue-prop="alt"]');

  const picture = document.createElement('picture');
  picture.classList.add('image-picture');

  if (imageElement) {
    const img = imageElement.querySelector('img');
    if (img) {
      const optimizedPicture = createOptimizedPicture(img.src, img.alt);
      const optimizedImg = optimizedPicture.querySelector('img');

      if (altTextElement) {
        optimizedImg.alt = altTextElement.textContent.trim();
        moveInstrumentation(altTextElement, picture);
      } else if (img.alt) {
        optimizedImg.alt = img.alt;
      }

      picture.append(...optimizedPicture.children);
      moveInstrumentation(imageElement, picture);
    } else if (imageElement.tagName === 'A' && imageElement.href.match(/\.(jpeg|jpg|webp|png|gif)$/i)) {
      // Fallback for direct image link
      const optimizedPicture = createOptimizedPicture(imageElement.href, '');
      const optimizedImg = optimizedPicture.querySelector('img');

      if (altTextElement) {
        optimizedImg.alt = altTextElement.textContent.trim();
        moveInstrumentation(altTextElement, picture);
      }

      picture.append(...optimizedPicture.children);
      moveInstrumentation(imageElement, picture);
    }
  }

  block.textContent = '';
  block.append(picture);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}