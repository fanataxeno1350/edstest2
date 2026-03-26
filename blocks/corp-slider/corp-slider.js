import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, sliderTitleRow, slidesContainerRow, ...itemRows] = [...block.children];

  const rangeComponent = document.createElement('div');
  rangeComponent.classList.add('range-component');

  // Heading
  if (headingRow) {
    const headingDiv = document.createElement('div');
    headingDiv.classList.add('row');
    const galleryHeaderDiv = document.createElement('div');
    galleryHeaderDiv.classList.add('col-md12', 'col-sm-12', 'col-md-12', 'gallery-header');
    
    // The heading content is directly inside the first child of headingRow
    // BlockJson indicates 'heading' is a richtext field, so it contains the full HTML.
    // The original HTML shows <p><strong>Heading text content</strong></p> inside the div.
    // We should append the content directly, not try to reconstruct it.
    if (headingRow.firstElementChild) {
      moveInstrumentation(headingRow.firstElementChild, galleryHeaderDiv);
      galleryHeaderDiv.append(...headingRow.firstElementChild.children); // Append all children (e.g., p tag)
    }
    
    headingDiv.append(galleryHeaderDiv);
    rangeComponent.append(headingDiv);
  }

  // Slider Title
  if (sliderTitleRow) {
    const sliderTitleDiv = document.createElement('div');
    sliderTitleDiv.classList.add('slider-title');
    moveInstrumentation(sliderTitleRow.firstElementChild, sliderTitleDiv);
    const h4 = document.createElement('h4');
    h4.id = sliderTitleRow.firstElementChild.textContent.trim().toLowerCase();
    h4.textContent = sliderTitleRow.firstElementChild.textContent.trim();
    sliderTitleDiv.append(h4);
    rangeComponent.append(sliderTitleDiv);
  }

  // Slides (Desktop and Mobile)
  const createCarousel = (id, isMobile = false) => {
    const carousel = document.createElement('div');
    carousel.id = id;
    carousel.classList.add('carousel', 'slide');
    if (isMobile) {
      carousel.classList.add('d-sm-none');
    } else {
      carousel.classList.add('d-none', 'd-sm-block');
    }
    carousel.setAttribute('data-ride', 'carousel');

    const carouselInner = document.createElement('div');
    carouselInner.classList.add('carousel-inner');
    carousel.append(carouselInner);

    const itemsPerSlide = isMobile ? 2 : 4;
    let slideIndex = 0;

    for (let i = 0; i < itemRows.length; i += itemsPerSlide) {
      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');
      if (slideIndex === 0) {
        carouselItem.classList.add('active');
      }
      const rowDiv = document.createElement('div');
      rowDiv.classList.add('row');

      for (let j = 0; j < itemsPerSlide && (i + j) < itemRows.length; j++) {
        const itemRow = itemRows[i + j];
        // BlockJson for corp-slider-item has 4 fields: image, alt, title, link
        const [imageCell, altCell, titleCell, linkCell] = [...itemRow.children];

        const colDiv = document.createElement('div');
        colDiv.classList.add('col-6', 'col-sm-6');
        if (!isMobile) {
          colDiv.classList.add('col-lg-3');
        }

        const linkElement = linkCell.querySelector('a');
        const imageArea = document.createElement('a');
        imageArea.classList.add('image-area');
        if (linkElement) {
          imageArea.href = linkElement.href;
          moveInstrumentation(linkCell, imageArea);
        }

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        imageArea.append(imageContainer);

        const picture = imageCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          // The alt text should come from the 'alt' cell, not the img.alt attribute directly
          const optimizedPic = createOptimizedPicture(img.src, altCell.textContent.trim(), false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          imageContainer.append(optimizedPic);
        }

        const imgTitle = document.createElement('h6');
        imgTitle.classList.add('img-title');
        imgTitle.textContent = titleCell.textContent.trim();
        imageArea.append(imgTitle);

        colDiv.append(imageArea);
        rowDiv.append(colDiv);
        moveInstrumentation(itemRow, colDiv);
      }
      carouselItem.append(rowDiv);
      carouselInner.append(carouselItem);
      slideIndex++;
    }

    if (itemRows.length > itemsPerSlide) {
      const prevControl = document.createElement('a');
      prevControl.classList.add('carousel-control-prev');
      prevControl.href = `#${id}`;
      prevControl.setAttribute('role', 'button');
      prevControl.setAttribute('data-slide', 'prev'); // Add data-slide attribute as per original HTML
      
      // The original HTML uses Bootstrap's data-slide, but the JS implements manual scrolling.
      // The manual scrolling logic is fine, but the event listener should trigger the carousel's
      // built-in next/prev functionality if it were a true Bootstrap carousel.
      // For EDS, we need to implement the slide logic manually or use a simple class toggle.
      // Given the existing scrollBy, we'll keep that but ensure it's correctly applied.
      prevControl.addEventListener('click', (e) => {
        e.preventDefault();
        // To simulate Bootstrap's carousel behavior, we need to toggle 'active' class
        // and handle the sliding. The current scrollBy is not standard carousel behavior.
        // Let's implement a basic active class toggle for now.
        const activeItem = carouselInner.querySelector('.carousel-item.active');
        if (activeItem) {
          const prevItem = activeItem.previousElementSibling || carouselInner.lastElementChild;
          activeItem.classList.remove('active');
          prevItem.classList.add('active');
        }
      });

      const prevIcon = document.createElement('span');
      prevIcon.classList.add('carousel-control-prev-icon');
      prevIcon.setAttribute('aria-hidden', 'true');
      const prevSrOnly = document.createElement('span');
      prevSrOnly.classList.add('sr-only');
      prevSrOnly.textContent = 'previous';
      prevControl.append(prevIcon, prevSrOnly);
      carousel.append(prevControl);

      const nextControl = document.createElement('a');
      nextControl.classList.add('carousel-control-next');
      nextControl.href = `#${id}`;
      nextControl.setAttribute('role', 'button');
      nextControl.setAttribute('data-slide', 'next'); // Add data-slide attribute as per original HTML
      nextControl.addEventListener('click', (e) => {
        e.preventDefault();
        const activeItem = carouselInner.querySelector('.carousel-item.active');
        if (activeItem) {
          const nextItem = activeItem.nextElementSibling || carouselInner.firstElementChild;
          activeItem.classList.remove('active');
          nextItem.classList.add('active');
        }
      });

      const nextIcon = document.createElement('span');
      nextIcon.classList.add('carousel-control-next-icon');
      nextIcon.setAttribute('aria-hidden', 'true');
      const nextSrOnly = document.createElement('span');
      nextSrOnly.classList.add('sr-only');
      nextSrOnly.textContent = 'next';
      nextControl.append(nextIcon, nextSrOnly);
      carousel.append(nextControl);
    }
    return carousel;
  };

  const desktopCarousel = createCarousel('range-slider-arena-desktop', false);
  const mobileCarousel = createCarousel('range-slider-arena-mobile', true);

  rangeComponent.append(desktopCarousel, mobileCarousel);

  block.textContent = '';
  block.append(rangeComponent);
}
