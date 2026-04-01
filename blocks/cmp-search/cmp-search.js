import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const infoDiv = document.createElement('div');
  infoDiv.classList.add('cmp-search__info'); // Corrected class name
  infoDiv.setAttribute('aria-live', 'polite');
  infoDiv.setAttribute('role', 'status');
  block.append(infoDiv);

  const form = document.createElement('form');
  form.classList.add('cmp-search__form');
  form.setAttribute('data-cmp-hook-search', 'form');
  form.setAttribute('method', 'get');
  form.setAttribute('action', '/content/itc-foods-brands/aashirvaad/us/en.customsearchresults.json/_jcr_content/root/search');
  form.setAttribute('autocomplete', 'off');
  block.append(form);

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
  input.setAttribute('placeholder', block.getAttribute('data-input-placeholder') || 'Search');
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
  block.append(resultsDiv);

  const itemTemplateScript = document.createElement('script');
  itemTemplateScript.setAttribute('data-cmp-hook-search', 'itemTemplate');
  itemTemplateScript.setAttribute('type', 'x-template');

  const itemLink = document.createElement('a');
  itemLink.classList.add('cmp-search__item');
  itemLink.setAttribute('data-cmp-hook-search', 'item');
  itemLink.setAttribute('role', 'option');
  itemLink.setAttribute('aria-selected', 'false');

  const itemTitleSpan = document.createElement('span');
  itemTitleSpan.classList.add('cmp-search__item-title');
  itemTitleSpan.setAttribute('data-cmp-hook-search', 'itemTitle');
  itemLink.append(itemTitleSpan);

  itemTemplateScript.append(itemLink);
  block.append(itemTemplateScript);

  // Handle existing items from the block
  const itemRows = [...block.children].filter(
    (row) => row.children.length === 2 && row.querySelector('a') && !row.querySelector('img'),
  );

  itemRows.forEach((row) => {
    const linkCell = row.children[0];
    const titleCell = row.children[1];

    const existingLink = linkCell.querySelector('a');
    const link = document.createElement('a');
    link.classList.add('cmp-search__item');
    link.setAttribute('data-cmp-hook-search', 'item');
    link.setAttribute('role', 'option');
    link.setAttribute('aria-selected', 'false');
    if (existingLink) {
      link.href = existingLink.href;
      link.textContent = existingLink.textContent;
    }

    const titleSpan = document.createElement('span');
    titleSpan.classList.add('cmp-search__item-title');
    titleSpan.setAttribute('data-cmp-hook-search', 'itemTitle');
    titleSpan.textContent = titleCell.textContent;

    link.prepend(titleSpan); // Prepend title to link as per template

    moveInstrumentation(row, link);
    resultsDiv.append(link);
    row.remove(); // Remove original row after processing
  });

  // Event listeners for interactive behavior
  clearButton.addEventListener('click', () => {
    input.value = '';
    resultsDiv.innerHTML = '';
    resultsDiv.classList.remove('show');
  });

  input.addEventListener('input', () => {
    if (input.value.length >= parseInt(block.dataset.cmpMinLength, 10) || 3) {
      // Simulate search results (replace with actual search logic)
      resultsDiv.innerHTML = '';
      const numResults = window.innerWidth > 768 ? parseInt(block.dataset.cmpResultsDesktopSize, 10) || 8 : parseInt(block.dataset.cmpResultsMobileSize, 10) || 5;
      for (let i = 0; i < numResults; i += 1) {
        const resultItem = itemLink.cloneNode(true);
        resultItem.querySelector('[data-cmp-hook-search="itemTitle"]').textContent = `${input.value} Result ${i + 1}`;
        resultItem.href = `/search-result-${i + 1}.html`;
        resultsDiv.append(resultItem);
      }
      resultsDiv.classList.add('show');
    } else {
      resultsDiv.classList.remove('show');
    }
  });

  // Optimization for images, if any were to be added dynamically
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
