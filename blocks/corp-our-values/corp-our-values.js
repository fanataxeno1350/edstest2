import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    bgImageRow,
    heading1Row,
    heading2Row,
    valuesContainerRow, // This row is empty in EDS, just a placeholder for the container field
    button1Row,
    button2Row,
    ...valueItemRows
  ] = [...block.children];

  // Create genericWrapper
  const genericWrapper = document.createElement('section');
  genericWrapper.classList.add('genericWrapper');
  moveInstrumentation(block, genericWrapper); // Move block instrumentation to the wrapper

  // Background Image
  const bgPicture = bgImageRow.querySelector('picture');
  if (bgPicture) {
    const img = bgPicture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      optimizedPic.querySelector('img').classList.add('img-responsive', 'bg-image', 'lazyload');
      genericWrapper.append(optimizedPic);
    }
  }

  // our-values-wrapper
  const ourValuesWrapper = document.createElement('section');
  ourValuesWrapper.classList.add('our-values-wrapper');

  // main-header container
  const mainHeader = document.createElement('div');
  mainHeader.classList.add('main-header', 'container');

  const topBorder = document.createElement('div');
  topBorder.classList.add('topBorder');
  topBorder.innerHTML = '&nbsp;';
  mainHeader.append(topBorder);

  const h2 = document.createElement('h2');
  h2.classList.add('text-uppercase');
  moveInstrumentation(heading1Row.firstElementChild, h2);
  h2.id = 'our';
  h2.textContent = heading1Row.firstElementChild.textContent.trim();
  mainHeader.append(h2);

  const h3 = document.createElement('h3');
  h3.classList.add('text-uppercase');
  moveInstrumentation(heading2Row.firstElementChild, h3);
  h3.id = 'values';
  h3.textContent = heading2Row.firstElementChild.textContent.trim();
  mainHeader.append(h3);

  ourValuesWrapper.append(mainHeader);

  // our-values-components
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

    // Each value item row has only one cell, which contains the picture for the icon
    const picture = row.firstElementChild.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '200' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').classList.add('lazyload');
        imgSpace.append(optimizedPic);
      }
    }
    li.append(imgSpace);
    ul.append(li);
  });
  ourValuesComponents.append(ul);
  ourValuesWrapper.append(ourValuesComponents);

  // button-holder
  const buttonHolder = document.createElement('div');
  buttonHolder.classList.add('button-holder');

  const createButton = (rowElement) => {
    const anchor = rowElement.querySelector('a');
    if (anchor) {
      const buttonLink = document.createElement('a');
      moveInstrumentation(anchor, buttonLink);
      buttonLink.href = anchor.href;
      buttonLink.title = anchor.textContent.trim();
      buttonLink.textContent = anchor.textContent.trim();
      buttonLink.classList.add('button', 'btns', 'button-red');
      buttonLink.target = '_self'; // Assuming _self as default based on original HTML
      return buttonLink;
    }
    return null;
  };

  const button1 = createButton(button1Row.firstElementChild);
  if (button1) {
    button1.style.marginRight = '10px';
    buttonHolder.append(button1);
  }

  const button2 = createButton(button2Row.firstElementChild);
  if (button2) {
    buttonHolder.append(button2);
  }

  ourValuesWrapper.append(buttonHolder);
  genericWrapper.append(ourValuesWrapper);

  block.textContent = '';
  block.append(genericWrapper);
}
