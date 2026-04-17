import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function transformNestedLists(rootUl) {
  rootUl.querySelectorAll('li').forEach((li) => {
    // Add classes from ORIGINAL HTML for <li> elements
    li.classList.add('top-level-li'); // Example, adjust based on actual HTML structure
    const nested = li.querySelector(':scope > ul');
    const anchor = li.querySelector(':scope > a');

    if (anchor) {
      // Add classes from ORIGINAL HTML for <a> elements
      anchor.classList.add('nav-menu-item'); // Example, adjust based on actual HTML structure
    } else {
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
      // Add classes from ORIGINAL HTML for <ul> elements
      nested.classList.add('sub-menu'); // Example, adjust based on actual HTML structure
      nested.remove();
      const subWrap = document.createElement('div');
      subWrap.classList.add('has-sub-child'); // Class from ORIGINAL HTML
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
      transformNestedLists(nested); // Recursively transform nested lists
    }
  });
}

export default function decorate(block) {
  const [
    logoRow,
    logoLinkRow,
    logo80Row,
    logo80LinkRow,
    ...itemRows
  ] = [...block.children];

  block.innerHTML = '';
  block.classList.add('with-marquee', 'solid');

  const container = document.createElement('div');
  container.classList.add('container');
  block.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Primary Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  const logoAnchor = document.createElement('a');
  const primaryLogoLink = logoLinkRow.querySelector('a');
  if (primaryLogoLink) logoAnchor.href = primaryLogoLink.href;
  const primaryLogoPicture = logoRow.querySelector('picture');
  if (primaryLogoPicture) {
    const img = primaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(primaryLogoPicture, optimizedPic.querySelector('img'));
    logoAnchor.append(optimizedPic);
  }
  logoAnchor.querySelector('img')?.classList.add('hiddenlogo1');
  moveInstrumentation(logoRow, logoAnchor);
  moveInstrumentation(logoLinkRow, logoAnchor);
  logoDiv.append(logoAnchor);
  wrap.append(logoDiv);

  // Hamburger
  const hamburger = document.createElement('div');
  hamburger.classList.add('hamburger');
  const ulHamburger = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    ulHamburger.append(document.createElement('li'));
  }
  hamburger.append(ulHamburger);
  wrap.append(hamburger);

  const mainNav = document.createElement('nav');
  mainNav.classList.add('main-nav');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  mainNav.append(navUl);
  wrap.append(mainNav);

  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  const ulIconNavMobile = document.createElement('ul');
  iconNavMobile.append(ulIconNavMobile);

  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  const ulIconNavDesktop = document.createElement('ul');
  iconNavDesktop.append(ulIconNavDesktop);

  const logo80Div = document.createElement('div');
  logo80Div.classList.add('logo', 'year-80-logo');
  const logo80Anchor = document.createElement('a');
  const link80 = logo80LinkRow.querySelector('a');
  if (link80) logo80Anchor.href = link80.href;
  const picture80 = logo80Row.querySelector('picture');
  if (picture80) {
    const img80 = picture80.querySelector('img');
    const optimizedPic80 = createOptimizedPicture(img80.src, img80.alt, false, [{ width: '74' }]);
    moveInstrumentation(picture80, optimizedPic80.querySelector('img'));
    logo80Anchor.append(optimizedPic80);
  }
  logo80Anchor.querySelector('img')?.classList.add('hiddenlogo1', 'years-80');
  moveInstrumentation(logo80Row, logo80Anchor);
  moveInstrumentation(logo80LinkRow, logo80Anchor);
  logo80Div.append(logo80Anchor);
  wrap.append(logo80Div);

  // Filter item rows based on the number of children and content type
  const navigationItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 7 && cells[3].querySelector('ul'); // hierarchy-tree is a richtext with <ul>
  });
  const pressReleaseItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 4 && !cells[3].querySelector('ul'); // Press release has 4 cells, no hierarchy-tree
  });
  const contactLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[2].querySelector('picture'); // Contact link has 3 cells, last is icon
  });
  // Search suggestions have 1 cell. They are split into popular and recommended later.
  const searchSuggestionItems = itemRows.filter((row) => row.children.length === 1);

  // Navigation Menu Items
  navigationItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture') && !cell.querySelector('ul'));
    const linkCell = cells.find(cell => cell.querySelector('a') && !cell.querySelector('picture'));
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));
    const leftDivHeadingCell = cells.filter(cell => !cell.querySelector('a') && !cell.querySelector('picture') && !cell.querySelector('ul'))[1]; // Assuming second text cell
    const leftDivDescCell = cells.filter(cell => !cell.querySelector('a') && !cell.querySelector('picture') && !cell.querySelector('ul'))[2]; // Assuming third text cell
    const leftDivSubDescCell = cells.filter(cell => !cell.querySelector('a') && !cell.querySelector('picture') && !cell.querySelector('ul'))[3]; // Assuming fourth text cell

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) anchor.href = foundLink.href;
    if (labelCell) anchor.textContent = labelCell.textContent.trim();
    li.append(anchor);

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const iconSpan = document.createElement('span');
      const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '24' }]);
      moveInstrumentation(iconPicture, optimizedIcon.querySelector('img'));
      iconSpan.append(optimizedIcon);
      li.append(iconSpan);
    }
    moveInstrumentation(row, li);

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
    const leftDivHeading = document.createElement('h4');
    leftDivHeading.classList.add('left-div-heading');
    const headingAnchor = document.createElement('a');
    if (leftDivHeadingCell) headingAnchor.textContent = leftDivHeadingCell.textContent.trim();
    leftDivHeading.append(headingAnchor);
    leftDiv.append(leftDivHeading);

    const leftDivDesc = document.createElement('p');
    leftDivDesc.classList.add('left-div-desc');
    if (leftDivDescCell) leftDivDesc.textContent = leftDivDescCell.textContent.trim();
    leftDiv.append(leftDivDesc);

    const leftDivSubDesc = document.createElement('p');
    leftDivSubDesc.classList.add('left-div-subdesc');
    if (leftDivSubDescCell) leftDivSubDesc.textContent = leftDivSubDescCell.textContent.trim();
    leftDiv.append(leftDivSubDesc);
    centerDiv.append(leftDiv);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap');
    const labelText = labelCell?.textContent.trim().toLowerCase();
    if (labelText === 'who we are') {
      subNavWrap.classList.add('about-us-sub-nav');
    } else if (labelText === 'what we do') {
      subNavWrap.classList.add('what-we-do');
    } else if (labelText === 'investor relations') {
      leftDiv.classList.add('ir-left-div');
      subNavWrap.classList.add('element-block');
    } else if (labelText === 'newsroom') {
      leftDiv.classList.add('newsroom-left-div');
    } else if (labelText === 'careers') {
      leftDiv.classList.add('career-left-div');
      subNavWrap.classList.add('careers-div');
    }
    centerDiv.append(subNavWrap);

    if (hierarchyCell) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv);

      // Apply classes to nested elements from ORIGINAL HTML
      tempDiv.querySelectorAll('ul').forEach(ul => ul.classList.add('sub-menu')); // Example class
      tempDiv.querySelectorAll('li').forEach(li => li.classList.add('list-item')); // Example class
      tempDiv.querySelectorAll('a').forEach(a => a.classList.add('nav-link')); // Example class

      while (tempDiv.firstChild) {
        subNavWrap.append(tempDiv.firstChild);
      }
      transformNestedLists(subNavWrap.querySelector('ul')); // Only call if a UL exists
    }

    li.append(megaMenu);
    navUl.append(li);

    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      li.classList.toggle('active');
    });
  });

  // Newsroom specific content
  const newsroomLi = navUl.querySelector('li a[itemprop="url"][href*="newsroom"]')
    ?.closest('li');
  if (newsroomLi) {
    const newsroomLeftDiv = newsroomLi.querySelector('.newsroom-left-div');
    if (newsroomLeftDiv) {
      const latestPressReleaseDiv = document.createElement('div');
      latestPressReleaseDiv.classList.add('latest-two-press-release');
      newsroomLeftDiv.append(latestPressReleaseDiv);

      pressReleaseItems.forEach((row) => {
        const cells = [...row.children];
        const titleCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));
        const linkCell = cells.find(cell => cell.querySelector('a'));
        const dateCell = cells.filter(cell => !cell.querySelector('a') && !cell.querySelector('picture'))[1];
        const categoryCell = cells.filter(cell => !cell.querySelector('a') && !cell.querySelector('picture'))[2];

        const slidesDiv = document.createElement('div');
        slidesDiv.classList.add('slides');
        const wrapDiv = document.createElement('div');
        wrapDiv.classList.add('wrap');
        slidesDiv.append(wrapDiv);
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('content');
        wrapDiv.append(contentDiv);
        const descDiv = document.createElement('div');
        descDiv.classList.add('desc');
        contentDiv.append(descDiv);

        const titleP = document.createElement('p');
        const titleAnchor = document.createElement('a');
        const foundLink = linkCell?.querySelector('a');
        if (foundLink) titleAnchor.href = foundLink.href;
        if (titleCell) titleAnchor.textContent = titleCell.textContent.trim();
        titleP.append(titleAnchor);
        descDiv.append(titleP);

        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date');
        const dateEm = document.createElement('em');
        if (dateCell) dateEm.textContent = dateCell.textContent.trim();
        dateDiv.append(dateEm);
        const categoryEm = document.createElement('em');
        if (categoryCell) categoryEm.textContent = categoryCell.textContent.trim();
        dateDiv.append(categoryEm);
        descDiv.append(dateDiv);
        moveInstrumentation(row, slidesDiv);
        latestPressReleaseDiv.append(slidesDiv);
      });
    }
  }

  // Contact Links
  const contactMailLi = document.createElement('li');
  contactMailLi.classList.add('mail');
  ulIconNavMobile.append(contactMailLi.cloneNode(true));
  ulIconNavDesktop.append(contactMailLi);

  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const iconCell = cells.find(cell => cell.querySelector('picture'));

    const link = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) link.href = foundLink.href;

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '24' }]);
      moveInstrumentation(iconPicture, optimizedIcon.querySelector('img'));
      link.append(optimizedIcon);
    }
    if (labelCell) link.append(labelCell.textContent.trim());
    moveInstrumentation(row, link);

    if (labelCell?.textContent.trim().toLowerCase() === 'contact us') {
      ulIconNavMobile.querySelector('.mail').append(link.cloneNode(true));
      ulIconNavDesktop.querySelector('.mail').append(link);
    }
  });

  // Search Functionality
  const searchLiMobile = document.createElement('li');
  searchLiMobile.classList.add('search');
  const searchLiDesktop = searchLiMobile.cloneNode(true);

  const searchAnchorMobile = document.createElement('a');
  searchAnchorMobile.href = '#';
  const searchImg1Mobile = document.createElement('img');
  searchImg1Mobile.alt = 'svg file';
  searchImg1Mobile.src = '/content/dam/aemigrate/uploaded-folder/image/1776425008627.svg+xml';
  const searchImg2Mobile = document.createElement('img');
  searchImg2Mobile.alt = 'svg file';
  searchImg2Mobile.src = '/content/dam/aemigrate/uploaded-folder/image/1776425008674.svg+xml';
  const searchSpanMobile = document.createElement('span');
  searchSpanMobile.textContent = ' Search';
  searchAnchorMobile.append(searchImg1Mobile, searchImg2Mobile, searchSpanMobile);
  searchLiMobile.append(searchAnchorMobile);

  const searchAnchorDesktop = searchAnchorMobile.cloneNode(true);
  searchAnchorDesktop.querySelector('span')?.remove(); // Desktop search has no text label
  searchLiDesktop.append(searchAnchorDesktop);

  const searchScreenWrap = document.createElement('div');
  searchScreenWrap.classList.add('search-screen-wrap');
  const searchWrapInner = document.createElement('div');
  searchWrapInner.classList.add('wrap');
  searchScreenWrap.append(searchWrapInner);

  const searchForm = document.createElement('form');
  searchForm.action = 'https://www.mahindra.com/search';
  searchForm.method = 'get';
  searchForm.id = 'search-block-form';
  searchForm.setAttribute('accept-charset', 'UTF-8');
  searchWrapInner.append(searchForm);

  const searchInputWrap = document.createElement('div');
  searchInputWrap.classList.add('search-wrap');
  searchForm.append(searchInputWrap);

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('search-icon');
  const searchIconImg = document.createElement('img');
  searchIconImg.alt = 'svg file';
  searchIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776425008715.svg+xml';
  searchIconDiv.append(searchIconImg);
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
  submitLabel.textContent = ' Submit ';
  const submitImg = document.createElement('img');
  submitImg.alt = 'svg file';
  submitImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776425008893.svg+xml';
  submitButton.append(submitLabel, submitImg);
  searchInputWrap.append(submitButton);

  const searchResultBox = document.createElement('div');
  searchResultBox.classList.add('searchResultBox');
  searchResultBox.style.display = 'none'; // Initially hidden
  searchForm.append(searchResultBox);

  // Popular Keywords
  const popularSuggestionsWrap = document.createElement('div');
  popularSuggestionsWrap.classList.add('search-suggestions-wrap');
  const popularLabel = document.createElement('div');
  popularLabel.classList.add('label');
  popularLabel.textContent = 'Popular Keywords:';
  popularSuggestionsWrap.append(popularLabel);
  const popularTokensWrap = document.createElement('div');
  popularTokensWrap.classList.add('tokens-wrap');
  const popularUl = document.createElement('ul');
  popularTokensWrap.append(popularUl);
  popularSuggestionsWrap.append(popularTokensWrap);
  searchWrapInner.append(popularSuggestionsWrap);

  // Assuming the first half of searchSuggestionItems are "Popular" and the second half are "Recommended"
  const popularSearchSuggestions = searchSuggestionItems.slice(0, Math.ceil(searchSuggestionItems.length / 2));
  popularSearchSuggestions.forEach((row) => {
    const suggestionCell = [...row.children][0];
    const li = document.createElement('li');
    li.textContent = suggestionCell.textContent.trim();
    popularUl.append(li);
    moveInstrumentation(row, li);
  });

  // Recommended for you
  const recommendedSuggestionsWrap = document.createElement('div');
  recommendedSuggestionsWrap.classList.add('search-suggestions-wrap');
  const recommendedLabel = document.createElement('div');
  recommendedLabel.classList.add('label');
  recommendedLabel.textContent = 'Recommended for you:';
  recommendedSuggestionsWrap.append(recommendedLabel);
  const recommendedTokensWrap = document.createElement('div');
  recommendedTokensWrap.classList.add('tokens-wrap');
  const recommendedUl = document.createElement('ul');
  recommendedTokensWrap.append(recommendedUl);
  recommendedSuggestionsWrap.append(recommendedTokensWrap);
  searchWrapInner.append(recommendedSuggestionsWrap);

  const recommendedSearchSuggestions = searchSuggestionItems.slice(Math.ceil(searchSuggestionItems.length / 2));
  recommendedSearchSuggestions.forEach((row) => {
    const suggestionCell = [...row.children][0];
    const li = document.createElement('li');
    li.textContent = suggestionCell.textContent.trim();
    recommendedUl.append(li);
    moveInstrumentation(row, li);
  });

  searchLiMobile.append(searchScreenWrap.cloneNode(true));
  searchLiDesktop.append(searchScreenWrap);

  ulIconNavMobile.append(searchLiMobile);
  ulIconNavDesktop.append(searchLiDesktop);

  mainNav.append(iconNavMobile, iconNavDesktop);

  // Event Listeners for search toggle
  const searchTriggers = block.querySelectorAll('.search > a');
  const searchScreens = block.querySelectorAll('.search-screen-wrap');

  searchTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const parentLi = trigger.closest('li.search');
      parentLi.classList.toggle('active');
      const targetScreen = parentLi.querySelector('.search-screen-wrap');
      if (targetScreen) {
        targetScreen.classList.toggle('active');
        targetScreen.style.display = targetScreen.classList.contains('active') ? 'block' : 'none';
      }
    });
  });

  searchScreens.forEach((screen) => {
    screen.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent clicks inside search screen from closing it
    });
  });

  document.addEventListener('click', (e) => {
    searchScreens.forEach((screen) => {
      if (screen.classList.contains('active') && !screen.contains(e.target)) {
        screen.classList.remove('active');
        screen.style.display = 'none';
        screen.closest('li.search')?.classList.remove('active');
      }
    });
  });

  // Hamburger menu toggle
  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    hamburger.classList.toggle('active');
    block.classList.toggle('active');
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
