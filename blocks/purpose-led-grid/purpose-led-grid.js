import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cards = [...block.children];
  const gridContainer = document.createElement('div');
  gridContainer.classList.add('row', 'g-4', 'pt-3'); // 'purpose-led-grid' is already on the block div

  cards.forEach((cardRow) => {
    const [desktopImageCell, mobileImageCell, linkCell, descriptionCell] = [...cardRow.children];

    const colDiv = document.createElement('div');
    colDiv.classList.add('col-md-6', 'aos-init', 'aos-animate');
    colDiv.setAttribute('data-aos-easing', 'ease-in-out');
    colDiv.setAttribute('data-aos', 'fade-up');
    colDiv.setAttribute('data-aos-delay', '700');

    const anchor = document.createElement('a');
    anchor.classList.add('card-wrap');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      anchor.target = '_blank'; // Original HTML has target="_blank"
    }
    moveInstrumentation(cardRow, anchor); // Move instrumentation from the row to the anchor

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');

    const picture = document.createElement('picture');
    const desktopImg = desktopImageCell.querySelector('img');
    const mobileImg = mobileImageCell.querySelector('img');

    if (mobileImg) {
      const sourceMobile = document.createElement('source');
      sourceMobile.media = '(max-width: 576px)';
      sourceMobile.srcset = mobileImg.src;
      picture.append(sourceMobile);
    }

    if (desktopImg) {
      const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '750' }]);
      img.querySelector('img').classList.add('img-fluid');
      picture.append(img.querySelector('img'));
    }

    cardImageDiv.append(picture);

    const cardTextDiv = document.createElement('div');
    cardTextDiv.classList.add('card-text');

    const descP = document.createElement('p');
    descP.classList.add('desc');
    descP.innerHTML = descriptionCell.innerHTML; // richtext cell content

    cardTextDiv.append(descP);

    anchor.append(cardImageDiv, cardTextDiv);
    colDiv.append(anchor);
    gridContainer.append(colDiv);
  });

  block.replaceChildren(gridContainer);
}
