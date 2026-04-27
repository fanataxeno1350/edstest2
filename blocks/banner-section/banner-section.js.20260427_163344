import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  // Fixed fields: desktopImage, mobileImage
  const [desktopImageRow, mobileImageRow, ...ctaRows] = children;

  const wrapper = document.createElement('div');
  wrapper.classList.add('position-relative', 'banner-section__wrapper', 'asp-ratio-9x16', 'asp-ratio-sm-16x9', 'd-flex', 'justify-content-center');
  moveInstrumentation(block, wrapper);

  // Handle desktop and mobile images
  const desktopPicture = desktopImageRow?.querySelector('picture');
  const mobilePicture = mobileImageRow?.querySelector('picture');

  if (desktopPicture || mobilePicture) {
    const pictureEl = document.createElement('picture');
    pictureEl.classList.add('d-block', 'w-100', 'h-100');

    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      if (mobileImg) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width:600px)';
        sourceMobile.srcset = mobileImg.src;
        pictureEl.appendChild(sourceMobile);
      }
    }

    if (desktopPicture) {
      const desktopImg = desktopPicture.querySelector('img');
      if (desktopImg) {
        const sourceDesktop = document.createElement('source');
        sourceDesktop.srcset = desktopImg.src;
        pictureEl.appendChild(sourceDesktop);

        const imgEl = createOptimizedPicture(desktopImg.src, desktopImg.alt, true, [{ width: '750' }]).querySelector('img');
        imgEl.classList.add('w-100', 'h-100', 'object-fit-cover', 'banner-media', 'd-block');
        imgEl.setAttribute('loading', 'eager');
        imgEl.setAttribute('fetchpriority', 'high');
        pictureEl.appendChild(imgEl);
        moveInstrumentation(desktopPicture, imgEl);
      }
    }
    wrapper.appendChild(pictureEl);
  }

  const overlayDiv = document.createElement('div');
  overlayDiv.classList.add('position-absolute', 'start-0', 'bottom-0', 'w-100', 'h-100');
  wrapper.appendChild(overlayDiv);

  const bannerContent = document.createElement('div');
  bannerContent.classList.add('position-absolute', 'banner-content');

  const container = document.createElement('div');
  container.classList.add('container', 'sticky-element', 'gx-8', 'gx-lg-0', 'd-flex', 'justify-content-center', 'align-items-center', 'flex-column', 'start-0', 'end-0', 'bottom-0');

  const ctaWrapper = document.createElement('span');
  ctaWrapper.classList.add('text-capitalize', 'mt-6', 'mt-md-3', 'mt-lg-9', 'mb-7');

  ctaRows.forEach((row) => {
    // Use content detection instead of index access for CTA rows
    const cells = [...row.children];
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('a')); // Assuming label cell has no anchor

    const link = linkCell?.querySelector('a');
    const label = labelCell?.textContent.trim();

    if (link && label) {
      const cta = document.createElement('a');
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
      cta.href = link.href;

      const ctaLabel = document.createElement('span');
      ctaLabel.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
      ctaLabel.textContent = label;
      cta.appendChild(ctaLabel);
      moveInstrumentation(row, cta);
      ctaWrapper.appendChild(cta);
    }
  });

  container.appendChild(ctaWrapper);
  bannerContent.appendChild(container);
  wrapper.appendChild(bannerContent);

  block.innerHTML = '';
  block.classList.add('banner-section');
  block.appendChild(wrapper);
}
