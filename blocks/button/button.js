import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const linkElement = block.querySelector('a');
  const textSpan = block.querySelector('.button-cmp-button__text');

  if (linkElement) {
    const newLink = document.createElement('a');
    newLink.href = linkElement.href;
    newLink.className = 'button-cmp-button';

    if (linkElement.id) {
      newLink.id = linkElement.id;
    }
    if (linkElement.dataset.request) {
      newLink.dataset.request = linkElement.dataset.request;
    }
    if (linkElement.tabIndex !== -1) {
      newLink.tabIndex = linkElement.tabIndex;
    }

    const newTextSpan = document.createElement('span');
    newTextSpan.className = 'button-cmp-button__text';

    if (textSpan) {
      newTextSpan.textContent = textSpan.textContent;
      moveInstrumentation(textSpan, newTextSpan);
    } else if (linkElement.textContent) {
      newTextSpan.textContent = linkElement.textContent.trim();
    }

    newLink.append(newTextSpan);

    const newDiv = document.createElement('div');
    newDiv.className = 'button-null button-cmp-button--primary-anchor';
    newDiv.append(newLink);

    moveInstrumentation(linkElement, newLink);
    moveInstrumentation(block.firstElementChild, newDiv);

    block.textContent = '';
    block.append(newDiv);
  }

  block.className = 'button block';
  block.dataset.blockStatus = 'loaded';
}
