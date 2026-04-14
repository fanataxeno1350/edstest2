import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Determine the number of fixed rows at the beginning
  // Based on BlockJson: logo, logoLink, language are fixed fields.
  // navigationMenu, contactLinks, signInLinks are containers with item rows.
  // So, first 3 rows are fixed fields.
  const logoRow = children[0];
  const logoLinkRow = children[1];
  const languageRow = children[2];
  const itemRows = children.slice(3);

  const navigationItems = itemRows.filter((row) => {
    const cells = [...row.children];
    // Navigation-item: label (text), link (aem-content), hierarchy-tree (richtext)
    // 3 cells, and typically the hierarchy-tree cell contains a <p> or <ul>
    return cells.length === 3 && cells.some(cell => cell.querySelector('a')) && cells.some(cell => cell.querySelector('p') || cell.querySelector('ul'));
  });

  const contactLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    // Contact-link-item: icon (reference), link (aem-content), hierarchy-tree (richtext)
    // 3 cells, icon has picture, link has a, hierarchy-tree has p/ul
    return cells.length === 3 && cells.some(cell => cell.querySelector('picture')) && cells.some(cell => cell.querySelector('a'));
  });

  const signInLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    // Sign-in-link-item: icon (reference), link (aem-content), label (text), hierarchy-tree (richtext)
    // 4 cells, icon has picture, link has a, label is text, hierarchy-tree has p/ul
    return cells.length === 4 && cells.some(cell => cell.querySelector('picture')) && cells.some(cell => cell.querySelector('a'));
  });

  block.textContent = '';

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
  const logoSpan = document.createElement('span');
  logoSpan.classList.add('arena');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');

  const logoLinkCell = [...logoLinkRow.children][0]; // logoLink is aem-content, so it's the first cell
  if (logoLinkCell) {
    const originalLogoLink = logoLinkCell.querySelector('a');
    if (originalLogoLink) {
      moveInstrumentation(originalLogoLink, logoLink);
      logoLink.href = originalLogoLink.href;
      logoLink.setAttribute('data-logo-name', 'Arena');
    }
  }

  const logoCell = [...logoRow.children][0]; // logo is reference, so it's the first cell
  if (logoCell) {
    const logoPicture = logoCell.querySelector('picture');
    if (logoPicture) {
      const img = logoPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '79' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        logoLink.append(optimizedPic);
      }
    }
  }
  logoSpan.append(logoLink);
  logoBlock.append(logoSpan);
  logoWrapper.append(logoBlock);
  headerWrapper.append(logoWrapper);

  // Navigation Links
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');

  navigationItems.forEach((row) => {
    const linkTitle = document.createElement('div');
    linkTitle.classList.add('link-title');
    const span = document.createElement('span');

    const cells = [...row.children];
    const labelCell = cells.find((cell) => !cell.querySelector('a') && !cell.querySelector('picture') && !cell.querySelector('ul'));
    const linkCell = cells.find((cell) => cell.querySelector('a'));
    const hierarchyCell = cells.find((cell) => cell.querySelector('ul')); // Look for <ul> directly

    if (linkCell) {
      const a = document.createElement('a');
      const originalLink = linkCell.querySelector('a');
      if (originalLink) {
        moveInstrumentation(originalLink, a);
        a.href = originalLink.href;
        a.title = originalLink.title || labelCell?.textContent.trim() || '';
        a.textContent = labelCell?.textContent.trim() || originalLink.textContent.trim();
        if (originalLink.classList.contains('button')) {
          a.classList.add('button');
        }
      } else {
        a.textContent = labelCell?.textContent.trim() || '';
        a.href = '#';
      }
      span.append(a);
      linkTitle.append(span);
    } else if (labelCell) {
      span.textContent = labelCell.textContent.trim();
      linkTitle.append(span);
    }

    if (hierarchyCell && hierarchyCell.querySelector('ul')) {
      linkTitle.classList.add('desktop-panel', 'panel', labelCell?.textContent.trim().toLowerCase().replace(/\s+/g, '-'));
      const linkGrid = document.createElement('div');
      linkGrid.classList.add('link-grid', 'block');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
      moveInstrumentation(hierarchyCell, linkGridColumn);
      // Extract outerHTML to preserve the <ul> wrapper and its content
      linkGridColumn.innerHTML = hierarchyCell.querySelector('ul').outerHTML;
      linkContainerSection.append(linkGridColumn);
      linkGrid.append(linkContainerSection);
      linkTitle.append(linkGrid);
    }
    linksDiv.append(linkTitle);
  });
  headerWrapper.append(linksDiv);

  // Right section (Contact, Language, Sign-in)
  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';

  // Contact Links
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
    const iconCell = cells.find((cell) => cell.querySelector('picture'));
    const linkCell = cells.find((cell) => cell.querySelector('a'));

    if (linkCell && iconCell) {
      const a = document.createElement('a');
      const originalLink = linkCell.querySelector('a');
      const originalImg = iconCell.querySelector('img');

      if (originalLink) {
        moveInstrumentation(originalLink, a);
        a.href = originalLink.href;
        a.target = originalLink.target;
        a.rel = originalLink.rel;
        a.classList.add('user__contact--icon');
        if (originalLink.href.includes('wa.me')) {
          a.classList.add('whatsapp');
        } else if (originalLink.href.startsWith('mailto:')) {
          a.classList.add('email');
        } else if (originalLink.href.startsWith('tel:')) {
          a.classList.add('phone');
          // This event listener should be on the icon-phone span to toggle the box
          // The original HTML has an onclick on the <a> itself, which is not ideal.
          // We'll add it to the icon-phone span instead.
        }
        const srOnlySpan = document.createElement('span');
        srOnlySpan.classList.add('sr-only');
        srOnlySpan.textContent = originalImg?.alt || '';
        a.append(srOnlySpan);

        if (originalImg) {
          const img = document.createElement('img');
          img.src = originalImg.src;
          img.alt = originalImg.alt;
          img.loading = 'lazy';
          a.append(img);
        }
        contactIconsDiv.append(a);
      }
    }
  });

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const contactCallContainer = document.createElement('div');
  contactCallContainer.classList.add('user__contact__icon-call_container');

  const primaryTelLink = document.createElement('a');
  primaryTelLink.classList.add('primary-telephone');
  primaryTelLink.href = 'tel:18001021800';
  primaryTelLink.textContent = '1800 102 1800';
  contactCallContainer.append(primaryTelLink);

  const secondaryTelLink = document.createElement('a');
  secondaryTelLink.classList.add('secondary-telephone');
  secondaryTelLink.href = 'tel:'; // Placeholder, as no content for this in model
  contactCallContainer.append(secondaryTelLink);
  contactToggleBox.append(contactCallContainer);

  contactWrpArena.append(contactIconsDiv, contactToggleBox);
  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  // Add event listener for the contact icon-phone to toggle the contact-toggle-box
  contactIconPhone.addEventListener('click', () => {
    contactToggleBox.classList.toggle('hidden');
    contactIconsDiv.classList.toggle('hidden'); // Also toggle the contact icons
  });


  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  const languageCell = [...languageRow.children][0]; // Language is text, first cell
  if (languageCell) {
    moveInstrumentation(languageCell, languageDiv);
    languageDiv.textContent = languageCell.textContent.trim();
  }
  rightDiv.append(languageDiv);

  // Sign-in
  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden'); // Original HTML has this hidden
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  signInLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find((cell) => cell.querySelector('picture'));
    const linkCell = cells.find((cell) => cell.querySelector('a'));
    const labelCell = cells.find((cell) => !cell.querySelector('a') && !cell.querySelector('picture') && !cell.querySelector('ul'));

    if (linkCell) {
      const a = document.createElement('a');
      const originalLink = linkCell.querySelector('a');
      if (originalLink) {
        moveInstrumentation(originalLink, a);
        a.href = originalLink.href;
        a.target = originalLink.target;
        a.classList.add('user__account--link', labelCell?.textContent.trim().toLowerCase().replace(/\s+/g, '-'));
      } else {
        a.href = '#';
        a.classList.add('user__account--link');
      }

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('user__account__list-icon');
      const originalImg = iconCell?.querySelector('img');
      if (originalImg) {
        const img = document.createElement('img');
        img.src = originalImg.src;
        img.loading = 'lazy';
        img.alt = originalImg.alt;
        iconSpan.append(img);
      }
      a.append(iconSpan);
      a.append(labelCell?.textContent.trim() || originalLink?.textContent.trim() || '');
      userAccount.append(a);
    } else if (labelCell) {
      const signInBtnDiv = document.createElement('div');
      signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
      const iconSpan = document.createElement('span');
      iconSpan.classList.add('user__account__list-icon');
      const originalImg = iconCell?.querySelector('img');
      if (originalImg) {
        const img = document.createElement('img');
        img.src = originalImg.src;
        img.loading = 'lazy';
        img.alt = originalImg.alt;
        iconSpan.append(img);
      }
      signInBtnDiv.append(iconSpan);
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('data-sign-out-text', 'Sign Out');
      button.textContent = labelCell.textContent.trim();
      signInBtnDiv.append(button);
      userAccount.append(signInBtnDiv);
    }
  });

  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightDiv.append(signInWrapper);

  headerWrapper.append(rightDiv);
  block.append(headerWrapper);

  // Mobile Menu
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
    const li = document.createElement('li');
    li.id = `menu-item-${index}`;
    li.classList.add('nav-link');

    const cells = [...row.children];
    const labelCell = cells.find((cell) => !cell.querySelector('a') && !cell.querySelector('picture') && !cell.querySelector('ul'));
    const linkCell = cells.find((cell) => cell.querySelector('a'));
    const hierarchyCell = cells.find((cell) => cell.querySelector('ul'));

    const spanTitle = document.createElement('span');
    spanTitle.classList.add('menu-title');

    if (linkCell) {
      const a = document.createElement('a');
      const originalLink = linkCell.querySelector('a');
      if (originalLink) {
        moveInstrumentation(originalLink, a);
        a.href = originalLink.href;
        a.title = originalLink.title || labelCell?.textContent.trim() || '';
        a.textContent = labelCell?.textContent.trim() || originalLink.textContent.trim();
        if (originalLink.classList.contains('button')) {
          a.classList.add('button');
        }
      } else {
        a.textContent = labelCell?.textContent.trim() || '';
        a.href = '#';
      }
      spanTitle.append(a);
    } else if (labelCell) {
      spanTitle.textContent = labelCell.textContent.trim();
    }
    li.append(spanTitle);

    if (hierarchyCell && hierarchyCell.querySelector('ul')) {
      li.classList.add('accordion', labelCell?.textContent.trim().toLowerCase().replace(/\s+/g, '-'));
      const panelDiv = document.createElement('div');
      panelDiv.classList.add('panel');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
      moveInstrumentation(hierarchyCell, linkGridColumn);
      // Extract outerHTML to preserve the <ul> wrapper and its content
      linkGridColumn.innerHTML = hierarchyCell.querySelector('ul').outerHTML;
      linkContainerSection.append(linkGridColumn);
      panelDiv.append(linkContainerSection);
      menuList.append(li, panelDiv);
    } else {
      menuList.append(li);
    }
  });

  signInLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find((cell) => cell.querySelector('picture'));
    const linkCell = cells.find((cell) => cell.querySelector('a'));
    const labelCell = cells.find((cell) => !cell.querySelector('a') && !cell.querySelector('picture') && !cell.querySelector('ul'));

    const li = document.createElement('li');
    if (linkCell) {
      const a = document.createElement('a');
      const originalLink = linkCell.querySelector('a');
      if (originalLink) {
        moveInstrumentation(originalLink, a);
        a.href = originalLink.href;
        a.target = originalLink.target;
        a.classList.add('user__account--link', labelCell?.textContent.trim().toLowerCase().replace(/\s+/g, '-'));
      } else {
        a.href = '#';
        a.classList.add('user__account--link');
      }

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('user__account__list-icon');
      const originalImg = iconCell?.querySelector('img');
      if (originalImg) {
        const img = document.createElement('img');
        img.src = originalImg.src;
        img.loading = 'lazy';
        img.alt = originalImg.alt;
        iconSpan.append(img);
      }
      a.append(iconSpan);
      a.append(labelCell?.textContent.trim() || originalLink?.textContent.trim() || '');
      li.append(a);
    } else if (labelCell) {
      const signInBtnDiv = document.createElement('div');
      signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
      const iconSpan = document.createElement('span');
      iconSpan.classList.add('user__account__list-icon');
      const originalImg = iconCell?.querySelector('img');
      if (originalImg) {
        const img = document.createElement('img');
        img.src = originalImg.src;
        img.loading = 'lazy';
        img.alt = originalImg.alt;
        iconSpan.append(img);
      }
      signInBtnDiv.append(iconSpan);
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('data-sign-out-text', 'Sign Out');
      button.textContent = labelCell.textContent.trim();
      signInBtnDiv.append(button);
      li.append(signInBtnDiv);
    }
    menuList.append(li);
  });

  mobileMenu.append(menuList);
  block.append(mobileMenu);

  // Event Listeners for mobile menu
  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    document.body.classList.toggle('no-scroll');
  });

  mobileMenu.querySelector('.close-icon').addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  });

  mobileMenu.querySelector('.back-arrow').addEventListener('click', () => {
    // Implement back navigation logic if needed for nested menus
  });

  // Accordion functionality for mobile menu
  menuList.querySelectorAll('.accordion').forEach((accordion) => {
    accordion.addEventListener('click', () => {
      accordion.classList.toggle('active');
      const panel = accordion.nextElementSibling;
      if (panel && panel.classList.contains('panel')) {
        panel.classList.toggle('show');
      }
    });
  });

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '79' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
