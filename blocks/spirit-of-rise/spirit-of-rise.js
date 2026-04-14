import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  // Section header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.textContent = headingRow.firstElementChild?.textContent.trim() || '';

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow.firstElementChild, description);
  description.innerHTML = descriptionRow.firstElementChild?.innerHTML || '';

  sectionHeader.append(heading, description);

  // Performance driven cards
  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const linkEl = row.querySelector('a');
    const imageEl = row.querySelector('picture');
    const descriptionCell = [...row.children].find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    if (linkEl) {
      cardLink.href = linkEl.href;
      cardLink.target = '_blank';
      moveInstrumentation(linkEl, cardLink);
    }
    
    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');
    if (imageEl) {
      const optimizedPic = createOptimizedPicture(imageEl.querySelector('img')?.src, imageEl.querySelector('img')?.alt, false, [{ width: '750' }]);
      moveInstrumentation(imageEl, optimizedPic);
      cardImageDiv.append(optimizedPic);
    }

    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');

    const cardDescription = document.createElement('p');
    cardDescription.classList.add('desc');
    if (descriptionCell) {
      moveInstrumentation(descriptionCell, cardDescription);
      cardDescription.innerHTML = descriptionCell.innerHTML;
    }

    cardBox.append(cardDescription);
    cardWrapper.append(cardImageDiv, cardBox);
    cardLink.append(cardWrapper);
    cardsWrapper.append(cardLink);

    moveInstrumentation(row, cardLink);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);

  block.textContent = '';
  block.classList.add('section', 'grey-bg', 'spirit-of-rise'); // Add block-level classes
  block.append(sectionHeader, performanceDriven);
}
