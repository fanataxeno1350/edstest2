import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function buildLinkItem(row) {
  const linkTitleDiv = document.createElement('div');
  linkTitleDiv.classList.add('link-title');
  moveInstrumentation(row, linkTitleDiv);

  const span = document.createElement('span');
  const link = row.querySelector('div:first-child a'); // Select the <a> tag within the first div cell
  if (link) {
    const newLink = document.createElement('a');
    newLink.href = link.href;
    newLink.title = link.textContent.toLowerCase();
    newLink.classList.add('button');
    newLink.textContent = link.textContent;
    span.append(newLink);
  } else {
    // If there's no link, it's a title for an accordion
    span.textContent = row.querySelector('div:first-child')?.textContent.trim() || '';
  }
  linkTitleDiv.append(span);
  return linkTitleDiv;
}

function buildMobileMenuItem(row, index) {
  const li = document.createElement('li');
  li.id = `menu-item-${index}`;
  li.classList.add('nav-link');
  moveInstrumentation(row, li);

  const span = document.createElement('span');
  span.classList.add('menu-title');
  const link = row.querySelector('div:first-child a'); // Select the <a> tag within the first div cell
  if (link) {
    const newLink = document.createElement('a');
    newLink.href = link.href;
    newLink.title = link.textContent.toLowerCase();
    newLink.classList.add('button');
    newLink.textContent = link.textContent;
    span.append(newLink);
  } else {
    // If no link, it's an accordion title
    span.textContent = row.querySelector('div:first-child')?.textContent.trim() || '';
    li.classList.add('accordion'); // Mark as accordion
  }
  li.append(span);
  return li;
}

export default function decorate(block) {
  const [logoRow, languageRow, ...linkRows] = [...block.children];

  block.textContent = '';

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
  logoBlock.classList.add('logo', 'block');
  moveInstrumentation(logoRow, logoBlock);

  const arenaSpan = document.createElement('span');
  arenaSpan.classList.add('arena');

  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  logoLink.href = logoRow.querySelector('a')?.href || '/';
  logoLink.setAttribute('data-logo-name', 'Arena');

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }
  arenaSpan.append(logoLink);
  logoBlock.append(arenaSpan);
  logoWrapper.append(logoBlock);
  navbarArena.append(logoWrapper);

  // Links section (Desktop)
  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');

  linkRows.forEach((row) => {
    const linkItem = buildLinkItem(row);
    linksDiv.append(linkItem);

    // Check if the row has more than one child (indicating a panel/accordion content)
    if (row.children.length > 1) {
      const panelDiv = document.createElement('div');
      panelDiv.classList.add('desktop-panel', 'panel');
      // Add a class based on the link title for specific styling if needed
      const titleText = row.querySelector('div:first-child')?.textContent.trim().toLowerCase().replace(/\s+/g, '-');
      if (titleText) {
        panelDiv.classList.add(titleText);
      }

      // Append the rest of the row's content to the panel
      // Assuming the rest of the content is in the second cell
      const panelContent = row.querySelector('div:nth-child(2)');
      if (panelContent) {
        panelDiv.append(...panelContent.children);
      }
      linksDiv.append(panelDiv);

      // Add event listener for desktop accordion
      linkItem.addEventListener('click', () => {
        linksDiv.querySelectorAll('.desktop-panel.panel').forEach((panel) => {
          if (panel !== panelDiv) {
            panel.classList.remove('show');
          }
        });
        panelDiv.classList.toggle('show');
      });
    }
  });
  navbarArena.append(linksDiv);

  // Right section (language, contact, sign-in)
  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';

  // Language
  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  moveInstrumentation(languageRow, languageDiv);
  languageDiv.textContent = languageRow.querySelector('div:first-child')?.textContent.trim() || '';
  rightDiv.append(languageDiv);

  navbarArena.append(rightDiv);
  block.append(navbarArena);

  // Mobile menu
  const menuDiv = document.createElement('div');
  menuDiv.id = 'menu';
  menuDiv.classList.add('menu', 'hidden', 'menu-arena');

  const menuHeader = document.createElement('div');
  menuHeader.classList.add('menu-header');
  menuHeader.innerHTML = `
    <div class="back-arrow"></div>
    <span class="menu-title">Menu</span>
    <span class="close-icon"></span>
  `;
  menuDiv.append(menuHeader);

  const menuList = document.createElement('ul');
  menuList.classList.add('menu-list');

  linkRows.forEach((row, index) => {
    const li = buildMobileMenuItem(row, index);
    menuList.append(li);

    // If it's an accordion, add the panel
    if (li.classList.contains('accordion')) {
      const panelDiv = document.createElement('div');
      panelDiv.classList.add('panel');
      // Append the rest of the row's content to the panel
      const panelContent = row.querySelector('div:nth-child(2)');
      if (panelContent) {
        panelDiv.append(...panelContent.children);
      }
      menuList.append(panelDiv);

      // Add event listener for mobile accordion
      li.addEventListener('click', () => {
        // Close other open accordions
        menuList.querySelectorAll('.accordion').forEach((otherLi) => {
          if (otherLi !== li && otherLi.classList.contains('active')) {
            otherLi.classList.remove('active');
            otherLi.nextElementSibling?.classList.remove('show');
          }
        });
        li.classList.toggle('active');
        panelDiv.classList.toggle('show');
      });
    }
  });
  menuDiv.append(menuList);
  block.append(menuDiv);

  // Event listeners for hamburger menu and close icons
  const menu = block.querySelector('#menu');
  const navHamburgerButton = block.querySelector('.nav-hamburger button');
  const closeIcon = block.querySelector('.close-icon');

  if (navHamburgerButton && menu) {
    navHamburgerButton.addEventListener('click', () => {
      menu.classList.toggle('hidden');
      navHamburgerButton.setAttribute('aria-expanded', menu.classList.contains('hidden') ? 'false' : 'true');
    });
  }

  if (closeIcon && menu) {
    closeIcon.addEventListener('click', () => {
      menu.classList.add('hidden');
      if (navHamburgerButton) {
        navHamburgerButton.setAttribute('aria-expanded', 'false');
      }
    });
  }
}
