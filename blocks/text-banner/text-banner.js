import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, descriptionRow, ...ctaRows] = [...block.children];

  const wrapper = document.createElement('section');
  wrapper.classList.add('text-banner--wrapper', 'position-relative', 'bg-maroon-700');
  moveInstrumentation(block, wrapper);

  const bgCircleLeft = document.createElement('div');
  bgCircleLeft.classList.add('position-absolute', 'opacity-60', 'bg-circle-left');
  wrapper.append(bgCircleLeft);

  const bgCircleRight = document.createElement('div');
  bgCircleRight.classList.add('position-absolute', 'opacity-20', 'bg-circle-right');
  wrapper.append(bgCircleRight);

  const bgCurveTop = document.createElement('div');
  bgCurveTop.classList.add('position-absolute', 'start-0', 'end-0', 'bg-curve-top');
  wrapper.append(bgCurveTop);

  const bgCurveBottom = document.createElement('div');
  bgCurveBottom.classList.add('position-absolute', 'start-0', 'end-0', 'bg-curve-bottom');
  wrapper.append(bgCurveBottom);

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  wrapper.append(container);

  const row = document.createElement('div');
  row.classList.add('row', 'gx-8', 'gx-sm-0', 'text-cream-100');
  container.append(row);

  const textBannerContainer = document.createElement('div');
  textBannerContainer.classList.add('text-banner--container', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-between');
  row.append(textBannerContainer);

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('d-flex', 'flex-column', 'align-items-center');
  textBannerContainer.append(contentWrapper);

  if (titleRow) {
    const titleDiv = document.createElement('div');
    const title = document.createElement('h2');
    title.classList.add('font-baskerville', 'font-md-40', 'font-24', 'text-banner--title');
    // Access the first child cell of the titleRow
    const titleCell = titleRow.children[0];
    moveInstrumentation(titleCell, title);
    title.textContent = titleCell.textContent.trim();
    titleDiv.append(title);
    contentWrapper.append(titleDiv);
  }

  if (descriptionRow) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('mt-sm-8', 'mt-5', 'text-banner--description');
    const descriptionContent = document.createElement('div');
    descriptionContent.classList.add('font-md-18', 'font-default', 'leading-24', 'text-center', 'promise-text-padding');
    // Access the first child cell of the descriptionRow
    const descriptionCell = descriptionRow.children[0];
    moveInstrumentation(descriptionCell, descriptionContent);
    descriptionContent.innerHTML = descriptionCell.innerHTML;
    descriptionDiv.append(descriptionContent);
    contentWrapper.append(descriptionDiv);
  }

  if (ctaRows.length > 0) {
    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add('text-banner--cta', 'mt-12', 'mt-lg-16');
    textBannerContainer.append(ctaWrapper);

    ctaRows.forEach((ctaRow) => {
      // Destructure children for CTA rows as per model
      const [labelCell, linkCell] = [...ctaRow.children];

      const link = document.createElement('a');
      link.classList.add(
        'svasti-cta',
        'cta-analytics',
        'w-fit',
        'text-decoration-none',
        'd-flex',
        'align-items-center',
        'primary',
        'px-8',
        'pb-3',
        'text-black',
        'border',
        'border-2',
        'border-cream-100',
        'border-cream-500-hover',
        'border-cream-500-active',
        'bg-cream-100',
        'bg-cream-500-hover',
        'bg-cream-100-active',
      );

      const foundLink = linkCell.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href; // Correctly read href from the found <a> tag
      }

      const span = document.createElement('span');
      span.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
      moveInstrumentation(labelCell, span);
      span.textContent = labelCell.textContent.trim();
      link.append(span);
      moveInstrumentation(ctaRow, link);
      ctaWrapper.append(link);
    });
  }

  block.replaceWith(wrapper);
}
