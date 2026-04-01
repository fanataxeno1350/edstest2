import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselContainer = document.createElement('div');
  carouselContainer.classList.add('cmp-carousel__container', 'slick-initialized', 'slick-slider');

  const slickList = document.createElement('div');
  slickList.classList.add('slick-list', 'draggable');

  const slickTrack = document.createElement('div');
  slickTrack.classList.add('slick-track');
  slickTrack.style.opacity = '1';

  [...block.children].forEach((row, index) => {
    const itemDiv = document.createElement('div');
    moveInstrumentation(row, itemDiv);
    itemDiv.classList.add(
      'cmp-our-foot-print__carousel-item',
      'cmp-carousel__item',
      // 'cmp-our-foot-print-carouselcard-index-${index}', // This class is not in the allowlist
      'slick-slide',
    );
    if (index === 0) {
      itemDiv.classList.add('slick-current', 'slick-active');
      itemDiv.setAttribute('aria-hidden', 'false');
    } else {
      itemDiv.setAttribute('aria-hidden', 'true');
    }
    itemDiv.setAttribute('data-slick-index', index.toString());
    itemDiv.setAttribute('tabindex', '0');

    const itemContent = document.createElement('div');
    itemContent.classList.add('item');

    const card = document.createElement('div');
    card.classList.add('card', 'cmp-card--foot-print');
    // Add default or highlighted class based on index or other logic if available
    if (index === 0) {
      card.classList.add('cmp-card--foot-print-highlighted', 'color-background-background-2');
    } else if (index === 1) {
      card.classList.add('cmp-card--foot-print-default', 'color-background-primary-6');
    } else {
      card.classList.add('cmp-card--foot-print-default', 'color-background-background-3');
    }

    const cmpCard = document.createElement('div');
    cmpCard.classList.add('cmp-card');

    const cmpCardContent = document.createElement('div');
    cmpCardContent.classList.add('cmp-card__content');

    const [titleCell, descriptionCell, videoUrlCell] = [...row.children];

    // Video Embed
    const videoLink = videoUrlCell.querySelector('a');
    if (videoLink && videoLink.href !== 'https://example.com/video-embed-url') {
      const cmpCardMedia = document.createElement('div');
      cmpCardMedia.classList.add('cmp-card__media');

      const cmpCardImage = document.createElement('div');
      cmpCardImage.classList.add('cmp-card__image');

      const videoDiv = document.createElement('div');
      videoDiv.classList.add('video', 'cmp-video--foot-print-card');

      const cmpVideo = document.createElement('div');
      cmpVideo.classList.add('cmp-video');

      const youtubeWrapper = document.createElement('div');
      youtubeWrapper.classList.add('cmp-video__youtube-wrapper');
      youtubeWrapper.style.minHeight = '200px';

      const iframeWrapper = document.createElement('div');
      iframeWrapper.classList.add('cmp-video__iframe-wrapper');

      const iframe = document.createElement('iframe');
      iframe.classList.add('cmp-video__iframe');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      iframe.setAttribute('title', titleCell.textContent.trim());
      iframe.setAttribute('width', '640');
      iframe.setAttribute('height', '360');
      iframe.setAttribute('loading', 'lazy');
      iframe.setAttribute('src', videoLink.href.replace('watch?v=', 'embed/'));
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');

      iframeWrapper.append(iframe);
      youtubeWrapper.append(iframeWrapper);
      cmpVideo.append(youtubeWrapper);
      videoDiv.append(cmpVideo);
      cmpCardImage.append(videoDiv);
      cmpCardMedia.append(cmpCardImage);
      cmpCardContent.append(cmpCardMedia);
    }

    // Card Info
    const cmpCardInfo = document.createElement('div');
    cmpCardInfo.classList.add('cmp-card__info');

    const cmpCardTitle = document.createElement('div');
    cmpCardTitle.classList.add('cmp-card__title');
    moveInstrumentation(titleCell, cmpCardTitle);
    while (titleCell.firstChild) cmpCardTitle.append(titleCell.firstChild);

    const cmpCardDesc = document.createElement('div');
    cmpCardDesc.classList.add('cmp-card__desc');
    moveInstrumentation(descriptionCell, cmpCardDesc);
    while (descriptionCell.firstChild) cmpCardDesc.append(descriptionCell.firstChild);

    cmpCardInfo.append(cmpCardTitle, cmpCardDesc);
    cmpCardContent.append(cmpCardInfo);
    cmpCard.append(cmpCardContent);
    itemContent.append(card);
    itemDiv.append(itemContent);
    slickTrack.append(itemDiv);
  });

  slickList.append(slickTrack);
  carouselContainer.append(slickList);

  block.textContent = '';
  block.classList.add('slickcarousel', 'carousel', 'panelcontainer');
  block.setAttribute('data-component', 'carousel');
  block.setAttribute('data-show-infinite-scroll', 'false');
  block.setAttribute('data-show-arrows', 'false');
  block.setAttribute('data-show-dots', 'true');
  block.setAttribute('data-item-count-per-slide', '1');
  block.setAttribute('data-auto-play-is-enabled', 'false');
  block.setAttribute('data-auto-play-speed-in-ms', '500');
  block.setAttribute('data-reveal-next-item-partially', 'false');
  block.setAttribute('data-show-center-zoom', 'false');
  block.setAttribute('data-slides-to-scroll', '1');
  block.setAttribute('data-initialized', 'true');
  block.append(carouselContainer);
}
