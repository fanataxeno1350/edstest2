import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.classList.add('cmp-breadcrumb');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  ol.classList.add('cmp-breadcrumb__list');

  const items = [...block.children];

  items.forEach((row, index) => {
    const [labelCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('cmp-breadcrumb__item');
    li.setAttribute('itemprop', 'itemListElement');

    const label = labelCell.textContent.trim();
    const linkElement = linkCell.querySelector('a'); // Get the anchor element from the link cell

    if (index < items.length - 1) {
      // Not the last item, so it's a clickable link
      const anchor = document.createElement('a');
      anchor.classList.add('cmp-breadcrumb__item-link');
      if (linkElement) {
        anchor.href = linkElement.href; // Use the href from the anchor element
      } else {
        anchor.href = '#'; // Fallback if link is missing
      }
      const span = document.createElement('span');
      span.textContent = label;
      anchor.append(span);
      moveInstrumentation(row, anchor);
      li.append(anchor);
    } else {
      // Last item, active and not a link
      li.classList.add('cmp-breadcrumb__item--active');
      li.setAttribute('aria-current', 'page');
      const span = document.createElement('span');
      span.textContent = label;
      moveInstrumentation(row, span);
      li.append(span);
    }

    const meta = document.createElement('meta');
    meta.setAttribute('itemprop', 'position');
    meta.setAttribute('content', (index + 1).toString());
    li.append(meta);

    ol.append(li);
  });

  nav.append(ol);
  block.innerHTML = ''; // Clear the original block content
  block.append(nav);
  block.classList.add('breadcrumb'); // Add the root block class
}
