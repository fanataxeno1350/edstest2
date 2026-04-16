import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0'); // Added from ORIGINAL HTML
  const subMenuDiv = document.createElement('div');
  subMenuDiv.classList.add('header-comp__sub-menu', 'tri-parent');
  moveInstrumentation(rootUl, subMenuDiv); // Move instrumentation for the original UL
  while (rootUl.firstChild) {
    subMenuDiv.append(rootUl.firstChild);
  }
  rootUl.append(subMenuDiv);

  subMenuDiv.querySelectorAll('li').forEach((li) => {
    li.classList.add('header-comp__wrapper--sub-menu-item'); // Added from ORIGINAL HTML
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    const menuLinkDiv = document.createElement('div');
    menuLinkDiv.classList.add('header-comp__wrapper--menu-link', 'mb-3', 'mb-lg-0', 'gap-4', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-18', 'leading-24', 'text-header-list', 'text-lg-black'); // Added from ORIGINAL HTML
    menuLinkDiv.setAttribute('aria-current', 'page');

    const subMenuLinkDiv = document.createElement('div');
    subMenuLinkDiv.classList.add('header-comp__wrapper--sub-menu-link', 'dropdown-item', 'p-lg-3', 'mb-lg-3', 'mb-xl-3', 'leading-lg-24', 'leading-xl-24', 'font-default', 'font-lg-18', 'leading-lg-26', 'leading-28', 'ps-0', 'p-0', 'p-lg-3', 'd-inline-block', 'd-lg-flex', 'justify-content-between', 'align-items-center'); // Added from ORIGINAL HTML

    if (anchor) {
      anchor.classList.add('text-decoration-none', 'text-dark-gray-100'); // Added from ORIGINAL HTML
      const spanLink = document.createElement('span');
      spanLink.classList.add('sub-link-span'); // Added from ORIGINAL HTML
      spanLink.textContent = anchor.textContent.trim();
      anchor.textContent = ''; // Clear original text content
      anchor.append(spanLink);
      subMenuLinkDiv.append(anchor);
    } else {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.classList.add('sub-link-span'); // Added from ORIGINAL HTML
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        const tempAnchor = document.createElement('a');
        tempAnchor.classList.add('text-decoration-none', 'text-dark-gray-100'); // Added from ORIGINAL HTML
        tempAnchor.append(span);
        subMenuLinkDiv.append(tempAnchor);
      }
    }

    menuLinkDiv.append(subMenuLinkDiv);
    li.prepend(menuLinkDiv); // Prepend the new structure to the li

    if (nested) {
      li.classList.add('child-below'); // Added from ORIGINAL HTML
      menuLinkDiv.classList.add('dropdown-toggle'); // Added from ORIGINAL HTML
      menuLinkDiv.setAttribute('aria-expanded', 'false'); // Added from ORIGINAL HTML

      const arrowIconRight = document.createElement('span');
      arrowIconRight.classList.add('arrow-icon-right', 'end-0', 'd-none', 'd-lg-inline'); // Added from ORIGINAL HTML
      const arrowImgRight = document.createElement('img');
      arrowImgRight.alt = 'svg file';
      // Placeholder for arrow image src, replace with actual if available from original HTML
      arrowIconRight.append(arrowImgRight);
      subMenuLinkDiv.append(arrowIconRight);

      const arrowIcon = document.createElement('span');
      arrowIcon.classList.add('arrow-icon', 'd-lg-none', 'end-0', 'd-lg-none'); // Added from ORIGINAL HTML
      const arrowImg = document.createElement('img');
      arrowImg.alt = 'svg file';
      // Placeholder for arrow image src, replace with actual if available from original HTML
      arrowIcon.append(arrowImg);
      menuLinkDiv.append(arrowIcon);

      nested.remove();
      const innerChildsDiv = document.createElement('div');
      innerChildsDiv.classList.add('d-lg-none', 'inner-childs'); // Added from ORIGINAL HTML
      innerChildsDiv.append(nested);
      li.append(innerChildsDiv);
      transformNestedLists(nested); // Recursively transform nested lists

      menuLinkDiv.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        innerChildsDiv.classList.toggle('active');
        menuLinkDiv.classList.toggle('collapsed');
      });
    } else {
      li.classList.add('no-child'); // Added from ORIGINAL HTML
    }
  });
}

