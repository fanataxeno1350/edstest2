import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Fixed fields: logo, logoLink, language (3 rows)
  const [logoRow, logoLinkRow, languageRow] = rows.slice(0, 3);
  // All remaining rows are navigation/contact/sign-in items
  const itemRows = rows.slice(3);

  const navigationItems = itemRows.filter(row => {
    const cells = [...row.children];
    // Navigation-item: 3 cells (label, link, hierarchy-tree)
    return cells.length === 3 && cells[0]?.textContent.trim() && cells[1]?.querySelector('a');
  });

  const contactItems = itemRows.filter(row => {
    const cells = [...row.children];
    // Contact-link-item: 3 cells (icon image, link, hierarchy-tree)
    return cells.length === 3 && cells[0]?.querySelector('picture') && cells[1]?.querySelector('a');
  });

  const signInItems = itemRows.filter(row => {
    const cells = [...row.children];
    // Sign-in-link-item: 4 cells (icon image, link, label text, hierarchy-tree)
    return cells.length === 4 && cells[0]?.querySelector('picture') && cells[1]?.querySelector('a') && cells[2]?.textContent.trim();
  });

  block.textContent = ''; // Clear the block content

  const navbar = document.createElement('div');
  navbar.classList.add('navbar', 'navbar-arena', 'g-container');

  // Hamburger button
  const hamburgerWrapper = document.createElement('div');
  hamburgerWrapper.classList.add('nav-hamburger');
  const hamburgerButton = document.createElement('button');
  hamburgerButton.setAttribute('type', 'button');
  hamburgerButton.setAttribute('aria-controls', 'nav');
  hamburgerButton.setAttribute('aria-label', 'Open navigation');
  hamburgerButton.setAttribute('aria-expanded', 'false');
  const hamburgerIcon = document.createElement('span');
  hamburgerIcon.classList.add('nav-hamburger-icon');
  hamburgerButton.appendChild(hamburgerIcon);
  hamburgerWrapper.appendChild(hamburgerButton);
  navbar.appendChild(hamburgerWrapper);

  // Logo section
  const logoSection = document.createElement('div');
  logoSection.classList.add('logo-wrapper');
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoAnchor = document.createElement('a');
    logoAnchor.classList.add('logo__picture');
    const foundLogoLink = logoLinkRow?.querySelector('a');
    if (foundLogoLink) {
      logoAnchor.href = foundLogoLink.href;
    } else {
      logoAnchor.href = '/'; // Default to home if no link
    }
    moveInstrumentation(logoRow, logoAnchor);
    logoAnchor.appendChild(logoPicture.cloneNode(true));
    logoSection.appendChild(logoAnchor);
  }
  navbar.appendChild(logoSection);

  // Links container (for navigation items)
  const linksContainer = document.createElement('div');
  linksContainer.classList.add('links');
  navbar.appendChild(linksContainer);

  navigationItems.forEach(row => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];

    const linkTitle = document.createElement('div');
    linkTitle.classList.add('link-title');
    moveInstrumentation(row, linkTitle);

    const triggerSpan = document.createElement('span');
    const triggerA = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) triggerA.href = foundLink.href;
    triggerA.textContent = labelCell?.textContent?.trim() || '';
    triggerA.classList.add('button');
    triggerSpan.appendChild(triggerA);
    linkTitle.appendChild(triggerSpan);
    linksContainer.appendChild(linkTitle);

    const hierarchyUL = hierarchyCell?.querySelector('ul');
    if (hierarchyUL) {
      // Create desktop panel for dropdown
      const panel = document.createElement('div');
      const panelLabel = labelCell?.textContent?.trim().toLowerCase().replace(/\s+/g, '-') || 'dropdown';
      panel.classList.add('desktop-panel', 'panel', panelLabel);

      // Build grid structure for nested <ul>
      const gridWrapper = document.createElement('div');
      gridWrapper.classList.add('link-grid', 'block');

      const columnSection = document.createElement('div');
      columnSection.classList.add('link-container-section');

      const column = document.createElement('div');
      column.classList.add('link-grid-column', 'link-column-vertical');

      // Move the authored <ul> directly into the column (preserves all nested <a> elements)
      column.appendChild(hierarchyUL.cloneNode(true));

      columnSection.appendChild(column);
      gridWrapper.appendChild(columnSection);
      panel.appendChild(gridWrapper);
      linksContainer.appendChild(panel);

      // Add click toggle for panel visibility
      triggerA.addEventListener('click', (e) => {
        e.preventDefault();
        panel.classList.toggle('visible');
      });
    }
  });

  // Right section (contact, language, sign-in)
  const rightSection = document.createElement('div');
  rightSection.id = 'nav-right';
  rightSection.classList.add('right');

  // Contact icons
  if (contactItems.length > 0) {
    const contactWrapper = document.createElement('div');
    contactWrapper.classList.add('contact-wrapper');
    const contactBlock = document.createElement('div');
    contactBlock.classList.add('contact', 'block');
    contactWrapper.appendChild(contactBlock);

    const contactWrpArena = document.createElement('div');
    contactWrpArena.classList.add('contact_wrp_arena', 'user__contact', 'header');
    contactBlock.appendChild(contactWrpArena);

    const contactTitle = document.createElement('h4');
    contactTitle.classList.add('user__contact-title');
    contactTitle.textContent = 'Contact Us';
    contactWrpArena.appendChild(contactTitle);

    const contactIconPhone = document.createElement('span');
    contactIconPhone.classList.add('user__contact-title', 'icon-phone');
    contactIconPhone.setAttribute('aria-label', 'Contact Us');
    contactWrpArena.appendChild(contactIconPhone);

    const userContactIcons = document.createElement('div');
    userContactIcons.classList.add('user__contact__icons', 'hidden');
    contactWrpArena.appendChild(userContactIcons);

    contactItems.forEach(row => {
      const [iconCell, linkCell] = [...row.children]; // hierarchy-tree is not used for rendering contact links
      const contactLink = document.createElement('a');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) contactLink.href = foundLink.href;

      const icon = iconCell?.querySelector('picture');
      if (icon) {
        const img = icon.querySelector('img');
        if (img) {
          const iconClone = img.cloneNode(true);
          iconClone.classList.add('user__contact--icon');
          // Determine specific class based on alt text or content
          if (iconClone.alt.toLowerCase().includes('phone')) {
            contactLink.classList.add('phone');
          } else if (iconClone.alt.toLowerCase().includes('whatsapp')) {
            contactLink.classList.add('whatsapp');
            contactLink.setAttribute('target', '_blank');
            contactLink.setAttribute('rel', 'noopener noreferrer');
          } else if (iconClone.alt.toLowerCase().includes('email')) {
            contactLink.classList.add('email');
          }
          const srOnly = document.createElement('span');
          srOnly.classList.add('sr-only');
          srOnly.textContent = iconClone.alt;
          contactLink.appendChild(srOnly);
          contactLink.appendChild(iconClone);
        }
      }
      userContactIcons.appendChild(contactLink);
    });

    const contactToggleBox = document.createElement('div');
    contactToggleBox.classList.add('hidden', 'contact-toggle-box');
    contactWrpArena.appendChild(contactToggleBox);

    const iconCallContainer = document.createElement('div');
    iconCallContainer.classList.add('user__contact__icon-call_container');
    contactToggleBox.appendChild(iconCallContainer);

    // Add event listener to toggle contact icons visibility
    contactIconPhone.addEventListener('click', () => {
      userContactIcons.classList.toggle('hidden');
      contactToggleBox.classList.toggle('hidden');
    });

    rightSection.appendChild(contactWrapper);
  }

  // Language selector
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = languageRow?.textContent?.trim() || 'EN';
  rightSection.appendChild(languageDiv);

  // Sign-in section
  if (signInItems.length > 0) {
    const signInWrapper = document.createElement('div');
    signInWrapper.classList.add('sign-in-wrapper'); // Original HTML has 'hidden' class, but we'll manage visibility with JS if needed
    const signInBlock = document.createElement('div');
    signInBlock.classList.add('sign-in', 'block');
    signInWrapper.appendChild(signInBlock);

    const userDropdown = document.createElement('div');
    userDropdown.classList.add('user__dropdown');
    signInBlock.appendChild(userDropdown);

    const userAccount = document.createElement('div');
    userAccount.classList.add('user__account');
    userDropdown.appendChild(userAccount);

    signInItems.forEach(row => {
      const [iconCell, linkCell, labelCell] = [...row.children]; // hierarchy-tree is not used for rendering sign-in links
      const signInLink = document.createElement('a');
      signInLink.classList.add('user__account--link');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) signInLink.href = foundLink.href;
      signInLink.textContent = labelCell?.textContent?.trim(); // Set text content from label cell

      const icon = iconCell?.querySelector('picture');
      if (icon) {
        const img = icon.querySelector('img');
        if (img) {
          const iconSpan = document.createElement('span');
          iconSpan.classList.add('user__account__list-icon');
          const iconClone = img.cloneNode(true);
          iconSpan.appendChild(iconClone);
          signInLink.prepend(iconSpan);
        }
      }
      userAccount.appendChild(signInLink);
    });
    rightSection.appendChild(signInWrapper);
  }

  navbar.appendChild(rightSection);
  block.appendChild(navbar);

  // Mobile menu
  const mobileMenu = document.createElement('div');
  mobileMenu.id = 'menu';
  mobileMenu.classList.add('menu', 'hidden', 'menu-arena'); // Initially hidden

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
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    li.id = `menu-item-${index}`;
    li.classList.add('nav-link');

    const menuTitleSpan = document.createElement('span');
    menuTitleSpan.classList.add('menu-title');

    const hierarchyUL = hierarchyCell?.querySelector('ul');
    if (hierarchyUL) {
      li.classList.add('accordion');
      const labelText = labelCell?.textContent?.trim() || '';
      menuTitleSpan.textContent = labelText; // For accordion, text is direct
      li.appendChild(menuTitleSpan);

      const panel = document.createElement('div');
      panel.classList.add('panel');

      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      panel.appendChild(linkContainerSection);

      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
      linkContainerSection.appendChild(linkGridColumn);

      const clonedUL = hierarchyUL.cloneNode(true);
      clonedUL.classList.add('content', 'links-container', 'accordian-content'); // Add classes from original HTML
      linkGridColumn.appendChild(clonedUL);
      li.appendChild(panel);

      menuTitleSpan.addEventListener('click', () => {
        li.classList.toggle('active');
        panel.classList.toggle('active');
      });
    } else {
      const anchor = document.createElement('a');
      const foundLink = linkCell?.querySelector('a');
      if (foundLink) anchor.href = foundLink.href;
      anchor.textContent = labelCell?.textContent?.trim() || '';
      anchor.classList.add('button'); // Add button class if present in original HTML
      menuTitleSpan.appendChild(anchor);
      li.appendChild(menuTitleSpan);
    }
    menuList.appendChild(li);
  });

  // Append sign-in links to mobile menu as well
  signInItems.forEach(row => {
    const [iconCell, linkCell, labelCell] = [...row.children];
    const li = document.createElement('li');

    const signInLink = document.createElement('a');
    signInLink.classList.add('user__account--link'); // Use class from original HTML
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) signInLink.href = foundLink.href;
    signInLink.textContent = labelCell?.textContent?.trim();

    const icon = iconCell?.querySelector('picture');
    if (icon) {
      const img = icon.querySelector('img');
      if (img) {
        const iconSpan = document.createElement('span');
        iconSpan.classList.add('user__account__list-icon');
        const iconClone = img.cloneNode(true);
        iconSpan.appendChild(iconClone);
        signInLink.prepend(iconSpan);
      }
    }
    li.appendChild(signInLink);
    menuList.appendChild(li);
  });

  block.appendChild(mobileMenu);

  // Hamburger menu toggle logic
  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    hamburgerButton.classList.toggle('active'); // Toggle 'active' class on button
    hamburgerButton.setAttribute('aria-expanded', mobileMenu.classList.contains('hidden') ? 'false' : 'true');
  });

  closeIcon.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    hamburgerButton.classList.remove('active');
    hamburgerButton.setAttribute('aria-expanded', 'false');
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
