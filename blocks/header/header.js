import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure the first 4 rows which are the root model fields.
  // The rest are item rows for the containers.
  const [logoRow, navItemsContainer, policyLinksContainer, socialLinksContainer, ...itemRows] = [...block.children];

  const headerDiv = document.createElement('div');
  headerDiv.classList.add('cmp-header');

  const hamburgerInput = document.createElement('input');
  hamburgerInput.classList.add('cmp-header__hamburger');
  hamburgerInput.type = 'checkbox';
  headerDiv.append(hamburgerInput);

  // Add event listener for hamburger menu to toggle mobile list visibility
  hamburgerInput.addEventListener('change', () => {
    const mobileList = headerDiv.querySelector('.cmp-header__mobile-list');
    if (mobileList) {
      if (hamburgerInput.checked) {
        mobileList.classList.add('is-open'); // Assuming 'is-open' class controls visibility
      } else {
        mobileList.classList.remove('is-open');
      }
    }
  });

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image', 'cmp-header__logo');
  moveInstrumentation(logoRow, logoDiv);
  const logoLink = logoRow.querySelector('a');
  if (logoLink) {
    const newLogoLink = document.createElement('a');
    newLogoLink.classList.add('cmp-image__link');
    newLogoLink.href = logoLink.href;
    const picture = logoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      newLogoLink.append(optimizedPic);
    }
    logoDiv.append(newLogoLink);
  }
  headerDiv.append(logoDiv);

  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');
  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation');
  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  nav.setAttribute('role', 'navigation');

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group');

  // Filter itemRows based on the BlockJson structure for each sub-component
  // nav-item: 2 cells (link, label)
  // policy-link: 2 cells (link, label)
  // social-link: 1 cell (link)
  const navItems = itemRows.filter((row) => row.children.length === 2 && row.children[0].querySelector('a') && row.children[1].textContent);
  const policyLinks = itemRows.filter((row) => row.children.length === 2 && row.children[0].querySelector('a') && row.children[1].textContent);
  const socialLinks = itemRows.filter((row) => row.children.length === 1 && row.children[0].querySelector('a'));

  navItems.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products', 'cmp-header__no-items');
    const linkCell = row.children[0];
    const labelCell = row.children[1];
    const link = linkCell.querySelector('a');
    if (link && labelCell) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.classList.add('cmp-navigation__item-link');
      newLink.textContent = labelCell.textContent;
      li.append(newLink);
    }
    navGroup.append(li);
  });

  nav.append(navGroup);

  const mobileListDiv = document.createElement('div');
  mobileListDiv.classList.add('cmp-header__mobile-list');

  const policyUl = document.createElement('ul');
  policyUl.classList.add('cmp-header__policy');
  policyLinks.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('cmp-header__policy-list');
    const linkCell = row.children[0];
    const labelCell = row.children[1];
    const link = linkCell.querySelector('a');
    if (link && labelCell) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.textContent = labelCell.textContent;
      newLink.target = '_blank';
      li.append(newLink);
    }
    policyUl.append(li);
  });
  mobileListDiv.append(policyUl);

  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-header__social-media');
  socialLinks.forEach((row) => {
    const linkCell = row.children[0];
    const link = linkCell.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.target = '_blank';
      if (link.href.includes('instagram')) {
        newLink.classList.add('icon-instagram');
        newLink.setAttribute('data-social', 'instagram');
      } else if (link.href.includes('facebook')) {
        newLink.classList.add('icon-facebok');
        newLink.setAttribute('data-social', 'facebook');
      } else if (link.href.includes('twitter')) {
        newLink.classList.add('icon-twitter');
        newLink.setAttribute('data-social', 'twitter');
      } else if (link.href.includes('youtube')) {
        newLink.classList.add('icon-youtube');
        newLink.setAttribute('data-social', 'youtube');
      }
      socialMediaDiv.append(newLink);
    }
  });
  mobileListDiv.append(socialMediaDiv);
  nav.append(mobileListDiv);

  navigationDiv.append(nav);
  navLinksDiv.append(navigationDiv);
  headerDiv.append(navLinksDiv);

  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');

  const accessibilityDiv = document.createElement('div');
  accessibilityDiv.classList.add('cmp-header__accessbility', 'cmp-header__hide-icon');
  const accessibilityLink = document.createElement('a');
  accessibilityLink.href = '#';
  accessibilityLink.classList.add('cmp-header__icon-img');
  const accessibilityIcon = document.createElement('div');
  accessibilityIcon.classList.add('icon-accessibility');
  accessibilityLink.append(accessibilityIcon);
  accessibilityDiv.append(accessibilityLink);
  navIconsDiv.append(accessibilityDiv);

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('cmp-header__search');
  const searchLink = document.createElement('a');
  searchLink.href = '#';
  searchLink.classList.add('cmp-header__icon-img');
  const searchIcon = document.createElement('div');
  searchIcon.classList.add('icon-search');
  const searchText = document.createElement('div');
  searchText.classList.add('cmp-header__icon-text');
  searchText.textContent = 'Search';
  searchLink.append(searchIcon, searchText);
  searchDiv.append(searchLink);
  navIconsDiv.append(searchDiv);

  const loginDiv = document.createElement('div');
  loginDiv.classList.add('cmp-header__login', 'cmp-header__hide-icon');
  const loginLink = document.createElement('a');
  loginLink.href = '#';
  loginLink.classList.add('cmp-header__icon-img');
  const loginIcon = document.createElement('div');
  loginIcon.classList.add('icon-profile');
  loginLink.append(loginIcon);
  loginDiv.append(loginLink);
  navIconsDiv.append(loginDiv);

  headerDiv.append(navIconsDiv);

  block.textContent = '';
  block.append(headerDiv);
}
