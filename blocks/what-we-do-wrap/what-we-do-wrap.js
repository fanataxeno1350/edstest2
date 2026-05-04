import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...businessVerticalRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow?.firstElementChild?.textContent.trim() || '';
  sectionHeader.append(heading);
  moveInstrumentation(headingRow, heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow?.firstElementChild?.textContent.trim() || '';
  sectionHeader.append(description);
  moveInstrumentation(descriptionRow, description);

  container.append(sectionHeader);
  section.append(container);

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');

  // Desktop view
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');

  businessVerticalRows.forEach((row) => {
    const [imageCell, titleCell, linkCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col', 'aos-init', 'aos-animate');
    moveInstrumentation(row, col);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageDiv.append(optimizedPic);
      }
    }
    wrap.append(imageDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell.textContent.trim();
    const arrowImg = document.createElement('img');
    arrowImg.loading = 'lazy';
    arrowImg.src = '/icons/tilt-white-arrow-2e81f5.svg'; // Static SVG from original HTML
    arrowImg.alt = 'Arrow';
    arrowImg.width = '10';
    arrowImg.height = '29';
    titleDiv.append(arrowImg);
    wrap.append(titleDiv);

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    wrap.append(link);

    col.append(wrap);
    desktopRow.append(col);
  });

  desktopContainer.append(desktopRow);
  ourBusinessVerticals.append(desktopContainer);

  // Mobile view (slider)
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider', 'flickity-enabled', 'is-draggable');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileSlider.setAttribute('tabindex', '0');

  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  flickityViewport.style.height = '0px';
  flickityViewport.style.touchAction = 'pan-y';

  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  flickitySlider.style.left = '0px';

  // Group items into slides for mobile (3 items per slide)
  let slide;
  businessVerticalRows.forEach((row, index) => {
    if (index % 3 === 0) {
      slide = document.createElement('div');
      slide.classList.add('slides');
      if (index === 0) {
        slide.classList.add('is-selected');
      }
      slide.style.position = 'absolute';
      slide.style.left = '0px';

      const slideRow = document.createElement('div');
      slideRow.classList.add('row', 'row-cols-1', 'gy-3');
      slide.append(slideRow);
      flickitySlider.append(slide);
    }

    const [imageCell, titleCell, linkCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col');

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageDiv.append(optimizedPic);
      }
    }
    wrap.append(imageDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell.textContent.trim();
    const arrowImg = document.createElement('img');
    arrowImg.loading = 'lazy';
    arrowImg.src = '/icons/tilt-white-arrow-2e81f5.svg'; // Static SVG from original HTML
    arrowImg.alt = 'Arrow';
    arrowImg.width = '10';
    arrowImg.height = '29';
    titleDiv.append(arrowImg);
    wrap.append(titleDiv);

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    wrap.append(link);

    col.append(wrap);
    slide.firstElementChild.append(col); // Append to the row inside the current slide
  });

  flickityViewport.append(flickitySlider);
  mobileSlider.append(flickityViewport);

  const pageDots = document.createElement('ol');
  pageDots.classList.add('flickity-page-dots');
  const numSlides = Math.ceil(businessVerticalRows.length / 3);
  for (let i = 0; i < numSlides; i += 1) {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Page dot ${i + 1}`);
    if (i === 0) {
      dot.classList.add('is-selected');
      dot.setAttribute('aria-current', 'step');
    }
    pageDots.append(dot);
  }
  mobileSlider.append(pageDots);

  mobileContainer.append(mobileSlider);
  ourBusinessVerticals.append(mobileContainer);

  section.append(ourBusinessVerticals);

  block.replaceWith(section);

  // Initialize Flickity after elements are in DOM
  // eslint-disable-next-line no-undef
  if (typeof Flickity === 'function') {
    // eslint-disable-next-line no-new, no-undef
    new Flickity(mobileSlider, {
      wrapAround: false,
      lazyLoad: true,
      pageDots: true,
      prevNextButtons: false,
      imagesLoaded: true,
      cellAlign: 'left',
      adaptiveHeight: true,
    });
  }
}
