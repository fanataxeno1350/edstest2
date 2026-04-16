import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
  const subMenuDiv = document.createElement('div');
  subMenuDiv.classList.add('header-comp__sub-menu', 'tri-parent');
  moveInstrumentation(rootUl, subMenuDiv); // Move instrumentation from original ul to new div

  [...rootUl.children].forEach((li) => {
    li.classList.add('header-comp__wrapper--sub-menu-item');
    moveInstrumentation(li, li); // Ensure li has instrumentation

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
      li.classList.add('child-below'); // Add class for items with nested children
      const subWrap = document.createElement('div');
      subWrap.classList.add('d-lg-none', 'inner-childs'); // Classes from ORIGINAL HTML for inner-childs
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('show'); // Use 'show' class from ORIGINAL HTML
        });
      }
      transformNestedLists(nested); // Recursively transform nested lists
    } else {
      li.classList.add('no-child'); // Add class for items without nested children
    }
    subMenuDiv.append(li);
  });

  // Append the transformed structure back to the original rootUl
  while (rootUl.firstChild) {
    rootUl.firstChild.remove();
  }
  rootUl.append(subMenuDiv);
}

export default function decorate(block) {
  const [logoRow, logoLinkRow, ...itemRows] = [...block.children];

  block.innerHTML = '';
  block.classList.add('bg-red-100', 'position-fixed', 'top-0', 'start-0', 'z-2', 'w-100');

  const container = document.createElement('div');
  container.classList.add(
    'container',
    'gx-8',
    'gx-sm-0',
    'd-flex',
    'justify-content-between',
    'align-items-start',
    'align-items-md-center',
  );
  block.append(container);

  const nav = document.createElement('nav');
  nav.classList.add('header-nav', 'navbar', 'position-static', 'navbar-expand-lg');
  container.append(nav);

  const navWrapper = document.createElement('div');
  navWrapper.classList.add(
    'header-comp__wrapper',
    'container-fluid',
    'justify-content-start',
    'gx-4',
    'gx-md-0',
  );
  nav.append(navWrapper);

  const hamburger = document.createElement('button');
  hamburger.classList.add(
    'border-0',
    'shadow-none',
    'navbar-toggler',
    'header-comp__wrapper--hamburger',
    'collapsed',
    'p-0',
  );
  hamburger.type = 'button';
  hamburger.setAttribute('aria-controls', 'navbarSupportedContent');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Toggle navigation');

  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add(
    'navbar-toggler-icon',
    'd-flex',
    'flex-column',
    'justify-content-center',
    'align-items-center',
  );
  hamburger.append(hamburgerIcon);

  for (let i = 0; i < 3; i += 1) {
    const span = document.createElement('span');
    span.classList.add('d-block', 'bg-white');
    hamburgerIcon.append(span);
  }
  navWrapper.append(hamburger);

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('header-comp__wrapper--logo');
  navWrapper.append(logoWrapper);

  const logoLink = document.createElement('a');
  logoLink.classList.add(
    'header-comp__wrapper--link',
    'cta-analytics',
    'navbar-brand',
    'm-0',
  );
  logoLink.setAttribute('data-link-region', 'Header');
  logoLink.href = logoLinkRow.querySelector('a')?.href || '#';
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '750' }]);
    const newImg = optimizedPic.querySelector('img');
    newImg.classList.add('header-comp__wrapper--image', 'h-100');
    newImg.loading = 'eager';
    moveInstrumentation(logoImg, newImg);
    logoLink.append(optimizedPic);
  }
  logoWrapper.append(logoLink);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('header-comp__wrapper--menus', 'collapse', 'navbar-collapse', 'z-3');
  navbarCollapse.id = 'navbarSupportedContent';
  navWrapper.append(navbarCollapse);

  const menuList = document.createElement('ul');
  menuList.classList.add(
    'header-comp__wrapper--menus-groups',
    'navbar-nav',
    'me-auto',
    'mb-2',
    'mb-lg-0',
    'w-100',
  );
  navbarCollapse.append(menuList);

  hamburger.addEventListener('click', () => {
    navbarCollapse.classList.toggle('show');
    hamburger.classList.toggle('collapsed');
  });

  itemRows.forEach((row, index) => {
    const cells = [...row.children];
    const li = document.createElement('li');
    li.classList.add(
      'header-comp__wrapper--menu-item',
      'h-100',
      'd-flex',
      'align-items-center',
      'nav-item',
      'p-4',
      'p-lg-0',
      'border-bottom-lg-0',
      'border-lg-0',
      'position-relative',
    );
    moveInstrumentation(row, li);

    if (cells.length === 4) {
      // navigation-item
      const [iconCell, labelCell, linkCell, hierarchyCell] = cells;
      li.classList.add('dropdown', 'flex-column', 'show-nav');
      if (index % 2 === 0) {
        li.classList.add('left-division');
      } else {
        li.classList.add('right-division');
      }

      const menuLinkDiv = document.createElement('div');
      menuLinkDiv.classList.add(
        'header-comp__wrapper--menu-link',
        'gap-6',
        'gap-lg-1',
        'position-relative',
        'w-100',
        'd-flex',
        'align-items-center',
        'nav-link',
        'px-0',
        'font-default',
        'leading-28',
        'leading-lg-26',
        'text-header-list',
        'text-lg-cream-100',
      );
      menuLinkDiv.setAttribute('aria-current', 'page');
      menuLinkDiv.setAttribute('aria-expanded', 'false');
      li.append(menuLinkDiv);

      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const iconImg = iconPicture.querySelector('img');
        const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '50' }]);
        const newImg = optimizedPic.querySelector('img');
        newImg.classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
        newImg.loading = 'eager';
        moveInstrumentation(iconImg, newImg);
        menuLinkDiv.append(optimizedPic);
      }

      const anchor = document.createElement('a');
      anchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
      anchor.setAttribute('data-link-region', 'Header');
      anchor.href = linkCell.querySelector('a')?.href || '#';
      moveInstrumentation(linkCell, anchor);

      const spanLink = document.createElement('span');
      spanLink.classList.add('link-span');
      spanLink.textContent = labelCell.textContent.trim();
      anchor.append(spanLink);
      menuLinkDiv.append(anchor);

      const hierarchyRoot = hierarchyCell?.querySelector('ul');
      if (hierarchyRoot) {
        menuLinkDiv.classList.add('dropdown-toggle');
        const toggleSpan = document.createElement('span');
        toggleSpan.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
        const arrowImg = document.createElement('img');
        arrowImg.alt = 'svg file';
        arrowImg.src = '/icons/arrow-down.svg'; // Placeholder, replace with actual icon path if available
        toggleSpan.append(arrowImg);
        menuLinkDiv.append(toggleSpan);

        const subMenusDiv = document.createElement('div');
        subMenusDiv.classList.add('header-comp__sub-menus');
        // Use innerHTML to preserve full hierarchy and then transform
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML;
        const tempUl = tempDiv.querySelector('ul');
        if (tempUl) {
          moveInstrumentation(hierarchyCell, tempUl); // Move instrumentation from original cell to the new ul
          transformNestedLists(tempUl);
          subMenusDiv.append(tempUl);
        }
        li.append(subMenusDiv);

        toggleSpan.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('show-nav');
          subMenusDiv.classList.toggle('show');
          menuLinkDiv.setAttribute('aria-expanded', subMenusDiv.classList.contains('show'));
        });
      }
    } else if (cells.length === 3) {
      // sub-menu-item
      const [labelCell, linkCell, hierarchyCell] = cells;

      const menuLinkDiv = document.createElement('div');
      menuLinkDiv.classList.add(
        'header-comp__wrapper--menu-link',
        'mb-3',
        'mb-lg-0',
        'gap-4',
        'position-relative',
        'w-100',
        'd-flex',
        'align-items-center',
        'nav-link',
        'px-0',
        'font-18',
        'leading-24',
        'text-header-list',
        'text-lg-black',
      );
      menuLinkDiv.setAttribute('aria-current', 'page');
      menuLinkDiv.setAttribute('aria-expanded', 'false');
      li.append(menuLinkDiv);

      const subMenuLinkDiv = document.createElement('div');
      subMenuLinkDiv.classList.add(
        'header-comp__wrapper--sub-menu-link',
        'dropdown-item',
        'p-lg-3',
        'mb-lg-3',
        'mb-xl-3',
        'leading-lg-24',
        'leading-xl-24',
        'font-default',
        'font-lg-18',
        'leading-lg-26',
        'leading-28',
        'ps-0',
        'p-0',
        'p-lg-3',
        'd-inline-block',
        'd-lg-flex',
        'justify-content-between',
        'align-items-center',
      );
      menuLinkDiv.append(subMenuLinkDiv);

      const anchor = document.createElement('a');
      anchor.classList.add('text-decoration-none', 'text-dark-gray-100');
      anchor.href = linkCell.querySelector('a')?.href || '#';
      moveInstrumentation(linkCell, anchor);

      const spanLink = document.createElement('span');
      spanLink.classList.add('sub-link-span');
      spanLink.textContent = labelCell.textContent.trim();
      anchor.append(spanLink);
      subMenuLinkDiv.append(anchor);

      const hierarchyRoot = hierarchyCell?.querySelector('ul');
      if (hierarchyRoot) {
        menuLinkDiv.classList.add('dropdown-toggle');
        li.classList.add('child-below');
        const arrowIconRight = document.createElement('span');
        arrowIconRight.classList.add('arrow-icon-right', 'end-0', 'd-none', 'd-lg-inline');
        const arrowImgRight = document.createElement('img');
        arrowImgRight.alt = 'svg file';
        arrowImgRight.src = '/icons/arrow-right.svg'; // Placeholder
        arrowIconRight.append(arrowImgRight);
        subMenuLinkDiv.append(arrowIconRight);

        const arrowIcon = document.createElement('span');
        arrowIcon.classList.add('arrow-icon', 'd-lg-none', 'end-0');
        const arrowImg = document.createElement('img');
        arrowImg.alt = 'svg file';
        arrowImg.src = '/icons/arrow-down.svg'; // Placeholder
        arrowIcon.append(arrowImg);
        menuLinkDiv.append(arrowIcon);

        const innerChildsDiv = document.createElement('div');
        innerChildsDiv.classList.add('d-lg-none', 'inner-childs');
        // Use innerHTML to preserve full hierarchy and then transform
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML;
        const tempUl = tempDiv.querySelector('ul');
        if (tempUl) {
          moveInstrumentation(hierarchyCell, tempUl); // Move instrumentation from original cell to the new ul
          transformNestedLists(tempUl);
          innerChildsDiv.append(tempUl);
        }
        li.append(innerChildsDiv);

        menuLinkDiv.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          innerChildsDiv.classList.toggle('show');
          menuLinkDiv.setAttribute('aria-expanded', innerChildsDiv.classList.contains('show'));
        });
      } else {
        li.classList.add('no-child');
      }
    }
    menuList.append(li);
  });

  const searchAccessDiv = document.createElement('div');
  searchAccessDiv.classList.add(
    'header-comp__wrapper--search-access',
    'd-flex',
    'py-4',
    'py-lg-0',
  );
  container.append(searchAccessDiv);

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('header-comp__wrapper--search');
  searchAccessDiv.append(searchDiv);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add(
    'header-comp__wrapper--search-icon',
    'd-flex',
    'flex-column',
    'align-items-center',
    'font-12',
    'leading-20',
    'text-white',
  );
  searchDiv.append(searchIconDiv);

  const searchImg = document.createElement('img');
  searchImg.alt = 'svg file';
  searchImg.src = '/icons/search.svg'; // Placeholder
  searchIconDiv.append(searchImg);

  const searchSpan = document.createElement('span');
  searchSpan.classList.add('d-none', 'd-lg-block');
  searchSpan.textContent = 'Search';
  searchIconDiv.append(searchSpan);

  const outerBox = document.createElement('div');
  outerBox.classList.add('header__outer-box', 'position-absolute', 'w-100', 'z-2', 'start-0', 'd-lg-none');
  block.append(outerBox);

  // Global search functionality
  const globalSearchSection = document.createElement('section');
  globalSearchSection.classList.add('global-search', 'position-fixed', 'w-100', 'd-none');
  const globalDiv = document.querySelector('.global');
  if (globalDiv) {
    globalDiv.append(globalSearchSection);
  } else {
    block.after(globalSearchSection);
  }

  const globalSearchWrapper = document.createElement('div');
  globalSearchWrapper.classList.add(
    'w-100',
    'z-4',
    'global-search__wrapper',
    'pb-md-5',
    'pb-lg-6',
    'pt-lg-0',
    'pt-md-0',
    'pt-2',
    'pb-2',
  );
  globalSearchSection.append(globalSearchWrapper);

  const globalSearchFlex = document.createElement('div');
  globalSearchFlex.classList.add('d-flex', 'justify-content-center', 'h-100');
  globalSearchWrapper.append(globalSearchFlex);

  const crossWrapDiv = document.createElement('div');
  crossWrapDiv.classList.add('d-lg-block', 'align-items-center', 'd-flex');
  globalSearchFlex.append(crossWrapDiv);

  const crossWrapInner = document.createElement('div');
  crossWrapInner.classList.add('cross-wrap', 'd-flex', 'justify-content-center', 'align-items-center');
  crossWrapDiv.append(crossWrapInner);

  const crossImg = document.createElement('img');
  crossImg.alt = 'svg file';
  crossImg.src = '/icons/cross.svg'; // Placeholder
  crossWrapInner.append(crossImg);

  const searchFormDiv = document.createElement('div');
  searchFormDiv.classList.add(
    'global-search__wrapper--form',
    'd-flex',
    'align-items-center',
    'justify-content-center',
  );
  globalSearchFlex.append(searchFormDiv);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.classList.add(
    'global-search__wrapper--form-input',
    'pb-1',
    'pb-md-1',
    'pb-lg-3',
    'px-lg-4',
  );
  searchInput.placeholder = 'Start typing...';
  searchInput.setAttribute('data-path', '/content/svasti/in/en');
  searchInput.setAttribute('data-limit', '5');
  searchInput.setAttribute(
    'data-error',
    '<p><b>Sorry, we cannot find what you are looking for :(</b></p><p>&nbsp;</p><p>Please try a new search term or browse through one of our product categories.</p>',
  );
  searchFormDiv.append(searchInput);

  const searchWrapDiv = document.createElement('div');
  searchWrapDiv.classList.add('d-lg-block', 'align-items-center', 'd-flex');
  globalSearchFlex.append(searchWrapDiv);

  const searchWrapInner = document.createElement('div');
  searchWrapInner.classList.add('search-wrap', 'd-flex', 'justify-content-center', 'align-items-center');
  searchWrapDiv.append(searchWrapInner);

  const searchIconImg = document.createElement('img');
  searchIconImg.alt = 'svg file';
  searchIconImg.src = '/icons/search.svg'; // Placeholder
  searchWrapInner.append(searchIconImg);

  const globalSearchResponse = document.createElement('div');
  globalSearchResponse.classList.add(
    'd-flex',
    'justify-content-center',
    'w-100',
    'close-on-click',
  );
  globalSearchSection.append(globalSearchResponse);

  const globalSearchResults = document.createElement('div');
  globalSearchResults.classList.add(
    'global-search__response',
    'd-flex',
    'justify-content-start',
    'z-4',
    'bg-transparent',
  );
  globalSearchResponse.append(globalSearchResults);

  const resultsList = document.createElement('ul');
  resultsList.classList.add(
    'global-search__response--results',
    'm-0',
    'w-100',
    'd-none',
    'pt-5',
    'pb-5',
    'px-9',
  );
  globalSearchResults.append(resultsList);

  searchIconDiv.addEventListener('click', () => {
    globalSearchSection.classList.remove('d-none');
  });

  crossWrapInner.addEventListener('click', () => {
    globalSearchSection.classList.add('d-none');
  });
}
