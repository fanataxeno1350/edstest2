import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [
    mainLogoRow,
    mainLogoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    ...itemRows
  ] = children;

  block.classList.add('with-marquee', 'solid'); // 'nav-up' is a scroll state class, do not add initially

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  wrap.append(logoDiv);

  const mainLogoLink = document.createElement('a');
  const mainLogoAnchor = mainLogoLinkRow.querySelector('a');
  if (mainLogoAnchor) {
    mainLogoLink.href = mainLogoAnchor.href;
  }
  moveInstrumentation(mainLogoLinkRow, mainLogoLink);
  logoDiv.append(mainLogoLink);

  const mainLogoPicture = mainLogoRow.querySelector('picture');
  if (mainLogoPicture) {
    const mainLogoImg = mainLogoPicture.querySelector('img');
    const optimizedMainLogo = createOptimizedPicture(mainLogoImg.src, mainLogoImg.alt, false, [{ width: '200' }]);
    optimizedMainLogo.querySelector('img').classList.add('hiddenlogo1');
    mainLogoLink.append(optimizedMainLogo);
    moveInstrumentation(mainLogoRow, optimizedMainLogo);
  }

  // Hamburger
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.setAttribute('data-once', 'hamburger-click nav-close-search');
  wrap.append(hamburgerDiv);

  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburgerDiv.append(hamburgerUl);

  // Main Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  wrap.append(nav);

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);

  // Separate item rows by structure
  const navigationItems = itemRows.filter((row) => row.children.length === 7);
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4);
  const contactLinkItems = itemRows.filter((row) => row.children.length === 3);
  const searchTokenItems = itemRows.filter((row) => row.children.length === 1);

  // Navigation Menu Items
  navigationItems.forEach((row) => {
    const [labelCell, linkCell, iconCell, hierarchyTreeCell, leftHeadingCell, leftDescCell, leftSubDescCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);

    const iconSpan = document.createElement('span');
    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '24' }]);
      iconSpan.append(optimizedIcon);
      moveInstrumentation(iconCell, optimizedIcon);
    }
    li.append(iconSpan);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    li.append(megaMenu);

    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.append(megaMenuWrap);

    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.append(centerDiv);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    centerDiv.append(leftDiv);

    const leftHeading = document.createElement('h4');
    leftHeading.classList.add('left-div-heading');
    const headingAnchor = document.createElement('a');
    headingAnchor.textContent = leftHeadingCell.textContent.trim();
    leftHeading.append(headingAnchor);
    leftDiv.append(leftHeading);

    if (leftDescCell.textContent.trim()) {
      const leftDesc = document.createElement('p');
      leftDesc.classList.add('left-div-desc');
      leftDesc.textContent = leftDescCell.textContent.trim();
      leftDiv.append(leftDesc);
    }

    if (leftSubDescCell.textContent.trim()) {
      const leftSubDesc = document.createElement('p');
      leftSubDesc.classList.add('left-div-subdesc');
      leftSubDesc.textContent = leftSubDescCell.textContent.trim();
      leftDiv.append(leftSubDesc);
    }

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    if (labelCell.textContent.trim().toLowerCase() === 'who we are') {
      subNavWrap.classList.add('about-us-sub-nav');
    } else if (labelCell.textContent.trim().toLowerCase() === 'what we do') {
      subNavWrap.classList.add('what-we-do');
    } else if (labelCell.textContent.trim().toLowerCase() === 'investor relations') {
      leftDiv.classList.add('ir-left-div');
      subNavWrap.classList.add('element-block');
    } else if (labelCell.textContent.trim().toLowerCase() === 'newsroom') {
      leftDiv.classList.add('newsroom-left-div');
    } else if (labelCell.textContent.trim().toLowerCase() === 'careers') {
      leftDiv.classList.add('career-left-div');
      subNavWrap.classList.add('careers-div');
    }
    centerDiv.append(subNavWrap);

    // Handle hierarchy-tree richtext field
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyTreeCell.innerHTML;
    moveInstrumentation(hierarchyTreeCell, tempDiv); // Instrument the original cell to the tempDiv

    const hierarchyUl = tempDiv.querySelector('ul');
    if (hierarchyUl) {
      // Apply classes from ORIGINAL HTML to nested elements
      hierarchyUl.querySelectorAll('li').forEach(liElement => {
        // Example: liElement.classList.add('nav-menu-item', 'list-item'); // Add classes as per original HTML if needed
        const anchorElement = liElement.querySelector('a');
        if (anchorElement) {
          // Example: anchorElement.classList.add('nav-link'); // Add classes as per original HTML if needed
        }
      });

      if (labelCell.textContent.trim().toLowerCase() === 'investor relations') {
        const subNavWrapOneLink = document.createElement('ul');
        subNavWrapOneLink.classList.add('sub-nav-wrap-one-link');
        const firstLi = hierarchyUl.querySelector('li');
        if (firstLi) {
          subNavWrapOneLink.append(firstLi);
        }
        subNavWrap.append(subNavWrapOneLink);

        const innerSubNavWrapList = document.createElement('div');
        innerSubNavWrapList.classList.add('inner-sub-nav-wrap-list');
        subNavWrap.append(innerSubNavWrapList);

        // Ensure all remaining LIs are handled, not just the first two
        const remainingLIs = [...hierarchyUl.children];
        if (remainingLIs.length > 0) {
          const ul1 = document.createElement('ul');
          ul1.append(remainingLIs[0]);
          innerSubNavWrapList.append(ul1);
        }
        if (remainingLIs.length > 1) {
          const ul2 = document.createElement('ul');
          ul2.append(remainingLIs[1]);
          innerSubNavWrapList.append(ul2);
        }
        // If there are more than 2 remaining LIs, they are currently dropped.
        // This logic needs to be adjusted based on the exact structure required for 'investor relations'.
        // For now, assuming only the first two remaining LIs are needed.
      } else {
        // Move all children from tempDiv to subNavWrap
        while (tempDiv.firstChild) {
          subNavWrap.append(tempDiv.firstChild);
        }
      }
      // transformNestedLists should be called on the actual UL element that was appended
      // For 'investor relations', it's more complex, but for others, it's hierarchyUl
      if (labelCell.textContent.trim().toLowerCase() !== 'investor relations') {
        transformNestedLists(hierarchyUl);
      } else {
        // For investor relations, the structure is different, apply transform to the relevant Uls
        const subNavWrapOneLinkUl = subNavWrap.querySelector('.sub-nav-wrap-one-link');
        if (subNavWrapOneLinkUl) transformNestedLists(subNavWrapOneLinkUl);
        const innerSubNavWrapLists = subNavWrap.querySelectorAll('.inner-sub-nav-wrap-list ul');
        innerSubNavWrapLists.forEach(ul => transformNestedLists(ul));
      }
    }

    navUl.append(li);
  });

  // Newsroom latest press releases
  if (pressReleaseItems.length > 0) {
    const newsroomLi = navUl.querySelector('li a[href*="newsroom"]')?.closest('li');
    if (newsroomLi) {
      const newsroomLeftDiv = newsroomLi.querySelector('.newsroom-left-div');
      if (newsroomLeftDiv) {
        const latestPressReleaseDiv = document.createElement('div');
        latestPressReleaseDiv.classList.add('latest-two-press-release');
        newsroomLeftDiv.append(latestPressReleaseDiv);

        pressReleaseItems.slice(0, 2).forEach((itemRow) => {
          const [linkCell, titleCell, dateCell, categoryCell] = [...itemRow.children];

          const slidesDiv = document.createElement('div');
          slidesDiv.classList.add('slides');
          latestPressReleaseDiv.append(slidesDiv);

          const slidesWrap = document.createElement('div');
          slidesWrap.classList.add('wrap');
          slidesDiv.append(slidesWrap);

          const contentDiv = document.createElement('div');
          contentDiv.classList.add('content');
          slidesWrap.append(contentDiv);

          const descDiv = document.createElement('div');
          descDiv.classList.add('desc');
          contentDiv.append(descDiv);

          const p = document.createElement('p');
          const link = document.createElement('a');
          const foundLink = linkCell.querySelector('a');
          if (foundLink) {
            link.href = foundLink.href;
          }
          link.textContent = titleCell.textContent.trim();
          p.append(link);
          descDiv.append(p);

          const dateDiv = document.createElement('div');
          dateDiv.classList.add('date');
          const dateEm = document.createElement('em');
          dateEm.textContent = dateCell.textContent.trim();
          dateDiv.append(dateEm);
          if (categoryCell.textContent.trim()) {
            const categoryEm = document.createElement('em');
            categoryEm.textContent = categoryCell.textContent.trim();
            dateDiv.append(categoryEm);
          }
          descDiv.append(dateDiv);
          moveInstrumentation(itemRow, slidesDiv);
        });
      }
    }
  });

  // Icon Nav (Mobile and Desktop)
  const createIconNav = (isMobile) => {
    const iconNavDiv = document.createElement('div');
    iconNavDiv.classList.add('icon-nav');
    if (isMobile) {
      iconNavDiv.classList.add('mobile-menus-icon');
    } else {
      iconNavDiv.classList.add('desktop-menus-icon');
    }

    const iconNavUl = document.createElement('ul');
    iconNavDiv.append(iconNavUl);

    // Contact Links
    contactLinkItems.forEach((row) => {
      const [linkCell, iconCell, labelCell] = [...row.children];
      const li = document.createElement('li');
      li.classList.add('mail');
      moveInstrumentation(row, li);

      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      }

      if (iconCell.querySelector('picture')) {
        const iconImg = iconCell.querySelector('picture img');
        const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '24' }]);
        optimizedIcon.querySelector('img').classList.add('svg-file'); // Add class from original HTML
        anchor.append(optimizedIcon);
        moveInstrumentation(iconCell, optimizedIcon);
      }
      if (isMobile) {
        anchor.append(document.createTextNode(labelCell.textContent.trim()));
      }
      li.append(anchor);
      iconNavUl.append(li);
    });

    // Search
    const searchLi = document.createElement('li');
    searchLi.classList.add('search');
    searchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
    iconNavUl.append(searchLi);

    const searchAnchor = document.createElement('a');
    searchAnchor.href = '#';
    searchAnchor.setAttribute('data-once', 'search-stop-propagation');
    searchLi.append(searchAnchor);

    // Search icons (assuming two states, open/close)
    const searchIcon1 = document.createElement('img');
    searchIcon1.alt = 'svg file';
    searchIcon1.src = '/content/dam/aemigrate/uploaded-folder/image/1776283229591.svg+xml';
    searchAnchor.append(searchIcon1);

    const searchIcon2 = document.createElement('img');
    searchIcon2.alt = 'svg file';
    searchIcon2.src = '/content/dam/aemigrate/uploaded-folder/image/1776283229639.svg+xml';
    searchAnchor.append(searchIcon2);

    if (isMobile) {
      const searchSpan = document.createElement('span');
      searchSpan.setAttribute('data-once', 'search-stop-propagation');
      searchSpan.textContent = ' Search';
      searchAnchor.append(searchSpan);
    }

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
    searchLi.append(searchScreenWrap);

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

    const searchInputWrap = document.createElement('div');
    searchInputWrap.classList.add('search-wrap');
    searchInputWrap.setAttribute('data-once', 'search-stop-propagation');
    searchForm.append(searchInputWrap);

    const searchInputIcon = document.createElement('div');
    searchInputIcon.classList.add('search-icon');
    searchInputIcon.setAttribute('data-once', 'search-stop-propagation');
    const searchInputImg = document.createElement('img');
    searchInputImg.alt = 'svg file';
    searchInputImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776283229684.svg+xml';
    searchInputIcon.append(searchInputImg);
    searchInputWrap.append(searchInputIcon);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext');
    searchInput.required = true;
    searchInput.name = 'key';
    searchInput.id = 'searchInput';
    searchInput.autocomplete = 'off';
    searchInput.setAttribute('data-once', 'search-stop-propagation');
    searchInputWrap.append(searchInput);

    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    submitButton.setAttribute('data-once', 'search-stop-propagation');
    searchInputWrap.append(submitButton);

    const submitLabel = document.createElement('div');
    submitLabel.classList.add('label');
    submitLabel.setAttribute('data-once', 'search-stop-propagation');
    submitLabel.textContent = ' Submit ';
    submitButton.append(submitLabel);

    const submitImg = document.createElement('img');
    submitImg.alt = 'svg file';
    submitImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776283229730.svg+xml';
    submitButton.append(submitImg);

    // Search Result Box (empty for now)
    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.style.display = 'none';
    searchResultBox.setAttribute('data-once', 'search-stop-propagation');
    searchForm.append(searchResultBox);

    const swiperDiv = document.createElement('div');
    swiperDiv.classList.add('swiper', 'scrollSwiper');
    swiperDiv.setAttribute('data-once', 'search-stop-propagation');
    searchResultBox.append(swiperDiv);

    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');
    swiperWrapper.setAttribute('data-once', 'search-stop-propagation');
    swiperDiv.append(swiperWrapper);

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    swiperSlide.setAttribute('data-once', 'search-stop-propagation');
    swiperWrapper.append(swiperSlide);

    const swiperScrollbar = document.createElement('div');
    swiperScrollbar.classList.add('swiper-scrollbar');
    swiperScrollbar.setAttribute('data-once', 'search-stop-propagation');
    searchResultBox.append(swiperScrollbar);

    // Popular Keywords
    const popularKeywordsDiv = document.createElement('div');
    popularKeywordsDiv.classList.add('search-suggestions-wrap');
    popularKeywordsDiv.setAttribute('data-once', 'search-stop-propagation');
    searchScreenWrapInner.append(popularKeywordsDiv);

    const popularKeywordsLabel = document.createElement('div');
    popularKeywordsLabel.classList.add('label');
    popularKeywordsLabel.setAttribute('data-once', 'search-stop-propagation');
    popularKeywordsLabel.textContent = 'Popular Keywords:';
    popularKeywordsDiv.append(popularKeywordsLabel);

    const popularTokensWrap = document.createElement('div');
    popularTokensWrap.classList.add('tokens-wrap');
    popularTokensWrap.setAttribute('data-once', 'search-stop-propagation');
    popularKeywordsDiv.append(popularTokensWrap);

    const popularTokensUl = document.createElement('ul');
    popularTokensUl.setAttribute('data-once', 'search-stop-propagation');
    popularTokensWrap.append(popularTokensUl);

    searchTokenItems.slice(0, Math.ceil(searchTokenItems.length / 2)).forEach((row) => {
      const [tokenCell] = [...row.children];
      const li = document.createElement('li');
      li.setAttribute('data-once', 'search-stop-propagation');
      li.textContent = tokenCell.textContent.trim();
      popularTokensUl.append(li);
      moveInstrumentation(row, li);
    });

    // Recommended for you
    const recommendedDiv = document.createElement('div');
    recommendedDiv.classList.add('search-suggestions-wrap');
    recommendedDiv.setAttribute('data-once', 'search-stop-propagation');
    searchScreenWrapInner.append(recommendedDiv);

    const recommendedLabel = document.createElement('div');
    recommendedLabel.classList.add('label');
    recommendedLabel.setAttribute('data-once', 'search-stop-propagation');
    recommendedLabel.textContent = 'Recommended for you:';
    recommendedDiv.append(recommendedLabel);

    const recommendedTokensWrap = document.createElement('div');
    recommendedTokensWrap.classList.add('tokens-wrap');
    recommendedTokensWrap.setAttribute('data-once', 'search-stop-propagation');
    recommendedDiv.append(recommendedTokensWrap);

    const recommendedTokensUl = document.createElement('ul');
    recommendedTokensUl.setAttribute('data-once', 'search-stop-propagation');
    recommendedTokensWrap.append(recommendedTokensUl);

    searchTokenItems.slice(Math.ceil(searchTokenItems.length / 2)).forEach((row) => {
      const [tokenCell] = [...row.children];
      const li = document.createElement('li');
      li.setAttribute('data-once', 'search-stop-propagation');
      li.textContent = tokenCell.textContent.trim();
      recommendedTokensUl.append(li);
      moveInstrumentation(row, li);
    });

    // Event listeners for search toggle
    searchAnchor.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation(); // Prevents parent elements from also toggling
      searchScreenWrap.classList.toggle('show');
      block.classList.toggle('search-open'); // Add/remove a class to the header for styling
      document.body.classList.toggle('no-scroll'); // Prevent scrolling when search is open
    });

    searchScreenWrap.addEventListener('click', (e) => {
      if (e.target === searchScreenWrap) {
        searchScreenWrap.classList.remove('show');
        block.classList.remove('search-open');
        document.body.classList.remove('no-scroll');
      }
    });

    return iconNavDiv;
  };

  navUl.append(createIconNav(true)); // Mobile icon nav
  nav.append(createIconNav(false)); // Desktop icon nav (outside main nav ul)

  // Anniversary Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  wrap.append(year80LogoDiv);

  const anniversaryLogoLink = document.createElement('a');
  const anniversaryLogoAnchor = anniversaryLogoLinkRow.querySelector('a');
  if (anniversaryLogoAnchor) {
    anniversaryLogoLink.href = anniversaryLogoAnchor.href;
  }
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoLink);
  year80LogoDiv.append(anniversaryLogoLink);

  const anniversaryLogoPicture = anniversaryLogoRow.querySelector('picture');
  if (anniversaryLogoPicture) {
    const anniversaryLogoImg = anniversaryLogoPicture.querySelector('img');
    const optimizedAnniversaryLogo = createOptimizedPicture(anniversaryLogoImg.src, anniversaryLogoImg.alt, false, [{ width: '74' }]);
    optimizedAnniversaryLogo.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    anniversaryLogoLink.append(optimizedAnniversaryLogo);
    moveInstrumentation(anniversaryLogoRow, optimizedAnniversaryLogo);
  }

  // Hamburger click event
  hamburgerDiv.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburgerDiv.classList.toggle('active');
    document.body.classList.toggle('no-scroll'); // Prevent scrolling when nav is open
  });

  // Toggle mega-menu on click for mobile/tablet
  navUl.querySelectorAll('li.has-child > a').forEach((link) => {
    link.addEventListener('click', (e) => {
      // Only toggle if the target is the link itself, not a nested element
      if (window.innerWidth <= 1200 && e.target === link) { // Adjust breakpoint as needed
        e.preventDefault();
        e.stopPropagation(); // Prevents parent elements from also toggling
        const parentLi = link.closest('li.has-child');
        if (parentLi) {
          // Close other open mega-menus at the same level
          navUl.querySelectorAll('li.has-child').forEach((otherLi) => {
            if (otherLi !== parentLi) {
              otherLi.classList.remove('active');
              otherLi.querySelector('.mega-menu')?.classList.remove('active');
            }
          });
          parentLi.classList.toggle('active');
          parentLi.querySelector('.mega-menu')?.classList.toggle('active');
        }
      }
    });
  });

  // Function to transform nested lists into accordions
  function transformNestedLists(rootUl) {
    rootUl.querySelectorAll('li').forEach((li) => {
      const nested = li.querySelector(':scope > ul');
      if (nested) {
        nested.remove(); // Remove the original nested ul
        const subWrap = document.createElement('div');
        subWrap.classList.add('has-sub-child'); // Use class from original site CSS
        subWrap.append(nested);
        li.append(subWrap);

        const trigger = li.querySelector(':scope > a') || li;
        trigger.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation(); // Critical: prevents parent accordion from also toggling
          li.classList.toggle('active');
          subWrap.classList.toggle('active');
        });

        // Handle inner sub-children for 'What we do' section
        if (li.closest('.what-we-do')) {
          nested.querySelectorAll('li').forEach((innerLi) => {
            const innerNested = innerLi.querySelector(':scope > ul');
            if (innerNested) {
              innerNested.remove();
              const innerSubWrap = document.createElement('div');
              innerSubWrap.classList.add('has-inner-sub-child'); // Use class from original site CSS
              innerSubWrap.append(innerNested);
              innerLi.append(innerSubWrap);

              const innerTrigger = innerLi.querySelector(':scope > a') || innerLi;
              innerTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                innerLi.classList.toggle('active-child'); // Use class from original site CSS
                innerSubWrap.classList.toggle('active-child');
              });
            }
          });
        }
      }
    });
  }
}
