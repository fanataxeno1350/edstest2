import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('card-list-cmp-card-list__content');

  const slideWrapDiv = document.createElement('div');
  slideWrapDiv.classList.add('card-list-slide-wrap');

  const contentTopDiv = document.createElement('div');
  contentTopDiv.classList.add('card-list-cmp-card-list__content__top', 'card-list-slide-up');
  contentTopDiv.setAttribute('data-slide-type', 'slide-up');

  const headingWrapperDiv = document.createElement('div');
  headingWrapperDiv.classList.add('card-list-cmp-card-list__content__heading', 'card-list-is-visible');

  const headingDiv = document.createElement('div');
  headingDiv.id = 'card-list-heading';
  headingDiv.classList.add('card-list-cmp-card-list__content__heading__title');
  headingDiv.setAttribute('tabindex', '0');

  const authoredHeading = block.querySelector('[data-aue-prop="heading"]');
  if (authoredHeading) {
    const h2 = document.createElement('h2');
    h2.append(...authoredHeading.childNodes);
    headingDiv.append(h2);
    moveInstrumentation(authoredHeading, h2);
  } else {
    // Fallback if data-aue-prop is not present, look for the first h2
    const h2 = block.querySelector('h2');
    if (h2) {
      headingDiv.append(h2);
    }
  }

  headingWrapperDiv.append(headingDiv);

  const ctaWrapperDiv = document.createElement('div');
  ctaWrapperDiv.classList.add('card-list-cmp-card-list__content__cta-wrapper', 'card-list-is-visible');

  const authoredCtaLink = block.querySelector('[data-aue-prop="ctaLink"]');
  if (authoredCtaLink) {
    const ctaLink = document.createElement('a');
    ctaLink.href = authoredCtaLink.href;
    ctaLink.classList.add('card-list-cta', 'card-list-cta__primary');
    ctaLink.target = authoredCtaLink.target || '_self';
    ctaLink.setAttribute('aria-label', authoredCtaLink.getAttribute('aria-label') || authoredCtaLink.textContent);
    ctaLink.setAttribute('data-palette', 'palette-1');

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('card-list-cta__icon', 'card-list-qd-icon', 'card-list-qd-icon--cheveron-right');
    iconSpan.setAttribute('aria-hidden', 'true');
    ctaLink.append(iconSpan);

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('card-list-cta__label');
    labelSpan.textContent = authoredCtaLink.textContent.trim();
    ctaLink.append(labelSpan);

    ctaWrapperDiv.append(ctaLink);
    moveInstrumentation(authoredCtaLink, ctaLink);
  } else {
    // Fallback if data-aue-prop is not present, look for the first link in .button-container
    const fallbackCta = block.querySelector('.button-container a');
    if (fallbackCta) {
      const ctaLink = document.createElement('a');
      ctaLink.href = fallbackCta.href;
      ctaLink.classList.add('card-list-cta', 'card-list-cta__primary');
      ctaLink.target = fallbackCta.target || '_self';
      ctaLink.setAttribute('aria-label', fallbackCta.getAttribute('aria-label') || fallbackCta.textContent);
      ctaLink.setAttribute('data-palette', 'palette-1');

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('card-list-cta__icon', 'card-list-qd-icon', 'card-list-qd-icon--cheveron-right');
      iconSpan.setAttribute('aria-hidden', 'true');
      ctaLink.append(iconSpan);

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('card-list-cta__label');
      labelSpan.textContent = fallbackCta.textContent.trim();
      ctaLink.append(labelSpan);

      ctaWrapperDiv.append(ctaLink);
      moveInstrumentation(fallbackCta, ctaLink);
    }
  }

  contentTopDiv.append(headingWrapperDiv, ctaWrapperDiv);
  slideWrapDiv.append(contentTopDiv);
  contentDiv.append(slideWrapDiv);

  const itemsDiv = document.createElement('div');
  itemsDiv.classList.add('card-list-cmp-card-list__content__items');

  const authoredCards = block.querySelectorAll('[data-aue-model="card"]');
  authoredCards.forEach((cardNode) => {
    const cardItemDiv = document.createElement('div');
    cardItemDiv.classList.add('card-list-cmp-card-list__content__card-item', 'card-list-is-visible', 'card-list-slide-up');
    cardItemDiv.setAttribute('data-animation', 'card');
    cardItemDiv.setAttribute('data-slide-type', 'slide-up');
    cardItemDiv.setAttribute('data-slide-no-wrap', '');
    cardItemDiv.setAttribute('data-slide-delay', '000');
    cardItemDiv.style.transitionDelay = '0s';

    const authoredImage = cardNode.querySelector('[data-aue-prop="image"]');
    if (authoredImage) {
      const picture = createOptimizedPicture(authoredImage.src, authoredImage.alt);
      cardItemDiv.append(picture);
      moveInstrumentation(authoredImage, picture);
    }

    const cardItemContentDiv = document.createElement('div');
    cardItemContentDiv.classList.add('card-list-cmp-card-list__content__card-item-content');

    const headingWrapper = document.createElement('div');
    headingWrapper.classList.add('card-list-cmp-card-list__content__card-item-content__heading-wrapper');
    headingWrapper.setAttribute('tabindex', '0');

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('card-list-cmp-card-list__content__card-item-content__title');
    titleDiv.setAttribute('aria-hidden', 'false');

    const authoredTitle = cardNode.querySelector('[data-aue-prop="title"]');
    if (authoredTitle) {
      titleDiv.append(...authoredTitle.childNodes);
      moveInstrumentation(authoredTitle, titleDiv);
    } else {
      // Fallback to first p if data-aue-prop is not present
      const fallbackTitle = cardNode.querySelector('p');
      if (fallbackTitle) {
        titleDiv.append(fallbackTitle.textContent);
      }
    }

    headingWrapper.append(titleDiv);
    cardItemContentDiv.append(headingWrapper);

    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('card-list-cmp-card-list__content__card-item-content__description');
    descriptionDiv.setAttribute('tabindex', '0');
    descriptionDiv.setAttribute('aria-hidden', 'false');

    const authoredDescription = cardNode.querySelector('[data-aue-prop="description"]');
    if (authoredDescription) {
      descriptionDiv.append(...authoredDescription.childNodes);
      moveInstrumentation(authoredDescription, descriptionDiv);
    } else {
      // Fallback to first p if data-aue-prop is not present
      const fallbackDescription = cardNode.querySelector('p:nth-of-type(2)'); // Assuming title is first p
      if (fallbackDescription) {
        descriptionDiv.append(fallbackDescription.textContent);
      }
    }

    cardItemContentDiv.append(descriptionDiv);
    cardItemDiv.append(cardItemContentDiv);

    itemsDiv.append(cardItemDiv);
    moveInstrumentation(cardNode, cardItemDiv);
  });

  contentDiv.append(itemsDiv);

  block.textContent = '';
  block.append(contentDiv);
  block.className = `card-list-cmp-card-list card-list-parallax-child ${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
