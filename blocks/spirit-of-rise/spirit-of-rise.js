import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  // Section header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');
  moveInstrumentation(headingRow, sectionHeader);

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular');
  heading.textContent = headingRow.firstElementChild?.textContent.trim() || '';
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.textContent = descriptionRow.firstElementChild?.textContent.trim() || '';
  sectionHeader.append(description);

  // Performance driven section
  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');
  performanceDriven.append(container);

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('performace-driven-cards');
  container.append(cardsContainer);

  cardRows.forEach((row) => {
    const cells = [...row.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const descriptionCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    const link = document.createElement('a');
    link.classList.add('performace-driven-cards-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.target = '_blank'; // From original HTML
    }
    moveInstrumentation(row, link);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');
    link.append(cardWrapper);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    cardWrapper.append(cardImage);

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '576', media: '(max-width: 576px)' }, { width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImage.append(optimizedPic);
      }
    }

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');
    cardWrapper.append(homeBoxCard);

    const desc = document.createElement('p');
    desc.classList.add('desc');
    desc.textContent = descriptionCell?.textContent.trim() || '';
    homeBoxCard.append(desc);

    cardsContainer.append(link);
  });

  block.innerHTML = '';
  block.classList.add('section', 'grey-bg', 'spirit-of-rise'); // Add section classes to block
  block.append(sectionHeader, performanceDriven);
}
