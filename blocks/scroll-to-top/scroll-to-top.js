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
    'bg-red-100',
  );

  const svg = document.createElement('svg');
  svg.classList.add('icon', 'arrow-up', 'text-white');

  const use = document.createElement('use');
  use.setAttribute('xlink:href', '/content/dam/aemigrate/uploaded-folder/www-aashirvaadsvasti-in/image/sprite-1f1f4c.svg#right-pointing-arrow');
  svg.append(use);
  button.append(svg);

  moveInstrumentation(block, button);
  block.append(button);

  const toggleScrollToTopButton = () => {
    if (window.scrollY > 200) {
      button.style.display = 'flex';
    } else {
      button.style.display = 'none';
    }
  };

  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  window.addEventListener('scroll', toggleScrollToTopButton);
  toggleScrollToTopButton(); // Initial check on page load
}
