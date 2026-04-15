import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, copyrightTextRow, ...itemRows] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container');

  const footerHeader = document.createElement('div');
  footerHeader.classList.add('row', 'footer-header');

  const logoCol = document.createElement('div');
  logoCol.classList.add('col-md-6', 'col-12', 'justify-content-between', 'd-flex');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');

  const logoPicture = logoRow?.querySelector('picture');
  const logoLink = logoLinkRow?.querySelector('a');

  if (logoPicture && logoLink) {
    const newLogoLink = document.createElement('a');
    newLogoLink.href = logoLink.href;
    moveInstrumentation(logoLink, newLogoLink);
    newLogoLink.append(logoPicture);
    logoDiv.append(newLogoLink);
  } else if (logoPicture) {
    logoDiv.append(logoPicture);
  } else if (logoLink) {
    const newLogoLink = document.createElement('a');
    newLogoLink.href = logoLink.href;
    moveInstrumentation(logoLink, newLogoLink);
    while (logoLink.firstChild) newLogoLink.append(logoLink.firstChild);
    logoDiv.append(newLogoLink);
  }
  logoCol.append(logoDiv);
  footerHeader.append(logoCol);

  const socialCol = document.createElement('div');
  socialCol.classList.add('col-md-6', 'col-12', 'footer-social-wrap-center');
  const socialUl = document.createElement('ul');
  socialUl.classList.add('social-wrap');

  const socialLinkItems = itemRows.filter(row => row.children.length === 2 && row.querySelector('picture') && row.querySelector('a'));
  socialLinkItems.forEach((row) => {
    const socialLi = document.createElement('li');
    moveInstrumentation(row, socialLi);

    const iconCell = [...row.children].find(c => c.querySelector('picture'));
    const linkCell = [...row.children].find(c => c.querySelector('a'));

    if (iconCell && linkCell) {
      const link = document.createElement('a');
      link.href = linkCell.querySelector('a').href;
      link.target = '_blank';
      moveInstrumentation(linkCell, link);
      link.append(iconCell.querySelector('picture'));
      socialLi.append(link);
    }
    socialUl.append(socialLi);
  });
  socialCol.append(socialUl);
  footerHeader.append(socialCol);
  container.append(footerHeader);

  const footerMenuBox = document.createElement('div');
  footerMenuBox.classList.add('row', 'footer-menu-box');
  const footerMenuCol = document.createElement('div');
  footerMenuCol.classList.add('col');
  const footerMenu = document.createElement('div');
  footerMenu.classList.add('footer-menu');

  const footerNavigationSections = itemRows.filter(row => row.children.length === 4 && [...row.children].some(c => c.querySelector('ul')));
  footerNavigationSections.forEach((row) => {
    const linkBlocks = document.createElement('div');
    linkBlocks.classList.add('link-blocks');
    moveInstrumentation(row, linkBlocks);

    const headDiv = document.createElement('div');
    headDiv.classList.add('head');

    const sectionTitleCell = [...row.children].find(c => !c.querySelector('a') && !c.querySelector('ul') && !c.querySelector('picture'));
    const sectionLinkCell = [...row.children].find(c => c.querySelector('a') && !c.querySelector('ul'));
    const hierarchyCell = [...row.children].find(c => c.querySelector('ul'));

    const span = document.createElement('span');
    if (sectionLinkCell) {
      const link = document.createElement('a');
      link.href = sectionLinkCell.querySelector('a').href;
      moveInstrumentation(sectionLinkCell, link);
      link.textContent = sectionTitleCell?.textContent || '';
      span.append(link);
    } else if (sectionTitleCell) {
      span.textContent = sectionTitleCell.textContent;
    }
    const small = document.createElement('small');
    small.setAttribute('data-once', 'footerMobileInner');
    span.append(small);
    headDiv.append(span);

    if (hierarchyCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      
      // Apply classes to the UL itself and its children
      tempDiv.querySelectorAll('ul').forEach((ul, index) => {
        if (index === 0) { // Only apply footer-inner-list to the top-level UL
          ul.classList.add('footer-inner-list');
        }
      });

      // Add event listeners for mobile menu toggles
      tempDiv.querySelectorAll('span[data-once="footerClickEvent"]').forEach((toggleSpan) => {
        toggleSpan.addEventListener('click', () => {
          toggleSpan.closest('li').querySelector('.has-footer-sub-child')?.classList.toggle('active');
        });
      });

      tempDiv.querySelectorAll('span[data-once="footerClickEvent innerFooterClickEvent"]').forEach((toggleSpan) => {
        toggleSpan.addEventListener('click', () => {
          toggleSpan.closest('li').querySelector('.has-footer-inner-sub-child')?.classList.toggle('active-inner-child');
        });
      });

      moveInstrumentation(hierarchyCell, tempDiv);
      while (tempDiv.firstChild) {
        headDiv.append(tempDiv.firstChild);
      }
    }
    linkBlocks.append(headDiv);
    footerMenu.append(linkBlocks);
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

  const secondaryNavItems = itemRows.filter(row => row.children.length === 3 && !row.querySelector('picture') && !row.querySelector('ul'));
  secondaryNavItems.forEach((row) => {
    const secondaryLi = document.createElement('li');
    moveInstrumentation(row, secondaryLi);

    const labelCell = [...row.children].find(c => !c.querySelector('a') && !c.querySelector('ul') && !c.querySelector('picture'));
    const linkCell = [...row.children].find(c => c.querySelector('a'));

    if (labelCell && linkCell) {
      const link = document.createElement('a');
      link.href = linkCell.querySelector('a').href;
      moveInstrumentation(linkCell, link);
      link.textContent = labelCell.textContent;
      secondaryLi.append(link);
    }
    secondaryNavUl.append(secondaryLi);
  });
  secondaryNavCol.append(secondaryNavUl);
  copyrightWrap.append(secondaryNavCol);

  const copyrightTextCol = document.createElement('div');
  copyrightTextCol.classList.add('col-12', 'col-lg-6', 'copyright-text');
  if (copyrightTextRow) {
    moveInstrumentation(copyrightTextRow, copyrightTextCol);
    while (copyrightTextRow.firstChild) copyrightTextCol.append(copyrightTextRow.firstChild);
  }
  copyrightWrap.append(copyrightTextCol);
  container.append(copyrightWrap);

  block.textContent = '';
  block.append(container);

  // Add event listener for mobile menu toggle (small element)
  block.querySelectorAll('small[data-once="footerMobileInner"]').forEach((smallElement) => {
    smallElement.addEventListener('click', () => {
      smallElement.closest('.head').querySelector('.footer-inner-list')?.classList.toggle('active');
    });
  });

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
