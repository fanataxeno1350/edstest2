import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function createSvgIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '-23.5 -23.5 122.80 122.80');
  svg.setAttribute('fill', '#000000');
  svg.setAttribute('stroke', '#000000');
  svg.setAttribute('stroke-width', '4.851456000000001');

  const g1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g1.setAttribute('id', 'SVGRepo_bgCarrier');
  g1.setAttribute('stroke-width', '0');
  svg.appendChild(g1);

  const g2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g2.setAttribute('id', 'SVGRepo_tracerCarrier');
  g2.setAttribute('stroke-linecap', 'round');
  g2.setAttribute('stroke-linejoin', 'round');
  g2.setAttribute('stroke', '#CCCCCC');
  g2.setAttribute('stroke-width', '0.30321600000000004');
  svg.appendChild(g2);

  const g3 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g3.setAttribute('id', 'SVGRepo_iconCarrier');
  const g4 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g4.setAttribute('id', 'Group_65');
  g4.setAttribute('data-name', 'Group 65');
  g4.setAttribute('transform', 'translate(-831.568 -384.448)');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('id', 'Path_57');
  path.setAttribute('data-name', 'Path 57');
  path.setAttribute(
    'd',
    'M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z',
  );
  path.setAttribute('fill', '#030408');
  g4.appendChild(path);
  g3.appendChild(g4);
  svg.appendChild(g3);

  return svg;
}

function createSearchIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 21 21');
  svg.setAttribute('fill', 'none');
  svg.classList.add('lens');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    'M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z',
  );
  path.setAttribute('stroke-width', '0.25');
  svg.appendChild(path);
  return svg;
}

function createCloseIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 50 50');
  svg.classList.add('close');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    'M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z',
  );
  svg.appendChild(path);
  return svg;
}

function createMailIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('version', '1.1');
  svg.setAttribute('id', 'Layer_1');
  svg.setAttribute('x', '0px');
  svg.setAttribute('y', '0px');
  svg.setAttribute('viewBox', '0 0 48 38.4');
  svg.setAttribute('xml:space', 'preserve');
  svg.setAttribute('width', '21');
  svg.setAttribute('height', '21');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    'M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1\n                              C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7\n                              L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z',
  );
  svg.appendChild(path);
  return svg;
}

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
        const svgIcon = createSvgIcon();
        trigger.parentNode.insertBefore(svgIcon, trigger.nextSibling);

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

