import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Map rows to their corresponding fields based on BlockJson and content detection
  const logoRow = children.find((row) => row.querySelector('picture') && row.children.length === 1 && row.children[0].textContent.trim() === '');
  const logoLinkRow = children.find((row) => row.querySelector('a') && row.children.length === 1 && row.children[0].querySelector('a')?.href.includes('logoLink'));
  const engageLogoRow = children.find((row) => row.querySelector('picture') && row !== logoRow && row.children.length === 1);
  const engageLogoLinkRow = children.find((row) => row.querySelector('a') && row !== logoLinkRow && row.children.length === 1);
  const languageRow = children.find((row) => row.textContent.trim().length > 0 && row.children.length === 1 && !row.querySelector('picture') && !row.querySelector('a') && !row.querySelector('ul'));
  const textRow = children.find((row) => row.querySelector('ul') && row.children.length === 1); // Navigation Hierarchy (RTE)

  // Filter item rows for contact and account links
  const itemRows = children.filter(
    (row) =>
      row !== logoRow &&
      row !== logoLinkRow &&
      row !== engageLogoRow &&
      row !== engageLogoLinkRow &&
      row !== languageRow &&
      row !== textRow,
  );

  block.textContent = '';

  // --- Header Top Bar ---
  const navbarArena = document.createElement('div');
  navbarArena.classList.add('navbar', 'navbar-arena', 'g-container');

  // Nav Hamburger
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
  const arenaSpan = document.createElement('span');
  arenaSpan.classList.add('arena');

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  const logoLinkEl = logoLinkRow?.querySelector('a');
  if (logoLinkEl) {
    logoLink.href = logoLinkEl.href;
    logoLink.setAttribute('data-logo-name', 'Arena'); // Assuming Arena from original HTML
  }

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '79' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  arenaSpan.append(logoLink);
  logoBlock.append(arenaSpan);
  logoWrapper.append(logoBlock);
  navbarArena.append(logoWrapper);

  // Links section (desktop navigation)
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');
  navbarArena.append(linksDiv);

  // Right section (contact, language, sign-in)
  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';

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

  const contactIconsDiv = document.createElement('div');
  contactIconsDiv.classList.add('user__contact__icons', 'hidden');

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');

  const contactIconCallContainer = document.createElement('div');
  contactIconCallContainer.classList.add('user__contact__icon-call_container');

  const primaryTelephone = document.createElement('a');
  primaryTelephone.classList.add('primary-telephone');
  primaryTelephone.href = 'tel:18001021800';
  primaryTelephone.textContent = '1800 102 1800';
  const secondaryTelephone = document.createElement('a');
  secondaryTelephone.classList.add('secondary-telephone');
  secondaryTelephone.href = 'tel:';

  contactIconCallContainer.append(primaryTelephone, secondaryTelephone);
  contactToggleBox.append(contactIconCallContainer);

  // Iterate over contact-link-item rows
  const contactLinkItems = itemRows.filter((row) => row.children.length === 2);
  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find((cell) => cell.querySelector('picture'));
    const linkCell = cells.find((cell) => cell.querySelector('a'));

    const iconPicture = iconCell?.querySelector('picture');
    const linkEl = linkCell?.querySelector('a');

    if (iconPicture && linkEl) {
      const iconLink = document.createElement('a');
      iconLink.classList.add('user__contact--icon');
      iconLink.href = linkEl.href;
      if (linkEl.target) iconLink.target = linkEl.target;
      if (linkEl.rel) iconLink.rel = linkEl.rel;

      const srOnlySpan = document.createElement('span');
      srOnlySpan.classList.add('sr-only');
      srOnlySpan.textContent = iconPicture.querySelector('img')?.alt || '';
      iconLink.append(srOnlySpan);

      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]); // Assuming small icon size
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        iconLink.append(optimizedPic);
      }

      if (iconPicture.querySelector('img')?.alt === 'phone') {
        iconLink.classList.add('phone');
        iconLink.addEventListener('click', (e) => {
          e.preventDefault();
          contactToggleBox.classList.toggle('hidden');
        });
      } else if (iconPicture.querySelector('img')?.alt === 'whatsapp') {
        iconLink.classList.add('whatsapp');
      } else if (iconPicture.querySelector('img')?.alt === 'email') {
        iconLink.classList.add('email');
      }
      contactIconsDiv.append(iconLink);
    }
  });

  contactWrpArena.append(contactTitle, contactIconPhone, contactIconsDiv, contactToggleBox);
  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = languageRow?.textContent.trim() ?? '';
  rightDiv.append(languageDiv);

  // Sign-in Wrapper
  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden'); // Hidden by default based on original HTML

  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');

  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');

  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  // Iterate over account-link-item rows
  const accountLinkItems = itemRows.filter((row) => row.children.length === 3);
  accountLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find((cell) => cell.querySelector('picture'));
    const linkCell = cells.find((cell) => cell.querySelector('a'));
    const labelCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('a'));

    const iconPicture = iconCell?.querySelector('picture');
    const linkEl = linkCell?.querySelector('a');
    const labelText = labelCell?.textContent.trim() ?? '';

    if (linkEl) {
      if (linkEl.classList.contains('sign-in-btn')) {
        // Special handling for sign-in button
        const signInBtnWrapper = document.createElement('div');
        signInBtnWrapper.classList.add('user__account--link', 'sign-in-btn');

        const listIconSpan = document.createElement('span');
        listIconSpan.classList.add('user__account__list-icon');
        const img = iconPicture?.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          listIconSpan.append(optimizedPic);
        }
        signInBtnWrapper.append(listIconSpan);

        const signInButton = document.createElement('button');
        signInButton.setAttribute('type', 'button');
        signInButton.textContent = labelText;
        signInButton.setAttribute('data-sign-out-text', 'Sign Out'); // From original HTML
        signInBtnWrapper.append(signInButton);
        userAccount.append(signInBtnWrapper);

        // Add event listener for sign-in/out functionality
        signInButton.addEventListener('click', () => {
          const currentText = signInButton.textContent;
          const signOutText = signInButton.getAttribute('data-sign-out-text');
          if (currentText === signOutText) {
            signInButton.textContent = 'Sign In';
          } else {
            signInButton.textContent = signOutText;
          }
          // Add actual sign-in/out logic here
        });
      } else {
        // Regular account links
        const accountLink = document.createElement('a');
        accountLink.classList.add('user__account--link');
        accountLink.href = linkEl.href;
        if (linkEl.target) accountLink.target = linkEl.target;
        if (linkEl.rel) accountLink.rel = linkEl.rel;
        accountLink.textContent = labelText;

        // Add specific classes based on label content (from original HTML)
        if (labelText.toLowerCase().includes('reach us')) {
          accountLink.classList.add('reach', 'us');
        } else if (labelText.toLowerCase().includes('profile')) {
          accountLink.classList.add('profile');
        }

        const listIconSpan = document.createElement('span');
        listIconSpan.classList.add('user__account__list-icon');
        const img = iconPicture?.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          listIconSpan.append(optimizedPic);
        }
        accountLink.prepend(listIconSpan);
        userAccount.append(accountLink);
      }
    }
  });

  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightDiv.append(signInWrapper);

  navbarArena.append(rightDiv);
  block.append(navbarArena);

  // --- Mobile Menu (hidden by default) ---
  const menuDiv = document.createElement('div');
  menuDiv.id = 'menu';
  menuDiv.classList.add('menu', 'hidden', 'menu-arena');

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
  menuDiv.append(menuHeader);

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');
  menuDiv.append(menuList);

  // Hamburger button event listener
  hamburgerButton.addEventListener('click', () => {
    const isExpanded = hamburgerButton.getAttribute('aria-expanded') === 'true';
    hamburgerButton.setAttribute('aria-expanded', !isExpanded);
    menuDiv.classList.toggle('hidden', isExpanded); // Show/hide the mobile menu
    document.body.classList.toggle('no-scroll', !isExpanded); // Prevent body scroll when menu open
  });

  // Close icon event listener
  closeIcon.addEventListener('click', () => {
    hamburgerButton.setAttribute('aria-expanded', 'false');
    menuDiv.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  });

  // Back arrow event listener (for nested menus)
  backArrow.addEventListener('click', () => {
    // This assumes a simple one-level back. For multi-level,
    // you'd need to track current depth and show/hide accordingly.
    // For now, it just closes the menu.
    hamburgerButton.setAttribute('aria-expanded', 'false');
    menuDiv.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  });

  // --- Navigation Hierarchy (RTE) ---
  function parseNavTree(ul) {
    return [...ul.querySelectorAll(':scope > li')].map((li) => {
      let label = li.querySelector(':scope > p')?.textContent?.trim() ?? '';
      if (!label) {
        // Fallback for li directly containing text or text mixed with other elements (excluding nested ul)
        const textNodes = [...li.childNodes].filter(
          (node) => node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'UL'),
        );
        label = textNodes
          .map((node) => (node.nodeType === Node.TEXT_NODE ? node.textContent : node.textContent))
          .join('')
          .trim();
      }
      const childUl = li.querySelector(':scope > ul');
      return { label, children: childUl ? parseNavTree(childUl) : [] };
    });
  }

  function renderNavItems(items, parentContainer, depth = 0) {
    items.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('nav-link'); // from ORIGINAL HTML

      // Check if the label contains a link
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = item.label;
      const linkInLabel = tempDiv.querySelector('a');

      if (item.children.length > 0) {
        // Parent item with children: create toggle + nested list
        li.classList.add('accordion'); // from ORIGINAL HTML

        const menuTitleSpan = document.createElement('span');
        menuTitleSpan.classList.add('menu-title');
        menuTitleSpan.textContent = item.label; // Display plain text label for parent

        const toggleButton = document.createElement('button');
        toggleButton.classList.add('nav-toggle'); // Custom class for toggle, or a specific class from original HTML if available
        toggleButton.setAttribute('aria-expanded', 'false');
        toggleButton.innerHTML = '<span class="nav-toggle-icon"></span>'; // Example toggle icon

        const panelDiv = document.createElement('div');
        panelDiv.classList.add('panel'); // from ORIGINAL HTML
        panelDiv.style.display = 'none'; // Hidden by default

        const submenuUl = document.createElement('ul');
        submenuUl.classList.add('content', 'links-container', 'accordian-content'); // from ORIGINAL HTML

        // RECURSIVELY render children
        renderNavItems(item.children, submenuUl, depth + 1);

        panelDiv.append(submenuUl); // Append submenuUl directly to panelDiv

        toggleButton.addEventListener('click', () => {
          const isOpen = toggleButton.getAttribute('aria-expanded') === 'true';
          toggleButton.setAttribute('aria-expanded', !isOpen);
          panelDiv.style.display = isOpen ? 'none' : 'block';
          li.classList.toggle('open', !isOpen); // Add/remove 'open' class for styling
        });

        li.append(menuTitleSpan, toggleButton, panelDiv); // Append toggle and panel
      } else {
        // Leaf item: just the label or link
        const menuTitleSpan = document.createElement('span');
        menuTitleSpan.classList.add('menu-title');
        if (linkInLabel) {
          // If the label contains an <a>, use that link
          const link = document.createElement('a');
          link.href = linkInLabel.href;
          if (linkInLabel.title) link.title = linkInLabel.title;
          if (linkInLabel.classList.contains('button')) link.classList.add('button');
          if (linkInLabel.target) link.target = linkInLabel.target;
          if (linkInLabel.rel) link.rel = linkInLabel.rel;
          link.textContent = linkInLabel.textContent;
          menuTitleSpan.append(link);
        } else {
          // Otherwise, just display the text
          menuTitleSpan.textContent = item.label;
        }
        li.append(menuTitleSpan);
      }
      parentContainer.append(li);
    });
  }

  const textCell = textRow?.querySelector('div');
  const temp = document.createElement('div');
  temp.innerHTML = textCell?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  const navItems = rootUl ? parseNavTree(rootUl) : [];

  renderNavItems(navItems, menuList); // Renders ALL nested levels into the mobile menu list

  block.append(menuDiv);

  // Image optimization for all pictures in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
