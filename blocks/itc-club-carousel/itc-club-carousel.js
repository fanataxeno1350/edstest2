import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  // Remove the first row which is just the "Carousel Items" label
  allRows.shift();

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const carouselDiv = document.createElement('div');
  carouselDiv.id = 'carousel';
  carouselDiv.classList.add('carousel', 'slide', 'itc-club-carousel');
  carouselDiv.setAttribute('data-ride', 'carousel');

  const carouselShiftDiv = document.createElement('div');
  carouselShiftDiv.classList.add('itc-carousel-shift');

  const carouselInnerDiv = document.createElement('div');
  carouselInnerDiv.classList.add('carousel-inner');

  const carouselIndicatorsOl = document.createElement('ol');
  carouselIndicatorsOl.classList.add('carousel-indicators');

  allRows.forEach((row, index) => {
    // Create indicator
    const indicatorLi = document.createElement('li');
    indicatorLi.setAttribute('data-target', '#carousel');
    indicatorLi.setAttribute('data-slide-to', index.toString());
    if (index === 0) {
      indicatorLi.classList.add('active');
    }
    carouselIndicatorsOl.append(indicatorLi);

    // Create carousel item
    const carouselItemDiv = document.createElement('div');
    carouselItemDiv.classList.add('carousel-item');
    if (index === 0) {
      carouselItemDiv.classList.add('active');
    }
    moveInstrumentation(row, carouselItemDiv);

    const dFlexDiv = document.createElement('div');
    dFlexDiv.classList.add('d-md-flex', 'd-block');

    const [imageCell, altCell, titleCell, descriptionCell] = [...row.children];

    // Image
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const newImg = optimizedPic.querySelector('img');
      newImg.classList.add('carousel__img', 'd-block', 'w-md-50', 'w-100');
      newImg.setAttribute('loading', 'lazy');
      newImg.alt = altCell.textContent.trim(); // Use alt text from model
      moveInstrumentation(img, newImg);
      dFlexDiv.append(optimizedPic);
    }

    // Right wrapper
    const rightWrapperDiv = document.createElement('div');
    rightWrapperDiv.classList.add('w-md-50', 'w-100', 'itc-club-right-wrapper', 'read-more');

    const titleH2 = document.createElement('h2');
    titleH2.classList.add('carousel-inner__title');
    moveInstrumentation(titleCell, titleH2);
    while (titleCell.firstChild) titleH2.append(titleCell.firstChild);
    rightWrapperDiv.append(titleH2);

    const descriptionP = document.createElement('p');
    descriptionP.classList.add('carousel-inner__description');
    moveInstrumentation(descriptionCell, descriptionP);
    while (descriptionCell.firstChild) descriptionP.append(descriptionCell.firstChild);
    rightWrapperDiv.append(descriptionP);

    dFlexDiv.append(rightWrapperDiv);
    carouselItemDiv.append(dFlexDiv);
    carouselInnerDiv.append(carouselItemDiv);
  });

  carouselInnerDiv.prepend(carouselIndicatorsOl); // Indicators should be inside carousel-inner
  carouselShiftDiv.append(carouselInnerDiv);

  function updateIndicators() {
    const activeItem = carouselInnerDiv.querySelector('.carousel-item.active');
    // Find the index of the active carousel-item among its siblings
    // We need to filter out the carouselIndicatorsOl which is also a child
    const carouselItems = [...carouselInnerDiv.children].filter(child => child.classList.contains('carousel-item'));
    const activeIndex = carouselItems.indexOf(activeItem);

    carouselIndicatorsOl.querySelectorAll('li').forEach((li, idx) => {
      if (idx === activeIndex) {
        li.classList.add('active');
      } else {
        li.classList.remove('active');
      }
    });
  }

  // Previous button
  const prevButton = document.createElement('button');
  prevButton.classList.add('carousel-control-prev');
  prevButton.type = 'button';
  prevButton.setAttribute('data-target', '#carousel');
  prevButton.setAttribute('data-slide', 'prev');
  prevButton.addEventListener('click', () => {
    const activeItem = carouselInnerDiv.querySelector('.carousel-item.active');
    const carouselItems = [...carouselInnerDiv.querySelectorAll('.carousel-item')];
    const currentIndex = carouselItems.indexOf(activeItem);
    const prevIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length; // Loop around
    
    activeItem.classList.remove('active');
    carouselItems[prevIndex].classList.add('active');
    updateIndicators();
  });

  const prevIconSpan = document.createElement('span');
  prevIconSpan.classList.add('carousel-control-prev-icon');
  prevIconSpan.setAttribute('aria-hidden', 'true');
  prevButton.append(prevIconSpan);

  const prevSrOnlySpan = document.createElement('span');
  prevSrOnlySpan.classList.add('sr-only');
  prevSrOnlySpan.textContent = 'Previous';
  prevButton.append(prevSrOnlySpan);
  carouselShiftDiv.append(prevButton);

  // Next button
  const nextButton = document.createElement('button');
  nextButton.classList.add('carousel-control-next');
  nextButton.type = 'button';
  nextButton.setAttribute('data-target', '#carousel');
  nextButton.setAttribute('data-slide', 'next');
  nextButton.addEventListener('click', () => {
    const activeItem = carouselInnerDiv.querySelector('.carousel-item.active');
    const carouselItems = [...carouselInnerDiv.querySelectorAll('.carousel-item')];
    const currentIndex = carouselItems.indexOf(activeItem);
    const nextIndex = (currentIndex + 1) % carouselItems.length; // Loop around
    
    activeItem.classList.remove('active');
    carouselItems[nextIndex].classList.add('active');
    updateIndicators();
  });

  const nextIconSpan = document.createElement('span');
  nextIconSpan.classList.add('carousel-control-next-icon');
  nextIconSpan.setAttribute('aria-hidden', 'true');
  nextButton.append(nextIconSpan);

  const nextSrOnlySpan = document.createElement('span');
  nextSrOnlySpan.classList.add('sr-only');
  nextSrOnlySpan.textContent = 'Next';
  nextButton.append(nextSrOnlySpan);
  carouselShiftDiv.append(nextButton);

  carouselDiv.append(carouselShiftDiv);
  containerDiv.append(carouselDiv);
  block.textContent = '';
  block.append(containerDiv);

  // Handle indicator clicks
  carouselIndicatorsOl.querySelectorAll('li').forEach((indicator, idx) => {
    indicator.addEventListener('click', () => {
      const carouselItems = carouselInnerDiv.querySelectorAll('.carousel-item');
      carouselItems.forEach((item, itemIdx) => {
        if (itemIdx === idx) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
      updateIndicators();
    });
  });
}
