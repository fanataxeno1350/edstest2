import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    titleRow,
    subtitleRow,
    buttonLinkRow,
    buttonLabelRow,
    ...cardRows
  ] = [...block.children];

  block.innerHTML = '';
  block.classList.add('cmp-social');

  const titleContainer = document.createElement('div');
  titleContainer.classList.add('cmp-social__title-container');

  // Title
  if (titleRow) {
    const titleCell = titleRow.firstElementChild;
    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title', 'cmp-social__title');
    const cmpTitleDiv = document.createElement('div');
    cmpTitleDiv.classList.add('cmp-title');
    const h2 = document.createElement('h2');
    h2.classList.add('cmp-title__text');
    h2.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleRow, h2);
    cmpTitleDiv.append(h2);
    titleDiv.append(cmpTitleDiv);
    titleContainer.append(titleDiv);
  }

  // Subtitle
  if (subtitleRow) {
    const subtitleCell = subtitleRow.firstElementChild;
    const textDiv = document.createElement('div');
    textDiv.classList.add('text', 'cmp-social__sub-title', 'body-3');
    const cmpTextDiv = document.createElement('div');
    cmpTextDiv.classList.add('cmp-text');
    cmpTextDiv.innerHTML = subtitleCell.innerHTML;
    moveInstrumentation(subtitleRow, cmpTextDiv);
    textDiv.append(cmpTextDiv);
    titleContainer.append(textDiv);
  }

  block.append(titleContainer);

  // Cards
  if (cardRows.length > 0) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('cmp-social__card-container', 'cmp-social__card-container--anchor');

    // Group cards into columns (Original HTML has 5 columns, 2 cards each)
    const numColumns = 5;
    const cardsPerColumn = Math.ceil(cardRows.length / numColumns);

    for (let i = 0; i < numColumns; i += 1) {
      const column = document.createElement('div');
      column.classList.add('cmp-social__card-column');

      const startIndex = i * cardsPerColumn;
      const endIndex = Math.min(startIndex + cardsPerColumn, cardRows.length);

      for (let j = startIndex; j < endIndex; j += 1) {
        const cardRow = cardRows[j];
        // CRITICAL FIX: Replaced row.children[n] with destructuring
        const [imageCell, linkCell] = [...cardRow.children];

        const linkElement = document.createElement('a');
        const foundLink = linkCell.querySelector('a');
        if (foundLink) {
          linkElement.href = foundLink.href;
        }

        const picture = imageCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            linkElement.append(optimizedPic);
          }
        }
        moveInstrumentation(cardRow, linkElement);
        column.append(linkElement);
      }
      cardContainer.append(column);
    }
    block.append(cardContainer);
  }

  // Button
  if (buttonLinkRow && buttonLabelRow) {
    const buttonLink = buttonLinkRow.firstElementChild.querySelector('a');
    const buttonLabel = buttonLabelRow.firstElementChild.textContent.trim();

    if (buttonLink && buttonLabel) {
      const socialButtonDiv = document.createElement('div');
      socialButtonDiv.classList.add('socialButton', 'button', 'cmp-button--primary-anchor');

      const anchor = document.createElement('a');
      anchor.classList.add('cmp-button');
      anchor.href = buttonLink.href;
      anchor.target = '_blank'; // Assuming target="_blank" from original HTML

      const span = document.createElement('span');
      span.classList.add('cmp-button__text');
      span.textContent = buttonLabel;

      anchor.append(span);
      socialButtonDiv.append(anchor);
      moveInstrumentation(buttonLinkRow.firstElementChild, anchor); // Instrumentation for the link cell
      moveInstrumentation(buttonLabelRow.firstElementChild, span); // Instrumentation for the label cell
      block.append(socialButtonDiv);
    }
  }

  const gradientDiv = document.createElement('div');
  gradientDiv.classList.add('cmp-social__gradient');
  block.append(gradientDiv);
}
