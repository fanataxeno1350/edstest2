import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.innerHTML = headingRow.firstElementChild.innerHTML;
  sectionHeader.append(heading);

  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow.firstElementChild, description);
  description.innerHTML = descriptionRow.firstElementChild.innerHTML;
  sectionHeader.append(description);

  const gridRow = document.createElement('div');
  gridRow.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  cardRows.forEach((row) => {
    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    moveInstrumentation(row, col);

    const cardWrap = document.createElement('a');
    cardWrap.classList.add('card-wrap');

    let linkEl;
    let imageEl;
    let altText = ''; // Initialize altText
    let textEl;

    // Use explicit content detection for each cell based on BlockJson model
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    // Alt text is a plain text cell, not a rich text paragraph.
    // It's the cell after the image and before the rich text paragraph.
    const altTextCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture') && cell.textContent.trim() !== '' && !cell.querySelector('p'));
    const richTextCell = cells.find(cell => cell.querySelector('p'));

    if (linkCell) {
      linkEl = linkCell.querySelector('a');
      cardWrap.href = linkEl.href;
      if (linkEl.target) cardWrap.target = linkEl.target;
    }
    if (imageCell) {
      imageEl = imageCell.querySelector('picture');
    }
    if (altTextCell) {
      altText = altTextCell.textContent.trim();
    }
    if (richTextCell) {
      textEl = richTextCell.querySelector('p');
    }

    const cardImage = document.createElement('div');
    cardImage.classList.add('card-image');
    if (imageEl) {
      const img = imageEl.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, altText || img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      cardImage.append(optimizedPic);
    }
    cardWrap.append(cardImage);

    const cardText = document.createElement('div');
    cardText.classList.add('card-text');
    const descP = document.createElement('p');
    descP.classList.add('desc');
    if (textEl) {
      moveInstrumentation(textEl, descP);
      descP.innerHTML = textEl.innerHTML;
    }
    cardText.append(descP);
    cardWrap.append(cardText);

    col.append(cardWrap);
    gridRow.append(col);
  });

  block.textContent = '';
  block.append(sectionHeader, gridRow);
}
