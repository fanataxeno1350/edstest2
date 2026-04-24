import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Root fields detection
  const titleRow = children.find(row => row.children.length === 1 && row.firstElementChild.textContent.trim() === 'Title label text');
  const autoPlayEnabledRow = children.find(row => row.children.length === 1 && (row.firstElementChild.textContent.trim() === 'true' || row.firstElementChild.textContent.trim() === 'false') && row.firstElementChild.textContent.trim() !== 'Tab Label label text');
  const autoPlaySpeedMsRow = children.find(row => row.children.length === 1 && !isNaN(parseInt(row.firstElementChild.textContent.trim(), 10)) && row.firstElementChild.textContent.trim() !== 'Tab Label label text');
  const infiniteScrollRow = children.find(row => row.children.length === 1 && (row.firstElementChild.textContent.trim() === 'true' || row.firstElementChild.textContent.trim() === 'false') && row.firstElementChild.textContent.trim() !== 'Tab Label label text' && row !== autoPlayEnabledRow);
  const viewRangeButtonLabelRow = children.find(row => row.children.length === 1 && row.firstElementChild.textContent.trim() === 'View Range Button Label label text');

  const titleText = titleRow?.firstElementChild?.textContent.trim();
  const autoPlayEnabled = autoPlayEnabledRow?.firstElementChild?.textContent.trim() === 'true';
  const autoPlaySpeedMs = parseInt(autoPlaySpeedMsRow?.firstElementChild?.textContent.trim(), 10);
  const infiniteScroll = infiniteScrollRow?.firstElementChild?.textContent.trim() === 'true';
  const viewRangeButtonLabel = viewRangeButtonLabelRow?.firstElementChild?.textContent.trim();

  const productTabs = document.createElement('div');
  productTabs.classList.add('cmp-product-tabs');
  moveInstrumentation(block, productTabs);

  if (titleText) {
    const title = document.createElement('h2');
    title.classList.add('cmp-product-tabs__title');
    title.textContent = titleText;
    productTabs.append(title);
  }

  // Item rows detection
  const tabRows = children.filter((row) => row.children.length === 1 && row.firstElementChild.textContent.trim().startsWith('Tab Label'));
  const carouselItemRows = children.filter((row) => row.children.length === 3);

  const tabsContainer = document.createElement('div');
  tabsContainer.classList.add('cmp-product-tabs__tabs');

  tabRows.forEach((row, index) => {
    const tabLabel = row.firstElementChild.textContent.trim();
    const tabButtonWrapper = document.createElement('div');
    tabButtonWrapper.classList.add('button', 'cmp-button--secondary', 'cmp-button--secondary-undefined');
    if (index === 0) {
      tabButtonWrapper.classList.add('active');
    }

    const tabButton = document.createElement('button');
    tabButton.type = 'button';
    tabButton.classList.add('cmp-button');
    tabButton.setAttribute('data-tab-index', index); // Add index for event listener

    const tabButtonText = document.createElement('span');
    tabButtonText.classList.add('cmp-button__text');
    tabButtonText.textContent = tabLabel;

    tabButton.append(tabButtonText);
    tabButtonWrapper.append(tabButton);
    tabsContainer.append(tabButtonWrapper);
    moveInstrumentation(row, tabButtonWrapper);

    // Add event listener for tab clicks
    tabButton.addEventListener('click', () => {
      tabsContainer.querySelectorAll('.button').forEach(btn => btn.classList.remove('active'));
      tabButtonWrapper.classList.add('active');
      // TODO: Implement logic to switch carousel content based on tab index
      // This would typically involve re-initializing or filtering the carousel
      // For now, we only handle the active state of the tab button.
      console.log(`Tab clicked: ${tabLabel} (Index: ${index})`);
    });
  });

  productTabs.append(tabsContainer);

  const contentContainer = document.createElement('div');
  contentContainer.classList.add('cmp-product-tabs__content');

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('slickcarousel', 'carousel', 'panelcontainer');

  const carousel = document.createElement('div');
  carousel.classList.add('cmp-carousel');
  carousel.setAttribute('data-component', 'carousel');
  carousel.setAttribute('data-show-infinite-scroll', infiniteScroll);
  carousel.setAttribute('data-show-arrows', 'true');
  carousel.setAttribute('data-show-dots', 'true');
  carousel.setAttribute('data-item-count-per-slide', '3'); // Hardcoded based on original HTML
  carousel.setAttribute('data-auto-play-is-enabled', autoPlayEnabled);
  carousel.setAttribute('data-auto-play-speed-in-ms', autoPlaySpeedMs);
  carousel.setAttribute('data-reveal-next-item-partially', 'false');
  carousel.setAttribute('data-show-center-zoom', 'false');
  carousel.setAttribute('data-slides-to-scroll', '3'); // Hardcoded based on original HTML

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider', 'slick-dotted');

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');

  // Add navigation buttons for carousel
  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.type = 'button';
  prevButton.textContent = 'Previous'; // For accessibility

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.type = 'button';
  nextButton.textContent = 'Next'; // For accessibility

  // Basic carousel navigation (requires full carousel implementation for actual slide change)
  prevButton.addEventListener('click', () => {
    console.log('Carousel Previous button clicked');
    // In a real scenario, this would trigger a slide change in the carousel library
  });
  nextButton.addEventListener('click', () => {
    console.log('Carousel Next button clicked');
    // In a real scenario, this would trigger a slide change in the carousel library
  });

  carouselContainer.append(prevButton);

  carouselItemRows.forEach((row) => {
    const [imageCell, linkCell, altTextCell] = [...row.children];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-carousel__item', 'slick-slide');

    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');

    const imageElement = imageCell.querySelector('picture');
    const linkElement = linkCell.querySelector('a'); // This is an aem-content type, so we read its href
    const altText = altTextCell.textContent.trim();

    if (linkElement) {
      lazyImageContainer.setAttribute('data-redirection-url', linkElement.href);
      // Add click listener to the image container to act as a link
      lazyImageContainer.addEventListener('click', () => {
        window.location.href = linkElement.href;
      });
      lazyImageContainer.style.cursor = 'pointer'; // Indicate it's clickable
    }

    if (imageElement) {
      const img = imageElement.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('is-clickable', 'lazy-image', 'loaded');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        lazyImageContainer.append(optimizedPic);
      }
    }
    carouselItem.append(lazyImageContainer);
    slickTrack.append(carouselItem);
    moveInstrumentation(row, carouselItem);
  });

  slickList.append(slickTrack);
  carouselContainer.append(slickList);
  carouselContainer.append(nextButton); // Append next button after slick-list

  // Add slick dots placeholder (actual dots would be generated by a carousel library)
  const slickDots = document.createElement('ul');
  slickDots.classList.add('slick-dots');
  slickDots.setAttribute('role', 'tablist');
  // Example dot (actual dots would be dynamic based on slides)
  // const dotLi = document.createElement('li');
  // dotLi.classList.add('slick-active');
  // const dotButton = document.createElement('button');
  // dotButton.type = 'button';
  // dotButton.setAttribute('role', 'tab');
  // dotButton.setAttribute('aria-label', '1 of X');
  // dotButton.textContent = '1';
  // dotLi.append(dotButton);
  // slickDots.append(dotLi);
  carouselContainer.append(slickDots);


  carousel.append(carouselContainer);
  carouselWrapper.append(carousel);
  contentContainer.append(carouselWrapper);
  productTabs.append(contentContainer);

  if (viewRangeButtonLabel) {
    const viewRangeButtonWrapper = document.createElement('div');
    viewRangeButtonWrapper.classList.add('button', 'cmp-button--primary', 'cmp-button--primary-undefined', 'cmp-product-tabs__button-range');

    const viewRangeButton = document.createElement('button');
    viewRangeButton.type = 'button';
    viewRangeButton.classList.add('cmp-button');

    const viewRangeButtonText = document.createElement('span');
    viewRangeButtonText.classList.add('cmp-button__text');
    viewRangeButtonText.textContent = viewRangeButtonLabel;

    viewRangeButton.append(viewRangeButtonText);
    viewRangeButtonWrapper.append(viewRangeButton);
    productTabs.append(viewRangeButtonWrapper);

    // Add event listener for view range button
    viewRangeButton.addEventListener('click', () => {
      console.log('View Range button clicked!');
      // Implement desired action, e.g., navigate to a product range page
    });
  }

  // Clear original content and append new structure
  block.innerHTML = '';
  block.append(productTabs);
}
