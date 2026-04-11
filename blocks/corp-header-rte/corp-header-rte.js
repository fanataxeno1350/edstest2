import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function parsePipeIndentTree(rawText) {
  const lines = rawText.split('\n').filter(line => line.trim() !== '');
  const root = { children: [] };
  const stack = [{ node: root, depth: -1 }];
  lines.forEach((line) => {
    const indent = line.match(/^(\s*)/)[1].length;
    const depth = Math.floor(indent / 2);
    const [label = '', href = '', icon = ''] = line.trim().split('|');
    const node = { label: label.trim(), href: href.trim(), icon: icon.trim(), children: [] };
    while (stack.length > 1 && stack[stack.length - 1].depth >= depth) stack.pop();
    stack[stack.length - 1].node.children.push(node);
    stack.push({ node, depth });
  });
  return root.children;
}

function renderNavItems(navItems, parentUl, mobileMenu = false) {
  navItems.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('nav-link');

    const hasChildren = item.children && item.children.length > 0;

    let linkContent;
    if (item.href) {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      if (item.label.toLowerCase() === 'home' || item.label.toLowerCase() === 'service' || item.label.toLowerCase() === 'important customer info') {
        a.classList.add('button');
      }
      if (item.icon) {
        const img = document.createElement('img');
        img.src = item.icon;
        img.alt = item.label;
        a.prepend(img);
      }
      linkContent = a;
    } else {
      const span = document.createElement('span');
      span.textContent = item.label;
      linkContent = span;
    }

    if (hasChildren) {
      if (mobileMenu) {
        li.classList.add('accordion');
        const menuTitle = document.createElement('span');
        menuTitle.classList.add('menu-title');
        menuTitle.append(linkContent);
        li.append(menuTitle);

        const panel = document.createElement('div');
        panel.classList.add('panel');
        const linkContainerSection = document.createElement('div');
        linkContainerSection.classList.add('link-container-section');
        const linkGridColumn = document.createElement('div');
        linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
        const ul = document.createElement('ul');
        ul.classList.add('content', 'links-container', 'accordian-content');
        renderNavItems(item.children, ul, mobileMenu);
        linkGridColumn.append(ul);
        linkContainerSection.append(linkGridColumn);
        panel.append(linkContainerSection);
        li.append(panel);

        menuTitle.addEventListener('click', () => {
          li.classList.toggle('active');
          panel.classList.toggle('show');
        });
      } else {
        const linkTitle = document.createElement('div');
        linkTitle.classList.add('link-title');
        linkTitle.append(linkContent);
        li.append(linkTitle);

        const desktopPanel = document.createElement('div');
        desktopPanel.classList.add('desktop-panel', 'panel', item.label.toLowerCase().replace(/\s/g, '-'));
        const linkGrid = document.createElement('div');
        linkGrid.classList.add('link-grid', 'block');
        const linkContainerSection = document.createElement('div');
        linkContainerSection.classList.add('link-container-section');
        const linkGridColumn = document.createElement('div');
        linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
        const ul = document.createElement('ul');
        ul.classList.add('content', 'links-container', 'accordian-content');
        renderNavItems(item.children, ul, mobileMenu);
        linkGridColumn.append(ul);
        linkContainerSection.append(linkGridColumn);
        linkGrid.append(linkContainerSection);
        desktopPanel.append(linkGrid);
        li.append(desktopPanel);

        linkTitle.addEventListener('mouseenter', () => desktopPanel.classList.add('show'));
        li.addEventListener('mouseleave', () => desktopPanel.classList.remove('show'));
      }
    } else {
      if (mobileMenu) {
        const menuTitle = document.createElement('span');
        menuTitle.classList.add('menu-title');
        menuTitle.append(linkContent);
        li.append(menuTitle);
      } else {
        const linkTitle = document.createElement('div');
        linkTitle.classList.add('link-title');
        linkTitle.append(linkContent);
        li.append(linkTitle);
      }
    }

    parentUl.append(li);
  });
}

