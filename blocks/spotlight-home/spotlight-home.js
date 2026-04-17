import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const spotlightHomeWrap = document.createElement('section');
  spotlightHomeWrap.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');
  moveInstrumentation(block, spotlightHomeWrap);

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  spotlightHomeWrap.appendChild(beamSlider);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  beamSlider.appendChild(swiperWrapper);

  const quickLinksContainer = document.createElement('div');
  quickLinksContainer.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');
  spotlightHomeWrap.appendChild(quickLinksContainer);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  quickLinksContainer.appendChild(containerDiv);

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');
  containerDiv.appendChild(quickLinksUl);

  const slides = [];
  const quickLinks = [];

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length === 7) { // Spotlight Slide item
      slides.push(cells);
    } else if (cells.length === 2) { // Quick Link Item
      quickLinks.push(cells);
    }
  });

  slides.forEach((slideCells) => {
    const [imageCell, imageAltCell, headlineCell, subheadlineCell, descriptionCell, buttonLinkCell, buttonLabelCell] = slideCells;

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    moveInstrumentation(imageCell.parentElement, swiperSlide); // Move instrumentation from the original row

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, imageAltCell.textContent.trim(), false, [{ width: '1903' }]);
        moveInstrumentation(picture, optimizedPic.querySelector('img'));
        slideBgImg.appendChild(optimizedPic);
      }
    }
    swiperSlide.appendChild(slideBgImg);

    const mobContent = document.createElement('div');
    mobContent.classList.add('mob-content-home-spotlight');
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');

    const headline = document.createElement('h1');
    headline.classList.add('heading', 'font-medium', 'font-size-tb', 'banner-text-dark');
    headline.textContent = headlineCell.textContent.trim();
    contentDiv.appendChild(headline);

    if (subheadlineCell.textContent.trim()) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold';
      small.textContent = subheadlineCell.textContent.trim();
      contentDiv.prepend(small); // Prepend to appear before headline
    }

    if (descriptionCell.textContent.trim()) {
      const p = document.createElement('p');
      p.innerHTML = descriptionCell.textContent.trim();
      contentDiv.appendChild(p);
    }

    const buttonLink = buttonLinkCell.querySelector('a');
    if (buttonLink && buttonLabelCell.textContent.trim()) {
      const btn = document.createElement('a');
      btn.classList.add('btn', 'btn-primary');
      btn.href = buttonLink.href;
      btn.textContent = buttonLabelCell.textContent.trim();
      contentDiv.appendChild(btn);
    }

    mobContent.appendChild(contentDiv);
    swiperSlide.appendChild(mobContent);
    swiperWrapper.appendChild(swiperSlide);
  });

  quickLinks.forEach((linkCells) => {
    const [labelCell, linkCell] = linkCells;
    const li = document.createElement('li');
    moveInstrumentation(labelCell.parentElement, li); // Move instrumentation from the original row

    const link = linkCell.querySelector('a');
    if (link) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = labelCell.textContent.trim();
      anchor.classList.add('with-full-underline');
      li.appendChild(anchor);
    }
    quickLinksUl.appendChild(li);
  });

  // Swiper navigation and pagination
  const prevButton = document.createElement('div');
  prevButton.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevButton.setAttribute('tabindex', '0');
  prevButton.setAttribute('role', 'button');
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.innerHTML = '<img alt="svg file" src="/icons/arrow-left.svg"/>'; // Using a generic icon path
  beamSlider.appendChild(prevButton);

  const nextButton = document.createElement('div');
  nextButton.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextButton.setAttribute('tabindex', '0');
  nextButton.setAttribute('role', 'button');
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.innerHTML = '<img alt="svg file" src="/icons/arrow-right.svg"/>'; // Using a generic icon path
  beamSlider.appendChild(nextButton);

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.appendChild(pagination);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  beamSlider.appendChild(swiperNotification);

  block.replaceWith(spotlightHomeWrap);

  // Initialize Swiper (assuming Swiper is loaded globally or via dynamic import)
  if (typeof Swiper !== 'undefined') {
    // eslint-disable-next-line no-new
    new Swiper(beamSlider, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 0,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  } else {
    // eslint-disable-next-line no-console
    console.warn('Swiper library not found. Spotlight Home slider will not be interactive.');
  }
}
