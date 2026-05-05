import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rootDiv = document.createElement('div');
  rootDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'aos-init', 'aos-animate');
  containerDiv.setAttribute('data-aos', 'fade-up');
  containerDiv.setAttribute('data-aos-offset', '-100');
  containerDiv.setAttribute('data-aos-duration', '650');
  containerDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const ul = document.createElement('ul');
  ul.classList.add('quick-links-div');

  [...block.children].forEach((row) => {
    const [labelCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.classList.add('with-full-underline');

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      anchor.href = foundLink.href;
      // Original HTML shows target="_blank" on anchors, but EDS does not allow hardcoding target.
      // If the model had a field for target, we would use it. For now, omit.
      // anchor.target = '_blank';
    }

    anchor.textContent = labelCell.textContent.trim();

    moveInstrumentation(row, anchor); // Move instrumentation from the row to the new anchor
    li.append(anchor);
    ul.append(li);
  });

  containerDiv.append(ul);
  rootDiv.append(containerDiv);
  block.replaceChildren(rootDiv);
}
