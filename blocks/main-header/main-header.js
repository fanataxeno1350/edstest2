import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    ...itemRows
  ] = [...block.children];

  block.innerHTML = ''; // Clear the block content

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // Do NOT add 'nav-up' here

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  wrap.append(logoDiv);

  const logoAnchor = document.createElement('a');
  const logoLink = logoLinkRow.querySelector('a');
  if (logoLink) {
    logoAnchor.href = logoLink.href;
  }
  moveInstrumentation(logoLinkRow, logoAnchor);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    const optimizedLogoPic = createOptimizedPicture(
      logoImg.src,
      logoImg.alt,
      false,
      [{ width: '200' }]
    );
    optimizedLogoPic.querySelector('img').classList.add('hiddenlogo1');
    moveInstrumentation(logoRow, optimizedLogoPic.querySelector('img'));
    logoAnchor.append(optimizedLogoPic);
  }
  logoDiv.append(logoAnchor);

  // Hamburger
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.setAttribute('data-once', 'hamburger-click nav-close-search');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburgerDiv.append(hamburgerUl);
  wrap.append(hamburgerDiv);

  // Main Nav
  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  mainNav.setAttribute('data-once', 'initSubChildToggle');
  mainNav.setAttribute('itemscope', '');
  mainNav.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  wrap.append(mainNav);

  const navUl = document.createElement('ul');
  mainNav.append(navUl);

  const navigationItems = itemRows.filter((row) => row.children.length === 6);
  const iconLinkItems = itemRows.filter((row) => row.children.length === 3);
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4);

  // Navigation Menu Items
  navigationItems.forEach((row) => {
    const [labelCell, linkCell, iconCell, hierarchyCell, descriptionCell, subDescriptionCell] = [
      ...row.children,
    ];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    moveInstrumentation(linkCell, anchor);
    li.append(anchor);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const iconSpan = document.createElement('span');
      const optimizedIconPic = createOptimizedPicture(
        iconImg.src,
        iconImg.alt,
        false,
        [{ width: '20' }]
      );
      moveInstrumentation(iconCell, optimizedIconPic.querySelector('img'));
      iconSpan.append(optimizedIconPic);
      li.append(iconSpan);
    }

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    const leftDivHeading = document.createElement('h4');
    leftDivHeading.classList.add('left-div-heading');
    const headingAnchor = document.createElement('a');
    headingAnchor.textContent = labelCell.textContent.trim(); // Use the main label for heading
    leftDivHeading.append(headingAnchor);
    leftDiv.append(leftDivHeading);

    const descP = document.createElement('p');
    descP.classList.add('left-div-desc');
    descP.textContent = descriptionCell.textContent.trim();
    leftDiv.append(descP);

    const subDescP = document.createElement('p');
    subDescP.classList.add('left-div-subdesc');
    subDescP.textContent = subDescriptionCell.textContent.trim();
    leftDiv.append(subDescP);

    centerDiv.append(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    
    // Handle hierarchy-tree richtext field
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hierarchyCell.innerHTML;
    moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv

    const hierarchyRoot = tempDiv.querySelector('ul');
    if (hierarchyRoot) {
      transformNestedLists(hierarchyRoot); // Apply classes and interactivity
      subNavWrap.append(hierarchyRoot); // Append the transformed hierarchy
    }
    centerDiv.append(subNavWrap);
    megaMenuWrap.append(centerDiv);
    megaMenu.append(megaMenuWrap);
    li.append(megaMenu);

    navUl.append(li);
  });

  // Icon Nav (Mobile)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);

  iconLinkItems.forEach((row) => {
    const [iconCell, linkCell, labelCell] = [...row.children];
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    moveInstrumentation(linkCell, anchor);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIconPic = createOptimizedPicture(
        iconImg.src,
        iconImg.alt,
        false,
        [{ width: '20' }]
      );
      moveInstrumentation(iconCell, optimizedIconPic.querySelector('img'));
      anchor.append(optimizedIconPic);
    }
    anchor.append(labelCell.textContent.trim());
    li.append(anchor);
    mobileIconUl.append(li);
  });

  // Search icon for mobile
  const mobileSearchLi = createSearchIcon();
  mobileIconUl.append(mobileSearchLi);
  mainNav.append(mobileIconNav);

  // Icon Nav (Desktop)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);

  iconLinkItems.forEach((row) => {
    const [iconCell, linkCell] = [...row.children]; // Label is not shown for desktop icons
    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    moveInstrumentation(linkCell, anchor);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIconPic = createOptimizedPicture(
        iconImg.src,
        iconImg.alt,
        false,
        [{ width: '20' }]
      );
      moveInstrumentation(iconCell, optimizedIconPic.querySelector('img'));
      anchor.append(optimizedIconPic);
    }
    li.append(anchor);
    desktopIconUl.append(li);
  });

  // Search icon for desktop
  const desktopSearchLi = createSearchIcon();
  desktopIconUl.append(desktopSearchLi);
  mainNav.append(desktopIconNav);

  // Anniversary Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  wrap.append(year80LogoDiv);

  const anniversaryLogoAnchor = document.createElement('a');
  const anniversaryLogoLink = anniversaryLogoLinkRow.querySelector('a');
  if (anniversaryLogoLink) {
    anniversaryLogoAnchor.href = anniversaryLogoLink.href;
  }
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoAnchor);

  const anniversaryLogoPicture = anniversaryLogoRow.querySelector('picture');
  if (anniversaryLogoPicture) {
    const anniversaryLogoImg = anniversaryLogoPicture.querySelector('img');
    const optimizedAnniversaryLogoPic = createOptimizedPicture(
      anniversaryLogoImg.src,
      anniversaryLogoImg.alt,
      false,
      [{ width: '74' }]
    );
    optimizedAnniversaryLogoPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    moveInstrumentation(anniversaryLogoRow, optimizedAnniversaryLogoPic.querySelector('img'));
    anniversaryLogoAnchor.append(optimizedAnniversaryLogoPic);
  }
  year80LogoDiv.append(anniversaryLogoAnchor);

  block.append(header);

  // Press Releases (integrated into Newsroom mega-menu if applicable, otherwise standalone)
  const newsroomLi = navUl.querySelector('li.has-child a[itemprop="url"][href*="newsroom"]')
    ?.closest('li');
  if (newsroomLi) {
    const newsroomMegaMenu = newsroomLi.querySelector('.mega-menu');
    if (newsroomMegaMenu) {
      let latestPressReleaseDiv = newsroomMegaMenu.querySelector('.latest-two-press-release');
      if (!latestPressReleaseDiv) {
        const leftDiv = newsroomMegaMenu.querySelector('.left-div'); // Use generic left-div
        if (leftDiv) {
          latestPressReleaseDiv = document.createElement('div');
          latestPressReleaseDiv.classList.add('latest-two-press-release');
          leftDiv.append(latestPressReleaseDiv);
        }
      }
      pressReleaseItems.forEach((row) => {
        const [titleCell, linkCell, dateCell, categoryCell] = [...row.children];

        const slidesDiv = document.createElement('div');
        slidesDiv.classList.add('slides');
        const slideWrap = document.createElement('div');
        slideWrap.classList.add('wrap');
        slidesDiv.append(slideWrap);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        slideWrap.append(contentDiv);

        const descDiv = document.createElement('div');
        descDiv.classList.add('desc');
        contentDiv.append(descDiv);

        const p = document.createElement('p');
        const anchor = document.createElement('a');
        const foundLink = linkCell.querySelector('a');
        if (foundLink) {
          anchor.href = foundLink.href;
        }
        anchor.textContent = titleCell.textContent.trim();
        moveInstrumentation(linkCell, anchor);
        p.append(anchor);
        descDiv.append(p);

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        const dateEm = document.createElement('em');
        dateEm.textContent = dateCell.textContent.trim();
        dateDiv.append(dateEm);
        const categoryEm = document.createElement('em');
        categoryEm.textContent = categoryCell.textContent.trim();
        dateDiv.append(categoryEm);
        descDiv.append(dateDiv);

        latestPressReleaseDiv?.append(slidesDiv);
      });
    }
  }

  // Hamburger click event
  hamburgerDiv.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburgerDiv.classList.toggle('active');
    // Toggle body scroll lock
    document.body.classList.toggle('no-scroll');
  });

  // Search functionality
  function createSearchIcon() {
    const li = document.createElement('li');
    li.classList.add('search');
    li.setAttribute('data-once', 'search-toggle search-stop-propagation');

    const anchor = document.createElement('a');
    anchor.href = '#';
    anchor.setAttribute('data-once', 'search-stop-propagation');

    // Search icon
    const searchIconImg = document.createElement('img');
    searchIconImg.alt = 'svg file';
    searchIconImg.src = '/icons/search.svg'; // Use a generic search icon
    anchor.append(searchIconImg);

    // Close search icon (if needed, otherwise can be added dynamically)
    const closeSearchIconImg = document.createElement('img');
    closeSearchIconImg.alt = 'svg file';
    closeSearchIconImg.src = '/icons/close.svg'; // Use a generic close icon
    closeSearchIconImg.style.display = 'none'; // Initially hidden
    anchor.append(closeSearchIconImg);

    const searchSpan = document.createElement('span');
    searchSpan.setAttribute('data-once', 'search-stop-propagation');
    searchSpan.textContent = ' Search';
    anchor.append(searchSpan);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
    searchScreenWrap.style.display = 'none'; // Initially hidden

    const searchWrapInner = document.createElement('div');
    searchWrapInner.classList.add('wrap');
    searchWrapInner.setAttribute('data-once', 'search-stop-propagation');
    searchScreenWrap.append(searchWrapInner);

    const searchForm = document.createElement('form');
    searchForm.action = 'https://www.mahindra.com/search';
    searchForm.method = 'get';
    searchForm.id = 'search-block-form';
    searchForm.setAttribute('accept-charset', 'UTF-8');
    searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
    searchForm.setAttribute('data-once', 'search-stop-propagation');
    searchWrapInner.append(searchForm);

    const searchInputWrap = document.createElement('div');
    searchInputWrap.classList.add('search-wrap');
    searchInputWrap.setAttribute('data-once', 'search-stop-propagation');
    searchForm.append(searchInputWrap);

    const searchInputIcon = document.createElement('div');
    searchInputIcon.classList.add('search-icon');
    searchInputIcon.setAttribute('data-once', 'search-stop-propagation');
    const inputIconImg = document.createElement('img');
    inputIconImg.alt = 'svg file';
    inputIconImg.src = '/icons/search.svg'; // Generic search icon
    searchInputIcon.append(inputIconImg);
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
    const submitLabel = document.createElement('div');
    submitLabel.classList.add('label');
    submitLabel.setAttribute('data-once', 'search-stop-propagation');
    submitLabel.textContent = ' Submit ';
    submitButton.append(submitLabel);
    const submitIcon = document.createElement('img');
    submitIcon.alt = 'svg file';
    submitIcon.src = '/icons/arrow-right.svg'; // Generic arrow icon
    submitButton.append(submitIcon);
    searchInputWrap.append(submitButton);

    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.style.display = 'none';
    searchResultBox.setAttribute('data-once', 'search-stop-propagation');
    // Add swiper structure if needed, but EDS doesn't load swiper JS.
    searchForm.append(searchResultBox);

    const searchSuggestionsWrap = document.createElement('div');
    searchSuggestionsWrap.classList.add('search-suggestions-wrap');
    searchSuggestionsWrap.setAttribute('data-once', 'search-stop-propagation');
    const popularLabel = document.createElement('div');
    popularLabel.classList.add('label');
    popularLabel.setAttribute('data-once', 'search-stop-propagation');
    popularLabel.textContent = 'Popular Keywords:';
    searchSuggestionsWrap.append(popularLabel);
    const popularTokensWrap = document.createElement('div');
    popularTokensWrap.classList.add('tokens-wrap');
    popularTokensWrap.setAttribute('data-once', 'search-stop-propagation');
    const popularUl = document.createElement('ul');
    popularUl.setAttribute('data-once', 'search-stop-propagation');
    ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'].forEach((keyword) => {
      const kwLi = document.createElement('li');
      kwLi.setAttribute('data-once', 'search-stop-propagation');
      kwLi.textContent = keyword;
      popularUl.append(kwLi);
    });
    popularTokensWrap.append(popularUl);
    searchWrapInner.append(searchSuggestionsWrap);

    const recommendedSuggestionsWrap = document.createElement('div');
    recommendedSuggestionsWrap.classList.add('search-suggestions-wrap');
    recommendedSuggestionsWrap.setAttribute('data-once', 'search-stop-propagation');
    const recommendedLabel = document.createElement('div');
    recommendedLabel.classList.add('label');
    recommendedLabel.setAttribute('data-once', 'search-stop-propagation');
    recommendedLabel.textContent = 'Recommended for you:';
    recommendedSuggestionsWrap.append(recommendedLabel);
    const recommendedTokensWrap = document.createElement('div');
    recommendedTokensWrap.classList.add('tokens-wrap');
    recommendedTokensWrap.setAttribute('data-once', 'search-stop-propagation');
    const recommendedUl = document.createElement('ul');
    recommendedUl.setAttribute('data-once', 'search-stop-propagation');
    ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'].forEach((keyword) => {
      const kwLi = document.createElement('li');
      kwLi.setAttribute('data-once', 'search-stop-propagation');
      kwLi.textContent = keyword;
      recommendedUl.append(kwLi);
    });
    popularTokensWrap.append(popularUl);
    searchWrapInner.append(recommendedSuggestionsWrap);

    li.append(anchor);
    li.append(searchScreenWrap);

    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchScreenWrap.style.display = searchScreenWrap.style.display === 'none' ? 'block' : 'none';
      searchIconImg.style.display = searchScreenWrap.style.display === 'none' ? 'inline' : 'none';
      closeSearchIconImg.style.display = searchScreenWrap.style.display === 'none' ? 'none' : 'inline';
      searchSpan.style.display = searchScreenWrap.style.display === 'none' ? 'inline' : 'none';
      document.body.classList.toggle('no-scroll', searchScreenWrap.style.display !== 'none');
    });

    searchScreenWrap.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent clicks inside search overlay from closing it
    });

    return li;
  }

  function transformNestedLists(rootUl) {
    rootUl.querySelectorAll('li').forEach((li) => {
      const nested = li.querySelector(':scope > ul');

      // Handle label-only nodes (e.g., top-level <li> with text content but no <a>)
      let trigger = li.querySelector(':scope > a');
      if (!trigger) {
        const textNode = [...li.childNodes].find(
          (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
        );
        if (textNode) {
          const span = document.createElement('span');
          span.textContent = textNode.textContent.trim();
          textNode.remove();
          li.prepend(span);
          trigger = span;
        }
      }

      // Apply classes from ORIGINAL HTML to <ul>, <li>, <a> elements
      if (li.parentElement === rootUl) { // Top-level <li> within the hierarchy-tree
        li.classList.add('top-level-li');
      } else if (li.parentElement.parentElement.classList.contains('top-level-li')) { // First-level nested <li>
        li.classList.add('first-level-li');
      }

      li.querySelectorAll(':scope > a').forEach(a => {
        // Add span with img for dropdown arrow if it has nested content
        if (li.querySelector(':scope > ul')) {
          const span = document.createElement('span');
          const img = document.createElement('img');
          img.alt = 'svg file';
          img.src = '/content/dam/aemigrate/uploaded-folder/image/1776275864983.svg+xml'; // Example icon from original HTML
          span.append(img);
          a.after(span);
        }
      });


      if (nested) {
        nested.remove(); // Remove the original nested UL to re-wrap it

        const subWrap = document.createElement('div');
        // Determine correct class based on nesting level from ORIGINAL HTML
        if (li.classList.contains('top-level-li')) {
          subWrap.classList.add('has-sub-child');
        } else if (li.classList.contains('first-level-li')) {
          subWrap.classList.add('has-inner-sub-child');
        } else {
          // Default or other levels
          subWrap.classList.add('has-sub-child');
        }
        subWrap.append(nested);

        li.append(subWrap);

        if (trigger) {
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

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}

