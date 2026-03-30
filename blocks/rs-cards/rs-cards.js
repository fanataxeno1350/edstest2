import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');

  const cards = block.querySelectorAll('[data-aue-model="rsCard"]');
  cards.forEach((card) => {
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-xl-4', 'col-lg-6', 'pb-md-0', 'pb-4', 'row-gap-4', 'koi-rscard-padding');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'rs-card');

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');
    const img = card.querySelector('[data-aue-prop="image"]');
    if (img) {
      const picture = createOptimizedPicture(img.src, img.alt);
      imageContainer.append(picture);
      moveInstrumentation(img, picture);
    }

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const titleElement = card.querySelector('[data-aue-prop="title"]');
    if (titleElement) {
      const h5Title = document.createElement('h5');
      h5Title.classList.add('blog-card-title');
      h5Title.append(...titleElement.childNodes);
      cardBody.append(h5Title);
      moveInstrumentation(titleElement, h5Title);
    }

    const descriptionElement = card.querySelector('[data-aue-prop="description"]');
    if (descriptionElement) {
      const h5Description = document.createElement('h5');
      h5Description.classList.add('card-title');
      h5Description.append(...descriptionElement.childNodes);
      cardBody.append(h5Description);
      moveInstrumentation(descriptionElement, h5Description);
    }

    cardDiv.append(imageContainer, cardBody);
    colDiv.append(cardDiv);
    rowDiv.append(colDiv);
    moveInstrumentation(card, colDiv);
  });

  block.textContent = '';
  block.append(rowDiv);
  block.className = `rs-cards block`;
  block.dataset.blockStatus = 'loaded';
}