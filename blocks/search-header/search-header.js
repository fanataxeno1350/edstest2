import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const searchHeaderLinkContainerSection = document.createElement('div');
  searchHeaderLinkContainerSection.classList.add('search-header-link-container-section');

  const columns = block.querySelectorAll('[data-aue-model="linkColumn"]');

  columns.forEach((columnNode) => {
    const searchHeaderLinkGridColumn = document.createElement('div');
    searchHeaderLinkGridColumn.classList.add('search-header-link-grid-column', 'search-header-link-column-vertical');

    const searchHeaderContent = document.createElement('ul');
    searchHeaderContent.classList.add('search-header-content', 'search-header-links-container', 'search-header-accordian-content');

    const links = columnNode.querySelectorAll('[data-aue-model="linkItem"]');
    links.forEach((linkNode) => {
      const li = document.createElement('li');
      const a = linkNode.querySelector('a');
      if (a) {
        const newA = document.createElement('a');
        newA.href = a.href;
        if (a.target) {
          newA.target = a.target;
        }
        if (a.rel) {
          newA.rel = a.rel;
        }
        newA.textContent = a.textContent;
        li.append(newA);
        moveInstrumentation(a, newA);
      }
      searchHeaderContent.append(li);
      moveInstrumentation(linkNode, li);
    });

    searchHeaderLinkGridColumn.append(searchHeaderContent);
    moveInstrumentation(columnNode, searchHeaderLinkGridColumn);
    searchHeaderLinkContainerSection.append(searchHeaderLinkGridColumn);
  });

  block.textContent = '';
  block.append(searchHeaderLinkContainerSection);
  block.classList.add('search-header-block');
  block.dataset.blockStatus = 'loaded';
}