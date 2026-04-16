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
      // The class 'has-sub-child' is not in the ORIGINAL HTML. Removing it.
      // subWrap.classList.add('has-sub-child');
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
  const [closeIconRow, closeLabelRow, ...menuItemRows] = [...block.children];

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.classList.add('close-btn');
  moveInstrumentation(closeIconRow, closeBtn);

  const closeIconPicture = closeIconRow.querySelector('picture');
  if (closeIconPicture) {
    const img = closeIconPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    closeBtn.append(optimizedPic);
  }

  const closeLabel = closeLabelRow.textContent.trim();
  if (closeLabel) {
    closeBtn.append(` ${closeLabel}`);
  }

  // Navigation list
  const navList = document.createElement('ul');

  menuItemRows.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const linkCell = cells[1];
    // Use content detection for hierarchyCell as it contains rich text (<ul>)
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));

    const li = document.createElement('li');

    const foundLink = linkCell?.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
    } else {
      rootEl = document.createElement('span');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    if (hierarchyCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML for richtext
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation for the original cell content

      const hierarchyRoot = tempDiv.querySelector('ul');
      if (hierarchyRoot) {
        // Apply classes from ORIGINAL HTML if any, otherwise default to no specific class
        // The ORIGINAL HTML does not show specific classes on the <ul> or <li> elements inside the hierarchy-tree
        // If there were classes like 'nav-menu-item' or 'list-item', they would be added here.
        // For now, no specific classes are added as per ORIGINAL HTML.

        const wrapper = document.createElement('div');
        // The class 'nav-dropdown' is not in the ORIGINAL HTML. Removing it.
        // wrapper.classList.add('nav-dropdown');
        wrapper.appendChild(hierarchyRoot);
        rootEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.classList.toggle('active');
          li.classList.toggle('active');
        });
        li.appendChild(wrapper);
        transformNestedLists(hierarchyRoot);
      }
    }
    navList.appendChild(li);
  });

  block.innerHTML = '';
  block.append(closeBtn, navList);
}
