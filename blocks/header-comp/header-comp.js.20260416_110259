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
      subWrap.classList.add('has-sub-child'); // This class is not in the allowlist. It should be defined in the original HTML or removed.
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This class is not in the allowlist. It should be defined in the original HTML or removed.
          subWrap.classList.toggle('active'); // This class is not in the allowlist. It should be defined in the original HTML or removed.
        });
      }
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const [logoRow, logoLinkRow, ...navItemRows] = [...block.children];

  // Create header section
  const headerSection = document.createElement('section');
  headerSection.classList.add('header-comp', 'bg-red-100', 'position-fixed', 'top-0', 'start-0', 'z-2', 'w-100');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'gx-8', 'gx-sm-0', 'd-flex', 'justify-content-between', 'align-items-start', 'align-items-md-center');
  headerSection.append(containerDiv);

  // Create nav element
  const nav = document.createElement('nav');
  nav.classList.add('header-nav', 'navbar', 'position-static', 'navbar-expand-lg');
  containerDiv.append(nav);

  const navWrapper = document.createElement('div');
  navWrapper.classList.add('header-comp__wrapper', 'container-fluid', 'justify-content-start', 'gx-4', 'gx-md-0');
  nav.append(navWrapper);

  // Hamburger button
  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('border-0', 'shadow-none', 'navbar-toggler', 'header-comp__wrapper--hamburger', 'collapsed', 'p-0');
  hamburgerButton.type = 'button';
  hamburgerButton.setAttribute('aria-controls', 'navbarSupportedContent');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  hamburgerButton.setAttribute('aria-label', 'Toggle navigation');
  const hamburgerSpan = document.createElement('span');
  hamburgerSpan.classList.add('navbar-toggler-icon', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center');
  for (let i = 0; i < 3; i += 1) {
    const lineSpan = document.createElement('span');
    lineSpan.classList.add('d-block', 'bg-white');
    hamburgerSpan.append(lineSpan);
  }
  hamburgerButton.append(hamburgerSpan);
  navWrapper.append(hamburgerButton);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('header-comp__wrapper--logo');
  const logoLink = document.createElement('a');
  logoLink.classList.add('header-comp__wrapper--link', 'cta-analytics', 'navbar-brand', 'm-0');
  logoLink.setAttribute('data-link-region', 'Header');
  logoLink.href = logoLinkRow.querySelector('a')?.href || '#';

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    if (logoImg) {
      const optimizedPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '100' }]);
      moveInstrumentation(logoImg, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
      logoImg.classList.add('header-comp__wrapper--image', 'h-100');
    }
  }
  logoDiv.append(logoLink);
  navWrapper.append(logoDiv);

  // Navigation menus
  const navCollapseDiv = document.createElement('div');
  navCollapseDiv.classList.add('header-comp__wrapper--menus', 'collapse', 'navbar-collapse', 'z-3');
  navCollapseDiv.id = 'navbarSupportedContent';
  navWrapper.append(navCollapseDiv);

  const navUl = document.createElement('ul');
  navUl.classList.add('header-comp__wrapper--menus-groups', 'navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0', 'w-100');
  navCollapseDiv.append(navUl);

  // Hamburger toggle functionality
  hamburgerButton.addEventListener('click', () => {
    navCollapseDiv.classList.toggle('collapse');
    navCollapseDiv.classList.toggle('show'); // This class is not in the allowlist. It should be defined in the original HTML or removed.
    hamburgerButton.classList.toggle('collapsed');
  });

  navItemRows.forEach((row) => {
    // Use content detection instead of index access
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));
    // Label cell is the one without picture, anchor, or ul
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && !cell.querySelector('ul'));

    const li = document.createElement('li');
    li.classList.add('header-comp__wrapper--menu-item', 'h-100', 'd-flex', 'align-items-center', 'nav-item', 'p-4', 'p-lg-0', 'border-bottom-lg-0', 'border-lg-0', 'position-relative');

    const menuLinkDiv = document.createElement('div');
    menuLinkDiv.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');

    if (iconCell) {
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const iconImg = iconPicture.querySelector('img');
        if (iconImg) {
          const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '24' }]);
          optimizedIcon.classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
          moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
          menuLinkDiv.append(optimizedIcon);
        }
      }
    }

    const anchor = document.createElement('a');
    anchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
    anchor.setAttribute('data-link-region', 'Header');
    anchor.href = linkCell?.querySelector('a')?.href || '#';

    const spanLink = document.createElement('span');
    spanLink.classList.add('link-span');
    spanLink.textContent = labelCell?.textContent.trim() || '';
    anchor.append(spanLink);
    menuLinkDiv.append(anchor);

    if (hierarchyCell) {
      li.classList.add('dropdown', 'show-nav', 'left-division'); // Add classes for dropdown behavior
      menuLinkDiv.classList.add('dropdown-toggle');
      menuLinkDiv.setAttribute('aria-expanded', 'false');

      const toggleDropDown = document.createElement('span');
      toggleDropDown.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
      const arrowIcon = document.createElement('img');
      arrowIcon.alt = 'svg file';
      arrowIcon.src = '/icons/arrow-icon.svg'; // Placeholder for arrow icon
      toggleDropDown.append(arrowIcon);
      menuLinkDiv.append(toggleDropDown);

      const subMenusDiv = document.createElement('div');
      subMenusDiv.classList.add('header-comp__sub-menus');
      subMenusDiv.id = `navItem-${navUl.children.length}`;

      const subMenuContainer = document.createElement('ul');
      subMenuContainer.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
      const triParentDiv = document.createElement('div');
      triParentDiv.classList.add('header-comp__sub-menu', 'tri-parent');
      subMenuContainer.append(triParentDiv);

      // Move and transform the hierarchy list
      // Use innerHTML to preserve nested structure
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      const hierarchyRoot = tempDiv.querySelector('ul');

      if (hierarchyRoot) {
        // Apply classes to nested elements from ORIGINAL HTML
        hierarchyRoot.querySelectorAll('li').forEach(item => {
          item.classList.add('header-comp__wrapper--sub-menu-item', 'child-below');
          const itemLink = item.querySelector('a');
          if (itemLink) {
            itemLink.classList.add('text-decoration-none', 'text-dark-gray-100');
            const span = document.createElement('span');
            span.classList.add('sub-link-span');
            span.textContent = itemLink.textContent;
            itemLink.textContent = '';
            itemLink.prepend(span);
          }
        });
        hierarchyRoot.querySelectorAll('ul').forEach(ul => {
          ul.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
        });

        // Move instrumentation for the hierarchy cell
        moveInstrumentation(hierarchyCell, tempDiv);

        while (hierarchyRoot.firstChild) {
          triParentDiv.append(hierarchyRoot.firstChild);
        }
        transformNestedLists(triParentDiv);
      }

      subMenusDiv.append(subMenuContainer);
      li.append(menuLinkDiv, subMenusDiv);

      // Toggle functionality for dropdown
      menuLinkDiv.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active'); // This class is not in the allowlist. It should be defined in the original HTML or removed.
        subMenusDiv.classList.toggle('show'); // This class is not in the allowlist. It should be defined in the original HTML or removed.
        menuLinkDiv.classList.toggle('collapsed');
      });
    } else {
      li.classList.add('right-division');
      li.append(menuLinkDiv);
    }
    navUl.append(li);
  });

  // Search and access
  const searchAccessDiv = document.createElement('div');
  searchAccessDiv.classList.add('header-comp__wrapper--search-access', 'd-flex', 'py-4', 'py-lg-0');

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('header-comp__wrapper--search');
  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('header-comp__wrapper--search-icon', 'd-flex', 'flex-column', 'align-items-center', 'font-12', 'leading-20', 'text-white');
  const searchImg = document.createElement('img');
  searchImg.alt = 'svg file';
  searchImg.src = '/icons/search-icon.svg'; // Placeholder for search icon
  const searchSpan = document.createElement('span');
  searchSpan.classList.add('d-none', 'd-lg-block');
  searchSpan.textContent = 'Search';
  searchIconDiv.append(searchImg, searchSpan);
  searchDiv.append(searchIconDiv);
  searchAccessDiv.append(searchDiv);
  containerDiv.append(searchAccessDiv);

  // Add event listener for search icon to toggle global search
  const globalSearchSection = document.querySelector('.global-search');
  if (globalSearchSection) {
    searchIconDiv.addEventListener('click', () => {
      globalSearchSection.classList.toggle('d-none');
    });

    // Add event listener for the cross icon to close global search
    const crossWrap = globalSearchSection.querySelector('.cross-wrap');
    if (crossWrap) {
      crossWrap.addEventListener('click', () => {
        globalSearchSection.classList.add('d-none');
      });
    }
  }

  // Outer box for mobile
  const outerBox = document.createElement('div');
  outerBox.classList.add('header__outer-box', 'position-absolute', 'w-100', 'z-2', 'start-0', 'd-lg-none');
  headerSection.append(outerBox);

  // Replace block content
  moveInstrumentation(block, headerSection);
  block.replaceWith(headerSection);

  // Optimize images
  headerSection.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
