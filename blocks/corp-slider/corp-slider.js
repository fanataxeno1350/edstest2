import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [mainHeadingRow, sliderTitleRow, ...itemRows] = [...block.children];

  const rangeComponent = document.createElement('div');
  rangeComponent.classList.add('range-component');

  // Main Heading
  if (mainHeadingRow) {
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-md12', 'col-sm-12', 'col-md-12', 'gallery-header');
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    // Use content detection for the cell within mainHeadingRow
    const mainHeadingCell = [...mainHeadingRow.children].find(cell => cell.textContent.trim() !== '');
    if (mainHeadingCell) {
      moveInstrumentation(mainHeadingCell, strong);
      while (mainHeadingCell.firstChild) {
        strong.append(mainHeadingCell.firstChild);
      }
    }
    p.append(strong);
    colDiv.append(p);
    rowDiv.append(colDiv);
    rangeComponent.append(rowDiv);
  }

  // Slider Title
  if (sliderTitleRow) {
    const sliderTitleDiv = document.createElement('div');
    sliderTitleDiv.classList.add('slider-title');
    const h4 = document.createElement('h4');
    // Use content detection for the cell within sliderTitleRow
    const sliderTitleCell = [...sliderTitleRow.children].find(cell => cell.textContent.trim() !== '');
    if (sliderTitleCell) {
      h4.id = sliderTitleCell.textContent.trim().toLowerCase().replace(/\s+/g, '-');
      moveInstrumentation(sliderTitleCell, h4);
      while (sliderTitleCell.firstChild) {
        h4.append(sliderTitleCell.firstChild);
      }
    }
    sliderTitleDiv.append(h4);
    rangeComponent.append(sliderTitleDiv);
  }

  // Slider for desktop
  const desktopSlider = document.createElement('div');
  desktopSlider.id = 'range-slider-arena-desktop';
  desktopSlider.classList.add('carousel', 'slide', 'd-none', 'd-sm-block');
  desktopSlider.setAttribute('data-ride', 'carousel');

  const desktopCarouselInner = document.createElement('div');
  desktopCarouselInner.classList.add('carousel-inner');
  desktopSlider.append(desktopCarouselInner);

  // Slider for mobile
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

  while (itemRows.length > 0) {
    // Desktop slide
    const desktopCarouselItem = document.createElement('div');
    desktopCarouselItem.classList.add('carousel-item');
    if (desktopSlideIndex === 0) desktopCarouselItem.classList.add('active');
    const desktopRowDiv = document.createElement('div');
    desktopRowDiv.classList.add('row');
    desktopCarouselItem.append(desktopRowDiv);

    // Mobile slide
    const mobileCarouselItem = document.createElement('div');
    mobileCarouselItem.classList.add('carousel-item');
    if (mobileSlideIndex === 0) mobileCarouselItem.classList.add('active');
    const mobileRowDiv = document.createElement('div');
    mobileRowDiv.classList.add('row');
    mobileCarouselItem.append(mobileRowDiv);

    for (let i = 0; i < itemsPerDesktopSlide && itemRows.length > 0; i++) {
      const itemRow = itemRows.shift();
      const cells = [...itemRow.children];

      const imageCell = cells.find(cell => cell.querySelector('picture'));
      const linkCell = cells.find(cell => cell.querySelector('a'));
      const titleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

      if (imageCell && linkCell && titleCell) {
        const linkEl = linkCell.querySelector('a');
        const href = linkEl ? linkEl.href : '#';
        const titleText = titleCell.textContent.trim();

        // Desktop item
        const desktopCol = document.createElement('div');
        desktopCol.classList.add('col-6', 'col-sm-6', 'col-lg-3');
        const desktopImageArea = document.createElement('a');
        desktopImageArea.classList.add('image-area');
        desktopImageArea.href = href;
        moveInstrumentation(itemRow, desktopImageArea);

        const desktopImageContainer = document.createElement('div');
        desktopImageContainer.classList.add('image-container');
        const img = imageCell.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          desktopImageContainer.append(optimizedPic);
          optimizedPic.querySelector('img').classList.add('img-fluid');
        }
        desktopImageArea.append(desktopImageContainer);

        const desktopImgTitle = document.createElement('h6');
        desktopImgTitle.classList.add('img-title');
        desktopImgTitle.textContent = titleText;
        desktopImageArea.append(desktopImgTitle);
        desktopCol.append(desktopImageArea);
        desktopRowDiv.append(desktopCol);

        // Mobile item (only add if we haven't filled a mobile slide yet)
        if (mobileRowDiv.children.length < itemsPerMobileSlide) {
          const mobileCol = document.createElement('div');
          mobileCol.classList.add('col-6', 'col-sm-6', 'col-lg-3');
          const mobileImageArea = document.createElement('a');
          mobileImageArea.classList.add('image-area');
          mobileImageArea.href = href;
          moveInstrumentation(itemRow, mobileImageArea); // Re-use instrumentation for mobile if needed

          const mobileImageContainer = document.createElement('div');
          mobileImageContainer.classList.add('image-container');
          const mobileImg = imageCell.querySelector('img');
          if (mobileImg) {
            const optimizedPic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '750' }]);
            moveInstrumentation(mobileImg, optimizedPic.querySelector('img'));
            mobileImageContainer.append(optimizedPic);
            optimizedPic.querySelector('img').classList.add('img-fluid');
          }
          mobileImageArea.append(mobileImageContainer);

          const mobileImgTitle = document.createElement('h6');
          mobileImgTitle.classList.add('img-title');
          mobileImgTitle.textContent = titleText;
          mobileImageArea.append(mobileImgTitle);
          mobileCol.append(mobileImageArea);
          mobileRowDiv.append(mobileCol);
        }
      }
    }

    if (desktopRowDiv.children.length > 0) {
      desktopCarouselInner.append(desktopCarouselItem);
      desktopSlideIndex++;
    }
    if (mobileRowDiv.children.length > 0) {
      mobileCarouselInner.append(mobileCarouselItem);
      mobileSlideIndex++;
    }
  }

  // Add controls for desktop slider
  if (desktopCarouselInner.children.length > 1) {
    const prevBtnDesktop = document.createElement('a');
    prevBtnDesktop.classList.add('carousel-control-prev');
    prevBtnDesktop.href = '#range-slider-arena-desktop';
    prevBtnDesktop.setAttribute('role', 'button');
    prevBtnDesktop.setAttribute('data-slide', 'prev'); // Added data-slide attribute
    const prevSpanDesktop = document.createElement('span');
    prevSpanDesktop.classList.add('carousel-control-prev-icon');
    prevSpanDesktop.setAttribute('aria-hidden', 'true');
    const srOnlyPrevDesktop = document.createElement('span');
    srOnlyPrevDesktop.classList.add('sr-only');
    srOnlyPrevDesktop.textContent = 'previous';
    prevBtnDesktop.append(prevSpanDesktop, srOnlyPrevDesktop);
    desktopSlider.append(prevBtnDesktop);

    const nextBtnDesktop = document.createElement('a');
    nextBtnDesktop.classList.add('carousel-control-next');
    nextBtnDesktop.href = '#range-slider-arena-desktop';
    nextBtnDesktop.setAttribute('role', 'button');
    nextBtnDesktop.setAttribute('data-slide', 'next'); // Added data-slide attribute
    const nextSpanDesktop = document.createElement('span');
    nextSpanDesktop.classList.add('carousel-control-next-icon');
    nextSpanDesktop.setAttribute('aria-hidden', 'true');
    const srOnlyNextDesktop = document.createElement('span');
    srOnlyNextDesktop.classList.add('sr-only');
    srOnlyNextDesktop.textContent = 'next';
    nextBtnDesktop.append(nextSpanDesktop, srOnlyNextDesktop);
    desktopSlider.append(nextBtnDesktop);

    let currentDesktopSlide = 0;
    prevBtnDesktop.addEventListener('click', (e) => {
      e.preventDefault();
      desktopCarouselInner.children[currentDesktopSlide].classList.remove('active');
      currentDesktopSlide = (currentDesktopSlide - 1 + desktopCarouselInner.children.length) % desktopCarouselInner.children.length;
      desktopCarouselInner.children[currentDesktopSlide].classList.add('active');
    });
    nextBtnDesktop.addEventListener('click', (e) => {
      e.preventDefault();
      desktopCarouselInner.children[currentDesktopSlide].classList.remove('active');
      currentDesktopSlide = (currentDesktopSlide + 1) % desktopCarouselInner.children.length;
      desktopCarouselInner.children[currentDesktopSlide].classList.add('active');
    });
  }

  // Add controls for mobile slider
  if (mobileCarouselInner.children.length > 1) {
    const prevBtnMobile = document.createElement('a');
    prevBtnMobile.classList.add('carousel-control-prev');
    prevBtnMobile.href = '#range-slider-arena-mobile';
    prevBtnMobile.setAttribute('role', 'button');
    prevBtnMobile.setAttribute('data-slide', 'prev'); // Added data-slide attribute
    const prevSpanMobile = document.createElement('span');
    prevSpanMobile.classList.add('carousel-control-prev-icon');
    prevSpanMobile.setAttribute('aria-hidden', 'true');
    const srOnlyPrevMobile = document.createElement('span');
    srOnlyPrevMobile.classList.add('sr-only');
    srOnlyPrevMobile.textContent = 'previous';
    prevBtnMobile.append(prevSpanMobile, srOnlyPrevMobile);
    mobileSlider.append(prevBtnMobile);

    const nextBtnMobile = document.createElement('a');
    nextBtnMobile.classList.add('carousel-control-next');
    nextBtnMobile.href = '#range-slider-arena-mobile';
    nextBtnMobile.setAttribute('role', 'button');
    nextBtnMobile.setAttribute('data-slide', 'next'); // Added data-slide attribute
    const nextSpanMobile = document.createElement('span');
    nextSpanMobile.classList.add('carousel-control-next-icon');
    nextSpanMobile.setAttribute('aria-hidden', 'true');
    const srOnlyNextMobile = document.createElement('span');
    srOnlyNextMobile.classList.add('sr-only');
    srOnlyNextMobile.textContent = 'next';
    nextBtnMobile.append(nextSpanMobile, srOnlyNextMobile);
    mobileSlider.append(nextBtnMobile);

    let currentMobileSlide = 0;
    prevBtnMobile.addEventListener('click', (e) => {
      e.preventDefault();
      mobileCarouselInner.children[currentMobileSlide].classList.remove('active');
      currentMobileSlide = (currentMobileSlide - 1 + mobileCarouselInner.children.length) % mobileCarouselInner.children.length;
      mobileCarouselInner.children[currentMobileSlide].classList.add('active');
    });
    nextBtnMobile.addEventListener('click', (e) => {
      e.preventDefault();
      mobileCarouselInner.children[currentMobileSlide].classList.remove('active');
      currentMobileSlide = (currentMobileSlide + 1) % mobileCarouselInner.children.length;
      mobileCarouselInner.children[currentMobileSlide].classList.add('active');
    });
  }

  rangeComponent.append(desktopSlider, mobileSlider);

  block.textContent = '';
  block.append(rangeComponent);
}
