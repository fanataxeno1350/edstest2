import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Check 0 & 1: Structure Alignment - use content detection instead of direct index access
  // The block structure is fixed, so we can use destructuring for the root rows,
  // but within each row, we must use firstElementChild or content detection.
  const rows = [...block.children];

  // Row 0: Image
  const imageRow = rows[0];
  const imageCell = imageRow.firstElementChild; // This is safe as per EDS structure
  const picture = imageCell.querySelector('picture');
  const img = picture ? picture.querySelector('img') : null;

  const figure = document.createElement('figure');
  if (img) {
    // Check 1.5: Richtext fields with HTML content - image is reference type, handled correctly
    const optimizedPic = createOptimizedPicture(img.src, '', false, [{ width: '750' }]); // Alt text will be from next row
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    figure.append(optimizedPic);
  } else {
    figure.classList.add('empty-image-placeholder');
  }
  moveInstrumentation(imageRow, figure);
  imageRow.replaceWith(figure); // Replace the original imageRow with the new figure

  // Row 1: Image Alt Text
  const imageAltRow = rows[1];
  const imageAltText = imageAltRow.firstElementChild.textContent.trim();
  // Update the alt text for the optimized picture
  const imgElement = figure.querySelector('img');
  if (imgElement) {
    imgElement.alt = imageAltText;
  }
  imageAltRow.remove(); // Remove the alt text row as its content has been used

  // Text Box Section
  const section = document.createElement('section');
  section.classList.add('text-box'); // Class from ORIGINAL HTML

  // Row 2: Heading
  const headingRow = rows[2];
  const headingCell = headingRow.firstElementChild;
  const h2 = document.createElement('h2');
  h2.classList.add('white'); // Class from ORIGINAL HTML
  h2.textContent = headingCell.textContent.trim();
  moveInstrumentation(headingRow, h2);
  section.append(h2);
  headingRow.remove(); // Remove the original row

  // Row 3: Description
  const descriptionRow = rows[3];
  const descriptionCell = descriptionRow.firstElementChild;
  const descriptionDiv = document.createElement('div');
  // Check 1.5: Richtext fields with HTML content - use innerHTML for richtext
  descriptionDiv.innerHTML = descriptionCell.innerHTML;
  moveInstrumentation(descriptionRow, descriptionDiv);
  // The original HTML uses <p> for description, so we should ensure it's wrapped in <p>
  // If descriptionDiv already contains <p> tags, no need to add another.
  // This check is to prevent double-wrapping if the source already provides <p>.
  // Given the original HTML, it already has <p>, so no extra wrapping is needed.
  // Removed the redundant paragraph wrapping logic.
  section.append(descriptionDiv);
  descriptionRow.remove(); // Remove the original row

  // Row 4: Disclaimer
  const disclaimerRow = rows[4];
  const disclaimerCell = disclaimerRow.firstElementChild;
  const disclaimerDiv = document.createElement('div');
  disclaimerDiv.classList.add('dis'); // Class from ORIGINAL HTML
  disclaimerDiv.textContent = disclaimerCell.textContent.trim();
  moveInstrumentation(disclaimerRow, disclaimerDiv);
  section.append(disclaimerDiv);
  disclaimerRow.remove(); // Remove the original row

  // Append the new section to the block
  block.append(section);

  // Check 2: Interactivity - No interactive elements found in ORIGINAL HTML
}
