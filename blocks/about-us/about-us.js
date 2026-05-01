import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root rows based on BlockJson model
  const [
    headingRow,
    descriptionRow,
    aboutPointerImageRow,
    mainImageRow,
    servicesHeadingRow,
    ...serviceItemRows
  ] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('about-section');
  // moveInstrumentation for the block itself, moving its attributes to the new section
  moveInstrumentation(block, section);

  // Section Heading
  const h2 = document.createElement('h2');
  h2.textContent = headingRow.textContent.trim();
  moveInstrumentation(headingRow, h2); // Move instrumentation from headingRow to h2
  section.append(h2);

  // About Description and Main Image
  const container1 = document.createElement('div');
  container1.classList.add('container');
  const row1 = document.createElement('div');
  row1.classList.add('row', 'align-items-center');

  const col1 = document.createElement('div');
  col1.classList.add('col-lg-6', 'col-md-6', 'col-12', 'order-lg-1', 'order-md-1', 'order-2');
  const pDescription = document.createElement('p');
  // Read richtext content directly from the cell's innerHTML
  pDescription.innerHTML = descriptionRow.children[0]?.innerHTML || '';
  moveInstrumentation(descriptionRow, pDescription); // Move instrumentation from descriptionRow to pDescription

  const aboutPointerImage = aboutPointerImageRow.querySelector('picture');
  if (aboutPointerImage) {
    const img = aboutPointerImage.querySelector('img');
    const optimizedPointerPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedPointerPic.querySelector('img').classList.add('img-fluid', 'about-pointer');
    moveInstrumentation(aboutPointerImageRow, optimizedPointerPic.querySelector('img')); // Move instrumentation
    pDescription.append(optimizedPointerPic);
  }
  col1.append(pDescription);

  const col2 = document.createElement('div');
  col2.classList.add('col-lg-6', 'col-md-6', 'col-12', 'order-lg-2', 'order-md-2', 'order-1');
  const mainImage = mainImageRow.querySelector('picture');
  if (mainImage) {
    const img = mainImage.querySelector('img');
    const optimizedMainPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    optimizedMainPic.querySelector('img').classList.add('img-fluid');
    optimizedMainPic.querySelector('img').alt = img.alt || 'about us'; // Add alt text from original HTML
    moveInstrumentation(mainImageRow, optimizedMainPic.querySelector('img')); // Move instrumentation
    col2.append(optimizedMainPic);
  }

  row1.append(col1, col2);
  container1.append(row1);
  section.append(container1);

  // Services
  const container2 = document.createElement('div');
  container2.classList.add('container');
  const aboutContainer = document.createElement('div');
  aboutContainer.classList.add('about-container', 'shadow-lg');

  const h4Services = document.createElement('h4');
  h4Services.textContent = servicesHeadingRow.textContent.trim();
  moveInstrumentation(servicesHeadingRow, h4Services); // Move instrumentation
  aboutContainer.append(h4Services);

  const servicesRow = document.createElement('div');
  servicesRow.classList.add('row');

  serviceItemRows.forEach((row) => {
    const [iconCell, titleCell, descriptionCell] = [...row.children];

    const serviceCol = document.createElement('div');
    serviceCol.classList.add('col-lg-4', 'col-md-6', 'col-12');
    moveInstrumentation(row, serviceCol); // Move instrumentation from the item row to its container

    const serviceIcon = iconCell.querySelector('picture');
    if (serviceIcon) {
      const img = serviceIcon.querySelector('img');
      const optimizedIconPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedIconPic.querySelector('img').classList.add('img-fluid');
      moveInstrumentation(iconCell, optimizedIconPic.querySelector('img')); // Move instrumentation
      serviceCol.append(optimizedIconPic);
    }

    const h5Title = document.createElement('h5');
    h5Title.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, h5Title); // Move instrumentation
    serviceCol.append(h5Title);

    const pServiceDescription = document.createElement('p');
    // Read richtext content directly from the cell's innerHTML
    pServiceDescription.innerHTML = descriptionCell.children[0]?.innerHTML || '';
    moveInstrumentation(descriptionCell, pServiceDescription); // Move instrumentation
    serviceCol.append(pServiceDescription);

    servicesRow.append(serviceCol);
  });

  aboutContainer.append(servicesRow);
  container2.append(aboutContainer);
  section.append(container2);

  block.replaceChildren(section);

  // Optimize all images within the block
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    // moveInstrumentation for the original img element is implicitly handled by its parent cell
    // and then to the new picture element. We just need to replace the picture.
    img.closest('picture').replaceWith(optimizedPic);
  });
}
