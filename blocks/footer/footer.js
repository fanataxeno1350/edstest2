import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const footerWrapper = document.createElement('div');
  footerWrapper.classList.add('footer-wrapper');

  const footerNavigation = document.createElement('div');
  footerNavigation.classList.add('footer-navigation', 'footer-nav-css-from-wrapper');

  const footerNavigationWrapper = document.createElement('div');
  footerNavigationWrapper.classList.add('footer-navigation__wrapper');

  const footerNavigationLogo = document.createElement('div');
  footerNavigationLogo.classList.add('footer-navigation__logo');

  const logoLink = block.querySelector('[data-aue-prop="logoLink"]');
  if (logoLink) {
    const newLogoLink = document.createElement('a');
    newLogoLink.href = logoLink.href;
    newLogoLink.target = logoLink.target;
    newLogoLink.setAttribute('aria-label', logoLink.getAttribute('aria-label'));

    const logoIcon = block.querySelector('[data-aue-prop="logoIcon"]');
    if (logoIcon) {
      newLogoLink.append(logoIcon);
      moveInstrumentation(logoIcon, newLogoLink);
    }
    footerNavigationLogo.append(newLogoLink);
    moveInstrumentation(logoLink, newLogoLink);
  }
  footerNavigationWrapper.append(footerNavigationLogo);

  const footerNavigationContent = document.createElement('div');
  footerNavigationContent.classList.add('footer-navigation__content');

  const footerSocialLinks = document.createElement('div');
  footerSocialLinks.classList.add('footer-socialLinks', 'footer-social-links', 'footer-social-css-from-wrapper');

  const socialLinksList = document.createElement('ul');
  socialLinksList.classList.add('footer-social-links__list');

  const socialLinks = block.querySelectorAll('[data-aue-model="socialLink"]');
  socialLinks.forEach((socialLinkNode) => {
    const socialLinkItem = document.createElement('li');
    socialLinkItem.classList.add('footer-social-links__item');

    const urlElement = socialLinkNode.querySelector('[data-aue-prop="url"]');
    const iconElement = socialLinkNode.querySelector('[data-aue-prop="icon"]');
    const labelElement = socialLinkNode.querySelector('[data-aue-prop="label"]');

    if (urlElement && iconElement) {
      const link = document.createElement('a');
      link.classList.add('footer-social-links__icon', 'footer-qd-icon', `footer-qd-icon--${iconElement.textContent.toLowerCase()}`);
      link.target = '_blank';
      link.href = urlElement.href;
      link.setAttribute('aria-label', labelElement ? labelElement.textContent : '');
      socialLinkItem.append(link);
      moveInstrumentation(urlElement, link);
      moveInstrumentation(iconElement, link);
      if (labelElement) moveInstrumentation(labelElement, link);
    }
    socialLinksList.append(socialLinkItem);
    moveInstrumentation(socialLinkNode, socialLinkItem);
  });
  footerSocialLinks.append(socialLinksList);
  footerNavigationContent.append(footerSocialLinks);

  const footerNavigationLinks = document.createElement('ul');
  footerNavigationLinks.classList.add('footer-navigation__links');

  const footerLinks = block.querySelectorAll('[data-aue-model="footerLink"]');
  footerLinks.forEach((footerLinkNode) => {
    const footerLinkItem = document.createElement('li');

    const urlElement = footerLinkNode.querySelector('[data-aue-prop="url"]');
    const labelElement = footerLinkNode.querySelector('[data-aue-prop="label"]');

    if (urlElement && labelElement) {
      const link = document.createElement('a');
      link.classList.add('footer-navigation__link-item');
      link.tabIndex = 0;
      link.target = '_self';
      link.title = labelElement.textContent;
      link.href = urlElement.href;
      link.textContent = labelElement.textContent;
      footerLinkItem.append(link);
      moveInstrumentation(urlElement, link);
      moveInstrumentation(labelElement, link);
    }
    footerNavigationLinks.append(footerLinkItem);
    moveInstrumentation(footerLinkNode, footerLinkItem);
  });
  footerNavigationContent.append(footerNavigationLinks);
  footerNavigationWrapper.append(footerNavigationContent);
  footerNavigation.append(footerNavigationWrapper);
  footerWrapper.append(footerNavigation);

  const footerDivider = document.createElement('div');
  footerDivider.classList.add('footer-divider');
  footerWrapper.append(footerDivider);

  const footerBottom = document.createElement('div');
  footerBottom.classList.add('footer-bottom');

  const footerLanguageSelector = document.createElement('div');
  footerLanguageSelector.classList.add('footer-language-selector', 'footer-lang-css-from-wrapper');

  const languageSelectorList = document.createElement('ul');
  languageSelectorList.classList.add('footer-cmp-language-selector');

  const languageLinks = block.querySelectorAll('[data-aue-model="languageLink"]');
  languageLinks.forEach((languageLinkNode) => {
    const languageLinkItem = document.createElement('li');

    const urlElement = languageLinkNode.querySelector('[data-aue-prop="url"]');
    const labelElement = languageLinkNode.querySelector('[data-aue-prop="label"]');

    if (urlElement && labelElement) {
      const link = document.createElement('a');
      link.classList.add('footer-cmp-language-selector__link');
      link.href = urlElement.href;
      link.setAttribute('aria-label', labelElement.textContent);
      link.setAttribute('data-lang', labelElement.textContent.toLowerCase().substring(0, 2));
      link.textContent = labelElement.textContent;
      languageLinkItem.append(link);
      moveInstrumentation(urlElement, link);
      moveInstrumentation(labelElement, link);
    }
    languageSelectorList.append(languageLinkItem);
    moveInstrumentation(languageLinkNode, languageLinkItem);
  });
  footerLanguageSelector.append(languageSelectorList);
  footerBottom.append(footerLanguageSelector);

  const footerPolicyLinks = document.createElement('div');
  footerPolicyLinks.classList.add('footer-policy-links', 'footer-policy-css-from-wrapper');

  const policyLinksWrapper = document.createElement('div');
  policyLinksWrapper.classList.add('footer-policy-links__wrapper');

  const policyLinksContent = document.createElement('div');
  policyLinksContent.classList.add('footer-policy-links__content');

  const policyLinks = block.querySelectorAll('[data-aue-model="policyLink"]');
  policyLinks.forEach((policyLinkNode) => {
    const urlElement = policyLinkNode.querySelector('[data-aue-prop="url"]');
    const labelElement = policyLinkNode.querySelector('[data-aue-prop="label"]');

    if (urlElement && labelElement) {
      const link = document.createElement('a');
      link.tabIndex = 0;
      link.classList.add('footer-policy-links__item');
      link.title = labelElement.textContent;
      link.href = urlElement.href;
      link.target = '_self';
      link.textContent = labelElement.textContent;
      policyLinksContent.append(link);
      moveInstrumentation(urlElement, link);
      moveInstrumentation(labelElement, link);
    }
    moveInstrumentation(policyLinkNode, policyLinksContent);
  });
  policyLinksWrapper.append(policyLinksContent);

  const copyright = block.querySelector('[data-aue-prop="copyright"]');
  if (copyright) {
    const copyrightP = document.createElement('p');
    copyrightP.classList.add('footer-policy-links__copyright');
    copyrightP.textContent = copyright.textContent;
    policyLinksWrapper.append(copyrightP);
    moveInstrumentation(copyright, copyrightP);
  }
  footerPolicyLinks.append(policyLinksWrapper);
  footerBottom.append(footerPolicyLinks);
  footerWrapper.append(footerBottom);

  block.textContent = '';
  block.append(footerWrapper);
  block.className = `footer block`;
  block.dataset.blockStatus = 'loaded';
}
