import { createOptimizedPicture, loadScript, loadCSS } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap'); // 'what-we-do-wrap' is from original HTML, not the block name

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  // Heading
  const headingRow = children[0];
  const headingEl = document.createElement('h2');
  headingEl.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow, headingEl);
  // Heading is type=text, so read from the cell directly.
  headingEl.textContent = headingRow.children[0]?.textContent.trim() || '';
  sectionHeader.append(headingEl);

  // Description
  const descriptionRow = children[1];
  const descriptionEl = document.createElement('p');
  descriptionEl.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow, descriptionEl);
  // Description is type=richtext, so read innerHTML from the cell.
  descriptionEl.innerHTML = descriptionRow.children[0]?.innerHTML || '';
  sectionHeader.append(descriptionEl);

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');
  section.append(ourBusinessVerticals);

  // Desktop view
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  ourBusinessVerticals.append(desktopContainer);

  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopRow);

  // Mobile view
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider', 'flickity-enabled', 'is-draggable');
  // Flickity data attribute from original HTML
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  mobileSlider.append(flickityViewport);

  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  flickityViewport.append(flickitySlider);

  const mobileSlides = [];
  const itemsPerSlide = 3;
  let currentSlide = null;
  let currentSlideRow = null;

  // Business Vertical Items
  const businessVerticalRows = children.slice(2);
  businessVerticalRows.forEach((row, index) => {
    // FIXED: Replaced direct children[n] access with array destructuring for fixed-schema item rows
    const [desktopImageCell, mobileImageCell, arrowIconCell, titleCell, linkCell] = [...row.children];

    const link = linkCell?.querySelector('a');
    const href = link?.href || '#';
    const titleText = titleCell?.textContent.trim() || '';

    // Desktop Item
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.setAttribute('data-aos', 'fade-up');
    desktopCol.setAttribute('data-aos-delay', `${100 + (index % 3) * 300}`); // Stagger delay
    desktopRow.append(desktopCol);

    const desktopWrap = document.createElement('div');
    desktopWrap.classList.add('wrap');
    moveInstrumentation(row, desktopWrap); // Move instrumentation to the desktop item wrap
    desktopCol.append(desktopWrap);

    const desktopImageDiv = document.createElement('div');
    desktopImageDiv.classList.add('image');
    if (desktopImageCell) {
      const picture = desktopImageCell.querySelector('picture');
      if (picture) {
        desktopImageDiv.append(createOptimizedPicture(picture.querySelector('img').src, picture.querySelector('img').alt, false, [{ media: '(min-width: 992px)', width: '992' }, { media: '(min-width: 450px)', width: '450' }, { width: '750' }]));
      }
    }
    desktopWrap.append(desktopImageDiv);

    const desktopTitleDiv = document.createElement('div');
    desktopTitleDiv.classList.add('title');
    desktopTitleDiv.textContent = titleText;
    if (arrowIconCell) {
      const arrowPicture = arrowIconCell.querySelector('picture');
      if (arrowPicture) {
        const arrowImg = arrowPicture.querySelector('img');
        if (arrowImg) {
          const newArrowImg = document.createElement('img');
          newArrowImg.loading = 'lazy';
          newArrowImg.src = arrowImg.src;
          newArrowImg.alt = arrowImg.alt;
          newArrowImg.width = arrowImg.width;
          newArrowImg.height = arrowImg.height;
          desktopTitleDiv.append(newArrowImg);
        }
      }
    }
    desktopWrap.append(desktopTitleDiv);

    const desktopLink = document.createElement('a');
    desktopLink.href = href;
    desktopLink.classList.add('stretched-link');
    desktopLink.setAttribute('aria-label', `Learn more about ${titleText}`);
    desktopWrap.append(desktopLink);

    // Mobile Item (for slider)
    if (index % itemsPerSlide === 0) {
      currentSlide = document.createElement('div');
      currentSlide.classList.add('slides');
      if (index === 0) currentSlide.classList.add('is-selected');
      flickitySlider.append(currentSlide);

      currentSlideRow = document.createElement('div');
      currentSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentSlide.append(currentSlideRow);
      mobileSlides.push(currentSlide);
    }

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    currentSlideRow.append(mobileCol);

    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');
    mobileCol.append(mobileWrap);

    const mobileImageDiv = document.createElement('div');
    mobileImageDiv.classList.add('image');
    if (mobileImageCell) {
      const picture = mobileImageCell.querySelector('picture');
      if (picture) {
        mobileImageDiv.append(createOptimizedPicture(picture.querySelector('img').src, picture.querySelector('img').alt, false, [{ media: '(min-width: 992px)', width: '992' }, { media: '(min-width: 450px)', width: '450' }, { width: '750' }]));
      }
    }
    mobileWrap.append(mobileImageDiv);

    const mobileTitleDiv = document.createElement('div');
    mobileTitleDiv.classList.add('title');
    mobileTitleDiv.textContent = titleText;
    if (arrowIconCell) {
      const arrowPicture = arrowIconCell.querySelector('picture');
      if (arrowPicture) {
        const arrowImg = arrowPicture.querySelector('img');
        if (arrowImg) {
          const newArrowImg = document.createElement('img');
          newArrowImg.loading = 'lazy';
          newArrowImg.src = arrowImg.src;
          newArrowImg.alt = arrowImg.alt;
          newArrowImg.width = arrowImg.width;
          newArrowImg.height = arrowImg.height;
          mobileTitleDiv.append(newArrowImg);
        }
      }
    }
    mobileWrap.append(mobileTitleDiv);

    const mobileLink = document.createElement('a');
    mobileLink.href = href;
    mobileLink.classList.add('stretched-link');
    mobileLink.setAttribute('aria-label', `Learn more about ${titleText}`);
    mobileWrap.append(mobileLink);
  });

  // Flickity pagination dots
  const flickityPageDots = document.createElement('ol');
  flickityPageDots.classList.add('flickity-page-dots');
  mobileSlider.append(flickityPageDots);

  mobileSlides.forEach((_, slideIndex) => {
    const dot = document.createElement('li');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Page dot ${slideIndex + 1}`);
    if (slideIndex === 0) {
      dot.classList.add('is-selected');
      dot.setAttribute('aria-current', 'step');
    }
    flickityPageDots.append(dot);
  });

  block.replaceChildren(section);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Flickity Initialization
  // Check 2.5: Flickity is used, so load its CSS and JS
  await loadCSS('/libs/flickity/flickity.min.css'); // Assuming Flickity CSS is in /libs/flickity
  await loadScript('/libs/flickity/flickity.pkgd.min.js'); // Assuming Flickity JS is in /libs/flickity

  // eslint-disable-next-line no-undef
  // Check 2.5: Initialize Flickity after the block is rendered and assets are loaded
  if (typeof Flickity === 'function') {
    // eslint-disable-next-line no-new
    new Flickity(mobileSlider, {
      wrapAround: mobileSlider.dataset.flickity.includes('"wrapAround": true'),
      lazyLoad: mobileSlider.dataset.flickity.includes('"lazyLoad": true'),
      pageDots: mobileSlider.dataset.flickity.includes('"pageDots": true'),
      prevNextButtons: mobileSlider.dataset.flickity.includes('"prevNextButtons": true'),
      imagesLoaded: mobileSlider.dataset.flickity.includes('"imagesLoaded": true'),
      cellAlign: 'left', // Hardcoded in original HTML
      adaptiveHeight: mobileSlider.dataset.flickity.includes('"adaptiveHeight": true'),
    });
  }
}
