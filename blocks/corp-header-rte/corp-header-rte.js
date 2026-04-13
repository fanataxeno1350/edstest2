import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    engageLogoRow,
    engageLogoLinkRow,
    ...restRows
  ] = [...block.children];

  // Use content detection for item rows
  const contactLinkRows = restRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells.some(cell => cell.querySelector('picture')) && cells.some(cell => cell.querySelector('a'));
  });
  const accountLinkRows = restRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells.some(cell => cell.querySelector('picture')) && cells.some(cell => cell.querySelector('a')) && cells.some(cell => cell.textContent.trim());
  });
  const languageRow = restRows.find((row) => row.textContent.trim() === 'Language value');
  const textRow = restRows.find((row) => row.querySelector('ul'));

  block.textContent = '';

  const navbar = document.createElement('div');
  navbar.classList.add('navbar', 'navbar-arena', 'g-container');

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
  navbar.append(navHamburger);

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block');
  const arenaSpan = document.createElement('span');
  arenaSpan.classList.add('arena');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  const logoAnchor = logoLinkRow.querySelector('a');
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
    logoLink.setAttribute('data-logo-name', 'Arena');
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    logoLink.append(logoPicture);
  }
  arenaSpan.append(logoLink);
  logoBlock.append(arenaSpan);
  logoWrapper.append(logoBlock);
  navbar.append(logoWrapper);

  // Navigation Links
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');

  const parseNavTree = (ul) => [...ul.querySelectorAll(':scope > li')].map((li) => {
    const label = li.querySelector(':scope > p')?.textContent?.trim() ?? '';
    const childUl = li.querySelector(':scope > ul');
    return { label, children: childUl ? parseNavTree(childUl) : [] };
  });

  const textCell = textRow?.querySelector('div');
  const temp = document.createElement('div');
  temp.innerHTML = textCell?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  const navItems = rootUl ? parseNavTree(rootUl) : [];

  const createNavItem = (item, isDesktop = true) => {
    const linkTitle = document.createElement('div');
    linkTitle.classList.add('link-title');
    const span = document.createElement('span');
    span.textContent = item.label;
    linkTitle.append(span);

    if (item.children.length > 0) {
      const panel = document.createElement('div');
      panel.classList.add('desktop-panel', 'panel', item.label.toLowerCase().replace(/\s/g, '-'));
      const linkGrid = document.createElement('div');
      linkGrid.classList.add('link-grid', 'block');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');

      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical'); // Assuming vertical for sub-menus

      const ul = document.createElement('ul');
      ul.classList.add('content', 'links-container', 'accordian-content');

      item.children.forEach((child) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#'; // Placeholder, actual links would come from content
        a.textContent = child.label;
        li.append(a);
        ul.append(li);
      });
      linkGridColumn.append(ul);
      linkContainerSection.append(linkGridColumn);
      linkGrid.append(linkContainerSection);
      panel.append(linkGrid);

      if (isDesktop) {
        linkTitle.addEventListener('mouseenter', () => {
          panel.classList.add('show');
        });
        linkTitle.addEventListener('mouseleave', () => {
          panel.classList.remove('show');
        });
        panel.addEventListener('mouseenter', () => {
          panel.classList.add('show');
        });
        panel.addEventListener('mouseleave', () => {
          panel.classList.remove('show');
        });
      } else {
        // Mobile accordion behavior
        linkTitle.classList.add('accordion', 'nav-link', ...item.label.toLowerCase().split(' '));
        linkTitle.addEventListener('click', () => {
          panel.classList.toggle('show');
          linkTitle.classList.toggle('active');
        });
      }

      return [linkTitle, panel];
    }
    return [linkTitle];
  };

  navItems.forEach((item) => {
    const elements = createNavItem(item);
    elements.forEach((el) => linksDiv.append(el));
  });

  // Engage Logo Link
  const engageLinkTitle = document.createElement('div');
  engageLinkTitle.classList.add('link-title');
  const engageSpan = document.createElement('span');
  const engageLogoLink = document.createElement('a');
  engageLogoLink.classList.add('logo__picture');
  const engageAnchor = engageLogoLinkRow.querySelector('a');
  if (engageAnchor) {
    engageLogoLink.href = engageAnchor.href;
    engageLogoLink.setAttribute('data-logo-name', 'Maruti Suzuki');
  }
  const engagePicture = engageLogoRow.querySelector('picture');
  if (engagePicture) {
    engageLogoLink.append(engagePicture);
  }
  engageSpan.append(engageLogoLink);
  engageLinkTitle.append(engageSpan);
  linksDiv.append(engageLinkTitle);

  navbar.append(linksDiv);

  // Right section
  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';

  // Contact wrapper
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

  contactLinkRows.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const iconPicture = iconCell?.querySelector('picture');
    const linkAnchor = linkCell?.querySelector('a');

    if (iconPicture && linkAnchor) {
      const contactIconLink = document.createElement('a');
      contactIconLink.classList.add('user__contact--icon');
      contactIconLink.href = linkAnchor.href;

      const srOnlySpan = document.createElement('span');
      srOnlySpan.classList.add('sr-only');

      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        contactIconLink.append(optimizedPic);
        srOnlySpan.textContent = img.alt;
        contactIconLink.append(srOnlySpan);
      }

      if (linkAnchor.href.includes('tel:')) {
        contactIconLink.classList.add('phone');
        contactIconLink.addEventListener('click', (e) => {
          e.preventDefault();
          contactBlock.querySelector('.contact-toggle-box').classList.toggle('hidden');
        });
        const hiddenDiv = document.createElement('div');
        hiddenDiv.classList.add('hidden');
        hiddenDiv.textContent = linkAnchor.textContent.trim();
        contactIconsDiv.append(contactIconLink, hiddenDiv);
      } else if (linkAnchor.href.includes('wa.me')) {
        contactIconLink.classList.add('whatsapp');
        contactIconLink.setAttribute('target', '_blank');
        contactIconLink.setAttribute('rel', 'noopener noreferrer');
        contactIconsDiv.append(contactIconLink);
      } else if (linkAnchor.href.includes('mailto:')) {
        contactIconLink.classList.add('email');
        contactIconsDiv.append(contactIconLink);
      }
    }
  });

  contactWrpArena.append(contactIconsDiv);

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const callContainer = document.createElement('div');
  callContainer.classList.add('user__contact__icon-call_container');

  const primaryPhoneLink = document.createElement('a');
  primaryPhoneLink.classList.add('primary-telephone');
  const primaryPhoneAnchorRow = contactLinkRows.find((row) => row.querySelector('a[href^="tel:"]'));
  const primaryPhoneAnchor = primaryPhoneAnchorRow ? primaryPhoneAnchorRow.querySelector('a[href^="tel:"]') : null;
  if (primaryPhoneAnchor) {
    primaryPhoneLink.href = primaryPhoneAnchor.href;
    primaryPhoneLink.textContent = primaryPhoneAnchor.textContent.trim();
  }
  callContainer.append(primaryPhoneLink);
  contactToggleBox.append(callContainer);
  contactWrpArena.append(contactToggleBox);
  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = languageRow?.textContent.trim() ?? '';
  rightDiv.append(languageDiv);

  // Sign-in wrapper
  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden');
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  accountLinkRows.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    const iconPicture = iconCell?.querySelector('picture');
    const linkAnchor = linkCell?.querySelector('a');
    const labelText = labelCell?.textContent?.trim();

    if (iconPicture && linkAnchor && labelText) {
      const accountLink = document.createElement('a');
      accountLink.classList.add('user__account--link');
      accountLink.href = linkAnchor.href;
      accountLink.setAttribute('target', '_self');
      accountLink.classList.add(...labelText.toLowerCase().split(' '));

      const listIconSpan = document.createElement('span');
      listIconSpan.classList.add('user__account__list-icon');
      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        listIconSpan.append(optimizedPic);
      }
      accountLink.append(listIconSpan);
      accountLink.append(document.createTextNode(labelText));
      userAccount.append(accountLink);
    } else if (!iconPicture && !linkAnchor && labelText) {
      // This is likely the "Sign In" button
      const signInBtnDiv = document.createElement('div');
      signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
      const listIconSpan = document.createElement('span');
      listIconSpan.classList.add('user__account__list-icon');
      const signInImg = iconCell?.querySelector('picture > img');
      if (signInImg) {
        const optimizedPic = createOptimizedPicture(signInImg.src, signInImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(signInImg, optimizedPic.querySelector('img'));
        listIconSpan.append(optimizedPic);
      }
      signInBtnDiv.append(listIconSpan);

      const signInButton = document.createElement('button');
      signInButton.setAttribute('type', 'button');
      signInButton.setAttribute('data-sign-out-text', 'Sign Out');
      signInButton.textContent = labelText;
      signInBtnDiv.append(signInButton);
      userAccount.append(signInBtnDiv);
    }
  });

  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightDiv.append(signInWrapper);

  navbar.append(rightDiv);
  block.append(navbar);

  // Mobile menu
  const mobileMenu = document.createElement('div');
  mobileMenu.classList.add('menu', 'hidden', 'menu-arena');
  mobileMenu.id = 'menu';

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

  navItems.forEach((item, index) => {
    const li = document.createElement('li');
    li.id = `menu-item-${index}`;
    li.classList.add('nav-link');
    li.classList.add(...item.label.toLowerCase().split(' '));

    const itemSpan = document.createElement('span');
    itemSpan.classList.add('menu-title');
    if (item.children.length === 0) {
      const a = document.createElement('a');
      a.href = '#'; // Placeholder
      a.textContent = item.label;
      itemSpan.append(a);
    } else {
      itemSpan.textContent = item.label;
      li.classList.add('accordion');
    }
    li.append(itemSpan);

    if (item.children.length > 0) {
      const panel = document.createElement('div');
      panel.classList.add('panel');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
      const ul = document.createElement('ul');
      ul.classList.add('content', 'links-container', 'accordian-content');
      item.children.forEach((child) => {
        const childLi = document.createElement('li');
        const childA = document.createElement('a');
        childA.href = '#'; // Placeholder
        childA.textContent = child.label;
        childLi.append(childA);
        ul.append(childLi);
      });
      linkGridColumn.append(ul);
      linkContainerSection.append(linkGridColumn);
      panel.append(linkContainerSection);
      menuList.append(li, panel);

      li.addEventListener('click', () => {
        panel.classList.toggle('show');
        li.classList.toggle('active');
      });
    } else {
      menuList.append(li);
    }
  });

  // Append mobile account links
  accountLinkRows.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    const iconPicture = iconCell?.querySelector('picture');
    const linkAnchor = linkCell?.querySelector('a');
    const labelText = labelCell?.textContent?.trim();

    if (iconPicture && linkAnchor && labelText) {
      const li = document.createElement('li');
      const accountLink = document.createElement('a');
      accountLink.classList.add('user__account--link');
      accountLink.href = linkAnchor.href;
      accountLink.setAttribute('target', '_self');
      accountLink.classList.add(...labelText.toLowerCase().split(' '));

      const listIconSpan = document.createElement('span');
      listIconSpan.classList.add('user__account__list-icon');
      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        listIconSpan.append(optimizedPic);
      }
      accountLink.append(listIconSpan);
      accountLink.append(document.createTextNode(labelText));
      li.append(accountLink);
      menuList.append(li);
    } else if (!iconPicture && !linkAnchor && labelText) {
      const li = document.createElement('li');
      const signInBtnDiv = document.createElement('div');
      signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
      const listIconSpan = document.createElement('span');
      listIconSpan.classList.add('user__account__list-icon');
      const signInImg = iconCell?.querySelector('picture > img');
      if (signInImg) {
        const optimizedPic = createOptimizedPicture(signInImg.src, signInImg.alt, false, [{ width: '750' }]);
        moveInstrumentation(signInImg, optimizedPic.querySelector('img'));
        listIconSpan.append(optimizedPic);
      }
      signInBtnDiv.append(listIconSpan);

      const signInButton = document.createElement('button');
      signInButton.setAttribute('type', 'button');
      signInButton.setAttribute('data-sign-out-text', 'Sign Out');
      signInButton.textContent = labelText;
      signInBtnDiv.append(signInButton);
      li.append(signInBtnDiv);
      menuList.append(li);
    }
  });

  mobileMenu.append(menuList);
  block.append(mobileMenu);

  // Event listeners for hamburger and close icons
  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    block.closest('.corp-header-wrapper').classList.toggle('show');
  });

  closeIcon.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    block.closest('.corp-header-wrapper').classList.remove('show');
  });

  // Event listener for contact icon to toggle contact details
  contactIconPhone.addEventListener('click', () => {
    contactIconsDiv.classList.toggle('hidden');
  });


  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
