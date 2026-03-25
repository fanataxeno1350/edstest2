import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const linkContainerSection = document.createElement('div');
  linkContainerSection.classList.add('link-container-section');

  const linkGridColumns = block.querySelectorAll('.link-grid-column.link-column-vertical');

  linkGridColumns.forEach((columnNode) => {
    const linkGridColumnDiv = document.createElement('div');
    linkGridColumnDiv.classList.add('link-grid-column', 'link-column-vertical');

    const linksContainer = document.createElement('ul');
    linksContainer.classList.add('content', 'links-container', 'accordian-content');

    const linkItems = columnNode.querySelectorAll('li');
    linkItems.forEach((itemNode) => {
      const li = document.createElement('li');
      const a = itemNode.querySelector('a');
      if (a) {
        li.append(a);
        moveInstrumentation(a, li);
      }
      linksContainer.append(li);
      moveInstrumentation(itemNode, li);
    });

    linkGridColumnDiv.append(linksContainer);
    moveInstrumentation(columnNode, linkGridColumnDiv);
    linkContainerSection.append(linkGridColumnDiv);
  });

  block.textContent = '';
  block.append(linkContainerSection);
  block.className = 'search-header block';
  block.dataset.blockStatus = 'loaded';
}