export default function decorate(block) {
  const [logoRow, logoLinkRow, ...itemRows] = [...block.children];

  // Create header section
  const headerSection = document.createElement('section');
  headerSection.classList.add('header-comp', 'bg-red-100', 'position-fixed', 'top-0', 'start-0', 'z-2', 'w-100');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'gx-8', 'gx-sm-0', 'd-flex', 'justify-content-between', 'align-items-start', 'align-items-md-center');
  headerSection.append(containerDiv);

  // Create nav
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
  navWrapper.append(hamburgerButton);

  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('navbar-toggler-icon', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center');
  hamburgerButton.append(hamburgerIcon);

  for (let i = 0; i < 3; i += 1) {
    const span = document.createElement('span');
    span.classList.add('d-block', 'bg-white');
    hamburgerIcon.append(span);
  }

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('header-comp__wrapper--logo');
  navWrapper.append(logoDiv);

  const logoLink = document.createElement('a');
  logoLink.classList.add('header-comp__wrapper--link', 'cta-analytics', 'navbar-brand', 'm-0');
  logoLink.setAttribute('data-link-region', 'Header');

  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);

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
  logoDiv.append(logoLink);

  // Navigation menus
  const navCollapse = document.createElement('div');
  navCollapse.classList.add('header-comp__wrapper--menus', 'collapse', 'navbar-collapse', 'z-3');
  navCollapse.id = 'navbarSupportedContent';
  navWrapper.append(navCollapse);

  const navList = document.createElement('ul');
  navList.classList.add('header-comp__wrapper--menus-groups', 'navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0', 'w-100');
  navCollapse.append(navList);

  hamburgerButton.addEventListener('click', () => {
    navCollapse.classList.toggle('show');
    hamburgerButton.classList.toggle('collapsed');
  });

  itemRows.forEach((row, index) => {
    const cells = [...row.children];
    // Determine item type based on cell count and content
    const isNavigationItem = cells.length === 4 && cells[3].querySelector('ul');
    const isSubNavigationItem = cells.length === 2;

    if (isNavigationItem) { // navigation-item
      const [iconCell, labelCell, linkCell, hierarchyCell] = cells;

      const li = document.createElement('li');
      li.classList.add('header-comp__wrapper--menu-item', 'h-100', 'd-flex', 'align-items-center', 'nav-item', 'p-4', 'p-lg-0', 'border-bottom-lg-0', 'dropdown', 'flex-column', 'border-lg-0', 'show-nav', 'position-relative');
      li.setAttribute('data-header-item-id', `leftHeaderItem${index}`); // Added from ORIGINAL HTML
      if (index % 2 === 0) { // Example logic for left/right division, adjust as needed
        li.classList.add('left-division');
      } else {
        li.classList.add('right-division');
      }

      const menuLinkDiv = document.createElement('div');
      menuLinkDiv.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'dropdown-toggle', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');
      menuLinkDiv.setAttribute('aria-current', 'page');
      menuLinkDiv.setAttribute('aria-expanded', 'false');

      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        if (img) {
          const menuIcon = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
          const menuIconImg = menuIcon.querySelector('img');
          menuIconImg.classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
          moveInstrumentation(img, menuIconImg);
          menuLinkDiv.append(menuIcon);
        }
      }

      const anchor = document.createElement('a');
      anchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
      anchor.setAttribute('data-link-region', 'Header');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      }
      moveInstrumentation(linkCell, anchor);

      const spanLink = document.createElement('span');
      spanLink.classList.add('link-span');
      spanLink.textContent = labelCell.textContent.trim();
      anchor.append(spanLink);
      menuLinkDiv.append(anchor);

      const hierarchyRoot = hierarchyCell.querySelector('ul');
      if (hierarchyRoot) {
        const toggleSpan = document.createElement('span');
        toggleSpan.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
        const arrowImg = document.createElement('img');
        arrowImg.alt = 'svg file';
        // Placeholder for arrow image src, replace with actual if available from original HTML
        toggleSpan.append(arrowImg);
        menuLinkDiv.append(toggleSpan);

        const subMenusDiv = document.createElement('div');
        subMenusDiv.classList.add('header-comp__sub-menus');
        subMenusDiv.id = `leftHeaderItem${index}`; // Added from ORIGINAL HTML
        subMenusDiv.setAttribute('data-id', `leftHeaderItem${index}`); // Added from ORIGINAL HTML

        // Create a temporary div to parse and apply classes to the richtext content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML;
        moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv

        const ulElement = tempDiv.querySelector('ul');
        if (ulElement) {
          transformNestedLists(ulElement);
          subMenusDiv.append(ulElement);
        }

        menuLinkDiv.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('show-nav');
          menuLinkDiv.classList.toggle('collapsed');
        });
        li.append(menuLinkDiv, subMenusDiv);
      } else {
        li.append(menuLinkDiv);
      }
      navList.append(li);
    } else if (isSubNavigationItem) { // sub-navigation-item - these are handled by transformNestedLists
      // These sub-navigation-items are typically nested within a navigation-item's hierarchy,
      // so they are not directly appended to navList here. The transformNestedLists function
      // handles their rendering. The current logic in transformNestedLists already creates
      // the necessary structure for these.
    }
  });

  // Search and access
  const searchAccessDiv = document.createElement('div');
  searchAccessDiv.classList.add('header-comp__wrapper--search-access', 'd-flex', 'py-4', 'py-lg-0');
  containerDiv.append(searchAccessDiv);

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('header-comp__wrapper--search');
  searchAccessDiv.append(searchDiv);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('header-comp__wrapper--search-icon', 'd-flex', 'flex-column', 'align-items-center', 'font-12', 'leading-20', 'text-white');
  searchDiv.append(searchIconDiv);

  const searchImg = document.createElement('img');
  searchImg.alt = 'svg file';
  // Placeholder for search icon src, replace with actual if available from original HTML
  searchIconDiv.append(searchImg);

  const searchSpan = document.createElement('span');
  searchSpan.classList.add('d-none', 'd-lg-block');
  searchSpan.textContent = 'Search';
  searchIconDiv.append(searchSpan);

  const outerBoxDiv = document.createElement('div');
  outerBoxDiv.classList.add('header__outer-box', 'position-absolute', 'w-100', 'z-2', 'start-0', 'd-lg-none');
  headerSection.append(outerBoxDiv);

  // Add event listener for search icon to toggle global search
  searchIconDiv.addEventListener('click', () => {
    const globalSearch = document.querySelector('.global-search');
    if (globalSearch) {
      globalSearch.classList.toggle('d-none'); // Toggle visibility
    }
  });

  block.innerHTML = '';
  block.append(headerSection);

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
