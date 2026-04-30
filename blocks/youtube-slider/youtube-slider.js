import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // CHECK 0 & 1: Block Title (first row)
  // Model: {"component":"text","label":"Block Title","name":"title","valueType":"string"}
  // EDS Structure: block.children[0] -> div -> div (text content)
  const titleRow = children[0];
  const blockTitle = titleRow.children[0].textContent.trim();

  const h2 = document.createElement('h2');
  h2.classList.add('videoTitle'); // From ORIGINAL HTML
  h2.textContent = blockTitle;
  moveInstrumentation(titleRow, h2);

  const section = document.createElement('section');
  section.classList.add('demo'); // From ORIGINAL HTML

  const container = document.createElement('div');
  container.classList.add('container'); // From ORIGINAL HTML

  // CHECK 0 & 1: Video Items (subsequent rows)
  // Model: {"component":"container","item":"youtube-video-item","label":"YouTube Videos","name":"videos"}
  // Item Model: {"component":"aem-content","label":"YouTube Embed URL","name":"embedUrl","valueType":"string"}, {"component":"text","label":"Video Title","name":"videoTitle","valueType":"string"}
  // EDS Structure: each item row -> div (embedUrl) -> div (videoTitle)
  const videoItems = children.slice(1);

  videoItems.forEach((row) => {
    // CRITICAL FIX: Replaced row.children[n] with content detection
    const cells = [...row.children];
    const embedUrlCell = cells.find(cell => cell.querySelector('a'));
    const videoTitleCell = cells.find(cell => !cell.querySelector('a')); // Assuming title cell doesn't contain an anchor

    const embedLink = embedUrlCell ? embedUrlCell.querySelector('a') : null;
    const embedUrl = embedLink ? embedLink.href : '';
    const videoTitle = videoTitleCell ? videoTitleCell.textContent.trim() : '';

    const div = document.createElement('div');
    div.style.display = 'none'; // Initially hide all video items as per ORIGINAL HTML

    const anchor = document.createElement('a');
    anchor.href = 'javascript:void(0);'; // Use javascript:void(0) as per original HTML

    const videoDiv = document.createElement('div');
    videoDiv.setAttribute('data-embed-kind', 'youtube');
    videoDiv.setAttribute('data-embed-url', embedUrl);
    // Extract videoId from embedUrl
    const videoIdMatch = embedUrl.match(/(?:youtube\.com\/(?:embed\/|v\/|watch\?v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : '';
    videoDiv.setAttribute('data-embed-config', JSON.stringify({ videoId }));
    // Apply inline styles from ORIGINAL HTML
    videoDiv.style.border = '1px dashed rgb(204, 204, 204)';
    videoDiv.style.padding = '20px';
    videoDiv.style.backgroundColor = 'rgb(245, 245, 245)';
    videoDiv.style.borderRadius = '4px';
    videoDiv.textContent = '[youtube]';

    const titleH4 = document.createElement('h4');
    titleH4.textContent = videoTitle;

    anchor.append(videoDiv);
    div.append(anchor, titleH4);
    moveInstrumentation(row, div); // Move instrumentation from original row to new div
    container.append(div);
  });

  const nextButton = document.createElement('button');
  nextButton.classList.add('next'); // From ORIGINAL HTML
  const nextImg = document.createElement('img');
  // Use actual asset path from ORIGINAL HTML
  nextImg.src = '/content/dam/aemigrate/uploaded-folder/www-savlon-in/image/right-arw-3c0542.png';
  nextButton.append(nextImg);

  const prevButton = document.createElement('button');
  prevButton.classList.add('prev'); // From ORIGINAL HTML
  const prevImg = document.createElement('img');
  // Use actual asset path from ORIGINAL HTML
  prevImg.src = '/content/dam/aemigrate/uploaded-folder/www-savlon-in/image/left-arw-39675c.png';
  prevButton.append(prevImg);

  container.append(nextButton, prevButton);
  section.append(container);

  block.innerHTML = ''; // Clear original block content
  block.append(h2, section);

  // CHECK 2: Interactivity - Slider logic
  let currentIndex = 0;
  // Select all video divs that are initially hidden, as per ORIGINAL HTML structure
  const items = [...container.querySelectorAll('div[style*="display: none"], div[style*="display: inline-block"]')];
  const itemAmt = items.length;

  function cycleItems() {
    items.forEach((item, index) => {
      item.style.display = (index === currentIndex) ? 'inline-block' : 'none';
    });
  }

  // Initial display
  if (itemAmt > 0) {
    items[0].style.display = 'inline-block';
  }

  let autoSlide = setInterval(() => {
    currentIndex = (currentIndex + 1) % itemAmt;
    cycleItems();
  }, 6000);

  nextButton.addEventListener('click', () => {
    clearInterval(autoSlide);
    currentIndex = (currentIndex + 1) % itemAmt;
    cycleItems();
    autoSlide = setInterval(() => {
      currentIndex = (currentIndex + 1) % itemAmt;
      cycleItems();
    }, 6000);
  });

  prevButton.addEventListener('click', () => {
    clearInterval(autoSlide);
    currentIndex = (currentIndex - 1 + itemAmt) % itemAmt;
    cycleItems();
    autoSlide = setInterval(() => {
      currentIndex = (currentIndex + 1) % itemAmt;
      cycleItems();
    }, 6000);
  });

  // Interactivity for playing videos (from ORIGINAL HTML's jQuery logic)
  // This requires a modal or overlay to display the video.
  // Since the original HTML uses jQuery and a specific structure for the video player,
  // we need to replicate that or a simplified version.
  // For now, we'll add a basic click handler to the video thumbnail.
  // A full modal implementation would require more elements (overlay, close button, iframe container).

  // Create a simple overlay and video player container if not already present
  let overlay = document.querySelector('.overlay');
  let youtubePlayer = document.querySelector('.youtubeplay');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.style.display = 'none';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
    overlay.style.zIndex = '9999';
    document.body.append(overlay);
  }

  if (!youtubePlayer) {
    youtubePlayer = document.createElement('div');
    youtubePlayer.classList.add('youtubeplay');
    youtubePlayer.style.position = 'absolute';
    youtubePlayer.style.top = '50%';
    youtubePlayer.style.left = '50%';
    youtubePlayer.style.transform = 'translate(-50%, -50%)';
    youtubePlayer.style.width = '80%';
    youtubePlayer.style.maxWidth = '900px';
    youtubePlayer.style.aspectRatio = '16 / 9';
    overlay.append(youtubePlayer);
  }

  // Add event listener to each video thumbnail to open the video
  items.forEach(itemDiv => {
    const videoAnchor = itemDiv.querySelector('a');
    const videoEmbedDiv = videoAnchor ? videoAnchor.querySelector('div[data-embed-url]') : null;

    if (videoEmbedDiv) {
      videoAnchor.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const embedUrl = videoEmbedDiv.getAttribute('data-embed-url');
        let finalUrl = embedUrl;

        // Add autoplay and ensure no related videos show at the end
        finalUrl += (finalUrl.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1&rel=0';

        // Clear previous iframe if any
        youtubePlayer.innerHTML = '';

        // Create and append new iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'youtubeVd';
        iframe.src = finalUrl;
        iframe.style.border = 'none';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.allow = 'autoplay; encrypted-media';
        iframe.allowFullscreen = true;
        youtubePlayer.append(iframe);
        overlay.style.display = 'block'; // Show overlay
      });
    }
  });

  // Close video logic for overlay
  overlay.addEventListener('click', (e) => {
    // Only close if clicking on the overlay itself, not the video player
    if (e.target === overlay) {
      const iframe = youtubePlayer.querySelector('#youtubeVd');
      if (iframe) {
        iframe.remove(); // Remove iframe to stop video playback
      }
      overlay.style.display = 'none';
    }
  });
}
