import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselId = `carousel-${Math.random().toString(36).substring(2, 9)}`;
  const container = document.createElement('div');
  container.classList.add('shiftclub-container');
  moveInstrumentation(block.querySelector(':scope > div'), container);

  const carouselDiv = document.createElement('div');
  carouselDiv.id = carouselId;
  carouselDiv.classList.add('shiftclub-carousel', 'shiftclub-slide', 'shiftclub-itc-club-carousel');
  carouselDiv.setAttribute('data-ride', 'carousel');
  moveInstrumentation(block.querySelector('[id="carousel"]'), carouselDiv);

  const itcCarouselShift = document.createElement('div');
  itcCarouselShift.classList.add('shiftclub-itc-carousel-shift');
  moveInstrumentation(block.querySelector('.shiftclub-itc-carousel-shift'), itcCarouselShift);

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('shiftclub-carousel-inner');
  moveInstrumentation(block.querySelector('.shiftclub-carousel-inner'), carouselInner);

  const carouselIndicators = document.createElement('ol');
  carouselIndicators.classList.add('shiftclub-carousel-indicators');
  moveInstrumentation(block.querySelector('.shiftclub-carousel-indicators'), carouselIndicators);

  const carouselItems = block.querySelectorAll('[data-aue-model="carouselItem"]');
  carouselItems.forEach((itemNode, index) => {
    const indicator = document.createElement('li');
    indicator.setAttribute('data-target', `#${carouselId}`);
    indicator.setAttribute('data-slide-to', index);
    if (itemNode.classList.contains('shiftclub-active')) {
      indicator.classList.add('shiftclub-active');
    }
    carouselIndicators.append(indicator);
    moveInstrumentation(itemNode, indicator);
  });

  carouselItems.forEach((itemNode, index) => {
    const carouselItemDiv = document.createElement('div');
    carouselItemDiv.classList.add('shiftclub-carousel-item');
    if (itemNode.classList.contains('shiftclub-active')) {
      carouselItemDiv.classList.add('shiftclub-active');
    }

    const flexWrapper = document.createElement('div');
    flexWrapper.classList.add('shiftclub-d-md-flex', 'shiftclub-d-block');

    const imageElement = itemNode.querySelector('[data-aue-prop="image"]');
    if (imageElement) {
      const picture = createOptimizedPicture(imageElement.src, imageElement.alt);
      picture.querySelector('img').classList.add('shiftclub-carousel__img', 'shiftclub-d-block', 'shiftclub-w-md-50', 'shiftclub-w-100');
      flexWrapper.append(picture);
      moveInstrumentation(imageElement, picture);
    }

    const rightWrapper = document.createElement('div');
    rightWrapper.classList.add('shiftclub-w-md-50', 'shiftclub-w-100', 'shiftclub-itc-club-right-wrapper', 'shiftclub-read-more');

    const titleElement = itemNode.querySelector('[data-aue-prop="title"]');
    if (titleElement) {
      const h2 = document.createElement('h2');
      h2.classList.add('shiftclub-carousel-inner__title');
      h2.append(...titleElement.childNodes);
      rightWrapper.append(h2);
      moveInstrumentation(titleElement, h2);
    }

    const descriptionElement = itemNode.querySelector('[data-aue-prop="description"]');
    if (descriptionElement) {
      const p = document.createElement('p');
      p.classList.add('shiftclub-carousel-inner__description');
      p.append(...descriptionElement.childNodes);
      rightWrapper.append(p);
      moveInstrumentation(descriptionElement, p);
    }

    flexWrapper.append(rightWrapper);
    carouselItemDiv.append(flexWrapper);
    carouselInner.append(carouselItemDiv);
    moveInstrumentation(itemNode, carouselItemDiv);
  });

  const prevButton = document.createElement('button');
  prevButton.classList.add('shiftclub-carousel-control-prev');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('data-target', `#${carouselId}`);
  prevButton.setAttribute('data-slide', 'prev');
  prevButton.innerHTML = '<span class="shiftclub-carousel-control-prev-icon" aria-hidden="true"></span><span class="shiftclub-sr-only">Previous</span>';
  moveInstrumentation(block.querySelector('.shiftclub-carousel-control-prev'), prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add('shiftclub-carousel-control-next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('data-target', `#${carouselId}`);
  nextButton.setAttribute('data-slide', 'next');
  nextButton.innerHTML = '<span class="shiftclub-carousel-control-next-icon" aria-hidden="true"></span><span class="shiftclub-sr-only">Next</span>';
  moveInstrumentation(block.querySelector('.shiftclub-carousel-control-next'), nextButton);

  carouselInner.prepend(carouselIndicators);
  itcCarouselShift.append(carouselInner, prevButton, nextButton);
  carouselDiv.append(itcCarouselShift);
  container.append(carouselDiv);

  block.textContent = '';
  block.append(container);
  block.className = `shiftclub-itc-club-section shiftclub-mx-md-0 shiftclub-mx-4 ${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}