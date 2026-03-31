import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('itc-carousel-section');

  const carouselWrapper = document.createElement('div');
  carouselWrapper.id = 'carouselExampleSlidesOnly';
  carouselWrapper.classList.add('bannerCarousel', 'carousel', 'slide');
  carouselWrapper.setAttribute('data-ride', 'carousel');

  const carouselIndicators = document.createElement('ol');
  carouselIndicators.classList.add('carousel-indicators');

  const carouselInner = document.createElement('div');
  carouselInner.classList.add('carousel-inner');

  const itemRows = [...block.children].slice(1); // Skip the first row which is just a label

  itemRows.forEach((row, index) => {
    const [
      desktopImageCell,
      mobileImageCell,
      desktopImageAltCell,
      mobileImageAltCell,
      headingCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = row.children;

    // Carousel indicator
    const indicator = document.createElement('li');
    indicator.setAttribute('data-target', '#carouselExampleSlidesOnly');
    indicator.setAttribute('data-slide-to', index);
    if (index === 0) {
      indicator.classList.add('active');
    }
    carouselIndicators.append(indicator);

    // Carousel item
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    if (index === 0) {
      carouselItem.classList.add('active');
    }
    moveInstrumentation(row, carouselItem);

    // Desktop Image
    const desktopPicture = desktopImageCell.querySelector('picture');
    const desktopImg = desktopPicture ? desktopPicture.querySelector('img') : null;
    if (desktopImg) {
      const optimizedDesktopPic = createOptimizedPicture(
        desktopImg.src,
        desktopImageAltCell.textContent.trim(),
        index === 0, // Eager load first image
        [{ width: '2000' }],
      );
      optimizedDesktopPic.querySelector('img').classList.add('d-none', 'd-sm-block', 'w-100', 'desktop-image');
      if (index === 0) {
        optimizedDesktopPic.querySelector('img').setAttribute('fetchpriority', 'high');
      } else {
        optimizedDesktopPic.querySelector('img').setAttribute('loading', 'lazy');
        optimizedDesktopPic.querySelector('img').setAttribute('fetchpriority', 'low');
      }
      carouselItem.append(optimizedDesktopPic);
    }

    // Mobile Image
    const mobilePicture = mobileImageCell.querySelector('picture');
    const mobileImg = mobilePicture ? mobilePicture.querySelector('img') : null;
    if (mobileImg) {
      const optimizedMobilePic = createOptimizedPicture(
        mobileImg.src,
        mobileImageAltCell.textContent.trim(),
        index === 0, // Eager load first image
        [{ width: '750' }],
      );
      optimizedMobilePic.querySelector('img').classList.add('d-block', 'd-sm-none', 'w-100', 'mobile-image');
      if (index === 0) {
        optimizedMobilePic.querySelector('img').setAttribute('fetchpriority', 'high');
      } else {
        optimizedMobilePic.querySelector('img').setAttribute('loading', 'lazy');
        optimizedMobilePic.querySelector('img').setAttribute('fetchpriority', 'low');
      }
      carouselItem.append(optimizedMobilePic);
    }

    // Banner Content Wrapper
    const bannerContentWrapper = document.createElement('div');
    bannerContentWrapper.classList.add('banner-content-wrapper', 'position-absolute');

    // Heading
    const heading = document.createElement('h1');
    heading.classList.add('koi-carousel-heading', 'text-sm-left');
    moveInstrumentation(headingCell, heading);
    heading.textContent = headingCell.textContent.trim();
    bannerContentWrapper.append(heading);

    // Description
    const description = document.createElement('div');
    description.classList.add('koi-carousel-description');
    moveInstrumentation(descriptionCell, description);
    while (descriptionCell.firstChild) {
      description.append(descriptionCell.firstChild);
    }
    bannerContentWrapper.append(description);

    // CTA Link
    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink) {
      const ctaButton = document.createElement('a');
      ctaButton.href = ctaLink.href;
      ctaButton.classList.add('koi-carousel-cta', 'btn', 'btn-primary', 'btn-start-now');
      ctaButton.alt = ctaLabelCell.textContent.trim();
      ctaButton.textContent = ctaLabelCell.textContent.trim();
      moveInstrumentation(ctaLinkCell, ctaButton);

      // Add screen reader only span if target is _blank
      if (ctaLink.target === '_blank') {
        ctaButton.target = '_blank';
        const srOnlySpan = document.createElement('span');
        srOnlySpan.classList.add('cmp-link__screen-reader-only');
        srOnlySpan.textContent = 'opens in a new tab';
        ctaButton.append(srOnlySpan);
      }
      bannerContentWrapper.append(ctaButton);
    }

    carouselItem.append(bannerContentWrapper);
    carouselInner.append(carouselItem);
  });

  carouselWrapper.append(carouselIndicators);
  carouselWrapper.append(carouselInner);

  // Next and previous buttons
  const prevButton = document.createElement('a');
  prevButton.classList.add('carousel-control-prev');
  prevButton.href = '#carouselExampleSlidesOnly';
  prevButton.setAttribute('role', 'button');
  prevButton.setAttribute('data-slide', 'prev'); // Bootstrap data-slide attribute
  prevButton.setAttribute('aria-label', 'Previous'); // Add aria-label for accessibility
  prevButton.addEventListener('click', (e) => {
    e.preventDefault();
    // Simulate Bootstrap carousel behavior for 'prev'
    const activeItem = carouselInner.querySelector('.carousel-item.active');
    const activeIndicator = carouselIndicators.querySelector('.active');

    let prevItem = activeItem.previousElementSibling;
    let prevIndicator = activeIndicator.previousElementSibling;

    if (!prevItem) {
      prevItem = carouselInner.lastElementChild;
    }
    if (!prevIndicator) {
      prevIndicator = carouselIndicators.lastElementChild;
    }

    activeItem.classList.remove('active');
    prevItem.classList.add('active');
    activeIndicator.classList.remove('active');
    prevIndicator.classList.add('active');
    stopSlideShow(); // Stop on manual interaction
    startSlideShow(); // Restart after manual interaction
  });

  const prevIcon = document.createElement('span');
  prevIcon.classList.add('carousel-control-prev-icon');
  prevIcon.setAttribute('aria-hidden', 'true');
  prevButton.append(prevIcon);
  const prevSrOnly = document.createElement('span');
  prevSrOnly.classList.add('sr-only');
  prevSrOnly.textContent = 'Previous';
  prevButton.append(prevSrOnly);
  carouselWrapper.append(prevButton); // Append directly to carouselWrapper

  const nextButton = document.createElement('a');
  nextButton.classList.add('carousel-control-next');
  nextButton.href = '#carouselExampleSlidesOnly';
  nextButton.setAttribute('role', 'button');
  nextButton.setAttribute('data-slide', 'next'); // Bootstrap data-slide attribute
  nextButton.setAttribute('aria-label', 'Next'); // Add aria-label for accessibility
  nextButton.addEventListener('click', (e) => {
    e.preventDefault();
    // Simulate Bootstrap carousel behavior for 'next'
    const activeItem = carouselInner.querySelector('.carousel-item.active');
    const activeIndicator = carouselIndicators.querySelector('.active');

    let nextItem = activeItem.nextElementSibling;
    let nextIndicator = activeIndicator.nextElementSibling;

    if (!nextItem) {
      nextItem = carouselInner.firstElementChild;
    }
    if (!nextIndicator) {
      nextIndicator = carouselIndicators.firstElementChild;
    }

    activeItem.classList.remove('active');
    nextItem.classList.add('active');
    activeIndicator.classList.remove('active');
    nextIndicator.classList.add('active');
    stopSlideShow(); // Stop on manual interaction
    startSlideShow(); // Restart after manual interaction
  });

  const nextIcon = document.createElement('span');
  nextIcon.classList.add('carousel-control-next-icon');
  nextIcon.setAttribute('aria-hidden', 'true');
  nextButton.append(nextIcon);
  const nextSrOnly = document.createElement('span');
  nextSrOnly.classList.add('sr-only');
  nextSrOnly.textContent = 'Next';
  nextButton.append(nextSrOnly);
  carouselWrapper.append(nextButton); // Append directly to carouselWrapper

  section.append(carouselWrapper);
  block.textContent = '';
  block.append(section);

  // Auto-slide functionality (mimicking data-ride="carousel")
  let slideInterval;
  const startSlideShow = () => {
    stopSlideShow(); // Ensure only one interval is running
    slideInterval = setInterval(() => {
      const activeItem = carouselInner.querySelector('.carousel-item.active');
      const nextItem = activeItem.nextElementSibling || carouselInner.firstElementChild;
      if (nextItem) {
        activeItem.classList.remove('active');
        nextItem.classList.add('active');
        const activeIndicator = carouselIndicators.querySelector('.active');
        const nextIndicator = activeIndicator.nextElementSibling || carouselIndicators.firstElementChild;
        if (activeIndicator) activeIndicator.classList.remove('active');
        if (nextIndicator) nextIndicator.classList.add('active');
      }
    }, 5000); // Default carousel interval is 5 seconds
  };

  const stopSlideShow = () => {
    clearInterval(slideInterval);
  };

  // Start slideshow on load
  startSlideShow();

  // Pause slideshow on hover
  carouselWrapper.addEventListener('mouseenter', stopSlideShow);
  carouselWrapper.addEventListener('mouseleave', startSlideShow);

  // Handle indicator clicks
  carouselIndicators.querySelectorAll('li').forEach((indicator, idx) => {
    indicator.addEventListener('click', () => {
      stopSlideShow();
      carouselIndicators.querySelector('.active')?.classList.remove('active');
      carouselInner.querySelector('.carousel-item.active')?.classList.remove('active');

      indicator.classList.add('active');
      carouselInner.children[idx].classList.add('active');
      startSlideShow();
    });
  });
}
