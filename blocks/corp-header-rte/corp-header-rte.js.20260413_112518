import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    engageLogoRow,
    engageLogoLinkRow,
    languageRow,
    textRow,
    ...itemRows
  ] = [...block.children];

  // Use content detection instead of index access for item rows
  const contactLinkItems = itemRows.filter((row) => row.children.length === 2);
  const userAccountLinkItems = itemRows.filter((row) => row.children.length === 3);

  block.textContent = '';
  block.classList.add('corp-header', 'block');

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

  // Logo Wrapper
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block');
  const logoSpan = document.createElement('span');
  logoSpan.classList.add('arena');

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  logoLink.setAttribute('data-logo-name', 'Arena');

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    moveInstrumentation(logoRow.firstElementChild, logoLink);
    logoLink.append(logoPicture);
  }
  logoSpan.append(logoLink);
  logoBlock.append(logoSpan);
  logoWrapper.append(logoBlock);
  navbarArena.append(logoWrapper);

  // Navigation Links
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');

  function parseNavTree(ul) {
    return [...ul.querySelectorAll(':scope > li')].map((li) => {
      const label = li.querySelector(':scope > p')?.textContent?.trim() ?? '';
      const childUl = li.querySelector(':scope > ul');
      return { label, children: childUl ? parseNavTree(childUl) : [] };
    });
  }

  const textCell = textRow?.querySelector('div');
  const temp = document.createElement('div');
  temp.innerHTML = textCell?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  const navItems = rootUl ? parseNavTree(rootUl) : [];

  function createNavItem(item, isDesktop = true) {
    const linkTitle = document.createElement('div');
    linkTitle.classList.add('link-title');
    const span = document.createElement('span');

    const link = document.createElement('a');
    link.textContent = item.label;
    if (item.label.toLowerCase() === 'home' || item.label.toLowerCase() === 'service' || item.label.toLowerCase() === 'important customer info') {
      link.classList.add('button');
      link.href = '#'; // Placeholder, actual href should be from model if available
    }

    span.append(link);
    linkTitle.append(span);

    if (item.children && item.children.length > 0) {
      if (isDesktop) {
        const desktopPanel = document.createElement('div');
        desktopPanel.classList.add('desktop-panel', 'panel', item.label.toLowerCase().replace(/\s/g, '-'));
        const linkGrid = document.createElement('div');
        linkGrid.classList.add('link-grid', 'block');
        const linkContainerSection = document.createElement('div');
        linkContainerSection.classList.add('link-container-section');
        const linkGridColumn = document.createElement('div');
        linkGridColumn.classList.add('link-grid-column', 'link-column-vertical'); // Assuming vertical for desktop

        const ul = document.createElement('ul');
        ul.classList.add('content', 'links-container', 'accordian-content');
        item.children.forEach((child) => {
          const li = document.createElement('li');
          const childLink = document.createElement('a');
          childLink.textContent = child.label;
          childLink.href = '#'; // Placeholder
          li.append(childLink);
          ul.append(li);
        });
        linkGridColumn.append(ul);
        linkContainerSection.append(linkGridColumn);
        linkGrid.append(linkContainerSection);
        desktopPanel.append(linkGrid);
        linksDiv.append(desktopPanel);
      }
    }
    return linkTitle;
  }

  navItems.forEach((item) => {
    linksDiv.append(createNavItem(item, true));
  });

  // Engage Logo
  const engageLinkTitle = document.createElement('div');
  engageLinkTitle.classList.add('link-title');
  const engageSpan = document.createElement('span');
  const engageLink = document.createElement('a');
  engageLink.classList.add('logo__picture');
  const foundEngageLink = engageLogoLinkRow.querySelector('a');
  if (foundEngageLink) {
    engageLink.href = foundEngageLink.href;
  }
  engageLink.setAttribute('data-logo-name', 'Maruti Suzuki');
  const engagePicture = engageLogoRow.querySelector('picture');
  if (engagePicture) {
    moveInstrumentation(engageLogoRow.firstElementChild, engageLink);
    engageLink.append(engagePicture);
  }
  engageSpan.append(engageLink);
  engageLinkTitle.append(engageSpan);
  linksDiv.append(engageLinkTitle);

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
  const contactIconPhone = document.createElement('span');
  contactIconPhone.classList.add('user__contact-title', 'icon-phone');
  contactIconPhone.setAttribute('aria-label', 'Contact Us');
  contactWrpArena.append(contactTitle, contactIconPhone);

  const contactIconsDiv = document.createElement('div');
  contactIconsDiv.classList.add('user__contact__icons', 'hidden');

  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const contactLink = document.createElement('a');
    contactLink.classList.add('user__contact--icon');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      contactLink.href = foundLink.href;
    }
    const srOnlySpan = document.createElement('span');
    srOnlySpan.classList.add('sr-only');
    const iconImg = iconCell.querySelector('img');
    if (iconImg) {
      const clonedImg = iconImg.cloneNode(true);
      contactLink.append(srOnlySpan, clonedImg);
    }

    if (foundLink && foundLink.href.startsWith('tel:')) {
      contactLink.classList.add('phone');
      srOnlySpan.textContent = 'phone';
      // Original HTML has an onclick for this specific link, replicate that behavior
      contactLink.addEventListener('click', (event) => {
        event.preventDefault();
        contactBlock.querySelector('.contact-toggle-box').classList.toggle('hidden');
      });
    } else if (foundLink && foundLink.href.startsWith('https://wa.me/')) {
      contactLink.classList.add('whatsapp');
      contactLink.setAttribute('target', '_blank');
      contactLink.setAttribute('rel', 'noopener noreferrer');
      srOnlySpan.textContent = 'whatsapp';
    } else if (foundLink && foundLink.href.startsWith('mailto:')) {
      contactLink.classList.add('email');
      srOnlySpan.textContent = 'email';
    }
    contactIconsDiv.append(contactLink);
  });

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const callContainer = document.createElement('div');
  callContainer.classList.add('user__contact__icon-call_container');
  const primaryTel = document.createElement('a');
  primaryTel.classList.add('primary-telephone');
  primaryTel.href = 'tel:18001021800'; // Hardcoded from original HTML
  primaryTel.textContent = '1800 102 1800';
  const secondaryTel = document.createElement('a');
  secondaryTel.classList.add('secondary-telephone');
  secondaryTel.href = 'tel:';
  callContainer.append(primaryTel, secondaryTel);
  contactToggleBox.append(callContainer);


  contactWrpArena.append(contactIconsDiv, contactToggleBox);
  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = languageRow.textContent.trim();
  rightDiv.append(languageDiv);

  // Sign-in Wrapper
  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden');
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  userAccountLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    const accountLink = document.createElement('a');
    accountLink.classList.add('user__account--link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      accountLink.href = foundLink.href;
      accountLink.setAttribute('target', '_self');
      // Ensure class names match original HTML, remove extra spaces
      accountLink.classList.add(...labelCell.textContent.toLowerCase().trim().split(' '));
    }

    const listIconSpan = document.createElement('span');
    listIconSpan.classList.add('user__account__list-icon');
    const iconImg = iconCell.querySelector('img');
    if (iconImg) {
      const clonedImg = iconImg.cloneNode(true);
      listIconSpan.append(clonedImg);
    }
    accountLink.append(listIconSpan, labelCell.textContent.trim());
    userAccount.append(accountLink);
  });

  // Sign In button
  const signInBtnDiv = document.createElement('div');
  signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
  const signInIconSpan = document.createElement('span');
  signInIconSpan.classList.add('user__account__list-icon');
  const signInImg = document.createElement('img');
  // Read src from original HTML if present, otherwise use placeholder
  signInImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775897422912.svg+xml';
  signInImg.setAttribute('loading', 'lazy');
  signInImg.alt = 'Sign-in';
  signInIconSpan.append(signInImg);
  const signInButton = document.createElement('button');
  signInButton.setAttribute('type', 'button');
  signInButton.setAttribute('data-sign-out-text', 'Sign Out');
  signInButton.textContent = 'Sign In';
  signInBtnDiv.append(signInIconSpan, signInButton);
  userAccount.append(signInBtnDiv);

  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightDiv.append(signInWrapper);

  navbarArena.append(rightDiv);
  block.append(navbarArena);

  // Mobile Menu
  const mobileMenu = document.createElement('div');
  mobileMenu.id = 'menu';
  mobileMenu.classList.add('menu', 'hidden', 'menu-arena');

  const menuHeader = document.createElement('div');
  menuHeader.classList.add('menu-header');
  const backArrow = document.createElement('div');
  backArrow.classList.add('back-arrow');
  const menuTitleSpan = document.createElement('span');
  menuTitleSpan.classList.add('menu-title');
  menuTitleSpan.textContent = 'Menu';
  const closeIcon = document.createElement('span');
  closeIcon.classList.add('close-icon');
  menuHeader.append(backArrow, menuTitleSpan, closeIcon);
  mobileMenu.append(menuHeader);

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');

  function createMobileNavItem(item, index) {
    const li = document.createElement('li');
    li.id = `menu-item-${index}`;
    li.classList.add('nav-link', ...item.label.toLowerCase().replace(/\s/g, '-').split(' '));

    const span = document.createElement('span');
    span.classList.add('menu-title');
    const link = document.createElement('a');
    link.textContent = item.label;
    if (item.label.toLowerCase() === 'home' || item.label.toLowerCase() === 'service' || item.label.toLowerCase() === 'important customer info') {
      link.classList.add('button');
      link.href = '#'; // Placeholder
    }
    span.append(link);
    li.append(span);

    if (item.children && item.children.length > 0) {
      li.classList.add('accordion');
      const panel = document.createElement('div');
      panel.classList.add('panel');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical'); // Assuming vertical for mobile

      const ul = document.createElement('ul');
      ul.classList.add('content', 'links-container', 'accordian-content');
      item.children.forEach((child) => {
        const childLi = document.createElement('li');
        const childLink = document.createElement('a');
        childLink.textContent = child.label;
        childLink.href = '#'; // Placeholder
        childLi.append(childLink);
        ul.append(childLi);
      });
      linkGridColumn.append(ul);
      linkContainerSection.append(linkGridColumn);
      panel.append(linkContainerSection);
      mobileMenu.append(panel);

      li.addEventListener('click', () => {
        li.classList.toggle('active');
        panel.classList.toggle('active');
      });
    }
    return li;
  }

  navItems.forEach((item, index) => {
    menuList.append(createMobileNavItem(item, index));
  });

  // Mobile Engage Logo
  const mobileEngageLi = document.createElement('li');
  mobileEngageLi.classList.add('nav-link');
  const mobileEngageSpan = document.createElement('span');
  mobileEngageSpan.classList.add('menu-title');
  const mobileEngageLink = document.createElement('a');
  mobileEngageLink.classList.add('logo__picture');
  const foundMobileEngageLink = engageLogoLinkRow.querySelector('a');
  if (foundMobileEngageLink) {
    mobileEngageLink.href = foundMobileEngageLink.href;
  }
  mobileEngageLink.setAttribute('data-logo-name', 'Maruti Suzuki');
  const mobileEngagePicture = engageLogoRow.querySelector('picture');
  if (mobileEngagePicture) {
    mobileEngageLink.append(mobileEngagePicture.cloneNode(true));
  }
  mobileEngageSpan.append(mobileEngageLink);
  mobileEngageLi.append(mobileEngageSpan);
  menuList.append(mobileEngageLi);


  // Mobile User Account Links
  userAccountLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    const li = document.createElement('li');
    const accountLink = document.createElement('a');
    accountLink.classList.add('user__account--link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      accountLink.href = foundLink.href;
      accountLink.setAttribute('target', '_self');
      accountLink.classList.add(...labelCell.textContent.toLowerCase().trim().split(' '));
    }

    const listIconSpan = document.createElement('span');
    listIconSpan.classList.add('user__account__list-icon');
    const iconImg = iconCell.querySelector('img');
    if (iconImg) {
      const clonedImg = iconImg.cloneNode(true);
      listIconSpan.append(clonedImg);
    }
    accountLink.append(listIconSpan, labelCell.textContent.trim());
    li.append(accountLink);
    menuList.append(li);
  });

  // Mobile Sign In button
  const mobileSignInLi = document.createElement('li');
  const mobileSignInBtnDiv = document.createElement('div');
  mobileSignInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
  const mobileSignInIconSpan = document.createElement('span');
  mobileSignInIconSpan.classList.add('user__account__list-icon');
  const mobileSignInImg = document.createElement('img');
  mobileSignInImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775897422912.svg+xml'; // Read from original HTML if present
  mobileSignInImg.setAttribute('loading', 'lazy');
  mobileSignInImg.alt = 'Sign-in';
  mobileSignInIconSpan.append(mobileSignInImg);
  const mobileSignInButton = document.createElement('button');
  mobileSignInButton.setAttribute('type', 'button');
  mobileSignInButton.setAttribute('data-sign-out-text', 'Sign Out');
  mobileSignInButton.textContent = 'Sign In';
  mobileSignInBtnDiv.append(mobileSignInIconSpan, mobileSignInButton);
  mobileSignInLi.append(mobileSignInBtnDiv);
  menuList.append(mobileSignInLi);

  mobileMenu.append(menuList);
  block.append(mobileMenu);

  // Event Listeners for mobile menu
  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    document.body.classList.toggle('menu-open');
  });

  closeIcon.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('menu-open');
  });

  // Event listener for the contact icon phone to toggle the contact-toggle-box
  contactIconPhone.addEventListener('click', () => {
    contactToggleBox.classList.toggle('hidden');
  });

  // Event listener for the sign-in button to toggle the sign-in-wrapper
  signInBtnDiv.addEventListener('click', () => {
    signInWrapper.classList.toggle('hidden');
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
