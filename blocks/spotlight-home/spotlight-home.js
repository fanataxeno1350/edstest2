import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  const slideRows = allRows.filter((row) => row.children.length === 7);
  const quickLinkRows = allRows.filter((row) => row.children.length === 2);

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');
  moveInstrumentation(block, section);

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  section.append(beamSlider);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  beamSlider.append(swiperWrapper);

  slideRows.forEach((row, index) => {
    const [imageCell, imageAltCell, smallHeadingCell, headingCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    moveInstrumentation(row, swiperSlide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');
    swiperSlide.append(slideBgImg);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, imageAltCell.textContent.trim() || img.alt, false, [{ width: '1903' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        slideBgImg.append(optimizedPic);
      } else {
        slideBgImg.append(picture);
      }
    }

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');
    swiperSlide.append(mobContentHomeSpotlight);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');
    mobContentHomeSpotlight.append(contentDiv);

    if (smallHeadingCell.textContent.trim()) {
      const smallHeading = document.createElement('small');
      smallHeading.style.fontWeight = 'bold';
      smallHeading.textContent = smallHeadingCell.textContent.trim();
      contentDiv.append(smallHeading);
    }

    if (headingCell.textContent.trim()) {
      const heading = document.createElement('h1');
      heading.classList.add('heading', 'font-medium', 'font-size-tb');
      heading.textContent = headingCell.textContent.trim();
      contentDiv.append(heading);
    }

    if (descriptionCell.textContent.trim()) {
      const description = document.createElement('p');
      description.innerHTML = `<strong>${descriptionCell.textContent.trim()}</strong>`;
      contentDiv.append(description);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink && ctaLabelCell.textContent.trim()) {
      const ctaButton = document.createElement('a');
      ctaButton.classList.add('btn', 'btn-primary');
      ctaButton.href = ctaLink.href;
      ctaButton.textContent = ctaLabelCell.textContent.trim();
      contentDiv.append(ctaButton);
    }

    swiperWrapper.append(swiperSlide);
  });

  const swiperButtonPrev = document.createElement('div');
  swiperButtonPrev.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  swiperButtonPrev.innerHTML = `<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>`;
  beamSlider.append(swiperButtonPrev);

  const swiperButtonNext = document.createElement('div');
  swiperButtonNext.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  swiperButtonNext.innerHTML = `<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>`;
  beamSlider.append(swiperButtonNext);

  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.append(swiperPagination);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  beamSlider.append(swiperNotification);

  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');
  section.append(quickLinksParentDiv);

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'aos-init', 'aos-animate');
  containerDiv.setAttribute('data-aos', 'fade-up');
  containerDiv.setAttribute('data-aos-offset', '-100');
  containerDiv.setAttribute('data-aos-duration', '650');
  containerDiv.setAttribute('data-aos-easing', 'ease-in-out');
  quickLinksParentDiv.append(containerDiv);

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');
  containerDiv.append(quickLinksUl);

  quickLinkRows.forEach((row) => {
    const [linkCell, labelCell] = [...row.children];
    const li = document.createElement('li');
    const link = linkCell.querySelector('a');
    if (link) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = labelCell.textContent.trim();
      anchor.classList.add('with-full-underline');
      moveInstrumentation(row, anchor);
      li.append(anchor);
    }
    quickLinksUl.append(li);
  });

  block.replaceWith(section);

  // Initialize Swiper (simplified for EDS context)
  let currentIndex = 0;
  const slides = [...swiperWrapper.children];
  const totalSlides = slides.length;

  const updateSlider = () => {
    swiperWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    slides.forEach((slide, i) => {
      slide.classList.remove('swiper-slide-active', 'swiper-slide-prev', 'swiper-slide-next', 'swiper-slide-visible', 'swiper-slide-fully-visible');
      if (i === currentIndex) {
        slide.classList.add('swiper-slide-active', 'swiper-slide-visible', 'swiper-slide-fully-visible');
      } else if (i === (currentIndex - 1 + totalSlides) % totalSlides) {
        slide.classList.add('swiper-slide-prev');
      } else if (i === (currentIndex + 1) % totalSlides) {
        slide.classList.add('swiper-slide-next');
      }
    });

    swiperPagination.innerHTML = '';
    for (let i = 0; i < totalSlides; i += 1) {
      const bullet = document.createElement('span');
      bullet.classList.add('swiper-pagination-bullet');
      if (i === currentIndex) {
        bullet.classList.add('swiper-pagination-bullet-active');
      }
      bullet.addEventListener('click', () => {
        currentIndex = i;
        updateSlider();
      });
      swiperPagination.append(bullet);
    }
  };

  swiperButtonNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlider();
  });

  swiperButtonPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
  });

  updateSlider(); // Initial render
}
