import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundDesktopRow,
    backgroundMobileRow,
    logoRow,
    logoLinkRow,
    ...navigationItemRows
  ] = [...block.children];

  block.innerHTML = ''; // Clear the block content

  const cmpHeader = document.createElement('div');
  cmpHeader.classList.add('cmp-header');
  block.append(cmpHeader);

  // Background Images
  const backgroundDesktopPicture = backgroundDesktopRow.querySelector('picture');
  const backgroundMobilePicture = backgroundMobileRow.querySelector('picture');

  if (backgroundDesktopPicture) {
    const img = backgroundDesktopPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
    optimizedPic.classList.add('cmp-header__background', 'cmp-header__background--desktop');
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    block.prepend(optimizedPic);
  }

  if (backgroundMobilePicture) {
    const img = backgroundMobilePicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '768' }]);
    optimizedPic.classList.add('cmp-header__background', 'cmp-header__background--mobile');
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    block.prepend(optimizedPic);
  }

  // Hamburger menu (mobile)
  const hamburger = document.createElement('div');
  hamburger.classList.add('cmp-header__hamburger', 'menu-mobile');
  hamburger.setAttribute('type', 'button');
  cmpHeader.append(hamburger);

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('image', 'cmp-header__logo');
  cmpHeader.append(logoWrapper);

  const cmpImageDiv = document.createElement('div');
  cmpImageDiv.classList.add('cmp-image');
  logoWrapper.append(cmpImageDiv);

  const logoImageDiv = document.createElement('div');
  logoImageDiv.classList.add('logo', 'image');
  cmpImageDiv.append(logoImageDiv);

  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
  }
  logoImageDiv.append(logoLink);
  moveInstrumentation(logoLinkRow, logoLink);

  const logoPicture = logoRow.querySelector('picture');
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
    optimizedPic.classList.add('cmp-image__image');
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    logoLink.append(optimizedPic);
  }

  // Navigation Links
  const navLinksDiv = document.createElement('div');
  navLinksDiv.classList.add('cmp-header__nav-links');
  cmpHeader.append(navLinksDiv);

  const navigationDiv = document.createElement('div');
  navigationDiv.classList.add('navigation');
  navLinksDiv.append(navigationDiv);

  const nav = document.createElement('nav');
  nav.classList.add('cmp-navigation');
  navigationDiv.append(nav);

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group', 'cmp-header__nav-group');
  nav.append(navGroup);

  navigationItemRows.forEach((row) => {
    const cells = [...row.children];
    // Content detection for navigation-item fields
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('ul'));
    const linkCell = cells.find(cell => cell.querySelector('a') && !cell.querySelector('ul'));
    const hierarchyCell = cells.find(cell => cell.querySelector('ul'));

    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products');
    navGroup.append(li);

    const foundLink = linkCell?.querySelector('a');
    let rootEl;
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
      rootEl.classList.add('cmp-navigation__item-link');
    } else {
      rootEl = document.createElement('span'); // Use span for non-linked labels
      rootEl.classList.add('cmp-navigation__item-link');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl); // Move instrumentation from the row to the root element
    li.appendChild(rootEl);

    if (hierarchyCell) {
      li.classList.add('cmp-header__nav-products-click');
      rootEl.classList.add('cmp-navigation__item-arrow');

      const wrapper = document.createElement('ul');
      wrapper.classList.add('cmp-navigation__group', 'cmp-header__product-items');
      const categoryMenu = document.createElement('div');
      categoryMenu.classList.add('cmp-header__category-menu');
      wrapper.appendChild(categoryMenu);

      // Create a temporary div to parse the richtext HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML;
      moveInstrumentation(hierarchyCell, tempDiv); // Move instrumentation from original cell to tempDiv

      const hierarchyRootUl = tempDiv.querySelector('ul');
      if (hierarchyRootUl) {
        // Process top-level <li> elements within the hierarchyRootUl
        [...hierarchyRootUl.children].forEach((itemLi) => {
          if (itemLi.tagName === 'LI') {
            const newLi = document.createElement('li');
            newLi.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1', 'cmp-header__no-item');

            const itemLink = itemLi.querySelector(':scope > a');
            let itemRootEl;
            if (itemLink) {
              itemRootEl = document.createElement('a');
              itemRootEl.href = itemLink.href;
              itemRootEl.textContent = itemLink.textContent.trim();
              itemRootEl.classList.add('cmp-navigation__item-link');
              itemRootEl.setAttribute('data-cmp-clickable', '');
              moveInstrumentation(itemLink, itemRootEl); // Move instrumentation from original link
            } else {
              // Fallback for plain text li or span
              itemRootEl = document.createElement('span');
              itemRootEl.textContent = itemLi.textContent.trim();
              itemRootEl.classList.add('cmp-navigation__item-link');
              moveInstrumentation(itemLi, itemRootEl); // Move instrumentation from original li
            }
            newLi.appendChild(itemRootEl);

            const subUl = itemLi.querySelector(':scope > ul');
            if (subUl) {
              // If there's a sub-list, create a wrapper for it and attach event listener
              const subWrapper = document.createElement('ul');
              subWrapper.classList.add('cmp-navigation__group', 'cmp-header__product-items'); // Re-use classes if applicable
              
              // Move children from subUl to subWrapper
              while (subUl.firstChild) {
                subWrapper.appendChild(subUl.firstChild);
              }
              newLi.appendChild(subWrapper);

              itemRootEl.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                newLi.classList.toggle('active');
                subWrapper.classList.toggle('active');
              });
            }
            categoryMenu.appendChild(newLi);
          }
        });
      }
      li.appendChild(wrapper);

      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        wrapper.classList.toggle('active');
      });
    } else {
      li.classList.add('cmp-header__no-items');
    }
  });

  // Mobile list container
  const mobileList = document.createElement('div');
  mobileList.classList.add('cmp-header__mobile-list');
  nav.append(mobileList);

  // Nav Icons (Search)
  const navIconsDiv = document.createElement('div');
  navIconsDiv.classList.add('cmp-header__nav-icons');
  cmpHeader.append(navIconsDiv);

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('cmp-header__search');
  navIconsDiv.append(searchDiv);

  const searchLink = document.createElement('a');
  searchLink.href = '#';
  searchLink.classList.add('cmp-header__icon-img');
  searchDiv.append(searchLink);

  const searchIcon = document.createElement('div');
  searchIcon.classList.add('icon-Search_icons');
  searchLink.append(searchIcon);

  // Search section (initially hidden, toggled by search icon)
  const searchSection = document.createElement('section');
  searchSection.classList.add('search', 'cmp-search');
  searchSection.setAttribute('role', 'search');
  searchSection.setAttribute('data-cmp-min-length', '3');
  searchSection.setAttribute('data-cmp-results-desktop-size', '4');
  searchSection.setAttribute('data-cmp-results-mobile-size', '5');
  searchSection.setAttribute('data-error-response', '{"noResultsTitle":"No result found for","noResultsDescription":"","categories":""}');
  searchSection.setAttribute('data-input-placeholder', 'Juice up your search');
  block.append(searchSection);

  const searchInfo = document.createElement('div');
  searchInfo.classList.add('cmp_search__info');
  searchInfo.setAttribute('aria-live', 'polite');
  searchInfo.setAttribute('role', 'status');
  searchSection.append(searchInfo);

  const searchForm = document.createElement('form');
  searchForm.classList.add('cmp-search__form');
  searchForm.setAttribute('data-cmp-hook-search', 'form');
  searchForm.setAttribute('method', 'get');
  searchForm.setAttribute('action', '/content/itc-foods-brands/bnatural/us/en/our-story.customsearchresults.json/_jcr_content/root/header/search');
  searchForm.setAttribute('autocomplete', 'off');
  searchSection.append(searchForm);

  const searchRootInput = document.createElement('input');
  searchRootInput.type = 'hidden';
  searchRootInput.id = 'searchroot';
  searchRootInput.name = 'searchroot';
  searchRootInput.value = '/content/itc-foods-brands/bnatural/us/en';
  searchForm.append(searchRootInput);

  const searchField = document.createElement('div');
  searchField.classList.add('cmp-search__field');
  searchForm.append(searchField);

  const searchFieldIcon = document.createElement('i');
  searchFieldIcon.classList.add('cmp-search__icon');
  searchFieldIcon.setAttribute('data-cmp-hook-search', 'icon');
  searchField.append(searchFieldIcon);

  const searchLoadingIndicator = document.createElement('span');
  searchLoadingIndicator.classList.add('cmp-search__loading-indicator');
  searchLoadingIndicator.setAttribute('data-cmp-hook-search', 'loadingIndicator');
  searchField.append(searchLoadingIndicator);

  const searchInput = document.createElement('input');
  searchInput.classList.add('cmp-search__input');
  searchInput.setAttribute('data-cmp-hook-search', 'input');
  searchInput.type = 'text';
  searchInput.name = 'fulltext';
  searchInput.placeholder = 'Search';
  searchInput.setAttribute('role', 'combobox');
  searchInput.setAttribute('aria-autocomplete', 'list');
  searchInput.setAttribute('aria-haspopup', 'true');
  searchInput.setAttribute('aria-invalid', 'false');
  searchInput.setAttribute('aria-expanded', 'false');
  searchInput.setAttribute('aria-owns', 'cmp-search-results-0');
  searchField.append(searchInput);

  const searchClearButton = document.createElement('button');
  searchClearButton.classList.add('cmp-search__clear');
  searchClearButton.setAttribute('data-cmp-hook-search', 'clear');
  searchClearButton.setAttribute('aria-label', 'Clear');
  searchField.append(searchClearButton);

  const searchClearIcon = document.createElement('i');
  searchClearIcon.classList.add('cmp-search__clear-icon');
  searchClearButton.append(searchClearIcon);

  const searchResultsBlock = document.createElement('div');
  searchResultsBlock.classList.add('cmp-search__resultsBlock');
  searchSection.append(searchResultsBlock);

  const searchResults = document.createElement('div');
  searchResults.classList.add('cmp-search__results');
  searchResults.setAttribute('aria-label', 'Search results');
  searchResults.setAttribute('data-cmp-hook-search', 'results');
  searchResults.setAttribute('role', 'listbox');
  searchResults.setAttribute('aria-multiselectable', 'false');
  searchResults.id = 'cmp-search-results-0';
  searchResultsBlock.append(searchResults);

  const itemTemplateScript = document.createElement('script');
  itemTemplateScript.setAttribute('data-cmp-hook-search', 'itemTemplate');
  itemTemplateScript.type = 'x-template';
  itemTemplateScript.textContent = `
    <a class="cmp-search__item" data-cmp-hook-search="item" role="option" aria-selected="false">
        <span class="cmp-search__item-title" data-cmp-hook-search="itemTitle"></span>
    </a>
  `;
  searchSection.append(itemTemplateScript);

  // Event Listeners for interactive elements
  hamburger.addEventListener('click', () => {
    navLinksDiv.classList.toggle('active');
    hamburger.classList.toggle('active');
    document.body.classList.toggle('no-scroll'); // Assuming this class exists to prevent body scroll
  });

  searchLink.addEventListener('click', (e) => {
    e.preventDefault();
    searchSection.classList.toggle('active');
  });

  searchClearButton.addEventListener('click', (e) => {
    e.preventDefault();
    searchInput.value = '';
    // Optionally clear search results here
  });
}
