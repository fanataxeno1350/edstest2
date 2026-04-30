import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
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
      // No specific class for this wrapper in original HTML, using a generic one
      // If original HTML had a class for nested list wrappers, it should be used here.
      // For now, 'has-sub-child' is a placeholder.
      subWrap.classList.add('has-sub-child');
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
  const header = document.createElement('header');
  header.classList.add('headerseconds');
  // 'sticky-head' is a scroll-state class, not added initially.

  const headContainer = document.createElement('div');
  headContainer.classList.add('head-container');
  header.append(headContainer);

  // Destructure the root rows based on BlockJson model
  const [logoRow, logoLinkRow, ...itemRows] = [...block.children];

  // Logo
  const logoPicture = logoRow.querySelector('picture');
  const logoLink = logoLinkRow.querySelector('a');

  if (logoPicture && logoLink) {
    const logoAnchor = document.createElement('a');
    logoAnchor.classList.add('logo'); // From original HTML
    logoAnchor.href = logoLink.href;
    logoAnchor.title = 'Home';
    logoAnchor.rel = 'home';
    logoAnchor.id = 'logo'; // From original HTML

    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '70%' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoAnchor.append(optimizedPic);
    }
    moveInstrumentation(logoRow, logoAnchor);
    moveInstrumentation(logoLinkRow, logoAnchor);
    headContainer.append(logoAnchor);
  }

  // Navigation
  const nav = document.createElement('nav');
  nav.id = 'cssmenu'; // From original HTML
  const headMobile = document.createElement('div');
  headMobile.id = 'head-mobile';
  const button = document.createElement('div');
  button.classList.add('button'); // From original HTML
  nav.append(headMobile, button);

  const menu = document.createElement('ul');
  menu.classList.add('pull-rights'); // From original HTML

  itemRows.forEach((row) => {
    // Destructure cells for navigation-item
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');

    const foundLink = linkCell?.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
      rootEl.textContent = labelCell?.textContent.trim() || ''; // Label from text cell
    } else {
      rootEl = document.createElement('span'); // Use span if no link is provided
      rootEl.textContent = labelCell?.textContent.trim() || ''; // Label from text cell
    }
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    // Handle hierarchy-tree richtext field
    const hierarchyContentDiv = hierarchyCell; // The cell itself contains the HTML
    const hierarchyRootUl = hierarchyContentDiv?.querySelector('ul');

    if (hierarchyRootUl) {
      li.classList.add('has-sub'); // From original HTML
      const submenuButton = document.createElement('span');
      submenuButton.classList.add('submenu-button'); // From original HTML
      li.prepend(submenuButton);

      const wrapper = document.createElement('ul'); // Nested ul for dropdown
      // No specific class for this wrapper in original HTML, using a generic one.
      // If original HTML had a class for dropdown wrappers, it should be used here.
      // For now, 'nav-dropdown' is a placeholder.
      wrapper.classList.add('nav-dropdown');

      // Move the hierarchyRootUl and its children directly
      // Use innerHTML to get the full HTML content, then parse and move
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Instrument the original cell to the tempDiv

      // Apply classes to elements within the hierarchy-tree based on original HTML
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('nav-menu-link')); // Example class, adjust as needed
      tempDiv.querySelectorAll('li').forEach(liItem => liItem.classList.add('nav-menu-item')); // Example class, adjust as needed
      tempDiv.querySelectorAll('ul').forEach(ulItem => ulItem.classList.add('nav-menu-list')); // Example class, adjust as needed

      while (tempDiv.firstChild) {
        wrapper.append(tempDiv.firstChild);
      }
      li.appendChild(wrapper);

      // Toggle behavior for the submenu
      const toggleHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        wrapper.classList.toggle('active');
      };
      rootEl.addEventListener('click', toggleHandler);
      submenuButton.addEventListener('click', toggleHandler);

      // Recursively transform nested lists within the hierarchy
      transformNestedLists(wrapper); // Pass the wrapper containing the hierarchyRootUl
    }
    menu.appendChild(li);
  });

  nav.append(menu);
  headContainer.append(nav);

  // Mobile menu toggle logic
  button.addEventListener('click', () => {
    menu.classList.toggle('active');
    button.classList.toggle('active');
  });

  // Replace the original block with the new header
  moveInstrumentation(block, header);
  block.replaceWith(header);
}
