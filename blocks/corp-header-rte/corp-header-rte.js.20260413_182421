import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    engageLogoRow,
    engageLogoLinkRow,
    languageRow,
    textRow, // Navigation Hierarchy (richtext)
    ...itemRows
  ] = [...block.children];

  block.textContent = '';

  const navbar = document.createElement('div');
  navbar.classList.add('navbar', 'navbar-arena', 'g-container');

  // Hamburger button
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
  navbar.append(navHamburger);

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block');
  const arenaSpan = document.createElement('span');
  arenaSpan.classList.add('arena');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  logoLink.href = logoLinkRow.querySelector('a')?.href || '#';
  logoLink.setAttribute('data-logo-name', 'Arena');
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    moveInstrumentation(logoRow.querySelector('div'), logoLink);
    logoLink.append(logoPicture);
  }
  arenaSpan.append(logoLink);
  logoBlock.append(arenaSpan);
  logoWrapper.append(logoBlock);
  navbar.append(logoWrapper);

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

  function createNavElement(item) {
    const linkTitle = document.createElement('div');
    linkTitle.classList.add('link-title');
    const span = document.createElement('span');

    if (item.children.length > 0) {
      // It's a parent item, create a span for the label and a panel for children
      span.textContent = item.label;
      linkTitle.append(span);
      linksDiv.append(linkTitle);

      const desktopPanel = document.createElement('div');
      desktopPanel.classList.add('desktop-panel', 'panel', item.label.toLowerCase().replace(/\s/g, '-'));
      const linkGrid = document.createElement('div');
      linkGrid.classList.add('link-grid', 'block');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical'); // Assuming vertical for now

      const ul = document.createElement('ul');
      ul.classList.add('content', 'links-container', 'accordian-content');
      item.children.forEach((child) => {
        const li = document.createElement('li');
        const childLink = document.createElement('a');
        childLink.textContent = child.label;
        childLink.href = '#'; // Placeholder, actual links would come from model if available
        li.append(childLink);
        ul.append(li);
      });
      linkGridColumn.append(ul);
      linkContainerSection.append(linkGridColumn);
      linkGrid.append(linkContainerSection);
      desktopPanel.append(linkGrid);
      linksDiv.append(desktopPanel);

      linkTitle.addEventListener('click', () => {
        desktopPanel.classList.toggle('show');
      });
    } else {
      // It's a leaf item, create an <a>
      const link = document.createElement('a');
      link.href = '#'; // Placeholder
      link.textContent = item.label;
      link.classList.add('button');
      span.append(link);
      linkTitle.append(span);
      linksDiv.append(linkTitle);
    }
  }

  navItems.forEach((item) => createNavElement(item));

  // Engage Logo
  const engageLinkTitle = document.createElement('div');
  engageLinkTitle.classList.add('link-title');
  const engageSpan = document.createElement('span');
  const engageLink = document.createElement('a');
  engageLink.classList.add('logo__picture');
  engageLink.href = engageLogoLinkRow.querySelector('a')?.href || '#';
  engageLink.setAttribute('data-logo-name', 'Maruti Suzuki');
  const engagePicture = engageLogoRow.querySelector('picture');
  if (engagePicture) {
    moveInstrumentation(engageLogoRow.querySelector('div'), engageLink);
    engageLink.append(engagePicture);
  }
  engageSpan.append(engageLink);
  engageLinkTitle.append(engageSpan);
  linksDiv.append(engageLinkTitle);

  navbar.append(linksDiv);

  // Right section (contact, language, account links)
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

  const contactIcons = document.createElement('div');
  contactIcons.classList.add('user__contact__icons', 'hidden');

  const contactLinkItems = itemRows.filter((row) => row.children.length === 2); // Icon, Link
  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const link = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      if (foundLink.textContent.includes('whatsapp')) {
        link.classList.add('user__contact--icon', 'whatsapp');
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      } else if (foundLink.textContent.includes('email')) {
        link.classList.add('user__contact--icon', 'email');
      } else {
        link.classList.add('user__contact--icon', 'phone');
      }
    }

    const srOnlySpan = document.createElement('span');
    srOnlySpan.classList.add('sr-only');
    srOnlySpan.textContent = link.classList.contains('whatsapp') ? 'whatsapp' : (link.classList.contains('email') ? 'email' : 'phone');
    link.append(srOnlySpan);

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt;
      newImg.loading = 'lazy';
      moveInstrumentation(img, newImg);
      link.append(newImg);
    }
    contactIcons.append(link);
  });

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const callContainer = document.createElement('div');
  callContainer.classList.add('user__contact__icon-call_container');
  const primaryTel = document.createElement('a');
  primaryTel.classList.add('primary-telephone');
  primaryTel.href = 'tel:1800 102 1800';
  primaryTel.textContent = '1800 102 1800';
  const secondaryTel = document.createElement('a');
  secondaryTel.classList.add('secondary-telephone');
  secondaryTel.href = 'tel:';
  callContainer.append(primaryTel, secondaryTel);
  contactToggleBox.append(callContainer);

  contactWrpArena.append(contactIcons, contactToggleBox);
  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = languageRow.textContent.trim();
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

  const accountLinkItems = itemRows.filter((row) => row.children.length === 3); // Icon, Link, Label
  accountLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    const link = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.setAttribute('target', '_self');
    }
    link.classList.add('user__account--link');
    if (labelCell?.textContent.trim().toLowerCase() === 'reach us') {
      link.classList.add('reach', 'us');
    } else if (labelCell?.textContent.trim().toLowerCase() === 'profile') {
      link.classList.add('profile');
    }

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('user__account__list-icon');
    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt;
      newImg.loading = 'lazy';
      moveInstrumentation(img, newImg);
      iconSpan.append(newImg);
    }
    link.append(iconSpan, labelCell?.textContent.trim() || '');
    userAccount.append(link);
  });

  const signInBtnDiv = document.createElement('div');
  signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
  const signInIconSpan = document.createElement('span');
  signInIconSpan.classList.add('user__account__list-icon');
  const signInImg = document.createElement('img');
  signInImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776063821632.svg+xml'; // Hardcoded from original HTML
  signInImg.loading = 'lazy';
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

  navbar.append(rightDiv);

  block.append(navbar);

  // Mobile Menu (hidden by default)
  const menu = document.createElement('div');
  menu.id = 'menu';
  menu.classList.add('menu', 'hidden', 'menu-arena');

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
  menu.append(menuHeader);

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');

  function createMobileNavElement(item, index) {
    const li = document.createElement('li');
    li.id = `menu-item-${index}`;
    li.classList.add('nav-link');

    const span = document.createElement('span');
    span.classList.add('menu-title');

    if (item.children.length > 0) {
      li.classList.add('accordion', item.label.toLowerCase().replace(/\s/g, '-'));
      span.textContent = item.label;
      li.append(span);

      const panel = document.createElement('div');
      panel.classList.add('panel');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

      const ul = document.createElement('ul');
      ul.classList.add('content', 'links-container', 'accordian-content');
      item.children.forEach((child) => {
        const childLi = document.createElement('li');
        const childLink = document.createElement('a');
        childLink.textContent = child.label;
        childLink.href = '#';
        childLi.append(childLink);
        ul.append(childLi);
      });
      linkGridColumn.append(ul);
      linkContainerSection.append(linkGridColumn);
      panel.append(linkContainerSection);
      menuList.append(li, panel);

      li.addEventListener('click', () => {
        panel.classList.toggle('show');
        li.classList.toggle('active'); // Add active class for styling if needed
      });
    } else {
      li.classList.add(item.label.toLowerCase().replace(/\s/g, '-'));
      const link = document.createElement('a');
      link.href = '#';
      link.title = item.label.toLowerCase().replace(/\s/g, '-');
      link.classList.add('button');
      link.textContent = item.label;
      span.append(link);
      li.append(span);
      menuList.append(li);
    }
  }

  navItems.forEach((item, index) => createMobileNavElement(item, index));

  // Append Engage Logo to mobile menu
  const mobileEngageLi = document.createElement('li');
  mobileEngageLi.classList.add('nav-link');
  const mobileEngageSpan = document.createElement('span');
  mobileEngageSpan.classList.add('menu-title');
  const mobileEngageLink = document.createElement('a');
  mobileEngageLink.classList.add('logo__picture');
  mobileEngageLink.href = engageLogoLinkRow.querySelector('a')?.href || '#';
  mobileEngageLink.setAttribute('data-logo-name', 'Maruti Suzuki');
  const mobileEngagePicture = engageLogoRow.querySelector('picture');
  if (mobileEngagePicture) {
    const clonedPicture = mobileEngagePicture.cloneNode(true);
    mobileEngageLink.append(clonedPicture);
  }
  mobileEngageSpan.append(mobileEngageLink);
  mobileEngageLi.append(mobileEngageSpan);
  menuList.append(mobileEngageLi);

  // Append account links to mobile menu
  accountLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    const li = document.createElement('li');
    const link = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.setAttribute('target', '_self');
    }
    link.classList.add('user__account--link');
    if (labelCell?.textContent.trim().toLowerCase() === 'reach us') {
      link.classList.add('reach', 'us');
    } else if (labelCell?.textContent.trim().toLowerCase() === 'profile') {
      link.classList.add('profile');
    }

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('user__account__list-icon');
    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt;
      newImg.loading = 'lazy';
      moveInstrumentation(img, newImg);
      iconSpan.append(newImg);
    }
    link.append(iconSpan, labelCell?.textContent.trim() || '');
    li.append(link);
    menuList.append(li);
  });

  const mobileSignInLi = document.createElement('li');
  const mobileSignInBtnDiv = document.createElement('div');
  mobileSignInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
  const mobileSignInIconSpan = document.createElement('span');
  mobileSignInIconSpan.classList.add('user__account__list-icon');
  const mobileSignInImg = document.createElement('img');
  mobileSignInImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776063821632.svg+xml';
  mobileSignInImg.loading = 'lazy';
  mobileSignInImg.alt = 'Sign-in';
  mobileSignInIconSpan.append(mobileSignInImg);
  const mobileSignInButton = document.createElement('button');
  mobileSignInButton.setAttribute('type', 'button');
  mobileSignInButton.setAttribute('data-sign-out-text', 'Sign Out');
  mobileSignInButton.textContent = 'Sign In';
  mobileSignInBtnDiv.append(mobileSignInIconSpan, mobileSignInButton);
  mobileSignInLi.append(mobileSignInBtnDiv);
  menuList.append(mobileSignInLi);

  menu.append(menuList);
  block.append(menu);

  // Event Listeners for interactive behavior
  hamburgerButton.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    hamburgerButton.setAttribute('aria-expanded', menu.classList.contains('hidden') ? 'false' : 'true');
  });

  closeIcon.addEventListener('click', () => {
    menu.classList.add('hidden');
    hamburgerButton.setAttribute('aria-expanded', 'false');
  });

  backArrow.addEventListener('click', () => {
    // Implement back navigation logic for mobile menu if it has sub-levels
    // For now, it just closes the menu
    menu.classList.add('hidden');
    hamburgerButton.setAttribute('aria-expanded', 'false');
  });

  contactIconPhone.addEventListener('click', () => {
    contactToggleBox.classList.toggle('hidden');
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
