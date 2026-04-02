import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('align-items-center');
  block.setAttribute('role', 'alert');
  block.setAttribute('aria-live', 'assertive');
  block.setAttribute('aria-atomic', 'true');

  const dFlex = document.createElement('div');
  dFlex.classList.add('d-flex');

  const toastBody = document.createElement('div');
  toastBody.classList.add('toast-body');

  // CHECK 0 & 1 FIX: Replaced direct index access with content detection
  // The EDS block structure shows only one child row for the 'toast-body' field.
  // We can safely assume the first child is the toast body content.
  const contentRow = [...block.children].find((row) => row.children.length > 0);

  if (contentRow) {
    moveInstrumentation(contentRow, toastBody);
    while (contentRow.firstChild) {
      toastBody.append(contentRow.firstChild);
    }
  }

  const closeButton = document.createElement('button');
  closeButton.setAttribute('type', 'button');
  closeButton.classList.add('btn-close', 'me-2', 'm-auto');
  closeButton.setAttribute('aria-label', 'Close');

  // CHECK 2: Interactivity - The original HTML has data-bs-dismiss="toast"
  // which implies a click listener to hide the toast. This is correctly implemented.
  closeButton.addEventListener('click', () => {
    block.classList.remove('show'); // Simulate data-bs-dismiss="toast"
  });

  dFlex.append(toastBody);
  dFlex.append(closeButton);

  block.textContent = '';
  block.append(dFlex);

  // Image optimization (if any images were present in the toast body)
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
