import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
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
  wrap.append(logoDiv);

  // Find logo and logo link cells using content detection
  const rootCells = [...block.children].slice(0, 2).map(row => [...row.children][0]);
  const logoPictureCell = rootCells.find(cell => cell.querySelector('picture'));
  const logoLinkCell = rootCells.find(cell => cell.querySelector('a'));

  const logoLink = document.createElement('a');
  if (logoLinkCell && logoLinkCell.querySelector('a')) {
    logoLink.href = logoLinkCell.querySelector('a').href;
    moveInstrumentation(logoLinkCell, logoLink);
  } else {
    logoLink.href = '#'; // Default or handle empty link
  }
  logoDiv.append(logoLink);

  if (logoPictureCell) {
    const logoPicture = logoPictureCell.querySelector('picture');
    if (logoPicture) {
      const img = logoPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
      optimizedPic.querySelector('img').classList.add('hiddenlogo1');
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      logoLink.append(optimizedPic);
    }
  }

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
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  wrap.append(nav);

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);

  const itemRows = [...block.children].slice(2);

  const navigationItems = itemRows.filter((row) => row.children.length === 3);
  const contactLinkItems = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture'));
  const searchItems = itemRows.filter((row) => row.children.length === 1);
  const extraLogoItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('picture'));

  navigationItems.forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('has-child', 'hover-red');
    li.setAttribute('itemprop', 'name');
    li.setAttribute('data-once', 'nav-close-search');
    moveInstrumentation(row, li);

    const cells = [...row.children];
    const labelCell = cells[0];
    const linkCell = cells[1];
    const hierarchyCell = cells[2];

    const link = document.createElement('a');
    link.setAttribute('itemprop', 'url');
    if (linkCell.querySelector('a')) {
      link.href = linkCell.querySelector('a').href;
      link.textContent = labelCell.textContent; // Use label for link text
    } else {
      link.href = '#';
      link.textContent = labelCell.textContent;
    }
    li.append(link);

    const span = document.createElement('span');
    const svgImg = document.createElement('img');
    svgImg.alt = 'svg file';
    // The original HTML has hardcoded SVG paths. Since we cannot hardcode,
    // we'll leave src empty and assume CSS or a later script handles it,
    // or if an actual SVG is provided in the model, it would be read.
    // For now, based on the original HTML, it's a static SVG.
    // If the model had an SVG field, we would read from there.
    span.append(svgImg);
    li.append(span);

    if (hierarchyCell && hierarchyCell.querySelector('ul')) {
      const megaMenu = document.createElement('div');
      megaMenu.classList.add('mega-menu');
      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');

      // Create left-div content based on original HTML structure for rich text
      const leftDiv = document.createElement('div');
      leftDiv.classList.add('left-div');
      const leftDivHeading = document.createElement('h4');
      leftDivHeading.classList.add('left-div-heading');
      const leftDivHeadingLink = document.createElement('a');
      leftDivHeadingLink.textContent = 'Our Purpose'; // Example text, would ideally come from model
      leftDivHeading.append(leftDivHeadingLink);
      const leftDivDesc = document.createElement('p');
      leftDivDesc.classList.add('left-div-desc');
      leftDivDesc.textContent = 'Drive positive change in the lives of our communities. Only when we enable others to rise will we rise.';
      const leftDivSubDesc = document.createElement('p');
      leftDivSubDesc.classList.add('left-div-subdesc');
      leftDivSubDesc.textContent = '#TogetherWeRise';
      leftDiv.append(leftDivHeading, leftDivDesc, leftDivSubDesc);
      centerDiv.append(leftDiv);

      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap', 'about-us-sub-nav');

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv);

      // Apply classes to nested elements from original HTML
      tempDiv.querySelectorAll('a').forEach((a) => {
        // No specific classes for these links in original HTML example,
        // but if there were, they would be added here.
      });
      tempDiv.querySelectorAll('li').forEach((liEl) => {
        // No specific classes for these list items in original HTML example
      });
      tempDiv.querySelectorAll('ul').forEach((ulEl) => {
        // No specific classes for these ul elements in original HTML example
      });

      while (tempDiv.firstChild) {
        subNavWrap.append(tempDiv.firstChild);
      }

      centerDiv.append(subNavWrap);
      megaMenuWrap.append(centerDiv);
      megaMenu.append(megaMenuWrap);
      li.append(megaMenu);
    }
    navUl.append(li);
  });

  // Contact Links (mobile/desktop icons)
  const mobileIconNav = document.createElement('div');
  mobileIconNav.classList.add('icon-nav', 'mobile-menus-icon');
  const mobileIconUl = document.createElement('ul');
  mobileIconNav.append(mobileIconUl);

  const desktopIconNav = document.createElement('div');
  desktopIconNav.classList.add('icon-nav', 'desktop-menus-icon');
  const desktopIconUl = document.createElement('ul');
  desktopIconNav.append(desktopIconUl);

  contactLinkItems.forEach((row) => {
    const cells = [...row.children];
    const linkCell = cells[0];
    const labelCell = cells[1];

    const mobileLi = document.createElement('li');
    mobileLi.classList.add('mail');
    const mobileLink = document.createElement('a');
    if (linkCell.querySelector('a')) {
      mobileLink.href = linkCell.querySelector('a').href;
      mobileLink.textContent = labelCell.textContent;
    } else {
      mobileLink.href = '#';
      mobileLink.textContent = labelCell.textContent;
    }
    moveInstrumentation(row, mobileLi);
    mobileLi.append(mobileLink);
    mobileIconUl.append(mobileLi);

    const desktopLi = document.createElement('li');
    desktopLi.classList.add('mail');
    const desktopLink = document.createElement('a');
    if (linkCell.querySelector('a')) {
      desktopLink.href = linkCell.querySelector('a').href;
    } else {
      desktopLink.href = '#';
    }
    const desktopImg = document.createElement('img');
    desktopImg.alt = 'svg file';
    // No hardcoded path, assuming a generic SVG or handled by CSS
    desktopLink.append(desktopImg);
    desktopLi.append(desktopLink);
    desktopIconUl.append(desktopLi);
  });

  // Search Links
  searchItems.forEach((row) => {
    const searchActionCell = [...row.children][0];

    const mobileLi = document.createElement('li');
    mobileLi.classList.add('search');
    mobileLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
    const mobileLink = document.createElement('a');
    mobileLink.href = '#';
    mobileLink.setAttribute('data-once', 'search-stop-propagation');

    const searchIconImg1 = document.createElement('img');
    searchIconImg1.alt = 'svg file';
    const searchIconImg2 = document.createElement('img');
    searchIconImg2.alt = 'svg file';
    const searchSpan = document.createElement('span');
    searchSpan.setAttribute('data-once', 'search-stop-propagation');
    searchSpan.textContent = ' Search';

    mobileLink.append(searchIconImg1, searchIconImg2, searchSpan);
    mobileLi.append(mobileLink);
    mobileIconUl.append(mobileLi);

    const desktopLi = document.createElement('li');
    desktopLi.classList.add('search');
    desktopLi.setAttribute('data-once', 'search-toggle search-stop-propagation');
    const desktopLink = document.createElement('a');
    desktopLink.href = '#';
    desktopLink.setAttribute('data-once', 'search-stop-propagation');

    const desktopSearchIconImg1 = document.createElement('img');
    desktopSearchIconImg1.alt = 'svg file';
    const desktopSearchIconImg2 = document.createElement('img');
    desktopSearchIconImg2.alt = 'svg file';

    desktopLink.append(desktopSearchIconImg1, desktopSearchIconImg2);
    desktopLi.append(desktopLink);
    desktopIconUl.append(desktopLi);

    // Common search screen wrap for both mobile and desktop
    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
    const searchWrapInner = document.createElement('div');
    searchWrapInner.classList.add('wrap');
    searchWrapInner.setAttribute('data-once', 'search-stop-propagation');
    searchScreenWrap.append(searchWrapInner);

    const searchForm = document.createElement('form');
    searchForm.action = searchActionCell.querySelector('a')?.href || '#';
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

    const searchIconDiv = document.createElement('div');
    searchIconDiv.classList.add('search-icon');
    searchIconDiv.setAttribute('data-once', 'search-stop-propagation');
    const searchIconSvg = document.createElement('img');
    searchIconSvg.alt = 'svg file';
    searchIconDiv.append(searchIconSvg);
    searchInputWrap.append(searchIconDiv);

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
    const submitImg = document.createElement('img');
    submitImg.alt = 'svg file';
    submitButton.append(submitLabel, submitImg);
    searchInputWrap.append(submitButton);

    // Add event listener for search toggle
    const toggleSearch = (event) => {
      event.preventDefault(); // Prevent default link behavior
      searchScreenWrap.classList.toggle('show');
    };
    mobileLink.addEventListener('click', toggleSearch);
    desktopLink.addEventListener('click', toggleSearch);

    // Add search screen wrap to both mobile and desktop parents
    // Clone for mobile to ensure separate DOM elements
    mobileLi.append(searchScreenWrap.cloneNode(true));
    desktopLi.append(searchScreenWrap); // Use original for desktop
  });

  navUl.append(mobileIconNav);
  navUl.append(desktopIconNav);

  // Extra Logos
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  wrap.append(year80LogoDiv);

  extraLogoItems.forEach((row) => {
    const cells = [...row.children];
    const logoCell = cells[0];
    const linkCell = cells[1];

    const link = document.createElement('a');
    if (linkCell.querySelector('a')) {
      link.href = linkCell.querySelector('a').href;
    } else {
      link.href = '#';
    }
    moveInstrumentation(row, link);

    const picture = logoCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '74' }]);
      optimizedPic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      link.append(optimizedPic);
    }
    year80LogoDiv.append(link);
  });

  block.textContent = '';
  block.append(header);

  // Image optimization for all pictures in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Hamburger menu functionality
  hamburgerDiv.addEventListener('click', () => {
    nav.classList.toggle('show'); // Assuming 'show' class controls visibility
    hamburgerDiv.classList.toggle('active'); // Add/remove active class for hamburger animation
  });
}
