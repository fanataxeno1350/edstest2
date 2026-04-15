import { createOptimizedPicture } from '../../scripts/aem.js';
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
      // Use class from ORIGINAL HTML: 'has-sub-child'
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
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Identify root rows based on their content and position
  const logoRow = children[0];
  const logoLinkRow = children[1];
  const anniversaryLogoRow = children[2];
  const anniversaryLogoLinkRow = children[3];

  // Remaining rows are item rows for containers
  const itemRows = children.slice(4);

  block.innerHTML = '';
  block.classList.add('with-marquee', 'solid', 'nav-up');

  const headerContainer = document.createElement('div');
  headerContainer.classList.add('container');
  block.append(headerContainer);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  headerContainer.append(wrapDiv);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  wrapDiv.append(logoDiv);

  const logoLink = document.createElement('a');
  const originalLogoLink = logoLinkRow.querySelector('a');
  if (originalLogoLink) {
    logoLink.href = originalLogoLink.href;
    moveInstrumentation(logoLinkRow, logoLink);
  } else {
    logoLink.href = '#';
  }

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
        { width: '200' },
      ]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('hiddenlogo1');
    }
  }
  logoDiv.append(logoLink);

  // Hamburger
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburgerDiv.append(hamburgerUl);
  wrapDiv.append(hamburgerDiv);

  // Add event listener for hamburger menu
  hamburgerDiv.addEventListener('click', () => {
    block.classList.toggle('active'); // Toggle 'active' class on the main block for menu visibility
    hamburgerDiv.classList.toggle('active'); // Toggle 'active' on hamburger for animation
    document.body.classList.toggle('no-scroll'); // Prevent scrolling when menu is open
  });

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  wrapDiv.append(nav);

  const navigationUl = document.createElement('ul');
  navigationUl.setAttribute('itemscope', '');
  navigationUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navigationUl);

  // Navigation Items (7 cells: label, link, icon, hierarchy-tree, leftHeading, leftDesc, leftSubdesc)
  const navigationItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 7 && cells[3].querySelector('ul'); // hierarchy-tree is a richtext with ul
  });

  navigationItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture') && !cell.querySelector('ul'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));
    const otherTextCells = cells.filter(cell => !cell.querySelector('a') && !cell.querySelector('picture') && !cell.querySelector('ul') && cell !== labelCell);

    const leftHeadingCell = otherTextCells[0];
    const leftDescCell = otherTextCells[1];
    const leftSubdescCell = otherTextCells[2];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.setAttribute('itemprop', 'url');
    } else {
      anchor.href = '#';
    }
    anchor.textContent = labelCell?.textContent.trim() || '';
    li.append(anchor);

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      if (img) {
        const span = document.createElement('span');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
          { width: '24' },
        ]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        span.append(optimizedPic);
        li.append(span);
      }
    }

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
    const leftHeadingLink = document.createElement('a');
    leftHeadingLink.textContent = leftHeadingCell?.textContent.trim() || '';
    leftHeading.append(leftHeadingLink);
    leftDiv.append(leftHeading);

    const leftDesc = document.createElement('p');
    leftDesc.classList.add('left-div-desc');
    leftDesc.textContent = leftDescCell?.textContent.trim() || '';
    leftDiv.append(leftDesc);

    const leftSubdesc = document.createElement('p');
    leftSubdesc.classList.add('left-div-subdesc');
    leftSubdesc.textContent = leftSubdescCell?.textContent.trim() || '';
    leftDiv.append(leftSubdesc);

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

    const hierarchyRoot = hierarchyCell?.querySelector('ul');
    if (hierarchyRoot) {
      // Create a temporary div to hold the innerHTML and apply classes
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv

      // Apply classes to nested elements as per ORIGINAL HTML
      tempDiv.querySelectorAll('ul').forEach(ul => {
        // No specific classes on ULs in ORIGINAL HTML for hierarchy-tree, but keep if needed
      });
      tempDiv.querySelectorAll('li').forEach(liItem => {
        // Example: if ORIGINAL HTML had specific classes for li, add them here
        // liItem.classList.add('nav-menu-item', 'list-item');
      });
      tempDiv.querySelectorAll('a').forEach(a => {
        // Example: if ORIGINAL HTML had specific classes for a, add them here
        // a.classList.add('nav-link');
      });

      // Move children from tempDiv to subNavWrap
      while (tempDiv.firstChild) {
        subNavWrap.append(tempDiv.firstChild);
      }
      // Call transformNestedLists on the new hierarchyRoot within subNavWrap
      // Note: hierarchyRoot is now a child of subNavWrap, so we need to re-select it
      const newHierarchyRoot = subNavWrap.querySelector('ul');
      if (newHierarchyRoot) {
        transformNestedLists(newHierarchyRoot);
      }
    }

    navigationUl.append(li);
  });

  // Press Releases (latest two) (4 cells: link, title, date, category)
  const pressReleaseItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 4 && cells[0].querySelector('a') && !cells[2].querySelector('picture'); // Link, Title, Date, Category
  });

  if (pressReleaseItems.length > 0) {
    // Find the 'Newsroom' menu item dynamically
    const newsroomMenuItem = [...navigationUl.children].find(
      (li) => li.querySelector('a')?.textContent.trim().toLowerCase() === 'newsroom',
    );

    if (newsroomMenuItem) {
      const newsroomLeftDiv = newsroomMenuItem.querySelector('.newsroom-left-div');
      if (newsroomLeftDiv) {
        const latestTwoPressReleaseDiv = document.createElement('div');
        latestTwoPressReleaseDiv.classList.add('latest-two-press-release');
        newsroomLeftDiv.append(latestTwoPressReleaseDiv);

        pressReleaseItems.slice(0, 2).forEach((row) => {
          const cells = [...row.children];
          const prLinkCell = cells.find(cell => cell.querySelector('a'));
          const prTitleCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture') && cells.indexOf(cell) === 1);
          const prDateCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture') && cells.indexOf(cell) === 2);
          const prCategoryCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture') && cells.indexOf(cell) === 3);

          const slidesDiv = document.createElement('div');
          slidesDiv.classList.add('slides');
          latestTwoPressReleaseDiv.append(slidesDiv);

          const slideWrap = document.createElement('div');
          slideWrap.classList.add('wrap');
          slidesDiv.append(slideWrap);

          const contentDiv = document.createElement('div');
          contentDiv.classList.add('content');
          slideWrap.append(contentDiv);

          const descDiv = document.createElement('div');
          descDiv.classList.add('desc');
          contentDiv.append(descDiv);

          const titleP = document.createElement('p');
          const prAnchor = document.createElement('a');
          const originalPrLink = prLinkCell?.querySelector('a');
          if (originalPrLink) {
            prAnchor.href = originalPrLink.href;
            moveInstrumentation(prLinkCell, prAnchor);
          } else {
            prAnchor.href = '#';
          }
          prAnchor.textContent = prTitleCell?.textContent.trim() || '';
          titleP.append(prAnchor);
          descDiv.append(titleP);

          const dateDiv = document.createElement('div');
          dateDiv.classList.add('date');
          const dateEm = document.createElement('em');
          dateEm.textContent = prDateCell?.textContent.trim() || '';
          dateDiv.append(dateEm);
          const categoryEm = document.createElement('em');
          categoryEm.textContent = prCategoryCell?.textContent.trim() || '';
          dateDiv.append(categoryEm);
          descDiv.append(dateDiv);
        });
      }
    }
  }

  // Icon Nav (Mobile)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  navigationUl.append(mobileIconNav);

  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);

  // Contact Links (3 cells: icon, link, label)
  const contactLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('picture') && cells[1].querySelector('a') && !cells[2].querySelector('picture');
  });

  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    const li = document.createElement('li');
    li.classList.add('mail');
    mobileIconUl.append(li);

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      moveInstrumentation(linkCell, anchor);
    } else {
      anchor.href = '#';
    }

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
          { width: '24' },
        ]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
      }
    }
    anchor.append(labelCell?.textContent.trim() || '');
    li.append(anchor);
  });

  // Search Links (3 cells: icon1, icon2, link) - distinguished by having two pictures
  const searchLinkItems = itemRows.filter((row) => {
    const cells = [...row.children];
    const pictures = cells.filter(cell => cell.querySelector('picture'));
    return cells.length === 3 && pictures.length === 2 && cells.some(cell => cell.querySelector('a'));
  });

  searchLinkItems.forEach((row) => {
    const cells = [...row.children];
    const icon1Cell = cells.find(cell => cell.querySelector('picture') && cells.indexOf(cell) === 0);
    const icon2Cell = cells.find(cell => cell.querySelector('picture') && cells.indexOf(cell) === 1);
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const li = document.createElement('li');
    li.classList.add('search');
    mobileIconUl.append(li);

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      moveInstrumentation(linkCell, anchor);
    } else {
      anchor.href = '#';
    }

    const icon1Picture = icon1Cell?.querySelector('picture');
    if (icon1Picture) {
      const img = icon1Picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
          { width: '24' },
        ]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
      }
    }
    const icon2Picture = icon2Cell?.querySelector('picture');
    if (icon2Picture) {
      const img = icon2Picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
          { width: '24' },
        ]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
      }
    }
    const searchSpan = document.createElement('span');
    searchSpan.textContent = ' Search';
    anchor.append(searchSpan);
    li.append(anchor);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    li.append(searchScreenWrap);

    const searchWrapInner = document.createElement('div');
    searchWrapInner.classList.add('wrap');
    searchScreenWrap.append(searchWrapInner);

    const searchForm = document.createElement('form');
    searchForm.action = 'https://www.mahindra.com/search';
    searchForm.method = 'get';
    searchForm.id = 'search-block-form';
    searchForm.setAttribute('accept-charset', 'UTF-8');
    searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
    searchWrapInner.append(searchForm);

    const searchInputWrap = document.createElement('div');
    searchInputWrap.classList.add('search-wrap');
    searchForm.append(searchInputWrap);

    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    const searchIconImg = document.createElement('img');
    // Assuming a generic search icon for this example, as it's not in the block model
    // If the block model provided a search icon, it would be used here.
    searchIconImg.alt = 'svg file';
    searchIconImg.src = '/icons/search-icon.svg'; // Placeholder, replace if icon is in block model
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
    submitButton.type = 'submit'; // Ensure it's a submit button for the form
    const buttonLabel = document.createElement('div');
    buttonLabel.classList.add('label');
    buttonLabel.textContent = 'Submit';
    submitButton.append(buttonLabel);
    const submitIconImg = document.createElement('img');
    submitIconImg.alt = 'svg file';
    submitIconImg.src = '/icons/submit-icon.svg'; // Placeholder, replace if icon is in block model
    submitButton.append(submitIconImg);
    searchInputWrap.append(submitButton);

    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.style.display = 'none';
    searchForm.append(searchResultBox);

    const swiperDiv = document.createElement('div');
    swiperDiv.classList.add('swiper', 'scrollSwiper');
    searchResultBox.append(swiperDiv);

    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');
    swiperDiv.append(swiperWrapper);

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    swiperWrapper.append(swiperSlide);

    const swiperScrollbar = document.createElement('div');
    swiperScrollbar.classList.add('swiper-scrollbar');
    searchResultBox.append(swiperScrollbar);

    const popularKeywords = document.createElement('div');
    popularKeywords.classList.add('search-suggestions-wrap');
    const popularLabel = document.createElement('div');
    popularLabel.classList.add('label');
    popularLabel.textContent = 'Popular Keywords:';
    popularKeywords.append(popularLabel);
    const popularTokens = document.createElement('div');
    popularTokens.classList.add('tokens-wrap');
    const popularUl = document.createElement('ul');
    ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'].forEach((text) => {
      const liItem = document.createElement('li');
      liItem.textContent = text;
      popularUl.append(liItem);
    });
    popularTokens.append(popularUl);
    popularKeywords.append(popularTokens);
    searchWrapInner.append(popularKeywords);

    const recommendedKeywords = document.createElement('div');
    recommendedKeywords.classList.add('search-suggestions-wrap');
    const recommendedLabel = document.createElement('div');
    recommendedLabel.classList.add('label');
    recommendedLabel.textContent = 'Recommended for you:';
    recommendedKeywords.append(recommendedLabel);
    const recommendedTokens = document.createElement('div');
    recommendedTokens.classList.add('tokens-wrap');
    const recommendedUl = document.createElement('ul');
    ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'].forEach((text) => {
      const liItem = document.createElement('li');
      liItem.textContent = text;
      recommendedUl.append(liItem);
    });
    recommendedTokens.append(recommendedUl);
    recommendedKeywords.append(recommendedTokens);
    searchWrapInner.append(recommendedKeywords);

    // Event listener for search toggle
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchScreenWrap.classList.toggle('active');
      li.classList.toggle('active');
    });
    searchScreenWrap.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    document.addEventListener('click', () => {
      searchScreenWrap.classList.remove('active');
      li.classList.remove('active');
    });
  });

  // Icon Nav (Desktop)
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  nav.append(desktopIconNav);

  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);

  // Contact Links (Desktop)
  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    // const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a')); // Label not used in desktop icon nav

    const li = document.createElement('li');
    li.classList.add('mail');
    desktopIconUl.append(li);

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      moveInstrumentation(linkCell, anchor);
    } else {
      anchor.href = '#';
    }

    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
          { width: '24' },
        ]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
      }
    }
    li.append(anchor);
  });

  // Search Links (Desktop)
  searchLinkItems.forEach((row) => {
    const cells = [...row.children];
    const icon1Cell = cells.find(cell => cell.querySelector('picture') && cells.indexOf(cell) === 0);
    const icon2Cell = cells.find(cell => cell.querySelector('picture') && cells.indexOf(cell) === 1);
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const li = document.createElement('li');
    li.classList.add('search');
    desktopIconUl.append(li);

    const anchor = document.createElement('a');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      moveInstrumentation(linkCell, anchor);
    } else {
      anchor.href = '#';
    }

    const icon1Picture = icon1Cell?.querySelector('picture');
    if (icon1Picture) {
      const img = icon1Picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
          { width: '24' },
        ]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
      }
    }
    const icon2Picture = icon2Cell?.querySelector('picture');
    if (icon2Picture) {
      const img = icon2Picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
          { width: '24' },
        ]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        anchor.append(optimizedPic);
      }
    }
    li.append(anchor);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    li.append(searchScreenWrap);

    const searchWrapInner = document.createElement('div');
    searchWrapInner.classList.add('wrap');
    searchScreenWrap.append(searchWrapInner);

    const searchForm = document.createElement('form');
    searchForm.action = 'https://www.mahindra.com/search';
    searchForm.method = 'get';
    searchForm.id = 'search-block-form';
    searchForm.setAttribute('accept-charset', 'UTF-8');
    searchForm.setAttribute('data-drupal-form-fields', 'edit-keys');
    searchWrapInner.append(searchForm);

    const searchInputWrap = document.createElement('div');
    searchInputWrap.classList.add('search-wrap');
    searchForm.append(searchInputWrap);

    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    const searchIconImg = document.createElement('img');
    searchIconImg.alt = 'svg file';
    searchIconImg.src = '/icons/search-icon.svg'; // Placeholder
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
    submitButton.type = 'submit';
    const buttonLabel = document.createElement('div');
    buttonLabel.classList.add('label');
    buttonLabel.textContent = 'Submit';
    submitButton.append(buttonLabel);
    const submitIconImg = document.createElement('img');
    submitIconImg.alt = 'svg file';
    submitIconImg.src = '/icons/submit-icon.svg'; // Placeholder
    submitButton.append(submitIconImg);
    searchInputWrap.append(submitButton);

    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.style.display = 'none';
    searchForm.append(searchResultBox);

    const swiperDiv = document.createElement('div');
    swiperDiv.classList.add('swiper', 'scrollSwiper');
    searchResultBox.append(swiperDiv);

    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');
    swiperDiv.append(swiperWrapper);

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    swiperWrapper.append(swiperSlide);

    const swiperScrollbar = document.createElement('div');
    swiperScrollbar.classList.add('swiper-scrollbar');
    searchResultBox.append(swiperScrollbar);

    const popularKeywords = document.createElement('div');
    popularKeywords.classList.add('search-suggestions-wrap');
    const popularLabel = document.createElement('div');
    popularLabel.classList.add('label');
    popularLabel.textContent = 'Popular Keywords:';
    popularKeywords.append(popularLabel);
    const popularTokens = document.createElement('div');
    popularTokens.classList.add('tokens-wrap');
    const popularUl = document.createElement('ul');
    ['Business', 'FY 21', 'Brands', 'XUV700', 'Global', 'Nanhi Kali'].forEach((text) => {
      const liItem = document.createElement('li');
      liItem.textContent = text;
      popularUl.append(liItem);
    });
    popularTokens.append(popularUl);
    popularKeywords.append(popularTokens);
    searchWrapInner.append(popularKeywords);

    const recommendedKeywords = document.createElement('div');
    recommendedKeywords.classList.add('search-suggestions-wrap');
    const recommendedLabel = document.createElement('div');
    recommendedLabel.classList.add('label');
    recommendedLabel.textContent = 'Recommended for you:';
    recommendedKeywords.append(recommendedLabel);
    const recommendedTokens = document.createElement('div');
    recommendedTokens.classList.add('tokens-wrap');
    const recommendedUl = document.createElement('ul');
    ['Annual Report 2021 - 2022', 'Leadership Announcement', 'Latest Press Release', 'Brand Guidelines'].forEach((text) => {
      const liItem = document.createElement('li');
      liItem.textContent = text;
      recommendedUl.append(liItem);
    });
    recommendedTokens.append(recommendedUl);
    recommendedKeywords.append(recommendedTokens);
    searchWrapInner.append(recommendedKeywords);

    // Event listener for search toggle
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchScreenWrap.classList.toggle('active');
      li.classList.toggle('active');
    });
    searchScreenWrap.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    document.addEventListener('click', () => {
      searchScreenWrap.classList.remove('active');
      li.classList.remove('active');
    });
  });

  // Anniversary Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  wrapDiv.append(year80LogoDiv);

  const anniversaryLogoLink = document.createElement('a');
  const originalAnniversaryLogoLink = anniversaryLogoLinkRow.querySelector('a');
  if (originalAnniversaryLogoLink) {
    anniversaryLogoLink.href = originalAnniversaryLogoLink.href;
    moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoLink);
  } else {
    anniversaryLogoLink.href = '#';
  }

  const anniversaryLogoPicture = anniversaryLogoRow.querySelector('picture');
  if (anniversaryLogoPicture) {
    const img = anniversaryLogoPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
        { width: '74' },
      ]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      anniversaryLogoLink.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    }
  }
  year80LogoDiv.append(anniversaryLogoLink);

  // Optimise all images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
