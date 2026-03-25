import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rootDiv = document.createElement('div');
  rootDiv.classList.add('link-column-link-grid-column', 'link-column-horizontal');

  const headingElement = block.querySelector('h3');
  if (headingElement) {
    const h3 = document.createElement('h3');
    h3.classList.add('link-column-accordian-item', 'link-column-link-column__heading');
    h3.id = headingElement.id || '';
    h3.textContent = headingElement.textContent;
    moveInstrumentation(headingElement, h3);
    rootDiv.append(h3);
  }

  const linksContainer = document.createElement('ul');
  linksContainer.classList.add('link-column-content', 'link-column-links-container', 'link-column-accordian-content', 'link-column-collpsable');

  const authoredLinks = block.querySelectorAll('li > a');
  if (authoredLinks.length > 0) {
    authoredLinks.forEach((linkElement) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = linkElement.href;
      a.textContent = linkElement.textContent;
      if (linkElement.target) {
        a.target = linkElement.target;
      }
      moveInstrumentation(linkElement, a);
      li.append(a);
      linksContainer.append(li);
    });
  }

  rootDiv.append(linksContainer);

  block.textContent = '';
  block.append(rootDiv);
  block.className = 'link-column-link-grid-column block';
  block.dataset.blockStatus = 'loaded';
}