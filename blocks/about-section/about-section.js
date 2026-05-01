import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root rows based on BlockJson model
  const [
    sectionTitleRow,
    aboutDescriptionRow,
    aboutPointerImageRow,
    aboutMainImageRow,
    featuresTitleRow,
    ...featureItemRows
  ] = [...block.children];

  // Access cells directly from destructured rows
  const sectionTitleCell = sectionTitleRow.children[0];
  const aboutDescriptionCell = aboutDescriptionRow.children[0];
  const aboutPointerImageCell = aboutPointerImageRow.children[0];
  const aboutMainImageCell = aboutMainImageRow.children[0];
  const featuresTitleCell = featuresTitleRow.children[0];

  const section = document.createElement('section');
  section.classList.add('about-section');
  moveInstrumentation(block, section);

  // Section Title
  const sectionTitle = document.createElement('h2');
  sectionTitle.textContent = sectionTitleCell?.textContent.trim() || '';
  moveInstrumentation(sectionTitleRow, sectionTitle); // Use the row for instrumentation
  section.append(sectionTitle);

  const container = document.createElement('div');
  container.classList.add('container');

  const row1 = document.createElement('div');
  row1.classList.add('row', 'align-items-center');

  const col1 = document.createElement('div');
  col1.classList.add('col-lg-6', 'col-md-6', 'col-12', 'order-lg-1', 'order-md-1', 'order-2');

  // About Description (richtext)
  const descriptionP = document.createElement('p'); // Original HTML uses <p> here
  if (aboutDescriptionCell) {
    moveInstrumentation(aboutDescriptionRow, descriptionP); // Use the row for instrumentation
    // Read innerHTML directly from the cell for richtext
    descriptionP.innerHTML = aboutDescriptionCell.innerHTML;
  }

  // About Pointer Image
  const aboutPointerImage = aboutPointerImageCell?.querySelector('picture');
  if (aboutPointerImage) {
    const img = aboutPointerImage.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.querySelector('img').classList.add('img-fluid', 'about-pointer');
    moveInstrumentation(aboutPointerImageRow, optimizedPic.querySelector('img')); // Use the row for instrumentation
    descriptionP.append(optimizedPic); // Append to the paragraph as per original HTML
  }
  col1.append(descriptionP);
  row1.append(col1);

  const col2 = document.createElement('div');
  col2.classList.add('col-lg-6', 'col-md-6', 'col-12', 'order-lg-2', 'order-md-2', 'order-1');

  // About Main Image
  const aboutMainImage = aboutMainImageCell?.querySelector('picture');
  if (aboutMainImage) {
    const img = aboutMainImage.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPic.querySelector('img').classList.add('img-fluid');
    optimizedPic.querySelector('img').alt = 'about us'; // Add alt text as per original HTML
    moveInstrumentation(aboutMainImageRow, optimizedPic.querySelector('img')); // Use the row for instrumentation
    col2.append(optimizedPic);
  }
  row1.append(col2);
  container.append(row1);
  section.append(container);

  const container2 = document.createElement('div');
  container2.classList.add('container');

  const aboutContainer = document.createElement('div');
  aboutContainer.classList.add('about-container', 'shadow-lg');

  // Features Title
  const featuresTitle = document.createElement('h4');
  featuresTitle.textContent = featuresTitleCell?.textContent.trim() || '';
  moveInstrumentation(featuresTitleRow, featuresTitle); // Use the row for instrumentation
  aboutContainer.append(featuresTitle);

  const row2 = document.createElement('div');
  row2.classList.add('row');

  featureItemRows.forEach((row) => {
    // Destructure cells for each feature item row
    const [featureImageCell, featureTitleCell, featureDescriptionCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-lg-4', 'col-md-6', 'col-12');

    const featureImage = featureImageCell?.querySelector('picture');
    if (featureImage) {
      const img = featureImage.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('img-fluid');
      moveInstrumentation(featureImageCell, optimizedPic.querySelector('img'));
      col.append(optimizedPic);
    }

    const featureTitle = document.createElement('h5');
    featureTitle.textContent = featureTitleCell?.textContent.trim() || '';
    moveInstrumentation(featureTitleCell, featureTitle);
    col.append(featureTitle);

    const featureDescription = document.createElement('p');
    if (featureDescriptionCell) {
      moveInstrumentation(featureDescriptionCell, featureDescription);
      // Read innerHTML directly from the cell for richtext
      featureDescription.innerHTML = featureDescriptionCell.innerHTML;
    }
    col.append(featureDescription);
    moveInstrumentation(row, col);
    row2.append(col);
  });

  aboutContainer.append(row2);
  container2.append(aboutContainer);
  section.append(container2);

  block.replaceChildren(section);

  // This part is redundant as createOptimizedPicture is already called above
  // and moveInstrumentation is handled for each image.
  // Removing this to prevent double optimization and potential instrumentation issues.
  // section.querySelectorAll('picture > img').forEach((img) => {
  //   const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
  //   moveInstrumentation(img, optimizedPic.querySelector('img'));
  //   img.closest('picture').replaceWith(optimizedPic);
  // });
}
