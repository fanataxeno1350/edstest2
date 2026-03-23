import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('text-and-media-wrapper');
  moveInstrumentation(block.firstElementChild, wrapperDiv);

  const imageContainer = document.createElement('div');
  imageContainer.classList.add('text-and-media--image-container');
  imageContainer.classList.add('text-and-media-animate-image-container-up-fade');
  imageContainer.classList.add('text-and-media-in-viewport');
  imageContainer.classList.add('text-and-media-slide-up');
  imageContainer.dataset.slideType = 'slide-up';
  imageContainer.dataset.slideNoWrap = '';

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
    imageContainer.append(picture);
    moveInstrumentation(authoredImage, imageContainer);
  }

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('text-and-media--content');
  contentDiv.classList.add('text-and-media-in-viewport');

  const slideWrapDiv = document.createElement('div');
  slideWrapDiv.classList.add('text-and-media-slide-wrap');

  const innerSlideDiv = document.createElement('div');
  innerSlideDiv.classList.add('text-and-media-slide-up');
  innerSlideDiv.dataset.slideType = 'slide-up';

  const titleDiv = document.createElement('div');
  titleDiv.id = 'text-and-media-title';
  titleDiv.classList.add('text-and-media--content__title');
  titleDiv.setAttribute('tabindex', '0');
  const authoredTitle = block.querySelector('[data-aue-prop="title"]');
  if (authoredTitle) {
    titleDiv.append(...authoredTitle.children);
    moveInstrumentation(authoredTitle, titleDiv);
  }

  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('text-and-media--content__description');
  descriptionDiv.setAttribute('tabindex', '0');
  const authoredDescription = block.querySelector('[data-aue-prop="description"]');
  if (authoredDescription) {
    descriptionDiv.append(...authoredDescription.children);
    moveInstrumentation(authoredDescription, descriptionDiv);
  }

  const ctaLink = block.querySelector('[data-aue-prop="ctaLink"]');
  if (ctaLink) {
    const link = document.createElement('a');
    link.classList.add('text-and-media-cta');
    link.classList.add('text-and-media-cta__primary');
    link.classList.add('text-and-media--content__cta');
    link.href = ctaLink.href;
    link.target = '_self';
    link.setAttribute('aria-label', ctaLink.textContent.trim());

    const iconSpan = document.createElement('span');
    iconSpan.classList.add('text-and-media-cta__icon');
    iconSpan.classList.add('text-and-media-qd-icon');
    iconSpan.classList.add('text-and-media-qd-icon--cheveron-right');
    iconSpan.setAttribute('aria-hidden', 'true');

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('text-and-media-cta__label');
    labelSpan.textContent = ctaLink.textContent.trim();

    link.append(iconSpan, labelSpan);
    innerSlideDiv.append(link);
    moveInstrumentation(ctaLink, link);
  }

  innerSlideDiv.prepend(titleDiv, descriptionDiv);
  slideWrapDiv.append(innerSlideDiv);
  contentDiv.append(slideWrapDiv);

  const overflowFixDiv = document.createElement('div');
  overflowFixDiv.classList.add('text-and-media-overflow-fix');

  const textAndMediaDiv = document.createElement('div');
  textAndMediaDiv.classList.add('text-and-media-text-and-media');
  textAndMediaDiv.dataset.cmpIs = 'text-and-media';
  textAndMediaDiv.setAttribute('aria-labelledby', 'text-and-media-title');
  textAndMediaDiv.style.overflow = 'hidden';
  textAndMediaDiv.setAttribute('is-animated', 'true');
  textAndMediaDiv.dataset.isReverse = 'true';
  textAndMediaDiv.append(imageContainer, contentDiv, overflowFixDiv);

  wrapperDiv.append(textAndMediaDiv);

  block.textContent = '';
  block.append(wrapperDiv);
  block.className = 'text-and-media-text-and-media text-and-media-true block';
  block.dataset.blockStatus = 'loaded';
}