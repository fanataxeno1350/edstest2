import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('button-button', 'button-cmp-button--primary-anchor');

  [...block.children].forEach((row) => {
    const item = document.createElement('a');
    moveInstrumentation(row, item);
    item.classList.add('button-cmp-button');
    while (row.firstElementChild) item.append(row.firstElementChild);
    [...item.children].forEach((div) => {
    });
    wrapper.append(item);
  });

  block.textContent = '';
  block.append(wrapper);
}
