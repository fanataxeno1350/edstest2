import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  // Section header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const headingCell = [...headingRow.children].find((c) => c.textContent.trim());
  if (headingCell) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    moveInstrumentation(headingCell, heading);
    heading.innerHTML = headingCell.innerHTML;
    sectionHeader.append(heading);
  }

  const descriptionCell = [...descriptionRow.children].find((c) => c.textContent.trim());
  if (descriptionCell) {
    const description = document.createElement('p');
    description.classList.add('aos-init', 'aos-animate');
    moveInstrumentation(descriptionCell, description);
    description.innerHTML = descriptionCell.innerHTML;
    sectionHeader.append(description);
  }

  // Performance driven section
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
    const imageCell = cells.find((c) => c.querySelector('picture'));
    const linkCell = cells.find((c) => c.querySelector('a'));
    const cardDescriptionCell = cells.find((c) => !c.querySelector('picture') && !c.querySelector('a'));

    if (linkCell) {
      const linkElement = document.createElement('a');
      linkElement.classList.add('performace-driven-cards-link');
      linkElement.href = linkCell.querySelector('a')?.href || '#';
      moveInstrumentation(linkCell, linkElement);

      const cardWrapper = document.createElement('div');
      cardWrapper.classList.add('performace-driven-card-wrapper');
      linkElement.append(cardWrapper);

      if (imageCell) {
        const cardImage = document.createElement('div');
        cardImage.classList.add('card-image');
        moveInstrumentation(imageCell, cardImage);
        while (imageCell.firstChild) {
          cardImage.append(imageCell.firstChild);
        }
        cardWrapper.append(cardImage);
      }

      if (cardDescriptionCell) {
        const homeBoxCard = document.createElement('div');
        homeBoxCard.classList.add('performace-driven-home-box-card');
        const descP = document.createElement('p');
        descP.classList.add('desc');
        moveInstrumentation(cardDescriptionCell, descP);
        while (cardDescriptionCell.firstChild) {
          descP.append(cardDescriptionCell.firstChild);
        }
        homeBoxCard.append(descP);
        cardWrapper.append(homeBoxCard);
      }

      cardsWrapper.append(linkElement);
    }
  });

  block.textContent = '';
  block.append(sectionHeader, performanceDriven);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
