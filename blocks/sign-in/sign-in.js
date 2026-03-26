import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const userDropdown = document.createElement('div');
  userDropdown.classList.add('user__dropdown');

  const userAccount = document.createElement('div');
  userAccount.classList.add('user__account');
  userDropdown.append(userAccount);

  // The first row is the container field "userAccountLinks", which we can ignore as items are flat.
  // Subsequent rows are "user-account-link" items.
  const itemRows = [...block.children].slice(1);

  itemRows.forEach((row) => {
    // BlockJson for 'user-account-link' defines 4 fields: icon, link, label, buttonText.
    // So, each item row must have exactly 4 cells.
    const [iconCell, linkCell, labelCell, buttonTextCell] = [...row.children];

    const linkElement = linkCell.querySelector('a');
    const labelText = labelCell.textContent.trim();
    const buttonText = buttonTextCell.textContent.trim();
    const iconPicture = iconCell.querySelector('picture');

    // Determine item type based on content presence
    if (linkElement && labelText && iconPicture) {
      // This is a standard user account link
      const userAccountLink = document.createElement('a');
      moveInstrumentation(row, userAccountLink);
      userAccountLink.classList.add('user__account--link');
      userAccountLink.href = linkElement.href;

      // Check for specific classes based on label text (from original HTML)
      if (labelText.toLowerCase().includes('reach us')) {
        userAccountLink.classList.add('reach', 'us');
      } else if (labelText.toLowerCase().includes('profile')) {
        userAccountLink.classList.add('profile');
      }

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('user__account__list-icon');
      iconSpan.append(iconPicture);
      userAccountLink.append(iconSpan);

      const labelTextNode = document.createTextNode(labelText);
      userAccountLink.append(labelTextNode);

      userAccount.append(userAccountLink);
    } else if (buttonText && iconPicture) {
      // This is the sign-in button variant
      const signInDiv = document.createElement('div');
      moveInstrumentation(row, signInDiv);
      signInDiv.classList.add('user__account--link', 'sign-in-btn');

      const iconSpan = document.createElement('span');
      iconSpan.classList.add('user__account__list-icon');
      iconSpan.append(iconPicture);
      signInDiv.append(iconSpan);

      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = buttonText;
      // Add event listener for the sign-in button
      button.addEventListener('click', () => {
        // Implement sign-in/sign-out logic here
        // For example, toggle a class or dispatch a custom event
        console.log('Sign In/Out button clicked!');
        // Example: button.classList.toggle('signed-in');
      });

      signInDiv.append(button);
      userAccount.append(signInDiv);
    }
  });

  userAccount.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(userDropdown);
}
