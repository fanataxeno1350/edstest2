import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const quickLinksParentsDiv = document.createElement('div');
  quickLinksParentsDiv.classList.add('mt-0', 'pt-1', 'pb-1', 'm-none1', 'bottom-0', 'w-100', 'quick-links-parents-div', 'position-relative');

  const container = document.createElement('div');
  container.classList.add('container', 'aos-init', 'aos-animate');
  container.setAttribute('data-aos', 'fade-up');
  container.setAttribute('data-aos-offset', '-100');
  container.setAttribute('data-aos-duration', '650');
  container.setAttribute('data-aos-easing', 'ease-in-out');

  const ul = document.createElement('ul');
  ul.classList.add('quick-links-div');

  [...block.children].forEach((row) => {
    const [labelCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.classList.add('with-full-underline');

    // The link is in an 'aem-content' cell, so we must extract the href from the <a> tag within it.
    const foundLink = linkCell.querySelector('a');
    if (foundLink && foundLink.href) {
      anchor.href = foundLink.href;
      // The original HTML uses target="_blank", so we add it here.
      anchor.target = '_blank';
    }

    anchor.textContent = labelCell.textContent.trim();

    moveInstrumentation(row, li);
    li.appendChild(anchor);
    ul.appendChild(li);
  });

  container.appendChild(ul);
  quickLinksParentsDiv.appendChild(container);
  block.replaceChildren(quickLinksParentsDiv);

  // Image optimization (if any images were present in the block, though none in this model)
  quickLinksParentsDiv.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
