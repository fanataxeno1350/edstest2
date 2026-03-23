import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rsCardsContainer = document.createElement('div');
  rsCardsContainer.classList.add('rs-cards');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');
  rsCardsContainer.append(rowDiv);

  const cards = block.querySelectorAll('[data-aue-model="rsCard"]');

  cards.forEach((card) => {
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-xl-4', 'col-lg-6', 'pb-md-0', 'pb-4', 'row-gap-4', 'koi-rscard-padding');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'rs-card');

    const imageContainer = document.createElement('div');
    const img = card.querySelector('[data-aue-prop="image"]');
    if (img) {
      const picture = createOptimizedPicture(img.src, img.alt);
      imageContainer.append(picture);
      moveInstrumentation(img, picture);
    }
    cardDiv.append(imageContainer);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const titleElement = document.createElement('h5');
    titleElement.classList.add('blog-card-title');
    const authoredTitle = card.querySelector('[data-aue-prop="title"]');
    if (authoredTitle) {
      titleElement.append(...authoredTitle.childNodes);
      moveInstrumentation(authoredTitle, titleElement);
    }
    cardBody.append(titleElement);

    const descriptionElement = document.createElement('h5');
    descriptionElement.classList.add('card-title');
    const authoredDescription = card.querySelector('[data-aue-prop="description"]');
    if (authoredDescription) {
      descriptionElement.append(...authoredDescription.childNodes);
      moveInstrumentation(authoredDescription, descriptionElement);
    }
    cardBody.append(descriptionElement);

    cardDiv.append(cardBody);
    colDiv.append(cardDiv);
    rowDiv.append(colDiv);
    moveInstrumentation(card, colDiv);
  });

  block.textContent = '';
  block.append(rsCardsContainer);
  block.className = 'rs-cards block';
  block.dataset.blockStatus = 'loaded';
}
