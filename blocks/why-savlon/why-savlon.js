import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [imageRow, imageAltRow, headingRow, descriptionRow, disclaimerRow] = [...block.children];

  // Image
  const imageCell = imageRow.firstElementChild;
  const originalPicture = imageCell.querySelector('picture');
  const originalImg = originalPicture ? originalPicture.querySelector('img') : null;
  const altText = imageAltRow.firstElementChild.textContent.trim();

  const figure = document.createElement('figure');
  if (originalImg) {
    const optimizedPic = createOptimizedPicture(originalImg.src, altText, false, [{ width: '750' }]);
    moveInstrumentation(originalImg, optimizedPic.querySelector('img'));
    figure.append(optimizedPic);
  } else {
    // Fallback if no image, though model implies one
    const img = document.createElement('img');
    img.alt = altText;
    figure.append(img);
  }
  moveInstrumentation(imageRow, figure); // Move instrumentation from the image row to the figure

  // Text box section
  const textBoxSection = document.createElement('section');
  textBoxSection.classList.add('text-box');

  // Heading
  const headingCell = headingRow.firstElementChild;
  const h2 = document.createElement('h2');
  h2.classList.add('white');
  h2.textContent = headingCell.textContent.trim();
  moveInstrumentation(headingRow, h2); // Move instrumentation from the heading row to h2
  textBoxSection.append(h2);

  // Description
  const descriptionCell = descriptionRow.firstElementChild;
  const descriptionDiv = document.createElement('div');
  descriptionDiv.innerHTML = descriptionCell.innerHTML; // richtext, so use innerHTML
  moveInstrumentation(descriptionRow, descriptionDiv); // Move instrumentation from description row
  textBoxSection.append(descriptionDiv);

  // Disclaimer
  const disclaimerCell = disclaimerRow.firstElementChild;
  const disclaimerDiv = document.createElement('div');
  disclaimerDiv.classList.add('dis');
  disclaimerDiv.textContent = disclaimerCell.textContent.trim();
  moveInstrumentation(disclaimerRow, disclaimerDiv); // Move instrumentation from disclaimer row
  textBoxSection.append(disclaimerDiv);

  // Clear the block and append new elements
  block.innerHTML = '';
  block.append(figure, textBoxSection);
}
