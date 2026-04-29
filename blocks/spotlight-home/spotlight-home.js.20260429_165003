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

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  slideRows.forEach((row, index) => {
    const [imageCell, altTextCell, smallTextCell, headingCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    if (index === 0) {
      swiperSlide.classList.add('swiper-slide-active');
    }
    moveInstrumentation(row, swiperSlide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ width: '1903' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      slideBgImg.append(optimizedPic);
    }

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');
    if (index === 0) {
      contentDiv.classList.add('active');
    }

    const smallText = smallTextCell.textContent.trim();
    if (smallText) {
      const smallEl = document.createElement('small');
      smallEl.style.fontWeight = 'bold';
      smallEl.textContent = smallText;
      contentDiv.append(smallEl);
    }

    const heading = headingCell.textContent.trim();
    if (heading) {
      const h1 = document.createElement('h1');
      h1.classList.add('heading', 'font-medium', 'font-size-tb');
      if (index === 0) {
        h1.classList.add('banner-text-dark');
      }
      h1.innerHTML = heading;
      contentDiv.append(h1);
    }

    const description = descriptionCell.innerHTML.trim();
    if (description) {
      const p = document.createElement('p');
      p.innerHTML = description;
      contentDiv.append(p);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaLabel = ctaLabelCell.textContent.trim();
    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLabel;
      anchor.classList.add('btn', 'btn-primary');
      contentDiv.append(anchor);
    }

    mobContentHomeSpotlight.append(contentDiv);
    swiperSlide.append(slideBgImg, mobContentHomeSpotlight);
    swiperWrapper.append(swiperSlide);
  });

  beamSlider.append(swiperWrapper);

  const swiperButtonPrev = document.createElement('div');
  swiperButtonPrev.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  swiperButtonPrev.setAttribute('tabindex', '0');
  swiperButtonPrev.setAttribute('role', 'button');
  swiperButtonPrev.setAttribute('aria-label', 'Previous slide');
  swiperButtonPrev.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';
  beamSlider.append(swiperButtonPrev);

  const swiperButtonNext = document.createElement('div');
  swiperButtonNext.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  swiperButtonNext.setAttribute('tabindex', '0');
  swiperButtonNext.setAttribute('role', 'button');
  swiperButtonNext.setAttribute('aria-label', 'Next slide');
  swiperButtonNext.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';
  beamSlider.append(swiperButtonNext);

  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.append(swiperPagination);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  beamSlider.append(swiperNotification);

  section.append(beamSlider);

  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '-100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const quickLinksDiv = document.createElement('ul');
  quickLinksDiv.classList.add('quick-links-div');

  quickLinkRows.forEach((row) => {
    const [linkCell, labelCell] = [...row.children];
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const link = linkCell.querySelector('a');
    const label = labelCell.textContent.trim();

    if (link && label) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = label;
      anchor.classList.add('with-full-underline');
      li.append(anchor);
    }
    quickLinksDiv.append(li);
  });

  container.append(quickLinksDiv);
  quickLinksParentDiv.append(container);
  section.append(quickLinksParentDiv);

  block.replaceWith(section);

  // Initialize Swiper after all elements are in the DOM
  import('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js').then((SwiperModule) => {
    const Swiper = SwiperModule.default;
    // eslint-disable-next-line no-new
    new Swiper(beamSlider, {
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      speed: 1000,
      pagination: {
        el: swiperPagination,
        clickable: true,
      },
      navigation: {
        nextEl: swiperButtonNext,
        prevEl: swiperButtonPrev,
      },
      on: {
        init() {
          beamSlider.classList.remove('loading1');
        },
      },
    });
  });
}
