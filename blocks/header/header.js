import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const headerContainer = document.createElement('div');
  headerContainer.classList.add('header-container');

  const navbar = document.createElement('nav');
  navbar.classList.add('header-navbar', 'header-navbar-expand-xl', 'header-navbar-light', 'header-bg-light', 'header-px-xl-5', 'header-d-flex', 'header-justify-content-between', 'header-align-items-center');

  const togglerButton = document.createElement('button');
  togglerButton.classList.add('header-navbar-toggler', 'header-collapsed');
  togglerButton.type = 'button';
  togglerButton.setAttribute('data-toggle', 'collapse');
  togglerButton.setAttribute('data-target', '#navbarSupportedContent');
  togglerButton.setAttribute('aria-controls', 'navbarSupportedContent');
  togglerButton.setAttribute('aria-expanded', 'false');
  togglerButton.setAttribute('aria-label', 'Toggle navigation');
  const togglerSpan = document.createElement('span');
  togglerSpan.classList.add('header-navbar-toggler-icon');
  togglerButton.append(togglerSpan);
  navbar.append(togglerButton);

  const dXlNoneDiv = document.createElement('div');
  dXlNoneDiv.classList.add('header-d-xl-none');
  navbar.append(dXlNoneDiv);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('header-logo', 'header-image');
  const logoLink = block.querySelector('[data-aue-prop="logoLink"]');
  const logoImg = block.querySelector('[data-aue-prop="logoLinkImage"] img');
  if (logoImg && logoLink) {
    const picture = createOptimizedPicture(logoImg.src, logoImg.alt);
    const linkWrapper = document.createElement('a');
    linkWrapper.href = logoLink.textContent.trim();
    linkWrapper.target = '_blank';
    linkWrapper.append(picture);
    logoDiv.append(linkWrapper);
    moveInstrumentation(logoImg, picture);
    moveInstrumentation(logoLink, linkWrapper);
  } else if (logoImg) {
    logoDiv.append(createOptimizedPicture(logoImg.src, logoImg.alt));
    moveInstrumentation(logoImg, logoDiv.querySelector('picture'));
  }
  navbar.append(logoDiv);

  const collapseDiv = document.createElement('div');
  collapseDiv.classList.add('header-collapse', 'header-navbar-collapse', 'header-justify-content-center');
  collapseDiv.id = 'navbarSupportedContent';

  const navItemDiv = document.createElement('div');
  navItemDiv.classList.add('header-nav-item', 'header-navigation');
  const nav = document.createElement('nav');
  nav.classList.add('header-cmp-navigation');
  nav.setAttribute('itemscope', '');
  nav.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  nav.setAttribute('role', 'navigation');
  const navList = document.createElement('ul');
  navList.classList.add('header-cmp-navigation__group');

  const navItems = block.querySelectorAll('[data-aue-model="navItem"]');
  navItems.forEach((itemNode) => {
    const listItem = document.createElement('li');
    listItem.classList.add('header-cmp-navigation__item', 'header-cmp-navigation__item--level-0');

    const link = itemNode.querySelector('[data-aue-prop="link"]');
    const label = itemNode.querySelector('[data-aue-prop="label"]');

    if (link && label) {
      const anchor = document.createElement('a');
      anchor.classList.add('header-cmp-navigation__item-link');
      anchor.href = link.textContent.trim();
      anchor.textContent = label.textContent.trim();
      listItem.append(anchor);
      moveInstrumentation(link, anchor);
      moveInstrumentation(label, anchor);
    }
    navList.append(listItem);
    moveInstrumentation(itemNode, listItem);
  });
  nav.append(navList);
  navItemDiv.append(nav);
  collapseDiv.append(navItemDiv);

  const sectionDiv = document.createElement('div');
  sectionDiv.classList.add('header-section', 'header-d-flex', 'header-align-items-center', 'header-justify-content-end');

  const countrySelector = document.createElement('div');
  countrySelector.classList.add('header-search-icon', 'header-country-selector-trigger', 'header-d-flex', 'header-align-items-center');
  countrySelector.setAttribute('data-toggle', 'modal');
  countrySelector.setAttribute('data-target', '#countryModal');

  const countryCode = document.createElement('span');
  countryCode.classList.add('header-country-code');
  countryCode.textContent = 'IN'; // Default
  countrySelector.append(countryCode);

  const countryFlag = document.createElement('img');
  countryFlag.classList.add('header-country-flag');
  countryFlag.src = '/content/dam/aemigrate/uploaded-folder/image/india-1-fmt-webp-alpha.webp'; // Default
  countryFlag.alt = 'flag';
  countrySelector.append(countryFlag);

  const dropdownIcon = document.createElement('img');
  dropdownIcon.src = '/content/dam/aemigrate/uploaded-folder/image/dropdown-icon.png';
  dropdownIcon.alt = 'dropdown-icon';
  dropdownIcon.classList.add('header-dropdown-icon');
  countrySelector.append(dropdownIcon);

  sectionDiv.append(countrySelector);
  collapseDiv.append(sectionDiv);
  navbar.append(collapseDiv);

  const iconListDiv = document.createElement('div');
  iconListDiv.classList.add('header-itc-header-icon-list');

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
  searchInput.type = 'text';
  searchInput.id = 'searchInput';
  searchInput.placeholder = 'Search';
  searchContainer.append(searchInput);
  const searchButton = document.createElement('button');
  searchButton.id = 'searchButton';
  const searchButtonImg = document.createElement('img');
  searchButtonImg.loading = 'lazy';
  searchButtonImg.src = '/content/dam/aemigrate/uploaded-folder/image/search-icon.png';
  searchButtonImg.alt = 'Search icon';
  searchButton.append(searchButtonImg);
  searchContainer.append(searchButton);
  searchBox.append(searchContainer);

  const closeButton = document.createElement('img');
  closeButton.id = 'closeButton';
  closeButton.loading = 'lazy';
  closeButton.src = '/content/dam/aemigrate/uploaded-folder/image/1774253626039.svg+xml';
  closeButton.alt = 'Close icon';
  searchBox.append(closeButton);
  searchBlock.append(searchBox);

  const searchResults = document.createElement('div');
  searchResults.id = 'searchResults';
  searchResults.classList.add('header-search-results', 'header-hidden');
  const popularSuggestions = document.createElement('h4');
  popularSuggestions.classList.add('header-resultList');
  popularSuggestions.textContent = 'Popular Suggestions';
  searchResults.append(popularSuggestions);
  const suggestionsList = document.createElement('ul');
  suggestionsList.id = 'suggestionsList';
  searchResults.append(suggestionsList);
  const pages = document.createElement('h4');
  pages.classList.add('header-resultList');
  pages.textContent = 'Pages';
  searchResults.append(pages);
  const productsList = document.createElement('ul');
  productsList.id = 'productsList';
  productsList.classList.add('header-products');
  searchResults.append(productsList);
  const viewAllButton = document.createElement('button');
  viewAllButton.id = 'viewAllButton';
  viewAllButton.textContent = 'VIEW ALL ITEMS';
  searchResults.append(viewAllButton);
  searchBlock.append(searchResults);
  iconListDiv.append(searchBlock);

  const searchLink = document.createElement('a');
  searchLink.classList.add('header-nav-link');
  const searchIcon = document.createElement('img');
  searchIcon.loading = 'lazy';
  searchIcon.id = 'searchIcon';
  searchIcon.src = '/content/dam/aemigrate/uploaded-folder/image/search-icon.png';
  searchIcon.alt = 'Search icon';
  searchLink.append(searchIcon);
  const searchSpan = document.createElement('span');
  searchSpan.classList.add('header-d-block');
  searchSpan.textContent = 'Search';
  searchLink.append(searchSpan);
  iconListDiv.append(searchLink);

  const navItemLi = document.createElement('li');
  navItemLi.classList.add('header-nav-item');
  const navItemAnchor = document.createElement('a');
  navItemAnchor.classList.add('header-nav-link');
  navItemLi.append(navItemAnchor);
  iconListDiv.append(navItemLi);

  navbar.append(iconListDiv);
  headerContainer.append(navbar);

  const modal = document.createElement('div');
  modal.classList.add('header-modal', 'header-fade', 'header-itc-country-selector', 'header-show');
  modal.id = 'countryModal';
  modal.tabIndex = -1;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', 'countryModalLabel');
  modal.setAttribute('aria-modal', 'true');
  modal.style.display = 'block';

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
  headerW100.append(modalTitle);
  const experienceText = document.createElement('p');
  experienceText.classList.add('header-experience-text');
  experienceText.textContent = 'Experience';
  headerW100.append(experienceText);
  modalHeader.append(headerW100);
  modalContent.append(modalHeader);

  const modalBody = document.createElement('div');
  modalBody.classList.add('header-modal-body');
  const countryOptionsDiv = document.createElement('div');
  countryOptionsDiv.classList.add('header-country-options', 'header-d-flex', 'header-justify-content-center', 'header-align-items-center');

  const countryOptions = block.querySelectorAll('[data-aue-model="countryOption"]');
  countryOptions.forEach((itemNode) => {
    const countryOptionDiv = document.createElement('div');
    countryOptionDiv.classList.add('header-country-option', 'header-mx-3', 'header-d-flex', 'header-flex-column', 'header-align-items-center');

    const flagImg = itemNode.querySelector('[data-aue-prop="flag"] img');
    const countryName = itemNode.querySelector('[data-aue-prop="countryName"]');
    const countryUrl = itemNode.querySelector('[data-aue-prop="countryUrl"]');

    if (flagImg && countryName && countryUrl) {
      countryOptionDiv.setAttribute('data-country', countryName.textContent.trim().toLowerCase());
      countryOptionDiv.setAttribute('data-url', countryUrl.textContent.trim());

      const img = createOptimizedPicture(flagImg.src, flagImg.alt);
      img.classList.add('header-country-flag');
      countryOptionDiv.append(img);
      moveInstrumentation(flagImg, img);

      const p = document.createElement('p');
      p.classList.add('header-country-name');
      p.textContent = countryName.textContent.trim();
      countryOptionDiv.append(p);
      moveInstrumentation(countryName, p);
      moveInstrumentation(countryUrl, countryOptionDiv);
    }
    countryOptionsDiv.append(countryOptionDiv);
    moveInstrumentation(itemNode, countryOptionDiv);
  });

  modalBody.append(countryOptionsDiv);
  modalContent.append(modalBody);
  modalDialog.append(modalContent);
  modal.append(modalDialog);

  block.textContent = '';
  block.append(headerContainer);
  block.append(modal);
  block.className = 'header-itc-header-section block';
  block.dataset.blockStatus = 'loaded';
}
