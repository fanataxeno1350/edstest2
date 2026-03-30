import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const carouselItems = block.querySelectorAll('[data-aue-model="carouselItem"]');

  const carouselWrapper = document.createElement('div');
  carouselWrapper.classList.add('carousel-wrapper');

  carouselItems.forEach((itemNode) => {
    const slide = document.createElement('div');
    slide.classList.add('carousel-slide');

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('carousel-slide-content');

    // Background Image
    const backgroundImageSrc = itemNode.querySelector('[data-aue-prop="backgroundImage"]')?.textContent.trim();
    if (backgroundImageSrc) {
      slide.style.backgroundImage = `url("${backgroundImageSrc}")`;
    }

    // Logo Image
    const logoImg = itemNode.querySelector('[data-aue-prop="logoImage"]');
    if (logoImg) {
      const logoPicture = createOptimizedPicture(logoImg.src, logoImg.alt);
      logoPicture.classList.add('carousel-logo');
      contentWrapper.append(logoPicture);
      moveInstrumentation(logoImg, logoPicture);
    }

    // Title
    const titleElement = itemNode.querySelector('[data-aue-prop="title"]');
    if (titleElement) {
      const h2 = document.createElement('h2');
      h2.classList.add('carousel-title');
      h2.textContent = titleElement.textContent.trim();
      contentWrapper.append(h2);
      moveInstrumentation(titleElement, h2);
    }

    // Subtitle
    const subtitleElement = itemNode.querySelector('[data-aue-prop="subtitle"]');
    if (subtitleElement) {
      const h3 = document.createElement('h3');
      h3.classList.add('carousel-subtitle');
      h3.textContent = subtitleElement.textContent.trim();
      contentWrapper.append(h3);
      moveInstrumentation(subtitleElement, h3);
    }

    // Main Image (Desktop and Mobile)
    const mainImageDesktop = itemNode.querySelector('[data-aue-prop="mainImageDesktop"]');
    const mainImageMobile = itemNode.querySelector('[data-aue-prop="mainImageMobile"]');

    if (mainImageDesktop || mainImageMobile) {
      const picture = document.createElement('picture');
      picture.classList.add('carousel-main-image');

      if (mainImageMobile) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width: 600px)';
        sourceMobile.srcset = mainImageMobile.src;
        picture.append(sourceMobile);
        moveInstrumentation(mainImageMobile, sourceMobile);
      }

      if (mainImageDesktop) {
        const img = createOptimizedPicture(mainImageDesktop.src, mainImageDesktop.alt).querySelector('img');
        picture.append(img);
        moveInstrumentation(mainImageDesktop, img);
      }
      contentWrapper.append(picture);
    }

    // CTA Link
    const ctaLinkElement = itemNode.querySelector('[data-aue-prop="ctaLink"]');
    const ctaTextElement = itemNode.querySelector('[data-aue-prop="ctaText"]');

    if (ctaLinkElement && ctaTextElement) {
      const buttonContainer = document.createElement('div');
      buttonContainer.classList.add('button-container');
      const link = document.createElement('a');
      link.href = ctaLinkElement.textContent.trim();
      link.textContent = ctaTextElement.textContent.trim();
      link.classList.add('button', 'primary');
      buttonContainer.append(link);
      contentWrapper.append(buttonContainer);
      moveInstrumentation(ctaLinkElement, link);
      moveInstrumentation(ctaTextElement, link);
    }

    slide.append(contentWrapper);
    carouselWrapper.append(slide);
    moveInstrumentation(itemNode, slide);
  });

  block.textContent = '';
  block.append(carouselWrapper);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
