import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [messageRow] = [...block.children];

  const toastDiv = document.createElement('div');
  toastDiv.classList.add('toast', 'align-items-center');
  toastDiv.setAttribute('role', 'alert');
  toastDiv.setAttribute('aria-live', 'assertive');
  toastDiv.setAttribute('aria-atomic', 'true');

  const dFlexDiv = document.createElement('div');
  dFlexDiv.classList.add('d-flex');

  const toastBodyDiv = document.createElement('div');
  toastBodyDiv.classList.add('toast-body');

  // Read message from the messageRow's first cell (the only cell)
  const messageCell = messageRow?.firstElementChild;
  if (messageCell) {
    moveInstrumentation(messageRow, toastBodyDiv);
    toastBodyDiv.textContent = messageCell.textContent.trim();
  }

  const closeButton = document.createElement('button');
  closeButton.setAttribute('type', 'button');
  closeButton.classList.add('btn-close', 'me-2', 'm-auto');
  closeButton.setAttribute('data-bs-dismiss', 'toast'); // Added from ORIGINAL HTML
  closeButton.setAttribute('aria-label', 'Close');

  // Add event listener for closing the toast
  closeButton.addEventListener('click', () => {
    toastDiv.classList.remove('show');
    toastDiv.setAttribute('aria-hidden', 'true');
  });

  dFlexDiv.append(toastBodyDiv, closeButton);
  toastDiv.append(dFlexDiv);

  block.replaceChildren(toastDiv);

  // Example of how to show the toast (can be triggered by other events)
  // For demonstration, we'll show it immediately. In a real scenario,
  // this might be triggered by a form submission, page load, etc.
  setTimeout(() => {
    toastDiv.classList.add('show');
    toastDiv.setAttribute('aria-hidden', 'false');
  }, 100);
}
