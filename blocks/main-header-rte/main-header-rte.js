import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    contactIconMobileRow,
    contactLinkMobileRow,
    contactIconDesktopRow,
    contactLinkDesktopRow,
    searchIcon1Row,
    searchIcon2Row,
    searchIconInputRow,
    searchButtonIconRow,
    popularKeywordsContainerRow, // This is the container row for popular keywords
    recommendedKeywordsContainerRow, // This is the container row for recommended keywords
    navigationHierarchyRow,
  ] = [...block.children];

  // Extract popular and recommended keywords from their respective container rows
  const popularKeywords = [...popularKeywordsContainerRow.children].map(cell => cell.textContent.trim());
  const recommendedKeywords = [...recommendedKeywordsContainerRow.children].map(cell => cell.textContent.trim());

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  header.append(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  logoLink.href = logoLinkRow?.querySelector('a')?.href || '#';
  const logoPicture = logoRow?.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    const optimizedLogoPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '200' }]);
    moveInstrumentation(logoImg, optimizedLogoPic.querySelector('img'));
    optimizedLogoPic.querySelector('img').classList.add('hiddenlogo1');
    optimizedLogoPic.querySelector('img').width = '200';
    optimizedLogoPic.querySelector('img').height = '30'; // Set a default height
    optimizedLogoPic.querySelector('img').style.width = 'auto';
    logoLink.append(optimizedLogoPic);
  }
  logoDiv.append(logoLink);
  wrapDiv.append(logoDiv);

  // Hamburger
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.setAttribute('data-once', 'hamburger-click nav-close-search');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburgerDiv.append(hamburgerUl);
  wrapDiv.append(hamburgerDiv);

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  wrapDiv.append(nav);

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);

  function parseNavTree(ul) {
    return [...ul.querySelectorAll(':scope > li')].map((li) => {
      let label = '';
      let link = null;
      for (const node of li.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          label += node.textContent.trim();
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'A') {
            link = node;
            label += node.textContent.trim();
          } else if (node.tagName !== 'UL') { // Skip <ul> children when extracting label text
            label += node.textContent.trim();
          }
        }
      }
      label = label.trim();

      const childUl = li.querySelector(':scope > ul');
      return { label, link, children: childUl ? parseNavTree(childUl) : [] };
    });
  }

  function renderNavItems(items, parentContainer) {
    items.forEach((item) => {
      const li = document.createElement('li');
      li.setAttribute('itemprop', 'name');
      li.setAttribute('data-once', 'nav-close-search');

      let itemContent;
      if (item.link) {
        const a = document.createElement('a');
        a.href = item.link.href;
        a.textContent = item.label;
        a.setAttribute('itemprop', 'url');
        itemContent = a;
      } else {
        const span = document.createElement('span');
        span.textContent = item.label;
        itemContent = span;
      }
      li.append(itemContent);

      if (item.children.length > 0) {
        li.classList.add('has-child', 'hover-red'); // Only add these classes if it has children
        const toggleSpan = document.createElement('span');
        const toggleImg = document.createElement('img');
        toggleImg.alt = 'svg file';
        toggleImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776196685801.svg+xml'; // Example SVG, adjust if needed
        toggleSpan.append(toggleImg);
        li.append(toggleSpan);

        const megaMenu = document.createElement('div');
        megaMenu.classList.add('mega-menu');
        const megaMenuWrap = document.createElement('div');
        megaMenuWrap.classList.add('wrap', 'container');
        const megaMenuCenter = document.createElement('div');
        megaMenuCenter.classList.add('center-div');

        const subNavWrap = document.createElement('div');
        subNavWrap.classList.add('sub-nav-wrap');
        const submenuUl = document.createElement('ul');
        renderNavItems(item.children, submenuUl); // RECURSIVE CALL
        subNavWrap.append(submenuUl);

        megaMenuCenter.append(subNavWrap);
        megaMenuWrap.append(megaMenuCenter);
        megaMenu.append(megaMenuWrap);
        li.append(megaMenu);

        // Add toggle behavior for the span containing the SVG
        toggleSpan.addEventListener('click', () => {
          li.classList.toggle('active'); // Example class for active state
          megaMenu.classList.toggle('show'); // Example class to show/hide
        });
      }

      parentContainer.append(li);
    });
  }

  const textCell = navigationHierarchyRow?.querySelector('div');
  const temp = document.createElement('div');
  temp.innerHTML = textCell?.innerHTML ?? '';
  const rootUl = temp.querySelector('ul');
  const navItems = rootUl ? parseNavTree(rootUl) : [];
  renderNavItems(navItems, navUl);

  // Mobile and Desktop Icons
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);

  const mobileMailLi = document.createElement('li');
  mobileMailLi.classList.add('mail');
  const mobileMailLink = document.createElement('a');
  mobileMailLink.href = contactLinkMobileRow?.querySelector('a')?.href || '#';
  mobileMailLink.textContent = 'Contact Us';
  mobileMailLi.append(mobileMailLink);
  mobileIconUl.append(mobileMailLi);

  const mobileSearchLi = document.createElement('li');
  mobileSearchLi.classList.add('search');
  mobileSearchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const mobileSearchLink = document.createElement('a');
  mobileSearchLink.href = '#';
  mobileSearchLink.setAttribute('data-once', 'search-stop-propagation');

  const mobileSearchImg1 = searchIcon1Row?.querySelector('img');
  if (mobileSearchImg1) {
    const optimizedSearchPic1 = createOptimizedPicture(mobileSearchImg1.src, mobileSearchImg1.alt, false, [{ width: '24' }]);
    moveInstrumentation(mobileSearchImg1, optimizedSearchPic1.querySelector('img'));
    mobileSearchLink.append(optimizedSearchPic1);
  }

  const mobileSearchImg2 = searchIcon2Row?.querySelector('img');
  if (mobileSearchImg2) {
    const optimizedSearchPic2 = createOptimizedPicture(mobileSearchImg2.src, mobileSearchImg2.alt, false, [{ width: '24' }]);
    moveInstrumentation(mobileSearchImg2, optimizedSearchPic2.querySelector('img'));
    mobileSearchLink.append(optimizedSearchPic2);
  }

  const mobileSearchSpan = document.createElement('span');
  mobileSearchSpan.setAttribute('data-once', 'search-stop-propagation');
  mobileSearchSpan.textContent = ' Search';
  mobileSearchLink.append(mobileSearchSpan);
  mobileSearchLi.append(mobileSearchLink);

  const searchScreenWrapMobile = createSearchScreen(
    searchIconInputRow,
    searchButtonIconRow,
    popularKeywords,
    recommendedKeywords,
  );
  mobileSearchLi.append(searchScreenWrapMobile);
  mobileIconUl.append(mobileSearchLi);
  navUl.append(mobileIconNav);

  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);

  const desktopMailLi = document.createElement('li');
  desktopMailLi.classList.add('mail');
  const desktopMailLink = document.createElement('a');
  desktopMailLink.href = contactLinkDesktopRow?.querySelector('a')?.href || '#';
  const desktopMailImg = contactIconDesktopRow?.querySelector('img');
  if (desktopMailImg) {
    const optimizedDesktopMailPic = createOptimizedPicture(desktopMailImg.src, desktopMailImg.alt, false, [{ width: '24' }]);
    moveInstrumentation(desktopMailImg, optimizedDesktopMailPic.querySelector('img'));
    desktopMailLink.append(optimizedDesktopMailPic);
  }
  desktopMailLi.append(desktopMailLink);
  desktopIconUl.append(desktopMailLi);

  const desktopSearchLi = document.createElement('li');
  desktopSearchLi.classList.add('search');
  desktopSearchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
  const desktopSearchLink = document.createElement('a');
  desktopSearchLink.href = '#';
  desktopSearchLink.setAttribute('data-once', 'search-stop-propagation');

  const desktopSearchImg1 = searchIcon1Row?.querySelector('img');
  if (desktopSearchImg1) {
    const optimizedDesktopSearchPic1 = createOptimizedPicture(desktopSearchImg1.src, desktopSearchImg1.alt, false, [{ width: '24' }]);
    moveInstrumentation(desktopSearchImg1, optimizedDesktopSearchPic1.querySelector('img'));
    desktopSearchLink.append(optimizedDesktopSearchPic1);
  }

  const desktopSearchImg2 = searchIcon2Row?.querySelector('img');
  if (desktopSearchImg2) {
    const optimizedDesktopSearchPic2 = createOptimizedPicture(desktopSearchImg2.src, desktopSearchImg2.alt, false, [{ width: '24' }]);
    moveInstrumentation(desktopSearchImg2, optimizedDesktopSearchPic2.querySelector('img'));
    desktopSearchLink.append(optimizedDesktopSearchPic2);
  }
  desktopSearchLi.append(desktopSearchLink);

  const searchScreenWrapDesktop = createSearchScreen(
    searchIconInputRow,
    searchButtonIconRow,
    popularKeywords,
    recommendedKeywords,
  );
  desktopSearchLi.append(searchScreenWrapDesktop);
  desktopIconUl.append(desktopSearchLi);
  nav.append(desktopIconNav);

  // Anniversary Logo
  const anniversaryLogoDiv = document.createElement('div');
  anniversaryLogoDiv.classList.add('logo', 'year-80-logo');
  const anniversaryLogoLink = document.createElement('a');
  anniversaryLogoLink.href = anniversaryLogoLinkRow?.querySelector('a')?.href || '#';
  const anniversaryLogoPicture = anniversaryLogoRow?.querySelector('picture');
  if (anniversaryLogoPicture) {
    const anniversaryLogoImg = anniversaryLogoPicture.querySelector('img');
    const optimizedAnniversaryPic = createOptimizedPicture(anniversaryLogoImg.src, anniversaryLogoImg.alt, false, [{ width: '74' }]);
    moveInstrumentation(anniversaryLogoImg, optimizedAnniversaryPic.querySelector('img'));
    optimizedAnniversaryPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    optimizedAnniversaryPic.querySelector('img').width = '74';
    optimizedAnniversaryPic.querySelector('img').height = '60';
    anniversaryLogoLink.append(optimizedAnniversaryPic);
  }
  anniversaryLogoDiv.append(anniversaryLogoLink);
  wrapDiv.append(anniversaryLogoDiv);

  // Add event listeners for search toggles
  const searchToggles = header.querySelectorAll('.search > a');
  searchToggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevent immediate closing from document click
      const searchScreen = toggle.nextElementSibling;
      if (searchScreen) {
        searchScreen.classList.toggle('show'); // Use 'show' class for visibility
      }
    });
  });

  // Close search when clicking outside
  document.addEventListener('click', (e) => {
    header.querySelectorAll('.search-screen-wrap').forEach((screen) => {
      if (!screen.contains(e.target) && !e.target.closest('.search > a')) {
        screen.classList.remove('show');
      }
    });
  });

  // Hamburger menu toggle
  hamburgerDiv.addEventListener('click', () => {
    nav.classList.toggle('active'); // Assuming 'active' class shows/hides the mobile nav
    hamburgerDiv.classList.toggle('active'); // Toggle hamburger icon state
    document.body.classList.toggle('no-scroll'); // Prevent scrolling when mobile nav is open
  });

  block.textContent = '';
  block.append(header);
}

