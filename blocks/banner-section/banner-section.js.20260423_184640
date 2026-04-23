import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const wrapper = document.createElement('div');
  wrapper.classList.add('position-relative', 'banner-section__wrapper', 'asp-ratio-9x16', 'asp-ratio-sm-16x9', 'd-flex', 'justify-content-center');

  // Row 0: bannerImageDesktop
  // Row 1: bannerImageMobile
  // Use content detection for image cells
  const bannerImageDesktopRow = children[0];
  const bannerImageDesktopCell = [...bannerImageDesktopRow.children].find(cell => cell.querySelector('picture'));
  const desktopPicture = bannerImageDesktopCell ? bannerImageDesktopCell.querySelector('picture') : null;

  const bannerImageMobileRow = children[1];
  const bannerImageMobileCell = [...bannerImageMobileRow.children].find(cell => cell.querySelector('picture'));
  const mobilePicture = bannerImageMobileCell ? bannerImageMobileCell.querySelector('picture') : null;

  if (desktopPicture || mobilePicture) {
    const picture = document.createElement('picture');
    picture.classList.add('d-block', 'w-100', 'h-100');

    if (mobilePicture) {
      const mobileImg = mobilePicture.querySelector('img');
      if (mobileImg) {
        const sourceMobile = document.createElement('source');
        sourceMobile.media = '(max-width:600px)';
        sourceMobile.srcset = mobileImg.src;
        picture.appendChild(sourceMobile);
        moveInstrumentation(mobilePicture, sourceMobile);
      }
    }

    if (desktopPicture) {
      const desktopImg = desktopPicture.querySelector('img');
      if (desktopImg) {
        const sourceDesktop = document.createElement('source');
        sourceDesktop.srcset = desktopImg.src;
        picture.appendChild(sourceDesktop);

        const img = document.createElement('img');
        img.src = desktopImg.src;
        img.alt = desktopImg.alt || '';
        img.loading = 'eager';
        img.fetchPriority = 'high';
        img.classList.add('w-100', 'h-100', 'object-fit-cover', 'banner-media', 'd-block');
        picture.appendChild(img);
        moveInstrumentation(desktopPicture, img);
      }
    }
    wrapper.appendChild(picture);
  }

  const overlayDiv = document.createElement('div');
  overlayDiv.classList.add('position-absolute', 'start-0', 'bottom-0', 'w-100', 'h-100');
  wrapper.appendChild(overlayDiv);

  const contentDiv = document.createElement('div');
  contentDiv.classList.add('position-absolute', 'banner-content');
  const containerDiv = document.createElement('div');
  containerDiv.classList.add('container', 'sticky-element', 'gx-8', 'gx-lg-0', 'd-flex', 'justify-content-center', 'align-items-center', 'flex-column', 'start-0', 'end-0', 'bottom-0');

  const ctaSpan = document.createElement('span');
  ctaSpan.classList.add('text-capitalize', 'mt-6', 'mt-md-3', 'mt-lg-9', 'mb-7');

  // CTA items start from the 3rd row (index 2)
  const ctaRows = children.slice(2);

  ctaRows.forEach((row) => {
    const [labelCell, linkCell] = [...row.children];

    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      const ctaAnchor = document.createElement('a');
      ctaAnchor.href = foundLink.href;
      ctaAnchor.classList.add(
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
      ctaLabelSpan.textContent = labelCell ? labelCell.textContent.trim() : '';
      ctaAnchor.appendChild(ctaLabelSpan);

      moveInstrumentation(row, ctaAnchor);
      ctaSpan.appendChild(ctaAnchor);
    }
  });

  if (ctaSpan.children.length > 0) {
    containerDiv.appendChild(ctaSpan);
  }
  contentDiv.appendChild(containerDiv);
  wrapper.appendChild(contentDiv);

  block.innerHTML = '';
  block.classList.add('banner-section');
  block.appendChild(wrapper);

  // Optimize images
  block.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
