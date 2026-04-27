import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, originalCell) {
  rootUl.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
  rootUl.querySelectorAll('li').forEach((li) => {
    moveInstrumentation(originalCell, li); // Instrument each li
    li.classList.add('header-comp__wrapper--sub-menu-item'); // Add base class for li

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

    const menuLinkWrapper = document.createElement('div');
    menuLinkWrapper.classList.add('header-comp__wrapper--menu-link', 'mb-3', 'mb-lg-0', 'gap-4', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-18', 'leading-24', 'text-header-list', 'text-lg-black');

    const subMenuLinkDiv = document.createElement('div');
    subMenuLinkDiv.classList.add('header-comp__wrapper--sub-menu-link', 'dropdown-item', 'p-lg-3', 'mb-lg-3', 'mb-xl-3', 'leading-lg-24', 'leading-xl-24', 'font-default', 'font-lg-18', 'leading-lg-26', 'leading-28', 'ps-0', 'p-0', 'p-lg-3', 'd-inline-block', 'd-lg-flex', 'justify-content-between', 'align-items-center');

    if (anchor) {
      anchor.classList.add('text-decoration-none', 'text-dark-gray-100');
      const spanLink = document.createElement('span');
      spanLink.classList.add('sub-link-span');
      spanLink.textContent = anchor.textContent.trim();
      anchor.textContent = ''; // Clear original text content
      anchor.append(spanLink);
      subMenuLinkDiv.append(anchor);
    } else {
      const span = li.querySelector(':scope > span');
      if (span) {
        const tempAnchor = document.createElement('a');
        tempAnchor.classList.add('text-decoration-none', 'text-dark-gray-100');
        const spanLink = document.createElement('span');
        spanLink.classList.add('sub-link-span');
        spanLink.textContent = span.textContent.trim();
        tempAnchor.append(spanLink);
        subMenuLinkDiv.append(tempAnchor);
        span.remove(); // Remove the original span
      }
    }

    menuLinkWrapper.append(subMenuLinkDiv);

    if (nested) {
      li.classList.add('child-below');
      menuLinkWrapper.classList.add('dropdown-toggle');
      menuLinkWrapper.setAttribute('aria-expanded', 'false');

      const arrowIconRight = document.createElement('span');
      arrowIconRight.classList.add('arrow-icon-right', 'end-0', 'd-none', 'd-lg-inline');
      arrowIconRight.innerHTML = `<svg class="icon accordion-arrow-down text-dark-gray-100">
                                    <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right"></use>
                                  </svg>`;
      subMenuLinkDiv.append(arrowIconRight);

      const arrowIcon = document.createElement('span');
      arrowIcon.classList.add('arrow-icon', 'd-lg-none', 'end-0'); // d-lg-none added
      arrowIcon.innerHTML = `<svg class="icon accordion-arrow-down text-dark-gray-100">
                                <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-e6cdd9.svg#accordion-arrow-down"></use>
                              </svg>`;
      menuLinkWrapper.append(arrowIcon);

      nested.remove(); // Remove nested UL from its original position
      const subWrap = document.createElement('div');
      subWrap.classList.add('inner-childs', 'd-lg-none'); // Use class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(menuLinkWrapper, subWrap);

      const trigger = menuLinkWrapper; // The menuLinkWrapper itself acts as the trigger
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // Toggle 'active' on li
          subWrap.classList.toggle('active'); // Toggle 'active' on subWrap
          trigger.classList.toggle('collapsed'); // Toggle 'collapsed' on trigger
          trigger.setAttribute('aria-expanded', li.classList.contains('active'));
        });
      }
      transformNestedLists(nested, originalCell); // Recursively transform nested lists
    } else {
      li.classList.add('no-child');
      li.append(menuLinkWrapper);
    }
  });
}

