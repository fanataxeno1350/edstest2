import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const categoryLink = block.querySelector('[data-aue-prop="categoryLink"]') || block.querySelector('.productofmonth-cmp-categorylist__item');

  const rootDiv = document.createElement('div');
  rootDiv.classList.add('productofmonth-cmp-header__category');

  const categoryListDiv = document.createElement('div');
  categoryListDiv.classList.add('productofmonth-cmp-categorylist', 'productofmonth-cmp-categorylist--anchor');

  if (categoryLink) {
    const anchor = document.createElement('a');
    anchor.classList.add('productofmonth-cmp-categorylist__item');
    // The authored HTML provides the <a> element directly, so we can move it.
    // If it was just a string, we'd set href and textContent.
    if (categoryLink.tagName === 'A') {
      anchor.href = categoryLink.href;
      anchor.textContent = categoryLink.textContent;
      moveInstrumentation(categoryLink, anchor);
    } else {
      // Fallback if categoryLink is just a p tag with text or similar
      anchor.textContent = categoryLink.textContent;
    }
    categoryListDiv.append(anchor);
  }

  rootDiv.append(categoryListDiv);

  block.textContent = '';
  block.append(rootDiv);
  block.className = 'productofmonth-productofmonth_plant-protein productofmonth-productofmonth block';
  block.dataset.blockStatus = 'loaded';
}
