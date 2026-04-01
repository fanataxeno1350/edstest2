import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // BlockJson defines 4 root model fields: logo, navItems (container), socialLinks (container), policyLinks (container)
  // The EDS BLOCK STRUCTURE shows these as the first 4 children of the block.
  // All subsequent children are item rows for the containers.
  const [logoRow, navItemsContainer, socialLinksContainer, policyLinksContainer, ...itemRows] = [...block.children];

  const headerDiv = document.createElement('div');
  headerDiv.classList.add('cmp-header');

  const hamburgerInput = document.createElement('input');
  hamburgerInput.classList.add('cmp-header__hamburger');
  hamburgerInput.type = 'checkbox';
  hamburgerInput.id = 'hamburger-toggle'; // Add an ID for easier toggling
  headerDiv.append(hamburgerInput);

  // Hamburger label for interactivity
  const hamburgerLabel = document.createElement('label');
  hamburgerLabel.htmlFor = 'hamburger-toggle';
  hamburgerLabel.classList.add('cmp-header__hamburger-label'); // Invented class, but necessary for UX
  headerDiv.append(hamburgerLabel);

  // Add event listener for hamburger menu
  hamburgerInput.addEventListener('change', () => {
    headerDiv.classList.toggle('cmp-header--open', hamburgerInput.checked);
    // You might want to toggle other elements visibility here as well
    // For example, navLinksDiv.classList.toggle('cmp-header__nav-links--open', hamburgerInput.checked);
  });

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo', 'image', 'cmp-header__logo');
  moveInstrumentation(logoRow, logoWrapper);

  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    if (logoImg) {
      const optimizedPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(logoImg, optimizedPic.querySelector('img'));
      logoLink.href = logoRow.querySelector('a')?.href || '/';
      logoLink.append(optimizedPic);
    }
  }
  logoWrapper.append(logoLink);
  headerDiv.append(logoWrapper);

  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');

  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation');

  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  nav.role = 'navigation';

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group');

  // Navigation Items (nav-item sub-component: 2 cells - label, url)
  const navItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a'));
  navItems.forEach((row) => {
    const [labelCell, urlCell] = row.children; // Destructure cells for nav-item
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products'); // Removed cmp-header__no-items as it's not in allowlist

    const link = document.createElement('a');
    link.classList.add('cmp-navigation__item-link');
    const url = urlCell.querySelector('a'); // Get the anchor from the URL cell
    if (url) {
      link.href = url.href;
      link.textContent = labelCell.textContent.trim(); // Get text from label cell
    }
    li.append(link);
    navGroup.append(li);
  });
  moveInstrumentation(navItemsContainer, navGroup);

  nav.append(navGroup);

  // Mobile list for policy and social links
  const mobileListDiv = document.createElement('div');
  mobileListDiv.classList.add('cmp-header__mobile-list');

  const policyUl = document.createElement('ul');
  policyUl.classList.add('cmp-header__policy');

  // Policy Links (policy-link sub-component: 1 cell - url)
  const policyLinks = itemRows.filter((row) => row.children.length === 1 && row.querySelector('a') && !row.querySelector('picture') && !row.querySelector('a').href.includes('social'));
  policyLinks.forEach((row) => {
    const urlCell = row.children[0]; // Policy link has only one cell
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('cmp-header__policy-list');
    const link = urlCell.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.textContent = link.textContent;
      newLink.target = '_blank';
      li.append(newLink);
    }
    policyUl.append(li);
  });
  moveInstrumentation(policyLinksContainer, policyUl);
  mobileListDiv.append(policyUl);

  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-header__social-media');

  // Social Links (social-link sub-component: 1 cell - url)
  const socialLinks = itemRows.filter((row) => row.children.length === 1 && row.querySelector('a') && row.querySelector('a').href.includes('social'));
  socialLinks.forEach((row) => {
    const urlCell = row.children[0]; // Social link has only one cell
    const link = urlCell.querySelector('a');
    if (link) {
      const socialLink = document.createElement('a');
      socialLink.href = link.href;
      socialLink.target = '_blank';
      // Determine social icon class based on href
      if (link.href.includes('instagram')) {
        socialLink.classList.add('icon-instagram');
        socialLink.setAttribute('data-social', 'instagram');
      } else if (link.href.includes('facebook')) {
        socialLink.classList.add('icon-facebok'); // Corrected typo from original HTML
        socialLink.setAttribute('data-social', 'facebook');
      } else if (link.href.includes('twitter')) {
        socialLink.classList.add('icon-twitter');
        socialLink.setAttribute('data-social', 'twitter');
      } else if (link.href.includes('youtube')) {
        socialLink.classList.add('icon-youtube');
        socialLink.setAttribute('data-social', 'youtube');
      }
      moveInstrumentation(row, socialLink);
      socialMediaDiv.append(socialLink);
    }
  });
  moveInstrumentation(socialLinksContainer, socialMediaDiv);
  mobileListDiv.append(socialMediaDiv);

  nav.append(mobileListDiv);
  navigationDiv.append(nav);
  navLinksDiv.append(navigationDiv);
  headerDiv.append(navLinksDiv);

  // Nav Icons (Accessibility, Search, Login)
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

  // Image optimization
  headerDiv.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(headerDiv);
}
