import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('row', 'g-4', 'pt-3');

  [...block.children].forEach((row) => {
    const [imageCell, altTextCell, linkCell, descriptionCell] = [...row.children];

    const colDiv = document.createElement('div');
    colDiv.classList.add('col-md-6', 'aos-init', 'aos-animate');
    colDiv.setAttribute('data-aos-easing', 'ease-in-out');
    colDiv.setAttribute('data-aos', 'fade-up');
    colDiv.setAttribute('data-aos-delay', '700');
    moveInstrumentation(row, colDiv);

    const cardWrap = document.createElement('a');
    cardWrap.classList.add('card-wrap');
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardWrap.href = foundLink.href;
      cardWrap.target = '_blank'; // Original HTML has target="_blank"
    }

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // Breakpoints derived from original HTML's <source media="(max-width: 576px)">
        const optimizedPic = createOptimizedPicture(
          img.src,
          altTextCell.textContent.trim() || img.alt, // Use authored alt text or fallback to img.alt
          false,
          [{ media: '(max-width: 576px)', width: '576' }, { width: '750' }],
        );
        // Ensure img-fluid class is added to the <img> inside the new <picture>
        const newImg = optimizedPic.querySelector('img');
        if (newImg) {
          newImg.classList.add('img-fluid');
          moveInstrumentation(img, newImg); // Move instrumentation from original img to new img
        }
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
    block.append(colDiv);
    row.remove(); // Remove the original row after processing
  });
}
