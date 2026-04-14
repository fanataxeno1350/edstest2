import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('navbar', 'navbar-arena', 'g-container');

  // Hamburger menu
  const navHamburger = document.createElement('div');
  navHamburger.classList.add('nav-hamburger');
  const hamburgerButton = document.createElement('button');
  hamburgerButton.setAttribute('type', 'button');
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('nav-hamburger-icon');
  hamburgerButton.append(hamburgerIcon);
  navHamburger.append(hamburgerButton);
  headerWrapper.append(navHamburger);

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block');
  moveInstrumentation(children[0], logoBlock);

  const logoSpan = document.createElement('span');
  logoSpan.classList.add('arena');

  const logoLinkWrapper = document.createElement('a');
  logoLinkWrapper.classList.add('logo__picture');
  moveInstrumentation(children[1], logoLinkWrapper);
  const logoLink = children[1].querySelector('a');
  if (logoLink) {
    logoLinkWrapper.href = logoLink.href;
  }

  const logoPicture = children[0].querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLinkWrapper.append(optimizedPic);
  } else {
    // Fallback if no picture, just append content of logo cell
    while (children[0].firstChild) logoLinkWrapper.append(children[0].firstChild);
  }

  logoSpan.append(logoLinkWrapper);
  logoBlock.append(logoSpan);
  logoWrapper.append(logoBlock);
  headerWrapper.append(logoWrapper);

  // Navigation and Contact/Sign-in links
  const linksContainer = document.createElement('div');
  linksContainer.classList.add('links');

  const rightContainer = document.createElement('div');
  rightContainer.classList.add('right');
  rightContainer.id = 'nav-right';

  const contactWrapper = document.createElement('div');
  contactWrapper.classList.add('contact-wrapper');
  const contactBlock = document.createElement('div');
  contactBlock.classList.add('contact', 'block');
  contactWrapper.append(contactBlock);

  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden');
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  signInWrapper.append(signInBlock);

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');

  let navigationMenuIndex = 0;
  let contactLinksIndex = 0;
  let signInLinksIndex = 0;

  children.slice(2).forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 3 && cells[0].textContent && cells[1].querySelector('a') && cells[2].querySelector('ul')) {
      // Navigation Item (label, link, hierarchy-tree)
      const labelCell = cells[0];
      const linkCell = cells[1];
      const hierarchyCell = cells[2];

      const li = document.createElement('li');
      li.classList.add('accordion', 'nav-link');
      li.id = `menu-item-${navigationMenuIndex}`;
      navigationMenuIndex += 1;

      const menuTitleSpan = document.createElement('span');
      menuTitleSpan.classList.add('menu-title');

      const link = linkCell.querySelector('a');
      if (link) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        newLink.textContent = labelCell.textContent;
        newLink.classList.add('button'); // Assuming button class for menu links based on original HTML
        moveInstrumentation(linkCell, newLink);
        menuTitleSpan.append(newLink);
        li.classList.add(labelCell.textContent.toLowerCase().replace(/\s/g, '-')); // Add class based on label
      } else {
        menuTitleSpan.textContent = labelCell.textContent;
        li.classList.add(labelCell.textContent.toLowerCase().replace(/\s/g, '-')); // Add class based on label
      }
      moveInstrumentation(labelCell, menuTitleSpan);
      li.append(menuTitleSpan);

      const panelDiv = document.createElement('div');
      panelDiv.classList.add('panel');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

      const hierarchyHtml = hierarchyCell.innerHTML;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyHtml;

      tempDiv.querySelectorAll('a').forEach((aLink) => {
        aLink.classList.add('nav-link');
      });
      tempDiv.querySelectorAll('ul').forEach((ulEl) => {
        ulEl.classList.add('content', 'links-container', 'accordian-content');
      });

      moveInstrumentation(hierarchyCell, tempDiv);
      while (tempDiv.firstChild) {
        linkGridColumn.append(tempDiv.firstChild);
      }

      linkContainerSection.append(linkGridColumn);
      panelDiv.append(linkContainerSection);

      // Append to desktop navigation
      const desktopLinkTitle = document.createElement('div');
      desktopLinkTitle.classList.add('link-title');
      if (link) {
        const desktopLink = document.createElement('a');
        desktopLink.href = link.href;
        desktopLink.textContent = labelCell.textContent;
        desktopLink.classList.add('button');
        moveInstrumentation(linkCell, desktopLink);
        desktopLinkTitle.append(desktopLink);
      } else {
        desktopLinkTitle.textContent = labelCell.textContent;
      }
      moveInstrumentation(labelCell, desktopLinkTitle);
      linksContainer.append(desktopLinkTitle);

      const desktopPanel = document.createElement('div');
      desktopPanel.classList.add('desktop-panel', 'panel', labelCell.textContent.toLowerCase().replace(/\s/g, '-'));
      const desktopLinkGrid = document.createElement('div');
      desktopLinkGrid.classList.add('link-grid', 'block');
      desktopLinkGrid.append(linkContainerSection.cloneNode(true)); // Clone for desktop
      desktopPanel.append(desktopLinkGrid);
      linksContainer.append(desktopPanel);

      menuList.append(li, panelDiv);

      // Add event listener for accordion behavior
      li.addEventListener('click', () => {
        li.classList.toggle('active');
        panelDiv.classList.toggle('hidden');
      });

    } else if (cells.length === 3 && cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].querySelector('ul')) {
      // Contact Link Item (icon, link, hierarchy-tree)
      const iconCell = cells[0];
      const linkCell = cells[1];
      const hierarchyCell = cells[2];

      const contactWrpArena = document.createElement('div');
      contactWrpArena.classList.add('contact_wrp_arena', 'user__contact', 'header');
      moveInstrumentation(row, contactWrpArena);

      if (contactLinksIndex === 0) { // Only add title once
        const contactTitle = document.createElement('h4');
        contactTitle.classList.add('user__contact-title');
        contactTitle.textContent = 'Contact Us';
        const contactIconPhone = document.createElement('span');
        contactIconPhone.classList.add('user__contact-title', 'icon-phone');
        contactIconPhone.setAttribute('aria-label', 'Contact Us');
        contactWrpArena.append(contactTitle, contactIconPhone);
      }

      const contactIconsDiv = document.createElement('div');
      contactIconsDiv.classList.add('user__contact__icons', 'hidden');

      const contactLink = document.createElement('a');
      contactLink.classList.add('user__contact--icon');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        contactLink.href = foundLink.href;
        if (foundLink.href.includes('whatsapp')) {
          contactLink.classList.add('whatsapp');
          contactLink.setAttribute('target', '_blank');
          contactLink.setAttribute('rel', 'noopener noreferrer');
        } else if (foundLink.href.startsWith('tel:')) {
          contactLink.classList.add('phone');
          contactLink.addEventListener('click', (e) => {
            e.preventDefault();
            contactBlock.querySelector('.contact-toggle-box').classList.toggle('hidden');
          });
        } else if (foundLink.href.startsWith('mailto:')) {
          contactLink.classList.add('email');
        }
      }
      moveInstrumentation(linkCell, contactLink);

      const srOnlySpan = document.createElement('span');
      srOnlySpan.classList.add('sr-only');
      srOnlySpan.textContent = contactLink.classList.contains('phone') ? 'phone' : (contactLink.classList.contains('whatsapp') ? 'whatsapp' : 'email');
      contactLink.append(srOnlySpan);

      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt;
        newImg.setAttribute('loading', 'lazy');
        moveInstrumentation(img, newImg);
        contactLink.append(newImg);
      }
      contactIconsDiv.append(contactLink);
      contactWrpArena.append(contactIconsDiv);

      const contactToggleBox = contactBlock.querySelector('.contact-toggle-box') || document.createElement('div');
      if (!contactBlock.querySelector('.contact-toggle-box')) {
        contactToggleBox.classList.add('hidden', 'contact-toggle-box');
        const callContainer = document.createElement('div');
        callContainer.classList.add('user__contact__icon-call_container');
        contactToggleBox.append(callContainer);
        contactWrpArena.append(contactToggleBox);
      }
      const callContainer = contactToggleBox.querySelector('.user__contact__icon-call_container');
      if (contactLink.classList.contains('phone') && foundLink) {
        const primaryTel = document.createElement('a');
        primaryTel.classList.add('primary-telephone');
        primaryTel.href = foundLink.href;
        primaryTel.textContent = foundLink.textContent;
        callContainer.append(primaryTel);
      }

      contactBlock.append(contactWrpArena);
      contactLinksIndex += 1;

    } else if (cells.length === 4 && cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].textContent && cells[3].querySelector('ul')) {
      // Sign In Link Item (icon, link, label, hierarchy-tree)
      const iconCell = cells[0];
      const linkCell = cells[1];
      const labelCell = cells[2];
      const hierarchyCell = cells[3]; // Not directly used in original HTML for sign-in, but present in model

      if (signInLinksIndex === 0) {
        const userDropdown = document.createElement('div');
        userDropdown.classList.add('user__dropdown');
        const userAccount = document.createElement('div');
        userAccount.classList.add('user__account');
        userDropdown.append(userAccount);
        signInBlock.append(userDropdown);
      }
      const userAccount = signInBlock.querySelector('.user__account');

      const userAccountLink = document.createElement('a');
      userAccountLink.classList.add('user__account--link');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        userAccountLink.href = foundLink.href;
      }
      userAccountLink.setAttribute('target', '_self');
      userAccountLink.classList.add(labelCell.textContent.toLowerCase().replace(/\s/g, '-'));
      moveInstrumentation(linkCell, userAccountLink);

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('user__account__list-icon');
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt;
        newImg.setAttribute('loading', 'lazy');
        moveInstrumentation(img, newImg);
        iconSpan.append(newImg);
      }
      userAccountLink.append(iconSpan);
      userAccountLink.append(labelCell.textContent);
      moveInstrumentation(labelCell, userAccountLink);

      userAccount.append(userAccountLink);

      // For "Sign In" button specifically
      if (labelCell.textContent.toLowerCase() === 'sign in') {
        const signInBtnDiv = document.createElement('div');
        signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
        const signInBtnSpan = document.createElement('span');
        signInBtnSpan.classList.add('user__account__list-icon');
        if (iconPicture) {
          const img = iconPicture.querySelector('img');
          const newImg = document.createElement('img');
          newImg.src = img.src;
          newImg.alt = img.alt;
          newImg.setAttribute('loading', 'lazy');
          moveInstrumentation(img, newImg);
          signInBtnSpan.append(newImg);
        }
        const signInButton = document.createElement('button');
        signInButton.setAttribute('type', 'button');
        signInButton.setAttribute('data-sign-out-text', 'Sign Out');
        signInButton.textContent = 'Sign In';
        signInBtnDiv.append(signInBtnSpan, signInButton);
        userAccount.append(signInBtnDiv);
      }

      signInLinksIndex += 1;

      // Append to mobile menu list as well
      const li = document.createElement('li');
      moveInstrumentation(row, li);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = row.innerHTML;
      while (tempDiv.firstChild) {
        li.append(tempDiv.firstChild);
      }
      li.classList.add('user__account--link', labelCell.textContent.toLowerCase().replace(/\s/g, '-'));
      menuList.append(li);
    }
  });

  // Language
  const languageRow = children[2];
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = languageRow.textContent.trim();
  moveInstrumentation(languageRow, languageDiv);

  rightContainer.append(contactWrapper, languageDiv, signInWrapper);
  headerWrapper.append(linksContainer, rightContainer);

  // Mobile Menu structure
  const mobileMenu = document.createElement('div');
  mobileMenu.id = 'menu';
  mobileMenu.classList.add('menu', 'hidden', 'menu-arena');

  const menuHeader = document.createElement('div');
  menuHeader.classList.add('menu-header');
  const backArrow = document.createElement('div');
  backArrow.classList.add('back-arrow');
  const menuTitle = document.createElement('span');
  menuTitle.classList.add('menu-title');
  menuTitle.textContent = 'Menu';
  const closeIcon = document.createElement('span');
  closeIcon.classList.add('close-icon');
  menuHeader.append(backArrow, menuTitle, closeIcon);
  mobileMenu.append(menuHeader, menuList);

  block.textContent = '';
  block.append(headerWrapper, mobileMenu);

  // Event listeners for mobile menu toggle
  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    block.closest('.corp-header-wrapper').classList.toggle('menu-open');
  });

  closeIcon.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    block.closest('.corp-header-wrapper').classList.remove('menu-open');
  });

  // Optimize pictures
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
