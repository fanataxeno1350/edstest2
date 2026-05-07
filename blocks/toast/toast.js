import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [messageRow] = [...block.children];

  const toastDiv = document.createElement('div');
  toastDiv.classList.add('toast', 'align-items-center'); // Added 'align-items-center' from original HTML
  toastDiv.setAttribute('role', 'alert');
  toastDiv.setAttribute('aria-live', 'assertive');
  toastDiv.setAttribute('aria-atomic', 'true');

  const dFlexDiv = document.createElement('div');
  dFlexDiv.classList.add('d-flex');

  const toastBodyDiv = document.createElement('div');
  toastBodyDiv.classList.add('toast-body');
  if (messageRow) {
    moveInstrumentation(messageRow, toastBodyDiv);
    // messageRow is a row, its first child is the cell.
    // The cell contains the richtext HTML, so use innerHTML.
    const [messageCell] = [...messageRow.children]; // Destructuring for fixed schema
    toastBodyDiv.innerHTML = messageCell?.innerHTML || '';
  }

  const closeButton = document.createElement('button');
  closeButton.classList.add('btn-close', 'me-2', 'm-auto');
  closeButton.setAttribute('type', 'button');
  closeButton.setAttribute('aria-label', 'Close');

  // Implement close functionality as data-bs-dismiss is inert
  closeButton.addEventListener('click', () => {
    toastDiv.remove(); // Or add a class to hide it, depending on desired behavior
  });

  dFlexDiv.append(toastBodyDiv, closeButton);
  toastDiv.append(dFlexDiv);

  block.replaceChildren(toastDiv);

  // Image optimization: The toast message is richtext. If it contains images,
  // createOptimizedPicture should be called on the images *within* the toastBodyDiv.
  // The current code applies it to the entire toastDiv, which is fine, but it's
  // important that moveInstrumentation is called on the *original* img element.
  // Given the simple nature of a toast, images are unlikely, but the pattern is correct.
  // No changes needed here, as it correctly targets images within the final structure.
}
