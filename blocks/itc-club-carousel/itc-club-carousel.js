import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselId = 'itcCarousel'; // Unique ID for the carousel

  block.classList.add('carousel', 'slide', 'itc-club-carousel');
  block.setAttribute('id', carouselId);
  // data-ride="carousel" is not needed as we are implementing custom JS for controls
  // block.setAttribute('data-ride', 'carousel');

  const itcCarouselShift = document.createElement('div');
  itcCarouselShift.classList.add('itc-carousel-shift');

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('carousel-inner');

  const carouselIndicators = document.createElement('ol');
  carouselIndicators.classList.add('carousel-indicators');

  [...block.children].forEach((row, index) => {
    // Indicators
    const indicatorLi = document.createElement('li');
    indicatorLi.setAttribute('data-target', `#${carouselId}`);
    indicatorLi.setAttribute('data-slide-to', index);
    if (index === 0) {
      indicatorLi.classList.add('active');
    }
    carouselIndicators.append(indicatorLi);

    // Add event listener to indicator
    indicatorLi.addEventListener('click', () => {
      const currentActiveItem = carouselInner.querySelector('.carousel-item.active');
      const currentActiveIndicator = carouselIndicators.querySelector('.active');

      if (currentActiveItem) {
        currentActiveItem.classList.remove('active');
      }
      if (currentActiveIndicator) {
        currentActiveIndicator.classList.remove('active');
      }

      carouselInner.children[index].classList.add('active');
      indicatorLi.classList.add('active');
    });

    // Carousel Item
    const carouselItem = document.createElement('div');
    moveInstrumentation(row, carouselItem);
    carouselItem.classList.add('carousel-item');
    if (index === 0) {
      carouselItem.classList.add('active');
    }

    const itemContentWrapper = document.createElement('div');
    itemContentWrapper.classList.add('d-md-flex', 'd-block');

    // According to BlockJson, each item row has 3 cells: Image, Title, Description
    const cells = [...row.children];
    const imageCell = cells[0];
    const titleCell = cells[1];
    const descriptionCell = cells[2];

    if (imageCell && imageCell.querySelector('picture')) {
      const img = imageCell.querySelector('picture').querySelector('img');
      const carouselImg = document.createElement('img');
      carouselImg.loading = 'lazy';
      carouselImg.src = img.src;
      carouselImg.alt = img.alt;
      carouselImg.classList.add('carousel__img', 'd-block', 'w-md-50', 'w-100');
      itemContentWrapper.append(carouselImg);
    }

    const rightWrapper = document.createElement('div');
    rightWrapper.classList.add('w-md-50', 'w-100', 'itc-club-right-wrapper', 'read-more');

    if (titleCell) {
      const h2 = document.createElement('h2');
      h2.classList.add('carousel-inner__title');
      // Move instrumentation from the cell containing the title
      moveInstrumentation(titleCell, h2);
      // Append all child nodes from the titleCell to h2
      while (titleCell.firstChild) h2.append(titleCell.firstChild);
      rightWrapper.append(h2);
    }

    if (descriptionCell) {
      const p = document.createElement('p');
      p.classList.add('carousel-inner__description');
      // Move instrumentation from the cell containing the description
      moveInstrumentation(descriptionCell, p);
      // Append all child nodes from the descriptionCell to p
      while (descriptionCell.firstChild) p.append(descriptionCell.firstChild);
      rightWrapper.append(p);
    }

    itemContentWrapper.append(rightWrapper);
    carouselItem.append(itemContentWrapper);
    carouselInner.append(carouselItem);
  });

  itcCarouselShift.append(carouselIndicators);
  itcCarouselShift.append(carouselInner);

  const prevButton = document.createElement('button');
  prevButton.classList.add('carousel-control-prev');
  prevButton.setAttribute('type', 'button');
  prevButton.addEventListener('click', () => {
    const activeItem = carouselInner.querySelector('.carousel-item.active');
    const activeIndicator = carouselIndicators.querySelector('.active');

    if (activeItem && activeIndicator) {
      activeItem.classList.remove('active');
      activeIndicator.classList.remove('active');

      const prevItem = activeItem.previousElementSibling || carouselInner.lastElementChild;
      const prevIndicator = activeIndicator.previousElementSibling || carouselIndicators.lastElementChild;

      if (prevItem) {
        prevItem.classList.add('active');
      }
      if (prevIndicator) {
        prevIndicator.classList.add('active');
      }
    }
  });

  const prevIcon = document.createElement('span');
  prevIcon.classList.add('carousel-control-prev-icon');
  prevIcon.setAttribute('aria-hidden', 'true');
  prevButton.append(prevIcon);
  const prevSrOnly = document.createElement('span');
  prevSrOnly.classList.add('sr-only');
  prevSrOnly.textContent = 'Previous';
  prevButton.append(prevSrOnly);
  itcCarouselShift.append(prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add('carousel-control-next');
  nextButton.setAttribute('type', 'button');
  nextButton.addEventListener('click', () => {
    const activeItem = carouselInner.querySelector('.carousel-item.active');
    const activeIndicator = carouselIndicators.querySelector('.active');

    if (activeItem && activeIndicator) {
      activeItem.classList.remove('active');
      activeIndicator.classList.remove('active');

      const nextItem = activeItem.nextElementSibling || carouselInner.firstElementChild;
      const nextIndicator = activeIndicator.nextElementSibling || carouselIndicators.firstElementChild;

      if (nextItem) {
        nextItem.classList.add('active');
      }
      if (nextIndicator) {
        nextIndicator.classList.add('active');
      }
    }
  });

  const nextIcon = document.createElement('span');
  nextIcon.classList.add('carousel-control-next-icon');
  nextIcon.setAttribute('aria-hidden', 'true');
  nextButton.append(nextIcon);
  const nextSrOnly = document.createElement('span');
  nextSrOnly.classList.add('sr-only');
  nextSrOnly.textContent = 'Next';
  nextButton.append(nextSrOnly);
  itcCarouselShift.append(nextButton);

  block.textContent = '';
  block.append(itcCarouselShift);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
