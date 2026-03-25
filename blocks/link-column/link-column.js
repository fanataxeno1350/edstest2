import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const linkGridColumn = document.createElement('div');
  linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

  const headingElement = block.querySelector('[data-aue-prop="heading"]') || block.querySelector('h3');
  if (headingElement) {
    const h3 = document.createElement('h3');
    h3.classList.add('accordian-item', 'link-column__heading');
    h3.textContent = headingElement.textContent;
    linkGridColumn.append(h3);
    moveInstrumentation(headingElement, h3);
  }

  const linksContainer = document.createElement('ul');
  linksContainer.classList.add('content', 'links-container', 'accordian-content', 'collpsable');

  const linkItems = block.querySelectorAll('[data-aue-model="linkItem"]');

  if (linkItems.length > 0) {
    linkItems.forEach((itemNode) => {
      const li = document.createElement('li');
      const linkElement = itemNode.querySelector('[data-aue-prop="link"]') || itemNode.querySelector('a');

      if (linkElement) {
        const a = document.createElement('a');
        a.href = linkElement.href;
        a.textContent = linkElement.textContent;

        if (linkElement.target) {
          a.target = linkElement.target;
        }
        if (linkElement.rel) {
          a.rel = linkElement.rel;
        }

        li.append(a);
        moveInstrumentation(linkElement, a);
      }
      linksContainer.append(li);
      moveInstrumentation(itemNode, li);
    });
  } else {
    // Fallback for existing authored links without data-aue-model
    const existingLinks = block.querySelectorAll('ul > li > a');
    existingLinks.forEach((linkElement) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = linkElement.href;
      a.textContent = linkElement.textContent;

      if (linkElement.target) {
        a.target = linkElement.target;
      }
      if (linkElement.rel) {
        a.rel = linkElement.rel;
      }

      li.append(a);
      linksContainer.append(li);
      moveInstrumentation(linkElement.parentElement, li);
    });
  }

  linkGridColumn.append(linksContainer);

  block.textContent = '';
  block.append(linkGridColumn);
  block.className = 'link-column block';
  block.dataset.blockStatus = 'loaded';
}
