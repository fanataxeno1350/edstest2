import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const parseNavTree = (ul) => {
    return [...ul.querySelectorAll(':scope > li')].map((li) => {
      const label = li.querySelector(':scope > p')?.textContent?.trim() ?? '';
      const childUl = li.querySelector(':scope > ul');
      return { label, children: childUl ? parseNavTree(childUl) : [] };
    });
  };

  const renderNavItems = (items, parentContainer) => {
    items.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('nav-link'); // from ORIGINAL HTML

      if (item.children.length > 0) {
        li.classList.add('accordion'); // from ORIGINAL HTML
        const span = document.createElement('span');
        span.classList.add('menu-title'); // from ORIGINAL HTML
        span.textContent = item.label;

        const panel = document.createElement('div');
        panel.classList.add('panel'); // from ORIGINAL HTML

        const linkContainerSection = document.createElement('div');
        linkContainerSection.classList.add('link-container-section'); // from ORIGINAL HTML
        panel.append(linkContainerSection);

        const linkGridColumn = document.createElement('div');
        linkGridColumn.classList.add('link-grid-column', 'link-column-vertical'); // from ORIGINAL HTML
        linkContainerSection.append(linkGridColumn);

        const ul = document.createElement('ul');
        ul.classList.add('content', 'links-container', 'accordian-content'); // from ORIGINAL HTML

        renderNavItems(item.children, ul); // RECURSIVELY render children

        linkGridColumn.append(ul);
        li.append(span, panel);

        span.addEventListener('click', () => {
          panel.classList.toggle('show'); // assuming 'show' class toggles visibility
          li.classList.toggle('active'); // assuming 'active' class for accordion state
        });
      } else {
        const span = document.createElement('span');
        span.classList.add('menu-title'); // from ORIGINAL HTML
        span.textContent = item.label;
        li.append(span);
      }
      parentContainer.append(li);
    });
  };

  const rows = [...block.children];

  // Fixed fields - using content detection instead of direct index access
  const logoRow = rows.find((row, index) => index === 0 && row.querySelector('picture'));
  const logoLinkRow = rows.find((row, index) => index === 1 && row.querySelector('a'));
  const secondaryLogoRow = rows.find((row, index) => index === 2 && row.querySelector('picture'));
  const secondaryLogoLinkRow = rows.find((row, index) => index === 3 && row.querySelector('a'));
  const contactHeadingRow = rows.find((row, index) => index === 4 && row.textContent.trim() !== '');
  const languageRow = rows.find((row, index) => index === 5 && row.textContent.trim() !== '');
  const textRow = rows.find((row, index) => index === 6 && row.querySelector('ul')); // Navigation Hierarchy (richtext)

  // Item rows start from index 7
  const itemRows = rows.slice(7);

  const contactLinkItems = itemRows.filter((row) => row.children.length === 2);
  const userAccountLinkItems = itemRows.filter((row) => row.children.length === 3);

  block.textContent = '';

  const navbar = document.createElement('div');
  navbar.classList.add('navbar', 'navbar-arena', 'g-container'); // from ORIGINAL HTML

  const navHamburger = document.createElement('div');
  navHamburger.classList.add('nav-hamburger'); // from ORIGINAL HTML
  const hamburgerButton = document.createElement('button');
  hamburgerButton.setAttribute('type', 'button');
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('nav-hamburger-icon'); // from ORIGINAL HTML
  hamburgerButton.append(hamburgerIcon);
  navHamburger.append(hamburgerButton);
  navbar.append(navHamburger);

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper'); // from ORIGINAL HTML
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block'); // from ORIGINAL HTML
  const arenaSpan = document.createElement('span');
  arenaSpan.classList.add('arena'); // from ORIGINAL HTML
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture'); // from ORIGINAL HTML
  const logoPic = logoRow?.querySelector('picture');
  const logoImg = logoPic ? logoPic.querySelector('img') : null;
  if (logoImg) {
    const optimizedPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(logoImg, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  const logoHref = logoLinkRow?.querySelector('a')?.href;
  if (logoHref) {
    logoLink.href = logoHref;
  }
  arenaSpan.append(logoLink);
  logoBlock.append(arenaSpan);
  logoWrapper.append(logoBlock);
  navbar.append(logoWrapper);

  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links'); // from ORIGINAL HTML

  // Parse navigation tree from richtext
  const temp = document.createElement('div');
  temp.innerHTML = textRow?.querySelector('div')?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  const navItems = rootUl ? parseNavTree(rootUl) : [];

  const desktopPanelCorporate = document.createElement('div');
  desktopPanelCorporate.classList.add('desktop-panel', 'panel', 'corporate'); // from ORIGINAL HTML
  const linkGridCorporate = document.createElement('div');
  linkGridCorporate.classList.add('link-grid', 'block'); // from ORIGINAL HTML
  desktopPanelCorporate.append(linkGridCorporate);

  const linkContainerSectionCorporate = document.createElement('div');
  linkContainerSectionCorporate.classList.add('link-container-section'); // from ORIGINAL HTML
  linkGridCorporate.append(linkContainerSectionCorporate);

  const linkGridColumnCorporate = document.createElement('div');
  linkGridColumnCorporate.classList.add('link-grid-column', 'link-column-vertical'); // from ORIGINAL HTML
  linkContainerSectionCorporate.append(linkGridColumnCorporate);

  const desktopNavList = document.createElement('ul');
  desktopNavList.classList.add('content', 'links-container', 'accordian-content'); // from ORIGINAL HTML
  renderNavItems(navItems, desktopNavList);
  linkGridColumnCorporate.append(desktopNavList);

  // Add the desktop navigation to the links div
  linksDiv.append(desktopPanelCorporate);

  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right'); // from ORIGINAL HTML
  rightDiv.id = 'nav-right'; // from ORIGINAL HTML

  const contactWrapper = document.createElement('div');
  contactWrapper.classList.add('contact-wrapper'); // from ORIGINAL HTML
  const contactBlock = document.createElement('div');
  contactBlock.classList.add('contact', 'block'); // from ORIGINAL HTML
  const contactWrpArena = document.createElement('div');
  contactWrpArena.classList.add('contact_wrp_arena', 'user__contact', 'header'); // from ORIGINAL HTML

  const contactHeading = document.createElement('h4');
  contactHeading.classList.add('user__contact-title'); // from ORIGINAL HTML
  contactHeading.textContent = contactHeadingRow?.textContent.trim() ?? '';
  const contactIconSpan = document.createElement('span');
  contactIconSpan.classList.add('user__contact-title', 'icon-phone'); // from ORIGINAL HTML
  contactIconSpan.setAttribute('aria-label', 'Contact Us');
  contactWrpArena.append(contactHeading, contactIconSpan);

  const contactIconsDiv = document.createElement('div');
  contactIconsDiv.classList.add('user__contact__icons', 'hidden'); // from ORIGINAL HTML

  contactLinkItems.forEach((row) => {
    const iconCell = [...row.children].find((cell) => cell.querySelector('picture'));
    const linkCell = [...row.children].find((cell) => cell.querySelector('a'));

    if (iconCell && linkCell) {
      const iconPic = iconCell.querySelector('picture');
      const iconImg = iconPic ? iconPic.querySelector('img') : null;
      const linkEl = linkCell.querySelector('a');

      if (iconImg && linkEl) {
        const contactLink = document.createElement('a');
        contactLink.classList.add('user__contact--icon'); // from ORIGINAL HTML
        contactLink.href = linkEl.href;
        if (linkEl.target) contactLink.target = linkEl.target;
        if (linkEl.rel) contactLink.rel = linkEl.rel;

        const srOnlySpan = document.createElement('span');
        srOnlySpan.classList.add('sr-only'); // from ORIGINAL HTML
        srOnlySpan.textContent = iconImg.alt;
        contactLink.append(srOnlySpan);

        const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
        contactLink.append(optimizedPic.querySelector('img')); // Append only the img, not the picture wrapper

        // Determine class based on alt text or link content
        if (iconImg.alt.toLowerCase().includes('phone')) {
          contactLink.classList.add('phone');
          contactLink.addEventListener('click', (e) => {
            e.preventDefault();
            contactWrpArena.querySelector('.contact-toggle-box')?.classList.toggle('hidden');
          });
        } else if (iconImg.alt.toLowerCase().includes('whatsapp')) {
          contactLink.classList.add('whatsapp');
        } else if (iconImg.alt.toLowerCase().includes('email')) {
          contactLink.classList.add('email');
        }
        contactIconsDiv.append(contactLink);
      }
    }
  });

  contactWrpArena.append(contactIconsDiv);

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box'); // from ORIGINAL HTML
  const callContainer = document.createElement('div');
  callContainer.classList.add('user__contact__icon-call_container'); // from ORIGINAL HTML
  // Example: Add telephone links if available in the contact links
  const phoneLink = contactLinkItems.find((row) => row.querySelector('img[alt*="phone"]'));
  if (phoneLink) {
    const phoneHref = phoneLink.querySelector('a')?.href;
    const phoneText = phoneLink.querySelector('a')?.textContent;
    if (phoneHref && phoneText) {
      const primaryTel = document.createElement('a');
      primaryTel.classList.add('primary-telephone'); // from ORIGINAL HTML
      primaryTel.href = phoneHref;
      primaryTel.textContent = phoneText;
      callContainer.append(primaryTel);
    }
  }
  contactToggleBox.append(callContainer);
  contactWrpArena.append(contactToggleBox);
  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language'); // from ORIGINAL HTML
  languageDiv.textContent = languageRow?.textContent.trim() ?? '';
  rightDiv.append(languageDiv);

  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden'); // from ORIGINAL HTML
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block'); // from ORIGINAL HTML
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown'); // from ORIGINAL HTML
  const userAccountDiv = document.createElement('div');
  userAccountDiv.classList.add('user__account'); // from ORIGINAL HTML

  userAccountLinkItems.forEach((row) => {
    const iconCell = [...row.children].find((cell) => cell.querySelector('picture'));
    const linkCell = [...row.children].find((cell) => cell.querySelector('a'));
    const textCell = [...row.children].find((cell) => !cell.querySelector('picture') && !cell.querySelector('a'));

    if (iconCell && linkCell && textCell) {
      const iconPic = iconCell.querySelector('picture');
      const iconImg = iconPic ? iconPic.querySelector('img') : null;
      const linkEl = linkCell.querySelector('a');
      const textContent = textCell.textContent.trim();

      if (iconImg && linkEl) {
        if (textContent.toLowerCase() === 'sign in') {
          const signInBtnDiv = document.createElement('div');
          signInBtnDiv.classList.add('user__account--link', 'sign-in-btn'); // from ORIGINAL HTML

          const listIconSpan = document.createElement('span');
          listIconSpan.classList.add('user__account__list-icon'); // from ORIGINAL HTML
          const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
          moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
          listIconSpan.append(optimizedPic.querySelector('img'));
          signInBtnDiv.append(listIconSpan);

          const signInButton = document.createElement('button');
          signInButton.setAttribute('type', 'button');
          signInButton.setAttribute('data-sign-out-text', 'Sign Out');
          signInButton.textContent = textContent;
          signInBtnDiv.append(signInButton);
          userAccountDiv.append(signInBtnDiv);
        } else {
          const accountLink = document.createElement('a');
          accountLink.classList.add('user__account--link'); // from ORIGINAL HTML
          accountLink.href = linkEl.href;
          if (linkEl.target) accountLink.target = linkEl.target;
          accountLink.classList.add(textContent.toLowerCase().replace(/\s/g, '-'));

          const listIconSpan = document.createElement('span');
          listIconSpan.classList.add('user__account__list-icon'); // from ORIGINAL HTML
          const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
          moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
          listIconSpan.append(optimizedPic.querySelector('img'));
          accountLink.append(listIconSpan);
          accountLink.append(textContent);
          userAccountDiv.append(accountLink);
        }
      }
    }
  });

  userDropdown.append(userAccountDiv);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightDiv.append(signInWrapper);

  navbar.append(linksDiv, rightDiv);

  const menuDiv = document.createElement('div');
  menuDiv.id = 'menu'; // from ORIGINAL HTML
  menuDiv.classList.add('menu', 'hidden', 'menu-arena'); // from ORIGINAL HTML

  const menuHeader = document.createElement('div');
  menuHeader.classList.add('menu-header'); // from ORIGINAL HTML
  const backArrow = document.createElement('div');
  backArrow.classList.add('back-arrow'); // from ORIGINAL HTML
  const menuTitle = document.createElement('span');
  menuTitle.classList.add('menu-title'); // from ORIGINAL HTML
  menuTitle.textContent = 'Menu';
  const closeIcon = document.createElement('span');
  closeIcon.classList.add('close-icon'); // from ORIGINAL HTML
  menuHeader.append(backArrow, menuTitle, closeIcon);
  menuDiv.append(menuHeader);

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list'); // from ORIGINAL HTML
  renderNavItems(navItems, menuList);
  menuDiv.append(menuList);

  block.append(navbar, menuDiv);

  // Event listeners for hamburger menu toggle
  hamburgerButton.addEventListener('click', () => {
    const isExpanded = hamburgerButton.getAttribute('aria-expanded') === 'true';
    hamburgerButton.setAttribute('aria-expanded', !isExpanded);
    menuDiv.classList.toggle('hidden', isExpanded); // Toggle visibility of the menu
    document.body.classList.toggle('no-scroll', !isExpanded); // Add/remove no-scroll to body
  });

  closeIcon.addEventListener('click', () => {
    hamburgerButton.setAttribute('aria-expanded', 'false');
    menuDiv.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  });

  backArrow.addEventListener('click', () => {
    // Implement back navigation logic for mobile menu if needed
    // For now, it might just close the menu or navigate up one level in nested menus
    menuDiv.classList.add('hidden');
    hamburgerButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  });

  // Optimize all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
