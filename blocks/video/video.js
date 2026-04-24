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

  const desktopPlaceholderImage = desktopPlaceholderImageCell?.querySelector('img')?.src;
  const mobilePlaceholderImage = mobilePlaceholderImageCell?.querySelector('img')?.src;
  const desktopVideoUrl = desktopVideoUrlCell?.querySelector('img')?.src;
  const mobileVideoUrl = mobileVideoUrlCell?.querySelector('img')?.src;
  const autoPlay = autoPlayCell?.textContent.trim() === 'true';
  const progressBar = progressBarCell?.textContent.trim() === 'true';

  block.innerHTML = '';
  block.classList.add('cmp-video');

  const video = document.createElement('video');
  video.classList.add('cmp-video__player');

  // Set video sources based on screen width
  const sourceDesktop = document.createElement('source');
  sourceDesktop.src = desktopVideoUrl;
  sourceDesktop.media = '(min-width: 768px)';
  video.appendChild(sourceDesktop);

  const sourceMobile = document.createElement('source');
  sourceMobile.src = mobileVideoUrl;
  sourceMobile.media = '(max-width: 767px)';
  video.appendChild(sourceMobile);

  // Set common video attributes
  video.controls = progressBar;
  video.autoplay = autoPlay;
  video.muted = autoPlay; // Mute if autoplaying
  video.playsInline = autoPlay; // Plays inline if autoplaying
  video.loop = false; // Based on original HTML, loop is false
  video.disablePictureInPicture = true;
  video.controlsList = 'nodownload noremoteplayback noplaybackrate';

  // Set poster image based on screen width
  const setPoster = () => {
    if (window.innerWidth >= 768 && desktopPlaceholderImage) {
      video.poster = desktopPlaceholderImage;
    } else if (mobilePlaceholderImage) {
      video.poster = mobilePlaceholderImage;
    }
  };
  setPoster();
  window.addEventListener('resize', setPoster);

  // Add optimized pictures for placeholder images if they exist
  if (desktopPlaceholderImage) {
    const desktopPic = createOptimizedPicture(desktopPlaceholderImage, 'Desktop Video Placeholder', false, [{ width: '750' }]);
    // We don't append this picture directly, it's used for the video poster attribute.
    // If we wanted to display it separately, we would append it.
  }
  if (mobilePlaceholderImage) {
    const mobilePic = createOptimizedPicture(mobilePlaceholderImage, 'Mobile Video Placeholder', false, [{ width: '750' }]);
    // Same as desktopPic, used for poster.
  }

  const playButton = document.createElement('div');
  playButton.classList.add('cmp-video__play-button');
  playButton.setAttribute('aria-label', 'Play');
  playButton.setAttribute('role', 'button');

  // Initial state: show play button if not autoplaying
  if (!autoPlay) {
    playButton.style.display = 'block';
    video.style.display = 'none'; // Hide video initially if not autoplaying
  } else {
    playButton.style.display = 'none';
    video.style.display = 'block';
  }

  playButton.addEventListener('click', () => {
    video.style.display = 'block';
    playButton.style.display = 'none';
    video.play();
  });

  video.addEventListener('play', () => {
    playButton.style.display = 'none';
  });

  video.addEventListener('pause', () => {
    if (!video.ended) {
      playButton.style.display = 'block';
    }
  });

  video.addEventListener('ended', () => {
    playButton.style.display = 'block';
    video.currentTime = 0; // Reset video to start
  });

  block.append(video, playButton);

  // Move instrumentation from original cells to the new video and playButton elements
  moveInstrumentation(desktopPlaceholderImageCell, video);
  moveInstrumentation(mobilePlaceholderImageCell, video);
  moveInstrumentation(desktopVideoUrlCell, video);
  moveInstrumentation(mobileVideoUrlCell, video);
  moveInstrumentation(autoPlayCell, video);
  moveInstrumentation(progressBarCell, video);
}
