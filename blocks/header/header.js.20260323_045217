import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('header-wrapper');

  const headerNavigation = document.createElement('div');
  headerNavigation.classList.add('header-navigation');

  const cmpNavigationWrapper = document.createElement('div');
  cmpNavigationWrapper.classList.add('header-cmp-navigation-wrapper');
  cmpNavigationWrapper.setAttribute('role', 'banner');
  cmpNavigationWrapper.setAttribute('aria-label', 'navigation.header.aria.label');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('header-cmp-navigation-wrapper__logo');

  const logoLink = block.querySelector('[data-aue-prop="logoLink"]');
  if (logoLink) {
    const newLogoLink = document.createElement('a');
    newLogoLink.href = logoLink.href;
    newLogoLink.target = logoLink.target;
    newLogoLink.setAttribute('aria-label', logoLink.getAttribute('aria-label'));
    newLogoLink.innerHTML = logoLink.innerHTML;
    moveInstrumentation(logoLink, newLogoLink);
    logoDiv.append(newLogoLink);
  }

  const contactUsCtaDiv = document.createElement('div');
  contactUsCtaDiv.classList.add('header-cmp-navigation-wrapper__contactUs-cta');

  const contactUsLink = block.querySelector('[data-aue-prop="contactUsLink"]');
  if (contactUsLink) {
    const newContactUsLink = document.createElement('a');
    newContactUsLink.href = contactUsLink.href;
    newContactUsLink.classList.add('header-cta', 'header-cta__', 'header-cmp-navigation--content__cta');
    newContactUsLink.target = contactUsLink.target;
    newContactUsLink.setAttribute('aria-label', contactUsLink.getAttribute('aria-label'));
    newContactUsLink.innerHTML = contactUsLink.innerHTML;
    moveInstrumentation(contactUsLink, newContactUsLink);
    contactUsCtaDiv.append(newContactUsLink);
  }

  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('header-cmp-navigation-wrapper__icon');
  hamburgerDiv.id = 'navigation-toggle';
  const hamburgerEllipse = document.createElement('div');
  hamburgerEllipse.classList.add('header-hamburger-ellipse');
  hamburgerEllipse.setAttribute('tabindex', '0');
  hamburgerEllipse.innerHTML = `
    <span class="header-hamburger-icon header-qd-icon header-qd-icon--hamburger"></span>
    <span class="header-close-icon header-qd-icon header-qd-icon--cancel"></span>
  `;
  hamburgerDiv.append(hamburgerEllipse);
  contactUsCtaDiv.append(hamburgerDiv);
  logoDiv.append(contactUsCtaDiv);
  cmpNavigationWrapper.append(logoDiv);

  // Desktop Navbar
  const desktopNavbar = document.createElement('nav');
  desktopNavbar.classList.add('header-cmp-navigation-wrapper__navbar');
  desktopNavbar.id = 'navbar-desktop';
  desktopNavbar.setAttribute('role', 'navigation');
  desktopNavbar.setAttribute('aria-label', 'navigation.main.aria.label');

  const desktopNavbarList = document.createElement('ul');
  desktopNavbarList.classList.add('header-cmp-navigation-wrapper__navbar-list');

  const menus = block.querySelectorAll('[data-aue-model="menu"]');
  menus.forEach((menuNode) => {
    const menuLi = document.createElement('li');
    menuLi.classList.add('header-cmp-navigation-wrapper__navbar-menu');

    const menuLink = menuNode.querySelector('[data-aue-prop="link"]');
    const menuTitle = menuNode.querySelector('[data-aue-prop="title"]');

    if (menuLink && menuTitle) {
      const newMenuLink = document.createElement('a');
      newMenuLink.href = menuLink.href;
      newMenuLink.target = menuLink.target;
      newMenuLink.classList.add('header-cmp-navigation-wrapper__navbar-menulink');
      newMenuLink.setAttribute('aria-haspopup', 'true');
      newMenuLink.setAttribute('aria-expanded', 'false');

      const titleSpan = document.createElement('span');
      titleSpan.textContent = menuTitle.textContent;
      moveInstrumentation(menuTitle, titleSpan);

      const iconWrapper = document.createElement('span');
      iconWrapper.classList.add('header-qd-icon-wrapper');
      iconWrapper.innerHTML = '<span class="header-menu-icon header-qd-icon header-qd-icon--cheveron-down"></span>';

      newMenuLink.append(titleSpan, iconWrapper);
      moveInstrumentation(menuLink, newMenuLink);
      menuLi.append(newMenuLink);
    }

    const submenuUl = document.createElement('ul');
    submenuUl.classList.add('header-cmp-navigation-wrapper__navbar-submenu');

    const submenus = menuNode.querySelectorAll('[data-aue-model="submenu"]');
    submenus.forEach((submenuNode) => {
      const submenuLi = document.createElement('li');
      const submenuLink = submenuNode.querySelector('[data-aue-prop="link"]');
      const submenuTitle = submenuNode.querySelector('[data-aue-prop="title"]');

      if (submenuLink && submenuTitle) {
        const newSubmenuLink = document.createElement('a');
        newSubmenuLink.href = submenuLink.href;
        newSubmenuLink.target = submenuLink.target;
        newSubmenuLink.setAttribute('aria-expanded', 'false');

        const titleSpan = document.createElement('span');
        titleSpan.textContent = submenuTitle.textContent;
        moveInstrumentation(submenuTitle, titleSpan);

        newSubmenuLink.append(titleSpan);
        moveInstrumentation(submenuLink, newSubmenuLink);
        submenuLi.append(newSubmenuLink);
      }
      moveInstrumentation(submenuNode, submenuLi);
      submenuUl.append(submenuLi);
    });
    if (submenus.length > 0) {
      menuLi.append(submenuUl);
    }
    moveInstrumentation(menuNode, menuLi);
    desktopNavbarList.append(menuLi);
  });

  desktopNavbar.append(desktopNavbarList);

  // Desktop Contact Us CTA (duplicate of the one in logo div, but for desktop nav)
  const desktopContactUsLink = block.querySelector('.header-cmp-navigation-wrapper__navbar > .header-cta');
  if (desktopContactUsLink) {
    const newDesktopContactUsLink = document.createElement('a');
    newDesktopContactUsLink.href = desktopContactUsLink.href;
    newDesktopContactUsLink.classList.add('header-cta', 'header-cta__', 'header-cmp-navigation--content__cta');
    newDesktopContactUsLink.target = desktopContactUsLink.target;
    newDesktopContactUsLink.setAttribute('aria-label', desktopContactUsLink.getAttribute('aria-label'));
    newDesktopContactUsLink.innerHTML = desktopContactUsLink.innerHTML;
    moveInstrumentation(desktopContactUsLink, newDesktopContactUsLink);
    desktopNavbar.append(newDesktopContactUsLink);
  }

  // Desktop Language Selector
  const desktopLanguageSelector = document.createElement('div');
  desktopLanguageSelector.classList.add('header-language-selector', 'header-lang-css-from-wrapper');
  desktopLanguageSelector.style.visibility = 'visible';

  const desktopLangUl = document.createElement('ul');
  desktopLangUl.classList.add('header-cmp-language-selector');

  const languages = block.querySelectorAll('[data-aue-model="language"]');
  languages.forEach((langNode) => {
    const langLi = document.createElement('li');
    const langLink = langNode.querySelector('[data-aue-prop="link"]');
    const langLabel = langNode.querySelector('[data-aue-prop="label"]');

    if (langLink && langLabel) {
      const newLangLink = document.createElement('a');
      newLangLink.href = langLink.href;
      newLangLink.classList.add('header-cmp-language-selector__link');
      newLangLink.setAttribute('aria-label', langLabel.textContent);
      newLangLink.setAttribute('data-lang', langLink.getAttribute('data-lang'));
      newLangLink.textContent = langLabel.textContent;
      moveInstrumentation(langLabel, newLangLink);
      moveInstrumentation(langLink, newLangLink);
      langLi.append(newLangLink);
    }
    if (langNode.classList.contains('header-active')) {
      langLi.classList.add('header-active');
    }
    moveInstrumentation(langNode, langLi);
    desktopLangUl.append(langLi);
  });
  desktopLanguageSelector.append(desktopLangUl);
  desktopNavbar.append(desktopLanguageSelector);

  cmpNavigationWrapper.append(desktopNavbar);

  // Mobile Navbar
  const mobileNavbar = document.createElement('nav');
  mobileNavbar.classList.add('header-cmp-navigation-wrapper__mobilenavbar');
  mobileNavbar.id = 'navbar-mobile';
  mobileNavbar.setAttribute('role', 'navigation');
  mobileNavbar.setAttribute('aria-label', 'navigation.main.aria.label');

  const mobileNavbarList = document.createElement('ul');
  mobileNavbarList.classList.add('header-cmp-navigation-wrapper__mobilenavbar-list');

  menus.forEach((menuNode) => {
    const menuLi = document.createElement('li');
    menuLi.classList.add('header-cmp-navigation-wrapper__mobilenavbar-menu', 'header-border');

    const menuLink = menuNode.querySelector('[data-aue-prop="link"]');
    const menuTitle = menuNode.querySelector('[data-aue-prop="title"]');

    if (menuLink && menuTitle) {
      const newMenuLink = document.createElement('a');
      newMenuLink.classList.add('header-cmp-navigation-wrapper__mobilenavbar-menulink');

      const titleSpan = document.createElement('span');
      titleSpan.textContent = menuTitle.textContent;
      moveInstrumentation(menuTitle, titleSpan);

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('header-qd-icon', 'header-qd-icon--cheveron-right', 'header-cmp-navigation-wrapper__mobilenavbar-menulink-icon');

      newMenuLink.append(titleSpan, iconSpan);
      moveInstrumentation(menuLink, newMenuLink);
      menuLi.append(newMenuLink);
    }

    const submenuUl = document.createElement('ul');
    submenuUl.classList.add('header-cmp-navigation-wrapper__mobilenavbar-submenu');

    if (menuTitle) {
      const submenuHeaderLi = document.createElement('li');
      submenuHeaderLi.classList.add('header-cmp-navigation-wrapper__mobilenavbar-menuheader');
      const submenuHeaderLink = document.createElement('a');
      const headerTitleSpan = document.createElement('span');
      headerTitleSpan.textContent = menuTitle.textContent;
      submenuHeaderLink.append(headerTitleSpan);
      submenuHeaderLi.append(submenuHeaderLink);
      submenuUl.append(submenuHeaderLi);
    }

    const submenus = menuNode.querySelectorAll('[data-aue-model="submenu"]');
    submenus.forEach((submenuNode) => {
      const submenuLi = document.createElement('li');
      submenuLi.classList.add('header-cmp-navigation-wrapper__mobilenavbar-menu');
      const submenuLink = submenuNode.querySelector('[data-aue-prop="link"]');
      const submenuTitle = submenuNode.querySelector('[data-aue-prop="title"]');

      if (submenuLink && submenuTitle) {
        const newSubmenuLink = document.createElement('a');
        newSubmenuLink.href = submenuLink.href;
        newSubmenuLink.target = submenuLink.target;
        newSubmenuLink.classList.add('header-cmp-navigation-wrapper__mobilenavbar-menulink');

        const titleSpan = document.createElement('span');
        titleSpan.textContent = submenuTitle.textContent;
        moveInstrumentation(submenuTitle, titleSpan);

        newSubmenuLink.append(titleSpan);
        moveInstrumentation(submenuLink, newSubmenuLink);
        submenuLi.append(newSubmenuLink);
      }
      moveInstrumentation(submenuNode, submenuLi);
      submenuUl.append(submenuLi);
    });
    if (submenus.length > 0) {
      menuLi.append(submenuUl);
    }
    moveInstrumentation(menuNode, menuLi);
    mobileNavbarList.append(menuLi);
  });

  mobileNavbar.append(mobileNavbarList);

  const mobileNavBack = document.createElement('div');
  mobileNavBack.classList.add('header-cmp-navigation-wrapper__mobilenavbar-back', 'header-nav-back');
  mobileNavBack.innerHTML = `
    <a class="header-cmp-navigation-wrapper__icon">
      <span class="header-back-icon header-qd-icon header-qd-icon--cheveron-left"></span>
    </a>
    <span class="header-cmp-navigation-wrapper__iconlabel">Back</span>
  `;
  mobileNavbar.append(mobileNavBack);

  // Mobile Language Selector
  const mobileLanguageSelector = document.createElement('div');
  mobileLanguageSelector.classList.add('header-language-selector', 'header-lang-css-from-wrapper');
  mobileLanguageSelector.style.visibility = 'visible';

  const mobileLangUl = document.createElement('ul');
  mobileLangUl.classList.add('header-cmp-language-selector');

  languages.forEach((langNode) => {
    const langLi = document.createElement('li');
    const langLink = langNode.querySelector('[data-aue-prop="link"]');
    const langLabel = langNode.querySelector('[data-aue-prop="label"]');

    if (langLink && langLabel) {
      const newLangLink = document.createElement('a');
      newLangLink.href = langLink.href;
      newLangLink.classList.add('header-cmp-language-selector__link');
      newLangLink.setAttribute('aria-label', langLabel.textContent);
      newLangLink.setAttribute('data-lang', langLink.getAttribute('data-lang'));
      newLangLink.textContent = langLabel.textContent;
      moveInstrumentation(langLabel, newLangLink);
      moveInstrumentation(langLink, newLangLink);
      langLi.append(newLangLink);
    }
    if (langNode.classList.contains('header-active')) {
      langLi.classList.add('header-active');
    }
    moveInstrumentation(langNode, langLi);
    mobileLangUl.append(langLi);
  });
  mobileLanguageSelector.append(mobileLangUl);
  mobileNavbar.append(mobileLanguageSelector);

  cmpNavigationWrapper.append(mobileNavbar);

  headerNavigation.append(cmpNavigationWrapper);
  headerWrapper.append(headerNavigation);

  block.textContent = '';
  block.append(headerWrapper);
  block.className = `header block`;
  block.dataset.blockStatus = 'loaded';
}
