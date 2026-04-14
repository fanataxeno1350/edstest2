import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Identify rows based on content and structure
  const logoRow = children.find(row => row.querySelector('picture'));
  const logoLinkRow = children.find(row => row.querySelector('a') && row.textContent.includes('Logo Link'));
  const languageRow = children.find(row => row.textContent.trim().toLowerCase().includes('language'));

  const itemRows = children.filter(row =>
    row !== logoRow &&
    row !== logoLinkRow &&
    row !== languageRow
  );

  block.innerHTML = '';
  block.classList.add('navbar', 'navbar-arena', 'g-container');

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
  block.append(navHamburger);

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block');
  logoWrapper.append(logoBlock);

  const logoSpan = document.createElement('span');
  logoSpan.classList.add('arena');

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  const foundLogoLink = logoLinkRow?.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    logoLink.setAttribute('data-logo-name', 'Arena');
  }

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    moveInstrumentation(logoRow, logoPicture);
    logoLink.append(logoPicture);
  }
  if (logoLinkRow) { // Ensure logoLinkRow exists before moving instrumentation
    moveInstrumentation(logoLinkRow, logoLink);
  }
  logoSpan.append(logoLink);
  logoBlock.append(logoSpan);
  block.append(logoWrapper);

  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');
  block.append(linksDiv);

  // Content detection for item rows
  const navigationItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && !cells[0].querySelector('picture') && !cells[2].querySelector('picture');
  });
  const contactLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('picture');
  });
  const signInLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 4 && cells[0].querySelector('picture');
  });

  const desktopPanelCorporate = document.createElement('div');
  desktopPanelCorporate.classList.add('desktop-panel', 'panel', 'corporate');
  const corporateLinkGrid = document.createElement('div');
  corporateLinkGrid.classList.add('link-grid', 'block');
  const corporateLinkContainerSection = document.createElement('div');
  corporateLinkContainerSection.classList.add('link-container-section');
  corporateLinkGrid.append(corporateLinkContainerSection);
  desktopPanelCorporate.append(corporateLinkGrid);

  const desktopPanelSales = document.createElement('div');
  desktopPanelSales.classList.add('desktop-panel', 'panel', 'sales');
  const salesLinkGrid = document.createElement('div');
  salesLinkGrid.classList.add('link-grid', 'block');
  const salesLinkContainerSection = document.createElement('div');
  salesLinkContainerSection.classList.add('link-container-section');
  salesLinkGrid.append(salesLinkContainerSection);
  desktopPanelSales.append(salesLinkGrid);

  const desktopPanelMore = document.createElement('div');
  desktopPanelMore.classList.add('desktop-panel', 'panel', 'more');
  const moreLinkGrid = document.createElement('div');
  moreLinkGrid.classList.add('link-grid', 'block');
  const moreLinkContainerSection = document.createElement('div');
  moreLinkContainerSection.classList.add('link-container-section');
  moreLinkGrid.append(moreLinkContainerSection);
  desktopPanelMore.append(moreLinkGrid);

  const navMenu = document.createElement('div');
  navMenu.id = 'menu';
  navMenu.classList.add('menu', 'hidden', 'menu-arena');
  const menuHeader = document.createElement('div');
  menuHeader.classList.add('menu-header');
  menuHeader.innerHTML = `
    <div class="back-arrow"></div>
    <span class="menu-title">Menu</span>
    <span class="close-icon"></span>
  `;
  navMenu.append(menuHeader);
  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');
  navMenu.append(menuList);

  let navItemIndex = 0;
  navigationItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const linkCell = cells[1];
    const hierarchyTreeCell = cells[2];

    const subList = hierarchyTreeCell?.querySelector('ul');
    const li = document.createElement('li');
    li.id = `menu-item-${navItemIndex}`;
    moveInstrumentation(row, li);

    if (subList) {
      li.classList.add('accordion', 'nav-link', labelCell.textContent.trim().toLowerCase().replace(/\s/g, '-'));
      const menuTitleSpan = document.createElement('span');
      menuTitleSpan.classList.add('menu-title');
      menuTitleSpan.textContent = labelCell.textContent.trim();
      li.append(menuTitleSpan);

      const panelDiv = document.createElement('div');
      panelDiv.classList.add('panel');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
      linkGridColumn.append(subList);
      linkContainerSection.append(linkGridColumn);
      panelDiv.append(linkContainerSection);
      menuList.append(li, panelDiv);

      const desktopLinkTitle = document.createElement('div');
      desktopLinkTitle.classList.add('link-title');
      desktopLinkTitle.innerHTML = `<span>${labelCell.textContent.trim()}</span>`;
      linksDiv.append(desktopLinkTitle);

      // Determine which desktop panel to append to and add event listener
      const labelText = labelCell.textContent.trim().toLowerCase();
      let targetDesktopPanel = null;
      if (labelText === 'corporate') {
        targetDesktopPanel = desktopPanelCorporate;
      } else if (labelText === 'sales') {
        targetDesktopPanel = desktopPanelSales;
      } else if (labelText.includes('more')) { // "More From us"
        targetDesktopPanel = desktopPanelMore;
      }

      if (targetDesktopPanel) {
        desktopLinkTitle.addEventListener('click', () => {
          // Close other panels
          [desktopPanelCorporate, desktopPanelSales, desktopPanelMore].forEach(panel => {
            if (panel !== targetDesktopPanel) {
              panel.classList.remove('show');
            }
          });
          targetDesktopPanel.classList.toggle('show');
        });
        targetDesktopPanel.querySelector('.link-container-section').append(linkGridColumn.cloneNode(true));
        linksDiv.append(targetDesktopPanel);
      }
    } else {
      li.classList.add('nav-link', labelCell.textContent.trim().toLowerCase().replace(/\s/g, '-'));
      const menuTitleSpan = document.createElement('span');
      menuTitleSpan.classList.add('menu-title');
      const anchor = document.createElement('a');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      }
      anchor.textContent = labelCell.textContent.trim();
      anchor.classList.add('button');
      menuTitleSpan.append(anchor);
      li.append(menuTitleSpan);
      menuList.append(li);

      const desktopLinkTitle = document.createElement('div');
      desktopLinkTitle.classList.add('link-title');
      const desktopAnchor = document.createElement('a');
      const desktopFoundLink = linkCell?.querySelector('a');
      if (desktopFoundLink) {
        desktopAnchor.href = desktopFoundLink.href;
      }
      desktopAnchor.textContent = labelCell.textContent.trim();
      desktopAnchor.classList.add('button');
      desktopLinkTitle.append(desktopAnchor);
      linksDiv.append(desktopLinkTitle);
    }
    navItemIndex += 1;
  });

  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';
  block.append(rightDiv);

  const contactWrapper = document.createElement('div');
  contactWrapper.classList.add('contact-wrapper');
  const contactBlock = document.createElement('div');
  contactBlock.classList.add('contact', 'block');
  contactWrapper.append(contactBlock);

  const contactWrpArena = document.createElement('div');
  contactWrpArena.classList.add('contact_wrp_arena', 'user__contact', 'header');
  contactBlock.append(contactWrpArena);

  const contactTitle = document.createElement('h4');
  contactTitle.classList.add('user__contact-title');
  contactTitle.textContent = 'Contact Us';
  contactWrpArena.append(contactTitle);

  const contactTitleIcon = document.createElement('span');
  contactTitleIcon.classList.add('user__contact-title', 'icon-phone');
  contactTitleIcon.setAttribute('aria-label', 'Contact Us');
  contactWrpArena.append(contactTitleIcon);

  const contactIconsDiv = document.createElement('div');
  contactIconsDiv.classList.add('user__contact__icons', 'hidden');
  contactWrpArena.append(contactIconsDiv);

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const contactCallContainer = document.createElement('div');
  contactCallContainer.classList.add('user__contact__icon-call_container');
  contactToggleBox.append(contactCallContainer);
  contactWrpArena.append(contactToggleBox);

  // Event listener for the phone icon to toggle the contact box
  contactTitleIcon.addEventListener('click', () => {
    contactIconsDiv.classList.toggle('hidden');
    contactToggleBox.classList.add('hidden'); // Hide call container if icons are shown
  });

  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells[0];
    const linkCell = cells[1];
    // const hierarchyTreeCell = cells[2]; // Not used for flat contact links

    const iconAnchor = document.createElement('a');
    iconAnchor.classList.add('user__contact--icon');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      iconAnchor.href = foundLink.href;
      if (foundLink.href.includes('wa.me')) {
        iconAnchor.classList.add('whatsapp');
        iconAnchor.setAttribute('target', '_blank');
        iconAnchor.setAttribute('rel', 'noopener noreferrer');
      } else if (foundLink.href.startsWith('mailto:')) {
        iconAnchor.classList.add('email');
      } else if (foundLink.href.startsWith('tel:')) {
        iconAnchor.classList.add('phone');
        iconAnchor.addEventListener('click', (e) => {
          e.preventDefault();
          contactToggleBox.classList.toggle('hidden');
          contactIconsDiv.classList.add('hidden'); // Hide other icons if call container is shown
        });
      }
    }

    const srOnlySpan = document.createElement('span');
    srOnlySpan.classList.add('sr-only');
    if (iconAnchor.classList.contains('phone')) srOnlySpan.textContent = 'phone';
    if (iconAnchor.classList.contains('whatsapp')) srOnlySpan.textContent = 'whatsapp';
    if (iconAnchor.classList.contains('email')) srOnlySpan.textContent = 'email';
    iconAnchor.append(srOnlySpan);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      if (img) {
        const iconImg = document.createElement('img');
        iconImg.src = img.src;
        iconImg.alt = img.alt;
        iconImg.setAttribute('loading', 'lazy');
        iconAnchor.append(iconImg);
      }
    }
    moveInstrumentation(row, iconAnchor);
    contactIconsDiv.append(iconAnchor);

    if (iconAnchor.classList.contains('phone')) {
      const primaryTelephone = document.createElement('a');
      primaryTelephone.classList.add('primary-telephone');
      primaryTelephone.href = foundLink.href;
      primaryTelephone.textContent = foundLink.textContent.trim();
      contactCallContainer.append(primaryTelephone);
      const secondaryTelephone = document.createElement('a');
      secondaryTelephone.classList.add('secondary-telephone');
      secondaryTelephone.href = ''; // Original HTML has empty href for secondary
      contactCallContainer.append(secondaryTelephone);
    }
  });

  rightDiv.append(contactWrapper);

  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  if (languageRow) { // Ensure languageRow exists
    languageDiv.textContent = languageRow.textContent.trim();
    moveInstrumentation(languageRow, languageDiv);
  }
  rightDiv.append(languageDiv);

  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden');
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  signInWrapper.append(signInBlock);

  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');
  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);

  signInLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells[0];
    const linkCell = cells[1];
    const labelCell = cells[2];
    // const hierarchyTreeCell = cells[3]; // Not used for flat sign-in links

    const linkType = labelCell.textContent.trim().toLowerCase().replace(/\s/g, '-');
    if (linkType === 'sign-in') {
      const signInBtnDiv = document.createElement('div');
      signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
      const iconSpan = document.createElement('span');
      iconSpan.classList.add('user__account__list-icon');
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        if (img) {
          const iconImg = document.createElement('img');
          iconImg.src = img.src;
          iconImg.alt = img.alt;
          iconImg.setAttribute('loading', 'lazy');
          iconSpan.append(iconImg);
        }
      }
      signInBtnDiv.append(iconSpan);
      const signInButton = document.createElement('button');
      signInButton.setAttribute('type', 'button');
      signInButton.setAttribute('data-sign-out-text', 'Sign Out');
      signInButton.textContent = labelCell.textContent.trim();
      signInBtnDiv.append(signInButton);
      moveInstrumentation(row, signInBtnDiv);
      userAccount.append(signInBtnDiv);
    } else {
      const anchor = document.createElement('a');
      anchor.classList.add('user__account--link', linkType);
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
        anchor.setAttribute('target', '_self');
      }
      const iconSpan = document.createElement('span');
      iconSpan.classList.add('user__account__list-icon');
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        if (img) {
          const iconImg = document.createElement('img');
          iconImg.src = img.src;
          iconImg.alt = img.alt;
          iconImg.setAttribute('loading', 'lazy');
          iconSpan.append(iconImg);
        }
      }
      anchor.append(iconSpan);
      anchor.textContent = labelCell.textContent.trim();
      moveInstrumentation(row, anchor);
      userAccount.append(anchor);
    }
  });

  rightDiv.append(signInWrapper);

  block.append(navMenu);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Hamburger menu toggle
  hamburgerButton.addEventListener('click', () => {
    navMenu.classList.toggle('hidden');
    hamburgerButton.setAttribute('aria-expanded', navMenu.classList.contains('hidden') ? 'false' : 'true');
  });

  menuHeader.querySelector('.close-icon').addEventListener('click', () => {
    navMenu.classList.add('hidden');
    hamburgerButton.setAttribute('aria-expanded', 'false');
  });

  menuList.querySelectorAll('li.accordion').forEach((accordionItem) => {
    const menuTitle = accordionItem.querySelector('.menu-title');
    const panel = accordionItem.nextElementSibling;
    if (menuTitle && panel) {
      menuTitle.addEventListener('click', () => {
        panel.classList.toggle('show');
        accordionItem.classList.toggle('active');
      });
    }
  });
}
