import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const sectionTitleRow = children.shift(); // First row is sectionTitle
  const sectionTitle = document.createElement('h2');
  sectionTitle.classList.add('heading', 'font-regular');
  moveInstrumentation(sectionTitleRow, sectionTitle);
  sectionTitle.textContent = sectionTitleRow.textContent.trim();
  sectionHeader.append(sectionTitle);

  const positionRelativeDiv = document.createElement('div');
  positionRelativeDiv.classList.add('position-relative');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');

  const gridLayoutDiv = document.createElement('div');
  gridLayoutDiv.classList.add('grid-layout', 'swiper'); // Add swiper class for initialization

  const swiperWrapper = document.createElement('div');
  swiperWrapper.classList.add('swiper-wrapper'); // Swiper wrapper

  children.forEach((row) => {
    const [
      imageMobile576Cell,
      imageMobile799Cell,
      imageDesktopCell,
      slideTitleCell,
      slideDescriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides', 'swiper-slide'); // Add swiper-slide class

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const imageWrapDiv = document.createElement('div');
    imageWrapDiv.classList.add('image-wrap');

    const picture = document.createElement('picture');

    const imgMobile576 = imageMobile576Cell.querySelector('img');
    if (imgMobile576) {
      const source576 = document.createElement('source');
      source576.media = '(max-width: 576px)';
      source576.srcset = imgMobile576.src;
      picture.append(source576);
    }

    const imgMobile799 = imageMobile799Cell.querySelector('img');
    if (imgMobile799) {
      const source799 = document.createElement('source');
      source799.media = '(max-width: 799px)';
      source799.srcset = imgMobile799.src;
      picture.append(source799);
    }

    const imgDesktop = imageDesktopCell.querySelector('img');
    if (imgDesktop) {
      // createOptimizedPicture returns a <picture> element, not just an <img>
      const optimizedPicture = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      optimizedPicture.querySelector('img').classList.add('img-fluid');
      // Append all children of the optimized picture to the current picture element
      while (optimizedPicture.firstChild) {
        picture.append(optimizedPicture.firstChild);
      }
    }

    if (picture.children.length > 0) {
      imageWrapDiv.append(picture);
    }

    const contentWrapDiv = document.createElement('div');
    contentWrapDiv.classList.add('content-wrap');

    const innerSectionHeader = document.createElement('div');
    innerSectionHeader.classList.add('section-header');

    const slideTitle = document.createElement('h3');
    slideTitle.classList.add('heading', 'font-regular');
    slideTitle.textContent = slideTitleCell.textContent.trim();
    innerSectionHeader.append(slideTitle);

    const slideDescription = document.createElement('p');
    slideDescription.classList.add('text-size-body');
    slideDescription.innerHTML = slideDescriptionCell.innerHTML; // Correctly handles richtext
    innerSectionHeader.append(slideDescription);

    const ctaLink = document.createElement('a');
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
    }
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    innerSectionHeader.append(ctaLink);

    contentWrapDiv.append(innerSectionHeader);

    wrapDiv.append(imageWrapDiv, contentWrapDiv);
    moveInstrumentation(row, slidesDiv);
    slidesDiv.append(wrapDiv);
    swiperWrapper.append(slidesDiv); // Append to swiper-wrapper
  });

  gridLayoutDiv.append(swiperWrapper); // Append swiper-wrapper to grid-layout
  containerDiv.append(gridLayoutDiv);
  positionRelativeDiv.append(containerDiv);

  block.replaceChildren(sectionHeader, positionRelativeDiv);

  // Swiper initialization
  await loadCSS('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css');
  await loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js');

  // Add pagination dots
  const paginationDiv = document.createElement('div');
  paginationDiv.classList.add('swiper-pagination');
  gridLayoutDiv.append(paginationDiv);

  // eslint-disable-next-line no-undef
  new Swiper(gridLayoutDiv, {
    slidesPerView: 'auto',
    loop: false, // Original HTML doesn't specify loop, default to false
    pagination: {
      el: paginationDiv,
      clickable: true,
    },
    // Original HTML has no prev/next buttons, so omit navigation
  });
}
