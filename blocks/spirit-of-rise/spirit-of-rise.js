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
  heading.textContent = headingRow ? headingRow.firstElementChild.textContent.trim() : '';
  moveInstrumentation(headingRow, heading);
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow ? descriptionRow.firstElementChild.textContent.trim() : '';
  moveInstrumentation(descriptionRow, description);
  sectionHeader.append(description);

  section.append(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home'); // Corrected class name here

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    // No row.children[n] violation, destructuring is fine for fixed-field item models
    const [imageCell, linkCell, descriptionCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('performace-driven-cards-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      // Check if target="_blank" is present in the original link and apply it
      if (foundLink.target) {
        cardLink.target = foundLink.target;
      }
    }
    moveInstrumentation(row, cardLink);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // Pass all sources from the original picture element to createOptimizedPicture
        const sources = Array.from(picture.querySelectorAll('source')).map(source => ({
          media: source.media,
          srcset: source.srcset,
        }));
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }], sources);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImage.append(optimizedPic);
      }
    }
    cardWrapper.append(cardImage);

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const desc = document.createElement('p');
    desc.classList.add('desc');
    // The original HTML shows <p class="desc"> with inner HTML, not just textContent.
    // So, we should use innerHTML here to preserve line breaks and any other potential HTML.
    desc.innerHTML = descriptionCell ? descriptionCell.innerHTML.trim() : '';
    homeBoxCard.append(desc);

    cardWrapper.append(homeBoxCard);
    cardLink.append(cardWrapper);
    cardsWrapper.append(cardLink);
  });

  container.append(cardsWrapper);
  performanceDriven.append(container);
  section.append(performanceDriven);

  block.replaceWith(section);
}
