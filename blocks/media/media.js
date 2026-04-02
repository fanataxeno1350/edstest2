import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // BlockJson indicates two root fields: "video-poster" and "video-src"
  // Each field is a reference type, meaning it will be a div containing another div with the content.
  const [videoPosterRow, videoSrcRow] = [...block.children];

  // Main container
  block.classList.add('inner-video', 'cmp-media');

  const viewportVideoHidden = document.createElement('div');
  viewportVideoHidden.classList.add('viewport-video');
  viewportVideoHidden.setAttribute('hidden', '');
  viewportVideoHidden.setAttribute('aria-hidden', 'true');
  // Append later to maintain order

  const cmpMediaBackground = document.createElement('div');
  cmpMediaBackground.classList.add('cmp-media__background');
  // Append later to maintain order

  const cmpMediaWrapper = document.createElement('div');
  cmpMediaWrapper.classList.add('cmp-media__wrapper', 'cmp-media__wrapper--no-title');
  // Append later to maintain order

  const cmpMediaHeader = document.createElement('div');
  cmpMediaHeader.classList.add('cmp-media__header');
  cmpMediaWrapper.append(cmpMediaHeader);

  const cmpMediaHeading = document.createElement('div');
  cmpMediaHeading.classList.add('cmp-media__heading');
  cmpMediaHeader.append(cmpMediaHeading);

  const cmpMediaTitle = document.createElement('div');
  cmpMediaTitle.classList.add('cmp-media__title');
  cmpMediaHeading.append(cmpMediaTitle);

  const videoMainContainer = document.createElement('div');
  videoMainContainer.classList.add('video', 'apps.qiddiya__002d__commons.components.content.commons.video__002d__v1.v1.video__002d__v1.video__002d__v1__002e__html@7c30efd3');
  cmpMediaWrapper.append(videoMainContainer);

  // Video Poster section
  const videoPosterDiv = document.createElement('div');
  videoPosterDiv.classList.add('video-poster');
  videoMainContainer.append(videoPosterDiv);

  const playButton = document.createElement('button');
  playButton.classList.add('video-poster__play-button');
  videoPosterDiv.append(playButton);

  const playIcon = document.createElement('span');
  playIcon.classList.add('qd-icon', 'qd-icon--play', 'video-poster__play-button__icon');
  playButton.append(playIcon);

  const playText = document.createElement('span');
  playText.classList.add('video-poster__play-button__text');
  playText.setAttribute('visually-hidden', '');
  playText.textContent = ' Watch Video ';
  playButton.append(playText);

  const videoPosterEl = document.createElement('video');
  videoPosterEl.classList.add('video-poster__video');
  videoPosterEl.setAttribute('muted', '');
  videoPosterEl.setAttribute('loop', '');
  videoPosterEl.setAttribute('playsinline', '');
  videoPosterEl.setAttribute('webkit-playsinline', '');
  videoPosterEl.setAttribute('x-webkit-airplay', 'allow');
  videoPosterEl.setAttribute('autoplay', '');

  // Correctly extract poster image from the first child div of videoPosterRow
  const posterCell = videoPosterRow.querySelector('div');
  const posterPicture = posterCell ? posterCell.querySelector('picture') : null;
  const posterImg = posterPicture ? posterPicture.querySelector('img') : null;
  if (posterImg) {
    videoPosterEl.setAttribute('poster', posterImg.src);
    // The original JS also set src to posterImg.src, which is likely for the autoplaying muted background video.
    videoPosterEl.setAttribute('src', posterImg.src);
  }
  videoPosterDiv.append(videoPosterEl);

  // Video Container for main video
  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-container', 'show-controls', 'video-hide');
  videoMainContainer.append(videoContainer);

  const viewportVideoInner = document.createElement('div');
  viewportVideoInner.classList.add('viewport-video');
  viewportVideoInner.setAttribute('hidden', '');
  viewportVideoInner.setAttribute('aria-hidden', 'true');
  videoContainer.append(viewportVideoInner);

  const videoControls = document.createElement('div');
  videoControls.classList.add('video-container__controls');
  videoContainer.append(videoControls);

  const videoTimer = document.createElement('div');
  videoTimer.classList.add('video-container__controls__timer');
  videoControls.append(videoTimer);

  const progressArea = document.createElement('div');
  progressArea.classList.add('video-container__controls__timer__progress-area');
  videoTimer.append(progressArea);

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
  videoTimer.append(currentTime);

  const duration = document.createElement('p');
  duration.classList.add('video-container__controls__timer__duration');
  duration.textContent = '00:00';
  videoTimer.append(duration);

  const controlsButtons = document.createElement('div');
  controlsButtons.classList.add('video-container__controls__buttons');
  videoControls.append(controlsButtons);

  const playButtonControls = document.createElement('button');
  playButtonControls.classList.add('video-container__controls__buttons__play-button', 'video-container__controls__buttons--button');
  const playIconControls = document.createElement('span');
  playIconControls.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--play');
  playButtonControls.append(playIconControls);
  controlsButtons.append(playButtonControls);

  const muteButtonControls = document.createElement('button');
  muteButtonControls.classList.add('video-container__controls__buttons__mute-button', 'video-container__controls__buttons--button');
  const muteIconControls = document.createElement('span');
  muteIconControls.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--volume');
  muteButtonControls.append(muteIconControls);
  controlsButtons.append(muteButtonControls);

  const fullscreenButtonControls = document.createElement('button');
  fullscreenButtonControls.classList.add('video-container__controls__buttons__fullscreen-button', 'video-container__controls__buttons--button');
  const fullscreenIconControls = document.createElement('span');
  fullscreenIconControls.classList.add('video-container__controls__buttons__icon', 'qd-icon', 'qd-icon--fullscreen');
  fullscreenButtonControls.append(fullscreenIconControls);
  controlsButtons.append(fullscreenButtonControls);

  const videoPlayer = document.createElement('video');
  videoPlayer.classList.add('video-container__video');
  videoPlayer.setAttribute('playsinline', '');
  videoPlayer.setAttribute('webkit-playsinline', '');
  videoPlayer.setAttribute('x-webkit-airplay', 'allow');

  // Correctly extract video source from the first child div of videoSrcRow
  const videoSrcCell = videoSrcRow.querySelector('div');
  const videoSrcLink = videoSrcCell ? videoSrcCell.querySelector('a') : null; // Video source is expected to be an <a> tag
  if (videoSrcLink && videoSrcLink.href) {
    videoPlayer.setAttribute('data-video-src', videoSrcLink.href);
    videoPlayer.setAttribute('src', videoSrcLink.href);
  }
  videoContainer.append(videoPlayer);

  // Event Listeners for video functionality
  const togglePlay = (videoElement, buttonElement, iconElement) => {
    if (videoElement.paused) {
      videoElement.play();
      iconElement.classList.remove('qd-icon--play');
      iconElement.classList.add('qd-icon--pause');
    } else {
      videoElement.pause();
      iconElement.classList.remove('qd-icon--pause');
      iconElement.classList.add('qd-icon--play');
    }
  };

  const toggleMute = (videoElement, iconElement) => {
    videoElement.muted = !videoElement.muted;
    if (videoElement.muted) {
      iconElement.classList.remove('qd-icon--volume');
      iconElement.classList.add('qd-icon--volume-mute');
    } else {
      iconElement.classList.remove('qd-icon--volume-mute');
      iconElement.classList.add('qd-icon--volume');
    }
  };

  const toggleFullScreen = (videoElement) => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (videoElement.requestFullscreen) {
      videoElement.requestFullscreen();
    } else if (videoElement.webkitRequestFullscreen) { /* Safari */
      videoElement.webkitRequestFullscreen();
    } else if (videoElement.msRequestFullscreen) { /* IE11 */
      videoElement.msRequestFullscreen();
    }
  };

  playButton.addEventListener('click', () => {
    videoPosterDiv.classList.add('video-hide');
    videoContainer.classList.remove('video-hide');
    videoPlayer.play();
    playIconControls.classList.remove('qd-icon--play');
    playIconControls.classList.add('qd-icon--pause');
  });

  playButtonControls.addEventListener('click', () => {
    togglePlay(videoPlayer, playButtonControls, playIconControls);
  });

  muteButtonControls.addEventListener('click', () => {
    toggleMute(videoPlayer, muteIconControls);
  });

  fullscreenButtonControls.addEventListener('click', () => {
    toggleFullScreen(videoPlayer);
  });

  videoPlayer.addEventListener('timeupdate', () => {
    const current = Math.floor(videoPlayer.currentTime);
    const durationTime = Math.floor(videoPlayer.duration);
    const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;

    currentTime.textContent = `${String(Math.floor(current / 60)).padStart(2, '0')}:${String(current % 60).padStart(2, '0')}`;
    duration.textContent = `${String(Math.floor(durationTime / 60)).padStart(2, '0')}:${String(durationTime % 60).padStart(2, '0')}`;
    progressBar.style.width = `${progress}%`;
    pointer.style.left = `${progress}%`;
  });

  videoPlayer.addEventListener('loadedmetadata', () => {
    const durationTime = Math.floor(videoPlayer.duration);
    duration.textContent = `${String(Math.floor(durationTime / 60)).padStart(2, '0')}:${String(durationTime % 60).padStart(2, '0')}`;
  });

  progressArea.addEventListener('click', (e) => {
    const progressWidth = progressArea.clientWidth;
    const clickedOffsetX = e.offsetX;
    const newTime = (clickedOffsetX / progressWidth) * videoPlayer.duration;
    videoPlayer.currentTime = newTime;
  });

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Clear original block content and append new structure
  // The original block.textContent = ''; would clear the block before appending,
  // which is fine if the block is empty, but if it contains the original rows,
  // we should clear them first. However, since the block.children were already
  // destructured, we can just clear and append.
  // Re-appending the elements in the correct order.
  block.innerHTML = ''; // Clear existing content
  block.append(viewportVideoHidden, cmpMediaBackground, cmpMediaWrapper);
}
