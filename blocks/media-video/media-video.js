import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const posterSrc = block.querySelector('[data-aue-prop="poster"]')?.getAttribute('src');
  const videoSrc = block.querySelector('[data-aue-prop="videoSrc"]')?.getAttribute('src');

  block.textContent = '';

  const mediaViewportVideo = document.createElement('div');
  mediaViewportVideo.classList.add('media-viewport-video');
  mediaViewportVideo.setAttribute('hidden', '');
  mediaViewportVideo.setAttribute('aria-hidden', 'true');
  block.append(mediaViewportVideo);

  const mediaBackground = document.createElement('div');
  mediaBackground.classList.add('media-background');
  block.append(mediaBackground);

  const mediaWrapper = document.createElement('div');
  mediaWrapper.classList.add('media-wrapper', 'media-wrapper--no-title');
  block.append(mediaWrapper);

  const mediaHeader = document.createElement('div');
  mediaHeader.classList.add('media-header');
  mediaWrapper.append(mediaHeader);

  const mediaHeading = document.createElement('div');
  mediaHeading.classList.add('media-heading');
  mediaHeader.append(mediaHeading);

  const mediaTitle = document.createElement('div');
  mediaTitle.classList.add('media-title');
  mediaHeading.append(mediaTitle);

  const mediaVideo = document.createElement('div');
  mediaVideo.classList.add('media-video');
  mediaWrapper.append(mediaVideo);

  const mediaVideoPoster = document.createElement('div');
  mediaVideoPoster.classList.add('media-video-poster');
  mediaVideo.append(mediaVideoPoster);

  const playButton = document.createElement('button');
  playButton.classList.add('media-video-poster__play-button');
  mediaVideoPoster.append(playButton);

  const playIcon = document.createElement('span');
  playIcon.classList.add('media-qd-icon', 'media-qd-icon--play', 'media-video-poster__play-button__icon');
  playButton.append(playIcon);

  const playText = document.createElement('span');
  playText.classList.add('media-video-poster__play-button__text');
  playText.setAttribute('visually-hidden', '');
  playText.textContent = 'Watch Video';
  playButton.append(playText);

  if (posterSrc) {
    const posterVideo = document.createElement('video');
    posterVideo.classList.add('media-video-poster__video');
    posterVideo.setAttribute('muted', '');
    posterVideo.setAttribute('loop', '');
    posterVideo.setAttribute('playsinline', '');
    posterVideo.setAttribute('webkit-playsinline', '');
    posterVideo.setAttribute('x-webkit-airplay', 'allow');
    posterVideo.setAttribute('autoplay', '');
    posterVideo.setAttribute('src', posterSrc);
    posterVideo.setAttribute('poster', posterSrc);
    mediaVideoPoster.append(posterVideo);
    const originalPoster = block.querySelector('[data-aue-prop="poster"]');
    if (originalPoster) moveInstrumentation(originalPoster, posterVideo);
  }

  const mediaVideoContainer = document.createElement('div');
  mediaVideoContainer.classList.add('media-video-container', 'media-show-controls', 'media-video-hide');
  mediaVideo.append(mediaVideoContainer);

  const mediaVideoViewportVideo = document.createElement('div');
  mediaVideoViewportVideo.classList.add('media-video-viewport-video');
  mediaVideoViewportVideo.setAttribute('hidden', '');
  mediaVideoViewportVideo.setAttribute('aria-hidden', 'true');
  mediaVideoContainer.append(mediaVideoViewportVideo);

  const controls = document.createElement('div');
  controls.classList.add('media-video-container__controls');
  mediaVideoContainer.append(controls);

  const timer = document.createElement('div');
  timer.classList.add('media-video-container__controls__timer');
  controls.append(timer);

  const progressArea = document.createElement('div');
  progressArea.classList.add('media-video-container__controls__timer__progress-area');
  timer.append(progressArea);

  const progressBar = document.createElement('span');
  progressBar.classList.add('media-video-container__controls__timer__progress-area__progress-bar');
  progressArea.append(progressBar);

  const pointer = document.createElement('span');
  pointer.classList.add('media-video-container__controls__timer__progress-area__pointer');
  progressArea.append(pointer);

  const progressPending = document.createElement('span');
  progressPending.classList.add('media-video-container__controls__timer__progress-area__progress-pending');
  progressArea.append(progressPending);

  const currentTime = document.createElement('p');
  currentTime.classList.add('media-video-container__controls__timer__current-time');
  currentTime.textContent = '00:00';
  timer.append(currentTime);

  const duration = document.createElement('p');
  duration.classList.add('media-video-container__controls__timer__duration');
  duration.textContent = '00:00';
  timer.append(duration);

  const buttons = document.createElement('div');
  buttons.classList.add('media-video-container__controls__buttons');
  controls.append(buttons);

  const playButtonControls = document.createElement('button');
  playButtonControls.classList.add('media-video-container__controls__buttons__play-button', 'media-video-container__controls__buttons--button');
  buttons.append(playButtonControls);

  const playIconControls = document.createElement('span');
  playIconControls.classList.add('media-video-container__controls__buttons__icon', 'media-qd-icon', 'media-qd-icon--play');
  playButtonControls.append(playIconControls);

  const muteButton = document.createElement('button');
  muteButton.classList.add('media-video-container__controls__buttons__mute-button', 'media-video-container__controls__buttons--button');
  buttons.append(muteButton);

  const muteIcon = document.createElement('span');
  muteIcon.classList.add('media-video-container__controls__buttons__icon', 'media-qd-icon', 'media-qd-icon--volume');
  muteButton.append(muteIcon);

  const fullscreenButton = document.createElement('button');
  fullscreenButton.classList.add('media-video-container__controls__buttons__fullscreen-button', 'media-video-container__controls__buttons--button');
  buttons.append(fullscreenButton);

  const fullscreenIcon = document.createElement('span');
  fullscreenIcon.classList.add('media-video-container__controls__buttons__icon', 'media-qd-icon', 'media-qd-icon--fullscreen');
  fullscreenButton.append(fullscreenIcon);

  if (videoSrc) {
    const videoElement = document.createElement('video');
    videoElement.classList.add('media-video-container__video');
    videoElement.setAttribute('playsinline', '');
    videoElement.setAttribute('webkit-playsinline', '');
    videoElement.setAttribute('x-webkit-airplay', 'allow');
    videoElement.setAttribute('data-video-src', videoSrc);
    videoElement.setAttribute('src', videoSrc);
    mediaVideoContainer.append(videoElement);
    const originalVideoSrc = block.querySelector('[data-aue-prop="videoSrc"]');
    if (originalVideoSrc) moveInstrumentation(originalVideoSrc, videoElement);
  }

  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
