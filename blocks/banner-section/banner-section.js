import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure the first two rows for images, and collect the rest for links
  const [desktopImageRow, mobileImageRow, ...linkRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('banner-section');
  moveInstrumentation(block, section);

  const wrapper = document.createElement('div');
  wrapper.classList.add(
    'position-relative',
    'banner-section__wrapper',
    'asp-ratio-9x16',
    'asp-ratio-sm-16x9',
    'd-flex',
    'justify-content-center',
  );

  const picture = document.createElement('picture');
  picture.classList.add('d-block', 'w-100', 'h-100');

  const mobileSource = document.createElement('source');
  mobileSource.media = '(max-width:600px)';
  const mobileImg = mobileImageRow.querySelector('img');
  if (mobileImg) {
    mobileSource.srcset = mobileImg.src;
  }
  picture.appendChild(mobileSource);

  const desktopSource = document.createElement('source');
  const desktopImg = desktopImageRow.querySelector('img');
  if (desktopImg) {
    desktopSource.srcset = desktopImg.src;
  }
  picture.appendChild(desktopSource);

  const img = document.createElement('img');
  if (desktopImg) {
    img.src = desktopImg.src;
    img.alt = desktopImg.alt;
  }
  img.loading = 'eager';
  img.fetchPriority = 'high';
  img.classList.add('w-100', 'h-100', 'object-fit-cover', 'banner-media', 'd-block');
  picture.appendChild(img);

  wrapper.appendChild(picture);

  const overlayDiv = document.createElement('div');
  overlayDiv.classList.add('position-absolute', 'start-0', 'bottom-0', 'w-100', 'h-100');
  wrapper.appendChild(overlayDiv);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('position-absolute', 'banner-content');

  const containerDiv = document.createElement('div');
  containerDiv.classList.add(
    'container',
    'sticky-element',
    'gx-8',
    'gx-lg-0',
    'd-flex',
    'justify-content-center',
    'align-items-center',
    'flex-column',
    'start-0',
    'end-0',
    'bottom-0',
  );

  const span = document.createElement('span');
  span.classList.add('text-capitalize', 'mt-6', 'mt-md-3', 'mt-lg-9', 'mb-7');

  linkRows.forEach((row) => {
    // Use content detection for link rows as per EDS guidelines
    const cells = [...row.children];
    const labelCell = cells.find(cell => !cell.querySelector('a')); // Label cell contains plain text
    const linkCell = cells.find(cell => cell.querySelector('a'));   // Link cell contains an <a> tag

    if (!labelCell || !linkCell) {
      // Skip if cells are not found as expected
      return;
    }

    const linkEl = document.createElement('a');
    linkEl.classList.add(
      'svasti-cta',
      'cta-analytics',
      'w-fit',
      'text-decoration-none',
      'd-flex',
      'align-items-center',
      'primary',
      'px-8',
      'pb-3',
      'text-cream-100',
      'border',
      'border-2',
      'border-red-100',
      'border-maroon-100-hover',
      'border-red-300-active',
      'bg-red-100',
      'bg-maroon-100-hover',
      'bg-red-300-active',
    );

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      linkEl.href = foundLink.href;
    }

    const labelSpan = document.createElement('span');
    labelSpan.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
    labelSpan.textContent = labelCell.textContent.trim();
    linkEl.appendChild(labelSpan);
    moveInstrumentation(row, linkEl);
    span.appendChild(linkEl);
  });

  containerDiv.appendChild(span);
  contentDiv.appendChild(containerDiv);
  wrapper.appendChild(contentDiv);
  section.appendChild(wrapper);

  block.replaceWith(section);

  // Optimize images
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
