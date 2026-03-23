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

  const olIndicators = document.createElement('ol');
  olIndicators.className = 'banner-carousel-indicators';

  const carouselInner = document.createElement('div');
  carouselInner.className = 'banner-carousel-inner';

  const carouselItems = block.querySelectorAll('[data-aue-model="bannerCarouselItem"]');

  carouselItems.forEach((itemNode, index) => {
    const li = document.createElement('li');
    li.setAttribute('data-target', `#${carouselId}`);
    li.setAttribute('data-slide-to', index.toString());
    if (index === 0) {
      li.classList.add('banner-active');
    }
    olIndicators.append(li);
    moveInstrumentation(itemNode, li);

    const carouselItemDiv = document.createElement('div');
    carouselItemDiv.className = `banner-carousel-item${index === 0 ? ' banner-active' : ''}`;

    const desktopImage = itemNode.querySelector('[data-aue-prop="desktopImage"]');
    if (desktopImage) {
      const picture = createOptimizedPicture(desktopImage.src, desktopImage.alt, index === 0, [{ media: '(min-width: 576px)', width: '2000' }]);
      picture.querySelector('img').className = 'banner-d-none banner-d-sm-block banner-w-100 banner-desktop-image';
      carouselItemDiv.append(picture);
      moveInstrumentation(desktopImage, picture);
    }

    const mobileImage = itemNode.querySelector('[data-aue-prop="mobileImage"]');
    if (mobileImage) {
      const picture = createOptimizedPicture(mobileImage.src, mobileImage.alt, index === 0, [{ width: '768' }]);
      picture.querySelector('img').className = 'banner-d-block banner-d-sm-none banner-w-100 banner-mobile-image';
      carouselItemDiv.append(picture);
      moveInstrumentation(mobileImage, picture);
    }

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'banner-content-wrapper banner-position-absolute';

    const heading = itemNode.querySelector('[data-aue-prop="heading"]');
    if (heading) {
      const h1 = document.createElement('h1');
      h1.className = 'banner-koi-carousel-heading banner-text-sm-left';
      const color = heading.getAttribute('data-color') || '#3c2904';
      h1.style.color = color;
      h1.append(heading);
      contentWrapper.append(h1);
      moveInstrumentation(heading, h1);
    }

    const description = itemNode.querySelector('[data-aue-prop="description"]');
    if (description) {
      const descriptionDiv = document.createElement('div');
      descriptionDiv.className = 'banner-koi-carousel-description';
      const descColor = description.getAttribute('data-desc-color') || '#3c2904';
      descriptionDiv.style.color = descColor;
      descriptionDiv.append(description);
      contentWrapper.append(descriptionDiv);
      moveInstrumentation(description, descriptionDiv);
    }

    const ctaLink = itemNode.querySelector('[data-aue-prop="ctaLink"]');
    if (ctaLink) {
      const link = ctaLink.querySelector('a') || ctaLink;
      link.className = 'banner-koi-carousel-cta banner-btn banner-btn-primary banner-btn-start-now';
      const bgColor = link.getAttribute('data-bg-color') || '#6c3003';
      link.style.backgroundColor = bgColor;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const span = document.createElement('span');
      span.className = 'banner-cmp-link__screen-reader-only';
      span.textContent = 'opens in a new tab';
      link.append(span);
      contentWrapper.append(link);
      moveInstrumentation(ctaLink, link);
    }

    carouselItemDiv.append(contentWrapper);
    carouselInner.append(carouselItemDiv);
    moveInstrumentation(itemNode, carouselItemDiv);
  });

  carouselDiv.append(olIndicators);
  carouselDiv.append(carouselInner);

  const nextPrevButtons = document.createElement('div');
  nextPrevButtons.className = 'banner-next-carousel-btn';

  const prevButton = document.createElement('a');
  prevButton.className = 'banner-carousel-control-prev';
  prevButton.href = `#${carouselId}`;
  prevButton.setAttribute('role', 'button');
  prevButton.setAttribute('data-slide', 'prev');
  const prevSpanIcon = document.createElement('span');
  prevSpanIcon.className = 'banner-carousel-control-prev-icon';
  prevSpanIcon.setAttribute('aria-hidden', 'true');
  const prevSpanSrOnly = document.createElement('span');
  prevSpanSrOnly.className = 'banner-sr-only';
  prevSpanSrOnly.textContent = 'Previous';
  prevButton.append(prevSpanIcon, prevSpanSrOnly);

  const nextButton = document.createElement('a');
  nextButton.className = 'banner-carousel-control-next';
  nextButton.href = `#${carouselId}`;
  nextButton.setAttribute('role', 'button');
  nextButton.setAttribute('data-slide', 'next');
  const nextSpanIcon = document.createElement('span');
  nextSpanIcon.className = 'banner-carousel-control-next-icon';
  nextSpanIcon.setAttribute('aria-hidden', 'true');
  const nextSpanSrOnly = document.createElement('span');
  nextSpanSrOnly.className = 'banner-sr-only';
  nextSpanSrOnly.textContent = 'Next';
  nextButton.append(nextSpanIcon, nextSpanSrOnly);

  nextPrevButtons.append(prevButton, nextButton);
  carouselDiv.append(nextPrevButtons);

  section.append(carouselDiv);

  block.textContent = '';
  block.append(section);
  block.className = `banner-carousel block`;
  block.dataset.blockStatus = 'loaded';
}