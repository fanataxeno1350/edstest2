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

    const logoSpan = document.createElement('span');
    logoSpan.classList.add('footer-qd-icon', 'footer-qd-icon--logo', 'footer-qd-logo-footer');
    // Recreate all path spans
    for (let i = 1; i <= 25; i += 1) {
      const pathSpan = document.createElement('span');
      pathSpan.classList.add(`footer-path${i}`);
      logoSpan.append(pathSpan);
    }
    newLogoLink.append(logoSpan);
    footerNavigationLogo.append(newLogoLink);
    moveInstrumentation(logoLink, newLogoLink);
  }

  const footerNavigationContent = document.createElement('div');
  footerNavigationContent.classList.add('footer-navigation__content');

  const footerSocialLinks = document.createElement('div');
  footerSocialLinks.classList.add('footer-socialLinks', 'footer-social-links', 'footer-social-css-from-wrapper');

  const socialLinksList = document.createElement('ul');
  socialLinksList.classList.add('footer-socialLinks__list');

  const socialLinkItems = block.querySelectorAll('[data-aue-model="footerSocialLink"]');
  socialLinkItems.forEach((itemNode) => {
    const link = itemNode.querySelector('[data-aue-prop="link"]');
    if (link) {
      const listItem = document.createElement('li');
      listItem.classList.add('footer-socialLinks__item');

      const newLink = document.createElement('a');
      newLink.classList.add('footer-socialLinks__icon', 'footer-qd-icon');
      newLink.target = '_blank';
      newLink.href = link.href;
      newLink.setAttribute('aria-label', link.getAttribute('aria-label'));

      // Determine icon class based on aria-label or href
      const ariaLabel = link.getAttribute('aria-label')?.toLowerCase();
      if (ariaLabel.includes('x')) {
        newLink.classList.add('footer-qd-icon--x');
      } else if (ariaLabel.includes('instagram')) {
        newLink.classList.add('footer-qd-icon--instagram');
      } else if (ariaLabel.includes('youtube')) {
        newLink.classList.add('footer-qd-icon--youtube');
      } else if (ariaLabel.includes('tiktok')) {
        newLink.classList.add('footer-qd-icon--tiktok');
      } else if (ariaLabel.includes('linkedin')) {
        newLink.classList.add('footer-qd-icon--linkedin');
      }

      listItem.append(newLink);
      socialLinksList.append(listItem);
      moveInstrumentation(link, newLink);
      moveInstrumentation(itemNode, listItem);
    }
  });
  footerSocialLinks.append(socialLinksList);

  const footerNavigationLinks = document.createElement('ul');
  footerNavigationLinks.classList.add('footer-navigation__links');

  const navLinkItems = block.querySelectorAll('[data-aue-model="footerNavLink"]');
  navLinkItems.forEach((itemNode) => {
    const link = itemNode.querySelector('[data-aue-prop="link"]');
    const title = itemNode.querySelector('[data-aue-prop="title"]');
    if (link) {
      const listItem = document.createElement('li');
      const newLink = document.createElement('a');
      newLink.classList.add('footer-navigation__link-item');
      newLink.tabIndex = 0;
      newLink.target = '_self';
      newLink.href = link.href;
      newLink.title = title ? title.textContent : link.textContent;
      newLink.textContent = title ? title.textContent : link.textContent;

      listItem.append(newLink);
      footerNavigationLinks.append(listItem);
      moveInstrumentation(link, newLink);
      if (title) moveInstrumentation(title, newLink);
      moveInstrumentation(itemNode, listItem);
    }
  });

  footerNavigationContent.append(footerSocialLinks, footerNavigationLinks);
  footerNavigationWrapper.append(footerNavigationLogo, footerNavigationContent);
  footerNavigation.append(footerNavigationWrapper);

  const divider = document.createElement('div');
  divider.classList.add('footer-footer__divider');

  const footerBottom = document.createElement('div');
  footerBottom.classList.add('footer-footer__bottom');

  const languageSelector = document.createElement('div');
  languageSelector.classList.add('footer-language-selector', 'footer-lang-css-from-wrapper');

  const languageList = document.createElement('ul');
  languageList.classList.add('footer-language-selector__list');

  const languageLinkItems = block.querySelectorAll('[data-aue-model="footerLanguageLink"]');
  languageLinkItems.forEach((itemNode) => {
    const link = itemNode.querySelector('[data-aue-prop="link"]');
    const ariaLabel = itemNode.querySelector('[data-aue-prop="ariaLabel"]');
    const langCode = itemNode.querySelector('[data-aue-prop="langCode"]');

    if (link) {
      const listItem = document.createElement('li');
      if (link.closest('li')?.classList.contains('footer-active')) {
        listItem.classList.add('footer-active');
      }

      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.classList.add('footer-language-selector__link');
      newLink.setAttribute('aria-label', ariaLabel ? ariaLabel.textContent : link.textContent);
      if (langCode) {
        newLink.setAttribute('data-lang', langCode.textContent);
      }
      newLink.textContent = link.textContent;

      listItem.append(newLink);
      languageList.append(listItem);
      moveInstrumentation(link, newLink);
      if (ariaLabel) moveInstrumentation(ariaLabel, newLink);
      if (langCode) moveInstrumentation(langCode, newLink);
      moveInstrumentation(itemNode, listItem);
    }
  });
  languageSelector.append(languageList);

  const policyLinksContainer = document.createElement('div');
  policyLinksContainer.classList.add('footer-policy-links', 'footer-policy-css-from-wrapper');

  const policyLinksWrapper = document.createElement('div');
  policyLinksWrapper.classList.add('footer-policy-links__wrapper');

  const policyLinksContent = document.createElement('div');
  policyLinksContent.classList.add('footer-policy-links__content');

  const policyLinkItems = block.querySelectorAll('[data-aue-model="footerPolicyLink"]');
  policyLinkItems.forEach((itemNode) => {
    const link = itemNode.querySelector('[data-aue-prop="link"]');
    const title = itemNode.querySelector('[data-aue-prop="title"]');
    if (link) {
      const newLink = document.createElement('a');
      newLink.tabIndex = 0;
      newLink.classList.add('footer-policy-links__item');
      newLink.title = title ? title.textContent : link.textContent;
      newLink.href = link.href;
      newLink.target = '_self';
      newLink.textContent = title ? title.textContent : link.textContent;

      policyLinksContent.append(newLink);
      moveInstrumentation(link, newLink);
      if (title) moveInstrumentation(title, newLink);
      moveInstrumentation(itemNode, newLink);
    }
  });

  const copyrightText = block.querySelector('[data-aue-prop="copyright"]');
  const copyrightParagraph = document.createElement('p');
  copyrightParagraph.classList.add('footer-policy-links__copyright');
  if (copyrightText) {
    copyrightParagraph.textContent = copyrightText.textContent;
    moveInstrumentation(copyrightText, copyrightParagraph);
  } else {
    // Fallback if copyrightText is not found via data-aue-prop
    const oldCopyright = block.querySelector('.footer-policy-links__copyright');
    if (oldCopyright) {
      copyrightParagraph.textContent = oldCopyright.textContent;
      moveInstrumentation(oldCopyright, copyrightParagraph);
    }
  }

  policyLinksWrapper.append(policyLinksContent, copyrightParagraph);
  policyLinksContainer.append(policyLinksWrapper);

  footerBottom.append(languageSelector, policyLinksContainer);

  footerWrapper.append(footerNavigation, divider, footerBottom);

  block.textContent = '';
  block.append(footerWrapper);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
