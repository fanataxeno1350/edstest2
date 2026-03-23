import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('text-and-media-wrapper');

  const imageDiv = document.createElement('div');
  imageDiv.classList.add('text-and-media--image-container');
  imageDiv.classList.add('text-and-media-animate-image-container-up-fade');
  imageDiv.classList.add('text-and-media-in-viewport');
  imageDiv.classList.add('text-and-media-slide-up');
  imageDiv.setAttribute('data-slide-type', 'slide-up');
  imageDiv.setAttribute('data-slide-no-wrap', '');

  const authoredImage = block.querySelector('[data-aue-prop="image"]');
  if (authoredImage) {
    const picture = createOptimizedPicture(authoredImage.src, authoredImage.alt);
    picture.classList.add('text-and-media--image-container__picture');
    const img = picture.querySelector('img');
    if (img) {
      img.classList.add('text-and-media--image-container__image');
      img.classList.add('text-and-media-layout-portrait');
      img.classList.add('text-and-media-animate-image-zoom-out');
      img.classList.add('text-and-media-in-viewport');
      img.setAttribute('role', 'img');
    }
    imageDiv.append(picture);
    moveInstrumentation(authoredImage, imageDiv);
  }

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('text-and-media--content');
  contentDiv.classList.add('text-and-media-in-viewport');

  const slideWrapDiv = document.createElement('div');
  slideWrapDiv.classList.add('text-and-media-slide-wrap');

  const slideUpDiv = document.createElement('div');
  slideUpDiv.setAttribute('data-slide-type', 'slide-up');
  slideUpDiv.classList.add('text-and-media-slide-up');

  const titleDiv = document.createElement('div');
  titleDiv.id = 'text-and-media-title';
  titleDiv.classList.add('text-and-media--content__title');
  titleDiv.setAttribute('tabindex', '0');
  const authoredTitle = block.querySelector('[data-aue-prop="title"]');
  if (authoredTitle) {
    titleDiv.append(authoredTitle);
    moveInstrumentation(authoredTitle, titleDiv);
  }

  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('text-and-media--content__description');
  descriptionDiv.setAttribute('tabindex', '0');
  const authoredDescription = block.querySelector('[data-aue-prop="description"]');
  if (authoredDescription) {
    descriptionDiv.append(authoredDescription);
    moveInstrumentation(authoredDescription, descriptionDiv);
  }

  const ctaLink = block.querySelector('[data-aue-prop="ctaLink"]');
  const ctaLabel = block.querySelector('[data-aue-prop="ctaLabel"]');
  const authoredCta = block.querySelector('.button-container a');

  if (authoredCta) {
    authoredCta.classList.add('text-and-media-cta');
    authoredCta.classList.add('text-and-media-cta__primary');
    authoredCta.classList.add('text-and-media--content__cta');
    authoredCta.setAttribute('target', '_self');

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('text-and-media-cta__icon');
    iconSpan.classList.add('text-and-media-qd-icon');
    iconSpan.classList.add('text-and-media-qd-icon--cheveron-right');
    iconSpan.setAttribute('aria-hidden', 'true');

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('text-and-media-cta__label');
    if (ctaLabel) { // Use ctaLabel if available, otherwise fallback to link text
      labelSpan.textContent = ctaLabel.textContent;
      moveInstrumentation(ctaLabel, labelSpan);
    } else {
      labelSpan.textContent = authoredCta.textContent;
    }

    authoredCta.textContent = ''; // Clear original content
    authoredCta.append(iconSpan, labelSpan);
    slideUpDiv.append(authoredCta);
    moveInstrumentation(authoredCta, slideUpDiv);
  } else if (ctaLink && ctaLabel) {
    const newCta = document.createElement('a');
    newCta.href = ctaLink.href || '#';
    newCta.classList.add('text-and-media-cta');
    newCta.classList.add('text-and-media-cta__primary');
    newCta.classList.add('text-and-media--content__cta');
    newCta.setAttribute('target', '_self');

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('text-and-media-cta__icon');
    iconSpan.classList.add('text-and-media-qd-icon');
    iconSpan.classList.add('text-and-media-qd-icon--cheveron-right');
    iconSpan.setAttribute('aria-hidden', 'true');

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('text-and-media-cta__label');
    labelSpan.textContent = ctaLabel.textContent;
    moveInstrumentation(ctaLabel, labelSpan);

    newCta.append(iconSpan, labelSpan);
    slideUpDiv.append(newCta);
    moveInstrumentation(ctaLink, newCta);
  }

  slideUpDiv.append(titleDiv, descriptionDiv);
  slideWrapDiv.append(slideUpDiv);
  contentDiv.append(slideWrapDiv);

  const overflowFixDiv = document.createElement('div');
  overflowFixDiv.classList.add('text-and-media-overflow-fix');

  const textAndMediaDiv = document.createElement('div');
  textAndMediaDiv.classList.add('text-and-media-text-and-media');
  textAndMediaDiv.setAttribute('data-cmp-is', 'text-and-media');
  textAndMediaDiv.setAttribute('aria-labelledby', 'text-and-media-title');
  textAndMediaDiv.style.overflow = 'hidden';
  textAndMediaDiv.setAttribute('is-animated', 'true');
  textAndMediaDiv.setAttribute('data-is-reverse', 'true');

  textAndMediaDiv.append(imageDiv, contentDiv, overflowFixDiv);
  wrapperDiv.append(textAndMediaDiv);

  block.textContent = '';
  block.append(wrapperDiv);
  block.className = `text-and-media-text-and-media text-and-media-true block`;
  block.dataset.blockStatus = 'loaded';
}
