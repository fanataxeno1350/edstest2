import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoMobileRow,
    logoRow,
    addressRow,
    phoneRow,
    copyrightRow,
    creditRow,
    ...itemRows
  ] = [...block.children];

  block.textContent = '';
  block.classList.add('site-footer');

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  const siteFooterTop = document.createElement('div');
  siteFooterTop.classList.add('site-footer__top', 'clearfix');
  container.append(siteFooterTop);

  // Mobile Logo
  const mobileLogoRowWrapper = document.createElement('div');
  mobileLogoRowWrapper.classList.add('row');
  mobileLogoRowWrapper.id = 'mobile-logo-only';
  siteFooterTop.append(mobileLogoRowWrapper);

  const logoFooterMobileWrapper = document.createElement('div');
  logoFooterMobileWrapper.id = 'logo-footer-mobile-wrapper';
  moveInstrumentation(logoMobileRow, logoFooterMobileWrapper);
  const mobileLogoPicture = logoMobileRow.querySelector('picture');
  if (mobileLogoPicture) {
    logoFooterMobileWrapper.append(mobileLogoPicture);
  }
  mobileLogoRowWrapper.append(logoFooterMobileWrapper);

  // Main Footer Content
  const mainContentRow = document.createElement('div');
  mainContentRow.classList.add('row');
  siteFooterTop.append(mainContentRow);

  const regionFooterFirst = document.createElement('section');
  regionFooterFirst.classList.add('region', 'region-footer-first');
  mainContentRow.append(regionFooterFirst);

  // Logo
  const logoFooterContainer = document.createElement('div');
  logoFooterContainer.id = 'logo-footer-container';
  moveInstrumentation(logoRow, logoFooterContainer);
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    logoFooterContainer.append(logoPicture);
  }
  regionFooterFirst.append(logoFooterContainer);

  // Address
  const addressP = document.createElement('p');
  addressP.classList.add('small');
  moveInstrumentation(addressRow, addressP);
  addressP.textContent = `Address: ${addressRow.textContent.trim()}`;
  regionFooterFirst.append(addressP);

  // Phone
  const phoneP = document.createElement('p');
  phoneP.classList.add('small');
  moveInstrumentation(phoneRow, phoneP);
  phoneP.textContent = `Phone: ${phoneRow.textContent.trim()}`;
  regionFooterFirst.append(phoneP);

  // Social Icons
  const socialIconsDiv = document.createElement('div');
  socialIconsDiv.id = 'social-icons';
  regionFooterFirst.append(socialIconsDiv);

  const socialUl = document.createElement('ul');
  socialIconsDiv.append(socialUl);

  // Distinguish social links (picture + link) from menu links (link + text)
  const socialLinks = [];
  const menuLinks = [];

  itemRows.forEach((row) => {
    const cells = [...row.children];
    const hasPicture = cells.some(cell => cell.querySelector('picture'));
    const hasLink = cells.some(cell => cell.querySelector('a'));
    const hasText = cells.some(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '');

    if (hasPicture && hasLink) { // Footer-Social: Icon (picture) + Link (a)
      socialLinks.push(row);
    } else if (hasLink && hasText) { // Footer-Link: Link (a) + Text (text)
      menuLinks.push(row);
    }
  });

  socialLinks.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    const linkEl = document.createElement('a');
    const iconCell = row.querySelector('picture');
    const urlCell = row.querySelector('a');

    if (urlCell) {
      linkEl.href = urlCell.href;
    }
    if (iconCell) {
      linkEl.append(iconCell);
    }
    li.append(linkEl);
    socialUl.append(li);
  });

  // Menu Links, Departments Links, Other Links
  const menuSections = [
    { title: 'Menu', id: 'block-cbcog-footer', classes: ['region-footer-second', 'block', 'block-menu', 'navigation', 'menu--footer'] },
    { title: 'Departments', id: 'block-departments', classes: ['region-footer-third', 'block', 'block-menu', 'navigation', 'menu--departments'] },
    { title: 'Links', id: 'block-links', classes: ['region-footer-fourth', 'block', 'block-menu', 'navigation', 'menu--links'] },
  ];

  let currentLinkIndex = 0;
  menuSections.forEach((section, index) => {
    const sectionEl = document.createElement('section');
    sectionEl.classList.add('row', 'region', section.classes[0]); // section.classes[0] is region-footer-second/third/fourth
    mainContentRow.append(sectionEl);

    const nav = document.createElement('nav');
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-labelledby', `${section.id}-menu`);
    nav.id = section.id;
    nav.classList.add(...section.classes.slice(1)); // Add block, block-menu, navigation, menu--footer/departments/links
    sectionEl.append(nav);

    const h2 = document.createElement('h2');
    h2.id = `${section.id}-menu`;
    h2.textContent = section.title;
    nav.append(h2);

    const ul = document.createElement('ul');
    ul.classList.add('clearfix', 'nav');
    if (index === 0) { // Only the first menu has flex-row
      ul.classList.add('flex-row');
    }
    nav.append(ul);

    const numLinksInSection = Math.floor(menuLinks.length / menuSections.length) + (index < menuLinks.length % menuSections.length ? 1 : 0);

    for (let i = 0; i < numLinksInSection; i++) {
      if (currentLinkIndex < menuLinks.length) {
        const row = menuLinks[currentLinkIndex];
        const li = document.createElement('li');
        li.classList.add('nav-item');
        moveInstrumentation(row, li);

        const linkEl = document.createElement('a');
        linkEl.classList.add('nav-link');

        // Find the 'a' tag within the row for the link
        const foundLink = row.querySelector('a');
        if (foundLink) {
          linkEl.href = foundLink.href;
          linkEl.textContent = foundLink.textContent;
          // Add specific nav-link classes from original HTML if available
          const originalClasses = [...foundLink.classList].filter(cls => cls.startsWith('nav-link--') || cls === 'is-active');
          if (originalClasses.length > 0) {
            linkEl.classList.add(...originalClasses);
          }
        }
        li.append(linkEl);
        ul.append(li);
        currentLinkIndex++;
      }
    }
  });

  // Site Footer Bottom
  const siteFooterBottom = document.createElement('div');
  siteFooterBottom.classList.add('site-footer__bottom');
  container.append(siteFooterBottom);

  const textCenter = document.createElement('div');
  textCenter.classList.add('text-center');
  siteFooterBottom.append(textCenter);

  // Copyright
  const copyrightP = document.createElement('p');
  moveInstrumentation(copyrightRow, copyrightP);
  while (copyrightRow.firstChild) copyrightP.append(copyrightRow.firstChild);
  textCenter.append(copyrightP);

  // Credit
  const creditP = document.createElement('p');
  creditP.classList.add('small');
  moveInstrumentation(creditRow, creditP);
  while (creditRow.firstChild) creditP.append(creditRow.firstChild);
  textCenter.append(creditP);

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
