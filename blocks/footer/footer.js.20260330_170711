import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const topContent = document.createElement('div');
  topContent.classList.add('footer-cmp-footer__top-content');

  const navLogo = document.createElement('div');
  navLogo.classList.add('footer-cmp-footer__nav-logo');
  topContent.append(navLogo);

  // Logo Image
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('footer-logo', 'footer-image', 'footer-cmp-footer__logo');
  const logoImg = block.querySelector('[data-aue-prop="logoImage"] img');
  if (logoImg) {
    const picture = createOptimizedPicture(logoImg.src, logoImg.alt);
    const link = block.querySelector('[data-aue-prop="logoImage"] a');
    if (link) {
      link.textContent = '';
      link.append(picture);
      logoWrapper.append(link);
      moveInstrumentation(logoImg.closest('[data-cmp-is="image"]'), logoWrapper);
    } else {
      logoWrapper.append(picture);
      moveInstrumentation(logoImg.closest('[data-cmp-is="image"]'), logoWrapper);
    }
  }
  navLogo.append(logoWrapper);

  // FSSAI Logo Image
  const fssaiLogoWrapper = document.createElement('div');
  fssaiLogoWrapper.classList.add('footer-logofssai', 'footer-logo', 'footer-image', 'footer-cmp-footer__fssai_logo');
  const fssaiImg = block.querySelector('[data-aue-prop="fssaiLogoImage"] img');
  if (fssaiImg) {
    const picture = createOptimizedPicture(fssaiImg.src, fssaiImg.alt);
    fssaiLogoWrapper.append(picture);
    moveInstrumentation(fssaiImg.closest('[data-cmp-is="image"]'), fssaiLogoWrapper);
  }
  navLogo.append(fssaiLogoWrapper);

  // Subscribe Section
  const subscribeSection = document.createElement('div');
  subscribeSection.classList.add('footer-cmp-footer__nav-subscribe');
  subscribeSection.setAttribute('data-register-api-url', '/content/itc-foods-brands/servicespath/itcemail.register.json');
  subscribeSection.setAttribute('data-popup-success-message', 'Registered Successfully!!');
  subscribeSection.setAttribute('data-popup-failure-message', 'Registered Failed, Please try after some time.');

  const subscribeText = document.createElement('div');
  subscribeText.classList.add('footer-cmp-footer__nav-text');
  const subscribeImage = block.querySelector('[data-aue-prop="subscribeImage"] img');
  if (subscribeImage) {
    subscribeText.append(subscribeImage);
    moveInstrumentation(subscribeImage, subscribeText);
  }
  const subscribeTitle = block.querySelector('[data-aue-prop="subscribeTitle"]');
  if (subscribeTitle) {
    const h3 = document.createElement('h3');
    h3.textContent = subscribeTitle.textContent;
    subscribeText.append(h3);
    moveInstrumentation(subscribeTitle, h3);
  }
  subscribeSection.append(subscribeText);

  const emailInputContainer = document.createElement('div');
  emailInputContainer.classList.add('footer-container', 'footer-responsivegrid', 'footer-cmp-input');
  const emailInputWrapper = document.createElement('div');
  emailInputWrapper.classList.add('footer-text', 'footer-aem-GridColumn', 'footer-aem-GridColumn--default--12', 'footer-cmp-input__email');
  const emailInputDiv = document.createElement('div');
  emailInputDiv.classList.add('footer-cmp-form-text');
  emailInputDiv.setAttribute('data-cmp-required-message', 'This field is required');
  emailInputDiv.setAttribute('data-cmp-valid-email', 'Please enter valid email id');
  const label = document.createElement('label');
  label.setAttribute('for', 'form-text-2014401237');
  const input = document.createElement('input');
  input.classList.add('footer-cmp-form-text__text');
  input.type = 'email';
  const emailPlaceholder = block.querySelector('[data-aue-prop="subscribeEmailPlaceholder"]');
  if (emailPlaceholder) {
    input.placeholder = emailPlaceholder.textContent;
    moveInstrumentation(emailPlaceholder, input);
  } else {
    input.placeholder = 'Enter your Email ID';
  }
  input.name = 'email';
  emailInputDiv.append(label, input);
  emailInputWrapper.append(emailInputDiv);
  emailInputContainer.append(emailInputWrapper);
  subscribeSection.append(emailInputContainer);

  const errorMessage = document.createElement('div');
  errorMessage.classList.add('footer-cmp-footer__error-message');
  subscribeSection.append(errorMessage);

  const consentDiv = document.createElement('div');
  consentDiv.classList.add('footer-cmp-footer__consent');
  const consentCheckbox = document.createElement('input');
  consentCheckbox.type = 'checkbox';
  consentCheckbox.id = 'i_agree';
  consentCheckbox.name = 'i_agree';
  consentCheckbox.value = 'i_agree';
  consentCheckbox.classList.add('footer-cmp-footer__consent--checkbox');
  const consentLinkDiv = document.createElement('div');
  consentLinkDiv.classList.add('footer-cmp-footer__consent--link');
  const privacyPolicyLink = block.querySelector('[data-aue-prop="subscribePrivacyPolicyLink"]');
  if (privacyPolicyLink) {
    consentLinkDiv.append(privacyPolicyLink);
    moveInstrumentation(privacyPolicyLink, consentLinkDiv);
  }
  consentDiv.append(consentCheckbox, consentLinkDiv);
  subscribeSection.append(consentDiv);

  const registerButtonDiv = document.createElement('div');
  registerButtonDiv.classList.add('footer-button', 'footer-cmp-button--primary', 'footer-cmp-button--primary-anchor-dark');
  const registerButton = document.createElement('button');
  registerButton.type = 'button';
  registerButton.id = 'button-fb2118d4d9';
  registerButton.classList.add('footer-cmp-button');
  registerButton.setAttribute('data-request', 'true');
  registerButton.disabled = true;
  const registerButtonText = document.createElement('span');
  registerButtonText.classList.add('footer-cmp-button__text');
  const authoredRegisterText = block.querySelector('[data-aue-prop="subscribeRegisterButtonText"]');
  if (authoredRegisterText) {
    registerButtonText.textContent = authoredRegisterText.textContent;
    moveInstrumentation(authoredRegisterText, registerButtonText);
  } else {
    registerButtonText.textContent = 'Register Now';
  }
  registerButton.append(registerButtonText);
  registerButtonDiv.append(registerButton);
  subscribeSection.append(registerButtonDiv);
  topContent.append(subscribeSection);

  // Navigation Lists
  const navDiv = document.createElement('div');
  navDiv.classList.add('footer-cmp-footer__nav');

  const navLeft = document.createElement('div');
  navLeft.classList.add('footer-cmp-footer__nav-items', 'footer-cmp-navigation__group--left');
  const navLeftWrapper = document.createElement('div');
  navLeftWrapper.classList.add('footer-navigation');
  const navLeftList = document.createElement('nav');
  navLeftList.id = 'navigation-506467e377';
  navLeftList.classList.add('footer-cmp-navigation');
  navLeftList.setAttribute('itemscope', '');
  navLeftList.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  navLeftList.setAttribute('role', 'navigation');
  const ulLeft = document.createElement('ul');
  ulLeft.classList.add('footer-cmp-navigation__group');
  const footerLinksLeft = block.querySelectorAll('[data-aue-model="footerLinksLeft"]');
  footerLinksLeft.forEach((linkNode) => {
    const li = document.createElement('li');
    li.classList.add('footer-cmp-navigation__item', 'footer-cmp-navigation__item--level-0');
    const link = linkNode.querySelector('[data-aue-prop="link"]');
    if (link) {
      li.append(link);
      moveInstrumentation(link, li);
    }
    ulLeft.append(li);
    moveInstrumentation(linkNode, li);
  });
  navLeftList.append(ulLeft);
  navLeftWrapper.append(navLeftList);
  navLeft.append(navLeftWrapper);
  navDiv.append(navLeft);

  const navRight = document.createElement('div');
  navRight.classList.add('footer-cmp-footer__nav-items', 'footer-cmp-navigation__group--right');
  const navRightWrapper = document.createElement('div');
  navRightWrapper.classList.add('footer-navigation');
  const navRightList = document.createElement('nav');
  navRightList.id = 'navigation-b90fc6744f';
  navRightList.classList.add('footer-cmp-navigation');
  navRightList.setAttribute('itemscope', '');
  navRightList.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  navRightList.setAttribute('role', 'navigation');
  const ulRight = document.createElement('ul');
  ulRight.classList.add('footer-cmp-navigation__group');
  const footerLinksRight = block.querySelectorAll('[data-aue-model="footerLinksRight"]');
  footerLinksRight.forEach((linkNode) => {
    const li = document.createElement('li');
    li.classList.add('footer-cmp-navigation__item', 'footer-cmp-navigation__item--level-0');
    const link = linkNode.querySelector('[data-aue-prop="link"]');
    if (link) {
      li.append(link);
      moveInstrumentation(link, li);
    }
    ulRight.append(li);
    moveInstrumentation(linkNode, li);
  });
  navRightList.append(ulRight);
  navRightWrapper.append(navRightList);
  navRight.append(navRightWrapper);
  navDiv.append(navRight);

  topContent.append(navDiv);

  const bottomContent = document.createElement('div');
  bottomContent.classList.add('footer-cmp-footer__bottom-content');

  const bottomContainer = document.createElement('div');
  bottomContainer.classList.add('footer-cmp-footer__container');

  const itcTitles = document.createElement('div');
  itcTitles.classList.add('footer-cmp-footer__ITC-Titles');
  const itcPortalLink = block.querySelector('[data-aue-prop="itcPortalLink"]');
  if (itcPortalLink) {
    itcTitles.append(itcPortalLink);
    moveInstrumentation(itcPortalLink, itcTitles);
  }
  const copyrightText = block.querySelector('[data-aue-prop="copyrightText"]');
  if (copyrightText) {
    const copyrightLink = document.createElement('a');
    copyrightLink.classList.add('footer-desc-1');
    copyrightLink.textContent = copyrightText.textContent;
    itcTitles.append(copyrightLink);
    moveInstrumentation(copyrightText, copyrightLink);
  }
  bottomContainer.append(itcTitles);

  const socialMedia = document.createElement('div');
  socialMedia.classList.add('footer-cmp-footer__social-media');
  const footerSocialLinks = block.querySelectorAll('[data-aue-model="footerSocialLinks"]');
  footerSocialLinks.forEach((socialLinkNode) => {
    const link = socialLinkNode.querySelector('[data-aue-prop="link"]');
    const platform = socialLinkNode.querySelector('[data-aue-prop="platform"]');
    if (link && platform) {
      link.classList.add(`footer-icon-${platform.textContent.toLowerCase()}`);
      link.setAttribute('data-social', platform.textContent.toLowerCase());
      socialMedia.append(link);
      moveInstrumentation(link, socialMedia);
      moveInstrumentation(platform, link);
    }
    moveInstrumentation(socialLinkNode, socialMedia);
  });
  bottomContainer.append(socialMedia);

  bottomContent.append(bottomContainer);

  block.textContent = '';
  const footerCmpFooter = document.createElement('div');
  footerCmpFooter.classList.add('footer-cmp-footer');
  footerCmpFooter.append(topContent, bottomContent);
  block.append(footerCmpFooter);
  block.classList.add('footer', 'block');
  block.dataset.blockStatus = 'loaded';
}
