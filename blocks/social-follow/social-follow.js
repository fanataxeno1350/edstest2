import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [textRow, ctaRow] = [...block.children];

  const container = document.createElement('div');
  container.classList.add('container', 'responsivegrid', 'top-lg-margin', 'bottom-lg-margin');

  const cmpContainer = document.createElement('div');
  cmpContainer.classList.add('cmp-container');
  container.append(cmpContainer);

  // Text content
  const textDiv = document.createElement('div');
  textDiv.classList.add('text');
  const cmpTextDiv = document.createElement('div');
  cmpTextDiv.classList.add('cmp-text');
  // Use firstElementChild to get the div containing the richtext content
  moveInstrumentation(textRow.firstElementChild, cmpTextDiv);
  while (textRow.firstElementChild.firstChild) {
    cmpTextDiv.append(textRow.firstElementChild.firstChild);
  }
  textDiv.append(cmpTextDiv);
  cmpContainer.append(textDiv);

  // CTA Link
  const buttonDiv = document.createElement('div');
  buttonDiv.classList.add('button', 'cmp-button--primary-anchor', 'cmp-container--center-align');

  // Access the anchor tag directly from the ctaRow's first child element
  const ctaLink = ctaRow.firstElementChild?.querySelector('a');
  if (ctaLink) {
    const button = document.createElement('a');
    button.classList.add('cmp-button'); // Class name from original HTML
    button.href = ctaLink.href;
    moveInstrumentation(ctaLink, button); // Move instrumentation from original ctaLink to new button

    const span = document.createElement('span');
    span.classList.add('cmp-button__text'); // Class name from original HTML
    span.textContent = ctaLink.textContent;
    button.append(span);
    buttonDiv.append(button);
  }
  cmpContainer.append(buttonDiv);

  block.textContent = '';
  block.append(container);
}
