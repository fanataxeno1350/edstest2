import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root model fields based on BlockJson
  const [
    logoImageRow,
    logoLinkRow,
    navigationItemsContainerRow, // This is a container row, not individual items
    countryFlagInRow,
    countryFlagUsaRow, // This row is not used in the current JS, but kept for structure alignment
    countryOptionsContainerRow, // This is a container row, not individual items
    ...itemRows // Remaining rows are actual item sub-components
  ] = [...block.children];

  // Main container
  const container = document.createElement('div');
  container.classList.add('container');

  // Navbar
  const nav = document.createElement('nav');
  nav.classList.add(
    'navbar',
    'navbar-expand-xl',
    'navbar-light',
    'bg-light',
    'px-xl-5',
    'd-flex',
    'justify-content-between',
    'align-items-center',
  );

  // Navbar Toggler
  const navbarToggler = document.createElement('button');
  navbarToggler.classList.add('navbar-toggler', 'collapsed');
  navbarToggler.type = 'button';
  navbarToggler.setAttribute('aria-controls', 'navbarSupportedContent');
  navbarToggler.setAttribute('aria-expanded', 'false');
  navbarToggler.setAttribute('aria-label', 'Toggle navigation');
  const togglerIcon = document.createElement('span');
  togglerIcon.classList.add('navbar-toggler-icon');
  navbarToggler.append(togglerIcon);
  nav.append(navbarToggler);

  const dXlNone = document.createElement('div');
  dXlNone.classList.add('d-xl-none');
  dXlNone.innerHTML = '&nbsp;';
  nav.append(dXlNone);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image');
  const logoCmpImage = document.createElement('div');
  logoCmpImage.classList.add('cmp-image', 'header-logo-div');

  const logoLink = document.createElement('a');
  logoLink.classList.add('cmp-image__link');
  const foundLogoLink = logoLinkRow.querySelector('a');
  if (foundLogoLink) {
    logoLink.href = foundLogoLink.href;
    logoLink.target = '_blank';
  }

  const logoPicture = logoImageRow.querySelector('picture');
  if (logoPicture) {
    const logoImg = logoPicture.querySelector('img');
    const optimizedLogoPic = createOptimizedPicture(logoImg.src, logoImg.alt, false, [{ width: '131' }]);
    moveInstrumentation(logoImg, optimizedLogoPic.querySelector('img'));
    logoLink.append(optimizedLogoPic);
  }
  logoCmpImage.append(logoLink);
  logoDiv.append(logoCmpImage);
  nav.append(logoDiv);

  // Collapsible Navbar Content
  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('collapse', 'navbar-collapse', 'justify-content-center');
  navbarCollapse.id = 'navbarSupportedContent';

  // Navigation Items
  const navItemNavigation = document.createElement('div');
  navItemNavigation.classList.add('nav-item', 'navigation');
  const cmpNavigation = document.createElement('nav');
  cmpNavigation.classList.add('cmp-navigation');
  cmpNavigation.role = 'navigation';
  const cmpNavigationGroup = document.createElement('ul');
  cmpNavigationGroup.classList.add('cmp-navigation__group');

  // Filter for navigation-item sub-components: 2 cells, first cell contains an 'a' tag
  const navigationItems = itemRows.filter((row) => row.children.length === 2 && row.children[0].querySelector('a'));
  navigationItems.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');
    const link = row.children[0].querySelector('a');
    const label = row.children[1];
    if (link && label) {
      const navLink = document.createElement('a');
      navLink.classList.add('cmp-navigation__item-link');
      navLink.href = link.href;
      navLink.textContent = label.textContent;
      li.append(navLink);
    }
    cmpNavigationGroup.append(li);
  });
  cmpNavigation.append(cmpNavigationGroup);
  navItemNavigation.append(cmpNavigation);
  navbarCollapse.append(navItemNavigation);

  // Header Section with Search and Country Selector
  const headerSection = document.createElement('div');
  headerSection.classList.add('header-section', 'd-flex', 'align-items-center', 'justify-content-end');

  // Country Selector Trigger
  const countrySelectorTrigger = document.createElement('div');
  countrySelectorTrigger.classList.add('search-icon', 'country-selector-trigger', 'd-flex', 'align-items-center');

  const countryCode = document.createElement('span');
  countryCode.classList.add('country-code');
  countryCode.textContent = 'IN'; // Default to IN as per original HTML
  countrySelectorTrigger.append(countryCode);

  const countryFlag = document.createElement('img');
  countryFlag.classList.add('header-country-flag');
  const inFlagPicture = countryFlagInRow.querySelector('picture');
  if (inFlagPicture) {
    const inFlagImg = inFlagPicture.querySelector('img');
    countryFlag.src = inFlagImg.src;
    countryFlag.alt = inFlagImg.alt;
  }
  countrySelectorTrigger.append(countryFlag);

  const dropdownIcon = document.createElement('img');
  dropdownIcon.src = '/content/dam/aemigrate/uploaded-folder/image/dropdown-icon.png';
  dropdownIcon.alt = 'dropdown-icon';
  dropdownIcon.classList.add('dropdown-icon');
  countrySelectorTrigger.append(dropdownIcon);
  headerSection.append(countrySelectorTrigger);
  navbarCollapse.append(headerSection);

  // ITC Header Icon List (Search)
  const itcHeaderIconList = document.createElement('div');
  itcHeaderIconList.classList.add('itc-header-icon-list');

  const searchBlock = document.createElement('div');
  searchBlock.id = 'searchBlock';
  searchBlock.classList.add('search-block', 'hidden');

  const searchBox = document.createElement('div');
  searchBox.id = 'searchBox';
  searchBox.classList.add('search-box');

  const searchContainer = document.createElement('div');
  searchContainer.id = 'searchContainer';
  searchContainer.classList.add('search-container', 'hidden');
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.id = 'searchInput';
  searchInput.placeholder = 'Search';
  const searchButton = document.createElement('button');
  searchButton.id = 'searchButton';
  const searchButtonImg = document.createElement('img');
  searchButtonImg.loading = 'lazy';
  searchButtonImg.src = '/content/dam/aemigrate/uploaded-folder/image/search-icon.png';
  searchButtonImg.alt = 'Search icon';
  searchButton.append(searchButtonImg);
  searchContainer.append(searchInput, searchButton);

  const closeButton = document.createElement('img');
  closeButton.id = 'closeButton';
  closeButton.loading = 'lazy';
  closeButton.src = '/content/dam/aemigrate/uploaded-folder/image/1774935173013.svg+xml';
  closeButton.alt = 'Close icon';
  searchBox.append(searchContainer, closeButton);
  searchBlock.append(searchBox);

  const searchResults = document.createElement('div');
  searchResults.id = 'searchResults';
  searchResults.classList.add('search-results', 'hidden');
  const popularSuggestions = document.createElement('h4');
  popularSuggestions.classList.add('resultList');
  popularSuggestions.textContent = 'Popular Suggestions';
  const suggestionsList = document.createElement('ul');
  suggestionsList.id = 'suggestionsList';
  const pagesListTitle = document.createElement('h4');
  pagesListTitle.classList.add('resultList');
  pagesListTitle.textContent = 'Pages';
  const productsList = document.createElement('ul');
  productsList.id = 'productsList';
  productsList.classList.add('products');
  const viewAllButton = document.createElement('button');
  viewAllButton.id = 'viewAllButton';
  viewAllButton.textContent = 'VIEW ALL ITEMS';
  searchResults.append(popularSuggestions, suggestionsList, pagesListTitle, productsList, viewAllButton);
  searchBlock.append(searchResults);
  itcHeaderIconList.append(searchBlock);

  const searchLink = document.createElement('a');
  searchLink.classList.add('nav-link');
  const searchIcon = document.createElement('img');
  searchIcon.loading = 'lazy';
  searchIcon.id = 'searchIcon';
  searchIcon.src = '/content/dam/aemigrate/uploaded-folder/image/search-icon.png';
  searchIcon.alt = 'Search icon';
  const searchSpan = document.createElement('span');
  searchSpan.classList.add('d-block');
  searchSpan.textContent = 'Search';
  searchLink.append(searchIcon, searchSpan);
  itcHeaderIconList.append(searchLink);

  nav.append(navbarCollapse, itcHeaderIconList);
  container.append(nav);
  block.append(container);

  // Country Selector Modal
  const countryModal = document.createElement('div');
  countryModal.classList.add('modal', 'fade', 'itc-country-selector');
  countryModal.id = 'countryModal';
  countryModal.tabIndex = '-1';
  countryModal.role = 'dialog';
  countryModal.setAttribute('aria-labelledby', 'countryModalLabel');
  countryModal.setAttribute('aria-modal', 'true');

  const modalDialog = document.createElement('div');
  modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');
  modalDialog.role = 'document';

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header', 'border-0', 'text-center');
  const w100 = document.createElement('div');
  w100.classList.add('w-100');
  const modalTitle = document.createElement('h2');
  modalTitle.classList.add('modal-title');
  modalTitle.innerHTML = 'SELECT YOUR <br>KITCHENS OF INDIA';
  const experienceText = document.createElement('p');
  experienceText.classList.add('experience-text');
  experienceText.textContent = 'Experience';
  w100.append(modalTitle, experienceText);
  modalHeader.append(w100);
  modalContent.append(modalHeader);

  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');
  const countryOptionsDiv = document.createElement('div');
  countryOptionsDiv.classList.add('country-options', 'd-flex', 'justify-content-center', 'align-items-center');

  // Filter for country-option sub-components: 2 cells, first cell contains a 'picture' tag
  const countryOptions = itemRows.filter((row) => row.children.length === 2 && row.children[0].querySelector('picture'));
  countryOptions.forEach((row) => {
    const optionDiv = document.createElement('div');
    optionDiv.classList.add('country-option', 'mx-3', 'd-flex', 'flex-column', 'align-items-center');
    const flagImageCell = row.children[0];
    const countryNameCell = row.children[1];

    const flagImg = flagImageCell.querySelector('picture img');
    if (flagImg) {
      const countryFlagImg = document.createElement('img');
      countryFlagImg.src = flagImg.src;
      countryFlagImg.alt = `${countryNameCell.textContent} Flag`;
      countryFlagImg.classList.add('country-flag');
      if (countryNameCell.textContent.toLowerCase() === 'india') {
        countryFlagImg.classList.add('india-flag');
        optionDiv.classList.add('selected'); // Default selected
        optionDiv.setAttribute('data-country', 'india');
        optionDiv.setAttribute('data-url', '/india');
      } else if (countryNameCell.textContent.toLowerCase() === 'usa') {
        countryFlagImg.classList.add('usa-flag');
        optionDiv.setAttribute('data-country', 'usa');
        optionDiv.setAttribute('data-url', '/usa');
      }
      optionDiv.append(countryFlagImg);
    }

    const countryNameP = document.createElement('p');
    countryNameP.classList.add('country-name');
    countryNameP.textContent = countryNameCell.textContent;
    optionDiv.append(countryNameP);
    countryOptionsDiv.append(optionDiv);
  });

  modalBody.append(countryOptionsDiv);
  modalContent.append(modalBody);
  modalDialog.append(modalContent);
  countryModal.append(modalDialog);
  block.append(countryModal);

  // Event Listeners for interactive behavior
  navbarToggler.addEventListener('click', () => {
    navbarCollapse.classList.toggle('show');
    navbarToggler.classList.toggle('collapsed');
  });

  countrySelectorTrigger.addEventListener('click', () => {
    countryModal.classList.add('show');
    countryModal.style.display = 'block';
  });

  countryModal.addEventListener('click', (e) => {
    if (e.target === countryModal) {
      countryModal.classList.remove('show');
      countryModal.style.display = 'none';
    }
  });

  // Event listener for country option selection within the modal
  countryOptionsDiv.addEventListener('click', (e) => {
    const selectedOption = e.target.closest('.country-option');
    if (selectedOption) {
      // Remove 'selected' class from all options
      countryOptionsDiv.querySelectorAll('.country-option').forEach((option) => {
        option.classList.remove('selected');
      });
      // Add 'selected' class to the clicked option
      selectedOption.classList.add('selected');

      // Update the main header country flag and code
      const country = selectedOption.getAttribute('data-country');
      const url = selectedOption.getAttribute('data-url');
      const flagImg = selectedOption.querySelector('.country-flag');

      if (country && flagImg) {
        countryCode.textContent = country.toUpperCase();
        countryFlag.src = flagImg.src;
        countryFlag.alt = `${country} Flag`;
      }

      // Optionally, redirect or perform other actions based on selection
      // if (url) {
      //   window.location.href = url;
      // }

      // Close the modal
      countryModal.classList.remove('show');
      countryModal.style.display = 'none';
    }
  });


  // Search functionality
  searchLink.addEventListener('click', () => {
    searchBlock.classList.toggle('hidden');
    // Ensure search input and results are hidden when opening/closing search block
    if (searchBlock.classList.contains('hidden')) {
      searchContainer.classList.add('hidden');
      searchResults.classList.add('hidden');
    } else {
      searchContainer.classList.remove('hidden'); // Show search input when search block is visible
    }
  });

  searchButton.addEventListener('click', () => {
    // Implement search logic here
    searchResults.classList.remove('hidden');
  });

  closeButton.addEventListener('click', () => {
    searchBlock.classList.add('hidden');
    searchContainer.classList.add('hidden');
    searchResults.classList.add('hidden');
  });

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Remove original block content
  block.textContent = '';
  block.append(container, countryModal);
}
