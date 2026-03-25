import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const navbarArena = document.createElement('div');
  navbarArena.classList.add('navbar', 'navbar-arena', 'g-container');

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
  moveInstrumentation(block.querySelector('.nav-hamburger'), navHamburger);

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block');
  logoBlock.setAttribute('data-block-name', 'logo');
  const arenaSpan = document.createElement('span');
  arenaSpan.classList.add('arena');

  const logoLink = block.querySelector('[data-aue-prop="logoLink"]');
  if (logoLink) {
    const logoPicture = logoLink.querySelector('picture');
    if (logoPicture) {
      arenaSpan.append(logoPicture);
    }
    logoLink.classList.add('logo__picture');
    logoLink.setAttribute('data-logo-name', 'Arena');
    arenaSpan.prepend(logoLink);
    moveInstrumentation(logoLink, arenaSpan);
  }
  logoBlock.append(arenaSpan);
  logoWrapper.append(logoBlock);
  navbarArena.append(logoWrapper);
  moveInstrumentation(block.querySelector('.logo.block'), logoBlock);

  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');

  const headerLinkGroups = block.querySelectorAll('[data-aue-model="headerLinkGroup"]');
  headerLinkGroups.forEach((groupNode) => {
    const groupTitleDiv = document.createElement('div');
    groupTitleDiv.classList.add('link-title');
    const groupTitleSpan = document.createElement('span');
    const groupTitleLink = groupNode.querySelector('[data-aue-prop="groupTitle"] a');
    if (groupTitleLink) {
      groupTitleSpan.append(groupTitleLink);
      groupTitleLink.classList.add('button');
      moveInstrumentation(groupTitleLink, groupTitleSpan);
    } else {
      const groupTitleText = groupNode.querySelector('[data-aue-prop="groupTitle"]');
      if (groupTitleText) {
        groupTitleSpan.append(groupTitleText.textContent);
        moveInstrumentation(groupTitleText, groupTitleSpan);
      }
    }
    groupTitleDiv.append(groupTitleSpan);
    linksDiv.append(groupTitleDiv);
    moveInstrumentation(groupNode.querySelector('.link-title'), groupTitleDiv);

    const panelDiv = document.createElement('div');
    panelDiv.classList.add('desktop-panel', 'panel');
    const groupTitleText = groupNode.querySelector('[data-aue-prop="groupTitle"]');
    if (groupTitleText) {
      panelDiv.classList.add(groupTitleText.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, ''));
    }

    const linkGridBlock = document.createElement('div');
    linkGridBlock.classList.add('link-grid', 'block');
    const linkContainerSection = document.createElement('div');
    linkContainerSection.classList.add('link-container-section');

    const linkColumns = groupNode.querySelectorAll('.link-grid-column');
    linkColumns.forEach((columnNode) => {
      const newColumn = document.createElement('div');
      newColumn.classList.add(...columnNode.classList);

      const ul = document.createElement('ul');
      ul.classList.add('content', 'links-container', 'accordian-content');

      const headerLinks = columnNode.querySelectorAll('[data-aue-model="headerLink"]');
      headerLinks.forEach((linkNode) => {
        const li = document.createElement('li');
        const link = linkNode.querySelector('[data-aue-prop="link"]');
        const label = linkNode.querySelector('[data-aue-prop="label"]');

        if (link) {
          li.append(link);
          moveInstrumentation(link, li);
        }
        if (label && label.textContent.trim() !== '') {
          const p = document.createElement('p');
          p.append(label.textContent);
          li.append(p);
          moveInstrumentation(label, p);
        }
        ul.append(li);
        moveInstrumentation(linkNode, li);
      });
      newColumn.append(ul);
      linkContainerSection.append(newColumn);
      moveInstrumentation(columnNode, newColumn);
    });
    linkGridBlock.append(linkContainerSection);
    panelDiv.append(linkGridBlock);
    linksDiv.append(panelDiv);
    moveInstrumentation(groupNode.querySelector('.desktop-panel'), panelDiv);
  });

  navbarArena.append(linksDiv);
  moveInstrumentation(block.querySelector('.links'), linksDiv);

  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';

  const contactWrapper = document.createElement('div');
  contactWrapper.classList.add('contact-wrapper');
  const contactBlock = document.createElement('div');
  contactBlock.classList.add('contact', 'block');
  contactBlock.setAttribute('data-block-name', 'contact');

  const contactContent = block.querySelector('.contact_wrp_arena');
  if (contactContent) {
    contactBlock.append(contactContent);
    moveInstrumentation(contactContent, contactBlock);
  }
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);
  moveInstrumentation(block.querySelector('.contact-wrapper'), contactWrapper);

  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = 'EN';
  rightDiv.append(languageDiv);
  moveInstrumentation(block.querySelector('.language'), languageDiv);

  const signInWrapper = document.createElement('div');
  signInWrapper.classList.add('sign-in-wrapper', 'hidden');
  const signInBlock = document.createElement('div');
  signInBlock.classList.add('sign-in', 'block');
  signInBlock.setAttribute('data-block-name', 'sign-in');

  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');
  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');

  const profileLinks = block.querySelectorAll('[data-aue-model="headerProfileLink"]');
  profileLinks.forEach((profileNode) => {
    const profileLink = profileNode.querySelector('[data-aue-prop="profileLink"]');
    const profileIcon = profileNode.querySelector('[data-aue-prop="icon"]');
    const profileLabel = profileNode.querySelector('[data-aue-prop="profileLabel"]');

    if (profileLink) {
      profileLink.classList.add('user__account--link');
      if (profileLabel) {
        profileLink.classList.add(profileLabel.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-*|-*$/g, ''));
      }
      const iconSpan = document.createElement('span');
      iconSpan.classList.add('user__account__list-icon');
      if (profileIcon) {
        iconSpan.append(profileIcon);
        moveInstrumentation(profileIcon, iconSpan);
      }
      profileLink.prepend(iconSpan);
      userAccount.append(profileLink);
      moveInstrumentation(profileLink, userAccount);
    }
  });

  const signInBtnDiv = document.createElement('div');
  signInBtnDiv.classList.add('user__account--link', 'sign-in-btn');
  const signInIconSpan = document.createElement('span');
  signInIconSpan.classList.add('user__account__list-icon');
  const signInImg = block.querySelector('.sign-in-btn img');
  if (signInImg) {
    signInIconSpan.append(signInImg);
    moveInstrumentation(signInImg, signInIconSpan);
  }
  const signInButton = block.querySelector('.sign-in-btn button');
  if (signInButton) {
    signInBtnDiv.append(signInIconSpan, signInButton);
    moveInstrumentation(signInButton, signInBtnDiv);
  }
  userAccount.append(signInBtnDiv);
  moveInstrumentation(block.querySelector('.sign-in-btn'), signInBtnDiv);

  userDropdown.append(userAccount);
  signInBlock.append(userDropdown);
  signInWrapper.append(signInBlock);
  rightDiv.append(signInWrapper);
  moveInstrumentation(block.querySelector('.sign-in-wrapper'), signInWrapper);

  navbarArena.append(rightDiv);

  const carFilterMenu = document.createElement('div');
  carFilterMenu.classList.add('car-filter-menu', 'hidden', 'car-filter-arena');
  carFilterMenu.id = 'carFilterMenu';

  const searchHeaderBlock = document.createElement('div');
  searchHeaderBlock.classList.add('search-header', 'block');
  searchHeaderBlock.setAttribute('data-block-name', 'search-header');

  const searchLinkContainerSection = document.createElement('div');
  searchLinkContainerSection.classList.add('link-container-section');

  const searchLinkColumns = block.querySelectorAll('#carFilterMenu .link-grid-column');
  searchLinkColumns.forEach((columnNode) => {
    const newColumn = document.createElement('div');
    newColumn.classList.add(...columnNode.classList);
    const ul = document.createElement('ul');
    ul.classList.add('content', 'links-container', 'accordian-content');
    const links = columnNode.querySelectorAll('li a');
    links.forEach((link) => {
      const li = document.createElement('li');
      li.append(link);
      ul.append(li);
      moveInstrumentation(link.closest('li'), li);
    });
    newColumn.append(ul);
    searchLinkContainerSection.append(newColumn);
    moveInstrumentation(columnNode, newColumn);
  });
  searchHeaderBlock.append(searchLinkContainerSection);
  carFilterMenu.append(searchHeaderBlock);
  moveInstrumentation(block.querySelector('.search-header.block'), searchHeaderBlock);

  const carPanelHeader = document.createElement('div');
  carPanelHeader.classList.add('car-panel-header');
  carPanelHeader.innerHTML = '<div></div><span class="car-text">Cars</span><span class="car-filter-close"><img src="/content/dam/aemigrate/uploaded-folder/image/1774453712725.svg+xml" alt="close"></span>';
  carFilterMenu.append(carPanelHeader);
  moveInstrumentation(block.querySelector('.car-panel-header'), carPanelHeader);

  const menuDiv = document.createElement('div');
  menuDiv.id = 'menu';
  menuDiv.classList.add('menu', 'hidden', 'menu-arena');

  const menuHeader = document.createElement('div');
  menuHeader.classList.add('menu-header');
  menuHeader.innerHTML = '<div class="back-arrow"></div><span class="menu-title">Menu</span><span class="close-icon"></span>';
  menuDiv.append(menuHeader);
  moveInstrumentation(block.querySelector('.menu-header'), menuHeader);

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');

  const menuItems = block.querySelectorAll('.menu-list > li');
  menuItems.forEach((itemNode) => {
    const newMenuItem = document.createElement('li');
    newMenuItem.id = itemNode.id;
    newMenuItem.classList.add(...itemNode.classList);

    const menuTitleSpan = document.createElement('span');
    menuTitleSpan.classList.add('menu-title');
    const link = itemNode.querySelector('.menu-title a');
    if (link) {
      menuTitleSpan.append(link);
      moveInstrumentation(link, menuTitleSpan);
    } else {
      const textContent = itemNode.querySelector('.menu-title');
      if (textContent) {
        menuTitleSpan.append(textContent.textContent);
        moveInstrumentation(textContent, menuTitleSpan);
      }
    }
    newMenuItem.append(menuTitleSpan);

    const panel = itemNode.nextElementSibling;
    if (panel && panel.classList.contains('panel')) {
      const newPanel = document.createElement('div');
      newPanel.classList.add(...panel.classList);
      const section = document.createElement('div');
      section.classList.add('link-container-section');

      const columns = panel.querySelectorAll('.link-grid-column');
      columns.forEach((col) => {
        const newCol = document.createElement('div');
        newCol.classList.add(...col.classList);
        const ul = document.createElement('ul');
        ul.classList.add('content', 'links-container', 'accordian-content');
        const links = col.querySelectorAll('li');
        links.forEach((li) => {
          const newLi = document.createElement('li');
          newLi.append(...li.childNodes);
          ul.append(newLi);
          moveInstrumentation(li, newLi);
        });
        newCol.append(ul);
        section.append(newCol);
        moveInstrumentation(col, newCol);
      });
      newPanel.append(section);
      menuList.append(newMenuItem, newPanel);
      moveInstrumentation(itemNode, newMenuItem);
      moveInstrumentation(panel, newPanel);
    } else {
      menuList.append(newMenuItem);
      moveInstrumentation(itemNode, newMenuItem);
    }
  });

  // Handle profile links at the end of the mobile menu
  const mobileProfileLinks = block.querySelectorAll('.menu-list > li > a.user__account--link');
  mobileProfileLinks.forEach((linkNode) => {
    const li = document.createElement('li');
    li.append(linkNode);
    menuList.append(li);
    moveInstrumentation(linkNode, li);
  });

  const mobileSignInBtn = block.querySelector('.menu-list > li > .user__account--link.sign-in-btn');
  if (mobileSignInBtn) {
    const li = document.createElement('li');
    li.append(mobileSignInBtn);
    menuList.append(li);
    moveInstrumentation(mobileSignInBtn, li);
  }

  menuDiv.append(menuList);
  moveInstrumentation(block.querySelector('.menu-list'), menuList);

  block.textContent = '';
  block.append(navbarArena, carFilterMenu, menuDiv);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
