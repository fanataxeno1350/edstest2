import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const minLength = block.querySelector('[data-aue-prop="minLength"]')?.textContent || '3';
  const resultsDesktopSize = block.querySelector('[data-aue-prop="resultsDesktopSize"]')?.textContent || '8';
  const resultsMobileSize = block.querySelector('[data-aue-prop="resultsMobileSize"]')?.textContent || '5';
  const inputPlaceholder = block.querySelector('[data-aue-prop="inputPlaceholder"]')?.textContent || 'Start Typing...';
  const noResultsTitle = block.querySelector('[data-aue-prop="noResultsTitle"]')?.textContent || 'Sorry, we cannot find what you are looking for :(';
  const noResultsDescription = block.querySelector('[data-aue-prop="noResultsDescription"]')?.textContent || 'Please try a new search term or browse through one of our product categories.';

  const categories = [];
  block.querySelectorAll('[data-aue-model="category"]').forEach((categoryNode) => {
    const categoryName = categoryNode.querySelector('[data-aue-prop="categoryName"]')?.textContent || '';
    const categoryURL = categoryNode.querySelector('[data-aue-prop="categoryURL"]')?.textContent || '';
    if (categoryName && categoryURL) {
      categories.push({ categoryName, categoryURL });
    }
  });

  const errorResponse = {
    noResultsTitle,
    noResultsDescription,
    categories,
  };

  block.textContent = '';

  const section = document.createElement('section');
  section.id = `search-${Math.random().toString(36).substring(2, 11)}`; // Generate a unique ID
  section.className = 'search-cmp-search search-cmp-search';
  section.role = 'search';
  section.dataset.cmpMinLength = minLength;
  section.dataset.cmpResultsDesktopSize = resultsDesktopSize;
  section.dataset.cmpResultsMobileSize = resultsMobileSize;
  section.dataset.errorResponse = JSON.stringify(errorResponse);
  section.dataset.inputPlaceholder = inputPlaceholder;

  const infoDiv = document.createElement('div');
  infoDiv.className = 'search-cmp_search__info search-cmp_search__info';
  infoDiv.ariaLive = 'polite';
  infoDiv.role = 'status';
  section.append(infoDiv);

  const form = document.createElement('form');
  form.className = 'search-cmp-search__form search-cmp-search__form';
  form.dataset.cmpHookSearch = 'form';
  form.method = 'get';
  form.action = '/content/itc-foods-brands/aashirvaad/us/en.customsearchresults.json/_jcr_content/root/search';
  form.autocomplete = 'off';

  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'hidden';
  hiddenInput.id = 'searchroot';
  hiddenInput.name = 'searchroot';
  hiddenInput.value = '/content/itc-foods-brands/aashirvaad/us/en';
  form.append(hiddenInput);

  const fieldDiv = document.createElement('div');
  fieldDiv.className = 'search-cmp-search__field search-cmp-search__field';

  const icon = document.createElement('i');
  icon.className = 'search-cmp-search__icon search-cmp-search__icon';
  icon.dataset.cmpHookSearch = 'icon';
  fieldDiv.append(icon);

  const loadingIndicator = document.createElement('span');
  loadingIndicator.className = 'search-cmp-search__loading-indicator search-cmp-search__loading-indicator';
  loadingIndicator.dataset.cmpHookSearch = 'loadingIndicator';
  fieldDiv.append(loadingIndicator);

  const input = document.createElement('input');
  input.className = 'search-cmp-search__input search-cmp-search__input';
  input.dataset.cmpHookSearch = 'input';
  input.type = 'text';
  input.name = 'fulltext';
  input.placeholder = inputPlaceholder;
  input.role = 'combobox';
  input.ariaAutocomplete = 'list';
  input.ariaHaspopup = 'true';
  input.ariaInvalid = 'false';
  input.ariaExpanded = 'false';
  input.ariaOwns = 'cmp-search-results-0';
  fieldDiv.append(input);

  const clearButton = document.createElement('button');
  clearButton.className = 'search-cmp-search__clear search-cmp-search__clear';
  clearButton.dataset.cmpHookSearch = 'clear';
  clearButton.ariaLabel = 'Clear';
  const clearIcon = document.createElement('i');
  clearIcon.className = 'search-cmp-search__clear-icon search-cmp-search__clear-icon';
  clearButton.append(clearIcon);
  fieldDiv.append(clearButton);

  form.append(fieldDiv);
  section.append(form);

  const resultsDiv = document.createElement('div');
  resultsDiv.className = 'search-cmp-search__results search-cmp-search__results';
  resultsDiv.ariaLabel = 'Search results';
  resultsDiv.dataset.cmpHookSearch = 'results';
  resultsDiv.role = 'listbox';
  resultsDiv.ariaMultiselectable = 'false';
  resultsDiv.id = 'cmp-search-results-0';
  section.append(resultsDiv);

  const scriptTemplate = document.createElement('script');
  scriptTemplate.dataset.cmpHookSearch = 'itemTemplate';
  scriptTemplate.type = 'x-template';
  scriptTemplate.textContent = `
  <a class="cmp-search__item search-cmp-search__item" data-cmp-hook-search="item" role="option" aria-selected="false">
      <span class="cmp-search__item-title search-cmp-search__item-title" data-cmp-hook-search="itemTitle"></span>
  </a>
`;
  section.append(scriptTemplate);

  block.append(section);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
