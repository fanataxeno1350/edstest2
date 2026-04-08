import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use content detection instead of direct index access for robustness
  const rows = [...block.children];

  const iconRow = rows.find((row) => row.querySelector('picture') && row.textContent.trim() === ''); // Assuming icon row only has picture
  const searchTermRow = rows.find((row) => row.textContent.trim() === 'Search Term value'); // Based on example content
  const placeholderRow = rows.find((row) => row.textContent.trim() === 'Placeholder value'); // Based on example content
  const clearLabelRow = rows.find((row) => row.textContent.trim() === 'Clear Label value'); // Based on example content
  const closeIconRow = rows.find((row) => row.querySelector('picture') && row.textContent.trim() !== ''); // Assuming close icon row has picture and some text, or just picture
  const closeLabelRow = rows.find((row) => row.textContent.trim() === 'Close Label value'); // Based on example content

  const form = document.createElement('form');
  form.action = '/search-results';
  form.method = 'post';
  form.style.fontFamily = 'Gilroy, sans-serif !important';

  const mainSearchBar = document.createElement('div');
  mainSearchBar.id = 'MainSiteSearchBar';
  mainSearchBar.classList.add('mainSearchBar-mssd', 'd-none-thar', 'w-100-thar');
  mainSearchBar.style.fontFamily = 'Gilroy, sans-serif !important';

  const innerDiv = document.createElement('div');
  innerDiv.classList.add('p-md-30-mssd', 'p-sm-15-mssd', 'bb-search-mssd', 'd-flex-thar', 'align-items-center-thar', 'justify-content-between-thar');
  innerDiv.style.fontFamily = 'Gilroy, sans-serif !important';

  const leftSection = document.createElement('div');
  leftSection.classList.add('w-100-thar', 'd-flex-thar', 'align-items-center-thar');
  leftSection.style.fontFamily = 'Gilroy, sans-serif !important';

  if (iconRow) {
    const iconPicture = iconRow.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '32' }]);
      moveInstrumentation(iconPicture, optimizedPic);
      leftSection.append(optimizedPic);
    }
  }

  const searchInput = document.createElement('input');
  searchInput.tabIndex = 0;
  searchInput.id = 'MainSiteSearchInput';
  searchInput.classList.add('w-100-thar', 'search-inp-op', 'search-query-mssd-md', 'search-query-mssd-sm');
  searchInput.type = 'search';
  searchInput.name = 'searchTerm';
  searchInput.setAttribute('aria-label', placeholderRow ? placeholderRow.textContent.trim() : 'Search');
  searchInput.autocomplete = 'off';
  searchInput.setAttribute('data-module', 'autosuggest');
  searchInput.setAttribute('data-autosuggest-endpoint', '/data/GetPepsicoSearchAutoSuggest');
  searchInput.setAttribute('data-current-culture', 'en-IN');
  searchInput.setAttribute('data-results-type', 'autoSuggest');
  searchInput.setAttribute('data-results-page', '/search-results');
  searchInput.style.fontFamily = 'Gilroy, sans-serif !important';
  searchInput.placeholder = placeholderRow ? placeholderRow.textContent.trim() : 'Search';
  if (searchTermRow && searchTermRow.textContent.trim()) {
    searchInput.value = searchTermRow.textContent.trim();
  }

  leftSection.append(searchInput);

  const autoSuggestList = document.createElement('ul');
  autoSuggestList.classList.add('mainSiteSearchList', 'ui-autocomplete', 'ui-autocomplete--in-page-search', 'hidden');
  autoSuggestList.tabIndex = 0;
  autoSuggestList.style.fontFamily = 'Gilroy, sans-serif !important';
  leftSection.append(autoSuggestList);

  innerDiv.append(leftSection);

  const rightSection = document.createElement('div');
  rightSection.classList.add('d-flex-thar', 'align-items-center-thar', 'mr-lg-50-mssd');
  rightSection.style.fontFamily = 'Gilroy, sans-serif !important';

  const clearButton = document.createElement('button');
  clearButton.id = 'MainSiteSearchClear';
  clearButton.type = 'reset';
  clearButton.classList.add('search-clear-md', 'search-clear-sm', 'd-none-thar');
  clearButton.setAttribute('aria-label', clearLabelRow ? clearLabelRow.textContent.trim() : 'Clear');
  clearButton.tabIndex = 0;
  clearButton.style.fontFamily = 'Gilroy, sans-serif !important';
  clearButton.textContent = clearLabelRow ? clearLabelRow.textContent.trim() : 'Clear';
  rightSection.append(clearButton);

  const closeSection = document.createElement('div');
  closeSection.classList.add('d-flex-thar');
  closeSection.style.fontFamily = 'Gilroy, sans-serif !important';

  const divider = document.createElement('div');
  divider.classList.add('search-clear-divider-md', 'search-clear-divider-sm');
  divider.style.fontFamily = 'Gilroy, sans-serif !important';
  closeSection.append(divider);

  const closeButtonWrapper = document.createElement('div');
  closeButtonWrapper.classList.add('d-flex-thar', 'align-items-center-thar');
  closeButtonWrapper.style.fontFamily = 'Gilroy, sans-serif !important';

  const closeButton = document.createElement('button');
  closeButton.tabIndex = 0;
  closeButton.id = 'MainSiteSearchClose';
  closeButton.type = 'button';
  closeButton.classList.add('d-flex-thar', 'search-close-mssd', 'my-auto-thar');
  closeButton.setAttribute('aria-label', closeLabelRow ? closeLabelRow.textContent.trim() : 'Close');
  closeButton.style.fontFamily = 'Gilroy, sans-serif !important';

  const closeLabelSpan = document.createElement('span');
  closeLabelSpan.classList.add('d-block-op', 'd-none-sm-op', 'mr-md-10-mssd', 'my-auto-thar');
  closeLabelSpan.style.fontFamily = 'Gilroy, sans-serif !important';
  closeLabelSpan.textContent = closeLabelRow ? closeLabelRow.textContent.trim() : 'Close';
  closeButton.append(closeLabelSpan);

  if (closeIconRow) {
    const closeIconPicture = closeIconRow.querySelector('picture');
    if (closeIconPicture) {
      const closeIconImg = closeIconPicture.querySelector('img');
      const optimizedClosePic = createOptimizedPicture(closeIconImg.src, closeIconImg.alt, false, [{ width: '32' }]);
      moveInstrumentation(closeIconPicture, optimizedClosePic);
      closeButton.append(optimizedClosePic);
    }
  }

  closeButtonWrapper.append(closeButton);
  closeSection.append(closeButtonWrapper);
  rightSection.append(closeSection);
  innerDiv.append(rightSection);
  mainSearchBar.append(innerDiv);
  form.append(mainSearchBar);

  block.textContent = '';
  block.append(form);

  // Event Listeners for interactive behavior
  const toggleSearchBar = () => {
    mainSearchBar.classList.toggle('d-none-thar');
  };

  const clearSearch = () => {
    searchInput.value = '';
    clearButton.classList.add('d-none-thar');
  };

  const handleSearchInput = () => {
    if (searchInput.value.length > 0) {
      clearButton.classList.remove('d-none-thar');
    } else {
      clearButton.classList.add('d-none-thar');
    }
  };

  closeButton.addEventListener('click', toggleSearchBar);
  clearButton.addEventListener('click', clearSearch);
  searchInput.addEventListener('input', handleSearchInput);

  // Initial state check for clear button
  if (searchInput.value.length > 0) {
    clearButton.classList.remove('d-none-thar');
  }
}
