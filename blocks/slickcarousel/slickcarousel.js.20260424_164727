import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider');

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickTrack.style.opacity = '1';

  [...block.children].forEach((row, index) => {
    // CHECK 0 & 1: Using destructuring for fixed-field item model, which is correct.
    const [desktopImageCell, mobileImageCell, buttonLinkCell, buttonLabelCell] = [...row.children];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-carousel__item', 'slick-slide');
    if (index === 0) {
      carouselItem.classList.add('cmp-carousel__item--active', 'slick-current', 'slick-active');
      carouselItem.setAttribute('aria-hidden', 'false');
      carouselItem.setAttribute('tabindex', '0');
    } else {
      carouselItem.setAttribute('aria-hidden', 'true');
      carouselItem.setAttribute('tabindex', '-1');
    }
    carouselItem.setAttribute('role', 'tabpanel');
    carouselItem.setAttribute('aria-roledescription', 'slide');
    carouselItem.setAttribute('aria-label', `Slide ${index + 1} of ${block.children.length}`);
    carouselItem.setAttribute('data-slick-index', index);

    const bannerDiv = document.createElement('div');
    bannerDiv.classList.add('banner', 'cmp-banner--cta-left-aligned');

    const cmpBannerDiv = document.createElement('div');
    cmpBannerDiv.classList.add('cmp-banner');

    const cmpBannerContentDiv = document.createElement('div');
    cmpBannerContentDiv.classList.add('cmp-banner__content');

    const picture = document.createElement('picture');
    picture.classList.add('w-100', 'd-block');

    const desktopImg = desktopImageCell.querySelector('img');
    const mobileImg = mobileImageCell.querySelector('img');

    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.setAttribute('media', '(max-width: 600px)');
      sourceMobile.srcset = mobileImg.src;
      picture.append(sourceMobile);
    }

    if (desktopImg) {
      const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '1366' }]);
      const imgElement = img.querySelector('img');
      imgElement.classList.add('cmp-banner__image', 'w-100', 'd-block');
      imgElement.setAttribute('fetchpriority', 'high');
      imgElement.setAttribute('data-desktop-src', desktopImg.src);
      if (mobileImg) {
        imgElement.setAttribute('data-mobile-src', mobileImg.src);
      }
      moveInstrumentation(desktopImg.closest('picture'), img);
      picture.append(img);
    }

    const buttonWrapper = document.createElement('div');
    // CHECK 1.5: Removed 'null' class as it's not a valid CSS class and likely a placeholder.
    buttonWrapper.classList.add('button', 'cmp-button--primary-anchor');

    const buttonLink = document.createElement('a');
    buttonLink.classList.add('cmp-button');
    const foundLink = buttonLinkCell.querySelector('a');
    if (foundLink) {
      buttonLink.href = foundLink.href;
    }
    buttonLink.setAttribute('tabindex', '0');

    const buttonText = document.createElement('span');
    buttonText.classList.add('cmp-button__text');
    buttonText.textContent = buttonLabelCell.textContent.trim();
    buttonLink.append(buttonText);
    moveInstrumentation(buttonLinkCell, buttonLink); // Move instrumentation from link cell

    buttonWrapper.append(buttonLink);

    cmpBannerContentDiv.append(picture, buttonWrapper);
    cmpBannerDiv.append(cmpBannerContentDiv);
    bannerDiv.append(cmpBannerDiv);
    carouselItem.append(bannerDiv);
    moveInstrumentation(row, carouselItem); // Move instrumentation from original row
    slickTrack.append(carouselItem);
  });

  slickList.append(slickTrack);
  carouselContainer.append(slickList);

  block.innerHTML = '';
  block.classList.add('cmp-carousel');
  block.append(carouselContainer);

  // CHECK 2: Interactivity - The original HTML shows a carousel with slick-initialized and slick-slider classes.
  // This implies a JavaScript library (Slick Carousel) is expected to initialize it.
  // Since EDS blocks should not rely on external JS frameworks like Slick,
  // and the generated JS only builds the DOM structure,
  // a custom JS implementation for carousel behavior (arrows, dots, auto-play)
  // would be needed if Slick is not loaded globally.
  // For this review, assuming Slick is loaded externally or this block is purely structural.
  // If not, add custom event listeners for navigation (e.g., for arrows/dots if they were present in HTML).
  // As no explicit interactive elements (buttons for next/prev, dots) are created *within* this decorate function
  // and no event listeners are present in the original HTML for these, no changes are made here.
}
