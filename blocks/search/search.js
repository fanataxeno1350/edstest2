import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    inputPlaceholderRow,
    minLengthRow,
    resultsDesktopSizeRow,
    resultsMobileSizeRow,
    errorNoResultsTitleRow,
    errorNoResultsDescriptionRow,
    ...categoryRows
  ] = [...block.children];

  const inputPlaceholder = inputPlaceholderRow?.querySelector('div')?.textContent.trim() || 'Search';
  const minLength = parseInt(minLengthRow?.querySelector('div')?.textContent.trim(), 10) || 3;
  const resultsDesktopSize = parseInt(resultsDesktopSizeRow?.querySelector('div')?.textContent.trim(), 10) || 8;
  const resultsMobileSize = parseInt(resultsMobileSizeRow?.querySelector('div')?.textContent.trim(), 10) || 5;
  const errorNoResultsTitle = errorNoResultsTitleRow?.querySelector('div')?.textContent.trim() || 'Sorry, we cannot find what you are looking for :(';
  const errorNoResultsDescription = errorNoResultsDescriptionRow?.querySelector('div')?.textContent.trim() || 'Please try a new search term or browse through one of our product categories.';

  const categories = categoryRows.map((row) => {
    const cells = [...row.children];
    let categoryName = '';
    let categoryURL = '';

    // Content detection to distinguish cells based on their content
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const nameCell = cells.find(cell => !cell.querySelector('a'));

    if (linkCell) {
      categoryURL = linkCell.querySelector('a').href;
    }
    if (nameCell) {
      categoryName = nameCell.textContent.trim();
    }
    return { categoryName, categoryURL };
  });

  const errorResponse = {
    noResultsTitle: errorNoResultsTitle,
    noResultsDescription: errorNoResultsDescription,
    categories,
  };

  const section = document.createElement('section');
  section.classList.add('cmp-search');
  section.setAttribute('role', 'search');
  section.setAttribute('data-cmp-min-length', minLength);
  section.setAttribute('data-cmp-results-desktop-size', resultsDesktopSize);
  section.setAttribute('data-cmp-results-mobile-size', resultsMobileSize);
  section.setAttribute('data-error-response', JSON.stringify(errorResponse));
  section.setAttribute('data-input-placeholder', inputPlaceholder);

  const infoDiv = document.createElement('div');
  infoDiv.classList.add('cmp_search__info');
  infoDiv.setAttribute('aria-live', 'polite');
  infoDiv.setAttribute('role', 'status');
  section.append(infoDiv);

  const form = document.createElement('form');
  form.classList.add('cmp-search__form');
  form.setAttribute('data-cmp-hook-search', 'form');
  form.setAttribute('method', 'get');
  form.setAttribute('action', '/content/itc-foods-brands/aashirvaad/us/en.customsearchresults.json/_jcr_content/root/search');
  form.setAttribute('autocomplete', 'off');
  section.append(form);

  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('id', 'searchroot');
  hiddenInput.setAttribute('name', 'searchroot');
  hiddenInput.setAttribute('value', '/content/itc-foods-brands/aashirvaad/us/en');
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
  section.append(resultsDiv);

  const scriptTemplate = document.createElement('script');
  scriptTemplate.setAttribute('data-cmp-hook-search', 'itemTemplate');
  scriptTemplate.setAttribute('type', 'x-template');
  scriptTemplate.innerHTML = `
    <a class="cmp-search__item" data-cmp-hook-search="item" role="option" aria-selected="false">
        <span class="cmp-search__item-title" data-cmp-hook-search="itemTitle"></span>
    </a>
  `;
  section.append(scriptTemplate);

  block.textContent = '';
  block.append(section);
}
