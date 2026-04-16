import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [desktopImageRow, mobileImageRow, ...ctaRows] = [...block.children];

  // Create the main wrapper div
  const wrapper = document.createElement('div');
  wrapper.classList.add(
    'position-relative',
    'banner-section__wrapper',
    'asp-ratio-9x16',
    'asp-ratio-sm-16x9',
    'd-flex',
    'justify-content-center',
  );

  // Handle images
  const picture = document.createElement('picture');
  picture.classList.add('d-block', 'w-100', 'h-100');

  const desktopImg = desktopImageRow?.querySelector('img');
  const mobileImg = mobileImageRow?.querySelector('img');

  if (mobileImg) {
    const sourceMobile = document.createElement('source');
    sourceMobile.media = '(max-width:600px)';
    sourceMobile.srcset = mobileImg.src;
    picture.appendChild(sourceMobile);
  }

  if (desktopImg) {
    const sourceDesktop = document.createElement('source');
    sourceDesktop.srcset = desktopImg.src;
    picture.appendChild(sourceDesktop);

    const img = createOptimizedPicture(desktopImg.src, desktopImg.alt, true, [{ width: '750' }]).querySelector('img');
    img.classList.add('w-100', 'h-100', 'object-fit-cover', 'banner-media', 'd-block');
    img.setAttribute('loading', 'eager');
    img.setAttribute('fetchpriority', 'high');
    picture.appendChild(img);
    moveInstrumentation(desktopImageRow, picture);
  }

  const overlayDiv = document.createElement('div');
  overlayDiv.classList.add('position-absolute', 'start-0', 'bottom-0', 'w-100', 'h-100');

  wrapper.appendChild(picture);
  wrapper.appendChild(overlayDiv);

  // Create banner content div
  const bannerContent = document.createElement('div');
  bannerContent.classList.add('position-absolute', 'banner-content');

  const container = document.createElement('div');
  container.classList.add(
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

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('text-capitalize', 'mt-6', 'mt-md-3', 'mt-lg-9', 'mb-7');

  ctaRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];

    const foundLink = linkCell.querySelector('a');
    const labelText = labelCell.textContent.trim();

    if (foundLink && labelText) {
      const anchor = document.createElement('a');
      anchor.classList.add(
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
      anchor.href = foundLink.href;

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
      labelSpan.textContent = labelText;
      anchor.appendChild(labelSpan);
      ctaSpan.appendChild(anchor);
      moveInstrumentation(row, anchor);
    }
  });

  container.appendChild(ctaSpan);
  bannerContent.appendChild(container);
  wrapper.appendChild(bannerContent);

  block.innerHTML = '';
  block.classList.add('banner-section');
  block.appendChild(wrapper);
}
