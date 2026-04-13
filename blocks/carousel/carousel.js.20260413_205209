import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider');

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickTrack.style.opacity = '1';

  [...block.children].forEach((row, index) => {
    const itemDiv = document.createElement('div');
    moveInstrumentation(row, itemDiv);
    itemDiv.classList.add(
      'cmp-our-foot-print__carousel-item',
      'cmp-carousel__item',
      `cmp-our-foot-print-carouselcard-index-${index}`,
      'slick-slide',
    );
    if (index === 0) {
      itemDiv.classList.add('slick-current', 'slick-active');
    }
    itemDiv.setAttribute('data-slick-index', index);
    itemDiv.setAttribute('aria-hidden', index !== 0);
    itemDiv.setAttribute('tabindex', index === 0 ? '0' : '-1');

    const itemContent = document.createElement('div');
    itemContent.classList.add('item');

    const card = document.createElement('div');
    card.classList.add('card', 'cmp-card--foot-print');
    // Apply specific background and highlight classes based on index or content if needed
    // Using default classes from original HTML
    if (index === 0) {
      card.classList.add('cmp-card--foot-print-highlighted', 'color-background-background-2');
    } else if (index === 1) {
      card.classList.add('cmp-card--foot-print-default', 'color-background-primary-6');
    } else {
      card.classList.add('cmp-card--foot-print-default', 'color-background-background-3');
    }

    const cmpCard = document.createElement('div');
    cmpCard.classList.add('cmp-card');

    const cmpCardContent = document.createElement('div');
    cmpCardContent.classList.add('cmp-card__content');

    const [titleCell, descCell, videoSrcCell] = [...row.children];

    const videoIframeSrc = videoSrcCell.textContent.trim();
    if (videoIframeSrc) {
      const cmpCardMedia = document.createElement('div');
      cmpCardMedia.classList.add('cmp-card__media');

      const cmpCardImage = document.createElement('div');
      cmpCardImage.classList.add('cmp-card__image');

      const videoDiv = document.createElement('div');
      videoDiv.classList.add('video', 'cmp-video--foot-print-card');

      const cmpVideo = document.createElement('div');
      cmpVideo.classList.add('cmp-video');

      const youtubeWrapper = document.createElement('div');
      youtubeWrapper.classList.add('cmp-video__youtube-wrapper');
      youtubeWrapper.style.minHeight = '200px';

      const iframeWrapper = document.createElement('div');
      iframeWrapper.classList.add('cmp-video__iframe-wrapper');

      const iframe = document.createElement('iframe');
      iframe.classList.add('cmp-video__iframe');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.setAttribute('title', titleCell.textContent.trim());
      iframe.setAttribute('width', '640');
      iframe.setAttribute('height', '360');
      iframe.setAttribute('src', videoIframeSrc);
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
      iframe.setAttribute('loading', 'lazy');

      iframeWrapper.append(iframe);
      youtubeWrapper.append(iframeWrapper);
      cmpVideo.append(youtubeWrapper);
      videoDiv.append(cmpVideo);
      cmpCardImage.append(videoDiv);
      cmpCardMedia.append(cmpCardImage);
      cmpCardContent.append(cmpCardMedia);
    }

    const cmpCardInfo = document.createElement('div');
    cmpCardInfo.classList.add('cmp-card__info');

    const cmpCardTitle = document.createElement('div');
    cmpCardTitle.classList.add('cmp-card__title');
    moveInstrumentation(titleCell, cmpCardTitle);
    cmpCardTitle.append(...titleCell.childNodes);

    const cmpCardDesc = document.createElement('div');
    cmpCardDesc.classList.add('cmp-card__desc');
    moveInstrumentation(descCell, cmpCardDesc);
    cmpCardDesc.append(...descCell.childNodes);

    cmpCardInfo.append(cmpCardTitle, cmpCardDesc);
    cmpCardContent.append(cmpCardInfo);
    cmpCard.append(cmpCardContent);
    card.append(cmpCard);
    itemContent.append(card);
    itemDiv.append(itemContent);
    slickTrack.append(itemDiv);
  });

  slickList.append(slickTrack);
  carouselContainer.append(slickList);

  const mainCarouselDiv = document.createElement('div');
  mainCarouselDiv.classList.add('cmp-carousel');
  mainCarouselDiv.setAttribute('data-component', 'carousel');
  mainCarouselDiv.setAttribute('data-show-infinite-scroll', 'false');
  mainCarouselDiv.setAttribute('data-show-arrows', 'true'); // Changed to true as per original HTML implies navigation
  mainCarouselDiv.setAttribute('data-show-dots', 'true');
  mainCarouselDiv.setAttribute('data-item-count-per-slide', '1');
  mainCarouselDiv.setAttribute('data-auto-play-is-enabled', 'false');
  mainCarouselDiv.setAttribute('data-auto-play-speed-in-ms', '500');
  mainCarouselDiv.setAttribute('data-reveal-next-item-partially', 'false');
  mainCarouselDiv.setAttribute('data-show-center-zoom', 'false');
  mainCarouselDiv.setAttribute('data-slides-to-scroll', '1');
  mainCarouselDiv.setAttribute('data-initialized', 'true');

  mainCarouselDiv.append(carouselContainer);

  // Add carousel navigation (arrows and dots)
  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('type', 'button');
  prevButton.textContent = 'Previous';
  mainCarouselDiv.append(prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('type', 'button');
  nextButton.textContent = 'Next';
  mainCarouselDiv.append(nextButton);

  const dotsContainer = document.createElement('ul');
  dotsContainer.classList.add('slick-dots');
  dotsContainer.setAttribute('role', 'tablist');
  [...block.children].forEach((_, index) => {
    const dotItem = document.createElement('li');
    dotItem.setAttribute('role', 'presentation');
    const dotButton = document.createElement('button');
    dotButton.setAttribute('type', 'button');
    dotButton.setAttribute('role', 'tab');
    dotButton.setAttribute('id', `slick-slide-control${index}`);
    dotButton.setAttribute('aria-controls', `slick-slide${index}`);
    dotButton.setAttribute('aria-label', `${index + 1} of ${block.children.length}`);
    dotButton.setAttribute('tabindex', '-1');
    dotButton.textContent = index + 1;
    if (index === 0) {
      dotItem.classList.add('slick-active');
      dotButton.setAttribute('tabindex', '0');
      dotButton.setAttribute('aria-selected', 'true');
    } else {
      dotButton.setAttribute('aria-selected', 'false');
    }
    dotItem.append(dotButton);
    dotsContainer.append(dotItem);

    dotButton.addEventListener('click', () => {
      // Simulate carousel slide change
      const currentActive = mainCarouselDiv.querySelector('.slick-active');
      if (currentActive) {
        currentActive.classList.remove('slick-active');
        currentActive.querySelector('button').setAttribute('aria-selected', 'false');
        currentActive.querySelector('button').setAttribute('tabindex', '-1');
      }

      const currentSlide = mainCarouselDiv.querySelector('.slick-current');
      if (currentSlide) {
        currentSlide.classList.remove('slick-current', 'slick-active');
        currentSlide.setAttribute('aria-hidden', 'true');
        currentSlide.setAttribute('tabindex', '-1');
      }

      dotItem.classList.add('slick-active');
      dotButton.setAttribute('aria-selected', 'true');
      dotButton.setAttribute('tabindex', '0');

      const targetSlide = mainCarouselDiv.querySelector(`[data-slick-index="${index}"]`);
      if (targetSlide) {
        targetSlide.classList.add('slick-current', 'slick-active');
        targetSlide.setAttribute('aria-hidden', 'false');
        targetSlide.setAttribute('tabindex', '0');
        slickTrack.style.transform = `translate3d(-${index * 100}%, 0px, 0px)`; // Basic slide simulation
      }
    });
  });
  mainCarouselDiv.append(dotsContainer);

  // Add event listeners for arrow navigation
  let currentIndex = 0;
  const totalSlides = block.children.length;

  const updateCarousel = (newIndex) => {
    // Remove active classes from current slide and dot
    const currentActiveSlide = mainCarouselDiv.querySelector('.slick-current');
    if (currentActiveSlide) {
      currentActiveSlide.classList.remove('slick-current', 'slick-active');
      currentActiveSlide.setAttribute('aria-hidden', 'true');
      currentActiveSlide.setAttribute('tabindex', '-1');
    }

    const currentActiveDot = mainCarouselDiv.querySelector('.slick-dots .slick-active');
    if (currentActiveDot) {
      currentActiveDot.classList.remove('slick-active');
      currentActiveDot.querySelector('button').setAttribute('aria-selected', 'false');
      currentActiveDot.querySelector('button').setAttribute('tabindex', '-1');
    }

    // Add active classes to new slide and dot
    const newSlide = mainCarouselDiv.querySelector(`[data-slick-index="${newIndex}"]`);
    if (newSlide) {
      newSlide.classList.add('slick-current', 'slick-active');
      newSlide.setAttribute('aria-hidden', 'false');
      newSlide.setAttribute('tabindex', '0');
      slickTrack.style.transform = `translate3d(-${newIndex * 100}%, 0px, 0px)`; // Basic slide simulation
    }

    const newDot = mainCarouselDiv.querySelector(`.slick-dots li:nth-child(${newIndex + 1})`);
    if (newDot) {
      newDot.classList.add('slick-active');
      newDot.querySelector('button').setAttribute('aria-selected', 'true');
      newDot.querySelector('button').setAttribute('tabindex', '0');
    }
    currentIndex = newIndex;
  };

  prevButton.addEventListener('click', () => {
    let newIndex = currentIndex - 1;
    if (newIndex < 0) {
      newIndex = totalSlides - 1; // Loop to last slide
    }
    updateCarousel(newIndex);
  });

  nextButton.addEventListener('click', () => {
    let newIndex = currentIndex + 1;
    if (newIndex >= totalSlides) {
      newIndex = 0; // Loop to first slide
    }
    updateCarousel(newIndex);
  });

  block.textContent = '';
  block.classList.add('slickcarousel', 'carousel', 'panelcontainer');
  block.append(mainCarouselDiv);
}
