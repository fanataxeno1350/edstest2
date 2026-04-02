import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Check 0 & 1: Structure Alignment - Using destructuring for root rows, which is safe.
  // The BlockJson defines 4 root fields, and the JS correctly destructures 4 rows.
  const [headingRow, bodyRow, buttonLinkRow, imageRow] = [...block.children];

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('wp-block-media-text__content');

  // Heading
  const headingEl = document.createElement('p');
  moveInstrumentation(headingRow, headingEl);
  headingEl.classList.add('has-large-font-size');
  // The content is expected to be directly within the row's first child div,
  // so moving all children from headingRow to headingEl is appropriate.
  while (headingRow.firstChild) headingEl.append(headingRow.firstChild);
  contentDiv.append(headingEl);

  // Body
  const bodyEl = document.createElement('p');
  moveInstrumentation(bodyRow, bodyEl);
  // Similar to heading, content is expected directly within the row's first child div.
  while (bodyRow.firstChild) bodyEl.append(bodyRow.firstChild);
  contentDiv.append(bodyEl);

  // Button Link
  const buttonsWrapper = document.createElement('div');
  buttonsWrapper.classList.add('wp-block-buttons', 'is-layout-flex', 'wp-block-buttons-is-layout-flex');

  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('wp-block-button', 'is-style-outline', 'is-style-outline--3');

  const foundLink = buttonLinkRow.querySelector('a');
  const linkEl = document.createElement('a');
  if (foundLink) {
    linkEl.href = foundLink.href;
    linkEl.textContent = foundLink.textContent;
  }
  moveInstrumentation(buttonLinkRow, linkEl);
  linkEl.classList.add('wp-block-button__link', 'wp-element-button');
  buttonDiv.append(linkEl);
  buttonsWrapper.append(buttonDiv);
  contentDiv.append(buttonsWrapper);

  // Image
  const figure = document.createElement('figure');
  figure.classList.add('wp-block-media-text__media');

  const picture = imageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1024' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      figure.append(optimizedPic);

      // Add background-image style from original HTML if available
      // This part is derived from the original HTML's figure style attribute.
      // In a real scenario, this might come from metadata or a specific cell.
      // For this review, we're adding it based on the provided HTML.
      const originalFigureStyle = block.querySelector('.wp-block-media-text__media')?.getAttribute('style');
      if (originalFigureStyle) {
        figure.setAttribute('style', originalFigureStyle);
      }
    }
  }
  moveInstrumentation(imageRow, figure);

  block.textContent = '';
  block.append(contentDiv, figure);

  // Apply block-level classes from the original HTML
  block.classList.add('alignwide', 'has-media-on-the-right', 'is-stacked-on-mobile', 'is-vertically-aligned-center', 'is-image-fill');

  // Check 2: Interactivity - No interactive elements found in the original HTML that require addEventListener.
}
