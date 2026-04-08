import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, descriptionRow, ...blurbRows] = [...block.children];

  block.classList.add('hm-eng-for-evol');

  const containerWrapper = document.createElement('div');
  containerWrapper.classList.add('container-1600-wrp');

  // Heading
  const headingEl = document.createElement('h2');
  moveInstrumentation(headingRow.firstElementChild, headingEl);
  headingEl.classList.add('common-ttle', 'wow', 'animate__', 'animate__fadeInUp', 'animated');
  headingEl.append(...headingRow.firstElementChild.children);
  containerWrapper.append(headingEl);

  // Description
  const descriptionEl = document.createElement('p');
  moveInstrumentation(descriptionRow.firstElementChild, descriptionEl);
  descriptionEl.classList.add('wow', 'animate__', 'animate__fadeInUp', 'animated');
  descriptionEl.append(...descriptionRow.firstElementChild.children);
  containerWrapper.append(descriptionEl);

  // Blurbs
  const evolutionBlurbHld = document.createElement('div');
  evolutionBlurbHld.classList.add('evolution-blurb-hld');

  const rowDiv = document.createElement('div');
  rowDiv.classList.add('row');

  blurbRows.forEach((blurbRow) => {
    const colLg4 = document.createElement('div');
    colLg4.classList.add('col-lg-4');
    moveInstrumentation(blurbRow, colLg4);

    const evolutionBlurb = document.createElement('div');
    evolutionBlurb.classList.add('evolution-blurb', 'wow', 'animate__', 'animate__fadeInUp', 'animated');

    const blurb = document.createElement('div');
    blurb.classList.add('blurb');

    const blurbContentDiv = document.createElement('div');

    // Access cells by index based on BlockJson model for 'blurb' item
    // [0]: image, [1]: imageAlt, [2]: title, [3]: text, [4]: link
    const cells = [...blurbRow.children];
    const imageCell = cells[0];
    const imageAltCell = cells[1]; // Not directly used in current JS, but available
    const titleCell = cells[2];
    const textCell = cells[3];
    const linkCell = cells[4];

    if (imageCell) {
      const figure = document.createElement('figure');
      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '80' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          figure.append(optimizedPic);
          optimizedPic.querySelector('img').classList.add('bg-cover');
          optimizedPic.querySelector('img').setAttribute('width', '80');
          optimizedPic.querySelector('img').setAttribute('height', '80');
        }
      }
      blurbContentDiv.append(figure);
    }

    const blurbDet = document.createElement('div');
    blurbDet.classList.add('blurb-det');

    if (titleCell) {
      const h4 = document.createElement('h4');
      moveInstrumentation(titleCell, h4);
      while (titleCell.firstChild) h4.append(titleCell.firstChild);
      blurbDet.append(h4);
    }

    if (textCell) {
      moveInstrumentation(textCell, blurbDet);
      while (textCell.firstChild) blurbDet.append(textCell.firstChild);
    }
    blurbContentDiv.append(blurbDet);
    blurb.append(blurbContentDiv);

    if (linkCell) {
      const link = linkCell.querySelector('a');
      if (link) {
        const btnBox = document.createElement('a');
        moveInstrumentation(linkCell, btnBox);
        btnBox.classList.add('btn-box');
        btnBox.href = link.href;
        btnBox.textContent = link.textContent;
        blurb.append(btnBox);
      }
    }

    evolutionBlurb.append(blurb);
    colLg4.append(evolutionBlurb);
    rowDiv.append(colLg4);
  });

  evolutionBlurbHld.append(rowDiv);
  containerWrapper.append(evolutionBlurbHld);

  block.textContent = '';
  block.append(containerWrapper);
}
