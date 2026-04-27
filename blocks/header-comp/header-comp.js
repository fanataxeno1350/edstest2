import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, parentCell) {
  // Apply classes to the root UL itself
  rootUl.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');

  [...rootUl.children].forEach((li) => {
    li.classList.add('header-comp__wrapper--sub-menu-item'); // Add base class for all list items

    const nestedUl = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Create a wrapper for the link/text content
    const linkWrapper = document.createElement('div');
    linkWrapper.classList.add('header-comp__wrapper--menu-link', 'mb-3', 'mb-lg-0', 'gap-4', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-18', 'leading-24', 'text-header-list', 'text-lg-black');

    const subMenuLinkDiv = document.createElement('div');
    subMenuLinkDiv.classList.add('header-comp__wrapper--sub-menu-link', 'dropdown-item', 'p-lg-3', 'mb-lg-3', 'mb-xl-3', 'leading-lg-24', 'leading-xl-24', 'font-default', 'font-lg-18', 'leading-lg-26', 'leading-28', 'ps-0', 'p-0', 'p-lg-3', 'd-inline-block', 'd-lg-flex', 'justify-content-between', 'align-items-center');

    if (anchor) {
      const newAnchor = document.createElement('a');
      newAnchor.classList.add('text-decoration-none', 'text-dark-gray-100');
      newAnchor.href = anchor.href;
      if (anchor.target) newAnchor.target = anchor.target;
      if (anchor.title) newAnchor.title = anchor.title;

      const span = document.createElement('span');
      span.classList.add('sub-link-span');
      span.textContent = anchor.textContent.trim();
      newAnchor.append(span);

      // Check for screen reader only span from original HTML
      const screenReaderSpan = anchor.querySelector('.cmp-link__screen-reader-only');
      if (screenReaderSpan) {
        newAnchor.append(screenReaderSpan);
      }
      subMenuLinkDiv.append(newAnchor);
      moveInstrumentation(anchor, newAnchor); // Move instrumentation from original anchor
    } else {
      // If no anchor, it's plain text, wrap in span
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.classList.add('sub-link-span');
        span.textContent = textNode.textContent.trim();
        subMenuLinkDiv.append(span);
        textNode.remove(); // Remove original text node
      }
    }

    linkWrapper.append(subMenuLinkDiv);

    if (nestedUl) {
      li.classList.add('child-below');
      linkWrapper.classList.add('dropdown-toggle');
      linkWrapper.setAttribute('aria-expanded', 'false');

      const arrowIconRight = document.createElement('span');
      arrowIconRight.classList.add('arrow-icon-right', 'end-0', 'd-none', 'd-lg-inline');
      arrowIconRight.innerHTML = `<svg class="icon accordion-arrow-down text-dark-gray-100">
                                    <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#arrow_right"></use>
                                  </svg>`;
      subMenuLinkDiv.append(arrowIconRight);

      const arrowIconMobile = document.createElement('span');
      arrowIconMobile.classList.add('arrow-icon', 'd-lg-none', 'end-0');
      arrowIconMobile.innerHTML = `<svg class="icon accordion-arrow-down text-dark-gray-100">
                                    <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-e6cdd9.svg#accordion-arrow-down"></use>
                                  </svg>`;
      linkWrapper.append(arrowIconMobile);

      const subWrap = document.createElement('div');
      subWrap.classList.add('inner-childs');
      subWrap.id = `subNavItem${Math.random().toString(36).substring(2, 9)}`; // Unique ID for nested dropdown
      subWrap.setAttribute('data-id', subWrap.id);

      // Recursively transform nested lists
      const tempUl = document.createElement('ul');
      while (nestedUl.firstChild) {
        tempUl.append(nestedUl.firstChild);
      }
      transformNestedLists(tempUl, li); // Pass the current li as parent for instrumentation
      subWrap.append(tempUl);

      li.append(linkWrapper, subWrap);
      moveInstrumentation(nestedUl, subWrap); // Move instrumentation from original nestedUl

      // Event listener for nested dropdowns
      linkWrapper.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        subWrap.classList.toggle('active');
        arrowIconMobile.classList.toggle('active');
        linkWrapper.setAttribute('aria-expanded', li.classList.contains('active'));
      });
    } else {
      li.classList.add('no-child');
      li.append(linkWrapper);
    }

    // Move instrumentation from original li to the new li
    moveInstrumentation(li.querySelector('div'), li);
  });
}

