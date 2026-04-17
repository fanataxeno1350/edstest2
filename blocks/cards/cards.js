import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    headingRow,
    subHeadingRow,
    ctaLinkRow,
    ctaTextRow,
    ...cardItemRows
  ] = [...block.children];

  // Create main container
  const cmpCards = document.createElement('div');
  cmpCards.classList.add('cmp-cards', 'cmp-cards--recipe');
  moveInstrumentation(block, cmpCards);

  // Heading
  const heading = document.createElement('h2');
  heading.classList.add('cmp-cards__heading');
  heading.textContent = headingRow?.firstElementChild?.textContent.trim() || '';
  cmpCards.appendChild(heading);

  // Sub Heading
  const subHeading = document.createElement('p');
  subHeading.classList.add('cmp-cards__sub-heading', 'body-3');
  subHeading.textContent = subHeadingRow?.firstElementChild?.textContent.trim() || '';
  cmpCards.appendChild(subHeading);

  // Carousel container
  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('slickcarousel', 'carousel', 'panelcontainer');
  cmpCards.appendChild(carouselWrapper);

  const cmpCarousel = document.createElement('div');
  cmpCarousel.classList.add('cmp-carousel');
  carouselWrapper.appendChild(cmpCarousel);

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container'); // Slick JS will add slick-initialized, slick-slider, slick-dotted
  cmpCarousel.appendChild(carouselContainer);

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');
  carouselContainer.appendChild(slickList);

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickList.appendChild(slickTrack);

  cardItemRows.forEach((row) => {
    const [
      imageCell,
      redirectionUrlCell,
      tagCell,
      titleCell,
      titleLinkCell,
      timeInMinutesCell,
    ] = [...row.children];

    const cmpCarouselItem = document.createElement('div');
    cmpCarouselItem.classList.add('cmp-carousel__item', 'slick-slide'); // Slick JS will add slick-current, slick-active
    moveInstrumentation(row, cmpCarouselItem);
    slickTrack.appendChild(cmpCarouselItem);

    const card = document.createElement('div');
    card.classList.add('card', 'cmp-card--recipe');
    cmpCarouselItem.appendChild(card);

    const cmpCard = document.createElement('div');
    cmpCard.classList.add('cmp-card');
    card.appendChild(cmpCard);

    const cmpCardContent = document.createElement('div');
    cmpCardContent.classList.add('cmp-card__content');
    cmpCard.appendChild(cmpCardContent);

    const cmpCardMedia = document.createElement('div');
    cmpCardMedia.classList.add('cmp-card__media');
    cmpCardContent.appendChild(cmpCardMedia);

    const cmpCardOptions = document.createElement('div');
    cmpCardOptions.classList.add('cmp-card__options');
    cmpCardMedia.appendChild(cmpCardOptions);

    const threeDots = document.createElement('div');
    threeDots.classList.add('cmp-card__three-dots', 'icon-open-card-popup');
    cmpCardOptions.appendChild(threeDots);

    const cmpCardImage = document.createElement('div');
    cmpCardImage.classList.add('cmp-card__image');
    cmpCardMedia.appendChild(cmpCardImage);

    const lazyImageContainer = document.createElement('div');
    lazyImageContainer.classList.add('lazy-image-container');
    const redirectionUrl = redirectionUrlCell?.querySelector('a')?.href;
    if (redirectionUrl) {
      lazyImageContainer.setAttribute('data-redirection-url', redirectionUrl);
    }
    cmpCardImage.appendChild(lazyImageContainer);

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        lazyImageContainer.appendChild(optimizedPic);
        optimizedPic.querySelector('img').classList.add('is-clickable', 'lazy-image', 'loaded');
      }
    }

    const cmpCardInfo = document.createElement('div');
    cmpCardInfo.classList.add('cmp-card__info');
    cmpCardContent.appendChild(cmpCardInfo);

    const cmpCardTag = document.createElement('div');
    cmpCardTag.classList.add('cmp-card__tag');
    cmpCardInfo.appendChild(cmpCardTag);

    const cmpCardTagWrapper = document.createElement('div');
    cmpCardTagWrapper.classList.add('cmp-card__tag-wrapper');
    cmpCardTag.appendChild(cmpCardTagWrapper);

    const tagP = document.createElement('p');
    tagP.textContent = tagCell?.textContent.trim() || '';
    cmpCardTagWrapper.appendChild(tagP);

    const cmpCardTitle = document.createElement('div');
    cmpCardTitle.classList.add('cmp-card__title');
    cmpCardInfo.appendChild(cmpCardTitle);

    const titleLink = document.createElement('a');
    titleLink.href = titleLinkCell?.querySelector('a')?.href || '#';
    titleLink.textContent = titleCell?.textContent.trim() || '';
    const titleH5 = document.createElement('h5');
    titleH5.appendChild(titleLink);
    cmpCardTitle.appendChild(titleH5);

    const cmpCardTime = document.createElement('div');
    cmpCardTime.classList.add('cmp-card__time-in-minutes', 'desc-1');
    cmpCardTime.textContent = timeInMinutesCell?.textContent.trim() || '';
    cmpCardInfo.appendChild(cmpCardTime);
  });

  // CTA Button
  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--primary-anchor', 'cmp-button--primary-anchor-undefined', 'cards-cta-button');
  cmpCards.appendChild(buttonDiv);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('cmp-button');
  ctaLink.href = ctaLinkRow?.querySelector('a')?.href || '#';
  buttonDiv.appendChild(ctaLink);

  const ctaTextSpan = document.createElement('span');
  ctaTextSpan.classList.add('cmp-button__text');
  ctaTextSpan.textContent = ctaTextRow?.firstElementChild?.textContent.trim() || '';
  ctaLink.appendChild(ctaTextSpan);

  const shareDiv = document.createElement('div');
  shareDiv.classList.add('share');
  cmpCards.appendChild(shareDiv);

  block.innerHTML = '';
  block.appendChild(cmpCards);
}
