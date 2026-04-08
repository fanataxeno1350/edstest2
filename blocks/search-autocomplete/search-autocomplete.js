import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [searchTermRow, ...suggestionRows] = [...block.children];

  block.classList.add('search-autocomplete');
  block.setAttribute('aria-label', 'Search Autocomplete Module');
  block.id = 'search-autocomplete';

  const overlay = document.createElement('div');
  overlay.classList.add('search-autocomplete--overlay');
  block.append(overlay);

  const closeButton = document.createElement('button');
  closeButton.classList.add('search-autocomplete--close');
  closeButton.setAttribute('aria-label', 'Close Search Overlay');
  block.append(closeButton);

  // The original HTML shows an img inside the close button.
  // We need to extract it from the block.children if it was authored there,
  // or assume it's part of the block's initial content if not explicitly mapped.
  // For this review, let's assume the image is part of the block's initial content
  // and not directly from a block row. If it were from a row, it would be
  // handled like other content. Given the original HTML, it's a static part.
  // The provided JS tries to find it using querySelector('img') on the button itself,
  // which implies it expects it to be there. Let's ensure it's handled correctly.
  // If the image is not coming from a block row, we need to ensure it's created
  // or moved from the original block content if it was present.
  // For now, let's assume the image is directly within the close button in the original HTML.
  // If the close button was part of the initial block content, we would move it.
  // Since the JS creates the button, we need to add the image to it.
  // Based on the original HTML, the image is `<img alt="svg file" src="/content/dam/aemigrate/uploaded-folder/image/1775635709593.svg+xml"/>`
  // This means the image needs to be created and appended.
  const closeImgSrc = '/content/dam/aemigrate/uploaded-folder/image/1775635709593.svg+xml';
  const closeImgAlt = 'svg file';
  const closeImg = document.createElement('img');
  closeImg.src = closeImgSrc;
  closeImg.alt = closeImgAlt;
  const optimizedPic = createOptimizedPicture(closeImg.src, closeImg.alt, false, [{ width: '32' }]);
  closeButton.append(optimizedPic); // Append the picture element directly

  const searchBlock = document.createElement('div');
  searchBlock.classList.add('search-autocomplete--block');
  block.append(searchBlock);

  const searchContainer = document.createElement('div');
  searchContainer.classList.add('search-autocomplete--container');
  searchBlock.append(searchContainer);

  const formPlaceholder = document.createElement('div');
  formPlaceholder.classList.add('search-autocomplete--form-placeholder');
  searchContainer.append(formPlaceholder);

  const viewsElementContainer = document.createElement('div');
  viewsElementContainer.classList.add('views-element-container');
  formPlaceholder.append(viewsElementContainer);

  const viewDomIdDiv = document.createElement('div');
  viewDomIdDiv.classList.add('js-view-dom-id-491c254d86a67df6d4d2ca04d9997429f9e6170cd5c3288cbcc065f8c7906cb7');
  viewsElementContainer.append(viewDomIdDiv);

  const searchForm = document.createElement('form');
  searchForm.classList.add('views-exposed-form');
  searchForm.setAttribute('data-drupal-selector', 'views-exposed-form-solr-search-block-1');
  searchForm.action = 'https://www.nescafe.com/in/search-results';
  searchForm.method = 'get';
  searchForm.id = 'views-exposed-form-solr-search-block-1';
  searchForm.setAttribute('accept-charset', 'UTF-8');
  viewDomIdDiv.append(searchForm);

  const formItem = document.createElement('div');
  formItem.classList.add('js-form-item', 'form-item', 'js-form-type-search-api-autocomplete', 'form-item-search-term', 'js-form-item-search-term', 'form-no-label');
  searchForm.append(formItem);

  const searchInput = document.createElement('input');
  searchInput.classList.add('form-autocomplete', 'form-text', 'ui-autocomplete-input');
  searchInput.setAttribute('data-drupal-selector', 'edit-search-term');
  searchInput.setAttribute('data-search-api-autocomplete-search', 'solr_search');
  searchInput.type = 'text';
  searchInput.id = 'edit-search-term';
  searchInput.name = 'search_term';
  searchInput.size = '30';
  searchInput.maxLength = '128';
  searchInput.setAttribute('data-once', 'autocomplete search-api-autocomplete');
  searchInput.autocomplete = 'off';

  // Extract search term value from the first row
  const searchTermValue = searchTermRow.textContent.trim();
  searchInput.value = searchTermValue;
  moveInstrumentation(searchTermRow, searchInput); // Move instrumentation from searchTermRow to searchInput
  searchTermRow.remove(); // Remove the original row after moving its content/instrumentation

  formItem.append(searchInput);

  const refreshButton = document.createElement('button');
  refreshButton.type = 'button';
  refreshButton.classList.add('refresh-search-input-icon');
  refreshButton.setAttribute('aria-label', 'Clear Search');
  formItem.append(refreshButton);

  const formActions = document.createElement('div');
  formActions.classList.add('form-actions', 'js-form-wrapper', 'form-wrapper');
  formActions.id = 'edit-actions';
  searchForm.append(formActions);

  const submitButton = document.createElement('input');
  submitButton.disabled = true;
  submitButton.setAttribute('data-drupal-selector', 'edit-submit-solr-search');
  submitButton.type = 'submit';
  submitButton.id = 'edit-submit-solr-search';
  submitButton.value = 'Apply';
  submitButton.classList.add('button', 'js-form-submit', 'form-submit', 'is-disabled');
  formActions.append(submitButton);

  const trendPlaceholder = document.createElement('div');
  trendPlaceholder.classList.add('search-autocomplete--trend-placeholder');
  searchContainer.append(trendPlaceholder);

  const searchSuggestionSection = document.createElement('section');
  searchSuggestionSection.classList.add('grid-container', 'search-suggestion');
  searchSuggestionSection.setAttribute('aria-label', 'Search Suggestion Module');
  trendPlaceholder.append(searchSuggestionSection);

  const paddingXWrapper = document.createElement('div');
  paddingXWrapper.classList.add('padding-x', 'search-suggestion--wrapper');
  searchSuggestionSection.append(paddingXWrapper);

  const gridXContainer = document.createElement('div');
  gridXContainer.classList.add('grid-x', 'max-width-container');
  paddingXWrapper.append(gridXContainer);

  const suggestionCell = document.createElement('div');
  suggestionCell.classList.add('cell', 'small-12', 'large-offset-1', 'large-10', 'search-suggestion--cell');
  gridXContainer.append(suggestionCell);

  const titleSpan = document.createElement('span');
  titleSpan.classList.add('search-suggestion--title', 'utilityTagHighCaps', 'suggestion-item');
  titleSpan.textContent = 'Trending';
  suggestionCell.append(titleSpan);

  const suggestionList = document.createElement('ul');
  suggestionList.classList.add('search-suggestion--list');
  suggestionCell.append(suggestionList);

  suggestionRows.forEach((row) => {
    const listItem = document.createElement('li');
    moveInstrumentation(row, listItem);
    listItem.classList.add('search-suggestion--list-item', 'suggestion-item');

    const suggestionBlockDiv = document.createElement('div');
    suggestionBlockDiv.classList.add('search-suggestion--block');
    listItem.append(suggestionBlockDiv);

    const linkEl = document.createElement('a');
    linkEl.classList.add('search-suggestion--link');

    // Find link and label from cells using content detection, not index access
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('a')); // Assuming label is the other cell without a link

    if (linkCell) {
      const a = linkCell.querySelector('a');
      if (a) {
        linkEl.href = a.href;
      }
    }
    if (labelCell) {
      const labelSpan = document.createElement('span');
      labelSpan.classList.add('search-suggestion--label', 'bodyMediumRegular');
      labelSpan.textContent = labelCell.textContent.trim(); // Use cell text content for label
      linkEl.append(labelSpan);
    } else if (linkCell) { // Fallback if no explicit label cell, use link cell's text
      const labelSpan = document.createElement('span');
      labelSpan.classList.add('search-suggestion--label', 'bodyMediumRegular');
      labelSpan.textContent = linkCell.textContent.trim();
      linkEl.append(labelSpan);
    }

    suggestionBlockDiv.append(linkEl);
    suggestionList.append(listItem);
    row.remove(); // Remove the original row after processing
  });

  // Event Listeners for interactive behavior
  const openSearch = () => {
    block.classList.add('active');
    overlay.classList.add('active');
    closeButton.classList.add('active');
    formPlaceholder.classList.add('active');
    suggestionCell.classList.add('active');
    titleSpan.classList.add('active'); // Ensure title also gets active class
    suggestionList.querySelectorAll('.suggestion-item').forEach(item => item.classList.add('active'));
    searchInput.focus(); // Focus on the input when opened
  };

  const closeSearch = () => {
    block.classList.remove('active');
    overlay.classList.remove('active');
    closeButton.classList.remove('active');
    formPlaceholder.classList.remove('active');
    suggestionCell.classList.remove('active');
    titleSpan.classList.remove('active'); // Ensure title also removes active class
    suggestionList.querySelectorAll('.suggestion-item').forEach(item => item.classList.remove('active'));
    searchInput.value = ''; // Clear search input on close
  };

  closeButton.addEventListener('click', closeSearch);

  // Clear search input on refresh button click
  refreshButton.addEventListener('click', () => {
    searchInput.value = '';
    // Optionally trigger a search update or close suggestions
  });

  // Add event listener to open the search overlay when the search input is focused
  searchInput.addEventListener('focus', openSearch);
}
