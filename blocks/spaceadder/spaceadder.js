import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const verticalPadding = block.querySelector('[data-aue-prop="verticalPadding"]');
  const paddingValue = verticalPadding ? `padding-${verticalPadding.textContent}` : 'padding-80';

  const section = document.createElement('section');
  section.classList.add('spaceadder-spaceAdder-verticalPadding_section', paddingValue);

  if (verticalPadding) {
    moveInstrumentation(verticalPadding, section);
  }

  block.textContent = '';
  block.append(section);
  block.className = `spaceadder-spaceAdder-spaceAdder spaceadder-aem-GridColumn spaceadder-aem-GridColumn--default--12 ${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}