import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    // Apply classes from ORIGINAL HTML to list items
    li.classList.add('cmp-navigation__item');
    const nested = li.querySelector(':scope > ul');
    // Handle label-only nodes
    const anchor = li.querySelector(':scope > a');
    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        span.classList.add('cmp-navigation__item-link'); // Apply class to label-only span
        textNode.remove();
        li.prepend(span);
      }
    } else {
      anchor.classList.add('cmp-navigation__item-link'); // Apply class to existing anchor
    }

    if (nested) {
      // Apply classes from ORIGINAL HTML to nested ULs
      nested.classList.add('cmp-navigation__group', 'cmp-header__submenu');
      nested.remove(); // Remove to re-wrap
      const subWrap = document.createElement('div');
      subWrap.classList.add('cmp-header__category-menu'); // Use class from ORIGINAL HTML for the wrapper
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        li.classList.add('cmp-navigation__item--level-1'); // Add level class for items with submenus
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // Use 'active' class for state
          subWrap.classList.toggle('active'); // Use 'active' class for state
        });
      }
    } else {
      li.classList.add('cmp-header__no-item'); // Add class for items without submenus
    }
  });
}

export default function decorate(block) {
  const [logoRow, logoLinkRow, ...itemRows] = [...block.children];

  const header = document.createElement('div');
  header.classList.add('cmp-header');
  moveInstrumentation(block, header);

  const hamburgerInput = document.createElement('input');
  hamburgerInput.classList.add('cmp-header__hamburger');
  hamburgerInput.type = 'checkbox';
  header.append(hamburgerInput);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image', 'cmp-header__logo');
  moveInstrumentation(logoRow, logoDiv);

  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  } else {
    logoLink.href = '/'; // Fallback to home
  }
  moveInstrumentation(logoLinkRow, logoLink);

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoDiv.append(logoLink);
  header.append(logoDiv);

  // Navigation and other links
  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');

  const navigationWrapper = document.createElement('div');
  navigationWrapper.classList.add('navigation');

  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  nav.setAttribute('role', 'navigation');

  const mainNavUl = document.createElement('ul');
  mainNavUl.classList.add('cmp-navigation__group', 'cmp-header__nav-group');

  const mobileListDiv = document.createElement('div');
  mobileListDiv.classList.add('cmp-header__mobile-list');

  const policyUl = document.createElement('ul');
  policyUl.classList.add('cmp-header__policy');

  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-header__social-media');

  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3) { // navigation-item
      const labelCell = cells.find(c => !c.querySelector('a') && !c.querySelector('ul'));
      const linkCell = cells.find(c => c.querySelector('a'));
      const hierarchyCell = cells.find(c => c.querySelector('ul'));

      const li = document.createElement('li');
      li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products');

      const foundLink = linkCell?.querySelector('a');
      let rootEl;
      if (foundLink) {
        rootEl = document.createElement('a');
        rootEl.href = foundLink.href;
        rootEl.classList.add('cmp-navigation__item-link');
      } else {
        rootEl = document.createElement('span');
        rootEl.classList.add('cmp-navigation__item-link');
      }
      rootEl.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(labelCell, rootEl); // Move instrumentation from label cell
      if (linkCell) moveInstrumentation(linkCell, rootEl); // Move instrumentation from link cell

      li.appendChild(rootEl);

      if (hierarchyCell) {
        li.classList.add('cmp-header__nav-products-click'); // Add class for dropdown behavior
        const wrapper = document.createElement('ul');
        wrapper.classList.add('cmp-navigation__group', 'cmp-header__product-items'); // Use ORIGINAL HTML class
        const categoryMenuDiv = document.createElement('div');
        categoryMenuDiv.classList.add('cmp-header__category-menu');

        // Use innerHTML to preserve nested structure and then transform
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML;
        const hierarchyRoot = tempDiv.querySelector('ul');
        if (hierarchyRoot) {
          moveInstrumentation(hierarchyCell, hierarchyRoot); // Move instrumentation from original cell to new root
          transformNestedLists(hierarchyRoot); // Apply transformations and classes to nested lists
          while (hierarchyRoot.firstChild) {
            categoryMenuDiv.appendChild(hierarchyRoot.firstChild);
          }
        }
        wrapper.appendChild(categoryMenuDiv);
        rootEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          wrapper.classList.toggle('active');
        });
        li.appendChild(wrapper);
      } else {
        li.classList.add('cmp-header__no-items');
      }
      mainNavUl.appendChild(li);
    } else if (cells.length === 2) {
      const labelCell = cells.find(c => !c.querySelector('a'));
      const linkCell = cells.find(c => c.querySelector('a'));

      const foundLink = linkCell?.querySelector('a');
      const labelText = labelCell?.textContent.trim();

      if (labelText.toLowerCase().includes('policy')) { // policy-link-item
        const li = document.createElement('li');
        li.classList.add('cmp-header__policy-list');
        const anchor = document.createElement('a');
        if (foundLink) anchor.href = foundLink.href;
        anchor.textContent = labelText;
        moveInstrumentation(labelCell, anchor);
        if (linkCell) moveInstrumentation(linkCell, anchor);
        li.appendChild(anchor);
        policyUl.appendChild(li);
      } else if (['instagram', 'facebook', 'twitter', 'youtube'].some(platform => labelText.toLowerCase().includes(platform))) { // social-media-link-item
        const anchor = document.createElement('a');
        if (foundLink) anchor.href = foundLink.href;
        anchor.setAttribute('target', '_blank');
        anchor.setAttribute('data-social', labelText.toLowerCase());

        // Map platform to icon class
        const platform = labelText.toLowerCase();
        if (platform.includes('instagram')) {
          anchor.classList.add('icon-instagram');
        } else if (platform.includes('facebook')) {
          anchor.classList.add('icon-facebook'); // Corrected class name
        } else if (platform.includes('twitter')) {
          anchor.classList.add('icon-twitter');
        } else if (platform.includes('youtube')) {
          anchor.classList.add('icon-youtube');
        }
        moveInstrumentation(labelCell, anchor);
        if (linkCell) moveInstrumentation(linkCell, anchor);
        socialMediaDiv.appendChild(anchor);
      } else { // nav-icon-item
        const iconDiv = document.createElement('div');
        const iconLabel = labelText.toLowerCase();
        if (iconLabel.includes('accessibility')) {
          iconDiv.classList.add('cmp-header__accessbility', 'cmp-header__hide-icon');
        } else if (iconLabel.includes('search')) {
          iconDiv.classList.add('cmp-header__search');
        } else if (iconLabel.includes('login')) {
          iconDiv.classList.add('cmp-header__login', 'cmp-header__hide-icon');
        }

        const anchor = document.createElement('a');
        anchor.href = foundLink?.href || '#';
        anchor.classList.add('cmp-header__icon-img');

        const iconSvgDiv = document.createElement('div');
        if (iconLabel.includes('accessibility')) {
          iconSvgDiv.classList.add('icon-accessibility');
        } else if (iconLabel.includes('search')) {
          iconSvgDiv.classList.add('icon-search');
        } else if (iconLabel.includes('login')) {
          iconSvgDiv.classList.add('icon-profile');
        }
        anchor.appendChild(iconSvgDiv);

        const iconTextDiv = document.createElement('div');
        iconTextDiv.classList.add('cmp-header__icon-text');
        iconTextDiv.textContent = labelText;
        anchor.appendChild(iconTextDiv);

        moveInstrumentation(labelCell, anchor);
        if (linkCell) moveInstrumentation(linkCell, anchor);
        iconDiv.appendChild(anchor);
        navIconsDiv.appendChild(iconDiv);
      }
    }
  });

  nav.appendChild(mainNavUl);
  mobileListDiv.appendChild(policyUl);
  mobileListDiv.appendChild(socialMediaDiv);
  nav.appendChild(mobileListDiv);
  navigationWrapper.appendChild(nav);
  navLinksDiv.appendChild(navigationWrapper);
  header.appendChild(navLinksDiv);
  header.appendChild(navIconsDiv);

  block.replaceWith(header);

  // Hamburger menu toggle
  hamburgerInput.addEventListener('change', () => {
    header.classList.toggle('cmp-header--open', hamburgerInput.checked);
  });
}
