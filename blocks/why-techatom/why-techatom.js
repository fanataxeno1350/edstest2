import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];
  const [headlineRow, ...cardRows] = children; // Destructure for headlineRow

  const whyTechatomContainer = document.createElement('div');
  whyTechatomContainer.classList.add('why-techatom-container', 'shadow-lg');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'justify-content-around', 'gy-5');

  const headlineElement = document.createElement('h2');
  moveInstrumentation(headlineRow, headlineElement);
  // Read innerHTML from the cell, not the row
  const headlineCell = headlineRow.children[0];
  headlineElement.innerHTML = headlineCell?.innerHTML || '';

  // Recreate the curve-underline span if it was in the original HTML
  // The original HTML shows "Why Choose <span class="curve-underline">Techatom?</span>"
  // We need to ensure this structure is preserved if the author provided it.
  const tempHeadlineDiv = document.createElement('div');
  tempHeadlineDiv.innerHTML = headlineElement.innerHTML;
  if (!tempHeadlineDiv.querySelector('.curve-underline')) {
    // If the span is not present, but "Techatom?" is in the text, add the span.
    // This handles cases where authors might not manually add the span.
    const text = headlineElement.textContent;
    const techatomIndex = text.toLowerCase().indexOf('techatom');
    if (techatomIndex !== -1) {
      const pre = text.substring(0, techatomIndex);
      const techatom = text.substring(techatomIndex, techatomIndex + 'techatom'.length);
      const post = text.substring(techatomIndex + 'techatom'.length);
      headlineElement.innerHTML = `${pre}<span class="curve-underline">${techatom}</span>${post}`;
    }
  }

  rowDiv.append(headlineElement);

  cardRows.forEach((row) => {
    const [imageCell, titleCell, descriptionCell, linkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('d-block', 'why-card', 'col-lg-4', 'col-12');
    moveInstrumentation(row, cardLink);

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
    } else {
      cardLink.href = '#'; // Fallback link
    }

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // Determine the specific class for the SVG based on the alt text or original HTML
        let svgClass = 'expert-svg'; // Default from original HTML
        if (img.alt.toLowerCase().includes('badge')) {
          svgClass = 'badge-svg';
        } else if (img.alt.toLowerCase().includes('customer')) {
          svgClass = 'expert-svg'; // Original HTML uses expert-svg for customer too
        }
        optimizedPic.querySelector('img').classList.add(svgClass);
        cardLink.append(optimizedPic);
      }
    }

    const cardTitle = document.createElement('h3');
    cardTitle.textContent = titleCell.textContent.trim();
    cardLink.append(cardTitle);

    const cardDescription = document.createElement('div'); // Use div for richtext to avoid <p> inside <p>
    cardDescription.innerHTML = descriptionCell.innerHTML; // Use innerHTML for richtext
    cardLink.append(cardDescription);

    rowDiv.append(cardLink);
  });

  whyTechatomContainer.append(rowDiv);
  block.replaceChildren(whyTechatomContainer);
}
