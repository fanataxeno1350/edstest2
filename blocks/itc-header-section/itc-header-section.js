import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    logoImageRow,
    logoLinkRow,
    navigationItemsContainerRow, // This row is a container, not an item itself.
    flagInRow,
    flagUsaRow,
    countryOptionsContainerRow, // This row is a container, not an item itself.
    ...itemRows
  ] = [...block.children];

  block.textContent = '';
  block.classList.add('itc-header-section');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  block.append(containerDiv);

  const navbar = document.createElement('nav');
  navbar.classList.add(
    'navbar',
    'navbar-expand-xl',
    'navbar-light',
    'bg-light',
    'px-xl-5',
    'd-flex',
    'justify-content-between',
    'align-items-center',
  );
  containerDiv.append(navbar);

  // Navbar Toggler
  const toggler = document.createElement('button');
  toggler.classList.add('navbar-toggler', 'collapsed');
  toggler.type = 'button';
  // Original HTML uses data-toggle and data-target, but EDS uses addEventListener
  toggler.setAttribute('aria-controls', 'navbarSupportedContent');
  toggler.setAttribute('aria-expanded', 'false');
  toggler.setAttribute('aria-label', 'Toggle navigation');
  const togglerSpan = document.createElement('span');
  togglerSpan.classList.add('navbar-toggler-icon');
  toggler.append(togglerSpan);
  navbar.append(toggler);

  const dXlNoneDiv = document.createElement('div');
  dXlNoneDiv.classList.add('d-xl-none');
  dXlNoneDiv.innerHTML = '&nbsp;';
  navbar.append(dXlNoneDiv);

  // Logo
  const logoDiv = document.createElement('div');
  logoDiv.classList.add('logo', 'image');
  navbar.append(logoDiv);

  const cmpImageDiv = document.createElement('div');
  cmpImageDiv.classList.add('cmp-image', 'header-logo-div');
  cmpImageDiv.setAttribute('data-cmp-hook-image', 'imageV3');
  cmpImageDiv.setAttribute('itemscope', '');
  cmpImageDiv.setAttribute('itemtype', 'http://schema.org/ImageObject');
  logoDiv.append(cmpImageDiv);

  // Logo Link (from logoLinkRow)
  const logoLinkAnchor = logoLinkRow.querySelector('a');
  if (logoLinkAnchor) {
    const logoLinkInput = document.createElement('input');
    logoLinkInput.type = 'hidden';
    logoLinkInput.id = 'logoLinkId';
    logoLinkInput.value = logoLinkAnchor.href;
    cmpImageDiv.append(logoLinkInput);

    const checkLogoLink = document.createElement('a');
    checkLogoLink.classList.add('checkLogoLink');
    checkLogoLink.target = '_blank';
    checkLogoLink.href = logoLinkAnchor.href; // Set href for the checkLogoLink
    cmpImageDiv.append(checkLogoLink);

    const logoImgPicture = logoImageRow.querySelector('picture');
    if (logoImgPicture) {
      const newLogoImg = logoImgPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(newLogoImg.src, newLogoImg.alt, false, [{ width: '131' }]);
      moveInstrumentation(logoImgPicture, optimizedPic.querySelector('img'));
      checkLogoLink.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('cmp-image__image', 'itc-logo-image'); // Add classes from original HTML
    }

    const screenReaderSpan = document.createElement('span');
    screenReaderSpan.classList.add('cmp-link__screen-reader-only');
    screenReaderSpan.textContent = 'opens in a new tab';
    checkLogoLink.append(screenReaderSpan);

    // The original HTML has two <a> tags for the logo, one for the SVG and one for the PNG.
    // This JS generates a structure closer to the second <a> tag in the original HTML,
    // which seems to be the primary one for the actual logo image.
    // The first <a> with the SVG is not directly mapped here, assuming the optimized picture
    // from logoImageRow is the main logo.
  }


  // Navbar Collapse
  const navbarCollapse = document.createElement('div');
  navbarCollapse.classList.add('collapse', 'navbar-collapse', 'justify-content-center');
  navbarCollapse.id = 'navbarSupportedContent';
  navbar.append(navbarCollapse);

  toggler.addEventListener('click', () => {
    navbarCollapse.classList.toggle('show');
    toggler.classList.toggle('collapsed');
  });

  // Navigation
  const navItemNavigation = document.createElement('div');
  navItemNavigation.classList.add('nav-item', 'navigation');
  navbarCollapse.append(navItemNavigation);

  const cmpNavigation = document.createElement('nav');
  cmpNavigation.id = 'navigation-6d5dcb0126';
  cmpNavigation.classList.add('cmp-navigation');
  cmpNavigation.setAttribute('itemscope', '');
  cmpNavigation.setAttribute('itemtype', 'http://schema.org/SiteNavigationElement');
  cmpNavigation.setAttribute('role', 'navigation');
  navItemNavigation.append(cmpNavigation);

  const navGroup = document.createElement('ul');
  navGroup.classList.add('cmp-navigation__group');
  cmpNavigation.append(navGroup);

  // Filter for navigation-item sub-components
  const navigationItems = itemRows.filter((row) => row.children.length === 2 && !row.querySelector('picture'));
  navigationItems.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('cmp-navigation__item', 'cmp-navigation__item--level-0');
    const link = row.children[1].querySelector('a');
    if (link) {
      const navLink = document.createElement('a');
      navLink.classList.add('cmp-navigation__item-link');
      navLink.href = link.href;
      navLink.textContent = row.children[0].textContent;
      li.append(navLink);
    }
    navGroup.append(li);
  });

  // Header Section with Country Selector
  const headerSection = document.createElement('div');
  headerSection.classList.add('header-section', 'd-flex', 'align-items-center', 'justify-content-end');
  navbarCollapse.append(headerSection);

  const countrySelectorTrigger = document.createElement('div');
  countrySelectorTrigger.classList.add('search-icon', 'country-selector-trigger', 'd-flex', 'align-items-center');
  headerSection.append(countrySelectorTrigger);

  const countryCode = document.createElement('span');
  countryCode.classList.add('country-code');
  countryCode.textContent = 'IN'; // Default
  countrySelectorTrigger.append(countryCode);

  const flagInImg = flagInRow.querySelector('picture img');
  const headerCountryFlag = document.createElement('img'); // Declare outside if block
  if (flagInImg) {
    headerCountryFlag.classList.add('header-country-flag');
    headerCountryFlag.src = flagInImg.src;
    headerCountryFlag.alt = flagInImg.alt;
    countrySelectorTrigger.append(headerCountryFlag);
  }

  const dropdownIcon = document.createElement('img');
  dropdownIcon.src = '/content/dam/aemigrate/uploaded-folder/image/dropdown-icon.png';
  dropdownIcon.alt = 'dropdown-icon';
  dropdownIcon.classList.add('dropdown-icon');
  countrySelectorTrigger.append(dropdownIcon);

  // Country Modal
  const countryModal = document.createElement('div');
  countryModal.classList.add('modal', 'fade', 'itc-country-selector');
  countryModal.id = 'countryModal';
  countryModal.setAttribute('tabindex', '-1');
  countryModal.setAttribute('role', 'dialog');
  countryModal.setAttribute('aria-labelledby', 'countryModalLabel');
  countryModal.setAttribute('aria-modal', 'true');
  countryModal.style.display = 'none'; // Initially hidden
  block.append(countryModal);

  const modalDialog = document.createElement('div');
  modalDialog.classList.add('modal-dialog', 'modal-dialog-centered');
  modalDialog.setAttribute('role', 'document');
  countryModal.append(modalDialog);

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modalDialog.append(modalContent);

  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header', 'border-0', 'text-center');
  modalContent.append(modalHeader);

  const w100Div = document.createElement('div');
  w100Div.classList.add('w-100');
  modalHeader.append(w100Div);

  const modalTitle = document.createElement('h2');
  modalTitle.classList.add('modal-title');
  modalTitle.innerHTML = 'SELECT YOUR <br>KITCHENS OF INDIA';
  w100Div.append(modalTitle);

  const experienceText = document.createElement('p');
  experienceText.classList.add('experience-text');
  experienceText.textContent = 'Experience';
  w100Div.append(experienceText);

  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');
  modalContent.append(modalBody);

  const countryOptionsDiv = document.createElement('div');
  countryOptionsDiv.classList.add('country-options', 'd-flex', 'justify-content-center', 'align-items-center');
  modalBody.append(countryOptionsDiv);

  // Filter for country-option sub-components
  const countryOptions = itemRows.filter((row) => row.children.length === 4 && row.querySelector('picture'));
  countryOptions.forEach((row, index) => {
    const countryOption = document.createElement('div');
    countryOption.classList.add('country-option', 'mx-3', 'd-flex', 'flex-column', 'align-items-center');
    if (index === 0) countryOption.classList.add('selected'); // Default first option selected

    const dataCountry = row.children[2].textContent.toLowerCase(); // Ensure lowercase for class name
    const dataUrl = row.children[3].querySelector('a')?.href || '';
    countryOption.setAttribute('data-country', dataCountry);
    countryOption.setAttribute('data-url', dataUrl);

    const flagImg = row.children[0].querySelector('picture img');
    if (flagImg) {
      const countryFlag = document.createElement('img');
      countryFlag.src = flagImg.src;
      countryFlag.alt = `${flagImg.alt} Flag`;
      countryFlag.classList.add('country-flag', `${dataCountry}-flag`); // Use dataCountry for class name
      countryOption.append(countryFlag);
    }

    const countryName = document.createElement('p');
    countryName.classList.add('country-name');
    countryName.textContent = row.children[1].textContent;
    countryOption.append(countryName);

    countryOptionsDiv.append(countryOption);

    countryOption.addEventListener('click', () => {
      countryOptionsDiv.querySelectorAll('.country-option').forEach((opt) => opt.classList.remove('selected'));
      countryOption.classList.add('selected');
      countryCode.textContent = dataCountry.toUpperCase();
      // Update the header flag based on the selected country option
      const selectedFlagImg = row.children[0].querySelector('picture img');
      if (selectedFlagImg) {
        headerCountryFlag.src = selectedFlagImg.src;
        headerCountryFlag.alt = selectedFlagImg.alt;
      }
      window.location.href = dataUrl; // Redirect
      countryModal.classList.remove('show');
      countryModal.style.display = 'none';
    });
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

  // ITC Header Icon List (Search)
  const itcHeaderIconList = document.createElement('div');
  itcHeaderIconList.classList.add('itc-header-icon-list');
  navbar.append(itcHeaderIconList);

  const searchBlock = document.createElement('div');
  searchBlock.id = 'searchBlock';
  searchBlock.classList.add('search-block', 'hidden');
  itcHeaderIconList.append(searchBlock);

  const searchBox = document.createElement('div');
  searchBox.id = 'searchBox';
  searchBox.classList.add('search-box');
  searchBlock.append(searchBox);

  const searchContainer = document.createElement('div');
  searchContainer.id = 'searchContainer';
  searchContainer.classList.add('search-container', 'hidden');
  searchBox.append(searchContainer);

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

  const closeButton = document.createElement('img');
  closeButton.id = 'closeButton';
  closeButton.loading = 'lazy';
  closeButton.src = '/content/dam/aemigrate/uploaded-folder/image/1774938509281.svg+xml';
  closeButton.alt = 'Close icon';
  searchBox.append(closeButton);

  const searchResults = document.createElement('div');
  searchResults.id = 'searchResults';
  searchResults.classList.add('search-results', 'hidden');
  searchBlock.append(searchResults);

  const popularSuggestionsH4 = document.createElement('h4');
  popularSuggestionsH4.classList.add('resultList');
  popularSuggestionsH4.textContent = 'Popular Suggestions';
  searchResults.append(popularSuggestionsH4);

  const suggestionsList = document.createElement('ul');
  suggestionsList.id = 'suggestionsList';
  searchResults.append(suggestionsList);

  const pagesH4 = document.createElement('h4');
  pagesH4.classList.add('resultList');
  pagesH4.textContent = 'Pages';
  searchResults.append(pagesH4);

  const productsList = document.createElement('ul');
  productsList.id = 'productsList';
  productsList.classList.add('products');
  searchResults.append(productsList);

  const viewAllButton = document.createElement('button');
  viewAllButton.id = 'viewAllButton';
  viewAllButton.textContent = 'VIEW ALL ITEMS';
  searchResults.append(viewAllButton);

  const searchIconLink = document.createElement('a');
  searchIconLink.classList.add('nav-link');
  itcHeaderIconList.append(searchIconLink);

  const searchIconImg = document.createElement('img');
  searchIconImg.loading = 'lazy';
  searchIconImg.id = 'searchIcon';
  searchIconImg.src = '/content/dam/aemigrate/uploaded-folder/image/search-icon.png';
  searchIconImg.alt = 'Search icon';
  searchIconLink.append(searchIconImg);

  const searchIconSpan = document.createElement('span');
  searchIconSpan.classList.add('d-block');
  searchIconSpan.textContent = 'Search';
  searchIconLink.append(searchIconSpan);

  // Event listener for search icon to toggle search block visibility
  searchIconLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default link behavior
    searchBlock.classList.toggle('hidden');
    searchContainer.classList.toggle('hidden');
    searchResults.classList.add('hidden'); // Ensure results are hidden on first open
  });

  closeButton.addEventListener('click', () => {
    searchBlock.classList.add('hidden');
    searchContainer.classList.add('hidden');
    searchResults.classList.add('hidden');
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
