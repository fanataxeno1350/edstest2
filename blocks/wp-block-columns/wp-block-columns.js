import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add(
    'is-layout-flex',
    'wp-container-core-columns-is-layout-9d6595d7',
    'wp-block-columns-is-layout-flex',
  );

  [...block.children].forEach((row) => {
    const columnDiv = document.createElement('div');
    moveInstrumentation(row, columnDiv);
    columnDiv.classList.add('wp-block-column', 'is-layout-flow', 'wp-block-column-is-layout-flow');

    const columnContent = row.querySelector('div'); // This is the 'items' container cell
    if (columnContent) {
      moveInstrumentation(columnContent, columnDiv);
      while (columnContent.firstChild) {
        const child = columnContent.firstChild;

        if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.tagName === 'P' && child.textContent.trim().startsWith('icon-')) {
            const iconClass = child.textContent.trim();
            const iconEl = document.createElement('i');
            iconEl.classList.add(iconClass);
            iconEl.style.fontSize = '32px';
            iconEl.style.display = 'block';
            iconEl.style.textAlign = 'center';
            columnDiv.append(iconEl);
          } else if (child.querySelector('picture')) {
            const figure = document.createElement('figure');
            figure.classList.add('wp-block-image', 'size-full');
            const picture = child.querySelector('picture');
            if (picture) {
              const img = picture.querySelector('img');
              if (img) {
                const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
                moveInstrumentation(img, optimizedPic.querySelector('img'));
                figure.append(optimizedPic);
              }
            }
            columnDiv.append(figure);
          } else if (child.tagName === 'H1' || child.tagName === 'H2' || child.tagName === 'H3' || child.tagName === 'H4' || child.tagName === 'H5' || child.tagName === 'H6') {
            const heading = document.createElement(child.tagName);
            heading.classList.add('wp-block-heading', 'has-text-align-center');
            moveInstrumentation(child, heading);
            while (child.firstChild) heading.append(child.firstChild);
            columnDiv.append(heading);
          } else if (child.tagName === 'P') {
            const p = document.createElement('p');
            p.classList.add('has-text-align-center');
            moveInstrumentation(child, p);
            while (child.firstChild) p.append(child.firstChild);
            columnDiv.append(p);
          } else {
            columnDiv.append(child);
          }
        } else {
          columnDiv.append(child);
        }
      }
    }
    row.replaceWith(columnDiv);
  });

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
