import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cols = [...block.children];
  block.innerHTML = '';
  const numCols = cols.length;

  const columnsWrapper = document.createElement('div');
  columnsWrapper.classList.add('columns-wrapper');
  columnsWrapper.classList.add(`columns-${numCols}-cols`);

  cols.forEach((col) => {
    const columnDiv = document.createElement('div');
    columnDiv.classList.add('column');

    // Extract content from the authored column div
    const content = col.querySelector('[data-aue-prop="content"]') || col.querySelector('p');

    if (content) {
      // Move all children of the authored column into the new columnDiv
      while (col.firstChild) {
        const child = col.firstChild;
        columnDiv.append(child);
        moveInstrumentation(child, columnDiv);
      }
    } else {
      // If no specific content prop, move all children directly
      while (col.firstChild) {
        const child = col.firstChild;
        columnDiv.append(child);
        moveInstrumentation(child, columnDiv);
      }
    }

    moveInstrumentation(col, columnDiv);
    columnsWrapper.append(columnDiv);
  });

  block.append(columnsWrapper);

  // Ensure the block has the correct class and status
  block.className = `columns block columns-${numCols}-cols`;
  block.dataset.blockStatus = 'loaded';
}
