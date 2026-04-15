import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [mainLogoRow, mainLogoLinkRow, ...itemRows] = [...block.children];

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');
  moveInstrumentation(block, header);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  header.append(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);

  // Main Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  wrapDiv.append(logoDiv);

  const mainLogoLink = document.createElement('a');
  const mainLogoLinkCell = [...mainLogoLinkRow.children].find((c) =>
    c.querySelector('a'),
  );
  if (mainLogoLinkCell) {
    mainLogoLink.href = mainLogoLinkCell.querySelector('a').href;
    moveInstrumentation(mainLogoLinkCell, mainLogoLink);
  } else {
    mainLogoLink.href = '/'; // Default link
  }
  logoDiv.append(mainLogoLink);

  const mainLogoPictureCell = [...mainLogoRow.children].find((c) =>
    c.querySelector('picture'),
  );
  if (mainLogoPictureCell) {
    const mainLogoImg = mainLogoPictureCell.querySelector('img');
    const optimizedMainLogo = createOptimizedPicture(
      mainLogoImg.src,
      mainLogoImg.alt,
      false,
      [{ width: '200' }],
    );
    optimizedMainLogo
      .querySelector('img')
      .classList.add('hiddenlogo1');
    optimizedMainLogo
      .querySelector('img')
      .setAttribute('width', '200');
    optimizedMainLogo
      .querySelector('img')
      .setAttribute('height', '30');
    optimizedMainLogo
      .querySelector('img')
      .setAttribute('style', 'width: auto;');
    optimizedMainLogo
      .querySelector('img')
      .setAttribute('loading', 'lazy');

    moveInstrumentation(mainLogoImg, optimizedMainLogo.querySelector('img'));
    mainLogoLink.append(optimizedMainLogo);
  }

  // Hamburger menu
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.setAttribute('data-once', 'hamburger-click nav-close-search');
  const hamburgerUl = document.createElement('ul');
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }
  hamburgerDiv.append(hamburgerUl);
  wrapDiv.append(hamburgerDiv);

  // Main Navigation
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  wrapDiv.append(nav);

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);

  const navigationItems = itemRows.filter(
    (row) => row.children.length === 7,
  );
  const contactLinkItems = itemRows.filter(
    (row) => row.children.length === 2 && !row.querySelector('picture'),
  );
  const searchLinkItems = itemRows.filter(
    (row) => row.children.length === 4,
  );
  const yearLogoItems = itemRows.filter(
    (row) => row.children.length === 2 && row.querySelector('picture'),
  );

  navigationItems.forEach((row) => {
    const cells = [...row.children];
    const labelCell = cells.find(
      (c) =>
        !c.querySelector('a') &&
        !c.querySelector('picture') &&
        !c.querySelector('ul') &&
        !c.textContent.trim().startsWith('Left Div Heading') && // Exclude heading/desc cells
        !c.textContent.trim().startsWith('Left Div Description') &&
        !c.textContent.trim().startsWith('Left Div Subdescription'),
    );
    const linkCell = cells.find((c) => c.querySelector('a'));
    const iconCell = cells.find((c) => c.querySelector('picture'));
    const hierarchyCell = cells.find((c) => c.querySelector('ul'));
    const leftDivHeadingCell = cells.find(
      (c) => c.textContent.trim().startsWith('Left Div Heading'),
    );
    const leftDivDescCell = cells.find(
      (c) => c.textContent.trim().startsWith('Left Div Description'),
    );
    const leftDivSubdescCell = cells.find(
      (c) => c.textContent.trim().startsWith('Left Div Subdescription'),
    );

    const label = labelCell?.textContent?.trim() || '';
    const href = linkCell?.querySelector('a')?.href || '#';
    const hasSubmenu = hierarchyCell?.querySelector('ul');

    const li = document.createElement('li');
    li.classList.add('hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');
    moveInstrumentation(row, li);

    const anchor = document.createElement('a');
    anchor.setAttribute('itemprop', 'url');
    anchor.href = href;
    anchor.textContent = label;
    moveInstrumentation(linkCell, anchor);
    li.append(anchor);

    if (iconCell) {
      const iconImg = iconCell.querySelector('img');
      const iconSpan = document.createElement('span');
      const optimizedIcon = createOptimizedPicture(
        iconImg.src,
        iconImg.alt,
        false,
        [{ width: '20' }],
      );
      moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
      iconSpan.append(optimizedIcon);
      li.append(iconSpan);
    }

    if (hasSubmenu) {
      li.classList.add('has-child');
      const megaMenuDiv = document.createElement('div');
      megaMenuDiv.classList.add('mega-menu');
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');

      const leftDiv = document.createElement('div');
      leftDiv.classList.add('left-div');
      if (label.toLowerCase() === 'investor relations') {
        leftDiv.classList.add('ir-left-div');
      } else if (label.toLowerCase() === 'newsroom') {
        leftDiv.classList.add('newsroom-left-div');
      } else if (label.toLowerCase() === 'careers') {
        leftDiv.classList.add('career-left-div');
      }

      const leftDivHeading = document.createElement('h4');
      leftDivHeading.classList.add('left-div-heading');
      const headingLink = document.createElement('a');
      headingLink.textContent = leftDivHeadingCell?.textContent?.trim() || label;
      leftDivHeading.append(headingLink);
      moveInstrumentation(leftDivHeadingCell, leftDivHeading);
      leftDiv.append(leftDivHeading);

      if (leftDivDescCell) {
        const leftDivDesc = document.createElement('p');
        leftDivDesc.classList.add('left-div-desc');
        leftDivDesc.textContent = leftDivDescCell.textContent.trim();
        moveInstrumentation(leftDivDescCell, leftDivDesc);
        leftDiv.append(leftDivDesc);
      }

      if (leftDivSubdescCell) {
        const leftDivSubdesc = document.createElement('p');
        leftDivSubdesc.classList.add('left-div-subdesc');
        leftDivSubdesc.textContent = leftDivSubdescCell.textContent.trim();
        moveInstrumentation(leftDivSubdescCell, leftDivSubdesc);
        leftDiv.append(leftDivSubdesc);
      }

      centerDiv.append(leftDiv);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap');
      if (label.toLowerCase() === 'who we are') {
        subNavWrap.classList.add('about-us-sub-nav');
      } else if (label.toLowerCase() === 'what we do') {
        subNavWrap.classList.add('what-we-do');
      } else if (label.toLowerCase() === 'investor relations') {
        subNavWrap.classList.add('element-block');
      } else if (label.toLowerCase() === 'careers') {
        subNavWrap.classList.add('careers-div');
      }

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv);

      tempDiv.querySelectorAll('ul').forEach((ulElement) => {
        ulElement.querySelectorAll('li').forEach((liElement) => {
          liElement.classList.add('list-item'); // Add list-item class to all li elements
          const nestedUl = liElement.querySelector(':scope > ul');
          if (nestedUl) {
            liElement.classList.add('has-sub-child');
            // Clone the icon from the main navigation item and append it
            const clonedIconSpan = iconCell.cloneNode(true);
            clonedIconSpan.querySelector('img').setAttribute('width', '20'); // Ensure icon size is consistent
            liElement.querySelector(':scope > a')?.after(clonedIconSpan);
            nestedUl.classList.add('has-inner-sub-child'); // For 2nd level and deeper
          }
          if (liElement.parentElement === ulElement && ulElement.parentElement === tempDiv) {
            liElement.classList.add('top-level-li');
          } else if (liElement.parentElement.parentElement?.classList.contains('top-level-li')) {
            liElement.classList.add('first-level-li');
          }
        });
        subNavWrap.append(ulElement);
      });

      centerDiv.append(subNavWrap);
      megaMenuWrap.append(centerDiv);
      megaMenuDiv.append(megaMenuWrap);
      li.append(megaMenuDiv);
    }
    navUl.append(li);
  });

  // Mobile and Desktop Icon Navigation
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');

  const createIconNavUl = () => {
    const ul = document.createElement('ul');

    // Contact Link Item
    contactLinkItems.forEach((row) => {
      const contactLink = document.createElement('li');
      contactLink.classList.add('mail');
      moveInstrumentation(row, contactLink);

      const cells = [...row.children];
      const link = cells.find((c) => c.querySelector('a'));
      const label = cells.find((c) => !c.querySelector('a'));

      const anchor = document.createElement('a');
      anchor.href = link?.querySelector('a')?.href || '#';
      anchor.textContent = label?.textContent?.trim() || 'Contact Us';
      moveInstrumentation(link, anchor);
      contactLink.append(anchor);
      ul.append(contactLink);
    });

    // Search Link Item
    searchLinkItems.forEach((row) => {
      const searchLink = document.createElement('li');
      searchLink.classList.add('search');
      searchLink.setAttribute('data-once', 'search-toggle search-stop-propagation');
      moveInstrumentation(row, searchLink);

      const cells = [...row.children];
      const link = cells.find((c) => c.querySelector('a'));
      const searchIcon1 = cells.find(
        (c) => c.querySelector('picture') && !c.nextElementSibling?.querySelector('picture'),
      );
      const searchIcon2 = cells.find(
        (c) => c.querySelector('picture') && c.previousElementSibling?.querySelector('picture'),
      );
      const label = cells.find(
        (c) =>
          !c.querySelector('a') &&
          !c.querySelector('picture'),
      );

      const anchor = document.createElement('a');
      anchor.href = link?.querySelector('a')?.href || '#';
      anchor.setAttribute('data-once', 'search-stop-propagation');
      moveInstrumentation(link, anchor);

      if (searchIcon1) {
        const img1 = searchIcon1.querySelector('img');
        const optimizedImg1 = createOptimizedPicture(
          img1.src,
          img1.alt,
          false,
          [{ width: '20' }],
        );
        moveInstrumentation(img1, optimizedImg1.querySelector('img'));
        anchor.append(optimizedImg1);
      }
      if (searchIcon2) {
        const img2 = searchIcon2.querySelector('img');
        const optimizedImg2 = createOptimizedPicture(
          img2.src,
          img2.alt,
          false,
          [{ width: '20' }],
        );
        moveInstrumentation(img2, optimizedImg2.querySelector('img'));
        anchor.append(optimizedImg2);
      }

      if (label) {
        const span = document.createElement('span');
        span.setAttribute('data-once', 'search-stop-propagation');
        span.textContent = label.textContent.trim();
        anchor.append(span);
      }

      searchLink.append(anchor);

      // Search screen wrap (placeholder for now, actual implementation needs event listeners)
      const searchScreenWrap = document.createElement('div');
      searchScreenWrap.classList.add('search-screen-wrap');
      searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
      searchLink.append(searchScreenWrap);

      ul.append(searchLink);
    });
    return ul;
  };

  mobileIconNav.append(createIconNavUl());
  desktopIconNav.append(createIconNavUl());

  nav.append(mobileIconNav);
  nav.append(desktopIconNav);

  // Year Logos
  const yearLogoDiv = document.createElement('div');
  yearLogoDiv.classList.add('logo', 'year-80-logo');
  wrapDiv.append(yearLogoDiv);

  yearLogoItems.forEach((row) => {
    const cells = [...row.children];
    const logoCell = cells.find((c) => c.querySelector('picture'));
    const logoLinkCell = cells.find((c) => c.querySelector('a'));

    const logoAnchor = document.createElement('a');
    logoAnchor.href = logoLinkCell?.querySelector('a')?.href || '#';
    moveInstrumentation(logoLinkCell, logoAnchor);

    if (logoCell) {
      const logoImg = logoCell.querySelector('img');
      const optimizedLogo = createOptimizedPicture(
        logoImg.src,
        logoImg.alt,
        false,
        [{ width: '74' }],
      );
      optimizedLogo
        .querySelector('img')
        .classList.add('hiddenlogo1', 'years-80');
      optimizedLogo
        .querySelector('img')
        .setAttribute('width', '74');
      optimizedLogo
        .querySelector('img')
        .setAttribute('height', '60');
      optimizedLogo
        .querySelector('img')
        .setAttribute('loading', 'lazy');
      optimizedLogo
        .querySelector('img')
        .setAttribute('title', logoImg.title || logoImg.alt);

      moveInstrumentation(logoImg, optimizedLogo.querySelector('img'));
      logoAnchor.append(optimizedLogo);
    }
    yearLogoDiv.append(logoAnchor);
  });

  block.textContent = '';
  block.append(header);

  // Add event listeners for hamburger menu
  hamburgerDiv.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburgerDiv.classList.toggle('active');
    header.classList.toggle('nav-open');
  });

  // Add event listeners for search toggle
  block.querySelectorAll('.search').forEach((searchItem) => {
    const searchAnchor = searchItem.querySelector('a');
    const searchScreenWrap = searchItem.querySelector('.search-screen-wrap');

    searchAnchor.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      searchItem.classList.toggle('active');
      searchScreenWrap.classList.toggle('active');
      header.classList.toggle('search-open');
    });

    // Close search when clicking outside
    searchScreenWrap.addEventListener('click', (e) => {
      if (e.target === searchScreenWrap) {
        searchItem.classList.remove('active');
        searchScreenWrap.classList.remove('active');
        header.classList.remove('search-open');
      }
    });
  });

  // Add event listeners for mega menu toggles
  block.querySelectorAll('.main-nav .has-child > a').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      if (window.innerWidth <= 1200) {
        e.preventDefault();
        const parentLi = anchor.closest('.has-child');
        parentLi.classList.toggle('active');
        parentLi.querySelector('.mega-menu')?.classList.toggle('active');
      }
    });
  });

  // Add event listeners for nested sub-menus (top-level-li, first-level-li)
  block.querySelectorAll('.main-nav .has-sub-child > a').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      if (window.innerWidth <= 1200) {
        e.preventDefault();
        e.stopPropagation(); // Stop propagation to prevent parent from toggling
        const parentLi = anchor.closest('.has-sub-child');
        parentLi.classList.toggle('active');
        parentLi.querySelector('.has-inner-sub-child')?.classList.toggle('active');
      }
    });
  });

  // Add event listeners for inner sub-menus (first-level-li)
  block.querySelectorAll('.main-nav .first-level-li .has-inner-sub-child > a').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      if (window.innerWidth <= 1200) {
        e.preventDefault();
        e.stopPropagation(); // Stop propagation to prevent parent from toggling
        const parentLi = anchor.closest('.first-level-li');
        parentLi.classList.toggle('active-child');
        parentLi.querySelector('.has-inner-sub-child')?.classList.toggle('active-child');
      }
    });
  });
}
