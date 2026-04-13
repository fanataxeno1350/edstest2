import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundImageMobileRow,
    backgroundImageDesktopRow,
    ...itemRows
  ] = [...block.children];

  block.textContent = '';

  const genericWrapper = document.createElement('div');
  genericWrapper.classList.add('genericWrapper');

  // Background Image Mobile
  const mobileImgCell = backgroundImageMobileRow.querySelector('div');
  if (mobileImgCell) {
    const picture = mobileImgCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const mobileImg = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      mobileImg.querySelector('img').classList.add('generic-mobile');
      moveInstrumentation(mobileImgCell, mobileImg.querySelector('img'));
      genericWrapper.append(mobileImg);
    }
  }

  // Background Image Desktop
  const desktopImgCell = backgroundImageDesktopRow.querySelector('div');
  if (desktopImgCell) {
    const picture = desktopImgCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      const desktopImg = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
      desktopImg.querySelector('img').classList.add('generic-desktop');
      moveInstrumentation(desktopImgCell, desktopImg.querySelector('img'));
      genericWrapper.append(desktopImg);
    }
  }

  const innerCounterContainer = document.createElement('div');
  innerCounterContainer.classList.add('inner-counter-container');

  const gRow = document.createElement('div');
  gRow.classList.add('g-row');

  const counterItems = itemRows.filter((row) => row.children.length === 3);
  const buttonItems = itemRows.filter((row) => row.children.length === 2);

  counterItems.forEach((row, index) => {
    const [bgImageCell, numberCell, labelCell] = [...row.children];

    const colDiv = document.createElement('div');
    colDiv.classList.add('col-6', 'col-sm-6', 'col-md-6', 'col-lg-3', 'col-xl-3', 'text-center');
    if (index === 0) {
      colDiv.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-6', 'col-xl-6', 'col-lg-12', 'col-xl-12');
    } else if (index === 1) {
      colDiv.classList.add('middle-component', 'col-divider');
    }

    const customerCountDiv = document.createElement('div');
    customerCountDiv.classList.add('customer-count', 'clearfix');

    const numscrollerDiv = document.createElement('div');
    numscrollerDiv.classList.add('numscroller');

    const bgImageWrapperDiv = document.createElement('div');
    bgImageWrapperDiv.classList.add('bg-image-wrapper');

    if (bgImageCell) {
      const picture = bgImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 768px)', width: '750' }, { media: '(max-width: 767px)', width: '750' }]);
        moveInstrumentation(bgImageCell, optimizedPic.querySelector('img'));
        bgImageWrapperDiv.append(optimizedPic);
      }
    }

    const numberSpan = document.createElement('span');
    numberSpan.textContent = numberCell?.textContent?.trim() ?? '';
    // Add data attributes if needed, based on original HTML, e.g., data-delay, data-increment, data-min, data-max
    // For now, assuming these are not dynamic from EDS model.
    if (index === 0) { // Only the first counter seems to have these attributes in the example
      numberSpan.setAttribute('data-delay', '20000');
      numberSpan.setAttribute('data-increment', '111111');
      numberSpan.setAttribute('data-min', '0');
      numberSpan.setAttribute('data-max', '29777748');
    }

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('count-label');
    labelSpan.textContent = labelCell?.textContent?.trim() ?? '';

    if (index === 0) { // First counter has a different structure
      numscrollerDiv.append(bgImageWrapperDiv, numberSpan);
      customerCountDiv.append(numscrollerDiv);
      colDiv.append(customerCountDiv, labelSpan);
    } else {
      const h2Number = document.createElement('h2');
      h2Number.classList.add('count-number');
      h2Number.textContent = numberSpan.textContent; // Copy number to h2
      colDiv.append(h2Number, labelSpan);
    }

    moveInstrumentation(row, colDiv);
    gRow.append(colDiv);
  });

  innerCounterContainer.append(gRow);

  if (buttonItems.length > 0) {
    const buttonGutter = document.createElement('div');
    buttonGutter.classList.add('button-gutter', 'text-center');

    buttonItems.forEach((row) => {
      const [textCell, linkCell] = [...row.children];
      const foundLink = linkCell.querySelector('a');

      if (foundLink) {
        const buttonLink = document.createElement('a');
        buttonLink.classList.add('button', 'button-red', 'button-180'); // Add other classes from original HTML if present
        buttonLink.href = foundLink.href;
        buttonLink.textContent = textCell?.textContent?.trim() ?? '';
        // Add id and target attributes if they were present in the original link and are relevant
        // e.g., buttonLink.id = foundLink.id; buttonLink.target = foundLink.target;
        if (foundLink.id) buttonLink.id = foundLink.id;
        if (foundLink.target) buttonLink.target = foundLink.target;
        moveInstrumentation(row, buttonLink);
        buttonGutter.append(buttonLink);
      }
    });
    innerCounterContainer.append(buttonGutter);
  }

  genericWrapper.append(innerCounterContainer);
  block.append(genericWrapper);
}
