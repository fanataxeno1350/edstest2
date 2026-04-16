import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const bannerItems = [...block.children];

  const alHomeTop = document.createElement('div');
  alHomeTop.classList.add('alHomeTop');
  moveInstrumentation(block, alHomeTop);

  const owlCarousel = document.createElement('div');
  owlCarousel.classList.add('owl-carousel', 'undefined', 'owl-loaded', 'owl-drag');

  const owlStageOuter = document.createElement('div');
  owlStageOuter.classList.add('owl-stage-outer');

  const owlStage = document.createElement('div');
  owlStage.classList.add('owl-stage');
  owlStage.style.transition = 'all'; // Keep this as it's a transition property, not a dimension
  owlStage.style.transform = 'translate3d(0px, 0px, 0px)'; // Keep this as it's a transform property, not a dimension

  bannerItems.forEach((row, index) => {
    // CRITICAL FIX: Replaced row.children[n] with content detection
    const cells = [...row.children];
    const videoCell = cells.find(cell => cell.querySelector('picture') && cell.textContent.includes('.mp4')); // Assuming video links contain .mp4
    const posterCell = cells.find(cell => cell.querySelector('picture') && !cell.textContent.includes('.mp4')); // Assuming poster is the other picture

    const owlItem = document.createElement('div');
    owlItem.classList.add('owl-item');
    if (index === 0) {
      owlItem.classList.add('active', 'center');
    }
    // Do NOT set width here, let CSS handle it.

    const topBanner = document.createElement('div');
    topBanner.classList.add('topBanner');

    const videoContainer = document.createElement('div');
    videoContainer.classList.add('video', 'item-video');

    const videoElement = document.createElement('video');
    videoElement.setAttribute('preload', 'none');
    videoElement.setAttribute('loop', '');
    videoElement.setAttribute('autoplay', '');
    videoElement.setAttribute('playsinline', '');

    if (posterCell) {
      const posterPicture = posterCell.querySelector('picture');
      const posterImg = posterPicture ? posterPicture.querySelector('img') : null;
      if (posterImg) {
        videoElement.setAttribute('poster', posterImg.src);
      }
    }

    if (videoCell) {
      const videoLink = videoCell.querySelector('picture');
      if (videoLink) {
        const source = document.createElement('source');
        source.setAttribute('data-src', videoLink.querySelector('img').src);
        source.setAttribute('type', 'video/mp4');
        source.setAttribute('src', videoLink.querySelector('img').src);
        videoElement.appendChild(source);
      }
    }

    videoContainer.appendChild(videoElement);
    topBanner.appendChild(videoContainer);

    const scrollDown = document.createElement('div');
    scrollDown.classList.add('scrollDown');
    const mouse = document.createElement('span');
    mouse.classList.add('mouse');
    const move = document.createElement('span');
    move.classList.add('move');
    mouse.appendChild(move);
    scrollDown.appendChild(mouse);
    topBanner.appendChild(scrollDown);

    owlItem.appendChild(topBanner);
    owlStage.appendChild(owlItem);

    // Move instrumentation from the original row to the owlItem
    moveInstrumentation(row, owlItem);
  });

  owlStageOuter.appendChild(owlStage);
  owlCarousel.appendChild(owlStageOuter);

  const owlNav = document.createElement('div');
  owlNav.classList.add('owl-nav', 'disabled');
  const prevButton = document.createElement('button');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('role', 'presentation');
  prevButton.classList.add('owl-prev');
  prevButton.innerHTML = '<span aria-label="Previous">‹</span>';
  const nextButton = document.createElement('button');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('role', 'presentation');
  nextButton.classList.add('owl-next');
  nextButton.innerHTML = '<span aria-label="Next">›</span>';
  owlNav.appendChild(prevButton);
  owlNav.appendChild(nextButton);
  owlCarousel.appendChild(owlNav);

  const owlDots = document.createElement('div');
  owlDots.classList.add('owl-dots', 'disabled');
  owlCarousel.appendChild(owlDots);

  alHomeTop.appendChild(owlCarousel);
  block.replaceWith(alHomeTop);

  // Image optimization
  alHomeTop.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Basic carousel functionality (simplified from owl-carousel)
  let currentIndex = 0;
  const items = [...owlStage.children];
  const totalItems = items.length;

  const updateCarousel = () => {
    owlStage.style.transform = `translate3d(-${currentIndex * 100}%, 0px, 0px)`;
    items.forEach((item, i) => {
      item.classList.remove('active', 'center');
      if (i === currentIndex) {
        item.classList.add('active', 'center');
      }
    });
    // owlNav and owlDots are disabled by default if totalItems <= 1
    // No need to toggle 'disabled' class if it's already set correctly
  };

  if (totalItems > 1) {
    owlNav.classList.remove('disabled');
    owlDots.classList.remove('disabled');

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalItems) % totalItems;
      updateCarousel();
    });

    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalItems;
      updateCarousel();
    });
  } else {
    owlNav.classList.add('disabled');
    owlDots.classList.add('disabled');
  }

  updateCarousel(); // Initial update
}
