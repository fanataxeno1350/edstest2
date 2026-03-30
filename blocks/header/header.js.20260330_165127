import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const headerCmpHeader = document.createElement('div');
  headerCmpHeader.className = 'header-cmp-header';

  // Hamburger input
  const hamburgerInput = document.createElement('input');
  hamburgerInput.className = 'header-cmp-header__hamburger';
  hamburgerInput.type = 'checkbox';
  headerCmpHeader.append(hamburgerInput);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.className = 'header-logo header-image header-cmp-header__logo';
  const logoLink = block.querySelector('[data-aue-prop="logoLink"]');
  const logoImage = block.querySelector('[data-aue-prop="logoImage"]');

  if (logoLink && logoImage) {
    const picture = createOptimizedPicture(logoImage.src, logoImage.alt);
    const img = picture.querySelector('img');
    img.className = 'header-cmp-image__image header-rohan';
    img.removeAttribute('width');
    img.removeAttribute('height');

    const a = document.createElement('a');
    a.className = 'header-cmp-image__link';
    a.href = logoLink.href;
    a.append(picture);
    moveInstrumentation(logoLink, a);
    moveInstrumentation(logoImage, picture);
    logoDiv.append(a);
  } else if (logoImage) {
    const picture = createOptimizedPicture(logoImage.src, logoImage.alt);
    const img = picture.querySelector('img');
    img.className = 'header-cmp-image__image header-rohan';
    img.removeAttribute('width');
    img.removeAttribute('height');
    logoDiv.append(picture);
    moveInstrumentation(logoImage, picture);
  }
  headerCmpHeader.append(logoDiv);

  // Navigation Links
  const navLinksDiv = document.createElement('div');
  navLinksDiv.className = 'header-cmp-header__nav-links';
  const navigationDiv = document.createElement('div');
  navigationDiv.className = 'header-navigation';
  const navElement = document.createElement('nav');
  navElement.className = 'header-cmp-navigation';
  navElement.setAttribute('role', 'navigation');

  const navGroup = document.createElement('ul');
  navGroup.className = 'header-cmp-navigation__group header-cmp-header__nav-group';

  const navigationItems = block.querySelectorAll('[data-aue-model="navItem"]');
  navigationItems.forEach((navItemNode) => {
    const navItemLi = document.createElement('li');
    navItemLi.className = 'header-cmp-navigation__item header-cmp-navigation__item--level-0 header-cmp-header__nav-products';

    const navItemLink = navItemNode.querySelector('[data-aue-prop="link"]');
    const navItemLabel = navItemNode.querySelector('[data-aue-prop="label"]');
    if (navItemLink && navItemLabel) {
      const a = document.createElement('a');
      a.href = navItemLink.href;
      a.className = 'header-cmp-navigation__item-link';
      a.textContent = navItemLabel.textContent;
      navItemLi.append(a);
      moveInstrumentation(navItemLink, a);
      moveInstrumentation(navItemLabel, a);
    }

    const subNavigationItems = navItemNode.querySelectorAll('[data-aue-model="subNavItem"]');
    if (subNavigationItems.length > 0) {
      navItemLi.classList.add('header-cmp-header__nav-products-click');
      const subNavGroup = document.createElement('ul');
      subNavGroup.className = 'header-cmp-navigation__group header-cmp-header__product-items';
      const categoryMenuDiv = document.createElement('div');
      categoryMenuDiv.className = 'header-cmp-header__category-menu';

      subNavigationItems.forEach((subNavItemNode) => {
        const subNavItemLi = document.createElement('li');
        subNavItemLi.className = 'header-cmp-navigation__item header-cmp-navigation__item--level-1 header-cmp-header__no-item';

        const subNavItemLink = subNavItemNode.querySelector('[data-aue-prop="link"]');
        const subNavItemLabel = subNavItemNode.querySelector('[data-aue-prop="label"]');
        if (subNavItemLink && subNavItemLabel) {
          const a = document.createElement('a');
          a.href = subNavItemLink.href;
          a.className = 'header-cmp-navigation__item-link';
          a.textContent = subNavItemLabel.textContent;
          subNavItemLi.append(a);
          moveInstrumentation(subNavItemLink, a);
          moveInstrumentation(subNavItemLabel, a);
        }
        categoryMenuDiv.append(subNavItemLi);
        moveInstrumentation(subNavItemNode, subNavItemLi);
      });
      subNavGroup.append(categoryMenuDiv);
      navItemLi.append(subNavGroup);
    } else {
      navItemLi.classList.add('header-cmp-header__no-items');
    }
    navGroup.append(navItemLi);
    moveInstrumentation(navItemNode, navItemLi);
  });

  navElement.append(navGroup);

  // Mobile List (Policy Links and Social Media)
  const mobileListDiv = document.createElement('div');
  mobileListDiv.className = 'header-cmp-header__mobile-list';

  const policyUl = document.createElement('ul');
  policyUl.className = 'header-cmp-header__policy';

  const policyLinks = block.querySelectorAll('[data-aue-model="policyLink"]');
  policyLinks.forEach((policyLinkNode) => {
    const policyLi = document.createElement('li');
    policyLi.className = 'header-cmp-header__policy-list';
    const policyLink = policyLinkNode.querySelector('[data-aue-prop="link"]');
    const policyLabel = policyLinkNode.querySelector('[data-aue-prop="label"]');
    if (policyLink && policyLabel) {
      const a = document.createElement('a');
      a.href = policyLink.href;
      a.textContent = policyLabel.textContent;
      a.target = '_blank';
      policyLi.append(a);
      moveInstrumentation(policyLink, a);
      moveInstrumentation(policyLabel, a);
    }
    policyUl.append(policyLi);
    moveInstrumentation(policyLinkNode, policyLi);
  });
  mobileListDiv.append(policyUl);

  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.className = 'header-cmp-header__social-media';

  const socialLinks = block.querySelectorAll('[data-aue-model="socialLink"]');
  socialLinks.forEach((socialLinkNode) => {
    const socialLink = socialLinkNode.querySelector('[data-aue-prop="link"]');
    const socialPlatform = socialLinkNode.querySelector('[data-aue-prop="platform"]');
    if (socialLink && socialPlatform) {
      const a = document.createElement('a');
      a.href = socialLink.href;
      a.target = '_blank';
      a.className = `header-icon-${socialPlatform.textContent.toLowerCase()}`;
      a.setAttribute('data-social', socialPlatform.textContent.toLowerCase());
      socialMediaDiv.append(a);
      moveInstrumentation(socialLink, a);
      moveInstrumentation(socialPlatform, a);
    }
    moveInstrumentation(socialLinkNode, socialMediaDiv);
  });
  mobileListDiv.append(socialMediaDiv);
  navElement.append(mobileListDiv);

  navigationDiv.append(navElement);
  navLinksDiv.append(navigationDiv);
  headerCmpHeader.append(navLinksDiv);

  // Nav Icons
  const navIconsDiv = document.createElement('div');
  navIconsDiv.className = 'header-cmp-header__nav-icons';

  // Accessibility
  const accessibilityDiv = document.createElement('div');
  accessibilityDiv.className = 'header-cmp-header__accessbility header-cmp-header__hide-icon';
  const accessibilityLink = document.createElement('a');
  accessibilityLink.href = '#';
  accessibilityLink.className = 'header-cmp-header__icon-img';
  const accessibilityIcon = document.createElement('div');
  accessibilityIcon.className = 'header-icon-accessibility';
  accessibilityLink.append(accessibilityIcon);
  accessibilityDiv.append(accessibilityLink);
  navIconsDiv.append(accessibilityDiv);

  // Search
  const searchDiv = document.createElement('div');
  searchDiv.className = 'header-cmp-header__search';
  const searchLink = document.createElement('a');
  searchLink.href = '#';
  searchLink.className = 'header-cmp-header__icon-img';
  const searchIcon = document.createElement('div');
  searchIcon.className = 'header-icon-search';
  const searchText = document.createElement('div');
  searchText.className = 'header-cmp-header__icon-text';
  searchText.textContent = 'Search';
  searchLink.append(searchIcon, searchText);
  searchDiv.append(searchLink);
  navIconsDiv.append(searchDiv);

  // Login
  const loginDiv = document.createElement('div');
  loginDiv.className = 'header-cmp-header__login header-cmp-header__hide-icon';
  const loginLink = document.createElement('a');
  loginLink.href = '#';
  loginLink.className = 'header-cmp-header__icon-img';
  const loginIcon = document.createElement('div');
  loginIcon.className = 'header-icon-profile';
  loginLink.append(loginIcon);
  loginDiv.append(loginLink);
  navIconsDiv.append(loginDiv);

  headerCmpHeader.append(navIconsDiv);

  block.textContent = '';
  block.append(headerCmpHeader);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}