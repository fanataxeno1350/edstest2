import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rowDiv = document.createElement('div');
  rowDiv.classList.add('rs-cards-row');

  const cards = block.querySelectorAll('[data-aue-model="card"]');

  cards.forEach((cardNode) => {
    const colDiv = document.createElement('div');
    colDiv.classList.add('rs-cards-col-xl-4', 'rs-cards-col-lg-6', 'rs-cards-pb-md-0', 'rs-cards-pb-4', 'rs-cards-row-gap-4', 'rs-cards-koi-rscard-padding');

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('rs-cards-card', 'rs-cards-rs-card');

    // Image
    const imageElement = cardNode.querySelector('[data-aue-prop="image"]');
    if (imageElement) {
      const picture = createOptimizedPicture(imageElement.src, imageElement.alt);
      cardWrapper.append(picture);
      moveInstrumentation(imageElement, picture);
    }

    const cardBody = document.createElement('div');
    cardBody.classList.add('rs-cards-card-body');

    // Icon (if it's a link with an image inside)
    const iconLink = cardNode.querySelector('[data-aue-prop="icon"]');
    if (iconLink) {
      const linkElement = document.createElement('a');
      linkElement.setAttribute('aria-label', iconLink.getAttribute('aria-label'));
      linkElement.setAttribute('target', iconLink.getAttribute('target'));
      linkElement.setAttribute('id', iconLink.getAttribute('id'));

      const iconImg = iconLink.querySelector('img');
      if (iconImg) {
        linkElement.append(iconImg);
        moveInstrumentation(iconImg, linkElement);
      }
      cardBody.append(linkElement);
      moveInstrumentation(iconLink, linkElement);
    }

    // Title
    const titleElement = cardNode.querySelector('[data-aue-prop="title"]');
    if (titleElement) {
      const h5Title = document.createElement('h5');
      h5Title.classList.add('rs-cards-blog-card-title');
      h5Title.append(...titleElement.childNodes);
      cardBody.append(h5Title);
      moveInstrumentation(titleElement, h5Title);
    }

    // Description
    const descriptionElement = cardNode.querySelector('[data-aue-prop="description"]');
    if (descriptionElement) {
      const h5Description = document.createElement('h5');
      h5Description.classList.add('rs-cards-card-title');
      h5Description.append(...descriptionElement.childNodes);
      cardBody.append(h5Description);
      moveInstrumentation(descriptionElement, h5Description);
    }

    cardWrapper.append(cardBody);
    moveInstrumentation(cardNode.querySelector('.rs-cards-card-body'), cardBody);

    colDiv.append(cardWrapper);
    moveInstrumentation(cardNode, colDiv);

    rowDiv.append(colDiv);
  });

  block.textContent = '';
  block.append(rowDiv);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}