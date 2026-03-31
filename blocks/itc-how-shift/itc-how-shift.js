import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    mainImageRow,
    headingRow,
    subheadingRow,
    descriptionRow,
    whyShiftItemsContainerRow, // This is the container row for why-shift-items
    buttonLinkRow,
    buttonLabelRow,
    ...itemRows // These are the actual why-shift-item rows
  ] = [...block.children];

  // Main container
  block.classList.add('itc-how-shift');

  // Left Image Div
  const leftImageDiv = document.createElement('div');
  leftImageDiv.classList.add('left-image-div');
  moveInstrumentation(mainImageRow, leftImageDiv);
  const mainPicture = mainImageRow.querySelector('picture');
  if (mainPicture) {
    leftImageDiv.append(mainPicture);
  }

  // Right Content Container
  const rightContentContainer = document.createElement('div');
  rightContentContainer.classList.add('container', 'read-more');

  // Heading
  const heading = document.createElement('h1');
  heading.classList.add('text-center', 'pb-4', 'rs-heading');
  moveInstrumentation(headingRow, heading);
  while (headingRow.firstChild) heading.append(headingRow.firstChild);
  rightContentContainer.append(heading);

  // Subheading and Description
  const readMoreTextDiv = document.createElement('div');
  readMoreTextDiv.classList.add('read-more-text');
  moveInstrumentation(subheadingRow, readMoreTextDiv);
  while (subheadingRow.firstChild) readMoreTextDiv.append(subheadingRow.firstChild);
  moveInstrumentation(descriptionRow, readMoreTextDiv);
  while (descriptionRow.firstChild) readMoreTextDiv.append(descriptionRow.firstChild);
  rightContentContainer.append(readMoreTextDiv);

  const readMoreSpan = document.createElement('span');
  readMoreSpan.classList.add('readMore');
  rightContentContainer.append(readMoreSpan);

  // Why Shift Items Wrapper
  const whyShiftWrapper = document.createElement('div');
  whyShiftWrapper.classList.add('d-flex', 'justify-content-evenly', 'flex-wrap', 'why-shift-wrapper');
  // Instrument the container row for why-shift-items, not the individual item rows
  moveInstrumentation(whyShiftItemsContainerRow, whyShiftWrapper); 

  itemRows.forEach((row) => {
    // Each item row has 3 cells: Image, Link, Label
    const [imageCell, linkCell, labelCell] = [...row.children];

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('mb-md-0', 'mb-3', 'text-center');
    moveInstrumentation(row, itemDiv);

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('itc-health-goal-wrapper');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      imageWrapper.append(picture);
    }
    itemDiv.append(imageWrapper);

    const linkEl = document.createElement('a');
    linkEl.classList.add('text-center', 'd-block', 'text-capitalize', 'pt-2', 'image-label');

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      // The alt attribute on <a> in original HTML is for the link itself, not the image.
      // The label content will be appended to the link.
      linkEl.alt = foundLink.textContent; 
    }

    const labelP = labelCell.querySelector('p');
    if (labelP) {
      linkEl.innerHTML = labelP.innerHTML; // Use innerHTML to preserve any rich text in the label
    }
    itemDiv.append(linkEl);
    whyShiftWrapper.append(itemDiv); // Append itemDiv to whyShiftWrapper
  });
  rightContentContainer.append(whyShiftWrapper); // Append whyShiftWrapper to rightContentContainer

  const mobileSpacer = document.createElement('div');
  mobileSpacer.classList.add('d-md-none', 'd-block');
  rightContentContainer.append(mobileSpacer);

  // Button
  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'how-shift-button');

  const buttonA = document.createElement('a');
  buttonA.classList.add('cmp-button');
  moveInstrumentation(buttonLinkRow, buttonA);
  const foundButtonLink = buttonLinkRow.querySelector('a');
  if (foundButtonLink) {
    buttonA.href = foundButtonLink.href;
    buttonA.alt = foundButtonLink.textContent;
    // Check for target="_blank" from original HTML
    if (foundButtonLink.target === '_blank') {
      buttonA.target = '_blank';
    }
  }

  const buttonSpanText = document.createElement('span');
  buttonSpanText.classList.add('cmp-button__text');
  moveInstrumentation(buttonLabelRow, buttonSpanText);
  while (buttonLabelRow.firstChild) buttonSpanText.append(buttonLabelRow.firstChild);
  buttonA.append(buttonSpanText);

  const screenReaderSpan = document.createElement('span');
  screenReaderSpan.classList.add('cmp-link__screen-reader-only');
  screenReaderSpan.textContent = 'opens in a new tab';
  buttonA.append(screenReaderSpan);

  buttonDiv.append(buttonA);
  rightContentContainer.append(buttonDiv);

  block.textContent = '';
  block.append(leftImageDiv, rightContentContainer);

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Interactivity: Read More functionality
  const readMoreButton = rightContentContainer.querySelector('.readMore');
  if (readMoreButton) {
    readMoreButton.addEventListener('click', () => {
      readMoreTextDiv.classList.toggle('expanded'); // Toggle a class to expand/collapse
      if (readMoreTextDiv.classList.contains('expanded')) {
        readMoreButton.textContent = 'Read Less'; // Or change icon
      } else {
        readMoreButton.textContent = 'Read More'; // Or change icon
      }
    });
    // Initialize text for readMore button based on initial state (if any)
    readMoreButton.textContent = 'Read More'; 
  }
}
