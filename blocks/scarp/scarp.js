import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const scarpComponent = document.createElement('div');
  scarpComponent.classList.add('scarp-component', 'fade-in');
  scarpComponent.setAttribute('data-fade-in', '');

  const scarpContainer = document.createElement('div');
  scarpContainer.classList.add('scarp_container');

  // The EDS block structure indicates the first child of the block is the row containing the image.
  // BlockJson also confirms a single root field.
  const scarpRow = block.firstElementChild;

  const imgCell = scarpRow ? scarpRow.querySelector('div') : null;
  const imgPicture = imgCell ? imgCell.querySelector('picture') : null;

  if (imgPicture) {
    const sourceImg = imgPicture.querySelector('img');
    if (sourceImg) {
      const optimizedPic = createOptimizedPicture(sourceImg.src, sourceImg.alt, false, [{ width: '750' }]);
      const newImg = optimizedPic.querySelector('img');
      if (newImg) {
        newImg.setAttribute('aria-hidden', 'true');
        newImg.classList.add('scarp-separator__scarp', 'green-scarp');
      }
      scarpContainer.append(optimizedPic);
      moveInstrumentation(scarpRow, optimizedPic);
    }
  }

  scarpComponent.append(scarpContainer);

  block.textContent = '';
  block.append(scarpComponent);
}
