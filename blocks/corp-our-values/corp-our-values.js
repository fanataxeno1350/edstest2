import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // BlockJson defines 8 root fields. The rest are item rows.
  const [
    bgImageRow,
    heading1Row,
    heading2Row,
    valuesContainerRow, // This row is a container for the value items, but its content isn't directly used.
    button1LinkRow,
    button1LabelRow,
    button2LinkRow,
    button2LabelRow,
    ...valueItemRows // All subsequent rows are 'corp-our-value' items
  ] = [...block.children];

  const genericWrapper = document.createElement('section');
  genericWrapper.classList.add('genericWrapper');

  // Background Image
  const bgPicture = bgImageRow.querySelector('picture');
  if (bgPicture) {
    const img = bgPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('img-responsive', 'bg-image', 'lazyload');
    genericWrapper.append(optimizedPic);
  }
  moveInstrumentation(bgImageRow, genericWrapper);

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
  h2.append(heading1Row.firstElementChild.textContent);
  mainHeader.append(h2);

  const h3 = document.createElement('h3');
  h3.id = 'values';
  h3.classList.add('text-uppercase');
  moveInstrumentation(heading2Row, h3);
  h3.append(heading2Row.firstElementChild.textContent);
  mainHeader.append(h3);

  ourValuesWrapper.append(mainHeader);

  const ourValuesComponents = document.createElement('div');
  ourValuesComponents.classList.add('our-values-components', 'g-row');

  const ul = document.createElement('ul');
  ul.classList.add('col-lg-12', 'col-md-12', 'col-sm-12');

  // Process 'corp-our-value' item rows
  valueItemRows.forEach((row) => {
    // Each item row has two cells: [image, alt-text]
    const [imageCell, altTextCell] = [...row.children];

    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('sub-holder', 'col-lg-2', 'col-sm-2', 'col-md-3', 'col-xs-6');

    const imgSpace = document.createElement('div');
    imgSpace.classList.add('img-space');

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      // Use the alt text from the second cell if available, otherwise fallback to img.alt
      const altText = altTextCell?.textContent.trim() || img.alt;
      const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ width: '750' }]);
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

  // Button 1
  const button1Link = button1LinkRow.querySelector('a');
  const button1 = document.createElement('a');
  if (button1Link) {
    button1.href = button1Link.href;
    button1.title = button1LabelRow.firstElementChild.textContent;
    button1.classList.add('button', 'btns', 'button-red');
    button1.style.marginRight = '10px';
    button1.target = '_self';
    moveInstrumentation(button1LinkRow, button1);
    button1.textContent = button1LabelRow.firstElementChild.textContent;
    buttonHolder.append(button1);
  }

  // Button 2
  const button2Link = button2LinkRow.querySelector('a');
  const button2 = document.createElement('a');
  if (button2Link) {
    button2.href = button2Link.href;
    button2.title = button2LabelRow.firstElementChild.textContent;
    button2.classList.add('button', 'btns', 'button-red');
    button2.target = '_self';
    moveInstrumentation(button2LinkRow, button2);
    button2.textContent = button2LabelRow.firstElementChild.textContent;
    buttonHolder.append(button2);
  }

  ourValuesWrapper.append(buttonHolder);
  genericWrapper.append(ourValuesWrapper);

  block.textContent = '';
  block.append(genericWrapper);
}
