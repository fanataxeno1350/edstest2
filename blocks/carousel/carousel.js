import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const mainSection = document.createElement('section');
  mainSection.className = 'itc-club-section mx-md-0 mx-4';

  const containerDiv = document.createElement('div');
  containerDiv.className = 'container';

  const carouselDiv = document.createElement('div');
  carouselDiv.id = 'carousel';
  carouselDiv.className = 'carousel slide itc-club-carousel';
  carouselDiv.setAttribute('data-ride', 'carousel');

  const carouselShiftDiv = document.createElement('div');
  carouselShiftDiv.className = 'itc-carousel-shift';

  const carouselInnerDiv = document.createElement('div');
  carouselInnerDiv.className = 'carousel-inner';

  const carouselIndicators = document.createElement('ol');
  carouselIndicators.className = 'carousel-indicators';

  const carouselItems = block.querySelectorAll('[data-aue-model="carouselItem"]');

  carouselItems.forEach((itemNode, index) => {
    const indicatorLi = document.createElement('li');
    indicatorLi.setAttribute('data-target', '#carousel');
    indicatorLi.setAttribute('data-slide-to', index);
    if (itemNode.classList.contains('shiftclub-active')) {
      indicatorLi.classList.add('active');
    }
    carouselIndicators.append(indicatorLi);
    moveInstrumentation(itemNode, indicatorLi);

    const carouselItemDiv = document.createElement('div');
    carouselItemDiv.className = 'carousel-item';
    if (itemNode.classList.contains('shiftclub-active')) {
      carouselItemDiv.classList.add('active');
    }

    const dFlexDiv = document.createElement('div');
    dFlexDiv.className = 'd-md-flex d-block';

    const imageElement = itemNode.querySelector('[data-aue-prop="image"]');
    if (imageElement) {
      const picture = createOptimizedPicture(imageElement.src, imageElement.alt);
      const img = picture.querySelector('img');
      img.className = 'carousel__img d-block w-md-50 w-100';
      dFlexDiv.append(picture);
      moveInstrumentation(imageElement, picture);
    }

    const rightWrapperDiv = document.createElement('div');
    rightWrapperDiv.className = 'w-md-50 w-100 itc-club-right-wrapper read-more';

    const titleElement = itemNode.querySelector('[data-aue-prop="title"]');
    if (titleElement) {
      const h2 = document.createElement('h2');
      h2.className = 'carousel-inner__title';
      h2.append(...titleElement.childNodes);
      rightWrapperDiv.append(h2);
      moveInstrumentation(titleElement, h2);
    }

    const descriptionElement = itemNode.querySelector('[data-aue-prop="description"]');
    if (descriptionElement) {
      const p = document.createElement('p');
      p.className = 'carousel-inner__description';
      p.append(...descriptionElement.childNodes);
      rightWrapperDiv.append(p);
      moveInstrumentation(descriptionElement, p);
    }

    dFlexDiv.append(rightWrapperDiv);
    carouselItemDiv.append(dFlexDiv);
    carouselInnerDiv.append(carouselItemDiv);
    moveInstrumentation(itemNode, carouselItemDiv);
  });

  carouselShiftDiv.append(carouselIndicators);
  carouselShiftDiv.append(carouselInnerDiv);

  const prevButton = document.createElement('button');
  prevButton.className = 'carousel-control-prev';
  prevButton.type = 'button';
  prevButton.setAttribute('data-target', '#carousel');
  prevButton.setAttribute('data-slide', 'prev');
  prevButton.innerHTML = '<span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="sr-only">Previous</span>';

  const nextButton = document.createElement('button');
  nextButton.className = 'carousel-control-next';
  nextButton.type = 'button';
  nextButton.setAttribute('data-target', '#carousel');
  nextButton.setAttribute('data-slide', 'next');
  nextButton.innerHTML = '<span class="carousel-control-next-icon" aria-hidden="true"></span><span class="sr-only">Next</span>';

  carouselShiftDiv.append(prevButton);
  carouselShiftDiv.append(nextButton);

  carouselDiv.append(carouselShiftDiv);
  containerDiv.append(carouselDiv);
  mainSection.append(containerDiv);

  block.textContent = '';
  block.append(mainSection);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
