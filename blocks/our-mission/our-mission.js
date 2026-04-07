import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('theme-light', 'theme-bg', 'theme-section-spacing', 'first:not-is-themed:mt-component');

  const container = document.createElement('div');
  container.classList.add('container');
  section.append(container);

  const gridFull = document.createElement('div');
  gridFull.classList.add('grid-full');
  container.append(gridFull);

  const gridCentered = document.createElement('div');
  gridCentered.classList.add('grid-centered-12', 'grid', 'grid-cols-subgrid', 'gap-grid-gutter');
  gridFull.append(gridCentered);

  const headingWrapper = document.createElement('div');
  headingWrapper.classList.add('sm:col-span-14', 'md:col-span-12', 'xl:col-span-10');
  gridCentered.append(headingWrapper);

  const [headingRow] = [...block.children];
  const headingCell = headingRow.firstElementChild;

  if (headingCell) {
    const h2 = document.createElement('h2');
    h2.classList.add('text-h2', 'theme-dark:text-foreground-td', 'theme-medium:text-foreground-tm', 'text-foreground', 'text-pretty');
    moveInstrumentation(headingCell, h2);

    // The original HTML has a span inside the h2 for the muted text.
    // We need to parse the content of the headingCell to replicate this structure.
    const paragraph = headingCell.querySelector('p');
    if (paragraph) {
      // Find the text node that contains "Our mission" and the span that contains " is to build..."
      const originalText = paragraph.textContent;
      const spanContent = ' is to build a future in which people live in harmony with nature';
      
      if (originalText.includes(spanContent)) {
        const strongTextContent = originalText.replace(spanContent, '');
        h2.append(document.createTextNode(strongTextContent));

        const span = document.createElement('span');
        span.classList.add('theme-dark:text-foreground-colored-muted', 'text-foreground-muted');
        span.textContent = spanContent;
        h2.append(span);
      } else {
        // If the span content isn't found, just append the whole paragraph text
        h2.textContent = originalText;
      }
    }
    headingWrapper.append(h2);
  }

  block.textContent = '';
  block.append(section);
}
