import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const highlightItemsContainer = document.createElement('div');
  highlightItemsContainer.classList.add('highlight-items-container');

  // Skip the first row which is just the container title, then process item rows
  const itemRows = [...block.children].slice(1);

  itemRows.forEach((row, index) => {
    const highlightCard = document.createElement('div');
    highlightCard.classList.add('highlight__card', `gradient${index + 1}`);
    moveInstrumentation(row, highlightCard);

    const highlightContent = document.createElement('div');
    highlightContent.classList.add('highlight__content');
    highlightCard.append(highlightContent);

    const highlightInfo = document.createElement('div');
    highlightInfo.classList.add('highlight__info');
    highlightContent.append(highlightInfo);

    const highlightContainer = document.createElement('div');
    highlightContainer.classList.add('highlight-container');
    highlightInfo.append(highlightContainer);

    const highlightTop = document.createElement('div');
    highlightTop.classList.add('highlight__top');
    highlightContainer.append(highlightTop);

    const highlightIcon = document.createElement('span');
    highlightIcon.classList.add('highlightIcon');
    highlightTop.append(highlightIcon);

    const highlightTopDescription = document.createElement('div');
    highlightTopDescription.classList.add('highlight__top__description');
    highlightTop.append(highlightTopDescription);

    const cells = [...row.children];
    // Based on BlockJson:
    // cell[0]: field="topDescription"
    // cell[1]: field="link"
    // cell[2]: field="title"
    // cell[3]: field="bottomDescription"
    const topDescriptionCell = cells[0];
    const linkCell = cells[1];
    const titleCell = cells[2];
    const bottomDescriptionCell = cells[3];

    // Top Description
    const h3 = document.createElement('h3');
    moveInstrumentation(topDescriptionCell, h3);
    while (topDescriptionCell.firstChild) h3.append(topDescriptionCell.firstChild);
    highlightTopDescription.append(h3);

    // Link (this entire card is wrapped in an anchor tag in the original HTML)
    const foundLink = linkCell.querySelector('a');
    const linkEl = document.createElement('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = '_blank'; // Original HTML has target="_blank"
      linkEl.rel = 'noopener noreferrer'; // Original HTML has rel="noopener noreferrer"
    }
    linkEl.classList.add('bottom-section'); // Class from original HTML
    moveInstrumentation(linkCell, linkEl);
    // The link text from the model is the title, but the original HTML has a separate title element
    // So we don't append the linkCell's content directly here.

    highlightContainer.append(linkEl);

    const separator = document.createElement('span');
    separator.classList.add('separator');
    linkEl.append(separator);

    const bottomContent = document.createElement('div');
    bottomContent.classList.add('bottom__content');
    linkEl.append(bottomContent);

    const btmTitle = document.createElement('div');
    btmTitle.classList.add('btm-title');
    bottomContent.append(btmTitle);

    const h4 = document.createElement('h4');
    h4.classList.add('h-title');
    moveInstrumentation(titleCell, h4);
    while (titleCell.firstChild) h4.append(titleCell.firstChild);
    btmTitle.append(h4);

    const arrowLink = document.createElement('span');
    arrowLink.classList.add('arrow-link');
    btmTitle.append(arrowLink);

    const highlightBottomDescription = document.createElement('div');
    highlightBottomDescription.classList.add('highlight__bottom__description', 'g-xl-2');
    moveInstrumentation(bottomDescriptionCell, highlightBottomDescription);
    while (bottomDescriptionCell.firstChild) highlightBottomDescription.append(bottomDescriptionCell.firstChild);
    bottomContent.append(highlightBottomDescription);

    const backgroundOverlay = document.createElement('div');
    backgroundOverlay.classList.add('background-overlay');
    linkEl.append(backgroundOverlay);

    highlightItemsContainer.append(highlightCard);
  });

  block.textContent = '';
  block.append(highlightItemsContainer);
}
