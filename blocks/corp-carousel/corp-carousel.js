import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const slideshowContainer = document.createElement('div');
  slideshowContainer.className = 'corp-carousel-slideshow-container';
  slideshowContainer.style.position = 'relative';
  slideshowContainer.id = 'carousel-main';

  const dotContainer = document.createElement('div');
  dotContainer.style.textAlign = 'center';

  const slides = block.querySelectorAll('[data-aue-model="slide"]');
  slides.forEach((slideNode, i) => {
    const slideDiv = document.createElement('div');
    slideDiv.className = 'corp-carousel-mySlides';
    slideDiv.style.display = i === 0 ? 'block' : 'none';

    const linkElement = slideNode.querySelector('[data-aue-prop="link"]');
    const linkHref = linkElement ? linkElement.href : '#';
    const linkTarget = linkElement ? linkElement.target : '_self';

    const anchor = document.createElement('a');
    anchor.href = linkHref;
    anchor.target = linkTarget;

    const imageMobile = slideNode.querySelector('[data-aue-prop="imageMobile"]');
    if (imageMobile) {
      const mobilePicture = createOptimizedPicture(imageMobile.src, imageMobile.alt);
      const mobileImg = mobilePicture.querySelector('img');
      mobileImg.className = 'corp-carousel-generic-mobile';
      anchor.append(mobilePicture);
      moveInstrumentation(imageMobile, mobilePicture);
    }

    const imageDesktop = slideNode.querySelector('[data-aue-prop="imageDesktop"]');
    if (imageDesktop) {
      const desktopPicture = createOptimizedPicture(imageDesktop.src, imageDesktop.alt);
      const desktopImg = desktopPicture.querySelector('img');
      desktopImg.className = 'corp-carousel-generic-desktop';
      anchor.append(desktopPicture);
      moveInstrumentation(imageDesktop, desktopPicture);
    }

    slideDiv.append(anchor);
    slideshowContainer.append(slideDiv);
    moveInstrumentation(slideNode, slideDiv);

    const dotSpan = document.createElement('span');
    dotSpan.className = `corp-carousel-dot${i === 0 ? ' corp-carousel-active' : ''}`;
    dotContainer.append(dotSpan);
  });

  const prevButton = document.createElement('a');
  prevButton.className = 'corp-carousel-prev';
  slideshowContainer.append(prevButton);

  const nextButton = document.createElement('a');
  nextButton.className = 'corp-carousel-next';
  slideshowContainer.append(nextButton);

  block.textContent = '';
  block.append(slideshowContainer);
  block.append(dotContainer);
  block.className = 'corp-carousel corp-carousel-block';
  block.dataset.blockStatus = 'loaded';
}
