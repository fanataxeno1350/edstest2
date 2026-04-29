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
    const [imageCell, altTextCell, smallHeadingCell, mainHeadingCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    moveInstrumentation(row, swiperSlide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ width: '1903' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      picture.replaceWith(optimizedPic);
      slideBgImg.append(optimizedPic);
    }

    const mobContent = document.createElement('div');
    mobContent.classList.add('mob-content-home-spotlight');

    const content = document.createElement('div');
    content.classList.add('content', 'text-center', 'text-lg-start');

    if (smallHeadingCell.textContent.trim()) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold';
      small.textContent = smallHeadingCell.textContent.trim();
      content.append(small);
    }

    if (mainHeadingCell.textContent.trim()) {
      const h1 = document.createElement('h1');
      h1.classList.add('heading', 'font-medium', 'font-size-tb');
      if (index === 0) { // Apply banner-text-dark only for the first slide as per original HTML
        h1.classList.add('banner-text-dark');
      }
      h1.innerHTML = mainHeadingCell.textContent.trim();
      content.append(h1);
    }

    if (descriptionCell.textContent.trim()) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = descriptionCell.textContent.trim();
      p.append(strong);
      content.append(p);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink && ctaLabelCell.textContent.trim()) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLabelCell.textContent.trim();
      anchor.classList.add('btn');
      // Check for btn-primary and other classes from original HTML
      if (index === 0 || index === 1 || index === 3 || index === 4 || index === 8) {
        anchor.classList.add('btn-primary');
      } else if (index === 2) {
        anchor.style.backgroundColor = 'rgb(255, 255, 255)';
        anchor.style.color = 'rgb(0, 0, 0)';
      }
      content.append(anchor);
    }

    mobContent.append(content);
    swiperSlide.append(slideBgImg, mobContent);
    swiperWrapper.append(swiperSlide);
  });

  beamSlider.append(swiperWrapper);

  // Swiper navigation buttons
  const prevButton = document.createElement('div');
  prevButton.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevButton.setAttribute('tabindex', '0');
  prevButton.setAttribute('role', 'button');
  prevButton.setAttribute('aria-label', 'Previous slide');
  prevButton.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';
  beamSlider.append(prevButton);

  const nextButton = document.createElement('div');
  nextButton.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextButton.setAttribute('tabindex', '0');
  nextButton.setAttribute('role', 'button');
  nextButton.setAttribute('aria-label', 'Next slide');
  nextButton.innerHTML = '<svg class="swiper-navigation-icon" width="11" height="20" viewBox="0 0 11 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z" fill="currentColor"></path></svg>';
  beamSlider.append(nextButton);

  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.append(swiperPagination);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  beamSlider.append(swiperNotification);

  section.append(beamSlider);

  // Quick Links
  if (quickLinkRows.length > 0) {
    const quickLinksParentDiv = document.createElement('div');
    quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

    const container = document.createElement('div');
    container.classList.add('container', 'aos-init', 'aos-animate');
    container.setAttribute('data-aos', 'fade-up');
    container.setAttribute('data-aos-offset', '-100');
    container.setAttribute('data-aos-duration', '650');
    container.setAttribute('data-aos-easing', 'ease-in-out');

    const quickLinksUl = document.createElement('ul');
    quickLinksUl.classList.add('quick-links-div');

    quickLinkRows.forEach((row) => {
      const [linkCell, labelCell] = [...row.children];
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        anchor.href = foundLink.href;
      }
      anchor.textContent = labelCell.textContent.trim();
      anchor.classList.add('with-full-underline');
      moveInstrumentation(row, anchor);
      li.append(anchor);
      quickLinksUl.append(li);
    });

    container.append(quickLinksUl);
    quickLinksParentDiv.append(container);
    section.append(quickLinksParentDiv);
  }

  block.replaceWith(section);

  // Initialize Swiper after DOM is built
  // This is a minimal Swiper setup. Full Swiper implementation requires Swiper library import and more options.
  // For EDS, we only provide the structure, Swiper JS is handled by the theme's JS.
  // If Swiper is not globally available, you might need to import it or ensure it's loaded.
  if (typeof window.Swiper === 'function') {
    // eslint-disable-next-line no-new
    new window.Swiper(beamSlider, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 0,
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      pagination: {
        el: swiperPagination,
        clickable: true,
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      on: {
        init: (swiper) => {
          swiper.slides.forEach((slide) => {
            slide.querySelector('.content').classList.remove('active');
          });
          swiper.slides[swiper.activeIndex].querySelector('.content').classList.add('active');
        },
        slideChangeTransitionEnd: (swiper) => {
          swiper.slides.forEach((slide) => {
            slide.querySelector('.content').classList.remove('active');
          });
          swiper.slides[swiper.activeIndex].querySelector('.content').classList.add('active');
        },
      },
    });
  }
}