export default function decorate(block) {
  // Map rows to their respective content based on BlockJson and EDS structure
  const rows = [...block.children];
  const logoRow = rows.find(row => row.querySelector('picture') && row.textContent.includes('Logo'));
  const engageLogoRow = rows.find(row => row.querySelector('picture') && row.textContent.includes('Engage Logo'));
  const phoneIconRow = rows.find(row => row.querySelector('picture') && row.textContent.includes('Phone Icon'));
  const whatsappIconRow = rows.find(row => row.querySelector('picture') && row.textContent.includes('Whatsapp Icon'));
  const emailIconRow = rows.find(row => row.querySelector('picture') && row.textContent.includes('Email Icon'));
  const reachUsIconRow = rows.find(row => row.querySelector('picture') && row.textContent.includes('Reach Us Icon'));
  const profileIconRow = rows.find(row => row.querySelector('picture') && row.textContent.includes('Profile Icon'));
  const signInIconRow = rows.find(row => row.querySelector('picture') && row.textContent.includes('Sign In Icon'));
  const closeIconRow = rows.find(row => row.querySelector('picture') && row.textContent.includes('Close Icon'));
  const textRow = rows.find(row => row.textContent.includes('Navigation Tree text content'));


  // Main header structure
  const navbarArena = document.createElement('div');
  navbarArena.classList.add('navbar', 'navbar-arena', 'g-container');

  // Nav Hamburger
  const navHamburger = document.createElement('div');
  navHamburger.classList.add('nav-hamburger');
  const hamburgerButton = document.createElement('button');
  hamburgerButton.type = 'button';
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('nav-hamburger-icon');
  hamburgerButton.append(hamburgerIcon);
  navHamburger.append(hamburgerButton);
  navbarArena.append(navHamburger);

  // Logo Wrapper
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block');
  const arenaSpan = document.createElement('span');
  arenaSpan.classList.add('arena');
  const logoPictureLink = document.createElement('a');
  logoPictureLink.classList.add('logo__picture');
  logoPictureLink.href = '/';
  logoPictureLink.setAttribute('data-logo-name', 'Arena');
  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    moveInstrumentation(logoRow.firstElementChild, logoPictureLink);
    logoPictureLink.append(logoPicture);
  }
  arenaSpan.append(logoPictureLink);
  logoBlock.append(arenaSpan);
  logoWrapper.append(logoBlock);
  navbarArena.append(logoWrapper);

  // Parse navigation tree
  const rawHtml = textRow?.querySelector('div')?.innerHTML ?? '';
  const plainText = rawHtml.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
  const navItems = parsePipeIndentTree(plainText);

  // Desktop Navigation Links
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');
  const desktopNavUl = document.createElement('ul');
  renderNavItems(navItems, desktopNavUl);
  [...desktopNavUl.children].forEach(li => linksDiv.append(...li.children)); // Flatten for desktop layout

  // Engage Logo in desktop nav
  const engageLogoLinkTitle = document.createElement('div');
  engageLogoLinkTitle.classList.add('link-title');
  const engageLogoLink = document.createElement('a');
  engageLogoLink.classList.add('logo__picture');
  engageLogoLink.href = 'https://www.marutisuzuki.com/engage/index.html';
  engageLogoLink.setAttribute('data-logo-name', 'Maruti Suzuki');
  const engageLogoPicture = engageLogoRow?.querySelector('picture');
  if (engageLogoPicture) {
    moveInstrumentation(engageLogoRow.firstElementChild, engageLogoLink);
    engageLogoLink.append(engageLogoPicture);
  }
  engageLogoLinkTitle.append(engageLogoLink);
  linksDiv.append(engageLogoLinkTitle);

  navbarArena.append(linksDiv);

  // Right section
  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';

  // Contact Wrapper
  const contactWrapper = document.createElement('div');
  contactWrapper.classList.add('contact-wrapper');
  const contactBlock = document.createElement('div');
  contactBlock.classList.add('contact', 'block');
  const contactWrpArena = document.createElement('div');
  contactWrpArena.classList.add('contact_wrp_arena', 'user__contact', 'header');

  const contactTitle = document.createElement('h4');
  contactTitle.classList.add('user__contact-title');
  contactTitle.textContent = 'Contact Us';
  const contactTitleIcon = document.createElement('span');
  contactTitleIcon.classList.add('user__contact-title', 'icon-phone');
  contactTitleIcon.setAttribute('aria-label', 'Contact Us');

  contactWrpArena.append(contactTitle, contactTitleIcon);

  const contactIconsDiv = document.createElement('div');
  contactIconsDiv.classList.add('user__contact__icons', 'hidden');

  // Phone icon
  const phoneLink = document.createElement('a');
  phoneLink.href = '#';
  phoneLink.classList.add('user__contact--icon', 'phone');
  phoneLink.addEventListener('click', (event) => {
    event.preventDefault();
    contactToggleBox.classList.toggle('hidden');
  });
  const phoneSrOnly = document.createElement('span');
  phoneSrOnly.classList.add('sr-only');
  phoneSrOnly.textContent = 'phone';
  const phoneIconImg = phoneIconRow?.querySelector('img');
  if (phoneIconImg) {
    const optimizedPhonePic = createOptimizedPicture(phoneIconImg.src, phoneIconImg.alt, false, [{ width: 'auto' }]);
    moveInstrumentation(phoneIconImg, optimizedPhonePic.querySelector('img'));
    phoneLink.append(phoneSrOnly, optimizedPhonePic);
  }
  contactIconsDiv.append(phoneLink);

  // Whatsapp icon
  const whatsappLink = document.createElement('a');
  whatsappLink.href = 'https://wa.me/919289311487?text=Hi';
  whatsappLink.target = '_blank';
  whatsappLink.classList.add('user__contact--icon', 'whatsapp');
  whatsappLink.setAttribute('rel', 'noopener noreferrer');
  const whatsappSrOnly = document.createElement('span');
  whatsappSrOnly.classList.add('sr-only');
  whatsappSrOnly.textContent = 'whatsapp';
  const whatsappIconImg = whatsappIconRow?.querySelector('img');
  if (whatsappIconImg) {
    const optimizedWhatsappPic = createOptimizedPicture(whatsappIconImg.src, whatsappIconImg.alt, false, [{ width: 'auto' }]);
    moveInstrumentation(whatsappIconImg, optimizedWhatsappPic.querySelector('img'));
    whatsappLink.append(whatsappSrOnly, optimizedWhatsappPic);
  }
  contactIconsDiv.append(whatsappLink);

  // Email icon
  const emailLink = document.createElement('a');
  emailLink.href = 'mailto:contact@maruti.co.in';
  emailLink.classList.add('user__contact--icon', 'email');
  const emailSrOnly = document.createElement('span');
  emailSrOnly.classList.add('sr-only');
  emailSrOnly.textContent = 'email';
  const emailIconImg = emailIconRow?.querySelector('img');
  if (emailIconImg) {
    const optimizedEmailPic = createOptimizedPicture(emailIconImg.src, emailIconImg.alt, false, [{ width: 'auto' }]);
    moveInstrumentation(emailIconImg, optimizedEmailPic.querySelector('img'));
    emailLink.append(emailSrOnly, optimizedEmailPic);
  }
  contactIconsDiv.append(emailLink);

  contactWrpArena.append(contactIconsDiv);

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const callContainer = document.createElement('div');
  callContainer.classList.add('user__contact__icon-call_container');
  const primaryPhone = document.createElement('a');
  primaryPhone.href = 'tel:1800 102 1800';
  primaryPhone.classList.add('primary-telephone');
  primaryPhone.textContent = '1800 102 1800';
  const secondaryPhone = document.createElement('a');
  secondaryPhone.href = 'tel:';
  secondaryPhone.classList.add('secondary-telephone');
  contactToggleBox.append(callContainer);
  callContainer.append(primaryPhone, secondaryPhone);
  contactWrpArena.append(contactToggleBox);

  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  // Add event listener for contact title to toggle contact icons
  contactTitle.addEventListener('click', () => {
    contactIconsDiv.classList.toggle('hidden');
  });
  contactTitleIcon.addEventListener('click', () => {
    contactIconsDiv.classList.toggle('hidden');
  });

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = 'EN';
  rightDiv.append(languageDiv);

  // Sign-in wrapper
  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden');
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  // Reach Us link
  const reachUsLink = document.createElement('a');
  reachUsLink.href = 'https://www.marutisuzuki.com/corporate/reach-us';
  reachUsLink.classList.add('user__account--link', 'reach', 'us');
  reachUsLink.target = '_self';
  const reachUsIconSpan = document.createElement('span');
  reachUsIconSpan.classList.add('user__account__list-icon');
  const reachUsIconImg = reachUsIconRow?.querySelector('img');
  if (reachUsIconImg) {
    const optimizedReachUsPic = createOptimizedPicture(reachUsIconImg.src, reachUsIconImg.alt, false, [{ width: 'auto' }]);
    moveInstrumentation(reachUsIconImg, optimizedReachUsPic.querySelector('img'));
    reachUsIconSpan.append(optimizedReachUsPic);
  }
  reachUsLink.append(reachUsIconSpan, 'Reach Us');
  userAccount.append(reachUsLink);

  // Profile link
  const profileLink = document.createElement('a');
  profileLink.href = 'https://www.marutisuzuki.com/user';
  profileLink.classList.add('user__account--link', 'profile');
  profileLink.target = '_self';
  const profileIconSpan = document.createElement('span');
  profileIconSpan.classList.add('user__account__list-icon');
  const profileIconImg = profileIconRow?.querySelector('img');
  if (profileIconImg) {
    const optimizedProfilePic = createOptimizedPicture(profileIconImg.src, profileIconImg.alt, false, [{ width: 'auto' }]);
    moveInstrumentation(profileIconImg, optimizedProfilePic.querySelector('img'));
    profileIconSpan.append(optimizedProfilePic);
  }
  profileLink.append(profileIconSpan, 'Profile');
  userAccount.append(profileLink);

  // Sign In button
  const signInBtnDiv = document.createElement('div');
  signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
  const signInIconSpan = document.createElement('span');
  signInIconSpan.classList.add('user__account__list-icon');
  const signInIconImg = signInIconRow?.querySelector('img');
  if (signInIconImg) {
    const optimizedSignInPic = createOptimizedPicture(signInIconImg.src, signInIconImg.alt, false, [{ width: 'auto' }]);
    moveInstrumentation(signInIconImg, optimizedSignInPic.querySelector('img'));
    signInIconSpan.append(optimizedSignInPic);
  }
  const signInButton = document.createElement('button');
  signInButton.type = 'button';
  signInButton.setAttribute('data-sign-out-text', 'Sign Out');
  signInButton.textContent = 'Sign In';
  signInBtnDiv.append(signInIconSpan, signInButton);
  userAccount.append(signInBtnDiv);

  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightDiv.append(signInWrapper);

  navbarArena.append(rightDiv);

  // Mobile Menu
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
  const closeIconSpan = document.createElement('span');
  closeIconSpan.classList.add('close-icon');
  menuHeader.append(backArrow, menuTitle, closeIconSpan);
  mobileMenu.append(menuHeader);

  const mobileMenuUl = document.createElement('ul');
  mobileMenuUl.classList.add('menu-list');
  renderNavItems(navItems, mobileMenuUl, true);

  // Append Reach Us, Profile, Sign In to mobile menu
  const mobileReachUsLi = document.createElement('li');
  const mobileReachUsLink = document.createElement('a');
  mobileReachUsLink.href = 'https://www.marutisuzuki.com/corporate/reach-us';
  mobileReachUsLink.classList.add('user__account--link', 'reach', 'us');
  mobileReachUsLink.target = '_self';
  const mobileReachUsIconSpan = document.createElement('span');
  mobileReachUsIconSpan.classList.add('user__account__list-icon');
  if (reachUsIconRow?.querySelector('img')) {
    const optimizedMobileReachUsPic = createOptimizedPicture(reachUsIconRow.querySelector('img').src, reachUsIconRow.querySelector('img').alt, false, [{ width: 'auto' }]);
    mobileReachUsIconSpan.append(optimizedMobileReachUsPic);
  }
  mobileReachUsLink.append(mobileReachUsIconSpan, 'Reach Us');
  mobileReachUsLi.append(mobileReachUsLink);
  mobileMenuUl.append(mobileReachUsLi);

  const mobileProfileLi = document.createElement('li');
  const mobileProfileLink = document.createElement('a');
  mobileProfileLink.href = 'https://www.marutisuzuki.com/user';
  mobileProfileLink.classList.add('user__account--link', 'profile');
  mobileProfileLink.target = '_self';
  const mobileProfileIconSpan = document.createElement('span');
  mobileProfileIconSpan.classList.add('user__account__list-icon');
  if (profileIconRow?.querySelector('img')) {
    const optimizedMobileProfilePic = createOptimizedPicture(profileIconRow.querySelector('img').src, profileIconRow.querySelector('img').alt, false, [{ width: 'auto' }]);
    mobileProfileIconSpan.append(optimizedMobileProfilePic);
  }
  mobileProfileLink.append(mobileProfileIconSpan, 'Profile');
  mobileProfileLi.append(mobileProfileLink);
  mobileMenuUl.append(mobileProfileLi);

  const mobileSignInLi = document.createElement('li');
  const mobileSignInDiv = document.createElement('div');
  mobileSignInDiv.classList.add('user__account--link', 'sign-in-btn');
  const mobileSignInIconSpan = document.createElement('span');
  mobileSignInIconSpan.classList.add('user__account__list-icon');
  if (signInIconRow?.querySelector('img')) {
    const optimizedMobileSignInPic = createOptimizedPicture(signInIconRow.querySelector('img').src, signInIconRow.querySelector('img').alt, false, [{ width: 'auto' }]);
    mobileSignInIconSpan.append(optimizedMobileSignInPic);
  }
  const mobileSignInButton = document.createElement('button');
  mobileSignInButton.type = 'button';
  mobileSignInButton.setAttribute('data-sign-out-text', 'Sign Out');
  mobileSignInButton.textContent = 'Sign In';
  mobileSignInDiv.append(mobileSignInIconSpan, mobileSignInButton);
  mobileSignInLi.append(mobileSignInDiv);
  mobileMenuUl.append(mobileSignInLi);

  mobileMenu.append(mobileMenuUl);

  // Event listeners for mobile menu
  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    document.body.classList.toggle('no-scroll');
  });

  closeIconSpan.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  });

  backArrow.addEventListener('click', () => {
    // Implement back functionality for nested mobile menu if needed
    // For now, it might just close the menu or navigate up one level
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  });

  block.textContent = '';
  block.append(navbarArena, mobileMenu);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
