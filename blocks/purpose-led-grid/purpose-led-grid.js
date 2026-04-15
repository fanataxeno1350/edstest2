import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  [...block.children].forEach((row) => {
    // cell[0]: field="image" label="Image" type=reference
    // cell[1]: field="alt" label="Image Alt Text" type=text
    // cell[2]: field="link" label="Card Link" type=aem-content
    // cell[3]: field="description" label="Description" type=richtext
    const [imageCell, altTextCell, linkCell, descriptionCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    col.setAttribute('data-aos-easing', 'ease-in-out');
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', '700');

    const cardLink = document.createElement('a');
    cardLink.classList.add('card-wrap');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Original HTML has target="_blank"
    }
    moveInstrumentation(row, cardLink);

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const altText = altTextCell.textContent.trim();
        const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ width: '576', media: '(max-width: 576px)' }, { width: '750' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid'); // Apply img-fluid class
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardImageDiv.append(optimizedPic);
      }
    }

    const cardTextDiv = document.createElement('div');
    cardTextDiv.classList.add('card-text');

    const descriptionP = document.createElement('p');
    descriptionP.classList.add('desc');
    descriptionP.innerHTML = descriptionCell.innerHTML;

    cardTextDiv.append(descriptionP);
    cardLink.append(cardImageDiv, cardTextDiv);
    col.append(cardLink);
    wrapper.append(col);
  });

  block.innerHTML = '';
  block.append(wrapper);
}
