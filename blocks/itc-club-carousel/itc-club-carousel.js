import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselItems = block.querySelectorAll('[data-aue-model="carouselItem"]');

  const section = document.createElement('section');
  section.className = 'shiftclub-itc-club-section shiftclub-mx-md-0 shiftclub-mx-4';

  const containerDiv = document.createElement('div');
  containerDiv.className = 'shiftclub-container';

  const carouselDiv = document.createElement('div');
  carouselDiv.id = 'carousel';
  carouselDiv.className = 'shiftclub-carousel shiftclub-slide shiftclub-itc-club-carousel';
  carouselDiv.setAttribute('data-ride', 'carousel');

  const itcCarouselShiftDiv = document.createElement('div');
  itcCarouselShiftDiv.className = 'shiftclub-itc-carousel-shift';

  const carouselInnerDiv = document.createElement('div');
  carouselInnerDiv.className = 'shiftclub-carousel-inner';

  const carouselIndicatorsOl = document.createElement('ol');
  carouselIndicatorsOl.className = 'shiftclub-carousel-indicators';

  const carouselItemsWrapper = document.createElement('div');

  carouselItems.forEach((itemNode, index) => {
    const li = document.createElement('li');
    li.setAttribute('data-target', '#carousel');
    li.setAttribute('data-slide-to', index.toString());
    if (index === 0) {
      li.classList.add('shiftclub-active');
    }
    carouselIndicatorsOl.append(li);
    moveInstrumentation(itemNode, li);

    const carouselItemDiv = document.createElement('div');
    carouselItemDiv.className = `shiftclub-carousel-item${index === 0 ? ' shiftclub-active' : ''}`;

    const dFlexDiv = document.createElement('div');
    dFlexDiv.className = 'shiftclub-d-md-flex shiftclub-d-block';

    const imageElement = itemNode.querySelector('[data-aue-prop="image"]');
    if (imageElement) {
      const picture = createOptimizedPicture(imageElement.src, imageElement.alt);
      picture.querySelector('img').className = 'shiftclub-carousel__img shiftclub-d-block shiftclub-w-md-50 shiftclub-w-100';
      dFlexDiv.append(picture);
      moveInstrumentation(imageElement, picture);
    }

    const rightWrapperDiv = document.createElement('div');
    rightWrapperDiv.className = 'shiftclub-w-md-50 shiftclub-w-100 shiftclub-itc-club-right-wrapper shiftclub-read-more';

    const titleElement = itemNode.querySelector('[data-aue-prop="title"]');
    if (titleElement) {
      const h2 = document.createElement('h2');
      h2.className = 'shiftclub-carousel-inner__title';
      h2.append(...titleElement.childNodes);
      rightWrapperDiv.append(h2);
      moveInstrumentation(titleElement, h2);
    }

    const descriptionElement = itemNode.querySelector('[data-aue-prop="description"]');
    if (descriptionElement) {
      const p = document.createElement('p');
      p.className = 'shiftclub-carousel-inner__description';
      p.append(...descriptionElement.childNodes);
      rightWrapperDiv.append(p);
      moveInstrumentation(descriptionElement, p);
    }

    dFlexDiv.append(rightWrapperDiv);
    carouselItemDiv.append(dFlexDiv);
    carouselItemsWrapper.append(carouselItemDiv);
    moveInstrumentation(itemNode, carouselItemDiv);
  });

  carouselInnerDiv.append(carouselIndicatorsOl, carouselItemsWrapper);

  const prevButton = document.createElement('button');
  prevButton.className = 'shiftclub-carousel-control-prev';
  prevButton.type = 'button';
  prevButton.setAttribute('data-target', '#carousel');
  prevButton.setAttribute('data-slide', 'prev');
  const prevSpanIcon = document.createElement('span');
  prevSpanIcon.className = 'shiftclub-carousel-control-prev-icon';
  prevSpanIcon.setAttribute('aria-hidden', 'true');
  const prevSpanSrOnly = document.createElement('span');
  prevSpanSrOnly.className = 'shiftclub-sr-only';
  prevSpanSrOnly.textContent = 'Previous';
  prevButton.append(prevSpanIcon, prevSpanSrOnly);

  const nextButton = document.createElement('button');
  nextButton.className = 'shiftclub-carousel-control-next';
  nextButton.type = 'button';
  nextButton.setAttribute('data-target', '#carousel');
  nextButton.setAttribute('data-slide', 'next');
  const nextSpanIcon = document.createElement('span');
  nextSpanIcon.className = 'shiftclub-carousel-control-next-icon';
  nextSpanIcon.setAttribute('aria-hidden', 'true');
  const nextSpanSrOnly = document.createElement('span');
  nextSpanSrOnly.className = 'shiftclub-sr-only';
  nextSpanSrOnly.textContent = 'Next';
  nextButton.append(nextSpanIcon, nextSpanSrOnly);

  itcCarouselShiftDiv.append(carouselInnerDiv, prevButton, nextButton);
  carouselDiv.append(itcCarouselShiftDiv);
  containerDiv.append(carouselDiv);
  section.append(containerDiv);

  block.textContent = '';
  block.append(section);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
