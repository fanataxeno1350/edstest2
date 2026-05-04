import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    welcomeTitleCell,
    promoLinkCell,
    promoDescriptionCell,
    cookieMessageCell,
    privacyPolicyLinkCell,
    acceptButtonLabelCell,
  ] = [...block.children];

  block.innerHTML = '';
  block.style.display = 'block'; // Ensure the banner is visible initially

  const container = document.createElement('div');
  container.classList.add('container');

  // Welcome section
  const welcome = document.createElement('div');
  welcome.classList.add('welcome');

  const welcomeTitle = document.createElement('h4');
  welcomeTitle.textContent = welcomeTitleCell.textContent.trim();
  moveInstrumentation(welcomeTitleCell, welcomeTitle);
  welcome.append(welcomeTitle);

  const promoBody = document.createElement('div');
  promoBody.classList.add('promo-body');

  const promoLink = document.createElement('a');
  const foundPromoLink = promoLinkCell.querySelector('a');
  if (foundPromoLink) {
    promoLink.href = foundPromoLink.href;
    // Original HTML has aria-label as promo description, but textContent is 'Learn more'
    promoLink.setAttribute('aria-label', promoDescriptionCell.textContent.trim());
  }
  promoLink.textContent = 'Learn more'; // Hardcoded label from original HTML
  moveInstrumentation(promoLinkCell, promoLink);
  promoBody.append(promoLink);

  const promoDescriptionText = document.createTextNode(` ${promoDescriptionCell.textContent.trim()}`);
  promoBody.append(promoDescriptionText);
  welcome.append(promoBody);
  container.append(welcome);

  // GDPR message section
  const gdprMessage = document.createElement('div');
  gdprMessage.classList.add('gdpr-message');

  const row = document.createElement('div');
  row.classList.add('row');

  const col1 = document.createElement('div');
  col1.classList.add('col-md-6');

  const cookieBody = document.createElement('div');
  cookieBody.classList.add('cookie-body');
  cookieBody.textContent = cookieMessageCell.textContent.trim();
  moveInstrumentation(cookieMessageCell, cookieBody);

  const privacyPolicyLink = document.createElement('a');
  const foundPrivacyPolicyLink = privacyPolicyLinkCell.querySelector('a');
  if (foundPrivacyPolicyLink) {
    privacyPolicyLink.href = foundPrivacyPolicyLink.href;
  }
  privacyPolicyLink.textContent = 'View our Privacy Policy'; // Hardcoded label from original HTML
  moveInstrumentation(privacyPolicyLinkCell, privacyPolicyLink);
  cookieBody.append(' '); // Add a space before the link
  cookieBody.append(privacyPolicyLink);
  cookieBody.append(' to learn more.'); // Add remaining text from original HTML
  col1.append(cookieBody);
  row.append(col1);

  const col2 = document.createElement('div');
  col2.classList.add('col-md-6');

  const cta = document.createElement('div');
  cta.classList.add('cta');

  const acceptButton = document.createElement('a');
  acceptButton.classList.add('btn', 'bg-white', 'accept-cookie');
  acceptButton.textContent = acceptButtonLabelCell.textContent.trim();
  acceptButton.setAttribute('tabindex', '0');
  moveInstrumentation(acceptButtonLabelCell, acceptButton);
  cta.append(acceptButton);
  col2.append(cta);
  row.append(col2);
  gdprMessage.append(row);
  container.append(gdprMessage);

  block.append(container);

  // Event listener for the accept button
  acceptButton.addEventListener('click', () => {
    block.style.display = 'none';
  });
}
