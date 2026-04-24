import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider');

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');

  const items = [...block.children];
  items.forEach((row, index) => {
    const cells = [...row.children];

    // Content detection for cells
    const desktopImageCell = cells.find(cell => cell.querySelector('picture') && cell.querySelector('img[alt="Desktop Image"]'));
    const mobileImageCell = cells.find(cell => cell.querySelector('picture') && cell.querySelector('img[alt="Mobile Image"]'));
    const buttonLinkCell = cells.find(cell => cell.querySelector('a') && cell.textContent.startsWith('/content/')); // aem-content type
    const buttonLabelCell = cells.find(cell => !cell.querySelector('a') && cell.textContent.trim() !== '' && cell !== desktopImageCell && cell !== mobileImageCell); // text type

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-carousel__item', 'slick-slide');
    if (index === 0) {
      carouselItem.classList.add('cmp-carousel__item--active', 'slick-current', 'slick-active');
    }
    carouselItem.setAttribute('data-slick-index', index);
    carouselItem.setAttribute('aria-hidden', index !== 0);
    carouselItem.setAttribute('tabindex', index === 0 ? '0' : '-1');
    carouselItem.setAttribute('role', 'tabpanel');
    carouselItem.setAttribute('aria-labelledby', `slickcarousel-item-${index}-tab`);
    carouselItem.setAttribute('aria-roledescription', 'slide');
    carouselItem.setAttribute('aria-label', `Slide ${index + 1} of ${items.length}`);

    const bannerDiv = document.createElement('div');
    bannerDiv.classList.add('banner', 'cmp-banner--cta-left-aligned');

    const cmpBanner = document.createElement('div');
    cmpBanner.classList.add('cmp-banner');
    cmpBanner.setAttribute('data-component', 'banner');
    cmpBanner.setAttribute('data-initialized', 'true');

    const bannerContent = document.createElement('div');
    bannerContent.classList.add('cmp-banner__content');

    const picture = document.createElement('picture');
    picture.classList.add('w-100', 'd-block');

    if (mobileImageCell) {
      const mobileImg = mobileImageCell.querySelector('img');
      if (mobileImg) {
        const sourceMobile = document.createElement('source');
        sourceMobile.setAttribute('media', '(max-width: 600px)');
        sourceMobile.setAttribute('srcset', mobileImg.src);
        picture.append(sourceMobile);
      }
    }

    if (desktopImageCell) {
      const desktopImg = desktopImageCell.querySelector('img');
      if (desktopImg) {
        const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, index === 0, [{ width: '1366' }]);
        img.querySelector('img').classList.add('cmp-banner__image', 'w-100', 'd-block');
        img.querySelector('img').setAttribute('data-desktop-src', desktopImg.src);
        if (mobileImageCell && mobileImageCell.querySelector('img')) {
          img.querySelector('img').setAttribute('data-mobile-src', mobileImageCell.querySelector('img').src);
        }
        if (index === 0) {
          img.querySelector('img').setAttribute('fetchpriority', 'high');
        }
        picture.append(img.querySelector('img'));
        moveInstrumentation(desktopImg.closest('picture'), picture.querySelector('img'));
      }
    }

    const buttonDiv = document.createElement('div');
    // The class 'null' is not in the allowlist. Assuming it should be 'button-container' based on common EDS patterns.
    buttonDiv.classList.add('button-container', 'button', 'cmp-button--primary-anchor');

    const buttonLink = document.createElement('a');
    buttonLink.classList.add('cmp-button');
    if (buttonLinkCell) {
      const foundLink = buttonLinkCell.querySelector('a');
      if (foundLink) {
        buttonLink.href = foundLink.href;
      }
    }
    buttonLink.setAttribute('tabindex', index === 0 ? '0' : '-1');

    const buttonText = document.createElement('span');
    buttonText.classList.add('cmp-button__text');
    if (buttonLabelCell) {
      buttonText.textContent = buttonLabelCell.textContent.trim();
    }
    buttonLink.append(buttonText);
    buttonDiv.append(buttonLink);
    if (buttonLinkCell) {
      moveInstrumentation(buttonLinkCell, buttonLink);
    }

    bannerContent.append(picture, buttonDiv);
    cmpBanner.append(bannerContent);
    bannerDiv.append(cmpBanner);
    carouselItem.append(bannerDiv);
    slickTrack.append(carouselItem);
    moveInstrumentation(row, carouselItem);
  });

  slickList.append(slickTrack);
  carouselContainer.append(slickList);

  block.innerHTML = '';
  block.append(carouselContainer);
  block.classList.add('cmp-carousel');
  block.setAttribute('data-cmp-is', 'carousel');
  block.setAttribute('data-show-infinite-scroll', 'true');
  block.setAttribute('data-show-arrows', 'false');
  block.setAttribute('data-show-dots', 'true');
  block.setAttribute('data-item-count-per-slide', '1');
  block.setAttribute('data-auto-play-is-enabled', 'false');
  block.setAttribute('data-auto-play-speed-in-ms', '4200');
  block.setAttribute('data-reveal-next-item-partially', 'false');
  block.setAttribute('data-component', 'carousel');
}
