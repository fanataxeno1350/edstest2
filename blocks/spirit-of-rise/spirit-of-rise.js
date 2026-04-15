import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');
  moveInstrumentation(block, section);

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

  section.appendChild(sectionHeader);

  // Performance Driven section
  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');
  performanceDriven.appendChild(container);

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');
  container.appendChild(cardsWrapper);

  cardRows.forEach((row) => {
    const [imageCell, linkCell, descriptionCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming target blank from original HTML
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

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');
    const descP = document.createElement('p');
    descP.classList.add('desc');
    // The description field is type=text, but the original HTML shows it contains <br> tags.
    // To preserve these, we should use innerHTML instead of textContent.
    descP.innerHTML = descriptionCell.innerHTML;
    moveInstrumentation(descriptionCell, descP);
    homeBoxCard.appendChild(descP);
    cardWrapper.appendChild(homeBoxCard);

    cardsWrapper.appendChild(cardLink);
  });

  section.appendChild(performanceDriven);
  block.replaceWith(section);
}
