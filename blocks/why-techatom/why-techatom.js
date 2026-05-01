import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow, ...cardRows] = [...block.children];

  const whyTechatomContainer = document.createElement('div');
  whyTechatomContainer.classList.add('why-techatom-container', 'shadow-lg');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'justify-content-around', 'gy-5');

  // Headline
  const headlineEl = document.createElement('h2');
  moveInstrumentation(headlineRow, headlineEl);
  // headlineRow is a row, its innerHTML contains the cell wrapper div.
  // The headline field is richtext, so we should take the content of its first cell.
  // The BlockJson indicates headline is a richtext field, so we should use innerHTML.
  headlineEl.innerHTML = headlineRow.children[0]?.innerHTML || '';
  const span = headlineEl.querySelector('span');
  if (span) {
    span.classList.add('curve-underline');
  }
  rowDiv.append(headlineEl);

  // Cards
  cardRows.forEach((row) => {
    const [imageCell, titleCell, descriptionCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('d-block', 'why-card', 'col-lg-4', 'col-12');
    cardLink.href = '#'; // Original HTML has href="#"

    // Image
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // moveInstrumentation should be called on the original element (img) and the new element (optimizedPic.querySelector('img'))
        // The original img is inside the picture, so we pass the original img element.
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardLink.append(optimizedPic);

        // Apply specific image classes based on alt text
        const imgElement = optimizedPic.querySelector('img');
        if (imgElement) {
          const altText = imgElement.alt.toLowerCase();
          if (altText.includes('expert')) {
            imgElement.classList.add('expert-svg');
          } else if (altText.includes('badge')) {
            imgElement.classList.add('badge-svg');
          } else if (altText.includes('customer')) {
            imgElement.classList.add('expert-svg'); // Original HTML uses expert-svg for customer
          }
        }
      }
    }

    // Title
    const titleEl = document.createElement('h3');
    titleEl.textContent = titleCell?.textContent.trim() || '';
    cardLink.append(titleEl);

    // Description
    const descriptionEl = document.createElement('p');
    // Description is a richtext field, so use innerHTML
    descriptionEl.innerHTML = descriptionCell?.innerHTML || '';
    cardLink.append(descriptionEl);

    moveInstrumentation(row, cardLink);
    rowDiv.append(cardLink);
  });

  whyTechatomContainer.append(rowDiv);
  block.replaceChildren(whyTechatomContainer);
}
