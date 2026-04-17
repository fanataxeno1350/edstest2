import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Root fields based on BlockJson model
  const titleCell = children[0];
  const autoPlayEnabledCell = children[1];
  const autoPlaySpeedMsCell = children[2];
  const infiniteScrollCell = children[3];
  const viewRangeLabelCell = children[4]; // This is children[4] as per BlockJson and EDS Structure

  const titleText = titleCell?.textContent?.trim();
  const autoPlayEnabled = autoPlayEnabledCell?.textContent?.trim() === 'true';
  const autoPlaySpeedMs = parseInt(autoPlaySpeedMsCell?.textContent?.trim(), 10) || 3000;
  const infiniteScroll = infiniteScrollCell?.textContent?.trim() === 'true';
  const viewRangeLabel = viewRangeLabelCell?.textContent?.trim();

  // Filter item rows based on their structure
  // product-tab has 1 cell
  // product-item has 3 cells
  const tabItemRows = children.filter((row) => row.children.length === 1);
  const carouselItemRows = children.filter((row) => row.children.length === 3);

  block.innerHTML = '';
  block.classList.add('cmp-product-tabs'); // From ORIGINAL HTML

  // Prepend temp-images div as seen in original HTML
  const tempImagesDiv = document.createElement('div');
  tempImagesDiv.classList.add('cmp-product-tabs__temp-images'); // From ORIGINAL HTML
  for (let i = 0; i < 13; i += 1) { // 13 lazy-image-container divs in original HTML
    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container'); // From ORIGINAL HTML
    tempImagesDiv.append(lazyImageContainer);
  }
  block.prepend(tempImagesDiv);

  if (titleText) {
    const title = document.createElement('h2');
    title.classList.add('cmp-product-tabs__title'); // From ORIGINAL HTML
    title.textContent = titleText;
    block.append(title);
    moveInstrumentation(titleCell, title);
  }

  const tabsContainer = document.createElement('div');
  tabsContainer.classList.add('cmp-product-tabs__tabs'); // From ORIGINAL HTML

  const tabButtons = []; // To store tab buttons for interaction logic
  tabItemRows.forEach((row, index) => {
    const tabLabelCell = [...row.children][0]; // Correctly access the single cell for tab label
    const tabButtonWrapper = document.createElement('div');
    tabButtonWrapper.classList.add('button', 'cmp-button--secondary', 'cmp-button--secondary-undefined'); // From ORIGINAL HTML
    if (index === 0) {
      tabButtonWrapper.classList.add('active'); // From ORIGINAL HTML
    }

    const tabButton = document.createElement('button');
    tabButton.type = 'button';
    tabButton.classList.add('cmp-button'); // From ORIGINAL HTML

    const tabButtonText = document.createElement('span');
    tabButtonText.classList.add('cmp-button__text'); // From ORIGINAL HTML
    tabButtonText.textContent = tabLabelCell?.textContent?.trim();
    moveInstrumentation(tabLabelCell, tabButtonText);

    tabButton.append(tabButtonText);
    tabButtonWrapper.append(tabButton);
    tabsContainer.append(tabButtonWrapper);
    moveInstrumentation(row, tabButtonWrapper);
    tabButtons.push(tabButtonWrapper); // Store for later use

    tabButton.addEventListener('click', () => {
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      tabButtonWrapper.classList.add('active');
      // Logic to switch carousel content based on tab selection would go here
      // For now, it only activates the tab button.
    });
  });
  block.append(tabsContainer);

  const contentContainer = document.createElement('div');
  contentContainer.classList.add('cmp-product-tabs__content'); // From ORIGINAL HTML

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('slickcarousel', 'carousel', 'panelcontainer'); // From ORIGINAL HTML

  const carousel = document.createElement('div');
  carousel.classList.add('cmp-carousel'); // From ORIGINAL HTML
  carousel.setAttribute('data-component', 'carousel');
  carousel.setAttribute('data-show-infinite-scroll', infiniteScroll.toString());
  carousel.setAttribute('data-show-arrows', 'true');
  carousel.setAttribute('data-show-dots', 'true');
  carousel.setAttribute('data-item-count-per-slide', '3'); // Hardcoded as per original HTML
  carousel.setAttribute('data-auto-play-is-enabled', autoPlayEnabled.toString());
  carousel.setAttribute('data-auto-play-speed-in-ms', autoPlaySpeedMs.toString());
  carousel.setAttribute('data-reveal-next-item-partially', 'false');
  carousel.setAttribute('data-show-center-zoom', 'false');
  carousel.setAttribute('data-slides-to-scroll', '3'); // Hardcoded as per original HTML

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider', 'slick-dotted'); // From ORIGINAL HTML

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable'); // From ORIGINAL HTML

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track'); // From ORIGINAL HTML

  carouselItemRows.forEach((row) => {
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture')); // Content detection
    const altTextCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a')); // Content detection for text
    const linkCell = cells.find(cell => cell.querySelector('a')); // Content detection for aem-content

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-carousel__item', 'slick-slide'); // From ORIGINAL HTML

    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container'); // From ORIGINAL HTML

    const linkEl = linkCell?.querySelector('a');
    if (linkEl) {
      lazyImageContainer.setAttribute('data-redirection-url', linkEl.href);
    }

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, altTextCell?.textContent?.trim() || img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('is-clickable', 'lazy-image', 'loaded'); // From ORIGINAL HTML
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        lazyImageContainer.append(optimizedPic);
      }
    }
    moveInstrumentation(imageCell, lazyImageContainer);
    moveInstrumentation(altTextCell, lazyImageContainer);
    moveInstrumentation(linkCell, lazyImageContainer);

    carouselItem.append(lazyImageContainer);
    slickTrack.append(carouselItem);
    moveInstrumentation(row, carouselItem);
  });

  slickList.append(slickTrack);
  carouselContainer.append(slickList);

  // Add carousel navigation buttons and dots as per original HTML
  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow'); // From ORIGINAL HTML
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.type = 'button';
  prevButton.textContent = 'Previous';
  carouselContainer.prepend(prevButton);

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow'); // From ORIGINAL HTML
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.type = 'button';
  nextButton.textContent = 'Next';
  carouselContainer.append(nextButton);

  const slickDots = document.createElement('ul');
  slickDots.classList.add('slick-dots'); // From ORIGINAL HTML
  slickDots.setAttribute('role', 'tablist');
  // Placeholder for dots, actual dot generation would be part of a carousel library
  // For now, just create an empty ul to match structure
  carouselContainer.append(slickDots);


  carousel.append(carouselContainer);
  carouselWrapper.append(carousel);
  contentContainer.append(carouselWrapper);
  block.append(contentContainer);

  if (viewRangeLabel) {
    const viewRangeButtonWrapper = document.createElement('div');
    viewRangeButtonWrapper.classList.add('button', 'cmp-button--primary', 'cmp-button--primary-undefined', 'cmp-product-tabs__button-range'); // From ORIGINAL HTML

    const viewRangeButton = document.createElement('button');
    viewRangeButton.type = 'button';
    viewRangeButton.classList.add('cmp-button'); // From ORIGINAL HTML

    const viewRangeButtonText = document.createElement('span');
    viewRangeButtonText.classList.add('cmp-button__text'); // From ORIGINAL HTML
    viewRangeButtonText.textContent = viewRangeLabel;
    moveInstrumentation(viewRangeLabelCell, viewRangeButtonText);

    viewRangeButton.append(viewRangeButtonText);
    viewRangeButtonWrapper.append(viewRangeButton);
    block.append(viewRangeButtonWrapper);
  }

  // Add event listeners for carousel navigation (if not handled by an external library)
  // These would typically be handled by a slick carousel initialization, but for standalone JS:
  prevButton.addEventListener('click', () => {
    // Implement carousel previous slide logic
    console.log('Carousel Previous clicked');
  });

  nextButton.addEventListener('click', () => {
    // Implement carousel next slide logic
    console.log('Carousel Next clicked');
  });
}
