import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const headerContainer = document.createElement('div');
  headerContainer.classList.add('header-container');

  const nav = document.createElement('nav');
  nav.classList.add('header-navbar', 'header-navbar-expand-xl', 'header-navbar-light', 'header-bg-light', 'header-px-xl-5', 'header-d-flex', 'header-justify-content-between', 'header-align-items-center');

  const togglerButton = document.createElement('button');
  togglerButton.classList.add('header-navbar-toggler', 'header-collapsed');
  togglerButton.setAttribute('type', 'button');
  togglerButton.setAttribute('data-toggle', 'collapse');
  togglerButton.setAttribute('data-target', '#navbarSupportedContent');
  togglerButton.setAttribute('aria-controls', 'navbarSupportedContent');
  togglerButton.setAttribute('aria-expanded', 'false');
  togglerButton.setAttribute('aria-label', 'Toggle navigation');
  const togglerSpan = document.createElement('span');
  togglerSpan.classList.add('header-navbar-toggler-icon');
  togglerButton.append(togglerSpan);
  moveInstrumentation(block.querySelector('button.header-navbar-toggler'), togglerButton);

  const dXlNoneDiv = document.createElement('div');
  dXlNoneDiv.classList.add('header-d-xl-none');
  dXlNoneDiv.innerHTML = '&nbsp;';
  moveInstrumentation(block.querySelector('.header-d-xl-none'), dXlNoneDiv);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('header-logo', 'header-image');
  const logoImageAUE = block.querySelector('[data-aue-prop="logoImage"]');
  if (logoImageAUE) {
    const logoLinkAUE = block.querySelector('[data-aue-prop="logoLink"]');
    const logoLink = document.createElement('a');
    logoLink.classList.add('header-cmp-image__link');
    logoLink.setAttribute('target', '_blank');
    if (logoLinkAUE) {
      logoLink.setAttribute('href', logoLinkAUE.textContent.trim());
      moveInstrumentation(logoLinkAUE, logoLink);
    }
    const logoImg = logoImageAUE.querySelector('img');
    if (logoImg) {
      const picture = createOptimizedPicture(logoImg.src, logoImg.alt);
      logoLink.append(picture);
      moveInstrumentation(logoImageAUE, picture);
    }
    logoDiv.append(logoLink);
  }

  const collapseDiv = document.createElement('div');
  collapseDiv.classList.add('header-collapse', 'header-navbar-collapse', 'header-justify-content-center');
  collapseDiv.setAttribute('id', 'navbarSupportedContent');

  const navItemNavDiv = document.createElement('div');
  navItemNavDiv.classList.add('header-nav-item', 'header-navigation');
  const navCmpNav = document.createElement('nav');
  navCmpNav.setAttribute('id', 'navigation-6d5dcb0126');
  navCmpNav.classList.add('header-cmp-navigation');
  navCmpNav.setAttribute('itemscope', '');
  navCmpNav.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  navCmpNav.setAttribute('role', 'navigation');
  const navCmpGroup = document.createElement('ul');
  navCmpGroup.classList.add('header-cmp-navigation__group');

  const shopLinkAUE = block.querySelector('[data-aue-prop="shopLink"]');
  if (shopLinkAUE) {
    const shopLi = document.createElement('li');
    shopLi.classList.add('header-cmp-navigation__item', 'header-cmp-navigation__item--level-0');
    const shopA = document.createElement('a');
    shopA.classList.add('header-cmp-navigation__item-link');
    shopA.setAttribute('href', shopLinkAUE.textContent.trim());
    shopA.textContent = 'Shop';
    shopLi.append(shopA);
    navCmpGroup.append(shopLi);
    moveInstrumentation(shopLinkAUE, shopA);
  }

  const ourHeritageLinkAUE = block.querySelector('[data-aue-prop="ourHeritageLink"]');
  if (ourHeritageLinkAUE) {
    const heritageLi = document.createElement('li');
    heritageLi.classList.add('header-cmp-navigation__item', 'header-cmp-navigation__item--level-0');
    const heritageA = document.createElement('a');
    heritageA.classList.add('header-cmp-navigation__item-link');
    heritageA.setAttribute('href', ourHeritageLinkAUE.textContent.trim());
    heritageA.textContent = 'Our Heritage';
    heritageLi.append(heritageA);
    navCmpGroup.append(heritageLi);
    moveInstrumentation(ourHeritageLinkAUE, heritageA);
  }

  navCmpNav.append(navCmpGroup);
  navItemNavDiv.append(navCmpNav);

  const sectionDiv = document.createElement('div');
  sectionDiv.classList.add('header-section', 'header-d-flex', 'header-align-items-center', 'header-justify-content-end');

  const countrySelectorDiv = document.createElement('div');
  countrySelectorDiv.classList.add('header-search-icon', 'header-country-selector-trigger', 'header-d-flex', 'header-align-items-center');
  countrySelectorDiv.setAttribute('data-toggle', 'modal');
  countrySelectorDiv.setAttribute('data-target', '#countryModal');

  const countryCodeSpan = document.createElement('span');
  countryCodeSpan.classList.add('header-country-code');
  countryCodeSpan.textContent = 'IN'; // Default
  countrySelectorDiv.append(countryCodeSpan);

  const flagIndiaAUE = block.querySelector('[data-aue-prop="flagIndia"]');
  if (flagIndiaAUE) {
    const flagImg = document.createElement('img');
    flagImg.classList.add('header-country-flag');
    flagImg.setAttribute('src', flagIndiaAUE.textContent.trim());
    flagImg.setAttribute('alt', 'flag');
    countrySelectorDiv.append(flagImg);
    countrySelectorDiv.setAttribute('data-flag-in', flagIndiaAUE.textContent.trim());
    moveInstrumentation(flagIndiaAUE, flagImg);
  }

  const flagUSAAUE = block.querySelector('[data-aue-prop="flagUSA"]');
  if (flagUSAAUE) {
    countrySelectorDiv.setAttribute('data-flag-usa', flagUSAAUE.textContent.trim());
    moveInstrumentation(flagUSAAUE, countrySelectorDiv);
  }

  const dropdownIcon = document.createElement('img');
  dropdownIcon.setAttribute('src', '/content/dam/aemigrate/uploaded-folder/image/dropdown-icon.png');
  dropdownIcon.setAttribute('alt', 'dropdown-icon');
  dropdownIcon.classList.add('header-dropdown-icon');
  countrySelectorDiv.append(dropdownIcon);

  sectionDiv.append(countrySelectorDiv);

  collapseDiv.append(navItemNavDiv, sectionDiv);

  const itcHeaderIconList = document.createElement('div');
  itcHeaderIconList.classList.add('header-itc-header-icon-list');

  const searchBlock = document.createElement('div');
  searchBlock.setAttribute('id', 'searchBlock');
  searchBlock.classList.add('header-search-block', 'header-hidden');

  const searchBox = document.createElement('div');
  searchBox.setAttribute('id', 'searchBox');
  searchBox.classList.add('header-search-box');

  const searchContainer = document.createElement('div');
  searchContainer.setAttribute('id', 'searchContainer');
  searchContainer.classList.add('header-search-container', 'header-hidden');

  const searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('id', 'searchInput');
  searchInput.setAttribute('placeholder', 'Search');

  const searchButton = document.createElement('button');
  searchButton.setAttribute('id', 'searchButton');
  const searchButtonImg = document.createElement('img');
  searchButtonImg.setAttribute('loading', 'lazy');
  searchButtonImg.setAttribute('src', '/content/dam/aemigrate/uploaded-folder/image/search-icon.png');
  searchButtonImg.setAttribute('alt', 'Search icon');
  searchButton.append(searchButtonImg);

  searchContainer.append(searchInput, searchButton);

  const closeButton = document.createElement('img');
  closeButton.setAttribute('id', 'closeButton');
  closeButton.setAttribute('loading', 'lazy');
  closeButton.setAttribute('src', '/content/dam/aemigrate/uploaded-folder/image/1774253626039.svg+xml');
  closeButton.setAttribute('alt', 'Close icon');

  searchBox.append(searchContainer, closeButton);

  const searchResults = document.createElement('div');
  searchResults.setAttribute('id', 'searchResults');
  searchResults.classList.add('header-search-results', 'header-hidden');

  const popularSuggestionsH4 = document.createElement('h4');
  popularSuggestionsH4.classList.add('header-resultList');
  popularSuggestionsH4.textContent = 'Popular Suggestions';
  const suggestionsList = document.createElement('ul');
  suggestionsList.setAttribute('id', 'suggestionsList');

  const pagesH4 = document.createElement('h4');
  pagesH4.classList.add('header-resultList');
  pagesH4.textContent = 'Pages';
  const productsList = document.createElement('ul');
  productsList.setAttribute('id', 'productsList');
  productsList.classList.add('header-products');

  const viewAllButton = document.createElement('button');
  viewAllButton.setAttribute('id', 'viewAllButton');
  viewAllButton.textContent = 'VIEW ALL ITEMS';

  searchResults.append(popularSuggestionsH4, suggestionsList, pagesH4, productsList, viewAllButton);
  searchBlock.append(searchBox, searchResults);

  const searchLink = document.createElement('a');
  searchLink.classList.add('header-nav-link');

  const searchIconAUE = block.querySelector('[data-aue-prop="searchIcon"]');
  if (searchIconAUE) {
    const searchIconImg = document.createElement('img');
    searchIconImg.setAttribute('loading', 'lazy');
    searchIconImg.setAttribute('id', 'searchIcon');
    searchIconImg.setAttribute('src', searchIconAUE.textContent.trim());
    searchIconImg.setAttribute('alt', 'Search icon');
    searchLink.append(searchIconImg);
    moveInstrumentation(searchIconAUE, searchIconImg);
  }

  const searchSpan = document.createElement('span');
  searchSpan.classList.add('header-d-block');
  searchSpan.textContent = 'Search';
  searchLink.append(searchSpan);

  itcHeaderIconList.append(searchBlock, searchLink);

  nav.append(togglerButton, dXlNoneDiv, logoDiv, collapseDiv, itcHeaderIconList);
  headerContainer.append(nav);

  const modal = document.createElement('div');
  modal.classList.add('header-modal', 'header-fade', 'header-itc-country-selector', 'header-show');
  modal.setAttribute('id', 'countryModal');
  modal.setAttribute('tabindex', '-1');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', 'countryModalLabel');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('style', 'display: block;');

  const modalDialog = document.createElement('div');
  modalDialog.classList.add('header-modal-dialog', 'header-modal-dialog-centered');
  modalDialog.setAttribute('role', 'document');

  const modalContent = document.createElement('div');
  modalContent.classList.add('header-modal-content');

  const modalHeader = document.createElement('div');
  modalHeader.classList.add('header-modal-header', 'header-border-0', 'header-text-center');

  const modalHeaderW100 = document.createElement('div');
  modalHeaderW100.classList.add('header-w-100');

  const modalTitle = document.createElement('h2');
  modalTitle.classList.add('header-modal-title');
  modalTitle.innerHTML = 'SELECT YOUR <br>KITCHENS OF INDIA';

  const experienceText = document.createElement('p');
  experienceText.classList.add('header-experience-text');
  experienceText.textContent = 'Experience';

  modalHeaderW100.append(modalTitle, experienceText);
  modalHeader.append(modalHeaderW100);

  const modalBody = document.createElement('div');
  modalBody.classList.add('header-modal-body');

  const countryOptions = document.createElement('div');
  countryOptions.classList.add('header-country-options', 'header-d-flex', 'header-justify-content-center', 'header-align-items-center');

  const indiaOption = document.createElement('div');
  indiaOption.classList.add('header-country-option', 'header-selected', 'header-mx-3', 'header-d-flex', 'header-flex-column', 'header-align-items-center');
  indiaOption.setAttribute('data-country', 'india');
  indiaOption.setAttribute('data-url', '/india');

  const indiaFlagImg = document.createElement('img');
  indiaFlagImg.setAttribute('src', '/content/dam/aemigrate/uploaded-folder/image/india-1-fmt-webp-alpha.webp');
  indiaFlagImg.setAttribute('alt', 'India Flag');
  indiaFlagImg.classList.add('header-country-flag', 'header-india-flag');

  const indiaCountryName = document.createElement('p');
  indiaCountryName.classList.add('header-country-name');
  indiaCountryName.textContent = 'India';

  indiaOption.append(indiaFlagImg, indiaCountryName);

  const usaOption = document.createElement('div');
  usaOption.classList.add('header-country-option', 'header-mx-3', 'header-d-flex', 'header-flex-column', 'header-align-items-center');
  usaOption.setAttribute('data-country', 'usa');
  usaOption.setAttribute('data-url', '/usa');

  const usaFlagImg = document.createElement('img');
  usaFlagImg.setAttribute('src', '/content/dam/aemigrate/uploaded-folder/image/usa-fmt-webp-alpha.webp');
  usaFlagImg.setAttribute('alt', 'USA Flag');
  usaFlagImg.classList.add('header-country-flag', 'header-usa-flag');

  const usaCountryName = document.createElement('p');
  usaCountryName.classList.add('header-country-name');
  usaCountryName.textContent = 'USA';

  usaOption.append(usaFlagImg, usaCountryName);

  countryOptions.append(indiaOption, usaOption);
  modalBody.append(countryOptions);
  modalContent.append(modalHeader, modalBody);
  modalDialog.append(modalContent);
  modal.append(modalDialog);

  block.textContent = '';
  block.append(headerContainer, modal);
  block.className = 'header-itc-header-section block';
  block.dataset.blockStatus = 'loaded';
}
