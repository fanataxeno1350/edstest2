import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Corrected destructuring to match the BlockJson and EDS Block Structure
  // block.children[0]: field="background-image-mobile"
  // block.children[1]: field="background-image-desktop"
  // block.children[2]: field="counter-items" (container, but its content is ignored in JS)
  // block.children[3]: field="buttons" (container, but its content is ignored in JS)
  // ...itemRows: actual counter-item and button rows
  const [
    bgImageMobileRow,
    bgImageDesktopRow,
    _counterItemsContainerRow, // Ignored as per BlockJson, actual items are in itemRows
    _buttonsContainerRow, // Ignored as per BlockJson, actual items are in itemRows
    ...itemRows
  ] = [...block.children];

  // Distinguish item types based on cell count as per BlockJson
  const counterItems = itemRows.filter((row) => row.children.length === 3); // counter-item has 3 fields
  const buttons = itemRows.filter((row) => row.children.length === 2); // button has 2 fields

  const genericWrapper = document.createElement('div');
  genericWrapper.classList.add('genericWrapper');

  // Background Image Mobile
  if (bgImageMobileRow) {
    const mobilePic = bgImageMobileRow.querySelector('picture');
    if (mobilePic) {
      const img = mobilePic.querySelector('img');
      const mobileImg = document.createElement('img');
      mobileImg.classList.add('generic-mobile');
      mobileImg.alt = img?.alt || 'section background';
      mobileImg.src = img?.src || ''; // Will be replaced by createOptimizedPicture
      moveInstrumentation(img, mobileImg);
      genericWrapper.append(mobileImg);
    }
  }

  // Background Image Desktop
  if (bgImageDesktopRow) {
    const desktopPic = bgImageDesktopRow.querySelector('picture');
    if (desktopPic) {
      const img = desktopPic.querySelector('img');
      const desktopImg = document.createElement('img');
      desktopImg.classList.add('generic-desktop');
      desktopImg.alt = img?.alt || 'section background';
      desktopImg.src = img?.src || ''; // Will be replaced by createOptimizedPicture
      moveInstrumentation(img, desktopImg);
      genericWrapper.append(desktopImg);
    }
  }

  const innerCounterContainer = document.createElement('div');
  innerCounterContainer.classList.add('inner-counter-container');

  const gRow = document.createElement('div');
  gRow.classList.add('g-row');

  counterItems.forEach((row, index) => {
    const [bgImageCell, countNumberCell, countLabelCell] = [...row.children];

    const col = document.createElement('div');
    // Apply base classes from original HTML
    col.classList.add('text-center');

    // Conditional classes based on index, matching original HTML structure
    if (index === 0) {
      col.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-6', 'col-xl-6', 'col-lg-12', 'col-xl-12');
    } else {
      col.classList.add('col-6', 'col-sm-6', 'col-md-6', 'col-lg-3', 'col-xl-3');
    }

    if (index === 1) {
      col.classList.add('middle-component', 'col-divider');
    }

    moveInstrumentation(row, col);

    const customerCount = document.createElement('div');
    customerCount.classList.add('customer-count', 'clearfix');

    const numscroller = document.createElement('div');
    numscroller.classList.add('numscroller');

    const bgImageWrapper = document.createElement('div');
    bgImageWrapper.classList.add('bg-image-wrapper');

    const picture = bgImageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ media: '(min-width: 768px)', width: '2000' }, { media: '(max-width: 767px)', width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        bgImageWrapper.append(optimizedPic);
      }
    }

    const countNumberSpan = document.createElement('span');
    countNumberSpan.classList.add('count-number');
    countNumberSpan.textContent = countNumberCell.textContent.trim();
    // Add data attributes for numscroller if it's the first item
    if (index === 0) {
      countNumberSpan.setAttribute('data-delay', '20000');
      countNumberSpan.setAttribute('data-increment', '111111');
      countNumberSpan.setAttribute('data-min', '0');
      countNumberSpan.setAttribute('data-max', countNumberCell.textContent.trim());
    }

    const countLabelSpan = document.createElement('span');
    countLabelSpan.classList.add('count-label');
    countLabelSpan.textContent = countLabelCell.textContent.trim();

    if (index === 0) {
      numscroller.append(bgImageWrapper, countNumberSpan);
      customerCount.append(numscroller);
      col.append(customerCount, countLabelSpan);
    } else {
      const h2 = document.createElement('h2');
      h2.classList.add('count-number');
      h2.textContent = countNumberCell.textContent.trim();
      col.append(h2, countLabelSpan);
    }

    gRow.append(col);
  });

  innerCounterContainer.append(gRow);

  const buttonGutter = document.createElement('div');
  buttonGutter.classList.add('button-gutter', 'text-center');

  buttons.forEach((row) => {
    const [textCell, linkCell] = [...row.children];
    const link = linkCell.querySelector('a');
    if (link) {
      const buttonLink = document.createElement('a');
      // Ensure all classes are from the allowlist
      buttonLink.classList.add('button', 'button-red', 'button-180');
      buttonLink.href = link.href;
      buttonLink.textContent = textCell.textContent.trim();
      // Add specific classes from original HTML if present
      if (link.id) {
        buttonLink.id = link.id;
      }
      if (link.target) {
        buttonLink.target = link.target;
      }
      if (link.classList.contains('bookAServiceAppointmentButton')) {
        buttonLink.classList.add('bookAServiceAppointmentButton');
      }

      moveInstrumentation(row, buttonLink); // Move instrumentation from the button row to the new buttonLink
      buttonGutter.append(buttonLink);
    }
  });

  innerCounterContainer.append(buttonGutter);
  genericWrapper.append(innerCounterContainer);

  block.textContent = '';
  block.append(genericWrapper);

  // Optimize images
  // This section seems to be a general image optimization, not specific to the block structure.
  // It should be handled by the createOptimizedPicture calls within the block's specific logic.
  // Removing the generic block.querySelectorAll('picture > img') optimization to avoid double processing
  // or unintended optimization of images not explicitly handled by the block's structure.

  // Optimize generic-mobile and generic-desktop images
  block.querySelectorAll('img.generic-mobile, img.generic-desktop').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.replaceWith(optimizedPic);
  });
}
