import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl, classes = { subChild: 'has-footer-sub-child', innerSubChild: 'has-footer-inner-sub-child' }) {
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
      subWrap.classList.add(classes.subChild);
      subWrap.append(nested);
      li.append(subWrap);

      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        const small = document.createElement('small');
        trigger.append(small);
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
      transformNestedLists(nested, { subChild: classes.innerSubChild, innerSubChild: classes.innerSubChild });
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Identify root fields based on BlockJson model
  const logoRow = children.find((row) => row.querySelector('picture'));
  const logoLinkRow = children.find((row) => row.querySelector('a[href*="/content/site/logoLink"]'));
  const copyrightTextRow = children.find((row) => !row.querySelector('picture') && !row.querySelector('a') && row.textContent.trim().includes('Copyright Text'));

  const itemRows = children.filter((row) => row !== logoRow && row !== logoLinkRow && row !== copyrightTextRow);

  const container = document.createElement('div');
  container.classList.add('container');

  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const logoLink = document.createElement('a');
  if (logoLinkRow) {
    const foundLogoLink = logoLinkRow.querySelector('a');
    if (foundLogoLink) {
      logoLink.href = foundLogoLink.href;
    }
    moveInstrumentation(logoLinkRow, logoLink);
  }

  if (logoRow) {
    const logoPicture = logoRow.querySelector('picture');
    if (logoPicture) {
      const img = logoPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        logoLink.append(optimizedPic);
        logoLink.querySelector('img').classList.add('hiddenlogo1');
      }
    }
    moveInstrumentation(logoRow, logoDiv);
  }
  logoDiv.append(logoLink);
  logoWrapper.append(logoDiv);
  footerHeader.append(logoWrapper);

  const socialLinksWrapper = document.createElement('div');
  socialLinksWrapper.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');

  const socialList = document.createElement('ul');
  socialList.classList.add('social-wrap');

  // Filter for footer-social-link items: 3 cells, first has picture, second has link, third has richtext (ul)
  const socialLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].querySelector('ul');
  });

  socialLinkItems.forEach((row) => {
    const [iconCell, linkCell] = [...row.children]; // Destructure as per model
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
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        socialAnchor.append(optimizedPic);
      }
    }
    moveInstrumentation(iconCell, li);
    li.append(socialAnchor);
    socialList.append(li);
  });

  socialLinksWrapper.append(socialList);
  footerHeader.append(socialLinksWrapper);
  container.append(footerHeader);

  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  // Filter for footer-link-block items: 3 cells, first is text, second is link, third is text 'Footer Links'
  const linkBlocks = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && !cells[0].querySelector('a') && cells[1].querySelector('a') && cells[2].textContent.trim() === 'Footer Links value';
  });

  linkBlocks.forEach((row) => {
    const [blockTitleCell, blockTitleLinkCell] = [...row.children]; // Destructure as per model
    const linkBlockDiv = document.createElement('div');
    linkBlockDiv.classList.add('link-blocks');

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');

    const span = document.createElement('span');
    const titleLink = document.createElement('a');
    const foundTitleLink = blockTitleLinkCell.querySelector('a');
    if (foundTitleLink) {
      titleLink.href = foundTitleLink.href;
    }
    titleLink.textContent = blockTitleCell.textContent.trim();
    moveInstrumentation(blockTitleLinkCell, titleLink);
    moveInstrumentation(blockTitleCell, span);
    span.append(titleLink);

    const small = document.createElement('small');
    span.append(small);
    headDiv.append(span);

    // Add event listener for mobile menu toggle
    span.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      headDiv.classList.toggle('active'); // Toggle 'active' class on the 'head' div
    });

    const ul = document.createElement('ul');
    ul.classList.add('footer-inner-list');

    // Filter for footer-link-item items: 3 cells, first is text, second is link, third is richtext (ul)
    const footerLinkItems = itemRows.filter((itemRow) => {
      const cells = [...itemRow.children];
      return cells.length === 3 && !cells[0].querySelector('a') && cells[1].querySelector('a') && cells[2].querySelector('ul');
    });

    footerLinkItems.forEach((itemRow) => {
      const [labelCell, linkCell, hierarchyCell] = [...itemRow.children]; // Destructure as per model
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
      moveInstrumentation(itemRow, rootEl);
      li.appendChild(rootEl);

      const hierarchyRoot = hierarchyCell?.querySelector('ul');
      if (hierarchyRoot) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('has-footer-sub-child');
        
        // Create a temporary div to parse and apply classes to hierarchy content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML;
        moveInstrumentation(hierarchyCell, tempDiv); // Instrument the original cell to the tempDiv

        // Apply classes to nested elements from ORIGINAL HTML
        tempDiv.querySelectorAll('a').forEach(a => a.classList.add('nav-menu-item-link')); // Example, adjust if specific classes are needed
        tempDiv.querySelectorAll('ul').forEach(ulEl => ulEl.classList.add('nav-menu-sub-list')); // Example
        tempDiv.querySelectorAll('li').forEach(liEl => liEl.classList.add('nav-menu-item', 'list-item')); // Example

        // Move children from tempDiv to wrapper
        while (tempDiv.firstChild) {
          wrapper.append(tempDiv.firstChild);
        }

        const triggerSpan = document.createElement('span');
        const triggerImg = document.createElement('img');
        triggerImg.alt = 'svg file';
        triggerImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776420276396.svg+xml'; // Example icon, replace if needed
        triggerSpan.append(triggerImg);
        rootEl.append(triggerSpan);

        rootEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.classList.toggle('active');
          li.classList.toggle('active');
        });
        li.appendChild(wrapper);
        transformNestedLists(wrapper.querySelector('ul'), { subChild: 'has-footer-sub-child', innerSubChild: 'has-footer-inner-sub-child' });
      }
      ul.append(li);
    });

    headDiv.append(ul);
    linkBlockDiv.append(headDiv);
    footerMenu.append(linkBlockDiv);
  });

  footerMenuCol.append(footerMenu);
  footerMenuBox.append(footerMenuCol);
  container.append(footerMenuBox);

  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');

  const secondaryNav = document.createElement('ul');
  secondaryNav.classList.add('secondary-nav');

  // Filter for footer-secondary-link items: 2 cells, first is text, second is link
  const secondaryLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && !cells[0].querySelector('a') && cells[1].querySelector('a');
  });

  secondaryLinkItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children]; // Destructure as per model
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(row, li);
    li.append(anchor);
    secondaryNav.append(li);
  });

  secondaryNavCol.append(secondaryNav);
  copyrightWrap.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  // Safely get innerHTML from the copyrightTextRow
  const copyrightCell = [...copyrightTextRow.children].find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));
  if (copyrightCell) {
    copyrightTextCol.innerHTML = copyrightCell.innerHTML;
  }
  moveInstrumentation(copyrightTextRow, copyrightTextCol);
  copyrightWrap.append(copyrightTextCol);

  container.append(copyrightWrap);
  block.innerHTML = '';
  block.append(container);
}
