import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use content detection instead of implicit index access
  const rows = [...block.children];
  const messageRow = rows.find(row => row.querySelector('p') && !row.querySelector('a'));
  const linkRow = rows.find(row => row.querySelector('a'));
  const buttonLabelRow = rows.find(row => !row.querySelector('p') && !row.querySelector('a'));

  const messageDiv = messageRow ? messageRow.firstElementChild : null;
  const linkEl = linkRow ? linkRow.querySelector('a') : null;
  const buttonLabelText = buttonLabelRow ? buttonLabelRow.textContent.trim() : '';

  const wrapper = document.createElement('div');
  wrapper.classList.add('header-message', '-information', '-with-button');
  wrapper.id = 'cookie-message';

  if (messageDiv) {
    moveInstrumentation(messageRow, messageDiv);
    wrapper.append(messageDiv);
  }

  if (linkEl) {
    const p = messageDiv ? messageDiv.querySelector('p') : null;
    if (p) {
      moveInstrumentation(linkRow, linkEl);
      p.append(linkEl);
    } else if (messageDiv) {
      const newP = document.createElement('p');
      moveInstrumentation(linkRow, newP);
      newP.append(linkEl);
      messageDiv.append(newP);
    }
  }

  const closeButton = document.createElement('button');
  closeButton.classList.add('header-message-button');
  closeButton.id = 'cookie_close';
  if (buttonLabelRow) {
    moveInstrumentation(buttonLabelRow, closeButton);
  }
  closeButton.textContent = buttonLabelText;

  closeButton.addEventListener('click', () => {
    wrapper.remove();
  });

  wrapper.append(closeButton);

  block.textContent = '';
  block.append(wrapper);
}
