import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider');

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');
  carouselContainer.append(slickList);

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickTrack.style.opacity = '1';
  slickList.append(slickTrack);

  [...block.children].forEach((row, index) => {
    // CHECK 0: No row.children[n] violations here, destructuring is used.
    if(index === 0) {
      continue; // Skip header row
    }
    const [imageDesktopCell, imageMobileCell, ctaLinkCell, ctaLabelCell] = [...row.children];

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
    carouselItem.setAttribute('aria-label', `Slide ${index + 1} of N`); // N will be set by slick carousel
    carouselItem.setAttribute('data-cmp-hook-carousel', 'item');
    carouselItem.setAttribute('data-slick-index', index.toString());

    const bannerDiv = document.createElement('div');
    bannerDiv.classList.add('banner', 'cmp-banner--cta-left-aligned');
    carouselItem.append(bannerDiv);

    const cmpBanner = document.createElement('div');
    cmpBanner.classList.add('cmp-banner');
    cmpBanner.setAttribute('data-component', 'banner');
    cmpBanner.setAttribute('data-initialized', 'true');
    bannerDiv.append(cmpBanner);

    const cmpBannerContent = document.createElement('div');
    cmpBannerContent.classList.add('cmp-banner__content');
    cmpBanner.append(cmpBannerContent);

    const picture = document.createElement('picture');
    picture.classList.add('w-100', 'd-block');

    const mobileImg = imageMobileCell.querySelector('img');
    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.setAttribute('media', '(max-width: 600px)');
      sourceMobile.setAttribute('srcset', mobileImg.src);
      picture.append(sourceMobile);
    }

    const desktopImg = imageDesktopCell.querySelector('img');
    if (desktopImg) {
      const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '1366' }]).querySelector('img');
      img.classList.add('cmp-banner__image', 'w-100', 'd-block');
      img.setAttribute('fetchpriority', 'high');
      img.setAttribute('data-desktop-src', desktopImg.src);
      if (mobileImg) {
        img.setAttribute('data-mobile-src', mobileImg.src);
      }
      picture.append(img);
    }
    cmpBannerContent.append(picture);

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('null', 'button', 'cmp-button--primary-anchor');

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('cmp-button');
    // FIX: cta-link is type=aem-content, so we read the href from the <a> tag inside the cell.
    // The original JS already correctly used querySelector('a').
    const foundLink = ctaLinkCell.querySelector('a');
    if (foundLink) {
      ctaLink.href = foundLink.href;
    }
    ctaLink.setAttribute('tabindex', '0');

    const ctaSpan = document.createElement('span');
    ctaSpan.classList.add('cmp-button__text');
    // cta-label is type=text, so .textContent.trim() is correct.
    ctaSpan.textContent = ctaLabelCell.textContent.trim();
    ctaLink.append(ctaSpan);

    buttonDiv.append(ctaLink);
    cmpBannerContent.append(buttonDiv);

    moveInstrumentation(row, carouselItem);
    slickTrack.append(carouselItem);
  });

  block.innerHTML = '';
  block.classList.add('cmp-carousel');
  block.setAttribute('data-placeholder-text', 'false');
  block.setAttribute('data-cmp-is', 'carousel');
  block.setAttribute('data-show-infinite-scroll', 'true');
  block.setAttribute('data-show-arrows', 'false'); // Based on original HTML
  block.setAttribute('data-show-dots', 'true'); // Based on original HTML
  block.setAttribute('data-item-count-per-slide', '1');
  block.setAttribute('data-auto-play-is-enabled', 'false');
  block.setAttribute('data-auto-play-speed-in-ms', '4200');
  block.setAttribute('data-reveal-next-item-partially', 'false');
  block.setAttribute('data-component', 'carousel');
  block.append(carouselContainer);
}
