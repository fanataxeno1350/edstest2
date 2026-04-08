import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    messageRow,
    privacyPolicyLinkRow,
    acceptAllLabelRow,
    managePreferencesIconRow,
    managePreferencesLabelRow,
    closeBannerIconRow,
  ] = [...block.children];

  block.textContent = '';
  block.setAttribute('role', 'dialog');
  block.setAttribute('aria-live', 'polite');
  block.setAttribute('aria-label', 'cookieconsent');
  block.setAttribute('aria-describedby', 'cookieconsent:desc');
  block.classList.add(
    'cc-window',
    'cc-banner',
    'cc-type-opt-out',
    'cc-theme-classic',
    'cc-bottom',
    'cc-color-override-1510019422',
  );

  const messageContainer = document.createElement('div');
  messageContainer.classList.add('cc-message-container');
  block.append(messageContainer);

  const messageSpan = document.createElement('span');
  messageSpan.id = 'cookieconsent:desc';
  messageSpan.classList.add('cc-message');
  moveInstrumentation(messageRow, messageSpan);
  while (messageRow.firstChild) messageSpan.append(messageRow.firstChild);
  messageContainer.append(messageSpan);

  const privacyPolicyLink = privacyPolicyLinkRow.querySelector('a');
  if (privacyPolicyLink) {
    privacyPolicyLink.classList.add('cc-link');
    privacyPolicyLink.setAttribute('aria-label', 'Privacy Policy visit this link to learn more about cookies. Opens in new window');
    privacyPolicyLink.setAttribute('tabindex', '0');
    privacyPolicyLink.setAttribute('rel', 'noopener noreferrer nofollow');
    privacyPolicyLink.setAttribute('target', '_blank');
    privacyPolicyLink.setAttribute('title', 'Click here to learn more. This link opens in a new window');
    moveInstrumentation(privacyPolicyLinkRow, privacyPolicyLink);
    messageSpan.append(privacyPolicyLink);
  }

  const complianceDiv = document.createElement('div');
  complianceDiv.classList.add('cc-compliance', 'cc-highlight', 'cc-regular');
  block.append(complianceDiv);

  const acceptAllButton = document.createElement('a');
  acceptAllButton.setAttribute('role', 'button');
  acceptAllButton.setAttribute('tabindex', '0');
  acceptAllButton.classList.add('cc-btn', 'cc-dismiss', 'cc-btn-format');
  moveInstrumentation(acceptAllLabelRow, acceptAllButton);
  acceptAllButton.textContent = acceptAllLabelRow.textContent.trim();
  complianceDiv.append(acceptAllButton);

  const managePreferencesLink = document.createElement('a');
  managePreferencesLink.setAttribute('role', 'button');
  managePreferencesLink.setAttribute('aria-haspopup', 'dialog');
  managePreferencesLink.setAttribute('aria-controls', 'cookiePreferencesDialog');
  managePreferencesLink.classList.add('cc-link', 'cmp-pref-link');
  managePreferencesLink.id = 'securitiCmpCookiePrefBtn';
  managePreferencesLink.setAttribute('tabindex', '0');
  complianceDiv.append(managePreferencesLink);

  const managePreferencesIconSpan = document.createElement('span');
  const managePreferencesPicture = managePreferencesIconRow.querySelector('picture');
  if (managePreferencesPicture) {
    const img = managePreferencesPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    managePreferencesIconSpan.append(optimizedPic);
  }
  moveInstrumentation(managePreferencesIconRow, managePreferencesIconSpan);
  managePreferencesLink.append(managePreferencesIconSpan);

  const managePreferencesLabelSpan = document.createElement('span');
  moveInstrumentation(managePreferencesLabelRow, managePreferencesLabelSpan);
  managePreferencesLabelSpan.textContent = managePreferencesLabelRow.textContent.trim();
  managePreferencesLink.append(managePreferencesLabelSpan);

  const closeBannerButton = document.createElement('span');
  closeBannerButton.setAttribute('aria-label', 'Close banner');
  closeBannerButton.setAttribute('role', 'button');
  closeBannerButton.setAttribute('tabindex', '0');
  closeBannerButton.classList.add('cc-close', 'cc-close-banner-btn');
  complianceDiv.append(closeBannerButton);

  const closeBannerIconPicture = closeBannerIconRow.querySelector('picture');
  if (closeBannerIconPicture) {
    const img = closeBannerIconPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    closeBannerButton.append(optimizedPic);
  }
  moveInstrumentation(closeBannerIconRow, closeBannerButton);

  // Add event listeners for interactive behavior
  acceptAllButton.addEventListener('click', () => {
    block.style.display = 'none'; // Example: Hide the banner
    // You might want to set a cookie here to remember the user's choice
  });

  closeBannerButton.addEventListener('click', () => {
    block.style.display = 'none'; // Example: Hide the banner
  });

  // For managePreferencesLink, you would typically open a modal or navigate to a preferences page.
  // This example just logs a message.
  managePreferencesLink.addEventListener('click', () => {
    console.log('Manage Preferences clicked!');
    // Implement modal opening logic here if needed, e.g.:
    // const preferencesModal = document.getElementById('cookiePreferencesDialog');
    // if (preferencesModal) preferencesModal.classList.add('show');
  });
}
