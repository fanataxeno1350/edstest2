import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  heading.textContent = headingRow?.firstElementChild?.textContent.trim() || '';
  moveInstrumentation(headingRow, heading);
  sectionHeader.appendChild(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow?.firstElementChild?.textContent.trim() || '';
  moveInstrumentation(descriptionRow, description);
  sectionHeader.appendChild(description);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    const [imageCell, linkCell, descriptionCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = '_blank'; // From original HTML
    }
    moveInstrumentation(linkCell, linkEl);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(max-width: 576px)', width: '576' }, { width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImage.append(optimizedPic);
      }
    }
    moveInstrumentation(imageCell, cardImage);
    cardWrapper.appendChild(cardImage);

    const cardBox = document.createElement('div');
    cardBox.classList.add('performace-driven-home-box-card');

    const desc = document.createElement('p');
    desc.classList.add('desc');
    desc.innerHTML = descriptionCell?.innerHTML || '';
    moveInstrumentation(descriptionCell, desc);
    cardBox.appendChild(desc);

    cardWrapper.appendChild(cardBox);
    linkEl.appendChild(cardWrapper);
    cardsWrapper.appendChild(linkEl);
    moveInstrumentation(row, linkEl);
  });

  container.appendChild(cardsWrapper);
  performanceDriven.appendChild(container);

  block.innerHTML = ''; // Clear the block
  block.classList.add('grey-bg'); // From original HTML
  block.appendChild(sectionHeader);
  block.appendChild(performanceDriven);
}
