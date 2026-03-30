import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const mainFooter = document.createElement('footer');
  mainFooter.classList.add('footer-itc-footer-section');

  const footerContainer = document.createElement('div');
  footerContainer.classList.add('footer-container');
  mainFooter.append(footerContainer);

  const footerRow = document.createElement('div');
  footerRow.classList.add('footer-row');
  footerContainer.append(footerRow);

  // Column 1: Logos
  const col1 = document.createElement('div');
  col1.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-d-flex', 'footer-d-lg-block', 'footer-justify-content-center');
  footerRow.append(col1);

  const footerLogosWrapper = document.createElement('div');
  footerLogosWrapper.classList.add('footer-footer-logos');
  col1.append(footerLogosWrapper);

  const footerLogos = block.querySelectorAll('[data-aue-model="footerLogo"]');
  footerLogos.forEach((logoNode) => {
    const logoDiv = document.createElement('div');
    // Check for specific logo classes based on authored content
    if (logoNode.querySelector('[data-aue-prop="image"] img[alt="ITC logo"]')) {
      logoDiv.classList.add('footer-footer-itc-logo');
    } else if (logoNode.querySelector('[data-aue-prop="image"] img[alt="Fssai Logo"]')) {
      logoDiv.classList.add('footer-footer-fssai-logo');
    }

    const imgElement = logoNode.querySelector('[data-aue-prop="image"] img');
    if (imgElement) {
      const picture = createOptimizedPicture(imgElement.src, imgElement.alt);
      const linkElement = logoNode.querySelector('[data-aue-prop="link"] a');
      if (linkElement) {
        const newLink = document.createElement('a');
        newLink.href = linkElement.href;
        newLink.target = linkElement.target;
        newLink.append(picture);
        logoDiv.append(newLink);
        moveInstrumentation(linkElement, newLink);
      } else {
        logoDiv.append(picture);
      }
      moveInstrumentation(imgElement, picture);
    }
    footerLogosWrapper.append(logoDiv);
    moveInstrumentation(logoNode, logoDiv);
  });

  // Column 2: Page Links
  const col2 = document.createElement('div');
  col2.classList.add('footer-col-lg-3', 'footer-col-sm-12', 'footer-d-flex', 'footer-justify-content-xl-between', 'footer-footer-page-links-wrapper', 'footer-pt-md-0', 'footer-pt-4', 'footer-px-1');
  footerRow.append(col2);

  const footerLinksContainer = document.createElement('div');
  footerLinksContainer.classList.add('footer-footer-lists-container', 'footer-d-flex');

  const authoredFooterLinks = block.querySelectorAll('[data-aue-model="footerLink"]');
  const lists = [];
  let currentList = document.createElement('ul');
  currentList.classList.add('footer-list');
  lists.push(currentList);

  authoredFooterLinks.forEach((linkNode, index) => {
    if (index > 0 && index % 3 === 0) { // Distribute links into two lists for the example structure
      currentList = document.createElement('ul');
      currentList.classList.add('footer-list');
      lists.push(currentList);
    }
    const li = document.createElement('li');
    const link = linkNode.querySelector('[data-aue-prop="url"] a');
    const text = linkNode.querySelector('[data-aue-prop="text"]');
    if (link && text) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.target = link.target;
      newLink.textContent = text.textContent;
      li.append(newLink);
      moveInstrumentation(link, newLink);
      moveInstrumentation(text, newLink);
    } else if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.target = link.target;
      newLink.textContent = link.textContent;
      li.append(newLink);
      moveInstrumentation(link, newLink);
    } else if (text) {
      const p = document.createElement('p');
      p.textContent = text.textContent;
      li.append(p);
      moveInstrumentation(text, p);
    }
    currentList.append(li);
    moveInstrumentation(linkNode, li);
  });

  lists.forEach((list, index) => {
    if (index === 0) {
      list.classList.add('footer-list-4'); // Corresponds to the first set of links in authored HTML
    } else if (index === 1) {
      list.classList.add('footer-list-3'); // Corresponds to the second set of links in authored HTML
    }
    footerLinksContainer.append(list);
  });

  const leftLinkCol = document.createElement('div');
  leftLinkCol.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-itc-footer-link-left');
  leftLinkCol.append(footerLinksContainer);
  footerRow.append(leftLinkCol);

  // Grievance Officer Details
  const contactDetails = document.createElement('div');
  contactDetails.classList.add('footer-contact-details');

  const grievanceTitle = document.createElement('h5');
  grievanceTitle.classList.add('footer-contact-details__title', 'footer-mb-md-3', 'footer-mb-0');
  grievanceTitle.textContent = 'Grievance Officer:';
  contactDetails.append(grievanceTitle);

  const grievanceOfficerName = block.querySelector('[data-aue-prop="grievanceOfficerName"]');
  if (grievanceOfficerName) {
    const p = document.createElement('p');
    p.classList.add('footer-contact-details__description', 'footer-mb-md-1', 'footer-mb-0');
    p.textContent = `Name: ${grievanceOfficerName.textContent}`;
    contactDetails.append(p);
    moveInstrumentation(grievanceOfficerName, p);
  }

  const grievanceOfficerContact = block.querySelector('[data-aue-prop="grievanceOfficerContact"]');
  if (grievanceOfficerContact) {
    const p = document.createElement('p');
    p.classList.add('footer-contact-details__description', 'footer-mb-md-1', 'footer-mb-0');
    p.textContent = `Contact Info: ${grievanceOfficerContact.textContent}`;
    contactDetails.append(p);
    moveInstrumentation(grievanceOfficerContact, p);
  }

  const grievanceOfficerTiming = block.querySelector('[data-aue-prop="grievanceOfficerTiming"]');
  if (grievanceOfficerTiming) {
    const p = document.createElement('p');
    p.classList.add('footer-contact-details__description', 'footer-mb-0');
    p.textContent = `(${grievanceOfficerTiming.textContent})` || '(9:30 AM to 5:30 PM on working days)'; // Fallback
    contactDetails.append(p);
    moveInstrumentation(grievanceOfficerTiming, p);
  }
  leftLinkCol.append(contactDetails);

  // Column 3: Social Icons and Copyright
  const col3 = document.createElement('div');
  col3.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-align-items-md-end', 'footer-d-flex', 'footer-flex-column', 'footer-itc-footer-link-right');
  footerRow.append(col3);

  const socialIconsWrapper = document.createElement('div');
  col3.append(socialIconsWrapper);

  const socialIcons = block.querySelectorAll('[data-aue-model="footerSocialIcon"]');
  socialIcons.forEach((iconNode) => {
    const ul = document.createElement('ul');
    ul.classList.add('footer-list-unstyled');
    const li = document.createElement('li');
    const link = iconNode.querySelector('[data-aue-prop="url"] a');
    const imgElement = iconNode.querySelector('[data-aue-prop="icon"] img');

    if (link && imgElement) {
      const newLink = document.createElement('a');
      newLink.id = 'socialIcons';
      newLink.href = link.href;
      newLink.target = link.target;
      newLink.append(imgElement);
      const span = document.createElement('span');
      span.classList.add('footer-cmp-link__screen-reader-only');
      span.textContent = 'opens in a new tab';
      newLink.append(span);
      li.append(newLink);
      moveInstrumentation(link, newLink);
      moveInstrumentation(imgElement, newLink);
    }
    ul.append(li);
    socialIconsWrapper.append(ul);
    moveInstrumentation(iconNode, ul);
  });

  const copyrightSpan = document.createElement('span');
  copyrightSpan.classList.add('footer-footer-link');
  const copyrightText = block.querySelector('[data-aue-prop="copyright"]');
  if (copyrightText) {
    copyrightSpan.textContent = copyrightText.textContent;
    moveInstrumentation(copyrightText, copyrightSpan);
  } else {
    copyrightSpan.textContent = '©Copyright 2026 Kitchens of India'; // Fallback
  }
  col3.append(copyrightSpan);

  // Secondary Footer (if needed, based on authored content)
  const secondaryFooter = document.createElement('footer');
  secondaryFooter.classList.add('footer-itc-footer-section', 'footer-itc-footer-secondary');
  const secondaryUl = document.createElement('ul');
  secondaryUl.classList.add('footer-itc-footer-secondary-container');
  secondaryFooter.append(secondaryUl);

  // This part is not explicitly mapped in the JSON, assuming it's static or from a different source
  // For now, creating based on the provided HTML structure
  // You might need to adjust this if there's a specific AUE mapping for secondary links
  for (let i = 0; i < 2; i += 1) {
    const li = document.createElement('li');
    li.classList.add('footer-itc-footer-secondary-lists');
    const a = document.createElement('a');
    a.classList.add('footer-footer-links');
    a.target = '_blank';
    const span = document.createElement('span');
    span.classList.add('footer-cmp-link__screen-reader-only');
    span.textContent = 'opens in a new tab';
    a.append(span);
    li.append(a);
    secondaryUl.append(li);
  }

  block.textContent = '';
  block.append(mainFooter);
  block.append(secondaryFooter);
  block.className = `footer block`;
  block.dataset.blockStatus = 'loaded';
}
