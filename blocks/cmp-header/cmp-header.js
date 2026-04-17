import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, ...itemRows] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('cmp-header');

  // Hamburger checkbox
  const hamburger = document.createElement('input');
  hamburger.classList.add('cmp-header__hamburger');
  hamburger.type = 'checkbox';
  hamburger.id = 'hamburger-toggle'; // Add an ID for the label
  header.appendChild(hamburger);

  const hamburgerLabel = document.createElement('label');
  hamburgerLabel.htmlFor = 'hamburger-toggle';
  hamburgerLabel.classList.add('cmp-header__hamburger-label'); // Add a label for accessibility
  header.appendChild(hamburgerLabel);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image', 'cmp-header__logo');

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));

    const logoLink = document.createElement('a');
    logoLink.classList.add('cmp-image__link');
    const foundLogoLink = logoLinkRow.querySelector('a');
    if (foundLogoLink) {
      logoLink.href = foundLogoLink.href;
    }
    logoLink.appendChild(optimizedPic);
    logoDiv.appendChild(logoLink);
  }
  moveInstrumentation(logoRow, logoDiv); // Move instrumentation from original logo row
  moveInstrumentation(logoLinkRow, logoDiv); // Move instrumentation from original logo link row
  header.appendChild(logoDiv);

  // Navigation and other links container
  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');

  const navigation = document.createElement('div');
  navigation.classList.add('navigation');

  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  nav.setAttribute('role', 'navigation');

  const mainNavUl = document.createElement('ul');
  mainNavUl.classList.add('cmp-navigation__group', 'cmp-header__nav-group');

  const policyLinksUl = document.createElement('ul');
  policyLinksUl.classList.add('cmp-header__policy');

  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-header__social-media');

  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');

  // Separate item rows by type using content detection
  const navigationItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells.some(c => c.querySelector('ul')); // Navigation items have 3 cells, one with a UL
  });
  const policyLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && !cells.some(c => c.querySelector('.icon-instagram')); // Policy links have 2 cells, no social icon
  });
  const socialLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells.some(c => c.textContent.trim().startsWith('icon-')); // Social links have 2 cells, one with icon class text
  });
  const navIconItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells.some(c => c.textContent.trim().startsWith('icon-') && !c.querySelector('ul')); // Nav icons have 3 cells, one with icon class text, no UL
  });

  // Helper to transform nested lists (for navigation hierarchy)
  function transformNestedLists(rootUl) {
    if (!rootUl) return;
    [...rootUl.children].forEach((li) => {
      li.classList.add('cmp-navigation__item', `cmp-navigation__item--level-${li.closest('ul').children.length > 0 ? li.closest('ul').children.length - 1 : 0}`); // Add level class
      const nested = li.querySelector(':scope > ul');
      let anchor = li.querySelector(':scope > a');

      if (!anchor) {
        const textNode = [...li.childNodes].find(
          (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
        );
        if (textNode) {
          const span = document.createElement('span');
          span.textContent = textNode.textContent.trim();
          textNode.remove();
          li.prepend(span);
          anchor = span; // Use span as the trigger
        }
      }

      if (anchor) {
        anchor.classList.add('cmp-navigation__item-link');
      }

      if (nested) {
        nested.remove();
        const subWrap = document.createElement('div');
        subWrap.classList.add('cmp-header__submenu');
        subWrap.append(nested);
        li.append(subWrap);

        if (anchor) {
          anchor.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            li.classList.toggle('cmp-navigation__item--active');
            subWrap.classList.toggle('cmp-navigation__group--active');
          });
        }
      } else {
        li.classList.add('cmp-header__no-item'); // For leaf nodes
      }
      transformNestedLists(nested); // Recursively call for nested lists
    });
  }

  // Build Navigation Menu
  navigationItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(c => !c.querySelector('a') && !c.querySelector('ul'));
    const linkCell = cells.find(c => c.querySelector('a') && !c.querySelector('ul'));
    const hierarchyCell = cells.find(c => c.querySelector('ul'));

    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products');

    let rootEl;
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
      rootEl.classList.add('cmp-navigation__item-link');
    } else {
      rootEl = document.createElement('span');
      rootEl.classList.add('cmp-navigation__item-link');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl);

    li.appendChild(rootEl);

    if (hierarchyCell) {
      li.classList.add('cmp-header__nav-products-click');
      const wrapper = document.createElement('ul');
      wrapper.classList.add('cmp-navigation__group', 'cmp-header__product-items');

      const categoryMenuDiv = document.createElement('div');
      categoryMenuDiv.classList.add('cmp-header__category-menu');

      // Use innerHTML to preserve nested structure
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell

      // Apply classes to nested elements from ORIGINAL HTML
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('cmp-navigation__group'));
      tempDiv.querySelectorAll('li').forEach(liEl => liEl.classList.add('cmp-navigation__item'));
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('cmp-navigation__item-link'));

      while (tempDiv.firstChild) {
        categoryMenuDiv.appendChild(tempDiv.firstChild);
      }
      wrapper.appendChild(categoryMenuDiv);

      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle('cmp-navigation__group--active');
        li.classList.toggle('cmp-navigation__item--active');
      });
      li.appendChild(wrapper);
      transformNestedLists(categoryMenuDiv.querySelector('ul')); // Start transformation from the root UL
    } else {
      li.classList.add('cmp-header__no-items');
    }
    mainNavUl.appendChild(li);
  });

  nav.appendChild(mainNavUl);

  // Mobile list wrapper
  const mobileListDiv = document.createElement('div');
  mobileListDiv.classList.add('cmp-header__mobile-list');

  // Build Policy Links
  policyLinkItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(c => !c.querySelector('a'));
    const linkCell = cells.find(c => c.querySelector('a'));

    const li = document.createElement('li');
    li.classList.add('cmp-header__policy-list');

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, anchor);
    li.appendChild(anchor);
    policyLinksUl.appendChild(li);
  });
  mobileListDiv.appendChild(policyLinksUl);

  // Build Social Links
  socialLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconClassCell = cells.find(c => !c.querySelector('a'));
    const linkCell = cells.find(c => c.querySelector('a'));

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    const iconClass = iconClassCell?.textContent.trim();
    if (iconClass) {
      anchor.classList.add(iconClass);
    }
    moveInstrumentation(row, anchor);
    socialMediaDiv.appendChild(anchor);
  });
  mobileListDiv.appendChild(socialMediaDiv);

  nav.appendChild(mobileListDiv);
  navigation.appendChild(nav);
  navLinksDiv.appendChild(navigation);
  header.appendChild(navLinksDiv);

  // Build Nav Icons
  navIconItems.forEach((row) => {
    const cells = [...row.children];
    const iconClassCell = cells.find(c => c.textContent.trim().startsWith('icon-'));
    const linkCell = cells.find(c => c.querySelector('a'));
    const labelCell = cells.find(c => !c.querySelector('a') && !c.textContent.trim().startsWith('icon-'));

    const iconWrapper = document.createElement('div');
    // Default classes, adjust based on icon type - original HTML has specific classes
    const iconText = iconClassCell?.textContent.trim();
    if (iconText === 'icon-accessibility') {
      iconWrapper.classList.add('cmp-header__accessbility', 'cmp-header__hide-icon');
    } else if (iconText === 'icon-search') {
      iconWrapper.classList.add('cmp-header__search');
    } else if (iconText === 'icon-profile') {
      iconWrapper.classList.add('cmp-header__login', 'cmp-header__hide-icon');
    }

    const anchor = document.createElement('a');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    anchor.classList.add('cmp-header__icon-img');

    const iconDiv = document.createElement('div');
    if (iconClassCell?.textContent.trim()) {
      iconDiv.classList.add(iconClassCell.textContent.trim());
    }
    anchor.appendChild(iconDiv);

    const labelDiv = document.createElement('div');
    labelDiv.classList.add('cmp-header__icon-text');
    labelDiv.textContent = labelCell?.textContent.trim() || '';
    anchor.appendChild(labelDiv);

    iconWrapper.appendChild(anchor);
    moveInstrumentation(row, iconWrapper);
    navIconsDiv.appendChild(iconWrapper);
  });
  header.appendChild(navIconsDiv);

  block.innerHTML = '';
  block.appendChild(header);
}
