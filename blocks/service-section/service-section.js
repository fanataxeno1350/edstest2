import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, pointerRow, ...serviceCardRows] = [...block.children];

  block.textContent = '';
  block.classList.add('service-section');
  block.id = 'services';

  // Heading and Pointer Section
  const container1 = document.createElement('div');
  container1.classList.add('container', 'position-relative');
  block.append(container1);

  const heading = document.createElement('h2');
  // Use content detection for heading, not firstElementChild
  const headingContent = headingRow.querySelector('div');
  if (headingContent) {
    moveInstrumentation(headingContent, heading);
    heading.innerHTML = headingContent.innerHTML;
  }
  container1.append(heading);

  const pointerPicture = pointerRow.querySelector('picture');
  if (pointerPicture) {
    const pointerImg = pointerPicture.querySelector('img');
    const optimizedPointerPic = createOptimizedPicture(pointerImg.src, pointerImg.alt, false, [{ width: '750' }]);
    moveInstrumentation(pointerImg, optimizedPointerPic.querySelector('img'));
    optimizedPointerPic.querySelector('img').classList.add('pointer');
    container1.append(optimizedPointerPic);
  }

  // Service Cards Section
  const container2 = document.createElement('div');
  container2.classList.add('container');
  block.append(container2);

  const row = document.createElement('div');
  row.classList.add('row', 'justify-content-around');
  container2.append(row);

  serviceCardRows.forEach((serviceCardRow) => {
    const cells = [...serviceCardRow.children];

    // Find the link element within the cells
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const linkEl = linkCell ? linkCell.querySelector('a') : null;

    const card = document.createElement('a');
    moveInstrumentation(serviceCardRow, card);
    card.classList.add('d-block', 'col-lg-4', 'col-md-6', 'col-12', 'service-card');
    if (linkEl) {
      card.href = linkEl.href;
    }

    // Process cells based on content, not implicit order
    cells.forEach((cell) => {
      if (cell.querySelector('picture')) {
        const picture = cell.querySelector('picture');
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').classList.add('img-fluid', 'service-img');
        card.append(optimizedPic);
      } else if (cell.querySelector('h3')) {
        const h3 = document.createElement('h3');
        moveInstrumentation(cell, h3);
        while (cell.firstChild) h3.append(cell.firstChild);
        card.append(h3);
      } else if (cell.querySelector('p')) {
        const p = document.createElement('p');
        moveInstrumentation(cell, p);
        while (cell.firstChild) p.append(cell.firstChild);
        card.append(p);
      } else if (cell.textContent.trim() !== '' && !cell.querySelector('a') && !cell.querySelector('picture') && !cell.querySelector('h3') && !cell.querySelector('p')) { // This is the button label
        const button = document.createElement('button');
        moveInstrumentation(cell, button);
        while (cell.firstChild) button.append(cell.firstChild);
        card.append(button);
      }
    });
    row.append(card);
  });
}
