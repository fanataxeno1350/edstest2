import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    // Handle label-only nodes (plain text within li)
    const anchor = li.querySelector(':scope > a');
    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        li.prepend(span);
        textNode.remove();
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('header-comp__sub-menus'); // Use class from original HTML
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.classList.add('dropdown-toggle');
        const toggleIcon = document.createElement('span');
        toggleIcon.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
        toggleIcon.innerHTML = '<img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1776313317979.svg+xml"/>'; // Example icon, replace if needed

        const wrapperLink = document.createElement('div');
        wrapperLink.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'dropdown-toggle', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');
        
        const linkSpan = document.createElement('span');
        linkSpan.classList.add('link-span');
        linkSpan.textContent = trigger.textContent;
        
        const actualLink = document.createElement('a');
        actualLink.href = trigger.href || '#';
        actualLink.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
        actualLink.append(linkSpan);

        wrapperLink.append(actualLink, toggleIcon);
        li.prepend(wrapperLink);
        trigger.remove(); // Remove the original trigger (span/a)

        wrapperLink.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('show-nav'); // Use class from original HTML
          subWrap.classList.toggle('show'); // Use class from original HTML
        });
      }
      transformNestedLists(nested); // Recursively transform nested lists
    } else {
      // Simple flat link
      const existingAnchor = li.querySelector(':scope > a');
      if (existingAnchor) {
        const linkSpan = document.createElement('span');
        linkSpan.classList.add('link-span');
        linkSpan.textContent = existingAnchor.textContent.trim();

        const newAnchor = document.createElement('a');
        newAnchor.href = existingAnchor.href;
        newAnchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
        newAnchor.append(linkSpan);

        const wrapperLink = document.createElement('div');
        wrapperLink.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');
        wrapperLink.append(newAnchor);

        li.replaceChildren(wrapperLink); // Replace original <a> with new structure
      } else {
        // Handle plain text li items without a link
        const textContent = li.textContent.trim();
        if (textContent) {
          const span = document.createElement('span');
          span.classList.add('link-span');
          span.textContent = textContent;

          const wrapperLink = document.createElement('div');
          wrapperLink.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');
          wrapperLink.append(span);
          li.replaceChildren(wrapperLink);
        }
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const headerComp = document.createElement('section');
  headerComp.classList.add('header-comp', 'bg-red-100', 'position-fixed', 'top-0', 'start-0', 'z-2', 'w-100');
  moveInstrumentation(block, headerComp);

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0', 'd-flex', 'justify-content-between', 'align-items-start', 'align-items-md-center');
  headerComp.append(container);

  const nav = document.createElement('nav');
  nav.classList.add('header-nav', 'navbar', 'position-static', 'navbar-expand-lg');
  container.append(nav);

  const wrapper = document.createElement('div');
  wrapper.classList.add('header-comp__wrapper', 'container-fluid', 'justify-content-start', 'gx-4', 'gx-md-0');
  nav.append(wrapper);

  // Hamburger button
  const toggler = document.createElement('button');
  toggler.classList.add('border-0', 'shadow-none', 'navbar-toggler', 'header-comp__wrapper--hamburger', 'collapsed', 'p-0');
  toggler.type = 'button';
  toggler.setAttribute('aria-controls', 'navbarSupportedContent');
  toggler.setAttribute('aria-expanded', 'false');
  toggler.setAttribute('aria-label', 'Toggle navigation');
  toggler.innerHTML = `
    <span class="navbar-toggler-icon d-flex flex-column justify-content-center align-items-center">
      <span class="d-block bg-white"></span>
      <span class="d-block bg-white"></span>
      <span class="d-block bg-white"></span>
    </span>
  `;
  wrapper.append(toggler);

  // Logo
  const logoRow = children[0];
  const logoLinkRow = children[1];

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('header-comp__wrapper--logo');
  wrapper.append(logoWrapper);

  const logoLink = document.createElement('a');
  logoLink.classList.add('header-comp__wrapper--link', 'cta-analytics', 'navbar-brand', 'm-0');
  logoLink.href = logoLinkRow.querySelector('a')?.href || '#';
  moveInstrumentation(logoLinkRow, logoLink);

  const logoImg = logoRow.querySelector('img');
  if (logoImg) {
    const optimizedPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '750' }]);
    const newImg = optimizedPic.querySelector('img');
    newImg.classList.add('header-comp__wrapper--image', 'h-100');
    moveInstrumentation(logoImg, newImg);
    logoLink.append(optimizedPic);
  }
  logoWrapper.append(logoLink);

  // Navigation Menu
  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('header-comp__wrapper--menus', 'collapse', 'navbar-collapse', 'z-3');
  navbarCollapse.id = 'navbarSupportedContent';
  wrapper.append(navbarCollapse);

  const navList = document.createElement('ul');
  navList.classList.add('header-comp__wrapper--menus-groups', 'navbar-nav', 'me-auto', 'mb-2', 'mb-lg-0', 'w-100');
  navbarCollapse.append(navList);

  toggler.addEventListener('click', () => {
    navbarCollapse.classList.toggle('show');
    toggler.classList.toggle('collapsed');
  });

  const itemRows = children.slice(2);
  itemRows.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells[0];
    const labelCell = cells[1];
    const linkCell = cells[2];
    const hierarchyCell = cells[3];

    const li = document.createElement('li');
    li.classList.add('header-comp__wrapper--menu-item', 'h-100', 'd-flex', 'align-items-center', 'nav-item', 'p-4', 'p-lg-0', 'border-bottom-lg-0', 'dropdown', 'flex-column', 'border-lg-0', 'position-relative');
    moveInstrumentation(row, li);

    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      li.classList.add('left-division'); // Example class, adjust based on original HTML

      const menuLinkWrapper = document.createElement('div');
      menuLinkWrapper.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'dropdown-toggle', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');

      const iconImg = iconCell.querySelector('img');
      if (iconImg) {
        const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
        const newImg = optimizedPic.querySelector('img');
        newImg.classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
        moveInstrumentation(iconImg, newImg);
        menuLinkWrapper.append(optimizedPic);
      }

      const foundLink = linkCell?.querySelector('a');
      const anchor = document.createElement('a');
      anchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
      if (foundLink) {
        anchor.href = foundLink.href;
      } else {
        anchor.href = '#';
      }
      moveInstrumentation(linkCell, anchor);

      const span = document.createElement('span');
      span.classList.add('link-span');
      span.textContent = labelCell?.textContent.trim() || '';
      anchor.append(span);
      menuLinkWrapper.append(anchor);

      const toggleDropDown = document.createElement('span');
      toggleDropDown.classList.add('toggle-drop-down', 'arrow-icon', 'd-flex', 'end-0', 'top-parent');
      toggleDropDown.innerHTML = '<img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1776313317979.svg+xml"/>';
      menuLinkWrapper.append(toggleDropDown);

      li.append(menuLinkWrapper);

      const subMenusDiv = document.createElement('div');
      subMenusDiv.classList.add('header-comp__sub-menus');
      
      // Create a temporary div to parse the richtext HTML and apply classes
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell

      // Apply classes to nested elements from ORIGINAL HTML
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('header-comp__wrapper--sub-menu-group', 'w-auto', 'border-0', 'pb-lg-0', 'dropdown-menu', 'p-0'));
      tempDiv.querySelectorAll('li').forEach(liItem => liItem.classList.add('header-comp__wrapper--sub-menu-item'));
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('text-decoration-none', 'text-dark-gray-100'));
      tempDiv.querySelectorAll('span').forEach(span => {
        if (span.textContent.trim()) {
          span.classList.add('sub-link-span');
        }
      });

      // Move children from tempDiv to subMenusDiv
      while (tempDiv.firstChild) {
        subMenusDiv.append(tempDiv.firstChild);
      }

      li.append(subMenusDiv);

      transformNestedLists(subMenusDiv.querySelector('ul')); // Pass the actual UL for recursive transformation

      menuLinkWrapper.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('show-nav');
        subMenusDiv.classList.toggle('show');
      });
    } else {
      // Simple link item
      li.classList.add('left-division'); // Example class, adjust based on original HTML

      const menuLinkWrapper = document.createElement('div');
      menuLinkWrapper.classList.add('header-comp__wrapper--menu-link', 'gap-6', 'gap-lg-1', 'position-relative', 'w-100', 'd-flex', 'align-items-center', 'nav-link', 'px-0', 'font-default', 'leading-28', 'leading-lg-26', 'text-header-list', 'text-lg-cream-100');

      const iconImg = iconCell.querySelector('img');
      if (iconImg) {
        const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
        const newImg = optimizedPic.querySelector('img');
        newImg.classList.add('header-comp__wrapper--menu-image', 'd-lg-none');
        moveInstrumentation(iconImg, newImg);
        menuLinkWrapper.append(optimizedPic);
      }

      const foundLink = linkCell?.querySelector('a');
      const anchor = document.createElement('a');
      anchor.classList.add('text-decoration-none', 'cta-analytics', 'header-comp__wrapper--link');
      if (foundLink) {
        anchor.href = foundLink.href;
      } else {
        anchor.href = '#';
      }
      moveInstrumentation(linkCell, anchor);

      const span = document.createElement('span');
      span.classList.add('link-span');
      span.textContent = labelCell?.textContent.trim() || '';
      anchor.append(span);
      menuLinkWrapper.append(anchor);

      li.append(menuLinkWrapper);
    }
    navList.append(li);
  });

  // Search and Access
  const searchAccessDiv = document.createElement('div');
  searchAccessDiv.classList.add('header-comp__wrapper--search-access', 'd-flex', 'py-4', 'py-lg-0');
  container.append(searchAccessDiv);

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('header-comp__wrapper--search');
  searchAccessDiv.append(searchDiv);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('header-comp__wrapper--search-icon', 'd-flex', 'flex-column', 'align-items-center', 'font-12', 'leading-20', 'text-white');
  searchIconDiv.innerHTML = `
    <img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1776313318142.svg+xml"/>
    <span class="d-none d-lg-block">Search</span>
  `;
  searchDiv.append(searchIconDiv);

  const outerBox = document.createElement('div');
  outerBox.classList.add('header__outer-box', 'position-absolute', 'w-100', 'z-2', 'start-0', 'd-lg-none');
  headerComp.append(outerBox);

  block.replaceWith(headerComp);

  // Search functionality (from original HTML)
  const globalSearch = document.querySelector('.global-search');
  if (globalSearch) {
    searchIconDiv.addEventListener('click', () => {
      globalSearch.classList.toggle('d-none');
    });

    const crossWrap = globalSearch.querySelector('.cross-wrap');
    if (crossWrap) {
      crossWrap.addEventListener('click', () => {
        globalSearch.classList.add('d-none');
      });
    }

    const closeOnClick = globalSearch.querySelector('.close-on-click');
    if (closeOnClick) {
      closeOnClick.addEventListener('click', (e) => {
        if (e.target === closeOnClick) {
          globalSearch.classList.add('d-none');
        }
      });
    }
  }

  // Optimize images
  headerComp.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
