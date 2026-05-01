import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carousel = document.createElement('div');
  carousel.classList.add('cmp-carousel', 'cmp-carousel-initialized');
  carousel.setAttribute('role', 'group');
  carousel.setAttribute('aria-label', 'Carousel');
  carousel.setAttribute('aria-live', 'polite');
  carousel.setAttribute('aria-roledescription', 'carousel');

  const content = document.createElement('ul');
  content.classList.add('cmp-carousel__content');
  content.setAttribute('aria-atomic', 'false');
  content.setAttribute('aria-live', 'polite');

  const indicators = document.createElement('ol');
  indicators.classList.add('cmp-carousel__indicators');
  indicators.setAttribute('role', 'tablist');
  indicators.setAttribute('aria-label', 'Choose a slide to display');

  const slides = [...block.children];
  let activeSlideIndex = 0;

  slides.forEach((row, i) => {
    const [imageCell, linkCell, imageAltCell, imageTitleCell] = [...row.children];

    const listItem = document.createElement('li');
    listItem.classList.add('cmp-carousel__item');
    listItem.setAttribute('aria-roledescription', 'slide');
    listItem.setAttribute('aria-label', `Slide ${i + 1} of ${slides.length}`);

    if (i === activeSlideIndex) {
      listItem.classList.add('cmp-carousel__item--active');
    }

    const containerDiv = document.createElement('div');
    containerDiv.classList.add('container', 'responsivegrid');

    const innerContainerDiv = document.createElement('div');
    innerContainerDiv.classList.add('cmp-container');

    const gridDiv = document.createElement('div');
    gridDiv.classList.add('aem-Grid', 'aem-Grid--12', 'aem-Grid--default--12');

    const imageWrapperDiv = document.createElement('div');
    imageWrapperDiv.classList.add('tabimage', 'image', 'image--full-width', 'aem-GridColumn', 'aem-GridColumn--default--12');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('cmp-image');
    imageDiv.setAttribute('itemscope', '');
    imageDiv.setAttribute('itemtype', 'http://schema.org/ImageObject');

    const link = document.createElement('a');
    link.classList.add('cmp-image__link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      if (foundLink.target) link.target = foundLink.target;
      if (foundLink.rel) link.rel = foundLink.rel;
      if (foundLink.classList.contains('external-link-icon')) {
        link.classList.add('external-link-icon');
      }
    }
    link.title = imageTitleCell.textContent.trim();
    link.setAttribute('aria-label', imageAltCell.textContent.trim());

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      link.append(optimizedPic);
    }

    imageDiv.append(link);
    imageWrapperDiv.append(imageDiv);
    gridDiv.append(imageWrapperDiv);
    innerContainerDiv.append(gridDiv);
    containerDiv.append(innerContainerDiv);
    moveInstrumentation(row, listItem);
    listItem.append(containerDiv);
    content.append(listItem);

    const indicator = document.createElement('li');
    indicator.classList.add('cmp-carousel__indicator');
    indicator.setAttribute('role', 'tab');
    indicator.setAttribute('aria-label', `Slide ${i + 1}`);
    indicator.textContent = `Slide ${i + 1}`;
    if (i === activeSlideIndex) {
      indicator.classList.add('cmp-carousel__indicator--active');
      indicator.setAttribute('aria-selected', 'true');
    } else {
      indicator.setAttribute('aria-selected', 'false');
      indicator.setAttribute('tabindex', '-1');
    }
    indicators.append(indicator);
  });

  const actions = document.createElement('div');
  actions.classList.add('cmp-carousel__actions');

  const prevButton = document.createElement('button');
  prevButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--previous', 'cmp-carousel__action--disabled');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.disabled = true;
  prevButton.innerHTML = '<span class="cmp-carousel__action-icon"></span> <span class="cmp-carousel__action-text">Previous</span>';

  const nextButton = document.createElement('button');
  nextButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.innerHTML = '<span class="cmp-carousel__action-icon"></span> <span class="cmp-carousel__action-text">Next</span>';

  actions.append(prevButton, nextButton);
  carousel.append(content, actions, indicators);

  block.innerHTML = '';
  block.append(carousel);

  // Carousel functionality
  const carouselItems = [...content.children];
  const carouselIndicators = [...indicators.children];
  let currentIndex = 0;

  function updateCarousel() {
    carouselItems.forEach((item, idx) => {
      if (idx === currentIndex) {
        item.classList.add('cmp-carousel__item--active');
        item.removeAttribute('tabindex');
      } else {
        item.classList.remove('cmp-carousel__item--active');
        item.setAttribute('tabindex', '-1');
      }
    });

    carouselIndicators.forEach((indicator, idx) => {
      if (idx === currentIndex) {
        indicator.classList.add('cmp-carousel__indicator--active');
        indicator.setAttribute('aria-selected', 'true');
        indicator.removeAttribute('tabindex');
      } else {
        indicator.classList.remove('cmp-carousel__indicator--active');
        indicator.setAttribute('aria-selected', 'false');
        indicator.setAttribute('tabindex', '-1');
      }
    });

    prevButton.disabled = currentIndex === 0;
    prevButton.classList.toggle('cmp-carousel__action--disabled', currentIndex === 0);
    nextButton.disabled = currentIndex === carouselItems.length - 1;
    nextButton.classList.toggle('cmp-carousel__action--disabled', currentIndex === carouselItems.length - 1);
  }

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < carouselItems.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  carouselIndicators.forEach((indicator, idx) => {
    indicator.addEventListener('click', () => {
      currentIndex = idx;
      updateCarousel();
    });
  });

  updateCarousel(); // Initialize carousel state
}
