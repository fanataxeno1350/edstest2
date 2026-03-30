import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const logoImageProp = block.querySelector('[data-aue-prop="logoImage"]');
  const logoLinkProp = block.querySelector('[data-aue-prop="logoLink"]');
  const secondaryImageProp = block.querySelector('[data-aue-prop="secondaryImage"]');
  const secondaryImageLinkProp = block.querySelector('[data-aue-prop="secondaryImageLink"]');

  const logoImage = logoImageProp ? logoImageProp.querySelector('img') : null;
  const logoLink = logoLinkProp ? logoLinkProp.querySelector('a') : null;
  const secondaryImage = secondaryImageProp ? secondaryImageProp.querySelector('img') : null;
  const secondaryImageLink = secondaryImageLinkProp ? secondaryImageLinkProp.querySelector('a') : null;

  const mainDiv = document.createElement('div');

  if (logoImage || logoLink) {
    const logoWrapper = document.createElement('div');
    logoWrapper.classList.add('image-wrapper');

    let linkElement = logoLink;
    if (!linkElement && logoLinkProp) {
      // Fallback if the link is not directly an <a> but its content is a URL
      const linkText = logoLinkProp.textContent.trim();
      if (linkText.startsWith('http')) {
        linkElement = document.createElement('a');
        linkElement.href = linkText;
        linkElement.textContent = linkText; // Or some default text if needed
      }
    }

    if (linkElement) {
      const newLink = document.createElement('a');
      newLink.href = linkElement.href;
      if (linkElement.target) {
        newLink.target = linkElement.target;
      }
      if (logoImage) {
        const picture = createOptimizedPicture(logoImage.src, logoImage.alt || '');
        newLink.append(picture);
        moveInstrumentation(logoImage, picture);
      }
      logoWrapper.append(newLink);
      moveInstrumentation(linkElement, newLink);
    } else if (logoImage) {
      const picture = createOptimizedPicture(logoImage.src, logoImage.alt || '');
      logoWrapper.append(picture);
      moveInstrumentation(logoImage, picture);
    }
    mainDiv.append(logoWrapper);
    if (logoImageProp) moveInstrumentation(logoImageProp, logoWrapper);
    if (logoLinkProp) moveInstrumentation(logoLinkProp, logoWrapper);
  }

  if (secondaryImage || secondaryImageLink) {
    const secondaryWrapper = document.createElement('div');
    secondaryWrapper.classList.add('image-wrapper');

    let linkElement = secondaryImageLink;
    if (!linkElement && secondaryImageLinkProp) {
      const linkText = secondaryImageLinkProp.textContent.trim();
      if (linkText.startsWith('http')) {
        linkElement = document.createElement('a');
        linkElement.href = linkText;
        linkElement.textContent = linkText;
      }
    }

    if (linkElement) {
      const newLink = document.createElement('a');
      newLink.href = linkElement.href;
      if (linkElement.target) {
        newLink.target = linkElement.target;
      }
      if (secondaryImage) {
        const picture = createOptimizedPicture(secondaryImage.src, secondaryImage.alt || '');
        newLink.append(picture);
        moveInstrumentation(secondaryImage, picture);
      }
      secondaryWrapper.append(newLink);
      moveInstrumentation(linkElement, newLink);
    } else if (secondaryImage) {
      const picture = createOptimizedPicture(secondaryImage.src, secondaryImage.alt || '');
      secondaryWrapper.append(picture);
      moveInstrumentation(secondaryImage, picture);
    }
    mainDiv.append(secondaryWrapper);
    if (secondaryImageProp) moveInstrumentation(secondaryImageProp, secondaryWrapper);
    if (secondaryImageLinkProp) moveInstrumentation(secondaryImageLinkProp, secondaryWrapper);
  }

  block.textContent = '';
  block.append(mainDiv);
  block.className = `image-block block`;
  block.dataset.blockStatus = 'loaded';
}
