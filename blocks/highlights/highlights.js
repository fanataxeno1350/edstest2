import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const highlightItemsContainer = document.createElement('div');
  highlightItemsContainer.classList.add('highlight-items-container');

  [...block.children].forEach((row, index) => {
    const highlightCard = document.createElement('div');
    highlightCard.classList.add('highlight__card', `gradient${index + 1}`);
    moveInstrumentation(row, highlightCard);

    const highlightContent = document.createElement('div');
    highlightContent.classList.add('highlight__content');
    highlightCard.append(highlightContent);

    const highlightInfo = document.createElement('div');
    highlightInfo.classList.add('highlight__info');
    highlightContent.append(highlightInfo);

    const highlightContainer = document.createElement('div');
    highlightContainer.classList.add('highlight-container');
    highlightInfo.append(highlightContainer);

    const highlightTop = document.createElement('div');
    highlightTop.classList.add('highlight__top');
    highlightContainer.append(highlightTop);

    const highlightIconSpan = document.createElement('span');
    highlightIconSpan.classList.add('highlightIcon');
    highlightTop.append(highlightIconSpan);

    const highlightTopDescription = document.createElement('div');
    highlightTopDescription.classList.add('highlight__top__description');
    highlightTop.append(highlightTopDescription);

    // Based on BlockJson:
    // cell[0]: field="icon"
    // cell[1]: field="heading"
    // cell[2]: field="link"
    // cell[3]: field="ctaTitle"
    // cell[4]: field="description"

    const cells = [...row.children];
    const iconCell = cells[0];
    const headingCell = cells[1];
    const linkCell = cells[2];
    const ctaTitleCell = cells[3];
    const descriptionCell = cells[4];

    if (iconCell) {
      // Move the picture element into the highlightIcon span
      while (iconCell.firstChild) highlightIconSpan.append(iconCell.firstChild);
    }

    if (headingCell) {
      const h3 = document.createElement('h3');
      moveInstrumentation(headingCell, h3);
      while (headingCell.firstChild) h3.append(headingCell.firstChild);
      highlightTopDescription.append(h3);
    }

    if (linkCell && ctaTitleCell && descriptionCell) {
      const foundLink = linkCell.querySelector('a');
      const anchor = document.createElement('a');
      anchor.classList.add('bottom-section');
      if (foundLink) {
        anchor.href = foundLink.href;
        if (foundLink.target) anchor.target = foundLink.target;
        if (foundLink.rel) anchor.rel = foundLink.rel;
        // Check for data-modal, data-redirect, data-href attributes from original HTML
        if (foundLink.dataset.modal) anchor.dataset.modal = foundLink.dataset.modal;
        if (foundLink.dataset.redirect) anchor.dataset.redirect = foundLink.dataset.redirect;
        if (foundLink.dataset.href) anchor.dataset.href = foundLink.dataset.href;
      }
      moveInstrumentation(linkCell, anchor);

      const separator = document.createElement('span');
      separator.classList.add('separator');
      anchor.append(separator);

      const bottomContent = document.createElement('div');
      bottomContent.classList.add('bottom__content');
      anchor.append(bottomContent);

      const btmTitle = document.createElement('div');
      btmTitle.classList.add('btm-title');
      bottomContent.append(btmTitle);

      const h4 = document.createElement('h4');
      h4.classList.add('h-title');
      moveInstrumentation(ctaTitleCell, h4);
      while (ctaTitleCell.firstChild) h4.append(ctaTitleCell.firstChild);
      btmTitle.append(h4);

      const arrowLink = document.createElement('span');
      arrowLink.classList.add('arrow-link');
      btmTitle.append(arrowLink);

      const highlightBottomDescription = document.createElement('div');
      highlightBottomDescription.classList.add('highlight__bottom__description', 'g-xl-2');
      bottomContent.append(highlightBottomDescription);

      const p = document.createElement('p');
      moveInstrumentation(descriptionCell, p);
      while (descriptionCell.firstChild) p.append(descriptionCell.firstChild);
      highlightBottomDescription.append(p);

      const backgroundOverlay = document.createElement('div');
      backgroundOverlay.classList.add('background-overlay');
      anchor.append(backgroundOverlay);

      highlightContainer.append(anchor);
    }

    highlightItemsContainer.append(highlightCard);
  });

  highlightItemsContainer.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(highlightItemsContainer);
}
