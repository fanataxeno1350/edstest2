import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const mainFooter = document.createElement('footer');
  mainFooter.classList.add('footer-itc-footer-section');

  const footerContainer = document.createElement('div');
  footerContainer.classList.add('footer-container');
  mainFooter.append(footerContainer);
  moveInstrumentation(block.querySelector('.footer-container'), footerContainer);

  const footerRow = document.createElement('div');
  footerRow.classList.add('footer-row');
  footerContainer.append(footerRow);
  moveInstrumentation(block.querySelector('.footer-row'), footerRow);

  // Left column for logos
  const logoCol = document.createElement('div');
  logoCol.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-d-flex', 'footer-d-lg-block', 'footer-justify-content-center');
  footerRow.append(logoCol);
  moveInstrumentation(block.querySelector('.footer-col-lg-6.footer-col-sm-12.footer-d-flex.footer-d-lg-block.footer-justify-content-center'), logoCol);

  const logosDiv = document.createElement('div');
  logosDiv.classList.add('footer-logos');
  logoCol.append(logosDiv);
  moveInstrumentation(block.querySelector('.footer-logos'), logosDiv);

  // ITC Logo
  const itcLogoDiv = document.createElement('div');
  itcLogoDiv.classList.add('footer-itc-logo');
  logosDiv.append(itcLogoDiv);
  const itcLogoImg = block.querySelector('[data-aue-prop="itcLogo"] img');
  if (itcLogoImg) {
    const itcLink = block.querySelector('[data-aue-prop="itcLogoLink"]');
    const picture = createOptimizedPicture(itcLogoImg.src, itcLogoImg.alt);
    if (itcLink && itcLink.href) {
      const link = document.createElement('a');
      link.href = itcLink.href;
      link.append(picture);
      itcLogoDiv.append(link);
      moveInstrumentation(itcLogoImg, link);
      moveInstrumentation(itcLink, link);
    } else {
      itcLogoDiv.append(picture);
      moveInstrumentation(itcLogoImg, picture);
    }
  }

  // FSSAI Logo
  const fssaiLogoDiv = document.createElement('div');
  fssaiLogoDiv.classList.add('footer-fssai-logo');
  logosDiv.append(fssaiLogoDiv);
  const fssaiLogoImg = block.querySelector('[data-aue-prop="fssaiLogo"] img');
  if (fssaiLogoImg) {
    const picture = createOptimizedPicture(fssaiLogoImg.src, fssaiLogoImg.alt);
    fssaiLogoDiv.append(picture);
    moveInstrumentation(fssaiLogoImg, picture);
  }

  // Page Links Wrapper (empty in authored HTML, but needed for structure)
  const pageLinksWrapper = document.createElement('div');
  pageLinksWrapper.classList.add('footer-col-lg-3', 'footer-col-sm-12', 'footer-d-flex', 'footer-justify-content-xl-between', 'footer-page-links-wrapper', 'footer-pt-md-0', 'footer-pt-4', 'footer-px-1');
  footerRow.append(pageLinksWrapper);
  moveInstrumentation(block.querySelector('.footer-col-lg-3.footer-col-sm-12.footer-d-flex.footer-justify-content-xl-between.footer-page-links-wrapper.footer-pt-md-0.footer-pt-4.footer-px-1'), pageLinksWrapper);

  // Left Footer Links
  const leftFooterLinksCol = document.createElement('div');
  leftFooterLinksCol.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-itc-footer-link-left');
  footerRow.append(leftFooterLinksCol);
  moveInstrumentation(block.querySelector('.footer-col-lg-6.footer-col-sm-12.footer-itc-footer-link-left'), leftFooterLinksCol);

  const listsContainer = document.createElement('div');
  listsContainer.classList.add('footer-lists-container', 'footer-d-flex');
  leftFooterLinksCol.append(listsContainer);
  moveInstrumentation(block.querySelector('.footer-lists-container'), listsContainer);

  // Footer Links (footerLinks multifield)
  const footerLinksDiv = document.createElement('div');
  footerLinksDiv.classList.add('footer-list-4', 'footer-list');
  listsContainer.append(footerLinksDiv);
  const footerLinksUl = document.createElement('ul');
  footerLinksDiv.append(footerLinksUl);
  const authoredFooterLinks = block.querySelectorAll('[data-aue-model="footerLink"][data-aue-resource="footerLinks"]');
  authoredFooterLinks.forEach((linkNode) => {
    const li = document.createElement('li');
    const link = linkNode.querySelector('[data-aue-prop="link"]');
    const text = linkNode.querySelector('[data-aue-prop="text"]');
    if (link && text) {
      const a = document.createElement('a');
      a.href = link.href;
      a.target = '_blank';
      a.textContent = text.textContent;
      const span = document.createElement('span');
      span.classList.add('footer-cmp-link__screen-reader-only');
      span.textContent = 'opens in a new tab';
      a.append(span);
      li.append(a);
      footerLinksUl.append(li);
      moveInstrumentation(link, a);
      moveInstrumentation(text, a);
      moveInstrumentation(linkNode, li);
    }
  });

  // Menu Links (menuLinks multifield)
  const menuLinksDiv = document.createElement('div');
  menuLinksDiv.classList.add('footer-list-3', 'footer-list');
  listsContainer.append(menuLinksDiv);
  const menuLinksUl = document.createElement('ul');
  menuLinksUl.classList.add('footer-cmp-list');
  menuLinksDiv.append(menuLinksUl);
  const authoredMenuLinks = block.querySelectorAll('[data-aue-model="footerLink"][data-aue-resource="menuLinks"]');
  authoredMenuLinks.forEach((linkNode) => {
    const li = document.createElement('li');
    li.classList.add('footer-cmp-list__item');
    const link = linkNode.querySelector('[data-aue-prop="link"]');
    const text = linkNode.querySelector('[data-aue-prop="text"]');
    if (link && text) {
      const a = document.createElement('a');
      a.classList.add('footer-cmp-list__item-link');
      a.href = link.href;
      const span = document.createElement('span');
      span.classList.add('footer-cmp-list__item-title');
      span.textContent = text.textContent;
      a.append(span);
      li.append(a);
      menuLinksUl.append(li);
      moveInstrumentation(link, a);
      moveInstrumentation(text, a);
      moveInstrumentation(linkNode, li);
    }
  });

  // Contact Details
  const contactDetailsDiv = document.createElement('div');
  contactDetailsDiv.classList.add('footer-contact-details');
  leftFooterLinksCol.append(contactDetailsDiv);
  moveInstrumentation(block.querySelector('.footer-contact-details'), contactDetailsDiv);

  const grievanceOfficerTitle = block.querySelector('[data-aue-prop="grievanceOfficerTitle"]');
  if (grievanceOfficerTitle) {
    const h5 = document.createElement('h5');
    h5.classList.add('footer-contact-details__title', 'footer-mb-md-3', 'footer-mb-0');
    h5.textContent = grievanceOfficerTitle.textContent;
    contactDetailsDiv.append(h5);
    moveInstrumentation(grievanceOfficerTitle, h5);
  }

  const grievanceOfficerName = block.querySelector('[data-aue-prop="grievanceOfficerName"]');
  if (grievanceOfficerName) {
    const p = document.createElement('p');
    p.classList.add('footer-contact-details__description', 'footer-mb-md-1', 'footer-mb-0');
    p.textContent = grievanceOfficerName.textContent;
    contactDetailsDiv.append(p);
    moveInstrumentation(grievanceOfficerName, p);
  }

  const grievanceOfficerContact = block.querySelector('[data-aue-prop="grievanceOfficerContact"]');
  if (grievanceOfficerContact) {
    const p = document.createElement('p');
    p.classList.add('footer-contact-details__description', 'footer-mb-md-1', 'footer-mb-0');
    p.textContent = grievanceOfficerContact.textContent;
    contactDetailsDiv.append(p);
    moveInstrumentation(grievanceOfficerContact, p);
  }

  const grievanceOfficerHours = block.querySelector('[data-aue-prop="grievanceOfficerHours"]');
  if (grievanceOfficerHours) {
    const p = document.createElement('p');
    p.classList.add('footer-contact-details__description', 'footer-mb-0');
    p.textContent = grievanceOfficerHours.textContent;
    contactDetailsDiv.append(p);
    moveInstrumentation(grievanceOfficerHours, p);
  }

  // Right Footer Links (Social Icons & Copyright)
  const rightFooterCol = document.createElement('div');
  rightFooterCol.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-align-items-md-end', 'footer-d-flex', 'footer-flex-column', 'footer-itc-footer-link-right');
  footerRow.append(rightFooterCol);
  moveInstrumentation(block.querySelector('.footer-col-lg-6.footer-col-sm-12.footer-align-items-md-end.footer-d-flex.footer-flex-column.footer-itc-footer-link-right'), rightFooterCol);

  const socialIconsWrapper = document.createElement('div');
  rightFooterCol.append(socialIconsWrapper);

  const authoredSocialLinks = block.querySelectorAll('[data-aue-model="socialLink"]');
  authoredSocialLinks.forEach((socialLinkNode) => {
    const ul = document.createElement('ul');
    ul.classList.add('footer-list-unstyled');
    const li = document.createElement('li');
    const link = socialLinkNode.querySelector('[data-aue-prop="link"]');
    const icon = socialLinkNode.querySelector('[data-aue-prop="icon"] img');
    if (link && icon) {
      const a = document.createElement('a');
      a.id = 'socialIcons';
      a.href = link.href;
      a.target = '_blank';
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = icon.src;
      img.alt = icon.alt || '';
      const span = document.createElement('span');
      span.classList.add('footer-cmp-link__screen-reader-only');
      span.textContent = 'opens in a new tab';
      a.append(img, span);
      li.append(a);
      ul.append(li);
      socialIconsWrapper.append(ul);
      moveInstrumentation(link, a);
      moveInstrumentation(icon, img);
      moveInstrumentation(socialLinkNode, ul);
    }
  });

  const copyrightSpan = block.querySelector('[data-aue-prop="copyright"]');
  if (copyrightSpan) {
    const span = document.createElement('span');
    span.classList.add('footer-link');
    span.textContent = copyrightSpan.textContent;
    rightFooterCol.append(span);
    moveInstrumentation(copyrightSpan, span);
  }

  // Secondary Footer
  const secondaryFooter = document.createElement('footer');
  secondaryFooter.classList.add('footer-itc-footer-section', 'footer-itc-footer-secondary');

  const secondaryUl = document.createElement('ul');
  secondaryUl.classList.add('footer-itc-footer-secondary-container');
  secondaryFooter.append(secondaryUl);

  const authoredSecondaryLinks = block.querySelectorAll('[data-aue-model="footerLink"][data-aue-resource="secondaryLinks"]');
  authoredSecondaryLinks.forEach((linkNode) => {
    const li = document.createElement('li');
    li.classList.add('footer-itc-footer-secondary-lists');
    const link = linkNode.querySelector('[data-aue-prop="link"]');
    const text = linkNode.querySelector('[data-aue-prop="text"]');
    if (link && text) {
      const a = document.createElement('a');
      a.classList.add('footer-links');
      a.href = link.href;
      a.target = '_blank';
      a.textContent = text.textContent;
      const span = document.createElement('span');
      span.classList.add('footer-cmp-link__screen-reader-only');
      span.textContent = 'opens in a new tab';
      a.append(span);
      li.append(a);
      secondaryUl.append(li);
      moveInstrumentation(link, a);
      moveInstrumentation(text, a);
      moveInstrumentation(linkNode, li);
    }
  });

  block.textContent = '';
  block.append(mainFooter, secondaryFooter);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
