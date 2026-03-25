import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const contactWrpArena = document.createElement('div');
  contactWrpArena.classList.add('contact-contact_wrp_arena', 'contact-user__contact', 'contact-header');

  const titleElement = block.querySelector('[data-aue-prop="title"]') || block.querySelector('h4');
  if (titleElement) {
    const h4 = document.createElement('h4');
    h4.classList.add('contact-user__contact-title');
    h4.textContent = titleElement.textContent;
    moveInstrumentation(titleElement, h4);
    contactWrpArena.append(h4);

    const span = document.createElement('span');
    span.classList.add('contact-user__contact-title', 'contact-icon-phone');
    span.setAttribute('aria-label', titleElement.textContent);
    contactWrpArena.append(span);
  }

  const iconsContainer = document.createElement('div');
  iconsContainer.classList.add('contact-user__contact__icons', 'contact-hidden');

  const contactIcons = block.querySelectorAll('[data-aue-model="contactIcon"]');
  contactIcons.forEach((iconNode) => {
    const linkElement = iconNode.querySelector('[data-aue-prop="link"]');
    const iconImage = iconNode.querySelector('[data-aue-prop="icon"]');
    const labelElement = iconNode.querySelector('[data-aue-prop="label"]');

    if (linkElement && iconImage && labelElement) {
      const a = document.createElement('a');
      a.href = linkElement.href;
      a.classList.add('contact-user__contact--icon');
      if (linkElement.href.includes('wa.me')) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.classList.add('contact-whatsapp');
      } else if (linkElement.href.startsWith('tel:')) {
        a.classList.add('contact-phone');
        a.onclick = (e) => {
          e.preventDefault();
          a.closest('.contact-contact_wrp_arena').querySelector('.contact-toggle-box').classList.toggle('hidden');
        };
      } else if (linkElement.href.startsWith('mailto:')) {
        a.classList.add('contact-email');
      }

      const spanSrOnly = document.createElement('span');
      spanSrOnly.classList.add('contact-sr-only');
      spanSrOnly.textContent = labelElement.textContent;
      a.append(spanSrOnly);

      const picture = createOptimizedPicture(iconImage.src, iconImage.alt);
      a.append(picture);

      moveInstrumentation(linkElement, a);
      moveInstrumentation(iconImage, picture);
      moveInstrumentation(labelElement, spanSrOnly);
      moveInstrumentation(iconNode, a);
      iconsContainer.append(a);
    }
  });
  contactWrpArena.append(iconsContainer);

  const toggleBox = document.createElement('div');
  toggleBox.classList.add('contact-hidden', 'contact-toggle-box');

  const callContainer = document.createElement('div');
  callContainer.classList.add('contact-user__contact__icon-call_container');

  const primaryTelephoneElement = block.querySelector('[data-aue-prop="primaryTelephone"]');
  if (primaryTelephoneElement) {
    const primaryLink = document.createElement('a');
    primaryLink.href = `tel:${primaryTelephoneElement.textContent}`;
    primaryLink.classList.add('contact-primary-telephone');
    primaryLink.textContent = primaryTelephoneElement.textContent;
    moveInstrumentation(primaryTelephoneElement, primaryLink);
    callContainer.append(primaryLink);
  }

  const secondaryTelephoneElement = block.querySelector('[data-aue-prop="secondaryTelephone"]');
  if (secondaryTelephoneElement) {
    const secondaryLink = document.createElement('a');
    secondaryLink.href = `tel:${secondaryTelephoneElement.textContent}`;
    secondaryLink.classList.add('contact-secondary-telephone');
    secondaryLink.textContent = secondaryTelephoneElement.textContent;
    moveInstrumentation(secondaryTelephoneElement, secondaryLink);
    callContainer.append(secondaryLink);
  }

  toggleBox.append(callContainer);
  contactWrpArena.append(toggleBox);

  block.textContent = '';
  block.append(contactWrpArena);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
