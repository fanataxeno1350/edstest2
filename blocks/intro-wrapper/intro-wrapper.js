import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure block.children based on the BlockJson model and EDS structure
  // The order in BlockJson is: image, heading, description, actions (container), about-link
  // The actual HTML order is: image, heading, description, about-link, then action items
  const [
    imageRow,
    headingRow,
    descriptionRow,
    aboutLinkRow, // This is the 4th row in the HTML, but 5th field in BlockJson (after actions container)
    ...actionRows // These are the remaining rows, corresponding to the 'actions' container in BlockJson
  ] = [...block.children];

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('content');

  // Image
  const picture = imageRow.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    // Ensure createOptimizedPicture is used correctly, and append to contentDiv
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    contentDiv.append(optimizedPic); // Append the optimized picture directly
  } else {
    // Handle cases where the image might be an SVG or direct img tag without picture wrapper
    const img = imageRow.querySelector('img');
    if (img) {
      contentDiv.append(img);
    }
  }

  // Heading
  const heading = document.createElement('h1');
  moveInstrumentation(headingRow, heading);
  while (headingRow.firstChild) heading.append(headingRow.firstChild);
  contentDiv.append(heading);

  // Description
  const description = document.createElement('p');
  moveInstrumentation(descriptionRow, description);
  while (descriptionRow.firstChild) description.append(descriptionRow.firstChild);
  contentDiv.append(description);

  // Actions
  // These are the rows that come *after* the aboutLinkRow in the actual block.children array
  if (actionRows.length > 0) {
    const actionList = document.createElement('ul');
    actionList.classList.add('action-list', 'stacked');

    actionRows.forEach((row) => {
      const li = document.createElement('li');
      moveInstrumentation(row, li);
      const link = row.querySelector('a');
      if (link) {
        const newLink = document.createElement('a');
        newLink.href = link.href;
        // Use class names exactly as they appear in ORIGINAL HTML
        newLink.classList.add('button', 'wide');
        // Check if it's the first action link to apply 'special' class
        if (actionList.children.length === 0) {
          newLink.classList.add('special');
        }
        moveInstrumentation(link, newLink);
        while (link.firstChild) newLink.append(link.firstChild);
        li.append(newLink);
      }
      actionList.append(li);
    });
    contentDiv.append(actionList);
  }

  block.textContent = ''; // Clear the block content
  block.append(contentDiv); // Append the main content div

  // About Link - This should be appended directly to the block, outside the contentDiv
  const aboutLink = aboutLinkRow.querySelector('a');
  if (aboutLink) {
    const newAboutLink = document.createElement('a');
    newAboutLink.href = aboutLink.href;
    moveInstrumentation(aboutLink, newAboutLink);
    while (aboutLink.firstChild) newAboutLink.append(aboutLink.firstChild);
    block.append(newAboutLink); // Append directly to the block
  }
}
