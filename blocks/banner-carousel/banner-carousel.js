import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('itc-carousel-section');

  const carouselId = `carouselExampleSlidesOnly`; // Hardcoded ID from original HTML
  const carousel = document.createElement('div');
  carousel.id = carouselId;
  carousel.classList.add('bannerCarousel', 'carousel', 'slide');
  // data-ride="carousel" is inert in EDS, handled by JS below

  const carouselIndicators = document.createElement('ol');
  carouselIndicators.classList.add('carousel-indicators');

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('carousel-inner');

  // Skip the first row which is just the container label
  const bannerRows = [...block.children].slice(1);

  bannerRows.forEach((row, index) => {
    const [desktopImageCell, mobileImageCell, headingCell, descriptionCell, ctaLinkCell] = [...row.children];

    // Indicators
    const indicator = document.createElement('li');
    indicator.setAttribute('data-target', `#${carouselId}`);
    indicator.setAttribute('data-slide-to', index.toString());
    if (index === 0) {
      indicator.classList.add('active');
    }
    carouselIndicators.append(indicator);

    // Carousel Item
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    if (index === 0) {
      carouselItem.classList.add('active');
    }
    moveInstrumentation(row, carouselItem); // Move instrumentation from the original row

    // Desktop Image
    const desktopPicture = desktopImageCell.querySelector('picture');
    if (desktopPicture) {
      const desktopImg = desktopPicture.querySelector('img');
      const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, index === 0, [{ width: '2000' }]);
      const newDesktopImg = optimizedDesktopPic.querySelector('img');
      newDesktopImg.classList.add('d-none', 'd-sm-block', 'w-100', 'desktop-image');
      // Copy loading and fetchpriority attributes if they exist in the original HTML pattern
      if (index === 0) {
        newDesktopImg.setAttribute('loading', 'eager');
        newDesktopImg.setAttribute('fetchpriority', 'high');
      } else {
        newDesktopImg.setAttribute('loading', 'lazy');
        newDesktopImg.setAttribute('fetchpriority', 'low');
      }
      moveInstrumentation(desktopImg, newDesktopImg);
      carouselItem.append(optimizedDesktopPic);
    }

    // Mobile Image
    const mobilePicture = mobileImageCell.querySelector('picture');
    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, index === 0, [{ width: '750' }]);
      const newMobileImg = optimizedMobilePic.querySelector('img');
      newMobileImg.classList.add('d-block', 'd-sm-none', 'w-100', 'mobile-image');
      // Copy loading and fetchpriority attributes if they exist in the original HTML pattern
      if (index === 0) {
        newMobileImg.setAttribute('loading', 'eager');
        newMobileImg.setAttribute('fetchpriority', 'high');
      } else {
        newMobileImg.setAttribute('loading', 'lazy');
        newMobileImg.setAttribute('fetchpriority', 'low');
      }
      moveInstrumentation(mobileImg, newMobileImg);
      carouselItem.append(optimizedMobilePic);
    }

    const bannerContentWrapper = document.createElement('div');
    bannerContentWrapper.classList.add('banner-content-wrapper', 'position-absolute');

    // Heading
    const heading = document.createElement('h1');
    heading.classList.add('koi-carousel-heading', 'text-sm-left');
    moveInstrumentation(headingCell, heading);
    while (headingCell.firstChild) heading.append(headingCell.firstChild);
    bannerContentWrapper.append(heading);

    // Description
    const description = document.createElement('div');
    description.classList.add('koi-carousel-description');
    moveInstrumentation(descriptionCell, description);
    while (descriptionCell.firstChild) description.append(descriptionCell.firstChild);
    bannerContentWrapper.append(description);

    // CTA Link
    const ctaLinkFound = ctaLinkCell.querySelector('a');
    if (ctaLinkFound) {
      const ctaLink = document.createElement('a');
      ctaLink.href = ctaLinkFound.href;
      ctaLink.classList.add('koi-carousel-cta', 'btn', 'btn-primary', 'btn-start-now');
      ctaLink.setAttribute('alt', ctaLinkFound.textContent); // Use text content as alt
      ctaLink.setAttribute('target', '_blank'); // Assuming all CTA links open in new tab
      moveInstrumentation(ctaLinkCell, ctaLink);
      // Move all child nodes (including text) from ctaLinkCell to ctaLink
      while (ctaLinkCell.firstChild) ctaLink.append(ctaLinkCell.firstChild);
      const srOnlySpan = document.createElement('span');
      srOnlySpan.classList.add('sr-only'); // Corrected class name from allowlist
      srOnlySpan.textContent = 'opens in a new tab';
      ctaLink.append(srOnlySpan);
      bannerContentWrapper.append(ctaLink);
    }

    carouselItem.append(bannerContentWrapper);
    carouselInner.append(carouselItem);
  });

  carousel.append(carouselIndicators, carouselInner);

  // Next and previous buttons
  const nextCarouselBtn = document.createElement('div');
  nextCarouselBtn.classList.add('next-carousel-btn');

  const prevButton = document.createElement('a');
  prevButton.classList.add('carousel-control-prev');
  prevButton.href = `#${carouselId}`;
  prevButton.setAttribute('role', 'button');
  // data-slide="prev" is inert, handled by JS below
  const prevIcon = document.createElement('span');
  prevIcon.classList.add('carousel-control-prev-icon');
  prevIcon.setAttribute('aria-hidden', 'true');
  const prevSrOnly = document.createElement('span');
  prevSrOnly.classList.add('sr-only');
  prevSrOnly.textContent = 'Previous';
  prevButton.append(prevIcon, prevSrOnly);

  const nextButton = document.createElement('a');
  nextButton.classList.add('carousel-control-next');
  nextButton.href = `#${carouselId}`;
  nextButton.setAttribute('role', 'button');
  // data-slide="next" is inert, handled by JS below
  const nextIcon = document.createElement('span');
  nextIcon.classList.add('carousel-control-next-icon');
  nextIcon.setAttribute('aria-hidden', 'true');
  const nextSrOnly = document.createElement('span');
  nextSrOnly.classList.add('sr-only');
  nextSrOnly.textContent = 'Next';
  nextButton.append(nextIcon, nextSrOnly);

  nextCarouselBtn.append(prevButton, nextButton);
  carousel.append(nextCarouselBtn);

  section.append(carousel);
  block.textContent = '';
  block.append(section);

  // Add carousel functionality
  let currentIndex = 0;
  const items = carouselInner.querySelectorAll('.carousel-item');
  const indicators = carouselIndicators.querySelectorAll('li');
  const totalItems = items.length;

  const showItem = (index) => {
    items.forEach((item, i) => {
      item.classList.remove('active');
      indicators[i].classList.remove('active');
      const desktopImg = item.querySelector('.desktop-image');
      const mobileImg = item.querySelector('.mobile-image');

      if (desktopImg) {
        if (i === index) {
          desktopImg.setAttribute('loading', 'eager');
          desktopImg.setAttribute('fetchpriority', 'high');
        } else {
          desktopImg.setAttribute('loading', 'lazy');
          desktopImg.setAttribute('fetchpriority', 'low');
        }
      }
      if (mobileImg) {
        if (i === index) {
          mobileImg.setAttribute('loading', 'eager');
          mobileImg.setAttribute('fetchpriority', 'high');
        } else {
          mobileImg.setAttribute('loading', 'lazy');
          mobileImg.setAttribute('fetchpriority', 'low');
        }
      }
    });
    items[index].classList.add('active');
    indicators[index].classList.add('active');
    currentIndex = index;
  };

  prevButton.addEventListener('click', (e) => {
    e.preventDefault();
    const newIndex = (currentIndex - 1 + totalItems) % totalItems;
    showItem(newIndex);
  });

  nextButton.addEventListener('click', (e) => {
    e.preventDefault();
    const newIndex = (currentIndex + 1) % totalItems;
    showItem(newIndex);
  });

  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', (e) => {
      e.preventDefault();
      showItem(index);
    });
  });
}
