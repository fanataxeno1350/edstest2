import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...productRows] = [...block.children];

  const mainBox = document.createElement('div');
  mainBox.classList.add('account-mainBox', 'mx-md-16');

  const row = document.createElement('div');
  row.classList.add('row', 'gx-5');

  const leftSection = document.createElement('div');
  leftSection.classList.add('mt-8', 'mt-md-10', 'col-lg-4');

  // Heading
  const headingP = document.createElement('p');
  headingP.classList.add('font-24', 'font-md-40', 'fw-bold', 'product-container_heading', 'font-baskerville');
  moveInstrumentation(headingRow.firstElementChild, headingP);
  headingP.textContent = headingRow.firstElementChild.textContent.trim();
  leftSection.append(headingP);

  const productMainBox = document.createElement('div');
  productMainBox.classList.add('product-mainbox', 'mt-10', 'mt-md-12');

  productRows.forEach((productRow) => {
    const productItemDiv = document.createElement('div');
    moveInstrumentation(productRow, productItemDiv);

    // Use content detection instead of firstElementChild/lastElementChild
    const cells = [...productRow.children];
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const labelCell = cells.find(cell => !cell.querySelector('picture')); // Assuming label cell doesn't contain a picture

    const productHoverDiv = document.createElement('div');
    productHoverDiv.classList.add('milk_ghee_smallImag', 'product-hover');

    if (imageCell) {
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
          optimizedPic.querySelector('img').classList.add('left-section-gheeBox', 'object-fit-contain');
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          productHoverDiv.append(optimizedPic);
        }
      }
    }

    if (labelCell) {
      const labelP = document.createElement('p');
      labelP.classList.add('product-subnames');
      labelP.textContent = labelCell.textContent.trim();
      moveInstrumentation(labelCell, labelP);
      productHoverDiv.append(labelP);
    }

    productItemDiv.append(productHoverDiv);
    productMainBox.append(productItemDiv);
  });

  leftSection.append(productMainBox);
  row.append(leftSection);

  // Right section (placeholder for now, as it's not part of the block's authored content)
  const rightSection = document.createElement('div');
  rightSection.classList.add('right-section', 'mt-10', 'py-0', 'position-relative', 'col-lg-8');
  // Add any static content or structure from the original HTML for the right section if necessary
  // based on the original HTML, this section seems to contain static content not driven by the block.
  // For this exercise, we'll just add the main container.

  const gheeBox = document.createElement('div');
  gheeBox.classList.add('ghee_box');
  const accountMainBgBox = document.createElement('div');
  accountMainBgBox.classList.add('account-mainBg-box', 'w-100');
  gheeBox.append(accountMainBgBox); // Placeholder for actual content
  rightSection.append(gheeBox);

  row.append(rightSection);
  mainBox.append(row);
  block.textContent = ''; // Clear the block content
  block.append(mainBox);
  block.classList.add('container-xl', 'annualReport_mainBox');
}
