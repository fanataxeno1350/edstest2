import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Corrected destructuring based on BlockJson:
  // background-mobile, background-desktop, counter-items (container), button-1, button-2
  const [
    backgroundMobileRow,
    backgroundDesktopRow,
    counterItemsContainerRow, // This is the container row for counter items
    button1Row,
    button2Row,
    ...itemRows // Actual item rows follow
  ] = [...block.children];

  block.textContent = '';

  const genericWrapper = document.createElement('div');
  genericWrapper.classList.add('genericWrapper');

  // Background Mobile Image
  const mobilePicture = backgroundMobileRow.querySelector('picture');
  if (mobilePicture) {
    const mobileImg = mobilePicture.querySelector('img');
    const optimizedMobilePic = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '750' }]);
    const newMobileImg = optimizedMobilePic.querySelector('img');
    newMobileImg.classList.add('generic-mobile'); // Class name from ORIGINAL HTML
    moveInstrumentation(mobileImg, newMobileImg);
    genericWrapper.append(newMobileImg);
  }

  // Background Desktop Image
  const desktopPicture = backgroundDesktopRow.querySelector('picture');
  if (desktopPicture) {
    const desktopImg = desktopPicture.querySelector('img');
    const optimizedDesktopPic = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '2000' }]);
    const newDesktopImg = optimizedDesktopPic.querySelector('img');
    newDesktopImg.classList.add('generic-desktop'); // Class name from ORIGINAL HTML
    moveInstrumentation(desktopImg, newDesktopImg);
    genericWrapper.append(newDesktopImg);
  }

  const innerCounterContainer = document.createElement('div');
  innerCounterContainer.classList.add('inner-counter-container');

  const gRow = document.createElement('div');
  gRow.classList.add('g-row');

  const customerCountCol = document.createElement('div');
  customerCountCol.classList.add('col-12', 'col-sm-12', 'col-md-12', 'col-lg-6', 'col-xl-6', 'text-center', 'col-lg-12', 'col-xl-12');

  const customerCountDiv = document.createElement('div');
  customerCountDiv.classList.add('customer-count', 'clearfix');

  const numscrollerDiv = document.createElement('div');
  numscrollerDiv.classList.add('numscroller');

  const bgImageWrapper = document.createElement('div');
  bgImageWrapper.classList.add('bg-image-wrapper');

  const countItemsContainer = document.createElement('div');
  countItemsContainer.classList.add('g-row'); // Adding g-row to contain counter items

  // The first item in itemRows is actually the content of the 'counter-items' container,
  // which in the EDS structure is just a div with "Counter Items value".
  // We need to skip this and process the actual counter-item rows.
  // Based on the BlockJson, 'counter-items' is a container, and the actual items are 'counter-item'.
  // The `itemRows` variable correctly captures the actual `counter-item` rows.

  itemRows.forEach((row) => {
    // Each item row has 3 cells: bg-image, count-number, count-label
    const [bgImageCell, countNumberCell, countLabelCell] = [...row.children];

    const colDiv = document.createElement('div');
    colDiv.classList.add('col-6', 'col-sm-6', 'col-md-6', 'col-lg-3', 'col-xl-3', 'text-center');
    moveInstrumentation(row, colDiv);

    const middleComponent = document.createElement('div');
    middleComponent.classList.add('middle-component', 'col-divider');

    // Background Image for each counter item
    const itemPicture = bgImageCell.querySelector('picture');
    if (itemPicture) {
      const itemImg = itemPicture.querySelector('img');
      const optimizedItemPic = createOptimizedPicture(itemImg.src, itemImg.alt, false, [{ width: '750' }]);
      moveInstrumentation(itemImg, optimizedItemPic.querySelector('img'));
      bgImageWrapper.append(optimizedItemPic); // Append to the common bgImageWrapper
    }

    const countNumber = document.createElement('h2');
    countNumber.classList.add('count-number');
    moveInstrumentation(countNumberCell, countNumber);
    while (countNumberCell.firstChild) countNumber.append(countNumberCell.firstChild);

    const countLabel = document.createElement('span');
    countLabel.classList.add('count-label');
    moveInstrumentation(countLabelCell, countLabel);
    while (countLabelCell.firstChild) countLabel.append(countLabelCell.firstChild);

    middleComponent.append(countNumber, countLabel);
    colDiv.append(middleComponent);
    countItemsContainer.append(colDiv);
  });

  numscrollerDiv.append(bgImageWrapper);
  customerCountDiv.append(numscrollerDiv);
  customerCountCol.append(customerCountDiv);
  gRow.append(customerCountCol, countItemsContainer); // Append the container for counter items

  const buttonGutter = document.createElement('div');
  buttonGutter.classList.add('button-gutter', 'text-center');

  const button1Link = button1Row.querySelector('a');
  if (button1Link) {
    const btn1 = document.createElement('a');
    btn1.classList.add('button', 'button-red', 'button-180');
    btn1.href = button1Link.href;
    btn1.textContent = button1Link.textContent;
    btn1.id = 'BaSV-Home-red';
    btn1.target = '_self';
    moveInstrumentation(button1Row, btn1);
    buttonGutter.append(btn1);
  }

  const button2Link = button2Row.querySelector('a');
  if (button2Link) {
    const btn2 = document.createElement('a');
    btn2.classList.add('button', 'button-red', 'button-180', 'bookAServiceAppointmentButton');
    btn2.href = button2Link.href;
    btn2.textContent = button2Link.textContent;
    btn2.id = 'BSV-Home-red';
    btn2.target = '_self';
    moveInstrumentation(button2Row, btn2);
    buttonGutter.append(btn2);
  }

  innerCounterContainer.append(gRow, buttonGutter);
  genericWrapper.append(innerCounterContainer);
  block.append(genericWrapper);

  // Optimize images (this part seems to be a general optimization, not specific to the block structure)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
