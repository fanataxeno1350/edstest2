import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselId = `carousel-${Math.random().toString(36).substring(2, 9)}`;

  const wrapper = document.createElement('div');
  wrapper.id = carouselId;
  wrapper.className = 'banner-bannerCarousel banner-carousel banner-slide';
  wrapper.setAttribute('data-ride', 'carousel');

  const olIndicators = document.createElement('ol');
  olIndicators.className = 'banner-carousel-indicators';
  moveInstrumentation(block.querySelector('.banner-carousel-indicators'), olIndicators);

  const carouselInner = document.createElement('div');
  carouselInner.className = 'banner-carousel-inner';

  const slides = block.querySelectorAll('[data-aue-model="bannerSlide"]');

  slides.forEach((slide, index) => {
    const liIndicator = document.createElement('li');
    liIndicator.setAttribute('data-target', `#${carouselId}`);
    liIndicator.setAttribute('data-slide-to', index.toString());
    if (index === 0) {
      liIndicator.classList.add('banner-active');
    }
    olIndicators.append(liIndicator);
    moveInstrumentation(block.querySelector(`.banner-carousel-indicators li:nth-child(${index + 1})`), liIndicator);

    const carouselItem = document.createElement('div');
    carouselItem.className = 'banner-carousel-item';
    if (index === 0) {
      carouselItem.classList.add('banner-active');
    }

    const desktopImage = slide.querySelector('[data-aue-prop="desktopImage"]');
    if (desktopImage) {
      const picture = createOptimizedPicture(desktopImage.src, desktopImage.alt, index === 0, [{ media: '(min-width: 600px)', width: '2000' }, { width: '750' }]);
      picture.querySelector('img').className = 'banner-d-none banner-d-sm-block banner-w-100 banner-desktop-image';
      carouselItem.append(picture);
      moveInstrumentation(desktopImage, picture);
    }

    const mobileImage = slide.querySelector('[data-aue-prop="mobileImage"]');
    if (mobileImage) {
      const picture = createOptimizedPicture(mobileImage.src, mobileImage.alt, index === 0, [{ width: '750' }]);
      picture.querySelector('img').className = 'banner-d-block banner-d-sm-none banner-w-100 banner-mobile-image';
      carouselItem.append(picture);
      moveInstrumentation(mobileImage, picture);
    }

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'banner-content-wrapper banner-position-absolute';

    const heading = slide.querySelector('[data-aue-prop="heading"]');
    if (heading) {
      const h1 = document.createElement('h1');
      h1.className = 'banner-koi-carousel-heading banner-text-sm-left';
      h1.style.color = heading.dataset.color || '';
      h1.append(...heading.childNodes);
      contentWrapper.append(h1);
      moveInstrumentation(heading, h1);
    }

    const descriptionContainer = document.createElement('div');
    descriptionContainer.className = 'banner-koi-carousel-description';
    const description = slide.querySelector('[data-aue-prop="description"]');
    if (description) {
      descriptionContainer.style.color = description.dataset.descColor || '';
      descriptionContainer.append(...description.childNodes);
      contentWrapper.append(descriptionContainer);
      moveInstrumentation(description, descriptionContainer);
    }

    const ctaLink = slide.querySelector('[data-aue-prop="ctaLink"]');
    if (ctaLink) {
      const link = document.createElement('a');
      link.href = ctaLink.href;
      link.target = ctaLink.target || '_self';
      link.className = 'banner-koi-carousel-cta banner-btn banner-btn-primary banner-btn-start-now';
      link.style.backgroundColor = ctaLink.dataset.bgColor || '';
      link.textContent = ctaLink.textContent;
      if (link.target === '_blank') {
        const srOnlySpan = document.createElement('span');
        srOnlySpan.className = 'banner-cmp-link__screen-reader-only';
        srOnlySpan.textContent = 'opens in a new tab';
        link.append(srOnlySpan);
      }
      contentWrapper.append(link);
      moveInstrumentation(ctaLink, link);
    }

    carouselItem.append(contentWrapper);
    carouselInner.append(carouselItem);
    moveInstrumentation(slide, carouselItem);
  });

  wrapper.append(olIndicators);
  wrapper.append(carouselInner);

  const nextPrevBtnDiv = document.createElement('div');
  nextPrevBtnDiv.className = 'banner-next-carousel-btn';

  const prevLink = document.createElement('a');
  prevLink.className = 'banner-carousel-control-prev';
  prevLink.href = `#${carouselId}`;
  prevLink.setAttribute('role', 'button');
  prevLink.setAttribute('data-slide', 'prev');
  prevLink.innerHTML = '<span class="banner-carousel-control-prev-icon" aria-hidden="true"></span><span class="banner-sr-only">Previous</span>';
  nextPrevBtnDiv.append(prevLink);
  moveInstrumentation(block.querySelector('.banner-carousel-control-prev'), prevLink);

  const nextLink = document.createElement('a');
  nextLink.className = 'banner-carousel-control-next';
  nextLink.href = `#${carouselId}`;
  nextLink.setAttribute('role', 'button');
  nextLink.setAttribute('data-slide', 'next');
  nextLink.innerHTML = '<span class="banner-carousel-control-next-icon" aria-hidden="true"></span><span class="banner-sr-only">Next</span>';
  nextPrevBtnDiv.append(nextLink);
  moveInstrumentation(block.querySelector('.banner-carousel-control-next'), nextLink);

  wrapper.append(nextPrevBtnDiv);

  block.textContent = '';
  block.append(wrapper);
  block.className = 'banner-carousel block';
  block.dataset.blockStatus = 'loaded';
}