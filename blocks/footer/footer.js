import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const footerContainer = document.createElement('div');
  footerContainer.className = 'footer-container';

  const footerRow = document.createElement('div');
  footerRow.className = 'footer-row';

  // Column 1: Logos
  const col1 = document.createElement('div');
  col1.className = 'footer-col-lg-6 footer-col-sm-12 footer-d-flex footer-d-lg-block footer-justify-content-center';

  const footerLogos = document.createElement('div');
  footerLogos.className = 'footer-footer-logos';

  const itcLogoDiv = document.createElement('div');
  itcLogoDiv.className = 'footer-footer-itc-logo';
  const itcLogoLink = block.querySelector('[data-aue-prop="itcLogoLink"]');
  const itcLogoImg = block.querySelector('[data-aue-prop="itcLogo"] img');
  if (itcLogoImg) {
    const picture = createOptimizedPicture(itcLogoImg.src, itcLogoImg.alt);
    if (itcLogoLink) {
      const link = document.createElement('a');
      link.href = itcLogoLink.href;
      link.target = '_self';
      link.append(picture);
      itcLogoDiv.append(link);
      moveInstrumentation(itcLogoImg, picture);
      moveInstrumentation(itcLogoLink, link);
    } else {
      itcLogoDiv.append(picture);
      moveInstrumentation(itcLogoImg, picture);
    }
  }
  footerLogos.append(itcLogoDiv);

  const fssaiLogoDiv = document.createElement('div');
  fssaiLogoDiv.className = 'footer-footer-fssai-logo';
  const fssaiLogoImg = block.querySelector('[data-aue-prop="fssaiLogo"] img');
  if (fssaiLogoImg) {
    const picture = createOptimizedPicture(fssaiLogoImg.src, fssaiLogoImg.alt);
    fssaiLogoDiv.append(picture);
    moveInstrumentation(fssaiLogoImg, picture);
  }
  footerLogos.append(fssaiLogoDiv);

  col1.append(footerLogos);
  footerRow.append(col1);

  // Column 2: Footer Links
  const col2 = document.createElement('div');
  col2.className = 'footer-col-lg-3 footer-col-sm-12 footer-d-flex footer-justify-content-xl-between footer-footer-page-links-wrapper footer-pt-md-0 footer-pt-4 footer-px-1';

  const footerLinksContainer = document.createElement('div');
  footerLinksContainer.className = 'footer-footer-lists-container footer-d-flex';

  const footerLinksList = document.createElement('div');
  footerLinksList.className = 'footer-list-4 footer-list';
  const ul1 = document.createElement('ul');
  const authoredFooterLinks = block.querySelectorAll('[data-aue-model="footerLink"]');
  authoredFooterLinks.forEach((itemNode) => {
    const linkElement = itemNode.querySelector('[data-aue-prop="link"]');
    const labelElement = itemNode.querySelector('[data-aue-prop="label"]');

    if (linkElement) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = linkElement.href;
      a.target = '_blank';
      a.textContent = labelElement ? labelElement.textContent : linkElement.textContent;
      li.append(a);
      ul1.append(li);
      moveInstrumentation(itemNode, li);
      if (labelElement) moveInstrumentation(labelElement, a);
      moveInstrumentation(linkElement, a);
    }
  });
  footerLinksList.append(ul1);
  footerLinksContainer.append(footerLinksList);

  const footerMenuList = document.createElement('div');
  footerMenuList.className = 'footer-list-3 footer-list';
  const ul2 = document.createElement('ul');
  const authoredFooterMenu = block.querySelectorAll('[data-aue-model="footerMenu"]');
  authoredFooterMenu.forEach((itemNode) => {
    const linkElement = itemNode.querySelector('[data-aue-prop="link"]');
    const labelElement = itemNode.querySelector('[data-aue-prop="label"]');

    if (linkElement) {
      const li = document.createElement('li');
      li.className = 'footer-cmp-list__item';
      const a = document.createElement('a');
      a.className = 'footer-cmp-list__item-link';
      a.href = linkElement.href;
      const span = document.createElement('span');
      span.className = 'footer-cmp-list__item-title';
      span.textContent = labelElement ? labelElement.textContent : linkElement.textContent;
      a.append(span);
      li.append(a);
      ul2.append(li);
      moveInstrumentation(itemNode, li);
      if (labelElement) moveInstrumentation(labelElement, span);
      moveInstrumentation(linkElement, a);
    }
  });
  footerMenuList.append(ul2);
  footerLinksContainer.append(footerMenuList);

  const contactDetails = document.createElement('div');
  contactDetails.className = 'footer-contact-details';

  const grievanceOfficerTitle = block.querySelector('[data-aue-prop="grievanceOfficerTitle"]');
  if (grievanceOfficerTitle) {
    const h5 = document.createElement('h5');
    h5.className = 'footer-contact-details__title footer-mb-md-3 footer-mb-0';
    h5.textContent = grievanceOfficerTitle.textContent;
    contactDetails.append(h5);
    moveInstrumentation(grievanceOfficerTitle, h5);
  }

  const grievanceOfficerName = block.querySelector('[data-aue-prop="grievanceOfficerName"]');
  if (grievanceOfficerName) {
    const p = document.createElement('p');
    p.className = 'footer-contact-details__description footer-mb-md-1 footer-mb-0';
    p.textContent = grievanceOfficerName.textContent;
    contactDetails.append(p);
    moveInstrumentation(grievanceOfficerName, p);
  }

  const grievanceOfficerContact = block.querySelector('[data-aue-prop="grievanceOfficerContact"]');
  if (grievanceOfficerContact) {
    const p = document.createElement('p');
    p.className = 'footer-contact-details__description footer-mb-md-1 footer-mb-0';
    p.textContent = grievanceOfficerContact.textContent;
    contactDetails.append(p);
    moveInstrumentation(grievanceOfficerContact, p);
  }

  const grievanceOfficerTiming = block.querySelector('[data-aue-prop="grievanceOfficerTiming"]');
  if (grievanceOfficerTiming) {
    const p = document.createElement('p');
    p.className = 'footer-contact-details__description footer-mb-0';
    p.textContent = grievanceOfficerTiming.textContent;
    contactDetails.append(p);
    moveInstrumentation(grievanceOfficerTiming, p);
  }

  col2.append(footerLinksContainer, contactDetails);
  footerRow.append(col2);

  // Column 3: Social Icons and Copyright
  const col3 = document.createElement('div');
  col3.className = 'footer-col-lg-6 footer-col-sm-12 footer-align-items-md-end footer-d-flex footer-flex-column footer-itc-footer-link-right';

  const socialIconsWrapper = document.createElement('div');
  const socialIcons = block.querySelectorAll('[data-aue-model="socialIcon"]');
  socialIcons.forEach((itemNode) => {
    const linkElement = itemNode.querySelector('[data-aue-prop="link"]');
    const iconElement = itemNode.querySelector('[data-aue-prop="icon"] img');

    if (linkElement && iconElement) {
      const ul = document.createElement('ul');
      ul.className = 'footer-list-unstyled';
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.id = 'socialIcons';
      a.href = linkElement.href;
      a.target = '_blank';
      a.append(createOptimizedPicture(iconElement.src, iconElement.alt));
      li.append(a);
      ul.append(li);
      socialIconsWrapper.append(ul);
      moveInstrumentation(itemNode, li);
      moveInstrumentation(linkElement, a);
      moveInstrumentation(iconElement, a.querySelector('picture'));
    }
  });
  col3.append(socialIconsWrapper);

  const copyright = block.querySelector('[data-aue-prop="copyright"]');
  if (copyright) {
    const span = document.createElement('span');
    span.className = 'footer-footer-link';
    span.textContent = copyright.textContent;
    col3.append(span);
    moveInstrumentation(copyright, span);
  }

  footerRow.append(col3);
  footerContainer.append(footerRow);

  block.textContent = '';
  block.append(footerContainer);
  block.className = `footer-itc-footer-section ${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
