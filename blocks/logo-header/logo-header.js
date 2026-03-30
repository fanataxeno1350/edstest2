import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const logoLink1 = block.querySelector('.image-checkLogoLink');
  const logoLink2 = block.querySelector('.image-cmp-image__link');

  const logoImage1 = logoLink1 ? logoLink1.querySelector('img') : null;
  const logoImage2 = logoLink2 ? logoLink2.querySelector('img') : null;

  const picture1 = logoImage1 ? createOptimizedPicture(logoImage1.src, logoImage1.alt) : null;
  const picture2 = logoImage2 ? createOptimizedPicture(logoImage2.src, logoImage2.alt) : null;

  const logoHeaderDiv = document.createElement('div');
  logoHeaderDiv.classList.add('logo-header');

  if (logoLink1 && picture1) {
    const link1Wrapper = document.createElement('a');
    link1Wrapper.href = logoLink1.href || '#';
    if (logoLink1.target) {
      link1Wrapper.target = logoLink1.target;
    }
    link1Wrapper.classList.add('logo-link-1');
    link1Wrapper.append(picture1);
    logoHeaderDiv.append(link1Wrapper);
    moveInstrumentation(logoLink1, link1Wrapper);
    moveInstrumentation(logoImage1, picture1);
  }

  if (logoLink2 && picture2) {
    const link2Wrapper = document.createElement('a');
    link2Wrapper.href = logoLink2.href || '#';
    if (logoLink2.target) {
      link2Wrapper.target = logoLink2.target;
    }
    link2Wrapper.classList.add('logo-link-2');
    link2Wrapper.append(picture2);
    logoHeaderDiv.append(link2Wrapper);
    moveInstrumentation(logoLink2, link2Wrapper);
    moveInstrumentation(logoImage2, picture2);
  }

  block.textContent = '';
  block.append(logoHeaderDiv);
  block.className = 'logo-header block';
  block.dataset.blockStatus = 'loaded';
}
