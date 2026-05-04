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
      subWrap.classList.add('has-footer-sub-child');
      subWrap.append(nested);
      li.append(subWrap);

      // Apply classes from original HTML to nested elements
      nested.querySelectorAll('a').forEach(a => a.classList.add('nav-menu-item-link')); // Example, adjust based on actual original HTML
      nested.querySelectorAll('li').forEach(liItem => liItem.classList.add('nav-menu-item')); // Example, adjust based on actual original HTML

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

  // Destructure the first three known rows
  const [logoRow, logoLinkRow, copyrightTextRow, ...itemRows] = children;

  block.innerHTML = '';
  block.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  container.append(footerHeader);

  // Logo Section
  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeader.append(logoCol);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoCol.append(logoDiv);

  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('hiddenlogo1');
    }
  }
  moveInstrumentation(logoRow, logoDiv);

  // Social Links Section
  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialCol);

  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');
  socialCol.append(socialWrap);

  // Filter for social-link-item: 2 cells, second cell contains a richtext ul
  const socialLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[1].querySelector('ul');
  });

  socialLinkItems.forEach((row) => {
    const [linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    const socialLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      socialLink.href = foundLink.href;
      socialLink.target = '_blank'; // Add target blank as per original HTML
    }
    moveInstrumentation(linkCell, socialLink);

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyCell.innerHTML; // Read richtext content
    moveInstrumentation(hierarchyCell, tempDiv);

    const svg = tempDiv.querySelector('svg');
    if (svg) {
      socialLink.append(svg);
    } else {
      // Fallback if no SVG is found in the richtext, maybe use text or an empty link
      socialLink.textContent = 'Social Link'; // Placeholder
    }
    li.append(socialLink);
    socialWrap.append(li);
    moveInstrumentation(row, li);
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

  // Filter for footer-link-section: 3 cells, first cell is text, second is a link, third is a container placeholder
  const footerLinkSections = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && !cells[0].querySelector('a') && cells[1].querySelector('a') && !cells[2].querySelector('ul');
  });

  footerLinkSections.forEach((row) => {
    const [sectionLabelCell, sectionLinkCell, sectionLinksContainerCell] = [...row.children];
    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    footerMenu.append(linkBlocks);

    const head = document.createElement('div');
    head.classList.add('head');
    linkBlocks.append(head);

    const span = document.createElement('span');
    head.append(span);

    const sectionLink = document.createElement('a');
    const foundSectionLink = sectionLinkCell.querySelector('a');
    if (foundSectionLink) {
      sectionLink.href = foundSectionLink.href;
    }
    sectionLink.textContent = sectionLabelCell.textContent.trim();
    moveInstrumentation(sectionLinkCell, sectionLink);
    span.append(sectionLink);

    const small = document.createElement('small');
    span.append(small);

    const ul = document.createElement('ul');
    ul.classList.add('footer-inner-list');
    head.append(ul);

    // Filter for footer-link-item: 3 cells, first is text, second is a link, third is a richtext ul
    const footerLinkItems = itemRows.filter((itemRow) => {
      const cells = [...itemRow.children];
      return cells.length === 3 && !cells[0].querySelector('a') && cells[1].querySelector('a') && cells[2].querySelector('ul');
    });

    footerLinkItems.forEach((itemRow) => {
      const [labelCell, linkCell, hierarchyCell] = [...itemRow.children];
      const li = document.createElement('li');
      let rootEl;

      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        rootEl = document.createElement('a');
        rootEl.href = foundLink.href;
      } else {
        rootEl = document.createElement('span');
      }
      rootEl.textContent = labelCell.textContent.trim();
      moveInstrumentation(linkCell, rootEl);
      li.appendChild(rootEl);

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML; // Read richtext content
      moveInstrumentation(hierarchyCell, tempDiv);

      const hierarchyRoot = tempDiv.querySelector('ul');
      if (hierarchyRoot) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('has-footer-sub-child');
        wrapper.appendChild(hierarchyRoot);

        // Apply classes from original HTML to nested elements
        hierarchyRoot.querySelectorAll('a').forEach(a => {
          if (!a.classList.contains('nav-menu-item-link')) a.classList.add('nav-menu-item-link');
        });
        hierarchyRoot.querySelectorAll('li').forEach(liItem => {
          if (!liItem.classList.contains('nav-menu-item')) liItem.classList.add('nav-menu-item');
        });

        rootEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.classList.toggle('active');
          li.classList.toggle('active');
        });
        li.appendChild(wrapper);
        transformNestedLists(hierarchyRoot);
      }
      ul.appendChild(li);
      moveInstrumentation(itemRow, li);
    });
    moveInstrumentation(row, linkBlocks);
  });

  // Copyright and Secondary Nav
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  const secondaryNav = document.createElement('ul');
  secondaryNav.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNav);

  // Filter for secondary-nav-item: 2 cells, first is text, second is a link, and no richtext ul
  const secondaryNavItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && !cells[0].querySelector('a') && cells[1].querySelector('a') && !cells[1].querySelector('ul');
  });

  secondaryNavItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(linkCell, link);
    li.append(link);
    secondaryNav.append(li);
    moveInstrumentation(row, li);
  });

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = copyrightTextRow.textContent.trim();
  moveInstrumentation(copyrightTextRow, copyrightTextCol);
  copyrightWrap.append(copyrightTextCol);
}
