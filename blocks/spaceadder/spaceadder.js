import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('spaceadder-spaceAdder', 'spaceadder-aem-GridColumn', 'spaceadder-aem-GridColumn--default--12');

  [...block.children].forEach((row) => {
    const section = document.createElement('section');
    moveInstrumentation(row, section);
    section.classList.add('spaceadder-spaceAdder-verticalPadding_section', 'spaceadder-spaceAdder-padding-80');
    while (row.firstElementChild) section.append(row.firstElementChild);
    [...section.children].forEach((div) => {
    });
    wrapper.append(section);
  });

  block.textContent = '';
  block.append(wrapper);
}
