import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const [
    minLengthRow,
    resultsDesktopSizeRow,
    resultsMobileSizeRow,
    inputPlaceholderRow,
    noResultsTitleRow,
    noResultsDescriptionRow,
    ...categoryRows
  ] = children;

  const minLength = minLengthRow.children[0].textContent.trim();
  const resultsDesktopSize = resultsDesktopSizeRow.children[0].textContent.trim();
  const resultsMobileSize = resultsMobileSizeRow.children[0].textContent.trim();
  const inputPlaceholder = inputPlaceholderRow.children[0].textContent.trim();
  const noResultsTitle = noResultsTitleRow.children[0].textContent.trim();
  const noResultsDescription = noResultsDescriptionRow.children[0].textContent.trim();

  const categories = categoryRows.map((row) => {
    const [categoryNameCell, categoryUrlCell] = [...row.children];
    const categoryName = categoryNameCell.textContent.trim();
    const categoryUrl = categoryUrlCell.querySelector('a')?.href || '';
    return { categoryName, categoryURL: categoryUrl };
  });

  const errorResponse = {
    noResultsTitle,
    noResultsDescription,
    categories,
  };

  block.setAttribute('role', 'search');
  block.setAttribute('data-cmp-min-length', minLength);
  block.setAttribute('data-cmp-results-desktop-size', resultsDesktopSize);
  block.setAttribute('data-cmp-results-mobile-size', resultsMobileSize);
  block.setAttribute('data-error-response', JSON.stringify(errorResponse));
  block.setAttribute('data-input-placeholder', inputPlaceholder);

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('cmp-search__info'); // Corrected class name
  infoDiv.setAttribute('aria-live', 'polite');
  infoDiv.setAttribute('role', 'status');
  moveInstrumentation(minLengthRow, infoDiv); // Move instrumentation from one of the initial rows

  const form = document.createElement('form');
  form.classList.add('cmp-search__form');
  form.setAttribute('data-cmp-hook-search', 'form');
  form.setAttribute('method', 'get');
  form.setAttribute('action', '/content/itc-foods-brands/dark-fantasy/us/en/home.customsearchresults.json/_jcr_content/root/search'); // Hardcoded as per original HTML
  form.setAttribute('autocomplete', 'off');
  moveInstrumentation(resultsDesktopSizeRow, form);

  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('id', 'searchroot');
  hiddenInput.setAttribute('name', 'searchroot');
  hiddenInput.setAttribute('value', '/content/itc-foods-brands/dark-fantasy/us/en'); // Hardcoded as per original HTML
  form.append(hiddenInput);

  const fieldDiv = document.createElement('div');
  fieldDiv.classList.add('cmp-search__field');
  form.append(fieldDiv);

  const icon = document.createElement('i');
  icon.classList.add('cmp-search__icon');
  icon.setAttribute('data-cmp-hook-search', 'icon');
  fieldDiv.append(icon);

  const loadingIndicator = document.createElement('span');
  loadingIndicator.classList.add('cmp-search__loading-indicator');
  loadingIndicator.setAttribute('data-cmp-hook-search', 'loadingIndicator');
  fieldDiv.append(loadingIndicator);

  const input = document.createElement('input');
  input.classList.add('cmp-search__input');
  input.setAttribute('data-cmp-hook-search', 'input');
  input.setAttribute('type', 'text');
  input.setAttribute('name', 'fulltext');
  input.setAttribute('placeholder', inputPlaceholder);
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-haspopup', 'true');
  input.setAttribute('aria-invalid', 'false');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-owns', 'cmp-search-results-0');
  fieldDiv.append(input);

  const clearButton = document.createElement('button');
  clearButton.classList.add('cmp-search__clear');
  clearButton.setAttribute('data-cmp-hook-search', 'clear');
  clearButton.setAttribute('aria-label', 'Clear');
  fieldDiv.append(clearButton);

  const clearIcon = document.createElement('i');
  clearIcon.classList.add('cmp-search__clear-icon');
  clearButton.append(clearIcon);

  const resultsDiv = document.createElement('div');
  resultsDiv.classList.add('cmp-search__results');
  resultsDiv.setAttribute('aria-label', 'Search results');
  resultsDiv.setAttribute('data-cmp-hook-search', 'results');
  resultsDiv.setAttribute('role', 'listbox');
  resultsDiv.setAttribute('aria-multiselectable', 'false');
  resultsDiv.setAttribute('id', 'cmp-search-results-0');
  moveInstrumentation(resultsMobileSizeRow, resultsDiv);

  const scriptTemplate = document.createElement('script');
  scriptTemplate.setAttribute('data-cmp-hook-search', 'itemTemplate');
  scriptTemplate.setAttribute('type', 'x-template');
  scriptTemplate.innerHTML = `
    <a class="cmp-search__item" data-cmp-hook-search="item" role="option" aria-selected="false">
        <span class="cmp-search__item-title" data-cmp-hook-search="itemTitle"></span>
    </a>
  `;
  moveInstrumentation(inputPlaceholderRow, scriptTemplate);

  // Clear existing content and append new structure
  block.innerHTML = '';
  block.append(infoDiv, form, resultsDiv, scriptTemplate);
}
