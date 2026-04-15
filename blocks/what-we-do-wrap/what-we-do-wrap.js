import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...itemRows] = [...block.children];

  // Create main container
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container');
  moveInstrumentation(block, containerDiv); // Move instrumentation from block to containerDiv

  // Create section-header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  // Heading
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  // The original HTML has data-aos attributes on the h2 itself, not its parent div
  // moveInstrumentation should be from the original content element to the new one
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.textContent = headingRow.firstElementChild?.textContent || '';
  // Copy data-aos attributes from original heading cell to new heading element
  if (headingRow.firstElementChild) {
    [...headingRow.firstElementChild.attributes].forEach(attr => {
      if (attr.name.startsWith('data-aos')) {
        heading.setAttribute(attr.name, attr.value);
      }
    });
  }
  sectionHeader.append(heading);

  // Description
  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow.firstElementChild, description);
  description.textContent = descriptionRow.firstElementChild?.textContent || '';
  // Copy data-aos attributes from original description cell to new description element
  if (descriptionRow.firstElementChild) {
    [...descriptionRow.firstElementChild.attributes].forEach(attr => {
      if (attr.name.startsWith('data-aos')) {
        description.setAttribute(attr.name, attr.value);
      }
    });
  }
  sectionHeader.append(description);

  containerDiv.append(sectionHeader);

  // Our Business Verticals section
  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');

  // Desktop view
  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');

  // Mobile view
  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider'); // Initial class, flickity will add more
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileSlider.setAttribute('tabindex', '0');

  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  flickityViewport.append(flickitySlider);
  mobileSlider.append(flickityViewport);

  const mobileSlides = [];
  let currentSlide = document.createElement('div');
  currentSlide.classList.add('slides');
  let currentMobileRow = document.createElement('div');
  currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentSlide.append(currentMobileRow);
  mobileSlides.push(currentSlide);

  itemRows.forEach((row, index) => {
    const cells = [...row.children];
    // Use content detection instead of index access
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const titleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '');
    const iconCell = cells.find(cell => cell.querySelector('picture') && cell !== imageCell);
    const linkCell = cells.find(cell => cell.querySelector('a'));

    // Desktop item
    const col = document.createElement('div');
    col.classList.add('col', 'aos-init', 'aos-animate');
    // Add data-aos-delay based on index to match original HTML pattern
    const delay = (index % 3) * 300 + 100; // Example: 100, 400, 700, 100, 400, 700...
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', delay);

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '376' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageDiv.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('img-fluid');
    }
    wrap.append(imageDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    moveInstrumentation(titleCell, titleDiv);
    titleDiv.append(titleCell?.textContent || '');
    const iconPicture = iconCell?.querySelector('picture');
    if (iconPicture) {
      const iconImg = iconPicture.querySelector('img');
      // The original HTML has width 10 for the icon, not 100
      const optimizedIcon = createOptimizedPicture(iconImg.src, iconImg.alt, false, [{ width: '10' }]);
      moveInstrumentation(iconImg, optimizedIcon.querySelector('img'));
      titleDiv.append(optimizedIcon);
    }
    wrap.append(titleDiv);

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const originalLink = linkCell?.querySelector('a');
    if (originalLink) {
      moveInstrumentation(originalLink, link);
      link.href = originalLink.href;
      link.setAttribute('aria-label', originalLink.getAttribute('aria-label') || `Learn more about ${titleCell?.textContent || ''}`);
    } else {
      link.href = '#';
      link.setAttribute('aria-label', `Learn more about ${titleCell?.textContent || ''}`);
    }
    wrap.append(link);

    col.append(wrap);
    desktopRow.append(col);

    // Mobile item (3 items per slide)
    if (index > 0 && index % 3 === 0) {
      currentSlide = document.createElement('div');
      currentSlide.classList.add('slides');
      currentMobileRow = document.createElement('div');
      currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentSlide.append(currentMobileRow);
      mobileSlides.push(currentSlide);
    }
    const mobileCol = col.cloneNode(true); // Clone the desktop column structure
    currentMobileRow.append(mobileCol);

    moveInstrumentation(row, col); // Move instrumentation from original row to desktop col
  });

  desktopContainer.append(desktopRow);
  ourBusinessVerticals.append(desktopContainer);

  mobileSlides.forEach((slide) => {
    flickitySlider.append(slide);
  });

  mobileContainer.append(mobileSlider);
  ourBusinessVerticals.append(mobileContainer);

  block.textContent = ''; // Clear the original block content
  block.append(containerDiv, ourBusinessVerticals);

  // Initialize Flickity after elements are added to the DOM
  // This requires the Flickity library to be loaded.
  // Assuming Flickity is loaded globally or via a separate script.
  if (typeof Flickity !== 'undefined') {
    // eslint-disable-next-line no-new
    new Flickity(mobileSlider, JSON.parse(mobileSlider.dataset.flickity));
  }
}
