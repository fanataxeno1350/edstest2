import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Normalize label-only nodes
    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('cmp-header__submenu'); // Use class from original HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // Use 'active' class for state
          subWrap.classList.toggle('active'); // Use 'active' class for state
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Fixed fields: logo and logo-link
  // Use content detection for the first two fixed fields
  const logoRow = children.find(row => row.querySelector('picture'));
  const logoLinkRow = children.find(row => row.querySelector('a') && !row.querySelector('picture'));
  const itemRows = children.filter(row => row !== logoRow && row !== logoLinkRow);

  const header = document.createElement('div');
  header.classList.add('cmp-header');

  const hamburgerInput = document.createElement('input');
  hamburgerInput.classList.add('cmp-header__hamburger');
  hamburgerInput.type = 'checkbox';
  header.append(hamburgerInput);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image', 'cmp-header__logo');
  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');

  // Safely get logoHref from logoLinkRow
  const logoHref = logoLinkRow?.querySelector('a')?.href;
  if (logoHref) {
    logoLink.href = logoHref;
  }

  const picture = logoRow?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  moveInstrumentation(logoRow, logoDiv); // Move instrumentation from the original logo row
  moveInstrumentation(logoLinkRow, logoLink); // Move instrumentation from the original logo link row
  logoDiv.append(logoLink);
  header.append(logoDiv);

  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');

  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation');

  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  nav.setAttribute('role', 'navigation');

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group');

  const mobileListDiv = document.createElement('div');
  mobileListDiv.classList.add('cmp-header__mobile-list');

  const policyUl = document.createElement('ul');
  policyUl.classList.add('cmp-header__policy');

  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-header__social-media');

  itemRows.forEach((row) => {
    const cells = [...row.children];
    // Detect item type by cell count and content
    if (cells.length === 3) {
      // Navigation Item: label, link, hierarchy-tree
      const [labelCell, linkCell, hierarchyCell] = cells;
      const li = document.createElement('li');
      li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products');

      const foundLink = linkCell?.querySelector('a');
      let rootEl;
      if (foundLink) {
        rootEl = document.createElement('a');
        rootEl.href = foundLink.href;
        rootEl.classList.add('cmp-navigation__item-link');
      } else {
        rootEl = document.createElement('span'); // Use span for non-linked labels
        rootEl.classList.add('cmp-navigation__item-link'); // Apply link styling to span
      }
      rootEl.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(labelCell, rootEl); // Move instrumentation from label cell

      li.appendChild(rootEl);

      // For richtext hierarchy-tree, use innerHTML
      const hierarchyContent = hierarchyCell?.innerHTML;
      if (hierarchyContent && hierarchyCell.querySelector('ul')) {
        li.classList.add('cmp-header__nav-products-click'); // Add class for items with sub-menus
        const wrapper = document.createElement('div');
        wrapper.classList.add('cmp-header__product-items'); // Use class from original HTML
        const categoryMenuDiv = document.createElement('div');
        categoryMenuDiv.classList.add('cmp-header__category-menu');

        // Create a temporary div to parse the HTML and apply classes
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyContent;
        const hierarchyRoot = tempDiv.querySelector('ul');

        if (hierarchyRoot) {
          // Apply classes to nested elements as per original HTML
          hierarchyRoot.classList.add('cmp-navigation__group'); // Add this class if it's the root UL
          hierarchyRoot.querySelectorAll('li').forEach(item => {
            item.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1');
            if (!item.querySelector('ul')) { // Check if it's a leaf item
              item.classList.add('cmp-header__no-item');
            }
          });
          hierarchyRoot.querySelectorAll('a').forEach(a => a.classList.add('cmp-navigation__item-link'));

          moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original hierarchy cell
          categoryMenuDiv.appendChild(hierarchyRoot);
          wrapper.appendChild(categoryMenuDiv);

          rootEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            wrapper.classList.toggle('active'); // Use 'active' class for state
            li.classList.toggle('active'); // Use 'active' class for state
          });
          li.appendChild(wrapper);
          transformNestedLists(hierarchyRoot);
        }
      } else {
        li.classList.add('cmp-header__no-items'); // Add class for items without sub-menus
      }
      navGroup.appendChild(li);
    } else if (cells.length === 2) {
      const [labelCell, linkCell] = cells;
      const foundLink = linkCell?.querySelector('a');

      // Use a more robust check for social links based on the platform text
      const platformText = labelCell.textContent.trim().toLowerCase();
      const isSocialLink = ['instagram', 'facebook', 'twitter', 'youtube'].includes(platformText);

      if (isSocialLink) {
        // Social Link Item: platform, link
        if (foundLink) {
          const socialLink = document.createElement('a');
          socialLink.href = foundLink.href;
          socialLink.target = '_blank';
          socialLink.setAttribute('data-social', platformText);
          // Map platform to icon class from original HTML
          if (platformText === 'instagram') {
            socialLink.classList.add('icon-instagram');
          } else if (platformText === 'facebook') {
            socialLink.classList.add('icon-facebok');
          } else if (platformText === 'twitter') {
            socialLink.classList.add('icon-twitter');
          } else if (platformText === 'youtube') {
            socialLink.classList.add('icon-youtube');
          }
          moveInstrumentation(row, socialLink);
          socialMediaDiv.appendChild(socialLink);
        }
      } else {
        // Policy Link Item: label, link
        const li = document.createElement('li');
        li.classList.add('cmp-header__policy-list');
        const policyLink = document.createElement('a');
        if (foundLink) {
          policyLink.href = foundLink.href;
          policyLink.textContent = labelCell?.textContent.trim() || '';
          policyLink.target = '_self'; // Assuming _self based on original HTML
        }
        moveInstrumentation(row, policyLink);
        li.appendChild(policyLink);
        policyUl.appendChild(li);
      }
    }
  });

  nav.appendChild(navGroup);
  mobileListDiv.appendChild(policyUl);
  mobileListDiv.appendChild(socialMediaDiv);
  nav.appendChild(mobileListDiv); // Append mobile list to nav
  navigationDiv.appendChild(nav);
  navLinksDiv.appendChild(navigationDiv);
  header.appendChild(navLinksDiv);

  // Nav Icons (Accessibility, Search, Login)
  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');

  // Accessibility
  const accessibilityDiv = document.createElement('div');
  accessibilityDiv.classList.add('cmp-header__accessbility', 'cmp-header__hide-icon');
  const accessibilityLink = document.createElement('a');
  accessibilityLink.href = '#';
  accessibilityLink.classList.add('cmp-header__icon-img');
  const accessibilityIcon = document.createElement('div');
  accessibilityIcon.classList.add('icon-accessibility');
  const accessibilityText = document.createElement('div');
  accessibilityText.classList.add('cmp-header__icon-text');
  accessibilityText.textContent = 'Accessibility';
  accessibilityLink.append(accessibilityIcon, accessibilityText);
  accessibilityDiv.append(accessibilityLink);
  navIconsDiv.append(accessibilityDiv);

  // Search
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

  // Login
  const loginDiv = document.createElement('div');
  loginDiv.classList.add('cmp-header__login', 'cmp-header__hide-icon');
  const loginLink = document.createElement('a');
  loginLink.href = '#';
  loginLink.classList.add('cmp-header__icon-img');
  const loginIcon = document.createElement('div');
  loginIcon.classList.add('icon-profile');
  const loginText = document.createElement('div');
  loginText.classList.add('cmp-header__icon-text');
  loginText.textContent = 'Login';
  loginLink.append(loginIcon, loginText);
  loginDiv.append(loginLink);
  navIconsDiv.append(loginDiv);

  header.append(navIconsDiv);

  // Replace the original block with the new header structure
  moveInstrumentation(block, header);
  block.replaceWith(header);

  // Hamburger menu functionality
  hamburgerInput.addEventListener('change', () => {
    header.classList.toggle('active', hamburgerInput.checked);
    navLinksDiv.classList.toggle('active', hamburgerInput.checked);
  });

  // Close hamburger menu on outside click
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target) && hamburgerInput.checked) {
      hamburgerInput.checked = false;
      header.classList.remove('active');
      navLinksDiv.classList.remove('active');
    }
  });
}
