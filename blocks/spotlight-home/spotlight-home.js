import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  const slides = allRows.filter((row) => row.children.length === 7);
  const quickLinks = allRows.filter((row) => row.children.length === 2);

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');
  moveInstrumentation(block, section);

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi'); // swiper-initialized, swiper-horizontal, swiper-watch-progress, swiper-backface-hidden are added by swiper js
  section.append(beamSlider);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  beamSlider.append(swiperWrapper);

  slides.forEach((row, index) => {
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
      slideBgImg.append(optimizedPic);
    }
    swiperSlide.append(slideBgImg);

    const mobContent = document.createElement('div');
    mobContent.classList.add('mob-content-home-spotlight');
    swiperSlide.append(mobContent);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');
    mobContent.append(contentDiv);

    if (smallHeadingCell.textContent.trim()) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold';
      small.textContent = smallHeadingCell.textContent.trim();
      contentDiv.append(small);
    }

    if (mainHeadingCell.textContent.trim()) {
      const h1 = document.createElement('h1');
      h1.classList.add('heading', 'font-medium', 'font-size-tb');
      h1.innerHTML = mainHeadingCell.textContent.trim();
      contentDiv.append(h1);
    }

    if (descriptionCell.textContent.trim()) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = descriptionCell.textContent.trim();
      p.append(strong);
      contentDiv.append(p);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    if (ctaLink && ctaLabelCell.textContent.trim()) {
      const button = document.createElement('a');
      button.classList.add('btn', 'btn-primary');
      button.href = ctaLink.href;
      button.textContent = ctaLabelCell.textContent.trim();
      contentDiv.append(button);
    }

    swiperWrapper.append(swiperSlide);
  });

  // Swiper navigation and pagination (empty divs, Swiper JS will populate)
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

  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');
  section.append(quickLinksParentDiv);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate'); // aos-init, aos-animate are added by AOS library
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '-100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');
  quickLinksParentDiv.append(container);

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');
  container.append(quickLinksUl);

  quickLinks.forEach((row) => {
    const [linkCell, labelCell] = [...row.children];

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const link = linkCell.querySelector('a');
    if (link && labelCell.textContent.trim()) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = labelCell.textContent.trim();
      anchor.classList.add('with-full-underline');
      li.append(anchor);
    }
    quickLinksUl.append(li);
  });

  block.replaceWith(section);

  // Initialize Swiper after DOM is built
  // eslint-disable-next-line import/no-unresolved, import/extensions
  import('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js').then((module) => {
    const Swiper = module.default;
    // eslint-disable-next-line no-new
    new Swiper(beamSlider, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 0,
      navigation: {
        nextEl: swiperButtonNext,
        prevEl: swiperButtonPrev,
      },
      pagination: {
        el: swiperPagination,
        clickable: true,
      },
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      speed: 800,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      watchSlidesProgress: true,
      on: {
        init() {
          beamSlider.classList.remove('loading1');
        },
        slideChangeTransitionStart() {
          const activeSlide = beamSlider.querySelector('.swiper-slide-active');
          const prevSlide = beamSlider.querySelector('.swiper-slide-prev');
          if (activeSlide) {
            activeSlide.querySelectorAll('.content *').forEach((el) => {
              el.style.transform = 'translate(0px, 0px)';
              el.style.opacity = '1';
              el.style.visibility = 'inherit';
            });
            activeSlide.querySelector('.content').classList.add('active');
          }
          if (prevSlide) {
            prevSlide.querySelectorAll('.content *').forEach((el) => {
              el.style.transform = 'translate(0px, 20px)';
              el.style.opacity = '0';
              el.style.visibility = 'hidden';
            });
            prevSlide.querySelector('.content').classList.remove('active');
          }
        },
      },
    });
  });
}
