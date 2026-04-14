import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [logoRow, logoLinkRow, languageRow, ...itemRows] = children;

  block.textContent = '';

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
  const logoPictureLink = document.createElement('a');
  logoPictureLink.classList.add('logo__picture');
  logoPictureLink.setAttribute('data-logo-name', 'Arena');

  const logoLink = logoLinkRow.querySelector('a');
  if (logoLink) {
    logoPictureLink.href = logoLink.href;
  }

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    moveInstrumentation(logoRow.firstElementChild, logoPictureLink);
    logoPictureLink.append(logoPicture);
  } else {
    moveInstrumentation(logoRow.firstElementChild, logoPictureLink);
  }

  arenaSpan.append(logoPictureLink);
  logoBlock.append(arenaSpan);
  logoWrapper.append(logoBlock);
  navbarArena.append(logoWrapper);

  // Navigation Links
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');

  const navigationItems = itemRows.filter((row) => row.children.length === 3 && row.children[1].querySelector('a'));
  const contactLinkItems = itemRows.filter((row) => row.children.length === 3 && row.children[0].querySelector('picture'));
  const signInLinkItems = itemRows.filter((row) => row.children.length === 4);

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const linkTitle = document.createElement('div');
    linkTitle.classList.add('link-title');
    const span = document.createElement('span');
    const subList = hierarchyTreeCell?.querySelector('ul');

    if (subList) {
      // Dropdown / accordion item
      const labelText = labelCell.textContent.trim();
      span.textContent = labelText;
      linkTitle.append(span);
      linksDiv.append(linkTitle);

      const desktopPanel = document.createElement('div');
      desktopPanel.classList.add('desktop-panel', 'panel', labelText.toLowerCase().replace(/\s/g, '-'));
      const linkGrid = document.createElement('div');
      linkGrid.classList.add('link-grid', 'block');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical'); // Assuming vertical for now

      subList.classList.add('content', 'links-container', 'accordian-content');
      moveInstrumentation(hierarchyTreeCell, subList);
      linkGridColumn.append(subList);
      linkContainerSection.append(linkGridColumn);
      linkGrid.append(linkContainerSection);
      desktopPanel.append(linkGrid);
      linksDiv.append(desktopPanel);

      // Add event listener for desktop panel toggle
      linkTitle.addEventListener('click', () => {
        desktopPanel.classList.toggle('show');
        linkTitle.classList.toggle('active');
      });
    } else {
      // Simple flat link
      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
        anchor.textContent = labelCell.textContent.trim();
        anchor.classList.add('button');
        moveInstrumentation(row, anchor);
        span.append(anchor);
        linkTitle.append(span);
        linksDiv.append(linkTitle);
      }
    }
  });

  navbarArena.append(linksDiv);

  // Right section (Contact, Language, Sign In)
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
  const contactIcon = document.createElement('span');
  contactIcon.classList.add('user__contact-title', 'icon-phone');
  contactIcon.setAttribute('aria-label', 'Contact Us');
  contactWrpArena.append(contactTitle, contactIcon);

  const contactIconsDiv = document.createElement('div');
  contactIconsDiv.classList.add('user__contact__icons', 'hidden');

  contactLinkItems.forEach((row) => {
    const [iconCell, linkCell] = [...row.children];
    const iconPicture = iconCell.querySelector('picture');
    const link = linkCell.querySelector('a');

    if (link && iconPicture) {
      const contactIconLink = document.createElement('a');
      contactIconLink.href = link.href;
      contactIconLink.classList.add('user__contact--icon');

      const img = iconPicture.querySelector('img');
      if (img) {
        const spanSrOnly = document.createElement('span');
        spanSrOnly.classList.add('sr-only');
        spanSrOnly.textContent = img.alt;
        contactIconLink.append(spanSrOnly);

        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt;
        newImg.loading = 'lazy';
        moveInstrumentation(iconCell.firstElementChild, newImg);
        contactIconLink.append(newImg);
      }

      if (link.href.includes('wa.me')) {
        contactIconLink.classList.add('whatsapp');
        contactIconLink.target = '_blank';
        contactIconLink.rel = 'noopener noreferrer';
      } else if (link.href.startsWith('mailto:')) {
        contactIconLink.classList.add('email');
      } else if (link.href.startsWith('tel:')) {
        contactIconLink.classList.add('phone');
        contactIconLink.addEventListener('click', (event) => {
          event.preventDefault();
          contactWrpArena.querySelector('.contact-toggle-box').classList.toggle('hidden');
        });
      }
      contactIconsDiv.append(contactIconLink);
    }
  });

  contactWrpArena.append(contactIconsDiv);

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const userContactIconCallContainer = document.createElement('div');
  userContactIconCallContainer.classList.add('user__contact__icon-call_container');

  const phoneLinks = contactLinkItems.filter((row) => row.children[1].querySelector('a')?.href.startsWith('tel:'));
  if (phoneLinks.length > 0) {
    const primaryPhoneLink = document.createElement('a');
    primaryPhoneLink.classList.add('primary-telephone');
    const primaryLink = phoneLinks[0].children[1].querySelector('a');
    if (primaryLink) {
      primaryPhoneLink.href = primaryLink.href;
      primaryPhoneLink.textContent = primaryLink.textContent.trim();
    }
    userContactIconCallContainer.append(primaryPhoneLink);

    if (phoneLinks.length > 1) {
      const secondaryPhoneLink = document.createElement('a');
      secondaryPhoneLink.classList.add('secondary-telephone');
      const secondaryLink = phoneLinks[1].children[1].querySelector('a');
      if (secondaryLink) {
        secondaryPhoneLink.href = secondaryLink.href;
        secondaryPhoneLink.textContent = secondaryLink.textContent.trim();
      }
      userContactIconCallContainer.append(secondaryPhoneLink);
    }
  }

  contactToggleBox.append(userContactIconCallContainer);
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

  // Sign In Links
  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden');
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  signInLinkItems.forEach((row) => {
    const [iconCell, linkCell, labelCell] = [...row.children];
    const iconPicture = iconCell.querySelector('picture');
    const link = linkCell.querySelector('a');
    const label = labelCell.textContent.trim();
    const subList = row.children[3]?.querySelector('ul'); // hierarchy-tree

    if (subList) {
      // This case is for a dropdown for Sign-In, if needed. The original HTML only shows flat links.
      // For now, following the original HTML's flat structure for sign-in links.
      // If a dropdown is needed, this would be similar to navigation items.
    } else if (link) {
      const userAccountLink = document.createElement('a');
      userAccountLink.classList.add('user__account--link');
      userAccountLink.href = link.href;
      userAccountLink.textContent = label;
      userAccountLink.target = '_self'; // Assuming _self based on original HTML

      const spanIcon = document.createElement('span');
      spanIcon.classList.add('user__account__list-icon');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        if (img) {
          const newImg = document.createElement('img');
          newImg.src = img.src;
          newImg.alt = img.alt;
          newImg.loading = 'lazy';
          moveInstrumentation(iconCell.firstElementChild, newImg);
          spanIcon.append(newImg);
        }
      }
      userAccountLink.prepend(spanIcon);

      if (label.toLowerCase().includes('sign in')) {
        const signInBtnDiv = document.createElement('div');
        signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
        signInBtnDiv.append(spanIcon);
        const signInButton = document.createElement('button');
        signInButton.setAttribute('type', 'button');
        signInButton.setAttribute('data-sign-out-text', 'Sign Out');
        signInButton.textContent = 'Sign In';
        signInBtnDiv.append(signInButton);
        userAccount.append(signInBtnDiv);

        signInButton.addEventListener('click', () => {
          // Implement sign-in/sign-out logic here
          // For now, just toggling a class
          signInWrapper.classList.toggle('active');
        });
      } else {
        userAccountLink.classList.add(label.toLowerCase().replace(/\s/g, '-'));
        userAccount.append(userAccountLink);
      }
    }
  });

  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightDiv.append(signInWrapper);

  navbarArena.append(rightDiv);

  // Mobile menu
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

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('nav-link');
    const subList = hierarchyTreeCell?.querySelector('ul');
    const menuTitleSpan = document.createElement('span');
    menuTitleSpan.classList.add('menu-title');

    if (subList) {
      li.classList.add('accordion', labelCell.textContent.trim().toLowerCase().replace(/\s/g, '-'));
      menuTitleSpan.textContent = labelCell.textContent.trim();
      li.append(menuTitleSpan);

      const panelDiv = document.createElement('div');
      panelDiv.classList.add('panel');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

      subList.classList.add('content', 'links-container', 'accordian-content');
      moveInstrumentation(hierarchyTreeCell, subList);
      linkGridColumn.append(subList);
      linkContainerSection.append(linkGridColumn);
      panelDiv.append(linkContainerSection);
      li.append(panelDiv);

      li.addEventListener('click', () => {
        li.classList.toggle('active');
        panelDiv.classList.toggle('show');
      });
    } else {
      li.classList.add(labelCell.textContent.trim().toLowerCase().replace(/\s/g, '-'));
      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
        anchor.title = labelCell.textContent.trim().toLowerCase().replace(/\s/g, '-');
        anchor.classList.add('button');
        anchor.textContent = labelCell.textContent.trim();
        moveInstrumentation(row, anchor);
      }
      menuTitleSpan.append(anchor);
      li.append(menuTitleSpan);
    }
    menuList.append(li);
  });

  signInLinkItems.forEach((row) => {
    const [iconCell, linkCell, labelCell] = [...row.children];
    const link = linkCell.querySelector('a');
    const label = labelCell.textContent.trim();
    const li = document.createElement('li');

    if (link) {
      if (label.toLowerCase().includes('sign in')) {
        const signInBtnDiv = document.createElement('div');
        signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
        const spanIcon = document.createElement('span');
        spanIcon.classList.add('user__account__list-icon');
        const iconPicture = iconCell.querySelector('picture');
        if (iconPicture) {
          const img = iconPicture.querySelector('img');
          if (img) {
            const newImg = document.createElement('img');
            newImg.src = img.src;
            newImg.alt = img.alt;
            newImg.loading = 'lazy';
            moveInstrumentation(iconCell.firstElementChild, newImg);
            spanIcon.append(newImg);
          }
        }
        signInBtnDiv.append(spanIcon);
        const signInButton = document.createElement('button');
        signInButton.setAttribute('type', 'button');
        signInButton.setAttribute('data-sign-out-text', 'Sign Out');
        signInButton.textContent = 'Sign In';
        signInBtnDiv.append(signInButton);
        li.append(signInBtnDiv);

        signInButton.addEventListener('click', () => {
          // Implement sign-in/sign-out logic here
        });
      } else {
        const userAccountLink = document.createElement('a');
        userAccountLink.classList.add('user__account--link', label.toLowerCase().replace(/\s/g, '-'));
        userAccountLink.href = link.href;
        userAccountLink.target = '_self';
        const spanIcon = document.createElement('span');
        spanIcon.classList.add('user__account__list-icon');
        const iconPicture = iconCell.querySelector('picture');
        if (iconPicture) {
          const img = iconPicture.querySelector('img');
          if (img) {
            const newImg = document.createElement('img');
            newImg.src = img.src;
            newImg.alt = img.alt;
            newImg.loading = 'lazy';
            moveInstrumentation(iconCell.firstElementChild, newImg);
            spanIcon.append(newImg);
          }
        }
        userAccountLink.append(spanIcon);
        userAccountLink.append(label);
        li.append(userAccountLink);
      }
    }
    menuList.append(li);
  });

  mobileMenu.append(menuList);
  block.append(navbarArena, mobileMenu);

  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    document.body.classList.toggle('no-scroll');
  });

  closeIcon.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
