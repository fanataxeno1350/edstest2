import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root rows based on BlockJson model
  const [
    sectionTitleRow,
    aboutDescriptionRow,
    aboutPointerImageRow,
    aboutMainImageRow,
    ...featureItemRows
  ] = [...block.children];

  const aboutSection = document.createElement('section');
  // Do NOT add 'about-us' class here; the outer block div already has it from AEM.
  // The original HTML shows 'about-section' on the section element, so we add that.
  aboutSection.classList.add('about-section');

  // Section Title
  const sectionTitle = document.createElement('h2');
  moveInstrumentation(sectionTitleRow, sectionTitle);
  sectionTitle.textContent = sectionTitleRow.textContent.trim();
  aboutSection.append(sectionTitle);

  // About Description and Main Image Section
  const container1 = document.createElement('div');
  container1.classList.add('container');
  const row1 = document.createElement('div');
  row1.classList.add('row', 'align-items-center');

  const col1 = document.createElement('div');
  col1.classList.add('col-lg-6', 'col-md-6', 'col-12', 'order-lg-1', 'order-md-1', 'order-2');
  const aboutDescription = document.createElement('p'); // Original HTML uses <p> for description
  moveInstrumentation(aboutDescriptionRow, aboutDescription);
  // aboutDescriptionRow is a row, its innerHTML is <div><p>content</p></div>.
  // Assigning to <p> creates <p><div><p>content</p></div></p>, which is invalid.
  // Instead, extract the inner <p> content or use a <div> as container.
  // Given the original HTML has a <p> directly, we extract its content.
  aboutDescription.innerHTML = aboutDescriptionRow.querySelector('p')?.innerHTML || '';

  const aboutPointerImage = aboutPointerImageRow.querySelector('picture');
  if (aboutPointerImage) {
    const img = aboutPointerImage.querySelector('img');
    if (img) {
      img.classList.add('img-fluid', 'about-pointer');
      // moveInstrumentation should be on the picture element, not just the img,
      // as the picture is the instrumented element in the cell.
      moveInstrumentation(aboutPointerImageRow, aboutPointerImage);
      // Append the entire picture element, not just the img, to preserve structure
      aboutDescription.append(aboutPointerImage);
    }
  }
  col1.append(aboutDescription);
  row1.append(col1);

  const col2 = document.createElement('div');
  col2.classList.add('col-lg-6', 'col-md-6', 'col-12', 'order-lg-2', 'order-md-2', 'order-1');
  const aboutMainImage = aboutMainImageRow.querySelector('picture');
  if (aboutMainImage) {
    const img = aboutMainImage.querySelector('img');
    if (img) {
      img.classList.add('img-fluid');
      img.alt = 'about us';
      // moveInstrumentation should be on the picture element
      moveInstrumentation(aboutMainImageRow, aboutMainImage);
      col2.append(aboutMainImage);
    }
  }
  row1.append(col2);
  container1.append(row1);
  aboutSection.append(container1);

  // Feature Items Section
  const container2 = document.createElement('div');
  container2.classList.add('container');
  const aboutContainer = document.createElement('div');
  aboutContainer.classList.add('about-container', 'shadow-lg');

  const provideTitle = document.createElement('h4');
  // The 'We Provide with' text is authored content in the original HTML,
  // but it's not exposed as a field in the BlockJson model.
  // For now, it's hardcoded as per the original HTML, but ideally, this should
  // be a 'text' field in the BlockJson model.
  // TODO: Add 'provideTitle' as a text field to the BlockJson model if it's editable content.
  provideTitle.textContent = 'We Provide with';
  aboutContainer.append(provideTitle);

  const featureRow = document.createElement('div');
  featureRow.classList.add('row');

  featureItemRows.forEach((row) => {
    // Destructure cells for feature items as per BlockJson model
    const [featureImageCell, featureTitleCell, featureDescriptionCell] = [...row.children];

    const col = document.createElement('div');
    col.classList.add('col-lg-4', 'col-md-6', 'col-12');

    const featureImage = featureImageCell.querySelector('picture');
    if (featureImage) {
      const img = featureImage.querySelector('img');
      if (img) {
        img.classList.add('img-fluid');
        // moveInstrumentation should be on the picture element
        moveInstrumentation(featureImageCell, featureImage);
        col.append(featureImage);
      }
    }

    const featureTitle = document.createElement('h5');
    moveInstrumentation(featureTitleCell, featureTitle);
    featureTitle.textContent = featureTitleCell.textContent.trim();
    col.append(featureTitle);

    const featureDescription = document.createElement('p'); // Original HTML uses <p>
    moveInstrumentation(featureDescriptionCell, featureDescription);
    // featureDescriptionCell is a richtext cell, its innerHTML is "<p>content</p>".
    // Assigning to <p> creates <p><p>content</p></p>, which is invalid.
    // Extract the inner <p> content.
    featureDescription.innerHTML = featureDescriptionCell.querySelector('p')?.innerHTML || '';
    col.append(featureDescription);

    featureRow.append(col);
  });

  aboutContainer.append(featureRow);
  container2.append(aboutContainer);
  aboutSection.append(container2);

  block.replaceChildren(aboutSection);

  // Optimization for pictures
  aboutSection.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation needs to be called on the original img's parent (picture)
    // and the new picture's img.
    // The original img's parent is the picture element that was moved via moveInstrumentation earlier.
    // We need to ensure the instrumentation is transferred to the new optimized picture.
    // The simplest way is to move it from the original picture element to the new one.
    const originalPicture = img.closest('picture');
    if (originalPicture) {
      moveInstrumentation(originalPicture, optimizedPic);
      originalPicture.replaceWith(optimizedPic);
    }
  });
}
