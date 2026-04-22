import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
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
      // No specific class for sub-wrap in original HTML, using a generic one or leaving it without
      // If there was a class like 'has-sub-child' in original HTML, it would be used here.
      // For now, based on the original HTML, there isn't a direct class for this wrapper.
      // The original HTML structure for nested lists doesn't have an explicit wrapper div.
      // However, the JS logic creates one for interactivity.
      // Let's assume for now it's an internal structural element without a specific class from original HTML.
      // If a class was intended, it should be in the allowlist.
      // subWrap.classList.add('has-sub-child'); // Removed as not found in original HTML allowlist
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

  // Destructure the first three rows for primaryLogo, primaryLogoLink, secondaryLogo
  const [primaryLogoRow, primaryLogoLinkRow, secondaryLogoRow, ...itemRows] = children;

  const primaryLogoPicture = primaryLogoRow?.querySelector('picture');
  const primaryLogoLink = primaryLogoLinkRow?.querySelector('a')?.href;
  const secondaryLogoPicture = secondaryLogoRow?.querySelector('picture');

  block.innerHTML = ''; // Clear the block content

  const sectionContainer = document.createElement('section');
  sectionContainer.classList.add('container-hd', 'fmm-container', 'p-0');
  block.append(sectionContainer);

  const footerBrand = document.createElement('div');
  footerBrand.classList.add('footer-brand', 'w-100');
  sectionContainer.append(footerBrand);

  const footerBrandPrimary = document.createElement('section');
  footerBrandPrimary.classList.add('footer-brand__primary');
  footerBrand.append(footerBrandPrimary);

  const primaryContainer = document.createElement('div');
  primaryContainer.classList.add('container', 'fmm-container');
  footerBrandPrimary.append(primaryContainer);

  const primaryContent = document.createElement('div');
  primaryContent.classList.add(
    'footer-brand__primary--content',
    'd-flex',
    'flex-column',
    'flex-md-row',
    'justify-content-md-between',
    'align-items-center'
  );
  primaryContainer.append(primaryContent);

  const footerBrandLeft = document.createElement('section');
  footerBrandLeft.classList.add('footer-brand__left', 'd-flex', 'gap-5', 'align-items-center');
  primaryContent.append(footerBrandLeft);

  if (primaryLogoPicture) {
    const primaryLogoAnchor = document.createElement('a');
    primaryLogoAnchor.classList.add('footer-brand__logo', 'd-inline-block', 'cta-analytics');
    primaryLogoAnchor.setAttribute('aria-label', 'logo');
    if (primaryLogoLink) {
      primaryLogoAnchor.href = primaryLogoLink;
    }
    const primaryLogoImg = primaryLogoPicture.querySelector('img');
    if (primaryLogoImg) {
      const optimizedPic = createOptimizedPicture(primaryLogoImg.src, primaryLogoImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(primaryLogoImg, optimizedPic.querySelector('img'));
      primaryLogoAnchor.append(optimizedPic);
    }
    footerBrandLeft.append(primaryLogoAnchor);
  }

  if (secondaryLogoPicture) {
    const secondaryLogoDiv = document.createElement('div');
    secondaryLogoDiv.classList.add('footer-brand__secondary--logo', 'd-inline-block');
    const secondaryLogoImg = secondaryLogoPicture.querySelector('img');
    if (secondaryLogoImg) {
      const optimizedPic = createOptimizedPicture(secondaryLogoImg.src, secondaryLogoImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(secondaryLogoImg, optimizedPic.querySelector('img'));
      secondaryLogoDiv.append(optimizedPic);
    }
    footerBrandLeft.append(secondaryLogoDiv);
  }

  const footerBrandRight = document.createElement('section');
  footerBrandRight.classList.add('footer-brand__right');
  primaryContent.append(footerBrandRight);

  const footerBrandNavbar = document.createElement('nav');
  footerBrandNavbar.classList.add('footer-brand__navbar', 'd-grid', 'd-md-flex');
  footerBrandNavbar.setAttribute('aria-label', 'footer navbar');
  footerBrandRight.append(footerBrandNavbar);

  const footerBrandNavbarLeft = document.createElement('div');
  footerBrandNavbarLeft.classList.add('footer-brand__navbar--left', 'd-flex', 'flex-column', 'flex-md-row');
  footerBrandNavbar.append(footerBrandNavbarLeft);

  const footerBrandNavbarRight = document.createElement('div');
  footerBrandNavbarRight.classList.add('footer-brand__navbar--right', 'd-flex', 'flex-column', 'flex-md-row');
  footerBrandNavbar.append(footerBrandNavbarRight);

  // Content detection for item rows
  const footerNavItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('ul'));
  const footerLinkItems = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture'));
  const footerSocialItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));

  // Group footer nav items into two columns as per original HTML structure
  const navColumn1 = document.createElement('div');
  navColumn1.classList.add('footerList');
  const navList1 = document.createElement('ul');
  navList1.classList.add('footer-list', 'd-flex', 'align-items-center', 'justify-content-center', 'align-items-md-start', 'flex-column');
  navColumn1.append(navList1);
  footerBrandNavbarLeft.append(navColumn1);

  const navColumn2 = document.createElement('div');
  navColumn2.classList.add('footerList');
  const navList2 = document.createElement('ul');
  navList2.classList.add('footer-list', 'd-flex', 'align-items-center', 'justify-content-center', 'align-items-md-start', 'flex-column');
  navColumn2.append(navList2);
  footerBrandNavbarLeft.append(navColumn2);

  const navColumn3 = document.createElement('div');
  navColumn3.classList.add('footerList');
  const navList3 = document.createElement('ul');
  navList3.classList.add('footer-list', 'd-flex', 'align-items-center', 'justify-content-center', 'align-items-md-start', 'flex-column');
  navColumn3.append(navList3);
  footerBrandNavbarRight.append(navColumn3);

  const navColumn4 = document.createElement('div');
  navColumn4.classList.add('footerList');
  const navList4 = document.createElement('ul');
  navList4.classList.add('footer-list', 'd-flex', 'align-items-center', 'justify-content-center', 'align-items-md-start', 'flex-column');
  navColumn4.append(navList4);
  footerBrandNavbarRight.append(navColumn4);

  footerNavItems.forEach((row, i) => {
    // Correctly identify cells based on content, not index
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('ul'));
    const linkCell = cells.find(cell => cell.querySelector('a') && !cell.querySelector('ul'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));

    const li = document.createElement('li');
    li.classList.add('footer-list__item');

    const foundLink = linkCell?.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
      rootEl.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block');
      rootEl.setAttribute('data-link-region', 'Footer');
    } else {
      rootEl = document.createElement('span');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    if (hierarchyCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML; // Use innerHTML for richtext
      moveInstrumentation(hierarchyCell, tempDiv); // Instrument the source cell

      const hierarchyRoot = tempDiv.querySelector('ul');
      if (hierarchyRoot) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('footer-list__item--dropdown'); // Corrected class name based on common patterns for nested menus
        
        // Apply classes to nested elements from the original HTML
        hierarchyRoot.classList.add('footer-list', 'd-flex', 'align-items-center', 'justify-content-center', 'align-items-md-start', 'flex-column'); // Example, adjust as needed
        hierarchyRoot.querySelectorAll('li').forEach(nestedLi => nestedLi.classList.add('footer-list__item'));
        hierarchyRoot.querySelectorAll('a').forEach(nestedA => nestedA.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block'));

        while (hierarchyRoot.firstChild) {
          wrapper.append(hierarchyRoot.firstChild);
        }
        
        rootEl.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.classList.toggle('active');
          li.classList.toggle('active');
        });
        li.appendChild(wrapper);
        transformNestedLists(wrapper); // Apply transformation to the new wrapper containing the hierarchy
      }
    }

    // Distribute nav items across the columns
    if (i % 4 === 0) {
      navList1.appendChild(li);
    } else if (i % 4 === 1) {
      navList2.appendChild(li);
    } else if (i % 4 === 2) {
      navList3.appendChild(li);
    } else {
      navList4.appendChild(li);
    }
  });

  const footerBrandSecondary = document.createElement('section');
  footerBrandSecondary.classList.add('footer-brand__secondary');
  footerBrand.append(footerBrandSecondary);

  const secondaryContainer = document.createElement('div');
  secondaryContainer.classList.add('container', 'fmm-container');
  footerBrandSecondary.append(secondaryContainer);

  const secondaryContent = document.createElement('div');
  secondaryContent.classList.add(
    'footer-brand__secondary--content',
    'd-flex',
    'flex-column',
    'flex-md-row',
    'justify-content-md-between',
    'align-items-center'
  );
  secondaryContainer.append(secondaryContent);

  const footerBrandLeftSecondary = document.createElement('section');
  footerBrandLeftSecondary.classList.add('footer-brand__left');
  secondaryContent.append(footerBrandLeftSecondary);

  const footerBrandLeftList = document.createElement('ul');
  footerBrandLeftList.classList.add(
    'footer-brand__left--list',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'flex-wrap'
  );
  footerBrandLeftSecondary.append(footerBrandLeftList);

  footerLinkItems.forEach((row) => {
    const [linkCell, textCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('footer-brand__left--item');

    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      const anchor = document.createElement('a');
      anchor.href = foundLink.href;
      anchor.textContent = textCell?.textContent.trim() || '';
      anchor.classList.add('footer-brand__left--link', 'cta-analytics');
      anchor.setAttribute('data-link-region', 'Footer');
      moveInstrumentation(row, anchor);
      li.append(anchor);
    } else {
      const span = document.createElement('span');
      span.textContent = textCell?.textContent.trim() || '';
      span.classList.add('footer-brand__left--text');
      moveInstrumentation(row, span);
      li.append(span);
    }
    footerBrandLeftList.append(li);
  });

  const footerBrandRightSecondary = document.createElement('section');
  footerBrandRightSecondary.classList.add('footer-brand__right');
  secondaryContent.append(footerBrandRightSecondary);

  const footerBrandRightList = document.createElement('ul');
  footerBrandRightList.classList.add(
    'footer-brand__right--list',
    'd-flex',
    'align-items-center',
    'justify-content-center'
  );
  footerBrandRightSecondary.append(footerBrandRightList);

  footerSocialItems.forEach((row) => {
    const [iconCell, linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('footer-brand__right--item', 'd-flex', 'justify-content-center', 'align-items-center');

    const iconPicture = iconCell?.querySelector('picture');
    const socialLink = linkCell?.querySelector('a')?.href;

    if (iconPicture && socialLink) {
      const anchor = document.createElement('a');
      anchor.href = socialLink;
      anchor.classList.add('footer-brand__right--link', 'cta-analytics');
      anchor.setAttribute('data-link-region', 'Footer');
      anchor.target = '_blank'; // Assuming social links open in new tab

      const iconImg = iconPicture.querySelector('img');
      if (iconImg) {
        const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
      }
      moveInstrumentation(row, anchor);
      li.append(anchor);
    }
    footerBrandRightList.append(li);
  });

  // Optimize all images within the footer
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
