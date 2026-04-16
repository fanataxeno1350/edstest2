import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [logoRow, logoLinkRow, ...itemRows] = children;

  // Use content detection for item rows based on the BlockJson model and structure
  const navigationItems = itemRows.filter((row) => row.children.length === 5); // icon, label, link, hierarchy-tree, sub-menu-items
  const searchIcons = itemRows.filter((row) => row.children.length === 2); // icon, label
  const globalSearchIcons = itemRows.filter(
    (row) => row.children.length === 1,
  ); // icon

  block.classList.add(
    'bg-red-100',
    'position-fixed',
    'top-0',
    'start-0',
    'z-2',
    'w-100',
  );

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

  // --- Logo and Logo Link ---
  const headerNav = document.createElement('nav');
  headerNav.classList.add(
    'header-nav',
    'navbar',
    'position-static',
    'navbar-expand-lg',
  );

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add(
    'header-comp__wrapper',
    'container-fluid',
    'justify-content-start',
    'gx-4',
    'gx-md-0',
  );

  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add(
    'border-0',
    'shadow-none',
    'navbar-toggler',
    'header-comp__wrapper--hamburger',
    'collapsed',
    'p-0',
  );
  hamburgerButton.type = 'button';
  hamburgerButton.setAttribute('aria-controls', 'navbarSupportedContent');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  hamburgerButton.setAttribute('aria-label', 'Toggle navigation');

  const togglerIcon = document.createElement('span');
  togglerIcon.classList.add(
    'navbar-toggler-icon',
    'd-flex',
    'flex-column',
    'justify-content-center',
    'align-items-center',
  );
  for (let i = 0; i < 3; i += 1) {
    const span = document.createElement('span');
    span.classList.add('d-block', 'bg-white');
    togglerIcon.appendChild(span);
  }
  hamburgerButton.appendChild(togglerIcon);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('header-comp__wrapper--logo');

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  logoLink.classList.add(
    'header-comp__wrapper--link',
    'cta-analytics',
    'navbar-brand',
    'm-0',
  );
  logoLink.setAttribute('data-link-region', 'Header');

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
      { width: '750' },
    ]);
    optimizedPic
      .querySelector('img')
      .classList.add('header-comp__wrapper--image', 'h-100');
    moveInstrumentation(logoPicture, optimizedPic);
    logoLink.appendChild(optimizedPic);
  }
  logoDiv.appendChild(logoLink);

  // --- Navigation Menu ---
  const navMenus = document.createElement('div');
  navMenus.classList.add(
    'header-comp__wrapper--menus',
    'collapse',
    'navbar-collapse',
    'z-3',
  );
  navMenus.id = 'navbarSupportedContent';

  const navUl = document.createElement('ul');
  navUl.classList.add(
    'header-comp__wrapper--menus-groups',
    'navbar-nav',
    'me-auto',
    'mb-2',
    'mb-lg-0',
    'w-100',
  );

  function transformNestedLists(rootElement) {
    // Create a temporary div to parse the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rootElement.innerHTML;
    moveInstrumentation(rootElement, tempDiv); // Move instrumentation from original cell to tempDiv

    tempDiv.querySelectorAll('li').forEach((li) => {
      const nestedUl = li.querySelector(':scope > ul');
      const anchor = li.querySelector(':scope > a');

      // Apply classes from ORIGINAL HTML to <li>, <a>, <ul>
      li.classList.add('header-comp__wrapper--sub-menu-item');
      if (!nestedUl) {
        li.classList.add('no-child');
      } else {
        li.classList.add('child-below');
      }

      if (anchor) {
        anchor.classList.add('text-decoration-none', 'text-dark-gray-100');
        const span = document.createElement('span');
        span.classList.add('sub-link-span');
        span.textContent = anchor.textContent.trim();
        anchor.innerHTML = ''; // Clear original content
        anchor.appendChild(span);
      }

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

      if (anchor) {
        subMenuLinkDiv.appendChild(anchor);
      } else {
        // If no anchor, but text content, create a span
        const textNode = [...li.childNodes].find(
          (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
        );
        if (textNode) {
          const span = document.createElement('span');
          span.classList.add('sub-link-span');
          span.textContent = textNode.textContent.trim();
          textNode.remove();
          subMenuLinkDiv.appendChild(span);
        }
      }

      menuLinkDiv.appendChild(subMenuLinkDiv);

      if (nestedUl) {
        menuLinkDiv.classList.add('dropdown-toggle');
        menuLinkDiv.setAttribute('aria-expanded', 'false');

        const arrowIcon = document.createElement('span');
        arrowIcon.classList.add('arrow-icon', 'd-lg-none', 'end-0');
        const arrowImg = document.createElement('img');
        arrowImg.alt = 'svg file';
        arrowImg.src = '/icons/arrow-icon.svg'; // Placeholder for actual SVG path
        arrowIcon.appendChild(arrowImg);
        menuLinkDiv.appendChild(arrowIcon);

        const arrowIconRight = document.createElement('span');
        arrowIconRight.classList.add('arrow-icon-right', 'end-0', 'd-none', 'd-lg-inline');
        const arrowImgRight = document.createElement('img');
        arrowImgRight.alt = 'svg file';
        arrowImgRight.src = '/icons/arrow-icon.svg'; // Placeholder for actual SVG path
        arrowIconRight.appendChild(arrowImgRight);
        subMenuLinkDiv.appendChild(arrowIconRight);

        nestedUl.remove(); // Remove original nested UL
        const subWrap = document.createElement('div');
        subWrap.classList.add('inner-childs', 'd-lg-none');
        subWrap.appendChild(nestedUl); // Append the original nested UL to the new wrapper
        li.appendChild(subWrap);

        arrowIcon.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('child-below--open');
          subWrap.classList.toggle('active');
          menuLinkDiv.setAttribute(
            'aria-expanded',
            li.classList.contains('child-below--open').toString(),
          );
        });
      }

      // Prepend the constructed menuLinkDiv to the li, before any nested ULs
      li.prepend(menuLinkDiv);
    });

    // Move all children from tempDiv back to the original rootElement
    rootElement.innerHTML = ''; // Clear original content
    while (tempDiv.firstChild) {
      rootElement.appendChild(tempDiv.firstChild);
    }
  }

  navigationItems.forEach((row, index) => {
    const cells = [...row.children];
    // Use content detection to find cells, as per CHECK 0 and BlockJson
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim());
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));
    // const subMenuItemsCell = cells.find(cell => cell.textContent.includes('Sub Menu Items')); // Not directly used for content, but for structure

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
      'dropdown',
      'border-lg-0',
      'position-relative',
    );
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

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
        { width: '750' },
      ]);
      optimizedPic
        .querySelector('img')
        .classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
      moveInstrumentation(iconPicture, optimizedPic);
      menuLinkDiv.appendChild(optimizedPic);
    }

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.classList.add(
      'text-decoration-none',
      'cta-analytics',
      'header-comp__wrapper--link',
    );
    anchor.setAttribute('data-link-region', 'Header');

    const spanLink = document.createElement('span');
    spanLink.classList.add('link-span');
    spanLink.textContent = labelCell?.textContent.trim() || '';
    anchor.appendChild(spanLink);
    menuLinkDiv.appendChild(anchor);

    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      menuLinkDiv.classList.add('dropdown-toggle');
      menuLinkDiv.setAttribute('aria-expanded', 'false');

      const toggleDropDown = document.createElement('span');
      toggleDropDown.classList.add('toggle-drop-down', 'arrow-icon', 'end-0', 'top-parent');
      const arrowImg = document.createElement('img');
      arrowImg.alt = 'svg file';
      arrowImg.src = '/icons/arrow-icon.svg'; // Placeholder for actual SVG path
      toggleDropDown.appendChild(arrowImg);
      menuLinkDiv.appendChild(toggleDropDown);

      const subMenusDiv = document.createElement('div');
      subMenusDiv.classList.add('header-comp__sub-menus');

      const subMenuUl = document.createElement('ul');
      subMenuUl.classList.add(
        'header-comp__wrapper--sub-menu-group',
        'w-auto',
        'border-0',
        'pb-lg-0',
        'dropdown-menu',
        'p-0',
      );
      const subMenuContainer = document.createElement('div');
      subMenuContainer.classList.add('header-comp__sub-menu', 'tri-parent');

      // Apply transformations to the hierarchyRoot (which is a <ul> element)
      transformNestedLists(hierarchyRoot);

      subMenuContainer.appendChild(hierarchyRoot);
      subMenuUl.appendChild(subMenuContainer);
      subMenusDiv.appendChild(subMenuUl);

      li.appendChild(menuLinkDiv);
      li.appendChild(subMenusDiv);

      toggleDropDown.addEventListener('click', () => {
        li.classList.toggle('show-nav');
        menuLinkDiv.classList.toggle('collapsed');
        menuLinkDiv.setAttribute(
          'aria-expanded',
          li.classList.contains('show-nav').toString(),
        );
      });
    } else {
      li.appendChild(menuLinkDiv);
    }

    navUl.appendChild(li);
  });

  navMenus.appendChild(navUl);

  // --- Search Access ---
  const searchAccessDiv = document.createElement('div');
  searchAccessDiv.classList.add(
    'header-comp__wrapper--search-access',
    'd-flex',
    'py-4',
    'py-lg-0',
  );

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('header-comp__wrapper--search');

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

  searchIcons.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const labelCell = cells.find(cell => !cell.querySelector('picture'));

    const picture = iconCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
        { width: '750' },
      ]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      searchIconDiv.appendChild(optimizedPic);
    }

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('d-none', 'd-lg-block');
    labelSpan.textContent = labelCell?.textContent.trim() || '';
    searchIconDiv.appendChild(labelSpan);
  });

  searchDiv.appendChild(searchIconDiv);
  searchAccessDiv.appendChild(searchDiv);

  // --- Global Search ---
  const globalSearchSection = document.createElement('section');
  globalSearchSection.classList.add(
    'global-search',
    'position-fixed',
    'w-100',
    'd-none',
  );

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

  const globalSearchInner = document.createElement('div');
  globalSearchInner.classList.add(
    'd-flex',
    'justify-content-center',
    'h-100',
  );

  const crossWrapDiv = document.createElement('div');
  crossWrapDiv.classList.add(
    'd-lg-block',
    'align-items-center',
    'd-flex',
  );
  const crossWrapInner = document.createElement('div');
  crossWrapInner.classList.add(
    'cross-wrap',
    'd-flex',
    'justify-content-center',
    'align-items-center',
  );
  const crossImg = document.createElement('img');
  crossImg.alt = 'svg file';
  crossImg.src = '/icons/cross.svg'; // Placeholder for actual SVG path
  crossWrapInner.appendChild(crossImg);
  crossWrapDiv.appendChild(crossWrapInner);

  const formDiv = document.createElement('div');
  formDiv.classList.add(
    'global-search__wrapper--form',
    'd-flex',
    'align-items-center',
    'justify-content-center',
  );
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
  formDiv.appendChild(searchInput);

  const searchWrapDiv = document.createElement('div');
  searchWrapDiv.classList.add(
    'd-lg-block',
    'align-items-center',
    'd-flex',
  );
  const searchWrapInner = document.createElement('div');
  searchWrapInner.classList.add(
    'search-wrap',
    'd-flex',
    'justify-content-center',
    'align-items-center',
  );
  const searchImg = document.createElement('img');
  searchImg.alt = 'svg file';
  searchImg.src = '/icons/search.svg'; // Placeholder for actual SVG path
  searchWrapInner.appendChild(searchImg);
  searchWrapDiv.appendChild(searchWrapInner);

  globalSearchIcons.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));

    const picture = iconCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
        { width: '750' },
      ]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      // Replace the placeholder searchImg with the optimized one
      searchWrapInner.replaceChild(optimizedPic, searchImg);
    }
  });

  globalSearchInner.append(crossWrapDiv, formDiv, searchWrapDiv);
  globalSearchWrapper.appendChild(globalSearchInner);
  globalSearchSection.appendChild(globalSearchWrapper);

  const responseDiv = document.createElement('div');
  responseDiv.classList.add(
    'd-flex',
    'justify-content-center',
    'w-100',
    'close-on-click',
  );
  const responseInnerDiv = document.createElement('div');
  responseInnerDiv.classList.add(
    'global-search__response',
    'd-flex',
    'justify-content-start',
    'z-4',
    'bg-transparent',
  );
  const resultsUl = document.createElement('ul');
  resultsUl.classList.add(
    'global-search__response--results',
    'm-0',
    'w-100',
    'd-none',
    'pt-5',
    'pb-5',
    'px-9',
  );
  responseInnerDiv.appendChild(resultsUl);
  responseDiv.appendChild(responseInnerDiv);
  globalSearchSection.appendChild(responseDiv);

  // --- Append all elements to block ---
  headerWrapper.append(hamburgerButton, logoDiv, navMenus);
  headerNav.appendChild(headerWrapper);
  container.append(headerNav, searchAccessDiv);

  const outerBox = document.createElement('div');
  outerBox.classList.add(
    'header__outer-box',
    'position-absolute',
    'w-100',
    'z-2',
    'start-0',
    'd-lg-none',
  );

  block.innerHTML = '';
  block.append(container, outerBox, globalSearchSection);

  // --- Event Listeners ---
  hamburgerButton.addEventListener('click', () => {
    navMenus.classList.toggle('collapse');
    navMenus.classList.toggle('show');
    hamburgerButton.classList.toggle('collapsed');
    hamburgerButton.setAttribute(
      'aria-expanded',
      navMenus.classList.contains('show').toString(),
    );
    block.classList.toggle('active');
  });

  searchIconDiv.addEventListener('click', () => {
    globalSearchSection.classList.toggle('d-none');
  });

  crossWrapDiv.addEventListener('click', () => {
    globalSearchSection.classList.add('d-none');
  });

  responseDiv.addEventListener('click', (e) => {
    if (e.target === responseDiv) {
      globalSearchSection.classList.add('d-none');
    }
  });
}
