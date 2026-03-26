import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const highlightItemsContainer = document.createElement('div');
  highlightItemsContainer.classList.add('highlight-items-container');

  // Skip the first row which is the container title, start from the actual item rows
  const itemRows = [...block.children].slice(1);

  itemRows.forEach((row, index) => {
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

    const highlightIcon = document.createElement('span');
    highlightIcon.classList.add('highlightIcon');
    highlightTop.append(highlightIcon);

    const highlightTopDescription = document.createElement('div');
    highlightTopDescription.classList.add('highlight__top__description');
    highlightTop.append(highlightTopDescription);

    // Read cells based on BlockJson model: title, link, label, description
    const cells = [...row.children];
    const titleCell = cells[0];
    const linkCell = cells[1];
    const labelCell = cells[2];
    const descriptionCell = cells[3];

    let titleEl;
    if (titleCell) {
      titleEl = titleCell.querySelector('h1, h2, h3, h4, h5, h6');
      if (!titleEl) { // If no heading, take the entire cell content
        titleEl = titleCell;
      }
    }

    let linkEl;
    if (linkCell) {
      linkEl = linkCell.querySelector('a');
    }

    let labelEl;
    if (labelCell) {
      labelEl = labelCell;
    }

    let descriptionEl;
    if (descriptionCell) {
      descriptionEl = descriptionCell.querySelector('p');
      if (!descriptionEl) { // If no paragraph, take the entire cell content
        descriptionEl = descriptionCell;
      }
    }

    if (titleEl) {
      const h3 = document.createElement('h3');
      moveInstrumentation(titleEl, h3);
      while (titleEl.firstChild) h3.append(titleEl.firstChild);
      highlightTopDescription.append(h3);
    }

    const bottomSection = document.createElement('a');
    bottomSection.classList.add('bottom-section');
    if (linkEl) {
      bottomSection.href = linkEl.href;
      if (linkEl.target) bottomSection.target = linkEl.target;
      if (linkEl.rel) bottomSection.rel = linkEl.rel;
      moveInstrumentation(linkEl, bottomSection);
    }
    bottomSection.setAttribute('data-href', '');
    bottomSection.setAttribute('data-modal', '');
    bottomSection.setAttribute('data-redirect', '');
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

    if (labelEl) {
      const h4 = document.createElement('h4');
      h4.classList.add('h-title');
      moveInstrumentation(labelEl, h4);
      while (labelEl.firstChild) h4.append(labelEl.firstChild);
      btmTitle.append(h4);
    }

    const arrowLink = document.createElement('span');
    arrowLink.classList.add('arrow-link');
    btmTitle.append(arrowLink);

    if (descriptionEl) {
      const highlightBottomDescription = document.createElement('div');
      highlightBottomDescription.classList.add('highlight__bottom__description', 'g-xl-2');
      moveInstrumentation(descriptionEl, highlightBottomDescription);
      while (descriptionEl.firstChild) highlightBottomDescription.append(descriptionEl.firstChild);
      bottomContent.append(highlightBottomDescription);
    }

    const backgroundOverlay = document.createElement('div');
    backgroundOverlay.classList.add('background-overlay');
    bottomSection.append(backgroundOverlay);

    highlightItemsContainer.append(highlightCard);

    // Add event listener for modal functionality if data-modal is present
    if (bottomSection.hasAttribute('data-modal')) {
      bottomSection.addEventListener('click', (e) => {
        // Prevent default navigation if a modal is intended
        if (bottomSection.getAttribute('data-modal') === '') {
          e.preventDefault();
          // Example: Open a modal (this would typically involve a modal component)
          console.log('Modal functionality triggered for:', bottomSection.href);
          // You would add logic here to open your specific modal
          // e.g., document.body.classList.add('modal-open');
          // e.g., const modal = document.querySelector('.my-modal'); modal.style.display = 'block';
        }
      });
    }
  });

  block.textContent = '';
  block.append(highlightItemsContainer);
}
