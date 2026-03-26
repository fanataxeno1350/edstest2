import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    bgImageMobileRow,
    bgImageDesktopRow,
    countersContainerRow, // This row is just a container, its content is not used
    buttonsContainerRow,  // This row is just a container, its content is not used
    ...itemRows
  ] = [...block.children];

  const genericWrapper = document.createElement('div');
  genericWrapper.classList.add('genericWrapper');

  // Background Image Mobile
  const mobilePicture = bgImageMobileRow.querySelector('picture');
  if (mobilePicture) {
    const mobileImg = mobilePicture.querySelector('img');
    const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '750' }]);
    const newMobileImg = optimizedMobilePic.querySelector('img');
    newMobileImg.classList.add('generic-mobile');
    newMobileImg.setAttribute('srcset', newMobileImg.src); // Copy src to srcset as per original
    newMobileImg.removeAttribute('width'); // Remove width and height if present
    newMobileImg.removeAttribute('height');
    moveInstrumentation(mobileImg, newMobileImg);
    genericWrapper.append(optimizedMobilePic);
  }

  // Background Image Desktop
  const desktopPicture = bgImageDesktopRow.querySelector('picture');
  if (desktopPicture) {
    const desktopImg = desktopPicture.querySelector('img');
    const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '2000' }]);
    const newDesktopImg = optimizedDesktopPic.querySelector('img');
    newDesktopImg.classList.add('generic-desktop');
    newDesktopImg.setAttribute('srcset', newDesktopImg.src); // Copy src to srcset as per original
    newDesktopImg.removeAttribute('width'); // Remove width and height if present
    newDesktopImg.removeAttribute('height');
    moveInstrumentation(desktopImg, newDesktopImg);
    genericWrapper.append(optimizedDesktopPic);
  }

  const innerCounterContainer = document.createElement('div');
  innerCounterContainer.classList.add('inner-counter-container');

  const gRow = document.createElement('div');
  gRow.classList.add('g-row');

  // Distinguish item types based on cell count
  const counters = itemRows.filter((row) => row.children.length === 3);
  const buttons = itemRows.filter((row) => row.children.length === 2);

  counters.forEach((row, index) => {
    const counterDiv = document.createElement('div');
    counterDiv.classList.add('col-6', 'col-sm-6', 'col-md-6', 'col-lg-3', 'col-xl-3', 'text-center');

    // The first counter has different column classes
    if (index === 0) {
      // Remove the default classes and add the specific ones for the first counter
      counterDiv.classList.remove('col-6', 'col-sm-6', 'col-md-6', 'col-lg-3', 'col-xl-3');
      counterDiv.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-6', 'col-xl-6');
    }

    const [bgImageCell, numberCell, labelCell] = [...row.children];

    if (index === 0) {
      const customerCountDiv = document.createElement('div');
      customerCountDiv.classList.add('customer-count', 'clearfix');
      // Instrumentation should be moved from the original row, not the container row
      moveInstrumentation(row, customerCountDiv);

      const numscrollerDiv = document.createElement('div');
      numscrollerDiv.classList.add('numscroller');

      const bgImageWrapper = document.createElement('div');
      bgImageWrapper.classList.add('bg-image-wrapper');
      const picture = bgImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 768px)', width: '2000' }, { media: '(max-width: 767px)', width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        bgImageWrapper.append(optimizedPic);
      }
      numscrollerDiv.append(bgImageWrapper);

      const spanNumber = document.createElement('span');
      moveInstrumentation(numberCell, spanNumber);
      spanNumber.setAttribute('data-delay', '20000');
      spanNumber.setAttribute('data-increment', '111111');
      spanNumber.setAttribute('data-min', '0');
      spanNumber.setAttribute('data-max', numberCell.textContent.trim());
      spanNumber.textContent = numberCell.textContent.trim();
      numscrollerDiv.append(spanNumber);

      customerCountDiv.append(numscrollerDiv);
      counterDiv.append(customerCountDiv);

      const spanLabel = document.createElement('span');
      spanLabel.classList.add('count-label');
      moveInstrumentation(labelCell, spanLabel);
      spanLabel.textContent = labelCell.textContent.trim();
      counterDiv.append(spanLabel);
    } else {
      const middleComponentDiv = document.createElement('div');
      middleComponentDiv.classList.add('middle-component');
      if (index === 1) { // Only the second counter has col-divider
        middleComponentDiv.classList.add('col-divider');
      }

      const h2Number = document.createElement('h2');
      h2Number.classList.add('count-number');
      moveInstrumentation(numberCell, h2Number);
      h2Number.textContent = numberCell.textContent.trim();
      middleComponentDiv.append(h2Number);

      const spanLabel = document.createElement('span');
      spanLabel.classList.add('count-label');
      moveInstrumentation(labelCell, spanLabel);
      spanLabel.textContent = labelCell.textContent.trim();
      middleComponentDiv.append(spanLabel);
      counterDiv.append(middleComponentDiv);
    }
    gRow.append(counterDiv);
  });

  innerCounterContainer.append(gRow);

  const buttonGutter = document.createElement('div');
  buttonGutter.classList.add('button-gutter', 'text-center');
  // Instrumentation should be moved from the original row, not the container row
  moveInstrumentation(buttonsContainerRow, buttonGutter);

  buttons.forEach((row) => {
    const [linkCell, textCell] = [...row.children];
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      const a = document.createElement('a');
      a.classList.add('button', 'button-red', 'button-180');
      a.href = foundLink.href;
      a.textContent = textCell.textContent.trim();
      moveInstrumentation(linkCell, a); // Move instrumentation from link cell
      buttonGutter.append(a);
    }
  });
  innerCounterContainer.append(buttonGutter);

  genericWrapper.append(innerCounterContainer);
  block.textContent = '';
  block.append(genericWrapper);

  // Image optimization for all pictures within the block
  block.querySelectorAll('picture > img').forEach((img) => {
    // Only optimize if it's not the already handled background images
    if (!img.classList.contains('generic-mobile') && !img.classList.contains('generic-desktop')) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    }
  });
}
