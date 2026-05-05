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
      subWrap.classList.add('header-comp__sub-menus');
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
  const allRows = [...block.children];

  const headerComp = document.createElement('section');
  headerComp.classList.add('bg-red-100', 'position-fixed', 'top-0', 'start-0', 'z-2', 'w-100'); // Removed 'header-comp' as outer div already has it

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'gx-8', 'gx-sm-0', 'd-flex', 'justify-content-between', 'align-items-start', 'align-items-md-center');
  headerComp.append(containerDiv);

  const nav = document.createElement('nav');
  nav.classList.add('header-nav', 'navbar', 'position-static', 'navbar-expand-lg');
  containerDiv.append(nav);

  const navWrapper = document.createElement('div');
  navWrapper.classList.add('header-comp__wrapper', 'container-fluid', 'justify-content-start', 'gx-4', 'gx-md-0');
  nav.append(navWrapper);

  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('border-0', 'shadow-none', 'navbar-toggler', 'header-comp__wrapper--hamburger', 'collapsed', 'p-0');
  hamburgerButton.type = 'button';
  hamburgerButton.setAttribute('aria-label', 'Toggle navigation');
  const hamburgerSpan = document.createElement('span');
  hamburgerSpan.classList.add('navbar-toggler-icon', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center');
  ['d-block bg-white', 'd-block bg-white', 'd-block bg-white'].forEach((classes) => {
    const span = document.createElement('span');
    span.classList.add(...classes.split(' '));
    hamburgerSpan.append(span);
  });
  hamburgerButton.append(hamburgerSpan);
  navWrapper.append(hamburgerButton);

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('header-comp__wrapper--logo');
  navWrapper.append(logoWrapper);

  const logoLink = document.createElement('a');
  logoLink.classList.add('header-comp__wrapper--link', 'cta-analytics', 'navbar-brand', 'm-0');
  logoLink.setAttribute('data-link-region', 'Header');
  logoWrapper.append(logoLink);

  // Destructure logo and logoLink cells
  const [logoRow, logoLinkRow, ...menuRows] = allRows;
  const logoCell = logoRow.children[0];
  const logoHrefCell = logoLinkRow.children[0];

  const logoPicture = logoCell.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
    logoLink.querySelector('img').classList.add('header-comp__wrapper--image', 'h-100');
  }

  const logoHref = logoHrefCell.querySelector('a')?.href;
  if (logoHref) {
    logoLink.href = logoHref;
  }
  moveInstrumentation(logoRow, logoLink); // Move instrumentation for logo row
  moveInstrumentation(logoLinkRow, logoLink); // Move instrumentation for logo link row

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('header-comp__wrapper--menus', 'collapse', 'navbar-collapse', 'z-3');
  navbarCollapse.id = 'navbarSupportedContent';
  navWrapper.append(navbarCollapse);

  hamburgerButton.addEventListener('click', () => {
    navbarCollapse.classList.toggle('show');
    hamburgerButton.classList.toggle('collapsed');
    hamburgerButton.setAttribute('aria-expanded', navbarCollapse.classList.contains('show'));
  });

  const menuGroups = document.createElement('ul');
  menuGroups.classList.add('header-comp__wrapper--menus-groups', 'navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0', 'w-100');
  navbarCollapse.append(menuGroups);

  const navigationItems = menuRows.filter((row) => row.children.length === 4);
  // const subNavigationItems = menuRows.filter((row) => row.children.length === 2); // This filter is not used in the current logic

  navigationItems.forEach((row, i) => {
    const [iconCell, labelCell, linkCell, hierarchyCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('header-comp__wrapper--menu-item', 'h-100', 'd-flex', 'align-items-center', 'nav-item', 'p-4', 'p-lg-0', 'border-bottom-lg-0', 'dropdown', 'border-lg-0', 'show-nav', 'position-relative');
    li.classList.add(i % 2 === 0 ? 'left-division' : 'right-division');
    li.setAttribute('data-header-item-id', `leftHeaderItem${i}`);

    const menuLinkDiv = document.createElement('div');
    menuLinkDiv.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');
    if (hierarchyCell.querySelector('ul')) {
      menuLinkDiv.classList.add('dropdown-toggle');
      menuLinkDiv.setAttribute('aria-expanded', 'false');
    }
    li.append(menuLinkDiv);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.querySelector('img').classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
      menuLinkDiv.append(optimizedPic);
    }

    const anchor = document.createElement('a');
    anchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
    anchor.setAttribute('data-link-region', 'Header');
    const linkHref = linkCell.querySelector('a')?.href;
    if (linkHref) {
      anchor.href = linkHref;
    }
    const linkSpan = document.createElement('span');
    linkSpan.classList.add('link-span');
    linkSpan.textContent = labelCell.textContent.trim();
    anchor.append(linkSpan);
    menuLinkDiv.append(anchor);

    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      const toggleSpan = document.createElement('span');
      toggleSpan.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
      // Hardcoded SVG path fix
      toggleSpan.innerHTML = '<svg class="header-icon icon accordion-arrow-down text-dark-gray-100"><use xlink:href="/icons/sprite.svg#accordion-arrow-down"></use></svg>';
      menuLinkDiv.append(toggleSpan);

      const subMenusDiv = document.createElement('div');
      subMenusDiv.classList.add('header-comp__sub-menus');
      subMenusDiv.id = `leftHeaderItem${i}`;
      subMenusDiv.setAttribute('data-id', `leftHeaderItem${i}`);
      li.append(subMenusDiv);

      const xfpage = document.createElement('div');
      xfpage.classList.add('xfpage', 'page', 'basicpage');
      subMenusDiv.append(xfpage);

      const aemGrid = document.createElement('div');
      aemGrid.classList.add('aem-Grid', 'aem-Grid--12', 'aem-Grid--default--12');
      xfpage.append(aemGrid);

      const headerSubMenu = document.createElement('div');
      headerSubMenu.classList.add('headerSubMenu', 'aem-GridColumn', 'aem-GridColumn--default--12');
      aemGrid.append(headerSubMenu);

      const subMenuGroup = document.createElement('ul');
      subMenuGroup.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
      headerSubMenu.append(subMenuGroup);

      const subMenuTriParent = document.createElement('div');
      subMenuTriParent.classList.add('header-comp__sub-menu', 'tri-parent');
      subMenuGroup.append(subMenuTriParent);

      [...hierarchyRoot.children].forEach((subLi, subIdx) => {
        const subItemLi = document.createElement('li');
        subItemLi.classList.add('header-comp__wrapper--sub-menu-item');
        subItemLi.setAttribute('data-child-id', `subNavItem${subIdx}`);

        const subLinkDiv = document.createElement('div');
        subLinkDiv.classList.add('header-comp__wrapper--menu-link', 'mb-3', 'mb-lg-0', 'gap-4', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-18', 'leading-24', 'text-header-list', 'text-lg-black');

        const subLinkAnchor = subLi.querySelector('a');
        const nestedUl = subLi.querySelector('ul');

        if (nestedUl) {
          subItemLi.classList.add('child-below');
          subLinkDiv.classList.add('dropdown-toggle');
          subLinkDiv.setAttribute('aria-expanded', 'false');
        } else {
          subItemLi.classList.add('no-child');
        }

        const subMenuLinkDiv = document.createElement('div');
        subMenuLinkDiv.classList.add('header-comp__wrapper--sub-menu-link', 'dropdown-item', 'p-lg-3', 'mb-lg-3', 'mb-xl-3', 'leading-lg-24', 'leading-xl-24', 'font-default', 'font-lg-18', 'leading-lg-26', 'leading-28', 'ps-0', 'p-0', 'p-lg-3', 'd-inline-block', 'd-lg-flex', 'justify-content-between', 'align-items-center');

        const finalSubLink = document.createElement('a');
        finalSubLink.classList.add('text-decoration-none', 'text-dark-gray-100');
        if (subLinkAnchor) {
          finalSubLink.href = subLinkAnchor.href;
          const subLinkSpan = document.createElement('span');
          subLinkSpan.classList.add('sub-link-span');
          subLinkSpan.textContent = subLinkAnchor.textContent.trim();
          finalSubLink.append(subLinkSpan);
        } else {
          const subLinkSpan = document.createElement('span');
          subLinkSpan.classList.add('sub-link-span');
          subLinkSpan.textContent = subLi.textContent.trim();
          finalSubLink.append(subLinkSpan);
        }
        subMenuLinkDiv.append(finalSubLink);

        if (nestedUl) {
          const arrowIconRight = document.createElement('span');
          arrowIconRight.classList.add('arrow-icon-right', 'end-0', 'd-none', 'd-lg-inline');
          // Hardcoded SVG path fix
          arrowIconRight.innerHTML = '<svg class="icon accordion-arrow-down text-dark-gray-100"><use xlink:href="/icons/sprite.svg#arrow_right"></use></svg>';
          subMenuLinkDiv.append(arrowIconRight);
        }
        subLinkDiv.append(subMenuLinkDiv);

        if (nestedUl) {
          const arrowIcon = document.createElement('span');
          arrowIcon.classList.add('arrow-icon', 'd-lg-none', 'end-0', 'd-lg-none');
          // Hardcoded SVG path fix
          arrowIcon.innerHTML = '<svg class="icon accordion-arrow-down text-dark-gray-100"><use xlink:href="/icons/sprite.svg#accordion-arrow-down"></use></svg>';
          subLinkDiv.append(arrowIcon);

          const innerChildsDiv = document.createElement('div');
          innerChildsDiv.classList.add('d-lg-none', 'inner-childs');
          innerChildsDiv.id = `subNavItem${subIdx}`;
          innerChildsDiv.setAttribute('data-id', `subNavItem${subIdx}`);
          subItemLi.append(innerChildsDiv);

          const innerXfpage = document.createElement('div');
          innerXfpage.classList.add('xfpage', 'page', 'basicpage');
          innerChildsDiv.append(innerXfpage);

          const innerAemGrid = document.createElement('div');
          innerAemGrid.classList.add('aem-Grid', 'aem-Grid--12', 'aem-Grid--default--12');
          innerXfpage.append(innerAemGrid);

          const innerHeaderSubMenu = document.createElement('div');
          innerHeaderSubMenu.classList.add('headerSubMenu', 'aem-GridColumn', 'aem-GridColumn--default--12');
          innerAemGrid.append(innerHeaderSubMenu);

          const innerSubMenuGroup = document.createElement('ul');
          innerSubMenuGroup.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
          innerHeaderSubMenu.append(innerSubMenuGroup);

          const innerSubMenuTriParent = document.createElement('div');
          innerSubMenuTriParent.classList.add('header-comp__sub-menu', 'tri-parent');
          innerSubMenuGroup.append(innerSubMenuTriParent);

          [...nestedUl.children].forEach((innerLi, innerIdx) => {
            const innerSubItemLi = document.createElement('li');
            innerSubItemLi.classList.add('header-comp__wrapper--sub-menu-item', 'no-child');
            innerSubItemLi.setAttribute('data-child-id', `subNavItem${innerIdx}`);

            const innerSubLinkDiv = document.createElement('div');
            innerSubLinkDiv.classList.add('header-comp__wrapper--menu-link', 'mb-3', 'mb-lg-0', 'gap-4', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-18', 'leading-24', 'text-header-list', 'text-lg-black');

            const innerSubMenuLinkDiv = document.createElement('div');
            innerSubMenuLinkDiv.classList.add('header-comp__wrapper--sub-menu-link', 'dropdown-item', 'p-lg-3', 'mb-lg-3', 'mb-xl-3', 'leading-lg-24', 'leading-xl-24', 'font-default', 'font-lg-18', 'leading-lg-26', 'leading-28', 'ps-0', 'p-0', 'p-lg-3', 'd-inline-block', 'd-lg-flex', 'justify-content-between', 'align-items-center');

            const innerFinalSubLink = document.createElement('a');
            innerFinalSubLink.classList.add('text-decoration-none', 'text-dark-gray-100');
            const innerSubLinkAnchor = innerLi.querySelector('a');
            if (innerSubLinkAnchor) {
              innerFinalSubLink.href = innerSubLinkAnchor.href;
              const innerSubLinkSpan = document.createElement('span');
              innerSubLinkSpan.classList.add('sub-link-span');
              innerSubLinkSpan.textContent = innerSubLinkAnchor.textContent.trim();
              innerFinalSubLink.append(innerSubLinkSpan);
            } else {
              const innerSubLinkSpan = document.createElement('span');
              innerSubLinkSpan.classList.add('sub-link-span');
              innerSubLinkSpan.textContent = innerLi.textContent.trim();
              innerFinalSubLink.append(innerSubLinkSpan);
            }
            innerSubMenuLinkDiv.append(innerFinalSubLink);
            innerSubLinkDiv.append(innerSubMenuLinkDiv);
            innerSubItemLi.append(innerSubLinkDiv);
            innerSubMenuTriParent.append(innerSubItemLi);
          });

          const innerBorderSection = document.createElement('div');
          innerBorderSection.classList.add('borderr-section', 'd-none', 'd-lg-flex', 'd-xl-flex', 'align-items-end', 'position-absolute', 'no-prod');
          innerBorderSection.id = 'borderSec';
          innerBorderSection.innerHTML = '<div class="border-bg"></div>';
          innerSubMenuGroup.append(innerBorderSection);

          subLinkDiv.addEventListener('click', () => {
            innerChildsDiv.classList.toggle('show');
            subLinkDiv.classList.toggle('collapsed');
            subLinkDiv.setAttribute('aria-expanded', innerChildsDiv.classList.contains('show'));
          });
        }
        subItemLi.append(subLinkDiv);
        subMenuTriParent.append(subItemLi);
      });

      const borderSection = document.createElement('div');
      borderSection.classList.add('borderr-section', 'd-none', 'd-lg-flex', 'd-xl-flex', 'align-items-end', 'position-absolute', 'no-prod');
      borderSection.id = 'borderSec';
      borderSection.innerHTML = '<div class="border-bg"></div>';
      subMenuGroup.append(borderSection);

      menuLinkDiv.addEventListener('click', () => {
        subMenusDiv.classList.toggle('show');
        menuLinkDiv.classList.toggle('collapsed');
        menuLinkDiv.setAttribute('aria-expanded', subMenusDiv.classList.contains('show'));
      });
    }
    moveInstrumentation(row, li);
    menuGroups.append(li);
  });

  const searchAccessDiv = document.createElement('div');
  searchAccessDiv.classList.add('header-comp__wrapper--search-access', 'd-flex', 'py-4', 'py-lg-0');
  containerDiv.append(searchAccessDiv);

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('header-comp__wrapper--search');
  searchAccessDiv.append(searchDiv);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('header-comp__wrapper--search-icon', 'd-flex', 'flex-column', 'align-items-center', 'font-12', 'leading-20', 'text-white');
  searchIconDiv.innerHTML = `
    <svg class="icon search-red text-white">
      <use xlink:href="/icons/sprite.svg#search"></use>
    </svg>
    <span class="d-none d-lg-block">Search</span>
  `;
  searchDiv.append(searchIconDiv);

  // Add event listener for search icon
  searchIconDiv.addEventListener('click', () => {
    // Assuming there's a global search component that needs to be toggled
    // This part is not in the provided JS, but implied by the HTML.
    // For now, we'll just log a message.
    console.log('Search icon clicked!');
    // Example: document.querySelector('.global-search').classList.toggle('d-none');
  });

  const outerBoxDiv = document.createElement('div');
  outerBoxDiv.classList.add('header__outer-box', 'position-absolute', 'w-100', 'z-2', 'start-0', 'd-lg-none');
  headerComp.append(outerBoxDiv);

  block.replaceChildren(headerComp);

  // Apply image optimization to all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
