import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const linkElement = block.querySelector('a');
  const pictureElement = block.querySelector('picture');
  const imgElement = pictureElement ? pictureElement.querySelector('img') : null;

  const logoArenaSpan = document.createElement('span');
  logoArenaSpan.className = 'logo-arena';

  const logoLink = document.createElement('a');
  logoLink.className = 'logo-logo__picture';

  if (linkElement) {
    logoLink.href = linkElement.href;
    if (linkElement.dataset.logoName) {
      logoLink.dataset.logoName = linkElement.dataset.logoName;
    }
    moveInstrumentation(linkElement, logoLink);
  } else {
    // Fallback if no <a> is found, ensure href is set if possible
    const fallbackLink = block.querySelector('a[href]');
    if (fallbackLink) {
      logoLink.href = fallbackLink.href;
    }
  }

  if (imgElement) {
    const optimizedPicture = createOptimizedPicture(imgElement.src, imgElement.alt);
    logoLink.append(optimizedPicture);
    moveInstrumentation(imgElement, optimizedPicture);
    if (pictureElement) {
      moveInstrumentation(pictureElement, optimizedPicture);
    }
  }

  logoArenaSpan.append(logoLink);

  block.textContent = '';
  block.append(logoArenaSpan);
  block.className = 'logo-logo logo-block';
  block.dataset.blockStatus = 'loaded';
}
