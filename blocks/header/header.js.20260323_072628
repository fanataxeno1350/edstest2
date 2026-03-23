import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const headerContainer = document.createElement('div');
  headerContainer.classList.add('header-container');

  const navbar = document.createElement('nav');
  navbar.classList.add('header-navbar', 'header-navbar-expand-xl', 'header-navbar-light', 'header-bg-light', 'header-px-xl-5', 'header-d-flex', 'header-justify-content-between', 'header-align-items-center');

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
  navbar.append(togglerButton);

  const dXlNoneDiv = document.createElement('div');
  dXlNoneDiv.classList.add('header-d-xl-none');
  dXlNoneDiv.innerHTML = '&nbsp;';
  navbar.append(dXlNoneDiv);

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('header-logo', 'header-image');
  const logoLink = block.querySelector('[data-aue-prop="logoLink"]');
  if (logoLink) {
    const img = block.querySelector('[data-aue-prop="logoAsset"] img');
    if (img) {
      const picture = createOptimizedPicture(img.src, img.alt);
      const link = document.createElement('a');
      link.href = logoLink.href;
      link.target = '_blank';
      link.append(picture);
      logoDiv.append(link);
      moveInstrumentation(img, picture.querySelector('img'));
      moveInstrumentation(logoLink, link);
    }
  }
  navbar.append(logoDiv);

  const collapseDiv = document.createElement('div');
  collapseDiv.classList.add('header-collapse', 'header-navbar-collapse', 'header-justify-content-center');
  collapseDiv.id = 'navbarSupportedContent';

  const navItemDiv = document.createElement('div');
  navItemDiv.classList.add('header-nav-item', 'header-navigation');
  const navElement = document.createElement('nav');
  navElement.id = 'navigation-6d5dcb0126';
  navElement.classList.add('header-cmp-navigation');
  navElement.setAttribute('itemscope', '');
  navElement.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  navElement.setAttribute('role', 'navigation');
  const navUl = document.createElement('ul');
  navUl.classList.add('header-cmp-navigation__group');

  const navigationLinks = block.querySelectorAll('[data-aue-model="navigationLink"]');
  navigationLinks.forEach((linkNode) => {
    const li = document.createElement('li');
    li.classList.add('header-cmp-navigation__item', 'header-cmp-navigation__item--level-0');
    const a = document.createElement('a');
    a.classList.add('header-cmp-navigation__item-link');
    const link = linkNode.querySelector('[data-aue-prop="link"]');
    const label = linkNode.querySelector('[data-aue-prop="label"]');
    if (link) {
      a.href = link.href;
      a.textContent = label ? label.textContent : link.textContent;
      li.append(a);
      navUl.append(li);
      moveInstrumentation(link, a);
      if (label) moveInstrumentation(label, a);
      moveInstrumentation(linkNode, li);
    }
  });
  navElement.append(navUl);
  navItemDiv.append(navElement);
  collapseDiv.append(navItemDiv);

  const headerSectionDiv = document.createElement('div');
  headerSectionDiv.classList.add('header-header-section', 'header-d-flex', 'header-align-items-center', 'header-justify-content-end');

  const searchIconDiv = document.createElement('div');
  searchIconDiv.classList.add('header-search-icon', 'header-country-selector-trigger', 'header-d-flex', 'header-align-items-center');
  searchIconDiv.setAttribute('data-toggle', 'modal');
  searchIconDiv.setAttribute('data-target', '#countryModal');

  const countryCodeSpan = document.createElement('span');
  countryCodeSpan.classList.add('header-country-code');
  countryCodeSpan.textContent = 'IN'; // Default value
  searchIconDiv.append(countryCodeSpan);

  const flagInImg = block.querySelector('[data-aue-prop="flagIn"]');
  if (flagInImg) {
    const img = createOptimizedPicture(flagInImg.src, 'flag');
    img.classList.add('header-header-country-flag');
    searchIconDiv.append(img);
    moveInstrumentation(flagInImg, img.querySelector('img'));
  }

  const dropdownIcon = document.createElement('img');
  dropdownIcon.src = '/content/dam/aemigrate/uploaded-folder/image/dropdown-icon.png';
  dropdownIcon.alt = 'dropdown-icon';
  dropdownIcon.classList.add('header-dropdown-icon');
  searchIconDiv.append(dropdownIcon);

  headerSectionDiv.append(searchIconDiv);
  collapseDiv.append(headerSectionDiv);
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
  searchInput.setAttribute('type', 'text');
  searchInput.id = 'searchInput';
  searchInput.setAttribute('placeholder', 'Search');
  const searchButton = document.createElement('button');
  searchButton.id = 'searchButton';
  const searchIconImg = block.querySelector('[data-aue-prop="searchIcon"]');
  if (searchIconImg) {
    const img = createOptimizedPicture(searchIconImg.src, 'Search icon');
    searchButton.append(img);
    moveInstrumentation(searchIconImg, img.querySelector('img'));
  }
  searchContainer.append(searchInput, searchButton);
  const closeButton = document.createElement('img');
  closeButton.id = 'closeButton';
  closeButton.setAttribute('loading', 'lazy');
  closeButton.src = '/content/dam/aemigrate/uploaded-folder/image/1774247626890.svg+xml';
  closeButton.alt = 'Close icon';
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
  iconListDiv.append(searchBlock);

  const searchNavLink = document.createElement('a');
  searchNavLink.classList.add('header-nav-link');
  if (searchIconImg) {
    const img = createOptimizedPicture(searchIconImg.src, 'Search icon');
    searchNavLink.append(img);
    moveInstrumentation(searchIconImg, img.querySelector('img'));
  }
  const searchSpan = document.createElement('span');
  searchSpan.classList.add('header-d-block');
  searchSpan.textContent = 'Search';
  searchNavLink.append(searchSpan);
  iconListDiv.append(searchNavLink);

  const navItemLi = document.createElement('li');
  navItemLi.classList.add('header-nav-item');
  const navItemA = document.createElement('a');
  navItemA.classList.add('header-nav-link');
  navItemLi.append(navItemA);
  iconListDiv.append(navItemLi);

  navbar.append(iconListDiv);
  headerContainer.append(navbar);

  const modalDiv = document.createElement('div');
  modalDiv.classList.add('header-modal', 'header-fade', 'header-itc-country-selector', 'header-show');
  modalDiv.id = 'countryModal';
  modalDiv.setAttribute('tabindex', '-1');
  modalDiv.setAttribute('role', 'dialog');
  modalDiv.setAttribute('aria-labelledby', 'countryModalLabel');
  modalDiv.setAttribute('aria-modal', 'true');
  modalDiv.style.display = 'block';

  const modalDialog = document.createElement('div');
  modalDialog.classList.add('header-modal-dialog', 'header-modal-dialog-centered');
  modalDialog.setAttribute('role', 'document');

  const modalContent = document.createElement('div');
  modalContent.classList.add('header-modal-content');

  const modalHeader = document.createElement('div');
  modalHeader.classList.add('header-modal-header', 'header-border-0', 'header-text-center');
  const w100Div = document.createElement('div');
  w100Div.classList.add('header-w-100');
  const modalTitle = document.createElement('h2');
  modalTitle.classList.add('header-modal-title');
  modalTitle.innerHTML = 'SELECT YOUR <br>KITCHENS OF INDIA';
  const experienceText = document.createElement('p');
  experienceText.classList.add('header-experience-text');
  experienceText.textContent = 'Experience';
  w100Div.append(modalTitle, experienceText);
  modalHeader.append(w100Div);
  modalContent.append(modalHeader);

  const modalBody = document.createElement('div');
  modalBody.classList.add('header-modal-body');
  const countryOptionsDiv = document.createElement('div');
  countryOptionsDiv.classList.add('header-country-options', 'header-d-flex', 'header-justify-content-center', 'header-align-items-center');

  const countryOptions = block.querySelectorAll('[data-aue-model="countryOption"]');
  countryOptions.forEach((optionNode) => {
    const countryOptionDiv = document.createElement('div');
    countryOptionDiv.classList.add('header-country-option', 'header-mx-3', 'header-d-flex', 'header-flex-column', 'header-align-items-center');

    const countryName = optionNode.querySelector('[data-aue-prop="countryName"]');
    const countryUrl = optionNode.querySelector('[data-aue-prop="countryUrl"]');
    const countryFlag = optionNode.querySelector('[data-aue-prop="flag"]');

    if (countryName) {
      countryOptionDiv.setAttribute('data-country', countryName.textContent.toLowerCase());
    }
    if (countryUrl) {
      countryOptionDiv.setAttribute('data-url', countryUrl.href);
    }

    if (countryFlag) {
      const img = createOptimizedPicture(countryFlag.src, `${countryName ? countryName.textContent : ''} Flag`);
      img.classList.add('header-country-flag');
      if (countryName && countryName.textContent.toLowerCase() === 'india') {
        img.classList.add('header-india-flag');
        countryOptionDiv.classList.add('header-selected');
      } else if (countryName && countryName.textContent.toLowerCase() === 'usa') {
        img.classList.add('header-usa-flag');
      }
      countryOptionDiv.append(img);
      moveInstrumentation(countryFlag, img.querySelector('img'));
    }

    if (countryName) {
      const p = document.createElement('p');
      p.classList.add('header-country-name');
      p.textContent = countryName.textContent;
      countryOptionDiv.append(p);
      moveInstrumentation(countryName, p);
    }

    countryOptionsDiv.append(countryOptionDiv);
    moveInstrumentation(optionNode, countryOptionDiv);
  });

  modalBody.append(countryOptionsDiv);
  modalContent.append(modalBody);
  modalDialog.append(modalContent);
  modalDiv.append(modalDialog);

  block.textContent = '';
  block.append(headerContainer, modalDiv);
  block.className = `header-itc-header-section ${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
