import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    headingRow,
    aboutTextRow,
    aboutPointerImageRow,
    aboutMainImageRow,
    sectionSubheadingRow,
    ...aboutItemRows
  ] = [...block.children];

  block.classList.add('about-section');

  // Heading
  const h2 = document.createElement('h2');
  moveInstrumentation(headingRow, h2);
  h2.append(headingRow.firstElementChild.firstElementChild);
  block.append(h2);

  // About Section Top
  const container1 = document.createElement('div');
  container1.classList.add('container');
  block.append(container1);

  const row1 = document.createElement('div');
  row1.classList.add('row', 'align-items-center');
  container1.append(row1);

  // About Text and Pointer Image
  const col1 = document.createElement('div');
  col1.classList.add('col-lg-6', 'col-md-6', 'col-12', 'order-lg-1', 'order-md-1', 'order-2');
  row1.append(col1);

  const p = document.createElement('p');
  moveInstrumentation(aboutTextRow, p);
  while (aboutTextRow.firstElementChild.firstChild) {
    p.append(aboutTextRow.firstElementChild.firstChild);
  }

  const aboutPointerPicture = aboutPointerImageRow.querySelector('picture');
  if (aboutPointerPicture) {
    const img = aboutPointerPicture.querySelector('img');
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt;
    newImg.classList.add('img-fluid', 'about-pointer');
    moveInstrumentation(aboutPointerImageRow, newImg);
    p.append(newImg);
  }
  col1.append(p);


  // About Main Image
  const col2 = document.createElement('div');
  col2.classList.add('col-lg-6', 'col-md-6', 'col-12', 'order-lg-2', 'order-md-2', 'order-1');
  row1.append(col2);

  const aboutMainPicture = aboutMainImageRow.querySelector('picture');
  if (aboutMainPicture) {
    const img = aboutMainPicture.querySelector('img');
    const newImg = document.createElement('img');
    newImg.src = img.src;
    newImg.alt = img.alt;
    newImg.classList.add('img-fluid');
    moveInstrumentation(aboutMainImageRow, newImg);
    col2.append(newImg);
  }

  // About Items Section
  const container2 = document.createElement('div');
  container2.classList.add('container');
  block.append(container2);

  const aboutContainer = document.createElement('div');
  aboutContainer.classList.add('about-container', 'shadow-lg');
  container2.append(aboutContainer);

  const h4 = document.createElement('h4');
  moveInstrumentation(sectionSubheadingRow, h4);
  h4.append(sectionSubheadingRow.firstElementChild.firstElementChild);
  aboutContainer.append(h4);

  const row2 = document.createElement('div');
  row2.classList.add('row');
  aboutContainer.append(row2);

  aboutItemRows.forEach((row) => {
    const col = document.createElement('div');
    col.classList.add('col-lg-4', 'col-md-6', 'col-12');
    moveInstrumentation(row, col);

    const cells = [...row.children];
    const iconCell = cells.find(cell => cell.querySelector('picture'));
    const titleCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('p'));
    const descriptionCell = cells.find(cell => cell.querySelector('p'));

    if (iconCell) {
      const picture = iconCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const newImg = document.createElement('img');
        newImg.src = img.src;
        newImg.alt = img.alt;
        newImg.classList.add('img-fluid');
        moveInstrumentation(iconCell, newImg);
        col.append(newImg);
      }
    }

    if (titleCell) {
      const h5 = document.createElement('h5');
      moveInstrumentation(titleCell, h5);
      while (titleCell.firstChild) h5.append(titleCell.firstChild);
      col.append(h5);
    }

    if (descriptionCell) {
      const pEl = document.createElement('p');
      moveInstrumentation(descriptionCell, pEl);
      while (descriptionCell.firstChild) pEl.append(descriptionCell.firstChild);
      col.append(pEl);
    }
    row2.append(col);
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
