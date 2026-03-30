import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const mainDiv = document.createElement('div');
  mainDiv.classList.add('footprint-cmp-our-foot-print');

  const headerDiv = document.createElement('div');
  headerDiv.classList.add('footprint-cmp-our-foot-print__header');
  const titleElement = document.createElement('h2');
  titleElement.classList.add('footprint-cmp-our-foot-print__title');
  const authoredTitle = block.querySelector('h2.footprint-cmp-our-foot-print__title');
  if (authoredTitle) {
    titleElement.append(...authoredTitle.childNodes);
    moveInstrumentation(authoredTitle, titleElement);
  }
  headerDiv.append(titleElement);
  mainDiv.append(headerDiv);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('footprint-cmp-our-foot-print__content');

  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('footprint-cmp-carousel');
  carouselContainer.setAttribute('data-component', 'carousel');
  carouselContainer.setAttribute('data-show-infinite-scroll', 'false');
  carouselContainer.setAttribute('data-show-arrows', 'false');
  carouselContainer.setAttribute('data-show-dots', 'true');
  carouselContainer.setAttribute('data-item-count-per-slide', '1');
  carouselContainer.setAttribute('data-auto-play-is-enabled', 'false');
  carouselContainer.setAttribute('data-auto-play-speed-in-ms', '500');
  carouselContainer.setAttribute('data-reveal-next-item-partially', 'false');
  carouselContainer.setAttribute('data-show-center-zoom', 'false');
  carouselContainer.setAttribute('data-slides-to-scroll', '1');
  carouselContainer.setAttribute('data-initialized', 'true');

  const carouselInnerContainer = document.createElement('div');
  carouselInnerContainer.classList.add('footprint-cmp-carousel__container');

  const carouselTrack = document.createElement('div');
  carouselTrack.classList.add('footprint-cmp-carousel__track');

  const authoredCards = block.querySelectorAll('[data-aue-model="footprintCard"]');
  authoredCards.forEach((cardNode) => {
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('footprint-cmp-our-foot-print__carousel-item', 'footprint-cmp-carousel__item');

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('footprint-item');

    const cardDiv = document.createElement('div');
    cardDiv.classList.add('footprint-card', 'footprint-cmp-card--foot-print');

    const cmpCardDiv = document.createElement('div');
    cmpCardDiv.classList.add('footprint-cmp-card');

    const cmpCardContent = document.createElement('div');
    cmpCardContent.classList.add('footprint-cmp-card__content');

    const videoProp = cardNode.querySelector('[data-aue-prop="video"]');
    if (videoProp) {
      const mediaDiv = document.createElement('div');
      mediaDiv.classList.add('footprint-cmp-card__media');
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('footprint-cmp-card__image');
      const videoWrapper = document.createElement('div');
      videoWrapper.classList.add('footprint-video', 'footprint-cmp-video--foot-print-card');
      const cmpVideoDiv = document.createElement('div');
      cmpVideoDiv.classList.add('footprint-cmp-video');
      const youtubeWrapper = document.createElement('div');
      youtubeWrapper.classList.add('footprint-cmp-video__youtube-wrapper');
      youtubeWrapper.style.minHeight = '200px';
      const iframeWrapper = document.createElement('div');
      iframeWrapper.classList.add('footprint-cmp-video__iframe-wrapper');
      const iframe = videoProp.querySelector('iframe');
      if (iframe) {
        iframeWrapper.append(iframe);
        moveInstrumentation(iframe, iframeWrapper);
      }
      youtubeWrapper.append(iframeWrapper);
      cmpVideoDiv.append(youtubeWrapper);
      videoWrapper.append(cmpVideoDiv);
      imageDiv.append(videoWrapper);
      mediaDiv.append(imageDiv);
      cmpCardContent.append(mediaDiv);
      moveInstrumentation(videoProp, mediaDiv);
    }

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('footprint-cmp-card__info');

    const titleDiv = document.createElement('div');
    titleDiv.classList.add('footprint-cmp-card__title');
    const authoredTitleContent = cardNode.querySelector('[data-aue-prop="title"]');
    if (authoredTitleContent) {
      titleDiv.append(...authoredTitleContent.childNodes);
      moveInstrumentation(authoredTitleContent, titleDiv);
    }

    const descDiv = document.createElement('div');
    descDiv.classList.add('footprint-cmp-card__desc');
    const authoredDescContent = cardNode.querySelector('[data-aue-prop="description"]');
    if (authoredDescContent) {
      descDiv.append(...authoredDescContent.childNodes);
      moveInstrumentation(authoredDescContent, descDiv);
    }

    infoDiv.append(titleDiv, descDiv);
    cmpCardContent.append(infoDiv);
    cmpCardDiv.append(cmpCardContent);
    cardDiv.append(cmpCardDiv);
    itemDiv.append(cardDiv);
    carouselItem.append(itemDiv);
    carouselTrack.append(carouselItem);
    moveInstrumentation(cardNode, carouselItem);
  });

  carouselInnerContainer.append(carouselTrack);
  carouselContainer.append(carouselInnerContainer);
  contentDiv.append(carouselContainer);
  mainDiv.append(contentDiv);

  block.textContent = '';
  block.append(mainDiv);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
