import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, descriptionRow, ...ctaRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('text-banner--wrapper', 'position-relative', 'bg-maroon-700');

  const bgCircleLeft = document.createElement('div');
  bgCircleLeft.classList.add('position-absolute', 'opacity-60', 'bg-circle-left');
  section.append(bgCircleLeft);

  const bgCircleRight = document.createElement('div');
  bgCircleRight.classList.add('position-absolute', 'opacity-20', 'bg-circle-right');
  section.append(bgCircleRight);

  const bgCurveTop = document.createElement('div');
  bgCurveTop.classList.add('position-absolute', 'start-0', 'end-0', 'bg-curve-top');
  section.append(bgCurveTop);

  const bgCurveBottom = document.createElement('div');
  bgCurveBottom.classList.add('position-absolute', 'start-0', 'end-0', 'bg-curve-bottom');
  section.append(bgCurveBottom);

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  section.append(container);

  const row = document.createElement('div');
  row.classList.add('row', 'gx-8', 'gx-sm-0', 'text-cream-100');
  container.append(row);

  const textBannerContainer = document.createElement('div');
  textBannerContainer.classList.add('text-banner--container', 'd-flex', 'flex-column', 'align-items-center', 'justify-content-between');
  row.append(textBannerContainer);

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('d-flex', 'flex-column', 'align-items-center');
  textBannerContainer.append(contentWrapper);

  // Title
  if (titleRow) {
    const titleDiv = document.createElement('div');
    const title = document.createElement('h2');
    title.classList.add('font-baskerville', 'font-md-40', 'font-24', 'text-banner--title');
    moveInstrumentation(titleRow.firstElementChild, title);
    title.textContent = titleRow.firstElementChild?.textContent.trim() || '';
    titleDiv.append(title);
    contentWrapper.append(titleDiv);
  }

  // Description
  if (descriptionRow) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('mt-sm-8', 'mt-5', 'text-banner--description');
    const descriptionTextDiv = document.createElement('div');
    descriptionTextDiv.classList.add('font-md-18', 'font-default', 'leading-24', 'text-center', 'promise-text-padding');
    moveInstrumentation(descriptionRow.firstElementChild, descriptionTextDiv);
    descriptionTextDiv.innerHTML = descriptionRow.firstElementChild?.innerHTML || '';
    descriptionDiv.append(descriptionTextDiv);
    contentWrapper.append(descriptionDiv);
  }

  // CTAs
  if (ctaRows.length > 0) {
    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add('text-banner--cta', 'mt-12', 'mt-lg-16');

    ctaRows.forEach((ctaRow) => {
      // Use content detection instead of direct index access for robustness
      const cells = [...ctaRow.children];
      const linkCell = cells.find(cell => cell.querySelector('a'));
      const labelCell = cells.find(cell => !cell.querySelector('a')); // Assuming label cell is the one without an anchor

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

      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }

      const labelSpan = document.createElement('span');
      labelSpan.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
      labelSpan.textContent = labelCell?.textContent.trim() || '';
      link.append(labelSpan);

      moveInstrumentation(ctaRow, link);
      ctaWrapper.append(link);
    });
    textBannerContainer.append(ctaWrapper);
  }

  block.replaceWith(section);
}
