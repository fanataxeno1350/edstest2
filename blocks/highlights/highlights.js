import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const highlightItemsContainer = document.createElement('div');
  highlightItemsContainer.classList.add('highlight-items-container');

  const gradients = ['gradient1', 'gradient2', 'gradient3', 'gradient4', 'gradient5'];
  let gradientIndex = 0;

  [...block.children].forEach((row) => {
    const highlightCard = document.createElement('div');
    highlightCard.classList.add('highlight__card', gradients[gradientIndex % gradients.length]);
    gradientIndex++;

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

    // Use content detection based on BlockJson model fields
    const cells = [...row.children];
    const titleCell = cells[0]; // field="title" type=text
    const subtitleCell = cells[1]; // field="subtitle" type=text
    const descriptionCell = cells[2]; // field="description" type=richtext
    const linkCell = cells[3]; // field="link" type=aem-content

    const titleText = titleCell ? titleCell.textContent.trim() : '';
    const subtitleText = subtitleCell ? subtitleCell.textContent.trim() : '';
    const descriptionHtml = descriptionCell ? descriptionCell.innerHTML : '';
    const linkElement = linkCell ? linkCell.querySelector('a') : null;

    if (subtitleText) {
      const h3 = document.createElement('h3');
      h3.textContent = subtitleText;
      highlightTopDescription.append(h3);
    }

    if (linkElement) {
      const anchor = document.createElement('a');
      anchor.href = linkElement.href;
      anchor.classList.add('bottom-section');
      
      // Copy data attributes and target/rel as they are not Bootstrap JS specific
      if (linkElement.getAttribute('data-href')) anchor.setAttribute('data-href', linkElement.getAttribute('data-href'));
      if (linkElement.getAttribute('data-modal')) anchor.setAttribute('data-modal', linkElement.getAttribute('data-modal'));
      if (linkElement.getAttribute('data-redirect')) anchor.setAttribute('data-redirect', linkElement.getAttribute('data-redirect'));
      if (linkElement.getAttribute('target')) anchor.setAttribute('target', linkElement.getAttribute('target'));
      if (linkElement.getAttribute('rel')) anchor.setAttribute('rel', linkElement.getAttribute('rel'));
      
      highlightContainer.append(anchor);

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
      h4.textContent = titleText;
      btmTitle.append(h4);

      const arrowLink = document.createElement('span');
      arrowLink.classList.add('arrow-link');
      btmTitle.append(arrowLink);

      const highlightBottomDescription = document.createElement('div');
      highlightBottomDescription.classList.add('highlight__bottom__description', 'g-xl-2');
      highlightBottomDescription.innerHTML = descriptionHtml;
      bottomContent.append(highlightBottomDescription);

      const backgroundOverlay = document.createElement('div');
      backgroundOverlay.classList.add('background-overlay');
      anchor.append(backgroundOverlay);
    }

    highlightItemsContainer.append(highlightCard);
  });

  block.textContent = '';
  block.append(highlightItemsContainer);
}
