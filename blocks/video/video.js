import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    desktopPlaceholderImageCell,
    mobilePlaceholderImageCell,
    desktopVideoUrlCell,
    mobileVideoUrlCell,
    autoPlayCell,
    progressBarCell,
  ] = [...block.children];

  const desktopPlaceholderImage = desktopPlaceholderImageCell?.querySelector('picture');
  const mobilePlaceholderImage = mobilePlaceholderImageCell?.querySelector('picture');
  const desktopVideoUrl = desktopVideoUrlCell?.querySelector('picture');
  const mobileVideoUrl = mobileVideoUrlCell?.querySelector('picture');
  const autoPlay = autoPlayCell?.textContent.trim() === 'true';
  const progressBar = progressBarCell?.textContent.trim() === 'true';

  const videoWrapper = document.createElement('div');
  videoWrapper.classList.add('cmp-video');
  moveInstrumentation(block, videoWrapper);

  const videoElement = document.createElement('video');
  videoElement.classList.add('cmp-video__player');
  videoElement.setAttribute('disablepictureinpicture', '');
  videoElement.setAttribute('controlslist', 'nodownload noremoteplayback noplaybackrate');

  if (progressBar) {
    videoElement.setAttribute('controls', '');
  }

  if (autoPlay) {
    videoElement.setAttribute('autoplay', '');
    videoElement.setAttribute('muted', '');
    videoElement.setAttribute('playsinline', '');
  }

  // Set video source based on viewport
  const setVideoSource = () => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (isMobile && mobileVideoUrl) {
      const mobileVideoSrc = mobileVideoUrl.querySelector('img')?.src;
      if (mobileVideoSrc) {
        videoElement.src = mobileVideoSrc;
        if (mobilePlaceholderImage) {
          videoElement.poster = mobilePlaceholderImage.querySelector('img')?.src;
        }
      }
    } else if (desktopVideoUrl) {
      const desktopVideoSrc = desktopVideoUrl.querySelector('img')?.src;
      if (desktopVideoSrc) {
        videoElement.src = desktopVideoSrc;
        if (desktopPlaceholderImage) {
          videoElement.poster = desktopPlaceholderImage.querySelector('img')?.src;
        }
      }
    }
  };

  setVideoSource();
  window.addEventListener('resize', setVideoSource);

  const playButton = document.createElement('div');
  playButton.classList.add('cmp-video__play-button');
  playButton.setAttribute('aria-label', 'Play');
  playButton.setAttribute('role', 'button');

  playButton.addEventListener('click', () => {
    if (videoElement.paused) {
      videoElement.play();
      playButton.style.display = 'none';
      videoElement.setAttribute('controls', ''); // Show controls on play
    }
  });

  videoElement.addEventListener('play', () => {
    playButton.style.display = 'none';
  });

  videoElement.addEventListener('pause', () => {
    playButton.style.display = 'block';
  });

  videoElement.addEventListener('ended', () => {
    playButton.style.display = 'block';
    videoElement.removeAttribute('controls'); // Hide controls when video ends
  });

  videoWrapper.append(videoElement, playButton);

  block.innerHTML = '';
  block.append(videoWrapper);

  // Optimize images
  videoWrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
