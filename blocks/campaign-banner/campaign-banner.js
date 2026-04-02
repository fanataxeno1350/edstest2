import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Check 0 & 1: Avoid row.children[n] and ensure structure alignment
  // The block structure has 3 rows, each with a single cell containing the content.
  // We need to identify these rows by their content, not by index.
  const rows = [...block.children];

  const imageRow = rows.find(row => row.querySelector('picture'));
  const linkRow = rows.find(row => row.querySelector('a') && !row.querySelector('picture')); // Link row should contain only a link
  const headingRow = rows.find(row => row.querySelector('h1, h2, h3, h4, h5, h6, p') && !row.querySelector('a')); // Heading row should contain only a heading

  const picture = imageRow ? imageRow.querySelector('picture') : null;
  const link = linkRow ? linkRow.querySelector('a') : null;
  const heading = headingRow ? headingRow.querySelector('h1, h2, h3, h4, h5, h6, p') : null;

  const wrapper = document.createElement('div');
  // Check 1: Use the exact class name from ORIGINAL HTML
  wrapper.classList.add('campaign_banner');

  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    wrapper.append(optimizedPic);
    // Check 1: Use the exact class name from ORIGINAL HTML
    optimizedPic.querySelector('img').classList.add('webpexpress-processed');
  }

  if (link && heading) {
    const newLink = document.createElement('a');
    newLink.href = link.href;
    // Check 1: Preserve inline style from original HTML
    newLink.style.padding = '0 20px';
    moveInstrumentation(link, newLink);

    // Append heading content to the newLink
    while (heading.firstChild) {
      newLink.append(heading.firstChild);
    }
    wrapper.append(newLink);
  }

  block.textContent = '';
  block.append(wrapper);

  // Check 2: Interactivity
  // The original HTML shows a link, which is already handled by creating `newLink`.
  // No other interactive elements (buttons, toggles, modals, etc.) are present in the original HTML.
  // Therefore, no additional addEventListener calls are needed.
}
