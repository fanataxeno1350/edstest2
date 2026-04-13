import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    engageLogoRow,
    engageLogoLinkRow,
    languageRow,
    textRow, // Navigation Hierarchy (richtext)
    ...itemRows
  ] = [...block.children];

  const headerWrapper = document.createElement('header');
  headerWrapper.classList.add('corp-header-wrapper', 'header-scroll', 'header-scroll-threshold', 'corp-header-block', 'header-wrapper', 'sticky', 'show');
  moveInstrumentation(block, headerWrapper);

  const corpHeader = document.createElement('div');
  corpHeader.classList.add('corp-header', 'block');
  headerWrapper.append(corpHeader);

  const navbarArena = document.createElement('div');
  navbarArena.classList.add('navbar', 'navbar-arena', 'g-container');
  corpHeader.append(navbarArena);

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
  const logoHref = logoLinkRow?.querySelector('a')?.href;
  if (logoHref) {
    logoLink.href = logoHref;
  }
  logoLink.setAttribute('data-logo-name', 'Arena');

  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoSpan.append(logoLink);
  logoBlock.append(logoSpan);
  logoWrapper.append(logoBlock);
  navbarArena.append(logoWrapper);

  // Links section
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');
  navbarArena.append(linksDiv);

  function parseNavTree(ul) {
    return [...ul.querySelectorAll(':scope > li')].map((li) => {
      const label = li.querySelector(':scope > p')?.textContent?.trim() ?? li.querySelector(':scope > a')?.textContent?.trim() ?? '';
      const childUl = li.querySelector(':scope > ul');
      return { label, children: childUl ? parseNavTree(childUl) : [] };
    });
  }

  const textCell = textRow?.querySelector('div');
  const temp = document.createElement('div');
  temp.innerHTML = textCell?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  const navItems = rootUl ? parseNavTree(rootUl) : [];

  function createNavItem(item, isDesktop = true) {
    const linkTitle = document.createElement('div');
    linkTitle.classList.add('link-title');
    const span = document.createElement('span');

    if (item.children && item.children.length > 0) {
      span.textContent = item.label;
      linkTitle.append(span);

      const panel = document.createElement('div');
      panel.classList.add('desktop-panel', 'panel', item.label.toLowerCase().replace(/\s/g, '-'));
      const linkGridBlock = document.createElement('div');
      linkGridBlock.classList.add('link-grid', 'block');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical'); // Default to vertical

      // Check if any child has children to determine column layout
      const hasGrandchildren = item.children.some(child => child.children && child.children.length > 0);
      if (item.label.toLowerCase() === 'sales' && !hasGrandchildren) {
        linkGridColumn.classList.remove('link-column-vertical');
        linkGridColumn.classList.add('link-column-horizontal');
      }

      const ul = document.createElement('ul');
      ul.classList.add('content', 'links-container', 'accordian-content');

      item.children.forEach((child) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        // Placeholder, actual link from model is not available here, but we can try to find it in the original HTML if needed
        // For now, use a generic href or try to extract from original HTML if it exists in the parsed structure
        a.href = '#';
        a.textContent = child.label;
        li.append(a);
        ul.append(li);
      });

      linkGridColumn.append(ul);
      linkContainerSection.append(linkGridColumn);
      linkGridBlock.append(linkContainerSection);
      panel.append(linkGridBlock);
      linksDiv.append(panel);

      if (isDesktop) {
        linkTitle.addEventListener('click', () => {
          // Close other open panels
          linksDiv.querySelectorAll('.desktop-panel.panel:not(.hidden)').forEach((p) => {
            if (p !== panel) {
              p.classList.add('hidden');
            }
          });
          // Toggle current panel
          panel.classList.toggle('hidden');
        });
        panel.classList.add('hidden'); // Initially hide panels
      }
    } else {
      const a = document.createElement('a');
      a.classList.add('button');
      // Placeholder, actual link from model is not available here
      a.href = '#';
      a.textContent = item.label;
      span.append(a);
      linkTitle.append(span);
    }
    return linkTitle;
  }

  navItems.forEach((item) => {
    linksDiv.append(createNavItem(item));
  });

  // Engage Logo Link
  const engageLogoLinkTitle = document.createElement('div');
  engageLogoLinkTitle.classList.add('link-title');
  const engageLogoSpan = document.createElement('span');
  const engageLogoAnchor = document.createElement('a');
  engageLogoAnchor.classList.add('logo__picture');
  const engageHref = engageLogoLinkRow?.querySelector('a')?.href;
  if (engageHref) {
    engageLogoAnchor.href = engageHref;
  }
  engageLogoAnchor.setAttribute('data-logo-name', 'Maruti Suzuki');

  const engageLogoPicture = engageLogoRow?.querySelector('picture');
  if (engageLogoPicture) {
    const img = engageLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '79' }]); // Use 79 as width from original HTML
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    engageLogoAnchor.append(optimizedPic);
  }
  engageLogoSpan.append(engageLogoAnchor);
  engageLogoLinkTitle.append(engageLogoSpan);
  linksDiv.append(engageLogoLinkTitle);


  // Right section
  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';
  navbarArena.append(rightDiv);

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

  // Filter for contact-link-item (2 cells: icon, link)
  const contactLinkItems = itemRows.filter(row => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('picture') && cells[1].querySelector('a');
  });

  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    if (iconCell && linkCell) {
      const a = document.createElement('a');
      a.href = linkCell.querySelector('a').href;
      a.classList.add('user__contact--icon');
      const srOnlySpan = document.createElement('span');
      srOnlySpan.classList.add('sr-only');

      const img = iconCell.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: 'auto' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      a.append(srOnlySpan, optimizedPic);

      if (a.href.includes('wa.me')) {
        a.classList.add('whatsapp');
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        srOnlySpan.textContent = 'whatsapp';
      } else if (a.href.startsWith('mailto:')) {
        a.classList.add('email');
        srOnlySpan.textContent = 'email';
      } else if (a.href.startsWith('tel:')) {
        a.classList.add('phone');
        srOnlySpan.textContent = 'phone';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          contactWrpArena.querySelector('.contact-toggle-box').classList.toggle('hidden');
        });
      } else {
        a.classList.add('phone'); // Default to phone if not whatsapp or mailto
        srOnlySpan.textContent = 'phone';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          contactWrpArena.querySelector('.contact-toggle-box').classList.toggle('hidden');
        });
      }
      contactIconsDiv.append(a);
    }
  });

  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  const contactCallContainer = document.createElement('div');
  contactCallContainer.classList.add('user__contact__icon-call_container');

  // Assuming the first contact link item with a 'tel:' href is the primary telephone
  const primaryTelLinkRow = contactLinkItems.find(row => row.querySelector('a')?.href.startsWith('tel:'));
  if (primaryTelLinkRow) {
    const primaryTelAnchor = document.createElement('a');
    primaryTelAnchor.classList.add('primary-telephone');
    const link = primaryTelLinkRow.querySelector('a');
    primaryTelAnchor.href = link.href;
    primaryTelAnchor.textContent = link.textContent.trim();
    contactCallContainer.append(primaryTelAnchor);
  }

  const secondaryTelAnchor = document.createElement('a');
  secondaryTelAnchor.classList.add('secondary-telephone');
  secondaryTelAnchor.href = '#'; // No secondary telephone in model
  contactCallContainer.append(secondaryTelAnchor);
  contactToggleBox.append(contactCallContainer);

  contactWrpArena.append(contactIconsDiv, contactToggleBox);
  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  // Add event listener for contact icon to toggle contact details
  contactIconPhone.addEventListener('click', () => {
    contactIconsDiv.classList.toggle('hidden');
    contactToggleBox.classList.toggle('hidden');
  });


  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = languageRow?.querySelector('div')?.textContent.trim() ?? '';
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
  const userAccountLinkItems = itemRows.filter(row => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('picture') && cells[1].querySelector('a') && cells[2].textContent.trim();
  });

  userAccountLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a')); // Assuming label is the text cell

    if (iconCell && linkCell && labelCell) {
      const a = document.createElement('a');
      a.classList.add('user__account--link');
      a.href = linkCell.querySelector('a').href;
      a.textContent = labelCell.textContent.trim();

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('user__account__list-icon');
      const img = iconCell.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: 'auto' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      iconSpan.append(optimizedPic);
      a.prepend(iconSpan);

      if (a.textContent.toLowerCase() === 'reach us') {
        a.classList.add('reach', 'us');
        a.setAttribute('target', '_self');
      } else if (a.textContent.toLowerCase() === 'profile') {
        a.classList.add('profile');
        a.setAttribute('target', '_self');
      }
      userAccount.append(a);
    }
  });

  // Sign-in Button
  const signInBtnDiv = document.createElement('div');
  signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
  const signInIconSpan = document.createElement('span');
  signInIconSpan.classList.add('user__account__list-icon');
  const signInImg = document.createElement('img');
  signInImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775897422912.svg+xml'; // From original HTML
  signInImg.setAttribute('loading', 'lazy');
  signInImg.alt = 'Sign-in';
  signInIconSpan.append(signInImg);

  const signInButton = document.createElement('button');
  signInButton.setAttribute('type', 'button');
  signInButton.setAttribute('data-sign-out-text', 'Sign Out');
  signInButton.textContent = 'Sign In';
  signInBtnDiv.append(signInIconSpan, signInButton);
  userAccount.append(signInBtnDiv);

  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightDiv.append(signInWrapper);

  block.textContent = '';
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
  mobileMenu.append(menuList);

  function createMobileNavItem(item, index) {
    const li = document.createElement('li');
    li.id = `menu-item-${index}`;
    li.classList.add('nav-link');

    const span = document.createElement('span');
    span.classList.add('menu-title');

    if (item.children && item.children.length > 0) {
      li.classList.add('accordion', item.label.toLowerCase().replace(/\s/g, '-'));
      span.textContent = item.label;
      li.append(span);

      const panel = document.createElement('div');
      panel.classList.add('panel');
      const linkContainerSection = document.createElement('div');
      linkContainerSection.classList.add('link-container-section');
      const linkGridColumn = document.createElement('div');
      linkGridColumn.classList.add('link-grid-column', 'link-column-vertical');

      const hasGrandchildren = item.children.some(child => child.children && child.children.length > 0);
      if (item.label.toLowerCase() === 'sales' && !hasGrandchildren) {
        linkGridColumn.classList.remove('link-column-vertical');
        linkGridColumn.classList.add('link-column-horizontal');
      }

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
      panel.append(linkContainerSection);
      // Append panel to mobileMenu, not li, for correct accordion behavior
      mobileMenu.append(panel);

      li.addEventListener('click', () => {
        li.classList.toggle('active');
        panel.classList.toggle('hidden');
      });
      panel.classList.add('hidden'); // Initially hide panels
    } else {
      li.classList.add(item.label.toLowerCase().replace(/\s/g, '-'));
      const a = document.createElement('a');
      a.classList.add('button');
      a.href = '#'; // Placeholder
      a.textContent = item.label;
      a.title = item.label.toLowerCase().replace(/\s/g, '-');
      span.append(a);
      li.append(span);
    }
    return li;
  }

  navItems.forEach((item, index) => {
    menuList.append(createMobileNavItem(item, index));
  });

  // Mobile Engage Logo Link
  const mobileEngageLi = document.createElement('li');
  mobileEngageLi.classList.add('nav-link');
  const mobileEngageSpan = document.createElement('span');
  mobileEngageSpan.classList.add('menu-title');
  const mobileEngageAnchor = document.createElement('a');
  mobileEngageAnchor.classList.add('logo__picture');
  if (engageHref) {
    mobileEngageAnchor.href = engageHref;
  }
  mobileEngageAnchor.setAttribute('data-logo-name', 'Maruti Suzuki');
  if (engageLogoPicture) {
    const img = engageLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '79' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    mobileEngageAnchor.append(optimizedPic);
  }
  mobileEngageSpan.append(mobileEngageAnchor);
  mobileEngageLi.append(mobileEngageSpan);
  menuList.append(mobileEngageLi);


  // Mobile User Account Links
  userAccountLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    if (iconCell && linkCell && labelCell) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.classList.add('user__account--link');
      // The original HTML has class names like 'reach us' and 'profile' based on textContent,
      // so we should apply them here based on the labelCell's textContent.
      const labelText = labelCell.textContent.trim().toLowerCase();
      if (labelText === 'reach us') {
        a.classList.add('reach', 'us');
      } else if (labelText === 'profile') {
        a.classList.add('profile');
      }
      a.href = linkCell.querySelector('a').href;
      a.setAttribute('target', '_self');

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('user__account__list-icon');
      const img = iconCell.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: 'auto' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      iconSpan.append(optimizedPic);
      a.append(iconSpan, labelCell.textContent.trim());
      li.append(a);
      menuList.append(li);
    }
  });

  // Mobile Sign-in Button
  const mobileSignInLi = document.createElement('li');
  const mobileSignInBtnDiv = document.createElement('div');
  mobileSignInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
  const mobileSignInIconSpan = document.createElement('span');
  mobileSignInIconSpan.classList.add('user__account__list-icon');
  const mobileSignInImg = document.createElement('img');
  mobileSignInImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775897422912.svg+xml'; // From original HTML
  mobileSignInImg.setAttribute('loading', 'lazy');
  mobileSignInImg.alt = 'Sign-in';
  mobileSignInIconSpan.append(mobileSignInImg);

  const mobileSignInButton = document.createElement('button');
  mobileSignInButton.setAttribute('type', 'button');
  mobileSignInButton.setAttribute('data-sign-out-text', 'Sign Out');
  mobileSignInButton.textContent = 'Sign In';
  mobileSignInBtnDiv.append(mobileSignInIconSpan, mobileSignInButton);
  mobileSignInLi.append(mobileSignInBtnDiv);
  menuList.append(mobileSignInLi);

  block.append(mobileMenu);

  // Event Listeners for mobile menu
  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    document.body.classList.toggle('no-scroll');
  });

  closeIcon.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('no-scroll');
  });
}
