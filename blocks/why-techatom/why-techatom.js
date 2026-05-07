import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headlineRow, ...cardRows] = [...block.children];

  const whyTechatomContainer = document.createElement('div');
  // whyTechatomContainer.classList.add('why-techatom'); // Removed: block already has this class
  whyTechatomContainer.classList.add('why-techatom-container', 'shadow-lg'); // Keep other classes from ORIGINAL HTML

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'justify-content-around', 'gy-5');

  // Headline
  if (headlineRow) {
    const h2 = document.createElement('h2');
    moveInstrumentation(headlineRow, h2);
    const textContent = headlineRow.textContent.trim();
    const chooseIndex = textContent.toLowerCase().indexOf('choose');
    const techatomIndex = textContent.toLowerCase().indexOf('techatom?');

    if (chooseIndex !== -1 && techatomIndex !== -1 && techatomIndex > chooseIndex) {
      const beforeTechatom = textContent.substring(0, techatomIndex);
      const techatomText = textContent.substring(techatomIndex, techatomIndex + 'Techatom?'.length);
      const afterTechatom = textContent.substring(techatomIndex + 'Techatom?'.length);

      h2.append(document.createTextNode(beforeTechatom));
      const span = document.createElement('span');
      span.classList.add('curve-underline');
      span.textContent = techatomText;
      h2.append(span);
      h2.append(document.createTextNode(afterTechatom));
    } else {
      h2.textContent = textContent;
    }
    rowDiv.append(h2);
  }

  // Cards
  cardRows.forEach((row) => {
    const [iconCell, titleCell, descriptionCell, cardLinkCell] = [...row.children];

    const cardLink = document.createElement('a');
    cardLink.classList.add('d-block', 'why-card', 'col-lg-4', 'col-12');

    const foundLink = cardLinkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
    } else {
      cardLink.href = '#'; // Fallback link if not found
    }

    // Icon
    const picture = iconCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        // createOptimizedPicture returns a <picture> element, not an <img>
        const optimizedPictureElement = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        // Determine the correct SVG class based on alt text or a default
        const svgClass = img.alt.toLowerCase().includes('expert') || img.alt.toLowerCase().includes('customer') ? 'expert-svg' : 'badge-svg';
        optimizedPictureElement.querySelector('img').classList.add(svgClass); // Add class to the <img> inside the new <picture>
        cardLink.append(optimizedPictureElement);
      }
    }

    // Title
    const h3 = document.createElement('h3');
    h3.textContent = titleCell.textContent.trim();
    cardLink.append(h3);

    // Description
    // Description is richtext, so it might contain <p> tags. Assigning to a <p>
    // directly would create <p><p>...</p></p>, which is invalid. Use a <div>.
    const descriptionDiv = document.createElement('div');
    descriptionDiv.innerHTML = descriptionCell.innerHTML;
    cardLink.append(descriptionDiv);

    moveInstrumentation(row, cardLink);
    rowDiv.append(cardLink);
  });

  whyTechatomContainer.append(rowDiv);
  block.replaceChildren(whyTechatomContainer);
}
