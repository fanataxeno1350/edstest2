import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  function parseNavTree(ul) {
    return [...ul.querySelectorAll(':scope > li')].map((li) => {
      const label = li.querySelector(':scope > p')?.textContent?.trim() ?? '';
      const childUl = li.querySelector(':scope > ul');
      return { label, children: childUl ? parseNavTree(childUl) : [] };
    });
  }

  const [
    logoRow,
    logoLinkRow,
    engageLogoRow,
    engageLogoLinkRow,
    primaryTelephoneRow,
    secondaryTelephoneRow,
    languageRow,
    textRow,
    ...itemRows
  ] = [...block.children];

  block.textContent = '';

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
  logoBlock.classList.add('logo', 'block');
  const logoSpan = document.createElement('span');
  logoSpan.classList.add('arena');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  logoLink.setAttribute('data-logo-name', 'Arena');
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    logoLink.append(logoPicture);
  }
  logoSpan.append(logoLink);
  logoBlock.append(logoSpan);
  logoWrapper.append(logoBlock);
  headerWrapper.append(logoWrapper);

  // Navigation Links
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');
  headerWrapper.append(linksDiv);

  const textCell = textRow?.querySelector('div');
  const temp = document.createElement('div');
  temp.innerHTML = textCell?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  const navItems = rootUl ? parseNavTree(rootUl) : [];

  function renderNavItems(items, parentElement) {
    items.forEach((item) => {
      const linkTitleDiv = document.createElement('div');
      linkTitleDiv.classList.add('link-title');
      const span = document.createElement('span');

      if (item.children.length > 0) {
        span.textContent = item.label;
        linkTitleDiv.append(span);
        parentElement.append(linkTitleDiv);

        const desktopPanel = document.createElement('div');
        desktopPanel.classList.add('desktop-panel', 'panel', item.label.toLowerCase().replace(/\s/g, '-'));
        const linkGridBlock = document.createElement('div');
        linkGridBlock.classList.add('link-grid', 'block');
        const linkContainerSection = document.createElement('div');
        linkContainerSection.classList.add('link-container-section');
        const linkGridColumn = document.createElement('div');
        linkGridColumn.classList.add('link-grid-column', 'link-column-vertical'); // Assuming vertical for now
        const ul = document.createElement('ul');
        ul.classList.add('content', 'links-container', 'accordian-content');

        item.children.forEach((child) => {
          const li = document.createElement('li');
          const a = document.createElement('a');
          a.href = '#'; // Placeholder, actual links would come from model if available
          a.textContent = child.label;
          li.append(a);
          ul.append(li);
        });
        linkGridColumn.append(ul);
        linkContainerSection.append(linkGridColumn);
        linkGridBlock.append(linkContainerSection);
        desktopPanel.append(linkGridBlock);
        parentElement.append(desktopPanel);

        linkTitleDiv.addEventListener('click', () => {
          desktopPanel.classList.toggle('show');
        });
      } else {
        const a = document.createElement('a');
        a.href = '#'; // Placeholder, actual links would come from model if available
        a.title = item.label.toLowerCase().replace(/\s/g, '-');
        a.classList.add('button');
        a.textContent = item.label;
        span.append(a);
        linkTitleDiv.append(span);
        parentElement.append(linkTitleDiv);
      }
    });
  }

  renderNavItems(navItems, linksDiv);

  // Engage Logo (if it's part of the main navigation links)
  const engageLogoLinkTitle = document.createElement('div');
  engageLogoLinkTitle.classList.add('link-title');
  const engageLogoSpan = document.createElement('span');
  const engageLogoAnchor = document.createElement('a');
  engageLogoAnchor.classList.add('logo__picture');
  const foundEngageLogoLink = engageLogoLinkRow.querySelector('a');
  if (foundEngageLogoLink) {
    engageLogoAnchor.href = foundEngageLogoLink.href;
  }
  engageLogoAnchor.setAttribute('data-logo-name', 'Maruti Suzuki');
  const engageLogoPicture = engageLogoRow.querySelector('picture');
  if (engageLogoPicture) {
    engageLogoAnchor.append(engageLogoPicture);
  }
  engageLogoSpan.append(engageLogoAnchor);
  engageLogoLinkTitle.append(engageLogoSpan);
  linksDiv.append(engageLogoLinkTitle);

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
  contactTitle.textContent = 'Contact Us';
  const contactIcon = document.createElement('span');
  contactIcon.classList.add('user__contact-title', 'icon-phone');
  contactIcon.setAttribute('aria-label', 'Contact Us');
  contactWrpArena.append(contactTitle, contactIcon);

  const userContactIcons = document.createElement('div');
  userContactIcons.classList.add('user__contact__icons', 'hidden');

  const contactLinkItems = itemRows.filter((row) => row.children.length === 2);
  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const iconPicture = iconCell?.querySelector('picture');
    const foundLink = linkCell?.querySelector('a');

    if (iconPicture && foundLink) {
      const contactLink = document.createElement('a');
      contactLink.classList.add('user__contact--icon');
      contactLink.href = foundLink.href;

      const linkText = foundLink.textContent.trim().toLowerCase();
      if (linkText.includes('phone') || foundLink.href.startsWith('tel:')) {
        contactLink.classList.add('phone');
        // This event listener was already present in the original HTML, so we replicate it
        contactLink.addEventListener('click', (e) => {
          e.preventDefault();
          contactWrpArena.querySelector('.contact-toggle-box').classList.toggle('hidden');
        });
      } else if (linkText.includes('whatsapp') || foundLink.href.startsWith('https://wa.me/')) {
        contactLink.classList.add('whatsapp');
        contactLink.setAttribute('target', '_blank');
        contactLink.setAttribute('rel', 'noopener noreferrer');
      } else if (linkText.includes('email') || foundLink.href.startsWith('mailto:')) {
        contactLink.classList.add('email');
      }

      const srOnlySpan = document.createElement('span');
      srOnlySpan.classList.add('sr-only');
      srOnlySpan.textContent = linkText;
      contactLink.append(srOnlySpan);

      const img = document.createElement('img');
      const sourceImg = iconPicture.querySelector('img');
      if (sourceImg) {
        img.src = sourceImg.src;
        img.alt = sourceImg.alt;
        img.setAttribute('loading', 'lazy');
      }
      contactLink.append(img);
      userContactIcons.append(contactLink);
    }
  });

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const iconCallContainer = document.createElement('div');
  iconCallContainer.classList.add('user__contact__icon-call_container');

  const primaryTelLink = document.createElement('a');
  primaryTelLink.classList.add('primary-telephone');
  primaryTelLink.href = `tel:${primaryTelephoneRow.textContent.trim()}`;
  primaryTelLink.textContent = primaryTelephoneRow.textContent.trim();
  iconCallContainer.append(primaryTelLink);

  const secondaryTelLink = document.createElement('a');
  secondaryTelLink.classList.add('secondary-telephone');
  secondaryTelLink.href = `tel:${secondaryTelephoneRow.textContent.trim()}`;
  secondaryTelLink.textContent = secondaryTelephoneRow.textContent.trim();
  iconCallContainer.append(secondaryTelLink);

  contactToggleBox.append(iconCallContainer);
  contactWrpArena.append(userContactIcons, contactToggleBox);
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

  const userAccountLinkItems = itemRows.filter((row) => row.children.length === 3);
  userAccountLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    const iconPicture = iconCell?.querySelector('picture');
    const foundLink = linkCell?.querySelector('a');
    const labelText = labelCell?.textContent.trim();

    if (foundLink) {
      const accountLink = document.createElement('a');
      accountLink.classList.add('user__account--link', labelText.toLowerCase().replace(/\s/g, '-'));
      accountLink.href = foundLink.href;
      accountLink.setAttribute('target', '_self');

      const listIconSpan = document.createElement('span');
      listIconSpan.classList.add('user__account__list-icon');
      const img = document.createElement('img');
      const sourceImg = iconPicture?.querySelector('img');
      if (sourceImg) {
        img.src = sourceImg.src;
        img.alt = sourceImg.alt;
        img.setAttribute('loading', 'lazy');
      }
      listIconSpan.append(img);
      accountLink.append(listIconSpan);
      accountLink.append(document.createTextNode(labelText));
      userAccount.append(accountLink);
    } else if (labelText?.toLowerCase() === 'sign in') {
      const signInBtnDiv = document.createElement('div');
      signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
      const listIconSpan = document.createElement('span');
      listIconSpan.classList.add('user__account__list-icon');
      const img = document.createElement('img');
      const sourceImg = iconCell?.querySelector('img');
      if (sourceImg) {
        img.src = sourceImg.src;
        img.alt = sourceImg.alt;
        img.setAttribute('loading', 'lazy');
      }
      listIconSpan.append(img);
      signInBtnDiv.append(listIconSpan);

      const signInButton = document.createElement('button');
      signInButton.setAttribute('type', 'button');
      signInButton.setAttribute('data-sign-out-text', 'Sign Out');
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
  block.append(headerWrapper);

  // Mobile Menu
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

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');

  function renderMobileNavItems(items, parentElement) {
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
        parentElement.append(li);

        const panelDiv = document.createElement('div');
        panelDiv.classList.add('panel');
        const linkContainerSection = document.createElement('div');
        linkContainerSection.classList.add('link-container-section');
        const linkGridColumn = document.createElement('div');
        linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');
        const ul = document.createElement('ul');
        ul.classList.add('content', 'links-container', 'accordian-content');

        item.children.forEach((child) => {
          const childLi = document.createElement('li');
          const a = document.createElement('a');
          a.href = '#'; // Placeholder
          a.textContent = child.label;
          childLi.append(a);
          ul.append(childLi);
        });
        linkGridColumn.append(ul);
        linkContainerSection.append(linkGridColumn);
        panelDiv.append(linkContainerSection);
        parentElement.append(panelDiv);

        li.addEventListener('click', () => {
          panelDiv.classList.toggle('show');
          li.classList.toggle('active');
        });
      } else {
        li.classList.add(item.label.toLowerCase().replace(/\s/g, '-'));
        const a = document.createElement('a');
        a.href = '#'; // Placeholder
        a.title = item.label.toLowerCase().replace(/\s/g, '-');
        a.classList.add('button');
        a.textContent = item.label;
        spanTitle.append(a);
        li.append(spanTitle);
        parentElement.append(li);
      }
    });
  }

  renderMobileNavItems(navItems, menuList);

  // Append user account links to mobile menu
  userAccountLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    const iconPicture = iconCell?.querySelector('picture');
    const foundLink = linkCell?.querySelector('a');
    const labelText = labelCell?.textContent.trim();

    if (foundLink) {
      const li = document.createElement('li');
      const accountLink = document.createElement('a');
      accountLink.classList.add('user__account--link', labelText.toLowerCase().replace(/\s/g, '-'));
      accountLink.href = foundLink.href;
      accountLink.setAttribute('target', '_self');

      const listIconSpan = document.createElement('span');
      listIconSpan.classList.add('user__account__list-icon');
      const img = document.createElement('img');
      const sourceImg = iconPicture?.querySelector('img');
      if (sourceImg) {
        img.src = sourceImg.src;
        img.alt = sourceImg.alt;
        img.setAttribute('loading', 'lazy');
      }
      listIconSpan.append(img);
      accountLink.append(listIconSpan);
      accountLink.append(document.createTextNode(labelText));
      li.append(accountLink);
      menuList.append(li);
    } else if (labelText?.toLowerCase() === 'sign in') {
      const li = document.createElement('li');
      const signInBtnDiv = document.createElement('div');
      signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
      const listIconSpan = document.createElement('span');
      listIconSpan.classList.add('user__account__list-icon');
      const img = document.createElement('img');
      const sourceImg = iconCell?.querySelector('img');
      if (sourceImg) {
        img.src = sourceImg.src;
        img.alt = sourceImg.alt;
        img.setAttribute('loading', 'lazy');
      }
      listIconSpan.append(img);
      signInBtnDiv.append(listIconSpan);

      const signInButton = document.createElement('button');
      signInButton.setAttribute('type', 'button');
      signInButton.setAttribute('data-sign-out-text', 'Sign Out');
      signInButton.textContent = 'Sign In';
      signInBtnDiv.append(signInButton);
      li.append(signInBtnDiv);
      menuList.append(li);
    }
  });

  mobileMenu.append(menuList);
  block.append(mobileMenu);

  // Event listeners for mobile menu toggle
  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    document.body.classList.toggle('menu-open');
  });

  closeIcon.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('menu-open');
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
