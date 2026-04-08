import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [mainImageRow, userImageRow, messageRow] = [...block.children];

  // Create main container
  const toasterContainer = document.createElement('div');
  toasterContainer.classList.add('toaster--container');

  // Main Image
  const mainImageCell = [...mainImageRow.children].find(cell => cell.querySelector('picture'));
  if (mainImageCell) {
    const mainPicture = mainImageCell.querySelector('picture');
    if (mainPicture) {
      const img = mainPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        toasterContainer.append(optimizedPic);
      }
    }
  }

  // Inner container
  const toasterContainerInner = document.createElement('div');
  toasterContainerInner.classList.add('toaster--container-inner');

  // Message Wrapper
  const toasterMessageWrapper = document.createElement('div');
  toasterMessageWrapper.classList.add('toaster--message-wrapper');

  // User Image
  const toasterUser = document.createElement('div');
  toasterUser.classList.add('toaster--user');
  const userImageCell = [...userImageRow.children].find(cell => cell.querySelector('picture'));
  if (userImageCell) {
    const userPicture = userImageCell.querySelector('picture');
    if (userPicture) {
      const img = userPicture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        toasterUser.append(optimizedPic);
      }
    }
  }
  toasterMessageWrapper.append(toasterUser);

  // User Message
  const toasterUserMessage = document.createElement('div');
  toasterUserMessage.classList.add('toaster--user-message', 'bodySmallRegular');
  const messageCell = [...messageRow.children].find(cell => cell.textContent.trim());
  if (messageCell) {
    moveInstrumentation(messageCell, toasterUserMessage);
    while (messageCell.firstChild) {
      toasterUserMessage.append(messageCell.firstChild);
    }
  }
  toasterMessageWrapper.append(toasterUserMessage);

  toasterContainerInner.append(toasterMessageWrapper);

  // Close button
  const toasterClose = document.createElement('div');
  toasterClose.classList.add('toaster--close');
  const closeButton = document.createElement('button');
  closeButton.setAttribute('type', 'button');
  closeButton.classList.add('icon', 'cross-icon-black', 'toaster--close-btn', 'js-close-toaster');
  closeButton.setAttribute('aria-label', 'Close tooltip');
  toasterClose.append(closeButton);
  toasterContainerInner.append(toasterClose);

  toasterContainer.append(toasterContainerInner);

  // Overlay
  const toasterOverlay = document.createElement('div');
  toasterOverlay.classList.add('toaster--overlay', 'js-close-toaster');

  // Add event listeners for closing
  const closeToaster = () => {
    block.classList.remove('show');
  };
  toasterOverlay.addEventListener('click', closeToaster);
  closeButton.addEventListener('click', closeToaster);

  block.textContent = '';
  block.classList.add('toaster', 'toaster-signin'); // Add base classes to the block itself
  block.setAttribute('aria-label', 'Toaster Signin Module');
  block.append(toasterOverlay, toasterContainer);
}
