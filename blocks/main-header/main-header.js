import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [logoRow, logoLinkRow, year80LogoRow, year80LogoLinkRow, ...itemRows] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  const logoHref = logoLinkRow.querySelector('a')?.href || '#';
  logoLink.href = logoHref;
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(logoPicture, optimizedPic);
    logoLink.append(optimizedPic);
    logoLink.querySelector('img').classList.add('hiddenlogo1');
  }
  moveInstrumentation(logoRow, logoDiv);
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);
  wrap.append(logoDiv);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  const ulHamburger = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    ulHamburger.append(document.createElement('li'));
  }
  hamburger.append(ulHamburger);
  wrap.append(hamburger);

  // Main Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);

  const navigationItems = itemRows.filter(row => row.children.length === 3);
  const iconLinkItems = itemRows.filter(row => row.children.length === 2);

  navigationItems.forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');
    moveInstrumentation(row, li);

    const labelCell = [...row.children].find(c => !c.querySelector('a') && !c.querySelector('ul'));
    const linkCell = [...row.children].find(c => c.querySelector('a') && !c.querySelector('ul'));
    const hierarchyCell = [...row.children].find(c => c.querySelector('ul'));

    const link = document.createElement('a');
    link.setAttribute('itemprop', 'url');
    if (linkCell && linkCell.querySelector('a')) {
      link.href = linkCell.querySelector('a').href;
      link.textContent = labelCell?.textContent || '';
      moveInstrumentation(linkCell, link);
    } else {
      link.textContent = labelCell?.textContent || '';
    }
    li.append(link);

    if (hierarchyCell) {
      const span = document.createElement('span');
      // Original HTML uses an SVG image for the span content, but EDS provides rich text.
      // For now, we'll just add the span and rely on CSS for styling if needed.
      // If an SVG is needed, it would need to be added here.
      li.append(span);

      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap'); // specific class like 'about-us-sub-nav' might be needed based on content
      
      // Use a temporary div to parse and manipulate the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv);

      // Apply classes to nested elements from ORIGINAL HTML
      tempDiv.querySelectorAll('a').forEach((a) => {
        // No specific classes for <a> inside the generated hierarchy-tree in original HTML example,
        // but if there were, they would be added here.
        // For example: a.classList.add('nav-link');
      });
      tempDiv.querySelectorAll('li').forEach((liEl) => {
        // Example: liEl.classList.add('nav-menu-item');
        // Based on original HTML, some li's have specific classes like 'top-level-li', 'first-level-li'
        // These are not generic to all hierarchy-tree items, so we don't add them universally here.
        // If the model supported a way to specify these, we would.
      });
      tempDiv.querySelectorAll('ul').forEach((ulEl) => {
        // Example: ulEl.classList.add('nav-submenu');
      });

      // Move the children from the temporary div to subNavWrap
      while (tempDiv.firstChild) {
        subNavWrap.append(tempDiv.firstChild);
      }

      centerDiv.append(subNavWrap);
      megaMenuWrap.append(centerDiv);
      megaMenu.append(megaMenuWrap);
      li.append(megaMenu);
    }
    navUl.append(li);
  });

  // Icon Links (Mobile)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);

  iconLinkItems.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const iconCell = [...row.children].find(c => c.querySelector('picture'));
    const linkCell = [...row.children].find(c => c.querySelector('a'));

    if (iconCell && linkCell) {
      const link = document.createElement('a');
      link.href = linkCell.querySelector('a').href;
      moveInstrumentation(linkCell, link);

      const picture = iconCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]); // Adjust width as needed
        moveInstrumentation(picture, optimizedPic);
        link.append(optimizedPic);
      }
      li.append(link);
    }
    if (li.children.length > 0) {
      mobileIconUl.append(li);
    }
  });

  // Add specific icon link elements if they exist in the original HTML and are not dynamic
  // Example for 'mail' and 'search' from original HTML
  const mailLiMobile = document.createElement('li');
  mailLiMobile.classList.add('mail');
  const mailLinkMobile = document.createElement('a');
  mailLinkMobile.href = 'https://www.mahindra.com/contact-us';
  mailLinkMobile.textContent = 'Contact Us';
  mailLiMobile.append(mailLinkMobile);
  mobileIconUl.append(mailLiMobile);

  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  searchLiMobile.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const searchLinkMobile = document.createElement('a');
  searchLinkMobile.href = '#';
  searchLinkMobile.setAttribute('data-once', 'search-stop-propagation');
  // Placeholder for search icons, if they were in EDS, they'd be read from a cell.
  // For now, based on original HTML, they are fixed SVG.
  const searchImg1Mobile = document.createElement('img');
  searchImg1Mobile.alt = 'svg file';
  searchImg1Mobile.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107725.svg+xml';
  const searchImg2Mobile = document.createElement('img');
  searchImg2Mobile.alt = 'svg file';
  searchImg2Mobile.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107749.svg+xml';
  const searchSpanMobile = document.createElement('span');
  searchSpanMobile.setAttribute('data-once', 'search-stop-propagation');
  searchSpanMobile.textContent = ' Search';
  searchLinkMobile.append(searchImg1Mobile, searchImg2Mobile, searchSpanMobile);
  searchLiMobile.append(searchLinkMobile);

  // Add search-screen-wrap for mobile search
  const searchScreenWrapMobile = document.createElement('div');
  searchScreenWrapMobile.classList.add('search-screen-wrap');
  searchScreenWrapMobile.setAttribute('data-once', 'search-stop-propagation');
  searchScreenWrapMobile.innerHTML = `
    <div class="wrap" data-once="search-stop-propagation">
      <form action="https://www.mahindra.com/search" method="get" id="search-block-form-mobile" accept-charset="UTF-8" data-drupal-form-fields="edit-keys" data-once="search-stop-propagation">
        <div class="search-wrap" data-once="search-stop-propagation">
          <div class="search-icon" data-once="search-stop-propagation">
            <img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1776231107769.svg+xml"/>
          </div>
          <input type="text" class="input-text searchtext" required="" name="key" id="searchInputMobile" autocomplete="off" data-once="search-stop-propagation">
          <button class="submit-button" data-once="search-stop-propagation">
            <div class="label" data-once="search-stop-propagation"> Submit </div>
            <img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1776231107812.svg+xml"/>
          </button>
        </div>
        <div class="searchResultBox" style="display: none;" data-once="search-stop-propagation">
          <div class="swiper scrollSwiper" data-once="search-stop-propagation">
            <div class="swiper-wrapper" data-once="search-stop-propagation">
              <div class="swiper-slide" data-once="search-stop-propagation">
              </div>
            </div>
          </div>
          <div class="swiper-scrollbar" data-once="search-stop-propagation"></div>
        </div>
      </form>
      <div class="search-suggestions-wrap" data-once="search-stop-propagation">
        <div class="label" data-once="search-stop-propagation">Popular Keywords:</div>
        <div class="tokens-wrap" data-once="search-stop-propagation">
          <ul data-once="search-stop-propagation">
            <li data-once="search-stop-propagation">Business</li>
            <li data-once="search-stop-propagation">FY 21</li>
            <li data-once="search-stop-propagation">Brands</li>
            <li data-once="search-stop-propagation">XUV700</li>
            <li data-once="search-stop-propagation">Global</li>
            <li data-once="search-stop-propagation">Nanhi Kali</li>
          </ul>
        </div>
      </div>
      <div class="search-suggestions-wrap" data-once="search-stop-propagation">
        <div class="label" data-once="search-stop-propagation">Recommended for you:</div>
        <div class="tokens-wrap" data-once="search-stop-propagation">
          <ul data-once="search-stop-propagation">
            <li data-once="search-stop-propagation">Annual Report 2021 - 2022</li>
            <li data-once="search-stop-propagation">Leadership Announcement</li>
            <li data-once="search-stop-propagation">Latest Press Release</li>
            <li data-once="search-stop-propagation">Brand Guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  searchLiMobile.append(searchScreenWrapMobile);
  mobileIconUl.append(searchLiMobile);

  navUl.append(mobileIconNav);

  // Icon Links (Desktop)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);

  // Re-use iconLinkItems for desktop, if needed, or add specific elements
  iconLinkItems.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const iconCell = [...row.children].find(c => c.querySelector('picture'));
    const linkCell = [...row.children].find(c => c.querySelector('a'));

    if (iconCell && linkCell) {
      const link = document.createElement('a');
      link.href = linkCell.querySelector('a').href;
      moveInstrumentation(linkCell, link);

      const picture = iconCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]); // Adjust width as needed
        moveInstrumentation(picture, optimizedPic);
        link.append(optimizedPic);
      }
      li.append(link);
    }
    if (li.children.length > 0) {
      desktopIconUl.append(li);
    }
  });

  // Add specific icon link elements if they exist in the original HTML and are not dynamic
  // Example for 'mail' and 'search' from original HTML
  const mailLiDesktop = document.createElement('li');
  mailLiDesktop.classList.add('mail');
  const mailLinkDesktop = document.createElement('a');
  mailLinkDesktop.href = 'https://www.mahindra.com/contact-us';
  const mailImgDesktop = document.createElement('img');
  mailImgDesktop.alt = 'svg file';
  mailImgDesktop.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107856.svg+xml';
  mailLinkDesktop.append(mailImgDesktop);
  mailLiDesktop.append(mailLinkDesktop);
  desktopIconUl.append(mailLiDesktop);

  const searchLiDesktop = document.createElement('li');
  searchLiDesktop.classList.add('search');
  searchLiDesktop.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const searchLinkDesktop = document.createElement('a');
  searchLinkDesktop.href = '#';
  searchLinkDesktop.setAttribute('data-once', 'search-stop-propagation');
  const searchImg1Desktop = document.createElement('img');
  searchImg1Desktop.alt = 'svg file';
  searchImg1Desktop.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107725.svg+xml';
  const searchImg2Desktop = document.createElement('img');
  searchImg2Desktop.alt = 'svg file';
  searchImg2Desktop.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107749.svg+xml';
  searchLinkDesktop.append(searchImg1Desktop, searchImg2Desktop);
  searchLiDesktop.append(searchLinkDesktop);

  // Add search-screen-wrap for desktop search
  const searchScreenWrapDesktop = document.createElement('div');
  searchScreenWrapDesktop.classList.add('search-screen-wrap');
  searchScreenWrapDesktop.setAttribute('data-once', 'search-stop-propagation');
  searchScreenWrapDesktop.innerHTML = `
    <div class="wrap" data-once="search-stop-propagation">
      <form action="https://www.mahindra.com/search" method="get" id="search-block-form-desktop" accept-charset="UTF-8" data-drupal-form-fields="edit-keys" data-once="search-stop-propagation">
        <div class="search-wrap" data-once="search-stop-propagation">
          <div class="search-icon" data-once="search-stop-propagation">
            <img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1776231107769.svg+xml"/>
          </div>
          <input type="text" class="input-text searchtext" required="" name="key" id="searchInputDesktop" autocomplete="off" data-once="search-stop-propagation">
          <button class="submit-button" data-once="search-stop-propagation">
            <div class="label" data-once="search-stop-propagation"> Submit </div>
            <img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1776231107812.svg+xml"/>
          </button>
        </div>
        <div class="searchResultBox" style="display: none;" data-once="search-stop-propagation">
          <div class="swiper scrollSwiper" data-once="search-stop-propagation">
            <div class="swiper-wrapper" data-once="search-stop-propagation">
              <div class="swiper-slide" data-once="search-stop-propagation">
              </div>
            </div>
          </div>
          <div class="swiper-scrollbar" data-once="search-stop-propagation"></div>
        </div>
      </form>
      <div class="search-suggestions-wrap" data-once="search-stop-propagation">
        <div class="label" data-once="search-stop-propagation">Popular Keywords:</div>
        <div class="tokens-wrap" data-once="search-stop-propagation">
          <ul data-once="search-stop-propagation">
            <li data-once="search-stop-propagation">Business</li>
            <li data-once="search-stop-propagation">FY 21</li>
            <li data-once="search-stop-propagation">Brands</li>
            <li data-once="search-stop-propagation">XUV700</li>
            <li data-once="search-stop-propagation">Global</li>
            <li data-once="search-stop-propagation">Nanhi Kali</li>
          </ul>
        </div>
      </div>
      <div class="search-suggestions-wrap" data-once="search-stop-propagation">
        <div class="label" data-once="search-stop-propagation">Recommended for you:</div>
        <div class="tokens-wrap" data-once="search-stop-propagation">
          <ul data-once="search-stop-propagation">
            <li data-once="search-stop-propagation">Annual Report 2021 - 2022</li>
            <li data-once="search-stop-propagation">Leadership Announcement</li>
            <li data-once="search-stop-propagation">Latest Press Release</li>
            <li data-once="search-stop-propagation">Brand Guidelines</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  searchLiDesktop.append(searchScreenWrapDesktop);
  desktopIconUl.append(searchLiDesktop);

  nav.append(desktopIconNav);
  wrap.append(nav);

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  const year80LogoHref = year80LogoLinkRow.querySelector('a')?.href || '#';
  year80LogoLink.href = year80LogoHref;
  const year80LogoPicture = year80LogoRow.querySelector('picture');
  if (year80LogoPicture) {
    const img = year80LogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(year80LogoPicture, optimizedPic);
    year80LogoLink.append(optimizedPic);
    year80LogoLink.querySelector('img').classList.add('hiddenlogo1', 'years-80');
  }
  moveInstrumentation(year80LogoRow, year80LogoDiv);
  moveInstrumentation(year80LogoLinkRow, year80LogoLink);
  year80LogoDiv.append(year80LogoLink);
  wrap.append(year80LogoDiv);

  block.textContent = '';
  block.append(header);

  // Add event listener for hamburger menu
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('close');
    document.body.classList.toggle('no-scroll');
  });

  // Add event listener for search toggle
  const searchToggleElements = block.querySelectorAll('.search');
  searchToggleElements.forEach((searchEl) => {
    const searchLink = searchEl.querySelector('a');
    const searchScreenWrap = searchEl.querySelector('.search-screen-wrap');

    if (searchLink && searchScreenWrap) {
      searchLink.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // Prevent immediate closing from document click
        searchScreenWrap.classList.toggle('active');
      });

      // Close search when clicking outside
      document.addEventListener('click', (e) => {
        if (!searchEl.contains(e.target) && searchScreenWrap.classList.contains('active')) {
          searchScreenWrap.classList.remove('active');
        }
      });

      // Prevent search screen from closing when clicking inside it
      searchScreenWrap.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  });

  // Add event listener for sub-child toggle (mega menu)
  block.querySelectorAll('.has-child').forEach((li) => {
    const span = li.querySelector('span');
    if (span) {
      span.addEventListener('click', () => {
        li.classList.toggle('active');
      });
    }
  });

  // Image optimization for all pictures in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
