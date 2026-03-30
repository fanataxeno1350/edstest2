import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const header = document.createElement('header');
  header.className = 'experiencefragment-itc-header-section';

  const container = document.createElement('div');
  container.className = 'experiencefragment-container';
  header.append(container);

  const nav = document.createElement('nav');
  nav.className = 'experiencefragment-navbar experiencefragment-navbar-expand-xl experiencefragment-navbar-light experiencefragment-bg-light experiencefragment-px-xl-5 experiencefragment-d-flex experiencefragment-justify-content-between experiencefragment-align-items-center';
  container.append(nav);

  // Toggler Button
  const togglerButton = document.createElement('button');
  togglerButton.className = 'experiencefragment-navbar-toggler experiencefragment-collapsed';
  togglerButton.type = 'button';
  togglerButton.setAttribute('data-toggle', 'collapse');
  togglerButton.setAttribute('data-target', '#navbarSupportedContent');
  togglerButton.setAttribute('aria-controls', 'navbarSupportedContent');
  togglerButton.setAttribute('aria-expanded', 'false');
  togglerButton.setAttribute('aria-label', 'Toggle navigation');
  const togglerSpan = document.createElement('span');
  togglerSpan.className = 'experiencefragment-navbar-toggler-icon';
  togglerButton.append(togglerSpan);
  nav.append(togglerButton);
  moveInstrumentation(block.querySelector('button.experiencefragment-navbar-toggler'), togglerButton);

  const dXlNoneDiv = document.createElement('div');
  dXlNoneDiv.className = 'experiencefragment-d-xl-none';
  dXlNoneDiv.innerHTML = '&nbsp;';
  nav.append(dXlNoneDiv);

  // Logo Section
  const logoDiv = document.createElement('div');
  logoDiv.className = 'experiencefragment-logo experiencefragment-image';
  const logoCmpDiv = document.createElement('div');
  logoCmpDiv.setAttribute('data-cmp-is', 'image');
  logoCmpDiv.id = 'logo-5a4887d867';
  logoCmpDiv.className = 'experiencefragment-cmp-image experiencefragment-header-logo-div';
  logoCmpDiv.setAttribute('itemscope', '');
  logoCmpDiv.setAttribute('itemtype', 'http://schema.org/ImageObject');

  const mainLogoLinkInput = block.querySelector('[data-aue-prop="mainLogoLink"]');
  const mainLogoLink = mainLogoLinkInput ? mainLogoLinkInput.querySelector('a') : null;
  if (mainLogoLink) {
    const a = document.createElement('a');
    a.href = mainLogoLink.href;
    a.target = '_blank';
    a.className = 'experiencefragment-checkLogoLink';
    const img = block.querySelector('[data-aue-prop="mainLogo"]');
    if (img) {
      a.append(createOptimizedPicture(img.src, img.alt));
      moveInstrumentation(img, a);
    }
    const span = document.createElement('span');
    span.className = 'experiencefragment-cmp-link__screen-reader-only';
    span.textContent = 'opens in a new tab';
    a.append(span);
    logoCmpDiv.append(a);
    moveInstrumentation(mainLogoLink, a);
  }

  const logo2LinkInput = block.querySelector('[data-aue-prop="logo2Link"]');
  const logo2Link = logo2LinkInput ? logo2LinkInput.querySelector('a') : null;
  if (logo2Link) {
    const a = document.createElement('a');
    a.href = logo2Link.href;
    a.target = '_blank';
    a.className = 'experiencefragment-cmp-image__link';
    const img = block.querySelector('[data-aue-prop="logo2Image"]');
    if (img) {
      a.append(createOptimizedPicture(img.src, img.alt));
      moveInstrumentation(img, a);
    }
    const span = document.createElement('span');
    span.className = 'experiencefragment-cmp-link__screen-reader-only';
    span.textContent = 'opens in a new tab';
    a.append(span);
    logoCmpDiv.append(a);
    moveInstrumentation(logo2Link, a);
  }

  logoDiv.append(logoCmpDiv);
  nav.append(logoDiv);

  // Collapsible Content
  const collapseDiv = document.createElement('div');
  collapseDiv.className = 'experiencefragment-collapse experiencefragment-navbar-collapse experiencefragment-justify-content-center';
  collapseDiv.id = 'navbarSupportedContent';
  nav.append(collapseDiv);

  // Navigation Links
  const navItemNavigation = document.createElement('div');
  navItemNavigation.className = 'experiencefragment-nav-item experiencefragment-navigation';
  const navCmp = document.createElement('nav');
  navCmp.id = 'navigation-6d5dcb0126';
  navCmp.className = 'experiencefragment-cmp-navigation';
  navCmp.setAttribute('itemscope', '');
  navCmp.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  navCmp.setAttribute('role', 'navigation');
  const navGroup = document.createElement('ul');
  navGroup.className = 'experiencefragment-cmp-navigation__group';

  const navigationLinks = block.querySelectorAll('[data-aue-model="navigationLink"]');
  navigationLinks.forEach((itemNode) => {
    const li = document.createElement('li');
    li.className = 'experiencefragment-cmp-navigation__item experiencefragment-cmp-navigation__item--level-0';
    const linkElement = itemNode.querySelector('[data-aue-prop="link"] a');
    if (linkElement) {
      const a = document.createElement('a');
      a.className = 'experiencefragment-cmp-navigation__item-link';
      a.href = linkElement.href;
      a.textContent = linkElement.textContent;
      li.append(a);
      moveInstrumentation(linkElement, a);
    }
    navGroup.append(li);
    moveInstrumentation(itemNode, li);
  });

  navCmp.append(navGroup);
  navItemNavigation.append(navCmp);
  collapseDiv.append(navItemNavigation);

  // Header Section with Search and Country Selector
  const headerSectionDiv = document.createElement('div');
  headerSectionDiv.className = 'experiencefragment-header-section experiencefragment-d-flex experiencefragment-align-items-center experiencefragment-justify-content-end';

  const searchIcon = block.querySelector('[data-aue-prop="searchIcon"]');
  const countryFlagIn = block.querySelector('[data-aue-prop="countryFlagIn"]');
  const countryFlagUSA = block.querySelector('[data-aue-prop="countryFlagUSA"]');
  const dropdownIcon = block.querySelector('[data-aue-prop="dropdownIcon"]');

  if (searchIcon || countryFlagIn || countryFlagUSA || dropdownIcon) {
    const searchCountrySelectorDiv = document.createElement('div');
    searchCountrySelectorDiv.className = 'experiencefragment-search-icon experiencefragment-country-selector-trigger experiencefragment-d-flex experiencefragment-align-items-center';
    searchCountrySelectorDiv.setAttribute('data-toggle', 'modal');
    searchCountrySelectorDiv.setAttribute('data-target', '#countryModal');
    searchCountrySelectorDiv.setAttribute('data-flag-in', countryFlagIn ? countryFlagIn.src : '');
    searchCountrySelectorDiv.setAttribute('data-flag-usa', countryFlagUSA ? countryFlagUSA.src : '');

    const countryCodeSpan = document.createElement('span');
    countryCodeSpan.className = 'experiencefragment-country-code';
    countryCodeSpan.textContent = 'IN'; // Default
    searchCountrySelectorDiv.append(countryCodeSpan);

    if (countryFlagIn) {
      const flagImg = createOptimizedPicture(countryFlagIn.src, countryFlagIn.alt);
      flagImg.className = 'experiencefragment-header-country-flag';
      searchCountrySelectorDiv.append(flagImg);
      moveInstrumentation(countryFlagIn, flagImg);
    }

    if (dropdownIcon) {
      const dropdownImg = createOptimizedPicture(dropdownIcon.src, dropdownIcon.alt);
      dropdownImg.className = 'experiencefragment-dropdown-icon';
      searchCountrySelectorDiv.append(dropdownImg);
      moveInstrumentation(dropdownIcon, dropdownImg);
    }
    headerSectionDiv.append(searchCountrySelectorDiv);
  }

  collapseDiv.append(headerSectionDiv);

  // ITC Header Icon List
  const itcHeaderIconList = document.createElement('div');
  itcHeaderIconList.className = 'experiencefragment-itc-header-icon-list';

  // Search Block
  const searchBlockDiv = document.createElement('div');
  searchBlockDiv.id = 'searchBlock';
  searchBlockDiv.className = 'experiencefragment-search-block experiencefragment-hidden';

  const searchBoxDiv = document.createElement('div');
  searchBoxDiv.id = 'searchBox';
  searchBoxDiv.className = 'experiencefragment-search-box';

  const searchContainerDiv = document.createElement('div');
  searchContainerDiv.id = 'searchContainer';
  searchContainerDiv.className = 'experiencefragment-search-container experiencefragment-hidden';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'searchInput';
  searchInput.placeholder = 'Search';
  searchContainerDiv.append(searchInput);

  const searchButton = document.createElement('button');
  searchButton.id = 'searchButton';
  const searchBlockIcon = block.querySelector('[data-aue-prop="searchBlockIcon"]');
  if (searchBlockIcon) {
    searchButton.append(createOptimizedPicture(searchBlockIcon.src, searchBlockIcon.alt));
    moveInstrumentation(searchBlockIcon, searchButton);
  }
  searchContainerDiv.append(searchButton);
  searchBoxDiv.append(searchContainerDiv);

  const closeIcon = block.querySelector('[data-aue-prop="closeIcon"]');
  if (closeIcon) {
    const closeButton = createOptimizedPicture(closeIcon.src, closeIcon.alt);
    closeButton.id = 'closeButton';
    searchBoxDiv.append(closeButton);
    moveInstrumentation(closeIcon, closeButton);
  }
  searchBlockDiv.append(searchBoxDiv);

  const searchResultsDiv = document.createElement('div');
  searchResultsDiv.id = 'searchResults';
  searchResultsDiv.className = 'experiencefragment-search-results experiencefragment-hidden';

  const popularSuggestionsH4 = document.createElement('h4');
  popularSuggestionsH4.className = 'experiencefragment-resultList';
  popularSuggestionsH4.textContent = 'Popular Suggestions';
  searchResultsDiv.append(popularSuggestionsH4);

  const suggestionsListUl = document.createElement('ul');
  suggestionsListUl.id = 'suggestionsList';
  searchResultsDiv.append(suggestionsListUl);

  const pagesH4 = document.createElement('h4');
  pagesH4.className = 'experiencefragment-resultList';
  pagesH4.textContent = 'Pages';
  searchResultsDiv.append(pagesH4);

  const productsListUl = document.createElement('ul');
  productsListUl.id = 'productsList';
  productsListUl.className = 'experiencefragment-products';
  searchResultsDiv.append(productsListUl);

  const viewAllButton = document.createElement('button');
  viewAllButton.id = 'viewAllButton';
  viewAllButton.textContent = 'VIEW ALL ITEMS';
  searchResultsDiv.append(viewAllButton);

  searchBlockDiv.append(searchResultsDiv);
  itcHeaderIconList.append(searchBlockDiv);

  const searchNavLink = document.createElement('a');
  searchNavLink.className = 'experiencefragment-nav-link';
  if (searchIcon) {
    const searchImg = createOptimizedPicture(searchIcon.src, searchIcon.alt);
    searchImg.id = 'searchIcon';
    searchNavLink.append(searchImg);
    moveInstrumentation(searchIcon, searchImg);
  }
  const searchSpan = document.createElement('span');
  searchSpan.className = 'experiencefragment-d-block';
  searchSpan.textContent = 'Search';
  searchNavLink.append(searchSpan);
  itcHeaderIconList.append(searchNavLink);

  const emptyNavItem = document.createElement('li');
  emptyNavItem.className = 'experiencefragment-nav-item';
  const emptyNavLink = document.createElement('a');
  emptyNavLink.className = 'experiencefragment-nav-link';
  emptyNavItem.append(emptyNavLink);
  itcHeaderIconList.append(emptyNavItem);

  nav.append(itcHeaderIconList);

  // Country Modal
  const modalDiv = document.createElement('div');
  modalDiv.className = 'experiencefragment-modal experiencefragment-fade experiencefragment-itc-country-selector experiencefragment-show';
  modalDiv.id = 'countryModal';
  modalDiv.tabIndex = '-1';
  modalDiv.setAttribute('role', 'dialog');
  modalDiv.setAttribute('aria-labelledby', 'countryModalLabel');
  modalDiv.setAttribute('aria-modal', 'true');
  modalDiv.style.display = 'block';

  const modalDialog = document.createElement('div');
  modalDialog.className = 'experiencefragment-modal-dialog experiencefragment-modal-dialog-centered';
  modalDialog.setAttribute('role', 'document');
  modalDiv.append(modalDialog);

  const modalContent = document.createElement('div');
  modalContent.className = 'experiencefragment-modal-content';
  modalDialog.append(modalContent);

  const modalHeader = document.createElement('div');
  modalHeader.className = 'experiencefragment-modal-header experiencefragment-border-0 experiencefragment-text-center';
  modalContent.append(modalHeader);

  const w100Div = document.createElement('div');
  w100Div.className = 'experiencefragment-w-100';
  modalHeader.append(w100Div);

  const modalTitle = block.querySelector('[data-aue-prop="modalTitle"]');
  if (modalTitle) {
    const h2 = document.createElement('h2');
    h2.className = 'experiencefragment-modal-title';
    h2.innerHTML = modalTitle.innerHTML;
    w100Div.append(h2);
    moveInstrumentation(modalTitle, h2);
  }

  const modalExperienceText = block.querySelector('[data-aue-prop="modalExperienceText"]');
  if (modalExperienceText) {
    const p = document.createElement('p');
    p.className = 'experiencefragment-experience-text';
    p.textContent = modalExperienceText.textContent;
    w100Div.append(p);
    moveInstrumentation(modalExperienceText, p);
  }

  const modalBody = document.createElement('div');
  modalBody.className = 'experiencefragment-modal-body';
  modalContent.append(modalBody);

  const countryOptionsDiv = document.createElement('div');
  countryOptionsDiv.className = 'experiencefragment-country-options experiencefragment-d-flex experiencefragment-justify-content-center experiencefragment-align-items-center';

  const countryOptions = block.querySelectorAll('[data-aue-model="countryOption"]');
  countryOptions.forEach((itemNode) => {
    const optionDiv = document.createElement('div');
    optionDiv.className = 'experiencefragment-country-option experiencefragment-mx-3 experiencefragment-d-flex experiencefragment-flex-column experiencefragment-align-items-center';

    const countryName = itemNode.querySelector('[data-aue-prop="countryName"]');
    const flagImage = itemNode.querySelector('[data-aue-prop="flag"]');

    if (countryName) {
      optionDiv.setAttribute('data-country', countryName.textContent.toLowerCase());
      optionDiv.setAttribute('data-url', `/${countryName.textContent.toLowerCase()}`);
    }

    if (flagImage) {
      const img = createOptimizedPicture(flagImage.src, flagImage.alt);
      img.className = `experiencefragment-country-flag experiencefragment-${countryName ? countryName.textContent.toLowerCase() : ''}-flag`;
      optionDiv.append(img);
      moveInstrumentation(flagImage, img);
    }

    if (countryName) {
      const p = document.createElement('p');
      p.className = 'experiencefragment-country-name';
      p.textContent = countryName.textContent;
      optionDiv.append(p);
      moveInstrumentation(countryName, p);
    }

    countryOptionsDiv.append(optionDiv);
    moveInstrumentation(itemNode, optionDiv);
  });

  modalBody.append(countryOptionsDiv);
  header.append(modalDiv);

  block.textContent = '';
  block.append(header);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
