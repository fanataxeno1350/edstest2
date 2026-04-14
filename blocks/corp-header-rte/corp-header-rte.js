import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Identify root rows based on BlockJson structure
  const logoRow = children[0];
  const logoLinkRow = children[1];
  const engageLogoRow = children[2];
  const engageLogoLinkRow = children[3];
  const languageRow = children[4];

  // Item rows start from index 5
  const itemRows = children.slice(5);

  // Create main header structure
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
  const arenaSpan = document.createElement('span');
  arenaSpan.classList.add('arena');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  moveInstrumentation(logoLinkRow.firstElementChild, logoLink);
  logoLink.href = logoLinkRow.querySelector('a').href;
  logoLink.setAttribute('data-logo-name', 'Arena');
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '79' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoPicture.replaceWith(optimizedPic);
    logoLink.append(optimizedPic);
  }
  arenaSpan.append(logoLink);
  logoBlock.append(arenaSpan);
  logoWrapper.append(logoBlock);
  navbarArena.append(logoWrapper);

  // Navigation links container
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');

  // Filter item rows based on content detection (BlockJson definitions)
  const navigationItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && !cells[0].querySelector('picture') && !cells[1].querySelector('a');
  });
  const contactLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('picture');
  });
  const signInLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 4;
  });

  navigationItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul')); // hierarchy-tree

    const linkTitle = document.createElement('div');
    linkTitle.classList.add('link-title');
    const span = document.createElement('span');

    const link = linkCell?.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      moveInstrumentation(linkCell, newLink);
      newLink.href = link.href;
      newLink.textContent = labelCell?.textContent.trim() || ''; // Use label for link text
      span.append(newLink);
    } else {
      span.textContent = labelCell?.textContent.trim() || '';
    }
    linkTitle.append(span);
    linksDiv.append(linkTitle);

    const hierarchyTree = hierarchyCell?.querySelector('ul');
    if (hierarchyTree) {
      const desktopPanel = document.createElement('div');
      desktopPanel.classList.add('desktop-panel', 'panel', labelCell.textContent.trim().toLowerCase().replace(/\s/g, '-'));
      const linkGridBlock = document.createElement('div');
      linkGridBlock.classList.add('link-grid', 'block');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
      moveInstrumentation(hierarchyCell, linkGridColumn);
      linkGridColumn.innerHTML = hierarchyTree.outerHTML; // Preserve full UL structure
      linkContainerSection.append(linkGridColumn);
      linkGridBlock.append(linkContainerSection);
      desktopPanel.append(linkGridBlock);
      linksDiv.append(desktopPanel);
    }
  });

  // Engage Logo
  const engageLinkTitle = document.createElement('div');
  engageLinkTitle.classList.add('link-title');
  const engageSpan = document.createElement('span');
  const engageLink = document.createElement('a');
  engageLink.classList.add('logo__picture');
  moveInstrumentation(engageLogoLinkRow.firstElementChild, engageLink);
  engageLink.href = engageLogoLinkRow.querySelector('a').href;
  engageLink.setAttribute('data-logo-name', 'Maruti Suzuki');
  const engagePicture = engageLogoRow.querySelector('picture');
  if (engagePicture) {
    const img = engagePicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '79' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    engagePicture.replaceWith(optimizedPic);
    engageLink.append(optimizedPic);
  }
  engageSpan.append(engageLink);
  engageLinkTitle.append(engageSpan);
  linksDiv.append(engageLinkTitle);

  navbarArena.append(linksDiv);

  // Right section (contact, language, sign-in)
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
  const contactIconSpan = document.createElement('span');
  contactIconSpan.classList.add('user__contact-title', 'icon-phone');
  contactIconSpan.setAttribute('aria-label', 'Contact Us');
  contactWrpArena.append(contactTitle, contactIconSpan);

  const contactIconsDiv = document.createElement('div');
  contactIconsDiv.classList.add('user__contact__icons', 'hidden');

  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    // const hierarchyCell = cells.find(cell => cell.querySelector('ul')); // Not used for direct contact links

    const contactLink = linkCell?.querySelector('a');
    const iconPicture = iconCell?.querySelector('picture');
    if (contactLink && iconPicture) {
      const img = iconPicture.querySelector('img');
      const newLink = document.createElement('a');
      moveInstrumentation(linkCell, newLink);
      newLink.href = contactLink.href;
      newLink.classList.add('user__contact--icon');

      let type = '';
      if (contactLink.href.startsWith('tel:')) {
        type = 'phone';
      } else if (contactLink.href.includes('wa.me')) {
        type = 'whatsapp';
      } else if (contactLink.href.startsWith('mailto:')) {
        type = 'email';
      }
      if (type) newLink.classList.add(type);

      if (contactLink.target) newLink.target = contactLink.target;
      if (contactLink.rel) newLink.rel = contactLink.rel;

      const srOnlySpan = document.createElement('span');
      srOnlySpan.classList.add('sr-only');
      srOnlySpan.textContent = type;
      newLink.append(srOnlySpan);

      const optimizedIcon = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
      moveInstrumentation(img, optimizedIcon.querySelector('img'));
      iconPicture.replaceWith(optimizedIcon);
      newLink.append(optimizedIcon);
      contactIconsDiv.append(newLink);

      // Handle phone number display
      if (type === 'phone') {
        const phoneNumberDiv = document.createElement('div');
        phoneNumberDiv.classList.add('hidden');
        phoneNumberDiv.textContent = contactLink.textContent;
        contactIconsDiv.append(phoneNumberDiv);

        // Add event listener for the phone icon to toggle the contact-toggle-box
        newLink.addEventListener('click', (e) => {
          e.preventDefault();
          contactBlock.querySelector('.contact-toggle-box').classList.toggle('hidden');
        });
      }
    }
  });
  contactWrpArena.append(contactIconsDiv);

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const contactIconCallContainer = document.createElement('div');
  contactIconCallContainer.classList.add('user__contact__icon-call_container');

  const primaryTelLink = contactLinkItems
    .map((row) => [...row.children].find(cell => cell.querySelector('a'))?.querySelector('a'))
    .find((a) => a && a.href.startsWith('tel:'));

  if (primaryTelLink) {
    const primaryTelephone = document.createElement('a');
    primaryTelephone.href = primaryTelLink.href;
    primaryTelephone.classList.add('primary-telephone');
    primaryTelephone.textContent = primaryTelLink.textContent;
    contactIconCallContainer.append(primaryTelephone);
  }
  const secondaryTelephone = document.createElement('a');
  secondaryTelephone.classList.add('secondary-telephone');
  contactIconCallContainer.append(secondaryTelephone);
  contactToggleBox.append(contactIconCallContainer);
  contactWrpArena.append(contactToggleBox);
  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  moveInstrumentation(languageRow.firstElementChild, languageDiv);
  languageDiv.textContent = languageRow.textContent.trim();
  rightDiv.append(languageDiv);

  // Sign-in links
  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden');
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  signInLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));
    // const hierarchyCell = cells.find(cell => cell.querySelector('ul')); // Not used for direct sign-in links

    const signInLink = linkCell?.querySelector('a');
    const iconPicture = iconCell?.querySelector('picture');

    if (signInLink || labelCell?.textContent.trim() === 'Sign In') {
      const iconSpan = document.createElement('span');
      iconSpan.classList.add('user__account__list-icon');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const optimizedIcon = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
        moveInstrumentation(img, optimizedIcon.querySelector('img'));
        iconPicture.replaceWith(optimizedIcon);
        iconSpan.append(optimizedIcon);
      }

      if (labelCell?.textContent.trim() === 'Sign In') {
        const signInDiv = document.createElement('div');
        signInDiv.classList.add('user__account--link', 'sign-in-btn');
        const signInButton = document.createElement('button');
        signInButton.setAttribute('type', 'button');
        signInButton.setAttribute('data-sign-out-text', 'Sign Out');
        signInButton.textContent = labelCell.textContent.trim();
        signInDiv.append(iconSpan, signInButton);
        userAccount.append(signInDiv);
      } else {
        const userAccountLink = document.createElement('a');
        userAccountLink.classList.add('user__account--link');
        moveInstrumentation(row, userAccountLink); // Instrumentation on the link itself
        if (signInLink) {
          userAccountLink.href = signInLink.href;
          userAccountLink.target = signInLink.target;
          userAccountLink.rel = signInLink.rel;
          userAccountLink.textContent = labelCell?.textContent.trim() || '';
          userAccountLink.classList.add(labelCell?.textContent.trim().toLowerCase().replace(/\s/g, '-') || '');
        }
        userAccountLink.prepend(iconSpan);
        userAccount.append(userAccountLink);
      }
    }
  });

  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightDiv.append(signInWrapper);

  navbarArena.append(rightDiv);

  block.textContent = '';
  block.append(navbarArena);

  // Mobile menu (hidden by default)
  const mobileMenu = document.createElement('div');
  mobileMenu.id = 'menu';
  mobileMenu.classList.add('menu', 'hidden', 'menu-arena');

  const menuHeader = document.createElement('div');
  menuHeader.classList.add('menu-header');
  menuHeader.innerHTML = `
    <div class="back-arrow"></div>
    <span class="menu-title">Menu</span>
    <span class="close-icon"></span>
  `;
  mobileMenu.append(menuHeader);

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');

  navigationItems.forEach((row, index) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));

    const li = document.createElement('li');
    li.id = `menu-item-${index}`;
    li.classList.add('nav-link');
    moveInstrumentation(row, li);

    const menuTitleSpan = document.createElement('span');
    menuTitleSpan.classList.add('menu-title');

    const link = linkCell?.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.textContent = labelCell?.textContent.trim() || '';
      menuTitleSpan.append(newLink);
    } else {
      menuTitleSpan.textContent = labelCell?.textContent.trim() || '';
    }
    li.append(menuTitleSpan);

    const hierarchyTree = hierarchyCell?.querySelector('ul');
    if (hierarchyTree) {
      li.classList.add('accordion', labelCell.textContent.trim().toLowerCase().replace(/\s/g, '-'));
      const panelDiv = document.createElement('div');
      panelDiv.classList.add('panel');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
      linkGridColumn.innerHTML = hierarchyTree.outerHTML; // Preserve full UL structure
      linkContainerSection.append(linkGridColumn);
      panelDiv.append(linkContainerSection);
      menuList.append(li, panelDiv);
    } else {
      menuList.append(li);
    }
  });

  // Append contact and sign-in links to mobile menu as flat list items
  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const link = linkCell?.querySelector('a');
    const iconPicture = iconCell?.querySelector('picture');

    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.target = link.target;
      newLink.rel = link.rel;
      newLink.textContent = link.textContent; // Use link text for contact
      li.append(newLink);

      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const optimizedIcon = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
        moveInstrumentation(img, optimizedIcon.querySelector('img'));
        iconPicture.replaceWith(optimizedIcon);
        const iconSpan = document.createElement('span');
        iconSpan.classList.add('user__account__list-icon');
        iconSpan.append(optimizedIcon);
        newLink.prepend(iconSpan);
      }
    }
    menuList.append(li);
  });

  signInLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const signInLink = linkCell?.querySelector('a');
    const iconPicture = iconCell?.querySelector('picture');

    if (signInLink || labelCell?.textContent.trim() === 'Sign In') {
      const iconSpan = document.createElement('span');
      iconSpan.classList.add('user__account__list-icon');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const optimizedIcon = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
        moveInstrumentation(img, optimizedIcon.querySelector('img'));
        iconPicture.replaceWith(optimizedIcon);
        iconSpan.append(optimizedIcon);
      }

      if (labelCell?.textContent.trim() === 'Sign In') {
        const signInDiv = document.createElement('div');
        signInDiv.classList.add('user__account--link', 'sign-in-btn');
        const signInButton = document.createElement('button');
        signInButton.setAttribute('type', 'button');
        signInButton.setAttribute('data-sign-out-text', 'Sign Out');
        signInButton.textContent = labelCell.textContent.trim();
        signInDiv.append(iconSpan, signInButton);
        li.append(signInDiv);
      } else {
        const userAccountLink = document.createElement('a');
        userAccountLink.classList.add('user__account--link');
        if (signInLink) {
          userAccountLink.href = signInLink.href;
          userAccountLink.target = signInLink.target;
          userAccountLink.rel = signInLink.rel;
          userAccountLink.textContent = labelCell?.textContent.trim() || '';
          userAccountLink.classList.add(labelCell?.textContent.trim().toLowerCase().replace(/\s/g, '-') || '');
        }
        userAccountLink.prepend(iconSpan);
        li.append(userAccountLink);
      }
    }
    menuList.append(li);
  });

  mobileMenu.append(menuList);
  block.append(mobileMenu);

  // Add event listeners for mobile menu and accordions
  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    document.body.classList.toggle('no-scroll');
  });

  mobileMenu.querySelector('.close-icon').addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  });

  mobileMenu.querySelectorAll('li.accordion').forEach((accordion) => {
    accordion.addEventListener('click', () => {
      accordion.classList.toggle('active');
      const panel = accordion.nextElementSibling;
      if (panel && panel.classList.contains('panel')) {
        panel.classList.toggle('active');
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        }
      }
    });
  });

  // Event listener for the desktop contact icon to toggle the contact-toggle-box
  contactIconSpan.addEventListener('click', () => {
    contactBlock.querySelector('.contact-toggle-box').classList.toggle('hidden');
  });

  // Optimize all images within the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}