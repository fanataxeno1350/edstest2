import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [desktopImageRow, mobileImageRow, ...ctaRows] = [...block.children];

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

  // Images
  const desktopPicture = desktopImageRow.querySelector('picture');
  const mobilePicture = mobileImageRow.querySelector('picture');

  if (desktopPicture && mobilePicture) {
    const desktopImg = desktopPicture.querySelector('img');
    const mobileImg = mobilePicture.querySelector('img');

    const combinedPicture = document.createElement('picture');
    combinedPicture.classList.add('d-block', 'w-100', 'h-100');

    // Create source for mobile image
    const mobileSource = document.createElement('source');
    mobileSource.media = '(max-width:600px)';
    mobileSource.srcset = createOptimizedPicture(mobileImg.src, mobileImg.alt, false, [{ width: '600' }]).querySelector('img').src;
    combinedPicture.appendChild(mobileSource);

    // Create source for desktop image
    const desktopSource = document.createElement('source');
    desktopSource.srcset = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '2000' }]).querySelector('img').src;
    combinedPicture.appendChild(desktopSource);

    // Create img element
    const img = document.createElement('img');
    img.src = createOptimizedPicture(desktopImg.src, desktopImg.alt, false, [{ width: '2000' }]).querySelector('img').src;
    img.alt = desktopImg.alt;
    img.loading = 'eager';
    img.fetchPriority = 'high';
    img.classList.add('w-100', 'h-100', 'object-fit-cover', 'banner-media', 'd-block');
    combinedPicture.appendChild(img);

    wrapper.appendChild(combinedPicture);
  }

  const overlayDiv = document.createElement('div');
  overlayDiv.classList.add('position-absolute', 'start-0', 'bottom-0', 'w-100', 'h-100');
  wrapper.appendChild(overlayDiv);

  // CTAs
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
    // Corrected: Use content detection instead of index access for CTA cells
    const cells = [...row.children];
    const labelCell = cells.find((cell) => !cell.querySelector('a')); // Label cell is plain text
    const linkCell = cells.find((cell) => cell.querySelector('a')); // Link cell contains <a>

    const link = linkCell?.querySelector('a');
    if (link) {
      const cta = document.createElement('a');
      cta.href = link.href; // Use href from the <a> tag
      cta.textContent = labelCell.textContent.trim(); // Use textContent from the label cell
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
        'bg-red-300-active',
      );

      const ctaLabelSpan = document.createElement('span');
      ctaLabelSpan.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
      ctaLabelSpan.textContent = labelCell.textContent.trim(); // Use textContent from the label cell
      cta.appendChild(ctaLabelSpan);

      moveInstrumentation(row, cta);
      ctaSpan.appendChild(cta);
    }
  });

  container.appendChild(ctaSpan);
  bannerContent.appendChild(container);
  wrapper.appendChild(bannerContent);
  section.appendChild(wrapper);

  block.replaceWith(section);
}
