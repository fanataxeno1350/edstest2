import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    // Handle label-only nodes
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

  // Root fields: logo, logo-link, copyright-text
  const logoRow = children.find((row) => row.querySelector('picture'));
  const logoLinkRow = children.find((row) => row.querySelector('a') && !row.querySelector('picture'));
  const copyrightTextRow = children.find((row) => !row.querySelector('a') && !row.querySelector('picture') && row.textContent.trim().startsWith('Copyright'));

  const itemRows = children.filter((row) => row !== logoRow && row !== logoLinkRow && row !== copyrightTextRow);

  const socialLinkRows = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));
  const menuBlockRows = itemRows.filter((row) => row.children.length === 4);
  const secondaryNavRows = itemRows.filter((row) => row.children.length === 3 && !row.querySelector('picture'));

  block.innerHTML = '';
  block.classList.add('footer-main');

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  // Footer Header Section
  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');
  container.append(footerHeader);

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');
  footerHeader.append(logoWrapper);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  logoWrapper.append(logoDiv);

  const logoLink = document.createElement('a');
  if (logoLinkRow) { // Ensure logoLinkRow exists before querying
    const foundLogoLink = logoLinkRow.querySelector('a');
    if (foundLogoLink) {
      logoLink.href = foundLogoLink.href;
    }
    moveInstrumentation(logoLinkRow, logoLink);
  }
  logoDiv.append(logoLink);

  if (logoRow) { // Ensure logoRow exists before querying
    const logoPicture = logoRow.querySelector('picture');
    if (logoPicture) {
      const img = logoPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
        moveInstrumentation(img.closest('picture'), optimizedPic.querySelector('img'));
        logoLink.append(optimizedPic);
      }
    }
  }

  // Social Links
  const socialWrapCol = document.createElement('div');
  socialWrapCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialWrapCol);

  if (socialLinkRows.length > 0) {
    const socialWrap = document.createElement('ul');
    socialWrap.classList.add('social-wrap');
    socialWrapCol.append(socialWrap);

    socialLinkRows.forEach((row) => {
      const [iconCell, linkCell] = [...row.children];

      const li = document.createElement('li');
      const socialAnchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        socialAnchor.href = foundLink.href;
        socialAnchor.target = '_blank';
      }
      moveInstrumentation(linkCell, socialAnchor);

      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '32' }]);
          moveInstrumentation(img.closest('picture'), optimizedPic.querySelector('img'));
          socialAnchor.append(optimizedPic);
        }
      }
      li.append(socialAnchor);
      socialWrap.append(li);
      moveInstrumentation(row, li);
    });
  }

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

  menuBlockRows.forEach((row) => {
    // blockTitleCell is type=text, blockLinkCell is type=aem-content, third cell is container, hierarchyTreeCell is type=richtext
    const blockTitleCell = [...row.children].find((cell) => !cell.querySelector('a') && !cell.querySelector('picture') && cell.textContent.trim() !== '' && cell.nextElementSibling?.querySelector('a'));
    const blockLinkCell = [...row.children].find((cell) => cell.querySelector('a') && cell.previousElementSibling === blockTitleCell);
    const hierarchyTreeCell = [...row.children].find((cell) => cell.querySelector('ul'));

    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    footerMenu.append(linkBlocks);

    const head = document.createElement('div');
    head.classList.add('head');
    linkBlocks.append(head);

    const headSpan = document.createElement('span');
    head.append(headSpan);

    const blockAnchor = document.createElement('a');
    if (blockLinkCell) { // Ensure blockLinkCell exists
      const foundBlockLink = blockLinkCell.querySelector('a');
      if (foundBlockLink) {
        blockAnchor.href = foundBlockLink.href;
      }
      moveInstrumentation(blockLinkCell, blockAnchor);
    }
    if (blockTitleCell) { // Ensure blockTitleCell exists
      blockAnchor.textContent = blockTitleCell.textContent.trim();
    }
    headSpan.append(blockAnchor);

    const small = document.createElement('small');
    small.setAttribute('data-once', 'footerMobileInner');
    headSpan.append(small);

    if (hierarchyTreeCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      const hierarchyRoot = tempDiv.querySelector('ul');
      if (hierarchyRoot) {
        hierarchyRoot.classList.add('footer-inner-list');
        // Apply classes from original HTML to nested elements
        hierarchyRoot.querySelectorAll('a').forEach(a => {
          // No specific class to add to <a> from original HTML in this context
        });
        hierarchyRoot.querySelectorAll('li').forEach(li => {
          // No specific class to add to <li> from original HTML in this context
        });
        hierarchyRoot.querySelectorAll('ul').forEach(ul => {
          // No specific class to add to <ul> from original HTML in this context
        });

        head.append(hierarchyRoot);
        transformNestedLists(hierarchyRoot);
      }
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from original cell to tempDiv
    }
    moveInstrumentation(row, linkBlocks);
  });

  // Copyright Section
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  if (secondaryNavRows.length > 0) {
    const secondaryNav = document.createElement('ul');
    secondaryNav.classList.add('secondary-nav');
    secondaryNavCol.append(secondaryNav);

    secondaryNavRows.forEach((row) => {
      const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];

      const li = document.createElement('li');
      const foundLink = linkCell.querySelector('a');
      let rootEl;

      if (foundLink) {
        rootEl = document.createElement('a');
        rootEl.href = foundLink.href;
      } else {
        rootEl = document.createElement('span');
      }
      rootEl.textContent = labelCell?.textContent.trim() || '';
      moveInstrumentation(linkCell, rootEl);
      li.appendChild(rootEl);

      if (hierarchyTreeCell) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
        const hierarchyRoot = tempDiv.querySelector('ul');

        if (hierarchyRoot) {
          const wrapper = document.createElement('div');
          wrapper.classList.add('has-footer-sub-child'); // Use original HTML class
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
        moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation from original cell to tempDiv
      }
      secondaryNav.appendChild(li);
      moveInstrumentation(row, li);
    });
  }

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  if (copyrightTextRow) { // Ensure copyrightTextRow exists
    copyrightTextCol.textContent = copyrightTextRow.textContent.trim();
    moveInstrumentation(copyrightTextRow, copyrightTextCol);
  }
  copyrightWrap.append(copyrightTextCol);
}
