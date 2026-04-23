import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, ...itemRows] = [...block.children];

  // Use content detection for navigation items
  const navigationItems = itemRows.filter(
    (row) => [...row.children].find(cell => cell.querySelector('picture')) &&
             [...row.children].find(cell => cell.querySelector('ul')),
  );
  // Sub-navigation items have 2 cells: label (text) and link (aem-content)
  const subNavigationItems = itemRows.filter(
    (row) => row.children.length === 2 &&
             ![...row.children].find(cell => cell.querySelector('picture')) &&
             ![...row.children].find(cell => cell.querySelector('ul')),
  );

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
  moveInstrumentation(block, container);

  const nav = document.createElement('nav');
  nav.classList.add('header-nav', 'navbar', 'position-static', 'navbar-expand-lg');

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

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('header-comp__wrapper--logo');

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
    const optimizedLogo = createOptimizedPicture(
      logoImg.src,
      logoImg.alt,
      false,
      [{ width: '750' }],
    );
    moveInstrumentation(logoImg, optimizedLogo.querySelector('img'));
    optimizedLogo.querySelector('img').classList.add('header-comp__wrapper--image', 'h-100');
    logoLink.appendChild(optimizedLogo);
  } else {
    // Fallback if no logo picture is provided, though it should always be present
    const fallbackImg = document.createElement('img');
    fallbackImg.classList.add('header-comp__wrapper--image', 'h-100');
    fallbackImg.alt = 'Logo';
    logoLink.appendChild(fallbackImg);
  }
  moveInstrumentation(logoRow, logoWrapper);
  logoWrapper.appendChild(logoLink);

  const menusWrapper = document.createElement('div');
  menusWrapper.classList.add(
    'header-comp__wrapper--menus',
    'collapse',
    'navbar-collapse',
    'z-3',
  );
  menusWrapper.id = 'navbarSupportedContent';

  const navList = document.createElement('ul');
  navList.classList.add(
    'header-comp__wrapper--menus-groups',
    'navbar-nav',
    'me-auto',
    'mb-2',
    'mb-lg-0',
    'w-100',
  );

  navigationItems.forEach((row, index) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && !cell.querySelector('ul'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));

    const listItem = document.createElement('li');
    listItem.classList.add(
      'header-comp__wrapper--menu-item',
      'h-100',
      'd-flex',
      'align-items-center',
      'nav-item',
      'p-4',
      'p-lg-0',
      'border-bottom-lg-0',
      'border-lg-0',
    );
    listItem.setAttribute('data-header-item-id', `leftHeaderItem${index}`);

    if (index % 2 === 0) {
      listItem.classList.add('left-division');
    } else {
      listItem.classList.add('right-division');
    }

    const menuLinkWrapper = document.createElement('div');
    menuLinkWrapper.classList.add(
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
    menuLinkWrapper.setAttribute('aria-current', 'page');

    if (iconCell) {
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const iconImg = iconPicture.querySelector('img');
        const optimizedIcon = createOptimizedPicture(
          iconImg.src,
          iconImg.alt,
          false,
          [{ width: '750' }],
        );
        moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
        optimizedIcon.querySelector('img').classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
        menuLinkWrapper.appendChild(optimizedIcon);
      }
    }

    const anchor = document.createElement('a');
    anchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
    anchor.setAttribute('data-link-region', 'Header');
    anchor.href = linkCell?.querySelector('a')?.href || '#';

    const span = document.createElement('span');
    span.classList.add('link-span');
    span.textContent = labelCell?.textContent.trim() || '';
    anchor.appendChild(span);
    menuLinkWrapper.appendChild(anchor);

    if (hierarchyCell) {
      listItem.classList.add('dropdown', 'show-nav');
      menuLinkWrapper.classList.add('dropdown-toggle');
      menuLinkWrapper.setAttribute('aria-expanded', 'false');

      const toggleDropDown = document.createElement('span');
      toggleDropDown.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
      toggleDropDown.innerHTML = `
        <svg class="header-icon icon accordion-arrow-down text-dark-gray-100">
          <use xlink:href="/etc.clientlibs/clientlibs/aemigrate/clientlibs/assets/resources/sprite.svg#accordion-arrow-down"></use>
        </svg>
      `;
      menuLinkWrapper.appendChild(toggleDropDown);

      const subMenus = document.createElement('div');
      subMenus.classList.add('header-comp__sub-menus');
      subMenus.id = `leftHeaderItem${index}`;
      subMenus.setAttribute('data-id', `leftHeaderItem${index}`);

      const subMenuWrapper = document.createElement('div');
      subMenuWrapper.classList.add('xfpage', 'page', 'basicpage');
      const grid = document.createElement('div');
      grid.classList.add('aem-Grid', 'aem-Grid--12', 'aem-Grid--default--12');
      const gridColumn = document.createElement('div');
      gridColumn.classList.add('headerSubMenu', 'aem-GridColumn', 'aem-GridColumn--default--12');

      const subMenuGroup = document.createElement('ul');
      subMenuGroup.classList.add(
        'header-comp__wrapper--sub-menu-group',
        'w-auto',
        'border-0',
        'pb-lg-0',
        'dropdown-menu',
        'p-0',
      );

      const subMenuTriParent = document.createElement('div');
      subMenuTriParent.classList.add('header-comp__sub-menu', 'tri-parent');

      // Use a temporary div to parse the richtext HTML and apply instrumentation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv);

      tempDiv.querySelectorAll(':scope > ul > li').forEach((subLi, subIndex) => {
        const subLiAnchor = subLi.querySelector(':scope > a');
        const subLiTextContent = subLiAnchor ? subLiAnchor.textContent.trim() : subLi.firstChild?.textContent.trim();
        const subLiLink = subLiAnchor?.href || '#';
        const nestedUl = subLi.querySelector(':scope > ul');

        const subMenuItem = document.createElement('li');
        subMenuItem.classList.add('header-comp__wrapper--sub-menu-item');
        subMenuItem.setAttribute('data-child-id', `subNavItem${subIndex}`);
        moveInstrumentation(subLi, subMenuItem); // Instrument the sub-list item

        const subMenuLinkWrapper = document.createElement('div');
        subMenuLinkWrapper.classList.add(
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
        subMenuLinkWrapper.setAttribute('aria-current', 'page');

        const subMenuDropdownItem = document.createElement('div');
        subMenuDropdownItem.classList.add(
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

        const subMenuAnchor = document.createElement('a');
        subMenuAnchor.classList.add('text-decoration-none', 'text-dark-gray-100');
        subMenuAnchor.href = subLiLink;
        subMenuAnchor.textContent = subLiTextContent;

        subMenuDropdownItem.appendChild(subMenuAnchor);
        subMenuLinkWrapper.appendChild(subMenuDropdownItem);
        subMenuItem.appendChild(subMenuLinkWrapper);

        if (nestedUl) {
          subMenuItem.classList.add('child-below');
          subMenuLinkWrapper.classList.add('dropdown-toggle');
          subMenuLinkWrapper.setAttribute('aria-expanded', 'false');

          const arrowIconRight = document.createElement('span');
          arrowIconRight.classList.add('arrow-icon-right', 'end-0', 'd-none', 'd-lg-inline');
          arrowIconRight.innerHTML = `
            <svg class="icon accordion-arrow-down text-dark-gray-100">
              <use xlink:href="/etc.clientlibs/clientlibs/aemigrate/clientlibs/assets/resources/sprite.svg#arrow_right"></use>
            </svg>
          `;
          subMenuDropdownItem.appendChild(arrowIconRight);

          const arrowIconMobile = document.createElement('span');
          arrowIconMobile.classList.add('arrow-icon', 'd-lg-none', 'end-0');
          arrowIconMobile.innerHTML = `
            <svg class="icon accordion-arrow-down text-dark-gray-100">
              <use xlink:href="/etc.clientlibs/clientlibs/aemigrate/clientlibs/assets/resources/sprite.svg#accordion-arrow-down"></use>
            </svg>
          `;
          subMenuLinkWrapper.appendChild(arrowIconMobile);

          const innerChilds = document.createElement('div');
          innerChilds.classList.add('d-lg-none', 'inner-childs');
          innerChilds.id = `subNavItem${subIndex}`;
          innerChilds.setAttribute('data-id', `subNavItem${subIndex}`);

          const innerXfpage = document.createElement('div');
          innerXfpage.classList.add('xfpage', 'page', 'basicpage');
          const innerGrid = document.createElement('div');
          innerGrid.classList.add('aem-Grid', 'aem-Grid--12', 'aem-Grid--default--12');
          const innerGridColumn = document.createElement('div');
          innerGridColumn.classList.add('headerSubMenu', 'aem-GridColumn', 'aem-GridColumn--default--12');

          const innerSubMenuGroup = document.createElement('ul');
          innerSubMenuGroup.classList.add(
            'header-comp__wrapper--sub-menu-group',
            'w-auto',
            'border-0',
            'pb-lg-0',
            'dropdown-menu',
            'p-0',
          );
          const innerSubMenuTriParent = document.createElement('div');
          innerSubMenuTriParent.classList.add('header-comp__sub-menu', 'tri-parent');

          nestedUl.querySelectorAll(':scope > li').forEach((innerLi, innerIndex) => {
            const innerLiAnchor = innerLi.querySelector(':scope > a');
            const innerLiTextContent = innerLiAnchor ? innerLiAnchor.textContent.trim() : innerLi.firstChild?.textContent.trim();
            const innerLiLink = innerLiAnchor?.href || '#';

            const innerSubMenuItem = document.createElement('li');
            innerSubMenuItem.classList.add('header-comp__wrapper--sub-menu-item', 'no-child');
            innerSubMenuItem.setAttribute('data-child-id', `subNavItem${innerIndex}`);
            moveInstrumentation(innerLi, innerSubMenuItem); // Instrument the inner sub-list item

            const innerSubMenuLinkWrapper = document.createElement('div');
            innerSubMenuLinkWrapper.classList.add(
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
            innerSubMenuLinkWrapper.setAttribute('aria-current', 'page');

            const innerSubMenuDropdownItem = document.createElement('div');
            innerSubMenuDropdownItem.classList.add(
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

            const innerSubMenuAnchor = document.createElement('a');
            innerSubMenuAnchor.classList.add('text-decoration-none', 'text-dark-gray-100');
            innerSubMenuAnchor.href = innerLiLink;
            innerSubMenuAnchor.textContent = innerLiTextContent;

            innerSubMenuDropdownItem.appendChild(innerSubMenuAnchor);
            innerSubMenuLinkWrapper.appendChild(innerSubMenuDropdownItem);
            innerSubMenuItem.appendChild(innerSubMenuLinkWrapper);
            innerSubMenuTriParent.appendChild(innerSubMenuItem);
          });

          innerSubMenuGroup.appendChild(innerSubMenuTriParent);
          innerGridColumn.appendChild(innerSubMenuGroup);
          innerGrid.appendChild(innerGridColumn);
          innerXfpage.appendChild(innerGrid);
          innerChilds.appendChild(innerXfpage);
          subMenuItem.appendChild(innerChilds);

          subMenuLinkWrapper.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            innerChilds.classList.toggle('active');
            subMenuItem.classList.toggle('active');
            subMenuLinkWrapper.classList.toggle('active');
          });
        } else {
          subMenuItem.classList.add('no-child');
        }

        subMenuTriParent.appendChild(subMenuItem);
      });

      subMenuGroup.appendChild(subMenuTriParent);
      gridColumn.appendChild(subMenuGroup);
      grid.appendChild(gridColumn);
      subMenuWrapper.appendChild(grid);
      subMenus.appendChild(subMenuWrapper);
      listItem.appendChild(subMenus);

      menuLinkWrapper.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        listItem.classList.toggle('show-nav');
        subMenus.classList.toggle('show-nav');
        menuLinkWrapper.classList.toggle('active');
      });
    }

    listItem.appendChild(menuLinkWrapper);
    navList.appendChild(listItem);
    moveInstrumentation(row, listItem);
  });

  menusWrapper.appendChild(navList);

  headerWrapper.appendChild(hamburgerButton);
  headerWrapper.appendChild(logoWrapper);
  headerWrapper.appendChild(menusWrapper);
  nav.appendChild(headerWrapper);
  container.appendChild(nav);

  const searchAccess = document.createElement('div');
  searchAccess.classList.add('header-comp__wrapper--search-access', 'd-flex', 'py-4', 'py-lg-0');

  const searchWrapper = document.createElement('div');
  searchWrapper.classList.add('header-comp__wrapper--search');

  const searchIconWrapper = document.createElement('div');
  searchIconWrapper.classList.add(
    'header-comp__wrapper--search-icon',
    'd-flex',
    'flex-column',
    'align-items-center',
    'font-12',
    'leading-20',
    'text-white',
  );
  searchIconWrapper.innerHTML = `
    <svg class="icon search-red text-white">
      <use xlink:href="/etc.clientlibs/clientlibs/aemigrate/clientlibs/assets/resources/sprite.svg#search"></use>
    </svg>
    <span class="d-none d-lg-block">Search</span>
  `;
  searchWrapper.appendChild(searchIconWrapper);
  searchAccess.appendChild(searchWrapper);
  container.appendChild(searchAccess);

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
  block.appendChild(container);
  block.appendChild(outerBox);

  hamburgerButton.addEventListener('click', () => {
    menusWrapper.classList.toggle('show');
    hamburgerButton.classList.toggle('collapsed');
  });

  // Optimize all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
