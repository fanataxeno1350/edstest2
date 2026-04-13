import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use content detection instead of direct index access
  const videoUrlRow = [...block.children].find(row => row.querySelector('a[href*="youtube.com/watch"]'));
  const videoUrlCell = videoUrlRow?.querySelector('div');
  const videoLink = videoUrlCell?.querySelector('a');
  const url = videoLink ? videoLink.href : '';

  if (!url) {
    block.textContent = '';
    return;
  }

  const section = document.createElement('section');
  section.classList.add('video-cmp');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const videoContainerDiv = document.createElement('div');
  videoContainerDiv.classList.add('video-container', 'mx-auto', 'w-100');

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'youtube-video');

  const iframe = document.createElement('iframe');
  iframe.setAttribute('width', '100%');
  iframe.setAttribute('height', '100%');
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share;');
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  iframe.setAttribute('id', 'player1');

  // Extract video ID from URL and construct YouTube embed URL
  let embedUrl = '';
  try {
    const videoId = new URL(url).searchParams.get('v');
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1`;
    } else {
      // Handle direct embed links or other formats if necessary
      // For simplicity, assuming standard YouTube watch URL
      console.warn('Could not extract YouTube video ID from URL:', url);
    }
  } catch (e) {
    console.error('Invalid video URL:', url, e);
  }

  if (embedUrl) {
    iframe.setAttribute('src', embedUrl);
  } else {
    // If embedUrl is not valid, clear the block
    block.textContent = '';
    return;
  }

  positionRelativeDiv.append(iframe);
  videoContainerDiv.append(positionRelativeDiv);
  containerDiv.append(videoContainerDiv);
  section.append(containerDiv);

  block.textContent = '';
  if (videoUrlRow) { // Only move instrumentation if the row was found
    moveInstrumentation(videoUrlRow, section);
  }
  block.append(section);
}
