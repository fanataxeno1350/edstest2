import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    // Add classes from ORIGINAL HTML for <li> and <a> elements
    li.classList.add('top-level-li'); // Assuming this is a common class for top-level LIs in hierarchy
    if (anchor) {
      // No specific class for anchor in hierarchy-tree, but if it had one, it would be added here
    }

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
      subWrap.classList.add('has-sub-child'); // Class from ORIGINAL HTML
      subWrap.append(nested);
      li.append(subWrap);
      const trigger = li.querySelector(':scope > a, :scope > span');
      if (trigger) {
        // Add span for icon if not present, based on ORIGINAL HTML pattern
        if (!li.querySelector(':scope > span')) {
          const iconSpan = document.createElement('span');
          // Assuming a default icon if not explicitly provided in the model
          const img = document.createElement('img');
          img.alt = 'svg file';
          img.src = '/content/dam/aemigrate/uploaded-folder/image/1776279681211.svg+xml'; // Example default icon
          iconSpan.appendChild(img);
          li.appendChild(iconSpan);
        }

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

export default function decorate(block) {
  const rows = [...block.children];

  const header = document.createElement('header');
  header.classList.add('main-header'); // Do not add state classes like 'nav-up' initially

  const container = document.createElement('div');
  container.classList.add('container');
  header.appendChild(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.appendChild(wrap);

  // Logo
  const logoRow = rows[0];
  const logoLinkRow = rows[1];
  const logoCell = logoRow.querySelector('div');
  const logoLinkCell = logoLinkRow.querySelector('div');

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoAnchor = document.createElement('a');
  const foundLogoLink = logoLinkCell?.querySelector('a');
  if (foundLogoLink) logoAnchor.href = foundLogoLink.href;
  const logoPicture = logoCell?.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoAnchor.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoAnchor);
  moveInstrumentation(logoLinkRow, logoAnchor);
  logoDiv.appendChild(logoAnchor);
  wrap.appendChild(logoDiv);

  // Hamburger
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.setAttribute('data-once', 'hamburger-click nav-close-search');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.appendChild(document.createElement('li'));
  }
  hamburgerDiv.appendChild(hamburgerUl);
  wrap.appendChild(hamburgerDiv);

  // Main Nav
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.appendChild(navUl);
  wrap.appendChild(nav);

  // Year Logo
  const yearLogoRow = rows[2];
  const yearLogoLinkRow = rows[3];
  const yearLogoCell = yearLogoRow.querySelector('div');
  const yearLogoLinkCell = yearLogoLinkRow.querySelector('div');

  const yearLogoDiv = document.createElement('div');
  yearLogoDiv.classList.add('logo', 'year-80-logo');
  const yearLogoAnchor = document.createElement('a');
  const foundYearLogoLink = yearLogoLinkCell?.querySelector('a');
  if (foundYearLogoLink) yearLogoAnchor.href = foundYearLogoLink.href;
  const yearLogoPicture = yearLogoCell?.querySelector('picture');
  if (yearLogoPicture) {
    const img = yearLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    yearLogoAnchor.append(optimizedPic);
  }
  moveInstrumentation(yearLogoRow, yearLogoAnchor);
  moveInstrumentation(yearLogoLinkRow, yearLogoAnchor);
  yearLogoDiv.appendChild(yearLogoAnchor);
  wrap.appendChild(yearLogoDiv);

  // Separate fixed fields from item rows
  const itemRows = rows.slice(4);

  const navigationItems = itemRows.filter((row) => row.children.length === 7);
  const iconNavItems = itemRows.filter((row) => row.children.length === 4 && row.querySelector('picture'));
  const searchItems = itemRows.filter((row) => row.children.length === 8);
  const pressReleaseItems = itemRows.filter((row) => row.children.length === 4 && !row.querySelector('picture'));

  // Navigation Menu Items
  navigationItems.forEach((row) => {
    const [labelCell, linkCell, iconCell, hierarchyCell, headingCell, descriptionCell, subDescriptionCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(linkCell, anchor);
    li.appendChild(anchor);

    const iconSpan = document.createElement('span');
    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      iconSpan.appendChild(optimizedPic);
    }
    li.appendChild(iconSpan);

    const megaMenu = document.createElement('div');
    megaMenu.classList.add('mega-menu');
    const megaMenuWrap = document.createElement('div');
    megaMenuWrap.classList.add('wrap', 'container');
    megaMenu.appendChild(megaMenuWrap);
    const centerDiv = document.createElement('div');
    centerDiv.classList.add('center-div');
    megaMenuWrap.appendChild(centerDiv);

    const leftDiv = document.createElement('div');
    leftDiv.classList.add('left-div');
    centerDiv.appendChild(leftDiv);

    const heading = document.createElement('h4');
    heading.classList.add('left-div-heading');
    const headingAnchor = document.createElement('a');
    headingAnchor.textContent = headingCell?.textContent.trim() || '';
    heading.appendChild(headingAnchor);
    leftDiv.appendChild(heading);

    const description = document.createElement('p');
    description.classList.add('left-div-desc');
    description.textContent = descriptionCell?.textContent.trim() || '';
    leftDiv.appendChild(description);

    const subDescription = document.createElement('p');
    subDescription.classList.add('left-div-subdesc');
    subDescription.textContent = subDescriptionCell?.textContent.trim() || '';
    leftDiv.appendChild(subDescription);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap', 'about-us-sub-nav');
    centerDiv.appendChild(subNavWrap);

    // Handle hierarchy-tree richtext
    const hierarchyContent = hierarchyCell?.innerHTML || '';
    if (hierarchyContent) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyContent;
      moveInstrumentation(hierarchyCell, tempDiv); // Instrument the original cell to the temp div

      // Apply classes to nested elements as per ORIGINAL HTML
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('sub-nav-wrap-one-link')); // Example from ORIGINAL HTML
      tempDiv.querySelectorAll('li').forEach(liItem => {
        liItem.classList.add('top-level-li'); // Example from ORIGINAL HTML
        const liAnchor = liItem.querySelector('a');
        if (liAnchor) {
          // No specific class for anchor in hierarchy-tree in ORIGINAL HTML, but if there was, it would be added here
        }
      });

      // Transform nested lists
      tempDiv.querySelectorAll('ul').forEach(transformNestedLists);

      // Append children from tempDiv to subNavWrap
      while (tempDiv.firstChild) {
        subNavWrap.appendChild(tempDiv.firstChild);
      }
    }
    li.appendChild(megaMenu);
    navUl.appendChild(li);
    moveInstrumentation(row, li);
  });

  // Icon Nav Items (Mobile and Desktop)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.appendChild(mobileIconUl);

  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.appendChild(desktopIconUl);

  iconNavItems.forEach((row) => {
    const [iconCell, linkCell, labelCell, hierarchyCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('mail'); // Assuming 'mail' class for icon nav items based on original HTML
    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      anchor.appendChild(optimizedPic);
    }
    anchor.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(linkCell, anchor);
    li.appendChild(anchor);

    // Handle hierarchy-tree richtext
    const hierarchyContent = hierarchyCell?.innerHTML || '';
    if (hierarchyContent) {
      const dropdown = document.createElement('div');
      dropdown.classList.add('has-sub-child'); // Class from ORIGINAL HTML

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyContent;
      moveInstrumentation(hierarchyCell, tempDiv); // Instrument the original cell to the temp div

      // Apply classes to nested elements as per ORIGINAL HTML
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('sub-nav-wrap-one-link')); // Example from ORIGINAL HTML
      tempDiv.querySelectorAll('li').forEach(liItem => {
        liItem.classList.add('top-level-li'); // Example from ORIGINAL HTML
        const liAnchor = liItem.querySelector('a');
        if (liAnchor) {
          // No specific class for anchor in hierarchy-tree in ORIGINAL HTML, but if there was, it would be added here
        }
      });

      // Transform nested lists
      tempDiv.querySelectorAll('ul').forEach(transformNestedLists);

      // Append children from tempDiv to dropdown
      while (tempDiv.firstChild) {
        dropdown.appendChild(tempDiv.firstChild);
      }
      li.appendChild(dropdown);

      // Add click listener to toggle dropdown
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        dropdown.classList.toggle('active');
      });
    }

    const liMobile = li.cloneNode(true);
    const liDesktop = li.cloneNode(true);

    mobileIconUl.appendChild(liMobile);
    desktopIconUl.appendChild(liDesktop);
    moveInstrumentation(row, li); // Instrumentation on the original row, not cloned elements
  });

  // Search Items
  searchItems.forEach((row) => {
    const [searchFormActionCell, searchInputNameCell, searchPlaceholderCell,
      searchIconCell, submitLabelCell, submitIconCell, popularKeywordsCell, recommendedKeywordsCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('search');
    li.setAttribute('data-once', 'search-toggle search-stop-propagation');

    const searchTrigger = document.createElement('a');
    searchTrigger.href = '#';
    searchTrigger.setAttribute('data-once', 'search-stop-propagation');

    const searchIconPicture = searchIconCell?.querySelector('picture');
    if (searchIconPicture) {
      const img = searchIconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      searchTrigger.appendChild(optimizedPic);
    }
    // The original HTML has two img tags for search icon, one for default, one for active.
    // The current code only takes the first picture. If there's a second picture, it should be handled.
    // For now, assuming the second picture is for the active state and will be toggled via CSS.
    // If the model provides two distinct icons, this logic needs to be updated.
    const searchSpan = document.createElement('span');
    searchSpan.setAttribute('data-once', 'search-stop-propagation');
    searchSpan.textContent = ' Search'; // Hardcoded from original HTML
    searchTrigger.appendChild(searchSpan);
    li.appendChild(searchTrigger);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
    const searchWrapInner = document.createElement('div');
    searchWrapInner.classList.add('wrap');
    searchWrapInner.setAttribute('data-once', 'search-stop-propagation');
    searchScreenWrap.appendChild(searchWrapInner);

    const searchForm = document.createElement('form');
    const foundFormAction = searchFormActionCell?.querySelector('a');
    if (foundFormAction) searchForm.action = foundFormAction.href;
    searchForm.method = 'get';
    searchForm.id = 'search-block-form';
    searchForm.setAttribute('accept-charset', 'UTF-8');
    searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
    searchForm.setAttribute('data-once', 'search-stop-propagation');
    searchWrapInner.appendChild(searchForm);

    const searchInputWrap = document.createElement('div');
    searchInputWrap.classList.add('search-wrap');
    searchInputWrap.setAttribute('data-once', 'search-stop-propagation');
    searchForm.appendChild(searchInputWrap);

    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
    const searchIconImg = document.createElement('img');
    // Assuming a specific search icon from original HTML
    searchIconImg.alt = 'svg file';
    searchIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776279681374.svg+xml';
    searchIconDiv.appendChild(searchIconImg);
    searchInputWrap.appendChild(searchIconDiv);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext');
    searchInput.required = true;
    searchInput.name = searchInputNameCell?.textContent.trim() || 'key';
    searchInput.id = 'searchInput';
    searchInput.autocomplete = 'off';
    searchInput.placeholder = searchPlaceholderCell?.textContent.trim() || '';
    searchInput.setAttribute('data-once', 'search-stop-propagation');
    searchInputWrap.appendChild(searchInput);

    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    submitButton.setAttribute('data-once', 'search-stop-propagation');
    const submitLabelDiv = document.createElement('div');
    submitLabelDiv.classList.add('label');
    submitLabelDiv.setAttribute('data-once', 'search-stop-propagation');
    submitLabelDiv.textContent = submitLabelCell?.textContent.trim() || 'Submit';
    submitButton.appendChild(submitLabelDiv);

    const submitIconPicture = submitIconCell?.querySelector('picture');
    if (submitIconPicture) {
      const img = submitIconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      submitButton.appendChild(optimizedPic);
    }
    searchInputWrap.appendChild(submitButton);

    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.style.display = 'none';
    searchResultBox.setAttribute('data-once', 'search-stop-propagation');
    searchForm.appendChild(searchResultBox);

    const popularKeywordsWrap = document.createElement('div');
    popularKeywordsWrap.classList.add('search-suggestions-wrap');
    popularKeywordsWrap.setAttribute('data-once', 'search-stop-propagation');
    const popularLabel = document.createElement('div');
    popularLabel.classList.add('label');
    popularLabel.setAttribute('data-once', 'search-stop-propagation');
    popularLabel.textContent = 'Popular Keywords:';
    popularKeywordsWrap.appendChild(popularLabel);
    const popularTokensWrap = document.createElement('div');
    popularTokensWrap.classList.add('tokens-wrap');
    popularTokensWrap.setAttribute('data-once', 'search-stop-propagation');
    popularTokensWrap.innerHTML = popularKeywordsCell?.innerHTML || '';
    popularKeywordsWrap.appendChild(popularTokensWrap);
    searchWrapInner.appendChild(popularKeywordsWrap);

    const recommendedKeywordsWrap = document.createElement('div');
    recommendedKeywordsWrap.classList.add('search-suggestions-wrap');
    recommendedKeywordsWrap.setAttribute('data-once', 'search-stop-propagation');
    const recommendedLabel = document.createElement('div');
    recommendedLabel.classList.add('label');
    recommendedLabel.setAttribute('data-once', 'search-stop-propagation');
    recommendedLabel.textContent = 'Recommended for you:';
    recommendedKeywordsWrap.appendChild(recommendedLabel);
    const recommendedTokensWrap = document.createElement('div');
    recommendedTokensWrap.classList.add('tokens-wrap');
    recommendedTokensWrap.setAttribute('data-once', 'search-stop-propagation');
    recommendedTokensWrap.innerHTML = recommendedKeywordsCell?.innerHTML || '';
    recommendedKeywordsWrap.appendChild(recommendedTokensWrap);
    searchWrapInner.appendChild(recommendedKeywordsWrap);

    li.appendChild(searchScreenWrap);

    // Toggle search screen on trigger click
    searchTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchScreenWrap.classList.toggle('active');
    });

    // Close search on click outside
    searchScreenWrap.addEventListener('click', (e) => {
      if (e.target === searchScreenWrap) {
        searchScreenWrap.classList.remove('active');
      }
    });

    mobileIconUl.appendChild(li.cloneNode(true));
    desktopIconUl.appendChild(li);
    moveInstrumentation(row, li);
  });

  nav.appendChild(mobileIconNav);
  nav.appendChild(desktopIconNav);

  // Press Releases (inside newsroom mega menu)
  const newsroomLi = navUl.querySelector('li[itemprop="name"] a[href*="newsroom"]')
    ?.closest('li');
  if (newsroomLi) {
    // Find the existing .latest-two-press-release div within the newsroom mega menu
    let latestPressReleaseDiv = newsroomLi.querySelector('.latest-two-press-release');
    if (!latestPressReleaseDiv) {
      // If it doesn't exist, create it and append it to the left-div of the newsroom mega menu
      const newsroomLeftDiv = newsroomLi.querySelector('.left-div.newsroom-left-div');
      if (newsroomLeftDiv) {
        latestPressReleaseDiv = document.createElement('div');
        latestPressReleaseDiv.classList.add('latest-two-press-release');
        newsroomLeftDiv.appendChild(latestPressReleaseDiv);
      }
    }

    if (latestPressReleaseDiv) {
      latestPressReleaseDiv.innerHTML = ''; // Clear existing content
      pressReleaseItems.forEach((row) => {
        const [linkCell, titleCell, dateCell, categoryCell] = [...row.children];

        const slidesDiv = document.createElement('div');
        slidesDiv.classList.add('slides');
        const wrapDiv = document.createElement('div');
        wrapDiv.classList.add('wrap');
        slidesDiv.appendChild(wrapDiv);
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        wrapDiv.appendChild(contentDiv);
        const descDiv = document.createElement('div');
        descDiv.classList.add('desc');
        contentDiv.appendChild(descDiv);

        const p = document.createElement('p');
        const anchor = document.createElement('a');
        const foundLink = linkCell?.querySelector('a');
        if (foundLink) anchor.href = foundLink.href;
        anchor.textContent = titleCell?.textContent.trim() || '';
        p.appendChild(anchor);
        descDiv.appendChild(p);

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        const dateEm = document.createElement('em');
        const time = document.createElement('time');
        time.setAttribute('datetime', dateCell?.textContent.trim() || '');
        time.textContent = dateCell?.textContent.trim() || '';
        dateEm.appendChild(time);
        dateDiv.appendChild(dateEm);
        const categoryEm = document.createElement('em');
        categoryEm.textContent = categoryCell?.textContent.trim() || '';
        dateDiv.appendChild(categoryEm);
        descDiv.appendChild(dateDiv);
        latestPressReleaseDiv.appendChild(slidesDiv);
        moveInstrumentation(row, slidesDiv);
      });
    }
  }

  block.replaceWith(header);

  // Hamburger click listener
  const hamburger = header.querySelector('.hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      header.classList.toggle('active');
      nav.classList.toggle('active');
      hamburger.classList.toggle('active');
      document.body.classList.toggle('disable-scroll');
    });
  }
}
