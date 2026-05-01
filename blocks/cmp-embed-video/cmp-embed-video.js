import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CRITICAL FIX: Replaced direct index access with content detection for root rows.
  // The block.children here refers to the direct children of the block, which are the rows.
  // Each row contains a single cell with the actual content.
  const rows = [...block.children];

  const videoIdCell = rows[0]?.querySelector('div'); // The actual cell is inside the row div
  const videoNameCell = rows[1]?.querySelector('div');
  const thumbnailCell = rows[2]?.querySelector('div');
  const playIconCell = rows[3]?.querySelector('div');

  const videoId = videoIdCell?.textContent.trim();
  const videoName = videoNameCell?.textContent.trim();
  const thumbnailPicture = thumbnailCell?.querySelector('picture');
  const playIconPicture = playIconCell?.querySelector('picture');

  block.innerHTML = '';
  block.classList.add('cmp-embed-video', 'cmp-embed-video-youtube', 'video-player-variant-no-preview');

  const wrapper = document.createElement('div');
  wrapper.classList.add('cmp-embed-video__wrapper');

  const overlay = document.createElement('div');
  overlay.classList.add('cmp-embed-video__overlay');

  const imageDiv = document.createElement('div');
  imageDiv.classList.add('cmp-embed-video__image', 'yt-thumbnailImage');
  if (thumbnailPicture) {
    const img = thumbnailPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageDiv.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('cmp-image__image');
    }
  }
  overlay.append(imageDiv);

  const playIconDiv = document.createElement('div');
  playIconDiv.classList.add('cmp-embed-video__playicon');
  playIconDiv.setAttribute('role', 'button');
  playIconDiv.setAttribute('tabindex', '0');
  playIconDiv.setAttribute('data-cmp-clickable', 'true');

  if (playIconPicture) {
    const img = playIconPicture.querySelector('img');
    if (img) {
      const optimizedPlayIcon = createOptimizedPicture(img.src, img.alt, false, [{ width: '80' }]);
      moveInstrumentation(img, optimizedPlayIcon.querySelector('img'));
      playIconDiv.append(optimizedPlayIcon);
    }
  } else {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
        <g data-name="Group 4316" transform="translate(-670 -487)">
          <circle data-name="Ellipse 32" cx="40" cy="40" r="40" transform="translate(670 487)" opacity="0.8"></circle>
          <path data-name="Path 206" d="M164.274,28.243,143.591,14.477a2.677,2.677,0,0,0-4.15,2.214v27.5a2.667,2.667,0,0,0,4.15,2.214l20.682-13.765a2.65,2.65,0,0,0,0-4.393Z" transform="translate(557.559 495.971)" fill="#fff"></path>
        </g>
      </svg>
    `;
    playIconDiv.innerHTML += svg;
  }

  const srOnlySpan = document.createElement('span');
  srOnlySpan.classList.add('cmp-ul-sr-only');
  srOnlySpan.textContent = `Play video ${videoName || ''}`;
  playIconDiv.append(srOnlySpan);
  overlay.append(playIconDiv);
  wrapper.append(overlay);

  const playerContainer = document.createElement('div');
  playerContainer.classList.add('cmp-embed-video__player_container');

  const iframe = document.createElement('iframe');
  iframe.classList.add('cmp-embed-video__player', 'video-on-load');
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('title', videoName || 'Video');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');
  iframe.style.minHeight = '390px';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'autoplay; fullscreen');
  iframe.setAttribute('aria-label', 'Video');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('data-src', `https://www.youtube-nocookie.com/embed/${videoId}?origin=${window.location.origin}&hl=en_IN&mute=0&autoplay=1&loop=0&playsinline=0&rel=0&modestbranding=1&controls=1&enablejsapi=1`);

  playerContainer.append(iframe);
  wrapper.append(playerContainer);

  block.append(wrapper);

  playIconDiv.addEventListener('click', () => {
    overlay.style.display = 'none';
    iframe.src = iframe.getAttribute('data-src');
  });

  // moveInstrumentation should be called on the original parent elements before they are removed
  // The original block.children are the rows, not the cells directly.
  // So we pass the row element itself for instrumentation.
  rows.forEach((row) => moveInstrumentation(row, block));
}
