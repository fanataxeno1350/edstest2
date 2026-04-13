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
    strong.textContent = headingRow.firstElementChild.textContent.trim();
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
    h4.textContent = sliderTitleRow.firstElementChild.textContent.trim();
    h4.id = h4.textContent.toLowerCase().replace(/\s/g, '-'); // Generate ID from title
    sliderTitleDiv.append(h4);
    rangeComponent.append(sliderTitleDiv);
  }

  // Slider items for desktop
  const desktopSlider = document.createElement('div');
  desktopSlider.id = 'range-slider-arena-desktop';
  desktopSlider.classList.add('carousel', 'slide', 'd-none', 'd-sm-block');
  desktopSlider.setAttribute('data-ride', 'carousel');

  const desktopCarouselInner = document.createElement('div');
  desktopCarouselInner.classList.add('carousel-inner');
  desktopSlider.append(desktopCarouselInner);

  // Slider items for mobile
  const mobileSlider = document.createElement('div');
  mobileSlider.id = 'range-slider-arena-mobile';
  mobileSlider.classList.add('carousel', 'slide', 'd-sm-none');
  mobileSlider.setAttribute('data-ride', 'carousel');

  const mobileCarouselInner = document.createElement('div');
  mobileCarouselInner.classList.add('carousel-inner');
  mobileSlider.append(mobileCarouselInner);

  const itemsPerDesktopSlide = 4;
  const itemsPerMobileSlide = 2;

  let desktopSlideIndex = 0;
  let mobileSlideIndex = 0;

  while (desktopSlideIndex * itemsPerDesktopSlide < itemRows.length || mobileSlideIndex * itemsPerMobileSlide < itemRows.length) {
    // Desktop carousel item
    if (desktopSlideIndex * itemsPerDesktopSlide < itemRows.length) {
      const desktopCarouselItem = document.createElement('div');
      desktopCarouselItem.classList.add('carousel-item');
      if (desktopSlideIndex === 0) {
        desktopCarouselItem.classList.add('active');
      }
      const desktopRow = document.createElement('div');
      desktopRow.classList.add('row');
      desktopCarouselItem.append(desktopRow);

      for (let i = 0; i < itemsPerDesktopSlide; i += 1) {
        const itemRowIndex = desktopSlideIndex * itemsPerDesktopSlide + i;
        if (itemRowIndex < itemRows.length) {
          const itemRow = itemRows[itemRowIndex];
          const cells = [...itemRow.children];

          const colDiv = document.createElement('div');
          colDiv.classList.add('col-6', 'col-sm-6', 'col-lg-3');

          const linkEl = document.createElement('a');
          linkEl.classList.add('image-area');
          const linkCell = cells.find((cell) => cell.querySelector('a'));
          const foundLink = linkCell?.querySelector('a');
          if (foundLink) {
            linkEl.href = foundLink.href;
            moveInstrumentation(linkCell, linkEl);
          }

          const imageContainer = document.createElement('div');
          imageContainer.classList.add('image-container');
          imageContainer.setAttribute('target', '_self');

          const imageCell = cells.find((cell) => cell.querySelector('picture'));
          const picture = imageCell?.querySelector('picture');
          if (picture) {
            const img = picture.querySelector('img');
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            imageContainer.append(optimizedPic);
            optimizedPic.querySelector('img').classList.add('img-fluid');
          }

          const titleEl = document.createElement('h6');
          titleEl.classList.add('img-title');
          // Find the cell that contains the title text, assuming it's not the image or link cell
          const titleCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '');
          if (titleCell) {
            moveInstrumentation(titleCell, titleEl);
            titleEl.textContent = titleCell.textContent.trim();
          }

          linkEl.append(imageContainer, titleEl);
          colDiv.append(linkEl);
          desktopRow.append(colDiv);
        }
      }
      desktopCarouselInner.append(desktopCarouselItem);
      desktopSlideIndex += 1;
    }

    // Mobile carousel item
    if (mobileSlideIndex * itemsPerMobileSlide < itemRows.length) {
      const mobileCarouselItem = document.createElement('div');
      mobileCarouselItem.classList.add('carousel-item');
      if (mobileSlideIndex === 0) {
        mobileCarouselItem.classList.add('active');
      }
      const mobileRow = document.createElement('div');
      mobileRow.classList.add('row');
      mobileCarouselItem.append(mobileRow);

      for (let i = 0; i < itemsPerMobileSlide; i += 1) {
        const itemRowIndex = mobileSlideIndex * itemsPerMobileSlide + i;
        if (itemRowIndex < itemRows.length) {
          const itemRow = itemRows[itemRowIndex];
          const cells = [...itemRow.children];

          const colDiv = document.createElement('div');
          colDiv.classList.add('col-6', 'col-sm-6', 'col-lg-3');

          const linkEl = document.createElement('a');
          linkEl.classList.add('image-area');
          const linkCell = cells.find((cell) => cell.querySelector('a'));
          const foundLink = linkCell?.querySelector('a');
          if (foundLink) {
            linkEl.href = foundLink.href;
            moveInstrumentation(linkCell, linkEl);
          }

          const imageContainer = document.createElement('div');
          imageContainer.classList.add('image-container');
          imageContainer.setAttribute('target', '_self');

          const imageCell = cells.find((cell) => cell.querySelector('picture'));
          const picture = imageCell?.querySelector('picture');
          if (picture) {
            const img = picture.querySelector('img');
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            imageContainer.append(optimizedPic);
            optimizedPic.querySelector('img').classList.add('img-fluid');
          }

          const titleEl = document.createElement('h6');
          titleEl.classList.add('img-title');
          const titleCell = cells.find((cell) => !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '');
          if (titleCell) {
            moveInstrumentation(titleCell, titleEl);
            titleEl.textContent = titleCell.textContent.trim();
          }

          linkEl.append(imageContainer, titleEl);
          colDiv.append(linkEl);
          mobileRow.append(colDiv);
        }
      }
      mobileCarouselInner.append(mobileCarouselItem);
      mobileSlideIndex += 1;
    }
  }

  // Carousel controls for desktop
  if (itemRows.length > itemsPerDesktopSlide) {
    const prevControlDesktop = document.createElement('a');
    prevControlDesktop.classList.add('carousel-control-prev');
    prevControlDesktop.href = '#range-slider-arena-desktop';
    prevControlDesktop.setAttribute('role', 'button');
    // data-slide="prev" is not needed for custom JS handling
    const prevIconDesktop = document.createElement('span');
    prevIconDesktop.classList.add('carousel-control-prev-icon');
    prevIconDesktop.setAttribute('aria-hidden', 'true');
    const prevSrOnlyDesktop = document.createElement('span');
    prevSrOnlyDesktop.classList.add('sr-only');
    prevSrOnlyDesktop.textContent = 'previous';
    prevControlDesktop.append(prevIconDesktop, prevSrOnlyDesktop);
    desktopSlider.append(prevControlDesktop);

    const nextControlDesktop = document.createElement('a');
    nextControlDesktop.classList.add('carousel-control-next');
    nextControlDesktop.href = '#range-slider-arena-desktop';
    nextControlDesktop.setAttribute('role', 'button');
    // data-slide="next" is not needed for custom JS handling
    const nextIconDesktop = document.createElement('span');
    nextIconDesktop.classList.add('carousel-control-next-icon');
    nextIconDesktop.setAttribute('aria-hidden', 'true');
    const nextSrOnlyDesktop = document.createElement('span');
    nextSrOnlyDesktop.classList.add('sr-only');
    nextSrOnlyDesktop.textContent = 'next';
    nextControlDesktop.append(nextIconDesktop, nextSrOnlyDesktop);
    desktopSlider.append(nextControlDesktop);

    // Add event listeners for desktop carousel controls
    prevControlDesktop.addEventListener('click', (e) => {
      e.preventDefault();
      const activeItem = desktopCarouselInner.querySelector('.carousel-item.active');
      const prevItem = activeItem.previousElementSibling || desktopCarouselInner.lastElementChild;
      if (prevItem) {
        activeItem.classList.remove('active');
        prevItem.classList.add('active');
      }
    });

    nextControlDesktop.addEventListener('click', (e) => {
      e.preventDefault();
      const activeItem = desktopCarouselInner.querySelector('.carousel-item.active');
      const nextItem = activeItem.nextElementSibling || desktopCarouselInner.firstElementChild;
      if (nextItem) {
        activeItem.classList.remove('active');
        nextItem.classList.add('active');
      }
    });
  }

  // Carousel controls for mobile
  if (itemRows.length > itemsPerMobileSlide) {
    const prevControlMobile = document.createElement('a');
    prevControlMobile.classList.add('carousel-control-prev');
    prevControlMobile.href = '#range-slider-arena-mobile';
    prevControlMobile.setAttribute('role', 'button');
    // data-slide="prev" is not needed for custom JS handling
    const prevIconMobile = document.createElement('span');
    prevIconMobile.classList.add('carousel-control-prev-icon');
    prevIconMobile.setAttribute('aria-hidden', 'true');
    const prevSrOnlyMobile = document.createElement('span');
    prevSrOnlyMobile.classList.add('sr-only');
    prevSrOnlyMobile.textContent = 'previous';
    prevControlMobile.append(prevIconMobile, prevSrOnlyMobile);
    mobileSlider.append(prevControlMobile);

    const nextControlMobile = document.createElement('a');
    nextControlMobile.classList.add('carousel-control-next');
    nextControlMobile.href = '#range-slider-arena-mobile';
    nextControlMobile.setAttribute('role', 'button');
    // data-slide="next" is not needed for custom JS handling
    const nextIconMobile = document.createElement('span');
    nextIconMobile.classList.add('carousel-control-next-icon');
    nextIconMobile.setAttribute('aria-hidden', 'true');
    const nextSrOnlyMobile = document.createElement('span');
    nextSrOnlyMobile.classList.add('sr-only');
    nextSrOnlyMobile.textContent = 'next';
    nextControlMobile.append(nextIconMobile, nextSrOnlyMobile);
    mobileSlider.append(nextControlMobile);

    // Add event listeners for mobile carousel controls
    prevControlMobile.addEventListener('click', (e) => {
      e.preventDefault();
      const activeItem = mobileCarouselInner.querySelector('.carousel-item.active');
      const prevItem = activeItem.previousElementSibling || mobileCarouselInner.lastElementChild;
      if (prevItem) {
        activeItem.classList.remove('active');
        prevItem.classList.add('active');
      }
    });

    nextControlMobile.addEventListener('click', (e) => {
      e.preventDefault();
      const activeItem = mobileCarouselInner.querySelector('.carousel-item.active');
      const nextItem = activeItem.nextElementSibling || mobileCarouselInner.firstElementChild;
      if (nextItem) {
        activeItem.classList.remove('active');
        nextItem.classList.add('active');
      }
    });
  }

  rangeComponent.append(desktopSlider, mobileSlider);

  block.textContent = '';
  block.append(rangeComponent);
}
