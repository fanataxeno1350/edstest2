import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use content detection instead of direct index access
  const rows = [...block.children];

  block.classList.add('grid-container', 'bg--paper-white', 'homepage-recommended-article', 'padding', 'animate-enter', 'in-view');

  const gridX = document.createElement('div');
  gridX.classList.add('grid-x', 'pos-rel');

  // Image cell
  const imageRow = rows.find(row => row.querySelector('picture'));
  const imageCell = imageRow ? imageRow.firstElementChild : null;
  const imageDiv = document.createElement('div');
  imageDiv.classList.add('cell', 'bg-container', 'animate-enter-fade', 'animate-delay-3');
  if (imageCell) {
    moveInstrumentation(imageCell, imageDiv);
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      // Image Alt cell
      const imageAltRow = rows.find(row => !row.querySelector('picture') && row.textContent.trim().length > 0 && row.textContent.trim() !== img.alt); // Heuristic to find alt text row
      const altText = imageAltRow ? imageAltRow.firstElementChild.textContent.trim() : img.alt || '';
      const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageDiv.append(optimizedPic);
    }
  }
  gridX.append(imageDiv);

  const contentCell = document.createElement('div');
  contentCell.classList.add('cell');

  const whiteBgPatch = document.createElement('div');
  whiteBgPatch.classList.add('grid-x', 'white-bg-patch');

  const textContainer = document.createElement('div');
  textContainer.classList.add('text-container', 'text-center');

  // Heading cell
  const headingRow = rows.find(row => row.querySelector('h2') || (row.firstElementChild && row.firstElementChild.tagName === 'DIV' && row.firstElementChild.textContent.trim().length > 0 && !row.querySelector('picture') && !row.querySelector('a') && !row.querySelector('p')));
  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('title', 'headline-h2', 'animate-enter-fade-up-short', 'animate-delay-3');
    moveInstrumentation(headingRow.firstElementChild, heading);
    heading.append(...headingRow.firstElementChild.childNodes);
    textContainer.append(heading);
  }

  // Description cell
  const descriptionRow = rows.find(row => row.querySelector('p') || (row.firstElementChild && row.firstElementChild.tagName === 'DIV' && row.firstElementChild.textContent.trim().length > 0 && !row.querySelector('picture') && !row.querySelector('a') && !row.querySelector('h2')));
  if (descriptionRow) {
    const description = document.createElement('div');
    description.classList.add('description', 'bodyMediumRegular', 'animate-enter-fade-up-short', 'animate-delay-5');
    moveInstrumentation(descriptionRow.firstElementChild, description);
    description.append(...descriptionRow.firstElementChild.childNodes);
    textContainer.append(description);
  }

  // Button Link and Button Label cells
  const buttonLinkRow = rows.find(row => row.querySelector('a'));
  const buttonLink = buttonLinkRow ? buttonLinkRow.firstElementChild.querySelector('a') : null;

  const buttonLabelRow = rows.find(row => !row.querySelector('a') && !row.querySelector('picture') && !row.querySelector('h2') && !row.querySelector('p') && row.textContent.trim().length > 0 && row !== imageRow && row !== imageAltRow && row !== headingRow && row !== descriptionRow);
  const buttonLabel = buttonLabelRow ? buttonLabelRow.firstElementChild.textContent.trim() : '';

  if (buttonLink && buttonLabel) {
    const button = document.createElement('a');
    button.classList.add('button', 'transparent-black', 'see-all-products', 'animate-enter-fade-up-short', 'animate-delay-7');
    button.href = buttonLink.href;
    button.title = buttonLabel;
    button.setAttribute('aria-label', '');
    button.setAttribute('rel', 'follow');

    const buttonTextSpan = document.createElement('span');
    buttonTextSpan.classList.add('button-text');
    buttonTextSpan.textContent = buttonLabel;
    button.append(buttonTextSpan);
    textContainer.append(button);
  }

  whiteBgPatch.append(textContainer);
  contentCell.append(whiteBgPatch);
  gridX.append(contentCell);

  block.textContent = '';
  block.append(gridX);
}
