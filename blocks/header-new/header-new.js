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
      subWrap.classList.add('cmp-header__product-items'); // Use class from ORIGINAL HTML
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
  // Destructure root rows based on BlockJson model
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

  // Background Images (handled by CSS, but store data attributes)
  const backgroundDesktopPic = backgroundDesktopRow.querySelector('picture');
  const backgroundMobilePic = backgroundMobileRow.querySelector('picture');
  if (backgroundDesktopPic) {
    const img = backgroundDesktopPic.querySelector('img');
    block.dataset.desktopSrc = img.src;
  }
  if (backgroundMobilePic) {
    const img = backgroundMobilePic.querySelector('img');
    block.dataset.mobileSrc = img.src;
  }

  // Hamburger Menu
  const hamburger = document.createElement('div');
  hamburger.classList.add('cmp-header__hamburger', 'menu-mobile');
  hamburger.setAttribute('type', 'button');
  // data-mobile-src is static, not from authored content, so we can hardcode it
  hamburger.dataset.mobileSrc = 'images/Menu_icon_Default.svg';
  cmpHeader.append(hamburger);

  // Logo
  const logoWrapper = document.createElement('div');
  logoWrapper.classList.add('image', 'cmp-header__logo');
  cmpHeader.append(logoWrapper);

  const cmpImage = document.createElement('div');
  cmpImage.classList.add('cmp-image');
  logoWrapper.append(cmpImage);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image');
  cmpImage.append(logoDiv);

  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  const logoAnchor = logoLinkRow.querySelector('a'); // logo-link is type=aem-content
  if (logoAnchor) {
    logoLink.href = logoAnchor.href;
  } else {
    logoLink.href = '/'; // Default link
  }
  logoLink.dataset.social = 'header';
  logoDiv.append(logoLink);

  const logoPicture = logoRow.querySelector('picture'); // logo is type=reference
  if (logoPicture) {
    const img = logoPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '767' }, { width: '2000' }]);
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
    // Use content detection for navigation-item cells
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('ul')); // label is type=text
    const linkCell = cells.find(cell => cell.querySelector('a') && !cell.querySelector('ul')); // link is type=aem-content
    const hierarchyCell = cells.find(cell => cell.querySelector('ul')); // hierarchy-tree is type=richtext

    const li = document.createElement('li');
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0', 'cmp-header__nav-products');

    let rootEl;
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      rootEl = document.createElement('a');
      rootEl.href = foundLink.href;
      rootEl.classList.add('cmp-navigation__item-link');
    } else {
      rootEl = document.createElement('span'); // Use span for non-linked labels
      rootEl.classList.add('cmp-navigation__item-link');
    }
    rootEl.textContent = labelCell?.textContent.trim() || '';
    moveInstrumentation(row, rootEl); // Instrument the root element
    li.appendChild(rootEl);

    if (hierarchyCell) { // Check if hierarchyCell exists and contains a UL
      li.classList.add('cmp-header__nav-products-click');
      rootEl.classList.add('cmp-navigation__item-arrow');

      const dropdown = document.createElement('ul');
      dropdown.classList.add('cmp-navigation__group', 'cmp-header__product-items'); // Use classes from ORIGINAL HTML

      const categoryMenu = document.createElement('div');
      categoryMenu.classList.add('cmp-header__category-menu');
      dropdown.append(categoryMenu);

      // Create a temporary div to parse the richtext HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = hierarchyCell.innerHTML; // ESSENTIAL: Use innerHTML for richtext

      // Apply classes and move instrumentation for nested list items
      tempDiv.querySelectorAll('li').forEach((childLi) => {
        childLi.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-1', 'cmp-header__no-item');
        const childAnchor = childLi.querySelector('a');
        if (childAnchor) {
          childAnchor.classList.add('cmp-navigation__item-link');
          childAnchor.dataset.cmpClickable = '';
          moveInstrumentation(childLi, childAnchor); // Instrument the anchor
        } else {
          // If li contains only text, wrap it in a span and apply class
          const textContent = childLi.textContent.trim();
          if (textContent) {
            childLi.innerHTML = ''; // Clear original content
            const textSpan = document.createElement('span');
            textSpan.textContent = textContent;
            textSpan.classList.add('cmp-navigation__item-link');
            childLi.append(textSpan);
          }
        }
      });
      moveInstrumentation(hierarchyCell, tempDiv); // Instrument the original cell to the temp div

      // Move all children from tempDiv to categoryMenu
      while (tempDiv.firstChild) {
        categoryMenu.append(tempDiv.firstChild);
      }

      li.append(dropdown);

      rootEl.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('active');
        dropdown.classList.toggle('active');
      });
    } else {
      li.classList.add('cmp-header__no-items');
    }
    navGroup.append(li);
  });

  const mobileList = document.createElement('div');
  mobileList.classList.add('cmp-header__mobile-list');
  nav.append(mobileList);

  // Nav Icons (Search)
  const navIcons = document.createElement('div');
  navIcons.classList.add('cmp-header__nav-icons');
  cmpHeader.append(navIcons);

  const searchDiv = document.createElement('div');
  searchDiv.classList.add('cmp-header__search');
  navIcons.append(searchDiv);

  const searchLink = document.createElement('a');
  searchLink.href = '#';
  searchLink.classList.add('cmp-header__icon-img');
  searchDiv.append(searchLink);

  const searchIcon = document.createElement('div');
  searchIcon.classList.add('icon-Search_icons');
  searchLink.append(searchIcon);

  // Search component (simplified, as it's a separate block in original HTML)
  const searchSection = document.createElement('div');
  searchSection.classList.add('search'); // Use class from ORIGINAL HTML
  block.append(searchSection);

  const cmpSearch = document.createElement('section');
  cmpSearch.classList.add('cmp-search');
  cmpSearch.setAttribute('role', 'search');
  cmpSearch.dataset.cmpMinLength = '3';
  cmpSearch.dataset.cmpResultsDesktopSize = '4';
  cmpSearch.dataset.cmpResultsMobileSize = '5';
  cmpSearch.dataset.errorResponse = '{"noResultsTitle":"No result found for","noResultsDescription":"","categories":""}';
  cmpSearch.dataset.inputPlaceholder = 'Juice up your search';
  searchSection.append(cmpSearch);

  const searchInfo = document.createElement('div');
  searchInfo.classList.add('cmp_search__info');
  searchInfo.setAttribute('aria-live', 'polite');
  searchInfo.setAttribute('role', 'status');
  cmpSearch.append(searchInfo);

  const searchForm = document.createElement('form');
  searchForm.classList.add('cmp-search__form');
  searchForm.dataset.cmpHookSearch = 'form';
  searchForm.setAttribute('method', 'get');
  searchForm.setAttribute('action', '/content/itc-foods-brands/bnatural/us/en.customsearchresults.json/_jcr_content/root/header/search');
  searchForm.setAttribute('autocomplete', 'off');
  cmpSearch.append(searchForm);

  const searchInputHidden = document.createElement('input');
  searchInputHidden.setAttribute('type', 'hidden');
  searchInputHidden.setAttribute('id', 'searchroot');
  searchInputHidden.setAttribute('name', 'searchroot');
  searchInputHidden.setAttribute('value', '/content/itc-foods-brands/bnatural/us/en');
  searchForm.append(searchInputHidden);

  const searchField = document.createElement('div');
  searchField.classList.add('cmp-search__field');
  searchForm.append(searchField);

  const searchFieldIcon = document.createElement('i');
  searchFieldIcon.classList.add('cmp-search__icon');
  searchFieldIcon.dataset.cmpHookSearch = 'icon';
  searchField.append(searchFieldIcon);

  const searchLoadingIndicator = document.createElement('span');
  searchLoadingIndicator.classList.add('cmp-search__loading-indicator');
  searchLoadingIndicator.dataset.cmpHookSearch = 'loadingIndicator';
  searchField.append(searchLoadingIndicator);

  const searchInput = document.createElement('input');
  searchInput.classList.add('cmp-search__input');
  searchInput.dataset.cmpHookSearch = 'input';
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('name', 'fulltext');
  searchInput.setAttribute('placeholder', 'Search');
  searchInput.setAttribute('role', 'combobox');
  searchInput.setAttribute('aria-autocomplete', 'list');
  searchInput.setAttribute('aria-haspopup', 'true');
  searchInput.setAttribute('aria-invalid', 'false');
  searchInput.setAttribute('aria-expanded', 'false');
  searchInput.setAttribute('aria-owns', 'cmp-search-results-0');
  searchField.append(searchInput);

  const searchClearButton = document.createElement('button');
  searchClearButton.classList.add('cmp-search__clear');
  searchClearButton.dataset.cmpHookSearch = 'clear';
  searchClearButton.setAttribute('aria-label', 'Clear');
  searchField.append(searchClearButton);

  const searchClearIcon = document.createElement('i');
  searchClearIcon.classList.add('cmp-search__clear-icon');
  searchClearButton.append(searchClearIcon);

  const searchResultsBlock = document.createElement('div');
  searchResultsBlock.classList.add('cmp-search__resultsBlock');
  cmpSearch.append(searchResultsBlock);

  const searchResults = document.createElement('div');
  searchResults.classList.add('cmp-search__results');
  searchResults.setAttribute('aria-label', 'Search results');
  searchResults.dataset.cmpHookSearch = 'results';
  searchResults.setAttribute('role', 'listbox');
  searchResults.setAttribute('aria-multiselectable', 'false');
  searchResults.setAttribute('id', 'cmp-search-results-0');
  searchResultsBlock.append(searchResults);

  const itemTemplateScript = document.createElement('script');
  itemTemplateScript.dataset.cmpHookSearch = 'itemTemplate';
  itemTemplateScript.setAttribute('type', 'x-template');
  itemTemplateScript.textContent = `
    <a class="cmp-search__item" data-cmp-hook-search="item" role="option" aria-selected="false">
        <span class="cmp-search__item-title" data-cmp-hook-search="itemTitle"></span>
    </a>
  `;
  cmpSearch.append(itemTemplateScript);

  // Event listeners for hamburger menu and search toggle
  const mobileMenu = document.querySelector('.cmp-header__nav-links');
  const searchContainer = document.querySelector('.search');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    searchContainer.classList.remove('active'); // Close search if open
  });

  searchLink.addEventListener('click', (e) => {
    e.preventDefault();
    searchContainer.classList.toggle('active');
    hamburger.classList.remove('active'); // Close menu if open
    mobileMenu.classList.remove('active');
  });
}
