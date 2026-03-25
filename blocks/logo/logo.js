import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const logoLink = block.querySelector('a');
  const logoImage = block.querySelector('picture img');

  const picture = createOptimizedPicture(logoImage.src, logoImage.alt);

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');

  const linkElement = document.createElement('a');
  linkElement.classList.add('logo__picture');
  if (logoLink) {
    linkElement.href = logoLink.href;
    moveInstrumentation(logoLink, linkElement);
  }

  linkElement.append(picture);
  moveInstrumentation(logoImage.closest('picture'), picture);

  logoWrapper.append(linkElement);

  block.textContent = '';
  block.append(logoWrapper);
  block.className = 'logo block';
  block.dataset.blockStatus = 'loaded';
}
