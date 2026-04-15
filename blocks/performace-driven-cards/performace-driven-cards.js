import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cardItems = [...block.children];
  block.innerHTML = '';

  cardItems.forEach((row) => {
    const cells = [...row.children];

    // Content detection for cells based on BlockJson and EDS Block Structure
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const descriptionCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));

    const linkEl = document.createElement('a');
    linkEl.classList.add('performace-driven-cards-link');
    if (linkCell) {
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        linkEl.href = foundLink.href;
        linkEl.target = '_blank'; // Assuming target blank from original HTML
      }
      moveInstrumentation(linkCell, linkEl);
    }


    const cardWrapper = document.createElement('div');
    cardWrapper.classList.add('performace-driven-card-wrapper');

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          picture.replaceWith(optimizedPic);
        }
        cardImage.append(picture);
      }
      moveInstrumentation(imageCell, cardImage);
    }


    const textBox = document.createElement('div');
    textBox.classList.add('performace-driven-home-box-card');

    const description = document.createElement('p');
    description.classList.add('desc');
    if (descriptionCell) {
      description.textContent = descriptionCell.textContent.trim();
      moveInstrumentation(descriptionCell, description);
    }


    textBox.append(description);

    cardWrapper.append(cardImage, textBox);
    linkEl.append(cardWrapper);
    block.append(linkEl);
  });
}
