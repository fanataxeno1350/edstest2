import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  // Section header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow?.firstElementChild?.textContent.trim() || '';
  heading.setAttribute('data-aos-easing', 'ease-in-out');
  heading.setAttribute('data-aos', 'fade-up');
  heading.setAttribute('data-aos-delay', '200');
  moveInstrumentation(headingRow, heading);
  sectionHeader.appendChild(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow?.firstElementChild?.textContent.trim() || '';
  description.setAttribute('data-aos', 'fade-up');
  description.setAttribute('data-aos-offset', '100');
  description.setAttribute('data-aos-duration', '650');
  description.setAttribute('data-aos-easing', 'ease-in-out');
  moveInstrumentation(descriptionRow, description);
  sectionHeader.appendChild(description);

  // Performance driven container
  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');
  performanceDriven.appendChild(container);

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');
  container.appendChild(cardsWrapper);

  cardRows.forEach((row) => {
    const [imageCell, linkCell, descCell] = [...row.children];

    const link = document.createElement('a');
    link.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.target = '_blank'; // Original HTML has target="_blank"
    }
    moveInstrumentation(row, link);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');
    link.appendChild(cardWrapper);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    cardWrapper.appendChild(cardImage);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImage.appendChild(optimizedPic);
      }
    }

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');
    cardWrapper.appendChild(homeBoxCard);

    const desc = document.createElement('p');
    desc.classList.add('desc');
    desc.innerHTML = descCell?.innerHTML.trim() || ''; // Use innerHTML to preserve line breaks
    homeBoxCard.appendChild(desc);

    cardsWrapper.appendChild(link);
  });

  block.innerHTML = '';
  block.classList.add('section', 'grey-bg', 'spirit-of-rise'); // Add section classes to the block itself
  block.appendChild(sectionHeader);
  block.appendChild(performanceDriven);
}
