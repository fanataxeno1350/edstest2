import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  // Ensure rootUl is an actual UL element
  if (!rootUl || rootUl.tagName !== 'UL') {
    return;
  }

  [...rootUl.children].forEach((li) => {
    if (li.tagName !== 'LI') return;

    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Apply classes from ORIGINAL HTML to the <li> element
    li.classList.add('header-comp__wrapper--sub-menu-item'); // Example class, adjust based on actual HTML

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        // Apply classes from ORIGINAL HTML to the <span> element if it's a label
        span.classList.add('sub-link-span'); // Example class, adjust based on actual HTML
        textNode.remove();
        li.prepend(span);
      }
    } else {
      // Apply classes from ORIGINAL HTML to the <a> element
      anchor.classList.add('text-decoration-none', 'text-dark-gray-100'); // Example classes, adjust based on actual HTML
      const spanLink = anchor.querySelector('span.sub-link-span');
      if (!spanLink) {
        const newSpan = document.createElement('span');
        newSpan.classList.add('sub-link-span');
        newSpan.textContent = anchor.textContent.trim();
        anchor.textContent = '';
        anchor.append(newSpan);
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('header-comp__sub-menus', 'inner-childs'); // Use classes from original HTML
      subWrap.append(nested);
      li.append(subWrap);

      // Apply classes from ORIGINAL HTML to the nested UL and LI elements
      nested.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
      [...nested.children].forEach(nestedLi => {
        nestedLi.classList.add('header-comp__wrapper--sub-menu-item');
        const nestedAnchor = nestedLi.querySelector('a');
        if (nestedAnchor) {
          nestedAnchor.classList.add('text-decoration-none', 'text-dark-gray-100');
          const nestedSpan = nestedAnchor.querySelector('span.sub-link-span');
          if (!nestedSpan) {
            const newSpan = document.createElement('span');
            newSpan.classList.add('sub-link-span');
            newSpan.textContent = nestedAnchor.textContent.trim();
            nestedAnchor.textContent = '';
            nestedAnchor.append(newSpan);
          }
        }
      });

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('header-comp__wrapper--menu-link', 'mb-3', 'mb-lg-0', 'gap-4', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'dropdown-toggle', 'font-18', 'leading-24', 'text-header-list', 'text-lg-black');
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // This 'active' class is not in original HTML, but often used for JS toggling
          subWrap.classList.toggle('active'); // This 'active' class is not in original HTML, but often used for JS toggling
          li.classList.toggle('show-nav'); // Use 'show-nav' for visibility, as seen in original HTML for main menu items
        });

        // Add arrow icon for dropdown
        const arrowIcon = document.createElement('span');
        arrowIcon.classList.add('arrow-icon', 'd-lg-none', 'end-0');
        arrowIcon.innerHTML = `<svg class="icon accordion-arrow-down text-dark-gray-100">
                                <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-e6cdd9.svg#accordion-arrow-down"></use>
                              </svg>`;
        trigger.append(arrowIcon);
      }
    }
  });
}

