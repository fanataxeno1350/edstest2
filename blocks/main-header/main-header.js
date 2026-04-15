import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use content detection for root fields instead of direct index access
  const children = [...block.children];
  const logoRow = children.find(row => row.children[0]?.querySelector('picture') && !row.children[0]?.querySelector('a'));
  const logoLinkRow = children.find(row => row.children[0]?.querySelector('a') && row.children[0]?.textContent.includes('Logo Link'));
  const year80LogoRow = children.find(row => row.children[0]?.querySelector('picture') && row.children[0]?.textContent.includes('80th Year Logo'));
  const year80LogoLinkRow = children.find(row => row.children[0]?.querySelector('a') && row.children[0]?.textContent.includes('80th Year Logo Link'));

  const itemRows = children.filter(row =>
    row !== logoRow && row !== logoLinkRow && row !== year80LogoRow && row !== year80LogoLinkRow
  );

  const header = document.createElement('header');
  header.classList.add('main-header', 'with-marquee', 'solid', 'nav-up');
  header.setAttribute('data-once', 'header-hover');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  header.append(containerDiv);

  const wrapDiv = document.createElement('div');
  wrapDiv.classList.add('wrap');
  containerDiv.append(wrapDiv);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo');
  wrapDiv.append(logoDiv);

  const logoLink = document.createElement('a');
  const logoHref = logoLinkRow?.querySelector('a')?.href || '#';
  logoLink.href = logoHref;
  if (logoLinkRow) {
    moveInstrumentation(logoLinkRow, logoLink);
  }
  logoDiv.append(logoLink);

  if (logoRow) {
    const logoPicture = logoRow.querySelector('picture');
    if (logoPicture) {
      const logoImg = logoPicture.querySelector('img');
      const optimizedLogoPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '200' }]);
      optimizedLogoPic.querySelector('img').classList.add('hiddenlogo1');
      moveInstrumentation(logoRow, optimizedLogoPic.querySelector('img'));
      logoLink.append(optimizedLogoPic);
    }
  }

  // Hamburger
  const hamburgerDiv = document.createElement('div');
  hamburgerDiv.classList.add('hamburger');
  hamburgerDiv.setAttribute('data-once', 'hamburger-click nav-close-search');
  wrapDiv.append(hamburgerDiv);

  const hamburgerUl = document.createElement('ul');
  hamburgerDiv.append(hamburgerUl);
  for (let i = 0; i < 3; i += 1) {
    hamburgerUl.append(document.createElement('li'));
  }

  // Navigation Menu
  const nav = document.createElement('nav');
  nav.classList.add('main-nav');
  nav.setAttribute('data-once', 'initSubChildToggle');
  wrapDiv.append(nav);

  const navUl = document.createElement('ul');
  navUl.setAttribute('itemscope', '');
  navUl.setAttribute('itemtype', 'http://www.schema.org/SiteNavigationElement');
  nav.append(navUl);

  const navigationItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('ul'));
  navigationItems.forEach((row) => {
    const navLi = document.createElement('li');
    navLi.classList.add('has-child', 'hover-red');
    navLi.setAttribute('itemprop', 'name');
    navLi.setAttribute('data-once', 'nav-close-search');
    moveInstrumentation(row, navLi);

    const cells = [...row.children];
    const labelCell = cells.find((cell) => !cell.querySelector('a') && !cell.querySelector('ul') && !cell.querySelector('picture'));
    const linkCell = cells.find((cell) => cell.querySelector('a') && !cell.querySelector('ul'));
    const hierarchyCell = cells.find((cell) => cell.querySelector('ul'));

    if (linkCell) {
      const link = document.createElement('a');
      link.setAttribute('itemprop', 'url');
      link.href = linkCell.querySelector('a')?.href || '#';
      link.textContent = labelCell?.textContent || '';
      if (labelCell) {
        moveInstrumentation(labelCell, link);
      }
      moveInstrumentation(linkCell, link);
      navLi.append(link);
    } else if (labelCell) {
      const span = document.createElement('span');
      span.textContent = labelCell.textContent;
      moveInstrumentation(labelCell, span);
      navLi.append(span);
    }

    const svgSpan = document.createElement('span');
    const svgImg = document.createElement('img');
    svgImg.alt = 'svg file';
    svgImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107678.svg+xml'; // Placeholder, as original HTML has hardcoded path
    svgSpan.append(svgImg);
    navLi.append(svgSpan);

    if (hierarchyCell) {
      const megaMenuDiv = document.createElement('div');
      megaMenuDiv.classList.add('mega-menu');
      moveInstrumentation(hierarchyCell, megaMenuDiv);

      const megaMenuWrap = document.createElement('div');
      megaMenuWrap.classList.add('wrap', 'container');
      megaMenuDiv.append(megaMenuWrap);

      const centerDiv = document.createElement('div');
      centerDiv.classList.add('center-div');
      megaMenuWrap.append(centerDiv);

      // The original HTML shows a 'left-div' and 'sub-nav-wrap' inside 'center-div'.
      // The provided EDS structure only has 'hierarchy-tree' richtext.
      // We will create a 'sub-nav-wrap' and append the hierarchy-tree content to it.
      // If the original HTML's mega-menu structure is more complex (e.g., 'left-div' with headings/paragraphs),
      // that content would need to be modeled explicitly in BlockJson.
      const subNavWrap = document.createElement('div');
      subNavWrap.classList.add('sub-nav-wrap', 'about-us-sub-nav'); // Using about-us-sub-nav as a generic class, adjust if specific
      centerDiv.append(subNavWrap);

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv

      // Apply classes from ORIGINAL HTML to nested elements
      tempDiv.querySelectorAll('a').forEach((link) => {
        // No specific classes for links in original HTML's mega menu structure for these items
      });
      tempDiv.querySelectorAll('li').forEach((li) => {
        // No specific classes for li in original HTML's mega menu structure for these items
      });
      tempDiv.querySelectorAll('ul').forEach((ul) => {
        // No specific classes for ul in original HTML's mega menu structure for these items
      });

      while (tempDiv.firstChild) {
        subNavWrap.append(tempDiv.firstChild);
      }
      navLi.append(megaMenuDiv);
    }
    navUl.append(navLi);
  });

  // Icon Navigation (Mobile and Desktop)
  const iconLinkItems = itemRows.filter((row) => row.children.length === 3 && row.querySelector('picture') && !row.querySelector('ul'));

  const createIconNav = (isMobile) => {
    const iconNavDiv = document.createElement('div');
    iconNavDiv.classList.add('icon-nav');
    if (isMobile) {
      iconNavDiv.classList.add('mobile-menus-icon');
    } else {
      iconNavDiv.classList.add('desktop-menus-icon');
    }
    const iconUl = document.createElement('ul');
    iconNavDiv.append(iconUl);

    iconLinkItems.forEach((row) => {
      const iconLi = document.createElement('li');
      const cells = [...row.children];
      const iconCell = cells.find((cell) => cell.querySelector('picture'));
      const linkCell = cells.find((cell) => cell.querySelector('a'));
      const labelCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('a'));

      if (linkCell) {
        const link = document.createElement('a');
        link.href = linkCell.querySelector('a')?.href || '#';
        moveInstrumentation(linkCell, link);

        if (iconCell) {
          const iconPicture = iconCell.querySelector('picture');
          if (iconPicture) {
            const iconImg = iconPicture.querySelector('img');
            const optimizedIconPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '24' }]); // Assuming small icon size
            moveInstrumentation(iconCell, optimizedIconPic.querySelector('img'));
            link.append(optimizedIconPic);
          }
        }
        if (labelCell && isMobile) {
          const span = document.createElement('span');
          span.textContent = labelCell.textContent;
          link.append(span);
          moveInstrumentation(labelCell, span);
        }
        iconLi.append(link);
      }
      // Assuming 'mail' or 'search' based on label text content from ORIGINAL HTML
      if (labelCell?.textContent?.toLowerCase() === 'contact us') {
        iconLi.classList.add('mail');
      } else if (labelCell?.textContent?.toLowerCase() === 'search') {
        iconLi.classList.add('search');
      }
      iconUl.append(iconLi);
    });

    // Add search functionality
    const searchLi = document.createElement('li');
    searchLi.classList.add('search');
    searchLi.setAttribute('data-once', 'search-toggle search-stop-propagation');

    const searchLink = document.createElement('a');
    searchLink.href = '#';
    searchLink.setAttribute('data-once', 'search-stop-propagation');

    const searchIconImg = document.createElement('img');
    searchIconImg.alt = 'svg file';
    searchIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107725.svg+xml'; // Placeholder
    searchLink.append(searchIconImg);

    const searchCloseIconImg = document.createElement('img');
    searchCloseIconImg.alt = 'svg file';
    searchCloseIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107749.svg+xml'; // Placeholder
    searchLink.append(searchCloseIconImg);

    if (isMobile) {
      const searchSpan = document.createElement('span');
      searchSpan.setAttribute('data-once', 'search-stop-propagation');
      searchSpan.textContent = ' Search';
      searchLink.append(searchSpan);
    }
    searchLi.append(searchLink);

    const searchScreenWrap = document.createElement('div');
    searchScreenWrap.classList.add('search-screen-wrap');
    searchScreenWrap.setAttribute('data-once', 'search-stop-propagation');
    searchLi.append(searchScreenWrap);

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

    const searchInputIconDiv = document.createElement('div');
    searchInputIconDiv.classList.add('search-icon');
    searchInputIconDiv.setAttribute('data-once', 'search-stop-propagation');
    const searchInputIconImg = document.createElement('img');
    searchInputIconImg.alt = 'svg file';
    searchInputIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107769.svg+xml'; // Placeholder
    searchInputIconDiv.append(searchInputIconImg);
    searchInputWrap.append(searchInputIconDiv);

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
    const submitImg = document.createElement('img');
    submitImg.alt = 'svg file';
    submitImg.src = '/content/dam/aemigrate/uploaded-folder/image/1776231107812.svg+xml'; // Placeholder
    submitButton.append(submitImg);
    searchInputWrap.append(submitButton);

    const searchResultBox = document.createElement('div');
    searchResultBox.classList.add('searchResultBox');
    searchResultBox.style.display = 'none';
    searchResultBox.setAttribute('data-once', 'search-stop-propagation');
    searchForm.append(searchResultBox);

    iconUl.append(searchLi);
    return iconNavDiv;
  };

  navUl.append(createIconNav(true)); // Mobile icon nav
  nav.append(createIconNav(false)); // Desktop icon nav

  // 80th Year Logo
  const year80LogoDiv = document.createElement('div');
  year80LogoDiv.classList.add('logo', 'year-80-logo');
  wrapDiv.append(year80LogoDiv);

  const year80LogoLink = document.createElement('a');
  const year80LogoHref = year80LogoLinkRow?.querySelector('a')?.href || '#';
  year80LogoLink.href = year80LogoHref;
  if (year80LogoLinkRow) {
    moveInstrumentation(year80LogoLinkRow, year80LogoLink);
  }
  year80LogoDiv.append(year80LogoLink);

  if (year80LogoRow) {
    const year80LogoPicture = year80LogoRow.querySelector('picture');
    if (year80LogoPicture) {
      const year80LogoImg = year80LogoPicture.querySelector('img');
      const optimizedYear80Pic = createOptimizedPicture(year80LogoImg.src, year80LogoImg.alt, false, [{ width: '74' }]);
      optimizedYear80Pic.querySelector('img').classList.add('hiddenlogo1', 'years-80');
      moveInstrumentation(year80LogoRow, optimizedYear80Pic.querySelector('img'));
      year80LogoLink.append(optimizedYear80Pic);
    }
  }

  // Event Listeners for hamburger and search
  hamburgerDiv.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburgerDiv.classList.toggle('close');
  });

  const searchToggle = searchLi.querySelector('a');
  const searchScreen = searchLi.querySelector('.search-screen-wrap');
  if (searchToggle && searchScreen) { // Ensure elements exist before adding listeners
    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      searchScreen.classList.toggle('active');
      searchLi.classList.toggle('active');
    });

    searchScreen.addEventListener('click', (e) => {
      if (e.target === searchScreen) {
        searchScreen.classList.remove('active');
        searchLi.classList.remove('active');
      }
    });
  }

  block.textContent = '';
  block.append(header);

  // Optimize all images within the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
