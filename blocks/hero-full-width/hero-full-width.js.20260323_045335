import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const videoTypeSelected = block.dataset.mediaType === 'videoTypeSelected';

  const background = document.createElement('div');
  background.classList.add('hero-cmp-hero-full-width__background');
  const backgroundWrapper = document.createElement('div');
  backgroundWrapper.classList.add('hero-cmp-hero-full-width__background-wrapper', 'hero-zoom-out');
  background.append(backgroundWrapper);

  const content = document.createElement('div');
  content.classList.add('hero-cmp-hero-full-width__content');

  const slideWrap1 = document.createElement('div');
  slideWrap1.classList.add('hero-slide-wrap');
  const slideUp1 = document.createElement('div');
  slideUp1.dataset.slideType = 'slide-up';
  slideUp1.classList.add('hero-slide-up');
  slideWrap1.append(slideUp1);

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('hero-cmp-hero-full-width__content__title');
  titleDiv.tabIndex = 0;
  const titleContent = block.querySelector('[data-aue-prop="title"]');
  if (titleContent) {
    titleDiv.append(...titleContent.children);
    moveInstrumentation(titleContent, titleDiv);
  }
  slideUp1.append(titleDiv);

  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('hero-cmp-hero-full-width__content__description');
  descriptionDiv.tabIndex = 0;
  const descriptionContent = block.querySelector('[data-aue-prop="description"]');
  if (descriptionContent) {
    descriptionDiv.append(...descriptionContent.children);
    moveInstrumentation(descriptionContent, descriptionDiv);
  }
  slideUp1.append(descriptionDiv);

  content.append(slideWrap1);

  const slideWrap2 = document.createElement('div');
  slideWrap2.classList.add('hero-slide-wrap');
  const slideUp2 = document.createElement('div');
  slideUp2.dataset.slideType = 'slide-up';
  slideUp2.classList.add('hero-slide-up');
  slideWrap2.append(slideUp2);

  const ctaContainer = document.createElement('div');
  ctaContainer.classList.add('hero-cmp-hero-full-width__content--ctas');

  const primaryCtaLink = block.querySelector('[data-aue-prop="primaryCtaLink"]');
  const primaryCtaLabel = block.querySelector('[data-aue-prop="primaryCtaLabel"]');
  if (primaryCtaLink && primaryCtaLabel) {
    const primaryCta = document.createElement('a');
    primaryCta.href = primaryCtaLink.href;
    primaryCta.classList.add('hero-cta', 'hero-cta__secondary', 'hero-primaryCta');
    primaryCta.target = '_self';
    primaryCta.setAttribute('aria-label', primaryCtaLabel.textContent);
    primaryCta.dataset.palette = 'palette-light';

    const primaryCtaSpan = document.createElement('span');
    primaryCtaSpan.classList.add('hero-cta__label');
    primaryCtaSpan.textContent = primaryCtaLabel.textContent;
    primaryCta.append(primaryCtaSpan);
    ctaContainer.append(primaryCta);
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
    secondaryCta.href = secondaryCtaLink.href;
    secondaryCta.classList.add('hero-cta', 'hero-cta__link', 'hero-secondaryCta');
    secondaryCta.target = '_self';
    secondaryCta.setAttribute('aria-label', secondaryCtaLabel.textContent);
    secondaryCta.dataset.palette = 'palette-light';

    const secondaryCtaIcon = document.createElement('span');
    secondaryCtaIcon.classList.add('hero-cta__icon', 'hero-qd-icon', 'hero-qd-icon--cheveron-right');
    secondaryCtaIcon.setAttribute('aria-hidden', 'true');
    secondaryCta.append(secondaryCtaIcon);

    const secondaryCtaSpan = document.createElement('span');
    secondaryCtaSpan.classList.add('hero-cta__label');
    secondaryCtaSpan.textContent = secondaryCtaLabel.textContent;
    secondaryCta.append(secondaryCtaSpan);

    chevronWrapper.append(secondaryCta);
    moveInstrumentation(secondaryCtaLink, secondaryCta);
    moveInstrumentation(secondaryCtaLabel, secondaryCtaSpan);
  }

  ctaContainer.append(chevronWrapper);
  slideUp2.append(ctaContainer);
  content.append(slideWrap2);

  const dialog = document.createElement('dialog');
  dialog.classList.add('hero-cmp-hero-full-width__content--modal');
  dialog.id = 'home-page-video-dialog';
  dialog.setAttribute('closedby', 'any');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', 'Video Modal');

  const dialogForm = document.createElement('form');
  dialogForm.method = 'dialog';
  dialog.append(dialogForm);

  const closeButton = document.createElement('button');
  closeButton.classList.add('hero-cmp-hero-full-width__content--modal__close-button');
  closeButton.setAttribute('aria-label', 'Close Video');
  closeButton.tabIndex = 0;
  closeButton.textContent = 'X';
  dialogForm.append(closeButton);

  const videoDiv = document.createElement('div');
  videoDiv.classList.add('hero-video', 'hero-cmp-hero-full-width__content--modal__video');

  const videoContainer = document.createElement('div');
  videoContainer.classList.add('hero-video-container', 'hero-show-controls');

  const viewportVideoHidden = document.createElement('div');
  viewportVideoHidden.classList.add('hero-viewport-video');
  viewportVideoHidden.hidden = true;
  viewportVideoHidden.setAttribute('aria-hidden', 'true');
  videoContainer.append(viewportVideoHidden);

  const videoControls = document.createElement('div');
  videoControls.classList.add('hero-video-container__controls');

  const timer = document.createElement('div');
  timer.classList.add('hero-video-container__controls__timer');
  timer.innerHTML = `
    <div class="hero-video-container__controls__timer__progress-area">
      <span class="hero-video-container__controls__timer__progress-area__progress-bar"></span>
      <span class="hero-video-container__controls__timer__progress-area__pointer"></span>
      <span class="hero-video-container__controls__timer__progress-area__progress-pending"></span>
    </div>
    <p class="hero-video-container__controls__timer__current-time">00:00</p>
    <p class="hero-video-container__controls__timer__duration">00:00</p>
  `;
  videoControls.append(timer);

  const buttons = document.createElement('div');
  buttons.classList.add('hero-video-container__controls__buttons');
  buttons.innerHTML = `
    <button class="hero-video-container__controls__buttons__play-button hero-video-container__controls__buttons--button">
      <span class="hero-video-container__controls__buttons__icon hero-qd-icon hero-qd-icon--play"></span>
    </button>
    <button class="hero-video-container__controls__buttons__mute-button hero-video-container__controls__buttons--button">
      <span class="hero-video-container__controls__buttons__icon hero-qd-icon hero-qd-icon--volume"></span>
    </button>
    <button class="hero-video-container__controls__buttons__fullscreen-button hero-video-container__controls__buttons--button">
      <span class="hero-video-container__controls__buttons__icon hero-qd-icon hero-qd-icon--fullscreen"></span>
    </button>
  `;
  videoControls.append(buttons);
  videoContainer.append(videoControls);

  const modalVideoSrc = block.querySelector('[data-aue-prop="modalVideo"]');
  if (modalVideoSrc) {
    const modalVideoElement = document.createElement('video');
    modalVideoElement.classList.add('hero-video-container__video');
    modalVideoElement.playsInline = true;
    modalVideoElement.setAttribute('webkit-playsinline', '');
    modalVideoElement.setAttribute('x-webkit-airplay', 'allow');
    modalVideoElement.dataset.videoSrc = modalVideoSrc.href;
    modalVideoElement.src = modalVideoSrc.href;
    videoContainer.append(modalVideoElement);
    moveInstrumentation(modalVideoSrc, modalVideoElement);
  }

  videoDiv.append(videoContainer);
  dialog.append(videoDiv);
  content.append(dialog);

  const coverDiv = document.createElement('div');
  coverDiv.classList.add('hero-cmp-hero-full-width__cover');

  block.textContent = '';

  const viewportImage = document.createElement('div');
  viewportImage.classList.add('hero-viewport-image');
  viewportImage.hidden = true;
  viewportImage.setAttribute('aria-hidden', 'true');
  block.append(viewportImage);

  const viewportVideo = document.createElement('div');
  viewportVideo.classList.add('hero-viewport-video');
  viewportVideo.hidden = true;
  viewportVideo.setAttribute('aria-hidden', 'true');
  block.append(viewportVideo);

  block.append(coverDiv);
  block.append(background);
  block.append(content);

  if (videoTypeSelected) {
    const backgroundVideo = block.querySelector('[data-aue-prop="backgroundVideo"]');
    const backgroundVideoMp4 = block.querySelector('[data-aue-prop="backgroundVideoMp4"]');

    if (backgroundVideo || backgroundVideoMp4) {
      const videoElement = document.createElement('video');
      videoElement.classList.add('hero-cmp-hero-full-width__background-video');
      videoElement.loop = true;
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.setAttribute('aria-label', block.ariaLabel);
      videoElement.setAttribute('aria-hidden', 'true');
      videoElement.autoplay = true;

      if (backgroundVideo) {
        videoElement.src = backgroundVideo.href;
        const sourceHls = document.createElement('source');
        sourceHls.src = backgroundVideo.href;
        sourceHls.type = 'application/x-mpegURL';
        videoElement.append(sourceHls);
        moveInstrumentation(backgroundVideo, sourceHls);
      }
      if (backgroundVideoMp4) {
        const sourceMp4 = document.createElement('source');
        sourceMp4.src = backgroundVideoMp4.href;
        sourceMp4.type = 'video/mp4';
        videoElement.append(sourceMp4);
        moveInstrumentation(backgroundVideoMp4, sourceMp4);
      }

      backgroundWrapper.append(videoElement);
    }

    const posterImg = document.createElement('img');
    posterImg.alt = 'Background poster image';
    posterImg.loading = 'lazy';
    posterImg.classList.add('hero-cmp-hero-full-width__background-poster');
    posterImg.style.display = 'none';
    posterImg.setAttribute('aria-hidden', 'true');
    backgroundWrapper.append(posterImg);
  }

  block.classList.add('hero-cmp-hero-full-width', 'hero-parallax-child-2');
  block.dataset.blockStatus = 'loaded';
}
