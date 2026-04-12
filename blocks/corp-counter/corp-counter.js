import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  const genericWrapper = document.createElement('div');
  genericWrapper.classList.add('genericWrapper');

  // Find Background Image Mobile and Desktop using content detection
  let backgroundImageMobileRow;
  let backgroundImageDesktopRow;
  const itemRowsStartIndex = 0; // Start looking from the first row

  // Iterate through initial rows to find background images
  for (let i = 0; i < rows.length; i += 1) {
    const row = rows[i];
    const picture = row.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // Heuristic: Check alt text or other attributes if available to distinguish mobile/desktop
        // For now, assume the first picture is mobile, second is desktop based on EDS structure
        if (!backgroundImageMobileRow) {
          backgroundImageMobileRow = row;
        } else if (!backgroundImageDesktopRow) {
          backgroundImageDesktopRow = row;
          // All initial background image rows found, break
          break;
        }
      }
    }
  }

  // Background Image Mobile
  if (backgroundImageMobileRow) {
    const mobileImgCell = backgroundImageMobileRow.querySelector('div');
    if (mobileImgCell) {
      const picture = mobileImgCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const mobileImg = document.createElement('img');
          mobileImg.classList.add('generic-mobile');
          mobileImg.srcset = img.src; // Assuming srcset from original is img.src
          mobileImg.alt = img.alt || 'section background';
          genericWrapper.append(mobileImg);
        }
      }
    }
  }

  // Background Image Desktop
  if (backgroundImageDesktopRow) {
    const desktopImgCell = backgroundImageDesktopRow.querySelector('div');
    if (desktopImgCell) {
      const picture = desktopImgCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const desktopImg = document.createElement('img');
          desktopImg.classList.add('generic-desktop');
          desktopImg.srcset = img.src; // Assuming srcset from original is img.src
          desktopImg.alt = img.alt || 'section background';
          genericWrapper.append(desktopImg);
        }
      }
    }
  }

  const innerCounterContainer = document.createElement('div');
  innerCounterContainer.classList.add('inner-counter-container');

  const gRow = document.createElement('div');
  gRow.classList.add('g-row');

  // Filter item rows for counters and buttons
  // Start slicing after the background image rows (which are always the first two)
  const itemRows = rows.slice(2);
  const counterRows = itemRows.filter((row) => [...row.children].length === 3);
  const buttonRows = itemRows.filter((row) => [...row.children].length === 2);

  // Counters
  counterRows.forEach((row, index) => {
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-6', 'col-sm-6', 'col-md-6', 'col-lg-3', 'col-xl-3', 'text-center');

    if (index === 0) {
      colDiv.classList.remove('col-6', 'col-sm-6', 'col-md-6', 'col-lg-3', 'col-xl-3');
      colDiv.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-6', 'col-xl-6', 'col-lg-12', 'col-xl-12');
    }

    const customerCountDiv = document.createElement('div');
    customerCountDiv.classList.add('customer-count', 'clearfix');

    const numscrollerDiv = document.createElement('div');
    numscrollerDiv.classList.add('numscroller');

    const bgImageWrapper = document.createElement('div');
    bgImageWrapper.classList.add('bg-image-wrapper');

    let countNumberText = '';
    let countLabelText = '';
    let backgroundImageCell;
    let countNumberCell;
    let countLabelCell;

    // Content detection for counter cells
    const cells = [...row.children];
    backgroundImageCell = cells.find((cell) => cell.querySelector('picture'));
    countNumberCell = cells.find((cell) => !cell.querySelector('picture') && cell.textContent.trim().match(/^\d+$/));
    countLabelCell = cells.find((cell) => !cell.querySelector('picture') && !cell.textContent.trim().match(/^\d+$/));

    if (backgroundImageCell) {
      const picture = backgroundImageCell.querySelector('picture');
      if (picture) {
        const newPicture = document.createElement('picture');
        // Copy sources from original picture
        [...picture.children].forEach((child) => {
          if (child.tagName === 'SOURCE' || child.tagName === 'IMG') {
            const clone = child.cloneNode(true);
            newPicture.append(clone);
          }
        });
        bgImageWrapper.append(newPicture);
      }
    }

    if (countNumberCell) {
      countNumberText = countNumberCell.textContent.trim();
    }

    if (countLabelCell) {
      countLabelText = countLabelCell.textContent.trim();
    }

    numscrollerDiv.append(bgImageWrapper);

    const countSpan = document.createElement('span');
    countSpan.setAttribute('data-delay', '20000');
    countSpan.setAttribute('data-increment', '111111');
    countSpan.setAttribute('data-min', '0');
    // The data-max attribute should come from the model if possible, or be a reasonable default.
    // For now, keeping the placeholder as it was not in EDS structure.
    countSpan.setAttribute('data-max', '29777748');
    countSpan.textContent = countNumberText;
    numscrollerDiv.append(countSpan);

    customerCountDiv.append(numscrollerDiv);

    const countLabelSpan = document.createElement('span');
    countLabelSpan.classList.add('count-label');
    countLabelSpan.textContent = countLabelText;

    if (index === 0) {
      colDiv.append(customerCountDiv);
      colDiv.append(countLabelSpan);
    } else {
      const middleComponentDiv = document.createElement('div');
      middleComponentDiv.classList.add('middle-component', 'col-divider');
      const h2CountNumber = document.createElement('h2');
      h2CountNumber.classList.add('count-number');
      h2CountNumber.textContent = countNumberText;
      middleComponentDiv.append(h2CountNumber);
      middleComponentDiv.append(countLabelSpan);
      colDiv.append(middleComponentDiv);
    }

    moveInstrumentation(row, colDiv);
    gRow.append(colDiv);
  });

  innerCounterContainer.append(gRow);

  // Buttons
  if (buttonRows.length > 0) {
    const buttonGutter = document.createElement('div');
    buttonGutter.classList.add('button-gutter', 'text-center');

    buttonRows.forEach((row) => {
      let buttonText = '';
      let buttonLinkHref = '';
      let buttonLinkTarget = '_self'; // Default target

      const cells = [...row.children];
      const linkCell = cells.find((cell) => cell.querySelector('a'));
      const textCell = cells.find((cell) => !cell.querySelector('a'));

      if (linkCell) {
        const link = linkCell.querySelector('a');
        if (link) {
          buttonLinkHref = link.href;
          buttonLinkTarget = link.target || '_self';
        }
      }
      if (textCell) {
        buttonText = textCell.textContent.trim();
      }

      const buttonLink = document.createElement('a');
      buttonLink.classList.add('button', 'button-red', 'button-180');
      buttonLink.href = buttonLinkHref;
      buttonLink.target = buttonLinkTarget;
      buttonLink.textContent = buttonText;

      // Add specific classes based on text content from original HTML if available
      if (buttonText.includes('SHOWROOM VISIT')) {
        buttonLink.id = 'BaSV-Home-red';
      } else if (buttonText.includes('SERVICE')) {
        buttonLink.id = 'BSV-Home-red';
        buttonLink.classList.add('bookAServiceAppointmentButton');
      }

      moveInstrumentation(row, buttonLink);
      buttonGutter.append(buttonLink);
    });
    innerCounterContainer.append(buttonGutter);
  }

  genericWrapper.append(innerCounterContainer);

  // Image optimization
  genericWrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(genericWrapper);
}
