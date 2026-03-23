import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const mainDiv = document.createElement('div');
  mainDiv.classList.add('card-list-cmp-card-list__content');

  const topContent = document.createElement('div');
  topContent.classList.add('card-list-slide-wrap');
  const topContentInner = document.createElement('div');
  topContentInner.classList.add('card-list-cmp-card-list__content__top', 'card-list-slide-up');
  topContentInner.setAttribute('data-slide-type', 'slide-up');

  const headingWrapper = document.createElement('div');
  headingWrapper.classList.add('card-list-cmp-card-list__content__heading', 'card-list-is-visible');
  const headingDiv = document.createElement('div');
  headingDiv.id = 'card-list-heading';
  headingDiv.classList.add('card-list-cmp-card-list__content__heading__title');
  headingDiv.setAttribute('tabindex', '0');

  const heading = block.querySelector('[data-aue-prop="heading"]');
  if (heading) {
    headingDiv.append(heading);
    moveInstrumentation(heading, headingDiv);
  }
  headingWrapper.append(headingDiv);
  topContentInner.append(headingWrapper);

  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add('card-list-cmp-card-list__content__cta-wrapper', 'card-list-is-visible');

  const ctaLink = block.querySelector('[data-aue-prop="ctaLink"]');
  if (ctaLink) {
    const link = ctaLink.querySelector('a');
    if (link) {
      const newLink = document.createElement('a');
      newLink.href = link.href;
      newLink.classList.add('card-list-cta', 'card-list-cta__primary');
      newLink.target = link.target;
      newLink.setAttribute('aria-label', link.getAttribute('aria-label') || link.textContent);
      newLink.setAttribute('data-palette', 'palette-1');

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('card-list-cta__icon', 'card-list-qd-icon', 'card-list-qd-icon--cheveron-right');
      iconSpan.setAttribute('aria-hidden', 'true');
      newLink.append(iconSpan);

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('card-list-cta__label');
      labelSpan.textContent = link.textContent.trim();
      newLink.append(labelSpan);

      ctaWrapper.append(newLink);
      moveInstrumentation(ctaLink, ctaWrapper);
    }
  }
  topContentInner.append(ctaWrapper);
  topContent.append(topContentInner);
  mainDiv.append(topContent);

  const itemsWrapper = document.createElement('div');
  itemsWrapper.classList.add('card-list-cmp-card-list__content__items');

  const cards = block.querySelectorAll('[data-aue-model="card"]');
  cards.forEach((cardNode, index) => {
    const cardItem = document.createElement('div');
    cardItem.classList.add('card-list-cmp-card-list__content__card-item', 'card-list-is-visible', 'card-list-slide-up');
    cardItem.setAttribute('data-animation', 'card');
    cardItem.setAttribute('data-slide-type', 'slide-up');
    cardItem.setAttribute('data-slide-no-wrap', '');
    cardItem.setAttribute('data-slide-delay', `${index * 100}`.padStart(3, '0'));
    cardItem.style.transitionDelay = `${index * 0.2}s`;

    const imageProp = cardNode.querySelector('[data-aue-prop="image"]');
    if (imageProp) {
      const img = imageProp.querySelector('img');
      if (img) {
        const picture = createOptimizedPicture(img.src, img.alt);
        cardItem.append(picture);
        moveInstrumentation(imageProp, picture);
      }
    }

    const cardContent = document.createElement('div');
    cardContent.classList.add('card-list-cmp-card-list__content__card-item-content');

    const titleWrapper = document.createElement('div');
    titleWrapper.classList.add('card-list-cmp-card-list__content__card-item-content__heading-wrapper');
    titleWrapper.setAttribute('tabindex', '0');

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('card-list-cmp-card-list__content__card-item-content__title');
    titleDiv.setAttribute('aria-hidden', 'false');

    const title = cardNode.querySelector('[data-aue-prop="title"]');
    if (title) {
      titleDiv.append(title);
      moveInstrumentation(title, titleDiv);
    }
    titleWrapper.append(titleDiv);
    cardContent.append(titleWrapper);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('card-list-cmp-card-list__content__card-item-content__description');
    descriptionDiv.setAttribute('tabindex', '0');
    descriptionDiv.setAttribute('aria-hidden', 'false');

    const description = cardNode.querySelector('[data-aue-prop="description"]');
    if (description) {
      descriptionDiv.append(description);
      moveInstrumentation(description, descriptionDiv);
    }
    cardContent.append(descriptionDiv);

    cardItem.append(cardContent);
    itemsWrapper.append(cardItem);
    moveInstrumentation(cardNode, cardItem);
  });

  mainDiv.append(itemsWrapper);

  block.textContent = '';
  block.classList.add('card-list-parallax-child');
  block.append(mainDiv);
  block.dataset.blockStatus = 'loaded';
}
