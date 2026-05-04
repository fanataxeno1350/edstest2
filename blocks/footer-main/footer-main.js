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
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const footerMain = document.createElement('div');
  footerMain.classList.add('container');
  moveInstrumentation(block, footerMain);

  // Fixed fields
  // The first three rows are fixed fields: logo, logoLink, copyrightText
  const logoRow = children[0];
  const logoLinkRow = children[1];
  const copyrightTextRow = children[2];
  const itemRows = children.slice(3); // All subsequent rows are item rows

  // Footer Header Section
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  logoDiv.append(logoLink);
  logoCol.append(logoDiv);
  footerHeader.append(logoCol);

  // Social Links
  const socialLinksCol = document.createElement('div');
  socialLinksCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');

  // Filter for social-link-item: 2 cells, first is link, second is richtext (ul/svg)
  const socialLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('a') && (cells[1].querySelector('ul') || cells[1].querySelector('svg'));
  });

  socialLinkItems.forEach((row) => {
    const [linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.target = '_blank'; // Assuming social links open in new tab
    }

    // The hierarchyCell contains the SVG for the social icon.
    // We need to move its innerHTML content (the SVG) into the anchor.
    moveInstrumentation(hierarchyCell, anchor);
    anchor.innerHTML = hierarchyCell.innerHTML; // Use innerHTML to preserve SVG structure

    li.append(anchor);
    socialWrap.append(li);
    moveInstrumentation(row, li); // Move instrumentation from original row to new li
  });

  socialLinksCol.append(socialWrap);
  footerHeader.append(socialLinksCol);
  footerMain.append(footerHeader);

  // Footer Menu Blocks
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  const menuCol = document.createElement('div');
  menuCol.classList.add('col');
  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  // Filter for footer-menu-block: 3 cells, first is text, second is link, third is text 'Menu Items value'
  const footerMenuBlocks = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].textContent.trim() && cells[1].querySelector('a') && cells[2].textContent.trim() === 'Menu Items value';
  });

  footerMenuBlocks.forEach((row) => {
    const [blockTitleCell, blockTitleLinkCell] = [...row.children];
    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    const head = document.createElement('div');
    head.classList.add('head');

    const span = document.createElement('span');
    const blockTitleLink = document.createElement('a');
    const foundBlockTitleLink = blockTitleLinkCell.querySelector('a');
    if (foundBlockTitleLink) {
      blockTitleLink.href = foundBlockTitleLink.href;
    }
    blockTitleLink.textContent = blockTitleCell.textContent.trim();
    span.append(blockTitleLink);
    head.append(span);

    const footerInnerList = document.createElement('ul');
    footerInnerList.classList.add('footer-inner-list');

    // Filter for footer-menu-item: 3 cells, first is text, second is link, third is richtext (ul)
    const footerMenuItems = itemRows.filter((itemRow) => {
      const cells = [...itemRow.children];
      return cells.length === 3 && cells[0].textContent.trim() && cells[1].querySelector('a') && cells[2].querySelector('ul');
    });

    footerMenuItems.forEach((menuItemRow) => {
      const [labelCell, linkCell, hierarchyCell] = [...menuItemRow.children];
      const li = document.createElement('li');
      const hierarchyRoot = hierarchyCell?.querySelector('ul');

      let rootEl;
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        rootEl = document.createElement('a');
        rootEl.href = foundLink.href;
      } else {
        rootEl = document.createElement('span');
      }
      rootEl.textContent = labelCell?.textContent.trim() || '';
      li.appendChild(rootEl);

      if (hierarchyRoot) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML to get the full UL structure
        moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv

        // Apply classes to nested elements if they exist in the original HTML
        tempDiv.querySelectorAll('a').forEach(a => {
          // No specific classes for <a> in original HTML, but keep this pattern for future
        });
        tempDiv.querySelectorAll('ul').forEach(ul => {
          // No specific classes for <ul> in original HTML, but keep this pattern for future
        });
        tempDiv.querySelectorAll('li').forEach(liElement => {
          // No specific classes for <li> in original HTML, but keep this pattern for future
        });

        const wrapper = document.createElement('div');
        wrapper.classList.add('has-footer-sub-child'); // Use original HTML class
        while (tempDiv.firstChild) {
          wrapper.append(tempDiv.firstChild); // Move all children from tempDiv to wrapper
        }

        rootEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.classList.toggle('active');
          li.classList.toggle('active');
        });
        li.appendChild(wrapper);
        transformNestedLists(wrapper.querySelector('ul')); // Apply transformations to the moved nested list
      }
      footerInnerList.append(li);
      moveInstrumentation(menuItemRow, li);
    });

    head.append(footerInnerList);
    linkBlocks.append(head);
    footerMenu.append(linkBlocks);
    moveInstrumentation(row, linkBlocks);
  });

  menuCol.append(footerMenu);
  footerMenuBox.append(menuCol);
  footerMain.append(footerMenuBox);

  // Copyright and Secondary Nav
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  const secondaryNav = document.createElement('ul');
  secondaryNav.classList.add('secondary-nav');

  // Filter for footer-secondary-nav-item: 2 cells, first is text, second is link
  const secondaryNavItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].textContent.trim() && cells[1].querySelector('a');
  });

  secondaryNavItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);
    secondaryNav.append(li);
    moveInstrumentation(row, li);
  });

  secondaryNavCol.append(secondaryNav);
  copyrightWrap.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = copyrightTextRow.textContent.trim();
  copyrightWrap.append(copyrightTextCol);
  footerMain.append(copyrightWrap);

  block.textContent = '';
  block.append(footerMain);
}
