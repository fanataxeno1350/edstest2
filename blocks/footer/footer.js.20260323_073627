import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const footerContainer = document.createElement('div');
  footerContainer.classList.add('footer-container');

  const footerRow = document.createElement('div');
  footerRow.classList.add('footer-row');

  // Column 1: Logos
  const col1 = document.createElement('div');
  col1.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-d-flex', 'footer-d-lg-block', 'footer-justify-content-center');

  const footerLogos = document.createElement('div');
  footerLogos.classList.add('footer-footer-logos');

  const itcLogoDiv = document.createElement('div');
  itcLogoDiv.classList.add('footer-footer-itc-logo');
  const itcLogoWrapper = document.createElement('div');
  itcLogoWrapper.classList.add('footer-logo', 'footer-image');
  const itcLogoLink = block.querySelector('[data-aue-prop="itcLogoLink"]');
  const itcLogoImg = block.querySelector('[data-aue-prop="itcLogo"] img');
  if (itcLogoImg) {
    const picture = createOptimizedPicture(itcLogoImg.src, itcLogoImg.alt);
    if (itcLogoLink) {
      const link = document.createElement('a');
      link.href = itcLogoLink.href || '#';
      link.target = '_blank';
      link.append(picture);
      itcLogoWrapper.append(link);
      moveInstrumentation(itcLogoImg, picture.querySelector('img'));
      moveInstrumentation(itcLogoLink, link);
    } else {
      itcLogoWrapper.append(picture);
      moveInstrumentation(itcLogoImg, picture.querySelector('img'));
    }
    itcLogoDiv.append(itcLogoWrapper);
  }

  const fssaiLogoDiv = document.createElement('div');
  fssaiLogoDiv.classList.add('footer-footer-fssai-logo');
  const fssaiLogoWrapper = document.createElement('div');
  fssaiLogoWrapper.classList.add('footer-fssailogo', 'footer-logo', 'footer-image');
  const fssaiLogoImg = block.querySelector('[data-aue-prop="fssaiLogo"] img');
  if (fssaiLogoImg) {
    const picture = createOptimizedPicture(fssaiLogoImg.src, fssaiLogoImg.alt);
    fssaiLogoWrapper.append(picture);
    fssaiLogoDiv.append(fssaiLogoWrapper);
    moveInstrumentation(fssaiLogoImg, picture.querySelector('img'));
  }

  footerLogos.append(itcLogoDiv, fssaiLogoDiv);
  col1.append(footerLogos);
  footerRow.append(col1);

  // Column 2: Footer Links (Main)
  const col2 = document.createElement('div');
  col2.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-itc-footer-link-left');

  const footerListsContainer = document.createElement('div');
  footerListsContainer.classList.add('footer-footer-lists-container', 'footer-d-flex');

  const footerLinks = block.querySelectorAll('[data-aue-model="footerLink"]');
  if (footerLinks.length > 0) {
    const ul = document.createElement('ul');
    ul.classList.add('footer-list');
    footerLinks.forEach((linkNode) => {
      const li = document.createElement('li');
      const linkElement = linkNode.querySelector('[data-aue-prop="link"]');
      const labelElement = linkNode.querySelector('[data-aue-prop="label"]');
      if (linkElement && labelElement) {
        const a = document.createElement('a');
        a.href = linkElement.href || '#';
        a.target = '_blank';
        a.textContent = labelElement.textContent;
        li.append(a);
        ul.append(li);
        moveInstrumentation(linkElement, a);
        moveInstrumentation(labelElement, a);
      }
      moveInstrumentation(linkNode, li);
    });
    const listDiv = document.createElement('div');
    listDiv.classList.add('footer-list-4', 'footer-list');
    listDiv.append(ul);
    footerListsContainer.append(listDiv);
  }

  // Grievance Officer Details
  const contactDetails = document.createElement('div');
  contactDetails.classList.add('footer-contact-details');

  const grievanceOfficerTitle = block.querySelector('[data-aue-prop="grievanceOfficerTitle"]');
  if (grievanceOfficerTitle) {
    const h5 = document.createElement('h5');
    h5.classList.add('footer-contact-details__title', 'footer-mb-md-3', 'footer-mb-0');
    h5.textContent = grievanceOfficerTitle.textContent;
    contactDetails.append(h5);
    moveInstrumentation(grievanceOfficerTitle, h5);
  }

  const grievanceOfficerName = block.querySelector('[data-aue-prop="grievanceOfficerName"]');
  if (grievanceOfficerName) {
    const p = document.createElement('p');
    p.classList.add('footer-contact-details__description', 'footer-mb-md-1', 'footer-mb-0');
    p.textContent = grievanceOfficerName.textContent;
    contactDetails.append(p);
    moveInstrumentation(grievanceOfficerName, p);
  }

  const grievanceOfficerContact = block.querySelector('[data-aue-prop="grievanceOfficerContact"]');
  if (grievanceOfficerContact) {
    const p = document.createElement('p');
    p.classList.add('footer-contact-details__description', 'footer-mb-md-1', 'footer-mb-0');
    p.textContent = grievanceOfficerContact.textContent;
    contactDetails.append(p);
    moveInstrumentation(grievanceOfficerContact, p);
  }

  const grievanceOfficerTime = block.querySelector('[data-aue-prop="grievanceOfficerTime"]');
  if (grievanceOfficerTime) {
    const p = document.createElement('p');
    p.classList.add('footer-contact-details__description', 'footer-mb-0');
    p.textContent = grievanceOfficerTime.textContent;
    contactDetails.append(p);
    moveInstrumentation(grievanceOfficerTime, p);
  }

  col2.append(footerListsContainer, contactDetails);
  footerRow.append(col2);

  // Column 3: Social Links and Copyright
  const col3 = document.createElement('div');
  col3.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-align-items-md-end', 'footer-d-flex', 'footer-flex-column', 'footer-itc-footer-link-right');

  const socialLinksWrapper = document.createElement('div');
  const socialLinks = block.querySelectorAll('[data-aue-model="socialLink"]');
  socialLinks.forEach((socialLinkNode) => {
    const ul = document.createElement('ul');
    ul.classList.add('footer-list-unstyled');
    const li = document.createElement('li');
    const linkElement = socialLinkNode.querySelector('[data-aue-prop="link"]');
    const iconElement = socialLinkNode.querySelector('[data-aue-prop="icon"] img');

    if (linkElement && iconElement) {
      const a = document.createElement('a');
      a.id = 'socialIcons';
      a.href = linkElement.href || '#';
      a.target = '_blank';
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = iconElement.src;
      a.append(img);
      li.append(a);
      ul.append(li);
      socialLinksWrapper.append(ul);
      moveInstrumentation(linkElement, a);
      moveInstrumentation(iconElement, img);
    }
    moveInstrumentation(socialLinkNode, li);
  });
  col3.append(socialLinksWrapper);

  const copyright = block.querySelector('[data-aue-prop="copyright"]');
  if (copyright) {
    const span = document.createElement('span');
    span.classList.add('footer-footer-link');
    span.textContent = copyright.textContent;
    col3.append(span);
    moveInstrumentation(copyright, span);
  }

  footerRow.append(col3);

  footerContainer.append(footerRow);

  block.textContent = '';
  block.append(footerContainer);
  block.className = `footer block`;
  block.dataset.blockStatus = 'loaded';
}