export default function decorate(block) {
  const [logoRow, logoLinkRow, ...itemRows] = [...block.children];

  const logoPicture = logoRow.querySelector('picture');
  const logoLink = logoLinkRow.querySelector('a');

  const headerSection = document.createElement('section');
  headerSection.classList.add('header-comp', 'bg-red-100', 'position-fixed', 'top-0', 'start-0', 'z-2', 'w-100');
  moveInstrumentation(block, headerSection);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'gx-8', 'gx-sm-0', 'd-flex', 'justify-content-between', 'align-items-start', 'align-items-md-center');

  const nav = document.createElement('nav');
  nav.classList.add('header-nav', 'navbar', 'position-static', 'navbar-expand-lg');

  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('header-comp__wrapper', 'container-fluid', 'justify-content-start', 'gx-4', 'gx-md-0');

  const toggler = document.createElement('button');
  toggler.classList.add('border-0', 'shadow-none', 'navbar-toggler', 'header-comp__wrapper--hamburger', 'collapsed', 'p-0');
  toggler.type = 'button';
  toggler.setAttribute('aria-controls', 'navbarSupportedContent');
  toggler.setAttribute('aria-expanded', 'false');
  toggler.setAttribute('aria-label', 'Toggle navigation');

  const togglerIcon = document.createElement('span');
  togglerIcon.classList.add('navbar-toggler-icon', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center');
  ['d-block', 'd-block', 'd-block'].forEach((cls) => {
    const span = document.createElement('span');
    span.classList.add(cls, 'bg-white');
    togglerIcon.append(span);
  });
  toggler.append(togglerIcon);

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('header-comp__wrapper--logo');

  const logoAnchor = document.createElement('a');
  logoAnchor.classList.add('header-comp__wrapper--link', 'cta-analytics', 'navbar-brand', 'm-0');
  if (logoLink) {
    logoAnchor.href = logoLink.href;
    moveInstrumentation(logoLinkRow, logoAnchor);
  } else {
    logoAnchor.href = '#';
  }

  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      optimizedImg.classList.add('header-comp__wrapper--image', 'h-100');
      optimizedImg.setAttribute('loading', 'eager');
      moveInstrumentation(img, optimizedImg);
      logoAnchor.append(optimizedPic);
    }
  }
  logoWrapper.append(logoAnchor);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('header-comp__wrapper--menus', 'collapse', 'navbar-collapse', 'z-3');
  navbarCollapse.id = 'navbarSupportedContent';

  const navList = document.createElement('ul');
  navList.classList.add('header-comp__wrapper--menus-groups', 'navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0', 'w-100');

  itemRows.forEach((row) => {
    const cells = [...row.children];
    // Distinguish between navigation-item (4 cells) and sub-navigation-item (2 cells)
    if (cells.length === 4) { // navigation-item
      const iconCell = cells.find(cell => cell.querySelector('picture'));
      const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim());
      const linkCell = cells.find(cell => cell.querySelector('a'));
      const hierarchyCell = cells.find(cell => cell.querySelector('ul'));

      const li = document.createElement('li');
      li.classList.add('header-comp__wrapper--menu-item', 'h-100', 'd-flex', 'align-items-center', 'nav-item', 'p-4', 'p-lg-0', 'border-bottom-lg-0', 'dropdown', 'flex-column', 'border-lg-0', 'show-nav', 'position-relative', 'left-division');
      moveInstrumentation(row, li);

      const menuLinkDiv = document.createElement('div');
      menuLinkDiv.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');

      if (iconCell) {
        const iconPicture = iconCell.querySelector('picture');
        if (iconPicture) {
          const img = iconPicture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
            const optimizedImg = optimizedPic.querySelector('img');
            optimizedImg.classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
            optimizedImg.setAttribute('loading', 'eager');
            moveInstrumentation(img, optimizedImg);
            menuLinkDiv.append(optimizedPic);
          }
        }
      }

      const anchor = document.createElement('a');
      anchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
      if (linkCell) {
        const foundLink = linkCell.querySelector('a');
        if (foundLink) {
          anchor.href = foundLink.href;
        } else {
          anchor.href = '#';
        }
      } else {
        anchor.href = '#';
      }

      const spanLink = document.createElement('span');
      spanLink.classList.add('link-span');
      if (labelCell) {
        spanLink.textContent = labelCell.textContent.trim();
      }
      anchor.append(spanLink);
      menuLinkDiv.append(anchor);

      if (hierarchyCell) {
        const hierarchyRoot = hierarchyCell.querySelector('ul');
        if (hierarchyRoot) {
          menuLinkDiv.classList.add('dropdown-toggle');
          menuLinkDiv.setAttribute('aria-expanded', 'false');

          const toggleDropDown = document.createElement('span');
          toggleDropDown.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
          toggleDropDown.innerHTML = `<svg class="header-icon icon accordion-arrow-down text-dark-gray-100">
                                          <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-e6cdd9.svg#accordion-arrow-down"></use>
                                        </svg>`;
          menuLinkDiv.append(toggleDropDown);

          const subMenusDiv = document.createElement('div');
          subMenusDiv.classList.add('header-comp__sub-menus');
          // Use innerHTML to preserve the full structure, then transform
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = hierarchyCell.innerHTML;
          const ulToTransform = tempDiv.querySelector('ul');
          if (ulToTransform) {
            moveInstrumentation(hierarchyCell, ulToTransform); // Move instrumentation before appending
            transformNestedLists(ulToTransform);
            subMenusDiv.append(ulToTransform);
          }

          toggleDropDown.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            li.classList.toggle('show-nav');
            menuLinkDiv.classList.toggle('collapsed'); // Add collapsed class for toggling
            menuLinkDiv.setAttribute('aria-expanded', li.classList.contains('show-nav'));
          });
          li.append(menuLinkDiv, subMenusDiv);
        } else {
          li.append(menuLinkDiv);
        }
      } else {
        li.append(menuLinkDiv);
      }
      navList.append(li);
    } else if (cells.length === 2) { // sub-navigation-item - These are handled by transformNestedLists, so they shouldn't be processed here directly
      // This block should ideally not be reached if transformNestedLists is correctly handling nested items.
      // If sub-navigation-items are meant to be top-level, their structure needs to be defined.
      // For now, we'll skip them as they are intended to be nested within hierarchy-tree.
    }
  });

  navbarCollapse.append(navList);
  wrapperDiv.append(toggler, logoWrapper, navbarCollapse);
  nav.append(wrapperDiv);

  const searchAccessDiv = document.createElement('div');
  searchAccessDiv.classList.add('header-comp__wrapper--search-access', 'd-flex', 'py-4', 'py-lg-0');

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('header-comp__wrapper--search');

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('header-comp__wrapper--search-icon', 'd-flex', 'flex-column', 'align-items-center', 'font-12', 'leading-20', 'text-white');
  searchIconDiv.innerHTML = `<svg class="icon search-red text-white">
                                <use xlink:href="/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#search"></use>
                              </svg>
                              <span class="d-none d-lg-block">Search</span>`;
  searchDiv.append(searchIconDiv);
  searchAccessDiv.append(searchDiv);

  containerDiv.append(nav, searchAccessDiv);

  const outerBoxDiv = document.createElement('div');
  outerBoxDiv.classList.add('header__outer-box', 'position-absolute', 'w-100', 'z-2', 'start-0', 'd-lg-none');

  headerSection.append(containerDiv, outerBoxDiv);

  block.replaceWith(headerSection);

  // Toggle functionality for mobile menu
  toggler.addEventListener('click', () => {
    navbarCollapse.classList.toggle('show');
    toggler.classList.toggle('collapsed');
    toggler.setAttribute('aria-expanded', navbarCollapse.classList.contains('show'));
  });
}
