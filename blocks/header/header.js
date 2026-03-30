import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const headerContainer = document.createElement('div');
  headerContainer.className = 'header-container';

  const navbar = document.createElement('nav');
  navbar.className = 'header-navbar header-navbar-expand-xl header-navbar-light header-bg-light header-px-xl-5 header-d-flex header-justify-content-between header-align-items-center';

  const navbarToggler = document.createElement('button');
  navbarToggler.className = 'header-navbar-toggler header-collapsed';
  navbarToggler.type = 'button';
  navbarToggler.setAttribute('data-toggle', 'collapse');
  navbarToggler.setAttribute('data-target', '#navbarSupportedContent');
  navbarToggler.setAttribute('aria-controls', 'navbarSupportedContent');
  navbarToggler.setAttribute('aria-expanded', 'false');
  navbarToggler.setAttribute('aria-label', 'Toggle navigation');
  const togglerIcon = document.createElement('span');
  togglerIcon.className = 'header-navbar-toggler-icon';
  navbarToggler.append(togglerIcon);
  moveInstrumentation(block.querySelector('.header-navbar-toggler'), navbarToggler);

  const spacerDiv = document.createElement('div');
  spacerDiv.className = 'header-d-xl-none';
  moveInstrumentation(block.querySelector('.header-d-xl-none'), spacerDiv);

  const logoDiv = document.createElement('div');
  logoDiv.className = 'header-logo header-image';

  const logoLink = block.querySelector('[data-aue-prop="logoLink"]');
  const secondaryLogoLink = block.querySelector('[data-aue-prop="secondaryLogoLink"]');

  if (logoLink) {
    const logoAnchor = document.createElement('a');
    logoAnchor.href = logoLink.href;
    if (logoLink.target) {
      logoAnchor.target = logoLink.target;
    }
    const logoImage = block.querySelector('[data-aue-prop="logoImage"]');
    if (logoImage) {
      const picture = createOptimizedPicture(logoImage.src, logoImage.alt);
      logoAnchor.append(picture);
      moveInstrumentation(logoImage, picture);
    }
    logoDiv.append(logoAnchor);
    moveInstrumentation(logoLink, logoAnchor);
  }

  if (secondaryLogoLink) {
    const secondaryLogoAnchor = document.createElement('a');
    secondaryLogoAnchor.href = secondaryLogoLink.href;
    if (secondaryLogoLink.target) {
      secondaryLogoAnchor.target = secondaryLogoLink.target;
    }
    const secondaryLogoImage = block.querySelector('[data-aue-prop="secondaryLogoImage"]');
    if (secondaryLogoImage) {
      const picture = createOptimizedPicture(secondaryLogoImage.src, secondaryLogoImage.alt);
      secondaryLogoAnchor.append(picture);
      moveInstrumentation(secondaryLogoImage, picture);
    }
    logoDiv.append(secondaryLogoAnchor);
    moveInstrumentation(secondaryLogoLink, secondaryLogoAnchor);
  }

  const collapseDiv = document.createElement('div');
  collapseDiv.className = 'header-collapse header-navbar-collapse header-justify-content-center';
  collapseDiv.id = 'navbarSupportedContent';

  const navItem = document.createElement('div');
  navItem.className = 'header-nav-item header-navigation';

  const nav = document.createElement('nav');
  nav.id = 'navigation-6d5dcb0126';
  nav.className = 'header-cmp-navigation';
  nav.setAttribute('itemscope', '');
  nav.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  nav.setAttribute('role', 'navigation');

  const navGroup = document.createElement('ul');
  navGroup.className = 'header-cmp-navigation__group';

  const navigationLinks = block.querySelectorAll('[data-aue-model="headerNavLink"]');
  navigationLinks.forEach((linkNode) => {
    const linkItem = document.createElement('li');
    linkItem.className = 'header-cmp-navigation__item header-cmp-navigation__item--level-0';
    const linkAnchor = document.createElement('a');
    linkAnchor.className = 'header-cmp-navigation__item-link';
    const linkUrl = linkNode.querySelector('[data-aue-prop="linkUrl"]');
    const linkLabel = linkNode.querySelector('[data-aue-prop="linkLabel"]') || linkNode.querySelector('p');

    if (linkUrl) {
      linkAnchor.href = linkUrl.href;
      moveInstrumentation(linkUrl, linkAnchor);
    }
    if (linkLabel) {
      linkAnchor.textContent = linkLabel.textContent;
      moveInstrumentation(linkLabel, linkAnchor);
    }
    linkItem.append(linkAnchor);
    navGroup.append(linkItem);
    moveInstrumentation(linkNode, linkItem);
  });

  nav.append(navGroup);
  navItem.append(nav);
  moveInstrumentation(block.querySelector('.header-nav-item.header-navigation'), navItem);

  const sectionDiv = document.createElement('div');
  sectionDiv.className = 'header-section header-d-flex header-align-items-center header-justify-content-end';

  const searchIconDiv = document.createElement('div');
  searchIconDiv.className = 'header-search-icon header-country-selector-trigger header-d-flex header-align-items-center';
  searchIconDiv.setAttribute('data-toggle', 'modal');
  searchIconDiv.setAttribute('data-target', '#countryModal');

  const countryCodeSpan = document.createElement('span');
  countryCodeSpan.className = 'header-country-code';
  const countryCode = block.querySelector('[data-aue-prop="countryCode"]');
  if (countryCode) {
    countryCodeSpan.textContent = countryCode.textContent;
    moveInstrumentation(countryCode, countryCodeSpan);
  }

  const countryFlagImage = block.querySelector('[data-aue-prop="countryFlagImage"]');
  if (countryFlagImage) {
    const flagImg = createOptimizedPicture(countryFlagImage.src, countryFlagImage.alt).querySelector('img');
    flagImg.className = 'header-header-country-flag header-country-flag';
    searchIconDiv.append(flagImg);
    moveInstrumentation(countryFlagImage, flagImg);
  }

  const dropdownIcon = document.createElement('img');
  dropdownIcon.src = '/content/dam/aemigrate/uploaded-folder/image/dropdown-icon.png'; // Hardcoded as per sample
  dropdownIcon.alt = 'dropdown-icon';
  dropdownIcon.className = 'header-dropdown-icon';

  searchIconDiv.append(countryCodeSpan, dropdownIcon);
  sectionDiv.append(searchIconDiv);
  moveInstrumentation(block.querySelector('.header-search-icon.header-country-selector-trigger'), searchIconDiv);

  const itcHeaderIconList = document.createElement('div');
  itcHeaderIconList.className = 'header-itc-header-icon-list';

  const searchBlock = document.createElement('div');
  searchBlock.id = 'searchBlock';
  searchBlock.className = 'header-search-block header-hidden';

  const searchBox = document.createElement('div');
  searchBox.id = 'searchBox';
  searchBox.className = 'header-search-box';

  const searchContainer = document.createElement('div');
  searchContainer.id = 'searchContainer';
  searchContainer.className = 'header-search-container header-hidden';

  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'searchInput';
  searchInput.placeholder = 'Search';

  const searchButton = document.createElement('button');
  searchButton.id = 'searchButton';
  const searchButtonImg = document.createElement('img');
  searchButtonImg.loading = 'lazy';
  searchButtonImg.src = '/content/dam/aemigrate/uploaded-folder/image/search-icon.png'; // Hardcoded
  searchButtonImg.alt = 'Search icon';
  searchButton.append(searchButtonImg);
  searchContainer.append(searchInput, searchButton);

  const closeButton = document.createElement('img');
  closeButton.id = 'closeButton';
  closeButton.loading = 'lazy';
  closeButton.src = '/content/dam/aemigrate/uploaded-folder/image/1774855562454.svg+xml'; // Hardcoded
  closeButton.alt = 'Close icon';

  searchBox.append(searchContainer, closeButton);

  const searchResults = document.createElement('div');
  searchResults.id = 'searchResults';
  searchResults.className = 'header-search-results header-hidden';

  const popularSuggestions = document.createElement('h4');
  popularSuggestions.className = 'header-resultList';
  popularSuggestions.textContent = 'Popular Suggestions';
  const suggestionsList = document.createElement('ul');
  suggestionsList.id = 'suggestionsList';

  const pagesListTitle = document.createElement('h4');
  pagesListTitle.className = 'header-resultList';
  pagesListTitle.textContent = 'Pages';
  const productsList = document.createElement('ul');
  productsList.id = 'productsList';
  productsList.className = 'header-products';

  const viewAllButton = document.createElement('button');
  viewAllButton.id = 'viewAllButton';
  viewAllButton.textContent = 'VIEW ALL ITEMS';

  searchResults.append(popularSuggestions, suggestionsList, pagesListTitle, productsList, viewAllButton);
  searchBlock.append(searchBox, searchResults);
  itcHeaderIconList.append(searchBlock);
  moveInstrumentation(block.querySelector('#searchBlock'), searchBlock);

  const searchNavLink = document.createElement('a');
  searchNavLink.className = 'header-nav-link';
  const searchIconImage = block.querySelector('[data-aue-prop="searchIconImage"]');
  if (searchIconImage) {
    const searchImg = createOptimizedPicture(searchIconImage.src, searchIconImage.alt).querySelector('img');
    searchImg.loading = 'lazy';
    searchImg.id = 'searchIcon';
    searchNavLink.append(searchImg);
    moveInstrumentation(searchIconImage, searchImg);
  }
  const searchSpan = document.createElement('span');
  searchSpan.className = 'header-d-block';
  searchSpan.textContent = 'Search'; // Hardcoded as per sample
  searchNavLink.append(searchSpan);
  itcHeaderIconList.append(searchNavLink);
  moveInstrumentation(block.querySelector('a.header-nav-link'), searchNavLink);

  navbar.append(navbarToggler, spacerDiv, logoDiv, collapseDiv, itcHeaderIconList);
  collapseDiv.append(navItem, sectionDiv);

  headerContainer.append(navbar);

  const modal = document.createElement('div');
  modal.className = 'header-modal header-fade header-itc-country-selector header-show';
  modal.id = 'countryModal';
  modal.tabIndex = -1;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', 'countryModalLabel');
  modal.setAttribute('aria-modal', 'true');
  modal.style.display = 'block';

  const modalDialog = document.createElement('div');
  modalDialog.className = 'header-modal-dialog header-modal-dialog-centered';
  modalDialog.setAttribute('role', 'document');

  const modalContent = document.createElement('div');
  modalContent.className = 'header-modal-content';

  const modalHeader = document.createElement('div');
  modalHeader.className = 'header-modal-header header-border-0 header-text-center';

  const headerW100 = document.createElement('div');
  headerW100.className = 'header-w-100';

  const modalTitle = document.createElement('h2');
  modalTitle.className = 'header-modal-title';
  modalTitle.innerHTML = 'SELECT YOUR <br>KITCHENS OF INDIA'; // Hardcoded

  const experienceText = document.createElement('p');
  experienceText.className = 'header-experience-text';
  experienceText.textContent = 'Experience'; // Hardcoded

  headerW100.append(modalTitle, experienceText);
  modalHeader.append(headerW100);

  const modalBody = document.createElement('div');
  modalBody.className = 'header-modal-body';

  const countryOptionsDiv = document.createElement('div');
  countryOptionsDiv.className = 'header-country-options header-d-flex header-justify-content-center header-align-items-center';

  const countryOptions = block.querySelectorAll('[data-aue-model="headerCountryOption"]');
  countryOptions.forEach((optionNode) => {
    const countryOptionDiv = document.createElement('div');
    countryOptionDiv.className = 'header-country-option header-mx-3 header-d-flex header-flex-column header-align-items-center';

    const flagImage = optionNode.querySelector('[data-aue-prop="flagImage"]');
    if (flagImage) {
      const flagImg = createOptimizedPicture(flagImage.src, flagImage.alt).querySelector('img');
      flagImg.className = 'header-country-flag';
      countryOptionDiv.append(flagImg);
      moveInstrumentation(flagImage, flagImg);
    }

    const countryName = optionNode.querySelector('[data-aue-prop="countryName"]') || optionNode.querySelector('p');
    if (countryName) {
      const countryNameP = document.createElement('p');
      countryNameP.className = 'header-country-name';
      countryNameP.textContent = countryName.textContent;
      countryOptionDiv.append(countryNameP);
      moveInstrumentation(countryName, countryNameP);
    }

    countryOptionsDiv.append(countryOptionDiv);
    moveInstrumentation(optionNode, countryOptionDiv);
  });

  modalBody.append(countryOptionsDiv);
  modalContent.append(modalHeader, modalBody);
  modalDialog.append(modalContent);
  modal.append(modalDialog);

  headerContainer.append(modal);

  block.textContent = '';
  block.append(headerContainer);
  block.className = 'header block';
  block.dataset.blockStatus = 'loaded';
}
