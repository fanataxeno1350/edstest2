import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Check 0 & 1: Structure Alignment - Using content detection instead of direct index access
  // The BlockJson defines two fields: 'link' (aem-content) and 'text' (text).
  // We need to find the row containing the link and the row containing the text.
  const linkRow = rows.find(row => row.querySelector('a'));
  const textRow = rows.find(row => !row.querySelector('a') && row.textContent.trim() !== '');

  const skipLink = document.createElement('a');
  // Check 1: Class names from ORIGINAL HTML
  skipLink.classList.add('visually-hidden', 'focusable', 'skip-link');

  if (linkRow) {
    const linkElement = linkRow.querySelector('a');
    if (linkElement) {
      skipLink.href = linkElement.href;
      moveInstrumentation(linkRow, skipLink);
    }
  } else {
    // Default to main content if no link is provided
    skipLink.href = '#main-content';
  }

  if (textRow) {
    skipLink.textContent = textRow.textContent.trim();
    moveInstrumentation(textRow, skipLink);
  } else {
    skipLink.textContent = 'Skip to main content'; // Default text if no text row
  }

  block.textContent = '';
  block.append(skipLink);

  // Check 2: Interactivity - The skip link itself is interactive, but its behavior
  // is handled by the browser's default anchor link navigation. No explicit addEventListener needed.
}
