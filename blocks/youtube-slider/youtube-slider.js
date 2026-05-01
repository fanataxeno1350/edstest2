import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const titleRow = children[0];
  const titleText = titleRow.querySelector('div')?.textContent.trim();

  const section = document.createElement('section');
  section.classList.add('demo');

  const container = document.createElement('div');
  container.classList.add('container');

  if (titleText) {
    const h2 = document.createElement('h2');
    h2.classList.add('videoTitle');
    h2.textContent = titleText;
    moveInstrumentation(titleRow, h2);
    block.prepend(h2);
  }

  const videoItems = children.slice(1); // All subsequent rows are video items

  videoItems.forEach((row, index) => {
    // CRITICAL FIX: Replaced index-based access with content detection
    const cells = [...row.children];
    const embedUrlCell = cells.find(cell => cell.textContent.trim().startsWith('http') || cell.textContent.trim().startsWith('https'));
    const videoTitleCell = cells.find(cell => cell !== embedUrlCell);

    const embedUrl = embedUrlCell?.textContent.trim();
    const videoTitle = videoTitleCell?.textContent.trim();

    const videoDiv = document.createElement('div');
    // The original HTML has inline styles for display, so we replicate that.
    // The slider logic will manage these.
    if (index === 0) {
      videoDiv.style.display = 'inline-block'; // First item is visible initially
    } else {
      videoDiv.style.display = 'none'; // Others are hidden
    }

    const anchor = document.createElement('a');
    anchor.href = 'javascript:void(0);'; // As per original HTML

    if (embedUrl) {
      const iframe = document.createElement('iframe');
      iframe.width = '560';
      iframe.height = '315';
      // Ensure autoplay is off initially, no related videos, as per review comments
      // and to match the original JS logic that adds autoplay=1 only on click.
      iframe.src = `${embedUrl}?autoplay=0&rel=0`;
      iframe.title = 'YouTube video player';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.referrerPolicy = 'strict-origin-when-cross-origin';
      iframe.allowFullscreen = true;
      anchor.append(iframe);
    }

    if (videoTitle) {
      const h4 = document.createElement('h4');
      h4.textContent = videoTitle;
      videoDiv.append(anchor, h4);
    } else {
      videoDiv.append(anchor);
    }

    moveInstrumentation(row, videoDiv);
    container.append(videoDiv);
  });

  const nextButton = document.createElement('button');
  nextButton.classList.add('next');
  const nextImg = document.createElement('img');
  nextImg.src = '/content/dam/aemigrate/uploaded-folder/www-savlon-in/image/right-arw-3c0542.png'; // Static asset
  nextImg.alt = 'Next'; // Add alt text for accessibility
  nextButton.append(nextImg);
  // OPTIMIZATION: Optimize button images
  const optimizedNextPic = createOptimizedPicture(nextImg.src, nextImg.alt, false, [{ width: '20' }]);
  moveInstrumentation(nextImg, optimizedNextPic.querySelector('img'));
  nextButton.replaceChild(optimizedNextPic, nextImg);


  const prevButton = document.createElement('button');
  prevButton.classList.add('prev');
  const prevImg = document.createElement('img');
  prevImg.src = '/content/dam/aemigrate/uploaded-folder/www-savlon-in/image/left-arw-39675c.png'; // Static asset
  prevImg.alt = 'Previous'; // Add alt text for accessibility
  prevButton.append(prevImg);
  // OPTIMIZATION: Optimize button images
  const optimizedPrevPic = createOptimizedPicture(prevImg.src, prevImg.alt, false, [{ width: '20' }]);
  moveInstrumentation(prevImg, optimizedPrevPic.querySelector('img'));
  prevButton.replaceChild(optimizedPrevPic, prevImg);


  container.append(nextButton, prevButton);
  section.append(container);
  block.append(section);

  block.setAttribute('id', 'youTubeSlider'); // As per original HTML

  // Slider logic
  let currentIndex = 0;
  const items = [...container.querySelectorAll('div[style*="display"]')]; // Select all video divs
  const itemAmt = items.length;
  let autoSlideInterval;

  function cycleItems() {
    items.forEach(item => item.style.display = 'none');
    if (itemAmt > 0) {
      items[currentIndex].style.display = 'inline-block';
    }
  }

  function startAutoSlide() {
    clearInterval(autoSlideInterval);
    if (itemAmt > 1) { // Only auto-slide if there's more than one item
      autoSlideInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % itemAmt;
        cycleItems();
      }, 6000);
    }
  }

  nextButton.addEventListener('click', () => {
    clearInterval(autoSlideInterval);
    currentIndex = (currentIndex + 1) % itemAmt;
    cycleItems();
    startAutoSlide();
  });

  prevButton.addEventListener('click', () => {
    clearInterval(autoSlideInterval);
    currentIndex = (currentIndex - 1 + itemAmt) % itemAmt;
    cycleItems();
    startAutoSlide();
  });

  // Initial display and start auto-slide
  if (itemAmt > 0) {
    cycleItems();
    startAutoSlide();
  }

  // Remove original block content
  children.forEach(child => child.remove());

  // The original image optimization loop is redundant now that button images are optimized directly.
  // However, if there were other images in the block, this would be useful.
  // Keeping it for robustness, but it won't find any pictures in this specific block structure anymore.
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
