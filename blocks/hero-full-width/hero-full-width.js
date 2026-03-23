import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const mediaType = block.dataset.mediaType;

  const heroFullWidthBackground = document.createElement('div');
  heroFullWidthBackground.classList.add('hero-cmp-hero-full-width__background');

  const heroFullWidthBackgroundWrapper = document.createElement('div');
  heroFullWidthBackgroundWrapper.classList.add('hero-cmp-hero-full-width__background-wrapper', 'hero-zoom-out');

  const heroFullWidthContent = document.createElement('div');
  heroFullWidthContent.classList.add('hero-cmp-hero-full-width__content');

  // Background Video
  if (mediaType === 'videoTypeSelected') {
    const videoElement = document.createElement('video');
    videoElement.classList.add('hero-cmp-hero-full-width__background-video');
    videoElement.setAttribute('loop', '');
    videoElement.setAttribute('muted', '');
    videoElement.setAttribute('playsinline', '');
    videoElement.setAttribute('autoplay', '');
    videoElement.setAttribute('data-responsive-video', '');

    const backgroundVideoHls = block.querySelector('[data-aue-prop="backgroundVideoHls"]');
    const backgroundVideoMp4 = block.querySelector('[data-aue-prop="backgroundVideoMp4"]');

    if (backgroundVideoHls) {
      const sourceHls = document.createElement('source');
      sourceHls.src = backgroundVideoHls.textContent.trim();
      sourceHls.type = 'application/x-mpegURL';
      videoElement.append(sourceHls);
      moveInstrumentation(backgroundVideoHls, sourceHls);
    }

    if (backgroundVideoMp4) {
      const sourceMp4 = document.createElement('source');
      sourceMp4.src = backgroundVideoMp4.textContent.trim();
      sourceMp4.type = 'video/mp4';
      videoElement.append(sourceMp4);
      moveInstrumentation(backgroundVideoMp4, sourceMp4);
    }

    heroFullWidthBackgroundWrapper.append(videoElement);
  }

  heroFullWidthBackground.append(heroFullWidthBackgroundWrapper);

  // Content
  const slideWrap1 = document.createElement('div');
  slideWrap1.classList.add('hero-slide-wrap');
  const slideUp1 = document.createElement('div');
  slideUp1.classList.add('hero-slide-up');
  slideUp1.setAttribute('data-slide-type', 'slide-up');

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('hero-cmp-hero-full-width__content__title');
  titleDiv.setAttribute('tabindex', '0');
  const titleContent = block.querySelector('[data-aue-prop="title"]');
  if (titleContent) {
    titleDiv.append(...titleContent.children);
    moveInstrumentation(titleContent, titleDiv);
  }

  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('hero-cmp-hero-full-width__content__description');
  descriptionDiv.setAttribute('tabindex', '0');
  const descriptionContent = block.querySelector('[data-aue-prop="description"]');
  if (descriptionContent) {
    descriptionDiv.append(...descriptionContent.children);
    moveInstrumentation(descriptionContent, descriptionDiv);
  }

  slideUp1.append(titleDiv, descriptionDiv);
  slideWrap1.append(slideUp1);
  heroFullWidthContent.append(slideWrap1);

  const slideWrap2 = document.createElement('div');
  slideWrap2.classList.add('hero-slide-wrap');
  const slideUp2 = document.createElement('div');
  slideUp2.classList.add('hero-slide-up');
  slideUp2.setAttribute('data-slide-type', 'slide-up');

  const ctasDiv = document.createElement('div');
  ctasDiv.classList.add('hero-cmp-hero-full-width__content--ctas');

  const primaryCtaLink = block.querySelector('[data-aue-prop="primaryCtaLink"]');
  const primaryCtaLabel = block.querySelector('[data-aue-prop="primaryCtaLabel"]');
  if (primaryCtaLink && primaryCtaLabel) {
    const primaryCta = document.createElement('a');
    primaryCta.classList.add('hero-cta', 'hero-cta__secondary', 'hero-primaryCta');
    primaryCta.href = primaryCtaLink.textContent.trim();
    primaryCta.setAttribute('target', '_self');
    primaryCta.setAttribute('aria-label', primaryCtaLabel.textContent.trim());
    primaryCta.setAttribute('data-palette', 'palette-light');

    const primaryCtaSpan = document.createElement('span');
    primaryCtaSpan.classList.add('hero-cta__label');
    primaryCtaSpan.textContent = primaryCtaLabel.textContent.trim();
    primaryCta.append(primaryCtaSpan);
    ctasDiv.append(primaryCta);
    moveInstrumentation(primaryCtaLink, primaryCta);
    moveInstrumentation(primaryCtaLabel, primaryCtaSpan);
  }

  const chevronWrapper = document.createElement('div');
  chevronWrapper.classList.add('hero-chevron-wrapper');

  const chevronButton = document.createElement('button');
  chevronButton.type = 'button';
  chevronButton.classList.add('hero-chevron-icon');
  chevronButton.setAttribute('aria-label', 'Open video modal');
  chevronWrapper.append(chevronButton);

  const secondaryCtaLink = block.querySelector('[data-aue-prop="secondaryCtaLink"]');
  const secondaryCtaLabel = block.querySelector('[data-aue-prop="secondaryCtaLabel"]');
  if (secondaryCtaLink && secondaryCtaLabel) {
    const secondaryCta = document.createElement('a');
    secondaryCta.classList.add('hero-cta', 'hero-cta__link', 'hero-secondaryCta');
    secondaryCta.href = secondaryCtaLink.textContent.trim();
    secondaryCta.setAttribute('target', '_self');
    secondaryCta.setAttribute('aria-label', secondaryCtaLabel.textContent.trim());
    secondaryCta.setAttribute('data-palette', 'palette-light');

    const secondaryCtaIcon = document.createElement('span');
    secondaryCtaIcon.classList.add('hero-cta__icon', 'hero-qd-icon', 'hero-qd-icon--cheveron-right');
    secondaryCtaIcon.setAttribute('aria-hidden', 'true');
    secondaryCta.append(secondaryCtaIcon);

    const secondaryCtaSpan = document.createElement('span');
    secondaryCtaSpan.classList.add('hero-cta__label');
    secondaryCtaSpan.textContent = secondaryCtaLabel.textContent.trim();
    secondaryCta.append(secondaryCtaSpan);
    chevronWrapper.append(secondaryCta);
    moveInstrumentation(secondaryCtaLink, secondaryCta);
    moveInstrumentation(secondaryCtaLabel, secondaryCtaSpan);
  }

  ctasDiv.append(chevronWrapper);
  slideUp2.append(ctasDiv);
  slideWrap2.append(slideUp2);
  heroFullWidthContent.append(slideWrap2);

  // Modal Dialog (simplified, only structure for now)
  const dialog = document.createElement('dialog');
  dialog.classList.add('hero-cmp-hero-full-width__content--modal');
  dialog.id = 'home-page-video-dialog';
  dialog.setAttribute('closedby', 'any');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', 'Video Modal');

  const dialogForm = document.createElement('form');
  dialogForm.method = 'dialog';
  const closeButton = document.createElement('button');
  closeButton.classList.add('hero-cmp-hero-full-width__content--modal__close-button');
  closeButton.setAttribute('aria-label', 'Close Video');
  closeButton.setAttribute('tabindex', '0');
  closeButton.textContent = 'X';
  dialogForm.append(closeButton);
  dialog.append(dialogForm);

  const videoModalDiv = document.createElement('div');
  videoModalDiv.classList.add('hero-video', 'hero-cmp-hero-full-width__content--modal__video');
  const videoContainer = document.createElement('div');
  videoContainer.classList.add('hero-video-container', 'hero-show-controls');
  const viewportVideo = document.createElement('div');
  viewportVideo.classList.add('hero-viewport-video');
  viewportVideo.setAttribute('hidden', '');
  viewportVideo.setAttribute('aria-hidden', 'true');
  videoContainer.append(viewportVideo);

  const videoControls = document.createElement('div');
  videoControls.classList.add('hero-video-container__controls');
  // ... (add detailed controls structure if needed, but for now, just the container)
  videoContainer.append(videoControls);

  const modalVideoElement = document.createElement('video');
  modalVideoElement.classList.add('hero-video-container__video');
  modalVideoElement.setAttribute('playsinline', '');
  modalVideoElement.setAttribute('webkit-playsinline', '');
  modalVideoElement.setAttribute('x-webkit-airplay', 'allow');
  // The modal video src will be set dynamically by JS, but we can add data-video-src if available
  if (backgroundVideoHls) {
    modalVideoElement.setAttribute('data-video-src', backgroundVideoHls.textContent.trim());
    modalVideoElement.src = backgroundVideoHls.textContent.trim();
  } else if (backgroundVideoMp4) {
    modalVideoElement.setAttribute('data-video-src', backgroundVideoMp4.textContent.trim());
    modalVideoElement.src = backgroundVideoMp4.textContent.trim();
  }
  videoContainer.append(modalVideoElement);

  videoModalDiv.append(videoContainer);
  dialog.append(videoModalDiv);

  heroFullWidthContent.append(dialog);

  block.textContent = '';

  block.append(heroFullWidthBackground);
  block.append(heroFullWidthContent);

  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
