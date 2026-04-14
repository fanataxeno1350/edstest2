import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, languageRow, ...itemRows] = [...block.children];

  // Create main header structure
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
  moveInstrumentation(logoRow, logoBlock);

  const logoSpan = document.createElement('span');
  logoSpan.classList.add('arena');

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  logoLink.setAttribute('data-logo-name', 'Arena');

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    moveInstrumentation(logoPicture, logoLink);
    logoLink.append(logoPicture);
  }

  const logoHref = logoLinkRow.querySelector('a');
  if (logoHref) {
    logoLink.href = logoHref.href;
    moveInstrumentation(logoLinkRow, logoLink);
  } else {
    logoLink.href = '/'; // Default if no link is provided
  }

  logoSpan.append(logoLink);
  logoBlock.append(logoSpan);
  logoWrapper.append(logoBlock);
  navbar.append(logoWrapper);

  // Navigation Links
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');

  const navigationItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('a') && row.querySelector('ul'));
  navigationItems.forEach((row) => {
    const labelCell = row.children[0];
    const linkCell = row.children[1];
    const hierarchyCell = row.children[2];

    const linkTitleDiv = document.createElement('div');
    linkTitleDiv.classList.add('link-title');
    const span = document.createElement('span');

    const labelLink = linkCell.querySelector('a');
    if (labelLink) {
      const a = document.createElement('a');
      a.href = labelLink.href;
      a.textContent = labelCell.textContent;
      a.classList.add('button'); // Apply button class if present in original HTML for such links
      moveInstrumentation(labelCell, a);
      moveInstrumentation(linkCell, a);
      span.append(a);
    } else {
      span.textContent = labelCell.textContent;
      moveInstrumentation(labelCell, span);
    }
    linkTitleDiv.append(span);
    linksDiv.append(linkTitleDiv);

    // Desktop Panel for navigation hierarchy
    const desktopPanel = document.createElement('div');
    desktopPanel.classList.add('desktop-panel', 'panel');
    desktopPanel.classList.add(labelCell.textContent.toLowerCase().replace(/\s/g, '-')); // Add class based on label

    const linkGridBlock = document.createElement('div');
    linkGridBlock.classList.add('link-grid', 'block');
    const linkContainerSection = document.createElement('div');
    linkContainerSection.classList.add('link-container-section');
    const linkGridColumn = document.createElement('div');
    linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

    if (hierarchyCell) {
      const hierarchyHtml = hierarchyCell.innerHTML;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyHtml;

      tempDiv.querySelectorAll('a').forEach((link) => {
        link.classList.add('nav-link'); // from ORIGINAL HTML
      });
      tempDiv.querySelectorAll('li').forEach((li) => {
        li.classList.add('nav-menu-item'); // from ORIGINAL HTML
      });
      tempDiv.querySelectorAll('ul').forEach((ul) => {
        ul.classList.add('content', 'links-container', 'accordian-content'); // from ORIGINAL HTML
      });

      moveInstrumentation(hierarchyCell, tempDiv);
      while (tempDiv.firstChild) {
        linkGridColumn.append(tempDiv.firstChild);
      }
    }

    linkContainerSection.append(linkGridColumn);
    linkGridBlock.append(linkContainerSection);
    desktopPanel.append(linkGridBlock);
    linksDiv.append(desktopPanel);
  });

  navbar.append(linksDiv);

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

  const userContactIcons = document.createElement('div');
  userContactIcons.classList.add('user__contact__icons', 'hidden');

  const contactLinkItems = itemRows.filter((row) => row.children.length === 3 && row.children[0].querySelector('picture') && row.children[1].querySelector('a'));
  contactLinkItems.forEach((row) => {
    const iconCell = row.children[0];
    const linkCell = row.children[1];

    const iconLink = document.createElement('a');
    iconLink.classList.add('user__contact--icon');
    const srOnlySpan = document.createElement('span');
    srOnlySpan.classList.add('sr-only');

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      iconLink.append(optimizedPic);
      srOnlySpan.textContent = img.alt;
    }

    const linkA = linkCell.querySelector('a');
    if (linkA) {
      iconLink.href = linkA.href;
      if (linkA.href.includes('wa.me')) {
        iconLink.classList.add('whatsapp');
        iconLink.setAttribute('target', '_blank');
        iconLink.setAttribute('rel', 'noopener noreferrer');
      } else if (linkA.href.startsWith('mailto:')) {
        iconLink.classList.add('email');
      } else if (linkA.href.startsWith('tel:')) {
        iconLink.classList.add('phone');
        iconLink.addEventListener('click', (e) => {
          e.preventDefault();
          contactBlock.querySelector('.contact-toggle-box').classList.toggle('hidden');
        });
      }
    }
    iconLink.prepend(srOnlySpan);
    userContactIcons.append(iconLink);
    moveInstrumentation(row, iconLink);
  });
  contactWrpArena.append(userContactIcons);

  // Contact toggle box for phone numbers
  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const userContactIconCallContainer = document.createElement('div');
  userContactIconCallContainer.classList.add('user__contact__icon-call_container');

  // Assuming specific phone numbers are hardcoded or derived from the original HTML
  const primaryPhoneLink = document.createElement('a');
  primaryPhoneLink.classList.add('primary-telephone');
  primaryPhoneLink.href = 'tel:18001021800';
  primaryPhoneLink.textContent = '1800 102 1800';
  userContactIconCallContainer.append(primaryPhoneLink);

  const secondaryPhoneLink = document.createElement('a');
  secondaryPhoneLink.classList.add('secondary-telephone');
  secondaryPhoneLink.href = 'tel:';
  userContactIconCallContainer.append(secondaryPhoneLink);

  contactToggleBox.append(userContactIconCallContainer);
  contactWrpArena.append(contactToggleBox);
  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = languageRow.textContent.trim();
  moveInstrumentation(languageRow, languageDiv);
  rightDiv.append(languageDiv);

  // Sign-in Links
  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden'); // Initially hidden based on original HTML
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  const signInLinkItems = itemRows.filter((row) => row.children.length === 4 && row.children[0].querySelector('picture') && row.children[1].querySelector('a') && row.children[2].textContent);
  signInLinkItems.forEach((row) => {
    const iconCell = row.children[0];
    const linkCell = row.children[1];
    const labelCell = row.children[2];

    const signInLink = document.createElement('a');
    signInLink.classList.add('user__account--link');
    const linkText = labelCell.textContent.toLowerCase().replace(/\s/g, '-');
    signInLink.classList.add(linkText);
    signInLink.setAttribute('target', '_self');

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('user__account__list-icon');
    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      iconSpan.append(optimizedPic);
    }
    signInLink.append(iconSpan);
    signInLink.textContent += labelCell.textContent;

    const linkA = linkCell.querySelector('a');
    if (linkA) {
      signInLink.href = linkA.href;
    }
    userAccount.append(signInLink);
    moveInstrumentation(row, signInLink);
  });

  // Sign-in button (if it's a separate item or hardcoded)
  const signInButtonDiv = document.createElement('div');
  signInButtonDiv.classList.add('user__account--link', 'sign-in-btn');
  const signInButtonIconSpan = document.createElement('span');
  signInButtonIconSpan.classList.add('user__account__list-icon');
  // Assuming sign-in icon is hardcoded or from a specific row
  const signInIconImg = document.createElement('img');
  signInIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776063821632.svg+xml';
  signInIconImg.loading = 'lazy';
  signInIconImg.alt = 'Sign-in';
  signInButtonIconSpan.append(signInIconImg);
  const signInButton = document.createElement('button');
  signInButton.setAttribute('type', 'button');
  signInButton.setAttribute('data-sign-out-text', 'Sign Out');
  signInButton.textContent = 'Sign In';
  signInButtonDiv.append(signInButtonIconSpan, signInButton);
  userAccount.append(signInButtonDiv);

  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightDiv.append(signInWrapper);

  navbar.append(rightDiv);

  // Mobile menu (initially hidden)
  const menuDiv = document.createElement('div');
  menuDiv.classList.add('menu', 'hidden', 'menu-arena');
  menuDiv.id = 'menu';

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

  // Populate mobile menu with navigation items
  navigationItems.forEach((row, index) => {
    const labelCell = row.children[0];
    const linkCell = row.children[1];
    const hierarchyCell = row.children[2];

    const li = document.createElement('li');
    li.id = `menu-item-${index}`;
    li.classList.add('nav-link');
    li.classList.add(labelCell.textContent.toLowerCase().replace(/\s/g, '-'));

    const spanTitle = document.createElement('span');
    spanTitle.classList.add('menu-title');

    const labelLink = linkCell.querySelector('a');
    if (labelLink) {
      const a = document.createElement('a');
      a.href = labelLink.href;
      a.textContent = labelCell.textContent;
      if (labelLink.classList.contains('button')) {
        a.classList.add('button');
      }
      spanTitle.append(a);
      li.classList.add('home'); // Example: if it's the home link
    } else {
      spanTitle.textContent = labelCell.textContent;
    }
    li.append(spanTitle);

    if (hierarchyCell.querySelector('ul')) {
      li.classList.add('accordion');
      const panelDiv = document.createElement('div');
      panelDiv.classList.add('panel');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

      const hierarchyHtml = hierarchyCell.innerHTML;
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyHtml;

      tempDiv.querySelectorAll('a').forEach((link) => {
        link.classList.add('nav-link');
      });
      tempDiv.querySelectorAll('li').forEach((item) => {
        item.classList.add('nav-menu-item');
      });
      tempDiv.querySelectorAll('ul').forEach((ul) => {
        ul.classList.add('content', 'links-container', 'accordian-content');
      });

      moveInstrumentation(hierarchyCell, tempDiv);
      while (tempDiv.firstChild) {
        linkGridColumn.append(tempDiv.firstChild);
      }

      linkContainerSection.append(linkGridColumn);
      panelDiv.append(linkContainerSection);
      menuList.append(li, panelDiv);

      // Add event listener for accordion behavior
      li.addEventListener('click', () => {
        li.classList.toggle('active');
        panelDiv.classList.toggle('hidden');
      });
    } else {
      menuList.append(li);
    }
    moveInstrumentation(row, li);
  });

  // Append sign-in links to mobile menu
  signInLinkItems.forEach((row) => {
    const iconCell = row.children[0];
    const linkCell = row.children[1];
    const labelCell = row.children[2];

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.classList.add('user__account--link', labelCell.textContent.toLowerCase().replace(/\s/g, '-'));
    a.setAttribute('target', '_self');
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('user__account__list-icon');
    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      iconSpan.append(optimizedPic);
    }
    a.append(iconSpan);
    a.textContent += labelCell.textContent;
    const linkA = linkCell.querySelector('a');
    if (linkA) {
      a.href = linkA.href;
    }
    li.append(a);
    menuList.append(li);
    moveInstrumentation(row, li);
  });

  // Append mobile sign-in button
  const signInLi = document.createElement('li');
  const signInBtnDiv = document.createElement('div');
  signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
  const signInBtnIconSpan = document.createElement('span');
  signInBtnIconSpan.classList.add('user__account__list-icon');
  const signInBtnImg = document.createElement('img');
  signInBtnImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776063821632.svg+xml';
  signInBtnImg.loading = 'lazy';
  signInBtnImg.alt = 'Sign-in';
  signInBtnIconSpan.append(signInBtnImg);
  const signInBtn = document.createElement('button');
  signInBtn.setAttribute('type', 'button');
  signInBtn.setAttribute('data-sign-out-text', 'Sign Out');
  signInBtn.textContent = 'Sign In';
  signInBtnDiv.append(signInBtnIconSpan, signInBtn);
  signInLi.append(signInBtnDiv);
  menuList.append(signInLi);

  menuDiv.append(menuList);

  // Event listeners for mobile menu
  hamburgerButton.addEventListener('click', () => {
    menuDiv.classList.toggle('hidden');
  });

  closeIcon.addEventListener('click', () => {
    menuDiv.classList.add('hidden');
  });

  backArrow.addEventListener('click', () => {
    // Implement logic to go back in nested menu if applicable
    // For now, simply close the menu
    menuDiv.classList.add('hidden');
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(navbar, menuDiv);
}
