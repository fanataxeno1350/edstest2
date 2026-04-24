import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    minLengthCell,
    resultsDesktopSizeCell,
    resultsMobileSizeCell,
    inputPlaceholderCell,
    noResultsTitleCell,
    noResultsDescriptionCell,
    ...categoryItemRows
  ] = [...block.children];

  const minLength = minLengthCell?.textContent.trim();
  const resultsDesktopSize = resultsDesktopSizeCell?.textContent.trim();
  const resultsMobileSize = resultsMobileSizeCell?.textContent.trim();
  const inputPlaceholder = inputPlaceholderCell?.textContent.trim();
  const noResultsTitle = noResultsTitleCell?.textContent.trim();
  const noResultsDescription = noResultsDescriptionCell?.textContent.trim();

  // Create the main section element
  const section = document.createElement('section');
  section.classList.add('cmp-search');
  section.setAttribute('role', 'search');

  // Set data attributes from block fields
  if (minLength) {
    section.setAttribute('data-cmp-min-length', minLength);
  }
  if (resultsDesktopSize) {
    section.setAttribute('data-cmp-results-desktop-size', resultsDesktopSize);
  }
  if (resultsMobileSize) {
    section.setAttribute('data-cmp-results-mobile-size', resultsMobileSize);
  }
  if (inputPlaceholder) {
    section.setAttribute('data-input-placeholder', inputPlaceholder);
  }

  // Build the error response JSON
  const errorResponse = {
    noResultsTitle: noResultsTitle || '',
    noResultsDescription: noResultsDescription || '',
    categories: [],
  };

  categoryItemRows.forEach((row) => {
    const [categoryNameCell, categoryUrlCell] = [...row.children];
    const categoryName = categoryNameCell?.textContent.trim();
    const categoryUrl = categoryUrlCell?.querySelector('a')?.href;
    if (categoryName && categoryUrl) {
      errorResponse.categories.push({
        categoryName,
        categoryURL: categoryUrl,
      });
    }
    moveInstrumentation(row, section); // Move instrumentation for item rows to the section
  });

  section.setAttribute('data-error-response', JSON.stringify(errorResponse));

  // Create cmp_search__info div
  const infoDiv = document.createElement('div');
  infoDiv.classList.add('cmp_search__info');
  infoDiv.setAttribute('aria-live', 'polite');
  infoDiv.setAttribute('role', 'status');
  section.append(infoDiv);

  // Create cmp-search__form
  const form = document.createElement('form');
  form.classList.add('cmp-search__form');
  form.setAttribute('data-cmp-hook-search', 'form');
  form.setAttribute('method', 'get');
  form.setAttribute('action', '/content/itc-foods-brands/dark-fantasy/us/en/home.customsearchresults.json/_jcr_content/root/search'); // Hardcoded as per original
  form.setAttribute('autocomplete', 'off');
  section.append(form);

  // Create hidden input
  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('id', 'searchroot');
  hiddenInput.setAttribute('name', 'searchroot');
  hiddenInput.setAttribute('value', '/content/itc-foods-brands/dark-fantasy/us/en'); // Hardcoded as per original
  form.append(hiddenInput);

  // Create cmp-search__field div
  const fieldDiv = document.createElement('div');
  fieldDiv.classList.add('cmp-search__field');
  form.append(fieldDiv);

  // Create search icon
  const icon = document.createElement('i');
  icon.classList.add('cmp-search__icon');
  icon.setAttribute('data-cmp-hook-search', 'icon');
  fieldDiv.append(icon);

  // Create loading indicator
  const loadingIndicator = document.createElement('span');
  loadingIndicator.classList.add('cmp-search__loading-indicator');
  loadingIndicator.setAttribute('data-cmp-hook-search', 'loadingIndicator');
  fieldDiv.append(loadingIndicator);

  // Create search input
  const searchInput = document.createElement('input');
  searchInput.classList.add('cmp-search__input');
  searchInput.setAttribute('data-cmp-hook-search', 'input');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('name', 'fulltext');
  searchInput.setAttribute('placeholder', inputPlaceholder || 'Search');
  searchInput.setAttribute('role', 'combobox');
  searchInput.setAttribute('aria-autocomplete', 'list');
  searchInput.setAttribute('aria-haspopup', 'true');
  searchInput.setAttribute('aria-invalid', 'false');
  searchInput.setAttribute('aria-expanded', 'false');
  searchInput.setAttribute('aria-owns', 'cmp-search-results-0');
  fieldDiv.append(searchInput);

  // Create clear button
  const clearButton = document.createElement('button');
  clearButton.classList.add('cmp-search__clear');
  clearButton.setAttribute('data-cmp-hook-search', 'clear');
  clearButton.setAttribute('aria-label', 'Clear');
  fieldDiv.append(clearButton);

  // Create clear icon inside button
  const clearIcon = document.createElement('i');
  clearIcon.classList.add('cmp-search__clear-icon');
  clearButton.append(clearIcon);

  // Create cmp-search__results div
  const resultsDiv = document.createElement('div');
  resultsDiv.classList.add('cmp-search__results');
  resultsDiv.setAttribute('aria-label', 'Search results');
  resultsDiv.setAttribute('data-cmp-hook-search', 'results');
  resultsDiv.setAttribute('role', 'listbox');
  resultsDiv.setAttribute('aria-multiselectable', 'false');
  resultsDiv.setAttribute('id', 'cmp-search-results-0');
  section.append(resultsDiv);

  // Create script for itemTemplate
  const itemTemplateScript = document.createElement('script');
  itemTemplateScript.setAttribute('data-cmp-hook-search', 'itemTemplate');
  itemTemplateScript.setAttribute('type', 'x-template');
  itemTemplateScript.innerHTML = `
    <a class="cmp-search__item" data-cmp-hook-search="item" role="option" aria-selected="false">
        <span class="cmp-search__item-title" data-cmp-hook-search="itemTitle"></span>
    </a>
  `;
  section.append(itemTemplateScript);

  // Move instrumentation from the original block to the new section
  moveInstrumentation(block, section);

  // Replace the original block with the new section
  block.replaceWith(section);
}
