import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselId = 'carouselExampleSlidesOnly';

  const section = document.createElement('section');
  section.className = 'banner-itc-carousel-section';

  const carouselDiv = document.createElement('div');
  carouselDiv.id = carouselId;
  carouselDiv.className = 'banner-bannerCarousel banner-carousel banner-slide';
  carouselDiv.setAttribute('data-ride', 'carousel');

  const carouselIndicators = document.createElement('ol');
  carouselIndicators.className = 'banner-carousel-indicators';

  const carouselInner = document.createElement('div');
  carouselInner.className = 'banner-carousel-inner';

  const carouselItems = block.querySelectorAll('[data-aue-model="bannerCarouselItem"]');

  carouselItems.forEach((itemNode, index) => {
    const carouselItemDiv = document.createElement('div');
    carouselItemDiv.className = `banner-carousel-item${index === 0 ? ' banner-active' : ''}`;

    const indicatorLi = document.createElement('li');
    indicatorLi.setAttribute('data-target', `#${carouselId}`);
    indicatorLi.setAttribute('data-slide-to', index);
    if (index === 0) {
      indicatorLi.className = 'banner-active';
    }
    carouselIndicators.append(indicatorLi);
    moveInstrumentation(itemNode, indicatorLi);

    const desktopImage = itemNode.querySelector('[data-aue-prop="desktopImage"]');
    if (desktopImage) {
      const picture = createOptimizedPicture(desktopImage.src, desktopImage.alt);
      picture.querySelector('img').className = 'banner-d-none banner-d-sm-block banner-w-100 banner-desktop-image';
      picture.querySelector('img').setAttribute('loading', index === 0 ? 'eager' : 'lazy');
      picture.querySelector('img').setAttribute('fetchpriority', index === 0 ? 'high' : 'low');
      carouselItemDiv.append(picture);
      moveInstrumentation(desktopImage, picture);
    }

    const mobileImage = itemNode.querySelector('[data-aue-prop="mobileImage"]');
    if (mobileImage) {
      const picture = createOptimizedPicture(mobileImage.src, mobileImage.alt);
      picture.querySelector('img').className = 'banner-d-block banner-d-sm-none banner-w-100 banner-mobile-image';
      picture.querySelector('img').setAttribute('loading', index === 0 ? 'eager' : 'lazy');
      picture.querySelector('img').setAttribute('fetchpriority', index === 0 ? 'high' : 'low');
      carouselItemDiv.append(picture);
      moveInstrumentation(mobileImage, picture);
    }

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'banner-content-wrapper banner-position-absolute';

    const heading = itemNode.querySelector('[data-aue-prop="heading"]');
    if (heading) {
      const h1 = document.createElement('h1');
      h1.className = 'banner-koi-carousel-heading banner-text-sm-left';
      h1.setAttribute('data-color', heading.getAttribute('data-color') || '');
      h1.style.color = heading.style.color;
      h1.append(...heading.childNodes);
      contentWrapper.append(h1);
      moveInstrumentation(heading, h1);
    }

    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.className = 'banner-koi-carousel-description';
    const description = itemNode.querySelector('[data-aue-prop="description"]');
    if (description) {
      descriptionWrapper.setAttribute('data-desc-color', description.getAttribute('data-desc-color') || '');
      descriptionWrapper.append(...description.childNodes);
      contentWrapper.append(descriptionWrapper);
      moveInstrumentation(description, descriptionWrapper);
    }

    const ctaLink = itemNode.querySelector('[data-aue-prop="ctaLink"]');
    if (ctaLink) {
      const link = document.createElement('a');
      link.href = ctaLink.href;
      link.className = 'banner-koi-carousel-cta banner-btn banner-btn-primary banner-btn-start-now';
      link.setAttribute('data-cmp-clickable', '');
      link.setAttribute('data-cmp-data-layer', ctaLink.getAttribute('data-cmp-data-layer') || '');
      link.setAttribute('data-bg-color', ctaLink.getAttribute('data-bg-color') || '');
      link.style.backgroundColor = ctaLink.style.backgroundColor;
      link.alt = ctaLink.alt;
      link.target = ctaLink.target;
      link.textContent = ctaLink.textContent;
      contentWrapper.append(link);
      moveInstrumentation(ctaLink, link);
    }

    carouselItemDiv.append(contentWrapper);
    carouselInner.append(carouselItemDiv);
    moveInstrumentation(itemNode, carouselItemDiv);
  });

  carouselDiv.append(carouselIndicators);
  carouselDiv.append(carouselInner);

  const nextPrevButtons = document.createElement('div');
  nextPrevButtons.className = 'banner-next-carousel-btn';

  const prevLink = document.createElement('a');
  prevLink.className = 'banner-carousel-control-prev';
  prevLink.href = `#${carouselId}`;
  prevLink.setAttribute('role', 'button');
  prevLink.setAttribute('data-slide', 'prev');
  prevLink.innerHTML = '<span class="banner-carousel-control-prev-icon" aria-hidden="true"></span><span class="banner-sr-only">Previous</span>';
  nextPrevButtons.append(prevLink);

  const nextLink = document.createElement('a');
  nextLink.className = 'banner-carousel-control-next';
  nextLink.href = `#${carouselId}`;
  nextLink.setAttribute('role', 'button');
  nextLink.setAttribute('data-slide', 'next');
  nextLink.innerHTML = '<span class="banner-carousel-control-next-icon" aria-hidden="true"></span><span class="banner-sr-only">Next</span>';
  nextPrevButtons.append(nextLink);

  carouselDiv.append(nextPrevButtons);

  section.append(carouselDiv);

  block.textContent = '';
  block.append(section);
  block.className = `banner-carousel block`;
  block.dataset.blockStatus = 'loaded';
}