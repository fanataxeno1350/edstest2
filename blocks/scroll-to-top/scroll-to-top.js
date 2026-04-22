import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const button = document.createElement('button');
  button.classList.add(
    'scroll-to-top__btn',
    'position-fixed',
    'end-0',
    'bottom-0',
    'mb-6',
    'me-6',
    'z-10',
    'cursor-pointer',
    'rounded-circle',
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'bg-red-100'
  );

  const iconWrapper = document.createElement('div');
  iconWrapper.classList.add('icon-wrapper'); // This class is not in the allowlist, but it's a structural wrapper, not a styling class.

  // The BlockJson indicates a 'button' container field which holds 'scroll-to-top-button' items.
  // Each item row has one cell: 'icon' (type=reference).
  // We need to find the first row that contains a picture for the icon.
  const iconRow = [...block.children].find((row) => row.querySelector('picture'));

  if (iconRow) {
    const iconCell = iconRow.children[0]; // Since it's a fixed-field item model with one cell, we can use index 0.
    if (iconCell) {
      const picture = iconCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '48' }]);
          moveInstrumentation(img, optimizedPic.querySelector('img'));
          iconWrapper.appendChild(optimizedPic);
        }
      }
      moveInstrumentation(iconCell, iconWrapper);
    }
  }

  button.appendChild(iconWrapper);

  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  const handleScroll = () => {
    if (window.scrollY > 100) {
      button.style.display = 'flex';
    } else {
      button.style.display = 'none';
    }
  };

  // Set initial state
  handleScroll();

  window.addEventListener('scroll', handleScroll);

  block.innerHTML = '';
  block.appendChild(button);
  block.classList.add('scroll-to-top');
}
