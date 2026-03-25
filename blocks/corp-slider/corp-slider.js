import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const mainDiv = document.createElement('div');
  mainDiv.classList.add('corp-slider-range-component');

  // Header
  const headerWrapper = document.createElement('div');
  headerWrapper.classList.add('corp-slider-row');
  const headerCol = document.createElement('div');
  headerCol.classList.add('corp-slider-col-md12', 'corp-slider-col-sm-12', 'corp-slider-col-md-12', 'corp-slider-gallery-header');
  const headerContent = block.querySelector('[data-aue-prop="header"]');
  if (headerContent) {
    headerCol.append(headerContent);
    moveInstrumentation(headerContent, headerCol);
  }
  headerWrapper.append(headerCol);
  mainDiv.append(headerWrapper);
  moveInstrumentation(headerContent?.parentElement, headerWrapper);

  // Slider Title
  const sliderTitleWrapper = document.createElement('div');
  sliderTitleWrapper.classList.add('corp-slider-slider-title');
  const sliderTitleContent = block.querySelector('[data-aue-prop="sliderTitle"]');
  if (sliderTitleContent) {
    const h4 = document.createElement('h4');
    h4.id = sliderTitleContent.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    h4.append(sliderTitleContent);
    sliderTitleWrapper.append(h4);
    moveInstrumentation(sliderTitleContent, h4);
  }
  mainDiv.append(sliderTitleWrapper);
  moveInstrumentation(sliderTitleContent?.parentElement, sliderTitleWrapper);

  // Desktop Carousel
  const desktopCarousel = document.createElement('div');
  desktopCarousel.id = 'range-slider-arena-desktop';
  desktopCarousel.classList.add('corp-slider-carousel', 'corp-slider-slide', 'corp-slider-d-none', 'corp-slider-d-sm-block');
  desktopCarousel.setAttribute('data-ride', 'carousel');

  const desktopCarouselInner = document.createElement('div');
  desktopCarouselInner.classList.add('corp-slider-carousel-inner');

  // Mobile Carousel
  const mobileCarousel = document.createElement('div');
  mobileCarousel.id = 'range-slider-arena-mobile';
  mobileCarousel.classList.add('corp-slider-carousel', 'corp-slider-slide', 'corp-slider-d-sm-none');
  mobileCarousel.setAttribute('data-ride', 'carousel');

  const mobileCarouselInner = document.createElement('div');
  mobileCarouselInner.classList.add('corp-slider-carousel-inner');

  const items = block.querySelectorAll('[data-aue-model="sliderItem"]');

  const desktopItemsPerSlide = 4;
  const mobileItemsPerSlide = 2;

  let desktopSlideIndex = 0;
  let mobileSlideIndex = 0;

  while (desktopSlideIndex * desktopItemsPerSlide < items.length) {
    const desktopCarouselItem = document.createElement('div');
    desktopCarouselItem.classList.add('corp-slider-carousel-item');
    if (desktopSlideIndex === 0) {
      desktopCarouselItem.classList.add('corp-slider-active');
    }
    const desktopRow = document.createElement('div');
    desktopRow.classList.add('corp-slider-row');

    for (let i = 0; i < desktopItemsPerSlide; i += 1) {
      const itemIndex = (desktopSlideIndex * desktopItemsPerSlide) + i;
      if (itemIndex < items.length) {
        const itemNode = items[itemIndex];
        const col = document.createElement('div');
        col.classList.add('corp-slider-col-6', 'corp-slider-col-sm-6', 'corp-slider-col-lg-3');

        const linkElement = itemNode.querySelector('[data-aue-prop="link"]');
        const linkHref = linkElement ? linkElement.textContent.trim() : '#';

        const imageArea = document.createElement('a');
        imageArea.classList.add('corp-slider-image-area');
        imageArea.href = linkHref;

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('corp-slider-image-container');
        imageContainer.setAttribute('target', '_self');

        const img = itemNode.querySelector('[data-aue-prop="image"]');
        if (img) {
          const picture = createOptimizedPicture(img.src, img.alt);
          imageContainer.append(picture);
          moveInstrumentation(img, picture);
        }

        const titleElement = itemNode.querySelector('[data-aue-prop="title"]');
        const h6 = document.createElement('h6');
        h6.classList.add('corp-slider-img-title');
        if (titleElement) {
          h6.append(titleElement);
          moveInstrumentation(titleElement, h6);
        }

        imageArea.append(imageContainer, h6);
        col.append(imageArea);
        desktopRow.append(col);
        moveInstrumentation(itemNode, col);
      }
    }
    desktopCarouselItem.append(desktopRow);
    desktopCarouselInner.append(desktopCarouselItem);
    desktopSlideIndex += 1;
  }

  while (mobileSlideIndex * mobileItemsPerSlide < items.length) {
    const mobileCarouselItem = document.createElement('div');
    mobileCarouselItem.classList.add('corp-slider-carousel-item');
    if (mobileSlideIndex === 0) {
      mobileCarouselItem.classList.add('corp-slider-active');
    }
    const mobileRow = document.createElement('div');
    mobileRow.classList.add('corp-slider-row');

    for (let i = 0; i < mobileItemsPerSlide; i += 1) {
      const itemIndex = (mobileSlideIndex * mobileItemsPerSlide) + i;
      if (itemIndex < items.length) {
        const itemNode = items[itemIndex];
        const col = document.createElement('div');
        col.classList.add('corp-slider-col-6', 'corp-slider-col-sm-6', 'corp-slider-col-lg-3');

        const linkElement = itemNode.querySelector('[data-aue-prop="link"]');
        const linkHref = linkElement ? linkElement.textContent.trim() : '#';

        const imageArea = document.createElement('a');
        imageArea.classList.add('corp-slider-image-area');
        imageArea.href = linkHref;

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('corp-slider-image-container');
        imageContainer.setAttribute('target', '_self');

        const img = itemNode.querySelector('[data-aue-prop="image"]');
        if (img) {
          const picture = createOptimizedPicture(img.src, img.alt);
          imageContainer.append(picture);
          moveInstrumentation(img, picture);
        }

        const titleElement = itemNode.querySelector('[data-aue-prop="title"]');
        const h6 = document.createElement('h6');
        h6.classList.add('corp-slider-img-title');
        if (titleElement) {
          h6.append(titleElement);
          moveInstrumentation(titleElement, h6);
        }

        imageArea.append(imageContainer, h6);
        col.append(imageArea);
        mobileRow.append(col);
        moveInstrumentation(itemNode, col);
      }
    }
    mobileCarouselItem.append(mobileRow);
    mobileCarouselInner.append(mobileCarouselItem);
    mobileSlideIndex += 1;
  }

  desktopCarousel.append(desktopCarouselInner);
  mobileCarousel.append(mobileCarouselInner);

  // Carousel Controls (Desktop)
  const desktopPrevControl = document.createElement('a');
  desktopPrevControl.classList.add('corp-slider-carousel-control-prev');
  desktopPrevControl.href = '#range-slider-arena-desktop';
  desktopPrevControl.setAttribute('role', 'button');
  desktopPrevControl.setAttribute('data-slide', 'prev');
  const desktopPrevIcon = document.createElement('span');
  desktopPrevIcon.classList.add('corp-slider-carousel-control-prev-icon');
  desktopPrevIcon.setAttribute('aria-hidden', 'true');
  const desktopPrevSrOnly = document.createElement('span');
  desktopPrevSrOnly.classList.add('corp-slider-sr-only');
  desktopPrevSrOnly.textContent = 'previous';
  desktopPrevControl.append(desktopPrevIcon, desktopPrevSrOnly);
  desktopCarousel.append(desktopPrevControl);

  const desktopNextControl = document.createElement('a');
  desktopNextControl.classList.add('corp-slider-carousel-control-next');
  desktopNextControl.href = '#range-slider-arena-desktop';
  desktopNextControl.setAttribute('role', 'button');
  desktopNextControl.setAttribute('data-slide', 'next');
  const desktopNextIcon = document.createElement('span');
  desktopNextIcon.classList.add('corp-slider-carousel-control-next-icon');
  desktopNextIcon.setAttribute('aria-hidden', 'true');
  const desktopNextSrOnly = document.createElement('span');
  desktopNextSrOnly.classList.add('corp-slider-sr-only');
  desktopNextSrOnly.textContent = 'next';
  desktopNextControl.append(desktopNextIcon, desktopNextSrOnly);
  desktopCarousel.append(desktopNextControl);

  // Carousel Controls (Mobile)
  const mobilePrevControl = document.createElement('a');
  mobilePrevControl.classList.add('corp-slider-carousel-control-prev');
  mobilePrevControl.href = '#range-slider-arena-mobile';
  mobilePrevControl.setAttribute('role', 'button');
  mobilePrevControl.setAttribute('data-slide', 'prev');
  const mobilePrevIcon = document.createElement('span');
  mobilePrevIcon.classList.add('corp-slider-carousel-control-prev-icon');
  mobilePrevIcon.setAttribute('aria-hidden', 'true');
  const mobilePrevSrOnly = document.createElement('span');
  mobilePrevSrOnly.classList.add('corp-slider-sr-only');
  mobilePrevSrOnly.textContent = 'previous';
  mobilePrevControl.append(mobilePrevIcon, mobilePrevSrOnly);
  mobileCarousel.append(mobilePrevControl);

  const mobileNextControl = document.createElement('a');
  mobileNextControl.classList.add('corp-slider-carousel-control-next');
  mobileNextControl.href = '#range-slider-arena-mobile';
  mobileNextControl.setAttribute('role', 'button');
  mobileNextControl.setAttribute('data-slide', 'next');
  const mobileNextIcon = document.createElement('span');
  mobileNextIcon.classList.add('corp-slider-carousel-control-next-icon');
  mobileNextIcon.setAttribute('aria-hidden', 'true');
  const mobileNextSrOnly = document.createElement('span');
  mobileNextSrOnly.classList.add('corp-slider-sr-only');
  mobileNextSrOnly.textContent = 'next';
  mobileNextControl.append(mobileNextIcon, mobileNextSrOnly);
  mobileCarousel.append(mobileNextControl);

  mainDiv.append(desktopCarousel, mobileCarousel);

  block.textContent = '';
  block.append(mainDiv);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
