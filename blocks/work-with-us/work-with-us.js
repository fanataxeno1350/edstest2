import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [sectionHeadingRow, ...slideRows] = [...block.children];

  const root = document.createElement('section');
  root.classList.add('section', 'work-with-us', 'pb-0');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(sectionHeadingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = sectionHeadingRow.textContent.trim();
  sectionHeader.append(heading);
  root.append(sectionHeader);

  // Slides container
  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative', 'aos-init', 'aos-animate');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  // The original HTML has a flickity-slider-mobile-wrap div commented out,
  // but the current structure suggests a Swiper implementation.
  // Assuming the intention is a simple grid-layout for now,
  // but if it's a slider, Swiper needs to be initialized.
  const gridLayoutDiv = document.createElement('div');
  gridLayoutDiv.classList.add('grid-layout');

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('slides', 'swiper'); // Add swiper class for Swiper.js
  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper'); // Swiper wrapper for slides

  slideRows.forEach((row) => {
    const [
      imageDesktopCell,
      imageMobile576Cell,
      imageMobile799Cell,
      slideHeadingCell,
      descriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap', 'swiper-slide'); // Add swiper-slide class
    moveInstrumentation(row, wrapDiv);

    // Image Wrap
    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    // Extract image sources from cells
    const imgDesktopSrc = imageDesktopCell.querySelector('picture img')?.src;
    const imgMobile576Src = imageMobile576Cell.querySelector('picture img')?.src;
    const imgMobile799Src = imageMobile799Cell.querySelector('picture img')?.src;
    const imgAlt = imageDesktopCell.querySelector('picture img')?.alt || '';

    // Create optimized picture
    const picture = createOptimizedPicture(
      imgDesktopSrc,
      imgAlt,
      false,
      [
        { media: '(max-width: 576px)', width: '576', url: imgMobile576Src },
        { media: '(max-width: 799px)', width: '799', url: imgMobile799Src },
        { media: '(min-width: 800px)', width: '750', url: imgDesktopSrc },
      ],
    );
    // Ensure the img tag inside the picture has img-fluid class
    picture.querySelector('img').classList.add('img-fluid');
    moveInstrumentation(imageDesktopCell, picture.querySelector('img')); // Move instrumentation to the main img

    imageWrap.append(picture);
    wrapDiv.append(imageWrap);

    // Content Wrap
    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const slideSectionHeader = document.createElement('div');
    slideSectionHeader.classList.add('section-header');

    const slideHeading = document.createElement('h3');
    slideHeading.classList.add('heading', 'font-regular');
    slideHeading.textContent = slideHeadingCell.textContent.trim();
    slideSectionHeader.append(slideHeading);

    const description = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
    description.classList.add('text-size-body');
    description.innerHTML = descriptionCell.innerHTML;
    slideSectionHeader.append(description);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
    }
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    slideSectionHeader.append(ctaLink);

    contentWrap.append(slideSectionHeader);
    wrapDiv.append(contentWrap);

    swiperWrapper.append(wrapDiv);
  });

  slidesContainer.append(swiperWrapper);

  // Add Swiper navigation and pagination elements
  const swiperPagination = document.createElement('div');
  swiperPagination.classList.add('swiper-pagination');
  slidesContainer.append(swiperPagination);

  const swiperButtonPrev = document.createElement('div');
  swiperButtonPrev.classList.add('swiper-button-prev');
  slidesContainer.append(swiperButtonPrev);

  const swiperButtonNext = document.createElement('div');
  swiperButtonNext.classList.add('swiper-button-next');
  slidesContainer.append(swiperButtonNext);

  gridLayoutDiv.append(slidesContainer);
  containerDiv.append(gridLayoutDiv);
  positionRelativeDiv.append(containerDiv);
  root.append(positionRelativeDiv);

  block.replaceChildren(root);

  // Load Swiper library and initialize
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // eslint-disable-next-line no-undef
  new Swiper(slidesContainer, {
    slidesPerView: 'auto',
    loop: false, // Set loop to false based on original HTML comment
    navigation: {
      prevEl: swiperButtonPrev,
      nextEl: swiperButtonNext,
    },
    pagination: {
      el: swiperPagination,
      clickable: true,
    },
    // The original HTML had flickity data-flickity attributes,
    // translating them to Swiper options:
    // "wrapAround": false -> loop: false
    // "lazyLoad": true -> lazy: true (not explicitly added here, createOptimizedPicture handles lazy loading)
    // "pageDots": true -> pagination: { clickable: true }
    // "prevNextButtons": false -> navigation: { prevEl, nextEl } (but if false, these elements won't be visible)
    // "imagesLoaded": true -> not a direct Swiper option, handled by browser
    // "cellAlign": "left" -> slidesPerView: 'auto' with default flex alignment
    // "watchCSS": true -> not a direct Swiper option, Swiper adapts to CSS
    // "adaptiveHeight": true -> autoHeight: true
    autoHeight: true, // Based on flickity adaptiveHeight
  });
}
