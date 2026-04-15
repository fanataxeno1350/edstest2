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
      subWrap.classList.add('has-footer-sub-child'); // Use class from ORIGINAL HTML
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
      nested.querySelectorAll('li').forEach((innerLi) => {
        const innerNested = innerLi.querySelector(':scope > ul');
        const innerAnchor = innerLi.querySelector(':scope > a');

        if (!innerAnchor) {
          const innerTextNode = [...innerLi.childNodes].find(
            (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
          );
          if (innerTextNode) {
            const span = document.createElement('span');
            span.textContent = innerTextNode.textContent.trim();
            innerTextNode.remove();
            innerLi.prepend(span);
          }
        }

        if (innerNested) {
          innerNested.remove();
          const innerSubWrap = document.createElement('div');
          innerSubWrap.classList.add('has-footer-inner-sub-child'); // Use class from ORIGINAL HTML
          innerSubWrap.append(innerNested);
          innerLi.append(innerSubWrap);

          const innerTrigger = innerLi.querySelector(':scope > a, :scope > span');
          if (innerTrigger) {
            innerTrigger.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              innerLi.classList.toggle('active');
              innerSubWrap.classList.toggle('active');
            });
          }
        }
      });
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Destructure the known root fields
  const logoRow = children[0];
  const logoLinkRow = children[1];
  const copyrightTextRow = children[2];

  // Remaining rows are item rows
  const itemRows = children.slice(3);

  block.innerHTML = '';
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
  logoWrapper.append(logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1');
    moveInstrumentation(logoRow, optimizedPic);
    logoLink.append(optimizedPic);
  }

  const socialLinksCol = document.createElement('div');
  socialLinksCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  footerHeader.append(socialLinksCol);

  const socialWrap = document.createElement('ul');
  socialWrap.classList.add('social-wrap');
  socialLinksCol.append(socialWrap);

  // Social Link Items: 2 cells (icon, link)
  const socialLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('picture') && cells[1].querySelector('a');
  });
  socialLinkItems.forEach((row) => {
    const [iconCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    const socialLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      socialLink.href = foundLink.href;
      socialLink.target = '_blank';
    }
    moveInstrumentation(linkCell, socialLink);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '30' }]);
      moveInstrumentation(iconCell, optimizedPic);
      socialLink.append(optimizedPic);
    }
    li.append(socialLink);
    socialWrap.append(li);
  });

  // Footer Menu Box Section
  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  container.append(footerMenuBox);

  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  footerMenuBox.append(footerMenuCol);

  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');
  footerMenuCol.append(footerMenu);

  // Footer Menu Blocks: 4 cells (blockTitle, blockTitleLink, menuLinks (container), hierarchy-tree)
  const footerMenuBlocks = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 4 && cells[3].querySelector('ul'); // hierarchy-tree is a richtext with ul
  });
  footerMenuBlocks.forEach((row) => {
    const [blockTitleCell, blockTitleLinkCell, , hierarchyCell] = [...row.children]; // menuLinks cell is a container, not directly used here

    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    footerMenu.append(linkBlocks);

    const head = document.createElement('div');
    head.classList.add('head');
    linkBlocks.append(head);

    const span = document.createElement('span');
    head.append(span);

    const titleLink = document.createElement('a');
    const foundBlockTitleLink = blockTitleLinkCell.querySelector('a');
    if (foundBlockTitleLink) {
      titleLink.href = foundBlockTitleLink.href;
    }
    titleLink.textContent = blockTitleCell.textContent.trim();
    moveInstrumentation(blockTitleLinkCell, titleLink);
    span.append(titleLink);

    const small = document.createElement('small');
    small.setAttribute('data-once', 'footerMobileInner');
    span.append(small);

    // Handle hierarchy-tree richtext
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyCell.innerHTML;
    moveInstrumentation(hierarchyCell, tempDiv);

    const hierarchyRoot = tempDiv.querySelector('ul');
    if (hierarchyRoot) {
      hierarchyRoot.classList.add('footer-inner-list');
      head.append(hierarchyRoot);
      transformNestedLists(hierarchyRoot);
    }
  });

  // Copyright Section
  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');
  container.append(copyrightWrap);

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');
  copyrightWrap.append(secondaryNavCol);

  const secondaryNav = document.createElement('ul');
  secondaryNav.classList.add('secondary-nav');
  secondaryNavCol.append(secondaryNav);

  // Secondary Nav Links: 3 cells (label, link, hierarchy-tree)
  // Differentiate from footer-menu-link (also 3 cells) by checking if it's NOT a footer-menu-block
  const secondaryNavLinks = itemRows.filter((row) => {
    const cells = [...row.children];
    // A secondary-nav-link has 3 cells, the first is text, the second is an anchor, and the third is a richtext (ul)
    // It should NOT be a footer-menu-block (which has 4 cells)
    return cells.length === 3 && !cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].querySelector('ul');
  });

  secondaryNavLinks.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // The third cell (hierarchy-tree) is not used for secondary nav links

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
  });

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  copyrightTextCol.textContent = copyrightTextRow.textContent.trim();
  moveInstrumentation(copyrightTextRow, copyrightTextCol);
  copyrightWrap.append(copyrightTextCol);

  // Image optimization for all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
