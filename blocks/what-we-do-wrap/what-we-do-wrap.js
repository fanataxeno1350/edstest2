import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...itemRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center');

  const heading = document.createElement('h2');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.firstElementChild.textContent;
  sectionHeader.append(heading);

  const description = document.createElement('p');
  moveInstrumentation(descriptionRow.firstElementChild, description);
  description.classList.add('aos-init', 'aos-animate');
  while (descriptionRow.firstElementChild.firstChild) {
    description.append(descriptionRow.firstElementChild.firstChild);
  }
  sectionHeader.append(description);

  const container = document.createElement('div');
  container.classList.add('container');
  container.append(sectionHeader);

  const ourBusinessVerticals = document.createElement('div');
  ourBusinessVerticals.classList.add('our-business-verticals');

  const desktopContainer = document.createElement('div');
  desktopContainer.classList.add('container', 'd-lg-block', 'd-none');
  const desktopRow = document.createElement('div');
  desktopRow.classList.add('row', 'row-cols-lg-3', 'row-cols-1', 'g-3');

  const mobileContainer = document.createElement('div');
  mobileContainer.classList.add('container', 'd-lg-none', 'd-block', 'aos-init', 'aos-animate');
  const mobileSlider = document.createElement('div');
  mobileSlider.classList.add('mobile-slider', 'flickity-enabled', 'is-draggable');
  mobileSlider.setAttribute('data-flickity', '{ "wrapAround": false, "lazyLoad": true, "pageDots": true, "prevNextButtons": false, "imagesLoaded": true, "cellAlign": "left", "adaptiveHeight": true }');
  mobileSlider.setAttribute('tabindex', '0');
  const flickityViewport = document.createElement('div');
  flickityViewport.classList.add('flickity-viewport');
  const flickitySlider = document.createElement('div');
  flickitySlider.classList.add('flickity-slider');
  flickityViewport.append(flickitySlider);
  mobileSlider.append(flickityViewport);
  mobileContainer.append(mobileSlider);

  const mobileSlides = [];
  let currentSlide = document.createElement('div');
  currentSlide.classList.add('slides');
  let currentMobileRow = document.createElement('div');
  currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
  currentSlide.append(currentMobileRow);
  mobileSlides.push(currentSlide);

  itemRows.forEach((row, index) => {
    const col = document.createElement('div');
    moveInstrumentation(row, col);
    col.classList.add('col', 'aos-init', 'aos-animate');
    if (index % 3 === 0) {
      col.setAttribute('data-aos-delay', '100');
    } else if (index % 3 === 1) {
      col.setAttribute('data-aos-delay', '400');
    } else {
      col.setAttribute('data-aos-delay', '700');
    }

    const wrap = document.createElement('div');
    wrap.classList.add('wrap');

    let imageCell;
    let titleCell;
    let linkCell;

    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) {
        imageCell = cell;
      } else if (cell.querySelector('a')) {
        linkCell = cell;
      } else {
        titleCell = cell;
      }
    });

    if (imageCell) {
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('image');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 992px)', width: '376' }, { media: '(min-width: 450px)', width: '376' }, { width: '376' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imageDiv.append(optimizedPic);
        }
      }
      wrap.append(imageDiv);
    }

    if (titleCell) {
      const titleDiv = document.createElement('div');
      titleDiv.classList.add('title');
      moveInstrumentation(titleCell, titleDiv);
      while (titleCell.firstChild) {
        titleDiv.append(titleCell.firstChild);
      }
      wrap.append(titleDiv);
    }

    if (linkCell) {
      const link = linkCell.querySelector('a');
      if (link) {
        const stretchedLink = document.createElement('a');
        stretchedLink.classList.add('stretched-link');
        stretchedLink.href = link.href;
        stretchedLink.setAttribute('aria-label', link.textContent);
        wrap.append(stretchedLink);
      }
    }

    col.append(wrap);
    desktopRow.append(col);

    // Mobile slider logic
    if (currentMobileRow.children.length === 3) {
      currentSlide = document.createElement('div');
      currentSlide.classList.add('slides');
      currentMobileRow = document.createElement('div');
      currentMobileRow.classList.add('row', 'row-cols-1', 'gy-3');
      currentSlide.append(currentMobileRow);
      mobileSlides.push(currentSlide);
    }
    const mobileCol = col.cloneNode(true); // Clone the desktop column structure
    currentMobileRow.append(mobileCol);
  });

  desktopContainer.append(desktopRow);
  ourBusinessVerticals.append(desktopContainer);

  mobileSlides.forEach((slide, index) => {
    flickitySlider.append(slide);
    if (index === 0) {
      slide.classList.add('is-selected');
    } else {
      slide.setAttribute('aria-hidden', 'true');
    }
  });

  const pageDots = document.createElement('ol');
  pageDots.classList.add('flickity-page-dots');
  for (let i = 0; i < mobileSlides.length; i += 1) {
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

  ourBusinessVerticals.append(mobileContainer);

  block.textContent = '';
  block.append(container, ourBusinessVerticals);
}
