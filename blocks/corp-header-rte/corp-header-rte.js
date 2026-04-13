import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    secondaryLogoRow,
    secondaryLogoLinkRow,
    languageRow, // language row is at index 4, before item rows
    textRow, // Navigation Hierarchy RTE is at index 5
    ...itemRows
  ] = rows;

  // --- Header Top Section ---
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
  logoBlock.classList.add('logo', 'block'); // Add 'block' class
  const arenaSpan = document.createElement('span');
  arenaSpan.classList.add('arena');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  const logoHref = logoLinkRow.querySelector('a')?.href || '/';
  logoLink.href = logoHref;
  logoLink.setAttribute('data-logo-name', 'Arena');

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  arenaSpan.append(logoLink);
  logoBlock.append(arenaSpan);
  logoWrapper.append(logoBlock);
  navbarArena.append(logoWrapper);

  // --- Navigation (RTE) ---
  function parseNavTree(ul) {
    return [...ul.querySelectorAll(':scope > li')].map((li) => {
      let label = '';
      for (const node of li.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          label += node.textContent.trim();
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'UL') {
          label += node.textContent.trim();
        }
      }
      label = label.trim();

      const childUl = li.querySelector(':scope > ul');
      return { label, children: childUl ? parseNavTree(childUl) : [] };
    });
  }

  function renderNavItems(items, parentContainer) {
    items.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('nav-link');

      const menuTitleSpan = document.createElement('span');
      menuTitleSpan.classList.add('menu-title');

      if (item.children.length > 0) {
        // Parent item: label + toggle + nested list
        li.classList.add('accordion');
        menuTitleSpan.textContent = item.label;

        const submenu = document.createElement('ul');
        submenu.classList.add('content', 'links-container', 'accordian-content'); // from ORIGINAL HTML

        // RECURSIVELY render children into the submenu
        renderNavItems(item.children, submenu);

        // The original HTML has a panel > link-container-section > link-grid-column > ul structure.
        // We need to replicate this for CSS to work, but avoid over-nesting if not strictly needed.
        // For mobile, the panel is directly appended to the li.
        const panelDiv = document.createElement('div');
        panelDiv.classList.add('panel');

        const linkContainerSection = document.createElement('div');
        linkContainerSection.classList.add('link-container-section');

        const linkGridColumn = document.createElement('div');
        linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

        linkGridColumn.append(submenu);
        linkContainerSection.append(linkGridColumn);
        panelDiv.append(linkContainerSection);

        li.append(menuTitleSpan, panelDiv);

        // Add toggle behavior for the accordion
        menuTitleSpan.addEventListener('click', () => {
          li.classList.toggle('active');
          panelDiv.classList.toggle('show');
        });
      } else {
        // Leaf item: just a label or a link
        const link = document.createElement('a');
        link.href = '#'; // Placeholder, actual links not in RTE
        link.textContent = item.label;
        // Check if the original HTML had a 'button' class for leaf links
        // The example HTML shows 'Home' and 'Service' as buttons.
        if (item.label.toLowerCase() === 'home' || item.label.toLowerCase() === 'service' || item.label.toLowerCase() === 'important customer info') {
          link.classList.add('button');
        }
        menuTitleSpan.append(link);
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

  const menu = document.createElement('div');
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
  renderNavItems(navItems, menuList); // Renders ALL nested levels
  menu.append(menuList);

  // Hamburger button event listener
  hamburgerButton.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    document.body.classList.toggle('menu-open');
  });

  // Close menu event listener
  closeIcon.addEventListener('click', () => {
    menu.classList.add('hidden');
    document.body.classList.remove('menu-open');
  });

  // --- Right Section (Contact and User Account Links, Language) ---
  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = languageRow?.querySelector('div')?.textContent || '';
  rightDiv.append(languageDiv);

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
  const contactTitleIcon = document.createElement('span');
  contactTitleIcon.classList.add('user__contact-title', 'icon-phone');
  contactTitleIcon.setAttribute('aria-label', 'Contact Us');
  contactWrpArena.append(contactTitle, contactTitleIcon);

  const contactIconsDiv = document.createElement('div');
  contactIconsDiv.classList.add('user__contact__icons', 'hidden');

  // Filter itemRows for contact links (2 cells: icon, link)
  const contactLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('picture') && cells[1].querySelector('a');
  });

  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    if (iconCell && linkCell) {
      const contactLink = document.createElement('a');
      contactLink.href = linkCell.querySelector('a').href;
      contactLink.classList.add('user__contact--icon');

      const iconPicture = iconCell.querySelector('picture');
      const img = iconPicture?.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        contactLink.append(optimizedPic);
        // Add class based on alt text like 'phone', 'whatsapp', 'email'
        contactLink.classList.add(img.alt.toLowerCase());
        const srOnlySpan = document.createElement('span');
        srOnlySpan.classList.add('sr-only');
        srOnlySpan.textContent = img.alt;
        contactLink.prepend(srOnlySpan);
      }
      contactIconsDiv.append(contactLink);
    }
  });

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const contactCallContainer = document.createElement('div');
  contactCallContainer.classList.add('user__contact__icon-call_container');

  // Assuming the phone number is the first contact link if it exists and is a tel: link
  const phoneLinkRow = contactLinkItems.find(row => {
    const cells = [...row.children];
    return cells.length === 2 && cells[1].querySelector('a[href^="tel:"]');
  });

  if (phoneLinkRow) {
    const primaryTelephone = document.createElement('a');
    primaryTelephone.classList.add('primary-telephone');
    primaryTelephone.href = phoneLinkRow.children[1].querySelector('a').href;
    primaryTelephone.textContent = phoneLinkRow.children[1].querySelector('a').textContent;
    contactCallContainer.append(primaryTelephone);
  }

  contactToggleBox.append(contactCallContainer);
  contactWrpArena.append(contactIconsDiv, contactToggleBox);
  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  // Add click listener for the contact icon to toggle the contact-toggle-box
  contactTitleIcon.addEventListener('click', () => {
    contactIconsDiv.classList.toggle('hidden');
    contactToggleBox.classList.toggle('hidden');
  });

  // User Account Links
  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden'); // Initially hidden
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  // Filter itemRows for user account links (3 cells: icon, link, label)
  const userAccountLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].textContent.trim();
  });

  userAccountLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a')); // Find cell with just text

    const linkAnchor = linkCell?.querySelector('a');
    const labelText = labelCell?.textContent.trim();
    const iconPicture = iconCell?.querySelector('picture');

    if (linkAnchor && iconPicture && labelText) {
      if (labelText.toLowerCase() === 'sign in') {
        const signInBtnDiv = document.createElement('div');
        signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
        const iconSpan = document.createElement('span');
        iconSpan.classList.add('user__account__list-icon');
        const img = iconPicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          iconSpan.append(optimizedPic);
        }
        const signInButton = document.createElement('button');
        signInButton.setAttribute('type', 'button');
        signInButton.setAttribute('data-sign-out-text', 'Sign Out');
        signInButton.textContent = labelText;
        signInBtnDiv.append(iconSpan, signInButton);
        userAccount.append(signInBtnDiv);
      } else {
        const userAccountLink = document.createElement('a');
        userAccountLink.classList.add('user__account--link', labelText.toLowerCase().replace(/\s/g, '-'));
        userAccountLink.href = linkAnchor.href;
        userAccountLink.target = linkAnchor.target;

        const iconSpan = document.createElement('span');
        iconSpan.classList.add('user__account__list-icon');
        const img = iconPicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          iconSpan.append(optimizedPic);
        }
        userAccountLink.append(iconSpan, labelText);
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
  block.append(navbarArena, menu);

  // Optimize all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
