import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const viewportVideo = document.createElement('div');
  viewportVideo.className = 'media-viewport-video';
  viewportVideo.setAttribute('hidden', '');
  viewportVideo.setAttribute('aria-hidden', 'true');
  block.append(viewportVideo);
  moveInstrumentation(block.querySelector('.media-viewport-video'), viewportVideo);

  const background = document.createElement('div');
  background.className = 'media-cmp-media__background';
  block.append(background);
  moveInstrumentation(block.querySelector('.media-cmp-media__background'), background);

  const wrapper = document.createElement('div');
  wrapper.className = 'media-cmp-media__wrapper media-cmp-media__wrapper--no-title';

  const header = document.createElement('div');
  header.className = 'media-cmp-media__header';
  const heading = document.createElement('div');
  heading.className = 'media-cmp-media__heading';
  const title = document.createElement('div');
  title.className = 'media-cmp-media__title';
  heading.append(title);
  header.append(heading);
  wrapper.append(header);
  moveInstrumentation(block.querySelector('.media-cmp-media__wrapper'), wrapper);
  moveInstrumentation(block.querySelector('.media-cmp-media__header'), header);
  moveInstrumentation(block.querySelector('.media-cmp-media__heading'), heading);
  moveInstrumentation(block.querySelector('.media-cmp-media__title'), title);

  const videoWrapper = document.createElement('div');
  videoWrapper.className = 'media-video media-apps.qiddiya__002d__commons.components.content.commons.video__002d__v1.v1.video__002d__v1.video__002d__v1__002e__html@e38a72f';

  const posterDiv = document.createElement('div');
  posterDiv.className = 'media-video-poster';

  const playButton = document.createElement('button');
  playButton.className = 'media-video-poster__play-button';
  const playIcon = document.createElement('span');
  playIcon.className = 'media-qd-icon media-qd-icon--play media-video-poster__play-button__icon';
  const playText = document.createElement('span');
  playText.className = 'media-video-poster__play-button__text';
  playText.setAttribute('visually-hidden', '');
  playText.textContent = 'Watch Video';
  playButton.append(playIcon, playText);
  posterDiv.append(playButton);

  const posterVideo = document.createElement('video');
  posterVideo.className = 'media-video-poster__video';
  posterVideo.setAttribute('muted', '');
  posterVideo.setAttribute('loop', '');
  posterVideo.setAttribute('playsinline', '');
  posterVideo.setAttribute('webkit-playsinline', '');
  posterVideo.setAttribute('x-webkit-airplay', 'allow');
  posterVideo.setAttribute('autoplay', '');

  const posterSrc = block.querySelector('[data-aue-prop="poster"]');
  if (posterSrc) {
    posterVideo.setAttribute('poster', posterSrc.textContent.trim());
    posterVideo.setAttribute('src', posterSrc.textContent.trim());
    moveInstrumentation(posterSrc, posterVideo);
  } else {
    // Fallback if data-aue-prop is not found, try to find an existing video element
    const existingPosterVideo = block.querySelector('.media-video-poster__video');
    if (existingPosterVideo) {
      posterVideo.setAttribute('poster', existingPosterVideo.getAttribute('poster'));
      posterVideo.setAttribute('src', existingPosterVideo.getAttribute('src'));
      moveInstrumentation(existingPosterVideo, posterVideo);
    }
  }
  posterDiv.append(posterVideo);
  videoWrapper.append(posterDiv);
  moveInstrumentation(block.querySelector('.media-video-poster'), posterDiv);
  moveInstrumentation(block.querySelector('.media-video-poster__play-button'), playButton);

  const videoContainer = document.createElement('div');
  videoContainer.className = 'media-video-container media-show-controls media-video-hide';

  const containerViewportVideo = document.createElement('div');
  containerViewportVideo.className = 'media-viewport-video';
  containerViewportVideo.setAttribute('hidden', '');
  containerViewportVideo.setAttribute('aria-hidden', 'true');
  videoContainer.append(containerViewportVideo);
  moveInstrumentation(block.querySelector('.media-video-container .media-viewport-video'), containerViewportVideo);

  const controls = document.createElement('div');
  controls.className = 'media-video-container__controls';

  const timer = document.createElement('div');
  timer.className = 'media-video-container__controls__timer';
  const progressArea = document.createElement('div');
  progressArea.className = 'media-video-container__controls__timer__progress-area';
  progressArea.innerHTML = '<span class="media-video-container__controls__timer__progress-area__progress-bar"></span><span class="media-video-container__controls__timer__progress-area__pointer"></span><span class="media-video-container__controls__timer__progress-area__progress-pending"></span>';
  const currentTime = document.createElement('p');
  currentTime.className = 'media-video-container__controls__timer__current-time';
  currentTime.textContent = '00:00';
  const duration = document.createElement('p');
  duration.className = 'media-video-container__controls__timer__duration';
  duration.textContent = '00:00';
  timer.append(progressArea, currentTime, duration);
  controls.append(timer);
  moveInstrumentation(block.querySelector('.media-video-container__controls__timer'), timer);

  const buttons = document.createElement('div');
  buttons.className = 'media-video-container__controls__buttons';
  buttons.innerHTML = `
    <button class="media-video-container__controls__buttons__play-button media-video-container__controls__buttons--button">
        <span class="media-video-container__controls__buttons__icon media-qd-icon media-qd-icon--play"></span>
    </button>
    <button class="media-video-container__controls__buttons__mute-button media-video-container__controls__buttons--button">
        <span class="media-video-container__controls__buttons__icon media-qd-icon media-qd-icon--volume"></span>
    </button>
    <button class="media-video-container__controls__buttons__fullscreen-button media-video-container__controls__buttons--button">
        <span class="media-video-container__controls__buttons__icon media-qd-icon media-qd-icon--fullscreen"></span>
    </button>
  `;
  controls.append(buttons);
  videoContainer.append(controls);
  moveInstrumentation(block.querySelector('.media-video-container__controls'), controls);
  moveInstrumentation(block.querySelector('.media-video-container__controls__buttons'), buttons);

  const mainVideo = document.createElement('video');
  mainVideo.className = 'media-video-container__video';
  mainVideo.setAttribute('playsinline', '');
  mainVideo.setAttribute('webkit-playsinline', '');
  mainVideo.setAttribute('x-webkit-airplay', 'allow');

  const videoSrc = block.querySelector('[data-aue-prop="videoSrc"]');
  if (videoSrc) {
    mainVideo.setAttribute('data-video-src', videoSrc.textContent.trim());
    mainVideo.setAttribute('src', videoSrc.textContent.trim());
    moveInstrumentation(videoSrc, mainVideo);
  } else {
    const existingMainVideo = block.querySelector('.media-video-container__video');
    if (existingMainVideo) {
      mainVideo.setAttribute('data-video-src', existingMainVideo.getAttribute('data-video-src'));
      mainVideo.setAttribute('src', existingMainVideo.getAttribute('src'));
      moveInstrumentation(existingMainVideo, mainVideo);
    }
  }
  videoContainer.append(mainVideo);
  videoWrapper.append(videoContainer);
  wrapper.append(videoWrapper);
  moveInstrumentation(block.querySelector('.media-video'), videoWrapper);
  moveInstrumentation(block.querySelector('.media-video-container'), videoContainer);

  block.textContent = '';
  block.append(viewportVideo, background, wrapper);
  block.className = 'media-cmp-media block';
  block.dataset.blockStatus = 'loaded';
}
