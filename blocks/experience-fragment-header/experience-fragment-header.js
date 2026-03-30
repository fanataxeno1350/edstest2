import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const header = document.createElement('header');
  header.classList.add('itc-header-section');

  const container = document.createElement('div');
  container.classList.add('container');

  const navbar = document.createElement('nav');
  navbar.classList.add('navbar', 'navbar', 'navbar-expand-xl', 'navbar-light', 'bg-light', 'px-xl-5', 'd-flex', 'justify-content-between', 'align-items-center');

  const togglerButton = document.createElement('button');
  togglerButton.classList.add('navbar-toggler', 'collapsed');
  togglerButton.setAttribute('type', 'button');
  togglerButton.setAttribute('data-toggle', 'collapse');
  togglerButton.setAttribute('data-target', '#navbarSupportedContent');
  togglerButton.setAttribute('aria-controls', 'navbarSupportedContent');
  togglerButton.setAttribute('aria-expanded', 'false');
  togglerButton.setAttribute('aria-label', 'Toggle navigation');
  const togglerSpan = document.createElement('span');
  togglerSpan.classList.add('navbar-toggler-icon');
  togglerButton.append(togglerSpan);

  const dXlNoneDiv = document.createElement('div');
  dXlNoneDiv.classList.add('d-xl-none');
  dXlNoneDiv.innerHTML = '&nbsp;';

  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image');

  const logoImageContainer = block.querySelector('[data-aue-model="experienceFragmentHeader"]');
  const logoLink = logoImageContainer.querySelector('[data-aue-prop="logoLink"]');
  const secondaryLogoLink = logoImageContainer.querySelector('[data-aue-prop="secondaryLogoLink"]');
  const logoImage = logoImageContainer.querySelector('[data-aue-prop="logoImage"]');
  const secondaryLogoImage = logoImageContainer.querySelector('[data-aue-prop="secondaryLogoImage"]');

  if (logoLink && logoImage) {
    const linkElement = document.createElement('a');
    linkElement.href = logoLink.href;
    linkElement.target = '_blank';
    linkElement.classList.add('cmp-image__link');
    const picture = createOptimizedPicture(logoImage.src, logoImage.alt);
    picture.querySelector('img').classList.add('cmp-image__image');
    linkElement.append(picture);
    const screenReaderSpan = document.createElement('span');
    screenReaderSpan.classList.add('cmp-link__screen-reader-only');
    screenReaderSpan.textContent = 'opens in a new tab';
    linkElement.append(screenReaderSpan);
    logoDiv.append(linkElement);
    moveInstrumentation(logoLink, linkElement);
    moveInstrumentation(logoImage, picture);
  }

  if (secondaryLogoLink && secondaryLogoImage) {
    const linkElement = document.createElement('a');
    linkElement.href = secondaryLogoLink.href;
    linkElement.target = '_blank';
    linkElement.classList.add('cmp-image__link');
    const picture = createOptimizedPicture(secondaryLogoImage.src, secondaryLogoImage.alt);
    picture.querySelector('img').classList.add('cmp-image__image');
    linkElement.append(picture);
    const screenReaderSpan = document.createElement('span');
    screenReaderSpan.classList.add('cmp-link__screen-reader-only');
    screenReaderSpan.textContent = 'opens in a new tab';
    linkElement.append(screenReaderSpan);
    logoDiv.append(linkElement);
    moveInstrumentation(secondaryLogoLink, linkElement);
    moveInstrumentation(secondaryLogoImage, picture);
  }

  const collapseDiv = document.createElement('div');
  collapseDiv.classList.add('collapse', 'navbar-collapse', 'justify-content-center');
  collapseDiv.id = 'navbarSupportedContent';

  const navItemDiv = document.createElement('div');
  navItemDiv.classList.add('nav-item', 'navigation');

  const navElement = document.createElement('nav');
  navElement.classList.add('cmp-navigation');
  navElement.setAttribute('itemscope', '');
  navElement.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  navElement.setAttribute('role', 'navigation');

  const navGroupUl = document.createElement('ul');
  navGroupUl.classList.add('cmp-navigation__group');

  const navShopLabel = logoImageContainer.querySelector('[data-aue-prop="navShopLabel"]');
  const navShopLink = logoImageContainer.querySelector('[data-aue-prop="navShopLink"]');
  if (navShopLabel && navShopLink) {
    const shopLi = document.createElement('li');
    shopLi.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');
    const shopA = document.createElement('a');
    shopA.classList.add('cmp-navigation__item-link');
    shopA.href = navShopLink.href;
    shopA.textContent = navShopLabel.textContent;
    shopLi.append(shopA);
    navGroupUl.append(shopLi);
    moveInstrumentation(navShopLabel, shopA);
    moveInstrumentation(navShopLink, shopA);
  }

  const navOurHeritageLabel = logoImageContainer.querySelector('[data-aue-prop="navOurHeritageLabel"]');
  const navOurHeritageLink = logoImageContainer.querySelector('[data-aue-prop="navOurHeritageLink"]');
  if (navOurHeritageLabel && navOurHeritageLink) {
    const heritageLi = document.createElement('li');
    heritageLi.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');
    const heritageA = document.createElement('a');
    heritageA.classList.add('cmp-navigation__item-link');
    heritageA.href = navOurHeritageLink.href;
    heritageA.textContent = navOurHeritageLabel.textContent;
    heritageLi.append(heritageA);
    navGroupUl.append(heritageLi);
    moveInstrumentation(navOurHeritageLabel, heritageA);
    moveInstrumentation(navOurHeritageLink, heritageA);
  }

  navElement.append(navGroupUl);
  navItemDiv.append(navElement);

  const headerSectionDiv = document.createElement('div');
  headerSectionDiv.classList.add('header-section', 'd-flex', 'align-items-center', 'justify-content-end');

  const searchIcon = logoImageContainer.querySelector('[data-aue-prop="searchIcon"]');
  const dropdownIcon = logoImageContainer.querySelector('[data-aue-prop="dropdownIcon"]');
  const countryFlagIndia = logoImageContainer.querySelector('[data-aue-prop="countryFlagIndia"]');
  const countryFlagUsa = logoImageContainer.querySelector('[data-aue-prop="countryFlagUsa"]');

  const searchCountryDiv = document.createElement('div');
  searchCountryDiv.classList.add('search-icon', 'country-selector-trigger', 'd-flex', 'align-items-center');
  searchCountryDiv.setAttribute('data-toggle', 'modal');
  searchCountryDiv.setAttribute('data-target', '#countryModal');
  searchCountryDiv.setAttribute('data-flag-in', countryFlagIndia ? countryFlagIndia.src : '');
  searchCountryDiv.setAttribute('data-flag-usa', countryFlagUsa ? countryFlagUsa.src : '');

  const countryCodeSpan = document.createElement('span');
  countryCodeSpan.classList.add('country-code');
  countryCodeSpan.textContent = 'IN'; // Default
  searchCountryDiv.append(countryCodeSpan);

  if (countryFlagIndia) {
    const flagImg = createOptimizedPicture(countryFlagIndia.src, 'flag');
    flagImg.querySelector('img').classList.add('header-country-flag');
    searchCountryDiv.append(flagImg);
    moveInstrumentation(countryFlagIndia, flagImg);
  }

  if (dropdownIcon) {
    const dropdownImg = createOptimizedPicture(dropdownIcon.src, 'dropdown-icon');
    dropdownImg.querySelector('img').classList.add('dropdown-icon');
    searchCountryDiv.append(dropdownImg);
    moveInstrumentation(dropdownIcon, dropdownImg);
  }
  headerSectionDiv.append(searchCountryDiv);

  collapseDiv.append(navItemDiv, headerSectionDiv);

  const itcHeaderIconListDiv = document.createElement('div');
  itcHeaderIconListDiv.classList.add('itc-header-icon-list');

  const searchBlockDiv = document.createElement('div');
  searchBlockDiv.id = 'searchBlock';
  searchBlockDiv.classList.add('search-block', 'hidden');

  const searchBoxDiv = document.createElement('div');
  searchBoxDiv.id = 'searchBox';
  searchBoxDiv.classList.add('search-box');

  const searchContainerDiv = document.createElement('div');
  searchContainerDiv.id = 'searchContainer';
  searchContainerDiv.classList.add('search-container', 'hidden');

  const searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'text');
  searchInput.id = 'searchInput';
  searchInput.setAttribute('placeholder', 'Search');

  const searchButton = document.createElement('button');
  searchButton.id = 'searchButton';
  if (searchIcon) {
    const searchButtonImg = createOptimizedPicture(searchIcon.src, 'Search icon');
    searchButton.append(searchButtonImg);
    moveInstrumentation(searchIcon, searchButtonImg);
  }

  searchContainerDiv.append(searchInput, searchButton);
  searchBoxDiv.append(searchContainerDiv);

  const closeIcon = logoImageContainer.querySelector('[data-aue-prop="closeIcon"]');
  if (closeIcon) {
    const closeButton = createOptimizedPicture(closeIcon.src, 'Close icon');
    closeButton.id = 'closeButton';
    searchBoxDiv.append(closeButton);
    moveInstrumentation(closeIcon, closeButton);
  }
  searchBlockDiv.append(searchBoxDiv);

  const searchResultsDiv = document.createElement('div');
  searchResultsDiv.id = 'searchResults';
  searchResultsDiv.classList.add('search-results', 'hidden');

  const popularSuggestionsH4 = document.createElement('h4');
  popularSuggestionsH4.classList.add('resultList');
  popularSuggestionsH4.textContent = 'Popular Suggestions';
  const suggestionsListUl = document.createElement('ul');
  suggestionsListUl.id = 'suggestionsList';

  const pagesH4 = document.createElement('h4');
  pagesH4.classList.add('resultList');
  pagesH4.textContent = 'Pages';
  const productsListUl = document.createElement('ul');
  productsListUl.id = 'productsList';
  productsListUl.classList.add('products');

  const viewAllButton = document.createElement('button');
  viewAllButton.id = 'viewAllButton';
  viewAllButton.textContent = 'VIEW ALL ITEMS';

  searchResultsDiv.append(popularSuggestionsH4, suggestionsListUl, pagesH4, productsListUl, viewAllButton);
  searchBlockDiv.append(searchResultsDiv);
  itcHeaderIconListDiv.append(searchBlockDiv);

  const searchNavLink = document.createElement('a');
  searchNavLink.classList.add('nav-link');
  if (searchIcon) {
    const searchIconImg = createOptimizedPicture(searchIcon.src, 'Search icon');
    searchNavLink.append(searchIconImg);
    moveInstrumentation(searchIcon, searchIconImg);
  }
  const searchSpan = document.createElement('span');
  searchSpan.classList.add('d-block');
  searchSpan.textContent = 'Search';
  searchNavLink.append(searchSpan);
  itcHeaderIconListDiv.append(searchNavLink);

  const navItemLi = document.createElement('li');
  navItemLi.classList.add('nav-item');
  const emptyNavLink = document.createElement('a');
  emptyNavLink.classList.add('nav-link');
  navItemLi.append(emptyNavLink);
  itcHeaderIconListDiv.append(navItemLi);

  navbar.append(togglerButton, dXlNoneDiv, logoDiv, collapseDiv, itcHeaderIconListDiv);
  container.append(navbar);
  header.append(container);

  const countryModalDiv = document.createElement('div');
  countryModalDiv.classList.add('modal', 'fade', 'itc-country-selector', 'show');
  countryModalDiv.id = 'countryModal';
  countryModalDiv.setAttribute('tabindex', '-1');
  countryModalDiv.setAttribute('role', 'dialog');
  countryModalDiv.setAttribute('aria-labelledby', 'countryModalLabel');
  countryModalDiv.setAttribute('aria-modal', 'true');
  countryModalDiv.style.display = 'block';

  const modalDialog = document.createElement('div');
  modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');
  modalDialog.setAttribute('role', 'document');

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header', 'border-0', 'text-center');

  const w100Div = document.createElement('div');
  w100Div.classList.add('w-100');

  const modalTitle = document.createElement('h2');
  modalTitle.classList.add('modal-title');
  modalTitle.innerHTML = 'SELECT YOUR <br>KITCHENS OF INDIA';

  const experienceText = document.createElement('p');
  experienceText.classList.add('experience-text');
  experienceText.textContent = 'Experience';

  w100Div.append(modalTitle, experienceText);
  modalHeader.append(w100Div);

  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');

  const countryOptionsDiv = document.createElement('div');
  countryOptionsDiv.classList.add('country-options', 'd-flex', 'justify-content-center', 'align-items-center');

  const countryNameIndia = logoImageContainer.querySelector('[data-aue-prop="countryNameIndia"]');
  const countryNameUsa = logoImageContainer.querySelector('[data-aue-prop="countryNameUsa"]');

  const indiaOption = document.createElement('div');
  indiaOption.classList.add('country-option', 'selected', 'mx-3', 'd-flex', 'flex-column', 'align-items-center');
  indiaOption.setAttribute('data-country', 'india');
  indiaOption.setAttribute('data-url', '/india');
  if (countryFlagIndia) {
    const indiaFlagImg = createOptimizedPicture(countryFlagIndia.src, 'India Flag');
    indiaFlagImg.querySelector('img').classList.add('country-flag', 'india-flag');
    indiaOption.append(indiaFlagImg);
    moveInstrumentation(countryFlagIndia, indiaFlagImg);
  }
  if (countryNameIndia) {
    const indiaP = document.createElement('p');
    indiaP.classList.add('country-name');
    indiaP.textContent = countryNameIndia.textContent;
    indiaOption.append(indiaP);
    moveInstrumentation(countryNameIndia, indiaP);
  }
  countryOptionsDiv.append(indiaOption);

  const usaOption = document.createElement('div');
  usaOption.classList.add('country-option', 'mx-3', 'd-flex', 'flex-column', 'align-items-center');
  usaOption.setAttribute('data-country', 'usa');
  usaOption.setAttribute('data-url', '/usa');
  if (countryFlagUsa) {
    const usaFlagImg = createOptimizedPicture(countryFlagUsa.src, 'USA Flag');
    usaFlagImg.querySelector('img').classList.add('country-flag', 'usa-flag');
    usaOption.append(usaFlagImg);
    moveInstrumentation(countryFlagUsa, usaFlagImg);
  }
  if (countryNameUsa) {
    const usaP = document.createElement('p');
    usaP.classList.add('country-name');
    usaP.textContent = countryNameUsa.textContent;
    usaOption.append(usaP);
    moveInstrumentation(countryNameUsa, usaP);
  }
  countryOptionsDiv.append(usaOption);

  modalBody.append(countryOptionsDiv);
  modalContent.append(modalHeader, modalBody);
  modalDialog.append(modalContent);
  countryModalDiv.append(modalDialog);

  header.append(countryModalDiv);

  block.textContent = '';
  block.append(header);
  block.className = `experience-fragment-header block`;
  block.dataset.blockStatus = 'loaded';
}
