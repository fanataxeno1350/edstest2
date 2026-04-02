import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, buttonLinkRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('news-features');

  // Title
  const titleContainer = document.createElement('div');
  titleContainer.classList.add('u-container', 'u-width-10');
  const titleEl = document.createElement('h2');
  titleEl.classList.add('news-features-title', 'fade-in', 'appear');
  moveInstrumentation(titleRow.firstElementChild, titleEl);
  while (titleRow.firstElementChild.firstChild) {
    titleEl.append(titleRow.firstElementChild.firstChild);
  }
  titleContainer.append(titleEl);
  section.append(titleContainer);

  const newsFeaturesContainer = document.createElement('div');
  newsFeaturesContainer.classList.add('news-features-container');

  const uContainer = document.createElement('div');
  uContainer.classList.add('u-container');

  const heroMosaic = document.createElement('div');
  heroMosaic.classList.add('hero-mosaic', 'grid-3');

  itemRows.forEach((row, index) => {
    const article = document.createElement('article');
    article.classList.add('hero-mosaic-item', 'slide-in', 'appear');
    if (index === 0) {
      article.classList.add('-feature', 'from-left');
    } else if (index === 1) {
      article.classList.add('special-feature', 'from-right');
    } else {
      article.classList.add('from-right');
    }

    // Content detection for item row cells
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const headlineCell = cells.find(cell => !cell.querySelector('a'));

    const linkEl = document.createElement('a');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      moveInstrumentation(linkCell, linkEl);
      // Append all children of the link cell to the new link element
      while (linkCell.firstChild) {
        linkEl.append(linkCell.firstChild);
      }
    }

    const h5 = document.createElement('h5');
    h5.classList.add('support-link');
    linkEl.prepend(h5); // Prepended as per original HTML structure

    const h2 = document.createElement('h2');
    moveInstrumentation(headlineCell, h2);
    while (headlineCell.firstChild) {
      h2.append(headlineCell.firstChild);
    }
    linkEl.append(h2);

    const h4 = document.createElement('h4');
    h4.classList.add('support-link');
    h4.textContent = 'Read more'; // Hardcoded as per original HTML
    linkEl.append(h4);

    article.append(linkEl);

    // Add placeholder spans for background images
    const heroBackground = document.createElement('span');
    heroBackground.classList.add('hero-background');
    // Original HTML has dynamic IDs, we can omit for now or generate if needed
    // heroBackground.id = `field-${index === 0 ? 'left-feature' : index === 1 ? 'right-top-feature' : 'right-bottom-feature'}_css_...`;
    article.append(heroBackground);

    const heroBackgroundPlaceholder = document.createElement('span');
    heroBackgroundPlaceholder.classList.add('hero-background-placeholder');
    article.append(heroBackgroundPlaceholder);

    heroMosaic.append(article);
  });

  uContainer.append(heroMosaic);
  newsFeaturesContainer.append(uContainer);

  // Button Link
  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('field-formation-wrapper', 'u-text-centered', 'news-features-button');
  const buttonLink = document.createElement('a');
  buttonLink.classList.add('u-button', 'u-button-blue');
  const foundButtonLink = buttonLinkRow.querySelector('a');
  if (foundButtonLink) {
    buttonLink.href = foundButtonLink.href;
    moveInstrumentation(buttonLinkRow.firstElementChild, buttonLink);
    while (buttonLinkRow.firstElementChild.firstChild) {
      buttonLink.append(buttonLinkRow.firstElementChild.firstChild);
    }
  }
  buttonWrapper.append(buttonLink);
  newsFeaturesContainer.append(buttonWrapper);

  section.append(newsFeaturesContainer);

  // Image optimization (if any images were present in the cells, which they are not in this model)
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(section);
}
