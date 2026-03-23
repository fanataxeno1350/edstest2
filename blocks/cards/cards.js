import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('rs-cards-row');

  const cardItems = block.querySelectorAll('[data-aue-model="card"]');

  cardItems.forEach((cardItem) => {
    const colDiv = document.createElement('div');
    colDiv.classList.add('rs-cards-col-xl-4', 'rs-cards-col-lg-6', 'rs-cards-pb-md-0', 'rs-cards-pb-4', 'rs-cards-row-gap-4', 'rs-cards-koi-rscard-padding');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('rs-cards-card', 'rs-cards-rs-card');

    // Image
    const imageElement = cardItem.querySelector('[data-aue-prop="image"]');
    if (imageElement) {
      const picture = createOptimizedPicture(imageElement.src, imageElement.alt);
      cardDiv.append(picture);
      moveInstrumentation(imageElement, picture);
    }

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('rs-cards-card-body');

    // Icon (link with image inside)
    const iconElement = cardItem.querySelector('[data-aue-prop="icon"]');
    if (iconElement) {
      const iconLink = document.createElement('a');
      iconLink.setAttribute('aria-label', iconElement.alt ? `Read more about '${iconElement.alt}'` : '');
      iconLink.setAttribute('target', '_self');
      iconLink.setAttribute('id', 'explore-btn-hide-id');
      iconLink.append(iconElement);
      cardBodyDiv.append(iconLink);
      moveInstrumentation(iconElement, iconLink);
    }

    // Title
    const titleElement = cardItem.querySelector('[data-aue-prop="title"]');
    if (titleElement) {
      const titleH5 = document.createElement('h5');
      titleH5.classList.add('rs-cards-blog-card-title');
      titleH5.append(...titleElement.childNodes);
      cardBodyDiv.append(titleH5);
      moveInstrumentation(titleElement, titleH5);
    }

    // Description
    const descriptionElement = cardItem.querySelector('[data-aue-prop="description"]');
    if (descriptionElement) {
      const descriptionH5 = document.createElement('h5');
      descriptionH5.classList.add('rs-cards-card-title');
      descriptionH5.append(...descriptionElement.childNodes);
      cardBodyDiv.append(descriptionH5);
      moveInstrumentation(descriptionElement, descriptionH5);
    }

    cardDiv.append(cardBodyDiv);
    colDiv.append(cardDiv);
    cardsContainer.append(colDiv);
    moveInstrumentation(cardItem, colDiv);
  });

  const tabParaDiv = document.createElement('div');
  tabParaDiv.classList.add('rs-cards-tab-para');
  cardsContainer.append(tabParaDiv);

  block.textContent = '';
  block.append(cardsContainer);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
