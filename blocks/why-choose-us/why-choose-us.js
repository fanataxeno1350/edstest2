import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('why-techatom');
  moveInstrumentation(block, section);

  const container = document.createElement('div');
  container.classList.add('why-techatom-container', 'shadow-lg');
  section.append(container);

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row', 'justify-content-around', 'gy-5');
  container.append(rowDiv);

  // Section Heading
  const [headingRow, ...cardRows] = children; // Destructure heading row and remaining card rows

  const headingCell = headingRow?.children[0]; // Access the first cell of the heading row
  if (headingCell) {
    const h2 = document.createElement('h2');
    moveInstrumentation(headingRow, h2);

    // The heading is a richtext field, so we should read its innerHTML
    // and then process the text for the span.
    const headingHtml = headingCell.innerHTML;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = headingHtml;
    const headingText = tempDiv.textContent.trim(); // Get plain text for detection

    const chooseIndex = headingText.toLowerCase().indexOf('choose');
    const techatomIndex = headingText.toLowerCase().indexOf('techatom?');

    if (chooseIndex !== -1 && techatomIndex !== -1 && techatomIndex > chooseIndex) {
      const beforeChoose = headingText.substring(0, chooseIndex).trim();
      const chooseWord = headingText.substring(chooseIndex, chooseIndex + 'choose'.length);
      const between = headingText.substring(chooseIndex + 'choose'.length, techatomIndex).trim();
      const techatomWord = headingText.substring(techatomIndex, techatomIndex + 'techatom?'.length);

      if (beforeChoose) {
        h2.append(document.createTextNode(beforeChoose));
      }
      if (chooseWord) {
        h2.append(document.createTextNode(` ${chooseWord} `));
      }
      if (between) {
        h2.append(document.createTextNode(between));
      }
      if (techatomWord) {
        const span = document.createElement('span');
        span.classList.add('curve-underline');
        span.textContent = techatomWord;
        h2.append(span);
      }
    } else {
      // Fallback if specific structure not found, use original HTML
      h2.innerHTML = headingHtml;
    }
    rowDiv.append(h2);
  }

  // Cards
  cardRows.forEach((row) => {
    const [imageCell, titleCell, descriptionCell, linkCell] = [...row.children];

    const anchor = document.createElement('a');
    anchor.classList.add('d-block', 'why-card', 'col-lg-4', 'col-12');
    moveInstrumentation(row, anchor);

    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
    } else {
      anchor.href = '#'; // Fallback link
    }

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        const imgEl = optimizedPic.querySelector('img');
        const altTextLower = imgEl.alt.toLowerCase();
        if (altTextLower.includes('expert') || altTextLower.includes('customer')) {
          imgEl.classList.add('expert-svg');
        } else if (altTextLower.includes('badge')) {
          imgEl.classList.add('badge-svg');
        }
        anchor.append(optimizedPic);
        moveInstrumentation(imageCell, imgEl);
      }
    }

    if (titleCell) {
      const h3 = document.createElement('h3');
      h3.textContent = titleCell.textContent.trim();
      anchor.append(h3);
      moveInstrumentation(titleCell, h3);
    }

    if (descriptionCell) {
      const p = document.createElement('p');
      // Description is richtext, so use innerHTML
      p.innerHTML = descriptionCell.innerHTML;
      anchor.append(p);
      moveInstrumentation(descriptionCell, p);
    }

    rowDiv.append(anchor);
  });

  block.replaceChildren(section);
}
