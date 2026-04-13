import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  // Destructure fixed fields
  const [
    logoRow,
    logoLinkRow,
    engageLogoRow,
    engageLogoLinkRow,
    languageRow,
    textRow, // Navigation Hierarchy richtext
  ] = allRows;

  // Separate item rows
  const itemRows = allRows.slice(6); // After language and text (richtext) rows

  // Use content detection for item rows
  const contactLinkItems = itemRows.filter((row) => row.children.length === 2);
  const signInLinkItems = itemRows.filter((row) => row.children.length === 3);

  // --- Header Top (Logo, Engage Logo, Contact Links, Language, Sign In Links) ---
  const navbarArena = document.createElement('div');
  navbarArena.classList.add('navbar', 'navbar-arena', 'g-container');

  // Hamburger menu (structural element from original HTML)
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
  const logoSpan = document.createElement('span');
  logoSpan.classList.add('arena');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  logoLink.setAttribute('data-logo-name', 'Arena');
  if (logoLinkRow) {
    const foundLink = logoLinkRow.querySelector('a');
    if (foundLink) {
      logoLink.href = foundLink.href;
      moveInstrumentation(logoLinkRow, logoLink);
    }
  }
  if (logoRow) {
    const picture = logoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(picture, optimizedPic);
      logoLink.append(optimizedPic);
    }
  }
  logoSpan.append(logoLink);
  logoBlock.append(logoSpan);
  logoWrapper.append(logoBlock);
  navbarArena.append(logoWrapper);

  // Right section (Contact, Language, Sign-in)
  const rightSection = document.createElement('div');
  rightSection.classList.add('right');
  rightSection.id = 'nav-right';

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

  const userContactIcons = document.createElement('div');
  userContactIcons.classList.add('user__contact__icons', 'hidden');

  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const link = linkCell?.querySelector('a');
    const iconPicture = iconCell?.querySelector('picture');
    const iconImg = iconPicture ? iconPicture.querySelector('img') : null;

    if (link && iconImg) {
      const contactLink = document.createElement('a');
      contactLink.href = link.href;
      contactLink.classList.add('user__contact--icon');
      if (link.href.includes('tel:')) {
        contactLink.classList.add('phone');
        // Original HTML uses inline onclick, replace with addEventListener
        contactLink.addEventListener('click', (e) => {
          e.preventDefault();
          contactWrpArena.querySelector('.contact-toggle-box').classList.toggle('hidden');
        });
      } else if (link.href.includes('wa.me')) {
        contactLink.classList.add('whatsapp');
        contactLink.setAttribute('target', '_blank');
        contactLink.setAttribute('rel', 'noopener noreferrer');
      } else if (link.href.includes('mailto:')) {
        contactLink.classList.add('email');
      }

      const srOnly = document.createElement('span');
      srOnly.classList.add('sr-only');
      srOnly.textContent = iconImg.alt;
      contactLink.append(srOnly);

      const optimizedIconPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '48' }]);
      moveInstrumentation(iconPicture, optimizedIconPic);
      contactLink.append(optimizedIconPic);
      userContactIcons.append(contactLink);
    }
    moveInstrumentation(row, userContactIcons.lastChild); // Corrected instrumentation target
  });

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const contactCallContainer = document.createElement('div');
  contactCallContainer.classList.add('user__contact__icon-call_container');

  const primaryTelephoneLink = document.createElement('a');
  primaryTelephoneLink.classList.add('primary-telephone');
  primaryTelephoneLink.textContent = '1800 102 1800'; // Hardcoded from original HTML
  primaryTelephoneLink.href = 'tel:18001021800';
  contactCallContainer.append(primaryTelephoneLink);

  const secondaryTelephoneLink = document.createElement('a');
  secondaryTelephoneLink.classList.add('secondary-telephone');
  secondaryTelephoneLink.href = 'tel:'; // Empty from original HTML
  contactCallContainer.append(secondaryTelephoneLink);
  contactToggleBox.append(contactCallContainer);

  contactWrpArena.append(contactTitle, contactIconPhone, userContactIcons, contactToggleBox);
  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightSection.append(contactWrapper);

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  if (languageRow) {
    languageDiv.textContent = languageRow.textContent.trim();
    moveInstrumentation(languageRow, languageDiv);
  }
  rightSection.append(languageDiv);

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
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    const link = linkCell?.querySelector('a');
    const label = labelCell?.textContent.trim() ?? '';
    const iconPicture = iconCell?.querySelector('picture');
    const iconImg = iconPicture ? iconPicture.querySelector('img') : null;

    if (link && iconImg) {
      const userAccountLink = document.createElement('a');
      userAccountLink.href = link.href;
      userAccountLink.classList.add('user__account--link');
      userAccountLink.setAttribute('target', '_self');
      userAccountLink.classList.add(...link.href.split('/').pop().split('-')); // Add classes like 'reach', 'us', 'profile'

      const spanIcon = document.createElement('span');
      spanIcon.classList.add('user__account__list-icon');
      const optimizedIconPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '48' }]);
      moveInstrumentation(iconPicture, optimizedIconPic);
      spanIcon.append(optimizedIconPic);
      userAccountLink.append(spanIcon, label);
      userAccount.append(userAccountLink);
    } else if (!link && label === 'Sign In' && iconImg) { // Handle the Sign In button specifically
      const signInBtnDiv = document.createElement('div');
      signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');

      const spanIcon = document.createElement('span');
      spanIcon.classList.add('user__account__list-icon');
      const optimizedIconPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '48' }]);
      moveInstrumentation(iconPicture, optimizedIconPic);
      spanIcon.append(optimizedIconPic);

      const signInButton = document.createElement('button');
      signInButton.setAttribute('type', 'button');
      signInButton.setAttribute('data-sign-out-text', 'Sign Out');
      signInButton.textContent = label;
      signInBtnDiv.append(spanIcon, signInButton);
      userAccount.append(signInBtnDiv);
    }
    moveInstrumentation(row, userAccount.lastChild);
  });

  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightSection.append(signInWrapper);

  navbarArena.append(rightSection);

  // --- Navigation Hierarchy (RTE) ---
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');

  function parseNavTree(ul) {
    return [...ul.querySelectorAll(':scope > li')].map((li) => {
      const labelElement = li.querySelector(':scope > p');
      const label = labelElement?.textContent?.trim() ?? '';
      const link = labelElement?.querySelector('a'); // Check if the label itself is a link
      const childUl = li.querySelector(':scope > ul');
      return { label, link: link ? link.href : null, children: childUl ? parseNavTree(childUl) : [] };
    });
  }

  function renderNavItems(items, parentContainer) {
    items.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('nav-link'); // Add nav-link class to all list items

      const linkTitleSpan = document.createElement('span');
      linkTitleSpan.classList.add('menu-title');

      if (item.children.length > 0) {
        // Parent item with children: create toggle + nested list
        li.classList.add('accordion'); // Add accordion class for parent items

        const labelElement = document.createElement('span'); // Use span for the label that acts as a toggle
        labelElement.textContent = item.label;
        linkTitleSpan.append(labelElement);

        const desktopPanel = document.createElement('div');
        desktopPanel.classList.add('desktop-panel', 'panel', item.label.toLowerCase().replace(/\s/g, '-')); // Add class based on label

        // Simplified structure for nested UL
        const ul = document.createElement('ul');
        ul.classList.add('content', 'links-container', 'accordian-content');

        // RECURSIVELY render children (handles any depth)
        renderNavItems(item.children, ul);

        desktopPanel.append(ul); // Append the ul directly to the panel
        li.append(linkTitleSpan, desktopPanel);

        // Add event listener for toggle behavior
        labelElement.addEventListener('click', () => {
          desktopPanel.classList.toggle('show'); // Toggle a class to show/hide the panel
          li.classList.toggle('active'); // Add/remove active class on the parent li
        });

      } else {
        // Leaf item: just the label or link
        if (item.link) {
          const link = document.createElement('a');
          link.href = item.link;
          link.textContent = item.label;
          linkTitleSpan.append(link);
        } else {
          const span = document.createElement('span');
          span.textContent = item.label;
          linkTitleSpan.append(span);
        }
        li.append(linkTitleSpan);
      }
      parentContainer.append(li);
    });
  }

  const textCell = textRow?.querySelector('div');
  const temp = document.createElement('div');
  temp.innerHTML = textCell?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  const navItems = rootUl ? parseNavTree(rootUl) : [];

  // Create the main navigation list for desktop
  const desktopNavList = document.createElement('div');
  desktopNavList.classList.add('links'); // Matches original HTML structure for desktop nav
  renderNavItems(navItems, desktopNavList);
  navbarArena.append(desktopNavList);

  // Create the mobile menu structure
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
  menuHeader.append(backArrow, menuTitle, closeIcon);
  mobileMenu.append(menuHeader);

  const mobileMenuList = document.createElement('ul');
  mobileMenuList.classList.add('menu-list');
  renderNavItems(navItems, mobileMenuList); // Re-use the same render function for mobile
  mobileMenu.append(mobileMenuList);
  block.append(mobileMenu); // Append mobile menu to the block, outside navbarArena

  // Add event listeners for hamburger and close icons
  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    hamburgerButton.setAttribute('aria-expanded', mobileMenu.classList.contains('hidden') ? 'false' : 'true');
  });

  closeIcon.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    hamburgerButton.setAttribute('aria-expanded', 'false');
  });

  // Append the main navbar-arena to the block
  block.textContent = '';
  block.append(navbarArena);

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
