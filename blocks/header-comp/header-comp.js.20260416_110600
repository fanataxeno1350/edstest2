import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    // Handle label-only nodes
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
      subWrap.classList.add('has-sub-child'); // Use original HTML class
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
  const [logoRow, logoLinkRow, searchIconRow, ...menuItemRows] = [...block.children];

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

  const nav = document.createElement('nav');
  nav.classList.add('header-nav', 'navbar', 'position-static', 'navbar-expand-lg');

  const navWrapper = document.createElement('div');
  navWrapper.classList.add(
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

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    if (logoImg) {
      const optimizedLogoPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '750' }]);
      optimizedLogoPic.classList.add('header-comp__wrapper--image', 'h-100');
      moveInstrumentation(logoPicture, optimizedLogoPic);
      logoLink.appendChild(optimizedLogoPic);
    }
  }
  logoWrapper.appendChild(logoLink);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('header-comp__wrapper--menus', 'collapse', 'navbar-collapse', 'z-3');
  navbarCollapse.id = 'navbarSupportedContent';

  const menuList = document.createElement('ul');
  menuList.classList.add(
    'header-comp__wrapper--menus-groups',
    'navbar-nav',
    'me-auto',
    'mb-2',
    'mb-lg-0',
    'w-100',
  );

  menuItemRows.forEach((row, index) => {
    const [iconCell, labelCell, linkCell, hierarchyCell] = [...row.children];

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
      'position-relative',
    );
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

    const itemIconPicture = iconCell.querySelector('picture');
    if (itemIconPicture) {
      const itemIconImg = itemIconPicture.querySelector('img');
      if (itemIconImg) {
        const optimizedItemIconPic = createOptimizedPicture(itemIconImg.src, itemIconImg.alt, false, [{ width: '750' }]);
        optimizedItemIconPic.classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
        moveInstrumentation(itemIconPicture, optimizedItemIconPic);
        menuLinkWrapper.appendChild(optimizedItemIconPic);
      }
    }

    const linkAnchor = document.createElement('a');
    linkAnchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
    linkAnchor.setAttribute('data-link-region', 'Header');
    linkAnchor.href = linkCell.querySelector('a')?.href || '#';

    const linkSpan = document.createElement('span');
    linkSpan.classList.add('link-span');
    linkSpan.textContent = labelCell.textContent.trim();
    linkAnchor.appendChild(linkSpan);
    menuLinkWrapper.appendChild(linkAnchor);

    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      listItem.classList.add('dropdown', 'flex-column', 'show-nav');
      menuLinkWrapper.classList.add('dropdown-toggle');
      menuLinkWrapper.setAttribute('aria-expanded', 'false');

      const toggleDropdown = document.createElement('span');
      toggleDropdown.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
      const arrowIcon = document.createElement('img');
      arrowIcon.alt = 'svg file';
      // Use the actual icon source from ORIGINAL HTML if available, otherwise keep placeholder
      arrowIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1776313317979.svg+xml'; 
      toggleDropdown.appendChild(arrowIcon);
      menuLinkWrapper.appendChild(toggleDropdown);

      const subMenusDiv = document.createElement('div');
      subMenusDiv.classList.add('header-comp__sub-menus');

      const subMenuContainer = document.createElement('div');
      subMenuContainer.classList.add('xfpage', 'page', 'basicpage');
      const subMenuGrid = document.createElement('div');
      subMenuGrid.classList.add('aem-Grid', 'aem-Grid--12', 'aem-Grid--default--12');
      const subMenuHeaderDiv = document.createElement('div');
      subMenuHeaderDiv.classList.add('headerSubMenu', 'aem-GridColumn', 'aem-GridColumn--default--12');

      const subMenuGroup = document.createElement('ul');
      subMenuGroup.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
      const subMenuTriParent = document.createElement('div');
      subMenuTriParent.classList.add('header-comp__sub-menu', 'tri-parent');
      subMenuGroup.appendChild(subMenuTriParent);

      // Create a temporary div to parse the richtext HTML and apply classes
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv

      // Apply classes to the nested elements from the ORIGINAL HTML structure
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0'));
      tempDiv.querySelectorAll('li').forEach(li => li.classList.add('header-comp__wrapper--sub-menu-item'));
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('text-decoration-none', 'text-dark-gray-100'));

      transformNestedLists(tempDiv.querySelector('ul')); // Apply transformations to the parsed hierarchy

      // Move children from tempDiv to subMenuTriParent
      while (tempDiv.firstChild) {
        subMenuTriParent.append(tempDiv.firstChild);
      }

      // Re-process the moved children to add specific classes and event listeners
      [...subMenuTriParent.children].forEach((childLi) => {
        const childLink = childLi.querySelector(':scope > a');
        const childSpan = childLi.querySelector(':scope > span');
        const childSubListWrapper = childLi.querySelector(':scope > .has-sub-child');

        const subMenuLinkWrapper = document.createElement('div');
        subMenuLinkWrapper.classList.add('header-comp__wrapper--menu-link', 'mb-3', 'mb-lg-0', 'gap-4', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-18', 'leading-24', 'text-header-list', 'text-lg-black');

        const subMenuDropdownItem = document.createElement('div');
        subMenuDropdownItem.classList.add('header-comp__wrapper--sub-menu-link', 'dropdown-item', 'p-lg-3', 'mb-lg-3', 'mb-xl-3', 'leading-lg-24', 'leading-xl-24', 'font-default', 'font-lg-18', 'leading-lg-26', 'leading-28', 'ps-0', 'p-0', 'p-lg-3', 'd-inline-block', 'd-lg-flex', 'justify-content-between', 'align-items-center');

        const subLink = document.createElement('a');
        subLink.classList.add('text-decoration-none', 'text-dark-gray-100');
        if (childLink) {
          subLink.href = childLink.href;
          subLink.textContent = childLink.textContent.trim();
        } else if (childSpan) {
          subLink.textContent = childSpan.textContent.trim();
        }
        subMenuDropdownItem.appendChild(subLink);

        if (childSubListWrapper) {
          childLi.classList.add('child-below'); // Apply to the original li from hierarchyRoot
          subMenuLinkWrapper.classList.add('dropdown-toggle');
          subMenuLinkWrapper.setAttribute('aria-expanded', 'false');

          const arrowIconRight = document.createElement('span');
          arrowIconRight.classList.add('arrow-icon-right', 'end-0', 'd-none', 'd-lg-inline');
          const arrowImg = document.createElement('img');
          arrowImg.alt = 'svg file';
          arrowImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776313318023.svg+xml'; // Placeholder
          arrowIconRight.appendChild(arrowImg);
          subMenuDropdownItem.appendChild(arrowIconRight);

          const arrowIconMobile = document.createElement('span');
          arrowIconMobile.classList.add('arrow-icon', 'd-lg-none', 'end-0');
          const mobileArrowImg = document.createElement('img');
          mobileArrowImg.alt = 'svg file';
          mobileArrowImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776313318081.svg+xml'; // Placeholder
          arrowIconMobile.appendChild(mobileArrowImg);
          subMenuLinkWrapper.appendChild(arrowIconMobile);

          const innerChildsDiv = document.createElement('div');
          innerChildsDiv.classList.add('d-lg-none', 'inner-childs');
          innerChildsDiv.appendChild(childSubListWrapper);
          childLi.appendChild(innerChildsDiv); // Append to the original li from hierarchyRoot

          subMenuLinkWrapper.addEventListener('click', () => {
            innerChildsDiv.classList.toggle('active');
            childLi.classList.toggle('active');
          });
        } else {
          childLi.classList.add('no-child'); // Apply to the original li from hierarchyRoot
        }

        subMenuLinkWrapper.appendChild(subMenuDropdownItem);
        // Replace the original li content with the new structure
        childLi.innerHTML = ''; // Clear original content
        childLi.appendChild(subMenuLinkWrapper);
      });


      subMenuHeaderDiv.appendChild(subMenuGroup);
      subMenuGrid.appendChild(subMenuHeaderDiv);
      subMenuContainer.appendChild(subMenuGrid);
      subMenusDiv.appendChild(subMenuContainer);
      listItem.appendChild(subMenusDiv);

      toggleDropdown.addEventListener('click', () => {
        listItem.classList.toggle('show-nav');
        subMenusDiv.classList.toggle('show-nav');
        menuLinkWrapper.classList.toggle('collapsed');
      });
    }

    listItem.prepend(menuLinkWrapper);
    menuList.appendChild(listItem);
    moveInstrumentation(row, listItem);
  });

  navbarCollapse.appendChild(menuList);

  const searchAccessDiv = document.createElement('div');
  searchAccessDiv.classList.add('header-comp__wrapper--search-access', 'd-flex', 'py-4', 'py-lg-0');

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

  const searchPicture = searchIconRow.querySelector('picture');
  if (searchPicture) {
    const searchImg = searchPicture.querySelector('img');
    if (searchImg) {
      const optimizedSearchPic = createOptimizedPicture(searchImg.src, searchImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(searchPicture, optimizedSearchPic);
      searchIconDiv.appendChild(optimizedSearchPic);
    }
  }

  const searchSpan = document.createElement('span');
  searchSpan.classList.add('d-none', 'd-lg-block');
  searchSpan.textContent = 'Search';
  searchIconDiv.appendChild(searchSpan);
  searchDiv.appendChild(searchIconDiv);
  searchAccessDiv.appendChild(searchDiv);

  navWrapper.appendChild(hamburgerButton);
  navWrapper.appendChild(logoWrapper);
  navWrapper.appendChild(navbarCollapse);
  nav.appendChild(navWrapper);
  container.appendChild(nav);
  container.appendChild(searchAccessDiv);
  block.appendChild(container);

  const outerBox = document.createElement('div');
  outerBox.classList.add('header__outer-box', 'position-absolute', 'w-100', 'z-2', 'start-0', 'd-lg-none');
  block.appendChild(outerBox);

  hamburgerButton.addEventListener('click', () => {
    navbarCollapse.classList.toggle('show');
    hamburgerButton.classList.toggle('collapsed');
  });

  // Add event listener for search icon to toggle global search
  const globalSearchSection = document.querySelector('.global-search');
  if (globalSearchSection) {
    searchIconDiv.addEventListener('click', () => {
      globalSearchSection.classList.toggle('d-none');
    });

    // Add event listener for the cross icon to close global search
    const crossWrap = globalSearchSection.querySelector('.cross-wrap');
    if (crossWrap) {
      crossWrap.addEventListener('click', () => {
        globalSearchSection.classList.add('d-none');
      });
    }

    // Add event listener for click outside to close global search
    const closeOnClick = globalSearchSection.querySelector('.close-on-click');
    if (closeOnClick) {
      closeOnClick.addEventListener('click', (event) => {
        if (event.target === closeOnClick) {
          globalSearchSection.classList.add('d-none');
        }
      });
    }
  }

  // Image optimization for all pictures within the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
