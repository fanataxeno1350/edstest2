import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');

  const headerContainer = document.createElement('div');
  headerContainer.classList.add('header-container');

  const nav = document.createElement('nav');
  nav.id = 'nav';

  const navSections = document.createElement('div');
  navSections.classList.add('nav-sections');

  const navBrand = document.createElement('div');
  navBrand.classList.add('nav-brand');

  const logoLink = block.querySelector('[data-aue-prop="logoLink"]');
  if (logoLink) {
    const logoAnchor = document.createElement('a');
    logoAnchor.href = logoLink.href;
    logoAnchor.setAttribute('aria-label', 'Qiddiya - Go to homepage');
    const logoSpan = document.createElement('span');
    logoSpan.classList.add('icon', 'icon-logo');
    logoAnchor.append(logoSpan);
    navBrand.append(logoAnchor);
    moveInstrumentation(logoLink, logoAnchor);
  }

  const contactUsCta = document.createElement('div');
  contactUsCta.classList.add('contact-us-cta');

  const contactUsLabel = block.querySelector('[data-aue-prop="contactUsLabel"]');
  const contactUsLink = block.querySelector('[data-aue-prop="contactUsLink"]');

  if (contactUsLabel && contactUsLink) {
    const ctaAnchor = document.createElement('a');
    ctaAnchor.href = contactUsLink.href;
    ctaAnchor.classList.add('button', 'contact-us');
    ctaAnchor.setAttribute('aria-label', contactUsLabel.textContent.trim());

    const ctaIcon = document.createElement('span');
    ctaIcon.classList.add('icon', 'icon-cheveron-right');
    ctaAnchor.append(ctaIcon);

    const ctaLabelSpan = document.createElement('span');
    ctaLabelSpan.textContent = contactUsLabel.textContent.trim();
    ctaAnchor.append(ctaLabelSpan);

    contactUsCta.append(ctaAnchor);
    moveInstrumentation(contactUsLabel, ctaLabelSpan);
    moveInstrumentation(contactUsLink, ctaAnchor);
  }

  const navHamburger = document.createElement('div');
  navHamburger.classList.add('nav-hamburger');
  navHamburger.setAttribute('aria-expanded', 'false');
  navHamburger.setAttribute('role', 'button');
  navHamburger.setAttribute('tabindex', '0');

  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('icon', 'icon-hamburger');
  navHamburger.append(hamburgerIcon);

  const closeIcon = document.createElement('span');
  closeIcon.classList.add('icon', 'icon-cancel');
  navHamburger.append(closeIcon);

  contactUsCta.append(navHamburger);
  navBrand.append(contactUsCta);
  navSections.append(navBrand);

  const navMenus = document.createElement('div');
  navMenus.classList.add('nav-menus');

  const ul = document.createElement('ul');

  const menuItems = block.querySelectorAll('[data-aue-model="headerMenu"]');
  menuItems.forEach((menuItemNode) => {
    const li = document.createElement('li');
    li.classList.add('nav-menu-item');

    const menuLink = menuItemNode.querySelector('[data-aue-prop="link"]');
    const menuLabel = menuItemNode.querySelector('[data-aue-prop="label"]');

    if (menuLink && menuLabel) {
      const anchor = document.createElement('a');
      anchor.href = menuLink.href;
      anchor.textContent = menuLabel.textContent.trim();
      moveInstrumentation(menuLabel, anchor);
      moveInstrumentation(menuLink, anchor);

      const submenuItems = menuItemNode.querySelectorAll('[data-aue-prop="submenu"] > div');
      if (submenuItems.length > 0) {
        anchor.setAttribute('aria-haspopup', 'true');
        anchor.setAttribute('aria-expanded', 'false');
        anchor.classList.add('has-submenu');

        const iconWrapper = document.createElement('span');
        iconWrapper.classList.add('icon-wrapper');
        const cheveronIcon = document.createElement('span');
        cheveronIcon.classList.add('icon', 'icon-cheveron-down');
        iconWrapper.append(cheveronIcon);
        anchor.append(iconWrapper);

        const subUl = document.createElement('ul');
        subUl.classList.add('nav-submenu');

        submenuItems.forEach((subMenuItem) => {
          const subLi = document.createElement('li');
          const subLink = subMenuItem.querySelector('a');
          if (subLink) {
            const subAnchor = document.createElement('a');
            subAnchor.href = subLink.href;
            subAnchor.textContent = subLink.textContent.trim();
            subLi.append(subAnchor);
            moveInstrumentation(subLink, subAnchor);
          }
          subUl.append(subLi);
        });
        li.append(anchor, subUl);
      } else {
        li.append(anchor);
      }
    }
    ul.append(li);
    moveInstrumentation(menuItemNode, li);
  });

  navMenus.append(ul);

  const languageSelector = document.createElement('div');
  languageSelector.classList.add('language-selector');

  const langUl = document.createElement('ul');

  const languageItems = block.querySelectorAll('[data-aue-model="headerLanguage"]');
  languageItems.forEach((langItemNode, index) => {
    const langLi = document.createElement('li');
    if (index === 0) {
      langLi.classList.add('active');
    }

    const langLink = langItemNode.querySelector('[data-aue-prop="link"]');
    const langLabel = langItemNode.querySelector('[data-aue-prop="label"]');

    if (langLink && langLabel) {
      const langAnchor = document.createElement('a');
      langAnchor.href = langLink.href;
      langAnchor.setAttribute('aria-label', langLabel.textContent.trim());
      langAnchor.setAttribute('data-lang', langLink.href.split('/').filter(Boolean).pop() || 'en');
      langAnchor.textContent = langLabel.textContent.trim();
      langLi.append(langAnchor);
      moveInstrumentation(langLabel, langAnchor);
      moveInstrumentation(langLink, langAnchor);
    }
    langUl.append(langLi);
    moveInstrumentation(langItemNode, langLi);
  });

  languageSelector.append(langUl);
  navMenus.append(languageSelector);

  navSections.append(navMenus);
  nav.append(navSections);
  headerContainer.append(nav);
  headerWrapper.append(headerContainer);

  block.textContent = '';
  block.append(headerWrapper);
  block.classList.add('header'); // Add the block name as a class
  block.dataset.blockStatus = 'loaded';
}
