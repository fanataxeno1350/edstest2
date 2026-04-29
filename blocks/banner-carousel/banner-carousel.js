import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselItems = [...block.children];

  const carousel = document.createElement('div');
  carousel.classList.add('cmp-carousel');
  carousel.setAttribute('role', 'group');
  carousel.setAttribute('aria-live', 'polite');
  carousel.setAttribute('aria-roledescription', 'carousel');
  carousel.setAttribute('data-cmp-is', 'carousel');
  carousel.setAttribute('data-component', 'carousel');
  carousel.setAttribute('data-auto-play-is-enabled', 'false');
  carousel.setAttribute('data-show-arrows', 'true');
  carousel.setAttribute('data-show-dots', 'true');
  carousel.setAttribute('data-auto-play-speed-in-ms', '15000');
  carousel.setAttribute('data-cmp-autopause-disabled', '');
  carousel.setAttribute('data-placeholder-text', 'false');

  const carouselContent = document.createElement('div');
  carouselContent.classList.add('cmp-carousel__content');
  carouselContent.setAttribute('aria-atomic', 'false');
  carouselContent.setAttribute('aria-live', 'polite');

  const indicators = document.createElement('ol');
  indicators.classList.add('cmp-carousel__indicators');
  indicators.setAttribute('role', 'tablist');
  indicators.setAttribute('aria-label', 'Choose a slide to display');
  indicators.setAttribute('data-cmp-hook-carousel', 'indicators');
  indicators.style.visibility = 'visible';

  const actions = document.createElement('div');
  actions.classList.add('cmp-carousel__actions');
  actions.style.visibility = 'visible';

  const prevButton = document.createElement('button');
  prevButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--previous');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('data-cmp-hook-carousel', 'previous');
  const prevIconSpan = document.createElement('span');
  prevIconSpan.classList.add('cmp-carousel__action-icon');
  const prevIconImg = document.createElement('img');
  prevIconImg.src = '/content/dam/aemigrate/uploaded-folder/bnatural-in/image/carouselarrow-left-b39e94.svg';
  prevIconSpan.append(prevIconImg);
  prevButton.append(prevIconSpan);

  const nextButton = document.createElement('button');
  nextButton.classList.add('cmp-carousel__action', 'cmp-carousel__action--next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('data-cmp-hook-carousel', 'next');
  const nextIconSpan = document.createElement('span');
  nextIconSpan.classList.add('cmp-carousel__action-icon');
  const nextIconImg = document.createElement('img');
  nextIconImg.src = '/content/dam/aemigrate/uploaded-folder/bnatural-in/image/carouselarrow-right-21b7f0.svg';
  nextIconSpan.append(nextIconImg);
  nextButton.append(nextIconSpan);

  actions.append(prevButton, nextButton);

  let currentIndex = 0;

  carouselItems.forEach((row, i) => {
    const cells = [...row.children];
    // imageCell: field="image" type=reference
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    // imageAltTextCell: field="imageAltText" type=aem-content
    const imageAltTextCell = cells.find(cell => cell.textContent.includes('/content/site/imageAltText'));
    // linkCell: field="link" type=aem-content
    const linkCell = cells.find(cell => cell.textContent.includes('/content/site/link'));

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('cmp-carousel__item');
    if (i === 0) {
      itemDiv.classList.add('cmp-carousel__item--active');
    }
    itemDiv.setAttribute('role', 'tabpanel');
    itemDiv.setAttribute('aria-labelledby', `carousel-item-${i}-tab`);
    itemDiv.setAttribute('aria-roledescription', 'slide');
    itemDiv.setAttribute('aria-label', `Slide ${i + 1} of ${carouselItems.length}`);
    itemDiv.setAttribute('data-cmp-hook-carousel', 'item');

    const teaserDiv = document.createElement('div');
    teaserDiv.classList.add('teaser', 'cmp-teaser--first-component', 'cmp-teaser');
    if (linkCell && linkCell.querySelector('a')) {
      teaserDiv.classList.add('cmp-teaser--full-bg-text-center-image-bottom-button', 'cmp-button--secondary-anchor');
    }

    const teaserContent = document.createElement('div');
    teaserContent.classList.add('cmp-teaser__content');
    teaserDiv.append(teaserContent);

    const teaserImageDiv = document.createElement('div');
    teaserImageDiv.classList.add('cmp-teaser__image');

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('cmp-image');
    imageWrapper.setAttribute('itemscope', '');
    imageWrapper.setAttribute('itemtype', 'http://schema.org/ImageObject');

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('cmp-image__image');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageWrapper.append(optimizedPic);
      }
    }

    const imageAltText = imageAltTextCell?.querySelector('a')?.textContent.split('/').pop(); // Correctly read aem-content
    if (imageWrapper.querySelector('img')) {
      imageWrapper.querySelector('img').alt = imageAltText || '';
    }

    teaserImageDiv.append(imageWrapper);

    const link = linkCell?.querySelector('a');
    if (link) {
      const teaserLink = document.createElement('a');
      teaserLink.classList.add('cmp-teaser__link');
      teaserLink.href = link.href;
      teaserLink.append(teaserContent, teaserImageDiv);
      teaserDiv.append(teaserLink);
      moveInstrumentation(link, teaserLink); // Move instrumentation for the link
    } else {
      teaserDiv.append(teaserContent, teaserImageDiv);
    }

    itemDiv.append(teaserDiv);
    carouselContent.append(itemDiv);
    moveInstrumentation(row, itemDiv);

    const indicator = document.createElement('li');
    indicator.classList.add('cmp-carousel__indicator');
    if (i === 0) {
      indicator.classList.add('cmp-carousel__indicator--active');
    }
    indicator.setAttribute('role', 'tab');
    indicator.setAttribute('id', `carousel-item-${i}-tab`);
    indicator.setAttribute('aria-controls', `carousel-item-${i}-tabpanel`);
    indicator.setAttribute('tabindex', '-1');
    indicator.setAttribute('title', `Slide ${i + 1}`);
    indicator.setAttribute('data-cmp-hook-carousel', 'indicator');
    indicator.addEventListener('click', () => {
      showSlide(i);
    });
    indicators.append(indicator);
  });

  function showSlide(index) {
    carouselItems.forEach((_, i) => {
      carouselContent.children[i].classList.remove('cmp-carousel__item--active');
      indicators.children[i].classList.remove('cmp-carousel__indicator--active');
    });

    carouselContent.children[index].classList.add('cmp-carousel__item--active');
    indicators.children[index].classList.add('cmp-carousel__indicator--active');
    currentIndex = index;
  }

  prevButton.addEventListener('click', () => {
    const newIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
    showSlide(newIndex);
  });

  nextButton.addEventListener('click', () => {
    const newIndex = (currentIndex + 1) % carouselItems.length;
    showSlide(newIndex);
  });

  carousel.append(carouselContent, actions, indicators);
  block.replaceWith(carousel);
}
