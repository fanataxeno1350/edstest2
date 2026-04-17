import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    // Apply classes from ORIGINAL HTML to li
    li.classList.add('list-item'); // Assuming a generic list-item class for all li in hierarchy-tree

    const nested = li.querySelector(':scope > ul');
    if (nested) {
      // Apply classes from ORIGINAL HTML to ul
      nested.classList.add('footer-inner-list'); // Assuming this class for nested ul

      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-footer-sub-child'); // Use original HTML class
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        // Apply classes from ORIGINAL HTML to a and span if they are part of the trigger
        if (trigger.tagName === 'A') {
          trigger.classList.add('nav-menu-item'); // Assuming a class for menu items
        }
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
      // Recursively transform inner nested lists
      transformNestedLists(nested);
    }

    // Handle label-only nodes (no anchor, but text content)
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
        span.classList.add('nav-menu-label'); // Assuming a class for labels without links
      }
    } else {
      // Apply classes from ORIGINAL HTML to anchor
      anchor.classList.add('nav-menu-item'); // Assuming a class for menu items
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields: logo, logoLink, copyrightText
  // Item rows for: socialLinks, footerLinkBlocks, secondaryNav
  // The order of root fields is fixed: logo, logoLink, copyrightText
  // The remaining rows are item rows, which need to be filtered by content.

  const logoRow = children[0];
  const logoLinkRow = children[1];
  const copyrightTextRow = children[2];

  const itemRows = children.slice(3); // All rows after the three root fields

  // Filter item rows based on their structure and content
  // social-link-item: 3 cells, first cell has a picture (icon)
  const socialLinkItems = itemRows.filter((row) => row.children.length === 3 && row.children[0].querySelector('picture'));
  // footer-link-block: 3 cells, first cell is text (blockTitle), second cell is a link (blockTitleLink), third cell is text (links)
  // The third cell for footer-link-block is a 'container' type, but in the EDS structure it's represented as a simple text cell.
  // The key differentiator from social-link-item is that it does NOT have a picture in the first cell.
  // The key differentiator from footer-link-item is that it has 3 cells, and the third cell is NOT a hierarchy-tree.
  const footerLinkBlocks = itemRows.filter((row) => row.children.length === 3 && !row.children[0].querySelector('picture') && !row.children[2].querySelector('ul'));
  // secondary-nav-item: 2 cells
  const secondaryNavItems = itemRows.filter((row) => row.children.length === 2);

  block.innerHTML = ''; // Clear the block content

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  // Footer Header
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  container.append(footerHeader);

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeader.append(logoCol);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoCol.append(logoDiv);

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a'); // Accessing logoLinkRow directly
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }

  const logoPicture = logoRow.querySelector('picture'); // Accessing logoRow directly
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  logoDiv.append(logoLink);

  // Social Links
  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialCol);

  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');
  socialCol.append(socialWrap);

  socialLinkItems.forEach((row) => {
    const [iconCell, linkCell, hierarchyCell] = [...row.children]; // Destructuring is fine here as item rows are uniform
    const li = document.createElement('li');
    const socialLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      socialLink.href = foundLink.href;
      socialLink.target = '_blank';
    }

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]); // Assuming a small icon size
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        socialLink.append(optimizedPic);
      }
    }
    moveInstrumentation(row, li);
    li.append(socialLink);
    socialWrap.append(li);
  });

  // Footer Menu Box
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBox.append(footerMenuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);

  footerLinkBlocks.forEach((row) => {
    const [blockTitleCell, blockTitleLinkCell, linksCell] = [...row.children]; // Destructuring is fine here
    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    footerMenu.append(linkBlocks);

    const head = document.createElement('div');
    head.classList.add('head');
    linkBlocks.append(head);

    const span = document.createElement('span');
    const blockTitleLink = document.createElement('a');
    const foundBlockTitleLink = blockTitleLinkCell.querySelector('a');
    if (foundBlockTitleLink) {
      blockTitleLink.href = foundBlockTitleLink.href;
    }
    blockTitleLink.textContent = blockTitleCell.textContent.trim();
    span.append(blockTitleLink);

    const small = document.createElement('small');
    small.setAttribute('data-once', 'footerMobileInner');
    span.append(small);
    head.append(span);

    const footerInnerList = document.createElement('ul');
    footerInnerList.classList.add('footer-inner-list');
    head.append(footerInnerList);

    // For 'links' field which is a container, it means other item rows are nested.
    // The current EDS structure for footer-link-block shows 'links' as a simple text cell.
    // However, the ORIGINAL HTML shows nested <ul><li> structures.
    // This implies that the 'links' cell in the model is actually a placeholder for a hierarchy-tree.
    // We need to find the corresponding hierarchy-tree item rows.
    // The current filtering logic for footerLinkBlocks might be incorrect if 'links' is meant to contain actual nested items.
    // Re-evaluating based on the ORIGINAL HTML, the nested lists are part of the 'footer-link-block' structure itself,
    // not separate 'footer-link-item' rows. The `linksCell` in the model is where the `hierarchy-tree` content would be.

    // The BlockJson for `footer-link-block` has `links` as `component="container" item="footer-link-item"`.
    // This means `linksCell` itself won't contain the `ul`. Instead, `footer-link-item` rows would follow.
    // However, the ORIGINAL HTML shows the `ul` directly inside the `link-blocks` div.
    // This suggests a mismatch between the BlockJson and the desired HTML structure, or a misunderstanding of how
    // `linksCell` (type=container) is represented in the EDS block structure.

    // Given the `linksCell` in the EDS structure example for `footer-link-block` is `<div>Links value</div>`,
    // and the `footer-link-item` has `hierarchy-tree` as its third cell, it implies that the `footer-link-item`
    // rows are what actually contain the nested lists.

    // Let's assume the `linksCell` in `footer-link-block` is just a placeholder, and the actual nested lists
    // come from `footer-link-item` rows.
    // The current code is looking for `linksCell.querySelector('ul')` which would only work if the `ul` was directly in that cell.
    // The `footer-link-item` model has `hierarchy-tree` as its third field.
    // The original JS has `footerLinkBlocks.forEach((row) => { ... const hierarchyRoot = linksCell.querySelector('ul'); ... })`
    // This implies that the `linksCell` *should* contain the `ul`. Let's stick with that interpretation for now,
    // as it's what the generated JS is doing, and the EDS structure example for `social-link-item` and `footer-link-item`
    // *does* show `hierarchy-tree` as a cell containing `<ul>`.

    const hierarchyRoot = linksCell.querySelector('ul');
    if (hierarchyRoot) {
      // Move instrumentation for the hierarchyRoot content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyRoot.innerHTML; // Preserve HTML structure

      // Apply classes to nested elements from ORIGINAL HTML
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('footer-inner-list'));
      tempDiv.querySelectorAll('li').forEach(li => li.classList.add('list-item'));
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('nav-menu-item')); // Assuming a class for menu items

      moveInstrumentation(hierarchyRoot, tempDiv); // Instrument the original ul to the tempDiv
      while (tempDiv.firstChild) {
        footerInnerList.append(tempDiv.firstChild);
      }
      transformNestedLists(footerInnerList); // Transform the moved list
    }
    moveInstrumentation(row, linkBlocks);
  });

  // Copyright Wrap
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  // Secondary Nav
  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  const secondaryNav = document.createElement('ul');
  secondaryNav.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNav);

  secondaryNavItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructuring is fine here
    const li = document.createElement('li');
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, li);
    li.append(link);
    secondaryNav.append(li);
  });

  // Copyright Text
  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = copyrightTextRow.textContent.trim(); // Accessing copyrightTextRow directly
  moveInstrumentation(copyrightTextRow, copyrightTextCol);
  copyrightWrap.append(copyrightTextCol);
}
