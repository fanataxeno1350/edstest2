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
      // Use a generic class if original doesn't specify, or find one
      // Based on original HTML, no specific class for this wrapper, but 'footer-accordion-content' is used for the direct child.
      // Keeping 'has-sub-child' as a functional class for JS toggling.
      subWrap.classList.add('has-sub-child');
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
  // Destructure root rows based on BlockJson model
  const [
    primaryLogoRow,
    primaryLogoLinkRow,
    secondaryLogoRow,
    itcPortalLinkRow,
    copyrightTextRow,
    ...itemRows
  ] = [...block.children];

  const footerLinkItemRows = [];
  const socialLinkItemRows = [];

  // Separate item rows based on cell count
  itemRows.forEach((row) => {
    if (row.children.length === 3) { // footer-link-item has 3 cells
      footerLinkItemRows.push(row);
    } else if (row.children.length === 2) { // footer-social-item has 2 cells
      socialLinkItemRows.push(row);
    }
  });

  const sectionContainer = document.createElement('section');
  sectionContainer.classList.add('container-hd', 'fmm-container', 'p-0');

  const footerBrand = document.createElement('div');
  footerBrand.classList.add('footer-brand', 'w-100');
  sectionContainer.append(footerBrand);

  const footerBrandPrimary = document.createElement('section');
  footerBrandPrimary.classList.add('footer-brand__primary');
  footerBrand.append(footerBrandPrimary);

  const container = document.createElement('div');
  container.classList.add('container', 'fmm-container');
  footerBrandPrimary.append(container);

  const primaryContent = document.createElement('div');
  primaryContent.classList.add('footer-brand__primary--content', 'd-flex', 'flex-column', 'flex-md-row', 'justify-content-md-between', 'align-items-center');
  container.append(primaryContent);

  const footerBrandLeft = document.createElement('section');
  footerBrandLeft.classList.add('footer-brand__left', 'd-flex', 'gap-5', 'align-items-center');
  primaryContent.append(footerBrandLeft);

  // Primary Logo and Link
  if (primaryLogoRow && primaryLogoLinkRow) {
    const primaryLink = document.createElement('a');
    primaryLink.classList.add('footer-brand__logo', 'd-inline-block', 'cta-analytics');
    primaryLink.setAttribute('data-link-region', 'Footer');
    primaryLink.setAttribute('aria-label', 'logo');
    primaryLink.href = primaryLogoLinkRow.querySelector('a')?.href || '#';

    const primaryPicture = primaryLogoRow.querySelector('picture');
    if (primaryPicture) {
      const img = primaryPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      primaryLink.append(optimizedPic);
    }
    moveInstrumentation(primaryLogoRow, primaryLink);
    moveInstrumentation(primaryLogoLinkRow, primaryLink);
    footerBrandLeft.append(primaryLink);
  }

  // Secondary Logo
  if (secondaryLogoRow) {
    const secondaryLogoDiv = document.createElement('div');
    secondaryLogoDiv.classList.add('footer-brand__secondary--logo', 'd-inline-block');
    const secondaryPicture = secondaryLogoRow.querySelector('picture');
    if (secondaryPicture) {
      const img = secondaryPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      secondaryLogoDiv.append(optimizedPic);
    }
    moveInstrumentation(secondaryLogoRow, secondaryLogoDiv);
    footerBrandLeft.append(secondaryLogoDiv);
  }

  const footerBrandRight = document.createElement('section');
  footerBrandRight.classList.add('footer-brand__right');
  primaryContent.append(footerBrandRight);

  const footerBrandNavbar = document.createElement('nav');
  footerBrandNavbar.classList.add('footer-brand__navbar', 'd-grid', 'd-md-flex');
  footerBrandNavbar.setAttribute('aria-label', 'footer navbar');
  footerBrandRight.append(footerBrandNavbar);

  const navbarLeft = document.createElement('div');
  navbarLeft.classList.add('footer-brand__navbar--left', 'd-flex', 'flex-column', 'flex-md-row');
  footerBrandNavbar.append(navbarLeft);

  const navbarRight = document.createElement('div');
  navbarRight.classList.add('footer-brand__navbar--right', 'd-flex', 'flex-column', 'flex-md-row');
  footerBrandNavbar.append(navbarRight);

  footerLinkItemRows.forEach((row, index) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children]; // Fixed schema, use destructuring
    const footerListDiv = document.createElement('div');
    footerListDiv.classList.add('footerList');
    const ul = document.createElement('ul');
    ul.classList.add('footer-list', 'd-flex', 'align-items-center', 'justify-content-center', 'align-items-md-start', 'flex-column');
    footerListDiv.append(ul);

    const li = document.createElement('li');
    li.classList.add('footer-list__item');
    moveInstrumentation(row, li);

    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      const titleLink = document.createElement('a');
      titleLink.href = 'javascript:void(0)'; // Accordion trigger
      titleLink.textContent = labelCell.textContent.trim();
      titleLink.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block');
      titleLink.setAttribute('data-link-region', 'Footer');
      li.append(titleLink);

      const subLinksCvr = document.createElement('div');
      subLinksCvr.classList.add('footer-accordion-content'); // Custom class for accordion content
      // Move hierarchy-tree content using innerHTML and moveInstrumentation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv
      while (tempDiv.firstChild) {
        subLinksCvr.append(tempDiv.firstChild);
      }

      // Apply classes to nested elements from ORIGINAL HTML if they exist
      subLinksCvr.querySelectorAll('a').forEach(a => a.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block'));
      subLinksCvr.querySelectorAll('li').forEach(liItem => liItem.classList.add('footer-list__item'));
      subLinksCvr.querySelectorAll('ul').forEach(ulItem => ulItem.classList.add('footer-list', 'd-flex', 'align-items-center', 'justify-content-center', 'align-items-md-start', 'flex-column'));

      li.append(subLinksCvr);
      transformNestedLists(subLinksCvr); // Apply nested list transformations

      titleLink.addEventListener('click', (e) => {
        e.preventDefault();
        li.classList.toggle('active');
        subLinksCvr.classList.toggle('active');
      });
    } else {
      const anchor = document.createElement('a');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) anchor.href = foundLink.href;
      anchor.textContent = labelCell.textContent.trim();
      anchor.classList.add('cta-analytics', 'analytics_cta_click', 'footer-list__item--link', 'd-inline-block');
      anchor.setAttribute('data-link-region', 'Footer');
      li.append(anchor);
    }
    ul.append(li);

    if (index % 2 === 0) { // Distribute into left/right navbar sections
      navbarLeft.append(footerListDiv);
    } else {
      navbarRight.append(footerListDiv);
    }
  });

  const footerBrandSecondary = document.createElement('section');
  footerBrandSecondary.classList.add('footer-brand__secondary');
  footerBrand.append(footerBrandSecondary);

  const secondaryContainer = document.createElement('div');
  secondaryContainer.classList.add('container', 'fmm-container');
  footerBrandSecondary.append(secondaryContainer);

  const secondaryContent = document.createElement('div');
  secondaryContent.classList.add('footer-brand__secondary--content', 'd-flex', 'flex-column', 'flex-md-row', 'justify-content-md-between', 'align-items-center');
  secondaryContainer.append(secondaryContent);

  const footerBrandLeftSecondary = document.createElement('section');
  footerBrandLeftSecondary.classList.add('footer-brand__left');
  secondaryContent.append(footerBrandLeftSecondary);

  const leftList = document.createElement('ul');
  leftList.classList.add('footer-brand__left--list', 'd-flex', 'align-items-center', 'justify-content-center', 'flex-wrap');
  footerBrandLeftSecondary.append(leftList);

  // ITC Portal Link
  if (itcPortalLinkRow) {
    const li = document.createElement('li');
    li.classList.add('footer-brand__left--item');
    const itcLink = document.createElement('a');
    itcLink.classList.add('footer-brand__left--link', 'cta-analytics');
    itcLink.setAttribute('data-link-region', 'Footer');
    itcLink.href = itcPortalLinkRow.querySelector('a')?.href || '#';
    // The text content should come from the cell, not hardcoded 'ITC Portal'
    itcLink.textContent = itcPortalLinkRow.querySelector('a')?.textContent.trim() || 'ITC Portal';
    const screenReaderOnly = document.createElement('span');
    screenReaderOnly.classList.add('cmp-link__screen-reader-only');
    screenReaderOnly.textContent = 'opens in a new tab';
    itcLink.append(screenReaderOnly);
    moveInstrumentation(itcPortalLinkRow, itcLink);
    li.append(itcLink);
    leftList.append(li);
  }

  // Copyright Text
  if (copyrightTextRow) {
    const li = document.createElement('li');
    li.classList.add('footer-brand__left--item');
    const span = document.createElement('span');
    span.classList.add('footer-brand__left--text');
    span.textContent = copyrightTextRow.textContent.trim();
    moveInstrumentation(copyrightTextRow, span);
    li.append(span);
    leftList.append(li);
  }

  const footerBrandRightSecondary = document.createElement('section');
  footerBrandRightSecondary.classList.add('footer-brand__right');
  secondaryContent.append(footerBrandRightSecondary);

  const rightList = document.createElement('ul');
  rightList.classList.add('footer-brand__right--list', 'd-flex', 'align-items-center', 'justify-content-center');
  footerBrandRightSecondary.append(rightList);

  // Social Links
  socialLinkItemRows.forEach((row) => {
    const [iconCell, linkCell] = [...row.children]; // Fixed schema, use destructuring
    const li = document.createElement('li');
    li.classList.add('footer-brand__right--item', 'd-flex', 'justify-content-center', 'align-items-center');
    const socialLink = document.createElement('a');
    socialLink.classList.add('footer-brand__right--link', 'cta-analytics');
    socialLink.setAttribute('data-link-region', 'Footer');
    socialLink.setAttribute('target', '_blank'); // Assuming social links open in new tab

    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      socialLink.href = foundLink.href;
      // Use the alt text of the icon image for aria-label, or a fallback
      const iconAlt = iconCell.querySelector('img')?.alt;
      socialLink.setAttribute('aria-label', iconAlt || foundLink.href.split('/').pop());
    }

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '48' }]); // Small size for icons
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      socialLink.append(optimizedPic);
    }
    const screenReaderOnly = document.createElement('span');
    screenReaderOnly.classList.add('cmp-link__screen-reader-only');
    screenReaderOnly.textContent = 'opens in a new tab';
    socialLink.append(screenReaderOnly);
    moveInstrumentation(row, socialLink);
    li.append(socialLink);
    rightList.append(li);
  });

  block.replaceChildren(sectionContainer);

  // Optimize all images within the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
