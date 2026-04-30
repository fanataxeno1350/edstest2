import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const nav = document.createElement('nav');
  nav.classList.add('cmp-breadcrumb');
  nav.setAttribute('aria-label', 'Breadcrumb');

  const ol = document.createElement('ol');
  ol.classList.add('cmp-breadcrumb__list');
  nav.append(ol);

  [...block.children].forEach((row, i, rows) => {
    // Correctly destructure cells based on the BlockJson model:
    // cell[0]: field="label" type=text
    // cell[1]: field="link" type=aem-content
    const [labelCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('cmp-breadcrumb__item');
    li.setAttribute('itemprop', 'itemListElement');

    const link = document.createElement('a');
    link.classList.add('cmp-breadcrumb__item-link');

    // For type=aem-content, read ONLY .querySelector('a').href
    const foundLink = linkCell.querySelector('a');
    if (foundLink && foundLink.href) {
      link.href = foundLink.href;
    } else {
      // Fallback if no link is found, though aem-content should always have one
      link.href = '#';
    }

    const span = document.createElement('span');
    span.textContent = labelCell.textContent.trim();
    link.append(span);

    moveInstrumentation(row, li); // Move instrumentation from row to li

    if (i === rows.length - 1) {
      // Last item is active
      li.classList.add('cmp-breadcrumb__item--active');
      li.setAttribute('aria-current', 'page');
      // As per ORIGINAL HTML, the active item's link does not have an href
      link.removeAttribute('href');
      li.append(span); // Append span directly, not the link element
    } else {
      li.append(link);
    }

    const meta = document.createElement('meta');
    meta.setAttribute('itemprop', 'position');
    meta.setAttribute('content', (i + 1).toString());
    li.append(meta);

    ol.append(li);
  });

  block.innerHTML = '';
  block.append(nav);
}
