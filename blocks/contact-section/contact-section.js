import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure the known fixed-schema rows at the root level
  const [
    headlineRow,
    subheadlineRow,
    locationRow,
    emailLinkRow,
    // socialLinks is a container, its item rows are filtered later
    mapEmbedRow,
    formNamePlaceholderRow,
    formEmailPlaceholderRow,
    formMessagePlaceholderRow,
    formSubmitLabelRow,
    ...socialLinkRows // Remaining rows are social links
  ] = [...block.children];

  const section = document.createElement('section');
  // block.classList.add('contact-section'); // Outer block div already has this class
  moveInstrumentation(block, section); // Move instrumentation from block to the new root

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const contactContainer = document.createElement('div');
  contactContainer.classList.add('contact-container');
  container.append(contactContainer);

  // Headline
  const headlineCell = headlineRow.children[0]; // Access cell directly
  if (headlineCell) {
    const h2 = document.createElement('h2');
    moveInstrumentation(headlineRow, h2);
    h2.textContent = headlineCell.textContent.trim();
    contactContainer.append(h2);
  }

  // Subheadline
  const subheadlineCell = subheadlineRow.children[0]; // Access cell directly
  if (subheadlineCell) {
    const h3 = document.createElement('h3');
    moveInstrumentation(subheadlineRow, h3);
    h3.textContent = subheadlineCell.textContent.trim();
    contactContainer.append(h3);
  }

  const rowContact = document.createElement('div');
  rowContact.classList.add('row', 'contact');
  contactContainer.append(rowContact);

  const colLg6ContactDetails = document.createElement('div');
  colLg6ContactDetails.classList.add('col-lg-6', 'col-12', 'contact-details');
  rowContact.append(colLg6ContactDetails);

  // Location
  const locationCell = locationRow.children[0]; // Access cell directly
  if (locationCell) {
    const dFlexLocation = document.createElement('div');
    dFlexLocation.classList.add('d-flex', 'align-items-center');
    const pLocation = document.createElement('p');
    pLocation.style.paddingLeft = '19px';
    moveInstrumentation(locationRow, pLocation);
    pLocation.textContent = locationCell.textContent.trim();
    dFlexLocation.append(pLocation);
    colLg6ContactDetails.append(dFlexLocation);
  }

  // Email Link
  const emailLinkCell = emailLinkRow.children[0]; // Access cell directly
  if (emailLinkCell) {
    const emailDiv = document.createElement('div');
    const emailSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    emailSvg.setAttribute('width', '16');
    emailSvg.setAttribute('height', '16');
    emailSvg.setAttribute('fill', 'currentColor');
    emailSvg.classList.add('bi', 'bi-envelope');
    emailSvg.setAttribute('viewBox', '0 0 16 16');
    emailSvg.innerHTML = '<path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"></path>';
    emailDiv.append(emailSvg);

    const emailAnchor = document.createElement('a');
    const foundEmailLink = emailLinkCell.querySelector('a');
    if (foundEmailLink) {
      emailAnchor.href = foundEmailLink.href;
      // Extract text content from the anchor, removing 'mailto:' if present
      emailAnchor.textContent = foundEmailLink.textContent.trim().replace('mailto:', '');
    }
    moveInstrumentation(emailLinkRow, emailAnchor);
    emailDiv.append(emailAnchor);
    colLg6ContactDetails.append(emailDiv);
  }

  // Social Links
  const socialLinksUl = document.createElement('ul');
  socialLinksUl.classList.add('social-about', 'd-flex', 'align-items-center');
  colLg6ContactDetails.append(socialLinksUl);

  // Filter for social link items (single cell with an anchor)
  // The socialLinkRows are already separated by destructuring above
  socialLinkRows.forEach((row) => {
    const [linkCell] = [...row.children]; // Destructure for fixed-schema item rows
    if (linkCell) {
      const li = document.createElement('li');
      li.classList.add('social-items');
      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      }
      // Add social icons based on href
      if (anchor.href.includes('linkedin.com')) {
        anchor.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"></path></svg>';
      } else if (anchor.href.includes('facebook.com')) {
        anchor.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"></path></svg>';
      } else if (anchor.href.includes('instagram.com')) {
        anchor.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"></path></svg>';
      }
      moveInstrumentation(row, anchor);
      li.append(anchor);
      socialLinksUl.append(li);
    }
  });

  // Map Embed
  const mapEmbedCell = mapEmbedRow.children[0]; // Access cell directly
  if (mapEmbedCell) {
    const iframe = document.createElement('iframe');
    const foundMapLink = mapEmbedCell.querySelector('a');
    if (foundMapLink) {
      iframe.src = foundMapLink.href;
    }
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('style', 'border:0;');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    moveInstrumentation(mapEmbedRow, iframe);
    colLg6ContactDetails.append(iframe);
  }

  const colLg6Form = document.createElement('div');
  colLg6Form.classList.add('col-lg-6', 'col-12');
  rowContact.append(colLg6Form);

  const contactForm = document.createElement('form');
  contactForm.classList.add('contact-form', 'd-flex', 'flex-column', 'justify-content-around');
  colLg6Form.append(contactForm);

  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('hidden', '');
  hiddenInput.setAttribute('name', 'next');
  hiddenInput.setAttribute('value', '');
  contactForm.append(hiddenInput);

  // Form Name Placeholder
  const formNamePlaceholderCell = formNamePlaceholderRow.children[0]; // Access cell directly
  if (formNamePlaceholderCell) {
    const nameInput = document.createElement('input');
    nameInput.setAttribute('placeholder', formNamePlaceholderCell.textContent.trim());
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('name', 'fname');
    moveInstrumentation(formNamePlaceholderRow, nameInput);
    contactForm.append(nameInput);
  }

  // Form Email Placeholder
  const formEmailPlaceholderCell = formEmailPlaceholderRow.children[0]; // Access cell directly
  if (formEmailPlaceholderCell) {
    const emailInput = document.createElement('input');
    emailInput.setAttribute('placeholder', formEmailPlaceholderCell.textContent.trim());
    emailInput.setAttribute('type', 'email');
    emailInput.setAttribute('name', 'email');
    moveInstrumentation(formEmailPlaceholderRow, emailInput);
    contactForm.append(emailInput);
  }

  // Form Message Placeholder
  const formMessagePlaceholderCell = formMessagePlaceholderRow.children[0]; // Access cell directly
  if (formMessagePlaceholderCell) {
    const messageTextarea = document.createElement('textarea');
    messageTextarea.setAttribute('placeholder', formMessagePlaceholderCell.textContent.trim());
    messageTextarea.setAttribute('rows', '5');
    messageTextarea.setAttribute('name', 'message');
    moveInstrumentation(formMessagePlaceholderRow, messageTextarea);
    contactForm.append(messageTextarea);
  }

  // Form Submit Button Label
  const formSubmitLabelCell = formSubmitLabelRow.children[0]; // Access cell directly
  if (formSubmitLabelCell) {
    const submitButton = document.createElement('button');
    submitButton.classList.add('btn', 'btn-primary');
    moveInstrumentation(formSubmitLabelRow, submitButton);
    submitButton.textContent = formSubmitLabelCell.textContent.trim();
    contactForm.append(submitButton);
  }

  block.replaceChildren(section);
}
