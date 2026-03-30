import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.className = 'navigation-cmp-navigation';
  nav.setAttribute('itemscope', '');
  nav.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  nav.setAttribute('role', 'navigation');

  const ul = document.createElement('ul');
  ul.className = 'navigation-cmp-navigation__group';

  const navItems = block.querySelectorAll('[data-aue-model="navItem"]');
  navItems.forEach((itemNode) => {
    const li = document.createElement('li');
    li.className = 'navigation-cmp-navigation__item navigation-cmp-navigation__item--level-0';

    const linkElement = itemNode.querySelector('a');
    if (linkElement) {
      const link = document.createElement('a');
      link.className = 'navigation-cmp-navigation__item-link';
      link.href = linkElement.href;
      link.textContent = linkElement.textContent;
      li.append(link);
      moveInstrumentation(linkElement, link);
    }

    ul.append(li);
    moveInstrumentation(itemNode, li);
  });

  nav.append(ul);

  block.textContent = '';
  block.append(nav);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
