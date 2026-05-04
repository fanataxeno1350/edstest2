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

  // Heading - find the row that contains an h2-like element
  const headingRow = children.find(row => row.querySelector('div')?.textContent.trim() === 'Heading label text'); // Using textContent for detection as per EDS guide
  const headingCell = headingRow?.querySelector('div');
  if (headingCell) {
    const h2 = document.createElement('h2');
    h2.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    h2.setAttribute('data-aos', 'fade-up');
    h2.setAttribute('data-aos-offset', '100');
    h2.setAttribute('data-aos-duration', '650');
    h2.setAttribute('data-aos-easing', 'ease-in-out');
    h2.textContent = headingCell.textContent.trim();
    moveInstrumentation(headingRow, h2);
    sectionHeader.append(h2);
  }

  // Description - find the row that contains a p-like element
  const descriptionRow = children.find(row => row.querySelector('div')?.textContent.trim() === 'Description label text'); // Using textContent for detection as per EDS guide
  const descriptionCell = descriptionRow?.querySelector('div');
  if (descriptionCell) {
    const p = document.createElement('p'); // Corrected classList.add syntax
    p.classList.add('aos-init', 'aos-animate'); // Added missing classes
    p.setAttribute('data-aos', 'fade-up');
    p.setAttribute('data-aos-offset', '100');
    p.setAttribute('data-aos-duration', '650');
    p.setAttribute('data-aos-easing', 'ease-in-out');
    p.textContent = descriptionCell.textContent.trim();
    moveInstrumentation(descriptionRow, p);
    sectionHeader.append(p);
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
  mobileSlider.classList.add('mobile-slider');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileContainer.append(mobileSlider);

  const mobileSlides = [];
  let currentMobileSlide = document.createElement('div');
  currentMobileSlide.classList.add('slides');
  let mobileSlideRow = document.createElement('div');
  mobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentMobileSlide.append(mobileSlideRow);
  mobileSlides.push(currentMobileSlide);

  // Business Vertical Items (rows after heading and description)
  // Filter out the heading and description rows to get only item rows
  const itemRows = children.filter(row => {
    const cells = [...row.children];
    return cells.length === 3 && cells[0].querySelector('picture') && cells[1].textContent && cells[2].querySelector('a');
  });

  itemRows.forEach((row, index) => {
    const cells = [...row.children];
    // Destructuring is safe here as per BlockJson and EDS guide for fixed-field item models
    const [imageCell, titleCell, linkCell] = cells;

    const col = document.createElement('div');
    col.classList.add('col', 'aos-init', 'aos-animate');
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', `${(index % 3) * 300 + 100}`); // Staggered delay

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
    const arrowImg = document.createElement('img');
    arrowImg.loading = 'lazy';
    arrowImg.src = '/content/dam/aemigrate/uploaded-folder/www-mahindra-com/image/tilt-white-arrow-2e81f5.svg';
    arrowImg.alt = 'Arrow';
    arrowImg.width = '10';
    arrowImg.height = '29';
    titleDiv.append(' ', arrowImg);
    wrap.append(titleDiv);

    const link = document.createElement('a');
    link.classList.add('stretched-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.setAttribute('aria-label', `Learn more about ${titleCell.textContent.trim()}`);
    }
    moveInstrumentation(row, link);
    wrap.append(link);

    // Append to desktop view
    desktopRow.append(col);

    // Append to mobile view (3 items per slide)
    const mobileCol = col.cloneNode(true); // Clone the entire card for mobile
    if (mobileSlideRow.children.length === 3) {
      currentMobileSlide = document.createElement('div');
      currentMobileSlide.classList.add('slides');
      mobileSlideRow = document.createElement('div');
      mobileSlideRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentMobileSlide.append(mobileSlideRow);
      mobileSlides.push(currentMobileSlide);
    }
    mobileSlideRow.append(mobileCol);
  });

  mobileSlides.forEach((slide) => mobileSlider.append(slide));

  block.replaceWith(section);
}
