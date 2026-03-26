import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, ...iconRows] = [...block.children];

  const contactWrapper = document.createElement('div');
  contactWrapper.classList.add('contact_wrp_arena', 'user__contact', 'header');
  moveInstrumentation(block, contactWrapper);

  const titleElement = document.createElement('h4');
  titleElement.classList.add('user__contact-title');
  moveInstrumentation(titleRow.firstElementChild, titleElement);
  titleElement.textContent = titleRow.firstElementChild.textContent;
  contactWrapper.append(titleElement);

  const titleIconSpan = document.createElement('span');
  titleIconSpan.classList.add('user__contact-title', 'icon-phone');
  titleIconSpan.setAttribute('aria-label', titleElement.textContent);
  contactWrapper.append(titleIconSpan);

  const iconsContainer = document.createElement('div');
  iconsContainer.classList.add('user__contact__icons', 'hidden');
  contactWrapper.append(iconsContainer);

  const toggleBox = document.createElement('div');
  toggleBox.classList.add('hidden', 'contact-toggle-box');
  contactWrapper.append(toggleBox);

  const callContainer = document.createElement('div');
  callContainer.classList.add('user__contact__icon-call_container');
  toggleBox.append(callContainer);

  iconRows.forEach((row) => {
    const [iconCell, labelCell, linkCell] = [...row.children];

    const link = linkCell.querySelector('a');
    const iconPicture = iconCell.querySelector('picture');

    if (link && iconPicture) {
      const iconAnchor = document.createElement('a');
      moveInstrumentation(row, iconAnchor);
      iconAnchor.href = link.href;

      const srOnlySpan = document.createElement('span');
      srOnlySpan.classList.add('sr-only');
      srOnlySpan.textContent = labelCell.textContent;
      iconAnchor.append(srOnlySpan);

      // Create optimized picture directly
      const optimizedPic = createOptimizedPicture(
        iconPicture.querySelector('img').src,
        iconPicture.querySelector('img').alt,
        false,
        [{ width: '750' }]
      );
      moveInstrumentation(iconPicture.querySelector('img'), optimizedPic.querySelector('img'));
      iconAnchor.append(optimizedPic);

      if (link.href.startsWith('tel:')) {
        iconAnchor.classList.add('user__contact--icon', 'phone');
        // Add event listener for the phone icon to toggle the contact-toggle-box
        iconAnchor.addEventListener('click', (event) => {
          event.preventDefault();
          toggleBox.classList.toggle('hidden');
        });

        const primaryTelLink = document.createElement('a');
        primaryTelLink.classList.add('primary-telephone');
        primaryTelLink.href = link.href;
        primaryTelLink.textContent = labelCell.textContent;
        callContainer.append(primaryTelLink);

        const secondaryTelLink = document.createElement('a');
        secondaryTelLink.classList.add('secondary-telephone');
        secondaryTelLink.href = 'tel:'; // Original HTML has empty href but it should be a tel link
        callContainer.append(secondaryTelLink);

      } else if (link.href.startsWith('https://wa.me/')) {
        iconAnchor.classList.add('user__contact--icon', 'whatsapp');
        iconAnchor.target = '_blank';
        iconAnchor.rel = 'noopener noreferrer';
      } else if (link.href.startsWith('mailto:')) {
        iconAnchor.classList.add('user__contact--icon', 'email');
      }
      iconsContainer.append(iconAnchor);
    }
  });

  block.textContent = '';
  block.append(contactWrapper);
}
