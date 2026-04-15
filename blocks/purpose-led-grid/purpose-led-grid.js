import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const gridWrapper = document.createElement('div');
  gridWrapper.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  [...block.children].forEach((row) => {
    const [imageCell, altTextCell, linkCell, descriptionCell] = [...row.children];

    const colDiv = document.createElement('div');
    colDiv.classList.add('col-md-6', 'aos-init', 'aos-animate');
    colDiv.setAttribute('data-aos-easing', 'ease-in-out');
    colDiv.setAttribute('data-aos', 'fade-up');
    colDiv.setAttribute('data-aos-delay', '700');

    const cardWrap = document.createElement('a');
    cardWrap.classList.add('card-wrap');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardWrap.href = foundLink.href;
      cardWrap.target = '_blank'; // Assuming target blank from original HTML
    }
    moveInstrumentation(row, cardWrap); // Move instrumentation from row to cardWrap

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, altTextCell.textContent.trim(), false, [{ width: '576', media: '(max-width: 576px)' }, { width: '750' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid');
        cardImageDiv.append(optimizedPic);
      }
    }

    const cardTextDiv = document.createElement('div');
    cardTextDiv.classList.add('card-text');

    const descriptionP = document.createElement('p');
    descriptionP.classList.add('desc');
    descriptionP.innerHTML = descriptionCell.innerHTML;

    cardTextDiv.append(descriptionP);
    cardWrap.append(cardImageDiv, cardTextDiv);
    colDiv.append(cardWrap);
    gridWrapper.append(colDiv);
  });

  block.innerHTML = '';
  block.append(gridWrapper);
}
