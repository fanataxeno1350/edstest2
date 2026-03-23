import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const mainFooter = block.querySelector('.footer-itc-footer-section:first-of-type');
  if (!mainFooter) return;

  const rootDiv = document.createElement('div');
  rootDiv.classList.add('footer-container');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('footer-row');

  // Column 1: Logos
  const col1Div = document.createElement('div');
  col1Div.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-d-flex', 'footer-d-lg-block', 'footer-justify-content-center');

  const logosContainer = document.createElement('div');
  logosContainer.classList.add('footer-logos');

  const footerLogos = mainFooter.querySelectorAll('[data-aue-model="footerLogo"]');
  footerLogos.forEach((logoNode) => {
    const logoWrapper = document.createElement('div');
    const img = logoNode.querySelector('img');
    const link = logoNode.querySelector('a');

    if (img) {
      const picture = createOptimizedPicture(img.src, img.alt);
      if (link) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        newLink.target = link.target;
        newLink.append(picture);
        logoWrapper.append(newLink);
        moveInstrumentation(link, newLink);
      } else {
        logoWrapper.append(picture);
      }
      moveInstrumentation(img, picture);
    }
    logosContainer.append(logoWrapper);
    moveInstrumentation(logoNode, logoWrapper);
  });
  col1Div.append(logosContainer);
  moveInstrumentation(mainFooter.querySelector('.footer-logos'), logosContainer);
  rowDiv.append(col1Div);

  // Column 2: Page Links (empty in authored HTML, but structure exists)
  const col2Div = document.createElement('div');
  col2Div.classList.add('footer-col-lg-3', 'footer-col-sm-12', 'footer-d-flex', 'footer-justify-content-xl-between', 'footer-page-links-wrapper', 'footer-pt-md-0', 'footer-pt-4', 'footer-px-1');
  // No direct authored content for this column in the provided sample that maps to model
  // If there were, it would be extracted here.
  rowDiv.append(col2Div);

  // Column 3: Footer Links and Grievance Details
  const col3Div = document.createElement('div');
  col3Div.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-itc-footer-link-left');

  const listsContainer = document.createElement('div');
  listsContainer.classList.add('footer-lists-container', 'footer-d-flex');

  const footerLinks = mainFooter.querySelectorAll('[data-aue-model="footerLink"]');
  const linkList = document.createElement('ul');
  footerLinks.forEach((linkNode) => {
    const listItem = document.createElement('li');
    const link = linkNode.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.target = link.target;
      newLink.textContent = link.textContent.replace(/\s*opens in a new tab\s*$/, ''); // Remove screen reader text
      listItem.append(newLink);
      moveInstrumentation(link, newLink);
    } else {
      // Fallback for text if no link, though model implies link
      const text = linkNode.querySelector('[data-aue-prop="text"]') || linkNode.querySelector('span');
      if (text) {
        listItem.textContent = text.textContent;
        moveInstrumentation(text, listItem);
      }
    }
    linkList.append(listItem);
    moveInstrumentation(linkNode, listItem);
  });
  if (linkList.children.length > 0) {
    const linkListWrapper = document.createElement('div');
    linkListWrapper.classList.add('footer-list', 'footer-list-4'); // Assuming this structure for the extracted links
    linkListWrapper.append(linkList);
    listsContainer.append(linkListWrapper);
  }

  const grievanceTitle = mainFooter.querySelector('[data-aue-prop="grievanceTitle"]');
  const grievanceName = mainFooter.querySelector('[data-aue-prop="grievanceName"]');
  const grievanceContact = mainFooter.querySelector('[data-aue-prop="grievanceContact"]');
  const grievanceTiming = mainFooter.querySelector('[data-aue-prop="grievanceTiming"]');

  const contactDetailsDiv = document.createElement('div');
  contactDetailsDiv.classList.add('footer-contact-details');

  if (grievanceTitle) {
    const h5 = document.createElement('h5');
    h5.classList.add('footer-contact-details__title', 'footer-mb-md-3', 'footer-mb-0');
    h5.textContent = grievanceTitle.textContent;
    contactDetailsDiv.append(h5);
    moveInstrumentation(grievanceTitle, h5);
  }
  if (grievanceName) {
    const p = document.createElement('p');
    p.classList.add('footer-contact-details__description', 'footer-mb-md-1', 'footer-mb-0');
    p.textContent = grievanceName.textContent;
    contactDetailsDiv.append(p);
    moveInstrumentation(grievanceName, p);
  }
  if (grievanceContact) {
    const p = document.createElement('p');
    p.classList.add('footer-contact-details__description', 'footer-mb-md-1', 'footer-mb-0');
    p.textContent = grievanceContact.textContent;
    contactDetailsDiv.append(p);
    moveInstrumentation(grievanceContact, p);
  }
  if (grievanceTiming) {
    const p = document.createElement('p');
    p.classList.add('footer-contact-details__description', 'footer-mb-0');
    p.textContent = grievanceTiming.textContent;
    contactDetailsDiv.append(p);
    moveInstrumentation(grievanceTiming, p);
  }

  col3Div.append(listsContainer, contactDetailsDiv);
  rowDiv.append(col3Div);

  // Column 4: Social Icons and Copyright
  const col4Div = document.createElement('div');
  col4Div.classList.add('footer-col-lg-6', 'footer-col-sm-12', 'footer-align-items-md-end', 'footer-d-flex', 'footer-flex-column', 'footer-itc-footer-link-right');

  const socialIconsDiv = document.createElement('div');
  const footerSocials = mainFooter.querySelectorAll('[data-aue-model="footerSocial"]');
  footerSocials.forEach((socialNode) => {
    const ul = document.createElement('ul');
    ul.classList.add('footer-list-unstyled');
    const li = document.createElement('li');
    const link = socialNode.querySelector('a');
    const img = socialNode.querySelector('img');

    if (link && img) {
      const newLink = document.createElement('a');
      newLink.id = link.id;
      newLink.href = link.href;
      newLink.target = link.target;
      const picture = createOptimizedPicture(img.src, img.alt);
      newLink.append(picture);
      newLink.innerHTML += '<span class="footer-cmp-link__screen-reader-only">opens in a new tab</span>'; // Re-add screen reader text
      li.append(newLink);
      moveInstrumentation(link, newLink);
      moveInstrumentation(img, picture);
    }
    ul.append(li);
    socialIconsDiv.append(ul);
    moveInstrumentation(socialNode, ul);
  });
  col4Div.append(socialIconsDiv);

  const copyright = mainFooter.querySelector('[data-aue-prop="copyright"]');
  if (copyright) {
    const span = document.createElement('span');
    span.classList.add('footer-link');
    span.textContent = copyright.textContent;
    col4Div.append(span);
    moveInstrumentation(copyright, span);
  }
  rowDiv.append(col4Div);

  rootDiv.append(rowDiv);

  // Secondary Footer (if present)
  const secondaryFooter = block.querySelector('.footer-itc-footer-secondary');
  if (secondaryFooter) {
    // Assuming secondary footer content is static or handled differently
    // For this example, we'll just move the existing secondary footer structure if it exists
    // In a real scenario, you'd extract and rebuild its content based on its own model/fields
    const secondaryFooterContainer = document.createElement('ul');
    secondaryFooterContainer.classList.add('footer-itc-footer-secondary-container');
    const secondaryLinks = secondaryFooter.querySelectorAll('li');
    secondaryLinks.forEach(linkItem => {
        const newLi = document.createElement('li');
        newLi.classList.add('footer-itc-footer-secondary-lists');
        const link = linkItem.querySelector('a');
        if (link) {
            const newLink = document.createElement('a');
            newLink.classList.add('footer-links');
            newLink.target = link.target;
            newLink.href = link.href || '#'; // Ensure href exists
            newLink.innerHTML = link.innerHTML;
            newLi.append(newLink);
            moveInstrumentation(link, newLink);
        }
        secondaryFooterContainer.append(newLi);
        moveInstrumentation(linkItem, newLi);
    });

    const newSecondaryFooter = document.createElement('footer');
    newSecondaryFooter.classList.add('footer-itc-footer-section', 'footer-itc-footer-secondary');
    newSecondaryFooter.append(secondaryFooterContainer);
    moveInstrumentation(secondaryFooter, newSecondaryFooter);
    block.textContent = '';
    block.append(rootDiv, newSecondaryFooter);
  } else {
    block.textContent = '';
    block.append(rootDiv);
  }

  block.className = 'footer block';
  block.dataset.blockStatus = 'loaded';
}