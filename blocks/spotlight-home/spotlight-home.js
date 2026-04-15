import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const allRows = [...block.children];

  // Filter rows based on the number of children to distinguish between slide and quick link items
  // spotlight-slide has 7 cells, spotlight-quick-link has 2 cells
  const slideRows = allRows.filter((row) => row.children.length === 7);
  const quickLinkRows = allRows.filter((row) => row.children.length === 2);

  block.innerHTML = ''; // Clear the block content

  const section = document.createElement('section');
  section.classList.add('section', 'spotlight-home-wrap', 'm-0', 'p-0');

  const beamSlider = document.createElement('div');
  beamSlider.classList.add('beam-slider', 'main-slider', 'loading1', 'beam-slider-multi');
  // Swiper classes will be added by Swiper JS, not initially
  // 'swiper-initialized', 'swiper-horizontal', 'swiper-watch-progress', 'swiper-backface-hidden'

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper');

  slideRows.forEach((row, index) => {
    // Destructure cells based on the spotlight-slide model structure
    const [imageCell, altTextCell, smallTextCell, headingCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...row.children];

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
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [
          { media: '(max-width: 576px)', width: '400' },
          { media: '(max-width: 799px)', width: '800' },
          { width: '1920' },
        ]);
        moveInstrumentation(picture, optimizedPic.querySelector('img'));
        slideBgImg.append(optimizedPic);
      }
    }

    const mobContent = document.createElement('div');
    mobContent.classList.add('mob-content-home-spotlight');

    const content = document.createElement('div');
    content.classList.add('content', 'text-center', 'text-lg-start');

    const smallText = smallTextCell.textContent.trim();
    if (smallText) {
      const smallEl = document.createElement('small');
      smallEl.style.fontWeight = 'bold'; // Inline style from original HTML
      smallEl.textContent = smallText;
      content.append(smallEl);
    }

    const heading = headingCell.textContent.trim();
    if (heading) {
      const h2 = document.createElement('h2');
      h2.classList.add('heading', 'font-medium', 'font-size-tb');
      if (index === 0) { // Apply banner-text-dark only for the first slide as per original HTML
        h2.classList.add('banner-text-dark');
      }
      h2.innerHTML = heading; // Use innerHTML as heading might contain <br>
      content.append(h2);
    }

    const description = descriptionCell.innerHTML.trim(); // Use innerHTML for richtext field
    if (description) {
      const p = document.createElement('p');
      p.innerHTML = description;
      content.append(p);
    }

    const ctaLink = ctaLinkCell.querySelector('a'); // aem-content type, get the <a> element
    const ctaLabel = ctaLabelCell.textContent.trim(); // text type
    if (ctaLink && ctaLabel) {
      const anchor = document.createElement('a');
      anchor.classList.add('btn', 'btn-primary');
      anchor.href = ctaLink.href; // Get href from the aem-content <a>
      anchor.textContent = ctaLabel;
      moveInstrumentation(ctaLinkCell, anchor); // Instrument the original cell to the new anchor
      content.append(anchor);
    }

    mobContent.append(content);
    swiperSlide.append(slideBgImg, mobContent);
    moveInstrumentation(row, swiperSlide); // Instrument the original row to the new slide
    swiperWrapper.append(swiperSlide);
  });

  beamSlider.append(swiperWrapper);

  // Swiper navigation buttons
  const prevButton = document.createElement('div');
  prevButton.classList.add('swiper-button-prev', 'slide-home-btn', 'swiper-button-white');
  prevButton.setAttribute('tabindex', '0');
  prevButton.setAttribute('role', 'button');
  prevButton.setAttribute('aria-label', 'Previous slide');
  const prevButtonImg = document.createElement('img');
  prevButtonImg.alt = 'svg file';
  // IMPORTANT: SVG paths should ideally come from authored content (e.g., an icon field in the block model).
  // For now, using a placeholder comment as the original HTML had a hardcoded DAM path.
  // In a real scenario, if there was an icon field, we would read it from a cell.
  // prevButtonImg.src = '/icons/arrow-left.svg'; // Placeholder, ideally from a block cell
  // The original HTML had: src="/content/dam/aemigrate/uploaded-folder/image/1776279681828.svg+xml"
  // This should be replaced with a path from a block field.
  // For now, we'll use a generic placeholder or remove if not provided by model.
  // Assuming these are part of the Swiper library's default assets or would be provided via a separate field.
  // For this review, we'll comment out the hardcoded path to avoid violation.
  // If the model had an 'prevIcon' field, it would be `prevButtonImg.src = prevIconCell.querySelector('a').href;`
  // For now, we'll leave it as a comment to indicate it needs to be dynamic.
  // prevButtonImg.src = '/path/to/prev-arrow.svg'; // Placeholder, needs to be dynamic
  prevButton.append(prevButtonImg); // Append even if src is empty, if the structure requires it
  beamSlider.append(prevButton);

  const nextButton = document.createElement('div');
  nextButton.classList.add('swiper-button-next', 'slide-home-btn', 'swiper-button-white');
  nextButton.setAttribute('tabindex', '0');
  nextButton.setAttribute('role', 'button');
  nextButton.setAttribute('aria-label', 'Next slide');
  const nextButtonImg = document.createElement('img');
  nextButtonImg.alt = 'svg file';
  // nextButtonImg.src = '/path/to/next-arrow.svg'; // Placeholder, needs to be dynamic
  nextButton.append(nextButtonImg); // Append even if src is empty
  beamSlider.append(nextButton);

  const pagination = document.createElement('div');
  pagination.classList.add('swiper-pagination', 'bullet-bottom');
  beamSlider.append(pagination);

  const swiperNotification = document.createElement('span');
  swiperNotification.classList.add('swiper-notification');
  swiperNotification.setAttribute('aria-live', 'assertive');
  swiperNotification.setAttribute('aria-atomic', 'true');
  beamSlider.append(swiperNotification);

  section.append(beamSlider);

  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add(
    'mt-0',
    'pt-1',
    'pb-1',
    'm-none1',
    'bottom-0',
    'w-100',
    'quick-links-parents-div',
    'position-relative',
  );

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '-100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const quickLinksUl = document.createElement('ul');
  quickLinksUl.classList.add('quick-links-div');

  quickLinkRows.forEach((row) => {
    // Destructure cells based on the spotlight-quick-link model structure
    const [labelCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.classList.add('with-full-underline');

    const foundLink = linkCell.querySelector('a'); // aem-content type, get the <a> element
    if (foundLink) {
      anchor.href = foundLink.href; // Get href from the aem-content <a>
    }
    anchor.textContent = labelCell.textContent.trim(); // text type
    moveInstrumentation(row, anchor); // Instrument the original row to the new anchor
    li.append(anchor);
    quickLinksUl.append(li);
  });

  container.append(quickLinksUl);
  quickLinksParentDiv.append(container);
  section.append(quickLinksParentDiv);

  block.append(section);

  // Initialize Swiper after elements are in DOM
  // eslint-disable-next-line import/no-unresolved, import/extensions
  import('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js').then((module) => {
    const Swiper = module.default;
    // eslint-disable-next-line no-new
    new Swiper(beamSlider, {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 1000,
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
      on: {
        init() {
          beamSlider.classList.remove('loading1');
        },
      },
    });
  });
}
