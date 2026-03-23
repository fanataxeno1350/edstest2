import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const verticalPadding = block.querySelector('[data-aue-prop="verticalPadding"]');
  const paddingValue = verticalPadding ? parseInt(verticalPadding.textContent, 10) : 0;

  const section = document.createElement('section');
  section.className = 'spaceadder-spaceAdder-verticalPadding_section';
  if (paddingValue) {
    section.classList.add(`spaceadder-padding-${paddingValue}`);
  }

  if (verticalPadding) {
    moveInstrumentation(verticalPadding, section);
  }

  block.textContent = '';
  block.append(section);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
