import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const spotlightHomeWrap = document.createElement('section');
  spotlightHomeWrap.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');
  moveInstrumentation(block, spotlightHomeWrap);

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi'); // swiper-initialized, swiper-horizontal, swiper-watch-progress, swiper-backface-hidden are runtime classes
  spotlightHomeWrap.appendChild(beamSlider);

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');
  beamSlider.appendChild(swiperWrapper);

  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');
  spotlightHomeWrap.appendChild(quickLinksParentDiv);

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate'); // aos-init, aos-animate are runtime classes
  quickLinksParentDiv.appendChild(container);

  const quickLinksDiv = document.createElement('ul');
  quickLinksDiv.classList.add('quick-links-div');
  container.appendChild(quickLinksDiv);

  const slideRows = [];
  const quickLinkRows = [];

  [...block.children].forEach((row) => {
    // Determine row type based on number of children
    // spotlight-slide has 7 cells, quick-link-item has 2 cells
    if (row.children.length === 7) {
      slideRows.push(row);
    } else if (row.children.length === 2) {
      quickLinkRows.push(row);
    }
  });

  slideRows.forEach((row, index) => {
    const [imageCell, altCell, headingCell, smallTextCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

    const swiperSlide = document.createElement('div');
    swiperSlide.classList.add('swiper-slide', 'nogradient');
    swiperSlide.setAttribute('role', 'group');
    swiperSlide.setAttribute('aria-label', `${index + 1} / ${slideRows.length}`);
    swiperSlide.setAttribute('data-swiper-slide-index', index);
    moveInstrumentation(row, swiperSlide);

    const slideBgImg = document.createElement('div');
    slideBgImg.classList.add('slide-bgimg');
    swiperSlide.appendChild(slideBgImg);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      // Use altCell.textContent.trim() for alt text as per EDS structure
      const optimizedPic = createOptimizedPicture(img.src, altCell.textContent.trim(), false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      slideBgImg.appendChild(optimizedPic);
    }

    const mobContentHomeSpotlight = document.createElement('div');
    mobContentHomeSpotlight.classList.add('mob-content-home-spotlight');
    swiperSlide.appendChild(mobContentHomeSpotlight);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'text-center', 'text-lg-start');
    mobContentHomeSpotlight.appendChild(contentDiv);

    const smallText = smallTextCell.textContent.trim();
    if (smallText) {
      const smallEl = document.createElement('small');
      smallEl.textContent = smallText;
      smallEl.style.fontWeight = 'bold'; // Inline style from original HTML
      contentDiv.appendChild(smallEl);
    }

    const heading = headingCell.textContent.trim();
    if (heading) {
      if (index === 0) { // First slide had h1 in original HTML
        const h1 = document.createElement('h1');
        h1.classList.add('heading', 'font-medium', 'font-size-tb', 'banner-text-dark');
        h1.innerHTML = heading;
        contentDiv.appendChild(h1);
      } else {
        const h2 = document.createElement('h2');
        h2.classList.add('heading', 'font-medium', 'font-size-tb');
        h2.innerHTML = heading;
        contentDiv.appendChild(h2);
      }
    }

    const description = descriptionCell.textContent.trim();
    if (description) {
      const p = document.createElement('p');
      p.innerHTML = `<strong>${description}</strong>`; // Preserve strong tag from original HTML
      contentDiv.appendChild(p);
    }

    const ctaLink = ctaLinkCell.querySelector('a'); // Read href from aem-content cell
    const ctaLabel = ctaLabelCell.textContent.trim(); // Read text from text cell
    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.href = ctaLink.href;
      anchor.textContent = ctaLabel;
      anchor.classList.add('btn', 'btn-primary');
      contentDiv.appendChild(anchor);
    }

    swiperWrapper.appendChild(swiperSlide);
  });

  // Swiper Navigation Buttons
  const swiperButtonPrev = document.createElement('div');
  swiperButtonPrev.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  swiperButtonPrev.setAttribute('tabindex', '0');
  swiperButtonPrev.setAttribute('role', 'button');
  swiperButtonPrev.setAttribute('aria-label', 'Previous slide');
  // Use generic icon paths as per review guidelines
  swiperButtonPrev.innerHTML = '<img alt="svg file" src="/icons/arrow-left.svg"/>';
  beamSlider.appendChild(swiperButtonPrev);

  const swiperButtonNext = document.createElement('div');
  swiperButtonNext.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  swiperButtonNext.setAttribute('tabindex', '0');
  swiperButtonNext.setAttribute('role', 'button');
  swiperButtonNext.setAttribute('aria-label', 'Next slide');
  // Use generic icon paths as per review guidelines
  swiperButtonNext.innerHTML = '<img alt="svg file" src="/icons/arrow-right.svg"/>';
  beamSlider.appendChild(swiperButtonNext);

  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.appendChild(swiperPagination);

  quickLinkRows.forEach((row) => {
    const [linkCell, labelCell] = [...row.children];

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    const foundLink = linkCell.querySelector('a'); // Read href from aem-content cell
    if (foundLink) {
      anchor.href = foundLink.href;
    }
    anchor.textContent = labelCell.textContent.trim(); // Read text from text cell
    anchor.classList.add('with-full-underline');
    moveInstrumentation(row, anchor);
    li.appendChild(anchor);
    quickLinksDiv.appendChild(li);
  });

  // Initialize Swiper (if Swiper library is loaded globally)
  // This block does not load Swiper. If Swiper is needed, it should be loaded as a dependency
  // and initialized outside this decorate function, or this function could dispatch an event
  // for a global Swiper initializer. For now, we only build the DOM structure.

  block.replaceWith(spotlightHomeWrap);
}
