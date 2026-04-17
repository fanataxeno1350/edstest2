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
    const [desktopImageCell, mobileImageCell, buttonLabelCell, buttonLinkCell] = [...row.children];

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
    carouselItem.setAttribute('aria-label', `Slide ${index + 1} of ${items.length}`);
    carouselItem.setAttribute('data-slick-index', index);

    const bannerDiv = document.createElement('div');
    bannerDiv.classList.add('banner', 'cmp-banner--cta-left-aligned');

    const cmpBannerDiv = document.createElement('div');
    cmpBannerDiv.classList.add('cmp-banner');

    const cmpBannerContent = document.createElement('div');
    cmpBannerContent.classList.add('cmp-banner__content');

    const picture = document.createElement('picture');
    picture.classList.add('w-100', 'd-block');

    const desktopImg = desktopImageCell.querySelector('img');
    const mobileImg = mobileImageCell.querySelector('img');

    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.setAttribute('media', '(max-width: 600px)');
      sourceMobile.setAttribute('srcset', mobileImg.src);
      picture.appendChild(sourceMobile);
    }

    if (desktopImg) {
      const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, index === 0, [{ width: '1366' }]);
      const imgElement = img.querySelector('img');
      imgElement.classList.add('cmp-banner__image', 'w-100', 'd-block');
      imgElement.setAttribute('data-desktop-src', desktopImg.src);
      if (mobileImg) {
        imgElement.setAttribute('data-mobile-src', mobileImg.src);
      }
      if (index === 0) {
        imgElement.setAttribute('fetchpriority', 'high');
      }
      moveInstrumentation(desktopImg, imgElement);
      picture.appendChild(img);
    }

    cmpBannerContent.appendChild(picture);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button', 'cmp-button--primary-anchor'); // Removed 'null' class

    const buttonLink = buttonLinkCell.querySelector('a');
    if (buttonLink) {
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-button');
      anchor.setAttribute('data-request', 'true');
      anchor.setAttribute('data-show-pop', 'false');
      anchor.href = buttonLink.href;
      anchor.setAttribute('tabindex', '0');

      const span = document.createElement('span');
      span.classList.add('cmp-button__text');
      span.textContent = buttonLabelCell.textContent.trim();
      anchor.appendChild(span);
      moveInstrumentation(buttonLinkCell, anchor);
      buttonContainer.appendChild(anchor);
    }

    cmpBannerContent.appendChild(buttonContainer);
    cmpBannerDiv.appendChild(cmpBannerContent);
    bannerDiv.appendChild(cmpBannerDiv);
    carouselItem.appendChild(bannerDiv);
    slickTrack.appendChild(carouselItem);
    moveInstrumentation(row, carouselItem);
  });

  slickList.appendChild(slickTrack);
  carouselContainer.appendChild(slickList);

  block.innerHTML = '';
  block.classList.add('cmp-carousel'); // Add the base class for the block itself
  block.appendChild(carouselContainer);
}
