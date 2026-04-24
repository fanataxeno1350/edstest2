import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    headingRow,
    subHeadingRow,
    ctaLinkRow,
    ctaTextRow,
    ...cardRows
  ] = [...block.children];

  block.innerHTML = '';
  block.classList.add('cmp-cards', 'cmp-cards--recipe');

  // Heading
  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('cmp-cards__heading');
    heading.textContent = headingRow.firstElementChild?.textContent.trim();
    moveInstrumentation(headingRow, heading);
    block.append(heading);
  }

  // Sub Heading
  if (subHeadingRow) {
    const subHeading = document.createElement('p');
    subHeading.classList.add('cmp-cards__sub-heading', 'body-3');
    subHeading.textContent = subHeadingRow.firstElementChild?.textContent.trim();
    moveInstrumentation(subHeadingRow, subHeading);
    block.append(subHeading);
  }

  // Carousel container
  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('slickcarousel', 'carousel', 'panelcontainer');
  block.append(carouselWrapper);

  const carouselCmp = document.createElement('div');
  carouselCmp.classList.add('cmp-carousel');
  carouselWrapper.append(carouselCmp);

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider', 'slick-dotted');
  carouselCmp.append(carouselContainer);

  const prevButton = document.createElement('button');
  prevButton.classList.add('slick-prev', 'slick-arrow', 'slick-disabled');
  prevButton.setAttribute('aria-label', 'Previous');
  prevButton.setAttribute('type', 'button');
  prevButton.setAttribute('aria-disabled', 'true');
  carouselContainer.append(prevButton);

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');
  carouselContainer.append(slickList);

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickList.append(slickTrack);

  cardRows.forEach((row, index) => {
    // Destructuring for item rows, as per EDS BLOCK STRUCTURE
    const [
      imageCell,
      imageLinkCell,
      tagCell,
      titleCell,
      titleLinkCell,
      timeCell,
    ] = [...row.children];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-carousel__item', 'slick-slide');
    carouselItem.setAttribute('data-slick-index', index);
    carouselItem.setAttribute('aria-hidden', index !== 0);
    carouselItem.setAttribute('tabindex', index === 0 ? '0' : '-1');
    carouselItem.setAttribute('role', 'tabpanel');
    carouselItem.id = `slick-slide2${index}`; // Example ID, adjust if needed
    if (index === 0) {
      carouselItem.classList.add('slick-current', 'slick-active');
      carouselItem.setAttribute('aria-describedby', `slick-slide-control2${index}`); // Example ID
    }
    slickTrack.append(carouselItem);

    const card = document.createElement('div');
    card.classList.add('card', 'cmp-card--recipe');
    carouselItem.append(card);

    const cmpCard = document.createElement('div');
    cmpCard.classList.add('cmp-card');
    card.append(cmpCard);

    const cmpCardContent = document.createElement('div');
    cmpCardContent.classList.add('cmp-card__content');
    cmpCard.append(cmpCardContent);

    const cmpCardMedia = document.createElement('div');
    cmpCardMedia.classList.add('cmp-card__media');
    cmpCardContent.append(cmpCardMedia);

    const cmpCardOptions = document.createElement('div');
    cmpCardOptions.classList.add('cmp-card__options');
    cmpCardMedia.append(cmpCardOptions);

    const threeDots = document.createElement('div');
    threeDots.classList.add('cmp-card__three-dots', 'icon-open-card-popup');
    cmpCardOptions.append(threeDots);

    // Add event listener for the three dots (popup)
    threeDots.addEventListener('click', () => {
      // Implement popup logic here, e.g., toggle a class on a modal element
      console.log('Three dots clicked for card:', titleCell.textContent.trim());
    });

    const cmpCardImage = document.createElement('div');
    cmpCardImage.classList.add('cmp-card__image');
    cmpCardMedia.append(cmpCardImage);

    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');
    cmpCardImage.append(lazyImageContainer);

    const imageLink = imageLinkCell?.querySelector('a')?.href;
    if (imageLink) {
      lazyImageContainer.setAttribute('data-redirection-url', imageLink);
    }

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('is-clickable', 'lazy-image', 'loaded');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        lazyImageContainer.append(optimizedPic);
      }
    }

    const cmpCardInfo = document.createElement('div');
    cmpCardInfo.classList.add('cmp-card__info');
    cmpCardContent.append(cmpCardInfo);

    if (tagCell && tagCell.textContent.trim()) {
      const cmpCardTag = document.createElement('div');
      cmpCardTag.classList.add('cmp-card__tag');
      cmpCardInfo.append(cmpCardTag);

      const cmpCardTagWrapper = document.createElement('div');
      cmpCardTagWrapper.classList.add('cmp-card__tag-wrapper');
      cmpCardTag.append(cmpCardTagWrapper);

      const tagP = document.createElement('p');
      tagP.textContent = tagCell.textContent.trim();
      cmpCardTagWrapper.append(tagP);
    }

    if (titleCell && titleCell.textContent.trim()) {
      const cmpCardTitle = document.createElement('div');
      cmpCardTitle.classList.add('cmp-card__title');
      cmpCardInfo.append(cmpCardTitle);

      const titleLink = titleLinkCell?.querySelector('a')?.href;
      const titleAnchor = document.createElement('a');
      if (titleLink) {
        titleAnchor.href = titleLink;
      }
      titleAnchor.textContent = titleCell.textContent.trim();
      const h5 = document.createElement('h5');
      h5.append(titleAnchor);
      cmpCardTitle.append(h5);
    }

    if (timeCell && timeCell.textContent.trim()) {
      const cmpCardTime = document.createElement('div');
      cmpCardTime.classList.add('cmp-card__time-in-minutes', 'desc-1');
      cmpCardTime.textContent = `Time: ${timeCell.textContent.trim()}`;
      cmpCardInfo.append(cmpCardTime);
    }
    moveInstrumentation(row, carouselItem);
  });

  const nextButton = document.createElement('button');
  nextButton.classList.add('slick-next', 'slick-arrow');
  nextButton.setAttribute('aria-label', 'Next');
  nextButton.setAttribute('type', 'button');
  nextButton.setAttribute('aria-disabled', 'false');
  carouselContainer.append(nextButton);

  const slickDots = document.createElement('ul');
  slickDots.classList.add('slick-dots');
  slickDots.setAttribute('role', 'tablist');
  carouselContainer.append(slickDots);

  // Placeholder for carousel functionality (slick.js would handle this)
  // For a pure JS implementation, you'd add event listeners to prevButton, nextButton, and slickDots
  // and manage the 'slick-current', 'slick-active', 'slick-disabled' classes manually.
  // Since the original HTML shows slick-initialized, we assume an external slick.js handles the actual carousel logic.
  // We'll add basic listeners for demonstration, but full carousel logic is out of scope for this review.

  let currentSlide = 0;
  const totalSlides = cardRows.length;
  const slidesPerPage = 3; // Based on original HTML data-item-count-per-slide="3"

  const updateCarouselState = () => {
    [...slickTrack.children].forEach((item, i) => {
      item.classList.remove('slick-current', 'slick-active');
      item.setAttribute('aria-hidden', 'true');
      item.setAttribute('tabindex', '-1');
    });

    for (let i = 0; i < slidesPerPage; i += 1) {
      const slideIndex = (currentSlide + i) % totalSlides;
      const slide = slickTrack.children[slideIndex];
      if (slide) {
        slide.classList.add('slick-active');
        slide.setAttribute('aria-hidden', 'false');
        slide.setAttribute('tabindex', '0');
        if (i === 0) {
          slide.classList.add('slick-current');
        }
      }
    }

    prevButton.classList.toggle('slick-disabled', currentSlide === 0);
    prevButton.setAttribute('aria-disabled', currentSlide === 0);
    nextButton.classList.toggle('slick-disabled', currentSlide >= totalSlides - slidesPerPage);
    nextButton.setAttribute('aria-disabled', currentSlide >= totalSlides - slidesPerPage);

    slickDots.innerHTML = '';
    const numDots = Math.ceil(totalSlides / slidesPerPage);
    for (let i = 0; i < numDots; i += 1) {
      const dotLi = document.createElement('li');
      dotLi.setAttribute('role', 'presentation');
      const dotButton = document.createElement('button');
      dotButton.setAttribute('type', 'button');
      dotButton.setAttribute('role', 'tab');
      dotButton.id = `slick-slide-control2${i * slidesPerPage}`;
      dotButton.setAttribute('aria-controls', `slick-slide2${i * slidesPerPage}`);
      dotButton.setAttribute('aria-label', `${i + 1} of ${numDots}`);
      dotButton.setAttribute('tabindex', i === Math.floor(currentSlide / slidesPerPage) ? '0' : '-1');
      dotButton.setAttribute('aria-selected', i === Math.floor(currentSlide / slidesPerPage));
      dotButton.textContent = i + 1;
      if (i === Math.floor(currentSlide / slidesPerPage)) {
        dotLi.classList.add('slick-active');
      }
      dotLi.append(dotButton);
      slickDots.append(dotLi);

      dotButton.addEventListener('click', () => {
        currentSlide = i * slidesPerPage;
        updateCarouselState();
      });
    }
  };

  prevButton.addEventListener('click', () => {
    if (currentSlide > 0) {
      currentSlide = Math.max(0, currentSlide - slidesPerPage);
      updateCarouselState();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentSlide < totalSlides - slidesPerPage) {
      currentSlide = Math.min(totalSlides - slidesPerPage, currentSlide + slidesPerPage);
      updateCarouselState();
    }
  });

  updateCarouselState(); // Initial state setup

  // CTA Button
  if (ctaLinkRow && ctaTextRow) {
    const ctaLink = ctaLinkRow.querySelector('a')?.href;
    const ctaText = ctaTextRow.firstElementChild?.textContent.trim(); // Use firstElementChild for text content

    if (ctaLink && ctaText) {
      const buttonWrapper = document.createElement('div');
      buttonWrapper.classList.add('button', 'cmp-button--primary-anchor', 'cards-cta-button');
      block.append(buttonWrapper);

      const ctaAnchor = document.createElement('a');
      ctaAnchor.classList.add('cmp-button');
      ctaAnchor.href = ctaLink;
      ctaAnchor.setAttribute('target', '_self');
      buttonWrapper.append(ctaAnchor);

      const ctaSpan = document.createElement('span');
      ctaSpan.classList.add('cmp-button__text');
      ctaSpan.textContent = ctaText;
      ctaAnchor.append(ctaSpan);
      moveInstrumentation(ctaLinkRow, buttonWrapper);
      moveInstrumentation(ctaTextRow, buttonWrapper);
    }
  }

  const shareDiv = document.createElement('div');
  shareDiv.classList.add('share');
  block.append(shareDiv);
}
