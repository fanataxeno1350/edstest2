import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // BlockJson has 3 root fields: heading, slider-title, items (container)
  // The EDS block structure shows:
  // block.children[0]: heading
  // block.children[1]: slider-title
  // block.children[2]: items (container, which is empty in the structure but acts as a separator)
  // block.children[3...N]: item rows
  const [headingRow, sliderTitleRow, itemsContainerRow, ...itemRows] = [...block.children];

  const rangeComponent = document.createElement('div');
  rangeComponent.classList.add('range-component');

  // Heading
  if (headingRow) {
    const headingDiv = document.createElement('div');
    headingDiv.classList.add('row');
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-md12', 'col-sm-12', 'col-md-12', 'gallery-header');
    moveInstrumentation(headingRow, colDiv);
    const p = headingRow.querySelector('p');
    if (p) {
      const strong = document.createElement('strong');
      while (p.firstChild) strong.append(p.firstChild);
      p.append(strong);
    }
    while (headingRow.firstChild) colDiv.append(headingRow.firstChild);
    headingDiv.append(colDiv);
    rangeComponent.append(headingDiv);
  }

  // Slider Title
  if (sliderTitleRow) {
    const sliderTitleDiv = document.createElement('div');
    sliderTitleDiv.classList.add('slider-title');
    moveInstrumentation(sliderTitleRow, sliderTitleDiv);
    const h4 = document.createElement('h4');
    h4.id = sliderTitleRow.textContent.trim().toLowerCase().replace(/\s+/g, '-');
    while (sliderTitleRow.firstChild) h4.append(sliderTitleRow.firstChild);
    sliderTitleDiv.append(h4);
    rangeComponent.append(sliderTitleDiv);
  }

  // Slider Items (Desktop)
  const desktopCarouselId = `range-slider-${sliderTitleRow.textContent.trim().toLowerCase().replace(/\s+/g, '-')}-desktop`;
  const desktopCarousel = document.createElement('div');
  desktopCarousel.id = desktopCarouselId;
  desktopCarousel.classList.add('carousel', 'slide', 'd-none', 'd-sm-block');
  // Removed data-ride="carousel" as custom JS handles the sliding

  const desktopCarouselInner = document.createElement('div');
  desktopCarouselInner.classList.add('carousel-inner');
  desktopCarousel.append(desktopCarouselInner);

  // Slider Items (Mobile)
  const mobileCarouselId = `range-slider-${sliderTitleRow.textContent.trim().toLowerCase().replace(/\s+/g, '-')}-mobile`;
  const mobileCarousel = document.createElement('div');
  mobileCarousel.id = mobileCarouselId;
  mobileCarousel.classList.add('carousel', 'slide', 'd-sm-none');
  // Removed data-ride="carousel" as custom JS handles the sliding

  const mobileCarouselInner = document.createElement('div');
  mobileCarouselInner.classList.add('carousel-inner');
  mobileCarousel.append(mobileCarouselInner);

  const itemsPerDesktopSlide = 4;
  const itemsPerMobileSlide = 2;

  let desktopSlide;
  let mobileSlide;

  itemRows.forEach((row, index) => {
    moveInstrumentation(row, row); // Keep instrumentation on the original row for now

    // Each item row has 4 cells: image, alt, title, link
    const [imageCell, altCell, titleCell, linkCell] = [...row.children];

    const linkEl = linkCell.querySelector('a');
    const href = linkEl ? linkEl.href : '#';

    // Desktop slide handling
    if (index % itemsPerDesktopSlide === 0) {
      desktopSlide = document.createElement('div');
      desktopSlide.classList.add('carousel-item');
      if (index === 0) desktopSlide.classList.add('active');
      const desktopRow = document.createElement('div');
      desktopRow.classList.add('row');
      desktopSlide.append(desktopRow);
      desktopCarouselInner.append(desktopSlide);
    }
    const desktopCol = document.createElement('div');
    desktopCol.classList.add('col-6', 'col-sm-6', 'col-lg-3');
    const desktopAnchor = document.createElement('a');
    desktopAnchor.classList.add('image-area');
    desktopAnchor.href = href;

    const desktopImageContainer = document.createElement('div');
    desktopImageContainer.classList.add('image-container');
    const picture = imageCell.querySelector('picture');
    const img = picture ? picture.querySelector('img') : null;
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, altCell.textContent.trim(), false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      desktopImageContainer.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('img-fluid');
    }
    desktopAnchor.append(desktopImageContainer);

    const desktopTitle = document.createElement('h6');
    desktopTitle.classList.add('img-title');
    desktopTitle.textContent = titleCell.textContent.trim();
    desktopAnchor.append(desktopTitle);
    desktopCol.append(desktopAnchor);
    desktopSlide.querySelector('.row').append(desktopCol);


    // Mobile slide handling
    if (index % itemsPerMobileSlide === 0) {
      mobileSlide = document.createElement('div');
      mobileSlide.classList.add('carousel-item');
      if (index === 0) mobileSlide.classList.add('active');
      const mobileRow = document.createElement('div');
      mobileRow.classList.add('row');
      mobileSlide.append(mobileRow);
      mobileCarouselInner.append(mobileSlide);
    }
    const mobileCol = document.createElement('div');
    mobileCol.classList.add('col-6', 'col-sm-6', 'col-lg-3');
    const mobileAnchor = document.createElement('a');
    mobileAnchor.classList.add('image-area');
    mobileAnchor.href = href;

    const mobileImageContainer = document.createElement('div');
    mobileImageContainer.classList.add('image-container');
    const mobilePicture = imageCell.querySelector('picture');
    const mobileImg = mobilePicture ? mobilePicture.querySelector('img') : null;
    if (mobileImg) {
      const optimizedPic = createOptimizedPicture(mobileImg.src, altCell.textContent.trim(), false, [{ width: '750' }]);
      moveInstrumentation(mobileImg, optimizedPic.querySelector('img'));
      mobileImageContainer.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('img-fluid');
    }
    mobileAnchor.append(mobileImageContainer);

    const mobileTitle = document.createElement('h6');
    mobileTitle.classList.add('img-title');
    mobileTitle.textContent = titleCell.textContent.trim();
    mobileAnchor.append(mobileTitle);
    mobileCol.append(mobileAnchor);
    mobileSlide.querySelector('.row').append(mobileCol);
  });

  // Add navigation controls for desktop carousel
  const desktopPrevButton = document.createElement('a');
  desktopPrevButton.classList.add('carousel-control-prev');
  desktopPrevButton.href = `#${desktopCarouselId}`;
  desktopPrevButton.setAttribute('role', 'button');
  desktopPrevButton.setAttribute('data-slide', 'prev'); // Added data-slide attribute
  const desktopPrevIcon = document.createElement('span');
  desktopPrevIcon.classList.add('carousel-control-prev-icon');
  desktopPrevIcon.setAttribute('aria-hidden', 'true');
  const desktopPrevSrOnly = document.createElement('span');
  desktopPrevSrOnly.classList.add('sr-only');
  desktopPrevSrOnly.textContent = 'previous';
  desktopPrevButton.append(desktopPrevIcon, desktopPrevSrOnly);
  desktopCarousel.append(desktopPrevButton);

  const desktopNextButton = document.createElement('a');
  desktopNextButton.classList.add('carousel-control-next');
  desktopNextButton.href = `#${desktopCarouselId}`;
  desktopNextButton.setAttribute('role', 'button');
  desktopNextButton.setAttribute('data-slide', 'next'); // Added data-slide attribute
  const desktopNextIcon = document.createElement('span');
  desktopNextIcon.classList.add('carousel-control-next-icon');
  desktopNextIcon.setAttribute('aria-hidden', 'true');
  const desktopNextSrOnly = document.createElement('span');
  desktopNextSrOnly.classList.add('sr-only');
  desktopNextSrOnly.textContent = 'next';
  desktopNextButton.append(desktopNextIcon, desktopNextSrOnly);
  desktopCarousel.append(desktopNextButton);

  // Add navigation controls for mobile carousel
  const mobilePrevButton = document.createElement('a');
  mobilePrevButton.classList.add('carousel-control-prev');
  mobilePrevButton.href = `#${mobileCarouselId}`;
  mobilePrevButton.setAttribute('role', 'button');
  mobilePrevButton.setAttribute('data-slide', 'prev'); // Added data-slide attribute
  const mobilePrevIcon = document.createElement('span');
  mobilePrevIcon.classList.add('carousel-control-prev-icon');
  mobilePrevIcon.setAttribute('aria-hidden', 'true');
  const mobilePrevSrOnly = document.createElement('span');
  mobilePrevSrOnly.classList.add('sr-only');
  mobilePrevSrOnly.textContent = 'previous';
  mobilePrevButton.append(mobilePrevIcon, mobilePrevSrOnly);
  mobileCarousel.append(mobilePrevButton);

  const mobileNextButton = document.createElement('a');
  mobileNextButton.classList.add('carousel-control-next');
  mobileNextButton.href = `#${mobileCarouselId}`;
  mobileNextButton.setAttribute('role', 'button');
  mobileNextButton.setAttribute('data-slide', 'next'); // Added data-slide attribute
  const mobileNextIcon = document.createElement('span');
  mobileNextIcon.classList.add('carousel-control-next-icon');
  mobileNextIcon.setAttribute('aria-hidden', 'true');
  const mobileNextSrOnly = document.createElement('span');
  mobileNextSrOnly.classList.add('sr-only');
  mobileNextSrOnly.textContent = 'next';
  mobileNextButton.append(mobileNextIcon, mobileNextSrOnly);
  mobileCarousel.append(mobileNextButton);

  rangeComponent.append(desktopCarousel);
  rangeComponent.append(mobileCarousel);

  block.textContent = '';
  block.append(rangeComponent);

  // Add event listeners for carousel controls
  const setupCarouselControls = (carouselElement, prevButton, nextButton) => {
    let currentIndex = 0;
    const carouselItems = [...carouselElement.querySelectorAll('.carousel-inner > .carousel-item')];
    const totalItems = carouselItems.length;

    const updateCarousel = () => {
      carouselItems.forEach((item, i) => {
        item.classList.remove('active');
        if (i === currentIndex) {
          item.classList.add('active');
        }
      });
    };

    prevButton.addEventListener('click', (e) => {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + totalItems) % totalItems;
      updateCarousel();
    });

    nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % totalItems;
      updateCarousel();
    });
  };

  setupCarouselControls(desktopCarousel, desktopPrevButton, desktopNextButton);
  setupCarouselControls(mobileCarousel, mobilePrevButton, mobileNextButton);
}
