import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  block.classList.add('section', 'grey-bg', 'spirit-of-rise'); // Added 'spirit-of-rise' from ORIGINAL HTML

  // Section Header
  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.textContent = headingRow.firstElementChild.textContent.trim();
  sectionHeader.appendChild(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow.firstElementChild, description);
  description.textContent = descriptionRow.firstElementChild.textContent.trim();
  sectionHeader.appendChild(description);

  block.replaceChildren(sectionHeader);

  // Performance Driven Section
  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');
  performanceDriven.appendChild(container);

  const cardsWrapper = document.createElement('div');
  cardsWrapper.classList.add('performace-driven-cards');
  container.appendChild(cardsWrapper);

  cardRows.forEach((row) => {
    // CRITICAL FIX: Using destructuring for direct access to cells based on BlockJson model
    const [imageCell, mobileImageCell, linkCell, cardDescriptionCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = '_blank'; // Assuming target blank from original HTML
    }
    moveInstrumentation(row, linkEl); // Move instrumentation from the row to the new link element

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');
    linkEl.appendChild(cardWrapper);

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    cardWrapper.appendChild(cardImage);

    // Create picture element with source for mobile and img for desktop
    const picture = document.createElement('picture');

    const mobileImg = mobileImageCell.querySelector('img');
    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = mobileImg.src;
      picture.appendChild(sourceMobile);
    }

    const img = imageCell.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      const desktopImg = optimizedPic.querySelector('img');
      if (desktopImg) {
        moveInstrumentation(img, desktopImg);
        picture.appendChild(desktopImg);
      }
    }
    cardImage.appendChild(picture);

    const boxCard = document.createElement('div');
    boxCard.classList.add('performace-driven-home-box-card');
    cardWrapper.appendChild(boxCard);

    const desc = document.createElement('p');
    desc.classList.add('desc');
    moveInstrumentation(cardDescriptionCell, desc);
    desc.innerHTML = cardDescriptionCell.innerHTML; // Correctly using innerHTML for richtext
    boxCard.appendChild(desc);

    cardsWrapper.appendChild(linkEl);
  });

  block.appendChild(performanceDriven);
}
