import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const mediaType = block.dataset.mediaType;

  const backgroundDiv = document.createElement('div');
  backgroundDiv.className = 'cmp-hero-full-width__background';
  const backgroundWrapper = document.createElement('div');
  backgroundWrapper.className = 'cmp-hero-full-width__background-wrapper zoom-out';
  backgroundDiv.append(backgroundWrapper);

  const contentDiv = document.createElement('div');
  contentDiv.className = 'cmp-hero-full-width__content';

  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'slide-wrap';
  const titleSlideUp = document.createElement('div');
  titleSlideUp.dataset.slideType = 'slide-up';
  titleSlideUp.className = 'slide-up';
  titleWrapper.append(titleSlideUp);

  const descriptionWrapper = document.createElement('div');
  descriptionWrapper.className = 'slide-wrap';
  const descriptionSlideUp = document.createElement('div');
  descriptionSlideUp.dataset.slideType = 'slide-up';
  descriptionSlideUp.className = 'slide-up';
  descriptionWrapper.append(descriptionSlideUp);

  const ctaWrapper = document.createElement('div');
  ctaWrapper.className = 'slide-wrap';
  const ctaSlideUp = document.createElement('div');
  ctaSlideUp.dataset.slideType = 'slide-up';
  ctaSlideUp.className = 'slide-up';
  ctaWrapper.append(ctaSlideUp);

  const ctaContainer = document.createElement('div');
  ctaContainer.className = 'cmp-hero-full-width__content--ctas';
  ctaSlideUp.append(ctaContainer);

  const chevronWrapper = document.createElement('div');
  chevronWrapper.className = 'chevron-wrapper';

  const dialog = document.createElement('dialog');
  dialog.className = 'cmp-hero-full-width__content--modal';
  dialog.id = 'home-page-video-dialog';
  dialog.setAttribute('closedby', 'any');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', 'Video Modal');

  const dialogForm = document.createElement('form');
  dialogForm.method = 'dialog';
  dialog.append(dialogForm);

  const closeButton = document.createElement('button');
  closeButton.className = 'cmp-hero-full-width__content--modal__close-button';
  closeButton.setAttribute('aria-label', 'Close Video');
  closeButton.tabIndex = 0;
  closeButton.textContent = 'X';
  dialogForm.append(closeButton);

  const videoModalDiv = document.createElement('div');
  videoModalDiv.className = 'video cmp-hero-full-width__content--modal__video';
  dialog.append(videoModalDiv);

  const videoContainer = document.createElement('div');
  videoContainer.className = 'video-container show-controls';
  videoModalDiv.append(videoContainer);

  const viewportVideo = document.createElement('div');
  viewportVideo.className = 'viewport-video';
  viewportVideo.hidden = true;
  viewportVideo.setAttribute('aria-hidden', 'true');
  videoContainer.append(viewportVideo);

  const videoControls = document.createElement('div');
  videoControls.className = 'video-container__controls';
  videoContainer.append(videoControls);

  const timerDiv = document.createElement('div');
  timerDiv.className = 'video-container__controls__timer';
  videoControls.append(timerDiv);

  const progressBarArea = document.createElement('div');
  progressBarArea.className = 'video-container__controls__timer__progress-area';
  timerDiv.append(progressBarArea);

  const progressBar = document.createElement('span');
  progressBar.className = 'video-container__controls__timer__progress-area__progress-bar';
  progressBarArea.append(progressBar);

  const pointer = document.createElement('span');
  pointer.className = 'video-container__controls__timer__progress-area__pointer';
  progressBarArea.append(pointer);

  const progressPending = document.createElement('span');
  progressPending.className = 'video-container__controls__timer__progress-area__progress-pending';
  progressBarArea.append(progressPending);

  const currentTime = document.createElement('p');
  currentTime.className = 'video-container__controls__timer__current-time';
  currentTime.textContent = '00:00';
  timerDiv.append(currentTime);

  const duration = document.createElement('p');
  duration.className = 'video-container__controls__timer__duration';
  duration.textContent = '00:00';
  timerDiv.append(duration);

  const buttonsDiv = document.createElement('div');
  buttonsDiv.className = 'video-container__controls__buttons';
  videoControls.append(buttonsDiv);

  const playButton = document.createElement('button');
  playButton.className = 'video-container__controls__buttons__play-button video-container__controls__buttons--button';
  const playIcon = document.createElement('span');
  playIcon.className = 'video-container__controls__buttons__icon qd-icon qd-icon--play';
  playButton.append(playIcon);
  buttonsDiv.append(playButton);

  const muteButton = document.createElement('button');
  muteButton.className = 'video-container__controls__buttons__mute-button video-container__controls__buttons--button';
  const muteIcon = document.createElement('span');
  muteIcon.className = 'video-container__controls__buttons__icon qd-icon qd-icon--volume';
  muteButton.append(muteIcon);
  buttonsDiv.append(muteButton);

  const fullscreenButton = document.createElement('button');
  fullscreenButton.className = 'video-container__controls__buttons__fullscreen-button video-container__controls__buttons--button';
  const fullscreenIcon = document.createElement('span');
  fullscreenIcon.className = 'video-container__controls__buttons__icon qd-icon qd-icon--fullscreen';
  fullscreenButton.append(fullscreenIcon);
  buttonsDiv.append(fullscreenButton);

  const modalVideo = document.createElement('video');
  modalVideo.className = 'video-container__video';
  modalVideo.playsInline = true;
  modalVideo.setAttribute('webkit-playsinline', '');
  modalVideo.setAttribute('x-webkit-airplay', 'allow');
  videoContainer.append(modalVideo);

  const backgroundVideoElement = block.querySelector('[data-aue-prop="backgroundVideo"]');
  const titleElement = block.querySelector('[data-aue-prop="title"]');
  const descriptionElement = block.querySelector('[data-aue-prop="description"]');
  const primaryCtaLink = block.querySelector('[data-aue-prop="primaryCta"] .button-container a');
  const secondaryCtaLink = block.querySelector('[data-aue-prop="secondaryCta"] .button-container a');

  if (mediaType === 'videoTypeSelected') {
    const video = document.createElement('video');
    video.className = 'cmp-hero-full-width__background-video';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.setAttribute('aria-label', block.ariaLabel || '');
    video.setAttribute('aria-hidden', 'true');

    if (backgroundVideoElement) {
      const videoSrc = backgroundVideoElement.querySelector('a')?.href || backgroundVideoElement.textContent.trim();
      if (videoSrc) {
        video.src = videoSrc;
        modalVideo.src = videoSrc;
        modalVideo.dataset.videoSrc = videoSrc;
        const sourceMpegUrl = document.createElement('source');
        sourceMpegUrl.src = videoSrc;
        sourceMpegUrl.type = 'application/x-mpegURL';
        video.append(sourceMpegUrl);

        const sourceMp4 = document.createElement('source');
        sourceMp4.src = videoSrc.replace('.avs.vnd.apple.mpegurl', '.mp4'); // Assuming MP4 fallback
        sourceMp4.type = 'video/mp4';
        video.append(sourceMp4);
      }
      moveInstrumentation(backgroundVideoElement, backgroundWrapper);
    }
    backgroundWrapper.append(video);

    const posterImg = document.createElement('img');
    posterImg.alt = 'Background poster image';
    posterImg.loading = 'lazy';
    posterImg.className = 'cmp-hero-full-width__background-poster';
    posterImg.style.display = 'none';
    posterImg.setAttribute('aria-hidden', 'true');
    backgroundWrapper.append(posterImg);
  } else {
    const img = block.querySelector('picture img');
    if (img) {
      const picture = createOptimizedPicture(img.src, img.alt, true, [{ width: '2000' }]);
      picture.className = 'cmp-hero-full-width__background-image';
      backgroundWrapper.append(picture);
      moveInstrumentation(img.closest('picture'), backgroundWrapper);
    }
  }

  if (titleElement) {
    const newTitle = document.createElement('div');
    newTitle.className = 'cmp-hero-full-width__content__title';
    newTitle.tabIndex = 0;
    newTitle.append(...titleElement.children);
    titleSlideUp.append(newTitle);
    moveInstrumentation(titleElement, newTitle);
  }

  if (descriptionElement) {
    const newDescription = document.createElement('div');
    newDescription.className = 'cmp-hero-full-width__content__description';
    newDescription.tabIndex = 0;
    newDescription.append(...descriptionElement.children);
    descriptionSlideUp.append(newDescription);
    moveInstrumentation(descriptionElement, newDescription);
  }

  if (primaryCtaLink) {
    const newPrimaryCta = document.createElement('a');
    newPrimaryCta.href = primaryCtaLink.href;
    newPrimaryCta.className = 'cta cta__secondary primaryCta';
    newPrimaryCta.target = primaryCtaLink.target;
    newPrimaryCta.setAttribute('aria-label', primaryCtaLink.textContent.trim());
    newPrimaryCta.dataset.palette = 'palette-light';
    const span = document.createElement('span');
    span.className = 'cta__label';
    span.textContent = primaryCtaLink.textContent.trim();
    newPrimaryCta.append(span);
    ctaContainer.append(newPrimaryCta);
    moveInstrumentation(primaryCtaLink.closest('.button-container'), newPrimaryCta);
  }

  if (secondaryCtaLink) {
    const chevronButton = document.createElement('button');
    chevronButton.type = 'button';
    chevronButton.className = 'chevron-icon';
    chevronButton.setAttribute('aria-label', 'Open video modal');
    chevronWrapper.append(chevronButton);

    const newSecondaryCta = document.createElement('a');
    newSecondaryCta.href = secondaryCtaLink.href;
    newSecondaryCta.className = 'cta cta__link secondaryCta';
    newSecondaryCta.target = secondaryCtaLink.target;
    newSecondaryCta.setAttribute('aria-label', secondaryCtaLink.textContent.trim());
    newSecondaryCta.dataset.palette = 'palette-light';
    const iconSpan = document.createElement('span');
    iconSpan.className = 'cta__icon qd-icon qd-icon--cheveron-right';
    iconSpan.setAttribute('aria-hidden', 'true');
    newSecondaryCta.append(iconSpan);
    const labelSpan = document.createElement('span');
    labelSpan.className = 'cta__label';
    labelSpan.textContent = secondaryCtaLink.textContent.trim();
    newSecondaryCta.append(labelSpan);
    chevronWrapper.append(newSecondaryCta);
    ctaContainer.append(chevronWrapper);
    moveInstrumentation(secondaryCtaLink.closest('.button-container'), newSecondaryCta);
  }

  contentDiv.append(titleWrapper, descriptionWrapper, ctaWrapper, dialog);

  block.textContent = '';
  block.append(backgroundDiv, contentDiv);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
