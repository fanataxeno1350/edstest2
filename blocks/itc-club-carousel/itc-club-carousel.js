import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const container = document.createElement('div');
  container.classList.add('shiftclub-container');

  const carouselDiv = document.createElement('div');
  carouselDiv.id = 'carousel';
  carouselDiv.classList.add('shiftclub-carousel', 'shiftclub-slide', 'shiftclub-itc-club-carousel');
  carouselDiv.setAttribute('data-ride', 'carousel');

  const carouselShift = document.createElement('div');
  carouselShift.classList.add('shiftclub-itc-carousel-shift');

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('shiftclub-carousel-inner');

  const carouselIndicators = document.createElement('ol');
  carouselIndicators.classList.add('shiftclub-carousel-indicators');

  const carouselItems = block.querySelectorAll('[data-aue-model="carouselItem"]');

  carouselItems.forEach((itemNode, index) => {
    // Create indicator
    const indicator = document.createElement('li');
    indicator.setAttribute('data-target', '#carousel');
    indicator.setAttribute('data-slide-to', index.toString());
    if (index === 0) {
      indicator.classList.add('shiftclub-active');
    }
    carouselIndicators.append(indicator);
    moveInstrumentation(itemNode, indicator);

    // Create carousel item
    const carouselItemDiv = document.createElement('div');
    carouselItemDiv.classList.add('shiftclub-carousel-item');
    if (index === 0) {
      carouselItemDiv.classList.add('shiftclub-active');
    }

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('shiftclub-d-md-flex', 'shiftclub-d-block');

    // Image
    const imgElement = itemNode.querySelector('[data-aue-prop="image"]');
    if (imgElement) {
      const picture = createOptimizedPicture(imgElement.src, imgElement.alt);
      picture.querySelector('img').classList.add('shiftclub-carousel__img', 'shiftclub-d-block', 'shiftclub-w-md-50', 'shiftclub-w-100');
      contentWrapper.append(picture);
      moveInstrumentation(imgElement, picture);
    }

    // Right wrapper
    const rightWrapper = document.createElement('div');
    rightWrapper.classList.add('shiftclub-w-md-50', 'shiftclub-w-100', 'shiftclub-itc-club-right-wrapper', 'shiftclub-read-more');

    // Title
    const titleElement = itemNode.querySelector('[data-aue-prop="title"]');
    if (titleElement) {
      const h2 = document.createElement('h2');
      h2.classList.add('shiftclub-carousel-inner__title');
      h2.append(...titleElement.childNodes);
      rightWrapper.append(h2);
      moveInstrumentation(titleElement, h2);
    }

    // Description
    const descriptionElement = itemNode.querySelector('[data-aue-prop="description"]');
    if (descriptionElement) {
      const p = document.createElement('p');
      p.classList.add('shiftclub-carousel-inner__description');
      p.append(...descriptionElement.childNodes);
      rightWrapper.append(p);
      moveInstrumentation(descriptionElement, p);
    }

    contentWrapper.append(rightWrapper);
    carouselItemDiv.append(contentWrapper);
    carouselInner.append(carouselItemDiv);
    moveInstrumentation(itemNode, carouselItemDiv);
  });

  carouselShift.append(carouselIndicators, carouselInner);

  // Previous button
  const prevButton = document.createElement('button');
  prevButton.classList.add('shiftclub-carousel-control-prev');
  prevButton.type = 'button';
  prevButton.setAttribute('data-target', '#carousel');
  prevButton.setAttribute('data-slide', 'prev');
  const prevIcon = document.createElement('span');
  prevIcon.classList.add('shiftclub-carousel-control-prev-icon');
  prevIcon.setAttribute('aria-hidden', 'true');
  const prevSrOnly = document.createElement('span');
  prevSrOnly.classList.add('shiftclub-sr-only');
  prevSrOnly.textContent = 'Previous';
  prevButton.append(prevIcon, prevSrOnly);

  // Next button
  const nextButton = document.createElement('button');
  nextButton.classList.add('shiftclub-carousel-control-next');
  nextButton.type = 'button';
  nextButton.setAttribute('data-target', '#carousel');
  nextButton.setAttribute('data-slide', 'next');
  const nextIcon = document.createElement('span');
  nextIcon.classList.add('shiftclub-carousel-control-next-icon');
  nextIcon.setAttribute('aria-hidden', 'true');
  const nextSrOnly = document.createElement('span');
  nextSrOnly.classList.add('shiftclub-sr-only');
  nextSrOnly.textContent = 'Next';
  nextButton.append(nextIcon, nextSrOnly);

  carouselShift.append(prevButton, nextButton);
  carouselDiv.append(carouselShift);
  container.append(carouselDiv);

  block.textContent = '';
  block.append(container);
  block.classList.add('shiftclub-itc-club-section', 'shiftclub-mx-md-0', 'shiftclub-mx-4');
  block.dataset.blockStatus = 'loaded';
}
