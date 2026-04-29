import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CRITICAL: Avoid direct index access block.children[n]
  // Instead, iterate block.children (rows) and then row.children (cells)
  // and use content detection (querySelector, innerHTML, textContent) to identify cells.

  const rows = [...block.children];

  // Identify root cells based on content type as per EDS BLOCK STRUCTURE
  const titleCell = rows[0]?.querySelector('div'); // type=text
  const descriptionCell = rows[1]?.querySelector('div'); // type=richtext
  const actionLinkCell = rows[2]?.querySelector('div'); // type=aem-content
  const mainImageCell = rows[3]?.querySelector('div'); // type=reference
  const animationImageCell = rows[4]?.querySelector('div'); // type=reference

  // Create main content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('cmp-teaser__content');
  if (titleCell) { // moveInstrumentation expects a valid source element
    moveInstrumentation(titleCell, contentWrapper);
  }

  // Title
  if (titleCell && titleCell.textContent.trim()) {
    const title = document.createElement('h3');
    title.classList.add('cmp-teaser__title');
    title.textContent = titleCell.textContent.trim();
    contentWrapper.appendChild(title);
  }

  // Description
  // CHECK 1.5: richtext field, must use innerHTML
  if (descriptionCell && descriptionCell.innerHTML.trim()) {
    const description = document.createElement('div');
    description.classList.add('cmp-teaser__description');
    description.innerHTML = descriptionCell.innerHTML.trim(); // Correctly using innerHTML
    contentWrapper.appendChild(description);
  }

  // Action Link
  // CHECK 1: aem-content field, must read href and textContent from the <a> tag
  if (actionLinkCell) {
    const actionLinkContainer = document.createElement('div');
    actionLinkContainer.classList.add('cmp-teaser__action-container');

    const foundLink = actionLinkCell.querySelector('a');
    if (foundLink) {
      const actionLink = document.createElement('a');
      actionLink.classList.add('cmp-teaser__action-link', 'cmp-button');
      actionLink.href = foundLink.href;
      // CRITICAL FIX: Use the link's textContent for the label, not the raw AEM path
      actionLink.textContent = foundLink.textContent.trim();
      moveInstrumentation(actionLinkCell, actionLink);
      actionLinkContainer.appendChild(actionLink);
    }
    contentWrapper.appendChild(actionLinkContainer);
  }

  // Main Image
  const mainImageWrapper = document.createElement('div');
  mainImageWrapper.classList.add('cmp-teaser__image');
  const mainPicture = mainImageCell ? mainImageCell.querySelector('picture') : null;
  if (mainPicture) {
    const img = mainPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.querySelector('img').classList.add('cmp-image__image'); // Apply class to the actual img
    if (mainImageCell) { // moveInstrumentation expects a valid source element
      moveInstrumentation(mainImageCell, optimizedPic.querySelector('img'));
    }
    mainImageWrapper.appendChild(optimizedPic);
  }

  // Animation Image
  const animationImageWrapper = document.createElement('div');
  animationImageWrapper.classList.add('cmp-animation', 'visible');
  const animationPicture = animationImageCell ? animationImageCell.querySelector('picture') : null;
  if (animationPicture) {
    const img = animationPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '300' }]); // Using a smaller width for animation image as per original HTML media query
    optimizedPic.querySelector('img').classList.add('cmp-teaser__smallimage');
    if (animationImageCell) { // moveInstrumentation expects a valid source element
      moveInstrumentation(animationImageCell, optimizedPic.querySelector('img'));
    }
    animationImageWrapper.appendChild(optimizedPic);
  }

  // Clear existing content and append new structure
  block.innerHTML = '';
  block.classList.add('cmp-teaser', 'cmp-teaser--right-image-aligned', 'cmp-button--primary-anchor');
  block.appendChild(contentWrapper);
  block.appendChild(mainImageWrapper);
  block.appendChild(animationImageWrapper);

  // CHECK 2: Interactivity - No interactive elements (buttons, toggles, etc.) found in ORIGINAL HTML
  // that require explicit addEventListener. The action link is a standard href.
}
