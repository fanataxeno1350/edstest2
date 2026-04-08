import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('component-custom-slick-slider');

  const sliderContainer = document.createElement('div');
  sliderContainer.classList.add('regular', 'slider', 'hero_banner_height_70', 'slick-initialized', 'slick-slider');
  sliderContainer.setAttribute('data-rotation', 'False');
  sliderContainer.setAttribute('data-interval', '3000');
  sliderContainer.setAttribute('role', 'region');
  sliderContainer.setAttribute('aria-roledescription', 'carousel');

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickTrack.style.opacity = '1';
  // Width and transform will be set by JS, for now just initialize
  slickTrack.style.width = '0px';
  slickTrack.style.transform = 'translate3d(0px, 0px, 0px)';

  const slides = [...block.children];
  let currentSlideIndex = 0;

  slides.forEach((row, index) => {
    // All rows are 'slide' items based on the EDS Block Structure.
    // Each slide has 5 cells: video, desktop-image, mobile-image, heading, description.
    const cells = [...row.children];
    if (cells.length !== 5) return; // Skip malformed rows

    // Use content detection instead of index access for robustness
    const videoCell = cells.find(cell => cell.querySelector('video') || (cell.querySelector('a') && cell.textContent.trim().endsWith('.mp4')) || (cell.textContent.trim().endsWith('.mp4')));
    const desktopImageCell = cells.find(cell => cell.querySelector('picture') && cell.querySelector('img') && cell.querySelector('img').alt.includes('Desktop'));
    const mobileImageCell = cells.find(cell => cell.querySelector('picture') && cell.querySelector('img') && cell.querySelector('img').alt.includes('Mobile'));
    const headingCell = cells.find(cell => cell.querySelector('h1') || (cell.textContent.trim() && !cell.querySelector('picture') && !cell.querySelector('a') && !cell.querySelector('video') && !desktopImageCell.contains(cell) && !mobileImageCell.contains(cell))); // Heuristic for heading
    const descriptionCell = cells.find(cell => cell.querySelector('p') || (cell.textContent.trim() && !cell.querySelector('picture') && !cell.querySelector('a') && !cell.querySelector('video') && !headingCell.contains(cell) && !desktopImageCell.contains(cell) && !mobileImageCell.contains(cell))); // Heuristic for description

    // Fallback to original index access if content detection fails for non-media cells, though ideally content detection should be more robust
    const fallbackHeadingCell = headingCell || cells[3];
    const fallbackDescriptionCell = descriptionCell || cells[4];

    const slickSlide = document.createElement('div');
    slickSlide.classList.add('slick-slide');
    if (index === 0) {
      slickSlide.classList.add('slick-current', 'slick-active');
    }
    slickSlide.setAttribute('data-slick-index', index.toString());
    slickSlide.setAttribute('role', 'group');
    slickSlide.setAttribute('aria-roledescription', 'slide');
    slickSlide.style.width = '100%'; // Will be adjusted by JS

    const bannerSlider = document.createElement('div');
    bannerSlider.classList.add('banner-slider', 'hero_banner_height_70');
    bannerSlider.style.width = '100%';
    bannerSlider.style.display = 'inline-block';

    // Video
    if (videoCell) {
      const carouselVideo = document.createElement('div');
      carouselVideo.classList.add('carousel-video');
      const videoEl = videoCell.querySelector('video') || document.createElement('video');
      if (!videoEl.hasAttribute('playsinline')) videoEl.setAttribute('playsinline', '');
      if (!videoEl.hasAttribute('preload')) videoEl.setAttribute('preload', '');
      if (!videoEl.hasAttribute('autoplay')) videoEl.setAttribute('autoplay', '');
      if (!videoEl.hasAttribute('loop')) videoEl.setAttribute('loop', '');
      if (!videoEl.hasAttribute('muted')) videoEl.setAttribute('muted', '');
      
      const sourceEl = videoCell.querySelector('source');
      const linkEl = videoCell.querySelector('a');

      if (sourceEl) {
        moveInstrumentation(sourceEl, videoEl);
        videoEl.append(sourceEl);
      } else if (linkEl && linkEl.href.endsWith('.mp4')) {
        videoEl.src = linkEl.href;
      } else if (videoCell.textContent.trim().endsWith('.mp4')) {
        videoEl.src = videoCell.textContent.trim();
      }
      carouselVideo.append(videoEl);
      bannerSlider.append(carouselVideo);
    }

    // Desktop Image
    if (desktopImageCell) {
      const carouselDesktopImage = document.createElement('div');
      carouselDesktopImage.classList.add('carousel-image', 'carousel-desktop-image');
      const desktopPicture = desktopImageCell.querySelector('picture');
      if (desktopPicture) {
        const img = desktopPicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1920' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          carouselDesktopImage.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
        }
      }
      bannerSlider.append(carouselDesktopImage);
    }

    // Mobile Image
    if (mobileImageCell) {
      const carouselMobileImage = document.createElement('div');
      carouselMobileImage.classList.add('carousel-image', 'carousel-mobile-image');
      const mobilePicture = mobileImageCell.querySelector('picture');
      if (mobilePicture) {
        const img = mobilePicture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '768' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          carouselMobileImage.style.backgroundImage = `url(${optimizedPic.querySelector('img').src})`;
        }
      }
      bannerSlider.append(carouselMobileImage);
    }

    // Caption
    const carouselCaption = document.createElement('div');
    carouselCaption.classList.add('carousel-caption');

    const captionContent = document.createElement('div');
    captionContent.classList.add('caption-content', 'text-align', 'text-align-center');

    if (fallbackHeadingCell) {
      const heading = document.createElement('h1');
      heading.classList.add('banner-title-medium');
      moveInstrumentation(fallbackHeadingCell, heading);
      while (fallbackHeadingCell.firstChild) heading.append(fallbackHeadingCell.firstChild);
      captionContent.append(heading);
    }

    if (fallbackDescriptionCell) {
      const description = document.createElement('p');
      description.classList.add('yellow-large');
      moveInstrumentation(fallbackDescriptionCell, description);
      while (fallbackDescriptionCell.firstChild) description.append(fallbackDescriptionCell.firstChild);
      captionContent.append(description);
    }

    carouselCaption.append(captionContent);
    bannerSlider.append(carouselCaption);

    slickSlide.append(document.createElement('div').append(bannerSlider));
    slickTrack.append(slickSlide);
  });

  slickList.append(slickTrack);
  sliderContainer.append(slickList);
  section.append(sliderContainer);

  block.textContent = '';
  block.append(section);

  // Implement basic slick slider functionality
  const rotation = sliderContainer.dataset.rotation === 'True';
  const interval = parseInt(sliderContainer.dataset.interval, 10) || 3000;
  
  // Ensure there are slides before trying to access children
  const slideWidth = slickTrack.children.length > 0 ? slickTrack.children[0].offsetWidth : 0;
  slickTrack.style.width = `${slides.length * slideWidth}px`;

  const updateSlider = () => {
    slickTrack.style.transition = 'transform 0.5s ease-in-out';
    slickTrack.style.transform = `translate3d(-${currentSlideIndex * slideWidth}px, 0px, 0px)`;

    [...slickTrack.children].forEach((slide, idx) => {
      slide.classList.remove('slick-current', 'slick-active');
      if (idx === currentSlideIndex) {
        slide.classList.add('slick-current', 'slick-active');
      }
    });
  };

  const nextSlide = () => {
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    updateSlider();
  };

  if (rotation && slides.length > 1) {
    setInterval(nextSlide, interval);
  }

  // Handle window resize to update slide width and position
  window.addEventListener('resize', () => {
    const newSlideWidth = slickTrack.children.length > 0 ? slickTrack.children[0].offsetWidth : 0;
    slickTrack.style.width = `${slides.length * newSlideWidth}px`;
    slickTrack.style.transition = 'none'; // Disable transition during resize
    slickTrack.style.transform = `translate3d(-${currentSlideIndex * newSlideWidth}px, 0px, 0px)`;
  });

  // Initial update
  if (slides.length > 0) { // Only update if there are slides
    updateSlider();
  }
}
