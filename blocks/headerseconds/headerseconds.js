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
      subWrap.classList.add('has-sub-child'); // Use class from ORIGINAL HTML
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
  const [logoRow, logoLinkRow, ...navigationItemRows] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('headerseconds', 'sticky-head');
  moveInstrumentation(block, header);

  const headContainer = document.createElement('div');
  headContainer.classList.add('head-container');

  // Logo and Logo Link
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo');
  logoLink.setAttribute('title', 'Home');
  logoLink.setAttribute('rel', 'home');
  logoLink.id = 'logo';

  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
  }

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '70%' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      moveInstrumentation(img, optimizedImg);
      logoLink.appendChild(optimizedPic);
    }
  }
  headContainer.appendChild(logoLink);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('navigationtwo');

  const toggleLabel = document.createElement('label');
  toggleLabel.setAttribute('for', 'drop');
  toggleLabel.classList.add('toggle');
  const hamburgerInner = document.createElement('div');
  hamburgerInner.classList.add('hamburger-inner');
  toggleLabel.appendChild(hamburgerInner);

  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.id = 'drop';

  const ul = document.createElement('ul');
  ul.classList.add('menu');

  navigationItemRows.forEach((row, rowIndex) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const linkCell = cells[1];
    const hierarchyCell = cells[2];

    const li = document.createElement('li');

    // Check if hierarchyCell contains a <ul> for nested navigation
    const hierarchyRoot = hierarchyCell?.querySelector('ul');

    if (hierarchyRoot) {
      li.classList.add('has-sub'); // Use class from ORIGINAL HTML

      const toggleSubmenuLabel = document.createElement('label');
      toggleSubmenuLabel.setAttribute('for', `drop-${rowIndex + 1}`);
      toggleSubmenuLabel.classList.add('toggle');
      toggleSubmenuLabel.textContent = `${labelCell?.textContent.trim()} +`;

      const submenuAnchor = document.createElement('a');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        submenuAnchor.href = foundLink.href;
      } else {
        submenuAnchor.href = '#';
      }
      submenuAnchor.textContent = labelCell?.textContent.trim() || '';

      const submenuCheckbox = document.createElement('input');
      submenuCheckbox.setAttribute('type', 'checkbox');
      submenuCheckbox.id = `drop-${rowIndex + 1}`;

      li.appendChild(toggleSubmenuLabel);
      li.appendChild(submenuAnchor);
      li.appendChild(submenuCheckbox);

      const subUl = document.createElement('ul');
      // Move instrumentation from the original hierarchyCell to the new subUl
      moveInstrumentation(hierarchyCell, subUl);

      // Preserve the innerHTML structure of the hierarchy cell
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;

      // Apply classes from ORIGINAL HTML to nested elements
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('nav-menu-link')); // Example class, adjust as needed
      tempDiv.querySelectorAll('ul').forEach(ulElem => ulElem.classList.add('sub-menu')); // Example class, adjust as needed
      tempDiv.querySelectorAll('li').forEach(liElem => liElem.classList.add('nav-menu-item')); // Example class, adjust as needed

      // Append children from the temporary div to the subUl
      while (tempDiv.firstChild) {
        subUl.appendChild(tempDiv.firstChild);
      }

      li.appendChild(subUl);
      transformNestedLists(subUl); // Transform the nested list
    } else {
      const anchor = document.createElement('a');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      }
      anchor.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(row, anchor);
      li.appendChild(anchor);
    }
    ul.appendChild(li);
  });

  nav.appendChild(toggleLabel);
  nav.appendChild(checkbox);
  nav.appendChild(ul);

  // Hamburger menu toggle functionality
  toggleLabel.addEventListener('click', () => {
    nav.classList.toggle('active');
    ul.classList.toggle('active');
    hamburgerInner.classList.toggle('is-active');
  });

  ul.querySelectorAll('li.has-sub > .toggle').forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      const input = e.target.nextElementSibling; // The checkbox
      const submenu = input.nextElementSibling; // The <ul>
      if (input && submenu) {
        input.checked = !input.checked;
        submenu.classList.toggle('active', input.checked);
      }
    });
  });

  headContainer.appendChild(nav);
  header.appendChild(headContainer);
  block.replaceWith(header);

  // Image optimization
  header.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
