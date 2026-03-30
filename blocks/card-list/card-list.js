import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rowDiv = document.createElement('div');
  rowDiv.classList.add('rs-cards-row');

  const cards = block.querySelectorAll('[data-aue-model="card"]');

  cards.forEach((card) => {
    const colDiv = document.createElement('div');
    colDiv.classList.add('rs-cards-col-xl-4', 'rs-cards-col-lg-6', 'rs-cards-pb-md-0', 'rs-cards-pb-4', 'rs-cards-row-gap-4', 'rs-cards-koi-rscard-padding');

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('rs-cards-card', 'rs-cards-rs-card');

    // Image
    const imageElement = card.querySelector('[data-aue-prop="image"]');
    if (imageElement) {
      const picture = createOptimizedPicture(imageElement.src, imageElement.alt);
      cardWrapper.append(picture);
      moveInstrumentation(imageElement, picture);
    }

    const cardBody = document.createElement('div');
    cardBody.classList.add('rs-cards-card-body');

    // Title
    const titleElement = card.querySelector('[data-aue-prop="title"]');
    if (titleElement) {
      const h5Title = document.createElement('h5');
      h5Title.classList.add('rs-cards-blog-card-title');
      h5Title.textContent = titleElement.textContent;
      cardBody.append(h5Title);
      moveInstrumentation(titleElement, h5Title);
    }

    // Description
    const descriptionElement = card.querySelector('[data-aue-prop="description"]');
    if (descriptionElement) {
      const h5Description = document.createElement('h5');
      h5Description.classList.add('rs-cards-card-title');
      // Append the first p tag or the description element itself if no p tag
      const pDesc = descriptionElement.querySelector('p');
      if (pDesc) {
        h5Description.append(pDesc);
      } else {
        h5Description.append(descriptionElement);
      }
      cardBody.append(h5Description);
      moveInstrumentation(descriptionElement, h5Description);
    }

    // Link Icon and Link
    const linkElement = card.querySelector('[data-aue-prop="link"]');
    const linkIconElement = card.querySelector('[data-aue-prop="linkIcon"]');

    if (linkElement && linkElement.tagName === 'A') {
      const linkIcon = document.createElement('a');
      linkIcon.setAttribute('aria-label', linkElement.getAttribute('aria-label') || '');
      linkIcon.setAttribute('target', linkElement.getAttribute('target') || '_self');
      linkIcon.setAttribute('href', linkElement.href);

      if (linkIconElement && linkIconElement.tagName === 'IMG') {
        linkIcon.append(linkIconElement);
        moveInstrumentation(linkIconElement, linkIcon);
      }
      cardBody.append(linkIcon);
      moveInstrumentation(linkElement, linkIcon);
    }

    cardWrapper.append(cardBody);
    colDiv.append(cardWrapper);
    rowDiv.append(colDiv);
    moveInstrumentation(card, colDiv);
  });

  const tabParaDiv = document.createElement('div');
  tabParaDiv.classList.add('rs-cards-tab-para');
  rowDiv.append(tabParaDiv);

  block.textContent = '';
  block.append(rowDiv);
  block.classList.add('rs-cards-rs-cards');
  block.dataset.blockStatus = 'loaded';
}