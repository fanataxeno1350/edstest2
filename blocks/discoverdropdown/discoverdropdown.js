import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The model has 4 root fields: title, options (container), buttonLink, buttonLabel
  // The block.children array will have:
  // [0] -> titleRow
  // [1] -> buttonLinkRow
  // [2] -> buttonLabelRow
  // [3...] -> optionRows
  // The order in block.children is determined by the order of fields in the BlockJson model,
  // with container items appended at the end.
  const allRows = [...block.children];

  // Read root fields based on their position in the BlockJson model
  const titleRow = allRows[0];
  const buttonLinkRow = allRows[1]; // This is the buttonLink row, not the buttonLabel
  const buttonLabelRow = allRows[2]; // This is the buttonLabel row

  // Option rows start from index 3
  const optionRows = allRows.slice(3);

  const dropdownTitle = titleRow.querySelector('div').textContent.trim();
  // buttonLink is type=aem-content, so read href
  const buttonLink = buttonLinkRow.querySelector('a')?.href || '#';
  const buttonLabel = buttonLabelRow.querySelector('div').textContent.trim();

  block.innerHTML = ''; // Clear the block content

  const cmpDropdown = document.createElement('div');
  cmpDropdown.classList.add('cmp-dropdown');
  cmpDropdown.setAttribute('data-component', 'dropdown');

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content', 'right-dropdown-title-aligned');

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('cmp-dropdown__title');
  const titleH4 = document.createElement('h4');
  titleH4.textContent = dropdownTitle;
  titleDiv.append(titleH4);
  moveInstrumentation(titleRow, titleH4); // Move instrumentation from original title row

  const customSelectDiv = document.createElement('div');
  customSelectDiv.classList.add('cmp-dropdown__custom-select');

  const selectElement = document.createElement('select');

  const selectSelectedDiv = document.createElement('div');
  selectSelectedDiv.classList.add('cmp-dropdown__select-selected');

  const selectItemsDiv = document.createElement('div');
  selectItemsDiv.classList.add('cmp-dropdown__select-items', 'cmp-dropdown__select-hide');

  let firstOptionLink = '';
  let firstOptionLabel = '';

  optionRows.forEach((row, index) => {
    // For item rows, use content detection or destructuring if structure is fixed
    // BlockJson model for dropdown-option: [label (text), link (aem-content)]
    const cells = [...row.children];
    const optionLabelCell = cells[0]; // label is the first cell
    const optionLinkCell = cells[1]; // link is the second cell

    const optionLabel = optionLabelCell.textContent.trim();
    const optionLink = optionLinkCell.querySelector('a')?.href || '#'; // aem-content type

    if (index === 0) {
      firstOptionLink = optionLink;
      firstOptionLabel = optionLabel;
      selectSelectedDiv.textContent = optionLabel;
      selectSelectedDiv.setAttribute('data-selected', optionLabel);
    }

    const optionElement = document.createElement('option');
    optionElement.setAttribute('data-link', optionLink);
    optionElement.value = optionLabel;
    optionElement.textContent = optionLabel;
    selectElement.append(optionElement);

    const selectItemDiv = document.createElement('div');
    selectItemDiv.textContent = optionLabel;
    selectItemsDiv.append(selectItemDiv);

    moveInstrumentation(row, selectItemDiv); // Move instrumentation from original option row
  });

  customSelectDiv.append(selectElement, selectSelectedDiv, selectItemsDiv);

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--primary-anchor');

  const buttonAnchor = document.createElement('a');
  buttonAnchor.classList.add('cmp-button');
  buttonAnchor.href = firstOptionLink; // Set initial button link to the first option's link

  const buttonSpan = document.createElement('span');
  buttonSpan.classList.add('cmp-button__text');
  buttonSpan.textContent = buttonLabel;
  buttonAnchor.append(buttonSpan);
  buttonDiv.append(buttonAnchor);
  moveInstrumentation(buttonLinkRow, buttonAnchor); // Move instrumentation from original button link row
  moveInstrumentation(buttonLabelRow, buttonSpan); // Move instrumentation from original button label row

  contentDiv.append(titleDiv, customSelectDiv, buttonDiv);
  cmpDropdown.append(contentDiv);
  block.append(cmpDropdown);

  // Add event listeners for custom select behavior
  selectSelectedDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    selectItemsDiv.classList.toggle('cmp-dropdown__select-hide');
    selectSelectedDiv.classList.toggle('select-arrow-active');
  });

  selectItemsDiv.querySelectorAll('div').forEach((item) => {
    item.addEventListener('click', () => {
      const selectedText = item.textContent;
      selectSelectedDiv.textContent = selectedText;
      selectSelectedDiv.setAttribute('data-selected', selectedText);
      selectItemsDiv.classList.add('cmp-dropdown__select-hide');
      selectSelectedDiv.classList.remove('select-arrow-active');

      // Update the button's href based on the selected option
      const selectedOption = selectElement.querySelector(`option[value="${selectedText}"]`);
      if (selectedOption) {
        buttonAnchor.href = selectedOption.getAttribute('data-link');
      }
    });
  });

  document.addEventListener('click', () => {
    selectItemsDiv.classList.add('cmp-dropdown__select-hide');
    selectSelectedDiv.classList.remove('select-arrow-active');
  });
}
