import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const navElement = document.createElement('nav');
  navElement.id = 'navigation-3f62f7748f';
  navElement.className = 'navigation-cmp-navigation';
  navElement.setAttribute('itemscope', '');
  navElement.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  navElement.setAttribute('role', 'navigation');

  const ulGroup = document.createElement('ul');
  ulGroup.className = 'navigation-cmp-navigation__group navigation-cmp-header__nav-group';

  const navigationItems = block.querySelectorAll('[data-aue-model="navigationItem"]');
  navigationItems.forEach((itemNode) => {
    const li = document.createElement('li');
    li.className = itemNode.className;

    const linkElement = itemNode.querySelector('.navigation-cmp-navigation__item-link');
    if (linkElement) {
      li.append(linkElement);
      moveInstrumentation(linkElement, li);
    }

    const childItemsContainer = itemNode.querySelector('.navigation-cmp-navigation__group');
    if (childItemsContainer) {
      const childUl = document.createElement('ul');
      childUl.className = childItemsContainer.className;

      const categoryMenuDiv = childItemsContainer.querySelector('.navigation-cmp-header__category-menu');
      if (categoryMenuDiv) {
        const newCategoryMenuDiv = document.createElement('div');
        newCategoryMenuDiv.className = categoryMenuDiv.className;

        const level2Items = categoryMenuDiv.querySelectorAll('[data-aue-model="navigationItem"]');
        level2Items.forEach((level2ItemNode) => {
          const level2Li = document.createElement('li');
          level2Li.className = level2ItemNode.className;
          const level2Link = level2ItemNode.querySelector('.navigation-cmp-navigation__item-link');
          if (level2Link) {
            level2Li.append(level2Link);
            moveInstrumentation(level2Link, level2Li);
          }
          newCategoryMenuDiv.append(level2Li);
          moveInstrumentation(level2ItemNode, level2Li);
        });
        childUl.append(newCategoryMenuDiv);
        moveInstrumentation(categoryMenuDiv, newCategoryMenuDiv);
      }

      const imageTextDiv = childItemsContainer.querySelector('.navigation-cmp-header__image-text');
      if (imageTextDiv) {
        childUl.append(imageTextDiv);
        moveInstrumentation(imageTextDiv, childUl);
      }

      li.append(childUl);
      moveInstrumentation(childItemsContainer, childUl);
    }

    ulGroup.append(li);
    moveInstrumentation(itemNode, li);
  });

  navElement.append(ulGroup);

  const mobileListDiv = document.createElement('div');
  mobileListDiv.className = 'navigation-cmp-header__mobile-list';

  const policyUl = document.createElement('ul');
  policyUl.className = 'navigation-cmp-header__policy';
  const policyLinks = block.querySelectorAll('[data-aue-model="policyLink"]');
  policyLinks.forEach((policyLinkNode) => {
    const li = document.createElement('li');
    li.className = 'navigation-cmp-header__policy-list';
    const link = policyLinkNode.querySelector('a');
    if (link) {
      li.append(link);
      moveInstrumentation(link, li);
    }
    policyUl.append(li);
    moveInstrumentation(policyLinkNode, li);
  });
  mobileListDiv.append(policyUl);

  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.className = 'navigation-cmp-header__social-media';
  const socialLinks = block.querySelectorAll('[data-aue-model="socialLink"]');
  socialLinks.forEach((socialLinkNode) => {
    const link = socialLinkNode.querySelector('a');
    if (link) {
      socialMediaDiv.append(link);
      moveInstrumentation(link, socialMediaDiv);
    }
    moveInstrumentation(socialLinkNode, socialMediaDiv);
  });
  mobileListDiv.append(socialMediaDiv);

  navElement.append(mobileListDiv);

  block.textContent = '';
  block.append(navElement);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
