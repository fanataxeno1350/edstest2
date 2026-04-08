import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  moveInstrumentation(headingRow, heading);
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  while (headingRow.firstChild) heading.append(headingRow.firstChild);
  sectionHeader.append(heading);

  const subheading = document.createElement('p');
  moveInstrumentation(subheadingRow, subheading);
  subheading.classList.add('aos-init', 'aos-animate');
  while (subheadingRow.firstChild) subheading.append(subheadingRow.firstChild);
  sectionHeader.append(subheading);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) {
        const cardImage = document.createElement('div');
        cardImage.classList.add('card-image');
        moveInstrumentation(cell, cardImage);
        while (cell.firstChild) cardImage.append(cell.firstChild);
        cardWrapper.append(cardImage);
      } else if (cell.querySelector('a')) {
        const foundLink = cell.querySelector('a');
        if (foundLink) {
          linkEl.href = foundLink.href;
          linkEl.target = '_blank'; // Original HTML has target="_blank"
        }
      } else {
        const boxCard = document.createElement('div');
        boxCard.classList.add('performace-driven-home-box-card');
        const desc = document.createElement('p');
        desc.classList.add('desc');
        moveInstrumentation(cell, desc);
        while (cell.firstChild) desc.append(cell.firstChild);
        boxCard.append(desc);
        cardWrapper.append(boxCard);
      }
    });
    moveInstrumentation(row, linkEl);
    linkEl.append(cardWrapper);
    cardsWrapper.append(linkEl);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);

  block.textContent = '';
  block.append(sectionHeader, performanceDriven);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
