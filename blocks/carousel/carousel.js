import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel', 'cmp-carousel__container', 'slick-initialized', 'slick-slider');
  carouselContainer.setAttribute('data-component', 'carousel');
  carouselContainer.setAttribute('data-show-infinite-scroll', 'false');
  carouselContainer.setAttribute('data-show-arrows', 'true'); // Changed to true for navigation
  carouselContainer.setAttribute('data-show-dots', 'true');
  carouselContainer.setAttribute('data-item-count-per-slide', '1');
  carouselContainer.setAttribute('data-auto-play-is-enabled', 'false');
  carouselContainer.setAttribute('data-auto-play-speed-in-ms', '500');
  carouselContainer.setAttribute('data-reveal-next-item-partially', 'false');
  carouselContainer.setAttribute('data-show-center-zoom', 'false');
  carouselContainer.setAttribute('data-slides-to-scroll', '1');
  carouselContainer.setAttribute('data-initialized', 'true');

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickTrack.style.opacity = '1';
  slickTrack.style.width = '100%'; // Will be adjusted by JS for actual width
  slickTrack.style.transform = 'translate3d(0px, 0px, 0px)';

  const items = [...block.children];
  const totalSlides = items.length;
  let currentSlideIndex = 0;

  items.forEach((row, index) => {
    const itemDiv = document.createElement('div');
    moveInstrumentation(row, itemDiv);
    itemDiv.classList.add('cmp-our-foot-print__carousel-item', 'cmp-carousel__item', `cmp-our-foot-print-carouselcard-index-${index}`, 'slick-slide');
    if (index === 0) {
      itemDiv.classList.add('slick-current', 'slick-active');
      itemDiv.setAttribute('tabindex', '0');
    } else {
      itemDiv.setAttribute('tabindex', '-1');
    }
    itemDiv.setAttribute('data-slick-index', index);
    itemDiv.setAttribute('aria-hidden', index !== 0);
    itemDiv.style.width = '100%'; // Each slide takes full width

    const itemContent = document.createElement('div');
    itemContent.classList.add('item');

    const card = document.createElement('div');
    card.classList.add('card', 'cmp-card--foot-print');
    card.classList.add(index % 3 === 0 ? 'color-background-background-2' : (index % 3 === 1 ? 'color-background-primary-6' : 'color-background-background-3'));
    if (index === 0) {
      card.classList.add('cmp-card--foot-print-highlighted');
    } else {
      card.classList.add('cmp-card--foot-print-default');
    }

    const cmpCard = document.createElement('div');
    cmpCard.classList.add('cmp-card');

    const cmpCardContent = document.createElement('div');
    cmpCardContent.classList.add('cmp-card__content');

    let videoEmbedCell = null;
    let titleCell = null;
    let descriptionCell = null;

    // Use content detection to find cells
    const cells = [...row.children];
    videoEmbedCell = cells.find(cell => cell.querySelector('picture'));
    titleCell = cells.find(cell => !cell.querySelector('picture') && cell.textContent.trim() !== '');
    descriptionCell = cells.find(cell => cell !== titleCell && !cell.querySelector('picture') && cell.textContent.trim() !== '');


    if (videoEmbedCell) {
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
      youtubeWrapper.style.minHeight = '200px'; // Apply min-height directly as a style

      const iframeWrapper = document.createElement('div');
      iframeWrapper.classList.add('cmp-video__iframe-wrapper');

      const picture = videoEmbedCell.querySelector('picture');
      const img = picture ? picture.querySelector('img') : null;
      if (img && img.src.includes('youtube.com/embed/')) {
        const iframe = document.createElement('iframe');
        iframe.classList.add('cmp-video__iframe');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        iframe.setAttribute('title', img.alt);
        iframe.setAttribute('width', '640');
        iframe.setAttribute('height', '360');
        iframe.src = img.src;
        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
        iframeWrapper.append(iframe);
      } else if (picture) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
        cmpCardImage.append(optimizedPic);
      }

      if (iframeWrapper.firstChild) {
        youtubeWrapper.append(iframeWrapper);
        cmpVideo.append(youtubeWrapper);
        videoDiv.append(cmpVideo);
        cmpCardImage.append(videoDiv);
      }
      cmpCardMedia.append(cmpCardImage);
      cmpCardContent.append(cmpCardMedia);
    }

    const cmpCardInfo = document.createElement('div');
    cmpCardInfo.classList.add('cmp-card__info');

    if (titleCell) {
      const cmpCardTitle = document.createElement('div');
      cmpCardTitle.classList.add('cmp-card__title');
      moveInstrumentation(titleCell, cmpCardTitle);
      while (titleCell.firstChild) cmpCardTitle.append(titleCell.firstChild);
      cmpCardInfo.append(cmpCardTitle);
    }

    if (descriptionCell) {
      const cmpCardDesc = document.createElement('div');
      cmpCardDesc.classList.add('cmp-card__desc');
      moveInstrumentation(descriptionCell, cmpCardDesc);
      while (descriptionCell.firstChild) cmpCardDesc.append(descriptionCell.firstChild);
      cmpCardInfo.append(cmpCardDesc);
    }

    cmpCardContent.append(cmpCardInfo);
    cmpCard.append(cmpCardContent);
    // Removed the duplicate append: cmpCard.append(cmpCardContent);
    itemContent.append(card);
    itemDiv.append(itemContent);
    slickTrack.append(itemDiv);
  });

  slickList.append(slickTrack);
  carouselContainer.append(slickList);

  // Add navigation buttons
  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('type', 'button');
  prevButton.style.display = 'block';
  prevButton.textContent = 'Previous';

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('type', 'button');
  nextButton.style.display = 'block';
  nextButton.textContent = 'Next';

  carouselContainer.append(prevButton, nextButton);

  // Add dots navigation
  const slickDots = document.createElement('ul');
  slickDots.classList.add('slick-dots');
  slickDots.setAttribute('role', 'tablist');

  for (let i = 0; i < totalSlides; i += 1) {
    const dotLi = document.createElement('li');
    dotLi.setAttribute('role', 'presentation');
    if (i === 0) {
      dotLi.classList.add('slick-active');
    }
    const dotButton = document.createElement('button');
    dotButton.setAttribute('type', 'button');
    dotButton.setAttribute('data-role', 'none');
    dotButton.setAttribute('role', 'button');
    dotButton.setAttribute('tabindex', i === 0 ? '0' : '-1');
    dotButton.setAttribute('aria-label', `Slide ${i + 1}`);
    dotButton.textContent = i + 1;
    dotLi.append(dotButton);
    slickDots.append(dotLi);

    dotButton.addEventListener('click', () => {
      goToSlide(i);
    });
  }
  carouselContainer.append(slickDots);

  block.textContent = '';
  block.classList.add('slickcarousel', 'carousel', 'panelcontainer');
  block.append(carouselContainer);

  // Interactivity for carousel
  const updateCarousel = () => {
    const slides = slickTrack.children;
    const dots = slickDots.children;

    // Update slide visibility and attributes
    [...slides].forEach((slide, idx) => {
      if (idx === currentSlideIndex) {
        slide.classList.add('slick-current', 'slick-active');
        slide.setAttribute('aria-hidden', 'false');
        slide.setAttribute('tabindex', '0');
        slide.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
      } else {
        slide.classList.remove('slick-current', 'slick-active');
        slide.setAttribute('aria-hidden', 'true');
        slide.setAttribute('tabindex', '-1');
      }
    });

    // Update dot active state
    [...dots].forEach((dot, idx) => {
      if (idx === currentSlideIndex) {
        dot.classList.add('slick-active');
        dot.querySelector('button').setAttribute('tabindex', '0');
      } else {
        dot.classList.remove('slick-active');
        dot.querySelector('button').setAttribute('tabindex', '-1');
      }
    });

    // Update button states (optional, if you want to disable at ends)
    prevButton.disabled = currentSlideIndex === 0;
    nextButton.disabled = currentSlideIndex === totalSlides - 1;
  };

  const goToSlide = (index) => {
    if (index >= 0 && index < totalSlides) {
      currentSlideIndex = index;
      updateCarousel();
    }
  };

  prevButton.addEventListener('click', () => {
    goToSlide(currentSlideIndex - 1);
  });

  nextButton.addEventListener('click', () => {
    goToSlide(currentSlideIndex + 1);
  });

  // Initial update
  updateCarousel();
}
