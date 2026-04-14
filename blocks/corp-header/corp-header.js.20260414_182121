import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root rows based on BlockJson model
  const [logoRow, logoLinkRow, languageRow, ...itemRows] = [...block.children];

  // Create main header container
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
  logoBlock.classList.add('logo', 'block'); // Add block class for instrumentation
  moveInstrumentation(logoRow, logoBlock);

  const logoSpan = document.createElement('span');
  logoSpan.classList.add('arena');

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  const logoHref = logoLinkRow.querySelector('a')?.href || '#';
  logoLink.href = logoHref;
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    logoLink.append(logoPicture);
  }
  logoSpan.append(logoLink);
  logoBlock.append(logoSpan);
  logoWrapper.append(logoBlock);
  navbarArena.append(logoWrapper);

  // Navigation Links, Contact Links, Sign-in Links
  const linksContainer = document.createElement('div');
  linksContainer.classList.add('links');

  const rightSection = document.createElement('div');
  rightSection.classList.add('right');
  rightSection.id = 'nav-right';

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');

  // Filter item rows based on their structure (number of cells and content)
  const navItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells.some(c => c.querySelector('ul')) && cells.some(c => !c.querySelector('ul') && !c.querySelector('a'));
  });
  const contactItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells.some(c => c.querySelector('picture'));
  });
  const signInItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 4 && cells.some(c => c.querySelector('picture')) && cells.some(c => c.querySelector('a'));
  });

  navItems.forEach((row, index) => {
    const cells = [...row.children];
    const labelCell = cells.find((c) => !c.querySelector('ul') && !c.querySelector('a'));
    const linkCell = cells.find((c) => c.querySelector('a') && !c.querySelector('ul'));
    const hierarchyCell = cells.find((c) => c.querySelector('ul'));

    const label = labelCell?.textContent.trim() || '';
    const href = linkCell?.querySelector('a')?.href || '#';

    const listItem = document.createElement('li');
    listItem.id = `menu-item-${index}`;
    listItem.classList.add('nav-link', label.toLowerCase().replace(/\s/g, '-'));
    moveInstrumentation(row, listItem);

    const menuTitleSpan = document.createElement('span');
    menuTitleSpan.classList.add('menu-title');

    if (hierarchyCell) {
      listItem.classList.add('accordion');
      menuTitleSpan.textContent = label;
      listItem.append(menuTitleSpan);

      const panelDiv = document.createElement('div');
      panelDiv.classList.add('panel');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Instrumentation for the richtext cell

      // Apply classes to nested elements from ORIGINAL HTML
      tempDiv.querySelectorAll('ul').forEach((ul) => {
        ul.classList.add('content', 'links-container', 'accordian-content');
        const columnDiv = document.createElement('div');
        columnDiv.classList.add('link-grid-column', 'link-column-vertical');
        // Move children from ul to columnDiv
        while (ul.firstChild) {
          columnDiv.append(ul.firstChild);
        }
        ul.append(columnDiv); // Put columnDiv inside ul
        linkContainerSection.append(ul); // Append ul (which now contains columnDiv) to linkContainerSection
      });

      // Move all children from tempDiv to linkContainerSection
      while (tempDiv.firstChild) {
        linkContainerSection.append(tempDiv.firstChild);
      }

      panelDiv.append(linkContainerSection);
      listItem.append(panelDiv);

      // Desktop panel for hover
      const desktopPanel = document.createElement('div');
      desktopPanel.classList.add('desktop-panel', 'panel', label.toLowerCase().replace(/\s/g, '-'));
      // Clone the entire panelDiv content for the desktop panel
      const clonedPanelContent = panelDiv.cloneNode(true);
      desktopPanel.append(clonedPanelContent);
      linksContainer.append(createLinkTitle(label, href, desktopPanel));
    } else if (label) {
      const link = document.createElement('a');
      link.href = href;
      link.title = label.toLowerCase();
      link.classList.add('button');
      link.textContent = label;
      menuTitleSpan.append(link);
      listItem.append(menuTitleSpan);
      linksContainer.append(createLinkTitle(label, href));
    }
    menuList.append(listItem);
  });

  navbarArena.append(linksContainer);

  // Contact Links
  const contactWrapper = document.createElement('div');
  contactWrapper.classList.add('contact-wrapper');
  const contactBlock = document.createElement('div');
  contactBlock.classList.add('contact', 'block', 'contact_wrp_arena', 'user__contact', 'header');
  contactWrapper.append(contactBlock);
  rightSection.append(contactWrapper);

  const contactTitle = document.createElement('h4');
  contactTitle.classList.add('user__contact-title');
  contactTitle.textContent = 'Contact Us';
  contactBlock.append(contactTitle);

  const contactIconPhone = document.createElement('span');
  contactIconPhone.classList.add('user__contact-title', 'icon-phone');
  contactIconPhone.setAttribute('aria-label', 'Contact Us');
  contactBlock.append(contactIconPhone);

  const contactIconsDiv = document.createElement('div');
  contactIconsDiv.classList.add('user__contact__icons', 'hidden');
  contactBlock.append(contactIconsDiv);

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  contactBlock.append(contactToggleBox);

  const contactCallContainer = document.createElement('div');
  contactCallContainer.classList.add('user__contact__icon-call_container');
  contactToggleBox.append(contactCallContainer);

  let primaryPhoneLink = document.createElement('a');
  primaryPhoneLink.classList.add('primary-telephone');
  primaryPhoneLink.href = 'tel:';
  contactCallContainer.append(primaryPhoneLink);

  let secondaryPhoneLink = document.createElement('a');
  secondaryPhoneLink.classList.add('secondary-telephone');
  secondaryPhoneLink.href = 'tel:';
  contactCallContainer.append(secondaryPhoneLink);

  contactItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find((c) => c.querySelector('picture'));
    const linkCell = cells.find((c) => c.querySelector('a') && !c.querySelector('ul'));
    // The BlockJson model for contact-link-item has a richtext field, but it's not used for phone numbers directly.
    // Phone numbers are expected to be in the 'link' field.

    const link = linkCell?.querySelector('a');
    const href = link?.href || '#';
    const linkText = link?.textContent.trim() || '';
    const iconPicture = iconCell?.querySelector('picture');

    if (linkText.includes('1800') && link.href.startsWith('tel:')) {
      primaryPhoneLink.href = link.href;
      primaryPhoneLink.textContent = linkText;
    } else if (link.href.startsWith('tel:')) {
      secondaryPhoneLink.href = link.href;
      secondaryPhoneLink.textContent = linkText;
    }

    if (iconPicture && link) {
      const contactIconAnchor = document.createElement('a');
      contactIconAnchor.classList.add('user__contact--icon');
      contactIconAnchor.href = href;
      contactIconAnchor.target = '_blank';
      contactIconAnchor.rel = 'noopener noreferrer';

      const srOnlySpan = document.createElement('span');
      srOnlySpan.classList.add('sr-only');

      const iconImg = iconPicture.querySelector('img');
      if (iconImg) {
        const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '30' }]);
        moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
        contactIconAnchor.append(optimizedIcon);
        srOnlySpan.textContent = iconImg.alt;
        contactIconAnchor.prepend(srOnlySpan);

        if (iconImg.alt.toLowerCase().includes('phone')) {
          contactIconAnchor.classList.add('phone');
          contactIconAnchor.addEventListener('click', (e) => {
            e.preventDefault();
            contactToggleBox.classList.toggle('hidden');
          });
        } else if (iconImg.alt.toLowerCase().includes('whatsapp')) {
          contactIconAnchor.classList.add('whatsapp');
        } else if (iconImg.alt.toLowerCase().includes('email')) {
          contactIconAnchor.classList.add('email');
        }
        contactIconsDiv.append(contactIconAnchor);
      }
    }
  });

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = languageRow.textContent.trim();
  moveInstrumentation(languageRow, languageDiv);
  rightSection.append(languageDiv);

  // Sign-in Links
  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden'); // Original HTML has this as hidden
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  signInWrapper.append(signInBlock);
  rightSection.append(signInWrapper);

  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  signInBlock.append(userDropdown);

  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');
  userDropdown.append(userAccount);

  signInItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find((c) => c.querySelector('picture'));
    const linkCell = cells.find((c) => c.querySelector('a') && !c.querySelector('ul'));
    const labelCell = cells.find((c) => !c.querySelector('picture') && !c.querySelector('a') && !c.querySelector('ul'));
    // The BlockJson model for sign-in-link-item also has a richtext field, but it's not used for these simple links.

    const link = linkCell?.querySelector('a');
    const href = link?.href || '#';
    const label = labelCell?.textContent.trim() || '';
    const iconPicture = iconCell?.querySelector('picture');

    const userAccountLink = document.createElement('a');
    userAccountLink.classList.add('user__account--link', label.toLowerCase().replace(/\s/g, '-'));
    userAccountLink.href = href;
    userAccountLink.target = '_self';
    moveInstrumentation(row, userAccountLink); // Instrumentation for the whole row

    const listIconSpan = document.createElement('span');
    listIconSpan.classList.add('user__account__list-icon');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      if (iconImg) {
        const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '30' }]);
        moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
        listIconSpan.append(optimizedIcon);
      }
    }
    userAccountLink.append(listIconSpan);
    userAccountLink.append(label); // Append label text

    userAccount.append(userAccountLink);
  });

  // Sign In button (if needed, extracted from original HTML)
  const signInButtonContainer = document.createElement('div');
  signInButtonContainer.classList.add('user__account--link', 'sign-in-btn');
  const signInButtonIconSpan = document.createElement('span');
  signInButtonIconSpan.classList.add('user__account__list-icon');
  const signInButtonIconImg = document.createElement('img');
  signInButtonIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776063821632.svg+xml';
  signInButtonIconImg.loading = 'lazy';
  signInButtonIconImg.alt = 'Sign-in';
  signInButtonIconSpan.append(signInButtonIconImg);
  signInButtonContainer.append(signInButtonIconSpan);

  const signInButton = document.createElement('button');
  signInButton.setAttribute('type', 'button');
  signInButton.setAttribute('data-sign-out-text', 'Sign Out');
  signInButton.textContent = 'Sign In';
  signInButtonContainer.append(signInButton);
  userAccount.append(signInButtonContainer);


  navbarArena.append(rightSection);

  // Mobile Menu container
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
  mobileMenu.append(menuList); // Append the constructed menu list

  block.textContent = '';
  block.append(navbarArena, mobileMenu);

  // Event Listeners for mobile menu
  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    document.body.classList.toggle('no-scroll');
  });

  closeIcon.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  });

  // Accordion functionality for mobile menu
  mobileMenu.querySelectorAll('li.accordion > .menu-title').forEach((title) => {
    title.addEventListener('click', () => {
      const parentLi = title.closest('li.accordion');
      // The panel is a sibling of the li, not necessarily the next one.
      // Find the panel associated with this accordion item.
      const panel = parentLi.nextElementSibling;
      if (panel && panel.classList.contains('panel')) {
        parentLi.classList.toggle('active');
        panel.classList.toggle('hidden');
      }
    });
  });

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}

function createLinkTitle(label, href = '#', panel = null) {
  const linkTitle = document.createElement('div');
  linkTitle.classList.add('link-title');
  const span = document.createElement('span');
  if (panel) {
    span.textContent = label;
    linkTitle.classList.add(label.toLowerCase().replace(/\s/g, '-'));
    linkTitle.addEventListener('mouseenter', () => {
      panel.classList.add('show');
    });
    linkTitle.addEventListener('mouseleave', () => {
      panel.classList.remove('show');
    });
  } else {
    const link = document.createElement('a');
    link.href = href;
    link.title = label.toLowerCase();
    link.classList.add('button');
    link.textContent = label;
    span.append(link);
  }
  linkTitle.append(span);
  if (panel) {
    linkTitle.append(panel);
  }
  return linkTitle;
}
