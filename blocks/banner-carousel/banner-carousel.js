import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselId = 'carouselExampleSlidesOnly';

  const section = document.createElement('section');
  section.classList.add('banner-itc-carousel-section');

  const carouselDiv = document.createElement('div');
  carouselDiv.id = carouselId;
  carouselDiv.classList.add('banner-bannerCarousel', 'banner-carousel', 'banner-slide');
  carouselDiv.setAttribute('data-ride', 'carousel');

  const olIndicators = document.createElement('ol');
  olIndicators.classList.add('banner-carousel-indicators');

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('banner-carousel-inner');

  const bannerSlides = block.querySelectorAll('[data-aue-model="bannerSlide"]');

  bannerSlides.forEach((slideNode, index) => {
    const liIndicator = document.createElement('li');
    liIndicator.setAttribute('data-target', `#${carouselId}`);
    liIndicator.setAttribute('data-slide-to', index.toString());
    if (index === 0) {
      liIndicator.classList.add('banner-active');
    }
    olIndicators.append(liIndicator);
    moveInstrumentation(slideNode, liIndicator);

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('banner-carousel-item');
    if (index === 0) {
      carouselItem.classList.add('banner-active');
    }

    const desktopImage = slideNode.querySelector('[data-aue-prop="desktopImage"]');
    if (desktopImage) {
      const picture = createOptimizedPicture(desktopImage.src, desktopImage.alt, index === 0, [{ media: '(min-width: 576px)', width: '2000' }]);
      picture.querySelector('img').classList.add('banner-d-none', 'banner-d-sm-block', 'banner-w-100', 'banner-desktop-image');
      picture.querySelector('img').setAttribute('loading', index === 0 ? 'eager' : 'lazy');
      picture.querySelector('img').setAttribute('fetchpriority', index === 0 ? 'high' : 'low');
      carouselItem.append(picture);
      moveInstrumentation(desktopImage, picture);
    }

    const mobileImage = slideNode.querySelector('[data-aue-prop="mobileImage"]');
    if (mobileImage) {
      const picture = createOptimizedPicture(mobileImage.src, mobileImage.alt, index === 0, [{ width: '768' }]);
      picture.querySelector('img').classList.add('banner-d-block', 'banner-d-sm-none', 'banner-w-100', 'banner-mobile-image');
      picture.querySelector('img').setAttribute('loading', index === 0 ? 'eager' : 'lazy');
      picture.querySelector('img').setAttribute('fetchpriority', index === 0 ? 'high' : 'low');
      carouselItem.append(picture);
      moveInstrumentation(mobileImage, picture);
    }

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('banner-banner-content-wrapper', 'banner-position-absolute');

    const heading = slideNode.querySelector('[data-aue-prop="heading"]');
    if (heading) {
      const h1 = document.createElement('h1');
      h1.classList.add('banner-koi-carousel-heading', 'banner-text-sm-left');
      h1.style.color = heading.getAttribute('data-color') || '';
      h1.append(...heading.childNodes);
      contentWrapper.append(h1);
      moveInstrumentation(heading, h1);
    }

    const description = slideNode.querySelector('[data-aue-prop="description"]');
    if (description) {
      const descDiv = document.createElement('div');
      descDiv.classList.add('banner-koi-carousel-description');
      descDiv.style.color = description.getAttribute('data-desc-color') || '';
      descDiv.append(...description.childNodes);
      contentWrapper.append(descDiv);
      moveInstrumentation(description, descDiv);
    }

    const ctaLink = slideNode.querySelector('[data-aue-prop="ctaLink"]');
    if (ctaLink) {
      const link = document.createElement('a');
      link.href = ctaLink.href;
      link.target = ctaLink.target || '_self';
      link.classList.add('banner-koi-carousel-cta', 'banner-btn', 'banner-btn-primary', 'banner-btn-start-now');
      link.style.backgroundColor = ctaLink.getAttribute('data-bg-color') || '';
      link.textContent = ctaLink.textContent;
      if (link.target === '_blank') {
        const srOnlySpan = document.createElement('span');
        srOnlySpan.classList.add('banner-cmp-link__screen-reader-only');
        srOnlySpan.textContent = 'opens in a new tab';
        link.append(srOnlySpan);
      }
      contentWrapper.append(link);
      moveInstrumentation(ctaLink, link);
    }

    carouselItem.append(contentWrapper);
    carouselInner.append(carouselItem);
    moveInstrumentation(slideNode, carouselItem);
  });

  carouselDiv.append(olIndicators, carouselInner);

  const nextPrevBtnDiv = document.createElement('div');
  nextPrevBtnDiv.classList.add('banner-next-carousel-btn');

  const prevLink = document.createElement('a');
  prevLink.classList.add('banner-carousel-control-prev');
  prevLink.href = `#${carouselId}`;
  prevLink.setAttribute('role', 'button');
  prevLink.setAttribute('data-slide', 'prev');
  const prevSpanIcon = document.createElement('span');
  prevSpanIcon.classList.add('banner-carousel-control-prev-icon');
  prevSpanIcon.setAttribute('aria-hidden', 'true');
  const prevSrOnlySpan = document.createElement('span');
  prevSrOnlySpan.classList.add('banner-sr-only');
  prevSrOnlySpan.textContent = 'Previous';
  prevLink.append(prevSpanIcon, prevSrOnlySpan);

  const nextLink = document.createElement('a');
  nextLink.classList.add('banner-carousel-control-next');
  nextLink.href = `#${carouselId}`;
  nextLink.setAttribute('role', 'button');
  nextLink.setAttribute('data-slide', 'next');
  const nextSpanIcon = document.createElement('span');
  nextSpanIcon.classList.add('banner-carousel-control-next-icon');
  nextSpanIcon.setAttribute('aria-hidden', 'true');
  const nextSrOnlySpan = document.createElement('span');
  nextSrOnlySpan.classList.add('banner-sr-only');
  nextSrOnlySpan.textContent = 'Next';
  nextLink.append(nextSpanIcon, nextSrOnlySpan);

  nextPrevBtnDiv.append(prevLink, nextLink);
  carouselDiv.append(nextPrevBtnDiv);

  section.append(carouselDiv);

  block.textContent = '';
  block.append(section);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}