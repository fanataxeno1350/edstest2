import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  ul.className = 'footerlist-footer-list footerlist-d-flex footerlist-align-items-center footerlist-justify-content-center footerlist-align-items-md-start footerlist-flex-column';

  const footerLinks = block.querySelectorAll('[data-aue-model="footerLink"]');

  footerLinks.forEach((linkNode) => {
    const li = document.createElement('li');
    li.className = 'footerlist-footer-list__item';

    const link = linkNode.querySelector('[data-aue-prop="link"]');
    const label = linkNode.querySelector('[data-aue-prop="label"]');

    if (link && label) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = label.textContent;
      a.className = 'footerlist-cta-analytics footerlist-analytics_cta_click footerlist-footer-list__item--link footerlist-d-inline-block';
      a.setAttribute('data-link-region', 'Footer List');

      li.append(a);
      moveInstrumentation(link, a);
      moveInstrumentation(label, a);
    } else if (link) {
      // Fallback for when only link is present, use link text as label
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent;
      a.className = 'footerlist-cta-analytics footerlist-analytics_cta_click footerlist-footer-list__item--link footerlist-d-inline-block';
      a.setAttribute('data-link-region', 'Footer List');

      li.append(a);
      moveInstrumentation(link, a);
    }

    ul.append(li);
    moveInstrumentation(linkNode, li);
  });

  block.textContent = '';
  block.append(ul);
  block.className = `${block.dataset.blockName} block`;
  block.dataset.blockStatus = 'loaded';
}
