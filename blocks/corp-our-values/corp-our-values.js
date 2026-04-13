import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageRow,
    headingTopRow,
    headingBottomRow,
    ...itemRows
  ] = [...block.children];

  // Create main wrapper elements
  const genericWrapper = document.createElement('section');
  genericWrapper.classList.add('genericWrapper');

  const ourValuesWrapper = document.createElement('section');
  ourValuesWrapper.classList.add('our-values-wrapper');

  // Background Image
  const bgPicture = backgroundImageRow.querySelector('picture');
  if (bgPicture) {
    const img = bgPicture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    optimizedPic.querySelector('img').classList.add('img-responsive', 'bg-image', 'lazyload');
    genericWrapper.append(optimizedPic);
  }

  // Main Header
  const mainHeader = document.createElement('div');
  mainHeader.classList.add('main-header', 'container');

  const topBorder = document.createElement('div');
  topBorder.classList.add('topBorder');
  topBorder.innerHTML = '&nbsp;';
  mainHeader.append(topBorder);

  const headingTop = document.createElement('h2');
  moveInstrumentation(headingTopRow.firstElementChild, headingTop);
  headingTop.id = 'our';
  headingTop.classList.add('text-uppercase');
  headingTop.textContent = headingTopRow.textContent.trim();
  mainHeader.append(headingTop);

  const headingBottom = document.createElement('h3');
  moveInstrumentation(headingBottomRow.firstElementChild, headingBottom);
  headingBottom.id = 'values';
  headingBottom.classList.add('text-uppercase');
  headingBottom.textContent = headingBottomRow.textContent.trim();
  mainHeader.append(headingBottom);
  ourValuesWrapper.append(mainHeader);

  // Values
  const valueItems = itemRows.filter((row) => row.children.length === 1 && row.querySelector('picture'));
  if (valueItems.length > 0) {
    const ourValuesComponents = document.createElement('div');
    ourValuesComponents.classList.add('our-values-components', 'g-row');

    const ul = document.createElement('ul');
    ul.classList.add('col-lg-12', 'col-md-12', 'col-sm-12');

    valueItems.forEach((row) => {
      const li = document.createElement('li');
      moveInstrumentation(row, li);
      li.classList.add('sub-holder', 'col-lg-2', 'col-sm-2', 'col-md-3', 'col-xs-6');

      const imgSpace = document.createElement('div');
      imgSpace.classList.add('img-space');

      const picture = row.querySelector('picture');
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
  }

  // Buttons
  const buttonItems = itemRows.filter((row) => row.children.length === 2 && row.querySelector('a'));
  if (buttonItems.length > 0) {
    const buttonHolder = document.createElement('div');
    buttonHolder.classList.add('button-holder');

    buttonItems.forEach((row, index) => {
      const linkCell = [...row.children].find((cell) => cell.querySelector('a'));
      const textCell = [...row.children].find((cell) => !cell.querySelector('a'));

      const foundLink = linkCell?.querySelector('a');
      const buttonLink = document.createElement('a');
      if (foundLink) {
        buttonLink.href = foundLink.href;
        buttonLink.title = textCell?.textContent.trim() || foundLink.textContent.trim();
        buttonLink.textContent = textCell?.textContent.trim() || foundLink.textContent.trim();
        buttonLink.classList.add('button', 'btns', 'button-red');
        buttonLink.target = '_self';
        if (index === 0 && buttonItems.length > 1) {
          buttonLink.style.marginRight = '10px';
        }
        moveInstrumentation(row, buttonLink);
        buttonHolder.append(buttonLink);
      }
    });
    ourValuesWrapper.append(buttonHolder);
  }

  genericWrapper.append(ourValuesWrapper);

  block.textContent = '';
  block.append(genericWrapper);

  // Optimize all images in the block
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
