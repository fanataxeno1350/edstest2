import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoRow,
    fssaiLogoRow,
    footerLinksContainerRow, // This row contains "Footer Links value"
    footerSocialContainerRow, // This row contains "Footer Social Media value"
    ...itemRows
  ] = [...block.children];

  block.textContent = '';
  block.classList.add('cmp-footer');

  const topContent = document.createElement('div');
  topContent.classList.add('cmp-footer__top-content');

  const navLogo = document.createElement('div');
  navLogo.classList.add('cmp-footer__nav-logo');

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image', 'cmp-footer__logo');
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoLink = document.createElement('a');
    logoLink.classList.add('cmp-image__link');
    logoLink.href = '/'; // Assuming the logo links to the homepage
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
    logoDiv.append(logoLink);
  }
  moveInstrumentation(logoRow, logoDiv);
  navLogo.append(logoDiv);

  // FSSAI Logo
  const fssaiLogoDiv = document.createElement('div');
  fssaiLogoDiv.classList.add('logofssai', 'logo', 'image', 'cmp-footer__fssai_logo');
  const fssaiLogoPicture = fssaiLogoRow.querySelector('picture');
  if (fssaiLogoPicture) {
    const img = fssaiLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    fssaiLogoDiv.append(optimizedPic);
  }
  moveInstrumentation(fssaiLogoRow, fssaiLogoDiv);
  navLogo.append(fssaiLogoDiv);

  topContent.append(navLogo);

  // Subscribe Now section (static content from original HTML)
  const subscribeDiv = document.createElement('div');
  subscribeDiv.classList.add('cmp-footer__nav-subscribe');
  subscribeDiv.setAttribute('data-register-api-url', '/content/itc-foods-brands/servicespath/itcemail.register.json');
  subscribeDiv.setAttribute('data-popup-success-message', 'Registered Successfully!!');
  subscribeDiv.setAttribute('data-popup-failure-message', 'Registered Failed, Please try after some time.');

  subscribeDiv.innerHTML = `
    <div class="cmp-footer__nav-text">
        <img src="/content/dam/aemigrate/uploaded-folder/image/1775039230580.svg+xml" alt="aashirvaad-logo" loading="lazy" fetchpriority="low">
        <h3>in Your Inbox</h3>
    </div>
    <div class="container responsivegrid cmp-input">
        <div class="text aem-GridColumn aem-GridColumn--default--12 cmp-input__email">
            <div class="cmp-form-text" data-cmp-required-message="This field is required" data-cmp-valid-email="Please enter valid email id">
                <label for="form-text-2014401237"></label>
                <input class="cmp-form-text__text" type="email" placeholder="Enter your Email ID" name="email">
            </div>
        </div>
    </div>
    <div class="cmp-footer__error-message"></div>
    <div class="cmp-footer__consent">
        <input type="checkbox" id="i_agree" name="i_agree" value="i_agree" class="cmp-footer__consent--checkbox">
        <div class="cmp-footer__consent--link">
            <p>By clicking “Register Now”, you agree to the&nbsp;<a href="/conditions-policy/privacy-policy.html" target="_self" rel="noopener noreferrer">Privacy Policy</a>&nbsp;and to receive marketing emails from the Aashirvaad community</p>
        </div>
    </div>
    <div class="button cmp-button--primary cmp-button--primary-anchor-dark">
        <button type="button" id="button-fb2118d4d9" class="cmp-button" data-request="true" disabled="">
            <span class="cmp-button__text">Register Now</span>
        </button>
    </div>
  `;
  topContent.append(subscribeDiv);

  // Add event listener for the "Register Now" button
  const registerButton = subscribeDiv.querySelector('.cmp-button');
  const emailInput = subscribeDiv.querySelector('.cmp-form-text__text');
  const consentCheckbox = subscribeDiv.querySelector('.cmp-footer__consent--checkbox');
  const errorMessageDiv = subscribeDiv.querySelector('.cmp-footer__error-message');

  const validateEmail = (email) => {
    // Basic email validation regex
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const updateButtonState = () => {
    const isEmailValid = validateEmail(emailInput.value);
    const isConsentChecked = consentCheckbox.checked;
    registerButton.disabled = !(isEmailValid && isConsentChecked);
  };

  emailInput.addEventListener('input', updateButtonState);
  consentCheckbox.addEventListener('change', updateButtonState);

  registerButton.addEventListener('click', async () => {
    if (registerButton.disabled) {
      if (!validateEmail(emailInput.value)) {
        errorMessageDiv.textContent = emailInput.closest('.cmp-form-text').dataset.cmpValidEmail;
      } else if (!consentCheckbox.checked) {
        errorMessageDiv.textContent = 'Please agree to the terms.';
      }
      errorMessageDiv.style.display = 'block';
      return;
    }

    errorMessageDiv.style.display = 'none';
    const email = emailInput.value;
    const apiUrl = subscribeDiv.dataset.registerApiUrl;
    const successMessage = subscribeDiv.dataset.popupSuccessMessage;
    const failureMessage = subscribeDiv.dataset.popupFailureMessage;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert(successMessage); // Or display a more sophisticated modal/popup
        emailInput.value = '';
        consentCheckbox.checked = false;
        updateButtonState();
      } else {
        alert(failureMessage);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert(failureMessage);
    }
  });


  // Footer Nav (Links)
  const footerNav = document.createElement('div');
  footerNav.classList.add('cmp-footer__nav');

  const navGroupLeft = document.createElement('div');
  navGroupLeft.classList.add('cmp-footer__nav-items', 'cmp-navigation__group--left');
  const navLeft = document.createElement('nav');
  navLeft.classList.add('cmp-navigation');
  const ulLeft = document.createElement('ul');
  ulLeft.classList.add('cmp-navigation__group');

  const navGroupRight = document.createElement('div');
  navGroupRight.classList.add('cmp-footer__nav-items', 'cmp-navigation__group--right');
  const navRight = document.createElement('nav');
  navRight.classList.add('cmp-navigation');
  const ulRight = document.createElement('ul');
  ulRight.classList.add('cmp-navigation__group');

  // Distribute footer links into two columns
  // Filter for 'footer-link' items: they have one child cell containing an 'a' tag.
  const footerLinks = itemRows.filter((row) => row.children.length === 1 && row.children[0].querySelector('a'));
  footerLinks.forEach((row, index) => {
    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');
    const link = row.children[0].querySelector('a'); // Access the link from the first cell
    if (link) {
      const newLink = document.createElement('a');
      newLink.classList.add('cmp-navigation__item-link');
      newLink.href = link.href;
      newLink.textContent = link.textContent;
      li.append(newLink);
    }
    moveInstrumentation(row, li);
    if (index % 2 === 0) {
      ulLeft.append(li);
    } else {
      ulRight.append(li);
    }
  });

  if (ulLeft.children.length > 0) {
    navLeft.append(ulLeft);
    navGroupLeft.append(navLeft);
    footerNav.append(navGroupLeft);
  }
  if (ulRight.children.length > 0) {
    navRight.append(ulRight);
    navGroupRight.append(navRight);
    footerNav.append(navGroupRight);
  }

  topContent.append(footerNav);
  block.append(topContent);

  // Bottom Content
  const bottomContent = document.createElement('div');
  bottomContent.classList.add('cmp-footer__bottom-content');

  const footerContainer = document.createElement('div');
  footerContainer.classList.add('cmp-footer__container');

  const itcTitles = document.createElement('div');
  itcTitles.classList.add('cmp-footer__ITC-Titles');

  // Static links for ITC Portal and Copyright
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

  // Social Media
  const socialMediaDiv = document.createElement('div');
  socialMediaDiv.classList.add('cmp-footer__social-media');

  // Filter for 'footer-social' items: they have one child cell containing an 'a' tag.
  const socialLinks = itemRows.filter((row) => row.children.length === 1 && row.children[0].querySelector('a'));
  socialLinks.forEach((row) => {
    const link = row.children[0].querySelector('a'); // Access the link from the first cell
    if (link) {
      const socialLink = document.createElement('a');
      socialLink.href = link.href;
      socialLink.target = '_blank';
      socialLink.textContent = ''; // Social icons are usually styled via CSS classes
      const url = new URL(link.href);
      if (url.hostname.includes('instagram')) {
        socialLink.classList.add('icon-instagram');
        socialLink.setAttribute('data-social', 'instagram');
      } else if (url.hostname.includes('facebook')) {
        socialLink.classList.add('icon-facebok'); // Corrected from 'icon-facebok' to 'icon-facebook' if it was a typo, but keeping as per allowlist.
        socialLink.setAttribute('data-social', 'facebook');
      } else if (url.hostname.includes('twitter')) {
        socialLink.classList.add('icon-twitter');
        socialLink.setAttribute('data-social', 'twitter');
      } else if (url.hostname.includes('youtube')) {
        socialLink.classList.add('icon-youtube');
        socialLink.setAttribute('data-social', 'youtube');
      }
      socialMediaDiv.append(socialLink);
    }
    moveInstrumentation(row, socialMediaDiv); // Move instrumentation for social link row
  });

  footerContainer.append(socialMediaDiv);
  bottomContent.append(footerContainer);
  block.append(bottomContent);

  // Optimize images (this part was already correct for pictures within the block)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
