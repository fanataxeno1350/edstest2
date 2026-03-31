import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [sectionTitleRow, sliderTitleRow, itemsContainerRow, ...itemRows] = [...block.children];

  const rangeComponent = document.createElement('div');
  rangeComponent.classList.add('range-component');

  // Section Title
  const galleryHeaderRow = document.createElement('div');
  galleryHeaderRow.classList.add('row');
  const galleryHeaderCol = document.createElement('div');
  // Original HTML has 'col-md12 col-sm-12 col-md-12', which is redundant. Keeping 'col-md12 col-sm-12'
  galleryHeaderCol.classList.add('col-md12', 'col-sm-12', 'gallery-header');
  const sectionTitleP = document.createElement('p');
  const strong = document.createElement('strong');
  moveInstrumentation(sectionTitleRow.firstElementChild, strong);
  while (sectionTitleRow.firstElementChild.firstChild) {
    strong.append(sectionTitleRow.firstElementChild.firstChild);
  }
  sectionTitleP.append(strong);
  galleryHeaderCol.append(sectionTitleP);
  galleryHeaderRow.append(galleryHeaderCol);
  rangeComponent.append(galleryHeaderRow);

  // Slider Title
  const sliderTitleDiv = document.createElement('div');
  sliderTitleDiv.classList.add('slider-title');
  const sliderTitleH4 = document.createElement('h4');
  moveInstrumentation(sliderTitleRow.firstElementChild, sliderTitleH4);
  while (sliderTitleRow.firstElementChild.firstChild) {
    sliderTitleH4.append(sliderTitleRow.firstElementChild.firstChild);
  }
  sliderTitleDiv.append(sliderTitleH4);
  rangeComponent.append(sliderTitleDiv);

  // Carousel for Desktop
  const desktopCarousel = document.createElement('div');
  desktopCarousel.id = 'range-slider-arena-desktop';
  desktopCarousel.classList.add('carousel', 'slide', 'd-none', 'd-sm-block');
  desktopCarousel.setAttribute('data-ride', 'carousel');

  const desktopCarouselInner = document.createElement('div');
  desktopCarouselInner.classList.add('carousel-inner');
  desktopCarousel.append(desktopCarouselInner);

  // Carousel for Mobile
  const mobileCarousel = document.createElement('div');
  mobileCarousel.id = 'range-slider-arena-mobile';
  mobileCarousel.classList.add('carousel', 'slide', 'd-sm-none');
  mobileCarousel.setAttribute('data-ride', 'carousel');

  const mobileCarouselInner = document.createElement('div');
  mobileCarouselInner.classList.add('carousel-inner');
  mobileCarousel.append(mobileCarouselInner);

  const itemsPerDesktopSlide = 4;
  const itemsPerMobileSlide = 2;

  let desktopSlideIndex = 0;
  let mobileSlideIndex = 0;

  let currentDesktopRow = null;
  let currentMobileRow = null;

  itemRows.forEach((row, index) => {
    const cells = [...row.children];

    // Desktop Carousel Item
    if (index % itemsPerDesktopSlide === 0) {
      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');
      if (desktopSlideIndex === 0) carouselItem.classList.add('active');
      desktopCarouselInner.append(carouselItem);
      currentDesktopRow = document.createElement('div');
      currentDesktopRow.classList.add('row');
      carouselItem.append(currentDesktopRow);
      desktopSlideIndex += 1;
    }

    // Mobile Carousel Item
    if (index % itemsPerMobileSlide === 0) {
      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');
      if (mobileSlideIndex === 0) carouselItem.classList.add('active');
      mobileCarouselInner.append(carouselItem);
      currentMobileRow = document.createElement('div');
      currentMobileRow.classList.add('row');
      carouselItem.append(currentMobileRow);
      mobileSlideIndex += 1;
    }

    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const titleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    if (imageCell && linkCell && titleCell) {
      // Common item structure
      const linkEl = document.createElement('a');
      linkEl.classList.add('image-area');
      const originalLink = linkCell.querySelector('a');
      if (originalLink) {
        linkEl.href = originalLink.href;
      }
      moveInstrumentation(row, linkEl); // Move instrumentation from the item row to the link element

      const imageContainer = document.createElement('div');
      imageContainer.classList.add('image-container');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        imageContainer.append(picture);
      }

      const titleH6 = document.createElement('h6');
      titleH6.classList.add('img-title');
      moveInstrumentation(titleCell, titleH6);
      while (titleCell.firstChild) {
        titleH6.append(titleCell.firstChild);
      }

      linkEl.append(imageContainer, titleH6);

      // Append to desktop carousel
      const desktopCol = document.createElement('div');
      desktopCol.classList.add('col-6', 'col-sm-6', 'col-lg-3');
      desktopCol.append(linkEl.cloneNode(true)); // Clone to append to both carousels
      currentDesktopRow.append(desktopCol);

      // Append to mobile carousel
      const mobileCol = document.createElement('div');
      mobileCol.classList.add('col-6', 'col-sm-6', 'col-lg-3');
      mobileCol.append(linkEl);
      currentMobileRow.append(mobileCol);
    }
  });

  // Carousel Controls (Desktop)
  const desktopPrevButton = document.createElement('a');
  desktopPrevButton.classList.add('carousel-control-prev');
  desktopPrevButton.href = '#range-slider-arena-desktop';
  desktopPrevButton.setAttribute('role', 'button');
  desktopPrevButton.setAttribute('data-slide', 'prev'); // Added data-slide attribute
  // Removed manual scrollBy event listener, Bootstrap handles it with data-slide

  const desktopPrevIcon = document.createElement('span');
  desktopPrevIcon.classList.add('carousel-control-prev-icon');
  desktopPrevIcon.setAttribute('aria-hidden', 'true');
  const desktopPrevSrOnly = document.createElement('span');
  desktopPrevSrOnly.classList.add('sr-only');
  desktopPrevSrOnly.textContent = 'previous';
  desktopPrevButton.append(desktopPrevIcon, desktopPrevSrOnly);
  desktopCarousel.append(desktopPrevButton);

  const desktopNextButton = document.createElement('a');
  desktopNextButton.classList.add('carousel-control-next');
  desktopNextButton.href = '#range-slider-arena-desktop';
  desktopNextButton.setAttribute('role', 'button');
  desktopNextButton.setAttribute('data-slide', 'next'); // Added data-slide attribute
  // Removed manual scrollBy event listener, Bootstrap handles it with data-slide

  const desktopNextIcon = document.createElement('span');
  desktopNextIcon.classList.add('carousel-control-next-icon');
  desktopNextIcon.setAttribute('aria-hidden', 'true');
  const desktopNextSrOnly = document.createElement('span');
  desktopNextSrOnly.classList.add('sr-only');
  desktopNextSrOnly.textContent = 'next';
  desktopNextButton.append(desktopNextIcon, desktopNextSrOnly);
  desktopCarousel.append(desktopNextButton);

  // Carousel Controls (Mobile)
  const mobilePrevButton = document.createElement('a');
  mobilePrevButton.classList.add('carousel-control-prev');
  mobilePrevButton.href = '#range-slider-arena-mobile';
  mobilePrevButton.setAttribute('role', 'button');
  mobilePrevButton.setAttribute('data-slide', 'prev'); // Added data-slide attribute
  // Removed manual scrollBy event listener, Bootstrap handles it with data-slide

  const mobilePrevIcon = document.createElement('span');
  mobilePrevIcon.classList.add('carousel-control-prev-icon');
  mobilePrevIcon.setAttribute('aria-hidden', 'true');
  const mobilePrevSrOnly = document.createElement('span');
  mobilePrevSrOnly.classList.add('sr-only');
  mobilePrevSrOnly.textContent = 'previous';
  mobilePrevButton.append(mobilePrevIcon, mobilePrevSrOnly);
  mobileCarousel.append(mobilePrevButton);

  const mobileNextButton = document.createElement('a');
  mobileNextButton.classList.add('carousel-control-next');
  mobileNextButton.href = '#range-slider-arena-mobile';
  mobileNextButton.setAttribute('role', 'button');
  mobileNextButton.setAttribute('data-slide', 'next'); // Added data-slide attribute
  // Removed manual scrollBy event listener, Bootstrap handles it with data-slide

  const mobileNextIcon = document.createElement('span');
  mobileNextIcon.classList.add('carousel-control-next-icon');
  mobileNextIcon.setAttribute('aria-hidden', 'true');
  const mobileNextSrOnly = document.createElement('span');
  mobileNextSrOnly.classList.add('sr-only');
  mobileNextSrOnly.textContent = 'next';
  mobileNextButton.append(mobileNextIcon, mobileNextSrOnly);
  mobileCarousel.append(mobileNextButton);

  rangeComponent.append(desktopCarousel, mobileCarousel);

  block.textContent = '';
  block.append(rangeComponent);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
