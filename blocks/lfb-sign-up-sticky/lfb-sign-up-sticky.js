import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0 & 1: Replaced direct index access with content detection for root rows
  // BlockJson indicates two root fields: heading (text) and signupLink (aem-content)
  const cells = [...block.children].map((row) => [...row.children][0]); // Each root row has one cell

  const headingCell = cells.find(cell => !cell.querySelector('a')); // Heading is plain text
  const signupLinkCell = cells.find(cell => cell.querySelector('a')); // Signup link has an <a>

  const closeButton = document.createElement('span');
  closeButton.classList.add('lfb-sign-up_sticky--close'); // CHECK 1.5: Class name from ORIGINAL HTML
  closeButton.addEventListener('click', () => { // CHECK 2: Interactivity for close button
    block.remove();
  });

  const topDiv = document.createElement('div');
  topDiv.classList.add('lfb-sign-up_sticky--top'); // CHECK 1.5: Class name from ORIGINAL HTML

  const heading = document.createElement('h3');
  // CHECK 1.5: Heading is type=text, so .textContent.trim() is correct.
  heading.textContent = headingCell?.textContent.trim() || '';
  if (headingCell) {
    moveInstrumentation(headingCell, heading);
  }

  const signupLink = document.createElement('a');
  const foundLink = signupLinkCell?.querySelector('a');
  if (foundLink) {
    // CHECK 1.5: signupLink is type=aem-content, so .href is correct.
    signupLink.href = foundLink.href;
    // CHECK 1.5: Text content for the link should be "SIGN UP" as per ORIGINAL HTML, not from the AEM content path.
    signupLink.textContent = 'SIGN UP';
  }
  if (signupLinkCell) {
    moveInstrumentation(signupLinkCell, signupLink);
  }

  topDiv.append(heading, signupLink);

  const bottomDiv = document.createElement('div');
  bottomDiv.classList.add('lfb-sign-up_sticky--bottom'); // CHECK 1.5: Class name from ORIGINAL HTML

  block.innerHTML = ''; // Clear the block content
  block.classList.add('lfb-sign-up_sticky'); // CHECK 1.5: Add the main block class from ORIGINAL HTML
  block.append(closeButton, topDiv, bottomDiv);
}
