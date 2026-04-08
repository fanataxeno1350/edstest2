import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [dotRightImageRow, dotLeftImageRow, headingRow, descriptionRow] = [...block.children];

  block.textContent = '';
  block.classList.add('hm-welcome');

  // Dot Right Image
  if (dotRightImageRow) {
    const dotRightDiv = document.createElement('div');
    dotRightDiv.classList.add('dot-right');
    const picture = dotRightImageRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '267' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        dotRightDiv.append(optimizedPic);
      }
    }
    block.append(dotRightDiv);
  }

  // Dot Left Image
  if (dotLeftImageRow) {
    const dotLeftDiv = document.createElement('div');
    dotLeftDiv.classList.add('dot-left');
    const picture = dotLeftImageRow.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '267' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        dotLeftDiv.append(optimizedPic);
      }
    }
    block.append(dotLeftDiv);
  }

  const containerWrapper = document.createElement('div');
  containerWrapper.classList.add('container-1600-wrp', 'intro-para', 'wow', 'animate__', 'animate__fadeInUp', 'animated');
  block.append(containerWrapper);

  const hmWelcomeCon = document.createElement('div');
  hmWelcomeCon.classList.add('hm-welcome-con');
  containerWrapper.append(hmWelcomeCon);

  // Heading
  if (headingRow) {
    const headingCell = headingRow.firstElementChild;
    if (headingCell) {
      const h2 = document.createElement('h2');
      h2.classList.add('common-ttle');
      moveInstrumentation(headingCell, h2);
      while (headingCell.firstChild) h2.append(headingCell.firstChild);
      hmWelcomeCon.append(h2);
    }
  }

  // Description
  if (descriptionRow) {
    const descriptionCell = descriptionRow.firstElementChild;
    if (descriptionCell) {
      const p = document.createElement('p');
      moveInstrumentation(descriptionCell, p);
      while (descriptionCell.firstChild) p.append(descriptionCell.firstChild);
      hmWelcomeCon.append(p);
    }
  }
}
