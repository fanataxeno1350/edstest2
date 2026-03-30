import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rowDiv = document.createElement('div');
  rowDiv.className = 'row';

  const cards = block.querySelectorAll('[data-aue-model="koiRSCard"]');
  cards.forEach((cardNode) => {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-xl-4 col-lg-6 pb-md-0 pb-4 row-gap-4 koi-rscard-padding';

    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'card rs-card';

    const imageElement = cardNode.querySelector('[data-aue-prop="image"]');
    if (imageElement) {
      const picture = createOptimizedPicture(imageElement.src, imageElement.alt);
      cardWrapper.append(picture);
      moveInstrumentation(imageElement, picture);
    }

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const titleElement = cardNode.querySelector('[data-aue-prop="title"]');
    if (titleElement) {
      const h5Title = document.createElement('h5');
      h5Title.className = 'blog-card-title';
      h5Title.append(titleElement);
      cardBody.append(h5Title);
      moveInstrumentation(titleElement, h5Title);
    }

    const descriptionElement = cardNode.querySelector('[data-aue-prop="description"]');
    if (descriptionElement) {
      const h5Description = document.createElement('h5');
      h5Description.className = 'card-title';
      h5Description.append(descriptionElement);
      cardBody.append(h5Description);
      moveInstrumentation(descriptionElement, h5Description);
    }

    cardWrapper.append(cardBody);
    colDiv.append(cardWrapper);
    rowDiv.append(colDiv);
    moveInstrumentation(cardNode, cardWrapper);
  });

  block.textContent = '';
  block.append(rowDiv);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}