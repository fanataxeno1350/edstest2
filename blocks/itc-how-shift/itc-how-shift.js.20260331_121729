import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    leftImageRow,
    headingRow,
    subtitleRow,
    descriptionRow,
    whyShiftItemsLabelRow, // This row contains "Why Shift Items value" and is not rendered directly.
    buttonLinkRow,
    buttonTextRow,
    ...itemRows
  ] = [...block.children];

  block.innerHTML = '';
  block.classList.add('itc-how-shift');

  // Left Image Div
  const leftImageDiv = document.createElement('div');
  leftImageDiv.classList.add('left-image-div');
  moveInstrumentation(leftImageRow, leftImageDiv);
  const picture = leftImageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      leftImageDiv.append(optimizedPic);
    }
  }
  block.append(leftImageDiv);

  // Container Read More
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'read-more');

  // Heading
  const heading = document.createElement('h1');
  heading.classList.add('text-center', 'pb-4', 'rs-heading');
  moveInstrumentation(headingRow, heading);
  heading.textContent = headingRow.textContent.trim();
  containerDiv.append(heading);

  // Subtitle and Description
  const readMoreTextDiv = document.createElement('div');
  readMoreTextDiv.classList.add('read-more-text');
  moveInstrumentation(subtitleRow, readMoreTextDiv);
  while (subtitleRow.firstChild) readMoreTextDiv.append(subtitleRow.firstChild);
  moveInstrumentation(descriptionRow, readMoreTextDiv);
  while (descriptionRow.firstChild) readMoreTextDiv.append(descriptionRow.firstChild);
  containerDiv.append(readMoreTextDiv);

  const readMoreSpan = document.createElement('span');
  readMoreSpan.classList.add('readMore');
  containerDiv.append(readMoreSpan);

  // Why Shift Items Wrapper
  const whyShiftWrapper = document.createElement('div');
  whyShiftWrapper.classList.add('d-flex', 'justify-content-evenly', 'flex-wrap', 'why-shift-wrapper');

  itemRows.forEach((row) => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('mb-md-0', 'mb-3', 'text-center');
    moveInstrumentation(row, itemDiv);

    const itcHealthGoalWrapper = document.createElement('div');
    itcHealthGoalWrapper.classList.add('itc-health-goal-wrapper');

    // Destructure item cells based on BlockJson: Image, Link, Label
    const [itemImageCell, itemLinkCell, itemLabelCell] = [...row.children];

    if (itemImageCell) {
      const pictureElement = itemImageCell.querySelector('picture');
      if (pictureElement) {
        const img = pictureElement.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          itcHealthGoalWrapper.append(optimizedPic);
        }
      }
    }
    itemDiv.append(itcHealthGoalWrapper);

    const itemLink = itemLinkCell ? itemLinkCell.querySelector('a') : null;

    if (itemLink && itemLabelCell) {
      const anchor = document.createElement('a');
      anchor.href = itemLink.href;
      anchor.alt = itemLink.textContent.trim();
      anchor.classList.add('text-center', 'd-block', 'text-capitalize', 'pt-2', 'image-label');
      moveInstrumentation(itemLabelCell, anchor);
      while (itemLabelCell.firstChild) anchor.append(itemLabelCell.firstChild);
      itemDiv.append(anchor);
    }
    whyShiftWrapper.append(itemDiv);
  });
  containerDiv.append(whyShiftWrapper);

  const dMdNoneDiv = document.createElement('div');
  dMdNoneDiv.classList.add('d-md-none', 'd-block');
  containerDiv.append(dMdNoneDiv);

  // Button
  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'how-shift-button');

  const buttonAnchor = document.createElement('a');
  buttonAnchor.classList.add('cmp-button');
  moveInstrumentation(buttonLinkRow, buttonAnchor);
  const foundButtonLink = buttonLinkRow.querySelector('a');
  if (foundButtonLink) {
    buttonAnchor.href = foundButtonLink.href;
    buttonAnchor.alt = foundButtonLink.textContent.trim();
  }

  const buttonSpanText = document.createElement('span');
  buttonSpanText.classList.add('cmp-button__text');
  moveInstrumentation(buttonTextRow, buttonSpanText);
  buttonSpanText.textContent = buttonTextRow.textContent.trim();
  buttonAnchor.append(buttonSpanText);

  // Screen reader only span for target blank (if applicable, assuming it's an external link)
  if (buttonAnchor.href && !buttonAnchor.href.startsWith(window.location.origin)) {
    buttonAnchor.target = '_blank';
    const screenReaderSpan = document.createElement('span');
    screenReaderSpan.classList.add('cmp-link__screen-reader-only');
    screenReaderSpan.textContent = 'opens in a new tab';
    buttonAnchor.append(screenReaderSpan);
  }

  buttonDiv.append(buttonAnchor);
  containerDiv.append(buttonDiv);

  block.append(containerDiv);

  // Add event listener for the "readMore" span
  readMoreSpan.addEventListener('click', () => {
    readMoreTextDiv.classList.toggle('expanded');
    readMoreSpan.classList.toggle('expanded');
  });

  // This part seems redundant as createOptimizedPicture is already used above
  // and the block.querySelectorAll('picture > img') would target images that are already processed
  // or images that are part of the initial block structure before it's cleared.
  // Keeping it commented out unless there's a specific reason for a second pass.
  /*
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  */
}
