import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('CarouselProducts-module-scss-module__AOz4Ya__CarouselProducts');
  section.setAttribute('aria-roledescription', 'carousel');
  section.setAttribute('aria-label', 'Products carousel');

  const swiperContainer = document.createElement('div');
  swiperContainer.classList.add('swiper', 'swiper-initialized', 'swiper-horizontal', 'swiper-watch-progress', 'CarouselProducts-module-scss-module__AOz4Ya__CarouselProductsSwiper');
  swiperContainer.setAttribute('aria-roledescription', 'carousel');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('aria-live', 'polite');
  // The original HTML has an ID for swiper-wrapper, which Swiper.js uses.
  // Since we're not loading Swiper.js, we'll use a consistent ID for aria-controls.
  const swiperWrapperId = 'swiper-wrapper-eds-carousel';
  swiperWrapper.setAttribute('id', swiperWrapperId);


  [...block.children].forEach((row, index) => {
    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide');
    swiperSlide.setAttribute('role', 'group');
    swiperSlide.setAttribute('aria-roledescription', 'slide');
    swiperSlide.setAttribute('aria-label', `${index + 1} of ${block.children.length}`);
    swiperSlide.setAttribute('data-swiper-slide-index', index);
    moveInstrumentation(row, swiperSlide);

    const thumbnailWrapper = document.createElement('div');
    // The 'null' class is present in the original HTML, so it's kept.
    thumbnailWrapper.classList.add('Thumbnail-module-scss-module___FbKVa__Thumbnail', 'null');

    const linkEl = document.createElement('a');
    linkEl.classList.add('Thumbnail-module-scss-module___FbKVa__ThumbnailLink');

    // Content detection for cells based on BlockJson and structure
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const titleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        linkEl.href = foundLink.href;
      }
    }

    if (imageCell) {
      const thumbnailImageDiv = document.createElement('div');
      thumbnailImageDiv.classList.add('Thumbnail-module-scss-module___FbKVa__ThumbnailImage');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '350' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          thumbnailImageDiv.append(optimizedPic);
        }
      }
      linkEl.append(thumbnailImageDiv);
    }

    if (titleCell) {
      const h3 = document.createElement('h3');
      h3.classList.add('srt');
      moveInstrumentation(titleCell, h3);
      while (titleCell.firstChild) h3.append(titleCell.firstChild);
      linkEl.append(h3);
    }

    thumbnailWrapper.append(linkEl);
    swiperSlide.append(thumbnailWrapper);
    swiperWrapper.append(swiperSlide);
  });

  swiperContainer.append(swiperWrapper);
  section.append(swiperContainer);

  const prevButton = document.createElement('button');
  prevButton.setAttribute('type', 'button');
  prevButton.classList.add('swiper-button-prev-nofeatured');
  prevButton.setAttribute('aria-label', 'Previous products');
  prevButton.setAttribute('tabindex', '0');
  prevButton.setAttribute('aria-controls', swiperWrapperId);

  const prevButtonImg = document.createElement('img');
  prevButtonImg.setAttribute('alt', 'svg file');
  // Use the exact src from the original HTML
  prevButtonImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775569357662.svg+xml';
  prevButton.append(prevButtonImg);
  section.append(prevButton);

  const nextButton = document.createElement('button');
  nextButton.setAttribute('type', 'button');
  nextButton.classList.add('swiper-button-next-nofeatured');
  nextButton.setAttribute('aria-label', 'Next products');
  nextButton.setAttribute('tabindex', '0');
  nextButton.setAttribute('aria-controls', swiperWrapperId);

  const nextButtonImg = document.createElement('img');
  nextButtonImg.setAttribute('alt', 'svg file');
  // Use the exact src from the original HTML
  nextButtonImg.src = '/content/dam/aemigrate/uploaded-folder/image/1775569357680.svg+xml';
  nextButton.append(nextButtonImg);
  section.append(nextButton);

  block.textContent = '';
  block.append(section);

  // Swiper initialization (simplified, as Swiper JS is not loaded by EDS)
  // This part demonstrates how to handle navigation if Swiper.js were loaded.
  // For a real implementation, you'd need to load Swiper.js and initialize it.
  let currentSlide = 0;
  const slides = [...swiperWrapper.children];
  const totalSlides = slides.length;
  const slidesPerPage = 3; // Based on the original HTML showing 3 visible slides

  const updateSlides = () => {
    slides.forEach((slide, i) => {
      slide.style.display = 'none';
      slide.classList.remove('swiper-slide-active', 'swiper-slide-next', 'swiper-slide-fully-visible', 'swiper-slide-visible');
      slide.setAttribute('aria-hidden', 'true');
      slide.setAttribute('tabindex', '-1');
    });

    for (let i = 0; i < slidesPerPage; i++) {
      const slideIndex = (currentSlide + i) % totalSlides;
      const slide = slides[slideIndex];
      if (slide) {
        slide.style.display = 'block';
        slide.classList.add('swiper-slide-visible', 'swiper-slide-fully-visible');
        slide.setAttribute('aria-hidden', 'false');
        slide.setAttribute('tabindex', '0');
        if (i === 0) {
          slide.classList.add('swiper-slide-active');
        } else if (i === 1) {
          slide.classList.add('swiper-slide-next');
        }
      }
    }
  };

  prevButton.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlides();
  });

  nextButton.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlides();
  });

  updateSlides(); // Initial display
}
