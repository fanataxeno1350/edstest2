import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const videoContainer = document.createElement('div');
  videoContainer.classList.add('media-video');

  const videoPosterDiv = document.createElement('div');
  videoPosterDiv.classList.add('media-video-poster');

  const playButton = document.createElement('button');
  playButton.classList.add('media-video-poster__play-button');

  const playIcon = document.createElement('span');
  playIcon.classList.add('media-qd-icon', 'media-qd-icon--play', 'media-video-poster__play-button__icon');
  playButton.append(playIcon);

  const playButtonText = document.createElement('span');
  playButtonText.classList.add('media-video-poster__play-button__text');
  playButtonText.setAttribute('visually-hidden', '');
  playButtonText.textContent = 'Watch Video';
  playButton.append(playButtonText);
  videoPosterDiv.append(playButton);

  const posterVideo = document.createElement('video');
  posterVideo.classList.add('media-video-poster__video');
  posterVideo.setAttribute('muted', '');
  posterVideo.setAttribute('loop', '');
  posterVideo.setAttribute('playsinline', '');
  posterVideo.setAttribute('webkit-playsinline', '');
  posterVideo.setAttribute('x-webkit-airplay', 'allow');
  posterVideo.setAttribute('autoplay', '');

  const authoredPoster = block.querySelector('[data-aue-prop="poster"]');
  if (authoredPoster) {
    posterVideo.src = authoredPoster.textContent;
    posterVideo.poster = authoredPoster.textContent;
    moveInstrumentation(authoredPoster, posterVideo);
  } else {
    const videoElement = block.querySelector('video[poster]');
    if (videoElement) {
      posterVideo.src = videoElement.poster;
      posterVideo.poster = videoElement.poster;
    }
  }
  videoPosterDiv.append(posterVideo);
  videoContainer.append(videoPosterDiv);

  const videoControlsContainer = document.createElement('div');
  videoControlsContainer.classList.add('media-video-container', 'media-show-controls', 'media-video-hide');

  const viewportVideoHidden = document.createElement('div');
  viewportVideoHidden.classList.add('media-viewport-video');
  viewportVideoHidden.setAttribute('hidden', '');
  viewportVideoHidden.setAttribute('aria-hidden', 'true');
  videoControlsContainer.append(viewportVideoHidden);

  const controlsDiv = document.createElement('div');
  controlsDiv.classList.add('media-video-container__controls');

  const timerDiv = document.createElement('div');
  timerDiv.classList.add('media-video-container__controls__timer');

  const progressArea = document.createElement('div');
  progressArea.classList.add('media-video-container__controls__timer__progress-area');
  progressArea.innerHTML = `
    <span class="media-video-container__controls__timer__progress-area__progress-bar"></span>
    <span class="media-video-container__controls__timer__progress-area__pointer"></span>
    <span class="media-video-container__controls__timer__progress-area__progress-pending"></span>
  `;
  timerDiv.append(progressArea);

  const currentTime = document.createElement('p');
  currentTime.classList.add('media-video-container__controls__timer__current-time');
  currentTime.textContent = '00:00';
  timerDiv.append(currentTime);

  const duration = document.createElement('p');
  duration.classList.add('media-video-container__controls__timer__duration');
  duration.textContent = '00:00';
  timerDiv.append(duration);
  controlsDiv.append(timerDiv);

  const buttonsDiv = document.createElement('div');
  buttonsDiv.classList.add('media-video-container__controls__buttons');
  buttonsDiv.innerHTML = `
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
  controlsDiv.append(buttonsDiv);
  videoControlsContainer.append(controlsDiv);

  const mainVideo = document.createElement('video');
  mainVideo.classList.add('media-video-container__video');
  mainVideo.setAttribute('playsinline', '');
  mainVideo.setAttribute('webkit-playsinline', '');
  mainVideo.setAttribute('x-webkit-airplay', 'allow');

  const authoredVideoSrc = block.querySelector('[data-aue-prop="videoSrc"]');
  if (authoredVideoSrc) {
    mainVideo.src = authoredVideoSrc.textContent;
    moveInstrumentation(authoredVideoSrc, mainVideo);
  } else {
    const videoElement = block.querySelector('video.media-video-container__video');
    if (videoElement) {
      mainVideo.src = videoElement.src;
    }
  }

  const authoredVideoDataSrc = block.querySelector('[data-aue-prop="videoDataSrc"]');
  if (authoredVideoDataSrc) {
    mainVideo.setAttribute('data-video-src', authoredVideoDataSrc.textContent);
    moveInstrumentation(authoredVideoDataSrc, mainVideo);
  } else {
    const videoElement = block.querySelector('video.media-video-container__video');
    if (videoElement && videoElement.dataset.videoSrc) {
      mainVideo.setAttribute('data-video-src', videoElement.dataset.videoSrc);
    }
  }

  videoControlsContainer.append(mainVideo);
  videoContainer.append(videoControlsContainer);

  block.textContent = '';
  block.append(videoContainer);
  block.className = `media-video block`;
  block.dataset.blockStatus = 'loaded';
}
