import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    bgImageRow,
    heading1Row,
    heading2Row,
    ...itemRows
  ] = [...block.children];

  // Main wrapper
  const genericWrapper = document.createElement('section');
  genericWrapper.classList.add('genericWrapper');
  moveInstrumentation(block, genericWrapper);

  // Background Image
  const bgPictureCell = bgImageRow.children[0];
  const bgPicture = bgPictureCell.querySelector('picture');
  if (bgPicture) {
    const img = bgPicture.querySelector('img');
    if (img) {
      img.classList.add('img-responsive', 'bg-image', 'lazyload');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      bgPicture.replaceWith(optimizedPic);
    }
  }
  if (bgPicture) { // Ensure bgPicture is defined before appending
    genericWrapper.append(bgPicture);
  }


  // Our Values Wrapper
  const ourValuesWrapper = document.createElement('section');
  ourValuesWrapper.classList.add('our-values-wrapper');

  const mainHeader = document.createElement('div');
  mainHeader.classList.add('main-header', 'container');

  const topBorder = document.createElement('div');
  topBorder.classList.add('topBorder');
  topBorder.innerHTML = '&nbsp;';
  mainHeader.append(topBorder);

  const h2 = document.createElement('h2');
  h2.id = 'our';
  h2.classList.add('text-uppercase');
  moveInstrumentation(heading1Row, h2);
  h2.textContent = heading1Row.children[0]?.textContent;
  mainHeader.append(h2);

  const h3 = document.createElement('h3');
  h3.id = 'values';
  h3.classList.add('text-uppercase');
  moveInstrumentation(heading2Row, h3);
  h3.textContent = heading2Row.children[0]?.textContent;
  mainHeader.append(h3);

  ourValuesWrapper.append(mainHeader);

  // Values components
  const ourValuesComponents = document.createElement('div');
  ourValuesComponents.classList.add('our-values-components', 'g-row');

  const valuesUl = document.createElement('ul');
  valuesUl.classList.add('col-lg-12', 'col-md-12', 'col-sm-12');

  const valueItems = itemRows.filter(row => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('picture') && !cells[1].querySelector('a');
  });

  valueItems.forEach((row) => {
    const li = document.createElement('li');
    li.classList.add('sub-holder', 'col-lg-2', 'col-sm-2', 'col-md-3', 'col-xs-6');
    moveInstrumentation(row, li);

    const imgSpace = document.createElement('div');
    imgSpace.classList.add('img-space');

    // FIXED: Using content detection instead of index access
    const cells = [...row.children];
    const pictureCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a')) || cells[0];
    const picture = pictureCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        img.classList.add('lazyload');
        // FIXED: Using content detection instead of index access
        const cells = [...row.children];
        const altTextCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a')) || cells[1];
        const altText = altTextCell ? altTextCell.textContent.trim() : img.alt;
        const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        imgSpace.append(optimizedPic);
      }
    }
    li.append(imgSpace);
    valuesUl.append(li);
  });
  ourValuesComponents.append(valuesUl);
  ourValuesWrapper.append(ourValuesComponents);

  // Buttons
  const buttonHolder = document.createElement('div');
  buttonHolder.classList.add('button-holder');

  const buttonItems = itemRows.filter(row => {
    const cells = [...row.children];
    return cells.length === 2 && cells[0].querySelector('a') && !cells[1].querySelector('picture');
  });

  buttonItems.forEach((row, index) => {
    const linkCell = row.children[0].querySelector('a');
    // FIXED: Using content detection instead of index access
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a')) || cells[1];

    if (linkCell && labelCell) {
      const a = document.createElement('a');
      a.href = linkCell.href;
      a.title = labelCell.textContent.trim();
      a.textContent = labelCell.textContent.trim();
      a.classList.add('button', 'btns', 'button-red');
      if (index === 0) {
        a.style.marginRight = '10px';
      }
      moveInstrumentation(row, a);
      buttonHolder.append(a);
    }
  });
  ourValuesWrapper.append(buttonHolder);
  genericWrapper.append(ourValuesWrapper);

  block.textContent = '';
  block.append(genericWrapper);
}
