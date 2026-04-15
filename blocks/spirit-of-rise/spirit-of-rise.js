import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  moveInstrumentation(headingRow, heading);
  sectionHeader.appendChild(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow.firstElementChild.textContent.trim();
  moveInstrumentation(descriptionRow, description);
  sectionHeader.appendChild(description);

  // Performance Driven Cards
  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performance-driven-home'); // Corrected class name

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performance-driven-cards'); // Corrected class name

  cardRows.forEach((row) => {
    const [imageCell, linkCell, descriptionCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performance-driven-cards-link'); // Corrected class name
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // From original HTML
    }
    moveInstrumentation(linkCell, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performance-driven-card-wrapper'); // Corrected class name

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImage.append(optimizedPic);
      }
    }
    moveInstrumentation(imageCell, cardImage);
    cardWrapper.appendChild(cardImage);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performance-driven-home-box-card'); // Corrected class name

    const desc = document.createElement('p');
    desc.classList.add('desc');
    desc.innerHTML = descriptionCell.innerHTML; // Use innerHTML to preserve potential line breaks
    moveInstrumentation(descriptionCell, desc);
    homeBoxCard.appendChild(desc);

    cardWrapper.appendChild(homeBoxCard);
    cardLink.appendChild(cardWrapper);
    cardsWrapper.appendChild(cardLink);
  });

  container.appendChild(cardsWrapper);
  performanceDriven.appendChild(container);

  block.innerHTML = '';
  block.classList.add('section', 'spirit-of-rise'); // Add section class to the block itself
  block.appendChild(sectionHeader);
  block.appendChild(performanceDriven);
}
