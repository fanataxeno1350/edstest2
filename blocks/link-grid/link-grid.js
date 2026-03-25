import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const linkContainerSection = document.createElement('div');
  linkContainerSection.classList.add('link-container-section');
  moveInstrumentation(block.firstElementChild, linkContainerSection);

  const columns = block.querySelectorAll('[data-aue-model="linkGridColumn"]');
  columns.forEach((column) => {
    const linkGridColumn = document.createElement('div');
    linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

    const ul = document.createElement('ul');
    ul.classList.add('content', 'links-container', 'accordian-content');

    const links = column.querySelectorAll('[data-aue-model="linkItem"]');
    links.forEach((linkItem) => {
      const li = document.createElement('li');
      const a = linkItem.querySelector('a');
      if (a) {
        li.append(a);
        moveInstrumentation(a, li);
      }
      ul.append(li);
      moveInstrumentation(linkItem, li);
    });

    linkGridColumn.append(ul);
    moveInstrumentation(column, linkGridColumn);
    linkContainerSection.append(linkGridColumn);
  });

  block.textContent = '';
  block.append(linkContainerSection);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
