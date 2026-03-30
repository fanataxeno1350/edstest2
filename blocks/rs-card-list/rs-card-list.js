import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'cards-container';

  const authoredCards = block.querySelectorAll('[data-aue-model="rsCard"]');

  authoredCards.forEach((cardNode) => {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'card-wrapper';

    const imageField = cardNode.querySelector('[data-aue-prop="image"]');
    const titleField = cardNode.querySelector('[data-aue-prop="title"]');
    const descriptionField = cardNode.querySelector('[data-aue-prop="description"]');

    if (imageField) {
      const img = imageField.querySelector('img');
      if (img) {
        const picture = createOptimizedPicture(img.src, img.alt);
        cardWrapper.append(picture);
        moveInstrumentation(imageField, cardWrapper);
      }
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'card-content';

    if (titleField) {
      const titleElement = document.createElement('h5');
      titleElement.className = 'card-title';
      titleElement.innerHTML = titleField.innerHTML;
      contentDiv.append(titleElement);
      moveInstrumentation(titleField, titleElement);
    }

    if (descriptionField) {
      const descriptionElement = document.createElement('p');
      descriptionElement.className = 'card-description';
      descriptionElement.innerHTML = descriptionField.innerHTML;
      contentDiv.append(descriptionElement);
      moveInstrumentation(descriptionField, descriptionElement);
    }

    cardWrapper.append(contentDiv);
    cardsContainer.append(cardWrapper);
    moveInstrumentation(cardNode, cardWrapper);
  });

  block.textContent = '';
  block.append(cardsContainer);
  block.className = 'rs-card-list block';
  block.dataset.blockStatus = 'loaded';
}
