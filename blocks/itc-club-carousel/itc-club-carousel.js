import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselId = 'carousel';

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('shiftclub-container');
  moveInstrumentation(block.querySelector(':scope > div'), containerDiv);

  const carouselDiv = document.createElement('div');
  carouselDiv.id = carouselId;
  carouselDiv.classList.add('shiftclub-carousel', 'shiftclub-slide', 'shiftclub-itc-club-carousel');
  carouselDiv.setAttribute('data-ride', 'carousel');
  moveInstrumentation(block.querySelector(':scope > div > div'), carouselDiv);

  const itcCarouselShiftDiv = document.createElement('div');
  itcCarouselShiftDiv.classList.add('shiftclub-itc-carousel-shift');

  const carouselInnerDiv = document.createElement('div');
  carouselInnerDiv.classList.add('shiftclub-carousel-inner');

  const carouselIndicatorsOl = document.createElement('ol');
  carouselIndicatorsOl.classList.add('shiftclub-carousel-indicators');

  const carouselItems = block.querySelectorAll('[data-aue-model="carouselItem"]');
  carouselItems.forEach((itemNode, index) => {
    const li = document.createElement('li');
    li.setAttribute('data-target', `#${carouselId}`);
    li.setAttribute('data-slide-to', index.toString());
    if (index === 0) {
      li.classList.add('shiftclub-active');
    }
    carouselIndicatorsOl.append(li);
    moveInstrumentation(itemNode, li); // Instrumenting the itemNode to the li as it represents the item in the indicator list
  });

  carouselInnerDiv.append(carouselIndicatorsOl);
  moveInstrumentation(block.querySelector('.shiftclub-carousel-indicators'), carouselIndicatorsOl);

  carouselItems.forEach((itemNode, index) => {
    const carouselItemDiv = document.createElement('div');
    carouselItemDiv.classList.add('shiftclub-carousel-item');
    if (index === 0) {
      carouselItemDiv.classList.add('shiftclub-active');
    }

    const dFlexDiv = document.createElement('div');
    dFlexDiv.classList.add('shiftclub-d-md-flex', 'shiftclub-d-block');

    const imageElement = itemNode.querySelector('[data-aue-prop="image"]');
    if (imageElement) {
      const picture = createOptimizedPicture(imageElement.src, imageElement.alt);
      picture.querySelector('img').classList.add('shiftclub-carousel__img', 'shiftclub-d-block', 'shiftclub-w-md-50', 'shiftclub-w-100');
      dFlexDiv.append(picture);
      moveInstrumentation(imageElement, picture);
    }

    const rightWrapperDiv = document.createElement('div');
    rightWrapperDiv.classList.add('shiftclub-w-md-50', 'shiftclub-w-100', 'shiftclub-itc-club-right-wrapper', 'shiftclub-read-more');

    const titleElement = itemNode.querySelector('[data-aue-prop="title"]');
    if (titleElement) {
      const h2 = document.createElement('h2');
      h2.classList.add('shiftclub-carousel-inner__title');
      h2.append(...titleElement.childNodes);
      rightWrapperDiv.append(h2);
      moveInstrumentation(titleElement, h2);
    }

    const descriptionElement = itemNode.querySelector('[data-aue-prop="description"]');
    if (descriptionElement) {
      const p = document.createElement('p');
      p.classList.add('shiftclub-carousel-inner__description');
      p.append(...descriptionElement.childNodes);
      rightWrapperDiv.append(p);
      moveInstrumentation(descriptionElement, p);
    }

    dFlexDiv.append(rightWrapperDiv);
    carouselItemDiv.append(dFlexDiv);
    carouselInnerDiv.append(carouselItemDiv);
    moveInstrumentation(itemNode, carouselItemDiv);
  });

  itcCarouselShiftDiv.append(carouselInnerDiv);
  moveInstrumentation(block.querySelector('.shiftclub-carousel-inner'), carouselInnerDiv);

  const prevButton = document.createElement('button');
  prevButton.classList.add('shiftclub-carousel-control-prev');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('data-target', `#${carouselId}`);
  prevButton.setAttribute('data-slide', 'prev');
  const prevSpanIcon = document.createElement('span');
  prevSpanIcon.classList.add('shiftclub-carousel-control-prev-icon');
  prevSpanIcon.setAttribute('aria-hidden', 'true');
  const prevSpanSrOnly = document.createElement('span');
  prevSpanSrOnly.classList.add('shiftclub-sr-only');
  prevSpanSrOnly.textContent = 'Previous';
  prevButton.append(prevSpanIcon, prevSpanSrOnly);
  itcCarouselShiftDiv.append(prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add('shiftclub-carousel-control-next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('data-target', `#${carouselId}`);
  nextButton.setAttribute('data-slide', 'next');
  const nextSpanIcon = document.createElement('span');
  nextSpanIcon.classList.add('shiftclub-carousel-control-next-icon');
  nextSpanIcon.setAttribute('aria-hidden', 'true');
  const nextSpanSrOnly = document.createElement('span');
  nextSpanSrOnly.classList.add('shiftclub-sr-only');
  nextSpanSrOnly.textContent = 'Next';
  nextButton.append(nextSpanIcon, nextSpanSrOnly);
  itcCarouselShiftDiv.append(nextButton);

  carouselDiv.append(itcCarouselShiftDiv);
  containerDiv.append(carouselDiv);

  block.textContent = '';
  block.append(containerDiv);
  block.classList.add('shiftclub-itc-club-section', 'shiftclub-mx-md-0', 'shiftclub-mx-4');
  block.dataset.blockStatus = 'loaded';
}
