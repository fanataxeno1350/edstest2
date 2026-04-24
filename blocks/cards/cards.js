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
  block.classList.add('cmp-cards', 'cmp-cards--recipe', 'None');

  // Heading
  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('cmp-cards__heading');
    moveInstrumentation(headingRow, heading);
    heading.textContent = headingRow.firstElementChild?.textContent.trim();
    block.append(heading);
  }

  // Sub Heading
  if (subHeadingRow) {
    const subHeading = document.createElement('p');
    subHeading.classList.add('cmp-cards__sub-heading', 'body-3');
    moveInstrumentation(subHeadingRow, subHeading);
    subHeading.textContent = subHeadingRow.firstElementChild?.textContent.trim();
    block.append(subHeading);
  }

  // Cards List (Carousel)
  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('slickcarousel', 'carousel', 'panelcontainer');
  const cmpCarousel = document.createElement('div');
  cmpCarousel.classList.add('cmp-carousel');
  cmpCarousel.setAttribute('data-component', 'carousel');
  cmpCarousel.setAttribute('data-show-infinite-scroll', 'false');
  cmpCarousel.setAttribute('data-show-arrows', 'true');
  cmpCarousel.setAttribute('data-show-dots', 'true');
  cmpCarousel.setAttribute('data-item-count-per-slide', '3');
  cmpCarousel.setAttribute('data-auto-play-is-enabled', 'false');
  cmpCarousel.setAttribute('data-auto-play-speed-in-ms', '3000');
  cmpCarousel.setAttribute('data-reveal-next-item-partially', 'false');
  cmpCarousel.setAttribute('data-show-center-zoom', 'false');
  cmpCarousel.setAttribute('data-slides-to-scroll', '3');

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container'); // slick-initialized, slick-slider, slick-dotted will be added by slick.js

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');
  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');

  cardRows.forEach((row, index) => {
    const [imageCell, linkCell, titleCell, tagCell, timeInMinutesCell] = [...row.children];

    const carouselItem = document.createElement('div');
    carouselItem.classList.add('cmp-carousel__item', 'slick-slide'); // slick-current, slick-active will be added by slick.js
    carouselItem.setAttribute('data-slick-index', index.toString());
    carouselItem.setAttribute('aria-hidden', 'true'); // Will be set to false for active slides

    const card = document.createElement('div');
    card.classList.add('card', 'cmp-card--recipe');

    const cmpCard = document.createElement('div');
    cmpCard.classList.add('cmp-card');

    const cmpCardContent = document.createElement('div');
    cmpCardContent.classList.add('cmp-card__content');

    const cmpCardMedia = document.createElement('div');
    cmpCardMedia.classList.add('cmp-card__media');

    const cmpCardOptions = document.createElement('div');
    cmpCardOptions.classList.add('cmp-card__options');
    const threeDots = document.createElement('div');
    threeDots.classList.add('cmp-card__three-dots', 'icon-open-card-popup');
    // Add event listener for the three-dots icon
    threeDots.addEventListener('click', () => {
      // Placeholder for interactivity: e.g., open a popup/modal
      console.log('Three dots clicked for card:', titleCell?.textContent.trim());
      // Example: threeDots.classList.toggle('active');
      // Example: showCardPopup(card);
    });
    cmpCardOptions.append(threeDots);

    const cmpCardImage = document.createElement('div');
    cmpCardImage.classList.add('cmp-card__image');
    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      lazyImageContainer.setAttribute('data-redirection-url', foundLink.href);
    }

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.classList.add('is-clickable', 'lazy-image', 'loaded');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        lazyImageContainer.append(optimizedPic);
      }
    }

    cmpCardImage.append(lazyImageContainer);
    cmpCardMedia.append(cmpCardOptions, cmpCardImage);

    const cmpCardInfo = document.createElement('div');
    cmpCardInfo.classList.add('cmp-card__info');

    const cmpCardTag = document.createElement('div');
    cmpCardTag.classList.add('cmp-card__tag');
    const tagWrapper = document.createElement('div');
    tagWrapper.classList.add('cmp-card__tag-wrapper');
    const tagP = document.createElement('p');
    tagP.textContent = tagCell?.textContent.trim();
    tagWrapper.append(tagP);
    cmpCardTag.append(tagWrapper);

    const cmpCardTitle = document.createElement('div');
    cmpCardTitle.classList.add('cmp-card__title');
    const titleLink = document.createElement('a');
    if (foundLink) {
      titleLink.href = foundLink.href;
    }
    const titleH5 = document.createElement('h5');
    titleH5.textContent = titleCell?.textContent.trim();
    titleLink.append(titleH5);
    cmpCardTitle.append(titleLink);

    const cmpCardTime = document.createElement('div');
    cmpCardTime.classList.add('cmp-card__time-in-minutes', 'desc-1');
    cmpCardTime.textContent = `Time: ${timeInMinutesCell?.textContent.trim()}`;

    cmpCardInfo.append(cmpCardTag, cmpCardTitle, cmpCardTime);
    cmpCardContent.append(cmpCardMedia, cmpCardInfo);
    cmpCard.append(cmpCardContent);
    card.append(cmpCard);
    carouselItem.append(card);
    moveInstrumentation(row, carouselItem);
    slickTrack.append(carouselItem);
  });

  slickList.append(slickTrack);
  carouselContainer.append(slickList);
  cmpCarousel.append(carouselContainer);
  carouselWrapper.append(cmpCarousel);
  block.append(carouselWrapper);

  // CTA Button
  if (ctaLinkRow && ctaTextRow) {
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button', 'cmp-button--primary-anchor', 'cmp-button--primary-anchor-undefined', 'cards-cta-button');

    const ctaAnchor = document.createElement('a');
    ctaAnchor.classList.add('cmp-button');
    const foundCtaLink = ctaLinkRow.querySelector('a');
    if (foundCtaLink) {
      ctaAnchor.href = foundCtaLink.href;
    }
    ctaAnchor.setAttribute('target', '_self');

    const ctaSpan = document.createElement('span');
    ctaSpan.classList.add('cmp-button__text');
    ctaSpan.textContent = ctaTextRow.firstElementChild?.textContent.trim(); // Correctly read text content
    ctaAnchor.append(ctaSpan);
    buttonDiv.append(ctaAnchor);
    moveInstrumentation(ctaLinkRow, buttonDiv);
    moveInstrumentation(ctaTextRow, buttonDiv);
    block.append(buttonDiv);
  }

  // Share div (empty as per original HTML)
  const shareDiv = document.createElement('div');
  shareDiv.classList.add('share');
  block.append(shareDiv);

  // Image optimization
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
