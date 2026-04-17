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
  heading.textContent = headingRow?.querySelector('div')?.textContent.trim() || '';
  sectionHeader.appendChild(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  description.textContent = descriptionRow?.querySelector('div')?.textContent.trim() || '';
  sectionHeader.appendChild(description);

  section.appendChild(sectionHeader);

  const performanceDriven = document.createElement('div');
  performanceDriven.classList.add('performance-driven', 'performace-driven-home');

  const container = document.createElement('div');
  container.classList.add('container');

  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('performace-driven-cards');

  cardRows.forEach((row) => {
    // Destructuring is correct here as per EDS Block Structure for fixed-field item models
    const [imageCell, mobileImageCell, linkCell, cardDescriptionCell] = [...row.children];

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
      linkEl.target = '_blank';
    }
    moveInstrumentation(row, linkEl);

    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const picture = imageCell?.querySelector('picture');
    const mobilePicture = mobileImageCell?.querySelector('picture');

    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // Check for mobile image and add source if available
        if (mobilePicture) {
          const mobileImg = mobilePicture.querySelector('img');
          if (mobileImg) {
            const source = document.createElement('source');
            source.media = '(max-width: 576px)';
            source.srcset = mobileImg.src;
            optimizedPic.prepend(source);
          }
        }
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImage.appendChild(optimizedPic);
      }
    }

    const homeBoxCard = document.createElement('div');
    homeBoxCard.classList.add('performace-driven-home-box-card');

    const desc = document.createElement('p');
    desc.classList.add('desc');
    desc.innerHTML = cardDescriptionCell?.innerHTML || '';

    homeBoxCard.appendChild(desc);
    cardWrapper.appendChild(cardImage);
    cardWrapper.appendChild(homeBoxCard);
    linkEl.appendChild(cardWrapper);
    cardsContainer.appendChild(linkEl);
  });

  container.appendChild(cardsContainer);
  performanceDriven.appendChild(container);
  section.appendChild(performanceDriven);

  block.replaceWith(section);
}
