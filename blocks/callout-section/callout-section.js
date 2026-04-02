import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0 & 1: Structure Alignment - Using destructuring for direct access to top-level rows.
  // This is safe because the BlockJson defines exactly 4 root fields, each corresponding to one row.
  const [titleRow, descriptionRow, linkRow, imageRow] = [...block.children];

  block.textContent = '';

  const calloutSectionLeft = document.createElement('div');
  calloutSectionLeft.classList.add('callout-section-left');
  calloutSectionLeft.setAttribute('data-module', 'in-view');
  calloutSectionLeft.setAttribute('data-offset', 'bottom-in-view');
  calloutSectionLeft.setAttribute('data-is', 'visible');

  const calloutSectionLeftContent = document.createElement('div');
  calloutSectionLeftContent.classList.add('callout-section-left-content', 'u-background-green');
  calloutSectionLeft.append(calloutSectionLeftContent);

  const calloutSectionLeftContentHolder = document.createElement('div');
  calloutSectionLeftContentHolder.classList.add('callout-section-left-content-holder', 'u-background-green');
  calloutSectionLeftContent.append(calloutSectionLeftContentHolder);

  // Title
  const titleDiv = document.createElement('div');
  titleDiv.classList.add('callout-section-title');
  // Each row contains a single cell, so we can safely access the firstChild of the row's firstChild (the cell)
  // or simply move all children from the row's cell.
  const titleCell = titleRow.firstElementChild;
  if (titleCell) {
    moveInstrumentation(titleCell, titleDiv);
    while (titleCell.firstChild) titleDiv.append(titleCell.firstChild);
  }
  calloutSectionLeftContentHolder.append(titleDiv);

  // Description
  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('callout-section-description');
  const descriptionCell = descriptionRow.firstElementChild;
  if (descriptionCell) {
    moveInstrumentation(descriptionCell, descriptionDiv);
    while (descriptionCell.firstChild) descriptionDiv.append(descriptionCell.firstChild);
  }
  calloutSectionLeftContentHolder.append(descriptionDiv);

  // Link
  const linkP = document.createElement('p');
  linkP.classList.add('u-text-centered');
  const linkA = document.createElement('a');
  linkA.classList.add('u-button', 'u-button-reversed-white');
  const linkCell = linkRow.firstElementChild;
  const originalLink = linkCell ? linkCell.querySelector('a') : null;
  if (originalLink) {
    linkA.href = originalLink.href;
    moveInstrumentation(originalLink, linkA);
    while (originalLink.firstChild) linkA.append(originalLink.firstChild);
  }
  linkP.append(linkA);
  calloutSectionLeftContentHolder.append(linkP);

  block.append(calloutSectionLeft);

  const calloutSectionRight = document.createElement('div');
  calloutSectionRight.classList.add('callout-section-right');
  calloutSectionRight.setAttribute('data-module', 'in-view');
  calloutSectionRight.setAttribute('data-offset', 'bottom-in-view');
  calloutSectionRight.setAttribute('data-is', 'visible');

  const homecontentStripe = document.createElement('div');
  homecontentStripe.classList.add('homecontent-stripe', 'homecontent-stripe-bottom');

  const imageCell = imageRow.firstElementChild;
  const picture = imageCell ? imageCell.querySelector('picture') : null;
  if (picture) {
    const img = picture.querySelector('img');
    if (img && img.src) {
      // The original HTML uses the image as a background-image, so we don't append the picture directly.
      // We just ensure the image is optimized for the background.
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const optimizedImg = optimizedPic.querySelector('img');
      if (optimizedImg) {
        homecontentStripe.style.backgroundImage = `url("${optimizedImg.src}")`;
        moveInstrumentation(img, optimizedImg); // Move instrumentation from original img to optimized img
      } else {
        // Fallback if optimized picture somehow doesn't yield an img
        homecontentStripe.style.backgroundImage = `url("${img.src}")`;
      }
    }
  }
  // Instrumentation should be moved from the original imageRow (or its cell) to the new container.
  moveInstrumentation(imageRow, homecontentStripe);
  calloutSectionRight.append(homecontentStripe);
  block.append(calloutSectionRight);
}
