import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider');

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');

  [...block.children].forEach((row, index) => {
    const [desktopImageCell, mobileImageCell, buttonLabelCell, buttonLinkCell] = [...row.children];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-carousel__item', 'slick-slide');
    if (index === 0) {
      carouselItem.classList.add('cmp-carousel__item--active', 'slick-current', 'slick-active');
    }
    carouselItem.setAttribute('role', 'tabpanel');
    carouselItem.setAttribute('aria-label', `Slide ${index + 1} of ${block.children.length}`);
    carouselItem.setAttribute('data-slick-index', index);
    carouselItem.setAttribute('aria-hidden', index !== 0);
    carouselItem.setAttribute('tabindex', index === 0 ? '0' : '-1');

    const bannerDiv = document.createElement('div');
    bannerDiv.classList.add('banner', 'cmp-banner--cta-left-aligned');

    const cmpBannerDiv = document.createElement('div');
    cmpBannerDiv.classList.add('cmp-banner');
    cmpBannerDiv.setAttribute('data-component', 'banner');
    cmpBannerDiv.setAttribute('data-initialized', 'true');

    const cmpBannerContent = document.createElement('div');
    cmpBannerContent.classList.add('cmp-banner__content');

    const picture = document.createElement('picture');
    picture.classList.add('w-100', 'd-block');

    const mobileImage = mobileImageCell.querySelector('img');
    if (mobileImage) {
      const sourceMobile = document.createElement('source');
      sourceMobile.setAttribute('media', '(max-width: 600px)');
      sourceMobile.setAttribute('srcset', mobileImage.src);
      picture.append(sourceMobile);
    }

    const desktopImage = desktopImageCell.querySelector('img');
    if (desktopImage) {
      const img = createOptimizedPicture(desktopImage.src, desktopImage.alt, false, [{ width: '1366' }]);
      img.querySelector('img').classList.add('cmp-banner__image', 'w-100', 'd-block');
      img.querySelector('img').setAttribute('data-desktop-src', desktopImage.src);
      if (mobileImage) {
        img.querySelector('img').setAttribute('data-mobile-src', mobileImage.src);
      }
      img.querySelector('img').setAttribute('fetchpriority', 'high');
      moveInstrumentation(desktopImage, img.querySelector('img'));
      picture.append(img.querySelector('img'));
    }

    cmpBannerContent.append(picture);

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button', 'cmp-button--primary-anchor'); // Removed 'null' class

    const buttonLink = document.createElement('a');
    buttonLink.classList.add('cmp-button');
    buttonLink.setAttribute('data-request', 'true');
    buttonLink.setAttribute('data-show-pop', 'false');
    buttonLink.setAttribute('tabindex', '0');

    const foundLink = buttonLinkCell.querySelector('a');
    if (foundLink) {
      buttonLink.href = foundLink.href;
    }

    const buttonSpan = document.createElement('span');
    buttonSpan.classList.add('cmp-button__text');
    buttonSpan.textContent = buttonLabelCell.textContent.trim();
    buttonLink.append(buttonSpan);

    moveInstrumentation(buttonLinkCell, buttonLink);
    buttonDiv.append(buttonLink);
    cmpBannerContent.append(buttonDiv);

    cmpBannerDiv.append(cmpBannerContent);
    bannerDiv.append(cmpBannerDiv);
    moveInstrumentation(row, carouselItem);
    carouselItem.append(bannerDiv);
    slickTrack.append(carouselItem);
  });

  slickList.append(slickTrack);
  carouselContainer.append(slickList);
  block.innerHTML = '';
  block.classList.add('cmp-carousel');
  block.setAttribute('data-placeholder-text', 'false');
  block.setAttribute('data-cmp-is', 'carousel');
  block.setAttribute('data-show-infinite-scroll', 'true');
  block.setAttribute('data-show-arrows', 'false');
  block.setAttribute('data-show-dots', 'true');
  block.setAttribute('data-item-count-per-slide', '1');
  block.setAttribute('data-auto-play-is-enabled', 'false');
  block.setAttribute('data-auto-play-speed-in-ms', '4200');
  block.setAttribute('data-reveal-next-item-partially', 'false');
  block.setAttribute('data-component', 'carousel');
  block.append(carouselContainer);
}
