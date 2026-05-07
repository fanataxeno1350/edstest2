import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow, pointerImageRow, ...serviceCardRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('service-section');
  section.id = 'services';

  // Headline and Pointer Image Container
  const headlineContainer = document.createElement('div');
  headlineContainer.classList.add('container', 'position-relative');
  moveInstrumentation(headlineRow, headlineContainer);

  const headline = document.createElement('h2');
  // FIX: headlineRow is a root row, its first child is the cell div.
  // The headline text is directly inside that cell div.
  // querySelector('div') on the cell div itself would return null.
  headline.textContent = headlineRow.children[0]?.textContent.trim() || '';
  headlineContainer.append(headline);

  const pointerImage = pointerImageRow.querySelector('picture');
  if (pointerImage) {
    const img = pointerImage.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(pointerImageRow, optimizedPic.querySelector('img'));
    optimizedPic.classList.add('pointer');
    headlineContainer.append(optimizedPic);
  }

  section.append(headlineContainer);

  // Service Cards Container
  const serviceCardsContainer = document.createElement('div');
  serviceCardsContainer.classList.add('container');
  const rowWrapper = document.createElement('div');
  rowWrapper.classList.add('row', 'justify-content-around');
  serviceCardsContainer.append(rowWrapper);

  serviceCardRows.forEach((row) => {
    const [imageCell, titleCell, descriptionCell, linkCell, buttonLabelCell] = [...row.children];

    const serviceCard = document.createElement('a');
    serviceCard.classList.add('d-block', 'col-lg-4', 'col-md-6', 'col-12', 'service-card');
    const link = linkCell.querySelector('a');
    if (link) {
      serviceCard.href = link.href;
    }
    moveInstrumentation(row, serviceCard);

    const serviceImage = imageCell.querySelector('picture');
    if (serviceImage) {
      const img = serviceImage.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      optimizedPic.querySelector('img').classList.add('img-fluid', 'service-img');
      serviceCard.append(optimizedPic);
    }

    const title = document.createElement('h3');
    title.textContent = titleCell.textContent.trim();
    serviceCard.append(title);

    const description = document.createElement('p');
    description.innerHTML = descriptionCell.innerHTML;
    serviceCard.append(description);

    const button = document.createElement('button');
    button.textContent = buttonLabelCell.textContent.trim();
    serviceCard.append(button);

    rowWrapper.append(serviceCard);
  });

  section.append(serviceCardsContainer);
  block.replaceChildren(section);
}
