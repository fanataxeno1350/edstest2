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
    contactTitleRow,
    languageRow,
    textRow,
    ...itemRows
  ] = [...block.children];

  // Main header structure
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
  const logoSpan = document.createElement('span');
  logoSpan.classList.add('arena');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  logoLink.setAttribute('data-logo-name', 'Arena');
  logoLink.href = logoLinkRow.querySelector('a')?.href || '#';
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    moveInstrumentation(logoRow.firstElementChild, logoLink);
    logoLink.append(logoPicture);
  }
  logoSpan.append(logoLink);
  logoBlock.append(logoSpan);
  logoWrapper.append(logoBlock);
  navbarArena.append(logoWrapper);

  // Navigation Links
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');

  const textCell = textRow?.querySelector('div');
  const temp = document.createElement('div');
  temp.innerHTML = textCell?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  const navItems = rootUl ? parseNavTree(rootUl) : [];

  const createNavLink = (item) => {
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
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical'); // Assuming vertical for now
      const ul = document.createElement('ul');
      ul.classList.add('content', 'links-container', 'accordian-content');

      item.children.forEach((child) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#'; // Placeholder, actual links not in RTE
        a.textContent = child.label;
        li.append(a);
        ul.append(li);
      });
      linkGridColumn.append(ul);
      linkContainerSection.append(linkGridColumn);
      linkGrid.append(linkContainerSection);
      desktopPanel.append(linkGrid);
      linksDiv.append(desktopPanel);

      linkTitle.addEventListener('click', () => {
        desktopPanel.classList.toggle('show');
      });
    } else {
      const a = document.createElement('a');
      a.href = '#'; // Placeholder, actual links not in RTE
      a.textContent = item.label;
      a.classList.add('button');
      span.append(a);
      linkTitle.append(span);
    }
    return linkTitle;
  };

  navItems.forEach((item) => {
    linksDiv.append(createNavLink(item));
  });

  // Engage Logo Link
  const engageLinkTitle = document.createElement('div');
  engageLinkTitle.classList.add('link-title');
  const engageSpan = document.createElement('span');
  const engageLink = document.createElement('a');
  engageLink.classList.add('logo__picture');
  engageLink.setAttribute('data-logo-name', 'Maruti Suzuki');
  engageLink.href = engageLogoLinkRow.querySelector('a')?.href || '#';
  const engagePicture = engageLogoRow.querySelector('picture');
  if (engagePicture) {
    moveInstrumentation(engageLogoRow.firstElementChild, engageLink);
    engageLink.append(engagePicture);
  }
  engageSpan.append(engageLink);
  engageLinkTitle.append(engageSpan);
  linksDiv.append(engageLinkTitle);
  navbarArena.append(linksDiv);

  // Right section
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
  contactTitle.textContent = contactTitleRow.textContent.trim();
  const contactTitleIcon = document.createElement('span');
  contactTitleIcon.classList.add('user__contact-title', 'icon-phone');
  contactTitleIcon.setAttribute('aria-label', 'Contact Us');
  contactWrpArena.append(contactTitle, contactTitleIcon);

  const contactIconsDiv = document.createElement('div');
  contactIconsDiv.classList.add('user__contact__icons', 'hidden');

  // Filter for contact-link-item (2 cells: icon, link)
  const contactLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('picture') && cells[1].querySelector('a');
  });

  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const iconLink = document.createElement('a');
    iconLink.classList.add('user__contact--icon');
    const linkEl = linkCell.querySelector('a');
    if (linkEl) {
      iconLink.href = linkEl.href;
      if (linkEl.href.includes('wa.me')) {
        iconLink.classList.add('whatsapp');
        iconLink.setAttribute('target', '_blank');
        iconLink.setAttribute('rel', 'noopener noreferrer');
      } else if (linkEl.href.startsWith('mailto:')) {
        iconLink.classList.add('email');
      } else if (linkEl.href.startsWith('tel:')) {
        iconLink.classList.add('phone');
        iconLink.addEventListener('click', (e) => {
          e.preventDefault();
          contactWrpArena.querySelector('.contact-toggle-box').classList.toggle('hidden');
        });
      }
    }

    const srOnlySpan = document.createElement('span');
    srOnlySpan.classList.add('sr-only');
    srOnlySpan.textContent = iconLink.classList.contains('whatsapp') ? 'whatsapp' : (iconLink.classList.contains('email') ? 'email' : 'phone');
    iconLink.append(srOnlySpan);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const newImg = document.createElement('img');
      newImg.src = img.src;
      newImg.alt = img.alt;
      newImg.loading = 'lazy';
      iconLink.append(newImg);
    }
    contactIconsDiv.append(iconLink);
  });

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const callContainer = document.createElement('div');
  callContainer.classList.add('user__contact__icon-call_container');

  const primaryTelLink = document.createElement('a');
  primaryTelLink.classList.add('primary-telephone');
  primaryTelLink.href = 'tel:18001021800'; // Hardcoded from original HTML
  primaryTelLink.textContent = '1800 102 1800';
  callContainer.append(primaryTelLink);

  const secondaryTelLink = document.createElement('a');
  secondaryTelLink.classList.add('secondary-telephone');
  secondaryTelLink.href = 'tel:';
  callContainer.append(secondaryTelLink);
  contactToggleBox.append(callContainer);

  contactWrpArena.append(contactIconsDiv, contactToggleBox);
  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = languageRow.textContent.trim();
  rightDiv.append(languageDiv);

  // Sign-in Wrapper
  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden');
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  // Filter for user-account-link-item (3 cells: icon, link, label)
  const userAccountLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('picture') && cells[2].textContent.trim();
  });

  userAccountLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    const labelText = labelCell?.textContent?.trim();

    if (linkCell && labelText) { // It's a link item
      const userAccountLink = document.createElement('a');
      userAccountLink.classList.add('user__account--link', labelText.toLowerCase().replace(/\s/g, '-'));
      userAccountLink.href = linkCell.querySelector('a')?.href || '#';
      userAccountLink.setAttribute('target', '_self');

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('user__account__list-icon');
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt;
        newImg.loading = 'lazy';
        iconSpan.append(newImg);
      }
      userAccountLink.append(iconSpan, labelText);
      userAccount.append(userAccountLink);
    } else if (iconCell && labelText) { // It's a button (Sign In/Out)
      const signInButtonDiv = document.createElement('div');
      signInButtonDiv.classList.add('user__account--link', 'sign-in-btn');

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('user__account__list-icon');
      const iconPicture = iconCell.querySelector('picture');
      if (iconPicture) {
        const img = iconPicture.querySelector('img');
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt;
        newImg.loading = 'lazy';
        iconSpan.append(newImg);
      }
      signInButtonDiv.append(iconSpan);

      const signInButton = document.createElement('button');
      signInButton.setAttribute('type', 'button');
      signInButton.setAttribute('data-sign-out-text', 'Sign Out');
      signInButton.textContent = labelText;
      signInButtonDiv.append(signInButton);
      userAccount.append(signInButtonDiv);

      // Add event listener for sign-in button
      signInButton.addEventListener('click', () => {
        // Implement sign-in/sign-out logic here
        console.log('Sign In/Out button clicked');
      });
    }
  });

  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightDiv.append(signInWrapper);

  navbarArena.append(rightDiv);

  block.textContent = '';
  block.append(navbarArena);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Hamburger menu toggle
  hamburgerButton.addEventListener('click', () => {
    const menu = document.getElementById('menu'); // Assuming a menu element with ID 'menu' exists
    if (menu) {
      menu.classList.toggle('hidden');
      hamburgerButton.setAttribute('aria-expanded', menu.classList.contains('hidden') ? 'false' : 'true');
    }
  });

  // Contact title click to show icons
  contactTitle.addEventListener('click', () => {
    contactIconsDiv.classList.toggle('hidden');
  });

  contactTitleIcon.addEventListener('click', () => {
    contactIconsDiv.classList.toggle('hidden');
  });
}
