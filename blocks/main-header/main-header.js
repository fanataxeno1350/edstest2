import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Add classes from original HTML to list items
    li.classList.add('list-item'); // Assuming 'list-item' is a common class for all list items

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
      );
      if (textNode) {
        const span = document.createElement('span');
        span.textContent = textNode.textContent.trim();
        textNode.remove();
        li.prepend(span);
      }
    }

    if (nested) {
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child');
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid');
  moveInstrumentation(block, header);

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo
  // Use content detection instead of index access
  const logoRow = children.find(row => row.querySelector('picture') && row.nextElementSibling?.querySelector('a'));
  const logoLinkRow = logoRow?.nextElementSibling;

  const logoPicture = logoRow?.querySelector('picture');
  const logoLink = logoLinkRow?.querySelector('a');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoAnchor = document.createElement('a');
  if (logoLink) logoAnchor.href = logoLink.href;
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('hiddenlogo1');
    logoAnchor.append(optimizedPic);
  }
  logoDiv.append(logoAnchor);
  wrap.append(logoDiv);

  // Hamburger
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburgerDiv.append(hamburgerUl);
  wrap.append(hamburgerDiv);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrap.append(nav);

  // Filter rows for navigation items based on cell count and content
  const navigationItems = children.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].textContent.trim() && cells[1].querySelector('a') && cells[2].querySelector('ul');
  });

  // Filter rows for icon link items (not used in current JS, but good practice)
  // const iconLinkItems = children.filter((row) => {
  //   const cells = [...row.children];
  //   return cells.length === 2 && cells[0].querySelector('a') && cells[1].textContent.trim();
  // });

  // Filter rows for press release items (not used in current JS, but good practice)
  // const pressReleaseItems = children.filter((row) => {
  //   const cells = [...row.children];
  //   return cells.length === 4 && cells[0].querySelector('a') && cells[1].textContent.trim();
  // });

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const foundLink = linkCell?.querySelector('a');
    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(linkCell, anchor);
    li.append(anchor);

    const svgSpan = document.createElement('span');
    svgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
    li.append(svgSpan);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrapContainer = document.createElement('div');
    megaMenuWrapContainer.classList.add('wrap', 'container');
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    const leftDivHeading = document.createElement('h4');
    leftDivHeading.classList.add('left-div-heading');
    const headingAnchor = document.createElement('a');
    headingAnchor.textContent = labelCell?.textContent.trim() || '';
    leftDivHeading.append(headingAnchor);
    leftDiv.append(leftDivHeading);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      // Use innerHTML to preserve nested structure
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv);

      // Apply classes to nested elements as per original HTML
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('list-item')); // Example, adjust based on actual classes
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('sub-nav-wrap')); // Example, adjust based on actual classes
      tempDiv.querySelectorAll('li').forEach(liItem => liItem.classList.add('list-item')); // Example, adjust based on actual classes

      // Move children from tempDiv to subNavWrap
      while (tempDiv.firstChild) {
        subNavWrap.append(tempDiv.firstChild);
      }
      transformNestedLists(subNavWrap.querySelector('ul')); // Apply transformation to the moved hierarchy
    }
    centerDiv.append(leftDiv, subNavWrap);
    megaMenuWrapContainer.append(centerDiv);
    megaMenu.append(megaMenuWrapContainer);
    li.append(megaMenu);
    navUl.append(li);
  });

  // Icon Nav (mobile)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);
  navUl.append(mobileIconNav);

  const mailLiMobile = document.createElement('li');
  mailLiMobile.classList.add('mail');
  const mailAnchorMobile = document.createElement('a');
  mailAnchorMobile.href = 'https://www.mahindra.com/contact-us';
  mailAnchorMobile.textContent = 'Contact Us';
  mailLiMobile.append(mailAnchorMobile);
  mobileIconUl.append(mailLiMobile);

  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  const searchAnchorMobile = document.createElement('a');
  searchAnchorMobile.href = '#';
  searchAnchorMobile.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none" class="lens">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
    </svg>
    <svg viewBox="0 0 50 50" class="close">
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
    </svg>
    <span> Search</span>
  `;
  searchLiMobile.append(searchAnchorMobile);
  mobileIconUl.append(searchLiMobile);

  const searchScreenWrapMobile = document.createElement('div');
  searchScreenWrapMobile.classList.add('search-screen-wrap');
  searchScreenWrapMobile.innerHTML = `
    <div class="wrap">
      <form action="https://www.mahindra.com/search" method="get" id="search-block-form" accept-charset="UTF-8">
        <div class="search-wrap">
          <div class="search-icon">
            <svg viewBox="0 0 21 21" fill="none">
              <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
            </svg>
          </div>
          <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off">
          <button class="submit-button">
            <div class="label"> Submit </div>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
            </svg>
          </button>
        </div>
        <div class="searchResultBox" style="display: none;">
          <div class="swiper scrollSwiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
              </div>
            </div>
          </div>
          <div class="swiper-scrollbar"></div>
        </div>
      </form>
      <div class="search-suggestions-wrap">
        <div class="label">Popular Keywords:</div>
        <div class="tokens-wrap">
          <ul>
            <li>Business</li>
            <li>FY 21</li>
            <li>Brands</li>
            <li>XUV700</li>
            <li>Global</li>
            <li>Nanhi Kali</li>
          </ul>
        </div>
      </div>
      <div class="search-suggestions-wrap">
        <div class="label">Recommended for you:</div>
        <div class="tokens-wrap">
          <ul>
            <li>Annual Report 2021 - 2022</li>
            <li>Leadership Announcement</li>
            <li>Latest Press Release</li>
            <li>Brand Guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  searchLiMobile.append(searchScreenWrapMobile);

  // Icon Nav (desktop)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);
  nav.append(desktopIconNav);

  const mailLiDesktop = document.createElement('li');
  mailLiDesktop.classList.add('mail');
  const mailAnchorDesktop = document.createElement('a');
  mailAnchorDesktop.href = 'https://www.mahindra.com/contact-us';
  mailAnchorDesktop.innerHTML = `
    <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
    </svg>
  `;
  mailLiDesktop.append(mailAnchorDesktop);
  desktopIconUl.append(mailLiDesktop);

  const searchLiDesktop = document.createElement('li');
  searchLiDesktop.classList.add('search');
  const searchAnchorDesktop = document.createElement('a');
  searchAnchorDesktop.href = '#';
  searchAnchorDesktop.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none" class="lens">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
    </svg>
    <svg viewBox="0 0 50 50" class="close">
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
    </svg>
  `;
  searchLiDesktop.append(searchAnchorDesktop);
  desktopIconUl.append(searchLiDesktop);

  const searchScreenWrapDesktop = document.createElement('div');
  searchScreenWrapDesktop.classList.add('search-screen-wrap');
  searchScreenWrapDesktop.innerHTML = `
    <div class="wrap">
      <form action="https://www.mahindra.com/search" method="get" id="search-block-form" accept-charset="UTF-8">
        <div class="search-wrap">
          <div class="search-icon">
            <svg viewBox="0 0 21 21" fill="none">
              <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
            </svg>
          </div>
          <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off">
          <button class="submit-button">
            <div class="label"> Submit </div>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
            </svg>
          </button>
        </div>
        <div class="searchResultBox" style="display: none;">
          <div class="swiper scrollSwiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
              </div>
            </div>
          </div>
          <div class="swiper-scrollbar"></div>
        </div>
      </form>
      <div class="search-suggestions-wrap">
        <div class="label">Popular Keywords:</div>
        <div class="tokens-wrap">
          <ul>
            <li>Business</li>
            <li>FY 21</li>
            <li>Brands</li>
            <li>XUV700</li>
            <li>Global</li>
            <li>Nanhi Kali</li>
          </ul>
        </div>
      </div>
      <div class="search-suggestions-wrap">
        <div class="label">Recommended for you:</div>
        <div class="tokens-wrap">
          <ul>
            <li>Annual Report 2021 - 2022</li>
            <li>Leadership Announcement</li>
            <li>Latest Press Release</li>
            <li>Brand Guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  searchLiDesktop.append(searchScreenWrapDesktop);

  // Anniversary Logo
  // Use content detection instead of index access
  const anniversaryLogoRow = children.find(row => row.querySelector('picture') && row.nextElementSibling?.querySelector('a') && row !== logoRow);
  const anniversaryLogoLinkRow = anniversaryLogoRow?.nextElementSibling;

  const anniversaryLogoPicture = anniversaryLogoRow?.querySelector('picture');
  const anniversaryLogoLink = anniversaryLogoLinkRow?.querySelector('a');

  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoAnchor = document.createElement('a');
  if (anniversaryLogoLink) year80LogoAnchor.href = anniversaryLogoLink.href;
  if (anniversaryLogoPicture) {
    const img = anniversaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    year80LogoAnchor.append(optimizedPic);
  }
  year80LogoDiv.append(year80LogoAnchor);
  wrap.append(year80LogoDiv);

  block.replaceWith(header);

  // Event Listeners for mobile hamburger and search
  const hamburger = header.querySelector('.hamburger');
  const mainNav = header.querySelector('.main-nav');
  const searchToggleMobile = header.querySelector('.mobile-menus-icon .search > a');
  const searchScreen = header.querySelector('.mobile-menus-icon .search-screen-wrap');
  const searchCloseButtonMobile = searchScreen.querySelector('.close'); // Corrected variable name

  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburger.classList.toggle('close');
    searchScreen.classList.remove('active'); // Close search if open
    header.classList.toggle('active'); // Toggle active class on header
  });

  searchToggleMobile.addEventListener('click', (e) => {
    e.preventDefault();
    searchScreen.classList.toggle('active');
    mainNav.classList.remove('active'); // Close nav if open
    hamburger.classList.remove('close');
    header.classList.toggle('active'); // Toggle active class on header
  });

  searchCloseButtonMobile.addEventListener('click', (e) => { // Corrected variable name
    e.preventDefault();
    searchScreen.classList.remove('active');
    header.classList.remove('active');
  });

  // Event Listeners for desktop search
  const searchToggleDesktop = header.querySelector('.desktop-menus-icon .search > a');
  const searchScreenDesktop = header.querySelector('.desktop-menus-icon .search-screen-wrap');
  const searchCloseButtonDesktop = searchScreenDesktop.querySelector('.close');

  searchToggleDesktop.addEventListener('click', (e) => {
    e.preventDefault();
    searchScreenDesktop.classList.toggle('active');
    header.classList.toggle('active');
  });

  searchCloseButtonDesktop.addEventListener('click', (e) => {
    e.preventDefault();
    searchScreenDesktop.classList.remove('active');
    header.classList.remove('active');
  });

  // Scroll behavior for header
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 0) {
      header.classList.add('nav-up');
    } else {
      header.classList.remove('nav-up');
    }
    lastScrollY = window.scrollY;
  });
}
