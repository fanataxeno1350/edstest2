import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (!anchor) {
      const textNode = [...li.childNodes].find(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
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
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    ...itemRows
  ] = [...block.children];

  block.innerHTML = '';
  block.classList.add('with-marquee', 'solid'); // Add initial classes, but NOT 'nav-up'

  const headerContainer = document.createElement('div');
  headerContainer.classList.add('container');
  block.append(headerContainer);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  headerContainer.append(wrapDiv);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('hiddenlogo1');
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);
  wrapDiv.append(logoDiv);

  // Hamburger
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburgerDiv.append(hamburgerUl);
  wrapDiv.append(hamburgerDiv);

  // Main Navigation
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  const mainUl = document.createElement('ul');
  mainUl.setAttribute('itemscope', '');
  mainUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.append(mainUl);
  wrapDiv.append(mainNav);

  const navigationItems = itemRows.filter((row) => row.children.length === 3);
  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const link = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
    }
    link.textContent = labelCell.textContent.trim();
    link.setAttribute('itemprop', 'url');
    moveInstrumentation(labelCell, link);
    moveInstrumentation(linkCell, link);
    li.append(link);

    const svgSpan = document.createElement('span');
    svgSpan.innerHTML = `<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>`;
    li.append(svgSpan);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);
    megaMenu.append(megaMenuWrap);

    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      subNavWrap.append(hierarchyRoot);
      centerDiv.append(subNavWrap);
      transformNestedLists(hierarchyRoot);
    }

    li.append(megaMenu);
    mainUl.append(li);
    moveInstrumentation(row, li);
  });

  // Icon Navigation (Contact Links and Search)
  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const iconNavMobileUl = document.createElement('ul');
  iconNavMobile.append(iconNavMobileUl);

  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const iconNavDesktopUl = document.createElement('ul');
  iconNavDesktop.append(iconNavDesktopUl);

  const contactLinks = itemRows.filter((row) => row.children.length === 1);
  contactLinks.forEach((row) => {
    const [linkCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('mail');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = 'Contact Us'; // Hardcoded text from original HTML
    moveInstrumentation(row, anchor);
    li.append(anchor);
    iconNavMobileUl.append(li.cloneNode(true)); // Clone for mobile
    iconNavDesktopUl.append(li); // Original for desktop
  });

  // Search functionality (copied from original HTML)
  const searchLi = document.createElement('li');
  searchLi.classList.add('search');
  const searchAnchor = document.createElement('a');
  searchAnchor.href = '#';
  searchAnchor.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none" class="lens">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
    </svg>
    <svg viewBox="0 0 50 50" class="close">
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
    </svg>
    <span class="mobile-only-text"> Search</span>
  `;

  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.innerHTML = `
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
              <div class="swiper-slide"></div>
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
  searchLi.append(searchScreenWrap);

  iconNavMobileUl.append(searchLi.cloneNode(true));
  iconNavDesktopUl.append(searchLi);

  mainUl.append(iconNavMobile); // Append mobile icon nav to mainUl for mobile view
  mainNav.append(iconNavDesktop); // Append desktop icon nav to mainNav for desktop view

  // Anniversary Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  const foundAnniversaryLogoLink = anniversaryLogoLinkRow.querySelector('a');
  if (foundAnniversaryLogoLink) {
    year80LogoLink.href = foundAnniversaryLogoLink.href;
  }
  const anniversaryLogoPicture = anniversaryLogoRow.querySelector('picture');
  if (anniversaryLogoPicture) {
    const img = anniversaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    year80LogoLink.append(optimizedPic);
  }
  moveInstrumentation(anniversaryLogoRow, year80LogoLink);
  moveInstrumentation(anniversaryLogoLinkRow, year80LogoLink);
  year80LogoDiv.append(year80LogoLink);
  wrapDiv.append(year80LogoDiv);

  // Event Listeners for interactive elements
  const searchToggle = block.querySelector('.search > a');
  const searchScreen = block.querySelector('.search-screen-wrap');
  const searchClose = searchScreen.querySelector('.close'); // Corrected selector

  searchToggle.addEventListener('click', (e) => {
    e.preventDefault();
    searchScreen.classList.toggle('active');
    block.classList.toggle('search-active');
  });

  searchClose.addEventListener('click', (e) => {
    e.preventDefault();
    searchScreen.classList.remove('active');
    block.classList.remove('search-active');
  });

  const hamburger = block.querySelector('.hamburger');
  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburger.classList.toggle('active');
    block.classList.toggle('mobile-nav-active');
  });

  // Handle scroll behavior for header visibility
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 0) {
      block.classList.add('nav-up');
      block.classList.remove('nav-down');
    } else if (window.scrollY < lastScrollY) {
      block.classList.remove('nav-up');
      block.classList.add('nav-down');
    }
    lastScrollY = window.scrollY;
  });
}
