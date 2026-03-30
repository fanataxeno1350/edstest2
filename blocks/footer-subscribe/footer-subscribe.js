import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const registerApiUrl = block.querySelector('[data-register-api-url]')?.dataset.registerApiUrl || '';
  const successMessage = block.querySelector('[data-popup-success-message]')?.dataset.popupSuccessMessage || '';
  const failureMessage = block.querySelector('[data-popup-failure-message]')?.dataset.popupFailureMessage || '';

  const navSubscribeDiv = document.createElement('div');
  navSubscribeDiv.classList.add('cmp-footer-nav-subscribe-cmp-footer__nav-subscribe');
  navSubscribeDiv.setAttribute('data-register-api-url', registerApiUrl);
  navSubscribeDiv.setAttribute('data-popup-success-message', successMessage);
  navSubscribeDiv.setAttribute('data-popup-failure-message', failureMessage);

  // Nav Text div
  const navTextDiv = document.createElement('div');
  navTextDiv.classList.add('cmp-footer-nav-subscribe-cmp-footer__nav-text');

  const logoImg = block.querySelector('[data-aue-prop="logo"]');
  if (logoImg) {
    const picture = createOptimizedPicture(logoImg.src, logoImg.alt);
    navTextDiv.append(picture);
    moveInstrumentation(logoImg, picture);
  }

  const heading = block.querySelector('[data-aue-prop="heading"]');
  if (heading) {
    const h3 = document.createElement('h3');
    h3.innerHTML = heading.innerHTML;
    navTextDiv.append(h3);
    moveInstrumentation(heading, h3);
  }
  navSubscribeDiv.append(navTextDiv);

  // Input container div
  const inputContainerDiv = document.createElement('div');
  inputContainerDiv.classList.add('cmp-footer-nav-subscribe-container', 'cmp-footer-nav-subscribe-responsivegrid', 'cmp-footer-nav-subscribe-cmp-input');

  const emailInputWrapper = document.createElement('div');
  emailInputWrapper.classList.add('cmp-footer-nav-subscribe-text', 'cmp-footer-nav-subscribe-aem-GridColumn', 'cmp-footer-nav-subscribe-aem-GridColumn--default--12', 'cmp-footer-nav-subscribe-cmp-input__email');

  const formTextDiv = document.createElement('div');
  formTextDiv.classList.add('cmp-footer-nav-subscribe-cmp-form-text');
  formTextDiv.setAttribute('data-cmp-required-message', 'This field is required');
  formTextDiv.setAttribute('data-cmp-valid-email', 'Please enter valid email id');

  const label = document.createElement('label');
  label.setAttribute('for', 'form-text-2014401237'); // Keeping original ID for now, could be dynamic
  formTextDiv.append(label);

  const emailInput = document.createElement('input');
  emailInput.classList.add('cmp-footer-nav-subscribe-cmp-form-text__text');
  emailInput.setAttribute('type', 'email');
  emailInput.setAttribute('placeholder', 'Enter your Email ID');
  emailInput.setAttribute('name', 'email');
  const authoredEmail = block.querySelector('[data-aue-prop="email"]');
  if (authoredEmail) {
    // The authoredEmail is likely a <p> with the value, not the input itself.
    // Since the input is not directly authorable via data-aue-prop="email",
    // we just ensure the input exists as per structure.
    // If the requirement was to set a default value, it would come from a different prop.
    moveInstrumentation(authoredEmail, emailInput); // Instrumenting the source of email related content
  }
  formTextDiv.append(emailInput);
  emailInputWrapper.append(formTextDiv);
  inputContainerDiv.append(emailInputWrapper);
  navSubscribeDiv.append(inputContainerDiv);

  // Error message div
  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.classList.add('cmp-footer-nav-subscribe-cmp-footer__nav-subscribe__error-message');
  navSubscribeDiv.append(errorMessageDiv);

  // Consent div
  const consentDiv = document.createElement('div');
  consentDiv.classList.add('cmp-footer-nav-subscribe-cmp-footer__nav-subscribe__consent');

  const checkboxInput = document.createElement('input');
  checkboxInput.setAttribute('type', 'checkbox');
  checkboxInput.setAttribute('id', 'i_agree');
  checkboxInput.setAttribute('name', 'i_agree');
  checkboxInput.setAttribute('value', 'i_agree');
  checkboxInput.classList.add('cmp-footer-nav-subscribe-cmp-footer__nav-subscribe--checkbox');
  const authoredIAgree = block.querySelector('[data-aue-prop="i_agree"]');
  if (authoredIAgree) {
    // Assuming authoredIAgree is the source element for the checkbox state/value
    moveInstrumentation(authoredIAgree, checkboxInput);
  }
  consentDiv.append(checkboxInput);

  const consentLinkDiv = document.createElement('div');
  consentLinkDiv.classList.add('cmp-footer-nav-subscribe-cmp-footer__nav-subscribe--link');

  const consentText = block.querySelector('[data-aue-prop="consentText"]');
  const privacyPolicyLink = block.querySelector('[data-aue-prop="privacyPolicyLink"]');

  if (consentText) {
    const p = document.createElement('p');
    p.innerHTML = consentText.innerHTML;

    if (privacyPolicyLink) {
      // Assuming privacyPolicyLink is a <a> element or its href can be extracted
      const existingLink = p.querySelector('a');
      if (existingLink) {
        existingLink.href = privacyPolicyLink.href || existingLink.href;
        moveInstrumentation(privacyPolicyLink, existingLink);
      } else {
        // If there's no <a> in the consentText, we might need to create one
        // This scenario depends on how consentText is authored. For now, assume it's there.
      }
    }
    consentLinkDiv.append(p);
    moveInstrumentation(consentText, p);
  }
  consentDiv.append(consentLinkDiv);
  navSubscribeDiv.append(consentDiv);

  // Button div
  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('cmp-footer-nav-subscribe-button', 'cmp-footer-nav-subscribe-cmp-button--primary', 'cmp-footer-nav-subscribe-cmp-button--primary-anchor-dark');

  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('id', 'button-fb2118d4d9'); // Keeping original ID
  button.classList.add('cmp-footer-nav-subscribe-cmp-button');
  button.setAttribute('data-request', 'true');
  button.setAttribute('disabled', '');

  const buttonTextSpan = document.createElement('span');
  buttonTextSpan.classList.add('cmp-footer-nav-subscribe-cmp-button__text');
  const registerButtonLabel = block.querySelector('[data-aue-prop="registerButtonLabel"]');
  if (registerButtonLabel) {
    buttonTextSpan.textContent = registerButtonLabel.textContent.trim();
    moveInstrumentation(registerButtonLabel, buttonTextSpan);
  } else {
    buttonTextSpan.textContent = 'Register Now'; // Fallback
  }
  button.append(buttonTextSpan);
  buttonDiv.append(button);
  navSubscribeDiv.append(buttonDiv);

  block.textContent = '';
  block.append(navSubscribeDiv);
  block.className = `footer-subscribe block`;
  block.dataset.blockStatus = 'loaded';
}