export default async function decorate(block) {
  const children = [...block.children];

  const [
    primaryLogoRow,
    primaryLogoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    ...itemRows
  ] = children;

  const navigationItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('ul'));
  const iconLinkItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('picture'));

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // Add classes from original HTML, exclude 'nav-up'

  const container = document.createElement('div');
  container.classList.add('container');
  header.appendChild(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.appendChild(wrap);

  // Primary Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const primaryLogoLink = document.createElement('a');
  primaryLogoLink.href = primaryLogoLinkRow.querySelector('a')?.href || '#';
  const primaryPicture = primaryLogoRow.querySelector('picture');
  if (primaryPicture) {
    const primaryImg = primaryPicture.querySelector('img');
    const optimizedPrimaryPic = createOptimizedPicture(
      primaryImg.src,
      primaryImg.alt,
      false,
      [{ width: '200' }],
    );
    moveInstrumentation(primaryLogoRow, optimizedPrimaryPic.querySelector('img'));
    primaryLogoLink.appendChild(optimizedPrimaryPic);
  }
  moveInstrumentation(primaryLogoLinkRow, primaryLogoLink);
  logoDiv.appendChild(primaryLogoLink);
  wrap.appendChild(logoDiv);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.appendChild(document.createElement('li'));
  }
  hamburger.appendChild(hamburgerUl);
  wrap.appendChild(hamburger);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.appendChild(navUl);
  wrap.appendChild(nav);

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children]; // Fixed schema, use destructuring
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell?.textContent.trim() || '';
    anchor.setAttribute('itemprop', 'url');
    moveInstrumentation(row, anchor);
    li.appendChild(anchor);

    const hierarchyTempDiv = document.createElement('div');
    moveInstrumentation(hierarchyCell, hierarchyTempDiv);
    hierarchyTempDiv.innerHTML = hierarchyCell.innerHTML; // Read richtext with innerHTML
    const hierarchyRoot = hierarchyTempDiv.querySelector('ul');

    if (hierarchyRoot) {
      const svgIcon = createSvgIcon();
      li.appendChild(svgIcon);

      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');
      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');

      // Apply classes to nested elements from ORIGINAL HTML
      hierarchyRoot.querySelectorAll('li').forEach(item => {
        item.classList.add('top-level-li'); // Example class from original HTML
        const innerUl = item.querySelector('ul');
        if (innerUl) {
          item.classList.add('first-level-li'); // Example class from original HTML
          const innerSubChildDiv = document.createElement('div');
          innerSubChildDiv.classList.add('has-inner-sub-child'); // Example class from original HTML
          innerSubChildDiv.appendChild(innerUl);
          item.appendChild(innerSubChildDiv);
        }
      });

      subNavWrap.appendChild(hierarchyRoot);
      centerDiv.appendChild(subNavWrap);
      megaMenuWrap.appendChild(centerDiv);
      megaMenu.appendChild(megaMenuWrap);
      li.appendChild(megaMenu);

      transformNestedLists(hierarchyRoot);

      // Toggle mega-menu on click
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        megaMenu.classList.toggle('active');
      });
      svgIcon.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        megaMenu.classList.toggle('active');
      });
    }
    navUl.appendChild(li);
  });

  // Icon Links (mobile-menus-icon)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.appendChild(mobileIconUl);
  navUl.appendChild(mobileIconNav);

  const contactUsLiMobile = document.createElement('li');
  contactUsLiMobile.classList.add('mail');
  const contactUsLinkMobile = document.createElement('a');
  contactUsLinkMobile.href = 'https://www.mahindra.com/contact-us';
  contactUsLinkMobile.textContent = 'Contact Us';
  mobileIconUl.appendChild(contactUsLiMobile);

  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  const searchLinkMobile = document.createElement('a');
  searchLinkMobile.href = '#';
  searchLinkMobile.appendChild(createSearchIcon());
  searchLinkMobile.appendChild(createCloseIcon());
  const searchSpanMobile = document.createElement('span');
  searchSpanMobile.textContent = ' Search';
  searchLinkMobile.appendChild(searchSpanMobile);
  searchLiMobile.appendChild(searchLinkMobile);
  mobileIconUl.appendChild(searchLiMobile);

  // Icon Links (desktop-menus-icon)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.appendChild(desktopIconUl);
  nav.appendChild(desktopIconNav); // Append to nav, not navUl

  const contactUsLiDesktop = document.createElement('li');
  contactUsLiDesktop.classList.add('mail');
  const contactUsLinkDesktop = document.createElement('a');
  contactUsLinkDesktop.href = 'https://www.mahindra.com/contact-us';
  contactUsLinkDesktop.appendChild(createMailIcon());
  contactUsLiDesktop.appendChild(contactUsLinkDesktop);
  desktopIconUl.appendChild(contactUsLiDesktop);

  const searchLiDesktop = document.createElement('li');
  searchLiDesktop.classList.add('search');
  const searchLinkDesktop = document.createElement('a');
  searchLinkDesktop.href = '#';
  searchLinkDesktop.appendChild(createSearchIcon());
  searchLinkDesktop.appendChild(createCloseIcon());
  searchLiDesktop.appendChild(searchLinkDesktop);
  desktopIconUl.appendChild(searchLiDesktop);

  iconLinkItems.forEach((row) => {
    const [iconCell, linkCell, labelCell] = [...row.children]; // Fixed schema, use destructuring
    const li = document.createElement('li');
    li.classList.add('icon-item');

    const link = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) link.href = foundLink.href;
    link.textContent = labelCell?.textContent.trim() || '';

    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
      moveInstrumentation(iconCell, optimizedPic.querySelector('img'));
      link.prepend(optimizedPic);
    }
    moveInstrumentation(row, link);
    li.appendChild(link);
    // As per original HTML, these icon links are not directly added to the main navigation structure.
    // They are part of the mobile and desktop utility navs, which are hardcoded above.
    // If they were to be dynamically added, they would be appended to desktopIconUl or mobileIconUl.
    // For now, leaving this loop as is, assuming it's for future expansion or a different part of the header.
  });

  // Anniversary Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const anniversaryLogoLink = document.createElement('a');
  anniversaryLogoLink.href = anniversaryLogoLinkRow.querySelector('a')?.href || '#';
  const anniversaryPicture = anniversaryLogoRow.querySelector('picture');
  if (anniversaryPicture) {
    const anniversaryImg = anniversaryPicture.querySelector('img');
    const optimizedAnniversaryPic = createOptimizedPicture(
      anniversaryImg.src,
      anniversaryImg.alt,
      false,
      [{ width: '74' }],
    );
    moveInstrumentation(anniversaryLogoRow, optimizedAnniversaryPic.querySelector('img'));
    anniversaryLogoLink.appendChild(optimizedAnniversaryPic);
  }
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoLink);
  year80LogoDiv.appendChild(anniversaryLogoLink);
  wrap.appendChild(year80LogoDiv);

  // Search screen wrap and functionality
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  const searchWrapInner = document.createElement('div');
  searchWrapInner.classList.add('wrap');
  searchScreenWrap.appendChild(searchWrapInner);

  const searchForm = document.createElement('form');
  searchForm.setAttribute('action', 'https://www.mahindra.com/search');
  searchForm.setAttribute('method', 'get');
  searchForm.setAttribute('id', 'search-block-form');
  searchForm.setAttribute('accept-charset', 'UTF-8');
  searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
  searchWrapInner.appendChild(searchForm);

  const searchInputWrap = document.createElement('div');
  searchInputWrap.classList.add('search-wrap');
  searchForm.appendChild(searchInputWrap);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('search-icon');
  searchIconDiv.appendChild(createSearchIcon());
  searchInputWrap.appendChild(searchIconDiv);

  const searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'text');
  searchInput.classList.add('input-text', 'searchtext');
  searchInput.setAttribute('required', '');
  searchInput.setAttribute('name', 'key');
  searchInput.setAttribute('id', 'searchInput');
  searchInput.setAttribute('autocomplete', 'off');
  searchInputWrap.appendChild(searchInput);

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  const submitLabel = document.createElement('div');
  submitLabel.classList.add('label');
  submitLabel.textContent = ' Submit ';
  submitButton.appendChild(submitLabel);
  const submitSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  submitSvg.setAttribute('width', '12');
  submitSvg.setAttribute('height', '8');
  submitSvg.setAttribute('viewBox', '0 0 12 8');
  submitSvg.setAttribute('fill', 'none');
  const submitPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  submitPath.setAttribute(
    'd',
    'M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z',
  );
  submitSvg.appendChild(submitPath);
  submitButton.appendChild(submitSvg);
  searchInputWrap.appendChild(submitButton);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none'; // Initially hidden
  searchForm.appendChild(searchResultBox);

  // Swiper initialization for search results
  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'scrollSwiper');
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  const swiperSlide = document.createElement('div');
  swiperSlide.classList.add('swiper-slide');
  swiperWrapper.appendChild(swiperSlide);
  swiperContainer.appendChild(swiperWrapper);
  searchResultBox.appendChild(swiperContainer);

  const swiperScrollbar = document.createElement('div');
  swiperScrollbar.classList.add('swiper-scrollbar');
  searchResultBox.appendChild(swiperScrollbar);

  // Add search suggestions (simplified, as content is hardcoded in original)
  const popularKeywords = ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'];
  const recommendedKeywords = [
    'Annual Report 2021 - 2022',
    'Leadership Announcement',
    'Latest Press Release',
    'Brand Guidelines',
  ];

  function createSuggestionsWrap(label, keywords) {
    const suggestionsWrap = document.createElement('div');
    suggestionsWrap.classList.add('search-suggestions-wrap');
    const labelDiv = document.createElement('div');
    labelDiv.classList.add('label');
    labelDiv.textContent = label;
    suggestionsWrap.appendChild(labelDiv);
    const tokensWrap = document.createElement('div');
    tokensWrap.classList.add('tokens-wrap');
    const ul = document.createElement('ul');
    keywords.forEach((keyword) => {
      const li = document.createElement('li');
      li.textContent = keyword;
      ul.appendChild(li);
    });
    tokensWrap.appendChild(ul);
    suggestionsWrap.appendChild(tokensWrap);
    return suggestionsWrap;
  }

  searchWrapInner.appendChild(createSuggestionsWrap('Popular Keywords:', popularKeywords));
  searchWrapInner.appendChild(createSuggestionsWrap('Recommended for you:', recommendedKeywords));

  // Toggle search screen
  const searchTriggers = [searchLinkMobile, searchLinkDesktop];
  searchTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchScreenWrap.classList.toggle('active');
      block.classList.toggle('search-active');
    });
  });

  // Append search screen wrap to the header
  header.appendChild(searchScreenWrap);

  // Hamburger menu toggle
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    block.classList.toggle('menu-open');
  });

  block.replaceChildren(header);

  // Swiper initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(swiperContainer, {
    slidesPerView: 'auto',
    loop: false, // Original HTML doesn't specify loop, default to false
    scrollbar: {
      el: swiperScrollbar,
      hide: true,
    },
  });
}
