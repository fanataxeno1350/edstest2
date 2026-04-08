import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add(
    'HomeHero-module-scss-module__EGjjDa__section',
    'HomeHero-module-scss-module__EGjjDa__sectionWithEllipse',
  );
  section.setAttribute('aria-label', 'Hero banner');

  [...block.children].forEach((row) => {
    const slideContent = document.createElement('div');
    slideContent.classList.add('HomeHero-module-scss-module__EGjjDa__slideContent');
    moveInstrumentation(row, slideContent);

    let imageEl = null;
    let linkEl = null;

    // Use content detection instead of row.children[n]
    const cells = [...row.children];
    const imageCell = cells.find((cell) => cell.querySelector('picture'));
    const linkCell = cells.find((cell) => cell.querySelector('a'));

    if (imageCell) {
      imageEl = imageCell.querySelector('picture').querySelector('img');
    }
    if (linkCell) {
      linkEl = linkCell.querySelector('a');
    }

    if (imageEl) {
      const heroImage = createOptimizedPicture(imageEl.src, imageEl.alt, false, [{ width: '750' }]);
      heroImage.querySelector('img').classList.add('HomeHero-module-scss-module__EGjjDa__heroImage');
      heroImage.querySelector('img').style.cssText = 'position:absolute;height:100%;width:100%;left:0;top:0;right:0;bottom:0;color:transparent';
      moveInstrumentation(imageEl, heroImage.querySelector('img'));
      slideContent.append(heroImage);
    }

    if (linkEl) {
      const slideBlock = document.createElement('div');
      slideBlock.classList.add('HomeHero-module-scss-module__EGjjDa__slideBlock');

      const scrollIndicator = document.createElement('a');
      scrollIndicator.classList.add(
        'HomeHero-module-scss-module__EGjjDa__scrollIndicator',
        'HomeHero-module-scss-module__EGjjDa__fadeInFromTop',
      );
      scrollIndicator.href = linkEl.href;
      scrollIndicator.setAttribute('aria-label', 'Scroll to featured products');
      scrollIndicator.style.animationDelay = '0.5s';

      const img = linkEl.querySelector('img');
      if (img) {
        const svgImg = document.createElement('img');
        svgImg.src = img.src;
        svgImg.alt = img.alt;
        scrollIndicator.append(svgImg);
      } else {
        scrollIndicator.append(linkEl.textContent);
      }
      moveInstrumentation(linkEl, scrollIndicator);
      slideBlock.append(scrollIndicator);
      slideContent.append(slideBlock);
    }

    section.append(slideContent);
  });

  block.textContent = '';
  block.append(section);
}
