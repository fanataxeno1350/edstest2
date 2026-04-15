import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  block.classList.add('section', 'grey-bg', 'spirit-of-rise');

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow.firstElementChild?.textContent.trim() || '';
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow.firstElementChild?.textContent.trim() || '';
  sectionHeader.append(description);

  // Performance Driven section
  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');
  performanceDriven.append(container);

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('performace-driven-cards');
  container.append(cardsContainer);

  cardRows.forEach((row) => {
    // Use content detection instead of fragile index access
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = linkCell?.querySelector('a'); // Use optional chaining
    if (foundLink) {
      cardLink.href = foundLink.href; // Read href for aem-content type
      cardLink.target = '_blank'; // Original HTML has target="_blank"
    }
    moveInstrumentation(row, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');
    cardLink.append(cardWrapper);

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');
    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        // Optimize image
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '576', media: '(max-width: 576px)' }, { width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          cardImageDiv.append(optimizedPic);
        } else {
          cardImageDiv.append(picture);
        }
      }
    }
    cardWrapper.append(cardImageDiv);

    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');
    cardWrapper.append(cardBox);

    const desc = document.createElement('p');
    desc.classList.add('desc');
    // Ensure labelCell exists before accessing textContent
    if (labelCell) {
      desc.innerHTML = labelCell.textContent.trim().replace(/\n/g, '<br>'); // Preserve line breaks from original
    }
    cardBox.append(desc);

    cardsContainer.append(cardLink);
  });

  block.textContent = '';
  block.append(sectionHeader, performanceDriven);
}
