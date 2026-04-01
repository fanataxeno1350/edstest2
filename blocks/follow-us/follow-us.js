import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [contentRow, linkRow] = [...block.children];

  const textDiv = document.createElement('div');
  // Class name 'text' is correct based on ORIGINAL HTML
  textDiv.classList.add('text');
  const cmpTextDiv = document.createElement('div');
  // Class name 'cmp-text' is correct based on ORIGINAL HTML
  cmpTextDiv.classList.add('cmp-text');
  moveInstrumentation(contentRow, cmpTextDiv);
  while (contentRow.firstChild) {
    cmpTextDiv.append(contentRow.firstChild);
  }
  textDiv.append(cmpTextDiv);

  const buttonDiv = document.createElement('div');
  // Class names 'button', 'cmp-button--primary-anchor', 'cmp-container--center-align' are correct based on ORIGINAL HTML
  buttonDiv.classList.add('button', 'cmp-button--primary-anchor', 'cmp-container--center-align');

  const foundLink = linkRow.querySelector('a');
  const linkEl = document.createElement('a');
  // Class name 'cmp-button' is correct based on ORIGINAL HTML
  linkEl.classList.add('cmp-button');
  if (foundLink) {
    linkEl.href = foundLink.href;
    // Copy data attribute from original HTML
    if (foundLink.hasAttribute('data-request')) {
      linkEl.setAttribute('data-request', foundLink.getAttribute('data-request'));
    }
    const span = document.createElement('span');
    // Class name 'cmp-button__text' is correct based on ORIGINAL HTML
    span.classList.add('cmp-button__text');
    span.textContent = foundLink.textContent;
    linkEl.append(span);
  }
  moveInstrumentation(linkRow, linkEl);
  buttonDiv.append(linkEl);

  block.textContent = '';
  block.append(textDiv, buttonDiv);

  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
