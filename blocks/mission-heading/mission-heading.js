import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [headingRow] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container');

  const gridFull = document.createElement('div');
  gridFull.classList.add('grid-full');

  const gridCentered = document.createElement('div');
  gridCentered.classList.add('grid-centered-12', 'grid', 'grid-cols-subgrid', 'gap-grid-gutter');

  const colSpanDiv = document.createElement('div');
  colSpanDiv.classList.add('sm:col-span-14', 'md:col-span-12', 'xl:col-span-10');

  const headingElement = headingRow.querySelector('h1, h2, h3, h4, h5, h6, p');
  if (headingElement) {
    const h2 = document.createElement('h2');
    h2.classList.add('text-h2', 'theme-dark:text-foreground-td', 'theme-medium:text-foreground-tm', 'text-foreground', 'text-pretty');
    moveInstrumentation(headingElement, h2);

    // Append all child nodes from the original heading element to the new h2
    while (headingElement.firstChild) {
      h2.append(headingElement.firstChild);
    }

    // Check if the heading contains a span for muted text
    const span = h2.querySelector('span');
    if (span) {
      span.classList.add('theme-dark:text-foreground-colored-muted', 'text-foreground-muted');
    }

    colSpanDiv.append(h2);
  }

  gridCentered.append(colSpanDiv);
  gridFull.append(gridCentered);
  container.append(gridFull);

  block.textContent = '';
  block.append(container);

  // Apply section classes to the block itself
  block.classList.add('theme-light', 'theme-bg', 'theme-section-spacing', 'first:not-is-themed:mt-component');
}
