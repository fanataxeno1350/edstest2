import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('section', 'grey-bg', 'spirit-of-rise');
  moveInstrumentation(block, section);

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.textContent = headingRow.firstElementChild?.textContent.trim() || '';
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow.firstElementChild, description);
  description.textContent = descriptionRow.firstElementChild?.textContent.trim() || '';
  sectionHeader.append(description);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');
  performanceDriven.append(container);

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');
  container.append(cardsWrapper);

  cardRows.forEach((row) => {
    // Destructuring with named variables for clarity and robustness
    const [imageCell, mobileImageCell, linkCell, descriptionCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      // Add target="_blank" as seen in ORIGINAL HTML
      cardLink.target = '_blank';
    }
    moveInstrumentation(row, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');
    cardLink.append(cardWrapper);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    cardWrapper.append(cardImage);

    const picture = document.createElement('picture');
    const mobileImg = mobileImageCell.querySelector('img');
    if (mobileImg) {
      const source = document.createElement('source');
      source.media = '(max-width: 576px)';
      source.srcset = mobileImg.src;
      picture.append(source);
    }

    const desktopImg = imageCell.querySelector('img');
    if (desktopImg) {
      const optimizedPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
      const img = optimizedPic.querySelector('img');
      if (img) {
        img.alt = desktopImg.alt;
        picture.append(img);
      }
    }
    cardImage.append(picture);

    const boxCard = document.createElement('div');
    boxCard.classList.add('performace-driven-home-box-card');
    cardWrapper.append(boxCard);

    const desc = document.createElement('p');
    desc.classList.add('desc');
    desc.textContent = descriptionCell?.textContent.trim() || '';
    boxCard.append(desc);

    cardsWrapper.append(cardLink);
  });

  section.append(performanceDriven);
  block.replaceWith(section);
}
