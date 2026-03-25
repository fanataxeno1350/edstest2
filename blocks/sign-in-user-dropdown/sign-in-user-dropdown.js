import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const dropdownDiv = document.createElement('div');
  dropdownDiv.classList.add('sign-in-user__dropdown');

  const accountDiv = document.createElement('div');
  accountDiv.classList.add('sign-in-user__account');

  const accountItems = block.querySelectorAll('[data-aue-model="signInUserAccount"]');

  accountItems.forEach((itemNode) => {
    const linkElement = itemNode.querySelector('[data-aue-prop="link"]');
    const iconElement = itemNode.querySelector('[data-aue-prop="icon"]');
    const textElement = itemNode.querySelector('[data-aue-prop="text"]');

    if (linkElement && linkElement.tagName === 'A') {
      const linkWrapper = document.createElement('a');
      linkWrapper.href = linkElement.href;
      if (linkElement.target) {
        linkWrapper.target = linkElement.target;
      }

      // Preserve original classes from the authored link
      linkElement.classList.forEach((cls) => linkWrapper.classList.add(cls));
      linkWrapper.classList.add('sign-in-user__account--link');

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('sign-in-user__account__list-icon');
      if (iconElement && iconElement.tagName === 'IMG') {
        iconSpan.append(createOptimizedPicture(iconElement.src, iconElement.alt));
        moveInstrumentation(iconElement, iconSpan.querySelector('picture'));
      }
      linkWrapper.append(iconSpan);
      moveInstrumentation(iconElement, iconSpan);

      if (textElement) {
        linkWrapper.append(textElement.textContent);
        moveInstrumentation(textElement, linkWrapper);
      } else if (linkElement.textContent) {
        // Fallback for link text if data-aue-prop="text" is not present
        linkWrapper.append(linkElement.textContent.trim());
      }

      accountDiv.append(linkWrapper);
      moveInstrumentation(linkElement, linkWrapper);
      moveInstrumentation(itemNode, linkWrapper);
    } else if (linkElement && linkElement.tagName === 'BUTTON') {
      // Special handling for the sign-in button
      const buttonWrapper = document.createElement('div');
      buttonWrapper.classList.add('sign-in-user__account--link', 'sign-in-btn');

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('sign-in-user__account__list-icon');
      if (iconElement && iconElement.tagName === 'IMG') {
        iconSpan.append(createOptimizedPicture(iconElement.src, iconElement.alt));
        moveInstrumentation(iconElement, iconSpan.querySelector('picture'));
      }
      buttonWrapper.append(iconSpan);
      moveInstrumentation(iconElement, iconSpan);

      const button = document.createElement('button');
      button.type = 'button';
      if (linkElement.dataset.signOutText) {
        button.dataset.signOutText = linkElement.dataset.signOutText;
      }
      button.textContent = linkElement.textContent.trim();
      buttonWrapper.append(button);
      moveInstrumentation(linkElement, button);
      moveInstrumentation(itemNode, buttonWrapper);

      accountDiv.append(buttonWrapper);
    }
  });

  dropdownDiv.append(accountDiv);

  block.textContent = '';
  block.append(dropdownDiv);
  block.classList.add('sign-in-user-dropdown'); // Ensure the main block class is set
  block.dataset.blockStatus = 'loaded';
}
