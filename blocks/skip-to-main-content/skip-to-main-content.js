import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Check 0 & 1: Replaced block.children[0] with content detection
  const cells = [...block.children[0].children];
  const linkCell = cells.find((cell) => cell.querySelector('a'));
  const foundLink = linkCell ? linkCell.querySelector('a') : null;

  const skipLink = document.createElement('a');
  skipLink.classList.add('z-99', 'fixed', 'top-[-1000px]', 'inset-[auto]', 'p-4', 'border-primary', 'border', 'rounded-md', 'font-bold', 'focus:top-6', 'focus:left-6', 'bg-brand-1', 'text-white', 'theme-focus-outline');

  if (foundLink) {
    skipLink.href = foundLink.href;
    moveInstrumentation(foundLink, skipLink);
    skipLink.textContent = foundLink.textContent;
  } else {
    // Fallback if no link is provided, or if the structure is unexpected
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
  }

  block.textContent = '';
  block.append(skipLink);
}
