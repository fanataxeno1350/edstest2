import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, subheadingRow, ...cardRows] = [...block.children];

  // Section header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow?.firstElementChild?.textContent.trim() || '';
  moveInstrumentation(headingRow, heading);
  sectionHeader.appendChild(heading);

  const subheading = document.createElement('p');
  subheading.classList.add('aos-init', 'aos-animate');
  subheading.textContent = subheadingRow?.firstElementChild?.textContent.trim() || '';
  moveInstrumentation(subheadingRow, subheading);
  sectionHeader.appendChild(subheading);

  // Performance driven cards
  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

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
      cardLink.target = '_blank'; // From original HTML
    }
    moveInstrumentation(linkCell, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '576' }, { media: '(min-width: 577px)', width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImage.appendChild(optimizedPic);
      }
    }
    moveInstrumentation(imageCell, cardImage);
    cardWrapper.appendChild(cardImage);

    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');

    const description = document.createElement('p');
    description.classList.add('desc');
    description.innerHTML = descriptionCell?.innerHTML.trim() || ''; // Changed to innerHTML to preserve line breaks
    moveInstrumentation(descriptionCell, description);
    cardBox.appendChild(description);

    cardWrapper.appendChild(cardBox);
    cardLink.appendChild(cardWrapper);
    cardsWrapper.appendChild(cardLink);
  });

  container.appendChild(cardsWrapper);
  performanceDriven.appendChild(container);

  block.innerHTML = '';
  block.classList.add('section', 'grey-bg', 'spirit-of-rise'); // Add section classes from original HTML
  block.appendChild(sectionHeader);
  block.appendChild(performanceDriven);
}
