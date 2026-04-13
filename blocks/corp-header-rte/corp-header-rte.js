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

  const [
    logoRow,
    logoLinkRow,
    engageLogoRow,
    engageLogoLinkRow,
    languageRow,
    textRow,
    ...itemRows
  ] = [...block.children];

  // Content detection for item rows
  const contactLinkItems = itemRows.filter((row) => row.children.length === 2);
  const userAccountLinkItems = itemRows.filter((row) => row.children.length === 3);

  block.textContent = '';

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('navbar', 'navbar-arena', 'g-container');

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
  headerWrapper.append(navHamburger);

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block');
  const arenaSpan = document.createElement('span');
  arenaSpan.classList.add('arena');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  if (logoLinkRow) {
    const foundLink = logoLinkRow.querySelector('a');
    if (foundLink) {
      logoLink.href = foundLink.href;
      logoLink.setAttribute('data-logo-name', 'Arena'); // Assuming 'Arena' from original HTML
    }
  }
  if (logoRow) {
    const picture = logoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        logoLink.append(optimizedPic);
      }
    }
  }
  arenaSpan.append(logoLink);
  logoBlock.append(arenaSpan);
  logoWrapper.append(logoBlock);
  headerWrapper.append(logoWrapper);

  // Navigation Links
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');

  const textCell = textRow?.querySelector('div');
  const temp = document.createElement('div');
  temp.innerHTML = textCell?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  const navItems = rootUl ? parseNavTree(rootUl) : [];

  const renderNavItems = (items, parentElement) => {
    items.forEach((item) => {
      const linkTitle = document.createElement('div');
      linkTitle.classList.add('link-title');
      const span = document.createElement('span');
      if (item.children.length > 0) {
        span.textContent = item.label;
        linkTitle.append(span);

        const desktopPanel = document.createElement('div');
        desktopPanel.classList.add('desktop-panel', 'panel', item.label.toLowerCase().replace(/\s/g, '-'));
        const linkGrid = document.createElement('div');
        linkGrid.classList.add('link-grid', 'block');
        const linkContainerSection = document.createElement('div');
        linkContainerSection.classList.add('link-container-section');
        const linkGridColumn = document.createElement('div');
        linkGridColumn.classList.add('link-grid-column', 'link-column-vertical'); // Assuming vertical for desktop
        const ul = document.createElement('ul');
        ul.classList.add('content', 'links-container', 'accordian-content');

        // Placeholder for sub-navigation links. In a real scenario, these would come from
        // a separate model or be hardcoded if they are static.
        // For this exercise, we'll just add a dummy link if there are children.
        item.children.forEach((child) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = '#'; // Placeholder href
          a.textContent = child.label;
          li.append(a);
          ul.append(li);
        });

        linkGridColumn.append(ul);
        linkContainerSection.append(linkGridColumn);
        linkGrid.append(linkContainerSection);
        desktopPanel.append(linkGrid);
        parentElement.append(linkTitle, desktopPanel);

        // Add event listener for desktop panel dropdown
        linkTitle.addEventListener('mouseenter', () => {
          desktopPanel.classList.add('show');
        });
        linkTitle.addEventListener('mouseleave', () => {
          desktopPanel.classList.remove('show');
        });
        desktopPanel.addEventListener('mouseenter', () => {
          desktopPanel.classList.add('show');
        });
        desktopPanel.addEventListener('mouseleave', () => {
          desktopPanel.classList.remove('show');
        });

      } else {
        const a = document.createElement('a');
        a.href = '#'; // Placeholder href
        a.textContent = item.label;
        a.classList.add('button');
        span.append(a);
        linkTitle.append(span);
        parentElement.append(linkTitle);
      }
    });
  };

  renderNavItems(navItems, linksDiv);
  headerWrapper.append(linksDiv);

  // Right section (contact, language, user account)
  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';

  // Contact Wrapper
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
  contactWrpArena.append(contactTitle, contactIconPhone);

  const contactIconsDiv = document.createElement('div');
  contactIconsDiv.classList.add('user__contact__icons', 'hidden');

  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const iconPicture = iconCell?.querySelector('picture');
    const foundLink = linkCell?.querySelector('a');

    if (iconPicture && foundLink) {
      const iconImg = iconPicture.querySelector('img');
      const contactIconLink = document.createElement('a');
      contactIconLink.href = foundLink.href;
      contactIconLink.classList.add('user__contact--icon');

      const srOnlySpan = document.createElement('span');
      srOnlySpan.classList.add('sr-only');

      if (iconImg.alt.toLowerCase().includes('phone')) {
        contactIconLink.classList.add('phone');
        srOnlySpan.textContent = 'phone';
        contactIconLink.addEventListener('click', (e) => {
          e.preventDefault();
          contactWrpArena.querySelector('.contact-toggle-box').classList.toggle('hidden');
        });
      } else if (iconImg.alt.toLowerCase().includes('whatsapp')) {
        contactIconLink.classList.add('whatsapp');
        srOnlySpan.textContent = 'whatsapp';
        contactIconLink.setAttribute('target', '_blank');
        contactIconLink.setAttribute('rel', 'noopener noreferrer');
      } else if (iconImg.alt.toLowerCase().includes('email')) {
        contactIconLink.classList.add('email');
        srOnlySpan.textContent = 'email';
      }

      const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(iconImg, optimizedPic.querySelector('img'));

      contactIconLink.append(srOnlySpan, optimizedPic);
      contactIconsDiv.append(contactIconLink);
    }
  });

  contactWrpArena.append(contactIconsDiv);

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const callContainer = document.createElement('div');
  callContainer.classList.add('user__contact__icon-call_container');
  const primaryTelephone = document.createElement('a');
  primaryTelephone.classList.add('primary-telephone');
  primaryTelephone.href = 'tel:18001021800'; // Hardcoded from example, ideally from model
  primaryTelephone.textContent = '1800 102 1800';
  const secondaryTelephone = document.createElement('a');
  secondaryTelephone.classList.add('secondary-telephone');
  secondaryTelephone.href = 'tel:';
  callContainer.append(primaryTelephone, secondaryTelephone);
  contactToggleBox.append(callContainer);
  contactWrpArena.append(contactToggleBox);

  // Toggle contact icons visibility
  contactIconPhone.addEventListener('click', () => {
    contactIconsDiv.classList.toggle('hidden');
  });

  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  if (languageRow) {
    languageDiv.textContent = languageRow.querySelector('div')?.textContent?.trim() ?? '';
  }
  rightDiv.append(languageDiv);

  // Sign-in wrapper
  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden'); // Hidden by default from original HTML
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  userAccountLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    const iconPicture = iconCell?.querySelector('picture');
    const foundLink = linkCell?.querySelector('a');
    const labelText = labelCell?.textContent?.trim() ?? '';

    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const userAccountLink = document.createElement('a');
      userAccountLink.classList.add('user__account--link');
      if (foundLink) {
        userAccountLink.href = foundLink.href;
      }
      userAccountLink.setAttribute('target', '_self'); // From original HTML
      userAccountLink.classList.add(labelText.toLowerCase().replace(/\s/g, '-'));

      const listIconSpan = document.createElement('span');
      listIconSpan.classList.add('user__account__list-icon');
      const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
      listIconSpan.append(optimizedPic);

      userAccountLink.append(listIconSpan, document.createTextNode(labelText));
      userAccount.append(userAccountLink);
    }
  });

  // Sign In button (from original HTML, it's a button inside a div, not an <a>)
  const signInBtnDiv = document.createElement('div');
  signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
  const signInListIconSpan = document.createElement('span');
  signInListIconSpan.classList.add('user__account__list-icon');
  // Assuming a static image for sign-in icon if not provided in EDS
  const signInIconImg = document.createElement('img');
  signInIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776063821632.svg+xml'; // From original HTML
  signInIconImg.loading = 'lazy';
  signInIconImg.alt = 'Sign-in';
  signInListIconSpan.append(signInIconImg);
  const signInButton = document.createElement('button');
  signInButton.setAttribute('type', 'button');
  signInButton.setAttribute('data-sign-out-text', 'Sign Out');
  signInButton.textContent = 'Sign In';
  signInBtnDiv.append(signInListIconSpan, signInButton);
  userAccount.append(signInBtnDiv);

  // Add event listener for the sign-in button
  signInButton.addEventListener('click', () => {
    // Implement sign-in/sign-out logic here
    console.log('Sign In/Out button clicked');
  });

  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightDiv.append(signInWrapper);

  // Engage Logo (from original HTML, it's a link with a picture)
  const engageLogoLinkDiv = document.createElement('div');
  engageLogoLinkDiv.classList.add('link-title');
  const engageLogoSpan = document.createElement('span');
  const engageLink = document.createElement('a');
  engageLink.classList.add('logo__picture');
  if (engageLogoLinkRow) {
    const foundLink = engageLogoLinkRow.querySelector('a');
    if (foundLink) {
      engageLink.href = foundLink.href;
      engageLink.setAttribute('data-logo-name', 'Maruti Suzuki');
    }
  }
  if (engageLogoRow) {
    const picture = engageLogoRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '79' }]); // Using width from original HTML
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        engageLink.append(optimizedPic);
      }
    }
  }
  engageLogoSpan.append(engageLink);
  engageLogoLinkDiv.append(engageLogoSpan);
  linksDiv.append(engageLogoLinkDiv); // Appending to linksDiv as per original HTML structure

  headerWrapper.append(rightDiv);
  block.append(headerWrapper);


  // Mobile Menu (hidden by default)
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

  const renderMobileNavItems = (items, parentUl, level = 0) => {
    items.forEach((item, index) => {
      const li = document.createElement('li');
      li.id = `menu-item-${index}`;
      li.classList.add('nav-link');

      const spanTitle = document.createElement('span');
      spanTitle.classList.add('menu-title');

      if (item.children.length > 0) {
        li.classList.add('accordion', item.label.toLowerCase().replace(/\s/g, '-'));
        spanTitle.textContent = item.label;
        li.append(spanTitle);

        const panelDiv = document.createElement('div');
        panelDiv.classList.add('panel');
        const linkContainerSection = document.createElement('div');
        linkContainerSection.classList.add('link-container-section');
        const linkGridColumn = document.createElement('div');
        linkGridColumn.classList.add('link-grid-column', 'link-column-vertical'); // Assuming vertical for mobile
        const subUl = document.createElement('ul');
        subUl.classList.add('content', 'links-container', 'accordian-content');

        item.children.forEach((child) => {
          const subLi = document.createElement('li');
          const a = document.createElement('a');
          a.href = '#'; // Placeholder href
          a.textContent = child.label;
          subLi.append(a);
          subUl.append(subLi);
        });

        linkGridColumn.append(subUl);
        linkContainerSection.append(linkGridColumn);
        panelDiv.append(linkContainerSection);
        li.append(panelDiv);

        // Accordion functionality for mobile menu
        spanTitle.addEventListener('click', () => {
          li.classList.toggle('active');
          panelDiv.classList.toggle('show');
        });

      } else {
        li.classList.add(item.label.toLowerCase().replace(/\s/g, '-'));
        const a = document.createElement('a');
        a.href = '#'; // Placeholder href
        a.textContent = item.label;
        a.classList.add('button');
        spanTitle.append(a);
        li.append(spanTitle);
      }
      parentUl.append(li);
    });
  };

  renderMobileNavItems(navItems, menuList);

  // Add contact links to mobile menu
  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const iconPicture = iconCell?.querySelector('picture');
    const foundLink = linkCell?.querySelector('a');

    if (iconPicture && foundLink) {
      const iconImg = iconPicture.querySelector('img');
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = foundLink.href;
      a.classList.add('user__account--link');
      if (iconImg.alt.toLowerCase().includes('phone')) {
        a.classList.add('phone');
      } else if (iconImg.alt.toLowerCase().includes('whatsapp')) {
        a.classList.add('whatsapp');
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      } else if (iconImg.alt.toLowerCase().includes('email')) {
        a.classList.add('email');
      }

      const listIconSpan = document.createElement('span');
      listIconSpan.classList.add('user__account__list-icon');
      const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
      listIconSpan.append(optimizedPic);
      a.append(listIconSpan, document.createTextNode(foundLink.textContent.trim()));
      li.append(a);
      menuList.append(li);
    }
  });

  // Add user account links to mobile menu
  userAccountLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    const iconPicture = iconCell?.querySelector('picture');
    const foundLink = linkCell?.querySelector('a');
    const labelText = labelCell?.textContent?.trim() ?? '';

    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const li = document.createElement('li');
      const userAccountLink = document.createElement('a');
      userAccountLink.classList.add('user__account--link');
      if (foundLink) {
        userAccountLink.href = foundLink.href;
      }
      userAccountLink.setAttribute('target', '_self');
      userAccountLink.classList.add(labelText.toLowerCase().replace(/\s/g, '-'));

      const listIconSpan = document.createElement('span');
      listIconSpan.classList.add('user__account__list-icon');
      const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
      listIconSpan.append(optimizedPic);

      userAccountLink.append(listIconSpan, document.createTextNode(labelText));
      li.append(userAccountLink);
      menuList.append(li);
    }
  });

  // Mobile Sign In button
  const mobileSignInLi = document.createElement('li');
  const mobileSignInBtnDiv = document.createElement('div');
  mobileSignInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
  const mobileSignInListIconSpan = document.createElement('span');
  mobileSignInListIconSpan.classList.add('user__account__list-icon');
  const mobileSignInIconImg = document.createElement('img');
  mobileSignInIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776063821632.svg+xml';
  mobileSignInIconImg.loading = 'lazy';
  mobileSignInIconImg.alt = 'Sign-in';
  mobileSignInListIconSpan.append(mobileSignInIconImg);
  const mobileSignInButton = document.createElement('button');
  mobileSignInButton.setAttribute('type', 'button');
  mobileSignInButton.setAttribute('data-sign-out-text', 'Sign Out');
  mobileSignInButton.textContent = 'Sign In';
  mobileSignInBtnDiv.append(mobileSignInListIconSpan, mobileSignInButton);
  mobileSignInLi.append(mobileSignInBtnDiv);
  menuList.append(mobileSignInLi);

  // Add event listener for the mobile sign-in button
  mobileSignInButton.addEventListener('click', () => {
    // Implement sign-in/sign-out logic here for mobile
    console.log('Mobile Sign In/Out button clicked');
  });


  menuDiv.append(menuList);
  block.append(menuDiv);

  // Event listeners for mobile menu toggle
  hamburgerButton.addEventListener('click', () => {
    menuDiv.classList.toggle('hidden');
    hamburgerButton.setAttribute('aria-expanded', menuDiv.classList.contains('hidden') ? 'false' : 'true');
  });

  closeIcon.addEventListener('click', () => {
    menuDiv.classList.add('hidden');
    hamburgerButton.setAttribute('aria-expanded', 'false');
  });
}
