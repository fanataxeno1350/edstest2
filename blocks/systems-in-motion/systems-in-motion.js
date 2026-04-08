import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    dotRightImageRow,
    dotLeftImageRow,
    headingRow,
    descriptionRow,
    ...motionCardRows
  ] = [...block.children];

  block.textContent = '';

  // Dot Right Image
  if (dotRightImageRow) {
    const dotRight = document.createElement('div');
    dotRight.classList.add('dot-right');
    const picture = dotRightImageRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '267' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        dotRight.append(optimizedPic);
      }
    }
    block.append(dotRight);
  }

  // Dot Left Image
  if (dotLeftImageRow) {
    const dotLeft = document.createElement('div');
    dotLeft.classList.add('dot-left');
    const picture = dotLeftImageRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '267' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        dotLeft.append(optimizedPic);
      }
    }
    block.append(dotLeft);
  }

  // Container for heading and description
  const container1600Wrp = document.createElement('div');
  container1600Wrp.classList.add('container-1600-wrp');

  // Heading
  if (headingRow) {
    const heading = document.createElement('h2');
    heading.classList.add('common-ttle', 'wow', 'animate__', 'animate__fadeInUp', 'animated');
    moveInstrumentation(headingRow, heading);
    while (headingRow.firstChild) heading.append(headingRow.firstChild);
    container1600Wrp.append(heading);
  }

  // Description
  if (descriptionRow) {
    const description = document.createElement('p');
    description.classList.add('wow', 'animate__', 'animate__fadeInUp', 'animated');
    moveInstrumentation(descriptionRow, description);
    while (descriptionRow.firstChild) description.append(descriptionRow.firstChild);
    container1600Wrp.append(description);
  }
  block.append(container1600Wrp);

  // Motion Cards
  if (motionCardRows.length > 0) {
    const motionCardHld = document.createElement('div');
    motionCardHld.classList.add('motion-card-hld');

    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    motionCardRows.forEach((cardRow, index) => {
      const colLg6 = document.createElement('div');
      colLg6.classList.add('col-lg-6');

      const mCardBlurb = document.createElement('div');
      mCardBlurb.classList.add('m-card-blurb', 'wow', 'animate__', 'animate__fadeInUp', 'animated');
      mCardBlurb.setAttribute('data-wow-duration', '1s');
      mCardBlurb.setAttribute('data-wow-delay', `${0.1 + index * 0.1}s`);

      const contentDiv = document.createElement('div');

      const cells = [...cardRow.children];
      let logoCell;
      let titleCell;
      let textCell;
      let linkCell;

      cells.forEach((cell) => {
        if (cell.querySelector('picture')) {
          logoCell = cell;
        } else if (cell.querySelector('a')) {
          linkCell = cell;
        } else if (cell.querySelector('h1, h2, h3, h4, h5, h6')) {
          titleCell = cell;
        } else if (cell.textContent.trim().length > 0) {
          // If a title cell hasn't been found yet and this cell has text,
          // it could be the title if it's the first non-picture/link cell.
          // Otherwise, it's likely the text cell.
          if (!titleCell && !textCell) { // Prioritize title if not found yet
            titleCell = cell;
          } else if (!textCell) { // Then look for text
            textCell = cell;
          }
        }
      });

      // Logo
      if (logoCell) {
        const figure = document.createElement('figure');
        const picture = logoCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '80' }]);
            optimizedPic.querySelector('img').classList.add('bg-cover');
            moveInstrumentation(img, optimizedPic.querySelector('img'));
            figure.append(optimizedPic);
          }
        }
        contentDiv.append(figure);
      }

      // Title
      if (titleCell) {
        const h4 = document.createElement('h4');
        moveInstrumentation(titleCell, h4);
        while (titleCell.firstChild) h4.append(titleCell.firstChild);
        contentDiv.append(h4);
      }

      // Text
      if (textCell) {
        const p = document.createElement('p');
        moveInstrumentation(textCell, p);
        while (textCell.firstChild) p.append(textCell.firstChild);
        contentDiv.append(p);
      }

      mCardBlurb.append(contentDiv);

      // Link
      if (linkCell) {
        const link = linkCell.querySelector('a');
        if (link) {
          const btnBox = document.createElement('a');
          btnBox.classList.add('btn-box');
          btnBox.href = link.href;
          btnBox.textContent = link.textContent;
          if (link.target) btnBox.target = link.target;
          mCardBlurb.append(btnBox);
        }
      }

      colLg6.append(mCardBlurb);
      rowDiv.append(colLg6);
    });
    motionCardHld.append(rowDiv);
    block.append(motionCardHld);
  }
}
