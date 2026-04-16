import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Apply classes from ORIGINAL HTML
    li.classList.add('subMenuItem'); // Assuming all top-level <li> in the hierarchy are subMenuItem

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
    } else {
      anchor.classList.add('alProducts'); // Apply class from ORIGINAL HTML
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      // The original HTML shows 'deepSideMenu' for the wrapper around nested ULs
      subWrap.classList.add('deepSideMenu');
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
  const [logoRow, logoLinkRow, ...itemRows] = [...block.children];

  const header = document.createElement('header');
  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const nav = document.createElement('div');
  nav.classList.add('nav');
  container.append(nav);

  const navBar = document.createElement('div');
  navBar.classList.add('navBar');
  nav.append(navBar);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '169' }]);
    moveInstrumentation(logoPicture, optimizedPic);
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);
  navBar.append(logoDiv);

  // Navigation Menu
  const navElement = document.createElement('nav');
  const navList = document.createElement('ul');
  navList.classList.add('navList');
  navElement.append(navList);

  itemRows.forEach((row) => {
    const cells = [...row.children];
    const li = document.createElement('li');

    // Determine item type based on cell count and content
    if (cells.length === 3 && cells[2].querySelector('ul')) {
      // Navigation-Item (label, link, hierarchy-tree)
      const [labelCell, linkCell, hierarchyCell] = cells;

      li.classList.add('navBarItem');
      const foundLink = linkCell.querySelector('a');
      let rootEl;
      if (foundLink) {
        rootEl = document.createElement('a');
        rootEl.href = foundLink.href;
      } else {
        rootEl = document.createElement('span');
      }
      rootEl.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(labelCell, rootEl);
      moveInstrumentation(linkCell, rootEl);
      li.appendChild(rootEl);

      // Handle hierarchy-tree richtext
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML to preserve structure
      moveInstrumentation(hierarchyCell, tempDiv); // Instrument the original cell

      const hierarchyRoot = tempDiv.querySelector('ul');
      if (hierarchyRoot) {
        const submenu = document.createElement('div');
        submenu.classList.add('submenu');
        const submenuContainer = document.createElement('div');
        submenuContainer.classList.add('container');
        const newUl = document.createElement('ul');
        newUl.classList.add('newUl');

        // Apply classes to nested elements from ORIGINAL HTML
        hierarchyRoot.querySelectorAll('li').forEach(item => {
          item.classList.add('subMenuItem');
          const anchor = item.querySelector('a');
          if (anchor) {
            anchor.classList.add('alProducts');
          }
        });

        // Transform the nested list recursively
        transformNestedLists(hierarchyRoot);
        newUl.appendChild(hierarchyRoot);

        submenuContainer.appendChild(newUl);
        submenu.appendChild(submenuContainer);
        li.appendChild(submenu);

        rootEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          submenu.classList.toggle('active');
        });
      }
    } else if (cells.length === 2) {
      // Submenu-Item (label, link) - these are flat links in the original HTML
      const [labelCell, linkCell] = cells;

      li.classList.add('navBarItem');
      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      }
      anchor.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(labelCell, anchor);
      moveInstrumentation(linkCell, anchor);
      li.appendChild(anchor);
    } else if (cells.length === 3 && cells[0].querySelector('picture')) {
      // Deep-Side-Menu-Item (image, label, link)
      const [imageCell, labelCell, linkCell] = cells;

      li.classList.add('deepSideMenuItem');
      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      }

      const imageContainer = document.createElement('div');
      imageContainer.classList.add('imageContainer');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(picture, optimizedPic);
        imageContainer.append(optimizedPic);
      }
      anchor.append(imageContainer);

      const modalName = document.createElement('span');
      modalName.classList.add('modalName');
      modalName.textContent = labelCell?.textContent.trim() || '';
      anchor.append(modalName);

      moveInstrumentation(imageCell, anchor);
      moveInstrumentation(labelCell, anchor);
      moveInstrumentation(linkCell, anchor);
      li.appendChild(anchor);
    }
    navList.append(li);
  });

  navBar.append(navElement);

  // Right Top section (Search Bar)
  const rightTop = document.createElement('div');
  rightTop.classList.add('rightTop');
  const searchBar = document.createElement('div');
  searchBar.classList.add('searchBar');
  const searchIcon = document.createElement('img');
  searchIcon.classList.add('searchIcon');
  searchIcon.alt = 'search-icon.svg';
  searchIcon.height = 20;
  searchIcon.width = 20;
  // The search icon src is hardcoded in the original HTML.
  // To avoid hardcoding and make it configurable, we should ideally have a block field for it.
  // For now, we will assume it's part of the original HTML and extract its src.
  const originalSearchIcon = block.querySelector('.searchIcon');
  if (originalSearchIcon) {
    searchIcon.src = originalSearchIcon.src;
  } else {
    // Fallback or default if not found in original HTML (e.g., from a block field if added later)
    // For this exercise, we'll use the provided src from ORIGINAL HTML as a default if not found in the block.
    searchIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1776316534548.svg+xml';
  }

  searchBar.append(searchIcon);
  rightTop.append(searchBar);
  navBar.append(rightTop);

  block.textContent = '';
  block.append(header);
}
