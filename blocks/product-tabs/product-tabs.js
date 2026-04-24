import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Root fields
  const titleRow = children[0];
  const autoPlayIsEnabledRow = children[1];
  const autoPlaySpeedInMsRow = children[2];
  const infiniteScrollRow = children[3];
  const rangeButtonLabelRow = children[4]; // This is the 5th root field, not after tabs/products

  const titleText = titleRow?.textContent.trim();
  const autoPlayIsEnabled = autoPlayIsEnabledRow?.textContent.trim() === 'true';
  const autoPlaySpeedInMs = parseInt(autoPlaySpeedInMsRow?.textContent.trim(), 10);
  const infiniteScroll = infiniteScrollRow?.textContent.trim() === 'true';
  const rangeButtonLabel = rangeButtonLabelRow?.textContent.trim();

  // Filter item rows based on number of children
  // tab-item has 1 cell: label
  const tabItemRows = children.filter((row) => row.children.length === 1);
  // product-item has 3 cells: image, altText, link
  const productItemRows = children.filter((row) => row.children.length === 3);

  // Main container
  block.classList.add('cmp-product-tabs');
  // Remove attributes that will be set on the carousel itself
  block.removeAttribute('data-auto-play-is-enabled');
  block.removeAttribute('data-auto-play-speed-in-ms');
  block.removeAttribute('data-infinite-scroll');

  // Title
  if (titleText) {
    const titleElement = document.createElement('h2');
    titleElement.classList.add('cmp-product-tabs__title');
    titleElement.textContent = titleText;
    moveInstrumentation(titleRow, titleElement);
    block.prepend(titleElement);
  }
  titleRow.remove();

  // Tabs container
  const tabsContainer = document.createElement('div');
  tabsContainer.classList.add('cmp-product-tabs__tabs');

  tabItemRows.forEach((row, index) => {
    const tabLabel = row.textContent.trim(); // tab-item has only one cell, so row.textContent is fine
    if (tabLabel) {
      const buttonWrapper = document.createElement('div');
      buttonWrapper.classList.add('button', 'cmp-button--secondary', 'cmp-button--secondary-undefined');
      if (index === 0) {
        buttonWrapper.classList.add('active');
      }

      const button = document.createElement('button');
      button.classList.add('cmp-button');
      button.type = 'button';

      const buttonText = document.createElement('span');
      buttonText.classList.add('cmp-button__text');
      buttonText.textContent = tabLabel;

      button.append(buttonText);
      buttonWrapper.append(button);
      tabsContainer.append(buttonWrapper);
      moveInstrumentation(row, buttonWrapper);
    }
    row.remove();
  });
  block.append(tabsContainer);

  // Content container (carousel)
  const contentContainer = document.createElement('div');
  contentContainer.classList.add('cmp-product-tabs__content');

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('slickcarousel', 'carousel', 'panelcontainer');

  const carousel = document.createElement('div');
  carousel.classList.add('cmp-carousel');
  carousel.setAttribute('data-component', 'carousel');
  carousel.setAttribute('data-show-infinite-scroll', infiniteScroll.toString());
  carousel.setAttribute('data-show-arrows', 'true');
  carousel.setAttribute('data-show-dots', 'true');
  carousel.setAttribute('data-item-count-per-slide', '3'); // Hardcoded as per original HTML
  carousel.setAttribute('data-auto-play-is-enabled', autoPlayIsEnabled.toString());
  carousel.setAttribute('data-auto-play-speed-in-ms', autoPlaySpeedInMs.toString());
  carousel.setAttribute('data-reveal-next-item-partially', 'false');
  carousel.setAttribute('data-show-center-zoom', 'false');
  carousel.setAttribute('data-slides-to-scroll', '3'); // Hardcoded as per original HTML

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container');

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');

  productItemRows.forEach((row, index) => {
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const altTextCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const altText = altTextCell?.textContent.trim();
    const link = linkCell?.querySelector('a');
    const linkHref = link ? link.getAttribute('href') : ''; // Read href from aem-content type

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-carousel__item', 'slick-slide');
    carouselItem.setAttribute('data-slick-index', index.toString());
    carouselItem.setAttribute('aria-hidden', 'true');
    carouselItem.setAttribute('tabindex', '-1');
    carouselItem.setAttribute('role', 'tabpanel');
    carouselItem.id = `slick-slide1${index}`;

    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');

    if (linkHref) {
      lazyImageContainer.setAttribute('data-redirection-url', linkHref);
    }

    if (imageCell) {
      const img = imageCell.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        lazyImageContainer.append(optimizedPic);
      }
    }
    carouselItem.append(lazyImageContainer);
    slickTrack.append(carouselItem);
    moveInstrumentation(row, carouselItem);
    row.remove();
  });

  slickList.append(slickTrack);
  carouselContainer.append(slickList);
  carousel.append(carouselContainer);
  carouselWrapper.append(carousel);
  contentContainer.append(carouselWrapper);
  block.append(contentContainer);

  // Range button
  if (rangeButtonLabel) {
    const rangeButtonWrapper = document.createElement('div');
    rangeButtonWrapper.classList.add('button', 'cmp-button--primary', 'cmp-button--primary-undefined', 'cmp-product-tabs__button-range');

    const rangeButton = document.createElement('button');
    rangeButton.classList.add('cmp-button');
    rangeButton.type = 'button';

    const rangeButtonText = document.createElement('span');
    rangeButtonText.classList.add('cmp-button__text');
    rangeButtonText.textContent = rangeButtonLabel;

    rangeButton.append(rangeButtonText);
    rangeButtonWrapper.append(rangeButton);
    block.append(rangeButtonWrapper);
    moveInstrumentation(rangeButtonLabelRow, rangeButtonWrapper); // Added moveInstrumentation
  }
  rangeButtonLabelRow.remove();

  // Clean up remaining original rows
  children.forEach((row) => {
    if (block.contains(row)) {
      row.remove();
    }
  });

  // Add event listeners for tabs
  const tabButtons = tabsContainer.querySelectorAll('.button');
  const carouselItems = slickTrack.querySelectorAll('.cmp-carousel__item');

  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      // Simple tab content switching (replace with actual carousel logic if needed)
      // This is a placeholder. A real carousel would likely have its own API to switch slides.
      carouselItems.forEach((item) => item.style.display = 'none');
      if (carouselItems[index]) {
        carouselItems[index].style.display = 'block';
      }
    });
  });
}
