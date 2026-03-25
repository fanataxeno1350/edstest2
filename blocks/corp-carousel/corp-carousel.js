import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const slideshowContainer = document.createElement('div');
  slideshowContainer.className = 'slideshow-container';
  slideshowContainer.style.position = 'relative';
  slideshowContainer.id = 'carousel-main';

  const dotsContainer = document.createElement('div');
  dotsContainer.style.textAlign = 'center';

  const slides = block.querySelectorAll('[data-aue-model="carouselSlide"]');
  slides.forEach((slideNode, index) => {
    const mySlide = document.createElement('div');
    mySlide.className = 'mySlides';
    mySlide.style.display = index === 0 ? 'block' : 'none';

    const linkElement = slideNode.querySelector('[data-aue-prop="link"]');
    const linkHref = linkElement ? linkElement.textContent.trim() : '';

    const anchor = document.createElement('a');
    if (linkHref) {
      anchor.href = linkHref;
      anchor.target = linkHref;
    }

    const imageMobileElement = slideNode.querySelector('[data-aue-prop="imageMobile"]');
    if (imageMobileElement) {
      const imgMobile = imageMobileElement.querySelector('img');
      if (imgMobile) {
        const pictureMobile = createOptimizedPicture(imgMobile.src, imgMobile.alt);
        pictureMobile.querySelector('img').className = 'generic-mobile';
        anchor.append(pictureMobile);
        moveInstrumentation(imageMobileElement, pictureMobile);
      }
    }

    const imageDesktopElement = slideNode.querySelector('[data-aue-prop="imageDesktop"]');
    if (imageDesktopElement) {
      const imgDesktop = imageDesktopElement.querySelector('img');
      if (imgDesktop) {
        const pictureDesktop = createOptimizedPicture(imgDesktop.src, imgDesktop.alt);
        pictureDesktop.querySelector('img').className = 'generic-desktop';
        anchor.append(pictureDesktop);
        moveInstrumentation(imageDesktopElement, pictureDesktop);
      }
    }

    mySlide.append(anchor);
    slideshowContainer.append(mySlide);
    moveInstrumentation(slideNode, mySlide);

    const dot = document.createElement('span');
    dot.className = index === 0 ? 'dot active' : 'dot';
    dotsContainer.append(dot);
  });

  const prevButton = document.createElement('a');
  prevButton.className = 'prev';
  slideshowContainer.append(prevButton);

  const nextButton = document.createElement('a');
  nextButton.className = 'next';
  slideshowContainer.append(nextButton);

  block.textContent = '';
  block.append(slideshowContainer);
  block.append(dotsContainer);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
