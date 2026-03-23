import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const mainDiv = document.createElement('div');
  mainDiv.classList.add('card-list-cmp-card-list__content');

  const topContentDiv = document.createElement('div');
  topContentDiv.classList.add('card-list-slide-wrap');
  mainDiv.append(topContentDiv);

  const topContentInnerDiv = document.createElement('div');
  topContentInnerDiv.classList.add('card-list-cmp-card-list__content__top', 'card-list-slide-up');
  topContentInnerDiv.setAttribute('data-slide-type', 'slide-up');
  topContentDiv.append(topContentInnerDiv);

  const headingWrapper = document.createElement('div');
  headingWrapper.classList.add('card-list-cmp-card-list__content__heading', 'card-list-is-visible');
  topContentInnerDiv.append(headingWrapper);

  const headingTitle = document.createElement('div');
  headingTitle.id = 'card-list-heading';
  headingTitle.classList.add('card-list-cmp-card-list__content__heading__title');
  headingTitle.setAttribute('tabindex', '0');
  headingWrapper.append(headingTitle);

  const authoredHeading = block.querySelector('[data-aue-prop="heading"]');
  if (authoredHeading) {
    headingTitle.append(authoredHeading);
    moveInstrumentation(authoredHeading, headingTitle);
  }

  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add('card-list-cmp-card-list__content__cta-wrapper', 'card-list-is-visible');
  topContentInnerDiv.append(ctaWrapper);

  const authoredCta = block.querySelector('[data-aue-prop="cta"]');
  if (authoredCta) {
    const ctaLink = authoredCta.querySelector('a');
    if (ctaLink) {
      const newCtaLink = document.createElement('a');
      newCtaLink.href = ctaLink.href;
      newCtaLink.classList.add('card-list-cta', 'card-list-cta__primary');
      newCtaLink.target = ctaLink.target;
      newCtaLink.setAttribute('aria-label', ctaLink.getAttribute('aria-label') || ctaLink.textContent.trim());
      newCtaLink.setAttribute('data-palette', 'palette-1');

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('card-list-cta__icon', 'card-list-qd-icon', 'card-list-qd-icon--cheveron-right');
      iconSpan.setAttribute('aria-hidden', 'true');
      newCtaLink.append(iconSpan);

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('card-list-cta__label');
      labelSpan.textContent = ctaLink.textContent.trim();
      newCtaLink.append(labelSpan);

      ctaWrapper.append(newCtaLink);
      moveInstrumentation(authoredCta, ctaWrapper);
    }
  }

  const itemsDiv = document.createElement('div');
  itemsDiv.classList.add('card-list-cmp-card-list__content__items');
  mainDiv.append(itemsDiv);

  const authoredCards = block.querySelectorAll('[data-aue-model="card"]');
  authoredCards.forEach((cardNode, index) => {
    const cardItemDiv = document.createElement('div');
    cardItemDiv.classList.add('card-list-cmp-card-list__content__card-item', 'card-list-is-visible', 'card-list-slide-up');
    cardItemDiv.setAttribute('data-animation', 'card');
    cardItemDiv.setAttribute('data-slide-type', 'slide-up');
    cardItemDiv.setAttribute('data-slide-no-wrap', '');
    cardItemDiv.setAttribute('data-slide-delay', `${index * 100}`.padStart(3, '0'));
    cardItemDiv.style.transitionDelay = `${index * 0.2}s`;

    const authoredImage = cardNode.querySelector('[data-aue-prop="image"]');
    if (authoredImage) {
      const img = authoredImage.querySelector('img');
      if (img) {
        const picture = createOptimizedPicture(img.src, img.alt);
        cardItemDiv.append(picture);
        moveInstrumentation(authoredImage, picture);
      }
    }

    const cardContentDiv = document.createElement('div');
    cardContentDiv.classList.add('card-list-cmp-card-list__content__card-item-content');
    cardItemDiv.append(cardContentDiv);

    const headingWrapperCard = document.createElement('div');
    headingWrapperCard.classList.add('card-list-cmp-card-list__content__card-item-content__heading-wrapper');
    headingWrapperCard.setAttribute('tabindex', '0');
    cardContentDiv.append(headingWrapperCard);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('card-list-cmp-card-list__content__card-item-content__title');
    titleDiv.setAttribute('aria-hidden', 'false');
    headingWrapperCard.append(titleDiv);

    const authoredTitle = cardNode.querySelector('[data-aue-prop="title"]');
    if (authoredTitle) {
      titleDiv.append(authoredTitle);
      moveInstrumentation(authoredTitle, titleDiv);
    }

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('card-list-cmp-card-list__content__card-item-content__description');
    descriptionDiv.setAttribute('tabindex', '0');
    descriptionDiv.setAttribute('aria-hidden', 'false');
    cardContentDiv.append(descriptionDiv);

    const authoredDescription = cardNode.querySelector('[data-aue-prop="description"]');
    if (authoredDescription) {
      descriptionDiv.append(authoredDescription);
      moveInstrumentation(authoredDescription, descriptionDiv);
    }

    itemsDiv.append(cardItemDiv);
    moveInstrumentation(cardNode, cardItemDiv);
  });

  block.textContent = '';
  block.classList.add('card-list-parallax-child');
  block.append(mainDiv);
  block.dataset.blockStatus = 'loaded';
}
