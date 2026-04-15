import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, level = 0) {
  rootUl.querySelectorAll('li').forEach((li) => {
    // Apply classes from ORIGINAL HTML to li, a, ul elements
    li.classList.add('list-item'); // Assuming 'list-item' is a common class for <li> in menus
    const anchor = li.querySelector(':scope > a');
    if (anchor) {
      anchor.classList.add('nav-menu-item'); // Assuming 'nav-menu-item' for <a>
      moveInstrumentation(li, anchor); // Move instrumentation from li to anchor if anchor exists
    }

    const nested = li.querySelector(':scope > ul');

    // Handle label-only nodes (no anchor)
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
      nested.remove(); // Remove the original ul to re-wrap it

      const subWrap = document.createElement('div');
      subWrap.classList.add(
        level === 0 ? 'has-footer-sub-child' : 'has-footer-inner-sub-child',
      );
      subWrap.append(nested);

      li.append(subWrap);

      // Apply classes to nested ul
      nested.classList.add('footer-inner-list'); // Assuming this class applies to nested uls
      nested.querySelectorAll('li').forEach(nestedLi => nestedLi.classList.add('list-item'));
      nested.querySelectorAll('a').forEach(nestedA => nestedA.classList.add('nav-menu-item'));

      const trigger = li.querySelector(':scope > a, :scope > span');

      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
      transformNestedLists(nested, level + 1);
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Root fields: logo, logo-link, copyright.
  // The item rows for social-links, footer-menu-blocks, secondary-nav follow these.
  const logoRow = children.find(row => row.querySelector('picture'));
  const logoLinkRow = children.find(row => row.querySelector('a') && row !== logoRow); // Find the first <a> that isn't the logo link itself
  const copyrightRow = children.find(row => !row.querySelector('a') && !row.querySelector('picture') && row.textContent.trim().startsWith('Copyright'));

  // Filter out the root rows to get only item rows
  const itemRows = children.filter(row => row !== logoRow && row !== logoLinkRow && row !== copyrightRow);

  block.innerHTML = '';
  block.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  // Footer Header Section
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  container.append(footerHeader);

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeader.append(logoCol);

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo');
  logoCol.append(logoWrapper);

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoLink);
  logoWrapper.append(logoLink);

  // Social Links
  const socialLinksCol = document.createElement('div');
  socialLinksCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialLinksCol);

  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');
  socialLinksCol.append(socialWrap);

  // Social Link Items: 2 cells, first has picture, second has link
  const socialLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('picture') && cells[1].querySelector('a');
  });

  socialLinkItems.forEach((row) => {
    const [iconCell, linkCell] = [...row.children];
    const li = document.createElement('li');

    const iconLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      iconLink.href = foundLink.href;
      iconLink.target = '_blank';
    }
    moveInstrumentation(linkCell, iconLink);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: 'auto' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      iconLink.append(optimizedPic);
    }
    moveInstrumentation(iconCell, iconLink);

    // Add specific classes based on icon alt text, if available
    const imgAlt = iconLink.querySelector('img')?.alt?.toLowerCase();
    if (imgAlt.includes('facebook')) li.classList.add('fb');
    else if (imgAlt.includes('twitter')) li.classList.add('tw');
    else if (imgAlt.includes('instagram')) li.classList.add('inst');
    else if (imgAlt.includes('youtube')) li.classList.add('yt');
    else if (imgAlt.includes('linkedin')) li.classList.add('in');

    li.append(iconLink);
    socialWrap.append(li);
  });

  // Footer Menu Blocks
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBox.append(footerMenuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);

  // Footer Menu Block Items: 4 cells, first two are text/link, third is container (ignored), fourth is richtext (ul)
  const footerMenuBlockItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 4 && !cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[3].querySelector('ul');
  });

  footerMenuBlockItems.forEach((row) => {
    const [blockTitleCell, blockTitleLinkCell, , hierarchyTreeCell] = [...row.children];

    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    footerMenu.append(linkBlocks);

    const head = document.createElement('div');
    head.classList.add('head');
    linkBlocks.append(head);

    const span = document.createElement('span');
    head.append(span);

    const titleLink = document.createElement('a');
    const foundTitleLink = blockTitleLinkCell.querySelector('a');
    if (foundTitleLink) {
      titleLink.href = foundTitleLink.href;
    }
    titleLink.textContent = blockTitleCell.textContent.trim();
    moveInstrumentation(blockTitleLinkCell, titleLink);
    moveInstrumentation(blockTitleCell, titleLink);
    span.append(titleLink);

    const small = document.createElement('small');
    span.append(small);

    // Use innerHTML to preserve nested structure
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
    const hierarchyRoot = tempDiv.querySelector('ul');

    if (hierarchyRoot) {
      hierarchyRoot.classList.add('footer-inner-list');
      // Apply classes to all nested elements
      hierarchyRoot.querySelectorAll('li').forEach(li => li.classList.add('list-item'));
      hierarchyRoot.querySelectorAll('a').forEach(a => a.classList.add('nav-menu-item'));

      head.append(hierarchyRoot);
      moveInstrumentation(hierarchyTreeCell, hierarchyRoot); // Move instrumentation from original cell to the new root ul
      transformNestedLists(hierarchyRoot);

      // Add click listener to the head for mobile accordion behavior
      head.addEventListener('click', () => {
        head.classList.toggle('active');
        hierarchyRoot.classList.toggle('active');
      });
    }
  });

  // Copyright and Secondary Nav
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNavUl);

  // Secondary Nav Items: 3 cells, first two are text/link, third is richtext (ul)
  const secondaryNavItems = itemRows.filter((row) => {
    const cells = [...row.children];
    // Check for 3 cells, first is text, second is link, third is richtext (ul)
    return cells.length === 3 && !cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].querySelector('ul');
  });

  secondaryNavItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children]; // Destructure all 3 cells

    const li = document.createElement('li');
    secondaryNavUl.append(li);

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(linkCell, anchor);
    moveInstrumentation(labelCell, anchor);
    li.append(anchor);

    // Handle the hierarchy-tree for secondary nav items if it exists
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
    const hierarchyRoot = tempDiv.querySelector('ul');

    if (hierarchyRoot) {
      hierarchyRoot.classList.add('footer-inner-list'); // Apply appropriate class
      hierarchyRoot.querySelectorAll('li').forEach(nestedLi => nestedLi.classList.add('list-item'));
      hierarchyRoot.querySelectorAll('a').forEach(nestedA => nestedA.classList.add('nav-menu-item'));

      // Append the nested hierarchy to the current li or a new wrapper
      const subNavWrapper = document.createElement('div');
      subNavWrapper.classList.add('has-footer-sub-child'); // Or another appropriate class
      subNavWrapper.append(hierarchyRoot);
      li.append(subNavWrapper);
      moveInstrumentation(hierarchyTreeCell, subNavWrapper); // Move instrumentation from original cell to the new wrapper
      transformNestedLists(hierarchyRoot, 1); // Transform nested lists within secondary nav
    }
  });

  const copyrightCol = document.createElement('div');
  copyrightCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightCol.textContent = copyrightRow.textContent.trim();
  moveInstrumentation(copyrightRow, copyrightCol);
  copyrightWrap.append(copyrightCol);
}
