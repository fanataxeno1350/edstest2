import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // BlockJson has 5 root model fields: background-image, heading-1, heading-2, values (container), buttons (container)
  // The remaining rows are item sub-components.
  const [
    bgImageRow,
    heading1Row,
    heading2Row,
    valuesContainerRow, // This row is just a placeholder for the container, its content is not used directly.
    buttonsContainerRow, // This row is just a placeholder for the container, its content is not used directly.
    ...itemRows
  ] = [...block.children];

  // Distinguish item sub-components based on their content structure.
  // 'value' items have a picture in their first cell.
  // 'button' items have an 'a' tag in their first cell and text in their second.
  const valueItems = itemRows.filter((row) => row.children[0]?.querySelector('picture'));
  const buttonItems = itemRows.filter((row) => row.children[0]?.querySelector('a') && row.children[1]);

  const genericWrapper = document.createElement('section');
  genericWrapper.classList.add('genericWrapper');
  moveInstrumentation(block, genericWrapper);

  // Background Image
  const bgPicture = bgImageRow.querySelector('picture');
  if (bgPicture) {
    const img = bgPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('img-responsive', 'bg-image', 'lazyload');
    genericWrapper.append(optimizedPic);
  }

  const ourValuesWrapper = document.createElement('section');
  ourValuesWrapper.classList.add('our-values-wrapper');

  const mainHeader = document.createElement('div');
  mainHeader.classList.add('main-header', 'container');

  const topBorder = document.createElement('div');
  topBorder.classList.add('topBorder');
  topBorder.innerHTML = '&nbsp;';
  mainHeader.append(topBorder);

  const h2 = document.createElement('h2');
  moveInstrumentation(heading1Row.children[0], h2); // Instrumentation should be from the cell, not the row.
  h2.id = 'our';
  h2.classList.add('text-uppercase');
  h2.textContent = heading1Row.children[0].textContent.trim(); // Read content from the cell.
  mainHeader.append(h2);

  const h3 = document.createElement('h3');
  moveInstrumentation(heading2Row.children[0], h3); // Instrumentation should be from the cell, not the row.
  h3.id = 'values';
  h3.classList.add('text-uppercase');
  h3.textContent = heading2Row.children[0].textContent.trim(); // Read content from the cell.
  mainHeader.append(h3);

  ourValuesWrapper.append(mainHeader);

  const ourValuesComponents = document.createElement('div');
  ourValuesComponents.classList.add('our-values-components', 'g-row');

  const ul = document.createElement('ul');
  ul.classList.add('col-lg-12', 'col-md-12', 'col-sm-12');

  valueItems.forEach((row) => {
    // 'value' item has 1 cell: image
    const imageCell = row.children[0];

    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('sub-holder', 'col-lg-2', 'col-sm-2', 'col-md-3', 'col-xs-6');

    const imgSpace = document.createElement('div');
    imgSpace.classList.add('img-space');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.querySelector('img').classList.add('lazyload');
      imgSpace.append(optimizedPic);
    }
    li.append(imgSpace);
    ul.append(li);
  });
  ourValuesComponents.append(ul);
  ourValuesWrapper.append(ourValuesComponents);

  const buttonHolder = document.createElement('div');
  buttonHolder.classList.add('button-holder');

  buttonItems.forEach((row) => {
    // 'button' item has 2 cells: link, text
    const linkCell = row.children[0];
    const textCell = row.children[1];

    if (linkCell && textCell) {
      const originalLink = linkCell.querySelector('a');
      const a = document.createElement('a');
      moveInstrumentation(linkCell, a);
      a.href = originalLink.href;
      a.title = textCell.textContent.trim();
      a.classList.add('button', 'btns', 'button-red');
      a.target = '_self';
      a.textContent = textCell.textContent.trim();
      buttonHolder.append(a);
    }
  });
  ourValuesWrapper.append(buttonHolder);
  genericWrapper.append(ourValuesWrapper);

  block.textContent = '';
  block.append(genericWrapper);
}
