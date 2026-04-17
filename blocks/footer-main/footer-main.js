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
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Identify root fields based on their known structure
  const logoRow = children.find((row) => row.children.length === 1 && row.querySelector('picture'));
  const logoLinkRow = children.find((row) => row.children.length === 1 && row.querySelector('a') && row !== logoRow);
  const copyrightRow = children.find((row) => row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a'));

  // Filter out root fields to get item rows
  const itemRows = children.filter(
    (row) => row !== logoRow && row !== logoLinkRow && row !== copyrightRow,
  );

  // Categorize item rows based on cell count and content
  const footerSocialLinks = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].querySelector('ul');
  });

  const footerLinkBlocks = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && !cells[0].querySelector('picture') && cells[1].querySelector('a') && !cells[2].querySelector('picture') && !cells[2].querySelector('a') && cells[2].textContent.trim() === 'Footer Link Items value';
  });

  const footerLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 4 && !cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].querySelector('picture') && cells[3].querySelector('ul');
  });

  const footerSecondaryNavItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && !cells[0].querySelector('picture') && cells[1].querySelector('a');
  });

  block.innerHTML = ''; // Clear block content

  const container = document.createElement('div');
  container.classList.add('container');

  // Footer Header
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const logoAnchor = document.createElement('a');
  const logoLink = logoLinkRow ? logoLinkRow.querySelector('a') : null;
  if (logoLink) {
    logoAnchor.href = logoLink.href;
  }

  const logoPicture = logoRow ? logoRow.querySelector('picture') : null;
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoAnchor.append(optimizedPic);
  }
  logoDiv.append(logoAnchor);
  if (logoRow) moveInstrumentation(logoRow, logoDiv);
  if (logoLinkRow) moveInstrumentation(logoLinkRow, logoAnchor);
  logoCol.append(logoDiv);
  footerHeader.append(logoCol);

  // Social Links
  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');

  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');

  footerSocialLinks.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    // The third cell is hierarchy-tree, but not used for social links directly in this rendering.

    const li = document.createElement('li');
    const socialLink = document.createElement('a');
    const foundLink = linkCell ? linkCell.querySelector('a') : null;
    if (foundLink) {
      socialLink.href = foundLink.href;
      socialLink.target = '_blank'; // Assuming social links open in new tab
    }

    const iconPicture = iconCell ? iconCell.querySelector('picture') : null;
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '30' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      socialLink.append(optimizedPic);
    }

    li.append(socialLink);
    socialUl.append(li);
    moveInstrumentation(row, li);
  });
  socialCol.append(socialUl);
  footerHeader.append(socialCol);
  container.append(footerHeader);

  // Footer Menu Blocks
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  const linkBlocksContainer = document.createElement('div');
  linkBlocksContainer.classList.add('link-blocks-container'); // Custom wrapper for link blocks

  // Create a mutable copy of footerLinkItems to slice from
  const remainingFooterLinkItems = [...footerLinkItems];

  footerLinkBlocks.forEach((row) => {
    const cells = [...row.children];
    const headingCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== 'Footer Link Items value');
    const headingLinkCell = cells.find(cell => cell.querySelector('a'));
    // The third cell is the container placeholder for footerLinkItems

    const linkBlock = document.createElement('div');
    linkBlock.classList.add('link-blocks');

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');

    const span = document.createElement('span');
    const headingAnchor = document.createElement('a');
    const foundHeadingLink = headingLinkCell ? headingLinkCell.querySelector('a') : null;
    if (foundHeadingLink) {
      headingAnchor.href = foundHeadingLink.href;
    }
    headingAnchor.textContent = headingCell ? headingCell.textContent.trim() : '';
    span.append(headingAnchor);

    const small = document.createElement('small');
    span.append(small);
    headDiv.append(span);

    const ul = document.createElement('ul');
    ul.classList.add('footer-inner-list');

    // Determine how many items belong to this block. This assumes an even distribution
    // or that the items are ordered correctly in the HTML.
    // A more robust solution might involve a unique identifier in the model.
    const itemsPerBlock = Math.ceil(remainingFooterLinkItems.length / footerLinkBlocks.length);
    const currentBlockLinkItems = remainingFooterLinkItems.splice(0, itemsPerBlock);

    currentBlockLinkItems.forEach((itemRow) => {
      const itemCells = [...itemRow.children];
      const labelCell = itemCells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && !cell.querySelector('ul'));
      const linkCell = itemCells.find(cell => cell.querySelector('a'));
      const iconCell = itemCells.find(cell => cell.querySelector('picture'));
      const hierarchyCell = itemCells.find(cell => cell.querySelector('ul'));

      const li = document.createElement('li');

      const foundLink = linkCell ? linkCell.querySelector('a') : null;
      let rootEl;
      if (foundLink) {
        rootEl = document.createElement('a');
        rootEl.href = foundLink.href;
      } else {
        rootEl = document.createElement('span');
      }
      rootEl.textContent = labelCell ? labelCell.textContent.trim() : '';
      moveInstrumentation(itemRow, rootEl);
      li.appendChild(rootEl);

      const iconPicture = iconCell ? iconCell.querySelector('picture') : null;
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        const iconSpan = document.createElement('span');
        iconSpan.append(optimizedPic);
        li.append(iconSpan);
      }

      if (hierarchyCell) {
        const hierarchyRoot = hierarchyCell.querySelector('ul');
        if (hierarchyRoot) {
          const wrapper = document.createElement('div');
          wrapper.classList.add('has-footer-sub-child'); // Use ORIGINAL HTML class
          
          // Move instrumentation from the original hierarchy cell to the new wrapper
          moveInstrumentation(hierarchyCell, wrapper);

          // Append the hierarchyRoot's children to a temporary div to apply classes
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = hierarchyCell.innerHTML;

          // Apply classes from ORIGINAL HTML to nested elements
          tempDiv.querySelectorAll('a').forEach(a => {
            // No specific classes for <a> in ORIGINAL HTML example, but keep this for future
          });
          tempDiv.querySelectorAll('ul').forEach(ulEl => {
            // No specific classes for <ul> in ORIGINAL HTML example, but keep this for future
          });
          tempDiv.querySelectorAll('li').forEach(liEl => {
            // No specific classes for <li> in ORIGINAL HTML example, but keep this for future
          });

          // Move content from tempDiv to wrapper
          while (tempDiv.firstChild) {
            wrapper.append(tempDiv.firstChild);
          }

          rootEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            wrapper.classList.toggle('active');
            li.classList.toggle('active');
          });
          li.appendChild(wrapper);
          transformNestedLists(hierarchyRoot); // Recursively transform nested lists
        }
      }
      ul.append(li);
    });

    linkBlock.append(headDiv, ul);
    linkBlocksContainer.append(linkBlock);
    moveInstrumentation(row, linkBlock);
  });

  footerMenu.append(linkBlocksContainer);
  footerMenuCol.append(footerMenu);
  footerMenuBox.append(footerMenuCol);
  container.append(footerMenuBox);

  // Copyright and Secondary Nav
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');

  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');

  footerSecondaryNavItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell ? linkCell.querySelector('a') : null;
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell ? labelCell.textContent.trim() : '';
    li.append(anchor);
    secondaryNavUl.append(li);
    moveInstrumentation(row, li);
  });
  secondaryNavCol.append(secondaryNavUl);
  copyrightWrap.append(secondaryNavCol);

  const copyrightCol = document.createElement('div');
  copyrightCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightCol.textContent = copyrightRow ? copyrightRow.textContent.trim() : '';
  if (copyrightRow) moveInstrumentation(copyrightRow, copyrightCol);
  copyrightWrap.append(copyrightCol);
  container.append(copyrightWrap);

  block.append(container);

  // Optimize all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
