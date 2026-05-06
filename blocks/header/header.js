import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
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
    }
    // Move instrumentation for the li itself if it was an authored row
    // This assumes `li` might correspond to an authored row in some contexts,
    // but for nested lists generated from a richtext cell, the instrumentation
    // should be on the parent richtext cell.
    // For now, we'll assume the `li` elements are generated and not directly instrumented rows.
  });
}

export default async function decorate(block) {
  const children = [...block.children];

  const [
    logoRow,
    logoLinkRow,
    year80LogoRow,
    year80LogoLinkRow,
    ...itemRows
  ] = children;

  const navigationItems = itemRows.filter((row) => row.children.length === 7);
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4);
  const iconLinkItems = itemRows.filter((row) => row.children.length === 2);

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // 'nav-up' is a scroll-state class, not added initially

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Main Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoLink = document.createElement('a');
  logoLink.href = logoLinkRow.querySelector('a')?.href || '#';
  const mainLogoPicture = logoRow.querySelector('picture');
  if (mainLogoPicture) {
    const optimizedPic = createOptimizedPicture(
      mainLogoPicture.querySelector('img').src,
      mainLogoPicture.querySelector('img').alt,
      false,
      [{ width: '200' }],
    );
    moveInstrumentation(mainLogoPicture.querySelector('img'), optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
  logoDiv.append(logoLink);
  wrap.append(logoDiv);

  // Hamburger
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburgerDiv.append(hamburgerUl);
  wrap.append(hamburgerDiv);

  // Main Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrap.append(nav);

  navigationItems.forEach((row) => {
    const [
      labelCell,
      linkCell,
      hierarchyCell,
      megaMenuLeftHeadingCell,
      megaMenuLeftDescCell,
      megaMenuLeftSubdescCell,
      megaMenuStatsCell,
    ] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    anchor.href = linkCell?.querySelector('a')?.href || '#';
    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(labelCell, anchor);
    moveInstrumentation(linkCell, anchor);
    li.append(anchor);

    const svgSpan = document.createElement('span');
    svgSpan.innerHTML = `<svg viewBox="-23.5 -23.5 122.80 122.80" fill="#000000" stroke="#000000" stroke-width="4.851456000000001"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.30321600000000004"></g><g id="SVGRepo_iconCarrier"> <g id="Group_65" data-name="Group 65" transform="translate(-831.568 -384.448)"> <path id="Path_57" data-name="Path 57" d="M833.068,460.252a1.5,1.5,0,0,1-1.061-2.561l33.557-33.56a2.53,2.53,0,0,0,0-3.564l-33.557-33.558a1.5,1.5,0,0,1,2.122-2.121l33.556,33.558a5.53,5.53,0,0,1,0,7.807l-33.557,33.56A1.5,1.5,0,0,1,833.068,460.252Z" fill="#030408"></path> </g> </g></svg>`;
    li.append(svgSpan);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);
    megaMenu.append(megaMenuWrap);
    li.append(megaMenu);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    const leftDivHeading = document.createElement('h4');
    leftDivHeading.classList.add('left-div-heading');
    leftDivHeading.innerHTML = megaMenuLeftHeadingCell?.innerHTML || '';
    moveInstrumentation(megaMenuLeftHeadingCell, leftDivHeading);
    leftDiv.append(leftDivHeading);

    const leftDivDesc = document.createElement('p');
    leftDivDesc.classList.add('left-div-desc');
    leftDivDesc.innerHTML = megaMenuLeftDescCell?.innerHTML || '';
    moveInstrumentation(megaMenuLeftDescCell, leftDivDesc);
    leftDiv.append(leftDivDesc);

    const leftDivSubdesc = document.createElement('p');
    leftDivSubdesc.classList.add('left-div-subdesc');
    leftDivSubdesc.innerHTML = megaMenuLeftSubdescCell?.innerHTML || '';
    moveInstrumentation(megaMenuLeftSubdescCell, leftDivSubdesc);
    leftDiv.append(leftDivSubdesc);

    const megaMenuStats = document.createElement('div');
    megaMenuStats.innerHTML = megaMenuStatsCell?.innerHTML || ''; // Corrected to innerHTML for richtext
    moveInstrumentation(megaMenuStatsCell, megaMenuStats); // Added moveInstrumentation
    leftDiv.append(megaMenuStats);

    centerDiv.append(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      // Create a temporary div to hold the hierarchy content for instrumentation and processing
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv

      const processedHierarchyRoot = tempDiv.querySelector('ul');
      if (processedHierarchyRoot) {
        transformNestedLists(processedHierarchyRoot);
        subNavWrap.append(processedHierarchyRoot);
      }
    } else {
      // If no UL, but there's content, ensure it's moved
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell?.innerHTML || '';
      moveInstrumentation(hierarchyCell, tempDiv);
      while (tempDiv.firstChild) {
        subNavWrap.append(tempDiv.firstChild);
      }
    }
    centerDiv.append(subNavWrap);

    // Specific classes based on content for 'What we do' and 'Investor Relations'
    if (anchor.textContent.trim().toLowerCase() === 'what we do') {
      subNavWrap.classList.add('what-we-do');
    } else if (anchor.textContent.trim().toLowerCase() === 'investor relations') {
      leftDiv.classList.add('ir-left-div');
      subNavWrap.classList.add('element-block');
      const innerSubNavWrapList = document.createElement('div');
      innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
      // The original HTML for Investor Relations has two <ul> elements within .element-block
      // and one <ul> with class .sub-nav-wrap-one-link.
      // Since the block model only provides one hierarchy-tree, we'll simulate this structure
      // by splitting the hierarchyRoot's direct children into two columns if possible.
      if (hierarchyRoot) {
        const directLIs = [...hierarchyRoot.children];
        const firstUl = document.createElement('ul');
        const secondUl = document.createElement('ul');
        const oneLinkUl = document.createElement('ul');
        oneLinkUl.classList.add('sub-nav-wrap-one-link');

        // Assuming the first li in the hierarchy is the single link
        if (directLIs.length > 0) {
          const firstLiContent = directLIs[0].querySelector('a') || directLIs[0].querySelector('span');
          if (firstLiContent && firstLiContent.textContent.trim().includes('Disclosures')) {
            oneLinkUl.append(directLIs.shift());
          }
        }

        const half = Math.ceil(directLIs.length / 2);
        directLIs.forEach((item, index) => {
          if (index < half) {
            firstUl.append(item);
          } else {
            secondUl.append(item);
          }
        });

        if (oneLinkUl.children.length > 0) subNavWrap.prepend(oneLinkUl);
        if (firstUl.children.length > 0) innerSubNavWrapList.append(firstUl);
        if (secondUl.children.length > 0) innerSubNavWrapList.append(secondUl);
        if (innerSubNavWrapList.children.length > 0) subNavWrap.append(innerSubNavWrapList);
      }
    } else if (anchor.textContent.trim().toLowerCase() === 'newsroom') {
      leftDiv.classList.add('newsroom-left-div');
      const latestPressReleaseDiv = document.createElement('div');
      latestPressReleaseDiv.classList.add('latest-two-press-release');
      pressReleaseItems.forEach((prRow) => {
        const [prLinkCell, prTitleCell, prDateCell, prCategoryCell] = [...prRow.children];
        const slidesDiv = document.createElement('div');
        slidesDiv.classList.add('slides');
        const slidesWrap = document.createElement('div');
        slidesWrap.classList.add('wrap');
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        const descDiv = document.createElement('div');
        descDiv.classList.add('desc');
        const p = document.createElement('p');
        const prAnchor = document.createElement('a');
        prAnchor.href = prLinkCell?.querySelector('a')?.href || '#';
        prAnchor.textContent = prTitleCell?.textContent.trim() || '';
        moveInstrumentation(prLinkCell, prAnchor);
        moveInstrumentation(prTitleCell, prAnchor);
        p.append(prAnchor);
        descDiv.append(p);

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        const emDate = document.createElement('em');
        emDate.textContent = prDateCell?.textContent.trim() || '';
        moveInstrumentation(prDateCell, emDate);
        dateDiv.append(emDate);
        const emCategory = document.createElement('em');
        emCategory.textContent = prCategoryCell?.textContent.trim() || '';
        moveInstrumentation(prCategoryCell, emCategory);
        dateDiv.append(emCategory);
        descDiv.append(dateDiv);
        contentDiv.append(descDiv);
        slidesWrap.append(contentDiv);
        slidesDiv.append(slidesWrap);
        latestPressReleaseDiv.append(slidesDiv);
        moveInstrumentation(prRow, slidesDiv); // Added moveInstrumentation for press release row
      });
      leftDiv.append(latestPressReleaseDiv);
    } else if (anchor.textContent.trim().toLowerCase() === 'careers') {
      leftDiv.classList.add('career-left-div');
      subNavWrap.classList.add('careers-div');
    }

    moveInstrumentation(row, li);
    navUl.append(li);
  });

  // Icon Navigation (Mobile and Desktop)
  const createIconNav = (isMobile) => {
    const iconNav = document.createElement('div');
    iconNav.classList.add('icon-nav');
    if (isMobile) {
      iconNav.classList.add('mobile-menus-icon');
    } else {
      iconNav.classList.add('desktop-menus-icon');
    }
    const iconUl = document.createElement('ul');
    iconNav.append(iconUl);

    iconLinkItems.forEach((row) => {
      const [iconLinkCell, iconLabelCell] = [...row.children];
      const li = document.createElement('li');
      const iconAnchor = document.createElement('a');
      iconAnchor.href = iconLinkCell?.querySelector('a')?.href || '#';
      iconAnchor.textContent = iconLabelCell?.textContent.trim() || '';
      moveInstrumentation(iconLinkCell, iconAnchor);
      moveInstrumentation(iconLabelCell, iconAnchor);
      li.append(iconAnchor);

      if (iconAnchor.textContent.trim().toLowerCase() === 'contact us') {
        li.classList.add('mail');
        iconAnchor.innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 38.4" style="enable-background:new 0 0 48 38.4;" xml:space="preserve" width="21" height="21">
          <path d="M3.6,38.4c-1,0-1.8-0.4-2.5-1.1S0,35.8,0,34.8V3.6c0-1,0.4-1.8,1.1-2.5S2.6,0,3.6,0h40.8c1,0,1.8,0.4,2.5,1.1
                    C47.6,1.8,48,2.6,48,3.6v31.2c0,1-0.4,1.8-1.1,2.5c-0.7,0.7-1.6,1.1-2.5,1.1H3.6z M24,20.3L3.6,6.9v27.9h40.8V6.9L24,20.3z M24,16.7
                    L44.2,3.6H3.9L24,16.7z M3.6,6.9V3.6v31.2V6.9z" />
        </svg>${isMobile ? 'Contact Us' : ''}`;
      } else if (iconAnchor.textContent.trim().toLowerCase() === 'search') {
        li.classList.add('search');
        iconAnchor.href = '#'; // Search link is typically a trigger for an overlay
        iconAnchor.innerHTML = `<svg viewBox="0 0 21 21" fill="none" class="lens">
          <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
        </svg>
        <svg viewBox="0 0 50 50" class="close">
          <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
        </svg>
        ${isMobile ? '<span> Search</span>' : ''}`;

        const searchScreenWrap = document.createElement('div');
        searchScreenWrap.classList.add('search-screen-wrap');
        const searchWrapInner = document.createElement('div');
        searchWrapInner.classList.add('wrap');
        searchScreenWrap.append(searchWrapInner);
        moveInstrumentation(row, searchScreenWrap); // Move instrumentation for the search row

        const searchForm = document.createElement('form');
        searchForm.action = 'https://www.mahindra.com/search';
        searchForm.method = 'get';
        searchForm.id = 'search-block-form';
        searchForm.setAttribute('accept-charset', 'UTF-8');
        searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
        moveInstrumentation(row, searchForm); // Move instrumentation for the search form

        const searchInputWrap = document.createElement('div');
        searchInputWrap.classList.add('search-wrap');
        const searchIconDiv = document.createElement('div');
        searchIconDiv.classList.add('search-icon');
        searchIconDiv.innerHTML = `<svg viewBox="0 0 21 21" fill="none">
          <path d="M15.0934 2.73157L15.0934 2.73156C11.6883 -0.67354 6.14543 -0.67354 2.74033 2.73156C-0.666039 6.13793 -0.666063 11.6795 2.74035 15.0847C4.38993 16.7342 6.58308 17.6433 8.91623 17.6433C10.9916 17.6433 12.9533 16.9181 14.5221 15.5975L19.5217 20.5972C19.6721 20.7476 19.8687 20.8212 20.0632 20.8212C20.2588 20.8212 20.4554 20.7476 20.6059 20.5972C20.905 20.2981 20.905 19.8121 20.6059 19.513L15.6062 14.5132C18.4815 11.0845 18.3159 5.95535 15.0934 2.73157ZM14.0092 14.0004C12.6491 15.3606 10.8404 16.1098 8.91623 16.1098C6.99211 16.1098 5.18468 15.3606 3.82452 14.0004C1.01633 11.1923 1.01633 6.62394 3.82452 3.81575C5.22857 2.41171 7.07147 1.71024 8.91623 1.71024C10.7609 1.71024 12.6052 2.41296 14.0092 3.81575C16.8174 6.62394 16.8174 11.1923 14.0092 14.0004Z" stroke-width="0.25"></path>
        </svg>`;
        searchInputWrap.append(searchIconDiv);

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
        const submitLabel = document.createElement('div');
        submitLabel.classList.add('label');
        submitLabel.textContent = 'Submit';
        submitButton.append(submitLabel);
        submitButton.innerHTML += `<svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M11.3536 4.35355C11.5488 4.15829 11.5488 3.84171 11.3536 3.64645L8.17157 0.464465C7.97631 0.269203 7.65973 0.269203 7.46447 0.464465C7.2692 0.659728 7.2692 0.97631 7.46447 1.17157L10.2929 4L7.46447 6.82843C7.2692 7.02369 7.2692 7.34027 7.46447 7.53553C7.65973 7.7308 7.97631 7.7308 8.17157 7.53553L11.3536 4.35355ZM4.37114e-08 4.5L11 4.5L11 3.5L-4.37114e-08 3.5L4.37114e-08 4.5Z" fill="black"></path>
        </svg>`;
        searchInputWrap.append(submitButton);
        searchForm.append(searchInputWrap);

        const searchResultBox = document.createElement('div');
        searchResultBox.classList.add('searchResultBox');
        searchResultBox.style.display = 'none';
        searchResultBox.innerHTML = `<div class="swiper scrollSwiper"><div class="swiper-wrapper"><div class="swiper-slide"></div></div></div><div class="swiper-scrollbar"></div>`;
        searchForm.append(searchResultBox);
        searchWrapInner.append(searchForm);

        const createSuggestions = (label, keywords) => {
          const suggestionsWrap = document.createElement('div');
          suggestionsWrap.classList.add('search-suggestions-wrap');
          const labelDiv = document.createElement('div');
          labelDiv.classList.add('label');
          labelDiv.textContent = label;
          suggestionsWrap.append(labelDiv);
          const tokensWrap = document.createElement('div');
          tokensWrap.classList.add('tokens-wrap');
          const ul = document.createElement('ul');
          keywords.forEach((keyword) => {
            const liKeyword = document.createElement('li');
            liKeyword.textContent = keyword;
            ul.append(liKeyword);
          });
          tokensWrap.append(ul);
          suggestionsWrap.append(tokensWrap);
          moveInstrumentation(row, suggestionsWrap); // Move instrumentation for suggestions wrap
          return suggestionsWrap;
        };

        searchWrapInner.append(
          createSuggestions('Popular Keywords:', [
            'Business',
            'FY 21',
            'Brands',
            'XUV700',
            'Global',
            'Nanhi Kali',
          ]),
        );
        searchWrapInner.append(
          createSuggestions('Recommended for you:', [
            'Annual Report 2021 - 2022',
            'Leadership Announcement',
            'Latest Press Release',
            'Brand Guidelines',
          ]),
        );

        li.append(searchScreenWrap);

        // Add event listeners for search toggle
        iconAnchor.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          li.classList.toggle('active');
          searchScreenWrap.classList.toggle('active');
        });
        searchScreenWrap.addEventListener('click', (e) => {
          if (e.target === searchScreenWrap) {
            li.classList.remove('active');
            searchScreenWrap.classList.remove('active');
          }
        });
      }
      iconUl.append(li);
      moveInstrumentation(row, li); // Added moveInstrumentation for icon link row
    });
    return iconNav;
  };

  navUl.append(createIconNav(true)); // Mobile icon nav

  // Desktop icon nav (after main nav)
  nav.append(createIconNav(false));

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  year80LogoLink.href = year80LogoLinkRow.querySelector('a')?.href || '#';
  const year80LogoPicture = year80LogoRow.querySelector('picture');
  if (year80LogoPicture) {
    const optimizedPic = createOptimizedPicture(
      year80LogoPicture.querySelector('img').src,
      year80LogoPicture.querySelector('img').alt,
      false,
      [{ width: '74' }],
    );
    optimizedPic.classList.add('hiddenlogo1', 'years-80');
    moveInstrumentation(year80LogoPicture.querySelector('img'), optimizedPic.querySelector('img'));
    year80LogoLink.append(optimizedPic);
  }
  moveInstrumentation(year80LogoRow, year80LogoLink);
  moveInstrumentation(year80LogoLinkRow, year80LogoLink);
  year80LogoDiv.append(year80LogoLink);
  wrap.append(year80LogoDiv);

  // Hamburger click listener to toggle main-nav and hamburger classes
  hamburgerDiv.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburgerDiv.classList.toggle('active');
    document.body.classList.toggle('overflow-hidden');
  });

  // Close nav on outside click
  document.addEventListener('click', (e) => {
    if (
      !nav.contains(e.target) &&
      !hamburgerDiv.contains(e.target) &&
      nav.classList.contains('active')
    ) {
      nav.classList.remove('active');
      hamburgerDiv.classList.remove('active');
      document.body.classList.remove('overflow-hidden');
    }
  });

  // Toggle sub-menus
  nav.querySelectorAll('.has-child > a + span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentLi = span.closest('li');
      parentLi.classList.toggle('active');
      parentLi.querySelector('.mega-menu')?.classList.toggle('active');
    });
  });

  // Toggle nested sub-menus within mega-menu
  nav.querySelectorAll('.sub-nav-wrap ul li.top-level-li > a + span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentLi = span.closest('li');
      parentLi.classList.toggle('active');
      parentLi.querySelector('.has-sub-child')?.classList.toggle('active');
    });
  });

  nav.querySelectorAll('.sub-nav-wrap ul li.first-level-li > a + span').forEach((span) => {
    span.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentLi = span.closest('li');
      parentLi.classList.toggle('active-child');
      parentLi.querySelector('.has-inner-sub-child')?.classList.toggle('active-child');
    });
  });

  block.replaceChildren(header);

  // Initialize Swiper for search results if present
  const swiperEl = block.querySelector('.swiper.scrollSwiper');
  if (swiperEl) {
    await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
    await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');
    // eslint-disable-next-line no-undef
    new Swiper(swiperEl, {
      slidesPerView: 'auto',
      spaceBetween: 16,
      loop: false,
      navigation: {
        prevEl: swiperEl.querySelector('.swiper-button-prev'),
        nextEl: swiperEl.querySelector('.swiper-button-next'),
      },
      pagination: {
        el: swiperEl.querySelector('.swiper-pagination'),
        clickable: true,
      },
    });
  }
}
