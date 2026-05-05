import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const [headingRow, ...slideRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'work-with-us', 'pb-0');
  moveInstrumentation(block, section);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  moveInstrumentation(headingRow, sectionHeader);

  const [headingCell] = [...headingRow.children]; // Fixed: Use array destructuring
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingCell.textContent.trim(); // Fixed: Use headingCell
  sectionHeader.append(heading);
  section.append(sectionHeader);

  const positionRelative = document.createElement('div');
  positionRelative.classList.add('position-relative', 'aos-init', 'aos-animate');

  const container = document.createElement('div');
  container.classList.add('container');

  // Original HTML indicates Flickity slider, so we need a wrapper for it
  const flickitySliderMobileWrap = document.createElement('div');
  flickitySliderMobileWrap.classList.add('flickity-slider-mobile-wrap');
  flickitySliderMobileWrap.dataset.flickity = '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "watchCSS": true, "adaptiveHeight": true }';

  const gridLayout = document.createElement('div');
  gridLayout.classList.add('grid-layout');

  slideRows.forEach((row) => {
    const [
      imageDesktopCell,
      imageMobile576Cell,
      imageMobile799Cell,
      slideHeadingCell,
      slideDescriptionCell,
      ctaLinkCell,
      ctaLabelCell,
    ] = [...row.children];

    const slidesDiv = document.createElement('div');
    slidesDiv.classList.add('slides');
    moveInstrumentation(row, slidesDiv);

    const wrapDiv = document.createElement('div');
    wrapDiv.classList.add('wrap');

    const imageWrap = document.createElement('div');
    imageWrap.classList.add('image-wrap');

    const picture = document.createElement('picture');

    const source576 = document.createElement('source');
    source576.media = '(max-width: 576px)';
    const img576 = imageMobile576Cell.querySelector('img');
    if (img576) {
      source576.srcset = img576.src;
      picture.append(source576);
    }

    const source799 = document.createElement('source');
    source799.media = '(max-width: 799px)';
    const img799 = imageMobile799Cell.querySelector('img');
    if (img799) {
      source799.srcset = img799.src;
      picture.append(source799);
    }

    const imgDesktop = imageDesktopCell.querySelector('img');
    if (imgDesktop) {
      const img = createOptimizedPicture(imgDesktop.src, imgDesktop.alt, false, [{ width: '750' }]);
      img.querySelector('img').classList.add('img-fluid');
      picture.append(img.querySelector('img'));
    }

    if (picture.children.length > 0) {
      imageWrap.append(picture);
      wrapDiv.append(imageWrap);
    }

    const contentWrap = document.createElement('div');
    contentWrap.classList.add('content-wrap');

    const contentSectionHeader = document.createElement('div');
    contentSectionHeader.classList.add('section-header');

    const slideHeading = document.createElement('h3');
    slideHeading.classList.add('heading', 'font-regular');
    slideHeading.textContent = slideHeadingCell.textContent.trim();
    contentSectionHeader.append(slideHeading);

    const slideDescription = document.createElement('p');
    slideDescription.classList.add('text-size-body');
    slideDescription.textContent = slideDescriptionCell.textContent.trim();
    contentSectionHeader.append(slideDescription);

    const ctaLink = document.createElement('a');
    ctaLink.classList.add('btn', 'btn-primary', 'stretched-link');
    const foundCtaLink = ctaLinkCell.querySelector('a');
    if (foundCtaLink) {
      ctaLink.href = foundCtaLink.href;
    }
    ctaLink.textContent = ctaLabelCell.textContent.trim();
    contentSectionHeader.append(ctaLink);

    contentWrap.append(contentSectionHeader);
    wrapDiv.append(contentWrap);
    slidesDiv.append(wrapDiv);
    gridLayout.append(slidesDiv);
  });

  flickitySliderMobileWrap.append(gridLayout); // gridLayout is the Flickity container
  container.append(flickitySliderMobileWrap);
  positionRelative.append(container);
  section.append(positionRelative);

  block.replaceChildren(section);

  // Load Flickity CSS and JS
  await loadCSS('/blocks/flickity/flickity.min.css'); // Assuming Flickity CSS is in blocks/flickity
  await loadScript('/blocks/flickity/flickity.pkgd.min.js'); // Assuming Flickity JS is in blocks/flickity

  // Initialize Flickity if it's available
  if (typeof Flickity !== 'undefined') {
    // eslint-disable-next-line no-new, no-undef
    new Flickity(flickitySliderMobileWrap, {
      wrapAround: flickitySliderMobileWrap.dataset.flickity.includes('"wrapAround": true'),
      lazyLoad: flickitySliderMobileWrap.dataset.flickity.includes('"lazyLoad": true'),
      pageDots: flickitySliderMobileWrap.dataset.flickity.includes('"pageDots": true'),
      prevNextButtons: flickitySliderMobileWrap.dataset.flickity.includes('"prevNextButtons": true'),
      imagesLoaded: flickitySliderMobileWrap.dataset.flickity.includes('"imagesLoaded": true'),
      cellAlign: 'left', // Default from original HTML
      watchCSS: flickitySliderMobileWrap.dataset.flickity.includes('"watchCSS": true'),
      adaptiveHeight: flickitySliderMobileWrap.dataset.flickity.includes('"adaptiveHeight": true'),
    });
  }
}