export default function decorate(block) {
  const [logoRow, logoLinkRow, ...navigationItemRows] = [...block.children];

  const headerComp = document.createElement('section');
  headerComp.classList.add('header-comp', 'bg-red-100', 'position-fixed', 'top-0', 'start-0', 'z-2', 'w-100');
  moveInstrumentation(block, headerComp);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'gx-8', 'gx-sm-0', 'd-flex', 'justify-content-between', 'align-items-start', 'align-items-md-center');

  const nav = document.createElement('nav');
  nav.classList.add('header-nav', 'navbar', 'position-static', 'navbar-expand-lg');

  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('header-comp__wrapper', 'container-fluid', 'justify-content-start', 'gx-4', 'gx-md-0');

  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('border-0', 'shadow-none', 'navbar-toggler', 'header-comp__wrapper--hamburger', 'collapsed', 'p-0');
  hamburgerButton.type = 'button';
  hamburgerButton.setAttribute('aria-controls', 'navbarSupportedContent');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  hamburgerButton.setAttribute('aria-label', 'Toggle navigation');

  const togglerIcon = document.createElement('span');
  togglerIcon.classList.add('navbar-toggler-icon', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center');
  togglerIcon.innerHTML = `
    <span class="d-block bg-white"></span>
    <span class="d-block bg-white"></span>
    <span class="d-block bg-white"></span>
  `;
  hamburgerButton.append(togglerIcon);

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
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  } else {
    // Fallback if no picture element (e.g., just an img tag)
    const img = logoRow.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }

  const logoImage = logoLink.querySelector('img');
  if (logoImage) {
    logoImage.classList.add('header-comp__wrapper--image', 'h-100');
    logoImage.setAttribute('loading', 'eager');
  }

  logoWrapper.append(logoLink);

  const menusWrapper = document.createElement('div');
  menusWrapper.classList.add('header-comp__wrapper--menus', 'collapse', 'navbar-collapse', 'z-3');
  menusWrapper.id = 'navbarSupportedContent';

  const menuGroups = document.createElement('ul');
  menuGroups.classList.add('header-comp__wrapper--menus-groups', 'navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0', 'w-100');

  navigationItemRows.forEach((row, index) => {
    const [iconCell, labelCell, linkCell, hierarchyCell] = [...row.children];

    const menuItem = document.createElement('li');
    menuItem.classList.add('header-comp__wrapper--menu-item', 'h-100', 'd-flex', 'align-items-center', 'nav-item', 'p-4', 'p-lg-0', 'border-bottom-lg-0', 'border-lg-0', 'position-relative');
    if (index % 2 === 0) {
      menuItem.classList.add('left-division');
    } else {
      menuItem.classList.add('right-division');
    }

    const menuLinkWrapper = document.createElement('div');
    menuLinkWrapper.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      const menuImage = optimizedPic.querySelector('img');
      menuImage.classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
      menuImage.setAttribute('loading', 'eager');
      menuLinkWrapper.append(optimizedPic);
    }

    const anchor = document.createElement('a');
    anchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
    anchor.setAttribute('data-link-region', 'Header');
    anchor.href = linkCell.querySelector('a')?.href || '#';

    const span = document.createElement('span');
    span.classList.add('link-span');
    span.textContent = labelCell.textContent.trim();
    anchor.append(span);
    menuLinkWrapper.append(anchor);

    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      menuItem.classList.add('dropdown', 'show-nav');
      menuLinkWrapper.classList.add('dropdown-toggle');
      menuLinkWrapper.setAttribute('aria-expanded', 'false');

      const toggleDropDown = document.createElement('span');
      toggleDropDown.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
      toggleDropDown.innerHTML = `<svg class="header-icon icon accordion-arrow-down text-dark-gray-100">
                                    <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-e6cdd9.svg#accordion-arrow-down"></use>
                                  </svg>`;
      menuLinkWrapper.append(toggleDropDown);
      moveInstrumentation(hierarchyCell.querySelector('div'), toggleDropDown); // Move instrumentation from original div to toggleDropDown

      const subMenusDiv = document.createElement('div');
      subMenusDiv.classList.add('header-comp__sub-menus');
      subMenusDiv.setAttribute('data-id', `leftHeaderItem${index}`);
      subMenusDiv.id = `leftHeaderItem${index}`;

      // Create a temporary div to hold the hierarchyRoot content for processing
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      const processedUl = tempDiv.querySelector('ul');

      if (processedUl) {
        transformNestedLists(processedUl, hierarchyCell); // Pass hierarchyCell for instrumentation
        subMenusDiv.append(processedUl);
      }

      menuItem.append(subMenusDiv);
      moveInstrumentation(hierarchyCell, subMenusDiv); // Move instrumentation from original hierarchyCell to subMenusDiv

      toggleDropDown.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        menuItem.classList.toggle('active');
        subMenusDiv.classList.toggle('active');
        toggleDropDown.classList.toggle('active');
        menuLinkWrapper.setAttribute('aria-expanded', menuItem.classList.contains('active'));
      });
    }

    menuItem.prepend(menuLinkWrapper);
    menuGroups.append(menuItem);
  });

  menusWrapper.append(menuGroups);

  const searchAccess = document.createElement('div');
  searchAccess.classList.add('header-comp__wrapper--search-access', 'd-flex', 'py-4', 'py-lg-0');

  const searchWrapper = document.createElement('div');
  searchWrapper.classList.add('header-comp__wrapper--search');

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('header-comp__wrapper--search-icon', 'd-flex', 'flex-column', 'align-items-center', 'font-12', 'leading-20', 'text-white');
  searchIconDiv.innerHTML = `
    <svg class="icon search-red text-white">
      <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#search"></use>
    </svg>
    <span class="d-none d-lg-block">Search</span>
  `;
  searchWrapper.append(searchIconDiv);
  searchAccess.append(searchWrapper);

  wrapperDiv.append(hamburgerButton, logoWrapper, menusWrapper);
  nav.append(wrapperDiv);
  containerDiv.append(nav, searchAccess);

  const outerBox = document.createElement('div');
  outerBox.classList.add('header__outer-box', 'position-absolute', 'w-100', 'z-2', 'start-0', 'd-lg-none');

  headerComp.append(containerDiv, outerBox);

  // Global search functionality
  const globalSearchSection = document.createElement('section');
  globalSearchSection.classList.add('global-search', 'position-fixed', 'w-100', 'd-none');
  globalSearchSection.innerHTML = `
    <div class="w-100 z-4 global-search__wrapper pb-md-5 pb-lg-6 pt-lg-0 pt-md-0 pt-2 pb-2">
      <div class="d-flex justify-content-center h-100">
        <div class="d-lg-block align-items-center d-flex">
          <div class="cross-wrap d-flex justify-content-center align-items-center">
            <svg class="global-search__wrapper--cross display-inline-block text-black text-white m-0">
              <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#cross"></use>
            </svg>
          </div>
        </div>
        <div class="global-search__wrapper--form d-flex align-items-center justify-content-center">
          <input type="text" class="global-search__wrapper--form-input pb-1 pb-md-1 pb-lg-3 px-lg-4" placeholder="Start typing..." data-path="/content/svasti/in/en" data-limit="5" data-error="&lt;p&gt;&lt;b&gt;Sorry, we cannot find what you are looking for :(&lt;/b&gt;&lt;/p&gt;&lt;p&gt;&nbsp;&lt;/p&gt;&lt;p&gt;Please try a new search term or browse through one of our product categories.&lt;/p&gt;">
        </div>
        <div class="d-lg-block align-items-center d-flex">
          <div class="search-wrap d-flex justify-content-center align-items-center">
            <svg class="global-search__wrapper--search display-inline-block text-white m-0">
              <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#search"></use>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center w-100 close-on-click">
      <div class="global-search__response d-flex justify-content-start z-4 bg-transparent">
        <ul class="global-search__response--results m-0 w-100 d-none pt-5 pb-5 px-9"></ul>
      </div>
    </div>
  `;
  document.body.append(globalSearchSection);

  // Event Listeners for interactive behavior
  hamburgerButton.addEventListener('click', () => {
    menusWrapper.classList.toggle('collapse');
    menusWrapper.classList.toggle('show');
    hamburgerButton.classList.toggle('collapsed');
  });

  searchIconDiv.addEventListener('click', () => {
    globalSearchSection.classList.remove('d-none');
  });

  globalSearchSection.querySelector('.global-search__wrapper--cross').addEventListener('click', () => {
    globalSearchSection.classList.add('d-none');
  });

  block.replaceWith(headerComp);
}
