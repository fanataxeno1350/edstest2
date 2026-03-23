import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rsCardsRow = document.createElement('div');
  rsCardsRow.classList.add('rscards-row');

  const authoredCards = block.querySelectorAll('[data-aue-model="rsCard"]');

  authoredCards.forEach((cardNode) => {
    const cardCol = document.createElement('div');
    cardCol.classList.add('rscards-col-xl-4', 'rscards-col-lg-6', 'rscards-pb-md-0', 'rscards-pb-4', 'rscards-row-gap-4', 'rscards-koi-rscard-padding');

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('rscards-card', 'rscards-rs-card');

    const imageContainer = document.createElement('div');
    const image = cardNode.querySelector('[data-aue-prop="image"]');
    if (image) {
      const picture = createOptimizedPicture(image.src, image.alt);
      picture.querySelector('img').classList.add('rscards-w-100', 'rscards-kitchens-image');
      imageContainer.append(picture);
      moveInstrumentation(image, imageContainer);
    } else {
      // Fallback for image if data-aue-prop is not found, look for an img directly
      const imgElement = cardNode.querySelector('img.rscards-kitchens-image');
      if (imgElement) {
        const picture = createOptimizedPicture(imgElement.src, imgElement.alt);
        picture.querySelector('img').classList.add('rscards-w-100', 'rscards-kitchens-image');
        imageContainer.append(picture);
        moveInstrumentation(imgElement, imageContainer);
      }
    }
    cardWrapper.append(imageContainer);

    const cardBody = document.createElement('div');
    cardBody.classList.add('rscards-card-body');

    const iconLink = cardNode.querySelector('[data-aue-prop="icon"]');
    if (iconLink) {
      const linkElement = document.createElement('a');
      linkElement.setAttribute('aria-label', iconLink.getAttribute('aria-label') || '');
      linkElement.setAttribute('target', iconLink.getAttribute('target') || '_self');
      linkElement.setAttribute('id', iconLink.getAttribute('id') || 'explore-btn-hide-id');
      if (iconLink.style.display === 'none') {
        linkElement.style.display = 'none';
      }
      const iconImg = iconLink.querySelector('img');
      if (iconImg) {
        linkElement.append(iconImg);
        moveInstrumentation(iconImg, linkElement);
      }
      cardBody.append(linkElement);
      moveInstrumentation(iconLink, cardBody);
    }

    const titleElement = cardNode.querySelector('[data-aue-prop="title"]');
    if (titleElement) {
      const h5Title = document.createElement('h5');
      h5Title.classList.add('rscards-blog-card-title');
      if (titleElement.style.display === 'block') {
        h5Title.style.display = 'block';
      }
      h5Title.textContent = titleElement.textContent;
      cardBody.append(h5Title);
      moveInstrumentation(titleElement, cardBody);
    }

    const descriptionElement = cardNode.querySelector('[data-aue-prop="description"]');
    if (descriptionElement) {
      const h5Description = document.createElement('h5');
      h5Description.classList.add('rscards-card-title');
      const pDescription = descriptionElement.querySelector('p');
      if (pDescription) {
        h5Description.append(pDescription);
        moveInstrumentation(pDescription, h5Description);
      } else {
        h5Description.textContent = descriptionElement.textContent;
      }
      cardBody.append(h5Description);
      moveInstrumentation(descriptionElement, cardBody);
    }

    cardWrapper.append(cardBody);
    cardCol.append(cardWrapper);
    rsCardsRow.append(cardCol);

    moveInstrumentation(cardNode, cardCol);
  });

  const tabPara = document.createElement('div');
  tabPara.classList.add('rscards-tab-para');
  rsCardsRow.append(tabPara);

  block.textContent = '';
  block.append(rsCardsRow);
  block.className = 'rscards-rs-cards block';
  block.dataset.blockStatus = 'loaded';
}
