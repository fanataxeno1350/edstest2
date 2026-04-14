import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, languageRow, ...itemRows] = [...block.children];

  // Separate item types
  const navigationItems = itemRows.filter(row => row.children.length === 3);
  const contactItems = itemRows.filter(row => row.children.length === 3 && row.children[0]?.querySelector('picture'));
  const signInItems = itemRows.filter(row => row.children.length === 4);

  block.textContent = '';

  const navbar = document.createElement('div');
  navbar.classList.add('navbar', 'navbar-arena', 'g-container');

  // Hamburger menu
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  const hamburgerButton = document.createElement('button');
  hamburgerButton.setAttribute('type', 'button');
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('nav-hamburger-icon');
  hamburgerButton.appendChild(hamburgerIcon);
  hamburger.appendChild(hamburgerButton);
  navbar.appendChild(hamburger);

  // Logo Section
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block');
  const arenaSpan = document.createElement('span');
  arenaSpan.classList.add('arena');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  logoLink.href = logoLinkRow.children[0]?.querySelector('a')?.href || '/';
  logoLink.setAttribute('data-logo-name', 'Arena');

  const logoPicture = logoRow.children[0]?.querySelector('picture')?.cloneNode(true);
  if (logoPicture) {
    logoLink.appendChild(logoPicture);
  }
  arenaSpan.appendChild(logoLink);
  logoBlock.appendChild(arenaSpan);
  logoWrapper.appendChild(logoBlock);
  navbar.appendChild(logoWrapper);

  // Links Container (Desktop Navigation)
  const linksContainer = document.createElement('div');
  linksContainer.classList.add('links');
  navbar.appendChild(linksContainer);

  navigationItems.forEach((row, index) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];

    const linkTitle = document.createElement('div');
    linkTitle.classList.add('link-title');
    const labelSpan = document.createElement('span');
    const linkAnchor = linkCell?.querySelector('a')?.cloneNode(true) || document.createElement('a');
    linkAnchor.textContent = labelCell?.textContent?.trim();
    if (!linkAnchor.href) {
      linkAnchor.href = '#'; // Default if no link provided
      linkAnchor.addEventListener('click', (e) => e.preventDefault());
    }
    labelSpan.appendChild(linkAnchor);
    linkTitle.appendChild(labelSpan);
    linksContainer.appendChild(linkTitle);

    const hasMenu = hierarchyTreeCell?.querySelector('ul');
    if (hasMenu) {
      const panel = document.createElement('div');
      panel.classList.add('desktop-panel', 'panel');
      panel.classList.add(labelCell.textContent?.trim().toLowerCase().replace(/\s/g, '-') || `nav-panel-${index}`);

      const linkGridBlock = document.createElement('div');
      linkGridBlock.classList.add('link-grid', 'block');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      linkGridBlock.appendChild(linkContainerSection);

      // Clone and wrap the ULs from the hierarchy-tree
      const uls = hierarchyTreeCell.querySelectorAll('ul');
      uls.forEach(ul => {
        const column = document.createElement('div');
        column.classList.add('link-grid-column', 'link-column-vertical');
        const clonedUl = ul.cloneNode(true);
        clonedUl.classList.add('content', 'links-container', 'accordian-content');
        column.appendChild(clonedUl);
        linkContainerSection.appendChild(column);
      });

      panel.appendChild(linkGridBlock);
      linksContainer.appendChild(panel);

      // Add hover/click behavior for desktop
      let hoverTimeout;
      linkTitle.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        document.querySelectorAll('.desktop-panel.visible').forEach(p => p.classList.remove('visible'));
        panel.classList.add('visible');
      });
      linkTitle.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
          panel.classList.remove('visible');
        }, 200); // Small delay to allow moving between linkTitle and panel
      });
      panel.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimeout);
        panel.classList.add('visible');
      });
      panel.addEventListener('mouseleave', () => {
        hoverTimeout = setTimeout(() => {
          panel.classList.remove('visible');
        }, 200);
      });
    }
  });

  // Right section (Contact, Language, Sign-in)
  const rightSection = document.createElement('div');
  rightSection.classList.add('right');
  rightSection.id = 'nav-right';
  navbar.appendChild(rightSection);

  // Contact Wrapper
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
    const contactIconPhone = document.createElement('span');
    contactIconPhone.classList.add('user__contact-title', 'icon-phone');
    contactIconPhone.setAttribute('aria-label', 'Contact Us');
    contactWrpArena.appendChild(contactTitle);
    contactWrpArena.appendChild(contactIconPhone);

    const userContactIcons = document.createElement('div');
    userContactIcons.classList.add('user__contact__icons', 'hidden');

    const contactToggleBox = document.createElement('div');
    contactToggleBox.classList.add('hidden', 'contact-toggle-box');
    const userContactIconCallContainer = document.createElement('div');
    userContactIconCallContainer.classList.add('user__contact__icon-call_container');
    contactToggleBox.appendChild(userContactIconCallContainer);

    contactItems.forEach(row => {
      const [iconCell, linkCell] = [...row.children];
      const iconImg = iconCell?.querySelector('picture')?.cloneNode(true);
      const linkA = linkCell?.querySelector('a')?.cloneNode(true);

      if (linkA && iconImg) {
        const iconWrapper = document.createElement('a');
        iconWrapper.classList.add('user__contact--icon');
        iconWrapper.href = linkA.href;

        const linkText = linkA.textContent?.trim().toLowerCase();
        if (linkText.includes('phone') || linkA.href.startsWith('tel:')) {
          iconWrapper.classList.add('phone');
          iconWrapper.addEventListener('click', (e) => {
            e.preventDefault();
            contactToggleBox.classList.toggle('hidden');
          });
          const srOnly = document.createElement('span');
          srOnly.classList.add('sr-only');
          srOnly.textContent = 'phone';
          iconWrapper.appendChild(srOnly);
          iconWrapper.appendChild(iconImg);

          const primaryTelephone = document.createElement('a');
          primaryTelephone.classList.add('primary-telephone');
          primaryTelephone.href = linkA.href;
          primaryTelephone.textContent = linkA.textContent?.trim();
          userContactIconCallContainer.appendChild(primaryTelephone);

        } else if (linkText.includes('whatsapp') || linkA.href.includes('wa.me')) {
          iconWrapper.classList.add('whatsapp');
          iconWrapper.target = '_blank';
          iconWrapper.rel = 'noopener noreferrer';
          const srOnly = document.createElement('span');
          srOnly.classList.add('sr-only');
          srOnly.textContent = 'whatsapp';
          iconWrapper.appendChild(srOnly);
          iconWrapper.appendChild(iconImg);
        } else if (linkText.includes('email') || linkA.href.startsWith('mailto:')) {
          iconWrapper.classList.add('email');
          const srOnly = document.createElement('span');
          srOnly.classList.add('sr-only');
          srOnly.textContent = 'email';
          iconWrapper.appendChild(srOnly);
          iconWrapper.appendChild(iconImg);
        }
        userContactIcons.appendChild(iconWrapper);
      }
    });
    contactWrpArena.appendChild(userContactIcons);
    contactWrpArena.appendChild(contactToggleBox);
    contactBlock.appendChild(contactWrpArena);
    contactWrapper.appendChild(contactBlock);
    rightSection.appendChild(contactWrapper);
  }

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = languageRow?.children[0]?.textContent?.trim() || 'EN';
  rightSection.appendChild(languageDiv);

  // Sign-in Wrapper
  if (signInItems.length > 0) {
    const signInWrapper = document.createElement('div');
    signInWrapper.classList.add('sign-in-wrapper', 'hidden'); // Hidden by default
    const signInBlock = document.createElement('div');
    signInBlock.classList.add('sign-in', 'block');
    const userDropdown = document.createElement('div');
    userDropdown.classList.add('user__dropdown');
    const userAccount = document.createElement('div');
    userAccount.classList.add('user__account');

    signInItems.forEach(row => {
      const [iconCell, linkCell, labelCell] = [...row.children];
      const iconImg = iconCell?.querySelector('picture')?.cloneNode(true);
      const linkA = linkCell?.querySelector('a')?.cloneNode(true);
      const labelText = labelCell?.textContent?.trim();

      if (linkA && iconImg) {
        const accountLink = document.createElement('a');
        accountLink.classList.add('user__account--link');
        accountLink.href = linkA.href;
        accountLink.textContent = labelText;
        accountLink.target = linkA.target;
        accountLink.rel = linkA.rel;

        const listIconSpan = document.createElement('span');
        listIconSpan.classList.add('user__account__list-icon');
        listIconSpan.appendChild(iconImg);
        accountLink.prepend(listIconSpan);

        if (labelText?.toLowerCase() === 'sign in') {
          const signInBtnDiv = document.createElement('div');
          signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
          const signInButton = document.createElement('button');
          signInButton.setAttribute('type', 'button');
          signInButton.setAttribute('data-sign-out-text', 'Sign Out');
          signInButton.textContent = 'Sign In';
          signInBtnDiv.appendChild(listIconSpan.cloneNode(true)); // Re-use icon
          signInBtnDiv.appendChild(signInButton);
          userAccount.appendChild(signInBtnDiv);
        } else {
          userAccount.appendChild(accountLink);
        }
      }
    });

    userDropdown.appendChild(userAccount);
    signInBlock.appendChild(userDropdown);
    signInWrapper.appendChild(signInBlock);
    rightSection.appendChild(signInWrapper);
  }

  block.appendChild(navbar);

  // Mobile Menu
  const mobileMenu = document.createElement('div');
  mobileMenu.id = 'menu';
  mobileMenu.classList.add('menu', 'hidden', 'menu-arena');
  block.appendChild(mobileMenu);

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
  mobileMenu.appendChild(menuList);

  navigationItems.forEach((row, index) => {
    const [labelCell, linkCell, hierarchyTreeCell] = [...row.children];
    const hasMenu = hierarchyTreeCell?.querySelector('ul');

    const li = document.createElement('li');
    li.id = `menu-item-${index}`;
    li.classList.add('nav-link');
    if (hasMenu) {
      li.classList.add('accordion');
    }
    li.classList.add(labelCell.textContent?.trim().toLowerCase().replace(/\s/g, '-') || `nav-item-${index}`);

    const spanTitle = document.createElement('span');
    spanTitle.classList.add('menu-title');
    const linkAnchor = linkCell?.querySelector('a')?.cloneNode(true) || document.createElement('a');
    linkAnchor.textContent = labelCell?.textContent?.trim();
    if (!linkAnchor.href) {
      linkAnchor.href = '#';
    }
    spanTitle.appendChild(linkAnchor);
    li.appendChild(spanTitle);
    menuList.appendChild(li);

    if (hasMenu) {
      const panel = document.createElement('div');
      panel.classList.add('panel');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      panel.appendChild(linkContainerSection);

      const uls = hierarchyTreeCell.querySelectorAll('ul');
      uls.forEach(ul => {
        const column = document.createElement('div');
        column.classList.add('link-grid-column', 'link-column-vertical');
        const clonedUl = ul.cloneNode(true);
        clonedUl.classList.add('content', 'links-container', 'accordian-content');
        column.appendChild(clonedUl);
        linkContainerSection.appendChild(column);
      });
      menuList.appendChild(panel);

      li.addEventListener('click', () => {
        li.classList.toggle('active');
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = `${panel.scrollHeight}px`;
        }
      });
    }
  });

  // Mobile Sign-in links
  signInItems.forEach(row => {
    const [iconCell, linkCell, labelCell] = [...row.children];
    const iconImg = iconCell?.querySelector('picture')?.cloneNode(true);
    const linkA = linkCell?.querySelector('a')?.cloneNode(true);
    const labelText = labelCell?.textContent?.trim();

    if (linkA && iconImg) {
      const li = document.createElement('li');
      const accountLink = document.createElement('a');
      accountLink.classList.add('user__account--link');
      accountLink.href = linkA.href;
      accountLink.textContent = labelText;
      accountLink.target = linkA.target;
      accountLink.rel = linkA.rel;

      const listIconSpan = document.createElement('span');
      listIconSpan.classList.add('user__account__list-icon');
      listIconSpan.appendChild(iconImg);
      accountLink.prepend(listIconSpan);

      if (labelText?.toLowerCase() === 'sign in') {
        const signInBtnDiv = document.createElement('div');
        signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
        const signInButton = document.createElement('button');
        signInButton.setAttribute('type', 'button');
        signInButton.setAttribute('data-sign-out-text', 'Sign Out');
        signInButton.textContent = 'Sign In';
        signInBtnDiv.appendChild(listIconSpan.cloneNode(true));
        signInBtnDiv.appendChild(signInButton);
        li.appendChild(signInBtnDiv);
      } else {
        li.appendChild(accountLink);
      }
      menuList.appendChild(li);
    }
  });


  // Hamburger toggle functionality
  hamburgerButton.addEventListener('click', () => {
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
