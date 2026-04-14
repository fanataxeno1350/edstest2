import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.innerHTML = headingRow.firstElementChild?.innerHTML || '';
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow.firstElementChild, description);
  description.innerHTML = descriptionRow.firstElementChild?.innerHTML || '';
  sectionHeader.append(description);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');
  performanceDriven.append(container);

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');
  container.append(cardsWrapper);

  cardRows.forEach((row) => {
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const descriptionCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    if (linkCell?.querySelector('a')) {
      cardLink.href = linkCell.querySelector('a').href;
      cardLink.target = '_blank';
    }
    moveInstrumentation(row, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    if (imageCell) {
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('card-image');
      moveInstrumentation(imageCell, imageDiv);
      while (imageCell.firstChild) imageDiv.append(imageCell.firstChild);
      cardWrapper.append(imageDiv);
    }

    if (descriptionCell) {
      const boxCard = document.createElement('div');
      boxCard.classList.add('performace-driven-home-box-card');
      const descP = document.createElement('p');
      descP.classList.add('desc');
      moveInstrumentation(descriptionCell, descP);
      descP.innerHTML = descriptionCell.innerHTML;
      boxCard.append(descP);
      cardWrapper.append(boxCard);
    }
    // The linkCell content is handled by setting the cardLink's href,
    // so its inner content (the link text) doesn't need to be appended directly
    // into the cardWrapper as a separate element.

    cardLink.append(cardWrapper);
    cardsWrapper.append(cardLink);
  });

  block.textContent = '';
  block.classList.add('grey-bg'); // Add section class to the block itself
  block.append(sectionHeader, performanceDriven);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
