import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  const authoredLinks = block.querySelectorAll('li[id^="footerLinks-"]');

  authoredLinks.forEach((linkItem) => {
    const li = document.createElement('li');
    const anchor = linkItem.querySelector('a');
    
    if (anchor) {
      const newAnchor = document.createElement('a');
      newAnchor.href = anchor.href;
      if (anchor.target) {
        newAnchor.target = anchor.target;
      }
      if (anchor.dataset.cmpClickable) {
        newAnchor.dataset.cmpClickable = anchor.dataset.cmpClickable;
      }
      newAnchor.textContent = anchor.textContent;

      li.append(newAnchor);
      moveInstrumentation(anchor, newAnchor);
    }

    ul.append(li);
    moveInstrumentation(linkItem, li);
  });

  block.textContent = '';
  block.append(ul);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}