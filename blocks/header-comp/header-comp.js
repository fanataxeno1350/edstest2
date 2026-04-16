import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    // Handle label-only nodes
    const anchor = li.querySelector(':scope > a');
    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
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
      subWrap.classList.add('has-sub-child'); // Class from ORIGINAL HTML
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
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const headerComp = document.createElement('section');
  headerComp.classList.add('header-comp', 'bg-red-100', 'position-fixed', 'top-0', 'start-0', 'z-2', 'w-100');

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0', 'd-flex', 'justify-content-between', 'align-items-start', 'align-items-md-center');
  headerComp.append(container);

  const nav = document.createElement('nav');
  nav.classList.add('header-nav', 'navbar', 'position-static', 'navbar-expand-lg');
  container.append(nav);

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-comp__wrapper', 'container-fluid', 'justify-content-start', 'gx-4', 'gx-md-0');
  nav.append(headerWrapper);

  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('border-0', 'shadow-none', 'navbar-toggler', 'header-comp__wrapper--hamburger', 'collapsed', 'p-0');
  hamburgerButton.type = 'button';
  hamburgerButton.setAttribute('aria-label', 'Toggle navigation');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('navbar-toggler-icon', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center');
  ['d-block', 'd-block', 'd-block'].forEach((cls) => {
    const span = document.createElement('span');
    span.classList.add(cls, 'bg-white');
    hamburgerIcon.append(span);
  });
  hamburgerButton.append(hamburgerIcon);
  headerWrapper.append(hamburgerButton);

  // Root fields are block.children[0] and block.children[1]
  const [logoRow, logoLinkRow, ...itemRows] = children;

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('header-comp__wrapper--logo');
  const logoLink = document.createElement('a');
  logoLink.classList.add('header-comp__wrapper--link', 'cta-analytics', 'navbar-brand', 'm-0');
  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    const optimizedImg = optimizedPic.querySelector('img');
    optimizedImg.classList.add('header-comp__wrapper--image', 'h-100');
    moveInstrumentation(logoPicture, optimizedPic);
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoWrapper);
  logoWrapper.append(logoLink);
  headerWrapper.append(logoWrapper);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('header-comp__wrapper--menus', 'collapse', 'navbar-collapse', 'z-3');
  navbarCollapse.id = 'navbarSupportedContent';
  headerWrapper.append(navbarCollapse);

  const navMenu = document.createElement('ul');
  navMenu.classList.add('header-comp__wrapper--menus-groups', 'navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0', 'w-100');
  navbarCollapse.append(navMenu);

  itemRows.forEach((row) => {
    const cells = [...row.children];
    const li = document.createElement('li');
    li.classList.add('header-comp__wrapper--menu-item', 'h-100', 'd-flex', 'align-items-center', 'nav-item', 'p-4', 'p-lg-0', 'border-bottom-lg-0', 'border-lg-0');
    moveInstrumentation(row, li);

    if (cells.length === 4) { // navigation-item
      const [iconCell, labelCell, linkCell, hierarchyCell] = cells;
      li.classList.add('dropdown', 'flex-column', 'show-nav', 'position-relative', 'left-division');

      const menuLinkDiv = document.createElement('div');
      menuLinkDiv.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'dropdown-toggle', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');
      menuLinkDiv.setAttribute('aria-current', 'page');
      menuLinkDiv.setAttribute('aria-expanded', 'false');

      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
        moveInstrumentation(iconPicture, optimizedPic);
        menuLinkDiv.append(optimizedPic);
      }

      const linkAnchor = document.createElement('a');
      linkAnchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        linkAnchor.href = foundLink.href;
      }
      const linkSpan = document.createElement('span');
      linkSpan.classList.add('link-span');
      linkSpan.textContent = labelCell.textContent.trim();
      linkAnchor.append(linkSpan);
      moveInstrumentation(linkCell, linkAnchor);
      moveInstrumentation(labelCell, linkSpan);
      menuLinkDiv.append(linkAnchor);

      const toggleDropDown = document.createElement('span');
      toggleDropDown.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
      const arrowIcon = document.createElement('img');
      arrowIcon.alt = 'svg file';
      // Use a placeholder or default icon if no specific icon is provided in the EDS block
      arrowIcon.src = '/icons/arrow-down.svg'; // Placeholder for arrow icon
      toggleDropDown.append(arrowIcon);
      menuLinkDiv.append(toggleDropDown);
      li.append(menuLinkDiv);

      const subMenusDiv = document.createElement('div');
      subMenusDiv.classList.add('header-comp__sub-menus');
      const hierarchyRoot = hierarchyCell.querySelector('ul');
      if (hierarchyRoot) {
        const subMenuGroup = document.createElement('ul');
        subMenuGroup.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
        const subMenuTriParent = document.createElement('div');
        subMenuTriParent.classList.add('header-comp__sub-menu', 'tri-parent');
        subMenuGroup.append(subMenuTriParent);

        // Use innerHTML to preserve nested structure and then process
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML;
        moveInstrumentation(hierarchyCell, tempDiv); // Instrument the original cell to the temp div

        [...tempDiv.children].forEach((subLi) => {
          const subItemLi = document.createElement('li');
          subItemLi.classList.add('header-comp__wrapper--sub-menu-item', 'child-below');
          const subItemLinkDiv = document.createElement('div');
          subItemLinkDiv.classList.add('header-comp__wrapper--menu-link', 'mb-3', 'mb-lg-0', 'gap-4', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'dropdown-toggle', 'font-18', 'leading-24', 'text-header-list', 'text-lg-black');
          subItemLinkDiv.setAttribute('aria-current', 'page');
          subItemLinkDiv.setAttribute('aria-expanded', 'false');

          const subItemLinkWrapper = document.createElement('div');
          subItemLinkWrapper.classList.add('header-comp__wrapper--sub-menu-link', 'dropdown-item', 'p-lg-3', 'mb-lg-3', 'mb-xl-3', 'leading-lg-24', 'leading-xl-24', 'font-default', 'font-lg-18', 'leading-lg-26', 'leading-28', 'ps-0', 'p-0', 'p-lg-3', 'd-inline-block', 'd-lg-flex', 'justify-content-between', 'align-items-center');

          const subAnchor = subLi.querySelector(':scope > a');
          if (subAnchor) {
            const tempAnchor = document.createElement('a');
            tempAnchor.classList.add('text-decoration-none', 'text-dark-gray-100');
            tempAnchor.href = subAnchor.href;
            tempAnchor.textContent = subAnchor.textContent.trim();
            subItemLinkWrapper.append(tempAnchor);
          } else {
            const textContent = subLi.firstChild?.textContent?.trim();
            if (textContent) {
              const span = document.createElement('span');
              span.classList.add('text-decoration-none', 'text-dark-gray-100');
              span.textContent = textContent;
              subItemLinkWrapper.append(span);
            }
          }

          const arrowIconRight = document.createElement('span');
          arrowIconRight.classList.add('arrow-icon-right', 'end-0', 'd-none', 'd-lg-inline');
          const rightArrowImg = document.createElement('img');
          rightArrowImg.alt = 'svg file';
          rightArrowImg.src = '/icons/arrow-right.svg'; // Placeholder for right arrow icon
          arrowIconRight.append(rightArrowImg);
          subItemLinkWrapper.append(arrowIconRight);

          subItemLinkDiv.append(subItemLinkWrapper);

          const mobileArrowIcon = document.createElement('span');
          mobileArrowIcon.classList.add('arrow-icon', 'd-lg-none', 'end-0');
          const mobileArrowImg = document.createElement('img');
          mobileArrowImg.alt = 'svg file';
          mobileArrowImg.src = '/icons/arrow-down.svg'; // Placeholder for mobile arrow icon
          mobileArrowIcon.append(mobileArrowImg);
          subItemLinkDiv.append(mobileArrowIcon);

          subItemLi.append(subItemLinkDiv);

          const nestedUl = subLi.querySelector(':scope > ul');
          if (nestedUl) {
            const innerChildsDiv = document.createElement('div');
            innerChildsDiv.classList.add('d-lg-none', 'inner-childs');
            const innerSubMenu = document.createElement('ul');
            innerSubMenu.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
            const innerTriParent = document.createElement('div');
            innerTriParent.classList.add('header-comp__sub-menu', 'tri-parent');
            innerSubMenu.append(innerTriParent);
            innerTriParent.append(nestedUl);
            transformNestedLists(nestedUl); // Transform nested lists recursively
            innerChildsDiv.append(innerSubMenu);
            subItemLi.append(innerChildsDiv);

            subItemLinkDiv.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              subItemLi.classList.toggle('active');
              innerChildsDiv.classList.toggle('active');
            });
          } else {
            subItemLi.classList.add('no-child');
          }
          subMenuTriParent.append(subItemLi);
        });

        subMenusDiv.append(subMenuGroup);
        li.append(subMenusDiv);

        menuLinkDiv.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subMenusDiv.classList.toggle('active');
        });
      } else {
        li.classList.remove('dropdown', 'flex-column', 'show-nav');
        li.classList.add('no-child'); // Add a class for items without submenus
        const linkWrapper = document.createElement('div');
        linkWrapper.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');
        const link = document.createElement('a');
        link.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
        const foundLink = linkCell.querySelector('a');
        if (foundLink) {
          link.href = foundLink.href;
        }
        const span = document.createElement('span');
        span.classList.add('link-span');
        span.textContent = labelCell.textContent.trim();
        link.append(span);
        moveInstrumentation(linkCell, link);
        moveInstrumentation(labelCell, span);
        linkWrapper.append(link);
        li.append(linkWrapper);
      }
    } else if (cells.length === 3) { // sub-navigation-item
      const [labelCell, linkCell, hierarchyCell] = cells;
      li.classList.add('dropdown', 'flex-column', 'show-nav', 'position-relative', 'left-division');

      const menuLinkDiv = document.createElement('div');
      menuLinkDiv.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'dropdown-toggle', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');
      menuLinkDiv.setAttribute('aria-current', 'page');
      menuLinkDiv.setAttribute('aria-expanded', 'false');

      const linkAnchor = document.createElement('a');
      linkAnchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        linkAnchor.href = foundLink.href;
      }
      const linkSpan = document.createElement('span');
      linkSpan.classList.add('link-span');
      linkSpan.textContent = labelCell.textContent.trim();
      linkAnchor.append(linkSpan);
      moveInstrumentation(linkCell, linkAnchor);
      moveInstrumentation(labelCell, linkSpan);
      menuLinkDiv.append(linkAnchor);

      const toggleDropDown = document.createElement('span');
      toggleDropDown.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
      const arrowIcon = document.createElement('img');
      arrowIcon.alt = 'svg file';
      arrowIcon.src = '/icons/arrow-down.svg'; // Placeholder for arrow icon
      toggleDropDown.append(arrowIcon);
      menuLinkDiv.append(toggleDropDown);
      li.append(menuLinkDiv);

      const subMenusDiv = document.createElement('div');
      subMenusDiv.classList.add('header-comp__sub-menus');
      const hierarchyRoot = hierarchyCell.querySelector('ul');
      if (hierarchyRoot) {
        const subMenuGroup = document.createElement('ul');
        subMenuGroup.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
        const subMenuTriParent = document.createElement('div');
        subMenuTriParent.classList.add('header-comp__sub-menu', 'tri-parent');
        subMenuGroup.append(subMenuTriParent);

        // Use innerHTML to preserve nested structure and then process
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML;
        moveInstrumentation(hierarchyCell, tempDiv); // Instrument the original cell to the temp div

        [...tempDiv.children].forEach((subLi) => {
          const subItemLi = document.createElement('li');
          subItemLi.classList.add('header-comp__wrapper--sub-menu-item', 'child-below');
          const subItemLinkDiv = document.createElement('div');
          subItemLinkDiv.classList.add('header-comp__wrapper--menu-link', 'mb-3', 'mb-lg-0', 'gap-4', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'dropdown-toggle', 'font-18', 'leading-24', 'text-header-list', 'text-lg-black');
          subItemLinkDiv.setAttribute('aria-current', 'page');
          subItemLinkDiv.setAttribute('aria-expanded', 'false');

          const subItemLinkWrapper = document.createElement('div');
          subItemLinkWrapper.classList.add('header-comp__wrapper--sub-menu-link', 'dropdown-item', 'p-lg-3', 'mb-lg-3', 'mb-xl-3', 'leading-lg-24', 'leading-xl-24', 'font-default', 'font-lg-18', 'leading-lg-26', 'leading-28', 'ps-0', 'p-0', 'p-lg-3', 'd-inline-block', 'd-lg-flex', 'justify-content-between', 'align-items-center');

          const subAnchor = subLi.querySelector(':scope > a');
          if (subAnchor) {
            const tempAnchor = document.createElement('a');
            tempAnchor.classList.add('text-decoration-none', 'text-dark-gray-100');
            tempAnchor.href = subAnchor.href;
            tempAnchor.textContent = subAnchor.textContent.trim();
            subItemLinkWrapper.append(tempAnchor);
          } else {
            const textContent = subLi.firstChild?.textContent?.trim();
            if (textContent) {
              const span = document.createElement('span');
              span.classList.add('text-decoration-none', 'text-dark-gray-100');
              span.textContent = textContent;
              subItemLinkWrapper.append(span);
            }
          }

          const arrowIconRight = document.createElement('span');
          arrowIconRight.classList.add('arrow-icon-right', 'end-0', 'd-none', 'd-lg-inline');
          const rightArrowImg = document.createElement('img');
          rightArrowImg.alt = 'svg file';
          rightArrowImg.src = '/icons/arrow-right.svg'; // Placeholder for right arrow icon
          arrowIconRight.append(rightArrowImg);
          subItemLinkWrapper.append(arrowIconRight);

          subItemLinkDiv.append(subItemLinkWrapper);

          const mobileArrowIcon = document.createElement('span');
          mobileArrowIcon.classList.add('arrow-icon', 'd-lg-none', 'end-0');
          const mobileArrowImg = document.createElement('img');
          mobileArrowImg.alt = 'svg file';
          mobileArrowImg.src = '/icons/arrow-down.svg'; // Placeholder for mobile arrow icon
          mobileArrowIcon.append(mobileArrowImg);
          subItemLinkDiv.append(mobileArrowIcon);

          subItemLi.append(subItemLinkDiv);

          const nestedUl = subLi.querySelector(':scope > ul');
          if (nestedUl) {
            const innerChildsDiv = document.createElement('div');
            innerChildsDiv.classList.add('d-lg-none', 'inner-childs');
            const innerSubMenu = document.createElement('ul');
            innerSubMenu.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
            const innerTriParent = document.createElement('div');
            innerTriParent.classList.add('header-comp__sub-menu', 'tri-parent');
            innerSubMenu.append(innerTriParent);
            innerTriParent.append(nestedUl);
            transformNestedLists(nestedUl); // Transform nested lists recursively
            innerChildsDiv.append(innerSubMenu);
            subItemLi.append(innerChildsDiv);

            subItemLinkDiv.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              subItemLi.classList.toggle('active');
              innerChildsDiv.classList.toggle('active');
            });
          } else {
            subItemLi.classList.add('no-child');
          }
          subMenuTriParent.append(subItemLi);
        });

        subMenusDiv.append(subMenuGroup);
        li.append(subMenusDiv);

        menuLinkDiv.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subMenusDiv.classList.toggle('active');
        });
      } else {
        li.classList.remove('dropdown', 'flex-column', 'show-nav');
        li.classList.add('no-child'); // Add a class for items without submenus
        const linkWrapper = document.createElement('div');
        linkWrapper.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');
        const link = document.createElement('a');
        link.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
        const foundLink = linkCell.querySelector('a');
        if (foundLink) {
          link.href = foundLink.href;
        }
        const span = document.createElement('span');
        span.classList.add('link-span');
        span.textContent = labelCell.textContent.trim();
        link.append(span);
        moveInstrumentation(linkCell, link);
        moveInstrumentation(labelCell, span);
        linkWrapper.append(link);
        li.append(linkWrapper);
      }
    } else if (cells.length === 2) { // search-icon-item
      const [iconCell, labelCell] = cells;

      const searchAccessDiv = document.createElement('div');
      searchAccessDiv.classList.add('header-comp__wrapper--search-access', 'd-flex', 'py-4', 'py-lg-0');

      const searchDiv = document.createElement('div');
      searchDiv.classList.add('header-comp__wrapper--search');
      searchAccessDiv.append(searchDiv);

      const searchIconDiv = document.createElement('div');
      searchIconDiv.classList.add('header-comp__wrapper--search-icon', 'd-flex', 'flex-column', 'align-items-center', 'font-12', 'leading-20', 'text-white');
      searchDiv.append(searchIconDiv);

      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        moveInstrumentation(iconPicture, optimizedPic);
        searchIconDiv.append(optimizedPic);
      }

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('d-none', 'd-lg-block');
      labelSpan.textContent = labelCell.textContent.trim();
      moveInstrumentation(labelCell, labelSpan);
      searchIconDiv.append(labelSpan);

      // Append searchAccessDiv to container directly, not to navMenu
      container.append(searchAccessDiv);
      return; // Skip appending to navMenu for search icons
    }
    navMenu.append(li);
  });

  const headerOuterBox = document.createElement('div');
  headerOuterBox.classList.add('header__outer-box', 'position-absolute', 'w-100', 'z-2', 'start-0', 'd-lg-none');
  headerComp.append(headerOuterBox);

  // Global search section
  const globalSearchSection = document.createElement('section');
  globalSearchSection.classList.add('global-search', 'position-fixed', 'w-100', 'd-none'); // Initially hidden

  const globalSearchWrapper = document.createElement('div');
  globalSearchWrapper.classList.add('w-100', 'z-4', 'global-search__wrapper', 'pb-md-5', 'pb-lg-6', 'pt-lg-0', 'pt-md-0', 'pt-2', 'pb-2');
  globalSearchSection.append(globalSearchWrapper);

  const searchFlexContainer = document.createElement('div');
  searchFlexContainer.classList.add('d-flex', 'justify-content-center', 'h-100');
  globalSearchWrapper.append(searchFlexContainer);

  const crossWrapDiv = document.createElement('div');
  crossWrapDiv.classList.add('d-lg-block', 'align-items-center', 'd-flex');
  const crossWrapInner = document.createElement('div');
  crossWrapInner.classList.add('cross-wrap', 'd-flex', 'justify-content-center', 'align-items-center');
  const crossImg = document.createElement('img');
  crossImg.alt = 'svg file';
  crossImg.src = '/icons/close.svg'; // Placeholder for close icon
  crossWrapInner.append(crossImg);
  crossWrapDiv.append(crossWrapInner);
  searchFlexContainer.append(crossWrapDiv);

  const searchFormDiv = document.createElement('div');
  searchFormDiv.classList.add('global-search__wrapper--form', 'd-flex', 'align-items-center', 'justify-content-center');
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.classList.add('global-search__wrapper--form-input', 'pb-1', 'pb-md-1', 'pb-lg-3', 'px-lg-4');
  searchInput.placeholder = 'Start typing...';
  searchInput.setAttribute('data-path', '/content/svasti/in/en');
  searchInput.setAttribute('data-limit', '5');
  searchInput.setAttribute('data-error', '<p><b>Sorry, we cannot find what you are looking for :(</b></p><p>&nbsp;</p><p>Please try a new search term or browse through one of our product categories.</p>');
  searchFormDiv.append(searchInput);
  searchFlexContainer.append(searchFormDiv);

  const searchWrapDiv = document.createElement('div');
  searchWrapDiv.classList.add('d-lg-block', 'align-items-center', 'd-flex');
  const searchWrapInner = document.createElement('div');
  searchWrapInner.classList.add('search-wrap', 'd-flex', 'justify-content-center', 'align-items-center');
  const searchImg = document.createElement('img');
  searchImg.alt = 'svg file';
  searchImg.src = '/icons/search.svg'; // Placeholder for search icon
  searchWrapInner.append(searchImg);
  searchWrapDiv.append(searchWrapInner);
  searchFlexContainer.append(searchWrapDiv);

  const globalSearchResponseDiv = document.createElement('div');
  globalSearchResponseDiv.classList.add('d-flex', 'justify-content-center', 'w-100', 'close-on-click');
  const globalSearchResponseInner = document.createElement('div');
  globalSearchResponseInner.classList.add('global-search__response', 'd-flex', 'justify-content-start', 'z-4', 'bg-transparent');
  const searchResultsUl = document.createElement('ul');
  searchResultsUl.classList.add('global-search__response--results', 'm-0', 'w-100', 'd-none', 'pt-5', 'pb-5', 'px-9');
  globalSearchResponseInner.append(searchResultsUl);
  globalSearchResponseDiv.append(globalSearchResponseInner);
  globalSearchSection.append(globalSearchResponseDiv);

  block.innerHTML = '';
  block.append(headerComp);
  block.append(globalSearchSection);

  // Event Listeners for interactive behavior
  const searchIconTrigger = container.querySelector('.header-comp__wrapper--search-icon');
  if (searchIconTrigger) {
    searchIconTrigger.addEventListener('click', () => {
      globalSearchSection.classList.toggle('d-none');
    });
  }

  const closeSearchButton = globalSearchSection.querySelector('.cross-wrap');
  if (closeSearchButton) {
    closeSearchButton.addEventListener('click', () => {
      globalSearchSection.classList.add('d-none');
    });
  }

  hamburgerButton.addEventListener('click', () => {
    navbarCollapse.classList.toggle('collapse');
    navbarCollapse.classList.toggle('show');
    hamburgerButton.classList.toggle('collapsed');
    hamburgerButton.setAttribute('aria-expanded', navbarCollapse.classList.contains('show'));
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
