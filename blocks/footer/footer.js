import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Corrected destructuring to match the BlockJson model:
  // 0: logo, 1: fssai_logo, 2: footer_links (container), 3: footer_socials (container)
  // All subsequent rows are item rows for either footer-link or footer-social.
  const [logoRow, fssaiLogoRow, footerLinksContainerRow, footerSocialsContainerRow, ...itemRows] = [...block.children];

  const footer = document.createElement('div');
  footer.classList.add('cmp-footer');

  // Top content
  const topContent = document.createElement('div');
  topContent.classList.add('cmp-footer__top-content');

  const navLogo = document.createElement('div');
  navLogo.classList.add('cmp-footer__nav-logo');

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image', 'cmp-footer__logo');
  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  logoLink.href = '/'; // Assuming the logo links to home
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    moveInstrumentation(logoRow.firstElementChild, logoLink);
    logoLink.append(logoPicture);
  }
  logoDiv.append(logoLink);
  navLogo.append(logoDiv);

  // FSSAI Logo
  const fssaiLogoDiv = document.createElement('div');
  fssaiLogoDiv.classList.add('logofssai', 'logo', 'image', 'cmp-footer__fssai_logo');
  const fssaiPicture = fssaiLogoRow.querySelector('picture');
  if (fssaiPicture) {
    moveInstrumentation(fssaiLogoRow.firstElementChild, fssaiLogoDiv);
    fssaiLogoDiv.append(fssaiPicture);
  }
  navLogo.append(fssaiLogoDiv);

  topContent.append(navLogo);

  // Subscribe Now section (from original HTML, not directly in BlockJson fields but present in the structure)
  const subscribeSection = document.createElement('div');
  subscribeSection.classList.add('cmp-footer__nav-subscribe');
  subscribeSection.setAttribute('data-register-api-url', '/content/itc-foods-brands/servicespath/itcemail.register.json');
  subscribeSection.setAttribute('data-popup-success-message', 'Registered Successfully!!');
  subscribeSection.setAttribute('data-popup-failure-message', 'Registered Failed, Please try after some time.');

  const subscribeText = document.createElement('div');
  subscribeText.classList.add('cmp-footer__nav-text');
  const subscribeLogo = document.createElement('img');
  subscribeLogo.src = '/content/dam/aemigrate/uploaded-folder/image/1775032968499.svg+xml';
  subscribeLogo.alt = 'aashirvaad-logo';
  subscribeLogo.loading = 'lazy';
  subscribeLogo.fetchpriority = 'low';
  subscribeText.append(subscribeLogo);
  const subscribeH3 = document.createElement('h3');
  subscribeH3.textContent = 'in Your Inbox';
  subscribeText.append(subscribeH3);
  subscribeSection.append(subscribeText);

  const inputContainer = document.createElement('div');
  inputContainer.classList.add('container', 'responsivegrid', 'cmp-input');
  const emailInputDiv = document.createElement('div');
  emailInputDiv.classList.add('text', 'aem-GridColumn', 'aem-GridColumn--default--12', 'cmp-input__email');
  const formTextDiv = document.createElement('div');
  formTextDiv.classList.add('cmp-form-text');
  formTextDiv.setAttribute('data-cmp-required-message', 'This field is required');
  formTextDiv.setAttribute('data-cmp-valid-email', 'Please enter valid email id');
  const emailLabel = document.createElement('label');
  emailLabel.htmlFor = 'form-text-2014401237'; // Placeholder ID
  const emailInput = document.createElement('input');
  emailInput.classList.add('cmp-form-text__text');
  emailInput.type = 'email';
  emailInput.placeholder = 'Enter your Email ID';
  emailInput.name = 'email';
  formTextDiv.append(emailLabel, emailInput);
  emailInputDiv.append(formTextDiv);
  inputContainer.append(emailInputDiv);
  subscribeSection.append(inputContainer);

  const errorMessageDiv = document.createElement('div');
  errorMessageDiv.classList.add('cmp-footer__error-message');
  subscribeSection.append(errorMessageDiv);

  const consentDiv = document.createElement('div');
  consentDiv.classList.add('cmp-footer__consent');
  const consentCheckbox = document.createElement('input');
  consentCheckbox.type = 'checkbox';
  consentCheckbox.id = 'i_agree';
  consentCheckbox.name = 'i_agree';
  consentCheckbox.value = 'i_agree';
  consentCheckbox.classList.add('cmp-footer__consent--checkbox');
  const consentLinkDiv = document.createElement('div');
  consentLinkDiv.classList.add('cmp-footer__consent--link');
  consentLinkDiv.innerHTML = '<p>By clicking “Register Now”, you agree to the&nbsp;<a href="/conditions-policy/privacy-policy.html" target="_self" rel="noopener noreferrer">Privacy Policy</a>&nbsp;and to receive marketing emails from the Aashirvaad community</p>';
  consentDiv.append(consentCheckbox, consentLinkDiv);
  subscribeSection.append(consentDiv);

  const registerButtonDiv = document.createElement('div');
  registerButtonDiv.classList.add('button', 'cmp-button--primary', 'cmp-button--primary-anchor-dark');
  const registerButton = document.createElement('button');
  registerButton.type = 'button';
  registerButton.id = 'button-fb2118d4d9'; // Placeholder ID
  registerButton.classList.add('cmp-button');
  registerButton.setAttribute('data-request', 'true');
  registerButton.disabled = true; // Initially disabled
  const buttonTextSpan = document.createElement('span');
  buttonTextSpan.classList.add('cmp-button__text');
  buttonTextSpan.textContent = 'Register Now';
  registerButton.append(buttonTextSpan);
  registerButtonDiv.append(registerButton);
  subscribeSection.append(registerButtonDiv);

  topContent.append(subscribeSection);

  // Event listeners for subscribe form
  const validateForm = () => {
    const isValidEmail = emailInput.value.includes('@') && emailInput.value.includes('.');
    const isChecked = consentCheckbox.checked;
    registerButton.disabled = !(isValidEmail && isChecked);
  };

  emailInput.addEventListener('input', validateForm);
  consentCheckbox.addEventListener('change', validateForm);
  registerButton.addEventListener('click', () => {
    if (!registerButton.disabled) {
      // Implement registration logic here
      console.log('Registering with email:', emailInput.value);
      errorMessageDiv.textContent = subscribeSection.dataset.popupSuccessMessage;
      errorMessageDiv.style.color = 'green';
      // Clear form or show success
      emailInput.value = '';
      consentCheckbox.checked = false;
      registerButton.disabled = true;
    } else {
      errorMessageDiv.textContent = 'Please enter a valid email and agree to the terms.';
      errorMessageDiv.style.color = 'red';
    }
  });


  // Navigation for links
  const nav = document.createElement('div');
  nav.classList.add('cmp-footer__nav');

  const navItemsLeft = document.createElement('div');
  navItemsLeft.classList.add('cmp-footer__nav-items', 'cmp-navigation__group--left');
  const navLeftWrapper = document.createElement('div');
  navLeftWrapper.classList.add('navigation');
  const navLeft = document.createElement('nav');
  navLeft.classList.add('cmp-navigation');
  navLeft.setAttribute('role', 'navigation');
  const ulLeft = document.createElement('ul');
  ulLeft.classList.add('cmp-navigation__group');

  const navItemsRight = document.createElement('div');
  navItemsRight.classList.add('cmp-footer__nav-items', 'cmp-navigation__group--right');
  const navRightWrapper = document.createElement('div');
  navRightWrapper.classList.add('navigation');
  const navRight = document.createElement('nav');
  navRight.classList.add('cmp-navigation');
  navRight.setAttribute('role', 'navigation');
  const ulRight = document.createElement('ul');
  ulRight.classList.add('cmp-navigation__group');

  // Distribute footer links into two columns
  // Filter for 'footer-link' items: they have one child cell containing an 'a' tag.
  const footerLinks = itemRows.filter((row) => row.children.length === 1 && row.querySelector('div > a'));
  footerLinks.forEach((row, index) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');
    const link = row.querySelector('div > a'); // Ensure we get the link from the cell
    if (link) {
      link.classList.add('cmp-navigation__item-link');
      li.append(link);
    }
    if (index % 2 === 0) {
      ulLeft.append(li);
    } else {
      ulRight.append(li);
    }
  });

  navLeft.append(ulLeft);
  navLeftWrapper.append(navLeft);
  navItemsLeft.append(navLeftWrapper);
  nav.append(navItemsLeft);

  navRight.append(ulRight);
  navRightWrapper.append(navRight);
  navItemsRight.append(navRightWrapper);
  nav.append(navItemsRight);

  topContent.append(nav);
  footer.append(topContent);

  // Bottom content
  const bottomContent = document.createElement('div');
  bottomContent.classList.add('cmp-footer__bottom-content');

  const footerContainer = document.createElement('div');
  footerContainer.classList.add('cmp-footer__container');

  const itcTitles = document.createElement('div');
  itcTitles.classList.add('cmp-footer__ITC-Titles');
  // Assuming these are static links or derived from some other content
  // For now, hardcoding based on original HTML structure.
  const itcPortalLink = document.createElement('a');
  itcPortalLink.href = 'https://www.itcportal.com/';
  itcPortalLink.target = '_blank';
  itcPortalLink.classList.add('desc-1');
  itcPortalLink.textContent = 'ITC Portal';
  itcTitles.append(itcPortalLink);

  const copyrightLink = document.createElement('a');
  copyrightLink.target = '_blank';
  copyrightLink.classList.add('desc-1');
  copyrightLink.textContent = '© 2026 Aashirvaad. All Rights Reserved.';
  itcTitles.append(copyrightLink);

  footerContainer.append(itcTitles);

  const socialMedia = document.createElement('div');
  socialMedia.classList.add('cmp-footer__social-media');

  // Filter for 'footer-social' items: they have one child cell containing an 'a' tag
  // and the href is expected to be a social link.
  const footerSocials = itemRows.filter((row) => row.children.length === 1 && row.querySelector('div > a'));
  footerSocials.forEach((row) => {
    const socialLink = row.querySelector('div > a'); // Ensure we get the link from the cell
    if (socialLink) {
      const newSocialLink = document.createElement('a');
      moveInstrumentation(row, newSocialLink);
      newSocialLink.href = socialLink.href;
      newSocialLink.target = '_blank';

      // Determine social icon class based on href
      if (socialLink.href.includes('instagram')) {
        newSocialLink.classList.add('icon-instagram');
        newSocialLink.setAttribute('data-social', 'instagram');
      } else if (socialLink.href.includes('facebook')) {
        newSocialLink.classList.add('icon-facebok'); // Original HTML uses 'icon-facebok', not 'icon-facebook'
        newSocialLink.setAttribute('data-social', 'facebook');
      } else if (socialLink.href.includes('twitter')) {
        newSocialLink.classList.add('icon-twitter');
        newSocialLink.setAttribute('data-social', 'twitter');
      } else if (socialLink.href.includes('youtube')) {
        newSocialLink.classList.add('icon-youtube');
        newSocialLink.setAttribute('data-social', 'youtube');
      }
      socialMedia.append(newSocialLink);
    }
  });

  footerContainer.append(socialMedia);
  bottomContent.append(footerContainer);
  footer.append(bottomContent);

  block.textContent = '';
  block.append(footer);

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
