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
      subWrap.classList.add('header-comp__sub-menus'); // Use class from original HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('dropdown-toggle');
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('show-nav'); // Use class from original HTML
          subWrap.classList.toggle('show-nav'); // Use class from original HTML
        });
      }
    }
  });
}

export default function decorate(block) {
  const [logoRow, logoLinkRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('header-comp', 'bg-red-100', 'position-fixed', 'top-0', 'start-0', 'z-2', 'w-100');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0', 'd-flex', 'justify-content-between', 'align-items-start', 'align-items-md-center');
  section.append(container);

  const nav = document.createElement('nav');
  nav.classList.add('header-nav', 'navbar', 'position-static', 'navbar-expand-lg');
  container.append(nav);

  const navWrapper = document.createElement('div');
  navWrapper.classList.add('header-comp__wrapper', 'container-fluid', 'justify-content-start', 'gx-4', 'gx-md-0');
  nav.append(navWrapper);

  // Hamburger button
  const toggler = document.createElement('button');
  toggler.classList.add('border-0', 'shadow-none', 'navbar-toggler', 'header-comp__wrapper--hamburger', 'collapsed', 'p-0');
  toggler.type = 'button';
  toggler.setAttribute('aria-controls', 'navbarSupportedContent');
  toggler.setAttribute('aria-expanded', 'false');
  toggler.setAttribute('aria-label', 'Toggle navigation');

  const togglerIcon = document.createElement('span');
  togglerIcon.classList.add('navbar-toggler-icon', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center');
  for (let i = 0; i < 3; i += 1) {
    const span = document.createElement('span');
    span.classList.add('d-block', 'bg-white');
    togglerIcon.append(span);
  }
  toggler.append(togglerIcon);
  navWrapper.append(toggler);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('header-comp__wrapper--logo');
  navWrapper.append(logoDiv);

  const logoLink = document.createElement('a');
  logoLink.classList.add('header-comp__wrapper--link', 'cta-analytics', 'navbar-brand', 'm-0');
  logoLink.setAttribute('data-link-region', 'Header');
  logoLink.href = logoLinkRow.querySelector('a')?.href || '#';
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.querySelector('img').classList.add('header-comp__wrapper--image', 'h-100');
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoDiv.append(logoLink);

  // Navigation menus
  const navCollapse = document.createElement('div');
  navCollapse.classList.add('header-comp__wrapper--menus', 'collapse', 'navbar-collapse', 'z-3');
  navCollapse.id = 'navbarSupportedContent';
  navWrapper.append(navCollapse);

  const navList = document.createElement('ul');
  navList.classList.add('header-comp__wrapper--menus-groups', 'navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0', 'w-100');
  navCollapse.append(navList);

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 4) { // navigation-item
      const [iconCell, labelCell, linkCell, hierarchyCell] = cells;

      const li = document.createElement('li');
      li.classList.add('header-comp__wrapper--menu-item', 'h-100', 'd-flex', 'align-items-center', 'nav-item', 'p-4', 'p-lg-0', 'border-bottom-lg-0', 'dropdown', 'flex-column', 'border-lg-0', 'position-relative');
      moveInstrumentation(row, li);

      const menuLinkDiv = document.createElement('div');
      menuLinkDiv.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');
      li.append(menuLinkDiv);

      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        menuLinkDiv.append(optimizedPic);
      }

      const anchor = document.createElement('a');
      anchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
      anchor.setAttribute('data-link-region', 'Header');
      anchor.href = linkCell.querySelector('a')?.href || '#';

      const spanLink = document.createElement('span');
      spanLink.classList.add('link-span');
      spanLink.textContent = labelCell.textContent.trim();
      anchor.append(spanLink);
      menuLinkDiv.append(anchor);

      const hierarchyRoot = hierarchyCell.querySelector('ul');
      if (hierarchyRoot) {
        menuLinkDiv.classList.add('dropdown-toggle');
        menuLinkDiv.setAttribute('aria-expanded', 'false');

        const toggleSpan = document.createElement('span');
        toggleSpan.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
        toggleSpan.innerHTML = `
          <svg class="header-icon icon accordion-arrow-down text-dark-gray-100">
            <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-e6cdd9.svg#accordion-arrow-down"></use>
          </svg>
        `;
        menuLinkDiv.append(toggleSpan);

        const subMenusDiv = document.createElement('div');
        subMenusDiv.classList.add('header-comp__sub-menus');
        
        // Move instrumentation for the hierarchy cell's content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML;
        moveInstrumentation(hierarchyCell, tempDiv);

        // Apply classes to nested elements from ORIGINAL HTML
        tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0'));
        tempDiv.querySelectorAll('li').forEach(liItem => liItem.classList.add('header-comp__wrapper--sub-menu-item'));
        tempDiv.querySelectorAll('a').forEach(aItem => aItem.classList.add('text-decoration-none', 'text-dark-gray-100'));
        tempDiv.querySelectorAll('span.sub-link-span').forEach(span => span.classList.add('sub-link-span')); // Ensure this class is present if it was in original HTML

        while (tempDiv.firstChild) {
          subMenusDiv.append(tempDiv.firstChild);
        }

        li.append(subMenusDiv);
        transformNestedLists(hierarchyRoot); // This function will re-process the moved UL, applying more classes and event listeners

        menuLinkDiv.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('show-nav');
          subMenusDiv.classList.toggle('show-nav');
        });
      }
      navList.append(li);
    } else if (cells.length === 2) { // navigation-submenu-item (flat links)
      const [labelCell, linkCell] = cells;

      const li = document.createElement('li');
      li.classList.add('header-comp__wrapper--menu-item', 'h-100', 'd-flex', 'align-items-center', 'nav-item', 'p-4', 'p-lg-0', 'border-bottom-lg-0', 'position-relative');
      moveInstrumentation(row, li);

      const menuLinkDiv = document.createElement('div');
      menuLinkDiv.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');
      li.append(menuLinkDiv);

      const anchor = document.createElement('a');
      anchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
      anchor.setAttribute('data-link-region', 'Header');
      anchor.href = linkCell.querySelector('a')?.href || '#';

      const spanLink = document.createElement('span');
      spanLink.classList.add('link-span');
      spanLink.textContent = labelCell.textContent.trim();
      anchor.append(spanLink);
      menuLinkDiv.append(anchor);
      navList.append(li);
    }
  });

  // Search and access
  const searchAccessDiv = document.createElement('div');
  searchAccessDiv.classList.add('header-comp__wrapper--search-access', 'd-flex', 'py-4', 'py-lg-0');
  container.append(searchAccessDiv);

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('header-comp__wrapper--search');
  searchAccessDiv.append(searchDiv);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('header-comp__wrapper--search-icon', 'd-flex', 'flex-column', 'align-items-center', 'font-12', 'leading-20', 'text-white');
  searchIconDiv.innerHTML = `
    <svg class="icon search-red text-white">
      <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#search"></use>
    </svg>
    <span class="d-none d-lg-block">Search</span>
  `;
  searchDiv.append(searchIconDiv);

  // Add event listener for search icon
  searchIconDiv.addEventListener('click', () => {
    const globalSearch = document.querySelector('.global-search');
    if (globalSearch) {
      globalSearch.classList.toggle('d-none'); // Toggle visibility of the search overlay
    }
  });

  const outerBox = document.createElement('div');
  outerBox.classList.add('header__outer-box', 'position-absolute', 'w-100', 'z-2', 'start-0', 'd-lg-none');
  section.append(outerBox);

  block.replaceWith(section);

  // Toggle functionality for hamburger menu
  toggler.addEventListener('click', () => {
    navCollapse.classList.toggle('collapse');
    navCollapse.classList.toggle('show');
    toggler.classList.toggle('collapsed');
  });
}