function createSearchScreen(searchIconInputRow, searchButtonIconRow, popularKeywords, recommendedKeywords) {
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  wrap.setAttribute('data-once', 'search-stop-propagation');
  searchScreenWrap.append(wrap);

  const form = document.createElement('form');
  form.action = 'https://www.mahindra.com/search';
  form.method = 'get';
  form.id = 'search-block-form';
  form.setAttribute('accept-charset', 'UTF-8');
  form.setAttribute('data-drupal-form-fields', 'edit-keys');
  form.setAttribute('data-once', 'search-stop-propagation');
  wrap.append(form);

  const searchWrap = document.createElement('div');
  searchWrap.classList.add('search-wrap');
  searchWrap.setAttribute('data-once', 'search-stop-propagation');
  form.append(searchWrap);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('search-icon');
  searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
  const searchInputImg = searchIconInputRow?.querySelector('img');
  if (searchInputImg) {
    const optimizedSearchInputPic = createOptimizedPicture(searchInputImg.src, searchInputImg.alt, false, [{ width: '24' }]);
    moveInstrumentation(searchInputImg, optimizedSearchInputPic.querySelector('img'));
    searchIconDiv.append(optimizedSearchInputPic);
  }
  searchWrap.append(searchIconDiv);

  const inputText = document.createElement('input');
  inputText.type = 'text';
  inputText.classList.add('input-text', 'searchtext');
  inputText.required = true;
  inputText.name = 'key';
  inputText.id = 'searchInput';
  inputText.autocomplete = 'off';
  inputText.setAttribute('data-once', 'search-stop-propagation');
  searchWrap.append(inputText);

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.classList.add('submit-button');
  submitButton.setAttribute('data-once', 'search-stop-propagation');
  searchWrap.append(submitButton);

  const submitLabel = document.createElement('div');
  submitLabel.classList.add('label');
  submitLabel.setAttribute('data-once', 'search-stop-propagation');
  submitLabel.textContent = ' Submit ';
  submitButton.append(submitLabel);

  const searchButtonImg = searchButtonIconRow?.querySelector('img');
  if (searchButtonImg) {
    const optimizedSearchButtonPic = createOptimizedPicture(searchButtonImg.src, searchButtonImg.alt, false, [{ width: '24' }]);
    moveInstrumentation(searchButtonImg, optimizedSearchButtonPic.querySelector('img'));
    submitButton.append(optimizedSearchButtonPic);
  }

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none';
  searchResultBox.setAttribute('data-once', 'search-stop-propagation');
  form.append(searchResultBox);

  // Swiper structure (empty for now, as dynamic content)
  const swiperDiv = document.createElement('div');
  swiperDiv.classList.add('swiper', 'scrollSwiper');
  swiperDiv.setAttribute('data-once', 'search-stop-propagation');
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('data-once', 'search-stop-propagation');
  const swiperSlide = document.createElement('div');
  swiperSlide.classList.add('swiper-slide');
  swiperSlide.setAttribute('data-once', 'search-stop-propagation');
  swiperWrapper.append(swiperSlide);
  swiperDiv.append(swiperWrapper);
  searchResultBox.append(swiperDiv);

  const swiperScrollbar = document.createElement('div');
  swiperScrollbar.classList.add('swiper-scrollbar');
  swiperScrollbar.setAttribute('data-once', 'search-stop-propagation');
  searchResultBox.append(swiperScrollbar);

  // Popular Keywords
  if (popularKeywords.length > 0) {
    const popularKeywordsWrap = document.createElement('div');
    popularKeywordsWrap.classList.add('search-suggestions-wrap');
    popularKeywordsWrap.setAttribute('data-once', 'search-stop-propagation');
    const popularLabel = document.createElement('div');
    popularLabel.classList.add('label');
    popularLabel.setAttribute('data-once', 'search-stop-propagation');
    popularLabel.textContent = 'Popular Keywords:';
    popularKeywordsWrap.append(popularLabel);
    const popularTokensWrap = document.createElement('div');
    popularTokensWrap.classList.add('tokens-wrap');
    popularTokensWrap.setAttribute('data-once', 'search-stop-propagation');
    const popularUl = document.createElement('ul');
    popularUl.setAttribute('data-once', 'search-stop-propagation');
    popularKeywords.forEach((keyword) => {
      const li = document.createElement('li');
      li.setAttribute('data-once', 'search-stop-propagation');
      li.textContent = keyword;
      popularUl.append(li);
    });
    popularTokensWrap.append(popularUl);
    popularKeywordsWrap.append(popularTokensWrap);
    wrap.append(popularKeywordsWrap);
  }

  // Recommended Keywords
  if (recommendedKeywords.length > 0) {
    const recommendedKeywordsWrap = document.createElement('div');
    recommendedKeywordsWrap.classList.add('search-suggestions-wrap');
    recommendedKeywordsWrap.setAttribute('data-once', 'search-stop-propagation');
    const recommendedLabel = document.createElement('div');
    recommendedLabel.classList.add('label');
    recommendedLabel.setAttribute('data-once', 'search-stop-propagation');
    recommendedLabel.textContent = 'Recommended for you:';
    recommendedKeywordsWrap.append(recommendedLabel);
    const recommendedTokensWrap = document.createElement('div');
    recommendedTokensWrap.classList.add('tokens-wrap');
    recommendedTokensWrap.setAttribute('data-once', 'search-stop-propagation');
    const recommendedUl = document.createElement('ul');
    recommendedUl.setAttribute('data-once', 'search-stop-propagation');
    recommendedKeywords.forEach((keyword) => {
      const li = document.createElement('li');
      li.setAttribute('data-once', 'search-stop-propagation');
      li.textContent = keyword;
      recommendedUl.append(li);
    });
    recommendedTokensWrap.append(recommendedUl);
    recommendedKeywordsWrap.append(recommendedTokensWrap);
    wrap.append(recommendedKeywordsWrap);
  }

  return searchScreenWrap;
}
