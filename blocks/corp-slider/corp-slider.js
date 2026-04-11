import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, sliderTitleRow, ...itemRows] = [...block.children];

  const rangeComponent = document.createElement('div');
  rangeComponent.classList.add('range-component');

  // Heading
  if (headingRow) {
    const headingDiv = document.createElement('div');
    headingDiv.classList.add('row');
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-md12', 'col-sm-12', 'col-md-12', 'gallery-header');
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    moveInstrumentation(headingRow.firstElementChild, strong);
    strong.append(headingRow.firstElementChild.textContent);
    p.append(strong);
    colDiv.append(p);
    headingDiv.append(colDiv);
    rangeComponent.append(headingDiv);
  }

  // Slider Title
  if (sliderTitleRow) {
    const sliderTitleDiv = document.createElement('div');
    sliderTitleDiv.classList.add('slider-title');
    const h4 = document.createElement('h4');
    moveInstrumentation(sliderTitleRow.firstElementChild, h4);
    h4.id = sliderTitleRow.firstElementChild.textContent.toLowerCase().replace(/\s/g, '-');
    h4.textContent = sliderTitleRow.firstElementChild.textContent;
    sliderTitleDiv.append(h4);
    rangeComponent.append(sliderTitleDiv);
  }

  // Slider Items
  const createSliderContent = (itemsPerSlide, idSuffix, isMobile = false) => {
    const carouselDiv = document.createElement('div');
    carouselDiv.id = `range-slider-${idSuffix}`; // Changed ID to match original HTML pattern
    carouselDiv.classList.add('carousel', 'slide');
    if (isMobile) {
      carouselDiv.classList.add('d-sm-none');
    } else {
      carouselDiv.classList.add('d-none', 'd-sm-block');
    }

    const carouselInner = document.createElement('div');
    carouselInner.classList.add('carousel-inner');

    let slideIndex = 0;
    for (let i = 0; i < itemRows.length; i += itemsPerSlide) {
      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');
      if (slideIndex === 0) { // Set the first item as active
        carouselItem.classList.add('active');
      }

      const rowDiv = document.createElement('div');
      rowDiv.classList.add('row');

      for (let j = 0; j < itemsPerSlide && (i + j) < itemRows.length; j++) {
        const itemRow = itemRows[i + j];
        const cells = [...itemRow.children];

        const colDiv = document.createElement('div');
        colDiv.classList.add('col-6', 'col-sm-6', 'col-lg-3');

        const linkElement = itemRow.querySelector('a');
        const imageArea = document.createElement('a');
        imageArea.classList.add('image-area');
        imageArea.href = linkElement ? linkElement.href : '#';
        if (linkElement) moveInstrumentation(linkElement, imageArea);

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        imageContainer.setAttribute('target', '_self');

        const picture = itemRow.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          optimizedPic.querySelector('img').classList.add('img-fluid');
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imageContainer.append(optimizedPic);
        }

        // FIX: Replaced itemRow.children[2] with content detection for titleCell
        const titleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '');
        const h6 = document.createElement('h6');
        h6.classList.add('img-title');
        if (titleCell) {
          moveInstrumentation(titleCell, h6);
          h6.textContent = titleCell.textContent.trim();
        }


        imageArea.append(imageContainer, h6);
        colDiv.append(imageArea);
        rowDiv.append(colDiv);
      }
      carouselItem.append(rowDiv);
      carouselInner.append(carouselItem);
      slideIndex++;
    }
    carouselDiv.append(carouselInner);

    // Add controls
    const prevControl = document.createElement('a');
    prevControl.classList.add('carousel-control-prev');
    prevControl.href = `#${carouselDiv.id}`;
    prevControl.setAttribute('role', 'button');
    prevControl.setAttribute('data-slide', 'prev'); // Added data-slide attribute
    const prevIcon = document.createElement('span');
    prevIcon.classList.add('carousel-control-prev-icon');
    prevIcon.setAttribute('aria-hidden', 'true');
    const prevSrOnly = document.createElement('span');
    prevSrOnly.classList.add('sr-only');
    prevSrOnly.textContent = 'previous';
    prevControl.append(prevIcon, prevSrOnly);

    const nextControl = document.createElement('a');
    nextControl.classList.add('carousel-control-next');
    nextControl.href = `#${carouselDiv.id}`;
    nextControl.setAttribute('role', 'button');
    nextControl.setAttribute('data-slide', 'next'); // Added data-slide attribute
    const nextIcon = document.createElement('span');
    nextIcon.classList.add('carousel-control-next-icon');
    nextIcon.setAttribute('aria-hidden', 'true');
    const nextSrOnly = document.createElement('span');
    nextSrOnly.classList.add('sr-only');
    nextSrOnly.textContent = 'next';
    nextControl.append(nextIcon, nextSrOnly);

    carouselDiv.append(prevControl, nextControl);

    // Add event listeners for carousel functionality
    let currentSlide = 0;
    const slides = carouselInner.children;
    const totalSlides = slides.length;

    const showSlide = (index) => {
      if (totalSlides === 0) return;
      [...slides].forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
          slide.classList.add('active');
        }
      });
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      showSlide(currentSlide);
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      showSlide(currentSlide);
    };

    prevControl.addEventListener('click', (e) => {
      e.preventDefault();
      prevSlide();
    });

    nextControl.addEventListener('click', (e) => {
      e.preventDefault();
      nextSlide();
    });

    return carouselDiv;
  };

  // Desktop slider (4 items per slide)
  const desktopSlider = createSliderContent(4, 'arena-desktop', false);
  rangeComponent.append(desktopSlider);

  // Mobile slider (2 items per slide)
  const mobileSlider = createSliderContent(2, 'arena-mobile', true);
  rangeComponent.append(mobileSlider);

  block.textContent = '';
  block.append(rangeComponent);
}
