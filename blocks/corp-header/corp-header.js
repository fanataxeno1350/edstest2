import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, languageRow, ...itemRows] = [...block.children];

  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('navbar', 'navbar-arena', 'g-container');

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
  headerWrapper.append(navHamburger);

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block'); // Add 'block' class
  const arenaSpan = document.createElement('span');
  arenaSpan.classList.add('arena');

  const logoPicture = logoRow.querySelector('picture');
  const logoLink = logoLinkRow.querySelector('a');

  if (logoPicture && logoLink) {
    const logoAnchor = document.createElement('a');
    logoAnchor.classList.add('logo__picture');
    logoAnchor.href = logoLink.href;
    logoAnchor.setAttribute('data-logo-name', 'Arena'); // From original HTML

    const optimizedPic = createOptimizedPicture(logoPicture.querySelector('img').src, logoPicture.querySelector('img').alt, false, [{ width: '750' }]);
    moveInstrumentation(logoPicture.querySelector('img'), optimizedPic.querySelector('img'));
    logoAnchor.append(optimizedPic);
    arenaSpan.append(logoAnchor);
  } else if (logoPicture) {
    const optimizedPic = createOptimizedPicture(logoPicture.querySelector('img').src, logoPicture.querySelector('img').alt, false, [{ width: '750' }]);
    moveInstrumentation(logoPicture.querySelector('img'), optimizedPic.querySelector('img'));
    arenaSpan.append(optimizedPic);
  }
  logoBlock.append(arenaSpan);
  logoWrapper.append(logoBlock);
  headerWrapper.append(logoWrapper);

  // Navigation and Contact Links
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');

  // Content detection for different item types
  const navigationItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells.some(cell => cell.querySelector('ul')) && !cells.some(cell => cell.querySelector('picture'));
  });
  const contactItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells.some(cell => cell.querySelector('picture')) && cells.some(cell => cell.querySelector('ul'));
  });
  const signInItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 4 && cells.some(cell => cell.querySelector('ul'));
  });

  navigationItems.forEach((row) => {
    const labelCell = [...row.children].find((cell) => !cell.querySelector('a') && !cell.querySelector('ul'));
    const linkCell = [...row.children].find((cell) => cell.querySelector('a') && !cell.querySelector('ul'));
    const hierarchyCell = [...row.children].find((cell) => cell.querySelector('ul'));

    if (labelCell) {
      const linkTitle = document.createElement('div');
      linkTitle.classList.add('link-title');
      const span = document.createElement('span');
      if (linkCell) {
        const link = document.createElement('a');
        link.href = linkCell.querySelector('a').href;
        link.textContent = labelCell.textContent;
        link.classList.add('button'); // From original HTML
        span.append(link);
      } else {
        span.textContent = labelCell.textContent;
      }
      linkTitle.append(span);
      linksDiv.append(linkTitle);

      if (hierarchyCell) {
        const desktopPanel = document.createElement('div');
        desktopPanel.classList.add('desktop-panel', 'panel', labelCell.textContent.toLowerCase().replace(/\s/g, '-')); // Class from original HTML

        const linkGrid = document.createElement('div');
        linkGrid.classList.add('link-grid', 'block');
        const linkContainerSection = document.createElement('div');
        linkContainerSection.classList.add('link-container-section');

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML;

        const topLevelUls = [...tempDiv.children].filter((el) => el.tagName === 'UL');

        topLevelUls.forEach((ul) => {
          const linkGridColumn = document.createElement('div');
          linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

          // Apply classes to the nested structure from ORIGINAL HTML
          ul.classList.add('content', 'links-container', 'accordian-content');
          ul.querySelectorAll('a').forEach((a) => {
            // No specific class for <a> in original HTML within these lists, but we can add 'button' if needed
            // a.classList.add('button'); // Example if needed
          });
          ul.querySelectorAll('li').forEach((li) => {
            // No specific class for <li> in original HTML within these lists
          });

          linkGridColumn.append(ul);
          linkContainerSection.append(linkGridColumn);
        });

        moveInstrumentation(hierarchyCell, tempDiv);
        linkGrid.append(linkContainerSection);
        desktopPanel.append(linkGrid);
        linksDiv.append(desktopPanel);
      }
    }
  });

  headerWrapper.append(linksDiv);

  // Right section (Contact, Language, Sign-in)
  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';

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

  contactItems.forEach((row) => {
    const iconCell = [...row.children].find((cell) => cell.querySelector('picture'));
    const linkCell = [...row.children].find((cell) => cell.querySelector('a') && !cell.querySelector('ul'));

    if (iconCell && linkCell) {
      const iconAnchor = document.createElement('a');
      iconAnchor.classList.add('user__contact--icon');
      iconAnchor.href = linkCell.querySelector('a').href;

      const iconImg = iconCell.querySelector('img');
      if (iconImg) {
        const srOnlySpan = document.createElement('span');
        srOnlySpan.classList.add('sr-only');
        srOnlySpan.textContent = iconImg.alt; // Use alt text for screen readers
        iconAnchor.append(srOnlySpan);

        const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '32' }]);
        moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
        iconAnchor.append(optimizedPic);
      }

      // Determine specific class based on link type (simplified for example)
      if (iconAnchor.href.includes('tel:')) {
        iconAnchor.classList.add('phone');
        // Add event listener for phone icon to toggle contact details
        iconAnchor.addEventListener('click', (e) => {
          e.preventDefault();
          contactWrpArena.querySelector('.contact-toggle-box').classList.toggle('hidden');
        });
      } else if (iconAnchor.href.includes('wa.me')) {
        iconAnchor.classList.add('whatsapp');
        iconAnchor.setAttribute('target', '_blank');
        iconAnchor.setAttribute('rel', 'noopener noreferrer');
      } else if (iconAnchor.href.includes('mailto:')) {
        iconAnchor.classList.add('email');
      }
      contactIconsDiv.append(iconAnchor);
    }
  });

  contactWrpArena.append(contactIconsDiv);

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const callContainer = document.createElement('div');
  callContainer.classList.add('user__contact__icon-call_container');
  const primaryTelLink = document.createElement('a');
  primaryTelLink.classList.add('primary-telephone');
  primaryTelLink.href = 'tel:18001021800'; // Hardcoded from original HTML
  primaryTelLink.textContent = '1800 102 1800';
  const secondaryTelLink = document.createElement('a');
  secondaryTelLink.classList.add('secondary-telephone');
  secondaryTelLink.href = 'tel:';
  callContainer.append(primaryTelLink, secondaryTelLink);
  contactToggleBox.append(callContainer);
  contactWrpArena.append(contactToggleBox);

  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = languageRow.textContent.trim();
  rightDiv.append(languageDiv);

  // Sign In Links
  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden');
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  signInItems.forEach((row) => {
    const iconCell = [...row.children].find((cell) => cell.querySelector('picture'));
    const linkCell = [...row.children].find((cell) => cell.querySelector('a') && !cell.querySelector('ul'));
    const labelCell = [...row.children].find((cell) => !cell.querySelector('a') && !cell.querySelector('ul') && !cell.querySelector('picture'));

    if (linkCell && labelCell) {
      const accountLink = document.createElement('a');
      accountLink.classList.add('user__account--link');
      accountLink.href = linkCell.querySelector('a').href;
      accountLink.textContent = labelCell.textContent;

      if (labelCell.textContent.toLowerCase().includes('reach us')) {
        accountLink.classList.add('reach', 'us');
      } else if (labelCell.textContent.toLowerCase().includes('profile')) {
        accountLink.classList.add('profile');
      }

      if (iconCell) {
        const iconSpan = document.createElement('span');
        iconSpan.classList.add('user__account__list-icon');
        const iconImg = iconCell.querySelector('img');
        if (iconImg) {
          const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '32' }]);
          moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
          iconSpan.append(optimizedPic);
        }
        accountLink.prepend(iconSpan);
      }
      userAccount.append(accountLink);
    } else if (labelCell && labelCell.textContent.toLowerCase().includes('sign in')) {
      const signInBtnDiv = document.createElement('div');
      signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
      if (iconCell) {
        const iconSpan = document.createElement('span');
        iconSpan.classList.add('user__account__list-icon');
        const iconImg = iconCell.querySelector('img');
        if (iconImg) {
          const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '32' }]);
          moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
          iconSpan.append(optimizedPic);
        }
        signInBtnDiv.append(iconSpan);
      }
      const signInButton = document.createElement('button');
      signInButton.setAttribute('type', 'button');
      signInButton.setAttribute('data-sign-out-text', 'Sign Out'); // From original HTML
      signInButton.textContent = 'Sign In';
      signInBtnDiv.append(signInButton);
      userAccount.append(signInBtnDiv);
    }
  });

  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightDiv.append(signInWrapper);

  headerWrapper.append(rightDiv);

  block.textContent = '';
  block.append(headerWrapper);

  // Image optimization for all pictures in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Hamburger menu toggle logic
  const menu = document.createElement('div');
  menu.id = 'menu';
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

  navigationItems.forEach((row, index) => {
    const labelCell = [...row.children].find((cell) => !cell.querySelector('a') && !cell.querySelector('ul'));
    const linkCell = [...row.children].find((cell) => cell.querySelector('a') && !cell.querySelector('ul'));
    const hierarchyCell = [...row.children].find((cell) => cell.querySelector('ul'));

    if (labelCell) {
      const listItem = document.createElement('li');
      listItem.id = `menu-item-${index}`;
      listItem.classList.add('nav-link');

      const spanTitle = document.createElement('span');
      spanTitle.classList.add('menu-title');

      if (linkCell) {
        const link = document.createElement('a');
        link.href = linkCell.querySelector('a').href;
        link.textContent = labelCell.textContent;
        link.classList.add('button'); // From original HTML
        spanTitle.append(link);
        listItem.classList.add(labelCell.textContent.toLowerCase().replace(/\s/g, '-'));
      } else {
        spanTitle.textContent = labelCell.textContent;
        listItem.classList.add('accordion', labelCell.textContent.toLowerCase().replace(/\s/g, '-'));
      }
      listItem.append(spanTitle);
      menuList.append(listItem);

      if (hierarchyCell) {
        const panelDiv = document.createElement('div');
        panelDiv.classList.add('panel');
        const linkContainerSection = document.createElement('div');
        linkContainerSection.classList.add('link-container-section');

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = hierarchyCell.innerHTML;

        const topLevelUls = [...tempDiv.children].filter((el) => el.tagName === 'UL');

        topLevelUls.forEach((ul) => {
          const linkGridColumn = document.createElement('div');
          linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

          // Apply classes to the nested structure from ORIGINAL HTML
          ul.classList.add('content', 'links-container', 'accordian-content');
          ul.querySelectorAll('a').forEach((a) => {
            // No specific class for <a> in original HTML within these lists, but we can add 'button' if needed
            // a.classList.add('button'); // Example if needed
          });
          ul.querySelectorAll('li').forEach((li) => {
            // No specific class for <li> in original HTML within these lists
          });

          linkGridColumn.append(ul);
          linkContainerSection.append(linkGridColumn);
        });

        moveInstrumentation(hierarchyCell, tempDiv);
        panelDiv.append(linkContainerSection);
        menuList.append(panelDiv);

        listItem.addEventListener('click', () => {
          listItem.classList.toggle('active');
          panelDiv.classList.toggle('active');
        });
      }
    }
  });

  // Append sign-in links to the mobile menu list
  signInItems.forEach((row) => {
    const iconCell = [...row.children].find((cell) => cell.querySelector('picture'));
    const linkCell = [...row.children].find((cell) => cell.querySelector('a') && !cell.querySelector('ul'));
    const labelCell = [...row.children].find((cell) => !cell.querySelector('a') && !cell.querySelector('ul') && !cell.querySelector('picture'));

    if (linkCell && labelCell) {
      const listItem = document.createElement('li');
      const accountLink = document.createElement('a');
      accountLink.classList.add('user__account--link');
      accountLink.href = linkCell.querySelector('a').href;
      accountLink.textContent = labelCell.textContent;

      if (labelCell.textContent.toLowerCase().includes('reach us')) {
        accountLink.classList.add('reach', 'us');
      } else if (labelCell.textContent.toLowerCase().includes('profile')) {
        accountLink.classList.add('profile');
      }

      if (iconCell) {
        const iconSpan = document.createElement('span');
        iconSpan.classList.add('user__account__list-icon');
        const iconImg = iconCell.querySelector('img');
        if (iconImg) {
          const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '32' }]);
          moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
          iconSpan.append(optimizedPic);
        }
        accountLink.prepend(iconSpan);
      }
      listItem.append(accountLink);
      menuList.append(listItem);
    } else if (labelCell && labelCell.textContent.toLowerCase().includes('sign in')) {
      const listItem = document.createElement('li');
      const signInBtnDiv = document.createElement('div');
      signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
      if (iconCell) {
        const iconSpan = document.createElement('span');
        iconSpan.classList.add('user__account__list-icon');
        const iconImg = iconCell.querySelector('img');
        if (iconImg) {
          const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '32' }]);
          moveInstrumentation(iconImg, optimizedPic.querySelector('img'));
          iconSpan.append(optimizedPic);
        }
        signInBtnDiv.append(iconSpan);
      }
      const signInButton = document.createElement('button');
      signInButton.setAttribute('type', 'button');
      signInButton.setAttribute('data-sign-out-text', 'Sign Out'); // From original HTML
      signInButton.textContent = 'Sign In';
      signInBtnDiv.append(signInButton);
      listItem.append(signInBtnDiv);
      menuList.append(listItem);
    }
  });

  menu.append(menuList);
  block.append(menu);

  // Event Listeners for mobile menu
  hamburgerButton.addEventListener('click', () => {
    menu.classList.toggle('hidden');
    document.body.classList.toggle('no-scroll');
  });

  closeIcon.addEventListener('click', () => {
    menu.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  });
}
