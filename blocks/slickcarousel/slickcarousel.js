import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider', 'slick-dotted');
  carouselContainer.setAttribute('data-slick', '3');
  carouselContainer.setAttribute('aria-atomic', 'false');

  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow', 'slick-disabled');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-disabled', 'true');
  prevButton.textContent = 'Previous';

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-disabled', 'false');
  nextButton.textContent = 'Next';

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickTrack.style.opacity = '1';

  const slickDots = document.createElement('ul');
  slickDots.classList.add('slick-dots');
  slickDots.setAttribute('role', 'tablist');

  const items = [...block.children];
  items.forEach((row, index) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    item.classList.add('cmp-carousel__item', 'slick-slide');
    if (index === 0) {
      item.classList.add('cmp-carousel__item--active', 'slick-current', 'slick-active');
      item.setAttribute('aria-hidden', 'false');
      item.setAttribute('tabindex', '0');
    } else {
      item.setAttribute('aria-hidden', 'true');
      item.setAttribute('tabindex', '-1');
    }
    item.setAttribute('id', `slick-slide1${index}`);
    item.setAttribute('role', 'tabpanel');
    item.setAttribute('aria-labelledby', `slickcarousel-0f817c55a9-item-${index}-tab`); // This ID is dynamic in original, but hardcoding for now
    item.setAttribute('aria-roledescription', 'slide');
    item.setAttribute('aria-label', `Slide ${index + 1} of ${items.length}`);
    item.setAttribute('data-cmp-hook-carousel', 'item');
    item.setAttribute('data-slick-index', index);

    const teaserDiv = document.createElement('div');
    teaserDiv.classList.add('teaser', 'cmp-teaser--carousel-teaser');

    const cmpTeaserDiv = document.createElement('div');
    cmpTeaserDiv.classList.add('cmp-teaser');
    cmpTeaserDiv.setAttribute('data-component', 'teaser');
    cmpTeaserDiv.setAttribute('data-show-media-url', 'false');
    cmpTeaserDiv.setAttribute('data-initialized', 'true');

    const cells = [...row.children];

    const desktopImageCell = cells[0];
    const mobileImageCell = cells[1];
    const titleCell = cells[2];
    const descriptionCell = cells[3];
    const buttonLinkCell = cells[4];
    const buttonTextCell = cells[5];

    const desktopPic = desktopImageCell.querySelector('picture');
    const mobilePic = mobileImageCell.querySelector('picture');

    if (desktopPic) {
      const desktopImg = desktopPic.querySelector('img');
      cmpTeaserDiv.setAttribute('data-background-image-desktop', desktopImg.src);
      cmpTeaserDiv.style.backgroundImage = `url("${desktopImg.src}")`;
    }
    if (mobilePic) {
      const mobileImg = mobilePic.querySelector('img');
      cmpTeaserDiv.setAttribute('data-background-image-mobile', mobileImg.src);
    }

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('cmp-teaser__content');

    if (titleCell) {
      const title = document.createElement('h2');
      title.classList.add('cmp-teaser__title');
      moveInstrumentation(titleCell, title);
      while (titleCell.firstChild) title.append(titleCell.firstChild);
      contentDiv.append(title);
    }

    if (descriptionCell) {
      const description = document.createElement('div');
      description.classList.add('cmp-teaser__description');
      moveInstrumentation(descriptionCell, description);
      while (descriptionCell.firstChild) description.append(descriptionCell.firstChild);
      contentDiv.append(description);
    }

    if (buttonLinkCell && buttonTextCell) {
      const actionContainer = document.createElement('div');
      actionContainer.classList.add('cmp-teaser__action-container');

      const buttonWrapper = document.createElement('div');
      buttonWrapper.classList.add('button', 'cmp-button--primary-anchor');

      const foundLink = buttonLinkCell.querySelector('a');
      const buttonLink = document.createElement('a');
      buttonLink.classList.add('cmp-button');
      if (foundLink) {
        buttonLink.href = foundLink.href;
        buttonLink.target = foundLink.target;
      }
      buttonLink.setAttribute('data-request', 'true');
      buttonLink.setAttribute('tabindex', index === 0 ? '0' : '-1');

      const buttonTextSpan = document.createElement('span');
      buttonTextSpan.classList.add('cmp-button__text');
      moveInstrumentation(buttonTextCell, buttonTextSpan);
      while (buttonTextCell.firstChild) buttonTextSpan.append(buttonTextCell.firstChild);

      buttonLink.append(buttonTextSpan);
      buttonWrapper.append(buttonLink);
      actionContainer.append(buttonWrapper);
      contentDiv.append(actionContainer);
    }

    cmpTeaserDiv.append(contentDiv);
    teaserDiv.append(cmpTeaserDiv);
    item.append(teaserDiv);
    slickTrack.append(item);

    const dotLi = document.createElement('li');
    dotLi.setAttribute('role', 'presentation');
    if (index === 0) {
      dotLi.classList.add('slick-active');
    }

    const dotButton = document.createElement('button');
    dotButton.setAttribute('type', 'button');
    dotButton.setAttribute('role', 'tab');
    dotButton.setAttribute('id', `slick-slide-control1${index}`);
    dotButton.setAttribute('aria-controls', `slick-slide1${index}`);
    dotButton.setAttribute('aria-label', `${index + 1} of ${items.length}`);
    dotButton.setAttribute('tabindex', index === 0 ? '0' : '-1');
    dotButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    dotButton.textContent = index + 1;
    dotLi.append(dotButton);
    slickDots.append(dotLi);
  });

  slickList.append(slickTrack);
  carouselContainer.append(prevButton, slickList, nextButton, slickDots);

  block.textContent = '';
  block.classList.add('carousel', 'panelcontainer');
  block.append(carouselContainer);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Basic carousel functionality (no slick.js)
  let currentIndex = 0;

  const updateCarousel = () => {
    // Calculate transform based on the current index.
    // Each slide takes up 100% of the visible area, so we translate by currentIndex * 100%.
    slickTrack.style.transform = `translate3d(-${currentIndex * 100}%, 0px, 0px)`;

    items.forEach((item, i) => {
      if (i === currentIndex) {
        item.classList.add('cmp-carousel__item--active', 'slick-current', 'slick-active');
        item.setAttribute('aria-hidden', 'false');
        item.setAttribute('tabindex', '0');
      } else {
        item.classList.remove('cmp-carousel__item--active', 'slick-current', 'slick-active');
        item.setAttribute('aria-hidden', 'true');
        item.setAttribute('tabindex', '-1');
      }
    });

    [...slickDots.children].forEach((dotLi, i) => {
      const dotButton = dotLi.querySelector('button');
      if (i === currentIndex) {
        dotLi.classList.add('slick-active');
        dotButton.setAttribute('tabindex', '0');
        dotButton.setAttribute('aria-selected', 'true');
      } else {
        dotLi.classList.remove('slick-active');
        dotButton.setAttribute('tabindex', '-1');
        dotButton.setAttribute('aria-selected', 'false');
      }
    });

    if (currentIndex === 0) {
      prevButton.classList.add('slick-disabled');
      prevButton.setAttribute('aria-disabled', 'true');
    } else {
      prevButton.classList.remove('slick-disabled');
      prevButton.setAttribute('aria-disabled', 'false');
    }

    if (currentIndex === items.length - 1) {
      nextButton.classList.add('slick-disabled');
      nextButton.setAttribute('aria-disabled', 'true');
    } else {
      nextButton.classList.remove('slick-disabled');
      nextButton.setAttribute('aria-disabled', 'false');
    }
  };

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < items.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  slickDots.addEventListener('click', (event) => {
    const clickedButton = event.target.closest('button');
    if (clickedButton) {
      const dotIndex = [...slickDots.children].indexOf(clickedButton.closest('li'));
      if (dotIndex !== -1 && dotIndex !== currentIndex) {
        currentIndex = dotIndex;
        updateCarousel();
      }
    }
  });

  updateCarousel(); // Initialize carousel state
}
