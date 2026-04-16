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
      subWrap.classList.add('has-sub-child');
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
  const [logoRow, logoLinkRow, ...itemRows] = [...block.children];

  block.innerHTML = '';
  block.classList.add('bg-red-100', 'position-fixed', 'top-0', 'start-0', 'z-2', 'w-100');

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0', 'd-flex', 'justify-content-between', 'align-items-start', 'align-items-md-center');
  block.append(container);

  const nav = document.createElement('nav');
  nav.classList.add('header-nav', 'navbar', 'position-static', 'navbar-expand-lg');
  container.append(nav);

  const navWrapper = document.createElement('div');
  navWrapper.classList.add('header-comp__wrapper', 'container-fluid', 'justify-content-start', 'gx-4', 'gx-md-0');
  nav.append(navWrapper);

  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('border-0', 'shadow-none', 'navbar-toggler', 'header-comp__wrapper--hamburger', 'collapsed', 'p-0');
  hamburgerButton.type = 'button';
  hamburgerButton.setAttribute('aria-controls', 'navbarSupportedContent');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  hamburgerButton.setAttribute('aria-label', 'Toggle navigation');

  const togglerIcon = document.createElement('span');
  togglerIcon.classList.add('navbar-toggler-icon', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center');
  for (let i = 0; i < 3; i += 1) {
    const span = document.createElement('span');
    span.classList.add('d-block', 'bg-white');
    togglerIcon.append(span);
  }
  hamburgerButton.append(togglerIcon);
  navWrapper.append(hamburgerButton);

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('header-comp__wrapper--logo');

  const logoLink = document.createElement('a');
  logoLink.classList.add('header-comp__wrapper--link', 'cta-analytics', 'navbar-brand', 'm-0');
  moveInstrumentation(logoLinkRow, logoLink);
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('header-comp__wrapper--image', 'h-100');
      moveInstrumentation(img, optimizedImg);
      logoLink.append(optimizedPic);
    }
  }
  logoWrapper.append(logoLink);
  navWrapper.append(logoWrapper);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('header-comp__wrapper--menus', 'collapse', 'navbar-collapse', 'z-3');
  navbarCollapse.id = 'navbarSupportedContent';
  navWrapper.append(navbarCollapse);

  const menuList = document.createElement('ul');
  menuList.classList.add('header-comp__wrapper--menus-groups', 'navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0', 'w-100');
  navbarCollapse.append(menuList);

  const navigationItems = itemRows.filter((row) => row.children.length === 4);
  // const submenuItems = itemRows.filter((row) => row.children.length === 3); // Not used in current rendering logic
  const searchIconItems = itemRows.filter((row) => row.children.length === 2);

  navigationItems.forEach((row, i) => {
    const [iconCell, labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('header-comp__wrapper--menu-item', 'h-100', 'd-flex', 'align-items-center', 'nav-item', 'p-4', 'p-lg-0', 'border-bottom-lg-0', 'dropdown', 'border-lg-0', 'position-relative');
    if (i % 2 === 0) {
      li.classList.add('left-division');
    } else {
      li.classList.add('right-division');
    }
    li.setAttribute('data-header-item-id', `leftHeaderItem${i}`);

    const menuLinkWrapper = document.createElement('div');
    menuLinkWrapper.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
        moveInstrumentation(img, optimizedImg);
        menuLinkWrapper.append(optimizedPic);
      }
    }

    const anchor = document.createElement('a');
    anchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
    moveInstrumentation(linkCell, anchor);
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    const spanLink = document.createElement('span');
    spanLink.classList.add('link-span');
    spanLink.textContent = labelCell.textContent.trim();
    anchor.append(spanLink);
    menuLinkWrapper.append(anchor);

    // Handle richtext 'hierarchy-tree' field
    const hierarchyContent = hierarchyCell.innerHTML;
    if (hierarchyContent.trim()) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyContent;
      const hierarchyRoot = tempDiv.querySelector('ul');

      if (hierarchyRoot) {
        menuLinkWrapper.classList.add('dropdown-toggle');
        menuLinkWrapper.setAttribute('aria-expanded', 'false');

        const toggleDropdown = document.createElement('span');
        toggleDropdown.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
        const arrowImg = document.createElement('img');
        arrowImg.alt = 'svg file';
        arrowImg.src = '/icons/arrow-down.svg'; // Placeholder, replace with actual icon if available in block data
        toggleDropdown.append(arrowImg);
        menuLinkWrapper.append(toggleDropdown);

        const subMenusDiv = document.createElement('div');
        subMenusDiv.classList.add('header-comp__sub-menus');
        subMenusDiv.id = `leftHeaderItem${i}`;
        subMenusDiv.setAttribute('data-id', `leftHeaderItem${i}`);

        const subMenuGroup = document.createElement('ul');
        subMenuGroup.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
        const subMenuTriParent = document.createElement('div');
        subMenuTriParent.classList.add('header-comp__sub-menu', 'tri-parent');
        subMenuGroup.append(subMenuTriParent);

        // Apply classes to nested elements from ORIGINAL HTML
        hierarchyRoot.querySelectorAll('li').forEach(item => item.classList.add('header-comp__wrapper--sub-menu-item', 'child-below'));
        hierarchyRoot.querySelectorAll('a').forEach(item => item.classList.add('text-decoration-none', 'text-dark-gray-100'));
        hierarchyRoot.querySelectorAll('span.sub-link-span').forEach(item => item.classList.add('sub-link-span')); // Ensure this class is preserved if it exists

        // Move instrumentation for the entire hierarchy content
        moveInstrumentation(hierarchyCell, tempDiv);

        transformNestedLists(hierarchyRoot);
        subMenuTriParent.append(hierarchyRoot);
        subMenusDiv.append(subMenuGroup);
        li.append(subMenusDiv);

        toggleDropdown.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('show-nav');
          menuLinkWrapper.classList.toggle('show');
          subMenusDiv.classList.toggle('show');
        });
      }
    }

    li.append(menuLinkWrapper);
    menuList.append(li);
  });

  const searchAccessDiv = document.createElement('div');
  searchAccessDiv.classList.add('header-comp__wrapper--search-access', 'd-flex', 'py-4', 'py-lg-0');
  container.append(searchAccessDiv);

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('header-comp__wrapper--search');
  searchAccessDiv.append(searchDiv);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('header-comp__wrapper--search-icon', 'd-flex', 'flex-column', 'align-items-center', 'font-12', 'leading-20', 'text-white');
  searchDiv.append(searchIconDiv);

  searchIconItems.forEach((row) => {
    const [iconCell, labelCell] = [...row.children];
    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        moveInstrumentation(img, optimizedImg);
        searchIconDiv.append(optimizedPic);
      }
    }

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('d-none', 'd-lg-block');
    labelSpan.textContent = labelCell.textContent.trim();
    searchIconDiv.append(labelSpan);
  });

  const outerBox = document.createElement('div');
  outerBox.classList.add('header__outer-box', 'position-absolute', 'w-100', 'z-2', 'start-0', 'd-lg-none');
  block.append(outerBox);

  // Global search functionality
  const globalSearchSection = document.querySelector('.global-search');
  if (globalSearchSection) {
    const crossWrap = globalSearchSection.querySelector('.cross-wrap');
    const searchWrap = globalSearchSection.querySelector('.search-wrap');

    searchDiv.addEventListener('click', () => {
      globalSearchSection.classList.remove('d-none');
    });

    if (crossWrap) {
      crossWrap.addEventListener('click', () => {
        globalSearchSection.classList.add('d-none');
      });
    }

    if (searchWrap) {
      searchWrap.addEventListener('click', () => {
        // Implement search logic here
        // For now, just close the search
        globalSearchSection.classList.add('d-none');
      });
    }

    const closeOnClick = globalSearchSection.querySelector('.close-on-click');
    if (closeOnClick) {
      closeOnClick.addEventListener('click', (e) => {
        if (e.target === closeOnClick) {
          globalSearchSection.classList.add('d-none');
        }
      });
    }
  }

  hamburgerButton.addEventListener('click', () => {
    navbarCollapse.classList.toggle('show');
    hamburgerButton.classList.toggle('collapsed');
  });

  // Image optimization for all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
