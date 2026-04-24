import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

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
      subWrap.classList.add('cmp-header__submenu'); // Use class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const header = document.createElement('div');
  header.classList.add('cmp-header');

  const hamburgerInput = document.createElement('input');
  hamburgerInput.classList.add('cmp-header__hamburger');
  hamburgerInput.type = 'checkbox';
  header.append(hamburgerInput);

  // Add event listener for hamburger menu
  hamburgerInput.addEventListener('change', () => {
    header.classList.toggle('active', hamburgerInput.checked);
  });

  // Logo and Logo Link
  // Find the logo row (contains picture) and logo link row (contains aem-content link)
  const logoRow = children.find((row) => row.querySelector('picture'));
  const logoLinkRow = children.find((row) => row.querySelector('a[href*="/content/site/logo-link"]')); // More specific detection

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image', 'cmp-header__logo');

  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  const foundLogoLink = logoLinkRow?.querySelector('a'); // Use optional chaining
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  } else {
    logoLink.href = '/'; // Default link if not provided
  }

  const picture = logoRow?.querySelector('picture'); // Use optional chaining
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  if (logoRow) moveInstrumentation(logoRow, logoLink);
  logoDiv.append(logoLink);
  header.append(logoDiv);

  // Navigation Links
  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');

  const navigation = document.createElement('div');
  navigation.classList.add('navigation');

  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  nav.setAttribute('role', 'navigation');

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group');

  // Filter out the logo and logo link rows to get item rows
  const itemRows = children.filter((row) => row !== logoRow && row !== logoLinkRow);

  // Content detection for different item types
  const navigationItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('ul')); // Navigation items have a hierarchy-tree (ul)
  const policyLinkItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a') && row.querySelector('a').href.includes('/policy'));
  const socialMediaItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a') && !row.querySelector('a').href.includes('/policy'));
  const navIconItems = itemRows.filter((row) => row.children.length === 3 && !row.querySelector('ul')); // Nav icons have 3 cells but no hierarchy-tree

  navigationItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const linkCell = cells[1];
    const hierarchyCell = cells[2];

    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products');

    const foundLink = linkCell.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
      rootEl.classList.add('cmp-navigation__item-link');
    } else {
      rootEl = document.createElement('span'); // Use span if no link
    }
    rootEl.textContent = labelCell.textContent.trim();
    moveInstrumentation(labelCell, rootEl); // Move instrumentation from label cell

    li.appendChild(rootEl);

    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      li.classList.add('cmp-header__nav-products-click'); // Add class for expandable items
      const wrapper = document.createElement('ul');
      wrapper.classList.add('cmp-navigation__group', 'cmp-header__product-items');
      const categoryMenu = document.createElement('div');
      categoryMenu.classList.add('cmp-header__category-menu');

      // Move instrumentation for the hierarchy cell content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv);

      // Apply classes to nested elements from ORIGINAL HTML
      tempDiv.querySelectorAll('li').forEach(item => item.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1'));
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('cmp-navigation__item-link'));
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('cmp-navigation__group'));

      while (tempDiv.firstChild) {
        categoryMenu.append(tempDiv.firstChild);
      }

      wrapper.appendChild(categoryMenu);
      li.appendChild(wrapper);

      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        wrapper.classList.toggle('active');
      });
      transformNestedLists(hierarchyRoot); // This will re-process the moved UL
    } else {
      li.classList.add('cmp-header__no-items'); // Add class for non-expandable items
    }
    navGroup.appendChild(li);
  });

  nav.appendChild(navGroup);
  navigation.appendChild(nav);
  navLinksDiv.appendChild(navigation);

  // Mobile list (policy links and social media)
  const mobileListDiv = document.createElement('div');
  mobileListDiv.classList.add('cmp-header__mobile-list');

  // Policy Links
  const policyUl = document.createElement('ul');
  policyUl.classList.add('cmp-header__policy');
  policyLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('cmp-header__policy-list');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, anchor);
    li.appendChild(anchor);
    policyUl.appendChild(li);
  });
  mobileListDiv.appendChild(policyUl);

  // Social Media Links
  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-header__social-media');
  socialMediaItems.forEach((row) => {
    const [socialTypeCell, linkCell] = [...row.children];
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    const socialType = socialTypeCell.textContent.trim().toLowerCase();
    // Corrected class name from 'icon-facebok' to 'icon-facebook' based on common usage and potential typo
    anchor.classList.add(`icon-${socialType === 'facebook' ? 'facebook' : socialType}`);
    anchor.setAttribute('data-social', socialType);
    anchor.setAttribute('target', '_blank');
    moveInstrumentation(row, anchor);
    socialMediaDiv.appendChild(anchor);
  });
  mobileListDiv.appendChild(socialMediaDiv);
  navLinksDiv.appendChild(mobileListDiv);

  header.append(navLinksDiv);

  // Nav Icons
  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');

  navIconItems.forEach((row) => {
    const [iconTypeCell, linkCell, labelCell] = [...row.children];
    const iconType = iconTypeCell.textContent.trim().toLowerCase();
    const wrapperDiv = document.createElement('div');
    // Corrected class names to match ORIGINAL HTML
    if (iconType === 'accessibility') {
      wrapperDiv.classList.add('cmp-header__accessbility', 'cmp-header__hide-icon');
    } else if (iconType === 'search') {
      wrapperDiv.classList.add('cmp-header__search');
    } else if (iconType === 'login') {
      wrapperDiv.classList.add('cmp-header__login', 'cmp-header__hide-icon');
    } else {
      wrapperDiv.classList.add(`cmp-header__${iconType}`);
    }

    const anchor = document.createElement('a');
    anchor.classList.add('cmp-header__icon-img');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    } else {
      anchor.href = '#';
    }

    const iconDiv = document.createElement('div');
    // Corrected icon class for login from 'icon-login' to 'icon-profile' based on ORIGINAL HTML
    iconDiv.classList.add(`icon-${iconType === 'login' ? 'profile' : iconType}`);
    anchor.appendChild(iconDiv);

    const textDiv = document.createElement('div');
    textDiv.classList.add('cmp-header__icon-text');
    textDiv.textContent = labelCell.textContent.trim();
    anchor.appendChild(textDiv);

    moveInstrumentation(row, anchor);
    wrapperDiv.appendChild(anchor);
    navIconsDiv.appendChild(wrapperDiv);
  });

  header.append(navIconsDiv);

  block.innerHTML = '';
  moveInstrumentation(block, header);
  block.append(header);
}
