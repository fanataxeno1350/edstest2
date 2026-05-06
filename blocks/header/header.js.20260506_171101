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
  path.setAttribute('d', 'M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z');
  path.setAttribute('fill', '#030408');
  g4.appendChild(path);
  g3.appendChild(g4);
  svg.appendChild(g3);

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
        trigger.append(svgIcon);
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });
      }

      nested.querySelectorAll('li').forEach((innerLi) => {
        const innerNested = innerLi.querySelector(':scope > ul');
        const innerAnchor = innerLi.querySelector(':scope > a');

        if (!innerAnchor) {
          const innerTextNode = [...innerLi.childNodes].find(
            (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim(),
          );
          if (innerTextNode) {
            const span = document.createElement('span');
            span.textContent = innerTextNode.textContent.trim();
            innerTextNode.remove();
            innerLi.prepend(span);
          }
        }

        if (innerNested) {
          innerNested.remove();
          const innerSubWrap = document.createElement('div');
          innerSubWrap.classList.add('has-inner-sub-child');
          innerSubWrap.append(innerNested);
          innerLi.append(innerSubWrap);

          const innerTrigger = innerLi.querySelector(':scope > a, :scope > span');
          if (innerTrigger) {
            const svgIcon = createSvgIcon();
            innerTrigger.append(svgIcon);
            innerTrigger.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              innerLi.classList.toggle('active-child');
              innerSubWrap.classList.toggle('active-child');
            });
          }
        }
      });
    }
  });
}

