import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, additionalDescriptionRow, ...cardRows] = [...block.children];

  block.classList.add('movement-matters');

  const containerWrapper = document.createElement('div');
  containerWrapper.classList.add('container-1600-wrp');

  // Heading
  const heading = document.createElement('h2');
  moveInstrumentation(headingRow, heading);
  heading.classList.add('common-ttle', 'wow', 'animate__', 'animate__fadeInUp', 'animated');
  heading.textContent = headingRow.firstElementChild.textContent;
  containerWrapper.append(heading);

  const movementHld = document.createElement('div');
  movementHld.classList.add('movement-hld');
  containerWrapper.append(movementHld);

  const row = document.createElement('div');
  row.classList.add('row', 'align-items-lg-center', 'justify-content-lg-between');
  movementHld.append(row);

  // Description and Additional Description
  const descriptionCol = document.createElement('div');
  descriptionCol.classList.add('col-lg-7', 'pb-lg-0', 'pb-4', 'wow', 'animate__', 'animate__fadeInUp', 'animated');

  moveInstrumentation(descriptionRow, descriptionCol);
  while (descriptionRow.firstElementChild) {
    descriptionCol.append(descriptionRow.firstElementChild);
  }

  moveInstrumentation(additionalDescriptionRow, descriptionCol);
  while (additionalDescriptionRow.firstElementChild) {
    descriptionCol.append(additionalDescriptionRow.firstElementChild);
  }
  row.append(descriptionCol);

  // M-Card-Blurb items
  const cardCol = document.createElement('div');
  cardCol.classList.add('col-lg-4');
  row.append(cardCol);

  cardRows.forEach((cardRow) => {
    const mCardBlurb = document.createElement('div');
    moveInstrumentation(cardRow, mCardBlurb);
    mCardBlurb.classList.add('m-card-blurb', 'wow', 'animate__', 'animate__fadeInUp', 'animated');

    const contentDiv = document.createElement('div');
    mCardBlurb.append(contentDiv);

    const cells = [...cardRow.children];
    // Based on BlockJson 'm-card-blurb' fields: Title (text), Text (richtext), Link (aem-content)
    const titleCell = cells[0]; // Assuming title is always the first cell
    const textCell = cells[1]; // Assuming text is always the second cell
    const linkCell = cells[2]; // Assuming link is always the third cell

    if (titleCell) {
      const h4 = document.createElement('h4');
      moveInstrumentation(titleCell, h4);
      while (titleCell.firstChild) h4.append(titleCell.firstChild);
      contentDiv.append(h4);
    }

    if (textCell) {
      const p = document.createElement('p');
      moveInstrumentation(textCell, p);
      while (textCell.firstChild) p.append(textCell.firstChild);
      contentDiv.append(p);
    }

    if (linkCell && linkCell.querySelector('a')) {
      const link = document.createElement('a');
      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
        link.textContent = foundLink.textContent;
      }
      link.classList.add('btn-box');
      moveInstrumentation(linkCell, link);
      mCardBlurb.append(link);
    }
    cardCol.append(mCardBlurb);
  });

  block.textContent = '';
  block.append(containerWrapper);
}
