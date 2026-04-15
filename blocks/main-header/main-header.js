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
      subWrap.classList.add('has-sub-child'); // use ORIGINAL HTML class
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
  const [
    logoRow,
    logoLinkRow,
    secondaryLogoRow,
    secondaryLogoLinkRow,
    ...itemRows
  ] = [...block.children];

  block.innerHTML = '';

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');

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
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('hiddenlogo1');
    optimizedPic.querySelector('img').style.width = 'auto';
    optimizedPic.querySelector('img').width = '200';
    optimizedPic.querySelector('img').height = '30';
    logoLink.append(optimizedPic);
  }
  moveInstrumentation(logoRow, logoLink);
  moveInstrumentation(logoLinkRow, logoLink);
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

  // Add event listener for hamburger menu
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('disable-scroll');
  });

  // Main Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);
  wrap.append(nav);

  const navigationItems = itemRows.filter((row) => row.children.length === 9);
  const iconNavItems = itemRows.filter((row) => row.children.length === 4);

  navigationItems.forEach((row) => {
    const [
      labelCell,
      linkCell,
      iconCell,
      hierarchyCell,
      leftDivHeadingCell,
      leftDivDescCell,
      leftDivSubDescCell,
      leftDivListCell,
      megaMenuContentCell,
    ] = [...row.children];

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
    moveInstrumentation(row, anchor);
    li.append(anchor);

    const iconSpan = document.createElement('span');
    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      iconSpan.append(optimizedPic);
    }
    li.append(iconSpan);

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

    const leftDivHeading = document.createElement('h4');
    leftDivHeading.classList.add('left-div-heading');
    const headingLink = document.createElement('a');
    headingLink.textContent = leftDivHeadingCell.textContent.trim();
    leftDivHeading.append(headingLink);
    leftDiv.append(leftDivHeading);

    const leftDivDesc = document.createElement('p');
    leftDivDesc.classList.add('left-div-desc');
    leftDivDesc.textContent = leftDivDescCell.textContent.trim();
    leftDiv.append(leftDivDesc);

    const leftDivSubDesc = document.createElement('p');
    leftDivSubDesc.classList.add('left-div-subdesc');
    leftDivSubDesc.textContent = leftDivSubDescCell.textContent.trim();
    leftDiv.append(leftDivSubDesc);

    // Richtext field: left-div-list
    const leftDivListContent = leftDivListCell.querySelector('p');
    if (leftDivListContent) {
      const ul = document.createElement('ul');
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = leftDivListContent.innerHTML; // Use innerHTML
      moveInstrumentation(leftDivListContent, tempDiv);

      // Apply classes to nested elements if they exist in the original HTML
      tempDiv.querySelectorAll('li').forEach(liElement => liElement.classList.add('list-text-red'));

      while (tempDiv.firstChild) {
        ul.append(tempDiv.firstChild);
      }
      leftDiv.append(ul);
    }

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap', 'about-us-sub-nav');
    centerDiv.append(subNavWrap);

    // Richtext field: hierarchy-tree
    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML; // Preserve full HTML structure
      moveInstrumentation(hierarchyCell, tempDiv);

      // Apply classes to nested elements as per ORIGINAL HTML
      tempDiv.querySelectorAll('li').forEach(liElement => {
        // Example: if original HTML had specific classes for li, add them here
        // liElement.classList.add('top-level-li');
      });
      tempDiv.querySelectorAll('a').forEach(aElement => {
        // Example: if original HTML had specific classes for a, add them here
      });
      tempDiv.querySelectorAll('div.has-sub-child').forEach(divElement => {
        // Example: if original HTML had specific classes for div, add them here
      });

      while (tempDiv.firstChild) {
        subNavWrap.append(tempDiv.firstChild);
      }
      transformNestedLists(subNavWrap.querySelector('ul')); // Apply transformations to the moved list
    }

    const megaMenuContent = megaMenuContentCell.querySelector('p');
    if (megaMenuContent) {
      const megaMenuContentDiv = document.createElement('div');
      megaMenuContentDiv.innerHTML = megaMenuContent.innerHTML;
      moveInstrumentation(megaMenuContent, megaMenuContentDiv);
      centerDiv.append(megaMenuContentDiv);
    }

    li.append(megaMenu);
    navUl.append(li);
  });

  // Mobile Icon Nav
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconNavUl = document.createElement('ul');
  mobileIconNav.append(mobileIconNavUl);

  // Desktop Icon Nav
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconNavUl = document.createElement('ul');
  desktopIconNav.append(desktopIconNavUl);

  iconNavItems.forEach((row) => {
    const [iconCell, linkCell, labelCell, hierarchyCell] = [...row.children];

    const mobileLi = document.createElement('li');
    mobileLi.classList.add(labelCell.textContent.trim().toLowerCase().replace(/\s/g, '-'));
    const mobileAnchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      mobileAnchor.href = foundLink.href;
    }
    mobileAnchor.textContent = labelCell.textContent.trim();
    const mobileIconPicture = iconCell.querySelector('picture');
    if (mobileIconPicture) {
      const img = mobileIconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      mobileAnchor.prepend(optimizedPic);
    }
    mobileLi.append(mobileAnchor);
    mobileIconNavUl.append(mobileLi);

    const desktopLi = document.createElement('li');
    desktopLi.classList.add(labelCell.textContent.trim().toLowerCase().replace(/\s/g, '-'));
    const desktopAnchor = document.createElement('a');
    if (foundLink) {
      desktopAnchor.href = foundLink.href;
    }
    const desktopIconPicture = iconCell.querySelector('picture');
    if (desktopIconPicture) {
      const img = desktopIconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '20' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      desktopAnchor.append(optimizedPic);
    }
    desktopLi.append(desktopAnchor);
    desktopIconNavUl.append(desktopLi);

    // Richtext field: hierarchy-tree for icon nav items
    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('nav-dropdown'); // Assuming this class is from original HTML or intended
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML; // Preserve full HTML structure
      moveInstrumentation(hierarchyCell, tempDiv);

      // Apply classes to nested elements as per ORIGINAL HTML
      tempDiv.querySelectorAll('li').forEach(liElement => {
        // liElement.classList.add('some-icon-nav-li-class');
      });
      tempDiv.querySelectorAll('a').forEach(aElement => {
        // aElement.classList.add('some-icon-nav-a-class');
      });

      while (tempDiv.firstChild) {
        wrapper.append(tempDiv.firstChild);
      }

      mobileAnchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle('active');
        mobileLi.classList.toggle('active');
      });
      mobileLi.appendChild(wrapper);

      desktopAnchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.toggle('active');
        desktopLi.classList.toggle('active');
      });
      desktopLi.appendChild(wrapper);

      transformNestedLists(wrapper.querySelector('ul')); // Apply transformations to the moved list
    }
  });

  // Search functionality for both mobile and desktop
  const setupSearch = (parentUl) => {
    const searchLi = document.createElement('li');
    searchLi.classList.add('search');
    searchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');

    const searchAnchor = document.createElement('a');
    searchAnchor.href = '#';
    searchAnchor.setAttribute('data-once', 'search-stop-propagation');

    const searchIcon1 = document.createElement('img');
    searchIcon1.alt = 'svg file';
    searchIcon1.src = '/icons/search.svg'; // Placeholder, replace with actual icon from block data if available
    searchAnchor.append(searchIcon1);

    const searchIcon2 = document.createElement('img');
    searchIcon2.alt = 'svg file';
    searchIcon2.src = '/icons/close.svg'; // Placeholder, replace with actual icon from block data if available
    searchAnchor.append(searchIcon2);

    if (parentUl === mobileIconNavUl) {
      const searchSpan = document.createElement('span');
      searchSpan.setAttribute('data-once', 'search-stop-propagation');
      searchSpan.textContent = ' Search';
      searchAnchor.append(searchSpan);
    }

    searchLi.append(searchAnchor);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
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

    const inputSearchWrap = document.createElement('div');
    inputSearchWrap.classList.add('search-wrap');
    inputSearchWrap.setAttribute('data-once', 'search-stop-propagation');
    searchForm.append(inputSearchWrap);

    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
    const searchInputIcon = document.createElement('img');
    searchInputIcon.alt = 'svg file';
    searchInputIcon.src = '/icons/search-input.svg'; // Placeholder
    searchIconDiv.append(searchInputIcon);
    inputSearchWrap.append(searchIconDiv);

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext');
    searchInput.required = true;
    searchInput.name = 'key';
    searchInput.id = 'searchInput';
    searchInput.autocomplete = 'off';
    searchInput.setAttribute('data-once', 'search-stop-propagation');
    inputSearchWrap.append(searchInput);

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
    submitIcon.src = '/icons/arrow-right.svg'; // Placeholder
    submitButton.append(submitIcon);
    inputSearchWrap.append(submitButton);

    searchAnchor.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchScreenWrap.classList.toggle('active');
      searchLi.classList.toggle('active');
      // Toggle body scroll lock
      document.body.classList.toggle('disable-scroll');
    });

    parentUl.append(searchLi);
    searchLi.append(searchScreenWrap);
  };

  setupSearch(mobileIconNavUl);
  setupSearch(desktopIconNavUl);

  navUl.append(mobileIconNav);
  nav.append(desktopIconNav);

  // Secondary Logo (80th Year Logo)
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  const year80LogoLink = document.createElement('a');
  const foundSecondaryLogoLink = secondaryLogoLinkRow.querySelector('a');
  if (foundSecondaryLogoLink) {
    year80LogoLink.href = foundSecondaryLogoLink.href;
  } else {
    year80LogoLink.href = '#';
  }

  const secondaryLogoPicture = secondaryLogoRow.querySelector('picture');
  if (secondaryLogoPicture) {
    const img = secondaryLogoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    optimizedPic.querySelector('img').width = '74';
    optimizedPic.querySelector('img').height = '60';
    year80LogoLink.append(optimizedPic);
  }
  moveInstrumentation(secondaryLogoRow, year80LogoLink);
  moveInstrumentation(secondaryLogoLinkRow, year80LogoLink);
  year80LogoDiv.append(year80LogoLink);
  wrap.append(year80LogoDiv);

  block.append(header);
}
