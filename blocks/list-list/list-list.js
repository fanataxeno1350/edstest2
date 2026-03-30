import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  const listItems = block.querySelectorAll('li[data-aue-model="listItem"]');

  listItems.forEach((itemNode) => {
    const li = document.createElement('li');
    const linkElement = itemNode.querySelector('a[data-aue-prop="link"]');

    if (linkElement) {
      const newLink = document.createElement('a');
      newLink.href = linkElement.href;

      // Copy target and data-cmp-clickable attributes if they exist
      if (linkElement.target) {
        newLink.target = linkElement.target;
      }
      if (linkElement.dataset.cmpClickable) {
        newLink.dataset.cmpClickable = linkElement.dataset.cmpClickable;
      }

      // Extract link text, falling back to the authored link's textContent
      const linkText = itemNode.querySelector('[data-aue-prop="text"]') || linkElement;
      newLink.textContent = linkText.textContent;

      // Check for screen reader span and move it if present
      const screenReaderSpan = linkElement.querySelector('.list-cmp-link__screen-reader-only');
      if (screenReaderSpan) {
        newLink.append(screenReaderSpan);
        moveInstrumentation(screenReaderSpan, newLink);
      }

      li.append(newLink);
      moveInstrumentation(linkElement, newLink);
    } else {
      // Fallback if no data-aue-prop="link" is found, but a link exists
      const fallbackLink = itemNode.querySelector('a');
      if (fallbackLink) {
        li.append(fallbackLink);
        moveInstrumentation(fallbackLink, li);
      }
    }

    ul.append(li);
    moveInstrumentation(itemNode, li);
  });

  block.textContent = '';
  block.append(ul);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
