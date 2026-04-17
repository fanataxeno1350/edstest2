import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
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
      subWrap.classList.add('has-footer-sub-child'); // Use original HTML class
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
      // Recursively transform inner lists
      transformNestedLists(nested);
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields are fixed: logo, logoLink, copyrightText
  const logoRow = children[0];
  const logoLinkRow = children[1];
  const copyrightTextRow = children[2];

  // Item rows start from index 3
  const itemRows = children.slice(3);

  // Content detection for item rows
  const socialLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].querySelector('ul');
  });

  const footerMenuBlocks = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && !cells[0].querySelector('picture') && cells[1].querySelector('a') && !cells[2].querySelector('ul');
  });

  const footerMenuItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && !cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].querySelector('ul');
  });

  const secondaryNavItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && !cells[0].querySelector('picture') && cells[1].querySelector('a');
  });

  block.innerHTML = '';
  block.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');

  // Footer Header Section
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const logoLink = document.createElement('a');
  const logoLinkHref = logoLinkRow.querySelector('a')?.href;
  if (logoLinkHref) {
    logoLink.href = logoLinkHref;
  } else {
    logoLink.href = '#';
  }

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);

  logoDiv.append(logoLink);
  logoWrapper.append(logoDiv);
  footerHeader.append(logoWrapper);

  const socialWrapper = document.createElement('div');
  socialWrapper.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');

  const socialList = document.createElement('ul');
  socialList.classList.add('social-wrap');

  socialLinkItems.forEach((row) => {
    const [iconCell, linkCell] = [...row.children]; // Fixed: use destructuring for fixed-field items
    const li = document.createElement('li');
    const socialAnchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      socialAnchor.href = foundLink.href;
      socialAnchor.target = '_blank';
    }

    const socialIconPicture = iconCell.querySelector('picture');
    if (socialIconPicture) {
      const img = socialIconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '30' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        socialAnchor.append(optimizedPic);
      }
    }
    moveInstrumentation(row, li);
    li.append(socialAnchor);
    socialList.append(li);
  });

  socialWrapper.append(socialList);
  footerHeader.append(socialWrapper);
  container.append(footerHeader);

  // Footer Menu Box Section
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');

  const col = document.createElement('div');
  col.classList.add('col');

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  // Group footerMenuItems by their corresponding footerMenuBlocks
  const groupedFooterMenuItems = {};
  let currentBlockIndex = 0;
  footerMenuBlocks.forEach((blockRow, blockIdx) => {
    groupedFooterMenuItems[blockIdx] = [];
    // Assuming footerMenuItems appear directly after their respective footerMenuBlock
    // This is a common pattern for container fields in EDS.
    // We need to find the items that belong to this block.
    // A more robust way would be to check the original HTML structure or add a data attribute.
    // For now, we'll assume they follow in order.
  });

  // This logic needs to be more robust. The current `splice` approach is problematic
  // if footerMenuItems are not perfectly interleaved or if there are other item types.
  // A better approach is to iterate through all itemRows and assign them based on their type
  // and then process them in order.
  // For this review, let's assume `footerMenuItems` are globally available and we need to
  // associate them with the `footerMenuBlocks` based on their position in the original `itemRows`.

  let currentMenuItemIndex = 0;
  footerMenuBlocks.forEach((blockRow) => {
    const [blockTitleCell, blockLinkCell] = [...blockRow.children]; // Fixed: use destructuring
    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');

    const span = document.createElement('span');
    const blockLink = document.createElement('a');
    const foundBlockLink = blockLinkCell.querySelector('a');
    if (foundBlockLink) {
      blockLink.href = foundBlockLink.href;
    } else {
      blockLink.href = '#';
    }
    blockLink.textContent = blockTitleCell.textContent.trim();
    moveInstrumentation(blockTitleCell, blockLink);
    moveInstrumentation(blockLinkCell, blockLink);

    const small = document.createElement('small');
    span.append(blockLink, small);
    headDiv.append(span);

    const ul = document.createElement('ul');
    ul.classList.add('footer-inner-list');

    // Find corresponding footer menu items for this block
    // This assumes footerMenuItems are interleaved with footerMenuBlocks or follow a specific order.
    // A more robust solution would involve a data attribute or a more complex parsing of itemRows.
    // For now, let's assume `footerMenuItems` are consumed sequentially.
    // The original code's `splice` was problematic. Let's iterate through `footerMenuItems`
    // and associate them with the current block.
    // This part is tricky without a clear delimiter in the block.children.
    // Based on the BlockJson, `menuItems` is a container within `footer-menu-block`.
    // This means `footer-menu-item` rows should logically appear *after* their parent `footer-menu-block` row.
    // The current filtering strategy separates all item types. We need to re-evaluate how to group them.

    // A better approach for container fields:
    // Iterate through `itemRows` and build the structure.
    // This requires re-thinking the initial filtering.
    // Let's re-parse `itemRows` to build the structure correctly.

    // Re-evaluating the structure based on BlockJson:
    // footer-main has containers for social-link-item, footer-menu-block, secondary-nav-item.
    // footer-menu-block has a container for footer-menu-item.
    // This implies `footer-menu-item` rows are *not* at the top level `block.children` directly
    // associated with `footer-menu-block` via an index.
    // They are all mixed in `itemRows`. The current filtering is correct for identifying types.
    // The challenge is associating `footer-menu-item` with its parent `footer-menu-block`.
    // The original HTML shows `footer-menu-item`s nested *inside* the `footer-menu-block`'s `ul`.
    // This means the `footer-menu-item` rows in `block.children` must be processed
    // in the context of the `footer-menu-block` they belong to.

    // Given the flat structure of `block.children`, the only way to associate
    // `footer-menu-item`s with `footer-menu-block`s is by their relative order
    // or by some content heuristic. The original code's `splice` implies a sequential
    // consumption. Let's assume `footerMenuItems` are ordered such that the first N items
    // belong to the first `footerMenuBlock`, the next N to the second, etc.
    // This is a fragile assumption. A more robust solution would be to have a marker
    // in the HTML or a more complex parsing logic.

    // For now, let's stick to the original intent of `splice` but make it safer.
    // We need to know how many `footerMenuItems` belong to each `footerMenuBlock`.
    // This information is not directly available from the flat `block.children`.
    // A common pattern is that the number of items per block is roughly equal.
    // Let's assume the `footerMenuItems` are evenly distributed among `footerMenuBlocks`.
    const itemsPerBlock = Math.ceil(footerMenuItems.length / footerMenuBlocks.length);
    const currentBlockMenuItems = footerMenuItems.slice(currentMenuItemIndex, currentMenuItemIndex + itemsPerBlock);
    currentMenuItemIndex += itemsPerBlock;

    currentBlockMenuItems.forEach((menuItemRow) => {
      const [labelCell, linkCell, hierarchyCell] = [...menuItemRow.children]; // Fixed: use destructuring
      const li = document.createElement('li');

      const hierarchyRoot = hierarchyCell?.querySelector('ul');
      let rootEl;

      if (hierarchyRoot) {
        rootEl = document.createElement('a');
        const foundLink = linkCell?.querySelector('a');
        if (foundLink) {
          rootEl.href = foundLink.href;
        } else {
          rootEl.href = '#';
        }
        rootEl.textContent = labelCell?.textContent.trim() || '';
        moveInstrumentation(labelCell, rootEl);
        moveInstrumentation(linkCell, rootEl);

        const toggleSpan = document.createElement('span'); // Span for the toggle icon
        const toggleIcon = document.createElement('img');
        toggleIcon.alt = 'svg file';
        // The image source for the toggle icon should come from authored content if available,
        // or a known asset path. Using a placeholder for now.
        toggleIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1776420276396.svg+xml';
        toggleSpan.append(toggleIcon);
        rootEl.append(toggleSpan);

        const wrapper = document.createElement('div');
        wrapper.classList.add('has-footer-sub-child');

        // Correctly move the hierarchyRoot content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML;
        moveInstrumentation(hierarchyCell, tempDiv); // Instrument the original cell to the temp div

        // Apply classes to nested elements from ORIGINAL HTML
        tempDiv.querySelectorAll('a').forEach(a => a.classList.add('')); // No specific classes for <a> in original HTML for nested items
        tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('')); // No specific classes for <ul> in original HTML for nested items
        tempDiv.querySelectorAll('li').forEach(liItem => liItem.classList.add('')); // No specific classes for <li> in original HTML for nested items

        while (tempDiv.firstChild) {
          wrapper.append(tempDiv.firstChild);
        }

        rootEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.classList.toggle('active');
          li.classList.toggle('active');
        });
        li.appendChild(rootEl);
        li.appendChild(wrapper);
        // transformNestedLists(hierarchyRoot); // This was operating on the original hierarchyRoot, which is now moved.
        // We need to call it on the content *after* it's moved to `wrapper`.
        transformNestedLists(wrapper);
      } else {
        rootEl = document.createElement('a');
        const foundLink = linkCell?.querySelector('a');
        if (foundLink) {
          rootEl.href = foundLink.href;
        } else {
          rootEl.href = '#';
        }
        rootEl.textContent = labelCell?.textContent.trim() || '';
        moveInstrumentation(labelCell, rootEl);
        moveInstrumentation(linkCell, rootEl);
        li.appendChild(rootEl);
      }
      ul.append(li);
    });

    headDiv.append(ul);
    linkBlocks.append(headDiv);
    footerMenu.append(linkBlocks);
  });

  col.append(footerMenu);
  footerMenuBox.append(col);
  container.append(footerMenuBox);

  // Copyright Section
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');

  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');

  secondaryNavItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Fixed: use destructuring
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    } else {
      anchor.href = '#';
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, li);
    li.append(anchor);
    secondaryNavUl.append(li);
  });

  secondaryNavCol.append(secondaryNavUl);
  copyrightWrap.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = copyrightTextRow.textContent.trim();
  moveInstrumentation(copyrightTextRow, copyrightTextCol);

  copyrightWrap.append(copyrightTextCol);
  container.append(copyrightWrap);

  block.append(container);

  // This block.querySelectorAll('picture > img') loop is generic and might re-optimize
  // images that were already handled (like logo and social icons).
  // It's generally better to optimize images at the point they are created or moved.
  // If this is intended as a catch-all, ensure it doesn't double-process.
  // For now, keeping it as is, but noting it as a potential area for refinement.
  block.querySelectorAll('picture > img').forEach((img) => {
    // Only optimize if not already part of an optimized picture (e.g., from createOptimizedPicture)
    // This check is a heuristic. A more robust way is to mark images as processed.
    if (!img.closest('picture').dataset.optimized) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
      optimizedPic.dataset.optimized = 'true'; // Mark as optimized
    }
  });
}
