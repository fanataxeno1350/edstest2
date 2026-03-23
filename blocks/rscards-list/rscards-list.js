import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rsCardsContainer = document.createElement('div');
  rsCardsContainer.classList.add('rscards-rsCards-cards');

  const rsCardsRow = document.createElement('div');
  rsCardsRow.classList.add('rscards-row');
  rsCardsContainer.append(rsCardsRow);

  const rsCardItems = block.querySelectorAll('[data-aue-model="rsCard"]');

  rsCardItems.forEach((itemNode) => {
    const colDiv = document.createElement('div');
    colDiv.classList.add('rscards-col-xl-4', 'rscards-col-lg-6', 'rscards-pb-md-0', 'rscards-pb-4', 'rscards-row-gap-4', 'rscards-koi-rscard-padding');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('rscards-card', 'rscards-rsCards-card');

    const imageElement = itemNode.querySelector('[data-aue-prop="image"]');
    if (imageElement) {
      const picture = createOptimizedPicture(imageElement.src, imageElement.alt, false, [{
        width: '750'
      }]);
      picture.querySelector('img').classList.add('rscards-w-100', 'rscards-rsCards-kitchens-image');
      cardDiv.append(picture);
      moveInstrumentation(imageElement, picture);
    }

    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('rscards-card-body');

    const iconElement = itemNode.querySelector('[data-aue-prop="icon"]');
    if (iconElement) {
      const iconLink = document.createElement('a');
      iconLink.setAttribute('aria-label', `Read more about '${iconElement.alt}'`);
      iconLink.setAttribute('target', '_self');
      iconLink.setAttribute('id', 'explore-btn-hide-id');
      iconLink.append(iconElement);
      cardBodyDiv.append(iconLink);
      moveInstrumentation(iconElement, iconLink);
    }

    const titleElement = itemNode.querySelector('[data-aue-prop="title"]');
    if (titleElement) {
      const h5Title = document.createElement('h5');
      h5Title.classList.add('rscards-rsCards-blog-card-title');
      h5Title.append(titleElement);
      cardBodyDiv.append(h5Title);
      moveInstrumentation(titleElement, h5Title);
    }

    const descriptionElement = itemNode.querySelector('[data-aue-prop="description"]');
    if (descriptionElement) {
      const h5Description = document.createElement('h5');
      h5Description.classList.add('rscards-card-title');
      h5Description.append(descriptionElement);
      cardBodyDiv.append(h5Description);
      moveInstrumentation(descriptionElement, h5Description);
    }

    cardDiv.append(cardBodyDiv);
    colDiv.append(cardDiv);
    rsCardsRow.append(colDiv);
    moveInstrumentation(itemNode, colDiv);
  });

  const tabParaDiv = document.createElement('div');
  tabParaDiv.classList.add('rscards-rsCards-tab-para');
  rsCardsRow.append(tabParaDiv);

  block.textContent = '';
  block.append(rsCardsContainer);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
