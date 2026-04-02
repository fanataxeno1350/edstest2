import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundVideoRow,
    titleRow,
    descriptionRow,
    primaryCtaLinkRow,
    primaryCtaLabelRow,
    secondaryCtaLinkRow,
    secondaryCtaLabelRow,
  ] = [...block.children];

  block.classList.add('cmp-hero-full-width', 'parallax-child-2');
  block.setAttribute('data-media-type', 'videoTypeSelected');
  block.setAttribute('aria-hidden', 'true');

  const viewportImage = document.createElement('div');
  viewportImage.classList.add('viewport-image');
  viewportImage.hidden = true;
  viewportImage.setAttribute('aria-hidden', 'true');
  block.append(viewportImage);

  const viewportVideo = document.createElement('div');
  viewportVideo.classList.add('viewport-video');
  viewportVideo.hidden = true;
  viewportVideo.setAttribute('aria-hidden', 'true');
  block.append(viewportVideo);

  const cover = document.createElement('div');
  cover.classList.add('cmp-hero-full-width__cover');
  block.append(cover);

  const background = document.createElement('div');
  background.classList.add('cmp-hero-full-width__background');
  block.append(background);

  const backgroundWrapper = document.createElement('div');
  backgroundWrapper.classList.add('cmp-hero-full-width__background-wrapper', 'zoom-out');
  background.append(backgroundWrapper);

  const videoEl = document.createElement('video');
  videoEl.classList.add('cmp-hero-full-width__background-video');
  videoEl.loop = true;
  videoEl.muted = true;
  videoEl.playsInline = true;
  videoEl.autoplay = true;
  videoEl.setAttribute('aria-hidden', 'true');
  videoEl.setAttribute('data-responsive-video', '');

  const backgroundVideoPicture = backgroundVideoRow.querySelector('picture');
  if (backgroundVideoPicture) {
    // The original HTML has two source tags, and the video element's src.
    // The generated JS only takes the first source. Let's replicate the original HTML structure.
    const videoSources = backgroundVideoPicture.querySelectorAll('source');
    if (videoSources.length > 0) {
      videoSources.forEach(originalSource => {
        const sourceEl = document.createElement('source');
        sourceEl.src = originalSource.src;
        sourceEl.type = originalSource.type;
        videoEl.append(sourceEl);
      });
      // Fallback for browsers not supporting source tag, use the src from the first source
      videoEl.src = videoSources[0].src;
    } else {
      // If no source tags, try to get src from the img within picture (though unlikely for video)
      const img = backgroundVideoPicture.querySelector('img');
      if (img) {
        videoEl.src = img.src;
      }
    }
  }
  backgroundWrapper.append(videoEl);

  const posterImg = document.createElement('img');
  posterImg.classList.add('cmp-hero-full-width__background-poster');
  posterImg.alt = 'Background poster image';
  posterImg.loading = 'lazy';
  posterImg.style.display = 'none';
  posterImg.setAttribute('aria-hidden', 'true');
  backgroundWrapper.append(posterImg);

  const content = document.createElement('div');
  content.classList.add('cmp-hero-full-width__content');
  block.append(content);

  const slideWrap1 = document.createElement('div');
  slideWrap1.classList.add('slide-wrap');
  content.append(slideWrap1);

  const slideUp1 = document.createElement('div');
  slideUp1.classList.add('slide-up');
  slideUp1.setAttribute('data-slide-type', 'slide-up');
  slideWrap1.append(slideUp1);

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('cmp-hero-full-width__content__title');
  titleDiv.tabIndex = 0;
  moveInstrumentation(titleRow.firstElementChild, titleDiv);
  while (titleRow.firstElementChild.firstChild) {
    titleDiv.append(titleRow.firstElementChild.firstChild);
  }
  slideUp1.append(titleDiv);

  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('cmp-hero-full-width__content__description');
  descriptionDiv.tabIndex = 0;
  moveInstrumentation(descriptionRow.firstElementChild, descriptionDiv);
  while (descriptionRow.firstElementChild.firstChild) {
    descriptionDiv.append(descriptionRow.firstElementChild.firstChild);
  }
  slideUp1.append(descriptionDiv);

  const slideWrap2 = document.createElement('div');
  slideWrap2.classList.add('slide-wrap');
  content.append(slideWrap2);

  const slideUp2 = document.createElement('div');
  slideUp2.classList.add('slide-up');
  slideUp2.setAttribute('data-slide-type', 'slide-up');
  slideWrap2.append(slideUp2);

  const ctas = document.createElement('div');
  ctas.classList.add('cmp-hero-full-width__content--ctas');
  slideUp2.append(ctas);

  const primaryCtaLink = primaryCtaLinkRow.querySelector('a');
  const primaryCta = document.createElement('a');
  // Corrected class name to match original HTML: 'primaryCta ' (with trailing space)
  primaryCta.classList.add('cta', 'cta__secondary', 'primaryCta ');
  primaryCta.href = primaryCtaLink ? primaryCtaLink.href : '#';
  primaryCta.setAttribute('aria-label', primaryCtaLabelRow.textContent.trim());
  primaryCta.setAttribute('data-palette', 'palette-light');
  moveInstrumentation(primaryCtaLinkRow.firstElementChild, primaryCta);

  const primaryCtaLabel = document.createElement('span');
  primaryCtaLabel.classList.add('cta__label');
  primaryCtaLabel.textContent = primaryCtaLabelRow.textContent.trim();
  primaryCta.append(primaryCtaLabel);
  ctas.append(primaryCta);

  const chevronWrapper = document.createElement('div');
  chevronWrapper.classList.add('chevron-wrapper');
  ctas.append(chevronWrapper);

  const chevronIconBtn = document.createElement('button');
  chevronIconBtn.classList.add('chevron-icon');
  chevronIconBtn.type = 'button';
  chevronIconBtn.setAttribute('aria-label', 'Open video modal');
  chevronWrapper.append(chevronIconBtn);

  const secondaryCtaLink = secondaryCtaLinkRow.querySelector('a');
  const secondaryCta = document.createElement('a');
  // Corrected class name to match original HTML: 'secondaryCta ' (with trailing space)
  secondaryCta.classList.add('cta', 'cta__link', 'secondaryCta ');
  secondaryCta.href = secondaryCtaLink ? secondaryCtaLink.href : '#';
  secondaryCta.setAttribute('aria-label', secondaryCtaLabelRow.textContent.trim());
  secondaryCta.setAttribute('data-palette', 'palette-light');
  moveInstrumentation(secondaryCtaLinkRow.firstElementChild, secondaryCta);

  const secondaryCtaIcon = document.createElement('span');
  secondaryCtaIcon.classList.add('cta__icon', 'qd-icon', 'qd-icon--cheveron-right');
  secondaryCtaIcon.setAttribute('aria-hidden', 'true');
  secondaryCta.append(secondaryCtaIcon);

  const secondaryCtaLabel = document.createElement('span');
  secondaryCtaLabel.classList.add('cta__label');
  secondaryCtaLabel.textContent = secondaryCtaLabelRow.textContent.trim();
  secondaryCta.append(secondaryCtaLabel);
  chevronWrapper.append(secondaryCta);

  const dialog = document.createElement('dialog');
  dialog.classList.add('cmp-hero-full-width__content--modal');
  dialog.id = 'home-page-video-dialog';
  dialog.setAttribute('closedby', 'any');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-label', 'Video Modal');
  content.append(dialog);

  const form = document.createElement('form');
  form.method = 'dialog';
  dialog.append(form);

  const closeButton = document.createElement('button');
  closeButton.classList.add('cmp-hero-full-width__content--modal__close-button');
  closeButton.setAttribute('aria-label', 'Close Video');
  closeButton.tabIndex = 0;
  closeButton.textContent = 'X';
  form.append(closeButton);

  const modalVideoDiv = document.createElement('div');
  modalVideoDiv.classList.add('video', 'cmp-hero-full-width__content--modal__video');
  dialog.append(modalVideoDiv);

  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-container', 'show-controls');
  modalVideoDiv.append(videoContainer);

  const modalViewportVideo = document.createElement('div');
  modalViewportVideo.classList.add('viewport-video');
  modalViewportVideo.hidden = true;
  modalViewportVideo.setAttribute('aria-hidden', 'true');
  videoContainer.append(modalViewportVideo);

  const videoControls = document.createElement('div');
  videoControls.classList.add('video-container__controls');
  videoContainer.append(videoControls);

  const timer = document.createElement('div');
  timer.classList.add('video-container__controls__timer');
  videoControls.append(timer);

  const progressArea = document.createElement('div');
  progressArea.classList.add('video-container__controls__timer__progress-area');
  timer.append(progressArea);

  const progressBar = document.createElement('span');
  progressBar.classList.add('video-container__controls__timer__progress-area__progress-bar');
  progressArea.append(progressBar);

  const pointer = document.createElement('span');
  pointer.classList.add('video-container__controls__timer__progress-area__pointer');
  progressArea.append(pointer);

  const progressPending = document.createElement('span');
  progressPending.classList.add('video-container__controls__timer__progress-area__progress-pending');
  progressArea.append(progressPending);

  const currentTime = document.createElement('p');
  currentTime.classList.add('video-container__controls__timer__current-time');
  currentTime.textContent = '00:00';
  timer.append(currentTime);

  const duration = document.createElement('p');
  duration.classList.add('video-container__controls__timer__duration');
  duration.textContent = '00:00';
  timer.append(duration);

  const controlButtons = document.createElement('div');
  controlButtons.classList.add('video-container__controls__buttons');
  videoControls.append(controlButtons);

  const playButton = document.createElement('button');
  playButton.classList.add('video-container__controls__buttons__play-button', 'video-container__controls__buttons--button');
  const playIcon = document.createElement('span');
  playIcon.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--play');
  playButton.append(playIcon);
  controlButtons.append(playButton);

  const muteButton = document.createElement('button');
  muteButton.classList.add('video-container__controls__buttons__mute-button', 'video-container__controls__buttons--button');
  const muteIcon = document.createElement('span');
  muteIcon.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--volume');
  muteButton.append(muteIcon);
  controlButtons.append(muteButton);

  const fullscreenButton = document.createElement('button');
  fullscreenButton.classList.add('video-container__controls__buttons__fullscreen-button', 'video-container__controls__buttons--button');
  const fullscreenIcon = document.createElement('span');
  fullscreenIcon.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--fullscreen');
  fullscreenButton.append(fullscreenIcon);
  controlButtons.append(fullscreenButton);

  const modalVideo = document.createElement('video');
  modalVideo.classList.add('video-container__video');
  modalVideo.playsInline = true;
  modalVideo.setAttribute('webkit-playsinline', '');
  modalVideo.setAttribute('x-webkit-airplay', 'allow');
  // The original HTML has a data-video-src and src attribute on the video element.
  // The generated JS hardcodes the value. It should ideally come from the block content if available,
  // but since it's not explicitly in the block structure, we'll keep the hardcoded value for now,
  // assuming it's a fixed asset for the modal.
  modalVideo.setAttribute('data-video-src', '/content/dam/aemigrate/uploaded-folder/application/qiddiya-city-video-n--avs.vnd.apple.mpegurl');
  modalVideo.src = '/content/dam/aemigrate/uploaded-folder/application/qiddiya-city-video-n--avs.vnd.apple.mpegurl';
  videoContainer.append(modalVideo);

  // Event Listeners for interactive behavior
  chevronIconBtn.addEventListener('click', () => {
    dialog.showModal();
    modalVideo.play();
  });

  secondaryCta.addEventListener('click', (e) => {
    e.preventDefault();
    dialog.showModal();
    modalVideo.play();
  });

  closeButton.addEventListener('click', () => {
    dialog.close();
    modalVideo.pause();
    modalVideo.currentTime = 0;
  });

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      dialog.close();
      modalVideo.pause();
      modalVideo.currentTime = 0;
    }
  });

  playButton.addEventListener('click', () => {
    if (modalVideo.paused) {
      modalVideo.play();
      playIcon.classList.remove('qd-icon--play');
      playIcon.classList.add('qd-icon--pause');
    } else {
      modalVideo.pause();
      playIcon.classList.remove('qd-icon--pause');
      playIcon.classList.add('qd-icon--play');
    }
  });

  muteButton.addEventListener('click', () => {
    modalVideo.muted = !modalVideo.muted;
    if (modalVideo.muted) {
      muteIcon.classList.remove('qd-icon--volume');
      muteIcon.classList.add('qd-icon--volume-mute');
    } else {
      muteIcon.classList.remove('qd-icon--volume-mute');
      muteIcon.classList.add('qd-icon--volume');
    }
  });

  fullscreenButton.addEventListener('click', () => {
    if (modalVideo.requestFullscreen) {
      modalVideo.requestFullscreen();
    } else if (modalVideo.webkitRequestFullscreen) { /* Safari */
      modalVideo.webkitRequestFullscreen();
    } else if (modalVideo.msRequestFullscreen) { /* IE11 */
      modalVideo.msRequestFullscreen();
    }
  });

  modalVideo.addEventListener('timeupdate', () => {
    const currentMinutes = Math.floor(modalVideo.currentTime / 60);
    const currentSeconds = Math.floor(modalVideo.currentTime % 60);
    currentTime.textContent = `${String(currentMinutes).padStart(2, '0')}:${String(currentSeconds).padStart(2, '0')}`;

    const progress = (modalVideo.currentTime / modalVideo.duration) * 100;
    progressBar.style.width = `${progress}%`;
    pointer.style.left = `${progress}%`;
  });

  modalVideo.addEventListener('loadedmetadata', () => {
    const durationMinutes = Math.floor(modalVideo.duration / 60);
    const durationSeconds = Math.floor(modalVideo.duration % 60);
    duration.textContent = `${String(durationMinutes).padStart(2, '0')}:${String(durationSeconds).padStart(2, '0')}`;
  });

  // Optimize background image if present
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
