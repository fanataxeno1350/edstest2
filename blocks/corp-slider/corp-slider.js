import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // BlockJson has 2 root fields: "title" and "items" (which is a container).
  // The EDS block structure shows 'title' as block.children[0] and 'items' as block.children[1].
  // All subsequent children are the 'corp-slider-item' rows.
  const [titleRow, itemsContainerRow, ...itemRows] = [...block.children];

  const rangeComponent = document.createElement('div');
  rangeComponent.classList.add('range-component');

  // Title
  if (titleRow) {
    const titleContainerRow = document.createElement('div');
    titleContainerRow.classList.add('row');
    const titleCell = document.createElement('div');
    // Original HTML uses 'col-md12 col-sm-12 col-md-12 gallery-header'
    titleCell.classList.add('col-md12', 'col-sm-12', 'gallery-header'); // Removed duplicate 'col-md-12'
    moveInstrumentation(titleRow.firstElementChild, titleCell);
    while (titleRow.firstElementChild.firstChild) {
      titleCell.append(titleRow.firstElementChild.firstChild);
    }
    titleContainerRow.append(titleCell);
    rangeComponent.append(titleContainerRow);

    const sliderTitleDiv = document.createElement('div');
    sliderTitleDiv.classList.add('slider-title');
    const h4 = document.createElement('h4');
    // Ensure ID generation matches original HTML's example: 'arena' from 'Discover Maruti Suzuki Cars'
    // The original HTML shows `<h4>ARENA</h4>` which implies the ID comes from the actual title content,
    // not necessarily a direct transformation of the full title text.
    // For now, using the text content of the titleCell as the source for the ID.
    // If the ID needs to be explicitly 'arena', it should be a separate field in the model.
    h4.id = titleCell.textContent.trim().toLowerCase().replace(/\s+/g, '-');
    h4.textContent = titleCell.textContent.trim();
    sliderTitleDiv.append(h4);
    rangeComponent.append(sliderTitleDiv);
  }

  // Create desktop carousel
  const desktopCarousel = document.createElement('div');
  desktopCarousel.id = 'range-slider-arena-desktop';
  desktopCarousel.classList.add('carousel', 'slide', 'd-none', 'd-sm-block');
  desktopCarousel.setAttribute('data-ride', 'carousel'); // This attribute is present in the original HTML

  const desktopCarouselInner = document.createElement('div');
  desktopCarouselInner.classList.add('carousel-inner');
  desktopCarousel.append(desktopCarouselInner);

  // Create mobile carousel
  const mobileCarousel = document.createElement('div');
  mobileCarousel.id = 'range-slider-arena-mobile';
  mobileCarousel.classList.add('carousel', 'slide', 'd-sm-none');
  mobileCarousel.setAttribute('data-ride', 'carousel'); // This attribute is present in the original HTML

  const mobileCarouselInner = document.createElement('div');
  mobileCarouselInner.classList.add('carousel-inner');
  mobileCarousel.append(mobileCarouselInner);

  const itemsPerDesktopSlide = 4;
  const itemsPerMobileSlide = 2;
  let desktopSlideIndex = 0;
  let mobileSlideIndex = 0;

  const createCarouselItem = (isDesktop) => {
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    if ((isDesktop && desktopSlideIndex === 0) || (!isDesktop && mobileSlideIndex === 0)) {
      carouselItem.classList.add('active');
    }
    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');
    carouselItem.append(rowDiv);
    return rowDiv; // Return the rowDiv to append columns to it
  };

  let currentDesktopRow = createCarouselItem(true);
  desktopCarouselInner.append(currentDesktopRow.parentElement); // Append the carousel-item (parent of rowDiv)
  let currentMobileRow = createCarouselItem(false);
  mobileCarouselInner.append(currentMobileRow.parentElement); // Append the carousel-item (parent of rowDiv)

  itemRows.forEach((row, index) => {
    // Each item row has 4 cells based on BlockJson: image, alt, caption, link
    const cells = [...row.children];
    const imageCell = cells[0];
    const altCell = cells[1];
    const captionCell = cells[2];
    const linkCell = cells[3];

    const foundLink = linkCell.querySelector('a');
    const linkHref = foundLink ? foundLink.href : '#';
    // The original HTML shows `h6.img-title` gets its text from the caption cell.
    const linkText = captionCell.textContent.trim();

    const picture = imageCell.querySelector('picture');
    const img = picture ? picture.querySelector('img') : null;
    const imgSrc = img ? img.src : '';
    const imgAlt = altCell.textContent.trim() || (img ? img.alt : '');

    // Desktop item
    if (index % itemsPerDesktopSlide === 0 && index !== 0) {
      desktopSlideIndex += 1;
      currentDesktopRow = createCarouselItem(true);
      desktopCarouselInner.append(currentDesktopRow.parentElement);
    }
    const desktopCol = document.createElement('div');
    // Original HTML uses 'col-6 col-sm-6 col-lg-3'
    desktopCol.classList.add('col-6', 'col-sm-6', 'col-lg-3');
    const desktopAnchor = document.createElement('a');
    desktopAnchor.classList.add('image-area');
    desktopAnchor.href = linkHref;
    const desktopImageContainer = document.createElement('div');
    desktopImageContainer.classList.add('image-container');
    desktopImageContainer.setAttribute('target', '_self'); // This attribute is present in the original HTML
    const desktopImg = document.createElement('img');
    desktopImg.src = imgSrc;
    desktopImg.alt = imgAlt;
    desktopImg.classList.add('img-fluid');
    desktopImageContainer.append(desktopImg);
    const desktopImgTitle = document.createElement('h6');
    desktopImgTitle.classList.add('img-title');
    desktopImgTitle.textContent = linkText;
    desktopAnchor.append(desktopImageContainer, desktopImgTitle);
    desktopCol.append(desktopAnchor);
    currentDesktopRow.append(desktopCol);
    moveInstrumentation(row, desktopCol);

    // Mobile item
    if (index % itemsPerMobileSlide === 0 && index !== 0) {
      mobileSlideIndex += 1;
      currentMobileRow = createCarouselItem(false);
      mobileCarouselInner.append(currentMobileRow.parentElement);
    }
    const mobileCol = document.createElement('div');
    // Original HTML uses 'col-6 col-sm-6 col-lg-3'
    mobileCol.classList.add('col-6', 'col-sm-6', 'col-lg-3');
    const mobileAnchor = document.createElement('a');
    mobileAnchor.classList.add('image-area');
    mobileAnchor.href = linkHref;
    const mobileImageContainer = document.createElement('div');
    mobileImageContainer.classList.add('image-container');
    mobileImageContainer.setAttribute('target', '_self'); // This attribute is present in the original HTML
    const mobileImg = document.createElement('img');
    mobileImg.src = imgSrc;
    mobileImg.alt = imgAlt;
    mobileImg.classList.add('img-fluid');
    mobileImageContainer.append(mobileImg);
    const mobileImgTitle = document.createElement('h6');
    mobileImgTitle.classList.add('img-title');
    mobileImgTitle.textContent = linkText;
    mobileAnchor.append(mobileImageContainer, mobileImgTitle);
    mobileCol.append(mobileAnchor);
    currentMobileRow.append(mobileCol);
  });

  // Carousel controls for desktop
  const desktopPrevButton = document.createElement('a');
  desktopPrevButton.classList.add('carousel-control-prev');
  desktopPrevButton.href = '#range-slider-arena-desktop';
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
  desktopNextButton.href = '#range-slider-arena-desktop';
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

  // Carousel controls for mobile
  const mobilePrevButton = document.createElement('a');
  mobilePrevButton.classList.add('carousel-control-prev');
  mobilePrevButton.href = '#range-slider-arena-mobile';
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
  mobileNextButton.href = '#range-slider-arena-mobile';
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

  rangeComponent.append(desktopCarousel, mobileCarousel);

  // Add event listeners for carousel navigation
  // The original JS already had this, but it's good to double-check its functionality.
  // The `data-slide` attributes are typically used by Bootstrap JS, but since we're
  // implementing custom JS, the event listeners are crucial.
  const setupCarouselNavigation = (carouselId) => {
    const carouselElement = document.getElementById(carouselId);
    if (!carouselElement) return;

    const prevButton = carouselElement.querySelector('.carousel-control-prev');
    const nextButton = carouselElement.querySelector('.carousel-control-next');
    const carouselInner = carouselElement.querySelector('.carousel-inner');
    const carouselItems = [...carouselInner.children];
    let currentIndex = carouselItems.findIndex(item => item.classList.contains('active'));
    if (currentIndex === -1) currentIndex = 0; // Default to first item if no active found

    const showSlide = (index) => {
      carouselItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
      });
    };

    if (prevButton) {
      prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
        showSlide(currentIndex);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % carouselItems.length;
        showSlide(currentIndex);
      });
    }
  };

  setupCarouselNavigation('range-slider-arena-desktop');
  setupCarouselNavigation('range-slider-arena-mobile');

  block.textContent = '';
  block.append(rangeComponent);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
