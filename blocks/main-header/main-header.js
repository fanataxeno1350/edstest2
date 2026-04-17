import { createOptimizedPicture } from '../../scripts/aem.js';
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
  });
}

export default function decorate(block) {
  const children = [...block.children];

  // Destructure the first four rows which are fixed fields
  const [
    primaryLogoRow,
    primaryLogoLinkRow,
    anniversaryLogoRow,
    anniversaryLogoLinkRow,
    ...itemRows
  ] = children;

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid'); // Do not add 'nav-up' initially

  const container = document.createElement('div');
  container.classList.add('container');
  header.append(container);

  const wrap = document.createElement('div');
  wrap.classList.add('wrap');
  container.append(wrap);

  // Logo section
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  wrap.append(logoDiv);

  const primaryLogoLink = document.createElement('a');
  const primaryLogoAnchor = primaryLogoLinkRow.querySelector('a');
  if (primaryLogoAnchor) {
    primaryLogoLink.href = primaryLogoAnchor.href;
  }
  moveInstrumentation(primaryLogoLinkRow, primaryLogoLink);
  logoDiv.append(primaryLogoLink);

  const primaryLogoPicture = primaryLogoRow.querySelector('picture');
  if (primaryLogoPicture) {
    const primaryLogoImg = primaryLogoPicture.querySelector('img');
    const optimizedPrimaryLogo = createOptimizedPicture(
      primaryLogoImg.src,
      primaryLogoImg.alt,
      false,
      [{ width: '200' }],
    );
    optimizedPrimaryLogo.querySelector('img').classList.add('hiddenlogo1');
    moveInstrumentation(primaryLogoRow, optimizedPrimaryLogo.querySelector('img'));
    primaryLogoLink.append(optimizedPrimaryLogo);
  }

  // Hamburger menu
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  wrap.append(hamburgerDiv);

  const hamburgerUl = document.createElement('ul');
  hamburgerDiv.append(hamburgerUl);
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }

  // Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  wrap.append(nav);

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);

  const navigationItems = itemRows.filter((row) => row.children.length === 5);
  navigationItems.forEach((row) => {
    const [labelCell, linkCell, iconCell, hierarchyCell, descriptionCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');

    const linkEl = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
    }
    linkEl.textContent = labelCell.textContent.trim();
    linkEl.setAttribute('itemprop', 'url');
    moveInstrumentation(linkCell, linkEl);
    li.append(linkEl);

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [
        { width: '24' },
      ]);
      moveInstrumentation(iconCell, optimizedIcon.querySelector('img'));
      li.append(optimizedIcon);
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

    const leftDivHeading = document.createElement('h4');
    leftDivHeading.classList.add('left-div-heading');
    const headingLink = document.createElement('a');
    headingLink.textContent = labelCell.textContent.trim();
    if (foundLink) {
      headingLink.href = foundLink.href;
    }
    leftDivHeading.append(headingLink);
    leftDiv.append(leftDivHeading);

    const descriptionP = document.createElement('p');
    descriptionP.classList.add('left-div-desc');
    descriptionP.textContent = descriptionCell.textContent.trim();
    leftDiv.append(descriptionP);

    const subNavWrap = document.createElement('div');
    subNavWrap.classList.add('sub-nav-wrap', 'about-us-sub-nav');
    centerDiv.append(subNavWrap);

    const hierarchyRoot = hierarchyCell.querySelector('ul');
    if (hierarchyRoot) {
      // Apply classes to the hierarchyRoot and its children based on ORIGINAL HTML
      hierarchyRoot.querySelectorAll('li').forEach((hierarchyLi) => {
        hierarchyLi.classList.add('top-level-li'); // Example class from ORIGINAL HTML
        const hierarchyAnchor = hierarchyLi.querySelector('a');
        if (hierarchyAnchor) {
          // Add any specific classes for anchors if present in ORIGINAL HTML
        }
        const nestedUl = hierarchyLi.querySelector('ul');
        if (nestedUl) {
          // Add any specific classes for nested Uls if present in ORIGINAL HTML
          nestedUl.querySelectorAll('li').forEach((nestedLi) => {
            nestedLi.classList.add('first-level-li'); // Example class from ORIGINAL HTML
            const innerNestedUl = nestedLi.querySelector('ul');
            if (innerNestedUl) {
              innerNestedUl.classList.add('has-inner-sub-child'); // Example class
            }
          });
        }
      });
      moveInstrumentation(hierarchyCell, hierarchyRoot); // Move instrumentation for the whole hierarchy
      subNavWrap.append(hierarchyRoot);
      transformNestedLists(hierarchyRoot);
    }

    navUl.append(li);
  });

  // Contact Links
  const iconNavMobile = document.createElement('div');
  iconNavMobile.classList.add('icon-nav', 'mobile-menus-icon');
  navUl.append(iconNavMobile);

  const iconNavMobileUl = document.createElement('ul');
  iconNavMobile.append(iconNavMobileUl);

  const contactLinkItems = itemRows.filter((row) => row.children.length === 3);
  contactLinkItems.forEach((row) => {
    const [iconCell, linkCell, labelCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('mail');

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [
        { width: '24' },
      ]);
      moveInstrumentation(iconCell, optimizedIcon.querySelector('img'));
      anchor.prepend(optimizedIcon);
    }
    moveInstrumentation(row, anchor);
    li.append(anchor);
    iconNavMobileUl.append(li);
  });

  // Search Items
  const searchItems = itemRows.filter((row) => row.children.length === 4);
  if (searchItems.length > 0) {
    const searchRow = searchItems[0]; // Assuming only one search item for the header
    const [searchIconCell, searchLabelCell, inputPlaceholderCell, formActionCell] = [
      ...searchRow.children,
    ];

    const searchLi = document.createElement('li');
    searchLi.classList.add('search');

    const searchAnchor = document.createElement('a');
    searchAnchor.href = '#';

    const searchIconPicture = searchIconCell.querySelector('picture');
    if (searchIconPicture) {
      const searchIconImg = searchIconPicture.querySelector('img');
      const optimizedSearchIcon = createOptimizedPicture(
        searchIconImg.src,
        searchIconImg.alt,
        false,
        [{ width: '24' }],
      );
      moveInstrumentation(searchIconCell, optimizedSearchIcon.querySelector('img'));
      searchAnchor.append(optimizedSearchIcon);
      // Add a second search icon for toggle state if available in original HTML
      // The original HTML shows two img tags within the anchor for search, so we clone and append
      const secondSearchIcon = searchIconPicture.cloneNode(true);
      const secondSearchIconImg = secondSearchIcon.querySelector('img');
      const optimizedSecondSearchIcon = createOptimizedPicture(
        secondSearchIconImg.src,
        secondSearchIconImg.alt,
        false,
        [{ width: '24' }],
      );
      searchAnchor.append(optimizedSecondSearchIcon);
    }

    const searchSpan = document.createElement('span');
    searchSpan.textContent = searchLabelCell.textContent.trim();
    searchAnchor.append(searchSpan);
    searchLi.append(searchAnchor);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    searchLi.append(searchScreenWrap);

    const searchWrapInner = document.createElement('div');
    searchWrapInner.classList.add('wrap');
    searchScreenWrap.append(searchWrapInner);

    const searchForm = document.createElement('form');
    const formAction = formActionCell.querySelector('a');
    if (formAction) {
      searchForm.action = formAction.href;
    }
    searchForm.method = 'get';
    searchForm.id = 'search-block-form';
    searchForm.setAttribute('accept-charset', 'UTF-8');
    searchWrapInner.append(searchForm);

    const searchInputWrap = document.createElement('div');
    searchInputWrap.classList.add('search-wrap');
    searchForm.append(searchInputWrap);

    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    searchInputWrap.append(searchIconDiv);
    // Add search icon for input field if available in original HTML
    if (searchIconPicture) {
      const inputSearchIcon = searchIconPicture.cloneNode(true);
      const inputSearchIconImg = inputSearchIcon.querySelector('img');
      const optimizedInputSearchIcon = createOptimizedPicture(
        inputSearchIconImg.src,
        inputSearchIconImg.alt,
        false,
        [{ width: '24' }],
      );
      searchIconDiv.append(optimizedInputSearchIcon);
    }

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext');
    searchInput.required = true;
    searchInput.name = 'key';
    searchInput.id = 'searchInput';
    searchInput.autocomplete = 'off';
    searchInput.placeholder = inputPlaceholderCell.textContent.trim();
    searchInputWrap.append(searchInput);

    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    submitButton.type = 'submit';
    const submitLabel = document.createElement('div');
    submitLabel.classList.add('label');
    submitLabel.textContent = 'Submit';
    submitButton.append(submitLabel);
    // Add submit button icon if available in original HTML
    if (searchIconPicture) {
      const submitIcon = searchIconPicture.cloneNode(true);
      const submitIconImg = submitIcon.querySelector('img');
      const optimizedSubmitIcon = createOptimizedPicture(
        submitIconImg.src,
        submitIconImg.alt,
        false,
        [{ width: '24' }],
      );
      submitButton.append(optimizedSubmitIcon);
    }
    searchInputWrap.append(submitButton);

    iconNavMobileUl.append(searchLi);

    // Add event listeners for search functionality
    searchAnchor.addEventListener('click', (e) => {
      e.preventDefault();
      searchScreenWrap.classList.toggle('active');
      searchLi.classList.toggle('active');
    });

    searchScreenWrap.addEventListener('click', (e) => {
      if (e.target === searchScreenWrap) {
        searchScreenWrap.classList.remove('active');
        searchLi.classList.remove('active');
      }
    });
  }

  // Desktop Icons (Contact and Search)
  const iconNavDesktop = document.createElement('div');
  iconNavDesktop.classList.add('icon-nav', 'desktop-menus-icon');
  nav.append(iconNavDesktop);

  const iconNavDesktopUl = document.createElement('ul');
  iconNavDesktop.append(iconNavDesktopUl);

  contactLinkItems.forEach((row) => {
    const [iconCell, linkCell, labelCell] = [...row.children];
    const li = document.createElement('li');
    li.classList.add('mail');

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [
        { width: '24' },
      ]);
      moveInstrumentation(iconCell, optimizedIcon.querySelector('img'));
      anchor.append(optimizedIcon);
    }
    moveInstrumentation(row, anchor);
    li.append(anchor);
    iconNavDesktopUl.append(li);
  });

  if (searchItems.length > 0) {
    const searchRow = searchItems[0];
    const [searchIconCell, searchLabelCell, inputPlaceholderCell, formActionCell] = [
      ...searchRow.children,
    ];

    const searchLi = document.createElement('li');
    searchLi.classList.add('search');

    const searchAnchor = document.createElement('a');
    searchAnchor.href = '#';

    const searchIconPicture = searchIconCell.querySelector('picture');
    if (searchIconPicture) {
      const searchIconImg = searchIconPicture.querySelector('img');
      const optimizedSearchIcon = createOptimizedPicture(
        searchIconImg.src,
        searchIconImg.alt,
        false,
        [{ width: '24' }],
      );
      moveInstrumentation(searchIconCell, optimizedSearchIcon.querySelector('img'));
      searchAnchor.append(optimizedSearchIcon);
      const secondSearchIcon = searchIconPicture.cloneNode(true);
      const secondSearchIconImg = secondSearchIcon.querySelector('img');
      const optimizedSecondSearchIcon = createOptimizedPicture(
        secondSearchIconImg.src,
        secondSearchIconImg.alt,
        false,
        [{ width: '24' }],
      );
      searchAnchor.append(optimizedSecondSearchIcon);
    }
    searchLi.append(searchAnchor);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    searchLi.append(searchScreenWrap);

    const searchWrapInner = document.createElement('div');
    searchWrapInner.classList.add('wrap');
    searchScreenWrap.append(searchWrapInner);

    const searchForm = document.createElement('form');
    const formAction = formActionCell.querySelector('a');
    if (formAction) {
      searchForm.action = formAction.href;
    }
    searchForm.method = 'get';
    searchForm.id = 'search-block-form';
    searchForm.setAttribute('accept-charset', 'UTF-8');
    searchWrapInner.append(searchForm);

    const searchInputWrap = document.createElement('div');
    searchInputWrap.classList.add('search-wrap');
    searchForm.append(searchInputWrap);

    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    searchInputWrap.append(searchIconDiv);
    if (searchIconPicture) {
      const inputSearchIcon = searchIconPicture.cloneNode(true);
      const inputSearchIconImg = inputSearchIcon.querySelector('img');
      const optimizedInputSearchIcon = createOptimizedPicture(
        inputSearchIconImg.src,
        inputSearchIconImg.alt,
        false,
        [{ width: '24' }],
      );
      searchIconDiv.append(optimizedInputSearchIcon);
    }

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.classList.add('input-text', 'searchtext');
    searchInput.required = true;
    searchInput.name = 'key';
    searchInput.id = 'searchInput';
    searchInput.autocomplete = 'off';
    searchInput.placeholder = inputPlaceholderCell.textContent.trim();
    searchInputWrap.append(searchInput);

    const submitButton = document.createElement('button');
    submitButton.classList.add('submit-button');
    submitButton.type = 'submit';
    const submitLabel = document.createElement('div');
    submitLabel.classList.add('label');
    submitLabel.textContent = 'Submit';
    submitButton.append(submitLabel);
    if (searchIconPicture) {
      const submitIcon = searchIconPicture.cloneNode(true);
      const submitIconImg = submitIcon.querySelector('img');
      const optimizedSubmitIcon = createOptimizedPicture(
        submitIconImg.src,
        submitIconImg.alt,
        false,
        [{ width: '24' }],
      );
      submitButton.append(optimizedSubmitIcon);
    }
    searchInputWrap.append(submitButton);

    iconNavDesktopUl.append(searchLi);

    searchAnchor.addEventListener('click', (e) => {
      e.preventDefault();
      searchScreenWrap.classList.toggle('active');
      searchLi.classList.toggle('active');
    });

    searchScreenWrap.addEventListener('click', (e) => {
      if (e.target === searchScreenWrap) {
        searchScreenWrap.classList.remove('active');
        searchLi.classList.remove('active');
      }
    });
  }

  // Anniversary Logo
  const anniversaryLogoDiv = document.createElement('div');
  anniversaryLogoDiv.classList.add('logo', 'year-80-logo');
  wrap.append(anniversaryLogoDiv);

  const anniversaryLogoLink = document.createElement('a');
  const anniversaryLogoAnchor = anniversaryLogoLinkRow.querySelector('a');
  if (anniversaryLogoAnchor) {
    anniversaryLogoLink.href = anniversaryLogoAnchor.href;
  }
  moveInstrumentation(anniversaryLogoLinkRow, anniversaryLogoLink);
  anniversaryLogoDiv.append(anniversaryLogoLink);

  const anniversaryLogoPicture = anniversaryLogoRow.querySelector('picture');
  if (anniversaryLogoPicture) {
    const anniversaryLogoImg = anniversaryLogoPicture.querySelector('img');
    const optimizedAnniversaryLogo = createOptimizedPicture(
      anniversaryLogoImg.src,
      anniversaryLogoImg.alt,
      false,
      [{ width: '74' }],
    );
    optimizedAnniversaryLogo.querySelector('img').classList.add('hiddenlogo1', 'years-80');
    moveInstrumentation(anniversaryLogoRow, optimizedAnniversaryLogo.querySelector('img'));
    anniversaryLogoLink.append(optimizedAnniversaryLogo);
  }

  block.replaceWith(header);

  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY) {
      header.classList.add('nav-up');
    } else {
      header.classList.remove('nav-up');
    }
    lastScrollY = window.scrollY;
  });

  // Hamburger menu toggle
  hamburgerDiv.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburgerDiv.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });
}
