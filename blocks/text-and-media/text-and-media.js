import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const textAndMediaWrapper = document.createElement('div');
  textAndMediaWrapper.classList.add('text-and-media-wrapper');

  const imageScarp = block.querySelector('img.text-and-media-text-and-media__scarp');
  if (imageScarp) {
    textAndMediaWrapper.append(imageScarp);
    moveInstrumentation(imageScarp, textAndMediaWrapper);
  }

  const cmpTextAndMedia = document.createElement('div');
  cmpTextAndMedia.classList.add('text-and-media-cmp-text-and-media');
  cmpTextAndMedia.setAttribute('data-cmp-is', 'text-and-media');
  cmpTextAndMedia.setAttribute('aria-labelledby', 'text-and-media-title');
  cmpTextAndMedia.style.overflow = 'hidden';
  cmpTextAndMedia.setAttribute('is-animated', 'true');
  cmpTextAndMedia.setAttribute('data-is-reverse', 'true');

  const imageContainer = document.createElement('div');
  imageContainer.classList.add(
    'text-and-media-cmp-text-and-media--image-container',
    'text-and-media-animate-image-container-up-fade',
    'text-and-media-in-viewport',
    'text-and-media-slide-up',
  );
  imageContainer.setAttribute('data-slide-type', 'slide-up');
  imageContainer.setAttribute('data-slide-no-wrap', '');

  const authoredImage = block.querySelector('[data-aue-prop="image"]');
  if (authoredImage) {
    const picture = createOptimizedPicture(authoredImage.src, authoredImage.alt);
    picture.classList.add('text-and-media-cmp-text-and-media--image-container__picture');
    const img = picture.querySelector('img');
    if (img) {
      img.classList.add(
        'text-and-media-cmp-text-and-media--image-container__image',
        'text-and-media-layout-portrait',
        'text-and-media-animate-image-zoom-out',
        'text-and-media-in-viewport',
      );
      img.setAttribute('role', 'img');
    }
    imageContainer.append(picture);
    moveInstrumentation(authoredImage, picture);
  }
  cmpTextAndMedia.append(imageContainer);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('text-and-media-cmp-text-and-media--content', 'text-and-media-in-viewport');

  const slideWrap = document.createElement('div');
  slideWrap.classList.add('text-and-media-slide-wrap');

  const slideUpDiv = document.createElement('div');
  slideUpDiv.setAttribute('data-slide-type', 'slide-up');
  slideUpDiv.classList.add('text-and-media-slide-up');

  const titleDiv = document.createElement('div');
  titleDiv.id = 'text-and-media-title';
  titleDiv.classList.add('text-and-media-cmp-text-and-media--content__title');
  titleDiv.setAttribute('tabindex', '0');
  const authoredTitle = block.querySelector('[data-aue-prop="title"]');
  if (authoredTitle) {
    titleDiv.append(...authoredTitle.childNodes);
    moveInstrumentation(authoredTitle, titleDiv);
  } else {
    const h2 = block.querySelector('h2');
    if (h2) {
      titleDiv.append(h2);
      moveInstrumentation(h2, titleDiv);
    }
  }
  slideUpDiv.append(titleDiv);

  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('text-and-media-cmp-text-and-media--content__description');
  descriptionDiv.setAttribute('tabindex', '0');
  const authoredDescription = block.querySelector('[data-aue-prop="description"]');
  if (authoredDescription) {
    descriptionDiv.append(...authoredDescription.childNodes);
    moveInstrumentation(authoredDescription, descriptionDiv);
  } else {
    const p = block.querySelector('p');
    if (p) {
      descriptionDiv.append(p);
      moveInstrumentation(p, descriptionDiv);
    }
  }
  slideUpDiv.append(descriptionDiv);

  const ctaLink = block.querySelector('[data-aue-prop="ctaLink"]');
  const ctaLabel = block.querySelector('[data-aue-prop="ctaLabel"]');
  const authoredCta = block.querySelector('.button-container a');

  if (authoredCta) {
    const cta = document.createElement('a');
    cta.href = authoredCta.href;
    cta.classList.add('text-and-media-cta', 'text-and-media-cta__primary', 'text-and-media-cmp-text-and-media--content__cta');
    if (authoredCta.target) {
      cta.target = authoredCta.target;
    }
    if (authoredCta.getAttribute('aria-label')) {
      cta.setAttribute('aria-label', authoredCta.getAttribute('aria-label'));
    }

    const ctaIcon = document.createElement('span');
    ctaIcon.classList.add('text-and-media-cta__icon', 'text-and-media-qd-icon', 'text-and-media-qd-icon--cheveron-right');
    ctaIcon.setAttribute('aria-hidden', 'true');
    cta.append(ctaIcon);

    const ctaLabelSpan = document.createElement('span');
    ctaLabelSpan.classList.add('text-and-media-cta__label');
    if (ctaLabel) {
      ctaLabelSpan.textContent = ctaLabel.textContent.trim();
      moveInstrumentation(ctaLabel, ctaLabelSpan);
    } else {
      ctaLabelSpan.textContent = authoredCta.textContent.trim();
    }
    cta.append(ctaLabelSpan);

    slideUpDiv.append(cta);
    moveInstrumentation(authoredCta, cta);
    if (ctaLink) moveInstrumentation(ctaLink, cta);
  }

  slideWrap.append(slideUpDiv);
  contentDiv.append(slideWrap);
  cmpTextAndMedia.append(contentDiv);

  const overflowFix = document.createElement('div');
  overflowFix.classList.add('text-and-media-cmp-text-and-media-overflow-fix');
  cmpTextAndMedia.append(overflowFix);

  textAndMediaWrapper.append(cmpTextAndMedia);

  block.textContent = '';
  block.append(textAndMediaWrapper);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}