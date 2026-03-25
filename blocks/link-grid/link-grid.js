import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const linkGridWrapper = document.createElement('div');
  linkGridWrapper.classList.add('link-grid-wrapper');

  const columns = block.querySelectorAll('[data-aue-model="linkGridColumn"]');
  columns.forEach((columnNode) => {
    const columnDiv = document.createElement('div');
    columnDiv.classList.add('link-grid-column', 'link-grid-link-column-vertical');

    const ul = document.createElement('ul');
    ul.classList.add('link-grid-content', 'link-grid-links-container', 'link-grid-accordian-content');

    const links = columnNode.querySelectorAll('[data-aue-model="link"]');
    links.forEach((linkNode) => {
      const li = document.createElement('li');
      const a = linkNode.querySelector('a');
      if (a) {
        li.append(a);
        moveInstrumentation(a, li);
      }
      ul.append(li);
      moveInstrumentation(linkNode, li);
    });

    columnDiv.append(ul);
    moveInstrumentation(columnNode, columnDiv);
    linkGridWrapper.append(columnDiv);
  });

  block.textContent = '';
  block.append(linkGridWrapper);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
