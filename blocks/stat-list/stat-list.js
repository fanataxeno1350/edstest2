import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row, index) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    li.classList.add('first:[&>div]:pt-0', 'theme-dark:border-stroke-light/10', 'grid-full', 'items-center', 'gap-grid-gutter');

    const divWrapper = document.createElement('div');
    divWrapper.classList.add('py-lg', 'border-b', 'border-stroke-medium', 'flex', 'flex-col', 'md:grid-centered-12', 'md:grid', 'md:grid-cols-12', 'gap-grid-gutter');

    const valueLabelContainer = document.createElement('div');
    valueLabelContainer.classList.add('col-span-1', 'md:col-span-7', 'flex', 'items-center', 'gap-grid-gutter');

    const h3 = document.createElement('h3');
    h3.classList.add('font-semibold', 'inline', 'text-h2');

    const descriptionContainer = document.createElement('div');
    descriptionContainer.classList.add('col-span-1', 'md:col-span-5');

    const cells = [...row.children];
    cells.forEach((cell, cellIndex) => {
      if (cellIndex === 0) { // Value
        const spanValue = document.createElement('span');
        spanValue.classList.add('text-foreground-colored', 'theme-dark:text-foreground-colored-light', 'theme-medium:text-foreground-tm');
        moveInstrumentation(cell, spanValue);
        while (cell.firstChild) spanValue.append(cell.firstChild);
        h3.append(spanValue);
      } else if (cellIndex === 1) { // Label
        const spanLabel = document.createElement('span');
        spanLabel.classList.add('text-foreground-colored-strong', 'theme-dark:text-foreground-colored-muted', 'theme-medium:text-foreground-muted');
        moveInstrumentation(cell, spanLabel);
        while (cell.firstChild) spanLabel.append(cell.firstChild);
        h3.append(spanLabel);
      } else if (cellIndex === 2) { // Description
        const descriptionDiv = document.createElement('div');
        descriptionDiv.classList.add('text-p1', 'prose', 'theme-dark:prose-td', 'theme-medium:prose-p:text-foreground-strong', 'theme-dark:text-foreground-td');
        moveInstrumentation(cell, descriptionDiv);
        while (cell.firstChild) descriptionDiv.append(cell.firstChild);
        descriptionContainer.append(descriptionDiv);
      }
    });

    valueLabelContainer.append(h3);
    divWrapper.append(valueLabelContainer, descriptionContainer);
    li.append(divWrapper);
    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
