import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Use content detection for the first two rows which are images, then spread the rest for CTAs
  const rows = [...block.children];
  const desktopImageRow = rows.find(row => row.children[0]?.querySelector('picture') || row.children[0]?.querySelector('img'));
  const mobileImageRow = rows.find(row => row !== desktopImageRow && (row.children[0]?.querySelector('picture') || row.children[0]?.querySelector('img')));
  const ctaRows = rows.filter(row => row !== desktopImageRow && row !== mobileImageRow);

  // Main wrapper
  const wrapper = document.createElement('div');
  wrapper.classList.add('position-relative', 'banner-section__wrapper', 'asp-ratio-9x16', 'asp-ratio-sm-16x9', 'd-flex', 'justify-content-center');
  moveInstrumentation(block, wrapper);

  // Image handling
  const desktopImageCell = desktopImageRow?.firstElementChild;
  const mobileImageCell = mobileImageRow?.firstElementChild;

  if (desktopImageCell || mobileImageCell) {
    const picture = document.createElement('picture');
    picture.classList.add('d-block', 'w-100', 'h-100');

    if (mobileImageCell) {
      const mobileImg = mobileImageCell.querySelector('img');
      if (mobileImg) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width:600px)';
        sourceMobile.srcset = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '600' }]).querySelector('img').src;
        picture.appendChild(sourceMobile);
      }
    }

    if (desktopImageCell) {
      const desktopImg = desktopImageCell.querySelector('img');
      if (desktopImg) {
        const sourceDesktop = document.createElement('source');
        sourceDesktop.srcset = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '2000' }]).querySelector('img').src;
        picture.appendChild(sourceDesktop);

        const img = document.createElement('img');
        img.src = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '2000' }]).querySelector('img').src;
        img.loading = 'eager';
        img.fetchPriority = 'high';
        img.alt = desktopImg.alt;
        img.classList.add('w-100', 'h-100', 'object-fit-cover', 'banner-media', 'd-block');
        picture.appendChild(img);
        moveInstrumentation(desktopImageCell, img);
      }
    }
    wrapper.appendChild(picture);
  }

  const overlayDiv = document.createElement('div');
  overlayDiv.classList.add('position-absolute', 'start-0', 'bottom-0', 'w-100', 'h-100');
  wrapper.appendChild(overlayDiv);

  // Banner content
  const bannerContent = document.createElement('div');
  bannerContent.classList.add('position-absolute', 'banner-content');

  const container = document.createElement('div');
  container.classList.add('container', 'sticky-element', 'gx-8', 'gx-lg-0', 'd-flex', 'justify-content-center', 'align-items-center', 'flex-column', 'start-0', 'end-0', 'bottom-0');

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('text-capitalize', 'mt-6', 'mt-md-3', 'mt-lg-9', 'mb-7');

  ctaRows.forEach((row) => {
    // Destructure cells for CTA rows as per BlockJson model
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
      anchor.href = foundLink.href; // Correctly read href from the <a> tag

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
      labelSpan.textContent = labelText;
      anchor.appendChild(labelSpan);
      moveInstrumentation(row, anchor);
      ctaSpan.appendChild(anchor);
    }
  });

  container.appendChild(ctaSpan);
  bannerContent.appendChild(container);
  wrapper.appendChild(bannerContent);

  block.innerHTML = '';
  block.appendChild(wrapper);
}
