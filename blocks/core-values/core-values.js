import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow, ...itemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('coreWrapper');
  moveInstrumentation(block, section);

  // Heading
  const wraperHead = document.createElement('div');
  wraperHead.classList.add('wraperHead');
  const h2 = document.createElement('h2');
  moveInstrumentation(headingRow.firstElementChild, h2);
  h2.textContent = headingRow.firstElementChild.textContent.trim();
  wraperHead.append(h2);
  section.append(wraperHead);

  // Core Value Items
  const wrapperBoxContnt = document.createElement('div');
  wrapperBoxContnt.classList.add('wrapperBoxContnt');

  itemRows.forEach((row) => {
    const [mainImageCell, iconCell, labelCell] = [...row.children];

    const wrapperBox = document.createElement('div');
    wrapperBox.classList.add('wrapperBox');
    moveInstrumentation(row, wrapperBox);

    // Main Image
    const wrapperCard = document.createElement('div');
    wrapperCard.classList.add('wrapperCard');
    const mainPicture = mainImageCell.querySelector('picture');
    if (mainPicture) {
      const img = mainPicture.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(mainPicture, optimizedPic.querySelector('img'));
      wrapperCard.append(optimizedPic);
      optimizedPic.querySelector('img').classList.add('imageTransition', 'active');
    }
    wrapperBox.append(wrapperCard);

    // Icon and Label
    const wrapperCardText = document.createElement('div');
    wrapperCardText.classList.add('wrapperCardText');

    const iconPicture = iconCell.querySelector('picture');
    if (iconPicture) {
      const img = iconPicture.querySelector('img');
      const optimizedIcon = createOptimizedPicture(img.src, img.alt, false, [{ width: '24' }]);
      moveInstrumentation(iconPicture, optimizedIcon.querySelector('img'));
      wrapperCardText.append(optimizedIcon);
      optimizedIcon.querySelector('img').classList.add('imageTransition', 'active');
    }

    const span = document.createElement('span');
    moveInstrumentation(labelCell, span);
    span.textContent = labelCell.textContent.trim();
    wrapperCardText.append(span);

    wrapperBox.append(wrapperCardText);
    wrapperBoxContnt.append(wrapperBox);
  });

  section.append(wrapperBoxContnt);
  block.replaceWith(section);
}
