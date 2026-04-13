import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'aos-init', 'aos-animate');
  containerDiv.setAttribute('data-aos', 'fade-up');
  containerDiv.setAttribute('data-aos-offset', '-100');
  containerDiv.setAttribute('data-aos-duration', '650');
  containerDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const ul = document.createElement('ul');
  ul.classList.add('quick-links-div');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    // Content detection for the link cell
    const linkCell = [...row.children].find((cell) => cell.querySelector('a'));
    if (linkCell) {
      const originalLink = linkCell.querySelector('a');
      const newLink = document.createElement('a');
      newLink.href = originalLink.href;
      newLink.textContent = originalLink.textContent;
      // Copy target attribute if present
      if (originalLink.target) {
        newLink.target = originalLink.target;
      }
      newLink.classList.add('with-full-underline');
      li.append(newLink);
    }
    ul.append(li);
  });

  containerDiv.append(ul);

  const parentDiv = document.createElement('div');
  parentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');
  parentDiv.append(containerDiv);

  block.textContent = '';
  block.append(parentDiv);
}
