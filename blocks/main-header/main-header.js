import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  const logoContainer = document.createElement('div');
  logoContainer.classList.add('logo');
  wrap.append(logoContainer);

  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  hamburger.setAttribute('data-once', 'hamburger-click nav-close-search');
  const hamburgerUl = document.createElement('ul');
  hamburger.append(hamburgerUl);
  for (let i = 0; i < 3; i++) {
    hamburgerUl.append(document.createElement('li'));
  }
  wrap.append(hamburger);

  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrap.append(nav);

  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconNavUl = document.createElement('ul');
  mobileIconNav.append(mobileIconNavUl);
  // This append is incorrect based on original HTML, mobileIconNav is a child of navUl
  // navUl.append(mobileIconNav); // This line is removed as per original HTML structure

  const mobileContactLi = document.createElement('li');
  mobileContactLi.classList.add('mail');
  const mobileContactLink = document.createElement('a');
  mobileContactLink.href = 'https://www.mahindra.com/contact-us';
  mobileContactLink.textContent = 'Contact Us';
  mobileContactLi.append(mobileContactLink);
  mobileIconNavUl.append(mobileContactLi);

  const mobileSearchLi = document.createElement('li');
  mobileSearchLi.classList.add('search');
  mobileSearchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const mobileSearchLink = document.createElement('a');
  mobileSearchLink.href = '#';
  mobileSearchLink.setAttribute('data-once', 'search-stop-propagation');
  const mobileSearchImg1 = document.createElement('img');
  mobileSearchImg1.alt = 'svg file';
  mobileSearchImg1.src = '/content/dam/aemigrate/uploaded-folder/image/1775643016447.svg+xml';
  const mobileSearchImg2 = document.createElement('img');
  mobileSearchImg2.alt = 'svg file';
  mobileSearchImg2.src = '/content/dam/aemigrate/uploaded-folder/image/1775643016480.svg+xml';
  const mobileSearchSpan = document.createElement('span');
  mobileSearchSpan.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchSpan.textContent = ' Search';
  mobileSearchLink.append(mobileSearchImg1, mobileSearchImg2, mobileSearchSpan);
  mobileSearchLi.append(mobileSearchLink);

  const mobileSearchScreenWrap = document.createElement('div');
  mobileSearchScreenWrap.classList.add('search-screen-wrap');
  mobileSearchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchLi.append(mobileSearchScreenWrap);

  const mobileSearchWrapInner = document.createElement('div');
  mobileSearchWrapInner.classList.add('wrap');
  mobileSearchWrapInner.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchScreenWrap.append(mobileSearchWrapInner);

  const mobileSearchForm = document.createElement('form');
  mobileSearchForm.action = 'https://www.mahindra.com/search';
  mobileSearchForm.method = 'get';
  mobileSearchForm.id = 'search-block-form';
  mobileSearchForm.setAttribute('accept-charset', 'UTF-8');
  mobileSearchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
  mobileSearchForm.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchWrapInner.append(mobileSearchForm);

  const mobileSearchInputWrap = document.createElement('div');
  mobileSearchInputWrap.classList.add('search-wrap');
  mobileSearchInputWrap.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchForm.append(mobileSearchInputWrap);

  const mobileSearchIcon = document.createElement('div');
  mobileSearchIcon.classList.add('search-icon');
  mobileSearchIcon.setAttribute('data-once', 'search-stop-propagation');
  const mobileSearchIconImg = document.createElement('img');
  mobileSearchIconImg.alt = 'svg file';
  mobileSearchIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775643016510.svg+xml';
  mobileSearchIcon.append(mobileSearchIconImg);
  mobileSearchInputWrap.append(mobileSearchIcon);

  const mobileSearchInput = document.createElement('input');
  mobileSearchInput.type = 'text';
  mobileSearchInput.classList.add('input-text', 'searchtext');
  mobileSearchInput.required = true;
  mobileSearchInput.name = 'key';
  mobileSearchInput.id = 'searchInput';
  mobileSearchInput.autocomplete = 'off';
  mobileSearchInput.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchInputWrap.append(mobileSearchInput);

  const mobileSubmitButton = document.createElement('button');
  mobileSubmitButton.classList.add('submit-button');
  mobileSubmitButton.setAttribute('data-once', 'search-stop-propagation');
  const mobileSubmitLabel = document.createElement('div');
  mobileSubmitLabel.classList.add('label');
  mobileSubmitLabel.setAttribute('data-once', 'search-stop-propagation');
  mobileSubmitLabel.textContent = ' Submit ';
  const mobileSubmitImg = document.createElement('img');
  mobileSubmitImg.alt = 'svg file';
  mobileSubmitImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775643016540.svg+xml';
  mobileSubmitButton.append(mobileSubmitLabel, mobileSubmitImg);
  mobileSearchInputWrap.append(mobileSubmitButton);

  const mobileSearchResultBox = document.createElement('div');
  mobileSearchResultBox.classList.add('searchResultBox');
  mobileSearchResultBox.style.display = 'none';
  mobileSearchResultBox.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchForm.append(mobileSearchResultBox);

  const mobileSwiper = document.createElement('div');
  mobileSwiper.classList.add('swiper', 'scrollSwiper');
  mobileSwiper.setAttribute('data-once', 'search-stop-propagation');
  const mobileSwiperWrapper = document.createElement('div');
  mobileSwiperWrapper.classList.add('swiper-wrapper');
  mobileSwiperWrapper.setAttribute('data-once', 'search-stop-propagation');
  const mobileSwiperSlide = document.createElement('div');
  mobileSwiperSlide.classList.add('swiper-slide');
  mobileSwiperSlide.setAttribute('data-once', 'search-stop-propagation');
  mobileSwiperWrapper.append(mobileSwiperSlide);
  mobileSwiper.append(mobileSwiperWrapper);
  mobileSearchResultBox.append(mobileSwiper);

  const mobileSwiperScrollbar = document.createElement('div');
  mobileSwiperScrollbar.classList.add('swiper-scrollbar');
  mobileSwiperScrollbar.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchResultBox.append(mobileSwiperScrollbar);

  const mobileSearchSuggestionsWrap1 = document.createElement('div');
  mobileSearchSuggestionsWrap1.classList.add('search-suggestions-wrap');
  mobileSearchSuggestionsWrap1.setAttribute('data-once', 'search-stop-propagation');
  const mobileSearchSuggestionsLabel1 = document.createElement('div');
  mobileSearchSuggestionsLabel1.classList.add('label');
  mobileSearchSuggestionsLabel1.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchSuggestionsLabel1.textContent = 'Popular Keywords:';
  mobileSearchSuggestionsWrap1.append(mobileSearchSuggestionsLabel1);
  const mobileTokensWrap1 = document.createElement('div');
  mobileTokensWrap1.classList.add('tokens-wrap');
  mobileTokensWrap1.setAttribute('data-once', 'search-stop-propagation');
  const mobileTokensUl1 = document.createElement('ul');
  mobileTokensUl1.setAttribute('data-once', 'search-stop-propagation');
  ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'].forEach((text) => {
    const li = document.createElement('li');
    li.setAttribute('data-once', 'search-stop-propagation');
    li.textContent = text;
    mobileTokensUl1.append(li);
  });
  mobileTokensWrap1.append(mobileTokensUl1);
  mobileSearchSuggestionsWrap1.append(mobileTokensWrap1);
  mobileSearchWrapInner.append(mobileSearchSuggestionsWrap1);

  const mobileSearchSuggestionsWrap2 = document.createElement('div');
  mobileSearchSuggestionsWrap2.classList.add('search-suggestions-wrap');
  mobileSearchSuggestionsWrap2.setAttribute('data-once', 'search-stop-propagation');
  const mobileSearchSuggestionsLabel2 = document.createElement('div');
  mobileSearchSuggestionsLabel2.classList.add('label');
  mobileSearchSuggestionsLabel2.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchSuggestionsLabel2.textContent = 'Recommended for you:';
  mobileSearchSuggestionsWrap2.append(mobileSearchSuggestionsLabel2);
  const mobileTokensWrap2 = document.createElement('div');
  mobileTokensWrap2.classList.add('tokens-wrap');
  mobileTokensWrap2.setAttribute('data-once', 'search-stop-propagation');
  const mobileTokensUl2 = document.createElement('ul');
  mobileTokensUl2.setAttribute('data-once', 'search-stop-propagation');
  ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'].forEach((text) => {
    const li = document.createElement('li');
    li.setAttribute('data-once', 'search-stop-propagation');
    li.textContent = text;
    mobileTokensUl2.append(li);
  });
  mobileTokensWrap2.append(mobileTokensUl2);
  mobileSearchSuggestionsWrap2.append(mobileTokensWrap2);
  mobileSearchWrapInner.append(mobileSearchSuggestionsWrap2);
  mobileIconNavUl.append(mobileSearchLi);
  // Append mobileIconNav to navUl after all its children are added
  navUl.append(mobileIconNav);

  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconNavUl = document.createElement('ul');
  desktopIconNav.append(desktopIconNavUl);
  nav.append(desktopIconNav);

  const desktopContactLi = document.createElement('li');
  desktopContactLi.classList.add('mail');
  const desktopContactLink = document.createElement('a');
  desktopContactLink.href = 'https://www.mahindra.com/contact-us';
  const desktopContactImg = document.createElement('img');
  desktopContactImg.alt = 'svg file';
  desktopContactImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775643016576.svg+xml';
  desktopContactLink.append(desktopContactImg);
  desktopContactLi.append(desktopContactLink);
  desktopIconNavUl.append(desktopContactLi);

  const desktopSearchLi = document.createElement('li');
  desktopSearchLi.classList.add('search');
  desktopSearchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const desktopSearchLink = document.createElement('a');
  desktopSearchLink.href = '#';
  desktopSearchLink.setAttribute('data-once', 'search-stop-propagation');
  const desktopSearchImg1 = document.createElement('img');
  desktopSearchImg1.alt = 'svg file';
  desktopSearchImg1.src = '/content/dam/aemigrate/uploaded-folder/image/1775643016447.svg+xml';
  const desktopSearchImg2 = document.createElement('img');
  desktopSearchImg2.alt = 'svg file';
  desktopSearchImg2.src = '/content/dam/aemigrate/uploaded-folder/image/1775643016480.svg+xml';
  desktopSearchLink.append(desktopSearchImg1, desktopSearchImg2);
  desktopSearchLi.append(desktopSearchLink);

  const desktopSearchScreenWrap = document.createElement('div');
  desktopSearchScreenWrap.classList.add('search-screen-wrap');
  desktopSearchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchLi.append(desktopSearchScreenWrap);

  const desktopSearchWrapInner = document.createElement('div');
  desktopSearchWrapInner.classList.add('wrap');
  desktopSearchWrapInner.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchScreenWrap.append(desktopSearchWrapInner);

  const desktopSearchForm = document.createElement('form');
  desktopSearchForm.action = 'https://www.mahindra.com/search';
  desktopSearchForm.method = 'get';
  desktopSearchForm.id = 'search-block-form';
  desktopSearchForm.setAttribute('accept-charset', 'UTF-8');
  desktopSearchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
  desktopSearchForm.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchWrapInner.append(desktopSearchForm);

  const desktopSearchInputWrap = document.createElement('div');
  desktopSearchInputWrap.classList.add('search-wrap');
  desktopSearchInputWrap.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchForm.append(desktopSearchInputWrap);

  const desktopSearchIcon = document.createElement('div');
  desktopSearchIcon.classList.add('search-icon');
  desktopSearchIcon.setAttribute('data-once', 'search-stop-propagation');
  const desktopSearchIconImg = document.createElement('img');
  desktopSearchIconImg.alt = 'svg file';
  desktopSearchIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775643016510.svg+xml';
  desktopSearchIcon.append(desktopSearchIconImg);
  desktopSearchInputWrap.append(desktopSearchIcon);

  const desktopSearchInput = document.createElement('input');
  desktopSearchInput.type = 'text';
  desktopSearchInput.classList.add('input-text', 'searchtext');
  desktopSearchInput.required = true;
  desktopSearchInput.name = 'key';
  desktopSearchInput.id = 'searchInput';
  desktopSearchInput.autocomplete = 'off';
  desktopSearchInput.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchInputWrap.append(desktopSearchInput);

  const desktopSubmitButton = document.createElement('button');
  desktopSubmitButton.classList.add('submit-button');
  desktopSubmitButton.setAttribute('data-once', 'search-stop-propagation');
  const desktopSubmitLabel = document.createElement('div');
  desktopSubmitLabel.classList.add('label');
  desktopSubmitLabel.setAttribute('data-once', 'search-stop-propagation');
  desktopSubmitLabel.textContent = ' Submit ';
  const desktopSubmitImg = document.createElement('img');
  desktopSubmitImg.alt = 'svg file';
  desktopSubmitImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775643016540.svg+xml';
  desktopSubmitButton.append(desktopSubmitLabel, desktopSubmitImg);
  desktopSearchInputWrap.append(desktopSubmitButton);

  const desktopSearchResultBox = document.createElement('div');
  desktopSearchResultBox.classList.add('searchResultBox');
  desktopSearchResultBox.style.display = 'none';
  desktopSearchResultBox.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchForm.append(desktopSearchResultBox);

  const desktopSwiper = document.createElement('div');
  desktopSwiper.classList.add('swiper', 'scrollSwiper');
  desktopSwiper.setAttribute('data-once', 'search-stop-propagation');
  const desktopSwiperWrapper = document.createElement('div');
  desktopSwiperWrapper.classList.add('swiper-wrapper');
  desktopSwiperWrapper.setAttribute('data-once', 'search-stop-propagation');
  const desktopSwiperSlide = document.createElement('div');
  desktopSwiperSlide.classList.add('swiper-slide');
  desktopSwiperSlide.setAttribute('data-once', 'search-stop-propagation');
  desktopSwiperWrapper.append(desktopSwiperSlide);
  desktopSwiper.append(desktopSwiperWrapper);
  desktopSearchResultBox.append(desktopSwiper);

  const desktopSwiperScrollbar = document.createElement('div');
  desktopSwiperScrollbar.classList.add('swiper-scrollbar');
  desktopSwiperScrollbar.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchResultBox.append(desktopSwiperScrollbar);

  const desktopSearchSuggestionsWrap1 = document.createElement('div');
  desktopSearchSuggestionsWrap1.classList.add('search-suggestions-wrap');
  desktopSearchSuggestionsWrap1.setAttribute('data-once', 'search-stop-propagation');
  const desktopSearchSuggestionsLabel1 = document.createElement('div');
  desktopSearchSuggestionsLabel1.classList.add('label');
  desktopSearchSuggestionsLabel1.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchSuggestionsLabel1.textContent = 'Popular Keywords:';
  desktopSearchSuggestionsWrap1.append(desktopSearchSuggestionsLabel1);
  const desktopTokensWrap1 = document.createElement('div');
  desktopTokensWrap1.classList.add('tokens-wrap');
  desktopTokensWrap1.setAttribute('data-once', 'search-stop-propagation');
  const desktopTokensUl1 = document.createElement('ul');
  desktopTokensUl1.setAttribute('data-once', 'search-stop-propagation');
  ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'].forEach((text) => {
    const li = document.createElement('li');
    li.setAttribute('data-once', 'search-stop-propagation');
    li.textContent = text;
    desktopTokensUl1.append(li);
  });
  desktopTokensWrap1.append(desktopTokensUl1);
  desktopSearchSuggestionsWrap1.append(desktopTokensWrap1);
  desktopSearchWrapInner.append(desktopSearchSuggestionsWrap1);

  const desktopSearchSuggestionsWrap2 = document.createElement('div');
  desktopSearchSuggestionsWrap2.classList.add('search-suggestions-wrap');
  desktopSearchSuggestionsWrap2.setAttribute('data-once', 'search-stop-propagation');
  const desktopSearchSuggestionsLabel2 = document.createElement('div');
  desktopSearchSuggestionsLabel2.classList.add('label');
  desktopSearchSuggestionsLabel2.setAttribute('data-once', 'search-stop-propagation');
  desktopSearchSuggestionsLabel2.textContent = 'Recommended for you:';
  desktopSearchSuggestionsWrap2.append(desktopSearchSuggestionsLabel2);
  const desktopTokensWrap2 = document.createElement('div');
  desktopTokensWrap2.classList.add('tokens-wrap');
  desktopTokensWrap2.setAttribute('data-once', 'search-stop-propagation');
  const desktopTokensUl2 = document.createElement('ul');
  desktopTokensUl2.setAttribute('data-once', 'search-stop-propagation');
  ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'].forEach((text) => {
    const li = document.createElement('li');
    li.setAttribute('data-once', 'search-stop-propagation');
    li.textContent = text;
    desktopTokensUl2.append(li);
  });
  desktopTokensWrap2.append(desktopTokensUl2);
  desktopSearchSuggestionsWrap2.append(desktopTokensWrap2);
  desktopSearchWrapInner.append(desktopSearchSuggestionsWrap2);
  desktopIconNavUl.append(desktopSearchLi);

  const year80LogoContainer = document.createElement('div');
  year80LogoContainer.classList.add('logo', 'year-80-logo');
  wrap.append(year80LogoContainer);

  const menuItems = [];
  const logos = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    // Check for logo: a cell with a picture element
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    // Check for menu item: a cell with a link OR a text label, and no picture
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture') && cell.textContent.trim() !== '');

    if (imageCell && linkCell) { // This row is a logo
      logos.push(row);
    } else if (linkCell || labelCell) { // This row is a menu item
      menuItems.push(row);
    }
  });

  menuItems.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');

    const linkCell = row.querySelector('div:has(a)');
    const labelCell = row.querySelector('div:not(:has(a)):not(:has(picture))');

    if (linkCell) {
      const originalLink = linkCell.querySelector('a');
      const a = document.createElement('a');
      a.setAttribute('itemprop', 'url');
      if (originalLink) {
        a.href = originalLink.href;
        a.textContent = originalLink.textContent;
      }
      li.append(a);
    } else if (labelCell) {
      const a = document.createElement('a');
      a.setAttribute('itemprop', 'url');
      a.textContent = labelCell.textContent;
      li.append(a);
    }

    const span = document.createElement('span');
    const img = document.createElement('img');
    img.alt = 'svg file';
    img.src = '/content/dam/aemigrate/uploaded-folder/image/1775643016415.svg+xml';
    span.append(img);
    li.append(span);

    navUl.append(li);
  });

  logos.forEach((row) => {
    const linkCell = row.querySelector('div:has(a)');
    const imageCell = row.querySelector('div:has(picture)');

    if (imageCell && linkCell) {
      const originalLink = linkCell.querySelector('a');
      const originalPicture = imageCell.querySelector('picture');
      const originalImg = originalPicture ? originalPicture.querySelector('img') : null;

      if (originalLink && originalImg) {
        const a = document.createElement('a');
        a.href = originalLink.href;
        moveInstrumentation(row, a);

        const optimizedPic = createOptimizedPicture(originalImg.src, originalImg.alt, false, [{ width: '200' }]);
        optimizedPic.querySelector('img').classList.add('hiddenlogo1');
        moveInstrumentation(originalImg, optimizedPic.querySelector('img'));
        a.append(optimizedPic);
        logoContainer.append(a);
      }
    }
  });

  // Handle the 80-year logo separately as it's a static element in original HTML
  const year80Link = document.createElement('a');
  year80Link.href = 'https://www.mahindra.com/';
  const year80Img = document.createElement('img');
  year80Img.src = '/content/dam/aemigrate/uploaded-folder/image/80thyearlogo-gold-com.webp';
  year80Img.alt = '80th Year Logo Gold';
  year80Img.title = '80thYearLogo_Gold';
  year80Img.classList.add('hiddenlogo1', 'years-80');
  year80Img.setAttribute('loading', 'lazy');
  year80Link.append(year80Img);
  year80LogoContainer.append(year80Link);

  block.textContent = '';
  block.append(header);

  // Add event listeners for interactive elements
  const searchTriggers = block.querySelectorAll('.search > a');
  const searchScreenWraps = block.querySelectorAll('.search-screen-wrap');
  const hamburgerButton = block.querySelector('.hamburger');
  const mainNav = block.querySelector('.main-nav');

  searchTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const parentLi = trigger.closest('li.search');
      if (parentLi) {
        const searchScreenWrap = parentLi.querySelector('.search-screen-wrap');
        if (searchScreenWrap) {
          searchScreenWrap.classList.toggle('show');
        }
      }
    });
  });

  searchScreenWraps.forEach((wrapEl) => {
    wrapEl.addEventListener('click', (e) => {
      if (e.target === wrapEl) {
        wrapEl.classList.remove('show');
      }
    });
  });

  hamburgerButton.addEventListener('click', () => {
    mainNav.classList.toggle('show');
    hamburgerButton.classList.toggle('active');
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
