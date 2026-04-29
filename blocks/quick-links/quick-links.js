import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const quickLinksParentDiv = document.createElement('div');
  quickLinksParentDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'aos-init', 'aos-animate');
  containerDiv.setAttribute('data-aos', 'fade-up');
  containerDiv.setAttribute('data-aos-offset', '-100');
  containerDiv.setAttribute('data-aos-duration', '650');
  containerDiv.setAttribute('data-aos-easing', 'ease-in-out');

  const ul = document.createElement('ul');
  ul.classList.add('quick-links-div');

  [...block.children].forEach((row) => {
    const [linkCell, labelCell] = [...row.children];

    const li = document.createElement('li');
    const a = document.createElement('a');

    // The link cell is of type 'aem-content', so its textContent is the JCR path.
    // The actual link href is inside an <a> tag within the cell.
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      a.href = foundLink.href;
      // The original HTML shows target="_blank", so we add it.
      a.target = '_blank';
    }
    a.classList.add('with-full-underline');
    a.textContent = labelCell.textContent.trim(); // labelCell is type 'text', so textContent is correct

    moveInstrumentation(row, li);
    li.append(a);
    ul.append(li);
  });

  containerDiv.append(ul);
  quickLinksParentDiv.append(containerDiv);
  block.replaceChildren(quickLinksParentDiv);
}
