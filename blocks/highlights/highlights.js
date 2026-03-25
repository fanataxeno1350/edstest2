import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const highlightItemsContainer = document.createElement('div');
  highlightItemsContainer.classList.add('highlights-highlight-items-container');

  const highlightItems = block.querySelectorAll('[data-aue-model="highlight"]');
  highlightItems.forEach((itemNode, index) => {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('highlights-highlights__card', `highlights-gradient${index + 1}`);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('highlights-highlights__content');

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('highlights-highlights__info');

    const highlightContainerDiv = document.createElement('div');
    highlightContainerDiv.classList.add('highlights-highlight-container');

    const topDiv = document.createElement('div');
    topDiv.classList.add('highlights-highlights__top');

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('highlights-highlightIcon');
    topDiv.append(iconSpan);

    const topDescriptionDiv = document.createElement('div');
    topDescriptionDiv.classList.add('highlights-highlights__top__description');
    const topDescription = itemNode.querySelector('[data-aue-prop="topDescription"]');
    if (topDescription) {
      topDescriptionDiv.append(topDescription);
      moveInstrumentation(topDescription, topDescriptionDiv);
    }
    topDiv.append(topDescriptionDiv);

    highlightContainerDiv.append(topDiv);

    const linkElement = itemNode.querySelector('[data-aue-prop="link"]');
    const anchor = document.createElement('a');
    anchor.classList.add('highlights-bottom-section');
    if (linkElement) {
      anchor.href = linkElement.href || '#';
      if (linkElement.target) {
        anchor.target = linkElement.target;
      }
      if (linkElement.rel) {
        anchor.rel = linkElement.rel;
      }
      moveInstrumentation(linkElement, anchor);
    }

    const separatorSpan = document.createElement('span');
    separatorSpan.classList.add('highlights-separator');
    anchor.append(separatorSpan);

    const bottomContentDiv = document.createElement('div');
    bottomContentDiv.classList.add('highlights-bottom__content');

    const btmTitleDiv = document.createElement('div');
    btmTitleDiv.classList.add('highlights-btm-title');

    const titleElement = itemNode.querySelector('[data-aue-prop="title"]');
    const h4Title = document.createElement('h4');
    h4Title.classList.add('highlights-h-title');
    if (titleElement) {
      h4Title.append(titleElement);
      moveInstrumentation(titleElement, h4Title);
    } else {
      // Fallback for title, if link text is available
      const linkText = linkElement ? linkElement.textContent : '';
      h4Title.textContent = linkText;
    }
    btmTitleDiv.append(h4Title);

    const arrowLinkSpan = document.createElement('span');
    arrowLinkSpan.classList.add('highlights-arrow-link');
    btmTitleDiv.append(arrowLinkSpan);

    bottomContentDiv.append(btmTitleDiv);

    const bottomDescriptionDiv = document.createElement('div');
    bottomDescriptionDiv.classList.add('highlights-highlights__bottom__description', 'highlights-g-xl-2');
    const bottomDescription = itemNode.querySelector('[data-aue-prop="bottomDescription"]');
    if (bottomDescription) {
      bottomDescriptionDiv.append(bottomDescription);
      moveInstrumentation(bottomDescription, bottomDescriptionDiv);
    }
    bottomContentDiv.append(bottomDescriptionDiv);

    anchor.append(bottomContentDiv);

    const backgroundOverlayDiv = document.createElement('div');
    backgroundOverlayDiv.classList.add('highlights-background-overlay');
    anchor.append(backgroundOverlayDiv);

    highlightContainerDiv.append(anchor);

    infoDiv.append(highlightContainerDiv);
    contentDiv.append(infoDiv);
    cardDiv.append(contentDiv);

    highlightItemsContainer.append(cardDiv);
    moveInstrumentation(itemNode, cardDiv);
  });

  block.textContent = '';
  block.append(highlightItemsContainer);
  block.className = 'highlights-highlights highlights-block';
  block.dataset.blockStatus = 'loaded';
}
