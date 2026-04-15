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
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi'); // swiper classes added by JS
  section.append(beamSlider);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  beamSlider.append(swiperWrapper);

  slideRows.forEach((row, index) => {
    const [backgroundImageCell, imageAltCell, headingCell, subheadingCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    moveInstrumentation(row, swiperSlide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');
    swiperSlide.append(slideBgImg);

    const picture = backgroundImageCell.querySelector('picture');
    if (picture) {
      slideBgImg.append(picture);
    }

    const mobContent = document.createElement('div');
    mobContent.classList.add('mob-content-home-spotlight');
    swiperSlide.append(mobContent);

    const content = document.createElement('div');
    content.classList.add('content', 'text-center', 'text-lg-start');
    mobContent.append(content);

    if (subheadingCell.textContent.trim()) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold';
      small.textContent = subheadingCell.textContent.trim();
      content.append(small);
    }

    if (headingCell.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.classList.add('heading', 'font-medium', 'font-size-tb');
      if (index === 0) { // First slide has banner-text-dark class in original HTML
        h2.classList.add('banner-text-dark');
      }
      h2.innerHTML = headingCell.textContent.trim().replace(/<br>/g, '<br>'); // Preserve line breaks
      content.append(h2);
    }

    if (descriptionCell.textContent.trim()) {
      const p = document.createElement('p');
      p.innerHTML = `<strong>${descriptionCell.textContent.trim()}</strong>`;
      content.append(p);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaLabel = ctaLabelCell.textContent.trim();
    if (ctaLink && ctaLabel) {
      const a = document.createElement('a');
      a.href = ctaLink.href;
      a.textContent = ctaLabel;
      a.classList.add('btn', 'btn-primary');
      content.append(a);
    }

    swiperWrapper.append(swiperSlide);
  });

  // Swiper navigation and pagination (empty for now, Swiper JS will populate)
  const swiperButtonPrev = document.createElement('div');
  swiperButtonPrev.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  beamSlider.append(swiperButtonPrev);

  const swiperButtonNext = document.createElement('div');
  swiperButtonNext.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  beamSlider.append(swiperButtonNext);

  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.append(swiperPagination);

  // Quick Links
  if (quickLinkRows.length > 0) {
    const quickLinksParentDiv = document.createElement('div');
    quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');
    section.append(quickLinksParentDiv);

    const container = document.createElement('div');
    container.classList.add('container', 'aos-init', 'aos-animate'); // aos classes are for animation, will be handled by CSS/JS
    quickLinksParentDiv.append(container);

    const ul = document.createElement('ul');
    ul.classList.add('quick-links-div');
    container.append(ul);

    quickLinkRows.forEach((row) => {
      const [labelCell, linkCell] = [...row.children];

      const li = document.createElement('li');
      moveInstrumentation(row, li);

      const a = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        a.href = foundLink.href;
      }
      a.textContent = labelCell.textContent.trim();
      a.classList.add('with-full-underline');
      li.append(a);
      ul.append(li);
    });
  }

  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1920' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(section);

  // Initialize Swiper (assuming Swiper library is loaded globally or imported)
  // This part is typically handled by a separate script or the main JS.
  // For EDS, we only provide the DOM structure.
  // If actual Swiper functionality is required, it needs to be loaded and initialized
  // outside the decorate function, e.g., in a module that imports this block.
  // Example (conceptual, not part of decorate function):
  // import Swiper from 'swiper';
  // import { Navigation, Pagination } from 'swiper/modules';
  // Swiper.use([Navigation, Pagination]);
  // new Swiper('.beam-slider', {
  //   slidesPerView: 1,
  //   spaceBetween: 0,
  //   loop: true,
  //   pagination: {
  //     el: '.swiper-pagination',
  //     clickable: true,
  //   },
  //   navigation: {
  //     nextEl: '.swiper-button-next',
  //     prevEl: '.swiper-button-prev',
  //   },
  // });
}
