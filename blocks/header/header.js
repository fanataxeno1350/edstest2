import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');

  const headerContent = document.createElement('div');
  headerContent.classList.add('header-content');

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('header-logo');
  const logoLink = block.querySelector('[data-aue-prop="logoLink"]');
  if (logoLink) {
    const logoAnchor = document.createElement('a');
    logoAnchor.href = logoLink.getAttribute('href');
    logoAnchor.setAttribute('aria-label', 'Qiddiya - Go to homepage');
    const logoIcon = document.createElement('span');
    logoIcon.classList.add('header-qd-icon', 'header-qd-icon--logo', 'header-qd-logo');
    // Manually recreating the logo SVG paths as they are not authored content
    for (let i = 1; i <= 25; i += 1) {
      const path = document.createElement('span');
      path.classList.add(`header-path${i}`);
      logoIcon.append(path);
    }
    logoAnchor.append(logoIcon);
    logoWrapper.append(logoAnchor);
    moveInstrumentation(logoLink, logoAnchor);
  }
  headerContent.append(logoWrapper);

  // Contact Us CTA
  const contactUsCtaWrapper = document.createElement('div');
  contactUsCtaWrapper.classList.add('header-contact-us-cta');
  const contactUsLink = block.querySelector('[data-aue-prop="contactUsLink"]');
  if (contactUsLink) {
    const contactAnchor = document.createElement('a');
    contactAnchor.href = contactUsLink.getAttribute('href');
    contactAnchor.classList.add('header-cta', 'header-cta__', 'header-cmp-navigation--content__cta');
    contactAnchor.setAttribute('target', '_self');
    contactAnchor.setAttribute('aria-label', 'Contact Us');

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('header-cta__icon', 'header-qd-icon', 'header-qd-icon--cheveron-right');
    iconSpan.setAttribute('aria-hidden', 'true');

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('header-cta__label');
    labelSpan.textContent = contactUsLink.textContent.trim(); // Assuming text content is the label

    contactAnchor.append(iconSpan, labelSpan);
    contactUsCtaWrapper.append(contactAnchor);
    moveInstrumentation(contactUsLink, contactAnchor);
  }
  headerContent.append(contactUsCtaWrapper);

  // Hamburger Menu
  const hamburgerWrapper = document.createElement('div');
  hamburgerWrapper.classList.add('header-hamburger-menu');
  const hamburgerEllipse = document.createElement('div');
  hamburgerEllipse.classList.add('header-hamburger-ellipse');
  hamburgerEllipse.setAttribute('tabindex', '0');
  hamburgerEllipse.innerHTML = `
    <span class="header-hamburger-icon header-qd-icon header-qd-icon--hamburger"></span>
    <span class="header-close-icon header-qd-icon header-qd-icon--cancel"></span>
  `;
  hamburgerWrapper.append(hamburgerEllipse);
  headerContent.append(hamburgerWrapper);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('header-navigation');
  nav.setAttribute('aria-label', 'Main Navigation');

  const navList = document.createElement('ul');
  navList.classList.add('header-navigation-list');

  const navigationMenus = block.querySelectorAll('[data-aue-model="headerNavigationMenuItem"]');
  navigationMenus.forEach((menuNode) => {
    const menuItem = document.createElement('li');
    menuItem.classList.add('header-navigation-item');

    const menuLink = menuNode.querySelector('[data-aue-prop="link"]');
    const menuLabel = menuNode.querySelector('[data-aue-prop="label"]');

    if (menuLink && menuLabel) {
      const anchor = document.createElement('a');
      anchor.href = menuLink.getAttribute('href');
      anchor.setAttribute('target', '_self');
      anchor.setAttribute('aria-haspopup', 'true');
      anchor.setAttribute('aria-expanded', 'false');
      anchor.classList.add('header-navigation-link');

      const labelSpan = document.createElement('span');
      labelSpan.textContent = menuLabel.textContent.trim();
      anchor.append(labelSpan);

      const iconWrapper = document.createElement('span');
      iconWrapper.classList.add('header-qd-icon-wrapper');
      const icon = document.createElement('span');
      icon.classList.add('header-menu-icon', 'header-qd-icon', 'header-qd-icon--cheveron-down');
      iconWrapper.append(icon);
      anchor.append(iconWrapper);

      menuItem.append(anchor);
      moveInstrumentation(menuLink, anchor);
      moveInstrumentation(menuLabel, labelSpan);
    }

    const submenus = menuNode.querySelectorAll('[data-aue-model="headerNavigationMenuItem"][data-aue-resource="submenus"]');
    if (submenus.length > 0) {
      const submenuList = document.createElement('ul');
      submenuList.classList.add('header-navigation-submenu');

      submenus.forEach((submenuNode) => {
        const subMenuItem = document.createElement('li');
        const subMenuLink = submenuNode.querySelector('[data-aue-prop="link"]');
        const subMenuLabel = submenuNode.querySelector('[data-aue-prop="label"]');

        if (subMenuLink && subMenuLabel) {
          const subAnchor = document.createElement('a');
          subAnchor.href = subMenuLink.getAttribute('href');
          subAnchor.setAttribute('target', '_self');
          subAnchor.setAttribute('aria-expanded', 'false');
          subAnchor.textContent = subMenuLabel.textContent.trim();
          subMenuItem.append(subAnchor);
          moveInstrumentation(subMenuLink, subAnchor);
          moveInstrumentation(subMenuLabel, subAnchor);
        }
        submenuList.append(subMenuItem);
        moveInstrumentation(submenuNode, subMenuItem);
      });
      menuItem.append(submenuList);
    }
    navList.append(menuItem);
    moveInstrumentation(menuNode, menuItem);
  });

  nav.append(navList);

  // Language Selector
  const langSelectorWrapper = document.createElement('div');
  langSelectorWrapper.classList.add('header-language-selector');
  const langList = document.createElement('ul');
  langList.classList.add('header-cmp-language-selector');

  const languageItems = block.querySelectorAll('[data-aue-model="headerLanguageSelectorItem"]');
  languageItems.forEach((langNode, index) => {
    const langItem = document.createElement('li');
    if (index === 0) {
      langItem.classList.add('header-active');
    }

    const langLink = langNode.querySelector('[data-aue-prop="link"]');
    const langLabel = langNode.querySelector('[data-aue-prop="label"]');

    if (langLink && langLabel) {
      const anchor = document.createElement('a');
      anchor.href = langLink.getAttribute('href');
      anchor.setAttribute('aria-label', langLabel.textContent.trim());
      anchor.classList.add('header-cmp-language-selector__link');
      anchor.setAttribute('data-lang', langLink.getAttribute('href').replace(/\//g, '')); // Simplified lang extraction
      anchor.textContent = langLabel.textContent.trim();
      langItem.append(anchor);
      moveInstrumentation(langLink, anchor);
      moveInstrumentation(langLabel, anchor);
    }
    langList.append(langItem);
    moveInstrumentation(langNode, langItem);
  });
  langSelectorWrapper.append(langList);
  nav.append(langSelectorWrapper);

  headerWrapper.append(headerContent, nav);

  block.textContent = '';
  block.append(headerWrapper);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
