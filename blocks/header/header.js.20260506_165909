import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    // Handle label-only nodes
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
    }
    // Apply classes from ORIGINAL HTML to nested elements
    li.classList.add('top-level-li'); // Example, adjust based on actual HTML
    if (li.querySelector(':scope > ul')) {
      li.classList.add('has-sub-child');
    }
    li.querySelectorAll('ul').forEach((ul) => ul.classList.add('sub-nav-wrap'));
    li.querySelectorAll('li').forEach((nestedLi) => {
      if (nestedLi.parentElement.parentElement === li) { // First level nested li
        nestedLi.classList.add('first-level-li');
      }
    });
  });
}

export default async function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    ...itemRows
  ] = children;

  const mainNavigationItems = itemRows.filter((row) => row.children.length === 4);
  const iconLinkItems = itemRows.filter((row) => row.children.length === 2);
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4 && row.querySelector('a') && !row.querySelector('picture'));

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // 'nav-up' is a scroll state class, do not add initially

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
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) logoLink.href = foundLogoLink.href;
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);
  wrap.append(logoDiv);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburger.append(hamburgerUl);
  wrap.append(hamburger);

  // Main Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);

  mainNavigationItems.forEach((row) => {
    const [labelCell, linkCell, megaMenuContentCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const link = document.createElement('a');
    link.setAttribute('itemprop', 'url');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) link.href = foundLink.href;
    link.textContent = labelCell.textContent.trim();
    moveInstrumentation(labelCell, link);
    moveInstrumentation(linkCell, link);
    li.append(link);

    const arrowSpan = document.createElement('span');
    arrowSpan.innerHTML = '<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>';
    li.append(arrowSpan);

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
    centerDiv.append(leftDiv);

    const megaMenuContent = megaMenuContentCell.innerHTML.trim();
    if (megaMenuContent) {
      leftDiv.innerHTML = megaMenuContent;
      moveInstrumentation(megaMenuContentCell, leftDiv); // Move instrumentation for richtext content
    }

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    centerDiv.append(subNavWrap);

    const hierarchyTree = hierarchyTreeCell.querySelector('ul');
    if (hierarchyTree) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
      moveInstrumentation(hierarchyTreeCell, tempDiv); // Move instrumentation for the hierarchy tree cell
      const transformedUl = tempDiv.querySelector('ul');
      if (transformedUl) {
        transformNestedLists(transformedUl);
        subNavWrap.append(transformedUl);
      }
    }

    moveInstrumentation(row, li);
    li.append(megaMenu);
    navUl.append(li);
  });

  // Icon Navigation (Mobile)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);

  // Mail icon
  const mobileMailLi = document.createElement('li');
  mobileMailLi.classList.add('mail');
  const mobileMailLink = document.createElement('a');
  // TODO: The href for this mail link is hardcoded. It should come from an iconLink item row.
  mobileMailLink.href = 'https://www.mahindra.com/contact-us';
  mobileMailLink.textContent = 'Contact Us';
  mobileIconUl.append(mobileMailLi);
  mobileMailLi.append(mobileMailLink);


  // Search icon (mobile)
  const mobileSearchLi = document.createElement('li');
  mobileSearchLi.classList.add('search');
  const mobileSearchLink = document.createElement('a');
  mobileSearchLink.href = '#';
  mobileSearchLink.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none" class="lens">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
    </svg>
    <svg viewBox="0 0 50 50" class="close">
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
    </svg>
    <span> Search</span>
  `;
  mobileSearchLi.append(mobileSearchLink);
  mobileIconUl.append(mobileSearchLi);
  navUl.append(mobileIconNav);

  // Icon Navigation (Desktop)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);

  // Mail icon
  const desktopMailLi = document.createElement('li');
  desktopMailLi.classList.add('mail');
  const desktopMailLink = document.createElement('a');
  // TODO: The href for this mail link is hardcoded. It should come from an iconLink item row.
  desktopMailLink.href = 'https://www.mahindra.com/contact-us';
  desktopMailLink.innerHTML = `
    <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
      <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
    </svg>
  `;
  desktopMailLi.append(desktopMailLink);
  desktopIconUl.append(desktopMailLi);

  // Search icon (desktop)
  const desktopSearchLi = document.createElement('li');
  desktopSearchLi.classList.add('search');
  const desktopSearchLink = document.createElement('a');
  desktopSearchLink.href = '#';
  desktopSearchLink.innerHTML = `
    <svg viewBox="0 0 21 21" fill="none" class="lens">
      <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
    </svg>
    <svg viewBox="0 0 50 50" class="close">
      <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
    </svg>
  `;
  desktopSearchLi.append(desktopSearchLink);
  desktopIconUl.append(desktopSearchLi);
  nav.append(desktopIconNav);

  wrap.append(nav);

  // Anniversary Logo
  const anniversaryLogoDiv = document.createElement('div');
  anniversaryLogoDiv.classList.add('logo', 'year-80-logo');
  const anniversaryLogoLink = document.createElement('a');
  const foundAnniversaryLogoLink = anniversaryLogoLinkRow.querySelector('a');
  if (foundAnniversaryLogoLink) anniversaryLogoLink.href = foundAnniversaryLogoLink.href;
  const anniversaryLogoPicture = anniversaryLogoRow.querySelector('picture');
  if (anniversaryLogoPicture) {
    const img = anniversaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    anniversaryLogoLink.append(optimizedPic);
  }
  moveInstrumentation(anniversaryLogoRow, anniversaryLogoLink);
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoLink);
  anniversaryLogoDiv.append(anniversaryLogoLink);
  wrap.append(anniversaryLogoDiv);

  block.replaceChildren(header);

  // Hamburger menu toggle
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  // Search functionality (simplified)
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  // The original HTML has a form action of "https://www.mahindra.com/search"
  // and hardcoded popular keywords and recommended for you sections.
  // These should ideally come from the block model if they are editable.
  // For now, retaining the hardcoded values as they are not part of the block model.
  searchScreenWrap.innerHTML = `
    <div class="wrap">
      <form action="https://www.mahindra.com/search" method="get" id="search-block-form" accept-charset="UTF-8">
        <div class="search-wrap">
          <div class="search-icon">
            <svg viewBox="0 0 21 21" fill="none">
              <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
            </svg>
          </div>
          <input type="text" class="input-text searchtext" required="" name="key" id="searchInput" autocomplete="off"/>
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

  // Append press release items to the search screen wrap if needed
  const latestTwoPressRelease = searchScreenWrap.querySelector('.latest-two-press-release');
  if (latestTwoPressRelease) {
    pressReleaseItems.slice(0, 2).forEach((row) => {
      const [pressReleaseLinkCell, pressReleaseTitleCell, pressReleaseDateCell, pressReleaseTagCell] = [...row.children];
      const slideDiv = document.createElement('div');
      slideDiv.classList.add('slides');
      const wrapDiv = document.createElement('div');
      wrapDiv.classList.add('wrap');
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('content');
      const descDiv = document.createElement('div');
      descDiv.classList.add('desc');

      const p = document.createElement('p');
      const link = document.createElement('a');
      const foundLink = pressReleaseLinkCell.querySelector('a');
      if (foundLink) link.href = foundLink.href;
      link.textContent = pressReleaseTitleCell.textContent.trim();
      p.append(link);
      descDiv.append(p);

      const dateDiv = document.createElement('div');
      dateDiv.classList.add('date');
      const dateEm = document.createElement('em');
      dateEm.textContent = pressReleaseDateCell.textContent.trim();
      dateDiv.append(dateEm);
      const tagEm = document.createElement('em');
      tagEm.textContent = pressReleaseTagCell.textContent.trim();
      dateDiv.append(tagEm);
      descDiv.append(dateDiv);

      contentDiv.append(descDiv);
      wrapDiv.append(contentDiv);
      slideDiv.append(wrapDiv);
      moveInstrumentation(row, slideDiv);
      latestTwoPressRelease.append(slideDiv);
    });
  } else {
    // If .latest-two-press-release doesn't exist, create it and append press release items
    const leftDivNewsroom = searchScreenWrap.querySelector('.newsroom-left-div'); // Assuming this is where it should go
    if (leftDivNewsroom) {
      const newLatestTwoPressRelease = document.createElement('div');
      newLatestTwoPressRelease.classList.add('latest-two-press-release');
      pressReleaseItems.slice(0, 2).forEach((row) => {
        const [pressReleaseLinkCell, pressReleaseTitleCell, pressReleaseDateCell, pressReleaseTagCell] = [...row.children];
        const slideDiv = document.createElement('div');
        slideDiv.classList.add('slides');
        const wrapDiv = document.createElement('div');
        wrapDiv.classList.add('wrap');
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        const descDiv = document.createElement('div');
        descDiv.classList.add('desc');

        const p = document.createElement('p');
        const link = document.createElement('a');
        const foundLink = pressReleaseLinkCell.querySelector('a');
        if (foundLink) link.href = foundLink.href;
        link.textContent = pressReleaseTitleCell.textContent.trim();
        p.append(link);
        descDiv.append(p);

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        const dateEm = document.createElement('em');
        dateEm.textContent = pressReleaseDateCell.textContent.trim();
        dateDiv.append(dateEm);
        const tagEm = document.createElement('em');
        tagEm.textContent = pressReleaseTagCell.textContent.trim();
        dateDiv.append(tagEm);
        descDiv.append(dateDiv);

        contentDiv.append(descDiv);
        wrapDiv.append(contentDiv);
        slideDiv.append(wrapDiv);
        moveInstrumentation(row, slideDiv);
        newLatestTwoPressRelease.append(slideDiv);
      });
      leftDivNewsroom.append(newLatestTwoPressRelease);
    }
  }

  const toggleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.classList.toggle('no-scroll');
    searchScreenWrap.classList.toggle('active');
    header.classList.toggle('search-active');
  };

  mobileSearchLink.addEventListener('click', toggleSearch);
  desktopSearchLink.addEventListener('click', toggleSearch);

  // Close search when clicking outside (on the overlay itself)
  searchScreenWrap.addEventListener('click', (e) => {
    if (e.target === searchScreenWrap) {
      toggleSearch(e);
    }
  });

  header.append(searchScreenWrap);

  // Swiper initialization for search results
  const swiperContainer = searchScreenWrap.querySelector('.swiper.scrollSwiper');
  if (swiperContainer) {
    await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

    // eslint-disable-next-line no-undef
    new Swiper(swiperContainer, {
      slidesPerView: 'auto',
      loop: false, // Assuming loop is false based on typical search results
      navigation: {
        prevEl: swiperContainer.querySelector('.swiper-button-prev'), // Assuming these exist or will be created
        nextEl: swiperContainer.querySelector('.swiper-button-next'),
      },
      pagination: {
        el: swiperContainer.querySelector('.swiper-pagination'), // Assuming this exists or will be created
        clickable: true,
      },
      scrollbar: {
        el: swiperContainer.querySelector('.swiper-scrollbar'),
        hide: false,
      },
    });
  }
}
