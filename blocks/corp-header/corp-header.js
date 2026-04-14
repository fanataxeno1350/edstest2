import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, languageRow, ...itemRows] = [...block.children];

  // Create the main header structure
  const navbarArena = document.createElement('div');
  navbarArena.classList.add('navbar', 'navbar-arena', 'g-container');

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
  navbarArena.append(navHamburger);

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block');
  moveInstrumentation(logoRow, logoBlock);

  const logoSpan = document.createElement('span');
  logoSpan.classList.add('arena');

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  const logoHref = logoLinkRow.querySelector('a')?.href || '/';
  logoLink.href = logoHref;
  logoLink.setAttribute('data-logo-name', 'Arena'); // From original HTML

  const picture = logoRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  logoSpan.append(logoLink);
  logoBlock.append(logoSpan);
  logoWrapper.append(logoBlock);
  navbarArena.append(logoWrapper);

  // Navigation Links
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');

  const navigationItems = itemRows.filter((row) => row.children.length === 3 && row.children[2].querySelector('ul'));
  const contactLinkItems = itemRows.filter((row) => row.children.length === 3 && row.children[0].querySelector('picture'));
  const signInLinkItems = itemRows.filter((row) => row.children.length === 4);

  navigationItems.forEach((row) => {
    const labelCell = row.children[0];
    const linkCell = row.children[1];
    const hierarchyCell = row.children[2];

    const linkTitle = document.createElement('div');
    linkTitle.classList.add('link-title');
    const span = document.createElement('span');
    const link = document.createElement('a');
    moveInstrumentation(linkCell, link);
    link.href = linkCell.querySelector('a')?.href || '#';
    link.textContent = labelCell.textContent;
    link.classList.add('button'); // From original HTML

    span.append(link);
    linkTitle.append(span);

    if (hierarchyCell.querySelector('ul')) {
      const desktopPanel = document.createElement('div');
      desktopPanel.classList.add('desktop-panel', 'panel');
      desktopPanel.classList.add(labelCell.textContent.toLowerCase().replace(/\s/g, '-')); // Dynamic class from label

      const linkGrid = document.createElement('div');
      linkGrid.classList.add('link-grid', 'block');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv);

      tempDiv.querySelectorAll('a').forEach((navLink) => {
        navLink.classList.add('nav-link');
      });
      tempDiv.querySelectorAll('ul').forEach((ul) => {
        ul.classList.add('content', 'links-container', 'accordian-content');
      });

      while (tempDiv.firstChild) {
        linkGridColumn.append(tempDiv.firstChild);
      }
      linkContainerSection.append(linkGridColumn);
      linkGrid.append(linkContainerSection);
      desktopPanel.append(linkGrid);
      linksDiv.append(desktopPanel);

      // Add event listener for desktop panel toggle
      linkTitle.addEventListener('click', () => {
        desktopPanel.classList.toggle('show');
      });
    }
    linksDiv.append(linkTitle);
  });

  navbarArena.append(linksDiv);

  // Right section (Contact, Language, Sign-in)
  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';

  // Contact links
  const contactWrapper = document.createElement('div');
  contactWrapper.classList.add('contact-wrapper');
  const contactBlock = document.createElement('div');
  contactBlock.classList.add('contact', 'block');
  const contactWrpArena = document.createElement('div');
  contactWrpArena.classList.add('contact_wrp_arena', 'user__contact', 'header');

  const contactTitle = document.createElement('h4');
  contactTitle.classList.add('user__contact-title');
  contactTitle.textContent = 'Contact Us';
  const contactIconPhone = document.createElement('span');
  contactIconPhone.classList.add('user__contact-title', 'icon-phone');
  contactIconPhone.setAttribute('aria-label', 'Contact Us');
  contactWrpArena.append(contactTitle, contactIconPhone);

  const contactIconsDiv = document.createElement('div');
  contactIconsDiv.classList.add('user__contact__icons', 'hidden');

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const contactCallContainer = document.createElement('div');
  contactCallContainer.classList.add('user__contact__icon-call_container');
  contactToggleBox.append(contactCallContainer);

  contactLinkItems.forEach((row) => {
    const iconCell = row.children[0];
    const linkCell = row.children[1];
    const hierarchyCell = row.children[2]; // Not used in this section based on original HTML

    const iconLink = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      iconLink.href = foundLink.href;
      iconLink.target = foundLink.target;
      iconLink.rel = foundLink.rel;
    }
    iconLink.classList.add('user__contact--icon');

    const srOnlySpan = document.createElement('span');
    srOnlySpan.classList.add('sr-only');

    const iconImg = iconCell.querySelector('picture > img');
    if (iconImg) {
      const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '40' }]);
      moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
      iconLink.append(optimizedPic);
      srOnlySpan.textContent = iconImg.alt;
      iconLink.classList.add(iconImg.alt.toLowerCase()); // e.g., 'phone', 'whatsapp', 'email'
    }
    iconLink.prepend(srOnlySpan);
    contactIconsDiv.append(iconLink);

    // Add event listener for contact toggle
    if (iconLink.classList.contains('phone')) {
      iconLink.addEventListener('click', (e) => {
        e.preventDefault();
        contactToggleBox.classList.toggle('hidden');
      });
      // Assuming the phone number is the text content of the link cell if it's a direct link
      const phoneNumber = foundLink ? foundLink.textContent : '1800 102 1800';
      const primaryTelephone = document.createElement('a');
      primaryTelephone.classList.add('primary-telephone');
      primaryTelephone.href = `tel:${phoneNumber}`;
      primaryTelephone.textContent = phoneNumber;
      contactCallContainer.append(primaryTelephone);
    }
  });

  contactWrpArena.append(contactIconsDiv, contactToggleBox);
  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  moveInstrumentation(languageRow, languageDiv);
  languageDiv.textContent = languageRow.textContent.trim();
  rightDiv.append(languageDiv);

  // Sign-in links
  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden'); // Hidden by default as per original HTML
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  signInLinkItems.forEach((row) => {
    const iconCell = row.children[0];
    const linkCell = row.children[1];
    const labelCell = row.children[2];
    const hierarchyCell = row.children[3]; // Not used in this section based on original HTML

    const accountLink = document.createElement('a');
    accountLink.classList.add('user__account--link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      accountLink.href = foundLink.href;
      accountLink.target = foundLink.target;
    }
    accountLink.classList.add(labelCell.textContent.toLowerCase().replace(/\s/g, '-')); // Dynamic class from label

    const accountIconSpan = document.createElement('span');
    accountIconSpan.classList.add('user__account__list-icon');
    const iconImg = iconCell.querySelector('picture > img');
    if (iconImg) {
      const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '40' }]);
      moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
      accountIconSpan.append(optimizedPic);
    }
    accountLink.append(accountIconSpan, labelCell.textContent);
    userAccount.append(accountLink);
  });

  // Sign In button (if present in original HTML)
  const signInBtnDiv = document.createElement('div');
  signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
  const signInBtnIconSpan = document.createElement('span');
  signInBtnIconSpan.classList.add('user__account__list-icon');
  // Assuming a generic sign-in icon if not explicitly provided in model
  const signInIcon = document.createElement('img');
  signInIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1776063821632.svg+xml'; // From original HTML
  signInIcon.loading = 'lazy';
  signInIcon.alt = 'Sign-in';
  signInBtnIconSpan.append(signInIcon);

  const signInButton = document.createElement('button');
  signInButton.setAttribute('type', 'button');
  signInButton.setAttribute('data-sign-out-text', 'Sign Out');
  signInButton.textContent = 'Sign In';
  signInBtnDiv.append(signInBtnIconSpan, signInButton);
  userAccount.append(signInBtnDiv);

  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightDiv.append(signInWrapper);

  navbarArena.append(rightDiv);

  // Mobile menu (hidden by default)
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
  mobileMenu.append(menuHeader);

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');

  navigationItems.forEach((row, index) => {
    const labelCell = row.children[0];
    const linkCell = row.children[1];
    const hierarchyCell = row.children[2];

    const li = document.createElement('li');
    li.id = `menu-item-${index}`;
    li.classList.add('nav-link');

    const menuTitleSpan = document.createElement('span');
    menuTitleSpan.classList.add('menu-title');

    const link = document.createElement('a');
    moveInstrumentation(linkCell, link);
    link.href = linkCell.querySelector('a')?.href || '#';
    link.textContent = labelCell.textContent;
    link.classList.add('button'); // From original HTML

    menuTitleSpan.append(link);
    li.append(menuTitleSpan);

    if (hierarchyCell.querySelector('ul')) {
      li.classList.add('accordion'); // Add accordion class for expandable items
      const panel = document.createElement('div');
      panel.classList.add('panel');

      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv);

      tempDiv.querySelectorAll('a').forEach((navLink) => {
        navLink.classList.add('nav-link');
      });
      tempDiv.querySelectorAll('ul').forEach((ul) => {
        ul.classList.add('content', 'links-container', 'accordian-content');
      });

      while (tempDiv.firstChild) {
        linkGridColumn.append(tempDiv.firstChild);
      }
      linkContainerSection.append(linkGridColumn);
      panel.append(linkContainerSection);
      mobileMenu.append(panel);

      // Add event listener for mobile menu accordion
      li.addEventListener('click', () => {
        li.classList.toggle('active');
        panel.classList.toggle('show');
      });
    }
    menuList.append(li);
  });

  // Append sign-in links to mobile menu as well
  signInLinkItems.forEach((row) => {
    const iconCell = row.children[0];
    const linkCell = row.children[1];
    const labelCell = row.children[2];

    const li = document.createElement('li');
    const accountLink = document.createElement('a');
    accountLink.classList.add('user__account--link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      accountLink.href = foundLink.href;
      accountLink.target = foundLink.target;
    }
    accountLink.classList.add(labelCell.textContent.toLowerCase().replace(/\s/g, '-'));

    const accountIconSpan = document.createElement('span');
    accountIconSpan.classList.add('user__account__list-icon');
    const iconImg = iconCell.querySelector('picture > img');
    if (iconImg) {
      const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '40' }]);
      moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
      accountIconSpan.append(optimizedPic);
    }
    accountLink.append(accountIconSpan, labelCell.textContent);
    li.append(accountLink);
    menuList.append(li);
  });

  // Sign In button for mobile menu
  const mobileSignInLi = document.createElement('li');
  const mobileSignInBtnDiv = document.createElement('div');
  mobileSignInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
  const mobileSignInBtnIconSpan = document.createElement('span');
  mobileSignInBtnIconSpan.classList.add('user__account__list-icon');
  const mobileSignInIcon = document.createElement('img');
  mobileSignInIcon.src = '/content/dam/aemigrate/uploaded-folder/image/1776063821632.svg+xml';
  mobileSignInIcon.loading = 'lazy';
  mobileSignInIcon.alt = 'Sign-in';
  mobileSignInBtnIconSpan.append(mobileSignInIcon);
  const mobileSignInButton = document.createElement('button');
  mobileSignInButton.setAttribute('type', 'button');
  mobileSignInButton.setAttribute('data-sign-out-text', 'Sign Out');
  mobileSignInButton.textContent = 'Sign In';
  mobileSignInBtnDiv.append(mobileSignInBtnIconSpan, mobileSignInButton);
  mobileSignInLi.append(mobileSignInBtnDiv);
  menuList.append(mobileSignInLi);


  mobileMenu.append(menuList);

  // Event listeners for mobile menu toggle
  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    hamburgerButton.classList.toggle('active');
  });

  closeIcon.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    hamburgerButton.classList.remove('active');
  });

  block.textContent = '';
  block.append(navbarArena, mobileMenu);

  // Optimize all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
