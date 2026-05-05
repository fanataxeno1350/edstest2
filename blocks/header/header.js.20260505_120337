import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    searchIconRow, // This field is not used in the generated JS, but kept for destructuring consistency
    searchLabelRow,
    searchPlaceholderRow,
    searchErrorRow,
    ...navigationMenuRows
  ] = [...block.children];

  const headerComp = document.createElement('section');
  headerComp.classList.add('header-comp', 'bg-red-100', 'position-fixed', 'top-0', 'start-0', 'z-2', 'w-100');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'gx-8', 'gx-sm-0', 'd-flex', 'justify-content-between', 'align-items-start', 'align-items-md-center');
  headerComp.append(containerDiv);

  const headerNav = document.createElement('nav');
  headerNav.classList.add('header-nav', 'navbar', 'position-static', 'navbar-expand-lg');
  containerDiv.append(headerNav);

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-comp__wrapper', 'container-fluid', 'justify-content-start', 'gx-4', 'gx-md-0');
  headerNav.append(headerWrapper);

  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('border-0', 'shadow-none', 'navbar-toggler', 'header-comp__wrapper--hamburger', 'collapsed', 'p-0');
  hamburgerButton.type = 'button';
  hamburgerButton.setAttribute('aria-controls', 'navbarSupportedContent');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  hamburgerButton.setAttribute('aria-label', 'Toggle navigation');

  const togglerSpan = document.createElement('span');
  togglerSpan.classList.add('navbar-toggler-icon', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center');
  hamburgerButton.append(togglerSpan);

  const span1 = document.createElement('span');
  span1.classList.add('d-block', 'bg-white');
  const span2 = document.createElement('span');
  span2.classList.add('d-block', 'bg-white');
  const span3 = document.createElement('span');
  span3.classList.add('d-block', 'bg-white');
  togglerSpan.append(span1, span2, span3);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('header-comp__wrapper--menus', 'collapse', 'navbar-collapse', 'z-3');
  navbarCollapse.id = 'navbarSupportedContent';

  hamburgerButton.addEventListener('click', () => {
    navbarCollapse.classList.toggle('show');
    hamburgerButton.classList.toggle('collapsed');
    hamburgerButton.setAttribute('aria-expanded', navbarCollapse.classList.contains('show'));
  });

  headerWrapper.append(hamburgerButton);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('header-comp__wrapper--logo');
  headerWrapper.append(logoDiv);

  const logoLink = document.createElement('a');
  logoLink.classList.add('header-comp__wrapper--link', 'cta-analytics', 'navbar-brand', 'm-0');
  logoLink.setAttribute('data-link-region', 'Header');
  logoLink.href = logoLinkRow.querySelector('a')?.href || '#';
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    const optimizedLogo = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '750' }]);
    optimizedLogo.querySelector('img').classList.add('header-comp__wrapper--image', 'h-100');
    optimizedLogo.querySelector('img').setAttribute('loading', 'eager');
    moveInstrumentation(logoRow, optimizedLogo.querySelector('img'));
    logoLink.append(optimizedLogo);
  }

  headerWrapper.append(navbarCollapse);

  const navList = document.createElement('ul');
  navList.classList.add('header-comp__wrapper--menus-groups', 'navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0', 'w-100');
  navbarCollapse.append(navList);

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
        // Changed 'inner-childs' to 'header-comp__sub-menu-group' based on ORIGINAL HTML
        subWrap.classList.add('header-comp__sub-menu-group');
        subWrap.append(nested);
        li.append(subWrap);

        const trigger = li.querySelector(':scope > a, :scope > span');
        if (trigger) {
          trigger.classList.add('dropdown-toggle');
          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            li.classList.toggle('active');
            subWrap.classList.toggle('active');
          });
        }
        transformNestedLists(nested);
      }
    });
  }

  navigationMenuRows.forEach((row, index) => {
    const [iconCell, labelCell, linkCell, hierarchyCell] = [...row.children];
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
      'show-nav',
      'position-relative',
    );
    li.setAttribute('data-header-item-id', `leftHeaderItem${index}`);

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

    const menuIcon = iconCell.querySelector('picture');
    if (menuIcon) {
      const img = menuIcon.querySelector('img');
      const optimizedIcon = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
      optimizedIcon.querySelector('img').classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
      optimizedIcon.querySelector('img').setAttribute('loading', 'eager');
      moveInstrumentation(iconCell, optimizedIcon.querySelector('img'));
      menuLinkDiv.append(optimizedIcon);
    }

    const anchor = document.createElement('a');
    anchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
    anchor.setAttribute('data-link-region', 'Header');
    anchor.href = linkCell.querySelector('a')?.href || '#';
    moveInstrumentation(linkCell, anchor);

    const linkSpan = document.createElement('span');
    linkSpan.classList.add('link-span');
    linkSpan.textContent = labelCell.textContent.trim();
    anchor.append(linkSpan);
    menuLinkDiv.append(anchor);

    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      menuLinkDiv.classList.add('dropdown-toggle');
      menuLinkDiv.setAttribute('aria-current', 'page');
      menuLinkDiv.setAttribute('aria-expanded', 'false');

      const toggleDropDown = document.createElement('span');
      toggleDropDown.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
      // Fixed hardcoded SVG sprite path
      toggleDropDown.innerHTML = `
        <svg class="header-icon icon accordion-arrow-down text-dark-gray-100">
          <use xlink:href="#accordion-arrow-down"></use>
        </svg>
      `;
      menuLinkDiv.append(toggleDropDown);

      const subMenusDiv = document.createElement('div');
      subMenusDiv.classList.add('header-comp__sub-menus');
      subMenusDiv.id = `leftHeaderItem${index}`;
      subMenusDiv.setAttribute('data-id', `leftHeaderItem${index}`);

      const headerSubMenu = document.createElement('div');
      headerSubMenu.classList.add('headerSubMenu', 'aem-GridColumn', 'aem-GridColumn--default--12');

      const subMenuGroup = document.createElement('ul');
      subMenuGroup.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
      subMenusDiv.append(headerSubMenu);
      headerSubMenu.append(subMenuGroup);

      const subMenuTriParent = document.createElement('div');
      subMenuTriParent.classList.add('header-comp__sub-menu', 'tri-parent');
      subMenuGroup.append(subMenuTriParent);

      const clonedHierarchyRoot = hierarchyRoot.cloneNode(true);
      transformNestedLists(clonedHierarchyRoot);
      // moveInstrumentation for nested elements
      moveInstrumentation(hierarchyCell, clonedHierarchyRoot);
      while (clonedHierarchyRoot.firstChild) {
        subMenuTriParent.append(clonedHierarchyRoot.firstChild);
      }

      menuLinkDiv.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        subMenusDiv.classList.toggle('show');
        menuLinkDiv.setAttribute('aria-expanded', subMenusDiv.classList.contains('show'));
        li.classList.toggle('show-nav');
      });
      li.append(menuLinkDiv, subMenusDiv);
    } else {
      li.append(menuLinkDiv);
    }
    moveInstrumentation(row, li);
    navList.append(li);
  });

  const searchAccessDiv = document.createElement('div');
  searchAccessDiv.classList.add('header-comp__wrapper--search-access', 'd-flex', 'py-4', 'py-lg-0');
  containerDiv.append(searchAccessDiv);

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('header-comp__wrapper--search');
  searchAccessDiv.append(searchDiv);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('header-comp__wrapper--search-icon', 'd-flex', 'flex-column', 'align-items-center', 'font-12', 'leading-20', 'text-white');
  searchDiv.append(searchIconDiv);

  const searchSvg = document.createElement('svg');
  searchSvg.classList.add('icon', 'search-red', 'text-white');
  // Fixed hardcoded SVG sprite path
  searchSvg.innerHTML = '<use xlink:href="#search"></use>';
  searchIconDiv.append(searchSvg);

  const searchLabelSpan = document.createElement('span');
  searchLabelSpan.classList.add('d-none', 'd-lg-block');
  searchLabelSpan.textContent = searchLabelRow.textContent.trim();
  moveInstrumentation(searchLabelRow, searchLabelSpan);
  searchIconDiv.append(searchLabelSpan);

  const outerBoxDiv = document.createElement('div');
  outerBoxDiv.classList.add('header__outer-box', 'position-absolute', 'w-100', 'z-2', 'start-0', 'd-lg-none');
  headerComp.append(outerBoxDiv);

  const globalDiv = document.createElement('div');
  globalDiv.classList.add('global');
  const globalSearchSection = document.createElement('section');
  globalSearchSection.classList.add('global-search', 'position-fixed', 'w-100', 'd-none');
  globalDiv.append(globalSearchSection);

  const globalSearchWrapper = document.createElement('div');
  globalSearchWrapper.classList.add('w-100', 'z-4', 'global-search__wrapper', 'pb-md-5', 'pb-lg-6', 'pt-lg-0', 'pt-md-0', 'pt-2', 'pb-2');
  globalSearchSection.append(globalSearchWrapper);

  const searchInnerDiv = document.createElement('div');
  searchInnerDiv.classList.add('d-flex', 'justify-content-center', 'h-100');
  globalSearchWrapper.append(searchInnerDiv);

  const crossWrapDiv = document.createElement('div');
  crossWrapDiv.classList.add('d-lg-block', 'align-items-center', 'd-flex');
  const crossInnerWrap = document.createElement('div');
  crossInnerWrap.classList.add('cross-wrap', 'd-flex', 'justify-content-center', 'align-items-center');
  crossWrapDiv.append(crossInnerWrap);
  const crossSvg = document.createElement('svg');
  crossSvg.classList.add('global-search__wrapper--cross', 'display-inline-block', 'text-black', 'text-white', 'm-0');
  // Fixed hardcoded SVG sprite path
  crossSvg.innerHTML = '<use xlink:href="#cross"></use>';
  crossInnerWrap.append(crossSvg);
  searchInnerDiv.append(crossWrapDiv);

  const searchFormDiv = document.createElement('div');
  searchFormDiv.classList.add('global-search__wrapper--form', 'd-flex', 'align-items-center', 'justify-content-center');
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.classList.add('global-search__wrapper--form-input', 'pb-1', 'pb-md-1', 'pb-lg-3', 'px-lg-4');
  searchInput.placeholder = searchPlaceholderRow.textContent.trim();
  moveInstrumentation(searchPlaceholderRow, searchInput);
  searchInput.setAttribute('data-path', '/content/svasti/in/en');
  searchInput.setAttribute('data-limit', '5');
  // Fixed searchErrorRow.innerHTML assignment to input.setAttribute('data-error', ...)
  searchInput.setAttribute('data-error', searchErrorRow.innerHTML);
  moveInstrumentation(searchErrorRow, searchInput);
  searchFormDiv.append(searchInput);
  searchInnerDiv.append(searchFormDiv);

  const searchWrapDiv = document.createElement('div');
  searchWrapDiv.classList.add('d-lg-block', 'align-items-center', 'd-flex');
  const searchInnerWrap = document.createElement('div');
  searchInnerWrap.classList.add('search-wrap', 'd-flex', 'justify-content-center', 'align-items-center');
  searchWrapDiv.append(searchInnerWrap);
  const searchIconSvg = document.createElement('svg');
  searchIconSvg.classList.add('global-search__wrapper--search', 'display-inline-block', 'text-white', 'm-0');
  // Fixed hardcoded SVG sprite path
  searchIconSvg.innerHTML = '<use xlink:href="#search"></use>';
  searchInnerWrap.append(searchIconSvg);
  searchInnerDiv.append(searchWrapDiv);

  const globalSearchResponse = document.createElement('div');
  globalSearchResponse.classList.add('d-flex', 'justify-content-center', 'w-100', 'close-on-click');
  const responseInnerDiv = document.createElement('div');
  responseInnerDiv.classList.add('global-search__response', 'd-flex', 'justify-content-start', 'z-4', 'bg-transparent');
  globalSearchResponse.append(responseInnerDiv);
  const resultsUl = document.createElement('ul');
  resultsUl.classList.add('global-search__response--results', 'm-0', 'w-100', 'd-none', 'pt-5', 'pb-5', 'px-9');
  responseInnerDiv.append(resultsUl);
  globalSearchSection.append(globalSearchResponse);

  searchIconDiv.addEventListener('click', () => {
    globalSearchSection.classList.remove('d-none');
  });

  crossWrapDiv.addEventListener('click', () => {
    globalSearchSection.classList.add('d-none');
  });

  block.replaceChildren(headerComp, globalDiv);

  headerComp.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
