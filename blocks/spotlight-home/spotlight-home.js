import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const spotlightSlides = [];
  const quickLinks = [];

  [...block.children].forEach((row) => {
    // Spotlight Slide item has 7 cells
    if (row.children.length === 7) {
      spotlightSlides.push(row);
    }
    // Quick Link item has 2 cells
    else if (row.children.length === 2) {
      quickLinks.push(row);
    }
  });

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');
  moveInstrumentation(block, section);

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  section.appendChild(beamSlider);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  beamSlider.appendChild(swiperWrapper);

  spotlightSlides.forEach((slideRow) => {
    const [imageCell, imageAltCell, headingCell, subheadingCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...slideRow.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    moveInstrumentation(slideRow, swiperSlide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, imageAltCell.textContent.trim(), false, [{ width: '1903' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        slideBgImg.appendChild(optimizedPic);
      }
    }
    swiperSlide.appendChild(slideBgImg);

    const mobContent = document.createElement('div');
    mobContent.classList.add('mob-content-home-spotlight');
    const content = document.createElement('div');
    content.classList.add('content', 'text-center', 'text-lg-start');

    if (subheadingCell.textContent.trim()) {
      const small = document.createElement('small');
      small.style.fontWeight = 'bold';
      small.textContent = subheadingCell.textContent.trim();
      content.appendChild(small);
    }

    if (headingCell.textContent.trim()) {
      const h2 = document.createElement('h2');
      h2.classList.add('heading', 'font-medium', 'font-size-tb');
      h2.innerHTML = headingCell.textContent.trim().replace(/\n/g, '<br>');
      content.appendChild(h2);
    }

    if (descriptionCell.textContent.trim()) {
      const p = document.createElement('p');
      p.innerHTML = `<strong>${descriptionCell.textContent.trim()}</strong>`;
      content.appendChild(p);
    }

    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaLabel = ctaLabelCell.textContent.trim();
    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLabel;
      anchor.classList.add('btn', 'btn-primary');
      content.appendChild(anchor);
    }

    mobContent.appendChild(content);
    swiperSlide.appendChild(mobContent);
    swiperWrapper.appendChild(swiperSlide);
  });

  // Swiper navigation buttons
  const prevButton = document.createElement('div');
  prevButton.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  const prevButtonImg = document.createElement('img');
  prevButtonImg.alt = 'svg file';
  prevButtonImg.src = '/icons/arrow-left.svg'; // Use a generic icon path or ensure it's provided by a block field
  prevButton.appendChild(prevButtonImg);
  beamSlider.appendChild(prevButton);

  const nextButton = document.createElement('div');
  nextButton.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  const nextButtonImg = document.createElement('img');
  nextButtonImg.alt = 'svg file';
  nextButtonImg.src = '/icons/arrow-right.svg'; // Use a generic icon path or ensure it's provided by a block field
  nextButton.appendChild(nextButtonImg);
  beamSlider.appendChild(nextButton);

  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.appendChild(swiperPagination);

  // Quick Links section
  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');
  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '-100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');
  quickLinksParentDiv.appendChild(container);

  const ul = document.createElement('ul');
  ul.classList.add('quick-links-div');
  container.appendChild(ul);

  quickLinks.forEach((linkRow) => {
    const [labelCell, linkCell] = [...linkRow.children];

    const li = document.createElement('li');
    moveInstrumentation(linkRow, li);

    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim();
    anchor.classList.add('with-full-underline');
    li.appendChild(anchor);
    ul.appendChild(li);
  });

  section.appendChild(quickLinksParentDiv);
  block.replaceWith(section);

  // Initialize Swiper after DOM is built
  // eslint-disable-next-line import/no-unresolved, import/extensions
  import('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js').then((SwiperModule) => {
    const Swiper = SwiperModule.default;
    // eslint-disable-next-line no-new
    new Swiper(beamSlider, {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
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
  });
}