export default async function decorate(block) {
  const children = [...block.children];

  const [logoRow, logoLinkRow, secondaryLogoRow, secondaryLogoLinkRow, ...itemRows] = children;

  const mainHeader = document.createElement('header');
  mainHeader.classList.add('main-header', 'with-marquee', 'solid'); // Rule 19: nav-up removed

  const container = document.createElement('div');
  container.classList.add('container');
  mainHeader.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  const primaryLogoAnchor = logoLinkRow.querySelector('a');
  if (primaryLogoAnchor) logoLink.href = primaryLogoAnchor.href;
  moveInstrumentation(logoLinkRow, logoLink);

  const primaryPicture = logoRow.querySelector('picture');
  if (primaryPicture) {
    const img = primaryPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(logoRow, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
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

  // Main Nav
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('data-once', 'initSubChildToggle');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.append(navUl);
  wrap.append(mainNav);

  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const iconNavMobileUl = document.createElement('ul');
  iconNavMobile.append(iconNavMobileUl);

  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const iconNavDesktopUl = document.createElement('ul');
  iconNavDesktop.append(iconNavDesktopUl);

  const navigationItems = itemRows.filter((row) => row.children.length === 4);
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4 && row.querySelector('a') && !row.querySelector('picture'));
  const iconNavItems = itemRows.filter((row) => row.children.length === 3);

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, megaMenuContentCell, hierarchyTreeCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(linkCell, anchor);
    li.append(anchor);

    const svgIcon = createSvgIcon();
    li.append(document.createElement('span').append(svgIcon));

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.append(megaMenuWrap);
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    centerDiv.append(leftDiv);

    if (megaMenuContentCell.textContent.trim()) {
      leftDiv.innerHTML = megaMenuContentCell.innerHTML;
    }

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    centerDiv.append(subNavWrap);

    const hierarchyUl = hierarchyTreeCell.querySelector('ul');
    if (hierarchyUl) {
      transformNestedLists(hierarchyUl);
      subNavWrap.append(hierarchyUl);
    }

    li.append(megaMenu);
    navUl.append(li);

    li.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      li.classList.toggle('active');
      megaMenu.classList.toggle('active');
    });
  });

  // Press Releases (as a specific navigation item)
  if (pressReleaseItems.length > 0) {
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    anchor.href = '/newsroom';
    anchor.textContent = 'newsroom';
    li.append(anchor);

    const svgIcon = createSvgIcon();
    li.append(document.createElement('span').append(svgIcon));

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.append(megaMenuWrap);
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div', 'newsroom-left-div');
    centerDiv.append(leftDiv);

    const heading = document.createElement('h4');
    heading.classList.add('left-div-heading');
    const headingLink = document.createElement('a');
    headingLink.textContent = 'Newsroom';
    heading.append(headingLink);
    leftDiv.append(heading);

    const latestPressReleaseDiv = document.createElement('div');
    latestPressReleaseDiv.classList.add('latest-two-press-release');
    leftDiv.append(latestPressReleaseDiv);

    pressReleaseItems.slice(0, 2).forEach((row) => {
      const [pressReleaseLinkCell, pressReleaseTitleCell, pressReleaseDateCell, pressReleaseTagCell] = [...row.children];
      const slideDiv = document.createElement('div');
      slideDiv.classList.add('slides');
      const slideWrap = document.createElement('div');
      slideWrap.classList.add('wrap');
      slideDiv.append(slideWrap);
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('content');
      slideWrap.append(contentDiv);
      const descDiv = document.createElement('div');
      descDiv.classList.add('desc');
      contentDiv.append(descDiv);

      const p = document.createElement('p');
      const prLink = document.createElement('a');
      const foundPrLink = pressReleaseLinkCell.querySelector('a');
      if (foundPrLink) prLink.href = foundPrLink.href;
      prLink.textContent = pressReleaseTitleCell.textContent.trim();
      moveInstrumentation(pressReleaseLinkCell, prLink);
      p.append(prLink);
      descDiv.append(p);

      const dateDiv = document.createElement('div');
      dateDiv.classList.add('date');
      const emDate = document.createElement('em');
      emDate.textContent = pressReleaseDateCell.textContent.trim();
      const emTag = document.createElement('em');
      emTag.textContent = pressReleaseTagCell.textContent.trim();
      dateDiv.append(emDate, emTag);
      descDiv.append(dateDiv);
      moveInstrumentation(row, slideDiv);
      latestPressReleaseDiv.append(slideDiv);
    });

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    centerDiv.append(subNavWrap);

    const ul1 = document.createElement('ul');
    const li1 = document.createElement('li');
    const a1 = document.createElement('a');
    a1.href = 'https://www.mahindra.com/newsroom/press-release';
    a1.textContent = 'Press Releases';
    li1.append(a1);
    const li2 = document.createElement('li');
    const a2 = document.createElement('a');
    a2.href = 'https://www.mahindra.com/newsroom/corporate-doc';
    a2.textContent = 'Media Resources';
    li2.append(a2);
    ul1.append(li1, li2);
    subNavWrap.append(ul1);

    const ul2 = document.createElement('ul');
    const li3 = document.createElement('li');
    const a3 = document.createElement('a');
    a3.href = 'https://www.mahindra.com/newsroom#in-the-news';
    a3.textContent = 'In The News';
    li3.append(a3);
    ul2.append(li3);
    subNavWrap.append(ul2);

    li.append(megaMenu);
    navUl.append(li);

    li.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      li.classList.toggle('active');
      megaMenu.classList.toggle('active');
    });
  }

  // Icon Nav Items
  iconNavItems.forEach((row) => {
    const [iconCell, linkCell, labelCell] = [...row.children];

    const mobileLi = document.createElement('li');
    const desktopLi = document.createElement('li');

    const iconAnchor = document.createElement('a');
    const foundIconLink = linkCell.querySelector('a');
    if (foundIconLink) iconAnchor.href = foundIconLink.href;
    moveInstrumentation(linkCell, iconAnchor);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '21' }]);
      moveInstrumentation(iconCell, optimizedPic.querySelector('img'));
      iconAnchor.append(optimizedPic);
    }

    const labelSpan = document.createElement('span');
    labelSpan.textContent = labelCell.textContent.trim();

    mobileLi.classList.add('mail');
    iconAnchor.textContent = labelCell.textContent.trim(); // For mobile, label is text content of anchor
    mobileLi.append(iconAnchor);
    moveInstrumentation(row, mobileLi);
    iconNavMobileUl.append(mobileLi);

    desktopLi.classList.add('mail');
    desktopLi.append(iconAnchor.cloneNode(true)); // Clone for desktop
    iconNavDesktopUl.append(desktopLi);
  });

  // Search Icon (mobile and desktop)
  const createSearchElements = (isMobile) => {
    const searchLi = document.createElement('li');
    searchLi.classList.add('search');
    searchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');

    const searchAnchor = document.createElement('a');
    searchAnchor.href = '#';
    searchAnchor.setAttribute('data-once', 'search-stop-propagation');

    const lensSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    lensSvg.setAttribute('viewBox', '0 0 21 21');
    lensSvg.setAttribute('fill', 'none');
    lensSvg.classList.add('lens');
    lensSvg.setAttribute('data-once', 'search-stop-propagation');
    const lensPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    lensPath.setAttribute('d', 'M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z');
    lensPath.setAttribute('stroke-width', '0.25');
    lensPath.setAttribute('data-once', 'search-stop-propagation');
    lensSvg.append(lensPath);
    searchAnchor.append(lensSvg);

    const closeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    closeSvg.setAttribute('viewBox', '0 0 50 50');
    closeSvg.classList.add('close');
    closeSvg.setAttribute('data-once', 'search-stop-propagation');
    const closePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    closePath.setAttribute('d', 'M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z');
    closePath.setAttribute('data-once', 'search-stop-propagation');
    closeSvg.append(closePath);
    searchAnchor.append(closeSvg);

    if (isMobile) {
      const searchSpan = document.createElement('span');
      searchSpan.textContent = ' Search';
      searchSpan.setAttribute('data-once', 'search-stop-propagation');
      searchAnchor.append(searchSpan);
    }
    searchLi.append(searchAnchor);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
    const searchScreenWrapInner = document.createElement('div');
    searchScreenWrapInner.classList.add('wrap');
    searchScreenWrapInner.setAttribute('data-once', 'search-stop-propagation');
    searchScreenWrap.append(searchScreenWrapInner);

    const searchForm = document.createElement('form');
    searchForm.action = 'https://www.mahindra.com/search';
    searchForm.method = 'get';
    searchForm.id = 'search-block-form';
    searchForm.setAttribute('accept-charset', 'UTF-8');
    searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
    searchForm.setAttribute('data-once', 'search-stop-propagation');
    searchScreenWrapInner.append(searchForm);

    const searchWrap = document.createElement('div');
    searchWrap.classList.add('search-wrap');
    searchWrap.setAttribute('data-once', 'search-stop-propagation');
    searchForm.append(searchWrap);

    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
    const searchIconSvg = lensSvg.cloneNode(true); // Re-use lens SVG for search icon
    searchIconDiv.append(searchIconSvg);
    searchWrap.append(searchIconDiv);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext');
    searchInput.required = true;
    searchInput.name = 'key';
    searchInput.id = 'searchInput';
    searchInput.autocomplete = 'off';
    searchInput.setAttribute('data-once', 'search-stop-propagation');
    searchWrap.append(searchInput);

    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    submitButton.setAttribute('data-once', 'search-stop-propagation');
    const submitLabel = document.createElement('div');
    submitLabel.classList.add('label');
    submitLabel.textContent = ' Submit ';
    submitLabel.setAttribute('data-once', 'search-stop-propagation');
    submitButton.append(submitLabel);
    const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    arrowSvg.setAttribute('width', '12');
    arrowSvg.setAttribute('height', '8');
    arrowSvg.setAttribute('viewBox', '0 0 12 8');
    arrowSvg.setAttribute('fill', 'none');
    arrowSvg.setAttribute('data-once', 'search-stop-propagation');
    const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    arrowPath.setAttribute('d', 'M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z');
    arrowPath.setAttribute('fill', 'black');
    arrowPath.setAttribute('data-once', 'search-stop-propagation');
    arrowSvg.append(arrowPath);
    submitButton.append(arrowSvg);
    searchWrap.append(submitButton);

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
    searchResultBox.append(swiper);
    const swiperScrollbar = document.createElement('div');
    swiperScrollbar.classList.add('swiper-scrollbar');
    swiperScrollbar.setAttribute('data-once', 'search-stop-propagation');
    searchResultBox.append(swiperScrollbar);
    searchForm.append(searchResultBox);

    const createSuggestions = (label, keywords) => {
      const suggestionsWrap = document.createElement('div');
      suggestionsWrap.classList.add('search-suggestions-wrap');
      suggestionsWrap.setAttribute('data-once', 'search-stop-propagation');
      const labelDiv = document.createElement('div');
      labelDiv.classList.add('label');
      labelDiv.textContent = label;
      labelDiv.setAttribute('data-once', 'search-stop-propagation');
      suggestionsWrap.append(labelDiv);
      const tokensWrap = document.createElement('div');
      tokensWrap.classList.add('tokens-wrap');
      tokensWrap.setAttribute('data-once', 'search-stop-propagation');
      const ul = document.createElement('ul');
      ul.setAttribute('data-once', 'search-stop-propagation');
      keywords.forEach((keyword) => {
        const li = document.createElement('li');
        li.textContent = keyword;
        li.setAttribute('data-once', 'search-stop-propagation');
        ul.append(li);
      });
      tokensWrap.append(ul);
      suggestionsWrap.append(tokensWrap);
      return suggestionsWrap;
    };

    searchScreenWrapInner.append(createSuggestions('Popular Keywords:', ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali']));
    searchScreenWrapInner.append(createSuggestions('Recommended for you:', ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines']));

    searchLi.append(searchScreenWrap);

    searchAnchor.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchLi.classList.toggle('active');
      searchScreenWrap.classList.toggle('active');
    });

    return searchLi;
  };

  iconNavMobileUl.append(createSearchElements(true));
  iconNavDesktopUl.append(createSearchElements(false));

  navUl.append(iconNavMobile);
  mainNav.append(iconNavDesktop);

  // Secondary Logo (80th Year)
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  const secondaryLogoAnchor = secondaryLogoLinkRow.querySelector('a');
  if (secondaryLogoAnchor) year80LogoLink.href = secondaryLogoAnchor.href;
  moveInstrumentation(secondaryLogoLinkRow, year80LogoLink);

  const secondaryPicture = secondaryLogoRow.querySelector('picture');
  if (secondaryPicture) {
    const img = secondaryPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    moveInstrumentation(secondaryLogoRow, optimizedPic.querySelector('img'));
    year80LogoLink.append(optimizedPic);
  }
  year80LogoDiv.append(year80LogoLink);
  wrap.append(year80LogoDiv);

  block.replaceChildren(mainHeader);

  // Hamburger menu toggle
  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburger.classList.toggle('active');
  });
}