export default function decorate(block) {
  const [logoRow, logoLinkRow, ...navigationItemRows] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('header-comp', 'bg-red-100', 'position-fixed', 'top-0', 'start-0', 'z-2', 'w-100');
  moveInstrumentation(block, header);

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0', 'd-flex', 'justify-content-between', 'align-items-start', 'align-items-md-center');

  const nav = document.createElement('nav');
  nav.classList.add('header-nav', 'navbar', 'position-static', 'navbar-expand-lg');

  const navWrapper = document.createElement('div');
  navWrapper.classList.add('header-comp__wrapper', 'container-fluid', 'justify-content-start', 'gx-4', 'gx-md-0');

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

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('header-comp__wrapper--logo');

  const logoLink = document.createElement('a');
  logoLink.classList.add('header-comp__wrapper--link', 'cta-analytics', 'navbar-brand', 'm-0');
  logoLink.setAttribute('data-link-region', 'Header');
  logoLink.href = logoLinkRow.querySelector('a')?.href || '#';

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.classList.add('header-comp__wrapper--image', 'h-100');
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoWrapper.append(logoLink);

  // Navigation menus
  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('header-comp__wrapper--menus', 'collapse', 'navbar-collapse', 'z-3');
  navbarCollapse.id = 'navbarSupportedContent';

  const navList = document.createElement('ul');
  navList.classList.add('header-comp__wrapper--menus-groups', 'navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0', 'w-100');

  navigationItemRows.forEach((row, index) => {
    const [iconCell, labelCell, linkCell, hierarchyCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('header-comp__wrapper--menu-item', 'h-100', 'd-flex', 'align-items-center', 'nav-item', 'p-4', 'p-lg-0', 'border-bottom-lg-0', 'border-lg-0', 'position-relative');
    li.classList.add(index % 2 === 0 ? 'left-division' : 'right-division'); // Example for left/right division from original

    const menuLinkWrapper = document.createElement('div');
    menuLinkWrapper.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedPic.classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      menuLinkWrapper.append(optimizedPic);
    }

    const anchor = document.createElement('a');
    anchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
    anchor.setAttribute('data-link-region', 'Header');
    anchor.href = linkCell.querySelector('a')?.href || '#';

    const spanLink = document.createElement('span');
    spanLink.classList.add('link-span');
    spanLink.textContent = labelCell.textContent.trim();
    anchor.append(spanLink);
    menuLinkWrapper.append(anchor);

    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      li.classList.add('dropdown', 'show-nav', 'flex-column'); // Add dropdown classes, flex-column from original
      menuLinkWrapper.classList.add('dropdown-toggle');
      menuLinkWrapper.setAttribute('aria-expanded', 'false');

      const toggleDropDown = document.createElement('span');
      toggleDropDown.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
      toggleDropDown.innerHTML = `<svg class="header-icon icon accordion-arrow-down text-dark-gray-100">
                                    <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-e6cdd9.svg#accordion-arrow-down"></use>
                                  </svg>`;
      menuLinkWrapper.append(toggleDropDown);

      const subMenusDiv = document.createElement('div');
      subMenusDiv.classList.add('header-comp__sub-menus');
      moveInstrumentation(hierarchyCell, subMenusDiv); // Instrument the subMenusDiv
      subMenusDiv.append(hierarchyRoot);
      transformNestedLists(hierarchyRoot, hierarchyCell); // Pass original cell for instrumentation

      li.append(menuLinkWrapper, subMenusDiv);

      menuLinkWrapper.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('show-nav');
        menuLinkWrapper.classList.toggle('collapsed');
        menuLinkWrapper.setAttribute('aria-expanded', li.classList.contains('show-nav'));
      });
    } else {
      li.append(menuLinkWrapper);
    }
    navList.append(li);
    moveInstrumentation(row, li);
  });
  navbarCollapse.append(navList);

  // Search and access
  const searchAccess = document.createElement('div');
  searchAccess.classList.add('header-comp__wrapper--search-access', 'd-flex', 'py-4', 'py-lg-0');

  const searchWrapper = document.createElement('div');
  searchWrapper.classList.add('header-comp__wrapper--search');

  const searchIconWrapper = document.createElement('div');
  searchIconWrapper.classList.add('header-comp__wrapper--search-icon', 'd-flex', 'flex-column', 'align-items-center', 'font-12', 'leading-20', 'text-white');
  searchIconWrapper.innerHTML = `<svg class="icon search-red text-white">
                                    <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#search"></use>
                                  </svg>
                                  <span class="d-none d-lg-block">Search</span>`;
  searchWrapper.append(searchIconWrapper);
  searchAccess.append(searchWrapper);

  navWrapper.append(toggler, logoWrapper, navbarCollapse);
  nav.append(navWrapper);
  container.append(nav, searchAccess);

  const outerBox = document.createElement('div');
  outerBox.classList.add('header__outer-box', 'position-absolute', 'w-100', 'z-2', 'start-0', 'd-lg-none');

  header.append(container, outerBox);

  block.replaceWith(header);

  // Close nav menu on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target) && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
      toggler.classList.add('collapsed');
      toggler.setAttribute('aria-expanded', 'false');
    }
  });

  toggler.addEventListener('click', () => {
    navbarCollapse.classList.toggle('show');
    toggler.classList.toggle('collapsed');
    toggler.setAttribute('aria-expanded', navbarCollapse.classList.contains('show'));
  });
}
