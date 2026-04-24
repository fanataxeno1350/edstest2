import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
    moveInstrumentation(headingRow.firstElementChild, heading);
    heading.textContent = headingRow.firstElementChild?.textContent.trim();
    sectionHeader.appendChild(heading);
  }

  if (descriptionRow) {
    const description = document.createElement('p');
    description.classList.add('aos-init', 'aos-animate');
    moveInstrumentation(descriptionRow.firstElementChild, description);
    description.textContent = descriptionRow.firstElementChild?.textContent.trim();
    sectionHeader.appendChild(description);
  }

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home'); // Corrected class name

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageCell, linkCell, descriptionCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming target blank from original HTML
    }

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    if (imageCell) {
      const cardImage = document.createElement('div');
      cardImage.classList.add('card-image');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          picture.replaceWith(optimizedPic);
        }
        cardImage.appendChild(picture);
      }
      cardWrapper.appendChild(cardImage);
    }

    if (descriptionCell) {
      const boxCard = document.createElement('div');
      boxCard.classList.add('performace-driven-home-box-card'); // Corrected class name
      const descP = document.createElement('p');
      descP.classList.add('desc');
      moveInstrumentation(descriptionCell, descP);
      descP.innerHTML = descriptionCell.innerHTML; // Use innerHTML for potential line breaks
      boxCard.appendChild(descP);
      cardWrapper.appendChild(boxCard);
    }

    moveInstrumentation(row, cardLink);
    cardLink.appendChild(cardWrapper);
    cardsWrapper.appendChild(cardLink);
  });

  container.appendChild(cardsWrapper);
  performanceDriven.appendChild(container);

  block.innerHTML = ''; // Clear the original block content
  block.classList.add('section', 'grey-bg', 'spirit-of-rise'); // Add section classes to the block itself
  block.appendChild(sectionHeader);
  block.appendChild(performanceDriven);
}
