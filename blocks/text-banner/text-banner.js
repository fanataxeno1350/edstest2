import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [titleRow, descriptionRow, ...ctaRows] = [...block.children];

  const sectionWrapper = document.createElement('section');
  sectionWrapper.classList.add('text-banner--wrapper', 'position-relative', 'bg-maroon-700');
  moveInstrumentation(block, sectionWrapper);

  const bgCircleLeft = document.createElement('div');
  bgCircleLeft.classList.add('position-absolute', 'opacity-60', 'bg-circle-left');
  sectionWrapper.append(bgCircleLeft);

  const bgCircleRight = document.createElement('div');
  bgCircleRight.classList.add('position-absolute', 'opacity-20', 'bg-circle-right');
  sectionWrapper.append(bgCircleRight);

  const bgCurveTop = document.createElement('div');
  bgCurveTop.classList.add('position-absolute', 'start-0', 'end-0', 'bg-curve-top');
  sectionWrapper.append(bgCurveTop);

  const bgCurveBottom = document.createElement('div');
  bgCurveBottom.classList.add('position-absolute', 'start-0', 'end-0', 'bg-curve-bottom');
  sectionWrapper.append(bgCurveBottom);

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  sectionWrapper.append(container);

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
    const h2 = document.createElement('h2');
    h2.classList.add('font-baskerville', 'font-md-40', 'font-24', 'text-banner--title');
    moveInstrumentation(titleRow, h2);
    // Access the first child of the titleRow, which is the cell containing the text
    h2.textContent = titleRow.children[0]?.textContent.trim() || '';
    titleDiv.append(h2);
    contentWrapper.append(titleDiv);
  }

  // Description
  if (descriptionRow) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('mt-sm-8', 'mt-5', 'text-banner--description');
    const innerDescriptionDiv = document.createElement('div');
    innerDescriptionDiv.classList.add('font-md-18', 'font-default', 'leading-24', 'text-center', 'promise-text-padding');
    moveInstrumentation(descriptionRow, innerDescriptionDiv);
    // Access the first child of the descriptionRow, which is the cell containing the richtext HTML
    innerDescriptionDiv.innerHTML = descriptionRow.children[0]?.innerHTML || '';
    descriptionDiv.append(innerDescriptionDiv);
    contentWrapper.append(descriptionDiv);
  }

  // CTAs
  if (ctaRows.length > 0) {
    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add('text-banner--cta', 'mt-12', 'mt-lg-16');
    textBannerContainer.append(ctaWrapper);

    ctaRows.forEach((ctaRow) => {
      // Destructure directly as per EDS block structure for item rows
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

      const foundLink = linkCell?.querySelector('a');
      if (foundLink) {
        link.href = foundLink.href;
      }

      const span = document.createElement('span');
      span.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
      span.textContent = labelCell?.textContent.trim() || '';
      link.append(span);

      moveInstrumentation(ctaRow, link);
      ctaWrapper.append(link);
    });
  }

  block.replaceWith(sectionWrapper);

  // The original HTML does not contain pictures directly in the block,
  // so this part is likely for other blocks or future expansion.
  // Keeping it as is, assuming it's a general utility.
  sectionWrapper.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
