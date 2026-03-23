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
  navbar.append(navbarToggler);
  moveInstrumentation(block.querySelector('.header-navbar-toggler'), navbarToggler);

  const dXlNoneDiv = document.createElement('div');
  dXlNoneDiv.classList.add('header-d-xl-none');
  dXlNoneDiv.innerHTML = '&nbsp;';
  navbar.append(dXlNoneDiv);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('header-logo', 'header-image');
  const authoredLogoImage = block.querySelector('[data-aue-prop="logoImage"]');
  const authoredLogoLink = block.querySelector('[data-aue-prop="logoLink"]');

  if (authoredLogoImage) {
    const logoLink = document.createElement('a');
    logoLink.classList.add('header-cmp-image__link');
    if (authoredLogoLink) {
      logoLink.href = authoredLogoLink.href || '#';
      logoLink.target = '_blank';
      moveInstrumentation(authoredLogoLink, logoLink);
    }
    const picture = createOptimizedPicture(authoredLogoImage.src, authoredLogoImage.alt);
    logoLink.append(picture);
    logoDiv.append(logoLink);
    moveInstrumentation(authoredLogoImage, picture);
  }
  navbar.append(logoDiv);

  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('header-collapse', 'header-navbar-collapse', 'header-justify-content-center');
  navbarCollapse.id = 'navbarSupportedContent';

  const navItemDiv = document.createElement('div');
  navItemDiv.classList.add('header-nav-item', 'header-navigation');
  const nav = document.createElement('nav');
  nav.classList.add('header-cmp-navigation');
  nav.setAttribute('role', 'navigation');
  const navList = document.createElement('ul');
  navList.classList.add('header-cmp-navigation__group');

  const navigationLinks = block.querySelectorAll('[data-aue-model="navigationLink"]');
  navigationLinks.forEach((linkNode) => {
    const listItem = document.createElement('li');
    listItem.classList.add('header-cmp-navigation__item', 'header-cmp-navigation__item--level-0');

    const link = document.createElement('a');
    link.classList.add('header-cmp-navigation__item-link');

    const label = linkNode.querySelector('[data-aue-prop="label"]');
    if (label) {
      link.textContent = label.textContent;
      moveInstrumentation(label, link);
    }

    const href = linkNode.querySelector('[data-aue-prop="link"]');
    if (href) {
      link.href = href.href || '#';
      moveInstrumentation(href, link);
    }

    listItem.append(link);
    navList.append(listItem);
    moveInstrumentation(linkNode, listItem);
  });

  nav.append(navList);
  navItemDiv.append(nav);
  navbarCollapse.append(navItemDiv);

  const sectionDiv = document.createElement('div');
  sectionDiv.classList.add('header-section', 'header-d-flex', 'header-align-items-center', 'header-justify-content-end');

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('header-search-icon', 'header-country-selector-trigger', 'header-d-flex', 'header-align-items-center');
  searchIconDiv.setAttribute('data-toggle', 'modal');
  searchIconDiv.setAttribute('data-target', '#countryModal');
  searchIconDiv.setAttribute('data-flag-in', '/content/dam/aemigrate/uploaded-folder/image/india-1-fmt-webp-alpha.webp');
  searchIconDiv.setAttribute('data-flag-usa', '/content/dam/aemigrate/uploaded-folder/image/usa-fmt-webp-alpha.webp');

  const countryCode = document.createElement('span');
  countryCode.classList.add('header-country-code');
  countryCode.textContent = 'IN'; // Hardcoded as per sample, adjust if dynamic
  searchIconDiv.append(countryCode);

  const countryFlag = document.createElement('img');
  countryFlag.classList.add('header-country-flag');
  countryFlag.src = '/content/dam/aemigrate/uploaded-folder/image/india-1-fmt-webp-alpha.webp'; // Hardcoded
  countryFlag.alt = 'flag';
  searchIconDiv.append(countryFlag);

  const dropdownIcon = document.createElement('img');
  dropdownIcon.src = '/content/dam/aemigrate/uploaded-folder/image/dropdown-icon.png'; // Hardcoded
  dropdownIcon.alt = 'dropdown-icon';
  dropdownIcon.classList.add('header-dropdown-icon');
  searchIconDiv.append(dropdownIcon);

  sectionDiv.append(searchIconDiv);
  navbarCollapse.append(sectionDiv);
  navbar.append(navbarCollapse);

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
  const searchButtonImg = document.createElement('img');
  searchButtonImg.setAttribute('loading', 'lazy');
  searchButtonImg.src = '/content/dam/aemigrate/uploaded-folder/image/search-icon.png';
  searchButtonImg.alt = 'Search icon';
  searchButton.append(searchButtonImg);
  searchContainer.append(searchInput, searchButton);
  const closeButton = document.createElement('img');
  closeButton.id = 'closeButton';
  closeButton.setAttribute('loading', 'lazy');
  closeButton.src = '/content/dam/aemigrate/uploaded-folder/image/1774251597363.svg+xml';
  closeButton.alt = 'Close icon';
  searchBox.append(searchContainer, closeButton);
  searchBlock.append(searchBox);

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
  searchBlock.append(searchResults);
  itcHeaderIconList.append(searchBlock);

  const searchLink = document.createElement('a');
  searchLink.classList.add('header-nav-link');
  const searchIcon = document.createElement('img');
  searchIcon.setAttribute('loading', 'lazy');
  searchIcon.id = 'searchIcon';
  searchIcon.src = '/content/dam/aemigrate/uploaded-folder/image/search-icon.png';
  searchIcon.alt = 'Search icon';
  const searchSpan = document.createElement('span');
  searchSpan.classList.add('header-d-block');
  searchSpan.textContent = 'Search';
  searchLink.append(searchIcon, searchSpan);
  itcHeaderIconList.append(searchLink);

  const navItemLi = document.createElement('li');
  navItemLi.classList.add('header-nav-item');
  const emptyNavLink = document.createElement('a');
  emptyNavLink.classList.add('header-nav-link');
  navItemLi.append(emptyNavLink);
  itcHeaderIconList.append(navItemLi);

  navbar.append(itcHeaderIconList);
  headerContainer.append(navbar);

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
  modalContent.append(modalHeader);

  const modalBody = document.createElement('div');
  modalBody.classList.add('header-modal-body');
  const countryOptionsDiv = document.createElement('div');
  countryOptionsDiv.classList.add('header-country-options', 'header-d-flex', 'header-justify-content-center', 'header-align-items-center');

  const countryOptions = block.querySelectorAll('[data-aue-model="countryOption"]');
  countryOptions.forEach((optionNode, index) => {
    const countryOptionDiv = document.createElement('div');
    countryOptionDiv.classList.add('header-country-option', 'header-mx-3', 'header-d-flex', 'header-flex-column', 'header-align-items-center');
    if (index === 0) {
      countryOptionDiv.classList.add('header-selected');
    }

    const countryName = optionNode.querySelector('[data-aue-prop="countryName"]');
    if (countryName) {
      countryOptionDiv.setAttribute('data-country', countryName.textContent.toLowerCase());
      moveInstrumentation(countryName, countryOptionDiv);
    }

    const countryUrl = optionNode.querySelector('[data-aue-prop="countryUrl"]');
    if (countryUrl) {
      countryOptionDiv.setAttribute('data-url', countryUrl.href || '#');
      moveInstrumentation(countryUrl, countryOptionDiv);
    }

    const flagImage = optionNode.querySelector('[data-aue-prop="flagImage"]');
    if (flagImage) {
      const img = document.createElement('img');
      img.src = flagImage.src;
      img.alt = `${countryName ? countryName.textContent : ''} Flag`;
      img.classList.add('header-country-flag');
      if (countryName && countryName.textContent.toLowerCase() === 'india') {
        img.classList.add('header-india-flag');
      } else if (countryName && countryName.textContent.toLowerCase() === 'usa') {
        img.classList.add('header-usa-flag');
      }
      countryOptionDiv.append(img);
      moveInstrumentation(flagImage, img);
    }

    const pName = document.createElement('p');
    pName.classList.add('header-country-name');
    if (countryName) {
      pName.textContent = countryName.textContent;
      moveInstrumentation(countryName, pName);
    }
    countryOptionDiv.append(pName);

    countryOptionsDiv.append(countryOptionDiv);
    moveInstrumentation(optionNode, countryOptionDiv);
  });

  modalBody.append(countryOptionsDiv);
  modalContent.append(modalBody);
  modalDialog.append(modalContent);
  countryModal.append(modalDialog);

  block.textContent = '';
  block.append(headerContainer, countryModal);
  block.classList.add('header-itc-header-section');
  block.dataset.blockStatus = 'loaded';
}
