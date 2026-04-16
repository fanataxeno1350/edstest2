import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, descriptionRow, ...ctaRows] = [...block.children];

  const wrapper = document.createElement('section');
  wrapper.classList.add('text-banner--wrapper', 'position-relative', 'bg-maroon-700');
  moveInstrumentation(block, wrapper);

  const bgCircleLeft = document.createElement('div');
  bgCircleLeft.classList.add('position-absolute', 'opacity-60', 'bg-circle-left');
  wrapper.appendChild(bgCircleLeft);

  const bgCircleRight = document.createElement('div');
  bgCircleRight.classList.add('position-absolute', 'opacity-20', 'bg-circle-right');
  wrapper.appendChild(bgCircleRight);

  const bgCurveTop = document.createElement('div');
  bgCurveTop.classList.add('position-absolute', 'start-0', 'end-0', 'bg-curve-top');
  wrapper.appendChild(bgCurveTop);

  const bgCurveBottom = document.createElement('div');
  bgCurveBottom.classList.add('position-absolute', 'start-0', 'end-0', 'bg-curve-bottom');
  wrapper.appendChild(bgCurveBottom);

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  wrapper.appendChild(container);

  const row = document.createElement('div');
  row.classList.add('row', 'gx-8', 'gx-sm-0', 'text-cream-100');
  container.appendChild(row);

  const textBannerContainer = document.createElement('div');
  textBannerContainer.classList.add('text-banner--container', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-between');
  row.appendChild(textBannerContainer);

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('d-flex', 'flex-column', 'align-items-center');
  textBannerContainer.appendChild(contentWrapper);

  // Title
  if (titleRow) {
    const titleDiv = document.createElement('div');
    const title = document.createElement('h2');
    title.classList.add('font-baskerville', 'font-md-40', 'font-24', 'text-banner--title');
    // FIX: Access the first child cell directly as per EDS guidelines
    title.textContent = titleRow.children[0]?.textContent.trim() || '';
    moveInstrumentation(titleRow, title);
    titleDiv.appendChild(title);
    contentWrapper.appendChild(titleDiv);
  }

  // Description
  if (descriptionRow) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('mt-sm-8', 'mt-5', 'text-banner--description');
    const descriptionContentDiv = document.createElement('div');
    descriptionContentDiv.classList.add('font-md-18', 'font-default', 'leading-24', 'text-center', 'promise-text-padding');
    // FIX: Access the first child cell directly as per EDS guidelines for richtext
    descriptionContentDiv.innerHTML = descriptionRow.children[0]?.innerHTML || '';
    moveInstrumentation(descriptionRow, descriptionContentDiv);
    descriptionDiv.appendChild(descriptionContentDiv);
    contentWrapper.appendChild(descriptionDiv);
  }

  // CTAs
  if (ctaRows.length > 0) {
    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add('text-banner--cta', 'mt-12', 'mt-lg-16');
    textBannerContainer.appendChild(ctaWrapper);

    ctaRows.forEach((ctaRow) => {
      // This is correct as per EDS guidelines for fixed-field item models
      const [labelCell, linkCell] = [...ctaRow.children];

      const link = document.createElement('a');
      link.classList.add('svasti-cta', 'cta-analytics', 'w-fit', 'text-decoration-none', 'd-flex', 'align-items-center',
        'primary', 'px-8', 'pb-3', 'text-black', 'border', 'border-2', 'border-cream-100', 'border-cream-500-hover',
        'border-cream-500-active', 'bg-cream-100', 'bg-cream-500-hover', 'bg-cream-100-active');

      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }

      const span = document.createElement('span');
      span.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
      span.textContent = labelCell?.textContent.trim() || '';
      link.appendChild(span);

      moveInstrumentation(ctaRow, link);
      ctaWrapper.appendChild(link);
    });
  }

  block.replaceWith(wrapper);

  // Image optimization
  wrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
