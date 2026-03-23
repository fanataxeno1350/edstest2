import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  section.classList.add('spaceadder-spaceAdder-verticalPadding_section');

  const verticalPadding = block.querySelector('[data-aue-prop="verticalPadding"]');
  if (verticalPadding) {
    const paddingValue = parseInt(verticalPadding.textContent, 10);
    if (!isNaN(paddingValue)) {
      section.classList.add(`spaceadder-spaceAdder-padding-${paddingValue}`);
    }
    moveInstrumentation(verticalPadding, section);
  }

  block.textContent = '';
  block.append(section);
  block.className = `spaceadder-spaceAdder spaceadder-aem-GridColumn spaceadder-aem-GridColumn--default--12 block`;
  block.dataset.blockStatus = 'loaded';
}
