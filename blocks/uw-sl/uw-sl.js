import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('uw-sl');
  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Quick Accessibility Options');
  block.setAttribute('data-uw-rm-ignore', 'true');
  block.setAttribute('data-uw-ignore-translate', 'true');

  [...block.children].forEach((row, index) => {
    const button = document.createElement('button');
    moveInstrumentation(row, button);
    button.classList.add('uw-sl__item');
    button.setAttribute('data-uw-rm-ignore', 'true');
    button.setAttribute('data-uw-ignore-translate', 'true');
    button.setAttribute('lang', 'en-US');

    // Assign unique IDs based on index, matching original HTML pattern
    if (index === 0) {
      button.id = 'uw-skip-to-main';
    } else if (index === 1) {
      button.id = 'uw-enable-visibility';
    } else if (index === 2) {
      button.id = 'uw-open-accessibility';
    }

    const itemLeft = document.createElement('span');
    itemLeft.classList.add('uw-sl__item__left');
    itemLeft.setAttribute('data-uw-ignore-translate', 'true');

    const itemRightIcon = document.createElement('span');
    itemRightIcon.classList.add('uw-sl__e-icon');

    const cells = [...row.children];

    // Content detection for cells
    const imgLeftCell = cells.find(cell => cell.querySelector('picture') && cell.nextElementSibling?.querySelector('span.uw-sl__item__title') === undefined);
    const titleCell = cells.find(cell => !cell.querySelector('picture') && cell.textContent.trim() !== '');
    const imgRightCell = cells.find(cell => cell.querySelector('picture') && cell.previousElementSibling?.querySelector('span.uw-sl__item__title') !== undefined);

    if (imgLeftCell) {
      const imgWrapper = document.createElement('span');
      imgWrapper.classList.add('uw-sl__item__img');
      moveInstrumentation(imgLeftCell, imgWrapper);
      while (imgLeftCell.firstChild) imgWrapper.append(imgLeftCell.firstChild);
      itemLeft.append(imgWrapper);
    }

    if (titleCell) {
      const titleSpan = document.createElement('span');
      titleSpan.classList.add('uw-sl__item__title');
      titleSpan.setAttribute('data-uw-ignore-s17', '');
      titleSpan.setAttribute('data-uw-rm-ignore', 'true');
      titleSpan.setAttribute('data-uw-ignore-translate', 'true');
      moveInstrumentation(titleCell, titleSpan);
      while (titleCell.firstChild) titleSpan.append(titleCell.firstChild);
      itemLeft.append(titleSpan);
    }

    if (imgRightCell) {
      moveInstrumentation(imgRightCell, itemRightIcon);
      while (imgRightCell.firstChild) itemRightIcon.append(imgRightCell.firstChild);
    }

    button.append(itemLeft, itemRightIcon);
    row.replaceWith(button);

    // Add event listeners for interactive buttons
    button.addEventListener('click', () => {
      // Placeholder for button click logic
      // In a real scenario, this would trigger specific accessibility features
      // console.log(`Button with ID ${button.id} clicked!`);
      if (button.id === 'uw-skip-to-main') {
        // Example: Scroll to main content area
        const mainContent = document.querySelector('main');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (button.id === 'uw-enable-visibility') {
        // Example: Toggle a class for low vision accessibility
        document.body.classList.toggle('uw-low-vision-mode');
      } else if (button.id === 'uw-open-accessibility') {
        // Example: Open an accessibility menu/modal
        const accessibilityMenu = document.getElementById('accessibility-menu'); // Assuming an existing menu
        if (accessibilityMenu) {
          accessibilityMenu.classList.toggle('is-open');
          accessibilityMenu.setAttribute('aria-hidden', accessibilityMenu.classList.contains('is-open') ? 'false' : 'true');
        }
      }
    });
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
