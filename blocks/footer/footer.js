import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const footerWrapper = document.createElement('div');
  footerWrapper.classList.add('footer-wrapper');

  // Footer Navigation Section
  const footerNavigation = document.createElement('div');
  footerNavigation.classList.add('footer-navigation', 'footer-nav-css-from-wrapper');

  const footerNavigationWrapper = document.createElement('div');
  footerNavigationWrapper.classList.add('footer-navigation__wrapper');

  const footerNavigationLogo = document.createElement('div');
  footerNavigationLogo.classList.add('footer-navigation__logo');

  const logoLink = block.querySelector('[data-aue-prop="logoLink"]');
  if (logoLink) {
    footerNavigationLogo.append(logoLink);
    moveInstrumentation(logoLink, footerNavigationLogo);
  }
  footerNavigationWrapper.append(footerNavigationLogo);

  const footerNavigationContent = document.createElement('div');
  footerNavigationContent.classList.add('footer-navigation__content');

  // Footer Social Links
  const footerSocialLinksDiv = document.createElement('div');
  footerSocialLinksDiv.classList.add('footer-socialLinks', 'footer-social-links', 'footer-social-css-from-wrapper');
  const socialLinksList = document.createElement('ul');
  socialLinksList.classList.add('footer-social-links__list');

  const socialLinkItems = block.querySelectorAll('[data-aue-model="footerSocialLink"]');
  socialLinkItems.forEach((itemNode) => {
    const socialLinkItem = document.createElement('li');
    socialLinkItem.classList.add('footer-social-links__item');

    const socialUrl = itemNode.querySelector('[data-aue-prop="socialUrl"]');
    const socialLabel = itemNode.querySelector('[data-aue-prop="socialLabel"]');

    if (socialUrl && socialLabel) {
      const link = document.createElement('a');
      link.classList.add('footer-social-links__icon', 'footer-qd-icon');
      link.target = '_blank';
      link.href = socialUrl.href;
      link.setAttribute('aria-label', socialLabel.textContent);

      // Determine icon class based on label (e.g., X, Instagram, Youtube, TikTok, LinkedIn)
      const labelText = socialLabel.textContent.toLowerCase();
      if (labelText === 'x') {
        link.classList.add('footer-qd-icon--x');
      } else if (labelText === 'instagram') {
        link.classList.add('footer-qd-icon--instagram');
      } else if (labelText === 'youtube') {
        link.classList.add('footer-qd-icon--youtube');
      } else if (labelText === 'tiktok') {
        link.classList.add('footer-qd-icon--tiktok');
      } else if (labelText === 'linkedin') {
        link.classList.add('footer-qd-icon--linkedin');
      }

      socialLinkItem.append(link);
      moveInstrumentation(socialUrl, link);
      moveInstrumentation(socialLabel, link);
    }
    socialLinksList.append(socialLinkItem);
    moveInstrumentation(itemNode, socialLinkItem);
  });
  footerSocialLinksDiv.append(socialLinksList);
  footerNavigationContent.append(footerSocialLinksDiv);

  // Footer Navigation Links
  const navLinksList = document.createElement('ul');
  navLinksList.classList.add('footer-navigation__links');

  const navLinkItems = block.querySelectorAll('[data-aue-model="footerNavigationLink"]');
  navLinkItems.forEach((itemNode) => {
    const navLinkItem = document.createElement('li');
    const navLinkUrl = itemNode.querySelector('[data-aue-prop="navLinkUrl"]');
    const navLinkLabel = itemNode.querySelector('[data-aue-prop="navLinkLabel"]');

    if (navLinkUrl && navLinkLabel) {
      const link = document.createElement('a');
      link.classList.add('footer-navigation__link-item');
      link.tabIndex = 0;
      link.target = '_self';
      link.title = navLinkLabel.textContent;
      link.href = navLinkUrl.href;
      link.textContent = navLinkLabel.textContent;
      navLinkItem.append(link);
      moveInstrumentation(navLinkUrl, link);
      moveInstrumentation(navLinkLabel, link);
    }
    navLinksList.append(navLinkItem);
    moveInstrumentation(itemNode, navLinkItem);
  });
  footerNavigationContent.append(navLinksList);

  footerNavigationWrapper.append(footerNavigationContent);
  footerNavigation.append(footerNavigationWrapper);
  footerWrapper.append(footerNavigation);

  // Footer Divider
  const footerDivider = document.createElement('div');
  footerDivider.classList.add('footer-divider');
  footerWrapper.append(footerDivider);

  // Footer Bottom Section
  const footerBottom = document.createElement('div');
  footerBottom.classList.add('footer-bottom');

  // Footer Language Selector
  const languageSelector = document.createElement('div');
  languageSelector.classList.add('footer-language-selector', 'footer-lang-css-from-wrapper');
  const langList = document.createElement('ul');
  langList.classList.add('footer-language-selector__list');

  const langLinkItems = block.querySelectorAll('[data-aue-model="footerLanguageLink"]');
  langLinkItems.forEach((itemNode) => {
    const langItem = document.createElement('li');
    const langLinkUrl = itemNode.querySelector('[data-aue-prop="langLinkUrl"]');
    const langLabel = itemNode.querySelector('[data-aue-prop="langLabel"]');

    if (langLinkUrl && langLabel) {
      const link = document.createElement('a');
      link.classList.add('footer-language-selector__link');
      link.href = langLinkUrl.href;
      link.setAttribute('aria-label', langLabel.textContent);
      link.setAttribute('data-lang', langLinkUrl.href.includes('/ar/') ? 'ar' : 'en'); // Assuming /ar/ for Arabic, root for English
      link.textContent = langLabel.textContent;
      langItem.append(link);
      moveInstrumentation(langLinkUrl, link);
      moveInstrumentation(langLabel, link);

      // Add 'footer-active' class if it's the English link (or based on current path)
      if (langLinkUrl.href === '/') {
        langItem.classList.add('footer-active');
      }
    }
    langList.append(langItem);
    moveInstrumentation(itemNode, langItem);
  });
  languageSelector.append(langList);
  footerBottom.append(languageSelector);

  // Footer Policy Links
  const policyLinksDiv = document.createElement('div');
  policyLinksDiv.classList.add('footer-policy-links', 'footer-policy-css-from-wrapper');
  const policyLinksWrapper = document.createElement('div');
  policyLinksWrapper.classList.add('footer-policy-links__wrapper');
  const policyLinksContent = document.createElement('div');
  policyLinksContent.classList.add('footer-policy-links__content');

  const policyLinkItems = block.querySelectorAll('[data-aue-model="footerPolicyLink"]');
  policyLinkItems.forEach((itemNode) => {
    const policyLinkUrl = itemNode.querySelector('[data-aue-prop="policyLinkUrl"]');
    const policyLabel = itemNode.querySelector('[data-aue-prop="policyLabel"]');

    if (policyLinkUrl && policyLabel) {
      const link = document.createElement('a');
      link.classList.add('footer-policy-links__item');
      link.tabIndex = 0;
      link.title = policyLabel.textContent;
      link.href = policyLinkUrl.href;
      link.target = '_self';
      link.textContent = policyLabel.textContent;
      policyLinksContent.append(link);
      moveInstrumentation(policyLinkUrl, link);
      moveInstrumentation(policyLabel, link);
    }
    moveInstrumentation(itemNode, policyLinksContent);
  });
  policyLinksWrapper.append(policyLinksContent);

  // Copyright
  const copyrightP = document.createElement('p');
  copyrightP.classList.add('footer-policy-links__copyright');
  const copyright = block.querySelector('[data-aue-prop="copyright"]');
  if (copyright) {
    copyrightP.textContent = copyright.textContent;
    policyLinksWrapper.append(copyrightP);
    moveInstrumentation(copyright, copyrightP);
  }

  policyLinksDiv.append(policyLinksWrapper);
  footerBottom.append(policyLinksDiv);

  footerWrapper.append(footerBottom);

  block.textContent = '';
  block.append(footerWrapper);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
