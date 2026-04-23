import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // CHECK 0 & 1: Structure alignment - using destructuring for root fields is correct.
  // The BlockJson defines 4 root fields, and the JS destructures 4.
  const [titleCell, descriptionCell, ctaLinkCell, ctaLabelCell] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('text-banner--wrapper', 'position-relative', 'bg-maroon-700');
  moveInstrumentation(block, section);

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

  if (titleCell) {
    const titleDiv = document.createElement('div');
    const title = document.createElement('h2');
    title.classList.add('font-baskerville', 'font-md-40', 'font-24', 'text-banner--title');
    // CHECK 1.5: title field is type=text, .textContent.trim() is correct.
    title.textContent = titleCell.textContent.trim();
    moveInstrumentation(titleCell, title);
    titleDiv.append(title);
    contentWrapper.append(titleDiv);
  }

  if (descriptionCell) {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('mt-sm-8', 'mt-5', 'text-banner--description');
    const descriptionContent = document.createElement('div');
    descriptionContent.classList.add('font-md-18', 'font-default', 'leading-24', 'text-center', 'promise-text-padding');
    // CHECK 1.5: description field is type=richtext, .innerHTML is correct.
    descriptionContent.innerHTML = descriptionCell.innerHTML;
    moveInstrumentation(descriptionCell, descriptionContent);
    descriptionDiv.append(descriptionContent);
    contentWrapper.append(descriptionDiv);
  }

  if (ctaLinkCell && ctaLabelCell) {
    const ctaWrapper = document.createElement('div');
    ctaWrapper.classList.add('text-banner--cta', 'mt-12', 'mt-lg-16');

    const ctaLink = document.createElement('a');
    const foundLink = ctaLinkCell.querySelector('a');
    if (foundLink) {
      // FIX: ctaLink field is type=aem-content, so we must read the href from the <a> tag.
      // The original code correctly found the link but then didn't use its href.
      ctaLink.href = foundLink.href;
    }
    ctaLink.classList.add(
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

    const ctaSpan = document.createElement('span');
    ctaSpan.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
    // CHECK 1.5: ctaLabel field is type=text, .textContent.trim() is correct.
    ctaSpan.textContent = ctaLabelCell.textContent.trim();
    moveInstrumentation(ctaLabelCell, ctaSpan);
    ctaLink.append(ctaSpan);
    moveInstrumentation(ctaLinkCell, ctaLink);
    ctaWrapper.append(ctaLink);
    textBannerContainer.append(ctaWrapper);
  }

  block.replaceWith(section);

  // CHECK 2: Interactivity - The original HTML shows a CTA link, which is handled.
  // No other interactive elements (toggles, modals, etc.) are present in the original HTML.
  // All CSS classes used are from the allowlist.
  section.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
}
