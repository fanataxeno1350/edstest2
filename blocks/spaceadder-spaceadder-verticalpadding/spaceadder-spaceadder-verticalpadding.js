import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const section = document.createElement('section');
  const verticalPaddingProp = block.querySelector('[data-aue-prop="verticalPadding"]');
  let paddingValue = 0;

  if (verticalPaddingProp) {
    paddingValue = parseInt(verticalPaddingProp.textContent.trim(), 10);
    moveInstrumentation(verticalPaddingProp, section);
  } else {
    // Fallback if data-aue-prop is not found, try to get from existing class
    const existingSection = block.querySelector('section.spaceadder-spaceAdder-verticalPadding_section');
    if (existingSection) {
      const paddingClass = Array.from(existingSection.classList).find(cls => cls.startsWith('spaceadder-padding-'));
      if (paddingClass) {
        paddingValue = parseInt(paddingClass.replace('spaceadder-padding-', ''), 10);
      }
    }
  }

  if (paddingValue > 0) {
    section.classList.add('spaceadder-spaceAdder-verticalPadding_section', `spaceadder-padding-${paddingValue}`);
  } else {
    // Default padding if no value is found or it's 0
    section.classList.add('spaceadder-spaceAdder-verticalPadding_section', 'spaceadder-padding-80');
  }

  block.textContent = '';
  block.append(section);
  block.className = 'spaceadder-spaceAdder-VerticalPadding block';
  block.dataset.blockStatus = 'loaded';
}
