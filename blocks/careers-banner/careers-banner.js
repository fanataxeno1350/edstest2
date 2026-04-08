import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructuring block.children is acceptable here because the EDS block structure
  // guarantees a fixed number of root rows, each corresponding to a specific field.
  // The issue arises when iterating within a row and using row.children[n].
  const [
    imageRow,
    imageAltRow,
    headingSmallRow,
    headingLargeRow,
    subtextRow,
    linkRow,
  ] = [...block.children];

  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.classList.add('row-thar', 'm-0-thar', 'w-100-thar', 'section_#000');

  // Image Section
  const imageCol = document.createElement('div');
  imageCol.classList.add('px-0-thar', 'col-md-6-mp', 'col-sm-12-mp', 'max-hw-mp', 'max-h-col');
  moveInstrumentation(imageRow, imageCol);

  // Safely access the image cell within imageRow
  const imageCell = [...imageRow.children].find(cell => cell.querySelector('picture'));
  const picture = imageCell ? imageCell.querySelector('picture') : null;

  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      // Safely access the image alt cell within imageAltRow
      const imageAltCell = [...imageAltRow.children].find(cell => cell.textContent.trim() !== '');
      const altText = imageAltCell ? imageAltCell.textContent.trim() : '';
      const optimizedPic = createOptimizedPicture(img.src, altText, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageCol.append(optimizedPic);
    }
  }
  wrapper.append(imageCol);

  // Text Section
  const textCol = document.createElement('div');
  textCol.classList.add('px-0-thar', 'col-md-6-mp', 'col-sm-12-mp', 'max-h-col');

  const textInnerWrapper = document.createElement('div');
  textInnerWrapper.classList.add(
    'm-auto-thar',
    'w-66-thar',
    'h-100-thar',
    'y-pad-md-mp',
    'min-p-mp',
    'd-flex-thar',
    'flex-column-thar',
    'align-items-start-thar',
    'justify-content-center-md-mp',
  );

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('mp-content-wrapper');

  // Heading Small
  const h5 = document.createElement('h5');
  moveInstrumentation(headingSmallRow, h5);
  const headingSmallCell = [...headingSmallRow.children].find(cell => cell.textContent.trim() !== '');
  if (headingSmallCell) {
    h5.textContent = headingSmallCell.textContent.trim();
  }
  contentWrapper.append(h5);

  // Heading Large
  const h2 = document.createElement('h2');
  moveInstrumentation(headingLargeRow, h2);
  const headingLargeCell = [...headingLargeRow.children].find(cell => cell.textContent.trim() !== '');
  if (headingLargeCell) {
    h2.textContent = headingLargeCell.textContent.trim();
  }
  contentWrapper.append(h2);

  // Subtext
  const p = document.createElement('p');
  moveInstrumentation(subtextRow, p);
  const subtextCell = [...subtextRow.children].find(cell => cell.querySelector('p'));
  if (subtextCell) {
    while (subtextCell.firstChild) p.append(subtextCell.firstChild);
  }
  contentWrapper.append(p);

  textInnerWrapper.append(contentWrapper);

  // Link
  const linkEl = document.createElement('a');
  moveInstrumentation(linkRow, linkEl);
  linkEl.classList.add('mp-link-lg', 'mp-link-md', 'mp-link-sm', 'm-0-thar');
  const linkCell = [...linkRow.children].find(cell => cell.querySelector('a'));
  const foundLink = linkCell ? linkCell.querySelector('a') : null;

  if (foundLink) {
    linkEl.href = foundLink.href;
    linkEl.textContent = foundLink.textContent.trim();
    // Assuming the SVG is part of the link cell, append it
    const svgImg = foundLink.querySelector('img');
    if (svgImg) {
      const clonedSvgImg = svgImg.cloneNode(true);
      linkEl.append(clonedSvgImg);
    }
  }
  textInnerWrapper.append(linkEl);

  textCol.append(textInnerWrapper);
  wrapper.append(textCol);

  block.append(wrapper);
}
