import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const bannerSection = document.createElement('section');
  bannerSection.classList.add('banner-section');

  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('banner-position-relative', 'banner-boing', 'banner-section__wrapper');

  const videoWrapper = document.createElement('div');
  videoWrapper.classList.add('banner-video-wrapper');

  const videoElement = block.querySelector('video[data-aue-prop="video"]');
  if (videoElement) {
    videoWrapper.append(videoElement);
    moveInstrumentation(videoElement, videoWrapper);
  }

  const playPauseWrapper = document.createElement('div');
  playPauseWrapper.classList.add('banner-position-absolute', 'banner-w-100', 'banner-h-100', 'banner-start-0', 'banner-top-0', 'banner-d-flex', 'banner-justify-content-center', 'banner-align-items-center', 'banner-cursor-pointer');

  const playButton = block.querySelector('[data-aue-prop="playIcon"]');
  if (playButton) {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('banner-d-none', 'banner-video-icon', 'banner-icon-play', 'banner-bg-transparent', 'banner-d-flex', 'banner-align-items-center', 'banner-justify-content-center', 'banner-cursor-pointer');
    button.textContent = playButton.textContent.trim();
    playPauseWrapper.append(button);
    moveInstrumentation(playButton, button);
  }

  const pauseButton = block.querySelector('[data-aue-prop="pauseIcon"]');
  if (pauseButton) {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('banner-d-block', 'banner-video-icon', 'banner-icon-pause', 'banner-bg-transparent', 'banner-d-flex', 'banner-align-items-center', 'banner-justify-content-center', 'banner-cursor-pointer');
    button.textContent = pauseButton.textContent.trim();
    playPauseWrapper.append(button);
    moveInstrumentation(pauseButton, button);
  }
  videoWrapper.append(playPauseWrapper);

  const muteUnmuteWrapper = document.createElement('div');
  muteUnmuteWrapper.classList.add('banner-position-absolute', 'banner-z-2', 'banner-d-flex', 'banner-justify-content-center', 'banner-align-items-center', 'banner-cursor-pointer', 'banner-mute-icon');

  const muteButton = block.querySelector('[data-aue-prop="muteIcon"]');
  if (muteButton) {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('banner-video-icon-volume', 'banner-icon-mute', 'banner-bg-transparent', 'banner-d-flex', 'banner-align-items-center', 'banner-justify-content-center', 'banner-cursor-pointer', 'banner-d-none');
    button.textContent = muteButton.textContent.trim();
    muteUnmuteWrapper.append(button);
    moveInstrumentation(muteButton, button);
  }

  const unmuteButton = block.querySelector('[data-aue-prop="unmuteIcon"]');
  if (unmuteButton) {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('banner-video-icon-volume', 'banner-icon-unmute', 'banner-bg-transparent', 'banner-d-flex', 'banner-align-items-center', 'banner-justify-content-center', 'banner-cursor-pointer', 'banner-d-none');
    button.textContent = unmuteButton.textContent.trim();
    muteUnmuteWrapper.append(button);
    moveInstrumentation(unmuteButton, button);
  }

  const noAudioButton = block.querySelector('[data-aue-prop="noAudioIcon"]');
  if (noAudioButton) {
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('banner-video-icon-volume', 'banner-no-audio-icon', 'banner-bg-transparent', 'banner-d-flex', 'banner-align-items-center', 'banner-justify-content-center', 'banner-cursor-pointer');
    button.textContent = noAudioButton.textContent.trim();
    muteUnmuteWrapper.append(button);
    moveInstrumentation(noAudioButton, button);
  }
  videoWrapper.append(muteUnmuteWrapper);

  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add('banner-position-absolute', 'banner-start-50', 'banner-translate-middle-x', 'banner-w-100', 'banner-boing__banner--cta');

  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('banner-cta');
  // Assuming CTA content is not directly authored in aue-prop for this block, but might be a nested block
  // For now, it remains empty as per the provided HTML structure.
  // If there was a specific AUE prop for CTA, we would extract it here.
  ctaWrapper.append(ctaDiv);

  wrapperDiv.append(videoWrapper, ctaWrapper);
  bannerSection.append(wrapperDiv);

  block.textContent = '';
  block.append(bannerSection);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}