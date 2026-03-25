import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const contactWrpArena = document.createElement('div');
  contactWrpArena.classList.add('contact_wrp_arena', 'user__contact', 'header');

  const titleElement = block.querySelector('[data-aue-prop="title"]');
  if (titleElement) {
    const h4 = document.createElement('h4');
    h4.classList.add('user__contact-title');
    h4.textContent = titleElement.textContent;
    contactWrpArena.append(h4);
    moveInstrumentation(titleElement, h4);
  }

  const phoneIconImg = block.querySelector('[data-aue-prop="phoneIcon"] img');
  if (phoneIconImg) {
    const span = document.createElement('span');
    span.classList.add('user__contact-title', 'icon-phone');
    span.setAttribute('aria-label', 'Contact Us');
    contactWrpArena.append(span);
    moveInstrumentation(phoneIconImg.closest('div'), span);
  }

  const userContactIcons = document.createElement('div');
  userContactIcons.classList.add('user__contact__icons', 'hidden');

  // Phone Icon Link
  const phoneIconLink = document.createElement('a');
  phoneIconLink.href = '#';
  phoneIconLink.classList.add('user__contact--icon', 'phone');
  phoneIconLink.onclick = (event) => {
    event.preventDefault();
    phoneIconLink.closest('.contact').querySelector('.contact-toggle-box').classList.toggle('hidden');
  };
  const phoneSrOnly = document.createElement('span');
  phoneSrOnly.classList.add('sr-only');
  phoneSrOnly.textContent = 'phone';
  phoneIconLink.append(phoneSrOnly);

  const phoneIconAuthored = block.querySelector('[data-aue-prop="phoneIcon"] img');
  if (phoneIconAuthored) {
    const picture = createOptimizedPicture(phoneIconAuthored.src, phoneIconAuthored.alt);
    phoneIconLink.append(picture);
    moveInstrumentation(phoneIconAuthored, picture);
  }
  userContactIcons.append(phoneIconLink);

  // Whatsapp Icon Link
  const whatsappLinkAuthored = block.querySelector('[data-aue-prop="whatsappLink"]');
  const whatsappIconLink = document.createElement('a');
  whatsappIconLink.classList.add('user__contact--icon', 'whatsapp');
  whatsappIconLink.target = '_blank';
  whatsappIconLink.rel = 'noopener noreferrer';
  if (whatsappLinkAuthored) {
    whatsappIconLink.href = whatsappLinkAuthored.href;
    moveInstrumentation(whatsappLinkAuthored, whatsappIconLink);
  }
  const whatsappSrOnly = document.createElement('span');
  whatsappSrOnly.classList.add('sr-only');
  whatsappSrOnly.textContent = 'whatsapp';
  whatsappIconLink.append(whatsappSrOnly);

  const whatsappIconAuthored = block.querySelector('[data-aue-prop="whatsappIcon"] img');
  if (whatsappIconAuthored) {
    const picture = createOptimizedPicture(whatsappIconAuthored.src, whatsappIconAuthored.alt);
    whatsappIconLink.append(picture);
    moveInstrumentation(whatsappIconAuthored, picture);
  }
  userContactIcons.append(whatsappIconLink);

  // Email Icon Link
  const emailLinkAuthored = block.querySelector('[data-aue-prop="emailLink"]');
  const emailIconLink = document.createElement('a');
  emailIconLink.classList.add('user__contact--icon', 'email');
  if (emailLinkAuthored) {
    emailIconLink.href = emailLinkAuthored.href;
    moveInstrumentation(emailLinkAuthored, emailIconLink);
  }
  const emailSrOnly = document.createElement('span');
  emailSrOnly.classList.add('sr-only');
  emailSrOnly.textContent = 'email';
  emailIconLink.append(emailSrOnly);

  const emailIconAuthored = block.querySelector('[data-aue-prop="emailIcon"] img');
  if (emailIconAuthored) {
    const picture = createOptimizedPicture(emailIconAuthored.src, emailIconAuthored.alt);
    emailIconLink.append(picture);
    moveInstrumentation(emailIconAuthored, picture);
  }
  userContactIcons.append(emailIconLink);

  contactWrpArena.append(userContactIcons);

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');

  const callContainer = document.createElement('div');
  callContainer.classList.add('user__contact__icon-call_container');

  // Primary Telephone Link
  const primaryTelephoneLink = document.createElement('a');
  primaryTelephoneLink.classList.add('primary-telephone');
  const primaryTelephoneLinkAuthored = block.querySelector('[data-aue-prop="primaryTelephoneLink"]');
  const primaryTelephoneNumberAuthored = block.querySelector('[data-aue-prop="primaryTelephoneNumber"]');

  if (primaryTelephoneLinkAuthored) {
    primaryTelephoneLink.href = primaryTelephoneLinkAuthored.href;
    moveInstrumentation(primaryTelephoneLinkAuthored, primaryTelephoneLink);
  } else if (primaryTelephoneNumberAuthored) {
    primaryTelephoneLink.href = `tel:${primaryTelephoneNumberAuthored.textContent}`;
  }

  if (primaryTelephoneNumberAuthored) {
    primaryTelephoneLink.textContent = primaryTelephoneNumberAuthored.textContent;
    moveInstrumentation(primaryTelephoneNumberAuthored, primaryTelephoneLink);
  }
  callContainer.append(primaryTelephoneLink);

  // Secondary Telephone Link
  const secondaryTelephoneLink = document.createElement('a');
  secondaryTelephoneLink.classList.add('secondary-telephone');
  const secondaryTelephoneLinkAuthored = block.querySelector('[data-aue-prop="secondaryTelephoneLink"]');
  const secondaryTelephoneNumberAuthored = block.querySelector('[data-aue-prop="secondaryTelephoneNumber"]');

  if (secondaryTelephoneLinkAuthored) {
    secondaryTelephoneLink.href = secondaryTelephoneLinkAuthored.href;
    moveInstrumentation(secondaryTelephoneLinkAuthored, secondaryTelephoneLink);
  } else if (secondaryTelephoneNumberAuthored) {
    secondaryTelephoneLink.href = `tel:${secondaryTelephoneNumberAuthored.textContent}`;
  }

  if (secondaryTelephoneNumberAuthored) {
    secondaryTelephoneLink.textContent = secondaryTelephoneNumberAuthored.textContent;
    moveInstrumentation(secondaryTelephoneNumberAuthored, secondaryTelephoneLink);
  }
  callContainer.append(secondaryTelephoneLink);

  contactToggleBox.append(callContainer);
  contactWrpArena.append(contactToggleBox);

  block.textContent = '';
  block.append(contactWrpArena);
  block.className = `contact block`;
  block.dataset.blockStatus = 'loaded';
}
