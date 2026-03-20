import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('header');
  wrapper.classList.add('header-experiencefragment', 'header-aem-GridColumn', 'header-aem-GridColumn--default--12');

  [...block.children].forEach((row) => {
    const item = document.createElement('div');
    moveInstrumentation(row, item);
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
      if (div.querySelector('a')) {
      } else {
      }
    });
    wrapper.append(item);
  });

  block.textContent = '';
  block.append(wrapper);
}
