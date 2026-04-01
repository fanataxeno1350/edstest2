import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // BlockJson has 3 root fields: heading, description, teasers (container)
  // The 'teasers' container itself has a div with "Teasers value" which needs to be skipped.
  const [headingRow, descriptionRow, teasersContainerRow, ...teaserRows] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container', 'responsivegrid', 'color-background-background-3', 'cmp-ourcommunity-teasercarousel-container');

  const cmpContainer = document.createElement('div');
  cmpContainer.classList.add('cmp-container');
  cmpContainer.id = `container-${Math.random().toString(36).substring(2, 11)}`; // Generate a unique ID

  const textCtaText = document.createElement('div');
  textCtaText.classList.add('text', 'cta-text', 'font-weight-medium');

  const cmpText = document.createElement('div');
  cmpText.classList.add('cmp-text');
  cmpText.id = `text-${Math.random().toString(36).substring(2, 11)}`; // Generate a unique ID

  const heading = document.createElement('h2');
  // moveInstrumentation expects the source element as the first argument
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.append(...headingRow.firstElementChild.children);

  const description = document.createElement('p');
  // moveInstrumentation expects the source element as the first argument
  moveInstrumentation(descriptionRow.firstElementChild, description);
  description.append(...descriptionRow.firstElementChild.children);

  cmpText.append(heading, description);
  textCtaText.append(cmpText);
  cmpContainer.append(textCtaText);

  const slickCarousel = document.createElement('div');
  slickCarousel.classList.add('slickcarousel', 'carousel', 'panelcontainer');

  const cmpCarousel = document.createElement('div');
  cmpCarousel.classList.add('cmp-carousel');
  cmpCarousel.id = `slickcarousel-${Math.random().toString(36).substring(2, 11)}`; // Generate a unique ID
  cmpCarousel.setAttribute('data-placeholder-text', 'false');
  cmpCarousel.setAttribute('data-cmp-is', 'carousel');
  cmpCarousel.setAttribute('data-show-infinite-scroll', 'false');
  cmpCarousel.setAttribute('data-show-arrows', 'true');
  cmpCarousel.setAttribute('data-show-dots', 'true');
  cmpCarousel.setAttribute('data-item-count-per-slide', '1');
  cmpCarousel.setAttribute('data-auto-play-is-enabled', 'false');
  cmpCarousel.setAttribute('data-auto-play-speed-in-ms', '5000');
  cmpCarousel.setAttribute('data-reveal-next-item-partially', 'false');
  cmpCarousel.setAttribute('data-component', 'carousel');

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider', 'slick-dotted');
  carouselContainer.setAttribute('data-slick', teaserRows.length.toString());
  carouselContainer.setAttribute('aria-atomic', 'false');

  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow', 'slick-disabled');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-disabled', 'true');
  prevButton.textContent = 'Previous';

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickTrack.style.opacity = '1';
  slickTrack.style.width = `${teaserRows.length * 1012}px`; // Assuming 1012px width per slide
  slickTrack.style.transform = 'translate3d(0px, 0px, 0px)';

  teaserRows.forEach((row, index) => {
    // Each teaser item row has 6 cells as per BlockJson
    const [
      backgroundImageDesktopCell,
      backgroundImageMobileCell,
      titleCell,
      teaserDescriptionCell,
      ctaLinkCell,
      ctaTextCell,
    ] = row.children;

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-carousel__item', 'slick-slide');
    if (index === 0) {
      carouselItem.classList.add('cmp-carousel__item--active', 'slick-current', 'slick-active');
      carouselItem.setAttribute('aria-hidden', 'false');
      carouselItem.setAttribute('tabindex', '0');
    } else {
      carouselItem.setAttribute('aria-hidden', 'true');
      carouselItem.setAttribute('tabindex', '-1');
    }
    carouselItem.id = `slick-slide1${index}`;
    carouselItem.setAttribute('role', 'tabpanel');
    carouselItem.setAttribute('aria-labelledby', `${cmpCarousel.id}-item-${Math.random().toString(36).substring(2, 11)}-tab`);
    carouselItem.setAttribute('aria-roledescription', 'slide');
    carouselItem.setAttribute('aria-label', `Slide ${index + 1} of ${teaserRows.length}`);
    carouselItem.setAttribute('data-cmp-hook-carousel', 'item');
    carouselItem.setAttribute('data-slick-index', index.toString());
    carouselItem.setAttribute('aria-describedby', `slick-slide-control1${index}`);
    carouselItem.style.width = '1012px';
    moveInstrumentation(row, carouselItem);

    const teaserDiv = document.createElement('div');
    teaserDiv.classList.add('teaser', 'cmp-teaser--carousel-teaser');

    const cmpTeaser = document.createElement('div');
    cmpTeaser.classList.add('cmp-teaser');
    cmpTeaser.id = `teaser-${Math.random().toString(36).substring(2, 11)}`; // Generate a unique ID
    cmpTeaser.setAttribute('data-component', 'teaser');
    cmpTeaser.setAttribute('data-show-media-url', 'false');
    cmpTeaser.setAttribute('data-initialized', 'true');

    const desktopPic = backgroundImageDesktopCell.querySelector('picture');
    const desktopImg = desktopPic ? desktopPic.querySelector('img') : null;
    if (desktopImg) {
      // Use createOptimizedPicture for background images if needed, but here we just need the src
      const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
      const optimizedDesktopImgSrc = optimizedDesktopPic.querySelector('img').src;
      cmpTeaser.setAttribute('data-background-image-desktop', optimizedDesktopImgSrc);
      cmpTeaser.style.backgroundImage = `url("${optimizedDesktopImgSrc}")`;
    }

    const mobilePic = backgroundImageMobileCell.querySelector('picture');
    const mobileImg = mobilePic ? mobilePic.querySelector('img') : null;
    if (mobileImg) {
      const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '750' }]);
      const optimizedMobileImgSrc = optimizedMobilePic.querySelector('img').src;
      cmpTeaser.setAttribute('data-background-image-mobile', optimizedMobileImgSrc);
    }

    const teaserContent = document.createElement('div');
    teaserContent.classList.add('cmp-teaser__content');

    const teaserTitle = document.createElement('h2');
    teaserTitle.classList.add('cmp-teaser__title');
    moveInstrumentation(titleCell, teaserTitle);
    while (titleCell.firstChild) teaserTitle.append(titleCell.firstChild);

    const teaserDescription = document.createElement('div');
    teaserDescription.classList.add('cmp-teaser__description');
    moveInstrumentation(teaserDescriptionCell, teaserDescription);
    while (teaserDescriptionCell.firstChild) teaserDescription.append(teaserDescriptionCell.firstChild);

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('cmp-teaser__action-container');

    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button', 'cmp-button--primary-anchor');

    const ctaLink = ctaLinkCell.querySelector('a');
    const ctaButton = document.createElement('a');
    ctaButton.classList.add('cmp-button');
    ctaButton.id = `button-${Math.random().toString(36).substring(2, 11)}`; // Generate a unique ID
    ctaButton.setAttribute('data-request', 'true');
    if (ctaLink) {
      ctaButton.href = ctaLink.href;
      ctaButton.target = ctaLink.target || '_self';
    }
    ctaButton.setAttribute('tabindex', index === 0 ? '0' : '-1');
    moveInstrumentation(ctaLinkCell, ctaButton);

    const ctaSpan = document.createElement('span');
    ctaSpan.classList.add('cmp-button__text');
    moveInstrumentation(ctaTextCell, ctaSpan);
    while (ctaTextCell.firstChild) ctaSpan.append(ctaTextCell.firstChild);

    ctaButton.append(ctaSpan);
    buttonDiv.append(ctaButton);
    actionContainer.append(buttonDiv);

    teaserContent.append(teaserTitle, teaserDescription, actionContainer);
    cmpTeaser.append(teaserContent);
    teaserDiv.append(cmpTeaser);
    carouselItem.append(teaserDiv);
    slickTrack.append(carouselItem);
  });

  slickList.append(slickTrack);
  carouselContainer.append(prevButton, slickList);

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-disabled', 'false');
  nextButton.textContent = 'Next';

  const slickDots = document.createElement('ul');
  slickDots.classList.add('slick-dots');
  slickDots.setAttribute('role', 'tablist');

  teaserRows.forEach((_, index) => {
    const li = document.createElement('li');
    if (index === 0) {
      li.classList.add('slick-active');
    }
    li.setAttribute('role', 'presentation');

    const dotButton = document.createElement('button');
    dotButton.setAttribute('type', 'button');
    dotButton.setAttribute('role', 'tab');
    dotButton.id = `slick-slide-control1${index}`;
    dotButton.setAttribute('aria-controls', `slick-slide1${index}`);
    dotButton.setAttribute('aria-label', `${index + 1} of ${teaserRows.length}`);
    dotButton.setAttribute('tabindex', index === 0 ? '0' : '-1');
    if (index === 0) {
      dotButton.setAttribute('aria-selected', 'true');
    }
    dotButton.textContent = (index + 1).toString();
    li.append(dotButton);
    slickDots.append(li);
  });

  carouselContainer.append(nextButton, slickDots);
  cmpCarousel.append(carouselContainer);
  slickCarousel.append(cmpCarousel);
  cmpContainer.append(slickCarousel);
  container.append(cmpContainer);

  // Add event listeners for carousel navigation and dots
  let currentIndex = 0;

  const updateCarousel = () => {
    slickTrack.style.transform = `translate3d(-${currentIndex * 1012}px, 0px, 0px)`;
    [...slickTrack.children].forEach((item, i) => {
      if (i === currentIndex) {
        item.classList.add('cmp-carousel__item--active', 'slick-current', 'slick-active');
        item.setAttribute('aria-hidden', 'false');
        item.setAttribute('tabindex', '0');
      } else {
        item.classList.remove('cmp-carousel__item--active', 'slick-current', 'slick-active');
        item.setAttribute('aria-hidden', 'true');
        item.setAttribute('tabindex', '-1');
      }
    });

    [...slickDots.children].forEach((dotLi, i) => {
      const dotBtn = dotLi.querySelector('button');
      if (i === currentIndex) {
        dotLi.classList.add('slick-active');
        dotBtn.setAttribute('aria-selected', 'true');
        dotBtn.setAttribute('tabindex', '0');
      } else {
        dotLi.classList.remove('slick-active');
        dotBtn.setAttribute('aria-selected', 'false');
        dotBtn.setAttribute('tabindex', '-1');
      }
    });

    if (currentIndex === 0) {
      prevButton.classList.add('slick-disabled');
      prevButton.setAttribute('aria-disabled', 'true');
    } else {
      prevButton.classList.remove('slick-disabled');
      prevButton.setAttribute('aria-disabled', 'false');
    }

    if (currentIndex === teaserRows.length - 1) {
      nextButton.classList.add('slick-disabled');
      nextButton.setAttribute('aria-disabled', 'true');
    } else {
      nextButton.classList.remove('slick-disabled');
      nextButton.setAttribute('aria-disabled', 'false');
    }
  };

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
      updateCarousel();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < teaserRows.length - 1) {
      currentIndex += 1;
      updateCarousel();
    }
  });

  [...slickDots.children].forEach((dotLi, index) => {
    const dotBtn = dotLi.querySelector('button');
    dotBtn.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  // Initial update
  updateCarousel();

  block.textContent = '';
  block.append(container);
}
