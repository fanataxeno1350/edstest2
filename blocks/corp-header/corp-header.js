import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const mainDiv = document.createElement('div');
  mainDiv.classList.add('corp-header-corp-header', 'corp-header-block');

  const navbar = document.createElement('div');
  navbar.classList.add('corp-header-navbar', 'corp-header-navbar-arena', 'corp-header-g-container');

  const navHamburger = document.createElement('div');
  navHamburger.classList.add('corp-header-nav-hamburger');
  const hamburgerButton = document.createElement('button');
  hamburgerButton.setAttribute('type', 'button');
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('corp-header-nav-hamburger-icon');
  hamburgerButton.append(hamburgerIcon);
  navHamburger.append(hamburgerButton);
  navbar.append(navHamburger);
  moveInstrumentation(block.querySelector('.corp-header-nav-hamburger'), navHamburger);

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('corp-header-logo-wrapper');
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('corp-header-logo', 'corp-header-block');
  const logoSpan = document.createElement('span');
  logoSpan.classList.add('corp-header-arena');
  const logoLink = block.querySelector('[data-aue-prop="logo"]');
  if (logoLink) {
    const logoImg = logoLink.querySelector('img');
    if (logoImg) {
      const picture = createOptimizedPicture(logoImg.src, logoImg.alt);
      logoLink.innerHTML = '';
      logoLink.append(picture);
      logoSpan.append(logoLink);
      moveInstrumentation(logoLink, logoSpan);
    }
  }
  logoDiv.append(logoSpan);
  logoWrapper.append(logoDiv);
  navbar.append(logoWrapper);
  moveInstrumentation(block.querySelector('.corp-header-logo-wrapper'), logoWrapper);

  const linksDiv = document.createElement('div');
  linksDiv.classList.add('corp-header-links');

  const linkGroups = block.querySelectorAll('[data-aue-model="headerLinkGroup"]');
  linkGroups.forEach((groupNode) => {
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('corp-header-link-title');
    const titleSpan = document.createElement('span');
    const titleLink = groupNode.querySelector('[data-aue-prop="title"] a');
    if (titleLink) {
      titleSpan.append(titleLink);
      moveInstrumentation(titleLink, titleSpan);
    } else {
      const titleText = groupNode.querySelector('[data-aue-prop="title"]');
      if (titleText) {
        titleSpan.textContent = titleText.textContent;
        moveInstrumentation(titleText, titleSpan);
      }
    }
    titleDiv.append(titleSpan);
    linksDiv.append(titleDiv);
    moveInstrumentation(groupNode.querySelector('.corp-header-link-title'), titleDiv);

    const panelDiv = document.createElement('div');
    panelDiv.classList.add('corp-header-desktop-panel', 'corp-header-panel');
    const groupTitle = groupNode.querySelector('[data-aue-prop="title"]').textContent.toLowerCase().replace(/\s/g, '-');
    panelDiv.classList.add(`corp-header-${groupTitle}`);

    const linkGridBlock = document.createElement('div');
    linkGridBlock.classList.add('corp-header-link-grid', 'corp-header-block');
    const linkContainerSection = document.createElement('div');
    linkContainerSection.classList.add('corp-header-link-container-section');

    const linkColumns = groupNode.querySelectorAll('.corp-header-link-grid-column');
    linkColumns.forEach((columnNode) => {
      const newColumn = document.createElement('div');
      newColumn.classList.add('corp-header-link-grid-column', 'corp-header-link-column-vertical');
      const ul = document.createElement('ul');
      ul.classList.add('corp-header-content', 'corp-header-links-container', 'corp-header-accordian-content');
      const links = columnNode.querySelectorAll('li');
      links.forEach((linkNode) => {
        ul.append(linkNode);
        moveInstrumentation(linkNode, ul);
      });
      newColumn.append(ul);
      linkContainerSection.append(newColumn);
      moveInstrumentation(columnNode, newColumn);
    });
    linkGridBlock.append(linkContainerSection);
    panelDiv.append(linkGridBlock);
    linksDiv.append(panelDiv);
    moveInstrumentation(groupNode.querySelector('.corp-header-desktop-panel'), panelDiv);
  });

  navbar.append(linksDiv);
  moveInstrumentation(block.querySelector('.corp-header-links'), linksDiv);

  const rightDiv = document.createElement('div');
  rightDiv.classList.add('corp-header-right');
  rightDiv.id = 'nav-right';

  const contactWrapper = document.createElement('div');
  contactWrapper.classList.add('corp-header-contact-wrapper');
  const contactDiv = document.createElement('div');
  contactDiv.classList.add('corp-header-contact', 'corp-header-block');

  const contactModel = block.querySelector('[data-aue-model="headerContact"]');
  if (contactModel) {
    const contactWrpArena = document.createElement('div');
    contactWrpArena.classList.add('corp-header-contact_wrp_arena', 'corp-header-user__contact', 'corp-header-header');

    const contactTitle = document.createElement('h4');
    contactTitle.classList.add('corp-header-user__contact-title');
    const authoredTitle = contactModel.querySelector('[data-aue-prop="title"]');
    if (authoredTitle) {
      contactTitle.textContent = authoredTitle.textContent;
      moveInstrumentation(authoredTitle, contactTitle);
    }
    contactWrpArena.append(contactTitle);

    const phoneIconSpan = document.createElement('span');
    phoneIconSpan.classList.add('corp-header-user__contact-title', 'corp-header-icon-phone');
    phoneIconSpan.setAttribute('aria-label', 'Contact Us');
    contactWrpArena.append(phoneIconSpan);

    const contactIconsDiv = document.createElement('div');
    contactIconsDiv.classList.add('corp-header-user__contact__icons', 'corp-header-hidden');

    // Phone link
    const phoneLink = document.createElement('a');
    phoneLink.href = '#';
    phoneLink.classList.add('corp-header-user__contact--icon', 'corp-header-phone');
    phoneLink.onclick = (e) => {
      e.preventDefault();
      phoneLink.closest('.corp-header-contact').querySelector('.corp-header-contact-toggle-box').classList.toggle('corp-header-hidden');
    };
    const phoneSrOnly = document.createElement('span');
    phoneSrOnly.classList.add('corp-header-sr-only');
    phoneSrOnly.textContent = 'phone';
    phoneLink.append(phoneSrOnly);
    const phoneIconImg = contactModel.querySelector('[data-aue-prop="phoneIcon"] img');
    if (phoneIconImg) {
      phoneLink.append(phoneIconImg);
      moveInstrumentation(phoneIconImg, phoneLink);
    }
    contactIconsDiv.append(phoneLink);

    // WhatsApp link
    const whatsappLink = document.createElement('a');
    const authoredWhatsapp = contactModel.querySelector('[data-aue-prop="whatsapp"]');
    if (authoredWhatsapp) {
      whatsappLink.href = authoredWhatsapp.href;
      whatsappLink.target = '_blank';
      whatsappLink.classList.add('corp-header-user__contact--icon', 'corp-header-whatsapp');
      whatsappLink.setAttribute('rel', 'noopener noreferrer');
      const whatsappSrOnly = document.createElement('span');
      whatsappSrOnly.classList.add('corp-header-sr-only');
      whatsappSrOnly.textContent = 'whatsapp';
      whatsappLink.append(whatsappSrOnly);
      const whatsappIconImg = contactModel.querySelector('[data-aue-prop="whatsappIcon"] img');
      if (whatsappIconImg) {
        whatsappLink.append(whatsappIconImg);
        moveInstrumentation(whatsappIconImg, whatsappLink);
      }
      contactIconsDiv.append(whatsappLink);
      moveInstrumentation(authoredWhatsapp, whatsappLink);
    }

    // Email link
    const emailLink = document.createElement('a');
    const authoredEmail = contactModel.querySelector('[data-aue-prop="email"]');
    if (authoredEmail) {
      emailLink.href = `mailto:${authoredEmail.textContent}`;
      emailLink.classList.add('corp-header-user__contact--icon', 'corp-header-email');
      const emailSrOnly = document.createElement('span');
      emailSrOnly.classList.add('corp-header-sr-only');
      emailSrOnly.textContent = 'email';
      emailLink.append(emailSrOnly);
      const emailIconImg = contactModel.querySelector('[data-aue-prop="emailIcon"] img');
      if (emailIconImg) {
        emailLink.append(emailIconImg);
        moveInstrumentation(emailIconImg, emailLink);
      }
      contactIconsDiv.append(emailLink);
      moveInstrumentation(authoredEmail, emailLink);
    }

    contactWrpArena.append(contactIconsDiv);

    const contactToggleBox = document.createElement('div');
    contactToggleBox.classList.add('corp-header-hidden', 'corp-header-contact-toggle-box');
    const contactIconCallContainer = document.createElement('div');
    contactIconCallContainer.classList.add('corp-header-user__contact__icon-call_container');
    const primaryTelephone = document.createElement('a');
    primaryTelephone.classList.add('corp-header-primary-telephone');
    const authoredPhone = contactModel.querySelector('[data-aue-prop="phone"]');
    if (authoredPhone) {
      primaryTelephone.href = `tel:${authoredPhone.textContent}`;
      primaryTelephone.textContent = authoredPhone.textContent;
      moveInstrumentation(authoredPhone, primaryTelephone);
    }
    contactIconCallContainer.append(primaryTelephone);
    contactToggleBox.append(contactIconCallContainer);
    contactWrpArena.append(contactToggleBox);
    contactDiv.append(contactWrpArena);
    contactWrapper.append(contactDiv);
    moveInstrumentation(contactModel, contactWrapper);
  }
  rightDiv.append(contactWrapper);

  const languageDiv = document.createElement('div');
  languageDiv.classList.add('corp-header-language');
  languageDiv.textContent = 'EN';
  rightDiv.append(languageDiv);

  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('corp-header-sign-in-wrapper', 'corp-header-hidden');
  const signInDiv = document.createElement('div');
  signInDiv.classList.add('corp-header-sign-in', 'corp-header-block');
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('corp-header-user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('corp-header-user__account');

  // Authored sign-in links (assuming these are not part of the AUE model directly but exist in the authored HTML)
  const authoredSignInLinks = block.querySelectorAll('.corp-header-sign-in .corp-header-user__account--link');
  authoredSignInLinks.forEach((linkNode) => {
    userAccount.append(linkNode);
    moveInstrumentation(linkNode, userAccount);
  });
  userDropdown.append(userAccount);
  signInDiv.append(userDropdown);
  signInWrapper.append(signInDiv);
  rightDiv.append(signInWrapper);

  navbar.append(rightDiv);

  mainDiv.append(navbar);

  // Car filter menu (if needed, extract from authored HTML)
  const carFilterMenu = block.querySelector('#carFilterMenu');
  if (carFilterMenu) {
    mainDiv.append(carFilterMenu);
    moveInstrumentation(carFilterMenu, mainDiv);
  }

  // Mobile menu (if needed, extract from authored HTML)
  const menu = block.querySelector('#menu');
  if (menu) {
    mainDiv.append(menu);
    moveInstrumentation(menu, mainDiv);
  }

  block.textContent = '';
  block.append(mainDiv);
  block.className = 'corp-header-wrapper corp-header-header-scroll corp-header-header-scroll-threshold corp-header-block corp-header-header-wrapper corp-header-sticky corp-header-show';
  block.dataset.blockStatus = 'loaded';
}
