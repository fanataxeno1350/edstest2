import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Root fields: logo, logoLink, copyright. All others are item rows.
  const logoRow = children.find((row) => row.children.length === 1 && row.querySelector('picture'));
  const logoLinkRow = children.find((row) => row.children.length === 1 && row.querySelector('a'));
  const copyrightRow = children.find((row) => row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a'));

  const itemRows = children.filter((row) => row !== logoRow && row !== logoLinkRow && row !== copyrightRow);

  const container = document.createElement('div');
  container.classList.add('container');

  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const logoLink = document.createElement('a');
  if (logoLinkRow) {
    const logoLinkFound = logoLinkRow.querySelector('a');
    if (logoLinkFound) {
      logoLink.href = logoLinkFound.href;
    }
    moveInstrumentation(logoLinkRow, logoLink);
  }


  if (logoRow) {
    const picture = logoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
        const optimizedImg = optimizedPic.querySelector('img');
        optimizedImg.classList.add('hiddenlogo1');
        optimizedImg.title = img.title;
        moveInstrumentation(img, optimizedImg);
        logoLink.append(optimizedPic);
      }
    }
    moveInstrumentation(logoRow, logoLink);
  }
  logoDiv.append(logoLink);
  logoCol.append(logoDiv);
  footerHeader.append(logoCol);

  const socialLinksCol = document.createElement('div');
  socialLinksCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');

  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');

  const socialLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('picture') && cells[1].querySelector('a');
  });
  socialLinkItems.forEach((row) => {
    const [iconCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.target = '_blank';
    }
    moveInstrumentation(linkCell, anchor);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
      }
    }
    moveInstrumentation(iconCell, anchor);
    li.append(anchor);
    socialUl.append(li);

    // Apply specific classes based on icon alt text (example, adjust as needed)
    const imgAlt = iconCell.querySelector('img')?.alt.toLowerCase();
    if (imgAlt?.includes('facebook') || imgAlt?.includes('fb')) li.classList.add('fb');
    else if (imgAlt?.includes('twitter') || imgAlt?.includes('tw')) li.classList.add('tw');
    else if (imgAlt?.includes('instagram') || imgAlt?.includes('inst')) li.classList.add('inst');
    else if (imgAlt?.includes('youtube') || imgAlt?.includes('yt')) li.classList.add('yt');
    else if (imgAlt?.includes('linkedin') || imgAlt?.includes('in')) li.classList.add('in');
  });

  socialLinksCol.append(socialUl);
  footerHeader.append(socialLinksCol);
  container.append(footerHeader);

  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  const footerMenuBlocks = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 4 && cells[0].textContent && cells[1].querySelector('a') && cells[3].querySelector('ul');
  });
  footerMenuBlocks.forEach((row) => {
    const [titleCell, titleLinkCell, , hierarchyTreeCell] = [...row.children];
    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    moveInstrumentation(row, linkBlocks);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');

    const span = document.createElement('span');
    const titleAnchor = document.createElement('a');
    const foundTitleLink = titleLinkCell.querySelector('a');
    if (foundTitleLink) {
      titleAnchor.href = foundTitleLink.href;
    }
    titleAnchor.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, titleAnchor);
    moveInstrumentation(titleLinkCell, titleAnchor);

    span.append(titleAnchor);
    const small = document.createElement('small');
    headDiv.append(span, small);

    const ul = document.createElement('ul');
    ul.classList.add('footer-inner-list');

    // Use a temporary div to parse and process innerHTML for instrumentation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
    moveInstrumentation(hierarchyTreeCell, tempDiv); // Instrument the original cell to the temp div

    // Apply classes and event listeners to elements within the hierarchy tree
    tempDiv.querySelectorAll('a').forEach(a => {
      // No specific classes from ORIGINAL HTML for <a> tags within hierarchy, but keep this for future if needed
    });
    tempDiv.querySelectorAll('ul').forEach(ulElem => {
      // No specific classes from ORIGINAL HTML for <ul> tags within hierarchy, but keep this for future if needed
    });
    tempDiv.querySelectorAll('li').forEach(liElem => {
      // No specific classes from ORIGINAL HTML for <li> tags within hierarchy, but keep this for future if needed
    });

    function transformNestedLists(rootElement) {
      rootElement.querySelectorAll('li').forEach(li => {
        const nested = li.querySelector(':scope > ul');
        if (nested) {
          nested.remove();
          const subWrap = document.createElement('div');
          subWrap.classList.add('has-footer-sub-child');
          subWrap.append(nested);
          li.append(subWrap);

          const trigger = li.querySelector(':scope > a') || li;
          const spanIcon = document.createElement('span');
          spanIcon.innerHTML = '<img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1776283229530.svg+xml"/>';
          trigger.append(spanIcon);

          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            li.classList.toggle('active');
            subWrap.classList.toggle('active');
          });

          // Handle inner nested lists
          subWrap.querySelectorAll('li').forEach(innerLi => {
            const innerNested = innerLi.querySelector(':scope > ul');
            if (innerNested) {
              innerNested.remove();
              const innerSubWrap = document.createElement('div');
              innerSubWrap.classList.add('has-footer-inner-sub-child');
              innerSubWrap.append(innerNested);

              const innerTrigger = innerLi.querySelector(':scope > a') || innerLi;
              const innerSpanIcon = document.createElement('span');
              innerSpanIcon.innerHTML = '<img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1776283229530.svg+xml"/>';
              innerTrigger.append(innerSpanIcon);

              innerTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                innerLi.classList.toggle('active');
                innerSubWrap.classList.toggle('active');
              });
              innerLi.append(innerSubWrap);
            }
          });
        }
      });
    }

    // Move children from tempDiv to ul
    while (tempDiv.firstChild) {
      ul.append(tempDiv.firstChild);
    }

    transformNestedLists(ul);

    linkBlocks.append(headDiv, ul);
    footerMenu.append(linkBlocks);

    const titleText = titleCell.textContent.trim().toLowerCase();
    if (titleText === 'what we do') {
      headDiv.classList.add('what-we-do-footer-links');
    } else if (titleText === 'careers') {
      headDiv.classList.add('careers-footer-links');
    }
  });

  footerMenuCol.append(footerMenu);
  footerMenuBox.append(footerMenuCol);
  container.append(footerMenuBox);

  const copyrightWrap = document.createElement('div');
  copyrightWrap.classList.add('row', 'align-items-lg-end', 'copyright-wrap');

  const secondaryNavCol = document.createElement('div');
  secondaryNavCol.classList.add('col-12', 'col-lg-6');

  const secondaryNavUl = document.createElement('ul');
  secondaryNavUl.classList.add('secondary-nav');

  const secondaryNavItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].textContent && cells[1].querySelector('a') && cells[2].querySelector('ul');
  });
  secondaryNavItems.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(labelCell, anchor);
    moveInstrumentation(linkCell, anchor);
    li.append(anchor);
    secondaryNavUl.append(li);
  });

  secondaryNavCol.append(secondaryNavUl);
  copyrightWrap.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  if (copyrightRow) {
    copyrightTextCol.textContent = copyrightRow.textContent.trim();
    moveInstrumentation(copyrightRow, copyrightTextCol);
  }
  copyrightWrap.append(copyrightTextCol);
  container.append(copyrightWrap);

  block.textContent = '';
  block.append(container);

  // Optimize all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
