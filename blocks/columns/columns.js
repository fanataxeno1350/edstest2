import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const cols = [...block.children];
  block.innerHTML = '';

  const columnsContainer = document.createElement('div');
  columnsContainer.classList.add('columns-container');

  cols.forEach((col, index) => {
    const columnWrapper = document.createElement('div');
    columnWrapper.classList.add('column');
    columnWrapper.dataset.aueModel = 'column';

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('column-content');
    contentDiv.dataset.aueProp = 'text';

    // Move all children of the original column into the new contentDiv
    while (col.firstChild) {
      contentDiv.append(col.firstChild);
    }

    columnWrapper.append(contentDiv);
    columnsContainer.append(columnWrapper);
    moveInstrumentation(col, columnWrapper);
  });

  block.append(columnsContainer);
}