import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    bannerImageDesktopRow,
    bannerImageMobileRow,
    ...ctaItemRows
  ] = [...block.children];

  block.innerHTML = ''; // Clear the block content

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

  // Banner Image (Desktop)
  const desktopPictureCell = bannerImageDesktopRow?.firstElementChild;
  const desktopPicture = desktopPictureCell?.querySelector('picture');
  if (desktopPicture) {
    const desktopImg = desktopPicture.querySelector('img');
    const optimizedDesktopPic = createOptimizedPicture(
      desktopImg.src,
      desktopImg.alt,
      false,
      [{ width: '1920' }],
    );
    optimizedDesktopPic.classList.add('d-block', 'w-100', 'h-100');
    optimizedDesktopPic.querySelector('img').classList.add('w-100', 'h-100', 'object-fit-cover', 'banner-media', 'd-block');
    moveInstrumentation(desktopPicture, optimizedDesktopPic.querySelector('img'));
    wrapper.appendChild(optimizedDesktopPic);
  }

  // Banner Image (Mobile) - as a source for the desktop picture
  const mobilePictureCell = bannerImageMobileRow?.firstElementChild;
  const mobilePicture = mobilePictureCell?.querySelector('picture');
  if (mobilePicture && desktopPicture) {
    const mobileImg = mobilePicture.querySelector('img');
    const source = document.createElement('source');
    source.media = '(max-width:600px)';
    source.srcset = mobileImg.src; // Use original mobile image src for mobile source
    desktopPicture.prepend(source); // Add mobile source to the desktop picture
  }

  const overlayDiv = document.createElement('div');
  overlayDiv.classList.add('position-absolute', 'start-0', 'bottom-0', 'w-100', 'h-100');
  wrapper.appendChild(overlayDiv);

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
  ctaSpan.classList.add(
    'text-capitalize',
    'mt-6',
    'mt-md-3',
    'mt-lg-9',
    'mb-7',
  );

  ctaItemRows.forEach((row) => {
    const cells = [...row.children];
    // Find the link cell (aem-content) and label cell (text) using content detection
    const linkCell = cells.find(cell => cell.querySelector('a'));
    const labelCell = cells.find(cell => !cell.querySelector('a') && !cell.querySelector('picture'));

    const foundLink = linkCell?.querySelector('a');
    const labelText = labelCell?.textContent.trim();

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

      moveInstrumentation(row, anchor);
      ctaSpan.appendChild(anchor);
    }
  });

  container.appendChild(ctaSpan);
  bannerContent.appendChild(container);
  wrapper.appendChild(bannerContent);
  section.appendChild(wrapper);
  block.appendChild(section);
}
