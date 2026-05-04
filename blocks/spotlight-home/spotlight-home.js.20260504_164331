import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');
  moveInstrumentation(block, section);

  // Use content detection to distinguish slide rows (7 cells) from quick link rows (2 cells)
  const slideRows = [...block.children].filter((row) => row.children.length === 7);
  const quickLinkRows = [...block.children].filter((row) => row.children.length === 2);

  if (slideRows.length > 0) {
    const beamSlider = document.createElement('div');
    beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi', 'swiper-initialized', 'swiper-horizontal', 'swiper-watch-progress', 'swiper-backface-hidden');

    const swiperWrapper = document.createElement('div');
    swiperWrapper.classList.add('swiper-wrapper');
    swiperWrapper.setAttribute('aria-live', 'off');

    slideRows.forEach((row, index) => {
      // Destructuring is safe here as row.children.length is explicitly checked to be 7
      const [imageCell, imageAltCell, headlineCell, subheadlineCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

      const swiperSlide = document.createElement('div');
      swiperSlide.classList.add('swiper-slide', 'nogradient');
      swiperSlide.setAttribute('role', 'group');
      swiperSlide.setAttribute('aria-label', `${index + 1} / ${slideRows.length}`);
      swiperSlide.setAttribute('data-swiper-slide-index', index);

      const slideBgImg = document.createElement('div');
      slideBgImg.classList.add('slide-bgimg');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, imageAltCell.textContent.trim(), false, [{ width: '1903' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        slideBgImg.append(optimizedPic);
      }
      swiperSlide.append(slideBgImg);

      const mobContentHomeSpotlight = document.createElement('div');
      mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');

      const content = document.createElement('div');
      content.classList.add('content', 'text-center', 'text-lg-start');

      if (subheadlineCell.textContent.trim()) {
        const small = document.createElement('small');
        small.style.fontWeight = 'bold';
        small.textContent = subheadlineCell.textContent.trim();
        content.append(small);
      }

      if (headlineCell.textContent.trim()) {
        const h1 = document.createElement('h1');
        h1.classList.add('heading', 'font-medium', 'font-size-tb');
        h1.innerHTML = headlineCell.textContent.trim();
        content.append(h1);
      }

      if (descriptionCell.textContent.trim()) {
        const p = document.createElement('p');
        p.innerHTML = descriptionCell.textContent.trim();
        content.append(p);
      }

      // Correctly read href from aem-content type cell
      const ctaLinkElement = ctaLinkCell.querySelector('a');
      const ctaLabel = ctaLabelCell.textContent.trim();
      if (ctaLinkElement && ctaLabel) {
        const anchor = document.createElement('a');
        anchor.href = ctaLinkElement.href; // Corrected: use .href from the found <a> element
        anchor.textContent = ctaLabel;
        anchor.classList.add('btn', 'btn-primary');
        moveInstrumentation(ctaLinkCell, anchor);
        content.append(anchor);
      }

      mobContentHomeSpotlight.append(content);
      swiperSlide.append(mobContentHomeSpotlight);
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

    // Initialize Swiper after elements are in DOM
    // eslint-disable-next-line import/no-cycle
    import('../../scripts/swiper.js').then(({ Swiper }) => {
      // eslint-disable-next-line no-unused-vars, no-new
      const swiper = new Swiper(beamSlider, {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: swiperPagination,
          clickable: true,
        },
        navigation: {
          nextEl: nextButton,
          prevEl: prevButton,
        },
      });
    });
  }

  if (quickLinkRows.length > 0) {
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
      // Destructuring is safe here as row.children.length is explicitly checked to be 2
      const [labelCell, linkCell] = [...row.children];
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      const foundLink = linkCell.querySelector('a'); // Correctly find the <a> element in the link cell

      if (foundLink) {
        anchor.href = foundLink.href; // Corrected: use .href from the found <a> element
      }
      anchor.textContent = labelCell.textContent.trim();
      anchor.classList.add('with-full-underline');
      moveInstrumentation(row, anchor);
      li.append(anchor);
      quickLinksDiv.append(li);
    });
    container.append(quickLinksDiv);
    quickLinksParentDiv.append(container);
    section.append(quickLinksParentDiv);
  }

  block.replaceWith(section);
}
