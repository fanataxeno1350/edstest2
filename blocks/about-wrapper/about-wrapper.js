import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('style1');

  const [headingRow, descriptionRow, ...reelItemRows] = [...block.children];

  const header = document.createElement('header');
  const heading = document.createElement('h2');
  moveInstrumentation(headingRow, heading);
  while (headingRow.firstChild) heading.append(headingRow.firstChild);
  header.append(heading);

  const description = document.createElement('p');
  moveInstrumentation(descriptionRow, description);
  while (descriptionRow.firstChild) description.append(descriptionRow.firstChild);
  header.append(description);

  const carouselDiv = document.createElement('div');
  carouselDiv.classList.add('carousel', 'active');

  const reelDiv = document.createElement('div');
  reelDiv.classList.add('reel');

  reelItemRows.forEach((row) => {
    const linkEl = document.createElement('a');
    moveInstrumentation(row, linkEl);

    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const altTextCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));

    if (linkCell && linkCell.querySelector('a')) {
      const foundLink = linkCell.querySelector('a');
      linkEl.href = foundLink.href;
      linkEl.target = '_blank'; // Assuming target="_blank" from original HTML for links in reel
    }

    if (imageCell && imageCell.querySelector('picture')) {
      const foundPicture = imageCell.querySelector('picture');
      const img = foundPicture.querySelector('img');
      const altText = altTextCell ? altTextCell.textContent.trim() : (img ? img.alt : '');

      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        linkEl.append(optimizedPic);
      }
    }

    reelDiv.append(linkEl);
  });

  carouselDiv.append(reelDiv);

  block.textContent = '';
  block.append(header, carouselDiv);
}
