import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // BlockJson indicates that block.children directly contains the item rows for 'corp-header-link'.
  // The first child of the block is not a container for other links, but the first link item itself.
  // So, we iterate directly over block.children.

  const navbar = document.createElement('div');
  navbar.classList.add('navbar', 'navbar-arena', 'g-container');

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

  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('logo-wrapper');
  const logoBlock = document.createElement('div');
  logoBlock.classList.add('logo', 'block');
  const arenaSpan = document.createElement('span');
  arenaSpan.classList.add('arena');
  const logoLink = document.createElement('a');
  logoLink.classList.add('logo__picture');
  logoLink.href = '/';
  logoLink.setAttribute('data-logo-name', 'Arena');
  const logoPicture = document.createElement('picture');
  const logoImg = document.createElement('img');
  logoImg.alt = 'Arena Logo';
  logoImg.src = '/content/dam/aemigrate/uploaded-folder/image/1774964825164.svg+xml'; // Placeholder src
  logoPicture.append(logoImg);
  logoLink.append(logoPicture);
  arenaSpan.append(logoLink);
  logoBlock.append(arenaSpan);
  logoWrapper.append(logoBlock);

  const linksDiv = document.createElement('div');
  linksDiv.classList.add('links');

  const rightDiv = document.createElement('div');
  rightDiv.classList.add('right');
  rightDiv.id = 'nav-right';

  // Contact wrapper from original HTML
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
  const contactIconsDiv = document.createElement('div');
  contactIconsDiv.classList.add('user__contact__icons', 'hidden');
  // Add placeholder content for contact icons based on original HTML
  contactIconsDiv.innerHTML = `
    <a href="#" class="user__contact--icon phone" onclick="event.preventDefault(); this.closest('.contact').querySelector('.contact-toggle-box').classList.toggle('hidden')">
      <span class="sr-only">phone</span>
      <img src="/content/dam/aemigrate/uploaded-folder/image/1774964825186.svg+xml" alt="phone" loading="lazy">
    </a>
    <div class="hidden">1800 102 1800</div>
    <div class="hidden"></div>
    <a href="https://wa.me/919289311487?text=Hi" target="_blank" class="user__contact--icon whatsapp" rel="noopener noreferrer">
      <span class="sr-only">whatsapp</span>
      <img src="/content/dam/aemigrate/uploaded-folder/image/1774964825203.svg+xml" alt="whatsapp" loading="lazy">
    </a>
    <a href="mailto:contact@maruti.co.in" class="user__contact--icon email">
      <span class="sr-only">email</span>
      <img src="/content/dam/aemigrate/uploaded-folder/image/1774964825298.svg+xml" alt="email" loading="lazy">
    </a>
  `;
  const contactToggleBox = document.createElement('div');
  contactToggleBox.classList.add('hidden', 'contact-toggle-box');
  contactToggleBox.innerHTML = `
    <div class="user__contact__icon-call_container">
      <a href="tel:1800 102 1800" class="primary-telephone">1800 102 1800</a>
      <a href="tel:" class="secondary-telephone"></a>
    </div>
  `;
  contactWrpArena.append(contactTitle, contactIconPhone, contactIconsDiv, contactToggleBox);
  contactBlock.append(contactWrpArena);
  contactWrapper.append(contactBlock);
  rightDiv.append(contactWrapper);

  const languageDiv = document.createElement('div');
  languageDiv.classList.add('language');
  languageDiv.textContent = 'EN';
  rightDiv.append(languageDiv);

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
  menuDiv.append(menuList);

  const desktopPanelCorporate = document.createElement('div');
  desktopPanelCorporate.classList.add('desktop-panel', 'panel', 'corporate');
  const desktopPanelSales = document.createElement('div');
  desktopPanelSales.classList.add('desktop-panel', 'panel', 'sales');
  const desktopPanelMore = document.createElement('div');
  desktopPanelMore.classList.add('desktop-panel', 'panel', 'more');

  const menuPanelCorporate = document.createElement('div');
  menuPanelCorporate.classList.add('panel');
  const menuPanelSales = document.createElement('div');
  menuPanelSales.classList.add('panel');
  const menuPanelMore = document.createElement('div');
  menuPanelMore.classList.add('panel');

  const menuItems = [];

  // Iterate over block.children directly as each child is a 'corp-header-link' item
  [...block.children].forEach((row, rowIndex) => {
    // Each row is a 'corp-header-link' item, which has one cell: 'link'
    const cell = row.children[0]; // Get the first (and only) cell of the item row

    const linkTitleDiv = document.createElement('div');
    linkTitleDiv.classList.add('link-title');
    moveInstrumentation(row, linkTitleDiv);

    const menuListItem = document.createElement('li');
    menuListItem.id = `menu-item-${rowIndex}`;
    menuListItem.classList.add('nav-link');
    moveInstrumentation(row, menuListItem);

    const link = cell.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      if (link.title) newLink.title = link.title;
      if (link.classList.contains('button')) newLink.classList.add('button');
      newLink.append(...link.childNodes);
      linkTitleDiv.append(newLink);

      const menuTitleSpan = document.createElement('span');
      menuTitleSpan.classList.add('menu-title');
      menuTitleSpan.append(newLink.cloneNode(true)); // Clone link for menu
      menuListItem.append(menuTitleSpan);

      // Apply specific classes based on link text content or presence of picture
      if (link.textContent.toLowerCase() === 'home') {
        menuListItem.classList.add('home');
      } else if (link.textContent.toLowerCase() === 'service') {
        menuListItem.classList.add('service');
      } else if (link.textContent.toLowerCase() === 'important customer info') {
        menuListItem.classList.add('important', 'customer', 'info');
      } else if (link.querySelector('picture')) {
        menuListItem.classList.add('logo__picture');
      }
    } else {
      // This path is for text-only items that become accordions (Corporate, Sales, More From us)
      linkTitleDiv.append(...cell.childNodes);
      const menuTitleSpan = document.createElement('span');
      menuTitleSpan.classList.add('menu-title');
      menuTitleSpan.textContent = cell.textContent;
      menuListItem.append(menuTitleSpan);

      if (cell.textContent.toLowerCase() === 'corporate') {
        linkTitleDiv.classList.add('corporate');
        menuListItem.classList.add('accordion', 'corporate');
        menuItems.push({ desktop: desktopPanelCorporate, mobile: menuPanelCorporate });
      } else if (cell.textContent.toLowerCase() === 'sales') {
        linkTitleDiv.classList.add('sales');
        menuListItem.classList.add('accordion', 'sales');
        menuItems.push({ desktop: desktopPanelSales, mobile: menuPanelSales });
      } else if (cell.textContent.toLowerCase() === 'more from us') {
        linkTitleDiv.classList.add('more', 'from', 'us'); // Corrected class name
        menuListItem.classList.add('accordion', 'more', 'from', 'us'); // Corrected class name
        menuItems.push({ desktop: desktopPanelMore, mobile: menuPanelMore });
      }
    }

    linksDiv.append(linkTitleDiv);
    menuList.append(menuListItem);

    // Add event listener for accordion behavior
    if (menuListItem.classList.contains('accordion')) {
      menuListItem.addEventListener('click', () => {
        menuListItem.classList.toggle('active');
        // The panel is not necessarily the next sibling in the final DOM structure
        // We need to target the correct panel based on the menuItems array
        const panelType = menuListItem.classList.contains('corporate') ? 'corporate'
          : menuListItem.classList.contains('sales') ? 'sales'
            : menuListItem.classList.contains('more') ? 'more' : '';

        const targetPanel = menuItems.find(item => {
          if (panelType === 'corporate' && item.mobile === menuPanelCorporate) return true;
          if (panelType === 'sales' && item.mobile === menuPanelSales) return true;
          if (panelType === 'more' && item.mobile === menuPanelMore) return true;
          return false;
        })?.mobile;

        if (targetPanel) {
          targetPanel.classList.toggle('active');
          if (targetPanel.style.maxHeight) {
            targetPanel.style.maxHeight = null;
          } else {
            targetPanel.style.maxHeight = `${targetPanel.scrollHeight}px`;
          }
        }
      });
    }
  });

  // Append desktop panels to linksDiv
  menuItems.forEach(item => {
    if (item.desktop) linksDiv.append(item.desktop);
  });

  // Append mobile panels to menuList
  menuItems.forEach(item => {
    if (item.mobile) menuList.append(item.mobile);
  });

  navbar.append(navHamburger, logoWrapper, linksDiv, rightDiv);

  block.textContent = '';
  block.append(navbar, menuDiv);

  // Add event listener for hamburger menu
  hamburgerButton.addEventListener('click', () => {
    menuDiv.classList.toggle('hidden');
  });

  // Add event listener for close icon in mobile menu
  closeIcon.addEventListener('click', () => {
    menuDiv.classList.add('hidden');
  });

  // Add event listener for back arrow in mobile menu (if it has functionality)
  backArrow.addEventListener('click', () => {
    // Implement back functionality if needed, e.g., closing sub-panels or the entire menu
    menuDiv.classList.add('hidden'); // For now, just close the menu
  });

  // Add event listener for contact icon to toggle contact details
  const contactPhoneIcon = contactWrpArena.querySelector('.user__contact--icon.phone');
  if (contactPhoneIcon) {
    contactPhoneIcon.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default link behavior
      contactToggleBox.classList.toggle('hidden');
    });
  }

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
