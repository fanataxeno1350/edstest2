import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const socialMediaWrapper = document.createElement('div');
  socialMediaWrapper.classList.add('cmp-footer__social-media');

  // Skip the first row which is the container title
  const itemRows = [...block.children].slice(1);

  itemRows.forEach((row) => {
    // Each item row has one cell: cell[0] contains the link
    const linkCell = row.children[0];
    const foundLink = linkCell ? linkCell.querySelector('a') : null;

    if (foundLink) {
      const linkEl = document.createElement('a');
      linkEl.href = foundLink.href;
      linkEl.target = '_blank'; // Original HTML has target="_blank"

      // Determine the social media icon class based on the href
      const href = foundLink.href.toLowerCase();
      if (href.includes('instagram')) {
        linkEl.classList.add('icon-instagram');
        linkEl.setAttribute('data-social', 'instagram');
      } else if (href.includes('facebook')) {
        // Corrected typo 'facebok' to 'facebook' based on the allowlist
        linkEl.classList.add('icon-facebook');
        linkEl.setAttribute('data-social', 'facebook');
      } else if (href.includes('twitter')) {
        linkEl.classList.add('icon-twitter');
        linkEl.setAttribute('data-social', 'twitter');
      } else if (href.includes('youtube')) {
        linkEl.classList.add('icon-youtube');
        linkEl.setAttribute('data-social', 'youtube');
      }

      moveInstrumentation(row, linkEl);
      socialMediaWrapper.append(linkEl);
    }
  });

  block.textContent = '';
  block.append(socialMediaWrapper);
}
