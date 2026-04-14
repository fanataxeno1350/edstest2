import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    year80LogoRow,
    year80LogoLinkRow,
    contactLinkRow,
    textRow,
    ...searchImageRows
  ] = [...block.children];

  // --- Logo ---
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  logoLink.href = logoLinkRow.querySelector('a')?.href || '#';
  moveInstrumentation(logoLinkRow, logoLink);
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  logoDiv.append(logoLink);

  // --- 80th Year Logo ---
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  year80LogoLink.href = year80LogoLinkRow.querySelector('a')?.href || '#';
  moveInstrumentation(year80LogoLinkRow, year80LogoLink);
  const year80LogoPicture = year80LogoRow.querySelector('picture');
  if (year80LogoPicture) {
    const img = year80LogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    year80LogoLink.append(optimizedPic);
  }
  year80LogoDiv.append(year80LogoLink);

  // --- Hamburger ---
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.setAttribute('data-once', 'hamburger-click nav-close-search');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburgerDiv.append(hamburgerUl);

  // --- Navigation Hierarchy (RTE) ---
  function parseNavTree(ul) {
    return [...ul.querySelectorAll(':scope > li')].map((li) => {
      let label = '';
      let linkHref = '#'; // Default placeholder
      for (const node of li.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          label += node.textContent.trim();
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
          label += node.textContent.trim();
          linkHref = node.href; // Capture the link if it exists
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'UL') {
          // Exclude ULs, but include other elements like <span> if they contain text
          label += node.textContent.trim();
        }
      }
      label = label.trim();

      const childUl = li.querySelector(':scope > ul');
      return { label, href: linkHref, children: childUl ? parseNavTree(childUl) : [] };
    });
  }

  function renderNavItems(items, parentContainer) {
    items.forEach((item) => {
      const li = document.createElement('li');
      li.classList.add('has-child', 'hover-red'); // Assuming all top-level items can be parents or styled as such
      li.setAttribute('itemprop', 'name');
      li.setAttribute('data-once', 'nav-close-search');

      const itemLink = document.createElement('a');
      itemLink.setAttribute('itemprop', 'url');
      itemLink.textContent = item.label;
      itemLink.href = item.href;

      if (item.children.length > 0) {
        const toggleSpan = document.createElement('span');
        const toggleImg = document.createElement('img');
        toggleImg.alt = 'svg file';
        toggleImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776196685801.svg+xml';
        toggleSpan.append(toggleImg);

        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        const megaMenuWrap = document.createElement('div');
        megaMenuWrap.classList.add('wrap', 'container');
        const centerDiv = document.createElement('div');
        centerDiv.classList.add('center-div');
        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap'); // Dynamic class based on content, e.g., about-us-sub-nav

        const childUl = document.createElement('ul');
        renderNavItems(item.children, childUl); // RECURSIVE CALL

        subNavWrap.append(childUl);
        centerDiv.append(subNavWrap);
        megaMenuWrap.append(centerDiv);
        megaMenu.append(megaMenuWrap);

        li.append(itemLink, toggleSpan, megaMenu);

        // Add event listener for toggle behavior
        itemLink.addEventListener('click', (e) => {
          e.preventDefault(); // Prevent default link navigation
          megaMenu.classList.toggle('show'); // Example class for showing/hiding
          li.classList.toggle('active'); // Example class for active state
        });
        toggleSpan.addEventListener('click', (e) => {
          e.preventDefault();
          megaMenu.classList.toggle('show');
          li.classList.toggle('active');
        });
      } else {
        // Leaf item: just the link
        li.append(itemLink);
      }
      parentContainer.append(li);
    });
  }

  const textCell = textRow?.querySelector('div');
  const temp = document.createElement('div');
  temp.innerHTML = textCell?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  const navItems = rootUl ? parseNavTree(rootUl) : [];

  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  renderNavItems(navItems, navUl); // Renders ALL nested levels
  nav.append(navUl);

  // --- Contact Link (mobile and desktop) ---
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileUl = document.createElement('ul');
  const mobileMailLi = document.createElement('li');
  mobileMailLi.classList.add('mail');
  const mobileContactLink = document.createElement('a');
  mobileContactLink.href = contactLinkRow.querySelector('a')?.href || '#';
  mobileContactLink.textContent = 'Contact Us';
  moveInstrumentation(contactLinkRow, mobileContactLink);
  mobileMailLi.append(mobileContactLink);
  mobileUl.append(mobileMailLi);
  mobileIconNav.append(mobileUl);
  // Append to main nav ul for consistent structure
  // The original HTML places this inside the main nav ul, but as a direct child of ul, not li.
  // We'll append it to the nav element itself, as a sibling to the main nav ul,
  // to better reflect the structure while keeping the main nav items separate.
  // If it MUST be inside the ul, it would need to be a li.
  // For now, placing it after the main nav ul.
  nav.append(mobileIconNav);

  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopUl = document.createElement('ul');
  const desktopMailLi = document.createElement('li');
  desktopMailLi.classList.add('mail');
  const desktopContactLink = document.createElement('a');
  desktopContactLink.href = contactLinkRow.querySelector('a')?.href || '#';
  const mailImg = document.createElement('img');
  mailImg.alt = 'svg file';
  mailImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776196686240.svg+xml';
  desktopContactLink.append(mailImg);
  moveInstrumentation(contactLinkRow, desktopContactLink);
  desktopMailLi.append(desktopContactLink);
  desktopUl.append(desktopMailLi);
  desktopIconNav.append(desktopUl);
  nav.append(desktopIconNav); // Append to nav element

  // --- Search Images (mobile and desktop) ---
  const mobileSearchLi = document.createElement('li');
  mobileSearchLi.classList.add('search');
  mobileSearchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const mobileSearchLink = document.createElement('a');
  mobileSearchLink.href = '#';
  mobileSearchLink.setAttribute('data-once', 'search-stop-propagation');
  const mobileSearchImg1 = document.createElement('img');
  mobileSearchImg1.alt = 'svg file';
  mobileSearchImg1.src = '/content/dam/aemigrate/uploaded-folder/image/1776196685935.svg+xml';
  const mobileSearchImg2 = document.createElement('img');
  mobileSearchImg2.alt = 'svg file';
  mobileSearchImg2.src = '/content/dam/aemigrate/uploaded-folder/image/1776196685983.svg+xml';
  const mobileSearchSpan = document.createElement('span');
  mobileSearchSpan.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchSpan.textContent = ' Search';
  mobileSearchLink.append(mobileSearchImg1, mobileSearchImg2, mobileSearchSpan);
  mobileSearchLi.append(mobileSearchLink);
  mobileUl.append(mobileSearchLi); // Append to the mobile icon nav ul

  const desktopSearchLi = document.createElement('li');
  desktopSearchLi.classList.add('search');
  desktopSearchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const desktopSearchLink = document.createElement('a');
  desktopSearchLink.href = '#';
  desktopSearchLink.setAttribute('data-once', 'search-stop-propagation');
  const desktopSearchImg1 = document.createElement('img');
  desktopSearchImg1.alt = 'svg file';
  desktopSearchImg1.src = '/content/dam/aemigrate/uploaded-folder/image/1776196685935.svg+xml';
  const desktopSearchImg2 = document.createElement('img');
  desktopSearchImg2.alt = 'svg file';
  desktopSearchImg2.src = '/content/dam/aemigrate/uploaded-folder/image/1776196685983.svg+xml';
  desktopSearchLink.append(desktopSearchImg1, desktopSearchImg2);
  desktopSearchLi.append(desktopSearchLink);
  desktopUl.append(desktopSearchLi); // Append to the desktop icon nav ul

  // --- Search Screen Wrap (shared structure) ---
  const createSearchScreen = () => {
    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
    const searchWrap = document.createElement('div');
    searchWrap.classList.add('wrap');
    searchWrap.setAttribute('data-once', 'search-stop-propagation');
    const searchForm = document.createElement('form');
    searchForm.action = 'https://www.mahindra.com/search';
    searchForm.method = 'get';
    searchForm.id = 'search-block-form';
    searchForm.setAttribute('accept-charset', 'UTF-8');
    searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
    searchForm.setAttribute('data-once', 'search-stop-propagation');

    const searchInputWrap = document.createElement('div');
    searchInputWrap.classList.add('search-wrap');
    searchInputWrap.setAttribute('data-once', 'search-stop-propagation');
    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
    const searchIconImg = document.createElement('img');
    searchIconImg.alt = 'svg file';
    searchIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776196686037.svg+xml';
    searchIconDiv.append(searchIconImg);
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext');
    searchInput.required = true;
    searchInput.name = 'key';
    searchInput.id = 'searchInput';
    searchInput.autocomplete = 'off';
    searchInput.setAttribute('data-once', 'search-stop-propagation');
    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    submitButton.setAttribute('data-once', 'search-stop-propagation');
    const submitLabel = document.createElement('div');
    submitLabel.classList.add('label');
    submitLabel.setAttribute('data-once', 'search-stop-propagation');
    submitLabel.textContent = ' Submit ';
    const submitImg = document.createElement('img');
    submitImg.alt = 'svg file';
    submitImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776196686179.svg+xml';
    submitButton.append(submitLabel, submitImg);
    searchInputWrap.append(searchIconDiv, searchInput, submitButton);
    searchForm.append(searchInputWrap);

    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.style.display = 'none';
    searchResultBox.setAttribute('data-once', 'search-stop-propagation');
    const swiper = document.createElement('div');
    swiper.classList.add('swiper', 'scrollSwiper');
    swiper.setAttribute('data-once', 'search-stop-propagation');
    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');
    swiperWrapper.setAttribute('data-once', 'search-stop-propagation');
    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    swiperSlide.setAttribute('data-once', 'search-stop-propagation');
    swiperWrapper.append(swiperSlide);
    swiper.append(swiperWrapper);
    const swiperScrollbar = document.createElement('div');
    swiperScrollbar.classList.add('swiper-scrollbar');
    swiperScrollbar.setAttribute('data-once', 'search-stop-propagation');
    searchResultBox.append(swiper, swiperScrollbar);
    searchForm.append(searchResultBox);

    const createSuggestions = (label, keywords) => {
      const suggestionsWrap = document.createElement('div');
      suggestionsWrap.classList.add('search-suggestions-wrap');
      suggestionsWrap.setAttribute('data-once', 'search-stop-propagation');
      const labelDiv = document.createElement('div');
      labelDiv.classList.add('label');
      labelDiv.setAttribute('data-once', 'search-stop-propagation');
      labelDiv.textContent = label;
      const tokensWrap = document.createElement('div');
      tokensWrap.classList.add('tokens-wrap');
      tokensWrap.setAttribute('data-once', 'search-stop-propagation');
      const tokensUl = document.createElement('ul');
      tokensUl.setAttribute('data-once', 'search-stop-propagation');
      keywords.forEach((keyword) => {
        const li = document.createElement('li');
        li.setAttribute('data-once', 'search-stop-propagation');
        li.textContent = keyword;
        tokensUl.append(li);
      });
      tokensWrap.append(tokensUl);
      suggestionsWrap.append(labelDiv, tokensWrap);
      return suggestionsWrap;
    };

    searchWrap.append(
      searchForm,
      createSuggestions('Popular Keywords:', ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali']),
      createSuggestions('Recommended for you:', ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines']),
    );
    searchScreenWrap.append(searchWrap);

    return searchScreenWrap;
  };

  const searchScreen = createSearchScreen();
  mobileSearchLi.append(searchScreen);
  // Clone for desktop, event listeners will be separate
  const desktopSearchScreen = createSearchScreen();
  desktopSearchLi.append(desktopSearchScreen);

  // Toggle search screen visibility
  const toggleSearch = (e, targetSearchScreen) => {
    e.preventDefault();
    e.stopPropagation(); // Stop propagation to prevent immediate closing from document click
    targetSearchScreen.classList.toggle('show');
  };

  mobileSearchLink.addEventListener('click', (e) => toggleSearch(e, searchScreen));
  desktopSearchLink.addEventListener('click', (e) => toggleSearch(e, desktopSearchScreen));

  // Close on outside click for both search screens
  document.addEventListener('click', (e) => {
    if (!searchScreen.contains(e.target) && searchScreen.classList.contains('show')) {
      searchScreen.classList.remove('show');
    }
    if (!desktopSearchScreen.contains(e.target) && desktopSearchScreen.classList.contains('show')) {
      desktopSearchScreen.classList.remove('show');
    }
  });

  // --- Main Header Container ---
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');

  wrapDiv.append(logoDiv, hamburgerDiv, nav, year80LogoDiv);
  containerDiv.append(wrapDiv);

  block.textContent = '';
  block.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  block.setAttribute('data-once', 'header-hover');
  block.append(containerDiv);

  // Optimize images in searchImageRows
  searchImageRows.forEach((row) => {
    const img = row.querySelector('picture > img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    }
  });

  // Optimize existing images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
