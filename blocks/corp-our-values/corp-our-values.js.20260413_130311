import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageRow,
    heading1Row,
    heading2Row,
    ...itemRows
  ] = [...block.children];

  const genericWrapper = document.createElement('section');
  genericWrapper.classList.add('genericWrapper');

  // Background Image
  const pictureCell = backgroundImageRow.querySelector('div');
  if (pictureCell) {
    const picture = pictureCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        img.classList.add('img-responsive', 'bg-image', 'lazyload');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
      }
    }
    moveInstrumentation(backgroundImageRow, picture);
    genericWrapper.append(picture);
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
  h2.id = 'our';
  h2.classList.add('text-uppercase');
  moveInstrumentation(heading1Row, h2);
  h2.textContent = heading1Row.querySelector('div')?.textContent?.trim() ?? '';
  mainHeader.append(h2);

  const h3 = document.createElement('h3');
  h3.id = 'values';
  h3.classList.add('text-uppercase');
  moveInstrumentation(heading2Row, h3);
  h3.textContent = heading2Row.querySelector('div')?.textContent?.trim() ?? '';
  mainHeader.append(h3);

  ourValuesWrapper.append(mainHeader);

  const ourValuesComponents = document.createElement('div');
  ourValuesComponents.classList.add('our-values-components', 'g-row');

  const valueList = document.createElement('ul');
  valueList.classList.add('col-lg-12', 'col-md-12', 'col-sm-12');

  const buttonHolder = document.createElement('div');
  buttonHolder.classList.add('button-holder');

  itemRows.forEach((row) => {
    const cells = [...row.children];
    const picture = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('picture') && !cell.querySelector('a'));

    if (picture) { // value-item
      const li = document.createElement('li');
      moveInstrumentation(row, li);
      li.classList.add('sub-holder', 'col-lg-2', 'col-sm-2', 'col-md-3', 'col-xs-6');

      const imgSpace = document.createElement('div');
      imgSpace.classList.add('img-space');

      const img = picture.querySelector('img');
      if (img) {
        img.classList.add('lazyload');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
      }
      imgSpace.append(picture);
      li.append(imgSpace);
      valueList.append(li);
    } else if (linkCell && labelCell) { // button-item
      const buttonLink = document.createElement('a');
      moveInstrumentation(row, buttonLink);
      buttonLink.classList.add('button', 'btns', 'button-red');
      buttonLink.href = linkCell.querySelector('a')?.href ?? '#';
      buttonLink.title = linkCell.querySelector('a')?.textContent?.trim() ?? '';
      buttonLink.textContent = labelCell.textContent.trim();
      buttonLink.target = '_self'; // Assuming default target
      buttonHolder.append(buttonLink);
    }
  });

  ourValuesComponents.append(valueList);
  ourValuesWrapper.append(ourValuesComponents);
  ourValuesWrapper.append(buttonHolder);
  genericWrapper.append(ourValuesWrapper);

  block.textContent = '';
  block.append(genericWrapper);
}
