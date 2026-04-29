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

  // Heading
  // Use content detection instead of children[0] and firstElementChild
  const headingRow = children.find((row) => row.children[0] && !row.children[0].querySelector('picture') && !row.children[0].querySelector('a') && row.children[0].textContent.trim() === 'Heading label text');
  const headingCell = headingRow ? headingRow.firstElementChild : null;
  if (headingCell) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    heading.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingRow, heading);
    sectionHeader.append(heading);
  }

  // Description
  // Use content detection instead of children[1] and firstElementChild
  const descriptionRow = children.find((row) => row.children[0] && !row.children[0].querySelector('picture') && !row.children[0].querySelector('a') && row.children[0].textContent.trim() === 'Description label text');
  const descriptionCell = descriptionRow ? descriptionRow.firstElementChild : null;
  if (descriptionCell) {
    const description = document.createElement('p');
    description.classList.add('aos-init', 'aos-animate');
    description.textContent = descriptionCell.textContent.trim();
    moveInstrumentation(descriptionRow, description);
    sectionHeader.append(description);
  }

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');
  section.append(ourBusinessVerticals);

  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  ourBusinessVerticals.append(desktopContainer);

  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');
  desktopContainer.append(desktopRow);

  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  ourBusinessVerticals.append(mobileContainer);

  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider'); // flickity-enabled is-draggable added by flickity
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  const mobileSlides = [];
  let currentMobileSlide = document.createElement('div');
  currentMobileSlide.classList.add('slides');
  let mobileSlideRowCount = 0;

  let mobileSlideInnerRow = document.createElement('div');
  mobileSlideInnerRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentMobileSlide.append(mobileSlideInnerRow);

  // Business Verticals
  // Filter out the heading and description rows to get only item rows
  const itemRows = children.filter((row) => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('picture') && cells[2].querySelector('a');
  });

  itemRows.forEach((row, index) => {
    const [imageCell, titleCell, linkCell] = [...row.children];

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    const imageDiv = document.createElement('div');
    imageDiv.classList.add('image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageDiv.append(optimizedPic);
    }
    wrap.append(imageDiv);

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('title');
    titleDiv.textContent = titleCell.textContent.trim();
    // Add the SVG icon
    const arrowIcon = document.createElement('img');
    arrowIcon.loading = 'lazy';
    arrowIcon.src = '/content/dam/aemigrate/uploaded-folder/www-mahindra-com/image/tilt-white-arrow-2e81f5.svg';
    arrowIcon.alt = titleCell.textContent.trim(); // Use title as alt text
    arrowIcon.width = '10';
    arrowIcon.height = '29';
    titleDiv.append(' ', arrowIcon); // Add space before icon
    wrap.append(titleDiv);

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const authoredLink = linkCell.querySelector('a');
    if (authoredLink) {
      link.href = authoredLink.href;
      link.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    wrap.append(link);
    moveInstrumentation(row, wrap);

    // Desktop layout
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col', 'aos-init', 'aos-animate');
    desktopCol.append(wrap.cloneNode(true)); // Clone for desktop
    desktopRow.append(desktopCol);

    // Mobile layout (3 items per slide)
    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col');
    mobileCol.append(wrap); // Use original 'wrap' for mobile
    mobileSlideInnerRow.append(mobileCol);
    mobileSlideRowCount += 1;

    if (mobileSlideRowCount === 3 || index === itemRows.length - 1) {
      mobileSlides.push(currentMobileSlide);
      if (index < itemRows.length - 1) { // Only create new slide if more items exist
        currentMobileSlide = document.createElement('div');
        currentMobileSlide.classList.add('slides');
        mobileSlideRowCount = 0;
        mobileSlideInnerRow = document.createElement('div'); // Reset mobileSlideInnerRow for the new slide
        mobileSlideInnerRow.classList.add('row', 'row-cols-1', 'gy-3');
        currentMobileSlide.append(mobileSlideInnerRow);
      }
    }
  });

  mobileSlides.forEach((slide, idx) => {
    if (idx === 0) {
      slide.classList.add('is-selected');
    }
    mobileSlider.append(slide);
  });

  block.replaceWith(section);
}
