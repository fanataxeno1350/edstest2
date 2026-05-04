import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    li.classList.add('list-item'); // Add list-item class as per original HTML
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
          li.classList.toggle('active'); // Add active class to li
          subWrap.classList.toggle('active');
        });
      }
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
  const header = document.createElement('header');
  header.classList.add('main-header'); // Do not add state classes like 'nav-up'

  const container = document.createElement('div');
  container.classList.add('container');
  header.appendChild(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.appendChild(wrap);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  logoLink.href = logoLinkRow.querySelector('a')?.href || '#';
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    const optimizedLogo = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '200' }]);
    moveInstrumentation(logoImg, optimizedLogo.querySelector('img'));
    logoLink.appendChild(optimizedLogo);
  }
  logoDiv.appendChild(logoLink);
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

  // Navigation Menu
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.appendChild(navUl);

  const navigationItems = itemRows.filter((row) => row.children.length === 6);
  const iconLinkItems = itemRows.filter((row) => row.children.length === 1);
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4);

  navigationItems.forEach((row) => {
    const [labelCell, linkCell, hierarchyCell, leftHeadingCell, leftDescCell, leftSubDescCell] = [
      ...row.children,
    ];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell?.textContent.trim();
    anchor.setAttribute('itemprop', 'url');
    moveInstrumentation(linkCell, anchor);
    li.appendChild(anchor);

    // Add SVG icon for dropdown
    const svgSpan = document.createElement('span');
    svgSpan.innerHTML = `<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>`;
    li.appendChild(svgSpan);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    if (labelCell.textContent.trim().toLowerCase() === 'investor relations') {
      leftDiv.classList.add('ir-left-div');
    } else if (labelCell.textContent.trim().toLowerCase() === 'newsroom') {
      leftDiv.classList.add('newsroom-left-div');
    } else if (labelCell.textContent.trim().toLowerCase() === 'careers') {
      leftDiv.classList.add('career-left-div');
    }

    if (leftHeadingCell?.textContent.trim()) {
      const heading = document.createElement('h4');
      heading.classList.add('left-div-heading');
      const headingAnchor = document.createElement('a');
      headingAnchor.textContent = leftHeadingCell.textContent.trim();
      heading.appendChild(headingAnchor);
      leftDiv.appendChild(heading);
    }
    if (leftDescCell?.textContent.trim()) {
      const desc = document.createElement('p');
      desc.classList.add('left-div-desc');
      desc.textContent = leftDescCell.textContent.trim();
      leftDiv.appendChild(desc);
    }
    if (leftSubDescCell?.textContent.trim()) {
      const subDesc = document.createElement('p');
      subDesc.classList.add('left-div-subdesc');
      subDesc.textContent = leftSubDescCell.textContent.trim();
      leftDiv.appendChild(subDesc);
    }

    // Special handling for Newsroom press releases
    if (labelCell.textContent.trim().toLowerCase() === 'newsroom' && pressReleaseItems.length > 0) {
      const latestPressReleaseDiv = document.createElement('div');
      latestPressReleaseDiv.classList.add('latest-two-press-release');
      pressReleaseItems.slice(0, 2).forEach((prRow) => {
        const [prLinkCell, prTitleCell, prDateCell, prTopicCell] = [...prRow.children];
        const slidesDiv = document.createElement('div');
        slidesDiv.classList.add('slides');
        const slideWrap = document.createElement('div');
        slideWrap.classList.add('wrap');
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        const descDiv = document.createElement('div');
        descDiv.classList.add('desc');
        const prP = document.createElement('p');
        const prAnchor = document.createElement('a');
        prAnchor.href = prLinkCell.querySelector('a')?.href || '#';
        prAnchor.textContent = prTitleCell.textContent.trim();
        prP.appendChild(prAnchor);
        descDiv.appendChild(prP);
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        const dateEm = document.createElement('em');
        dateEm.textContent = prDateCell.textContent.trim();
        const topicEm = document.createElement('em');
        topicEm.textContent = prTopicCell.textContent.trim();
        dateDiv.append(dateEm, topicEm);
        descDiv.appendChild(dateDiv);
        contentDiv.appendChild(descDiv);
        slideWrap.appendChild(contentDiv);
        slidesDiv.appendChild(slideWrap);
        latestPressReleaseDiv.appendChild(slidesDiv);
        moveInstrumentation(prRow, slidesDiv);
      });
      leftDiv.appendChild(latestPressReleaseDiv);
    }

    centerDiv.appendChild(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    if (labelCell.textContent.trim().toLowerCase() === 'who we are') {
      subNavWrap.classList.add('about-us-sub-nav');
    } else if (labelCell.textContent.trim().toLowerCase() === 'what we do') {
      subNavWrap.classList.add('what-we-do');
    } else if (labelCell.textContent.trim().toLowerCase() === 'investor relations') {
      subNavWrap.classList.add('element-block');
      const oneLinkUl = document.createElement('ul');
      oneLinkUl.classList.add('sub-nav-wrap-one-link');
      const firstLinkLi = document.createElement('li');
      const firstLinkAnchor = document.createElement('a');
      firstLinkAnchor.href = 'https://www.mahindra.com/sites/default/files/2025-04/Disclosures-under-Reg-46-62-MM-URLs_PDF.pdf'; // Hardcoded from original HTML
      firstLinkAnchor.target = '_blank';
      firstLinkAnchor.textContent = 'Disclosures Under Regulation 46 And 62 Of SEBI (LODR)';
      firstLinkLi.appendChild(firstLinkAnchor);
      oneLinkUl.appendChild(firstLinkLi);
      subNavWrap.appendChild(oneLinkUl);

      const innerSubNavWrapList = document.createElement('div');
      innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
      subNavWrap.appendChild(innerSubNavWrapList);
    } else if (labelCell.textContent.trim().toLowerCase() === 'careers') {
      subNavWrap.classList.add('careers-div');
    }

    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      if (labelCell.textContent.trim().toLowerCase() === 'investor relations') {
        const innerSubNavWrapList = subNavWrap.querySelector('.inner-sub-nav-wrap-list');
        if (innerSubNavWrapList) {
          hierarchyRoot.querySelectorAll(':scope > li').forEach((childLi) => {
            const newUl = document.createElement('ul');
            moveInstrumentation(childLi, newUl);
            newUl.appendChild(childLi);
            innerSubNavWrapList.appendChild(newUl);
          });
        }
      } else {
        transformNestedLists(hierarchyRoot);
        subNavWrap.appendChild(hierarchyRoot);
      }
    }
    centerDiv.appendChild(subNavWrap);
    megaMenuWrap.appendChild(centerDiv);
    megaMenu.appendChild(megaMenuWrap);
    li.appendChild(megaMenu);
    navUl.appendChild(li);

    // Toggle mega menu on click
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      li.classList.toggle('active');
    });
  });

  // Icon Links
  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const iconNavMobileUl = document.createElement('ul');

  const mailLiMobile = document.createElement('li');
  mailLiMobile.classList.add('mail');
  const mailAnchorMobile = document.createElement('a');
  mailAnchorMobile.href = 'https://www.mahindra.com/contact-us';
  mailAnchorMobile.textContent = 'Contact Us';
  mailLiMobile.appendChild(mailAnchorMobile);
  iconNavMobileUl.appendChild(mailLiMobile);

  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  const searchAnchorMobile = document.createElement('a');
  searchAnchorMobile.href = '#';
  searchAnchorMobile.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens">
    <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
  </svg>
  <svg viewBox="0 0 50 50" class="close">
    <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
  </svg>
  <span> Search</span>`;
  searchLiMobile.appendChild(searchAnchorMobile);
  iconNavMobileUl.appendChild(searchLiMobile);
  iconNavMobile.appendChild(iconNavMobileUl);
  navUl.appendChild(iconNavMobile);

  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const iconNavDesktopUl = document.createElement('ul');

  const mailLiDesktop = document.createElement('li');
  mailLiDesktop.classList.add('mail');
  const mailAnchorDesktop = document.createElement('a');
  mailAnchorDesktop.href = 'https://www.mahindra.com/contact-us';
  mailAnchorDesktop.innerHTML = `<svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21" xmlns:xlink="http://www.w3.org/1999/xlink">
    <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
              C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
              L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z"></path>
  </svg>`;
  mailLiDesktop.appendChild(mailAnchorDesktop);
  iconNavDesktopUl.appendChild(mailLiDesktop);

  const searchLiDesktop = document.createElement('li');
  searchLiDesktop.classList.add('search');
  const searchAnchorDesktop = document.createElement('a');
  searchAnchorDesktop.href = '#';
  searchAnchorDesktop.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens">
    <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
  </svg>
  <svg viewBox="0 0 50 50" class="close">
    <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
  </svg>`;
  searchLiDesktop.appendChild(searchAnchorDesktop);
  iconNavDesktopUl.appendChild(searchLiDesktop);
  iconNavDesktop.appendChild(iconNavDesktopUl);
  nav.appendChild(iconNavDesktop);

  wrap.appendChild(nav);

  // Anniversary Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const anniversaryLogoLink = document.createElement('a');
  anniversaryLogoLink.href = anniversaryLogoLinkRow.querySelector('a')?.href || '#';
  const anniversaryLogoPicture = anniversaryLogoRow.querySelector('picture');
  if (anniversaryLogoPicture) {
    const anniversaryLogoImg = anniversaryLogoPicture.querySelector('img');
    const optimizedAnniversaryLogo = createOptimizedPicture(anniversaryLogoImg.src, anniversaryLogoImg.alt, false, [{ width: '74' }]);
    moveInstrumentation(anniversaryLogoImg, optimizedAnniversaryLogo.querySelector('img'));
    optimizedAnniversaryLogo.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    anniversaryLogoLink.appendChild(optimizedAnniversaryLogo);
  }
  year80LogoDiv.appendChild(anniversaryLogoLink);
  wrap.appendChild(year80LogoDiv);

  block.appendChild(header);

  // Search screen logic
  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  const searchWrap = document.createElement('div');
  searchWrap.classList.add('wrap');
  searchScreenWrap.appendChild(searchWrap);

  const searchForm = document.createElement('form');
  searchForm.action = 'https://www.mahindra.com/search';
  searchForm.method = 'get';
  searchForm.id = 'search-block-form';
  searchForm.setAttribute('accept-charset', 'UTF-8');
  searchWrap.appendChild(searchForm);

  const searchInputWrap = document.createElement('div');
  searchInputWrap.classList.add('search-wrap');
  searchForm.appendChild(searchInputWrap);

  const searchIcon = document.createElement('div');
  searchIcon.classList.add('search-icon');
  searchIcon.innerHTML = `<svg viewBox="0 0 21 21" fill="none">
    <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
  </svg>`;
  searchInputWrap.appendChild(searchIcon);

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.classList.add('input-text', 'searchtext');
  searchInput.required = true;
  searchInput.name = 'key';
  searchInput.id = 'searchInput';
  searchInput.autocomplete = 'off';
  searchInputWrap.appendChild(searchInput);

  const submitButton = document.createElement('button');
  submitButton.classList.add('submit-button');
  submitButton.innerHTML = `<div class="label"> Submit </div>
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
      <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
    </svg>`;
  searchInputWrap.appendChild(submitButton);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none';
  searchForm.appendChild(searchResultBox);

  // Add search suggestions (hardcoded from original HTML for now)
  const popularKeywords = ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'];
  const recommendedKeywords = ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'];

  const createSuggestionSection = (label, keywords) => {
    const suggestionWrap = document.createElement('div');
    suggestionWrap.classList.add('search-suggestions-wrap');
    const labelDiv = document.createElement('div');
    labelDiv.classList.add('label');
    labelDiv.textContent = label;
    suggestionWrap.appendChild(labelDiv);
    const tokensWrap = document.createElement('div');
    tokensWrap.classList.add('tokens-wrap');
    const ul = document.createElement('ul');
    keywords.forEach((keyword) => {
      const li = document.createElement('li');
      li.textContent = keyword;
      ul.appendChild(li);
    });
    tokensWrap.appendChild(ul);
    suggestionWrap.appendChild(tokensWrap);
    return suggestionWrap;
  };

  searchWrap.appendChild(createSuggestionSection('Popular Keywords:', popularKeywords));
  searchWrap.appendChild(createSuggestionSection('Recommended for you:', recommendedKeywords));

  // Search toggle logic
  const searchTriggers = block.querySelectorAll('.search > a');
  searchTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchScreenWrap.classList.toggle('active');
      document.body.classList.toggle('search-overlay-active');
    });
  });

  // Close search on click outside or on close icon
  searchScreenWrap.addEventListener('click', (e) => {
    if (e.target === searchScreenWrap || e.target.closest('.close')) {
      searchScreenWrap.classList.remove('active');
      document.body.classList.remove('search-overlay-active');
    }
  });

  block.appendChild(searchScreenWrap);

  // Hamburger menu toggle
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('nav-overlay-active');
  });
}
