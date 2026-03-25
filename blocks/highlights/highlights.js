import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const highlightItemsContainer = document.createElement('div');
  highlightItemsContainer.classList.add('highlight-items-container');

  const highlightCards = block.querySelectorAll('[data-aue-model="highlight"]');
  const gradients = ['gradient1', 'gradient2', 'gradient3', 'gradient4', 'gradient5'];

  highlightCards.forEach((cardNode, index) => {
    const highlightCard = document.createElement('div');
    highlightCard.classList.add('highlight__card', gradients[index % gradients.length]);

    const highlightContent = document.createElement('div');
    highlightContent.classList.add('highlight__content');

    const highlightInfo = document.createElement('div');
    highlightInfo.classList.add('highlight__info');

    const highlightContainer = document.createElement('div');
    highlightContainer.classList.add('highlight-container');

    const highlightTop = document.createElement('div');
    highlightTop.classList.add('highlight__top');

    const highlightIcon = document.createElement('span');
    highlightIcon.classList.add('highlightIcon');
    highlightTop.append(highlightIcon);

    const highlightTopDescription = document.createElement('div');
    highlightTopDescription.classList.add('highlight__top__description');
    const titleElement = cardNode.querySelector('[data-aue-prop="title"]');
    if (titleElement) {
      const h3 = document.createElement('h3');
      h3.innerHTML = titleElement.innerHTML;
      highlightTopDescription.append(h3);
      moveInstrumentation(titleElement, h3);
    }
    highlightTop.append(highlightTopDescription);

    const linkElement = cardNode.querySelector('[data-aue-prop="link"]');
    const linkTitleElement = cardNode.querySelector('[data-aue-prop="linkTitle"]');
    const descriptionElement = cardNode.querySelector('[data-aue-prop="description"]');

    const anchor = document.createElement('a');
    anchor.classList.add('bottom-section');
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('rel', 'noopener noreferrer');
    if (linkElement) {
      anchor.href = linkElement.textContent.trim();
      moveInstrumentation(linkElement, anchor);
    }

    const separator = document.createElement('span');
    separator.classList.add('separator');
    anchor.append(separator);

    const bottomContent = document.createElement('div');
    bottomContent.classList.add('bottom__content');

    const btmTitle = document.createElement('div');
    btmTitle.classList.add('btm-title');

    const h4 = document.createElement('h4');
    h4.classList.add('h-title');
    if (linkTitleElement) {
      h4.innerHTML = linkTitleElement.innerHTML;
      moveInstrumentation(linkTitleElement, h4);
    }
    btmTitle.append(h4);

    const arrowLink = document.createElement('span');
    arrowLink.classList.add('arrow-link');
    btmTitle.append(arrowLink);

    bottomContent.append(btmTitle);

    const highlightBottomDescription = document.createElement('div');
    highlightBottomDescription.classList.add('highlight__bottom__description', 'g-xl-2');
    if (descriptionElement) {
      const p = document.createElement('p');
      p.innerHTML = descriptionElement.innerHTML;
      highlightBottomDescription.append(p);
      moveInstrumentation(descriptionElement, p);
    }
    bottomContent.append(highlightBottomDescription);

    anchor.append(bottomContent);

    const backgroundOverlay = document.createElement('div');
    backgroundOverlay.classList.add('background-overlay');
    anchor.append(backgroundOverlay);

    highlightContainer.append(highlightTop, anchor);
    highlightInfo.append(highlightContainer);
    highlightContent.append(highlightInfo);
    highlightCard.append(highlightContent);

    highlightItemsContainer.append(highlightCard);
    moveInstrumentation(cardNode, highlightCard);
  });

  block.textContent = '';
  block.append(highlightItemsContainer);
  block.className = 'highlights block';
  block.dataset.blockStatus = 'loaded';
}