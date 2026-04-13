import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const highlightItemsContainer = document.createElement('div');
  highlightItemsContainer.classList.add('highlight-items-container');

  [...block.children].forEach((row, index) => {
    const highlightCard = document.createElement('div');
    highlightCard.classList.add('highlight__card', `gradient${(index % 5) + 1}`); // Gradients are gradient1 to gradient5

    const highlightContent = document.createElement('div');
    highlightContent.classList.add('highlight__content');
    highlightCard.append(highlightContent);

    const highlightInfo = document.createElement('div');
    highlightInfo.classList.add('highlight__info');
    highlightContent.append(highlightInfo);

    const highlightContainer = document.createElement('div');
    highlightContainer.classList.add('highlight-container');
    highlightInfo.append(highlightContainer);

    const cells = [...row.children];

    // Icon (cell with a picture)
    const iconCell = cells.find((cell) => cell.querySelector('picture'));
    const highlightTop = document.createElement('div');
    highlightTop.classList.add('highlight__top');
    const iconSpan = document.createElement('span');
    iconSpan.classList.add('highlightIcon');
    if (iconCell) {
      const picture = iconCell.querySelector('picture');
      if (picture) {
        moveInstrumentation(picture, iconSpan);
        iconSpan.append(picture);
      }
    }
    highlightTop.append(iconSpan);
    highlightContainer.append(highlightTop);

    // Top Description (cell with text content, not a picture or a link, and not the CTA label)
    const topDescriptionCell = cells.find((cell) =>
      !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '' && cell.textContent.trim() !== cells.find(c => c.querySelector('a'))?.textContent.trim()
    );
    const topDescriptionDiv = document.createElement('div');
    topDescriptionDiv.classList.add('highlight__top__description');
    const h3 = document.createElement('h3');
    if (topDescriptionCell) {
      moveInstrumentation(topDescriptionCell, h3);
      h3.textContent = topDescriptionCell.textContent.trim();
    }
    topDescriptionDiv.append(h3);
    highlightTop.append(topDescriptionDiv);

    // CTA Link (cell with an anchor tag)
    const ctaLinkCell = cells.find((cell) => cell.querySelector('a'));
    // CTA Label (cell with text content, not a picture or a link, and is distinct from topDescription)
    const ctaLabelCell = cells.find((cell) =>
      !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '' && cell !== topDescriptionCell
    );
    // Bottom Description (remaining text cell, if any)
    const bottomDescriptionCell = cells.find((cell) =>
      !cell.querySelector('picture') && !cell.querySelector('a') && cell.textContent.trim() !== '' && cell !== topDescriptionCell && cell !== ctaLabelCell
    );

    const ctaLink = ctaLinkCell ? ctaLinkCell.querySelector('a') : null;
    const bottomSection = document.createElement('a');
    bottomSection.classList.add('bottom-section');
    if (ctaLink) {
      bottomSection.href = ctaLink.href;
      if (ctaLink.target) bottomSection.target = ctaLink.target;
      if (ctaLink.rel) bottomSection.rel = ctaLink.rel;
    }
    if (ctaLinkCell) {
      moveInstrumentation(ctaLinkCell, bottomSection);
    }
    highlightContainer.append(bottomSection);

    const separator = document.createElement('span');
    separator.classList.add('separator');
    bottomSection.append(separator);

    const bottomContent = document.createElement('div');
    bottomContent.classList.add('bottom__content');
    bottomSection.append(bottomContent);

    const btmTitle = document.createElement('div');
    btmTitle.classList.add('btm-title');
    bottomContent.append(btmTitle);

    const h4 = document.createElement('h4');
    h4.classList.add('h-title');
    if (ctaLabelCell) {
      moveInstrumentation(ctaLabelCell, h4);
      h4.textContent = ctaLabelCell.textContent.trim();
    }
    btmTitle.append(h4);

    const arrowLink = document.createElement('span');
    arrowLink.classList.add('arrow-link');
    btmTitle.append(arrowLink);

    const bottomDescriptionDiv = document.createElement('div');
    bottomDescriptionDiv.classList.add('highlight__bottom__description', 'g-xl-2');
    const p = document.createElement('p');
    if (bottomDescriptionCell) {
      moveInstrumentation(bottomDescriptionCell, p);
      p.textContent = bottomDescriptionCell.textContent.trim();
    }
    bottomDescriptionDiv.append(p);
    bottomContent.append(bottomDescriptionDiv);

    const backgroundOverlay = document.createElement('div');
    backgroundOverlay.classList.add('background-overlay');
    bottomSection.append(backgroundOverlay);

    moveInstrumentation(row, highlightCard);
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
