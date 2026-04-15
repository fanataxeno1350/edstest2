import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const gridContainer = document.createElement('div');
  gridContainer.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');
  moveInstrumentation(block, gridContainer);

  [...block.children].forEach((row, index) => {
    const [imageCell, altTextCell, linkCell, descriptionCell] = [...row.children];

    const colDiv = document.createElement('div');
    colDiv.classList.add('col-md-6', 'aos-init', 'aos-animate');
    colDiv.setAttribute('data-aos-easing', 'ease-in-out');
    colDiv.setAttribute('data-aos', 'fade-up');
    colDiv.setAttribute('data-aos-delay', '700');
    moveInstrumentation(row, colDiv);

    const cardLink = document.createElement('a');
    cardLink.classList.add('card-wrap');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming target blank from original HTML
    }

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const altText = altTextCell.textContent.trim();
        const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ media: '(max-width: 576px)', width: '576' }, { width: '750' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImageDiv.append(optimizedPic);
      }
    }

    const cardTextDiv = document.createElement('div');
    cardTextDiv.classList.add('card-text');

    const descP = document.createElement('p');
    descP.classList.add('desc');
    descP.innerHTML = descriptionCell.innerHTML;

    cardTextDiv.append(descP);
    cardLink.append(cardImageDiv, cardTextDiv);
    colDiv.append(cardLink);
    gridContainer.append(colDiv);
  });

  block.textContent = '';
  block.append(gridContainer);
}
