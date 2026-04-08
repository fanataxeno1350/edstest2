import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // The original HTML shows an <img> tag directly, not a <picture> or a div wrapper.
  // The EDS block structure, however, suggests a div wrapper with a picture.
  // We need to reconcile this. Given the original HTML is just an <img>,
  // we will extract the image source and alt from the block's content
  // (which will be a div > div > picture > img based on the EDS structure)
  // and then replace the entire block content with a simple <img> tag
  // that matches the original HTML.

  const imageRow = [...block.children].find(row => row.querySelector('picture'));
  if (!imageRow) {
    // If no picture is found in the block structure, it means the block is empty or malformed.
    return;
  }

  const picture = imageRow.querySelector('picture');
  const img = picture ? picture.querySelector('img') : null;

  if (img) {
    const newImg = document.createElement('img');
    newImg.alt = img.alt;
    newImg.src = img.src;

    // The original HTML does not show specific classes for the image,
    // so we don't add any here. If there were classes, we would add them.

    // Move instrumentation from the original row to the new image element.
    moveInstrumentation(imageRow, newImg);

    // Clear the block and append the new image.
    block.textContent = '';
    block.append(newImg);
  }
}
