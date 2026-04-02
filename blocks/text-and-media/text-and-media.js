import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    scarpImageRow,
    mainImageRow,
    titleRow,
    descriptionRow,
    ctaLinkRow,
    ctaLabelRow,
  ] = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.classList.add('cmp-text-and-media-wrapper');

  // Scarp Image
  const scarpImagePicture = scarpImageRow.querySelector('picture');
  if (scarpImagePicture) {
    const scarpImg = scarpImagePicture.querySelector('img');
    const scarpOptimizedPic = createOptimizedPicture(scarpImg.src, scarpImg.alt, false, [{ width: '750' }]);
    const newScarpImg = scarpOptimizedPic.querySelector('img');
    moveInstrumentation(scarpImg, newScarpImg);

    const scarpImageElement = document.createElement('img');
    scarpImageElement.classList.add('cmp-text-and-media__scarp', 'fade-in');
    scarpImageElement.src = newScarpImg.src;
    scarpImageElement.alt = newScarpImg.alt;
    wrapper.append(scarpImageElement);
  }

  const cmpTextAndMedia = document.createElement('div');
  cmpTextAndMedia.classList.add('cmp-text-and-media');
  cmpTextAndMedia.setAttribute('data-cmp-is', 'text-and-media');
  cmpTextAndMedia.setAttribute('aria-labelledby', 'text-and-media-title');
  cmpTextAndMedia.style.overflow = 'hidden';
  cmpTextAndMedia.setAttribute('is-animated', 'true');
  cmpTextAndMedia.setAttribute('data-is-reverse', 'true');

  // Main Image
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('cmp-text-and-media--image-container', 'animate-image-container-up-fade', 'in-viewport', 'slide-up');
  imageContainer.setAttribute('data-slide-type', 'slide-up');
  imageContainer.setAttribute('data-slide-no-wrap', '');

  const mainImagePicture = mainImageRow.querySelector('picture');
  if (mainImagePicture) {
    const mainImg = mainImagePicture.querySelector('img');
    const mainOptimizedPic = createOptimizedPicture(mainImg.src, mainImg.alt, false, [{ width: '750' }]);
    const newMainImg = mainOptimizedPic.querySelector('img');
    moveInstrumentation(mainImg, newMainImg);

    const pictureElement = document.createElement('picture');
    pictureElement.classList.add('cmp-text-and-media--image-container__picture');
    pictureElement.append(...mainOptimizedPic.children);

    newMainImg.classList.add('cmp-text-and-media--image-container__image', 'layout-portrait', 'animate-image-zoom-out', 'in-viewport');
    newMainImg.setAttribute('role', 'img');
    // The createOptimizedPicture already handles sources, no need to manually set srcset on a new source.
    // Ensure the img element itself is updated if needed, but the picture element should contain the correct sources.
    imageContainer.append(pictureElement);
  }
  cmpTextAndMedia.append(imageContainer);

  // Content
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('cmp-text-and-media--content', 'in-viewport');

  const slideWrap = document.createElement('div');
  slideWrap.classList.add('slide-wrap');

  const slideUpDiv = document.createElement('div');
  slideUpDiv.setAttribute('data-slide-type', 'slide-up');
  slideUpDiv.classList.add('slide-up');

  // Title
  const titleDiv = document.createElement('div');
  moveInstrumentation(titleRow, titleDiv);
  titleDiv.id = 'text-and-media-title';
  titleDiv.classList.add('cmp-text-and-media--content__title');
  titleDiv.setAttribute('tabindex', '0');
  while (titleRow.firstElementChild) titleDiv.append(titleRow.firstElementChild); // Append actual content, not just firstChild
  // Add semi-bold class to span if present in original
  titleDiv.querySelectorAll('b').forEach((b) => {
    const span = document.createElement('span');
    span.classList.add('semi-bold');
    moveInstrumentation(b, span);
    while (b.firstChild) span.append(b.firstChild);
    b.replaceWith(span);
  });
  slideUpDiv.append(titleDiv);

  // Description
  const descriptionDiv = document.createElement('div');
  moveInstrumentation(descriptionRow, descriptionDiv);
  descriptionDiv.classList.add('cmp-text-and-media--content__description');
  descriptionDiv.setAttribute('tabindex', '0');
  while (descriptionRow.firstElementChild) descriptionDiv.append(descriptionRow.firstElementChild); // Append actual content
  slideUpDiv.append(descriptionDiv);

  // CTA Link
  const ctaLink = ctaLinkRow.querySelector('a');
  // The ctaLabelRow contains the text content directly, not necessarily a child element.
  const ctaLabel = ctaLabelRow.textContent.trim();

  if (ctaLink && ctaLabel) {
    const ctaAnchor = document.createElement('a');
    ctaAnchor.href = ctaLink.href;
    ctaAnchor.classList.add('cta', 'cta__primary', 'cmp-text-and-media--content__cta');
    ctaAnchor.setAttribute('target', '_self');
    ctaAnchor.setAttribute('aria-label', ctaLabel);

    const ctaIcon = document.createElement('span');
    ctaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
    ctaIcon.setAttribute('aria-hidden', 'true');
    ctaAnchor.append(ctaIcon);

    const ctaLabelSpan = document.createElement('span');
    ctaLabelSpan.classList.add('cta__label');
    ctaLabelSpan.textContent = ctaLabel;
    ctaAnchor.append(ctaLabelSpan);

    slideUpDiv.append(ctaAnchor);
  }

  slideWrap.append(slideUpDiv);
  contentDiv.append(slideWrap);
  cmpTextAndMedia.append(contentDiv);

  const overflowFix = document.createElement('div');
  overflowFix.classList.add('cmp-text-and-media-overflow-fix');
  cmpTextAndMedia.append(overflowFix);

  wrapper.append(cmpTextAndMedia);

  block.textContent = '';
  block.append(wrapper);

  // The initial image processing already uses createOptimizedPicture.
  // This block.querySelectorAll('picture > img').forEach loop is redundant
  // and might re-process images already handled or interfere with the structure.
  // Removing it as the individual image sections already handle optimization.
}
