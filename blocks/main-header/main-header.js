import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    // Add classes from original HTML
    li.classList.add('top-level-li'); // Assuming top-level-li for direct children of rootUl based on HTML
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
      subWrap.classList.add('has-sub-child'); // Class from original HTML
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        // Add SVG icon for nested menu trigger
        const svgSpan = document.createElement('span');
        svgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
        li.append(svgSpan); // Append SVG to the li, next to the trigger

        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active'); // Class from original HTML
          subWrap.classList.toggle('active'); // Class from original HTML
        });
      }
      // Apply classes to nested <ul> and <li> elements
      nested.querySelectorAll('ul').forEach(ul => ul.classList.add('has-inner-sub-child')); // Class from original HTML
      nested.querySelectorAll('li').forEach(nestedLi => nestedLi.classList.add('first-level-li')); // Class from original HTML
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Use content detection for root fields instead of fixed indices
  const logoRow = children.find(row => row.querySelector('picture') && row.nextElementSibling?.querySelector('a'));
  const logoLinkRow = logoRow ? logoRow.nextElementSibling : null;

  const anniversaryLogoRow = children.find(row => row !== logoRow && row !== logoLinkRow && row.querySelector('picture') && row.nextElementSibling?.querySelector('a'));
  const anniversaryLogoLinkRow = anniversaryLogoRow ? anniversaryLogoRow.nextElementSibling : null;

  const itemRows = children.filter(row =>
    row !== logoRow && row !== logoLinkRow && row !== anniversaryLogoRow && row !== anniversaryLogoLinkRow
  );

  block.innerHTML = '';
  block.classList.add('with-marquee', 'solid'); // Add initial header classes

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  if (logoLinkRow) {
    const foundLogoLink = logoLinkRow.querySelector('a');
    if (foundLogoLink) {
      logoLink.href = foundLogoLink.href;
    }
  }
  if (logoRow) {
    const logoPicture = logoRow.querySelector('picture');
    if (logoPicture) {
      const img = logoPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
      logoLink.querySelector('img').classList.add('hiddenlogo1');
    }
    moveInstrumentation(logoRow, logoLink);
  }
  logoDiv.append(logoLink);
  wrap.append(logoDiv);

  // Hamburger menu
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburger.append(hamburgerUl);
  wrap.append(hamburger);

  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('itemscope', '');
  mainNav.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  wrap.append(mainNav);

  const navUl = document.createElement('ul');
  mainNav.append(navUl);

  const navigationItems = itemRows.filter((row) => row.children.length === 3);
  const iconLinkItems = itemRows.filter((row) => row.children.length === 1);
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4);

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const foundLink = linkCell?.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
      rootEl.setAttribute('itemprop', 'url');
    } else {
      rootEl = document.createElement('span'); // Use span for non-link labels
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl);
    li.appendChild(rootEl);

    const svgSpan = document.createElement('span');
    svgSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
    li.appendChild(svgSpan);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);
    megaMenu.append(megaMenuWrap);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    const leftDivHeading = document.createElement('h4');
    leftDivHeading.classList.add('left-div-heading');
    const headingLink = document.createElement('a');
    headingLink.textContent = labelCell?.textContent.trim() || '';
    leftDivHeading.append(headingLink);
    leftDiv.append(leftDivHeading);
    centerDiv.append(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    centerDiv.append(subNavWrap);

    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      // Create a temporary div to hold the hierarchy content and apply instrumentation
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv);

      // Apply classes to elements within the hierarchy-tree
      tempDiv.querySelectorAll('ul').forEach(ul => {
        // Add specific classes based on the original HTML structure
        if (ul.closest('.about-us-sub-nav')) { // Example: if it's within an "about-us" specific sub-nav
          ul.classList.add('about-us-sub-nav');
        } else if (ul.closest('.what-we-do')) {
          ul.classList.add('what-we-do');
        } else if (ul.closest('.element-block')) {
          ul.classList.add('element-block');
        } else if (ul.closest('.careers-div')) {
          ul.classList.add('careers-div');
        }
        // Add general classes if applicable
        ul.classList.add('sub-nav-wrap-one-link'); // Example, adjust based on actual HTML
      });
      tempDiv.querySelectorAll('li').forEach(liItem => {
        liItem.classList.add('top-level-li'); // General class for list items
        if (liItem.querySelector('ul')) {
          liItem.classList.add('has-child'); // If it has nested UL
        }
      });
      tempDiv.querySelectorAll('a').forEach(a => {
        // Add any specific classes for anchors if needed
      });

      // Move children from tempDiv to subNavWrap
      while (tempDiv.firstChild) {
        subNavWrap.append(tempDiv.firstChild);
      }
      transformNestedLists(subNavWrap.querySelector('ul')); // Start transformation from the first UL
    }

    li.appendChild(megaMenu);
    navUl.append(li);

    // Toggle mega menu on click for rootEl
    rootEl.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      li.classList.toggle('active');
      megaMenu.classList.toggle('active');
    });
  });

  // Icon Nav (mobile)
  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileUl = document.createElement('ul');
  iconNavMobile.append(mobileUl);
  navUl.append(iconNavMobile);

  const mailLiMobile = document.createElement('li');
  mailLiMobile.classList.add('mail');
  const mailLinkMobile = document.createElement('a');
  mailLinkMobile.href = 'https://www.mahindra.com/contact-us';
  mailLinkMobile.textContent = 'Contact Us';
  mailLiMobile.append(mailLinkMobile);
  mobileUl.append(mailLiMobile);

  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  const searchLinkMobile = document.createElement('a');
  searchLinkMobile.href = '#';
  searchLinkMobile.innerHTML = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg><svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg><span> Search</span>';
  searchLiMobile.append(searchLinkMobile);
  mobileUl.append(searchLiMobile);

  // Icon Nav (desktop)
  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopUl = document.createElement('ul');
  iconNavDesktop.append(desktopUl);
  mainNav.append(iconNavDesktop);

  const mailLiDesktop = document.createElement('li');
  mailLiDesktop.classList.add('mail');
  const mailLinkDesktop = document.createElement('a');
  mailLinkDesktop.href = 'https://www.mahindra.com/contact-us';
  mailLinkDesktop.innerHTML = '<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path></svg>';
  mailLiDesktop.append(mailLinkDesktop);
  desktopUl.append(mailLiDesktop);

  const searchLiDesktop = document.createElement('li');
  searchLiDesktop.classList.add('search');
  const searchLinkDesktop = document.createElement('a');
  searchLinkDesktop.href = '#';
  searchLinkDesktop.innerHTML = '<svg viewBox="0 0 21 21" fill="none" class="lens"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg><svg viewBox="0 0 50 50" class="close"><path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path></svg>';
  searchLiDesktop.append(searchLinkDesktop);
  desktopUl.append(searchLiDesktop);

  // Search screen wrap (common for mobile and desktop)
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  const searchWrapContent = document.createElement('div');
  searchWrapContent.classList.add('wrap');
  searchScreenWrap.append(searchWrapContent);

  const searchForm = document.createElement('form');
  searchForm.action = 'https://www.mahindra.com/search';
  searchForm.method = 'get';
  searchForm.id = 'search-block-form';
  searchForm.setAttribute('accept-charset', 'UTF-8');
  searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
  searchWrapContent.append(searchForm);

  const searchInputWrap = document.createElement('div');
  searchInputWrap.classList.add('search-wrap');
  searchForm.append(searchInputWrap);

  const searchIcon = document.createElement('div');
  searchIcon.classList.add('search-icon');
  searchIcon.innerHTML = '<svg viewBox="0 0 21 21" fill="none"><path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path></svg>';
  searchInputWrap.append(searchIcon);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.classList.add('input-text', 'searchtext');
  searchInput.required = true;
  searchInput.name = 'key';
  searchInput.id = 'searchInput';
  searchInput.autocomplete = 'off';
  searchInputWrap.append(searchInput);

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  submitButton.innerHTML = '<div class="label"> Submit </div><svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path></svg>';
  searchInputWrap.append(submitButton);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none';
  searchResultBox.innerHTML = '<div class="swiper scrollSwiper"><div class="swiper-wrapper"><div class="swiper-slide"></div></div></div><div class="swiper-scrollbar"></div>';
  searchForm.append(searchResultBox);

  const popularKeywords = document.createElement('div');
  popularKeywords.classList.add('search-suggestions-wrap');
  popularKeywords.innerHTML = '<div class="label">Popular Keywords:</div><div class="tokens-wrap"><ul><li>Business</li><li>FY 21</li><li>Brands</li><li>XUV700</li><li>Global</li><li>Nanhi Kali</li></ul></div>';
  searchWrapContent.append(popularKeywords);

  const recommendedForYou = document.createElement('div');
  recommendedForYou.classList.add('search-suggestions-wrap');
  recommendedForYou.innerHTML = '<div class="label">Recommended for you:</div><div class="tokens-wrap"><ul><li>Annual Report 2021 - 2022</li><li>Leadership Announcement</li><li>Latest Press Release</li><li>Brand Guidelines</li></ul></div>';
  searchWrapContent.append(recommendedForYou);

  // Append search screen wrap to both mobile and desktop search links
  searchLiMobile.append(searchScreenWrap.cloneNode(true));
  searchLiDesktop.append(searchScreenWrap);

  // Anniversary Logo (year-80-logo)
  const anniversaryLogoDiv = document.createElement('div');
  anniversaryLogoDiv.classList.add('logo', 'year-80-logo');
  const anniversaryLogoLink = document.createElement('a');
  if (anniversaryLogoLinkRow) {
    const foundAnniversaryLogoLink = anniversaryLogoLinkRow.querySelector('a');
    if (foundAnniversaryLogoLink) {
      anniversaryLogoLink.href = foundAnniversaryLogoLink.href;
    }
  }
  if (anniversaryLogoRow) {
    const anniversaryLogoPicture = anniversaryLogoRow.querySelector('picture');
    if (anniversaryLogoPicture) {
      const img = anniversaryLogoPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      anniversaryLogoLink.append(optimizedPic);
      anniversaryLogoLink.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    }
    moveInstrumentation(anniversaryLogoRow, anniversaryLogoLink);
  }
  anniversaryLogoDiv.append(anniversaryLogoLink);
  wrap.append(anniversaryLogoDiv);

  // Event listeners for hamburger and search
  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburger.classList.toggle('active');
    block.classList.toggle('active');
  });

  const searchTriggers = block.querySelectorAll('.search > a');
  searchTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const searchScreen = trigger.nextElementSibling;
      searchScreen.classList.toggle('active');
      trigger.closest('.search').classList.toggle('active');
      block.classList.toggle('search-active');
    });
  });

  block.querySelectorAll('.search-screen-wrap').forEach((screen) => {
    screen.addEventListener('click', (e) => {
      if (e.target === screen) {
        screen.classList.remove('active');
        screen.closest('.search').classList.remove('active');
        block.classList.remove('search-active');
      }
    });
  });

  // Press Releases (if any) - to be integrated into Newsroom mega-menu
  const newsroomLi = navUl.querySelector('li.has-child a[href*="newsroom"]')?.closest('li');
  if (newsroomLi && pressReleaseItems.length > 0) {
    const newsroomMegaMenu = newsroomLi.querySelector('.mega-menu');
    // Assuming there's a specific class for the newsroom left div in the original HTML
    // If not, we might need to create it or find a generic one.
    // For now, let's assume 'left-div' is generic and we need to add 'newsroom-left-div' if it's not there.
    let newsroomLeftDiv = newsroomMegaMenu.querySelector('.left-div');
    if (newsroomLeftDiv && !newsroomLeftDiv.classList.contains('newsroom-left-div')) {
      newsroomLeftDiv.classList.add('newsroom-left-div');
    } else if (!newsroomLeftDiv) {
      // If left-div doesn't exist, create it
      const centerDiv = newsroomMegaMenu.querySelector('.center-div');
      if (centerDiv) {
        newsroomLeftDiv = document.createElement('div');
        newsroomLeftDiv.classList.add('left-div', 'newsroom-left-div');
        centerDiv.prepend(newsroomLeftDiv); // Add to the beginning of centerDiv
        const leftDivHeading = document.createElement('h4');
        leftDivHeading.classList.add('left-div-heading');
        const headingLink = document.createElement('a');
        headingLink.textContent = 'Newsroom'; // Default text, can be made dynamic
        leftDivHeading.append(headingLink);
        newsroomLeftDiv.append(leftDivHeading);
      }
    }

    if (newsroomLeftDiv) {
      const latestTwoPressRelease = document.createElement('div');
      latestTwoPressRelease.classList.add('latest-two-press-release');
      pressReleaseItems.slice(0, 2).forEach((row) => {
        const [linkCell, titleCell, dateCell, categoryCell] = [...row.children];
        const slide = document.createElement('div');
        slide.classList.add('slides');
        const slideWrap = document.createElement('div');
        slideWrap.classList.add('wrap');
        const content = document.createElement('div');
        content.classList.add('content');
        const desc = document.createElement('div');
        desc.classList.add('desc');

        const p = document.createElement('p');
        const anchor = document.createElement('a');
        const foundLink = linkCell?.querySelector('a');
        if (foundLink) {
          anchor.href = foundLink.href;
          anchor.textContent = titleCell?.textContent.trim() || '';
        }
        p.append(anchor);
        desc.append(p);

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        const emDate = document.createElement('em');
        emDate.textContent = dateCell?.textContent.trim() || '';
        const emCategory = document.createElement('em');
        emCategory.textContent = categoryCell?.textContent.trim() || '';
        dateDiv.append(emDate, emCategory);
        desc.append(dateDiv);

        content.append(desc);
        slideWrap.append(content);
        slide.append(slideWrap);
        latestTwoPressRelease.append(slide);
        moveInstrumentation(row, slide);
      });
      newsroomLeftDiv.append(latestTwoPressRelease);
    }
  }

  // Icon Links (if any) - to be integrated into mobile/desktop icon navs
  iconLinkItems.forEach((row) => {
    const [linkCell] = [...row.children];
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      const mailLinkMobile = iconNavMobile.querySelector('.mail a');
      const mailLinkDesktop = iconNavDesktop.querySelector('.mail a');

      // Assuming icon links are for contact us, update existing links
      if (mailLinkMobile) {
        mailLinkMobile.href = foundLink.href;
      }
      if (mailLinkDesktop) {
        mailLinkDesktop.href = foundLink.href;
      }
      moveInstrumentation(row, mailLinkMobile || mailLinkDesktop);
    }
  });
}
