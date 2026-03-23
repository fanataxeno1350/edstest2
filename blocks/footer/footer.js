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
  const logosDiv = document.createElement('div');
  logosDiv.classList.add('footer-logos');

  const itcLogoDiv = document.createElement('div');
  itcLogoDiv.classList.add('footer-itc-logo');
  const itcLogoImg = block.querySelector('[data-aue-prop="itcLogo"] img');
  if (itcLogoImg) {
    const picture = createOptimizedPicture(itcLogoImg.src, itcLogoImg.alt);
    itcLogoDiv.append(picture);
    moveInstrumentation(itcLogoImg, picture);
  }
  logosDiv.append(itcLogoDiv);

  const fssaiLogoDiv = document.createElement('div');
  fssaiLogoDiv.classList.add('footer-fssai-logo');
  const fssaiLogoImg = block.querySelector('[data-aue-prop="fssaiLogo"] img');
  if (fssaiLogoImg) {
    const picture = createOptimizedPicture(fssaiLogoImg.src, fssaiLogoImg.alt);
    fssaiLogoDiv.append(picture);
    moveInstrumentation(fssaiLogoImg, picture);
  }
  logosDiv.append(fssaiLogoDiv);
  col1.append(logosDiv);
  footerRow.append(col1);

  // Column 2: Page Links (empty in authored, but structure needed)
  const col2 = document.createElement('div');
  col2.classList.add('footer-col-lg-3', 'footer-col-sm-12', 'footer-d-flex', 'footer-justify-content-xl-between', 'footer-page-links-wrapper', 'footer-pt-md-0', 'footer-pt-4', 'footer-px-1');
  // The authored HTML has empty list divs here, so we create them
  const list1 = document.createElement('div');
  list1.classList.add('footer-list-1', 'footer-list');
  const list2 = document.createElement('div');
  list2.classList.add('footer-list-2', 'footer-list');
  col2.append(list1, list2);
  footerRow.append(col2);

  // Column 3: Footer Links and Contact Details
  const col3 = document.createElement('div');
  col3.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-itc-footer-link-left');

  const listsContainer = document.createElement('div');
  listsContainer.classList.add('footer-lists-container', 'footer-d-flex');
  col3.append(listsContainer);

  const footerLinksWrapper = document.createElement('div');
  footerLinksWrapper.classList.add('footer-list-4', 'footer-list');
  const footerLinksUl = document.createElement('ul');
  const footerLinks = block.querySelectorAll('[data-aue-model="footerLink"]');
  footerLinks.forEach((linkNode) => {
    const li = document.createElement('li');
    const link = linkNode.querySelector('[data-aue-prop="link"] a');
    const label = linkNode.querySelector('[data-aue-prop="label"]');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      if (link.target) newLink.target = link.target;
      newLink.textContent = label ? label.textContent : link.textContent;
      li.append(newLink);
      moveInstrumentation(link, newLink);
      if (label) moveInstrumentation(label, newLink);
    } else if (label) {
      li.textContent = label.textContent;
      moveInstrumentation(label, li);
    }
    footerLinksUl.append(li);
    moveInstrumentation(linkNode, li);
  });
  footerLinksWrapper.append(footerLinksUl);
  listsContainer.append(footerLinksWrapper);

  // Recreate the second list from authored HTML
  const list3 = document.createElement('div');
  list3.classList.add('footer-list-3', 'footer-list');
  const authoredList3Ul = block.querySelector('.footer-list-3 ul');
  if (authoredList3Ul) {
    list3.append(authoredList3Ul);
    moveInstrumentation(authoredList3Ul, list3);
  }
  listsContainer.append(list3);

  const contactDetailsDiv = document.createElement('div');
  contactDetailsDiv.classList.add('footer-contact-details');

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
  col3.append(contactDetailsDiv);
  footerRow.append(col3);

  // Column 4: Social Icons and Copyright
  const col4 = document.createElement('div');
  col4.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-align-items-md-end', 'footer-d-flex', 'footer-flex-column', 'footer-itc-footer-link-right');

  const socialIconsDiv = document.createElement('div');
  const socialIcons = block.querySelectorAll('[data-aue-model="socialIcon"]');
  socialIcons.forEach((iconNode) => {
    const ul = document.createElement('ul');
    ul.classList.add('footer-list-unstyled');
    const li = document.createElement('li');
    const link = iconNode.querySelector('[data-aue-prop="link"] a');
    const icon = iconNode.querySelector('[data-aue-prop="icon"] img');
    if (link && icon) {
      const newLink = document.createElement('a');
      newLink.id = 'socialIcons';
      newLink.href = link.href;
      if (link.target) newLink.target = link.target;
      newLink.append(createOptimizedPicture(icon.src, icon.alt));
      li.append(newLink);
      moveInstrumentation(link, newLink);
      moveInstrumentation(icon, newLink.querySelector('picture'));
    }
    ul.append(li);
    socialIconsDiv.append(ul);
    moveInstrumentation(iconNode, ul);
  });
  col4.append(socialIconsDiv);

  const copyrightSpan = document.createElement('span');
  copyrightSpan.classList.add('footer-link');
  const copyrightText = block.querySelector('[data-aue-prop="copyright"]');
  if (copyrightText) {
    copyrightSpan.textContent = copyrightText.textContent;
    moveInstrumentation(copyrightText, copyrightSpan);
  }
  col4.append(copyrightSpan);
  footerRow.append(col4);

  footerContainer.append(footerRow);

  // Secondary Footer (static content, not in block json)
  const secondaryFooter = document.createElement('footer');
  secondaryFooter.classList.add('footer-itc-footer-section', 'footer-itc-footer-secondary');
  const secondaryUl = document.createElement('ul');
  secondaryUl.classList.add('footer-itc-footer-secondary-container');
  // Assuming these are static or from another block/content area not defined in JSON
  // For now, recreate based on provided HTML as static
  const secondaryLi1 = document.createElement('li');
  secondaryLi1.classList.add('footer-itc-footer-secondary-lists');
  const secondaryLink1 = document.createElement('a');
  secondaryLink1.classList.add('footer-links');
  secondaryLink1.target = '_blank';
  secondaryLink1.innerHTML = '<span class="footer-cmp-link__screen-reader-only">opens in a new tab</span>';
  secondaryLi1.append(secondaryLink1);
  secondaryUl.append(secondaryLi1);

  const secondaryLi2 = document.createElement('li');
  secondaryLi2.classList.add('footer-itc-footer-secondary-lists');
  const secondaryLink2 = document.createElement('a');
  secondaryLink2.classList.add('footer-links');
  secondaryLink2.target = '_blank';
  secondaryLink2.innerHTML = '<span class="footer-cmp-link__screen-reader-only">opens in a new tab</span>';
  secondaryLi2.append(secondaryLink2);
  secondaryUl.append(secondaryLi2);

  secondaryFooter.append(secondaryUl);

  block.textContent = '';
  block.append(footerContainer, secondaryFooter);
  block.className = 'footer block'; // Assuming block.dataset.blockName is 'footer'
  block.dataset.blockStatus = 'loaded';
}
