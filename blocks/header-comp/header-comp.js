import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Add classes to li elements
    li.classList.add('header-comp__wrapper--sub-menu-item');
    if (nested) {
      li.classList.add('child-below');
    } else {
      li.classList.add('no-child');
    }

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
      subWrap.classList.add('header-comp__sub-menus', 'inner-childs'); // Use class from original HTML
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
      transformNestedLists(nested); // Recursively transform nested lists
    }

    // Apply classes to anchors within the hierarchy-tree
    if (anchor) {
      anchor.classList.add('text-decoration-none', 'text-dark-gray-100');
      const span = document.createElement('span');
      span.classList.add('sub-link-span');
      span.textContent = anchor.textContent.trim();
      anchor.textContent = ''; // Clear original text
      anchor.append(span);
    }
  });

  // Apply classes to ul elements within the hierarchy-tree
  rootUl.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0');
  const div = document.createElement('div');
  div.classList.add('header-comp__sub-menu', 'tri-parent');
  while (rootUl.firstChild) {
    div.append(rootUl.firstChild);
  }
  rootUl.append(div);
}

export default function decorate(block) {
  const [logoRow, logoLinkRow, ...navigationItemRows] = [...block.children];

  block.innerHTML = ''; // Clear the block content

  const section = document.createElement('section');
  section.classList.add('header-comp', 'bg-red-100', 'position-fixed', 'top-0', 'start-0', 'z-2', 'w-100');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0', 'd-flex', 'justify-content-between', 'align-items-start', 'align-items-md-center');
  section.append(container);

  const nav = document.createElement('nav');
  nav.classList.add('header-nav', 'navbar', 'position-static', 'navbar-expand-lg');
  container.append(nav);

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-comp__wrapper', 'container-fluid', 'justify-content-start', 'gx-4', 'gx-md-0');
  nav.append(headerWrapper);

  const hamburgerButton = document.createElement('button');
  hamburgerButton.classList.add('border-0', 'shadow-none', 'navbar-toggler', 'header-comp__wrapper--hamburger', 'collapsed', 'p-0');
  hamburgerButton.type = 'button';
  hamburgerButton.setAttribute('aria-controls', 'navbarSupportedContent');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  hamburgerButton.setAttribute('aria-label', 'Toggle navigation');

  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('navbar-toggler-icon', 'd-flex', 'flex-column', 'justify-content-center', 'align-items-center');
  for (let i = 0; i < 3; i += 1) {
    const span = document.createElement('span');
    span.classList.add('d-block', 'bg-white');
    hamburgerIcon.append(span);
  }
  hamburgerButton.append(hamburgerIcon);
  headerWrapper.append(hamburgerButton);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('header-comp__wrapper--logo');
  headerWrapper.append(logoDiv);

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
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.classList.add('header-comp__wrapper--image', 'h-100');
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoLink);
  logoDiv.append(logoLink);

  const menuCollapseDiv = document.createElement('div');
  menuCollapseDiv.classList.add('header-comp__wrapper--menus', 'collapse', 'navbar-collapse', 'z-3');
  menuCollapseDiv.id = 'navbarSupportedContent';
  headerWrapper.append(menuCollapseDiv);

  const menuList = document.createElement('ul');
  menuList.classList.add('header-comp__wrapper--menus-groups', 'navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0', 'w-100');
  menuCollapseDiv.append(menuList);

  navigationItemRows.forEach((row) => {
    // Correctly destructure cells from row.children
    const [iconCell, labelCell, linkCell, hierarchyCell] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('header-comp__wrapper--menu-item', 'h-100', 'd-flex', 'align-items-center', 'nav-item', 'p-4', 'p-lg-0', 'border-bottom-lg-0', 'border-lg-0', 'show-nav', 'position-relative', 'left-division');
    moveInstrumentation(row, listItem);

    const menuLinkDiv = document.createElement('div');
    menuLinkDiv.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');
    listItem.append(menuLinkDiv);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
      optimizedPic.classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      menuLinkDiv.append(optimizedPic);
    }
    moveInstrumentation(iconCell, menuLinkDiv);

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
    moveInstrumentation(labelCell, menuLinkDiv);

    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      listItem.classList.add('dropdown', 'flex-column');
      menuLinkDiv.classList.add('dropdown-toggle');

      const toggleDropDown = document.createElement('span');
      toggleDropDown.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
      const arrowIcon = document.createElement('img');
      arrowIcon.alt = 'svg file';
      // No image source provided in original HTML for this arrow, so leaving src empty.
      // If a source is available, it should be set here.
      toggleDropDown.append(arrowIcon);
      menuLinkDiv.append(toggleDropDown);

      const subMenusDiv = document.createElement('div');
      subMenusDiv.classList.add('header-comp__sub-menus');
      // Move instrumentation for the hierarchy cell before moving its content
      moveInstrumentation(hierarchyCell, subMenusDiv);
      subMenusDiv.append(hierarchyRoot);
      listItem.append(subMenusDiv);

      transformNestedLists(hierarchyRoot);

      menuLinkDiv.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        listItem.classList.toggle('active');
        subMenusDiv.classList.toggle('active');
      });
    }

    menuList.append(listItem);
  });

  const searchAccessDiv = document.createElement('div');
  searchAccessDiv.classList.add('header-comp__wrapper--search-access', 'd-flex', 'py-4', 'py-lg-0');
  container.append(searchAccessDiv);

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('header-comp__wrapper--search');
  searchAccessDiv.append(searchDiv);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('header-comp__wrapper--search-icon', 'd-flex', 'flex-column', 'align-items-center', 'font-12', 'leading-20', 'text-white');
  searchDiv.append(searchIconDiv);

  const searchIconImg = document.createElement('img');
  searchIconImg.alt = 'svg file';
  // No image source provided in original HTML for this search icon, so leaving src empty.
  // If a source is available, it should be set here.
  searchIconDiv.append(searchIconImg);

  const searchSpan = document.createElement('span');
  searchSpan.classList.add('d-none', 'd-lg-block');
  searchSpan.textContent = 'Search';
  searchIconDiv.append(searchSpan);

  const outerBoxDiv = document.createElement('div');
  outerBoxDiv.classList.add('header__outer-box', 'position-absolute', 'w-100', 'z-2', 'start-0', 'd-lg-none');
  section.append(outerBoxDiv);

  block.append(section);

  // Hamburger button functionality
  hamburgerButton.addEventListener('click', () => {
    menuCollapseDiv.classList.toggle('collapse');
    menuCollapseDiv.classList.toggle('show');
    hamburgerButton.classList.toggle('collapsed');
    // Toggle body scroll lock
    document.body.classList.toggle('no-scroll');
  });

  // Close menu when clicking outside on mobile
  menuCollapseDiv.addEventListener('click', (event) => {
    if (event.target === menuCollapseDiv) {
      menuCollapseDiv.classList.remove('show');
      menuCollapseDiv.classList.add('collapse');
      hamburgerButton.classList.add('collapsed');
      document.body.classList.remove('no-scroll');
    }
  });

  // Close menu when a link is clicked (mobile)
  menuList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (menuCollapseDiv.classList.contains('show')) {
        menuCollapseDiv.classList.remove('show');
        menuCollapseDiv.classList.add('collapse');
        hamburgerButton.classList.add('collapsed');
        document.body.classList.remove('no-scroll');
      }
    });
  });

  // Search icon functionality
  searchIconDiv.addEventListener('click', () => {
    const globalSearch = document.querySelector('.global-search');
    if (globalSearch) {
      globalSearch.classList.toggle('d-none');
      document.body.classList.toggle('no-scroll');
    }
  });

  // Optimize images
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
