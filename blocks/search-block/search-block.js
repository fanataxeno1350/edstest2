import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, placeholderRow] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('elementor-element', 'elementor-element-18c7032', 'e-flex', 'e-con-boxed', 'e-con', 'e-child');

  const innerContainer = document.createElement('div');
  innerContainer.classList.add('e-con-inner');
  container.append(innerContainer);

  // Heading
  const headingWrapper = document.createElement('div');
  headingWrapper.classList.add('elementor-element', 'elementor-element-831a211', 'elementor-widget', 'elementor-widget-heading');
  moveInstrumentation(headingRow, headingWrapper);

  const headingWidgetContainer = document.createElement('div');
  headingWidgetContainer.classList.add('elementor-widget-container');
  headingWrapper.append(headingWidgetContainer);

  const heading = document.createElement('h2');
  heading.classList.add('elementor-heading-title', 'elementor-size-default');
  while (headingRow.firstChild) heading.append(headingRow.firstChild);
  headingWidgetContainer.append(heading);
  innerContainer.append(headingWrapper);

  // Search Form
  const searchWrapper = document.createElement('div');
  searchWrapper.classList.add('elementor-element', 'elementor-element-f572fed', 'elementor-widget__width-initial', 'elementor-widget-mobile__width-inherit', 'elementor-widget', 'elementor-widget-search');

  const searchWidgetContainer = document.createElement('div');
  searchWidgetContainer.classList.add('elementor-widget-container');
  searchWrapper.append(searchWidgetContainer);

  const searchEl = document.createElement('search');
  searchEl.classList.add('e-search');
  searchEl.setAttribute('role', 'search');
  searchWidgetContainer.append(searchEl);

  const form = document.createElement('form');
  form.classList.add('e-search-form');
  form.setAttribute('action', 'https://natarajofficial.com'); // Use actual action from original HTML
  form.setAttribute('method', 'get');
  searchEl.append(form);

  const searchId = 'f572fed'; // ID suffix from original HTML
  const label = document.createElement('label');
  label.classList.add('e-search-label');
  label.setAttribute('for', `search-${searchId}`); // Unique ID for label
  form.append(label);

  const screenOnlySpan = document.createElement('span');
  screenOnlySpan.classList.add('elementor-screen-only');
  screenOnlySpan.textContent = 'Search';
  label.append(screenOnlySpan);

  // Search icon image (from original HTML, assuming it's an SVG)
  const searchIcon = document.createElement('img');
  searchIcon.setAttribute('alt', 'svg file');
  searchIcon.setAttribute('src', '/content/dam/aemigrate/uploaded-folder/image/1774940660416.svg+xml'); // Placeholder src
  label.append(searchIcon);

  const inputWrapper = document.createElement('div');
  inputWrapper.classList.add('e-search-input-wrapper');
  form.append(inputWrapper);

  const input = document.createElement('input');
  input.classList.add('e-search-input');
  input.setAttribute('id', `search-${searchId}`); // Unique ID for input
  input.setAttribute('type', 'search');
  input.setAttribute('name', 's');
  input.setAttribute('value', '');
  input.setAttribute('autocomplete', 'on');
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', `results-${searchId}`); // Unique ID for results
  input.setAttribute('aria-haspopup', 'listbox');
  moveInstrumentation(placeholderRow, input);
  input.setAttribute('placeholder', placeholderRow.textContent.trim());
  inputWrapper.append(input);

  // Clear icon image (from original HTML, assuming it's an SVG)
  const clearIcon = document.createElement('img');
  clearIcon.setAttribute('alt', 'svg file');
  clearIcon.setAttribute('src', '/content/dam/aemigrate/uploaded-folder/image/1774940660451.svg+xml'); // Placeholder src
  inputWrapper.append(clearIcon);

  const output = document.createElement('output');
  output.classList.add('e-search-results-container', 'hide-loader');
  output.setAttribute('id', `results-${searchId}`); // Unique ID for output
  output.setAttribute('aria-live', 'polite');
  output.setAttribute('aria-atomic', 'true');
  output.setAttribute('aria-label', 'Results for search');
  output.setAttribute('tabindex', '0');
  inputWrapper.append(output);

  const resultsDiv = document.createElement('div');
  resultsDiv.classList.add('e-search-results');
  output.append(resultsDiv);

  const submitButton = document.createElement('button');
  submitButton.classList.add('e-search-submit', 'elementor-screen-only');
  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('aria-label', 'Search');
  form.append(submitButton);

  const hiddenInput = document.createElement('input');
  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', 'e_search_props');
  hiddenInput.setAttribute('value', 'f572fed-200');
  form.append(hiddenInput);

  innerContainer.append(searchWrapper);

  block.textContent = '';
  block.append(container);

  // --- Interactivity ---

  // Show/hide clear icon and results container based on input
  const toggleSearchElements = () => {
    if (input.value.length > 0) {
      clearIcon.style.display = 'block'; // Or add a class to show
      output.classList.remove('hide-loader'); // Show results container
      input.setAttribute('aria-expanded', 'true');
    } else {
      clearIcon.style.display = 'none'; // Or add a class to hide
      output.classList.add('hide-loader'); // Hide results container
      input.setAttribute('aria-expanded', 'false');
    }
  };

  // Event listener for input changes
  input.addEventListener('input', toggleSearchElements);

  // Event listener for focus to show results if there's text
  input.addEventListener('focus', () => {
    if (input.value.length > 0) {
      output.classList.remove('hide-loader');
      input.setAttribute('aria-expanded', 'true');
    }
  });

  // Event listener for blur to hide results (with a small delay to allow clicks on results)
  input.addEventListener('blur', () => {
    // A small delay to allow click events on results before hiding
    setTimeout(() => {
      if (!output.contains(document.activeElement)) { // Only hide if focus is not on results
        output.classList.add('hide-loader');
        input.setAttribute('aria-expanded', 'false');
      }
    }, 100);
  });

  // Event listener for clear icon click
  clearIcon.addEventListener('click', () => {
    input.value = '';
    input.focus(); // Keep focus on input after clearing
    toggleSearchElements(); // Update visibility
  });

  // Initial state setup
  toggleSearchElements();
}
