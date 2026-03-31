import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const highlightItemsContainer = document.createElement('div');
  highlightItemsContainer.classList.add('highlight-items-container');

  // The first child is the container label, which we don't need to render.
  // All subsequent children are highlight-card items.
  const itemRows = [...block.children].slice(1);

  itemRows.forEach((row, index) => {
    const highlightCard = document.createElement('div');
    moveInstrumentation(row, highlightCard);
    // The original HTML uses gradient1, gradient2, etc. directly.
    highlightCard.classList.add('highlight__card', `gradient${(index % 5) + 1}`); // Cycle through gradient1-5

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
    // Class name 'highlightIcon' is correct as per original HTML.
    highlightIcon.classList.add('highlightIcon');
    highlightTop.append(highlightIcon);

    const highlightTopDescription = document.createElement('div');
    highlightTopDescription.classList.add('highlight__top__description');
    highlightTop.append(highlightTopDescription);

    const cells = [...row.children];
    // BlockJson defines 4 fields for highlight-card: title, subtitle, link, description
    const titleCell = cells[0];
    const subtitleCell = cells[1];
    const linkCell = cells[2];
    const descriptionCell = cells[3];

    const titleH3 = document.createElement('h3');
    moveInstrumentation(titleCell, titleH3);
    while (titleCell.firstChild) titleH3.append(titleCell.firstChild);
    highlightTopDescription.append(titleH3);

    const linkEl = linkCell.querySelector('a');
    const bottomSection = document.createElement('a');
    if (linkEl) {
      bottomSection.href = linkEl.href;
      if (linkEl.target) bottomSection.target = linkEl.target;
      if (linkEl.rel) bottomSection.rel = linkEl.rel;
    }
    moveInstrumentation(linkCell, bottomSection);
    bottomSection.classList.add('bottom-section');
    highlightContainer.append(bottomSection);

    const separator = document.createElement('span');
    separator.classList.add('separator');
    bottomSection.append(separator);

    const bottomContent = document.createElement('div');
    bottomContent.classList.add('bottom__content');
    bottomSection.append(bottomContent);

    const btmTitle = document.createElement('div');
    btmTitle.classList.add('btm-title');
    bottomContent.append(btmTitle);

    const subtitleH4 = document.createElement('h4');
    moveInstrumentation(subtitleCell, subtitleH4);
    subtitleH4.classList.add('h-title');
    while (subtitleCell.firstChild) subtitleH4.append(subtitleCell.firstChild);
    btmTitle.append(subtitleH4);

    const arrowLink = document.createElement('span');
    arrowLink.classList.add('arrow-link');
    btmTitle.append(arrowLink);

    const highlightBottomDescription = document.createElement('div');
    highlightBottomDescription.classList.add('highlight__bottom__description', 'g-xl-2');
    moveInstrumentation(descriptionCell, highlightBottomDescription);
    while (descriptionCell.firstChild) highlightBottomDescription.append(descriptionCell.firstChild);
    bottomContent.append(highlightBottomDescription);

    const backgroundOverlay = document.createElement('div');
    backgroundOverlay.classList.add('background-overlay');
    bottomSection.append(backgroundOverlay);

    highlightItemsContainer.append(highlightCard);
  });

  block.textContent = '';
  block.append(highlightItemsContainer);
}
