import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.className = 'navigation-cmp-navigation navigation-cmp-navigation';
  nav.setAttribute('itemscope', '');
  nav.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  nav.setAttribute('role', 'navigation');

  const ul = document.createElement('ul');
  ul.className = 'navigation-cmp-navigation__group navigation-cmp-navigation__group';

  const navItems = block.querySelectorAll('[data-aue-model="navItem"]');
  navItems.forEach((itemNode) => {
    const li = document.createElement('li');
    li.className = 'navigation-cmp-navigation__item navigation-cmp-navigation__item navigation-cmp-navigation__item--level-0 navigation-cmp-navigation__item--level-0';

    const link = itemNode.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.className = 'navigation-cmp-navigation__item-link navigation-cmp-navigation__item-link';
      newLink.href = link.href;
      newLink.textContent = link.textContent;
      li.append(newLink);
      moveInstrumentation(link, newLink);
    }
    ul.append(li);
    moveInstrumentation(itemNode, li);
  });

  nav.append(ul);

  block.textContent = '';
  block.append(nav);
  block.className = 'navigation-nav-item navigation-navigation block';
  block.dataset.blockStatus = 'loaded';
}
