import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'what-we-do-wrap');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');
  container.append(sectionHeader);

  // Heading and Description are the first two rows.
  // We need to find them reliably without index access.
  // Heading is the first row with an h2-like content.
  // Description is the second row with p-like content.

  let headingRow;
  let descriptionRow;
  const itemRows = [];

  children.forEach((row, index) => {
    const cells = [...row.children];
    if (cells.length === 1) {
      const cellContent = cells[0].textContent.trim();
      if (index === 0 && cellContent) { // Assuming heading is the very first row
        headingRow = row;
      } else if (index === 1 && cellContent) { // Assuming description is the second row
        descriptionRow = row;
      }
    } else if (cells.length === 3) { // Item rows have 3 cells
      itemRows.push(row);
    }
  });

  // Heading
  if (headingRow) {
    const headingCell = headingRow.firstElementChild;
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingRow, heading);
    sectionHeader.append(heading);
  }

  // Description
  if (descriptionRow) {
    const descriptionCell = descriptionRow.firstElementChild;
    const description = document.createElement('p');
    description.classList.add('aos-init', 'aos-animate');
    description.textContent = descriptionCell.textContent.trim();
    moveInstrumentation(descriptionRow, description);
    sectionHeader.append(description);
  }

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
  mobileContainer.setAttribute('data-aos', 'fade-up');
  mobileContainer.setAttribute('data-aos-offset', '100');
  mobileContainer.setAttribute('data-aos-duration', '650');
  mobileContainer.setAttribute('data-aos-easing', 'ease-in-out');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider', 'flickity-enabled', 'is-draggable');
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
  let currentSlide;
  let currentMobileRow;

  // Process businessVerticals items
  itemRows.forEach((row, index) => {
    const [imageCell, titleCell, linkCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col', 'aos-init', 'aos-animate');
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`); // Example delay logic

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');
    col.append(wrap);

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    wrap.append(imageDiv);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imageDiv.append(optimizedPic);
      }
    }

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell.textContent.trim();
    wrap.append(titleDiv);

    // Add the SVG icon directly from the original HTML (static UI element)
    const svgIcon = document.createElement('img');
    svgIcon.setAttribute('loading', 'lazy');
    svgIcon.src = '/content/dam/aemigrate/uploaded-folder/www-mahindra-com/image/tilt-white-arrow-2e81f5.svg';
    svgIcon.alt = titleCell.textContent.trim();
    svgIcon.width = '10';
    svgIcon.height = '29';
    titleDiv.append(svgIcon);

    const linkEl = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.classList.add('stretched-link');
      linkEl.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
      wrap.append(linkEl);
    }
    moveInstrumentation(row, col);
    desktopRow.append(col);

    // Mobile Slider Logic
    if (index % itemsPerSlide === 0) {
      currentSlide = document.createElement('div');
      currentSlide.classList.add('slides');
      if (index === 0) {
        currentSlide.classList.add('is-selected');
      }
      flickitySlider.append(currentSlide);

      currentMobileRow = document.createElement('div');
      currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentSlide.append(currentMobileRow);
      mobileSlides.push(currentSlide);
    }

    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    currentMobileRow.append(mobileCol);

    const mobileWrap = document.createElement('div');
    mobileWrap.classList.add('wrap');
    mobileCol.append(mobileWrap);

    // Clone and append content for mobile
    const clonedImageDiv = imageDiv.cloneNode(true);
    mobileWrap.append(clonedImageDiv);
    const clonedTitleDiv = titleDiv.cloneNode(true);
    mobileWrap.append(clonedTitleDiv);
    const clonedLinkEl = linkEl.cloneNode(true);
    mobileWrap.append(clonedLinkEl);
  });

  // Add Flickity page dots for mobile
  if (mobileSlides.length > 0) {
    const pageDots = document.createElement('ol');
    pageDots.classList.add('flickity-page-dots');
    mobileSlides.forEach((_, i) => {
      const dot = document.createElement('li');
      dot.classList.add('dot');
      if (i === 0) {
        dot.classList.add('is-selected');
        dot.setAttribute('aria-current', 'step');
      }
      dot.setAttribute('aria-label', `Page dot ${i + 1}`);
      pageDots.append(dot);
    });
    mobileSlider.append(pageDots);
  }

  block.replaceWith(section);
}
