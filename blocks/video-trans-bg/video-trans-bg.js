import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0 & 1: Replaced direct index access with content detection.
  // The BlockJson indicates a single root field "iframe-src" of type text.
  // This means the first (and only) row contains a single cell with the text content.
  const iframeSrcRow = [...block.children][0];
  const iframeSrcCell = [...iframeSrcRow.children].find(cell => cell.textContent.trim().length > 0);
  const iframeSrc = iframeSrcCell ? iframeSrcCell.textContent.trim() : '';

  const videoTransBg = document.createElement('div');
  videoTransBg.classList.add('videoTransBg');

  const videoBoxBg = document.createElement('div');
  videoBoxBg.classList.add('videoBoxBg');

  const videoClose = document.createElement('div');
  videoClose.classList.add('videoClose');
  videoClose.innerHTML = '&nbsp;';

  const iframe = document.createElement('iframe');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('height', '330');
  iframe.setAttribute('id', 'ifrmvideo');
  iframe.setAttribute('src', iframeSrc);
  iframe.setAttribute('width', '100%');

  videoBoxBg.append(videoClose, iframe);
  videoTransBg.append(videoBoxBg);

  moveInstrumentation(iframeSrcRow, videoTransBg);
  block.innerHTML = '';
  block.append(videoTransBg);

  // CHECK 2: Interactivity - videoClose button
  videoClose.addEventListener('click', () => {
    videoTransBg.classList.remove('show');
    iframe.src = ''; // Stop video playback
  });

  // Expose a function to show the video, as this block is a modal/overlay.
  // This function would be called by other blocks or elements on the page.
  window.showVideoTransBg = (src = iframeSrc) => {
    iframe.src = src;
    videoTransBg.classList.add('show');
  };
}
