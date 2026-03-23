import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselItems = block.querySelectorAll('[data-cmp-hook-carousel="item"]');

  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList.add('carousel-wrapper');

  carouselItems.forEach((itemNode) => {
    const itemWrapper = document.createElement('div');
    itemWrapper.classList.add('carousel-item');

    const videoElement = itemNode.querySelector('video.carousel-banner-video');
    const imageElement = itemNode.querySelector('img.carousel-banner-image');
    const ctaLinkContainer = itemNode.querySelector('.carousel-banner-cta');

    if (videoElement) {
      const videoWrapper = document.createElement('div');
      videoWrapper.classList.add('video-wrapper');
      videoWrapper.append(videoElement);
      itemWrapper.append(videoWrapper);
      moveInstrumentation(videoElement, videoWrapper);
    } else if (imageElement) {
      const picture = createOptimizedPicture(imageElement.src, imageElement.alt);
      itemWrapper.append(picture);
      moveInstrumentation(imageElement, picture);
    }

    if (ctaLinkContainer) {
      const link = ctaLinkContainer.querySelector('a.carousel-cmp-button');
      if (link) {
        const linkWrapper = document.createElement('div');
        linkWrapper.classList.add('carousel-cta');
        linkWrapper.append(link);
        itemWrapper.append(linkWrapper);
        moveInstrumentation(link, linkWrapper);
      }
      moveInstrumentation(ctaLinkContainer, itemWrapper); // Instrument the original container as well
    }

    wrapperDiv.append(itemWrapper);
    moveInstrumentation(itemNode, itemWrapper);
  });

  block.textContent = '';
  block.append(wrapperDiv);
  block.className = 'carousel block';
  block.dataset.blockStatus = 'loaded';
}
