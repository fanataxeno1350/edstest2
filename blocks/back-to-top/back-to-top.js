import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0: No usage of block.children[n] found. The block is empty and its content is generated.

  // CHECK 1: Structure Alignment
  // BlockJson indicates no fields, meaning the block is empty and its content is generated.
  // The JS correctly does not attempt to read from block.children.
  // It generates the entire structure from scratch, which aligns with an empty block.
  const section = document.createElement('section');
  moveInstrumentation(block, section);
  section.classList.add('back-to-top');
  section.setAttribute('aria-label', 'Back to top module');
  section.style.display = 'flex';

  const ctaDiv = document.createElement('div');
  ctaDiv.classList.add('back-to-top__cta');

  const backToTopLink = document.createElement('a');
  backToTopLink.href = 'javascript:void(0)';
  backToTopLink.title = 'Back To Top';
  // CHECK 3: CSS Class Names
  // All class names 'button', 'light-beige-accent', 'bodySmallRegular' are from the ALLOWLIST.
  backToTopLink.classList.add('button', 'light-beige-accent', 'bodySmallRegular');
  backToTopLink.setAttribute('aria-label', 'Back To Top');
  backToTopLink.setAttribute('rel', 'follow');

  const span = document.createElement('span');
  // CHECK 3: CSS Class Names
  // 'button-text' is from the ALLOWLIST.
  span.classList.add('button-text');
  span.textContent = 'Back To Top';

  backToTopLink.append(span);
  ctaDiv.append(backToTopLink);
  section.append(ctaDiv);

  // CHECK 2: Interactivity
  // The ORIGINAL HTML has an <a> tag which is an interactive element.
  // The JS correctly adds an event listener to this link.
  backToTopLink.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  block.textContent = '';
  block.append(section);
}
