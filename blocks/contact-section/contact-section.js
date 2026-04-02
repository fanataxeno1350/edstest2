import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    mainHeadingRow,
    subHeadingRow,
    addressRow,
    contactImageRow,
    emailLinkRow,
    linkedinImageRow,
    linkedinLinkRow,
    facebookImageRow,
    facebookLinkRow,
    instagramImageRow,
    instagramLinkRow,
    mapEmbedRow,
    formNamePlaceholderRow,
    formEmailPlaceholderRow,
    formMessagePlaceholderRow,
    formSubmitLabelRow,
  ] = [...block.children];

  block.classList.add('contact-section');

  const container = document.createElement('div');
  container.classList.add('container');

  const contactContainer = document.createElement('div');
  contactContainer.classList.add('contact-container');
  container.append(contactContainer);

  const mainHeading = document.createElement('h2');
  moveInstrumentation(mainHeadingRow.firstElementChild, mainHeading);
  mainHeading.textContent = mainHeadingRow.firstElementChild.textContent.trim();
  contactContainer.append(mainHeading);

  const subHeading = document.createElement('h3');
  moveInstrumentation(subHeadingRow.firstElementChild, subHeading);
  subHeading.textContent = subHeadingRow.firstElementChild.textContent.trim();
  contactContainer.append(subHeading);

  const rowContact = document.createElement('div');
  rowContact.classList.add('row', 'contact');
  contactContainer.append(rowContact);

  const colContactDetails = document.createElement('div');
  colContactDetails.classList.add('col-lg-6', 'col-12', 'contact-details');
  rowContact.append(colContactDetails);

  const addressWrapper = document.createElement('div');
  addressWrapper.classList.add('d-flex', 'align-items-center');
  const addressParagraph = document.createElement('p');
  moveInstrumentation(addressRow.firstElementChild, addressParagraph);
  addressParagraph.textContent = addressRow.firstElementChild.textContent.trim();
  addressParagraph.style.paddingLeft = '19px'; // Hardcoded style from original HTML
  addressWrapper.append(addressParagraph);
  colContactDetails.append(addressWrapper);

  const emailWrapper = document.createElement('div');
  // The original HTML shows an <img> tag directly, not a <picture> for the contact image.
  // Adjusting to handle either a picture or a direct img/svg.
  const contactImageContent = contactImageRow.firstElementChild;
  const contactPicture = contactImageContent.querySelector('picture');
  const contactImg = contactImageContent.querySelector('img'); // Check for direct img
  const contactSvg = contactImageContent.querySelector('img[src$=".svg"], img[src$=".svg+xml"]'); // Check for SVG

  if (contactPicture) {
    const img = contactPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    emailWrapper.append(optimizedPic);
  } else if (contactSvg) {
    // If it's an SVG, append it directly
    moveInstrumentation(contactSvg, contactSvg.cloneNode(true));
    emailWrapper.append(contactSvg.cloneNode(true));
  } else if (contactImg) {
    // If it's a direct img (non-SVG), optimize it
    const optimizedPic = createOptimizedPicture(contactImg.src, contactImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(contactImg, optimizedPic.querySelector('img'));
    emailWrapper.append(optimizedPic);
  } else {
    // Fallback for other content types
    moveInstrumentation(contactImageRow.firstElementChild, emailWrapper);
    while (contactImageRow.firstElementChild.firstChild) emailWrapper.append(contactImageRow.firstElementChild.firstChild);
  }

  const emailLink = document.createElement('a');
  const foundEmailLink = emailLinkRow.querySelector('a');
  if (foundEmailLink) {
    emailLink.href = foundEmailLink.href;
    moveInstrumentation(foundEmailLink, emailLink);
    emailLink.textContent = foundEmailLink.textContent.trim();
  }
  emailWrapper.append(emailLink);
  colContactDetails.append(emailWrapper);

  const socialAbout = document.createElement('ul');
  socialAbout.classList.add('social-about', 'd-flex', 'align-items-center');
  colContactDetails.append(socialAbout);

  const socialItems = [
    { imageRow: linkedinImageRow, linkRow: linkedinLinkRow },
    { imageRow: facebookImageRow, linkRow: facebookLinkRow },
    { imageRow: instagramImageRow, linkRow: instagramLinkRow },
  ];

  socialItems.forEach(({ imageRow, linkRow }) => {
    const li = document.createElement('li');
    li.classList.add('social-items');
    const socialLink = document.createElement('a');
    const foundSocialLink = linkRow.querySelector('a');
    if (foundSocialLink) {
      socialLink.href = foundSocialLink.href;
      moveInstrumentation(foundSocialLink, socialLink);
    }

    const socialImageContent = imageRow.firstElementChild;
    const socialPicture = socialImageContent.querySelector('picture');
    const socialImg = socialImageContent.querySelector('img'); // Check for direct img
    const socialSvg = socialImageContent.querySelector('img[src$=".svg"], img[src$=".svg+xml"]'); // Check for SVG

    if (socialPicture) {
      const img = socialPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      socialLink.append(optimizedPic);
    } else if (socialSvg) {
      // If it's an SVG, append it directly
      moveInstrumentation(socialSvg, socialSvg.cloneNode(true));
      socialLink.append(socialSvg.cloneNode(true));
    } else if (socialImg) {
      // If it's a direct img (non-SVG), optimize it
      const optimizedPic = createOptimizedPicture(socialImg.src, socialImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(socialImg, optimizedPic.querySelector('img'));
      socialLink.append(optimizedPic);
    } else {
      moveInstrumentation(imageRow.firstElementChild, socialLink);
      while (imageRow.firstElementChild.firstChild) socialLink.append(imageRow.firstElementChild.firstChild);
    }
    li.append(socialLink);
    socialAbout.append(li);
  });

  const mapEmbedIframe = document.createElement('iframe');
  const mapLink = mapEmbedRow.querySelector('a');
  if (mapLink) {
    mapEmbedIframe.src = mapLink.href;
  }
  mapEmbedIframe.width = '100%';
  mapEmbedIframe.style.border = '0';
  mapEmbedIframe.allowFullscreen = true;
  mapEmbedIframe.loading = 'lazy';
  mapEmbedIframe.referrerPolicy = 'no-referrer-when-downgrade';
  moveInstrumentation(mapEmbedRow.firstElementChild, mapEmbedIframe);
  colContactDetails.append(mapEmbedIframe);

  const colForm = document.createElement('div');
  colForm.classList.add('col-lg-6', 'col-12');
  rowContact.append(colForm);

  const contactForm = document.createElement('form');
  contactForm.classList.add('contact-form', 'd-flex', 'flex-column', 'justify-content-around');
  colForm.append(contactForm);

  const hiddenInput = document.createElement('input');
  hiddenInput.hidden = true;
  hiddenInput.name = 'next';
  hiddenInput.value = '';
  contactForm.append(hiddenInput);

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.name = 'fname';
  moveInstrumentation(formNamePlaceholderRow.firstElementChild, nameInput);
  nameInput.placeholder = formNamePlaceholderRow.firstElementChild.textContent.trim();
  contactForm.append(nameInput);

  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.name = 'email';
  moveInstrumentation(formEmailPlaceholderRow.firstElementChild, emailInput);
  emailInput.placeholder = formEmailPlaceholderRow.firstElementChild.textContent.trim();
  contactForm.append(emailInput);

  const messageTextarea = document.createElement('textarea');
  messageTextarea.name = 'message';
  messageTextarea.rows = '5';
  moveInstrumentation(formMessagePlaceholderRow.firstElementChild, messageTextarea);
  messageTextarea.placeholder = formMessagePlaceholderRow.firstElementChild.textContent.trim();
  contactForm.append(messageTextarea);

  const submitButton = document.createElement('button');
  submitButton.classList.add('btn', 'btn-primary');
  moveInstrumentation(formSubmitLabelRow.firstElementChild, submitButton);
  submitButton.textContent = formSubmitLabelRow.firstElementChild.textContent.trim();
  contactForm.append(submitButton);

  block.textContent = '';
  block.append(container);
}
