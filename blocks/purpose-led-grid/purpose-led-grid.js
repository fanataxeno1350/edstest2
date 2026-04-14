import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...cardRows] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container');

  const sectionHeader = document.createElement('div');
  sectionHeader.classList.add('section-header', 'text-center', 'pb-3');

  // Heading
  const heading = document.createElement('h2');
  heading.classList.add('heading', 'font-regular', 'aos-init', 'aos-animate');
  moveInstrumentation(headingRow.firstElementChild, heading);
  heading.innerHTML = headingRow.firstElementChild.innerHTML;
  sectionHeader.append(heading);

  // Description
  const description = document.createElement('p');
  description.classList.add('aos-init', 'aos-animate');
  moveInstrumentation(descriptionRow.firstElementChild, description);
  description.innerHTML = descriptionRow.firstElementChild.innerHTML;
  sectionHeader.append(description);

  container.append(sectionHeader);

  // Grid
  const gridRow = document.createElement('div');
  gridRow.classList.add('row', 'g-4', 'purpose-led-grid', 'pt-3');

  cardRows.forEach((row) => {
    const cells = [...row.children]; // Convert HTMLCollection to array for easier content detection

    const col = document.createElement('div');
    col.classList.add('col-md-6', 'aos-init', 'aos-animate');
    moveInstrumentation(row, col);

    // Find the link cell
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const cardLinkEl = linkCell?.querySelector('a');

    const cardWrap = document.createElement('a');
    cardWrap.classList.add('card-wrap');
    if (cardLinkEl) {
      cardWrap.href = cardLinkEl.href;
      cardWrap.target = '_blank'; // Assuming target="_blank" from original HTML
    }

    const cardImageDiv = document.createElement('div');
    cardImageDiv.classList.add('card-image');

    // Find the image cell
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    if (imageCell && imageCell.querySelector('picture')) {
      const picture = imageCell.querySelector('picture');
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      cardImageDiv.append(optimizedPic);
    }

    const cardTextDiv = document.createElement('div');
    cardTextDiv.classList.add('card-text');

    // Find the text cell (which contains the UL)
    const textCell = cells.find(cell => cell.querySelector('ul'));
    if (textCell) {
      const p = document.createElement('p');
      p.classList.add('desc');
      // The RTE content is a UL, we need to extract the text content and preserve line breaks
      // Use innerHTML and then textContent to get all text, then replace UL/LI structure with line breaks
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = textCell.innerHTML;

      // Replace <li> with its text content followed by a newline, and <ul> with its content
      // This is a simplified approach to get text content with line breaks for the <p> tag
      let textContent = tempDiv.textContent || '';
      // Clean up multiple newlines and trim
      p.textContent = textContent.replace(/\s*\n\s*/g, '\n').trim();
      cardTextDiv.append(p);
    }

    cardWrap.append(cardImageDiv, cardTextDiv);
    col.append(cardWrap);
    gridRow.append(col);
  });

  container.append(gridRow);
  block.textContent = '';
  block.append(container);
}
