import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cardsContainer = document.createElement('div');
  cardsContainer.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  [...block.children].forEach((row, i) => {
    const cells = [...row.children];

    // Find cells based on content type, as per EDS BLOCK STRUCTURE and BlockJson
    // cell[0]: field="link" type=aem-content
    const linkCell = cells[0];
    // cell[1]: field="image" type=reference
    const imageCell = cells[1];
    // cell[2]: field="alt" type=text
    const altCell = cells[2];
    // cell[3]: field="description" type=richtext
    const descriptionCell = cells[3];

    const colDiv = document.createElement('div');
    colDiv.classList.add('col-md-6', 'aos-init', 'aos-animate');
    colDiv.setAttribute('data-aos-easing', 'ease-in-out');
    colDiv.setAttribute('data-aos', 'fade-up');
    colDiv.setAttribute('data-aos-delay', `${700 + i * 100}`); // Stagger delay

    const cardWrap = document.createElement('a');
    cardWrap.classList.add('card-wrap');
    const link = linkCell.querySelector('a');
    if (link) {
      cardWrap.href = link.href;
      cardWrap.target = '_blank'; // Assuming target blank from original HTML
    }

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const altText = altCell.textContent.trim(); // Read alt text from text cell
        const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ width: '576', media: '(max-width: 576px)' }, { width: '750' }]);
        moveInstrumentation(picture, optimizedPic.querySelector('img'));
        cardImageDiv.append(optimizedPic);
        // Add img-fluid class to the actual img inside the optimized picture
        const newImg = optimizedPic.querySelector('img');
        if (newImg) {
          newImg.classList.add('img-fluid');
        }
      }
    }
    cardWrap.append(cardImageDiv);

    const cardTextDiv = document.createElement('div');
    cardTextDiv.classList.add('card-text');
    const descP = document.createElement('p');
    descP.classList.add('desc');
    descP.innerHTML = descriptionCell.innerHTML; // Use innerHTML for richtext
    cardTextDiv.append(descP);
    cardWrap.append(cardTextDiv);

    moveInstrumentation(row, cardWrap);
    colDiv.append(cardWrap);
    cardsContainer.append(colDiv);
  });

  block.innerHTML = '';
  block.append(cardsContainer);
}
