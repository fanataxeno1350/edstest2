import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselId = 'carouselExampleSlidesOnly';

  const carouselWrapper = document.createElement('div');
  carouselWrapper.id = carouselId;
  carouselWrapper.classList.add('banner-carousel', 'banner-carousel', 'banner-slide');
  carouselWrapper.setAttribute('data-ride', 'carousel');

  const indicators = document.createElement('ol');
  indicators.classList.add('banner-carousel-indicators');

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('banner-carousel-inner');

  const items = block.querySelectorAll('[data-aue-model="bannerCarouselItem"]');
  items.forEach((itemNode, index) => {
    // Create indicator
    const indicator = document.createElement('li');
    indicator.setAttribute('data-target', `#${carouselId}`);
    indicator.setAttribute('data-slide-to', index.toString());
    if (index === 0) {
      indicator.classList.add('banner-active');
    }
    indicators.append(indicator);
    moveInstrumentation(itemNode, indicator);

    // Create carousel item
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('banner-carousel-item');
    if (index === 0) {
      carouselItem.classList.add('banner-active');
    }

    const desktopImage = itemNode.querySelector('[data-aue-prop="desktopImage"]');
    if (desktopImage) {
      const picture = createOptimizedPicture(desktopImage.src, desktopImage.alt, index === 0, [{ media: '(min-width: 600px)', width: '2000' }, { width: '750' }]);
      picture.querySelector('img').classList.add('banner-d-none', 'banner-d-sm-block', 'banner-w-100', 'banner-desktop-image');
      picture.querySelector('img').setAttribute('loading', index === 0 ? 'eager' : 'lazy');
      picture.querySelector('img').setAttribute('fetchpriority', index === 0 ? 'high' : 'low');
      carouselItem.append(picture);
      moveInstrumentation(desktopImage, picture);
    }

    const mobileImage = itemNode.querySelector('[data-aue-prop="mobileImage"]');
    if (mobileImage) {
      const picture = createOptimizedPicture(mobileImage.src, mobileImage.alt, index === 0, [{ width: '750' }]);
      picture.querySelector('img').classList.add('banner-d-block', 'banner-d-sm-none', 'banner-w-100', 'banner-mobile-image');
      picture.querySelector('img').setAttribute('loading', index === 0 ? 'eager' : 'lazy');
      picture.querySelector('img').setAttribute('fetchpriority', index === 0 ? 'high' : 'low');
      carouselItem.append(picture);
      moveInstrumentation(mobileImage, picture);
    }

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('banner-content-wrapper', 'banner-position-absolute');

    const heading = itemNode.querySelector('[data-aue-prop="heading"]');
    if (heading) {
      const h1 = document.createElement('h1');
      h1.classList.add('banner-koi-carousel-heading', 'banner-text-sm-left');
      const color = heading.dataset.color || '#3c2904';
      h1.style.color = color;
      h1.textContent = heading.textContent;
      contentWrapper.append(h1);
      moveInstrumentation(heading, h1);
    }

    const description = itemNode.querySelector('[data-aue-prop="description"]');
    if (description) {
      const descDiv = document.createElement('div');
      descDiv.classList.add('banner-koi-carousel-description');
      const descColor = description.dataset.descColor || '#3c2904';
      descDiv.innerHTML = description.innerHTML;
      descDiv.querySelectorAll('*').forEach(el => {
        if (!el.style.color) {
          el.style.color = descColor;
        }
      });
      contentWrapper.append(descDiv);
      moveInstrumentation(description, descDiv);
    }

    const ctaLink = itemNode.querySelector('[data-aue-prop="ctaLink"]');
    if (ctaLink) {
      const link = document.createElement('a');
      link.href = ctaLink.href;
      link.classList.add('banner-koi-carousel-cta', 'banner-btn', 'banner-btn-primary', 'banner-btn-start-now');
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      const bgColor = ctaLink.dataset.bgColor || '#6c3003';
      link.style.backgroundColor = bgColor;
      link.textContent = ctaLink.textContent;
      const srOnlySpan = document.createElement('span');
      srOnlySpan.classList.add('banner-cmp-link__screen-reader-only');
      srOnlySpan.textContent = 'opens in a new tab';
      link.append(srOnlySpan);
      contentWrapper.append(link);
      moveInstrumentation(ctaLink, link);
    }

    carouselItem.append(contentWrapper);
    carouselInner.append(carouselItem);
    moveInstrumentation(itemNode, carouselItem);
  });

  carouselWrapper.append(indicators, carouselInner);

  // Add navigation buttons
  const navButtonsDiv = document.createElement('div');
  navButtonsDiv.classList.add('banner-next-carousel-btn');

  const prevButton = document.createElement('a');
  prevButton.classList.add('banner-carousel-control-prev');
  prevButton.href = `#${carouselId}`;
  prevButton.setAttribute('role', 'button');
  prevButton.setAttribute('data-slide', 'prev');
  prevButton.innerHTML = '<span class="banner-carousel-control-prev-icon" aria-hidden="true"></span><span class="banner-sr-only">Previous</span>';

  const nextButton = document.createElement('a');
  nextButton.classList.add('banner-carousel-control-next');
  nextButton.href = `#${carouselId}`;
  nextButton.setAttribute('role', 'button');
  nextButton.setAttribute('data-slide', 'next');
  nextButton.innerHTML = '<span class="banner-carousel-control-next-icon" aria-hidden="true"></span><span class="banner-sr-only">Next</span>';

  navButtonsDiv.append(prevButton, nextButton);
  carouselWrapper.append(navButtonsDiv);

  block.textContent = '';
  block.append(carouselWrapper);
  block.classList.add('banner-itc-carousel-section');
  block.dataset.blockStatus = 'loaded';
}
