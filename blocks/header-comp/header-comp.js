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
      subWrap.classList.add('has-sub-child'); // Use class from original HTML if available
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
    }
  });
}

export default function decorate(block) {
  // Destructure root rows based on BlockJson model
  const [logoRow, logoLinkRow, ...itemRows] = [...block.children];

  // Create main header structure
  const headerComp = document.createElement('section');
  headerComp.classList.add('header-comp', 'bg-red-100', 'position-fixed', 'top-0', 'start-0', 'z-2', 'w-100');
  moveInstrumentation(block, headerComp);

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0', 'd-flex', 'justify-content-between', 'align-items-start', 'align-items-md-center');

  const nav = document.createElement('nav');
  nav.classList.add('header-nav', 'navbar', 'position-static', 'navbar-expand-lg');

  const wrapper = document.createElement('div');
  wrapper.classList.add('header-comp__wrapper', 'container-fluid', 'justify-content-start', 'gx-4', 'gx-md-0');

  // Hamburger button
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

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('header-comp__wrapper--logo');

  const logoLink = document.createElement('a');
  logoLink.classList.add('header-comp__wrapper--link', 'cta-analytics', 'navbar-brand', 'm-0');
  logoLink.setAttribute('data-link-region', 'Header');
  // Read logo-link from the second root row
  logoLink.href = logoLinkRow.querySelector('a')?.href || '#';

  // Read logo from the first root row
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    if (logoImg) {
      const optimizedLogo = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '100' }]);
      moveInstrumentation(logoImg, optimizedLogo.querySelector('img'));
      optimizedLogo.querySelector('img').classList.add('header-comp__wrapper--image', 'h-100');
      logoLink.append(optimizedLogo);
    }
  } else {
    // Fallback if no picture element is found
    const fallbackImg = document.createElement('img');
    fallbackImg.classList.add('header-comp__wrapper--image', 'h-100');
    fallbackImg.alt = 'Brand Logo';
    logoLink.append(fallbackImg);
  }
  logoDiv.append(logoLink);

  // Navigation menu
  const navMenuCollapse = document.createElement('div');
  navMenuCollapse.classList.add('header-comp__wrapper--menus', 'collapse', 'navbar-collapse', 'z-3');
  navMenuCollapse.id = 'navbarSupportedContent';

  const navList = document.createElement('ul');
  navList.classList.add('header-comp__wrapper--menus-groups', 'navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0', 'w-100');

  itemRows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 4) { // navigation-item
      // Destructure cells for navigation-item
      const [iconCell, labelCell, linkCell, hierarchyCell] = cells;

      const navItem = document.createElement('li');
      navItem.classList.add('header-comp__wrapper--menu-item', 'h-100', 'd-flex', 'align-items-center', 'nav-item', 'p-4', 'p-lg-0', 'border-bottom-lg-0', 'dropdown', 'flex-column', 'border-lg-0', 'show-nav', 'position-relative', 'left-division');

      const menuLinkDiv = document.createElement('div');
      menuLinkDiv.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');

      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const iconImg = iconPicture.querySelector('img');
        if (iconImg) {
          const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '30' }]);
          moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
          optimizedIcon.querySelector('img').classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
          menuLinkDiv.append(optimizedIcon);
        }
      }

      const linkAnchor = document.createElement('a');
      linkAnchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
      linkAnchor.setAttribute('data-link-region', 'Header');
      linkAnchor.href = linkCell.querySelector('a')?.href || '#';

      const linkSpan = document.createElement('span');
      linkSpan.classList.add('link-span');
      linkSpan.textContent = labelCell.textContent.trim();
      linkAnchor.append(linkSpan);
      menuLinkDiv.append(linkAnchor);

      // Handle hierarchy-tree richtext field
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML; // Read innerHTML to preserve structure
      const hierarchyRoot = tempDiv.querySelector('ul');

      if (hierarchyRoot) {
        menuLinkDiv.classList.add('dropdown-toggle');
        const toggleSpan = document.createElement('span');
        toggleSpan.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('header-icon', 'icon', 'accordion-arrow-down', 'text-dark-gray-100');
        const use = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/icons/sprite-e6cdd9.svg#accordion-arrow-down'); // Corrected sprite path
        svg.append(use);
        toggleSpan.append(svg);
        menuLinkDiv.append(toggleSpan);

        const subMenusDiv = document.createElement('div');
        subMenusDiv.classList.add('header-comp__sub-menus');
        const subMenuXFPage = document.createElement('div');
        subMenuXFPage.classList.add('xfpage', 'page', 'basicpage');
        const subMenuGrid = document.createElement('div');
        subMenuGrid.classList.add('aem-Grid', 'aem-Grid--12', 'aem-Grid--default--12');
        const subMenuHeaderDiv = document.createElement('div');
        subMenuHeaderDiv.classList.add('headerSubMenu', 'aem-GridColumn', 'aem-GridColumn--default--12');

        const subMenuGroup = document.createElement('ul');
        subMenuGroup.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
        const subMenuTriParent = document.createElement('div');
        subMenuTriParent.classList.add('header-comp__sub-menu', 'tri-parent');

        // Apply classes to nested elements from ORIGINAL HTML
        hierarchyRoot.querySelectorAll('li').forEach(li => {
          li.classList.add('header-comp__wrapper--sub-menu-item', 'child-below');
          const link = li.querySelector('a');
          if (link) {
            link.classList.add('text-decoration-none', 'text-dark-gray-100');
          }
        });
        hierarchyRoot.querySelectorAll('ul').forEach(ul => {
          ul.classList.add('inner-childs');
        });

        // Transform nested lists
        transformNestedLists(hierarchyRoot);

        // Append processed hierarchyRoot children to subMenuTriParent
        while (hierarchyRoot.firstChild) {
          const child = hierarchyRoot.firstChild;
          moveInstrumentation(hierarchyCell, child); // Instrument before moving
          subMenuTriParent.append(child);
        }

        subMenuGroup.append(subMenuTriParent);
        subMenuHeaderDiv.append(subMenuGroup);
        subMenuGrid.append(subMenuHeaderDiv);
        subMenuXFPage.append(subMenuGrid);
        subMenusDiv.append(subMenuXFPage);
        navItem.append(subMenusDiv);

        menuLinkDiv.addEventListener('click', () => {
          navItem.classList.toggle('show-nav');
          subMenusDiv.classList.toggle('show'); // Use 'show' class for visibility
          menuLinkDiv.classList.toggle('collapsed');
          menuLinkDiv.setAttribute('aria-expanded', navItem.classList.contains('show-nav'));
        });
      }

      navItem.prepend(menuLinkDiv);
      navList.append(navItem);
    } else if (cells.length === 2) { // sub-navigation-item (flat link)
      // Destructure cells for sub-navigation-item
      const [labelCell, linkCell] = cells;

      const navItem = document.createElement('li');
      navItem.classList.add('header-comp__wrapper--menu-item', 'h-100', 'd-flex', 'align-items-center', 'nav-item', 'p-4', 'p-lg-0', 'border-bottom-lg-0', 'left-division');

      const menuLinkDiv = document.createElement('div');
      menuLinkDiv.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');

      const linkAnchor = document.createElement('a');
      linkAnchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
      linkAnchor.setAttribute('data-link-region', 'Header');
      linkAnchor.href = linkCell.querySelector('a')?.href || '#';

      const linkSpan = document.createElement('span');
      linkSpan.classList.add('link-span');
      linkSpan.textContent = labelCell.textContent.trim();
      linkAnchor.append(linkSpan);
      menuLinkDiv.append(linkAnchor);

      navItem.append(menuLinkDiv);
      navList.append(navItem);
    }
  });

  navMenuCollapse.append(navList);

  // Search and access section
  const searchAccessDiv = document.createElement('div');
  searchAccessDiv.classList.add('header-comp__wrapper--search-access', 'd-flex', 'py-4', 'py-lg-0');

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('header-comp__wrapper--search');

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('header-comp__wrapper--search-icon', 'd-flex', 'flex-column', 'align-items-center', 'font-12', 'leading-20', 'text-white');

  const searchSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  searchSvg.classList.add('icon', 'search-red', 'text-white');
  const searchUse = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/icons/sprite-1f1f4c.svg#search'); // Corrected sprite path
  searchSvg.append(searchUse);

  const searchSpan = document.createElement('span');
  searchSpan.classList.add('d-none', 'd-lg-block');
  searchSpan.textContent = 'Search';

  searchIconDiv.append(searchSvg, searchSpan);
  searchDiv.append(searchIconDiv);
  searchAccessDiv.append(searchDiv);

  hamburgerButton.addEventListener('click', () => {
    navMenuCollapse.classList.toggle('show');
    hamburgerButton.classList.toggle('collapsed');
    hamburgerButton.setAttribute('aria-expanded', navMenuCollapse.classList.contains('show'));
  });

  wrapper.append(hamburgerButton, logoDiv, navMenuCollapse);
  nav.append(wrapper);
  container.append(nav, searchAccessDiv);
  headerComp.append(container);

  const outerBox = document.createElement('div');
  outerBox.classList.add('header__outer-box', 'position-absolute', 'w-100', 'z-2', 'start-0', 'd-lg-none');
  headerComp.append(outerBox);

  block.innerHTML = '';
  block.append(headerComp);

  // Global search (if present in original HTML)
  const globalSearch = document.createElement('section');
  globalSearch.classList.add('global-search', 'position-fixed', 'w-100', 'd-none'); // Initially hidden

  const globalSearchWrapper = document.createElement('div');
  globalSearchWrapper.classList.add('w-100', 'z-4', 'global-search__wrapper', 'pb-md-5', 'pb-lg-6', 'pt-lg-0', 'pt-md-0', 'pt-2', 'pb-2');
  const globalSearchFlex = document.createElement('div');
  globalSearchFlex.classList.add('d-flex', 'justify-content-center', 'h-100');

  const crossWrap = document.createElement('div');
  crossWrap.classList.add('d-lg-block', 'align-items-center', 'd-flex');
  const crossInnerWrap = document.createElement('div');
  crossInnerWrap.classList.add('cross-wrap', 'd-flex', 'justify-content-center', 'align-items-center');
  const crossSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  crossSvg.classList.add('global-search__wrapper--cross', 'display-inline-block', 'text-black', 'text-white', 'm-0');
  const crossUse = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/icons/sprite-1f1f4c.svg#cross'); // Corrected sprite path
  crossSvg.append(crossUse);
  crossInnerWrap.append(crossSvg);
  crossWrap.append(crossInnerWrap);

  const searchForm = document.createElement('div');
  searchForm.classList.add('global-search__wrapper--form', 'd-flex', 'align-items-center', 'justify-content-center');
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.classList.add('global-search__wrapper--form-input', 'pb-1', 'pb-md-1', 'pb-lg-3', 'px-lg-4');
  searchInput.placeholder = 'Start typing...';
  searchForm.append(searchInput);

  const searchBtnWrap = document.createElement('div');
  searchBtnWrap.classList.add('d-lg-block', 'align-items-center', 'd-flex');
  const searchBtnInnerWrap = document='div';
  searchBtnInnerWrap.classList.add('search-wrap', 'd-flex', 'justify-content-center', 'align-items-center');
  const searchBtnSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  searchBtnSvg.classList.add('global-search__wrapper--search', 'display-inline-block', 'text-white', 'm-0');
  const searchBtnUse = document.createElementNS('http://www.w3.org/1999/xlink', 'xlink:href', '/icons/sprite-1f1f4c.svg#search'); // Corrected sprite path
  searchBtnSvg.append(searchBtnUse);
  searchBtnInnerWrap.append(searchBtnSvg);
  searchBtnWrap.append(searchBtnInnerWrap);

  globalSearchFlex.append(crossWrap, searchForm, searchBtnWrap);
  globalSearchWrapper.append(globalSearchFlex);
  globalSearch.append(globalSearchWrapper);

  const globalSearchResponse = document.createElement('div');
  globalSearchResponse.classList.add('d-flex', 'justify-content-center', 'w-100', 'close-on-click');
  const globalSearchResponseInner = document.createElement('div');
  globalSearchResponseInner.classList.add('global-search__response', 'd-flex', 'justify-content-start', 'z-4', 'bg-transparent');
  const globalSearchResults = document.createElement('ul');
  globalSearchResults.classList.add('global-search__response--results', 'm-0', 'w-100', 'd-none', 'pt-5', 'pb-5', 'px-9');
  globalSearchResponseInner.append(globalSearchResults);
  globalSearchResponse.append(globalSearchResponseInner);
  globalSearch.append(globalSearchResponse);

  // Add event listener for search icon to toggle global search
  searchIconDiv.addEventListener('click', () => {
    globalSearch.classList.toggle('d-none');
  });

  crossInnerWrap.addEventListener('click', () => {
    globalSearch.classList.add('d-none');
  });

  block.parentNode.insertBefore(globalSearch, block.nextSibling);

  // Image optimization for all pictures in the header
  headerComp.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
