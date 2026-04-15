import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  [...block.children].forEach((row) => {
    const [imageCell, altTextCell, linkCell, descriptionCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    col.setAttribute('data-aos-easing', 'ease-in-out');
    col.setAttribute('data-aos', 'fade-up');
    col.setAttribute('data-aos-delay', '700');

    const cardWrap = document.createElement('a');
    cardWrap.classList.add('card-wrap');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardWrap.href = foundLink.href;
      // Add target="_blank" if it was present in the original HTML, or based on a model field
      // For this example, we assume it's always _blank as per original HTML
      cardWrap.target = '_blank';
    }
    moveInstrumentation(row, cardWrap); // Move instrumentation from the row to the new cardWrap link

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const altText = altTextCell.textContent.trim();
        const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('img-fluid'); // Apply img-fluid class
        moveInstrumentation(img, optimizedPic.querySelector('img')); // Move instrumentation from img to new img
        cardImageDiv.append(optimizedPic);
      }
    }

    const cardTextDiv = document.createElement('div');
    cardTextDiv.classList.add('card-text');

    const descP = document.createElement('p');
    descP.classList.add('desc');
    descP.innerHTML = descriptionCell.innerHTML; // Use innerHTML for richtext content

    cardTextDiv.append(descP);
    cardWrap.append(cardImageDiv, cardTextDiv);
    col.append(cardWrap);
    wrapper.append(col);
  });

  block.innerHTML = '';
  block.append(wrapper);
}
