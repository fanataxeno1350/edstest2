import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [imageRow, ...ctaRows] = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.classList.add(
    'position-relative',
    'banner-section__wrapper',
    'asp-ratio-9x16',
    'asp-ratio-sm-16x9',
    'd-flex',
    'justify-content-center'
  );

  // Image
  const imageCell = imageRow.querySelector('div');
  if (imageCell) {
    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
          { media: '(max-width:600px)', width: '600' },
          { width: '1200' },
        ]);
        optimizedPic.classList.add('d-block', 'w-100', 'h-100');
        moveInstrumentation(picture, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
      }
      // The picture element itself also needs these classes, not just the img inside it.
      // The original HTML applies d-block w-100 h-100 to the picture.
      picture.classList.add('d-block', 'w-100', 'h-100');
      const imgEl = picture.querySelector('img');
      if (imgEl) {
        imgEl.classList.add('w-100', 'h-100', 'object-fit-cover', 'banner-media', 'd-block');
      }
    }
    const overlayDiv = document.createElement('div');
    overlayDiv.classList.add('position-absolute', 'start-0', 'bottom-0', 'w-100', 'h-100');
    wrapper.append(imageCell, overlayDiv);
  }

  // CTA content
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
    'bottom-0'
  );

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('text-capitalize', 'mt-6', 'mt-md-3', 'mt-lg-9', 'mb-7');

  ctaRows.forEach((row) => {
    // FIX: Replaced row.children[0] and row.children[1] with content detection
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a')); // aem-content type
    const labelCell = cells.find(cell => !cell.querySelector('a')); // text type

    const foundLink = linkCell?.querySelector('a');
    const cta = document.createElement('a');
    if (foundLink) {
      cta.href = foundLink.href; // FIX: Read href from the anchor element
    }
    cta.classList.add(
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
      'bg-red-300-active'
    );

    const ctaLabelSpan = document.createElement('span');
    ctaLabelSpan.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
    ctaLabelSpan.textContent = labelCell?.textContent.trim() || ''; // FIX: Read label from labelCell
    cta.append(ctaLabelSpan);

    moveInstrumentation(row, cta);
    ctaSpan.append(cta);
  });

  container.append(ctaSpan);
  bannerContent.append(container);
  wrapper.append(bannerContent);

  block.textContent = '';
  block.classList.add('banner-section');
  block.append(wrapper);
}
