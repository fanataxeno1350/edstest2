import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    minLengthRow,
    resultsDesktopSizeRow,
    resultsMobileSizeRow,
    inputPlaceholderRow,
    noResultsTitleRow,
    noResultsDescriptionRow,
    ...categoryRows
  ] = [...block.children];

  const minLength = minLengthRow?.firstElementChild?.textContent.trim();
  const resultsDesktopSize = resultsDesktopSizeRow?.firstElementChild?.textContent.trim();
  const resultsMobileSize = resultsMobileSizeRow?.firstElementChild?.textContent.trim();
  const inputPlaceholder = inputPlaceholderRow?.firstElementChild?.textContent.trim();
  const noResultsTitle = noResultsTitleRow?.firstElementChild?.textContent.trim();
  const noResultsDescription = noResultsDescriptionRow?.firstElementChild?.textContent.trim();

  const categories = categoryRows.map((row) => {
    const [categoryNameCell, categoryURLCell] = [...row.children];
    const categoryName = categoryNameCell?.textContent.trim();
    const categoryURL = categoryURLCell?.querySelector('a')?.href;
    return { categoryName, categoryURL };
  });

  const errorResponse = {
    noResultsTitle,
    noResultsDescription,
    categories,
  };

  block.setAttribute('role', 'search');
  block.classList.add('cmp-search'); // Ensure block has base class
  if (minLength) {
    block.setAttribute('data-cmp-min-length', minLength);
  }
  if (resultsDesktopSize) {
    block.setAttribute('data-cmp-results-desktop-size', resultsDesktopSize);
  }
  if (resultsMobileSize) {
    block.setAttribute('data-cmp-results-mobile-size', resultsMobileSize);
  }
  if (inputPlaceholder) {
    block.setAttribute('data-input-placeholder', inputPlaceholder);
  }
  block.setAttribute('data-error-response', JSON.stringify(errorResponse));

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('cmp_search__info');
  infoDiv.setAttribute('aria-live', 'polite');
  infoDiv.setAttribute('role', 'status');
  moveInstrumentation(minLengthRow, infoDiv); // Use first fixed field row for instrumentation

  const form = document.createElement('form');
  form.classList.add('cmp-search__form');
  form.setAttribute('data-cmp-hook-search', 'form');
  form.setAttribute('method', 'get');
  form.setAttribute('action', '/content/itc-foods-brands/dark-fantasy/us/en/home.customsearchresults.json/_jcr_content/root/search'); // Hardcoded as per original
  form.setAttribute('autocomplete', 'off');
  moveInstrumentation(minLengthRow, form);

  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('id', 'searchroot');
  hiddenInput.setAttribute('name', 'searchroot');
  hiddenInput.setAttribute('value', '/content/itc-foods-brands/dark-fantasy/us/en'); // Hardcoded as per original
  form.appendChild(hiddenInput);

  const fieldDiv = document.createElement('div');
  fieldDiv.classList.add('cmp-search__field');
  form.appendChild(fieldDiv);

  const icon = document.createElement('i');
  icon.classList.add('cmp-search__icon');
  icon.setAttribute('data-cmp-hook-search', 'icon');
  fieldDiv.appendChild(icon);

  const loadingIndicator = document.createElement('span');
  loadingIndicator.classList.add('cmp-search__loading-indicator');
  loadingIndicator.setAttribute('data-cmp-hook-search', 'loadingIndicator');
  fieldDiv.appendChild(loadingIndicator);

  const input = document.createElement('input');
  input.classList.add('cmp-search__input');
  input.setAttribute('data-cmp-hook-search', 'input');
  input.setAttribute('type', 'text');
  input.setAttribute('name', 'fulltext');
  input.setAttribute('placeholder', inputPlaceholder || 'Search');
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-haspopup', 'true');
  input.setAttribute('aria-invalid', 'false');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-owns', 'cmp-search-results-0');
  fieldDiv.appendChild(input);

  const clearButton = document.createElement('button');
  clearButton.classList.add('cmp-search__clear');
  clearButton.setAttribute('data-cmp-hook-search', 'clear');
  clearButton.setAttribute('aria-label', 'Clear');
  fieldDiv.appendChild(clearButton);

  const clearIcon = document.createElement('i');
  clearIcon.classList.add('cmp-search__clear-icon');
  clearButton.appendChild(clearIcon);

  const resultsDiv = document.createElement('div');
  resultsDiv.classList.add('cmp-search__results');
  resultsDiv.setAttribute('aria-label', 'Search results');
  resultsDiv.setAttribute('data-cmp-hook-search', 'results');
  resultsDiv.setAttribute('role', 'listbox');
  resultsDiv.setAttribute('aria-multiselectable', 'false');
  resultsDiv.setAttribute('id', 'cmp-search-results-0');
  moveInstrumentation(minLengthRow, resultsDiv);

  const itemTemplateScript = document.createElement('script');
  itemTemplateScript.setAttribute('data-cmp-hook-search', 'itemTemplate');
  itemTemplateScript.setAttribute('type', 'x-template');
  itemTemplateScript.innerHTML = `
    <a class="cmp-search__item" data-cmp-hook-search="item" role="option" aria-selected="false">
        <span class="cmp-search__item-title" data-cmp-hook-search="itemTitle"></span>
    </a>
  `;
  moveInstrumentation(minLengthRow, itemTemplateScript);

  block.innerHTML = ''; // Clear original content
  block.append(infoDiv, form, resultsDiv, itemTemplateScript);

  // Add event listener for the clear button
  clearButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent form submission
    input.value = ''; // Clear the input field
    // Optionally, trigger a search update or hide results
    // For a full search component, you might dispatch a custom event here
    // or call a search function to clear results.
  });

  // Remove original rows as they have been processed
  [
    minLengthRow,
    resultsDesktopSizeRow,
    resultsMobileSizeRow,
    inputPlaceholderRow,
    noResultsTitleRow,
    noResultsDescriptionRow,
    ...categoryRows
  ].forEach(row => row.remove());
}
