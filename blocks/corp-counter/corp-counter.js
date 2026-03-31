import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    bgImageMobileRow,
    bgImageDesktopRow,
    countersContainerRow, // This row is a container, its content is not directly used for rendering
    buttonsContainerRow,  // This row is a container, its content is not directly used for rendering
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
    moveInstrumentation(desktopImg, newDesktopImg);
    genericWrapper.append(optimizedDesktopPic);
  }

  const innerCounterContainer = document.createElement('div');
  innerCounterContainer.classList.add('inner-counter-container');

  const gRow = document.createElement('div');
  gRow.classList.add('g-row');

  // Distinguish item types based on cell count
  const counterItems = itemRows.filter((row) => row.children.length === 3);
  const buttonItems = itemRows.filter((row) => row.children.length === 2);

  counterItems.forEach((row, index) => {
    const [bgImageCell, numberCell, labelCell] = [...row.children];

    const colDiv = document.createElement('div');
    moveInstrumentation(row, colDiv);

    if (index === 0) {
      // First counter has specific classes and structure
      colDiv.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-6', 'col-xl-6', 'text-center', 'col-lg-12', 'col-xl-12');

      const customerCountDiv = document.createElement('div');
      customerCountDiv.classList.add('customer-count', 'clearfix');

      const numscroller = document.createElement('div');
      numscroller.classList.add('numscroller');

      const bgImageWrapper = document.createElement('div');
      bgImageWrapper.classList.add('bg-image-wrapper');
      const picture = bgImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        bgImageWrapper.append(optimizedPic);
      }
      numscroller.append(bgImageWrapper);

      const spanNumber = document.createElement('span');
      // Original HTML has data attributes on the span itself
      spanNumber.setAttribute('data-delay', '20000');
      spanNumber.setAttribute('data-increment', '111111');
      spanNumber.setAttribute('data-min', '0');
      spanNumber.setAttribute('data-max', '29777748');
      spanNumber.textContent = numberCell.textContent.trim();
      numscroller.append(spanNumber);
      customerCountDiv.append(numscroller);

      const spanLabel = document.createElement('span');
      spanLabel.classList.add('count-label');
      spanLabel.textContent = labelCell.textContent.trim();

      colDiv.append(customerCountDiv, spanLabel);
    } else {
      // Subsequent counters have different column classes and are wrapped in 'middle-component'
      colDiv.classList.add('col-6', 'col-sm-6', 'col-md-6', 'col-lg-3', 'col-xl-3', 'text-center');

      const middleComponentDiv = document.createElement('div');
      middleComponentDiv.classList.add('middle-component', 'col-divider');

      const h2 = document.createElement('h2');
      h2.classList.add('count-number');
      h2.textContent = numberCell.textContent.trim();

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('count-label');
      labelSpan.textContent = labelCell.textContent.trim();

      middleComponentDiv.append(h2, labelSpan);
      colDiv.append(middleComponentDiv);
    }

    gRow.append(colDiv);
  });

  innerCounterContainer.append(gRow);

  const buttonGutter = document.createElement('div');
  buttonGutter.classList.add('button-gutter', 'text-center');

  buttonItems.forEach((row) => {
    const [linkCell, textCell] = [...row.children];
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      const anchor = document.createElement('a');
      moveInstrumentation(linkCell, anchor);
      anchor.classList.add('button', 'button-red', 'button-180');
      anchor.href = foundLink.href;
      anchor.textContent = textCell.textContent.trim();
      // Add specific IDs and target if present in original HTML, e.g., id="BaSV-Home-red"
      if (anchor.textContent.includes('SHOWROOM')) { // Heuristic to match original example
        anchor.id = 'BaSV-Home-red';
        anchor.target = '_self';
      } else if (anchor.textContent.includes('SERVICE')) { // Heuristic
        anchor.id = 'BSV-Home-red';
        anchor.target = '_self';
        anchor.classList.add('bookAServiceAppointmentButton');
      }
      buttonGutter.append(anchor);
    }
  });

  innerCounterContainer.append(buttonGutter);
  genericWrapper.append(innerCounterContainer);

  block.textContent = '';
  block.append(genericWrapper);

  // The final image optimization loop is redundant as createOptimizedPicture already handles it.
  // It also causes issues if it re-optimizes images already processed.
  // block.querySelectorAll('picture > img').forEach((img) => {
  //   // Only optimize if not already handled by createOptimizedPicture
  //   if (!img.closest('picture').dataset.optimized) {
  //     const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //     moveInstrumentation(img, optimizedPic.querySelector('img'));
  //     img.closest('picture').replaceWith(optimizedPic);
  //     optimizedPic.dataset.optimized = 'true'; // Mark as optimized
  //   }
  // });
}
