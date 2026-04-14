import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');
  moveInstrumentation(block, section);

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi', 'swiper-initialized', 'swiper-horizontal', 'swiper-watch-progress', 'swiper-backface-hidden');

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  swiperWrapper.setAttribute('id', `swiper-wrapper-${Math.random().toString(36).substring(2, 15)}`); // Unique ID for ARIA
  swiperWrapper.setAttribute('aria-live', 'off');

  const quickLinksContainer = document.createElement('div');
  quickLinksContainer.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'aos-init', 'aos-animate');
  containerDiv.setAttribute('data-aos', 'fade-up');
  containerDiv.setAttribute('data-aos-offset', '-100');
  containerDiv.setAttribute('data-aos-duration', '650');
  containerDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');

  let slideIndex = 0;

  // Extract prev/next button icons from the first two rows
  // block.children[0]: field="prevButtonIcon"
  const prevButtonIconRow = allRows[0];
  // block.children[1]: field="nextButtonIcon"
  const nextButtonIconRow = allRows[1];

  const prevButton = document.createElement('div');
  prevButton.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevButton.setAttribute('tabindex', '0');
  prevButton.setAttribute('role', 'button');
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.setAttribute('aria-controls', swiperWrapper.id);
  if (prevButtonIconRow) {
    const iconPic = prevButtonIconRow.querySelector('picture');
    if (iconPic) {
      const img = iconPic.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      prevButton.append(optimizedPic);
    }
  }

  const nextButton = document.createElement('div');
  nextButton.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextButton.setAttribute('tabindex', '0');
  nextButton.setAttribute('role', 'button');
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.setAttribute('aria-controls', swiperWrapper.id);
  if (nextButtonIconRow) {
    const iconPic = nextButtonIconRow.querySelector('picture');
    if (iconPic) {
      const img = iconPic.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '40' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      nextButton.append(optimizedPic);
    }
  }

  // Process rows starting from the third row (index 2)
  allRows.slice(2).forEach((row) => {
    moveInstrumentation(row, row); // Keep instrumentation on the original row for now
    const cells = [...row.children];

    // Spotlight Slide (6 cells: image, imageAlt, heading, subheading, description, ctaLink)
    if (cells.length === 6) {
      const slideDiv = document.createElement('div');
      slideDiv.classList.add('swiper-slide', 'nogradient');
      slideDiv.setAttribute('role', 'group');
      slideDiv.setAttribute('aria-label', `${slideIndex + 1} / X`); // X will be updated later
      slideDiv.setAttribute('data-swiper-slide-index', slideIndex.toString());

      const slideBgImg = document.createElement('div');
      slideBgImg.classList.add('slide-bgimg');

      // cell[0]: field="image"
      const imagePic = cells[0].querySelector('picture');
      // cell[1]: field="imageAlt"
      const imageAltText = cells[1].textContent.trim();
      // cell[2]: field="heading"
      const headingContent = cells[2].innerHTML;
      // cell[3]: field="subheading"
      const subheadingContent = cells[3].innerHTML;
      // cell[4]: field="description"
      const descriptionContent = cells[4].innerHTML;
      // cell[5]: field="ctaLink"
      const ctaLinkElement = cells[5].querySelector('a');

      if (imagePic) {
        const img = imagePic.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, imageAltText || img.alt, false, [{ width: '1903' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        slideBgImg.append(optimizedPic);
      }
      slideDiv.append(slideBgImg);

      const mobContentDiv = document.createElement('div');
      mobContentDiv.classList.add('mob-content-home-spotlight');
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('content', 'text-center', 'text-lg-start');

      if (subheadingContent) {
        const small = document.createElement('small');
        small.style.fontWeight = 'bold';
        small.innerHTML = subheadingContent;
        contentDiv.append(small);
      }

      if (headingContent) {
        const h2 = document.createElement('h2');
        h2.classList.add('heading', 'font-medium', 'font-size-tb');
        h2.innerHTML = headingContent;
        contentDiv.append(h2);
      }

      if (descriptionContent) {
        const p = document.createElement('p');
        p.innerHTML = descriptionContent;
        contentDiv.append(p);
      }

      if (ctaLinkElement) {
        const ctaLink = document.createElement('a');
        ctaLink.href = ctaLinkElement.href;
        ctaLink.textContent = ctaLinkElement.textContent;
        ctaLink.classList.add('btn', 'btn-primary');
        contentDiv.append(ctaLink);
      }

      mobContentDiv.append(contentDiv);
      slideDiv.append(mobContentDiv);
      swiperWrapper.append(slideDiv);
      slideIndex += 1;
    }
    // Quick Link (2 cells: link, text)
    else if (cells.length === 2) {
      const li = document.createElement('li');
      // cell[0]: field="link"
      const linkElement = cells[0].querySelector('a');
      // cell[1]: field="text"
      const linkText = cells[1].textContent.trim();

      if (linkElement) {
        const a = document.createElement('a');
        a.href = linkElement.href;
        a.textContent = linkText || linkElement.textContent; // Use linkText if available, else linkElement's text
        a.classList.add('with-full-underline');
        li.append(a);
      }
      quickLinksUl.append(li);
    }
  });

  // Update aria-label for slides
  swiperWrapper.querySelectorAll('.swiper-slide').forEach((slide, idx) => {
    slide.setAttribute('aria-label', `${idx + 1} / ${slideIndex}`);
  });

  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'bullet-bottom');
  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');

  beamSlider.append(swiperWrapper, prevButton, nextButton, swiperPagination, swiperNotification);
  quickLinksContainer.append(containerDiv);
  containerDiv.append(quickLinksUl);

  section.append(beamSlider, quickLinksContainer);

  block.textContent = '';
  block.append(section);

  // Add event listeners for navigation buttons (basic functionality)
  let currentSlide = 0;
  const slides = swiperWrapper.querySelectorAll('.swiper-slide');

  function updateSlides() {
    slides.forEach((slide, idx) => {
      slide.style.transform = `translateX(-${currentSlide * 100}%)`;
      slide.classList.remove('swiper-slide-active', 'swiper-slide-prev', 'swiper-slide-next', 'swiper-slide-visible', 'swiper-slide-fully-visible');
      if (idx === currentSlide) {
        slide.classList.add('swiper-slide-active', 'swiper-slide-visible', 'swiper-slide-fully-visible');
      } else if (idx === currentSlide - 1) {
        slide.classList.add('swiper-slide-prev');
      } else if (idx === currentSlide + 1) {
        slide.classList.add('swiper-slide-next');
      }
    });
  }

  prevButton.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slideIndex) % slideIndex;
    updateSlides();
  });

  nextButton.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slideIndex;
    updateSlides();
  });

  updateSlides(); // Initial slide setup
}
