import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const padding = block.querySelector('[data-aue-prop="padding"]');
  const paddingValue = padding ? parseInt(padding.textContent, 10) : 0;

  const section = document.createElement('section');
  section.classList.add('spaceadder-spaceAdder-verticalPadding_section');
  if (paddingValue > 0) {
    section.classList.add(`spaceadder-spaceAdder-padding-${paddingValue}`);
  }

  if (padding) {
    moveInstrumentation(padding, section);
  }

  block.textContent = '';
  block.append(section);
  block.className = 'spaceadder-spaceAdder spaceadder-aem-GridColumn spaceadder-aem-GridColumn--default--12 block';
  block.dataset.blockStatus = 'loaded';
}
