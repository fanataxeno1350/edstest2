import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const headingCell = [...headingRow.children].find((cell) => cell.textContent.trim());
  if (headingCell) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    moveInstrumentation(headingCell, heading);
    while (headingCell.firstChild) heading.append(headingCell.firstChild);
    sectionHeader.append(heading);
  }

  const descriptionCell = [...descriptionRow.children].find((cell) => cell.textContent.trim());
  if (descriptionCell) {
    const description = document.createElement('p');
    description.classList.add('aos-init', 'aos-animate');
    moveInstrumentation(descriptionCell, description);
    while (descriptionCell.firstChild) description.append(descriptionCell.firstChild);
    sectionHeader.append(description);
  }

  block.textContent = '';
  block.append(sectionHeader);

  if (cardRows.length > 0) {
    const performanceDriven = document.createElement('div');
    performanceDriven.classList.add('performance-driven', 'performace-driven-home');

    const container = document.createElement('div');
    container.classList.add('container');
    performanceDriven.append(container);

    const cardsWrapper = document.createElement('div');
    cardsWrapper.classList.add('performace-driven-cards');
    container.append(cardsWrapper);

    cardRows.forEach((row) => {
      const linkCell = [...row.children].find((cell) => cell.querySelector('a'));
      const imageCell = [...row.children].find((cell) => cell.querySelector('picture'));
      const labelCell = [...row.children].find((cell) => !cell.querySelector('a') && !cell.querySelector('picture'));

      const cardLink = document.createElement('a');
      cardLink.classList.add('performace-driven-cards-link');
      if (linkCell) {
        const link = linkCell.querySelector('a');
        if (link) {
          cardLink.href = link.href;
          cardLink.target = '_blank';
        }
        moveInstrumentation(linkCell, cardLink);
      }
      cardsWrapper.append(cardLink);

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('performace-driven-card-wrapper');
      cardLink.append(cardWrapper);

      if (imageCell) {
        const cardImage = document.createElement('div');
        cardImage.classList.add('card-image');
        moveInstrumentation(imageCell, cardImage);
        while (imageCell.firstChild) cardImage.append(imageCell.firstChild);
        cardWrapper.append(cardImage);
      }

      const homeBoxCard = document.createElement('div');
      homeBoxCard.classList.add('performace-driven-home-box-card');
      cardWrapper.append(homeBoxCard);

      if (labelCell) {
        const description = document.createElement('p');
        description.classList.add('desc');
        moveInstrumentation(labelCell, description);
        while (labelCell.firstChild) description.append(labelCell.firstChild);
        homeBoxCard.append(description);
      }
    });
    block.append(performanceDriven);
  }

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
