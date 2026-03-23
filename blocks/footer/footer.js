import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const footerSection = document.createElement('footer');
  footerSection.classList.add('footer-section');

  const footerContainer = document.createElement('div');
  footerContainer.classList.add('footer-container');

  const footerRow = document.createElement('div');
  footerRow.classList.add('footer-row');

  // Column 1: Logos
  const col1 = document.createElement('div');
  col1.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-d-flex', 'footer-d-lg-block', 'footer-justify-content-center');

  const logosWrapper = document.createElement('div');
  logosWrapper.classList.add('footer-logos');

  const logos = block.querySelectorAll('[data-aue-model="logo"]');
  logos.forEach((logoNode) => {
    const logoDiv = document.createElement('div');
    const img = logoNode.querySelector('img');
    const link = logoNode.querySelector('a');

    if (img) {
      const picture = createOptimizedPicture(img.src, img.alt);
      if (link) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        newLink.target = link.target;
        newLink.append(picture);
        logoDiv.append(newLink);
        moveInstrumentation(link, newLink);
      } else {
        logoDiv.append(picture);
      }
      moveInstrumentation(img, picture);
    }
    if (logoNode.querySelector('.footer-itc-logo')) {
      logoDiv.classList.add('footer-itc-logo');
    } else if (logoNode.querySelector('.footer-fssai-logo')) {
      logoDiv.classList.add('footer-fssai-logo');
    }
    logosWrapper.append(logoDiv);
    moveInstrumentation(logoNode, logoDiv);
  });
  col1.append(logosWrapper);
  footerRow.append(col1);

  // Column 2: Footer Links (Other Links)
  const col2 = document.createElement('div');
  col2.classList.add('footer-col-lg-3', 'footer-col-sm-12', 'footer-d-flex', 'footer-justify-content-xl-between', 'footer-page-links-wrapper', 'footer-pt-md-0', 'footer-pt-4', 'footer-px-1');

  const footerOtherLinks = block.querySelectorAll('[data-aue-prop="footerOtherLinks"] [data-aue-model="footerLink"]');
  if (footerOtherLinks.length > 0) {
    const listDiv = document.createElement('div');
    listDiv.classList.add('footer-list-1', 'footer-list');
    const ul = document.createElement('ul');
    footerOtherLinks.forEach((linkNode) => {
      const li = document.createElement('li');
      const link = linkNode.querySelector('a');
      if (link) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        newLink.target = link.target;
        newLink.textContent = link.textContent.replace(/\s*opens in a new tab\s*$/, ''); // Remove screen reader text
        li.append(newLink);
        moveInstrumentation(link, newLink);
      }
      ul.append(li);
      moveInstrumentation(linkNode, li);
    });
    listDiv.append(ul);
    col2.append(listDiv);
  }
  footerRow.append(col2);

  // Column 3: Footer Links and Contact Details
  const col3 = document.createElement('div');
  col3.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-link-left');

  const listsContainer = document.createElement('div');
  listsContainer.classList.add('footer-lists-container', 'footer-d-flex');

  const footerLinks = block.querySelectorAll('[data-aue-prop="footerLinks"] [data-aue-model="footerLink"]');
  if (footerLinks.length > 0) {
    const listDiv = document.createElement('div');
    listDiv.classList.add('footer-list-4', 'footer-list');
    const ul = document.createElement('ul');
    footerLinks.forEach((linkNode) => {
      const li = document.createElement('li');
      const link = linkNode.querySelector('a');
      if (link) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        newLink.target = link.target;
        newLink.textContent = link.textContent.replace(/\s*opens in a new tab\s*$/, ''); // Remove screen reader text
        li.append(newLink);
        moveInstrumentation(link, newLink);
      }
      ul.append(li);
      moveInstrumentation(linkNode, li);
    });
    listDiv.append(ul);
    listsContainer.append(listDiv);
  }

  // Additional list from authored HTML
  const authoredList3 = block.querySelector('.footer-list-3.footer-list ul');
  if (authoredList3) {
    const listDiv = document.createElement('div');
    listDiv.classList.add('footer-list-3', 'footer-list');
    listDiv.append(authoredList3);
    listsContainer.append(listDiv);
    moveInstrumentation(authoredList3.parentElement, listDiv);
  }

  col3.append(listsContainer);

  const contactDetails = document.createElement('div');
  contactDetails.classList.add('footer-contact-details');

  const grievanceTitle = block.querySelector('[data-aue-prop="grievanceTitle"]');
  if (grievanceTitle) {
    const h5 = document.createElement('h5');
    h5.classList.add('footer-contact-details__title', 'footer-mb-md-3', 'footer-mb-0');
    h5.textContent = grievanceTitle.textContent;
    contactDetails.append(h5);
    moveInstrumentation(grievanceTitle, h5);
  }

  const grievanceName = block.querySelector('[data-aue-prop="grievanceName"]');
  if (grievanceName) {
    const p = document.createElement('p');
    p.classList.add('footer-contact-details__description', 'footer-mb-md-1', 'footer-mb-0');
    p.textContent = `Name: ${grievanceName.textContent}`;
    contactDetails.append(p);
    moveInstrumentation(grievanceName, p);
  }

  const grievanceContact = block.querySelector('[data-aue-prop="grievanceContact"]');
  if (grievanceContact) {
    const p = document.createElement('p');
    p.classList.add('footer-contact-details__description', 'footer-mb-md-1', 'footer-mb-0');
    p.textContent = `Contact Info: ${grievanceContact.textContent}`;
    contactDetails.append(p);
    moveInstrumentation(grievanceContact, p);
  }

  const grievanceTiming = block.querySelector('[data-aue-prop="grievanceTiming"]');
  if (grievanceTiming) {
    const p = document.createElement('p');
    p.classList.add('footer-contact-details__description', 'footer-mb-0');
    p.textContent = `(${grievanceTiming.textContent})`;
    contactDetails.append(p);
    moveInstrumentation(grievanceTiming, p);
  }

  col3.append(contactDetails);
  footerRow.append(col3);

  // Column 4: Social Links and Copyright
  const col4 = document.createElement('div');
  col4.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-align-items-md-end', 'footer-d-flex', 'footer-flex-column', 'footer-link-right');

  const socialLinksWrapper = document.createElement('div');
  const socialLinks = block.querySelectorAll('[data-aue-model="footerSocialLink"]');
  socialLinks.forEach((socialLinkNode) => {
    const ul = document.createElement('ul');
    ul.classList.add('footer-list-unstyled');
    const li = document.createElement('li');
    const link = socialLinkNode.querySelector('a');
    const icon = socialLinkNode.querySelector('img');

    if (link && icon) {
      const newLink = document.createElement('a');
      newLink.id = 'socialIcons';
      newLink.href = link.href;
      newLink.target = link.target;
      newLink.append(icon);
      li.append(newLink);
      moveInstrumentation(link, newLink);
      moveInstrumentation(icon, newLink);
    }
    ul.append(li);
    socialLinksWrapper.append(ul);
    moveInstrumentation(socialLinkNode, li);
  });
  col4.append(socialLinksWrapper);

  const copyright = block.querySelector('[data-aue-prop="copyright"]');
  if (copyright) {
    const span = document.createElement('span');
    span.classList.add('footer-link');
    span.textContent = copyright.textContent;
    col4.append(span);
    moveInstrumentation(copyright, span);
  }

  footerRow.append(col4);

  footerContainer.append(footerRow);
  footerSection.append(footerContainer);

  // Secondary Footer
  const secondaryFooter = document.createElement('footer');
  secondaryFooter.classList.add('footer-section', 'footer-secondary');
  const secondaryUl = document.createElement('ul');
  secondaryUl.classList.add('footer-secondary-container');

  // Assuming secondary footer links are not directly editable via AUE in this block definition
  // and are static or come from another source not provided.
  // For now, we'll just add placeholders if they exist in the authored HTML.
  const authoredSecondaryLinks = block.querySelectorAll('.footer-secondary-lists');
  authoredSecondaryLinks.forEach((linkNode) => {
    const li = document.createElement('li');
    li.classList.add('footer-secondary-lists');
    const a = linkNode.querySelector('a');
    if (a) {
      const newLink = document.createElement('a');
      newLink.classList.add('footer-links');
      newLink.target = a.target;
      // Move any children like span for screen reader text
      while (a.firstChild) {
        newLink.append(a.firstChild);
      }
      li.append(newLink);
      moveInstrumentation(a, newLink);
    }
    secondaryUl.append(li);
    moveInstrumentation(linkNode, li);
  });

  secondaryFooter.append(secondaryUl);

  block.textContent = '';
  block.append(footerSection);
  block.append(secondaryFooter);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
