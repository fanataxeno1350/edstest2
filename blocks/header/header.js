import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const headerContainer = document.createElement('div');
  headerContainer.classList.add('header-container');

  const navbar = document.createElement('nav');
  navbar.classList.add('header-navbar', 'header-navbar-expand-xl', 'header-navbar-light', 'header-bg-light', 'header-px-xl-5', 'header-d-flex', 'header-justify-content-between', 'header-align-items-center');

  const navbarToggler = document.createElement('button');
  navbarToggler.classList.add('header-navbar-toggler', 'header-collapsed');
  navbarToggler.setAttribute('type', 'button');
  navbarToggler.setAttribute('data-toggle', 'collapse');
  navbarToggler.setAttribute('data-target', '#navbarSupportedContent');
  navbarToggler.setAttribute('aria-controls', 'navbarSupportedContent');
  navbarToggler.setAttribute('aria-expanded', 'false');
  navbarToggler.setAttribute('aria-label', 'Toggle navigation');
  const togglerIcon = document.createElement('span');
  togglerIcon.classList.add('header-navbar-toggler-icon');
  navbarToggler.append(togglerIcon);
  moveInstrumentation(block.querySelector('.header-navbar-toggler'), navbarToggler);

  const dXlNoneDiv = document.createElement('div');
  dXlNoneDiv.classList.add('header-d-xl-none');
  dXlNoneDiv.innerHTML = '&nbsp;';
  moveInstrumentation(block.querySelector('.header-d-xl-none'), dXlNoneDiv);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('header-logo', 'header-image');
  const logoLinkWrapper = document.createElement('a');
  logoLinkWrapper.classList.add('header-cmp-image__link');

  const logoLink = block.querySelector('[data-aue-prop="logoLink"]');
  if (logoLink) {
    logoLinkWrapper.href = logoLink.href;
    logoLinkWrapper.target = '_blank';
    moveInstrumentation(logoLink, logoLinkWrapper);
  }

  const logoImage = block.querySelector('[data-aue-prop="logoImage"]');
  if (logoImage) {
    const picture = createOptimizedPicture(logoImage.src, logoImage.alt);
    logoLinkWrapper.append(picture);
    moveInstrumentation(logoImage, picture);
  }

  const secondaryLogoLink = block.querySelector('[data-aue-prop="secondaryLogoLink"]');
  if (secondaryLogoLink) {
    const secondaryLogoLinkWrapper = document.createElement('a');
    secondaryLogoLinkWrapper.classList.add('header-cmp-image__link');
    secondaryLogoLinkWrapper.href = secondaryLogoLink.href;
    secondaryLogoLinkWrapper.target = '_blank';
    moveInstrumentation(secondaryLogoLink, secondaryLogoLinkWrapper);

    const secondaryLogoImage = block.querySelector('[data-aue-prop="secondaryLogoImage"]');
    if (secondaryLogoImage) {
      const picture = createOptimizedPicture(secondaryLogoImage.src, secondaryLogoImage.alt);
      secondaryLogoLinkWrapper.append(picture);
      moveInstrumentation(secondaryLogoImage, picture);
    }
    logoDiv.append(secondaryLogoLinkWrapper);
  }
  logoDiv.append(logoLinkWrapper);
  moveInstrumentation(block.querySelector('.header-logo.header-image'), logoDiv);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('header-collapse', 'header-navbar-collapse', 'header-justify-content-center');
  navbarCollapse.id = 'navbarSupportedContent';

  const navItemNavigation = document.createElement('div');
  navItemNavigation.classList.add('header-nav-item', 'header-navigation');
  const navigationCmp = document.createElement('nav');
  navigationCmp.classList.add('header-cmp-navigation');
  navigationCmp.setAttribute('itemscope', '');
  navigationCmp.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  navigationCmp.setAttribute('role', 'navigation');
  const navGroup = document.createElement('ul');
  navGroup.classList.add('header-cmp-navigation__group');

  const navLink1 = block.querySelector('[data-aue-prop="navLink1"]');
  if (navLink1) {
    const li1 = document.createElement('li');
    li1.classList.add('header-cmp-navigation__item', 'header-cmp-navigation__item--level-0');
    const a1 = document.createElement('a');
    a1.classList.add('header-cmp-navigation__item-link');
    a1.href = navLink1.href;
    a1.textContent = navLink1.textContent;
    li1.append(a1);
    navGroup.append(li1);
    moveInstrumentation(navLink1, a1);
  }

  const navLink2 = block.querySelector('[data-aue-prop="navLink2"]');
  if (navLink2) {
    const li2 = document.createElement('li');
    li2.classList.add('header-cmp-navigation__item', 'header-cmp-navigation__item--level-0');
    const a2 = document.createElement('a');
    a2.classList.add('header-cmp-navigation__item-link');
    a2.href = navLink2.href;
    a2.textContent = navLink2.textContent;
    li2.append(a2);
    navGroup.append(li2);
    moveInstrumentation(navLink2, a2);
  }

  navigationCmp.append(navGroup);
  navItemNavigation.append(navigationCmp);
  moveInstrumentation(block.querySelector('.header-nav-item.header-navigation'), navItemNavigation);

  const sectionRight = document.createElement('div');
  sectionRight.classList.add('header-section', 'header-d-flex', 'header-align-items-center', 'header-justify-content-end');

  const countrySelectorTrigger = document.createElement('div');
  countrySelectorTrigger.classList.add('header-search-icon', 'header-country-selector-trigger', 'header-d-flex', 'header-align-items-center');
  countrySelectorTrigger.setAttribute('data-toggle', 'modal');
  countrySelectorTrigger.setAttribute('data-target', '#countryModal');
  countrySelectorTrigger.setAttribute('data-flag-in', '/content/dam/aemigrate/uploaded-folder/image/india-1-fmt-webp-alpha.webp');
  countrySelectorTrigger.setAttribute('data-flag-usa', '/content/dam/aemigrate/uploaded-folder/image/usa-fmt-webp-alpha.webp');

  const countryCode = document.createElement('span');
  countryCode.classList.add('header-country-code');
  countryCode.textContent = 'IN'; // Hardcoded for now, could be dynamic
  countrySelectorTrigger.append(countryCode);

  const countryFlagIN = block.querySelector('[data-aue-prop="countryFlagIN"]');
  if (countryFlagIN) {
    const flagImg = createOptimizedPicture(countryFlagIN.src, countryFlagIN.alt);
    flagImg.classList.add('header-country-flag');
    countrySelectorTrigger.append(flagImg);
    moveInstrumentation(countryFlagIN, flagImg);
  }

  const dropdownIcon = document.createElement('img');
  dropdownIcon.src = '/content/dam/aemigrate/uploaded-folder/image/dropdown-icon.png';
  dropdownIcon.alt = 'dropdown-icon';
  dropdownIcon.classList.add('header-dropdown-icon');
  countrySelectorTrigger.append(dropdownIcon);
  moveInstrumentation(block.querySelector('.header-dropdown-icon'), dropdownIcon);

  sectionRight.append(countrySelectorTrigger);
  moveInstrumentation(block.querySelector('.header-search-icon.header-country-selector-trigger'), countrySelectorTrigger);

  navbarCollapse.append(navItemNavigation, sectionRight);
  moveInstrumentation(block.querySelector('#navbarSupportedContent'), navbarCollapse);

  const itcHeaderIconList = document.createElement('div');
  itcHeaderIconList.classList.add('header-itc-header-icon-list');

  const searchBlock = document.createElement('div');
  searchBlock.id = 'searchBlock';
  searchBlock.classList.add('header-search-block', 'header-hidden');
  const searchBox = document.createElement('div');
  searchBox.id = 'searchBox';
  searchBox.classList.add('header-search-box');
  const searchContainer = document.createElement('div');
  searchContainer.id = 'searchContainer';
  searchContainer.classList.add('header-search-container', 'header-hidden');
  const searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'text');
  searchInput.id = 'searchInput';
  searchInput.setAttribute('placeholder', 'Search');
  const searchButton = document.createElement('button');
  searchButton.id = 'searchButton';
  const searchIconImg = block.querySelector('[data-aue-prop="searchIcon"]');
  if (searchIconImg) {
    const picture = createOptimizedPicture(searchIconImg.src, searchIconImg.alt);
    searchButton.append(picture);
    moveInstrumentation(searchIconImg, picture);
  }
  searchContainer.append(searchInput, searchButton);

  const closeButtonImg = block.querySelector('[data-aue-prop="closeIcon"]');
  const closeButton = document.createElement('img');
  closeButton.id = 'closeButton';
  if (closeButtonImg) {
    closeButton.src = closeButtonImg.src;
    closeButton.alt = closeButtonImg.alt;
    moveInstrumentation(closeButtonImg, closeButton);
  }
  closeButton.setAttribute('loading', 'lazy');
  searchBox.append(searchContainer, closeButton);

  const searchResults = document.createElement('div');
  searchResults.id = 'searchResults';
  searchResults.classList.add('header-search-results', 'header-hidden');
  const popularSuggestions = document.createElement('h4');
  popularSuggestions.classList.add('header-resultList');
  popularSuggestions.textContent = 'Popular Suggestions';
  const suggestionsList = document.createElement('ul');
  suggestionsList.id = 'suggestionsList';
  const pages = document.createElement('h4');
  pages.classList.add('header-resultList');
  pages.textContent = 'Pages';
  const productsList = document.createElement('ul');
  productsList.id = 'productsList';
  productsList.classList.add('header-products');
  const viewAllButton = document.createElement('button');
  viewAllButton.id = 'viewAllButton';
  viewAllButton.textContent = 'VIEW ALL ITEMS';
  searchResults.append(popularSuggestions, suggestionsList, pages, productsList, viewAllButton);
  searchBlock.append(searchBox, searchResults);
  moveInstrumentation(block.querySelector('#searchBlock'), searchBlock);

  const searchNavLink = document.createElement('a');
  searchNavLink.classList.add('header-nav-link');
  const searchIconForNavLink = block.querySelector('.header-itc-header-icon-list #searchIcon');
  if (searchIconForNavLink) {
    const picture = createOptimizedPicture(searchIconForNavLink.src, searchIconForNavLink.alt);
    searchNavLink.append(picture);
    moveInstrumentation(searchIconForNavLink, picture);
  }
  const searchSpan = document.createElement('span');
  searchSpan.classList.add('header-d-block');
  searchSpan.textContent = 'Search';
  searchNavLink.append(searchSpan);
  moveInstrumentation(block.querySelector('.header-itc-header-icon-list > .header-nav-link'), searchNavLink);

  itcHeaderIconList.append(searchBlock, searchNavLink);
  moveInstrumentation(block.querySelector('.header-itc-header-icon-list'), itcHeaderIconList);

  navbar.append(navbarToggler, dXlNoneDiv, logoDiv, navbarCollapse, itcHeaderIconList);
  moveInstrumentation(block.querySelector('.header-navbar'), navbar);

  headerContainer.append(navbar);
  moveInstrumentation(block.querySelector('.header-container'), headerContainer);

  // Country Modal (static content, no AUE props)
  const countryModal = document.createElement('div');
  countryModal.classList.add('header-modal', 'header-fade', 'header-itc-country-selector', 'header-show');
  countryModal.id = 'countryModal';
  countryModal.setAttribute('tabindex', '-1');
  countryModal.setAttribute('role', 'dialog');
  countryModal.setAttribute('aria-labelledby', 'countryModalLabel');
  countryModal.setAttribute('aria-modal', 'true');
  countryModal.style.display = 'block';

  const modalDialog = document.createElement('div');
  modalDialog.classList.add('header-modal-dialog', 'header-modal-dialog-centered');
  modalDialog.setAttribute('role', 'document');

  const modalContent = document.createElement('div');
  modalContent.classList.add('header-modal-content');

  const modalHeader = document.createElement('div');
  modalHeader.classList.add('header-modal-header', 'header-border-0', 'header-text-center');
  const headerW100 = document.createElement('div');
  headerW100.classList.add('header-w-100');
  const modalTitle = document.createElement('h2');
  modalTitle.classList.add('header-modal-title');
  modalTitle.innerHTML = 'SELECT YOUR <br>KITCHENS OF INDIA';
  const experienceText = document.createElement('p');
  experienceText.classList.add('header-experience-text');
  experienceText.textContent = 'Experience';
  headerW100.append(modalTitle, experienceText);
  modalHeader.append(headerW100);

  const modalBody = document.createElement('div');
  modalBody.classList.add('header-modal-body');
  const countryOptions = document.createElement('div');
  countryOptions.classList.add('header-country-options', 'header-d-flex', 'header-justify-content-center', 'header-align-items-center');

  const indiaOption = document.createElement('div');
  indiaOption.classList.add('header-country-option', 'header-selected', 'header-mx-3', 'header-d-flex', 'header-flex-column', 'header-align-items-center');
  indiaOption.setAttribute('data-country', 'india');
  indiaOption.setAttribute('data-url', '/india');
  const indiaFlagImg = document.createElement('img');
  indiaFlagImg.src = '/content/dam/aemigrate/uploaded-folder/image/india-1-fmt-webp-alpha.webp';
  indiaFlagImg.alt = 'India Flag';
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
  usaFlagImg.src = '/content/dam/aemigrate/uploaded-folder/image/usa-fmt-webp-alpha.webp';
  usaFlagImg.alt = 'USA Flag';
  usaFlagImg.classList.add('header-country-flag', 'header-usa-flag');
  const usaCountryName = document.createElement('p');
  usaCountryName.classList.add('header-country-name');
  usaCountryName.textContent = 'USA';
  usaOption.append(usaFlagImg, usaCountryName);

  countryOptions.append(indiaOption, usaOption);
  modalBody.append(countryOptions);
  modalContent.append(modalHeader, modalBody);
  modalDialog.append(modalContent);
  countryModal.append(modalDialog);
  moveInstrumentation(block.querySelector('#countryModal'), countryModal);

  block.textContent = '';
  block.append(headerContainer, countryModal);
  block.className = `header-itc-header-section block`;
  block.dataset.blockStatus = 'loaded';
}
