import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    backgroundMobileRow,
    backgroundDesktopRow,
    ...itemRows
  ] = [...block.children];

  block.innerHTML = ''; // Clear the original block content

  const genericWrapper = document.createElement('div');
  genericWrapper.classList.add('genericWrapper');

  // Background Images
  const mobilePicture = backgroundMobileRow.querySelector('picture');
  if (mobilePicture) {
    const mobileImg = mobilePicture.querySelector('img');
    const genericMobile = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '750' }]);
    genericMobile.querySelector('img').classList.add('generic-mobile');
    moveInstrumentation(backgroundMobileRow, genericMobile.querySelector('img'));
    genericWrapper.append(genericMobile);
  }

  const desktopPicture = backgroundDesktopRow.querySelector('picture');
  if (desktopPicture) {
    const desktopImg = desktopPicture.querySelector('img');
    const genericDesktop = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '2000' }]);
    genericDesktop.querySelector('img').classList.add('generic-desktop');
    moveInstrumentation(backgroundDesktopRow, genericDesktop.querySelector('img'));
    genericWrapper.append(genericDesktop);
  }

  const innerCounterContainer = document.createElement('div');
  innerCounterContainer.classList.add('inner-counter-container');

  const gRow = document.createElement('div');
  gRow.classList.add('g-row');

  // Distinguish item rows based on cell count as per BlockJson
  const counterItems = itemRows.filter((row) => [...row.children].length === 3);
  const buttons = itemRows.filter((row) => [...row.children].length === 2);

  if (counterItems.length > 0) {
    const customerCountCol = document.createElement('div');
    customerCountCol.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-6', 'col-xl-6', 'text-center', 'col-lg-12', 'col-xl-12');

    const customerCountDiv = document.createElement('div');
    customerCountDiv.classList.add('customer-count', 'clearfix');

    const numscrollerDiv = document.createElement('div');
    numscrollerDiv.classList.add('numscroller');

    const bgImageWrapper = document.createElement('div');
    bgImageWrapper.classList.add('bg-image-wrapper');

    counterItems.forEach((row) => {
      const cells = [...row.children];
      const bgImageCell = cells[0];
      const countCell = cells[1];
      const labelCell = cells[2];

      const bgPicture = bgImageCell.querySelector('picture');
      if (bgPicture) {
        const bgImg = bgPicture.querySelector('img');
        const optimizedBgPic = createOptimizedPicture(bgImg.src, bgImg.alt, false, [{ media: '(min-width: 768px)', width: '750' }, { media: '(max-width: 767px)', width: '750' }]);
        moveInstrumentation(bgImageCell, optimizedBgPic.querySelector('img'));
        bgImageWrapper.append(optimizedBgPic);
      }

      const countSpan = document.createElement('span');
      // Data attributes for numscroller should ideally come from model or be configurable
      // For now, using example values from original HTML/common patterns
      countSpan.setAttribute('data-delay', '20000');
      countSpan.setAttribute('data-increment', '111111');
      countSpan.setAttribute('data-min', '0');
      countSpan.setAttribute('data-max', '29777748');
      countSpan.textContent = countCell.textContent.trim();
      moveInstrumentation(countCell, countSpan);
      numscrollerDiv.append(countSpan);

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('count-label');
      labelSpan.textContent = labelCell.textContent.trim();
      moveInstrumentation(labelCell, labelSpan);
      // Append label to customerCountDiv, not customerCountCol directly, to match original HTML structure
      customerCountDiv.append(labelSpan);
    });

    numscrollerDiv.prepend(bgImageWrapper);
    customerCountDiv.prepend(numscrollerDiv); // prepend to match original HTML structure
    customerCountCol.append(customerCountDiv); // Append the whole customerCountDiv to the column
    gRow.append(customerCountCol);
  }

  // Removed placeholder columns for middle and right components as they are not defined in BlockJson
  // and were creating empty divs not present in the original HTML structure for this block.

  innerCounterContainer.append(gRow);

  if (buttons.length > 0) {
    const buttonGutter = document.createElement('div');
    buttonGutter.classList.add('button-gutter', 'text-center');

    buttons.forEach((row) => {
      const cells = [...row.children];
      const textCell = cells[0];
      const linkCell = cells[1];
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        const buttonLink = document.createElement('a');
        buttonLink.classList.add('button', 'button-red', 'button-180');
        buttonLink.href = foundLink.href;
        buttonLink.textContent = textCell.textContent.trim();
        buttonLink.target = '_self'; // Default target
        if (buttonLink.href.includes('book-showroom-visit')) {
          buttonLink.id = 'BaSV-Home-red';
        } else if (buttonLink.href.includes('service')) {
          buttonLink.id = 'BSV-Home-red';
          buttonLink.classList.add('bookAServiceAppointmentButton');
        }
        moveInstrumentation(row, buttonLink);
        buttonGutter.append(buttonLink);
      }
    });
    innerCounterContainer.append(buttonGutter);
  }

  genericWrapper.append(innerCounterContainer);
  block.append(genericWrapper);

  // Removed the redundant image optimization loop at the end.
  // Images are already optimized when they are created and appended.
}
