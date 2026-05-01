import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Check 0: CRITICAL - Avoid row.children[n] index access.
  // The block.children are the root rows.
  // The BlockJson model shows 4 root fields, so we expect 4 root rows.
  // We need to find the specific content within each row.
  const rows = [...block.children];

  // Find cells based on their content type as per EDS BLOCK STRUCTURE
  const imageCell = rows.find(row => row.querySelector('picture'));
  const imageLinkCell = rows.find(row => row.querySelector('a') && row.querySelector('a').href.includes('/content/site/')); // Distinguish from other links
  const titleCell = rows.find(row => !row.querySelector('picture') && !row.querySelector('a') && row.textContent.trim() !== '' && row.textContent.trim() !== (imageCell?.textContent.trim() || '') && row.textContent.trim() !== (imageLinkCell?.textContent.trim() || ''));
  const altTextCell = rows.find(row => !row.querySelector('picture') && !row.querySelector('a') && row.textContent.trim() !== '' && row.textContent.trim() !== (imageCell?.textContent.trim() || '') && row.textContent.trim() !== (imageLinkCell?.textContent.trim() || '') && row.textContent.trim() !== (titleCell?.textContent.trim() || ''));


  const picture = imageCell?.querySelector('picture');
  const img = picture ? picture.querySelector('img') : null;
  const imageLink = imageLinkCell?.querySelector('a');
  const titleText = titleCell?.textContent.trim();
  const altText = altTextCell?.textContent.trim();

  const wrapper = document.createElement('div');
  wrapper.classList.add('tabimage', 'image', 'aem-GridColumn', 'aem-GridColumn--default--12');

  const cmpImage = document.createElement('div');
  cmpImage.classList.add('cmp-image');

  const link = document.createElement('a');
  link.classList.add('cmp-image__link', 'external-link-icon');
  if (imageLink) {
    link.href = imageLink.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  }
  if (titleText) {
    link.title = titleText;
    link.ariaLabel = titleText;
  }

  if (img) {
    const optimizedPic = createOptimizedPicture(img.src, altText || img.alt, false, [{ width: '750' }]);
    const optimizedImg = optimizedPic.querySelector('img');
    optimizedImg.classList.add('cmp-image__image');
    optimizedImg.width = 'auto';
    optimizedImg.height = '100%';
    optimizedImg.loading = 'lazy';
    if (titleText) {
      optimizedImg.title = titleText;
    }
    if (altText) {
      optimizedImg.alt = altText;
    }

    moveInstrumentation(img.closest('picture'), optimizedPic);
    link.append(optimizedPic);
  }

  cmpImage.append(link);

  if (titleText) {
    const meta = document.createElement('meta');
    meta.setAttribute('itemprop', 'caption');
    meta.setAttribute('content', titleText);
    cmpImage.append(meta);
  }

  wrapper.append(cmpImage);

  moveInstrumentation(block, wrapper);
  block.replaceWith(wrapper);
}
