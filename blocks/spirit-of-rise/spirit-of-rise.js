import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  block.classList.add('section', 'grey-bg', 'spirit-of-rise');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  sectionHeader.appendChild(heading);

  const subheading = document.createElement('p'); // Removed 'aos-init', 'aos-animate' from constructor
  subheading.classList.add('aos-init', 'aos-animate'); // Added classList.add to apply classes
  subheading.textContent = subheadingRow.firstElementChild.textContent.trim();
  sectionHeader.appendChild(subheading);
  moveInstrumentation(subheadingRow, subheading);

  block.innerHTML = ''; // Clear the block to rebuild
  block.appendChild(sectionHeader);

  // Performance Driven Section
  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');
  performanceDriven.appendChild(container);

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('performace-driven-cards');
  container.appendChild(cardsContainer);

  cardRows.forEach((row) => {
    const [imageCell, linkCell, descriptionCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Original HTML has target="_blank"
    }
    moveInstrumentation(row, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');
    cardLink.appendChild(cardWrapper);

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImageDiv.appendChild(optimizedPic);
      }
    }
    cardWrapper.appendChild(cardImageDiv);

    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');
    cardWrapper.appendChild(cardBox);

    const description = document.createElement('p');
    description.classList.add('desc');
    description.innerHTML = descriptionCell.innerHTML;
    cardBox.appendChild(description);

    cardsContainer.appendChild(cardLink);
  });

  block.appendChild(performanceDriven);
}
