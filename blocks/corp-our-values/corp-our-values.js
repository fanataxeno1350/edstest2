import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    bgImageRow,
    heading1Row,
    heading2Row,
    valuesRow, // This row is a container for value items, but its content is not directly used in the current JS.
    primaryButtonRow,
    secondaryButtonRow,
    ...valueItemRows
  ] = [...block.children];

  const genericWrapper = document.createElement('section');
  genericWrapper.classList.add('genericWrapper');

  // Background Image
  const bgPicture = bgImageRow.querySelector('picture');
  if (bgPicture) {
    const img = bgPicture.querySelector('img');
    if (img) {
      img.classList.add('img-responsive', 'bg-image', 'lazyload');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
      moveInstrumentation(bgPicture, optimizedPic);
      genericWrapper.append(optimizedPic);
    }
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
  moveInstrumentation(heading1Row, h2);
  h2.id = 'our';
  h2.classList.add('text-uppercase');
  while (heading1Row.firstChild) h2.append(heading1Row.firstChild);
  mainHeader.append(h2);

  const h3 = document.createElement('h3');
  moveInstrumentation(heading2Row, h3);
  h3.id = 'values';
  h3.classList.add('text-uppercase');
  while (heading2Row.firstChild) h3.append(heading2Row.firstChild);
  mainHeader.append(h3);

  ourValuesWrapper.append(mainHeader);

  const ourValuesComponents = document.createElement('div');
  ourValuesComponents.classList.add('our-values-components', 'g-row');

  const ul = document.createElement('ul');
  ul.classList.add('col-lg-12', 'col-md-12', 'col-sm-12');

  valueItemRows.forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('sub-holder', 'col-lg-2', 'col-sm-2', 'col-md-3', 'col-xs-6');

    const imgSpace = document.createElement('div');
    imgSpace.classList.add('img-space');

    // Each value item row has one cell, which contains the picture.
    const imageCell = row.children[0];
    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          img.classList.add('lazyload');
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
          moveInstrumentation(picture, optimizedPic);
          imgSpace.append(optimizedPic);
        }
      }
    }
    li.append(imgSpace);
    ul.append(li);
  });
  ourValuesComponents.append(ul);
  ourValuesWrapper.append(ourValuesComponents);

  const buttonHolder = document.createElement('div');
  buttonHolder.classList.add('button-holder');

  const primaryLink = primaryButtonRow.querySelector('a');
  if (primaryLink) {
    const btn1 = document.createElement('a');
    moveInstrumentation(primaryButtonRow, btn1);
    btn1.classList.add('button', 'btns', 'button-red');
    btn1.href = primaryLink.href;
    btn1.title = primaryLink.textContent;
    btn1.target = '_self';
    btn1.style.marginRight = '10px';
    btn1.textContent = primaryLink.textContent;
    buttonHolder.append(btn1);
  }

  const secondaryLink = secondaryButtonRow.querySelector('a');
  if (secondaryLink) {
    const btn2 = document.createElement('a');
    moveInstrumentation(secondaryButtonRow, btn2);
    btn2.classList.add('button', 'btns', 'button-red');
    btn2.href = secondaryLink.href;
    btn2.title = secondaryLink.textContent;
    btn2.target = '_self';
    btn2.textContent = secondaryLink.textContent;
    buttonHolder.append(btn2);
  }

  ourValuesWrapper.append(buttonHolder);
  genericWrapper.append(ourValuesWrapper);

  block.textContent = '';
  block.append(genericWrapper);
}
