import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const highlightItemsContainer = document.createElement('div');
  highlightItemsContainer.classList.add('highlight-items-container');

  const [highlightsRow, ...itemRows] = [...block.children];
  moveInstrumentation(highlightsRow, highlightItemsContainer); // Move instrumentation from the main container row

  itemRows.forEach((row, index) => {
    const highlightCard = document.createElement('div');
    highlightCard.classList.add('highlight__card', `gradient${index + 1}`);

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

    const bottomSectionLink = document.createElement('a');
    bottomSectionLink.classList.add('bottom-section');
    bottomSectionLink.setAttribute('target', '_blank');
    bottomSectionLink.setAttribute('rel', 'noopener noreferrer');
    highlightContainer.append(bottomSectionLink);

    const separator = document.createElement('span');
    separator.classList.add('separator');
    bottomSectionLink.append(separator);

    const bottomContent = document.createElement('div');
    bottomContent.classList.add('bottom__content');
    bottomSectionLink.append(bottomContent);

    const btmTitle = document.createElement('div');
    btmTitle.classList.add('btm-title');
    bottomContent.append(btmTitle);

    const hTitle = document.createElement('h4'); // Changed from h3 to h4 as per original HTML
    hTitle.classList.add('h-title');
    btmTitle.append(hTitle);

    const arrowLink = document.createElement('span');
    arrowLink.classList.add('arrow-link');
    btmTitle.append(arrowLink);

    const highlightBottomDescription = document.createElement('div');
    highlightBottomDescription.classList.add('highlight__bottom__description', 'g-xl-2');
    bottomContent.append(highlightBottomDescription);

    const backgroundOverlay = document.createElement('div');
    backgroundOverlay.classList.add('background-overlay');
    bottomSectionLink.append(backgroundOverlay);

    moveInstrumentation(row, highlightCard);

    [...row.children].forEach((cell, cellIndex) => {
      if (cellIndex === 0) { // Title
        const titleElement = cell.querySelector('div');
        if (titleElement) {
          const h4 = document.createElement('h4'); // Changed from h3 to h4
          moveInstrumentation(titleElement, h4);
          h4.textContent = titleElement.textContent;
          hTitle.append(h4);
        }
      } else if (cellIndex === 1) { // Description
        const descriptionElement = cell.querySelector('div');
        if (descriptionElement) {
          const p = document.createElement('p');
          moveInstrumentation(descriptionElement, p);
          p.innerHTML = descriptionElement.innerHTML;
          highlightTopDescription.append(p.cloneNode(true));
          highlightBottomDescription.append(p);
        }
      } else if (cellIndex === 2) { // Link
        const linkElement = cell.querySelector('a');
        if (linkElement) {
          bottomSectionLink.href = linkElement.href;
          bottomSectionLink.setAttribute('data-href', linkElement.href);
        }
      }
    });
    highlightItemsContainer.append(highlightCard);
  });

  block.textContent = '';
  block.append(highlightItemsContainer);
}
