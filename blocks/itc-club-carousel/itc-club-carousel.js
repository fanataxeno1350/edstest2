import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('shiftclub-container');
  moveInstrumentation(block.querySelector(':scope > div'), container);

  const carousel = document.createElement('div');
  carousel.id = 'carousel';
  carousel.classList.add('shiftclub-carousel', 'shiftclub-slide', 'shiftclub-itc-club-carousel');
  carousel.setAttribute('data-ride', 'carousel');
  moveInstrumentation(block.querySelector(':scope > div > div'), carousel);

  const itcCarouselShift = document.createElement('div');
  itcCarouselShift.classList.add('shiftclub-itc-carousel-shift');
  moveInstrumentation(block.querySelector(':scope > div > div > div'), itcCarouselShift);

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('shiftclub-carousel-inner');
  moveInstrumentation(block.querySelector(':scope > div > div > div > div'), carouselInner);

  const indicators = document.createElement('ol');
  indicators.classList.add('shiftclub-carousel-indicators');
  carouselInner.append(indicators);

  const carouselItems = Array.from(block.querySelectorAll('[data-aue-model="carouselItem"]'));

  carouselItems.forEach((itemNode, index) => {
    const indicator = document.createElement('li');
    indicator.setAttribute('data-target', '#carousel');
    indicator.setAttribute('data-slide-to', index.toString());
    if (index === 0) {
      indicator.classList.add('shiftclub-active');
    }
    indicators.append(indicator);
    moveInstrumentation(itemNode, indicator);

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('shiftclub-carousel-item');
    if (index === 0) {
      carouselItem.classList.add('shiftclub-active');
    }

    const itemContentWrapper = document.createElement('div');
    itemContentWrapper.classList.add('shiftclub-d-md-flex', 'shiftclub-d-block');

    const imageElement = itemNode.querySelector('[data-aue-prop="image"]');
    if (imageElement) {
      const picture = createOptimizedPicture(imageElement.src, imageElement.alt);
      picture.querySelector('img').classList.add('shiftclub-carousel__img', 'shiftclub-d-block', 'shiftclub-w-md-50', 'shiftclub-w-100');
      itemContentWrapper.append(picture);
      moveInstrumentation(imageElement, picture);
    }

    const rightWrapper = document.createElement('div');
    rightWrapper.classList.add('shiftclub-w-md-50', 'shiftclub-w-100', 'shiftclub-itc-club-right-wrapper', 'shiftclub-read-more');

    const titleElement = itemNode.querySelector('[data-aue-prop="title"]');
    if (titleElement) {
      const h2 = document.createElement('h2');
      h2.classList.add('shiftclub-carousel-inner__title');
      h2.innerHTML = titleElement.innerHTML;
      rightWrapper.append(h2);
      moveInstrumentation(titleElement, h2);
    }

    const descriptionElement = itemNode.querySelector('[data-aue-prop="description"]');
    if (descriptionElement) {
      const p = document.createElement('p');
      p.classList.add('shiftclub-carousel-inner__description');
      p.innerHTML = descriptionElement.innerHTML;
      rightWrapper.append(p);
      moveInstrumentation(descriptionElement, p);
    }

    itemContentWrapper.append(rightWrapper);
    carouselItem.append(itemContentWrapper);
    carouselInner.append(carouselItem);
    moveInstrumentation(itemNode, carouselItem);
  });

  const prevButton = document.createElement('button');
  prevButton.classList.add('shiftclub-carousel-control-prev');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('data-target', '#carousel');
  prevButton.setAttribute('data-slide', 'prev');
  prevButton.innerHTML = '<span class="shiftclub-carousel-control-prev-icon" aria-hidden="true"></span><span class="shiftclub-sr-only">Previous</span>';

  const nextButton = document.createElement('button');
  nextButton.classList.add('shiftclub-carousel-control-next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('data-target', '#carousel');
  nextButton.setAttribute('data-slide', 'next');
  nextButton.innerHTML = '<span class="shiftclub-carousel-control-next-icon" aria-hidden="true"></span><span class="shiftclub-sr-only">Next</span>';

  itcCarouselShift.append(carouselInner, prevButton, nextButton);
  carousel.append(itcCarouselShift);
  container.append(carousel);

  block.textContent = '';
  block.append(container);
  block.classList.add('shiftclub-itc-club-section', 'shiftclub-mx-md-0', 'shiftclub-mx-4');
  block.dataset.blockStatus = 'loaded';
}
