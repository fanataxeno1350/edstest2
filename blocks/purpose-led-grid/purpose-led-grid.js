import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const gridContainer = document.createElement('div');
  gridContainer.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  [...block.children].forEach((row) => {
    const [imageCell, imageAltCell, linkCell, descriptionCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate'); // Add aos classes from original HTML

    const cardWrap = document.createElement('a');
    cardWrap.classList.add('card-wrap');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardWrap.href = foundLink.href;
      cardWrap.target = '_blank'; // Assuming target="_blank" from original HTML
    }
    moveInstrumentation(row, cardWrap); // Move instrumentation from row to cardWrap

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const altText = imageAltCell.textContent.trim();
        const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ media: '(max-width: 576px)', width: '750' }, { width: '1200' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid'); // Add img-fluid class
        moveInstrumentation(picture, optimizedPic.querySelector('img'));
        cardImage.append(optimizedPic);
      }
    }

    const cardText = document.createElement('div');
    cardText.classList.add('card-text');

    const descriptionP = document.createElement('p');
    descriptionP.classList.add('desc');
    descriptionP.innerHTML = descriptionCell.innerHTML;

    cardText.append(descriptionP);
    cardWrap.append(cardImage, cardText);
    col.append(cardWrap);
    gridContainer.append(col);
  });

  block.innerHTML = '';
  block.append(gridContainer);
}
