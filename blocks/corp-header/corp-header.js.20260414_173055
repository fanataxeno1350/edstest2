import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, languageRow, ...itemRows] = [...block.children];

  const navigationItems = itemRows.filter(row => row.children.length === 3);
  const contactItems = itemRows.filter(row => row.children.length === 3 && row.children[0]?.querySelector('picture'));
  const signInItems = itemRows.filter(row => row.children.length === 4);

  block.textContent = '';

  const navbar = document.createElement('div');
  navbar.classList.add('navbar', 'navbar-arena', 'g-container');

  const hamburger = document.createElement('button');
  hamburger.classList.add('nav-hamburger');
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-controls', 'nav');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('nav-hamburger-icon');
  hamburger.appendChild(hamburgerIcon);
  navbar.appendChild(hamburger);

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block');
  const logoSpan = document.createElement('span');
  logoSpan.classList.add('arena');

  const logoPicture = logoRow.querySelector('picture');
  const logoLink = logoLinkRow.querySelector('a');

  if (logoPicture && logoLink) {
    const logoAnchor = document.createElement('a');
    logoAnchor.classList.add('logo__picture');
    logoAnchor.href = logoLink.href;
    logoAnchor.setAttribute('data-logo-name', 'Arena');
    logoAnchor.appendChild(logoPicture.cloneNode(true));
    logoSpan.appendChild(logoAnchor);
  } else if (logoPicture) {
    logoSpan.appendChild(logoPicture.cloneNode(true));
  }
  logoBlock.appendChild(logoSpan);
  logoWrapper.appendChild(logoBlock);
  navbar.appendChild(logoWrapper);

  const linksContainer = document.createElement('div');
  linksContainer.classList.add('links');

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    moveInstrumentation(row, linksContainer);

    const linkTitle = document.createElement('div');
    linkTitle.classList.add('link-title');

    const triggerA = document.createElement('a');
    triggerA.textContent = labelCell?.textContent?.trim();
    if (linkCell?.querySelector('a')) {
      triggerA.href = linkCell.querySelector('a').href;
      triggerA.classList.add('button');
    }
    linkTitle.appendChild(triggerA);

    const hasMenu = hierarchyTreeCell?.querySelector('ul');
    if (hasMenu) {
      const panel = document.createElement('div');
      panel.classList.add('desktop-panel', 'panel');
      const linkGrid = document.createElement('div');
      linkGrid.classList.add('link-grid', 'block');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const column = document.createElement('div');
      column.classList.add('link-grid-column', 'link-column-vertical');

      const ul = hierarchyTreeCell.querySelector('ul');
      const clonedUl = ul.cloneNode(true);
      clonedUl.classList.add('content', 'links-container', 'accordian-content');
      column.appendChild(clonedUl);
      linkContainerSection.appendChild(column);
      linkGrid.appendChild(linkContainerSection);
      panel.appendChild(linkGrid);

      // Add toggle behavior
      triggerA.addEventListener('click', (e) => {
        e.preventDefault();
        panel.classList.toggle('visible');
      });
      linkTitle.addEventListener('mouseenter', () => panel.classList.add('visible'));
      linkTitle.addEventListener('mouseleave', () => panel.classList.remove('visible'));
      panel.addEventListener('mouseenter', () => panel.classList.add('visible'));
      panel.addEventListener('mouseleave', () => panel.classList.remove('visible'));

      linksContainer.appendChild(linkTitle);
      linksContainer.appendChild(panel);
    } else {
      linksContainer.appendChild(linkTitle);
    }
  });

  navbar.appendChild(linksContainer);

  const rightSection = document.createElement('div');
  rightSection.classList.add('right');
  rightSection.id = 'nav-right';

  // Contact Links
  if (contactItems.length > 0) {
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
    contactWrpArena.appendChild(contactTitle);
    contactWrpArena.appendChild(contactTitleIcon);

    const contactIcons = document.createElement('div');
    contactIcons.classList.add('user__contact__icons', 'hidden');

    const contactToggleBox = document.createElement('div');
    contactToggleBox.classList.add('hidden', 'contact-toggle-box');
    const contactIconCallContainer = document.createElement('div');
    contactIconCallContainer.classList.add('user__contact__icon-call_container');

    contactItems.forEach((row) => {
      const [iconCell, linkCell, hierarchyTreeCell] = [...row.children];
      moveInstrumentation(row, contactIcons);

      const link = linkCell?.querySelector('a');
      const iconPicture = iconCell?.querySelector('picture');

      if (link && iconPicture) {
        const contactAnchor = document.createElement('a');
        contactAnchor.classList.add('user__contact--icon');
        contactAnchor.href = link.href;
        contactAnchor.target = link.target;
        if (link.target === '_blank') {
          contactAnchor.rel = 'noopener noreferrer';
        }

        const srOnlySpan = document.createElement('span');
        srOnlySpan.classList.add('sr-only');
        srOnlySpan.textContent = link.textContent?.trim();
        contactAnchor.appendChild(srOnlySpan);

        const img = iconPicture.querySelector('img').cloneNode(true);
        contactAnchor.appendChild(img);

        const iconName = img.alt.toLowerCase();
        contactAnchor.classList.add(iconName);

        if (iconName === 'phone') {
          contactAnchor.addEventListener('click', (e) => {
            e.preventDefault();
            contactToggleBox.classList.toggle('hidden');
          });
          const primaryTelephone = document.createElement('a');
          primaryTelephone.classList.add('primary-telephone');
          primaryTelephone.href = `tel:${link.textContent?.trim()}`;
          primaryTelephone.textContent = link.textContent?.trim();
          contactIconCallContainer.appendChild(primaryTelephone);
        }
        contactIcons.appendChild(contactAnchor);
      }
    });
    contactToggleBox.appendChild(contactIconCallContainer);
    contactWrpArena.appendChild(contactIcons);
    contactWrpArena.appendChild(contactToggleBox);
    contactBlock.appendChild(contactWrpArena);
    contactWrapper.appendChild(contactBlock);
    rightSection.appendChild(contactWrapper);
  }

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = languageRow?.textContent?.trim();
  rightSection.appendChild(languageDiv);

  // Sign In Links
  if (signInItems.length > 0) {
    const signInWrapper = document.createElement('div');
    signInWrapper.classList.add('sign-in-wrapper', 'hidden');
    const signInBlock = document.createElement('div');
    signInBlock.classList.add('sign-in', 'block');
    const userDropdown = document.createElement('div');
    userDropdown.classList.add('user__dropdown');
    const userAccount = document.createElement('div');
    userAccount.classList.add('user__account');

    signInItems.forEach((row) => {
      const [iconCell, linkCell, labelCell] = [...row.children];
      moveInstrumentation(row, userAccount);

      const link = linkCell?.querySelector('a');
      const iconPicture = iconCell?.querySelector('picture');
      const label = labelCell?.textContent?.trim();

      if (link && iconPicture) {
        const userAccountLink = document.createElement('a');
        userAccountLink.classList.add('user__account--link');
        userAccountLink.href = link.href;
        userAccountLink.target = link.target;
        if (link.target === '_blank') {
          userAccountLink.rel = 'noopener noreferrer';
        }
        userAccountLink.classList.add(label.toLowerCase().replace(/\s/g, '-'));

        const listIconSpan = document.createElement('span');
        listIconSpan.classList.add('user__account__list-icon');
        const img = iconPicture.querySelector('img').cloneNode(true);
        listIconSpan.appendChild(img);
        userAccountLink.appendChild(listIconSpan);
        userAccountLink.appendChild(document.createTextNode(label));
        userAccount.appendChild(userAccountLink);
      } else if (label && iconPicture) { // Handle Sign In button specifically
        const userAccountLink = document.createElement('div');
        userAccountLink.classList.add('user__account--link', 'sign-in-btn');

        const listIconSpan = document.createElement('span');
        listIconSpan.classList.add('user__account__list-icon');
        const img = iconPicture.querySelector('img').cloneNode(true);
        listIconSpan.appendChild(img);
        userAccountLink.appendChild(listIconSpan);

        const signInButton = document.createElement('button');
        signInButton.type = 'button';
        signInButton.setAttribute('data-sign-out-text', 'Sign Out');
        signInButton.textContent = label;
        userAccountLink.appendChild(signInButton);
        userAccount.appendChild(userAccountLink);
      }
    });

    userDropdown.appendChild(userAccount);
    signInBlock.appendChild(userDropdown);
    signInWrapper.appendChild(signInBlock);
    rightSection.appendChild(signInWrapper);
  }

  navbar.appendChild(rightSection);
  block.appendChild(navbar);

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
  const closeIcon = document.createElement('span');
  closeIcon.classList.add('close-icon');
  menuHeader.appendChild(backArrow);
  menuHeader.appendChild(menuTitle);
  menuHeader.appendChild(closeIcon);
  mobileMenu.appendChild(menuHeader);

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');

  navigationItems.forEach((row, i) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.id = `menu-item-${i}`;
    li.classList.add('nav-link');
    moveInstrumentation(row, li);

    const linkTitleSpan = document.createElement('span');
    linkTitleSpan.classList.add('menu-title');

    const linkText = labelCell?.textContent?.trim();
    const linkHref = linkCell?.querySelector('a')?.href;

    const hasMenu = hierarchyTreeCell?.querySelector('ul');
    if (hasMenu) {
      li.classList.add('accordion');
      linkTitleSpan.textContent = linkText;
      li.appendChild(linkTitleSpan);

      const panel = document.createElement('div');
      panel.classList.add('panel');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const column = document.createElement('div');
      column.classList.add('link-grid-column', 'link-column-vertical');

      const ul = hierarchyTreeCell.querySelector('ul');
      const clonedUl = ul.cloneNode(true);
      clonedUl.classList.add('content', 'links-container', 'accordian-content');
      column.appendChild(clonedUl);
      linkContainerSection.appendChild(column);
      panel.appendChild(linkContainerSection);
      mobileMenu.appendChild(panel);

      li.addEventListener('click', () => {
        li.classList.toggle('active');
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        }
      });
    } else {
      const anchor = document.createElement('a');
      anchor.href = linkHref;
      anchor.textContent = linkText;
      anchor.classList.add('button');
      linkTitleSpan.appendChild(anchor);
      li.appendChild(linkTitleSpan);
    }
    menuList.appendChild(li);
  });

  // Add sign-in items to mobile menu
  signInItems.forEach((row) => {
    const [iconCell, linkCell, labelCell] = [...row.children];
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const link = linkCell?.querySelector('a');
    const iconPicture = iconCell?.querySelector('picture');
    const label = labelCell?.textContent?.trim();

    if (link && iconPicture) {
      const userAccountLink = document.createElement('a');
      userAccountLink.classList.add('user__account--link');
      userAccountLink.href = link.href;
      userAccountLink.target = link.target;
      if (link.target === '_blank') {
        userAccountLink.rel = 'noopener noreferrer';
      }
      userAccountLink.classList.add(label.toLowerCase().replace(/\s/g, '-'));

      const listIconSpan = document.createElement('span');
      listIconSpan.classList.add('user__account__list-icon');
      const img = iconPicture.querySelector('img').cloneNode(true);
      listIconSpan.appendChild(img);
      userAccountLink.appendChild(listIconSpan);
      userAccountLink.appendChild(document.createTextNode(label));
      li.appendChild(userAccountLink);
    } else if (label && iconPicture) {
      const userAccountLink = document.createElement('div');
      userAccountLink.classList.add('user__account--link', 'sign-in-btn');

      const listIconSpan = document.createElement('span');
      listIconSpan.classList.add('user__account__list-icon');
      const img = iconPicture.querySelector('img').cloneNode(true);
      listIconSpan.appendChild(img);
      userAccountLink.appendChild(listIconSpan);

      const signInButton = document.createElement('button');
      signInButton.type = 'button';
      signInButton.setAttribute('data-sign-out-text', 'Sign Out');
      signInButton.textContent = label;
      userAccountLink.appendChild(signInButton);
      li.appendChild(userAccountLink);
    }
    menuList.appendChild(li);
  });

  mobileMenu.appendChild(menuList);
  block.appendChild(mobileMenu);

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    document.documentElement.classList.toggle('no-scroll');
  });

  closeIcon.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    document.documentElement.classList.remove('no-scroll');
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
