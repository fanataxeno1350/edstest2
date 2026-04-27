import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('stay-social', 'pt-14', 'py-lg-11', 'bg-cream-300');

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  section.append(container);

  // Title (block.children[0])
  const titleRow = children[0];
  const titleCell = [...titleRow.children].find(cell => cell.textContent.trim() !== '');
  const title = document.createElement('h2');
  title.classList.add('stay-social__title', 'font-24', 'leading-34', 'text-dark-gray-100', 'font-baskerville', 'font-sm-40', 'text-center', 'fw-bold');
  title.textContent = titleCell?.textContent.trim() || '';
  moveInstrumentation(titleRow, title);
  container.append(title);

  // Subtext (block.children[1])
  const subtextRow = children[1];
  const subtextCell = [...subtextRow.children].find(cell => cell.textContent.trim() !== '');
  const subtext = document.createElement('h3');
  subtext.classList.add('stay-social__subtext', 'font-16', 'leading-24', 'text-dark-gray-100', 'font-sm-18', 'text-center', 'fw-medium', 'mt-4');
  subtext.textContent = subtextCell?.textContent.trim() || '';
  moveInstrumentation(subtextRow, subtext);
  container.append(subtext);

  const main = document.createElement('div');
  main.classList.add('stay-social__main', 'mt-8');
  container.append(main);

  const cardsList = document.createElement('ul');
  cardsList.classList.add('stay-social__cards', 'd-grid', 'gap-5', 'gap-sm-8', 'w-fit', 'mx-auto');
  main.append(cardsList);

  // Cards
  const cardRows = children.slice(4); // All rows after the fixed fields are card items
  cardRows.forEach((row) => {
    const [imageCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('stay-social__card', 'overflow-hidden', 'ratio-1x1', 'ratio'); // ratio-1x1 is default, will be overridden by original HTML if ratio-9x16 is present

    const link = document.createElement('a');
    link.classList.add('stay-social__card--link', 'd-block', 'w-100', 'h-100');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.target = '_blank'; // From original HTML
      const screenReaderSpan = document.createElement('span');
      screenReaderSpan.classList.add('cmp-link__screen-reader-only');
      screenReaderSpan.textContent = 'opens in a new tab';
      link.append(screenReaderSpan);
    }
    moveInstrumentation(row, link);

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]);
        optimizedPic.classList.add('stay-social__card--image', 'w-100', 'h-100', 'object-fit-cover');
        // Copy existing sources to the optimized picture if any
        [...picture.querySelectorAll('source')].forEach((source) => {
          optimizedPic.prepend(source.cloneNode(true));
        });
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        link.append(optimizedPic);
      }
    }
    li.append(link);
    cardsList.append(li);
  });

  // CTA Button (block.children[2] for link, block.children[3] for label)
  const ctaLinkRow = children[2];
  const ctaLinkCell = [...ctaLinkRow.children].find(cell => cell.querySelector('a'));

  const ctaLabelRow = children[3];
  const ctaLabelCell = [...ctaLabelRow.children].find(cell => cell.textContent.trim() !== '');

  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add('d-flex', 'align-items-center', 'justify-content-center', 'mt-8', 'mt-lg-10');
  section.append(ctaWrapper);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add('svasti-cta', 'w-fit', 'text-decoration-none', 'd-flex', 'align-items-center', 'primary', 'px-8', 'pb-3', 'text-cream-100', 'border', 'border-2', 'border-red-100', 'border-maroon-100-hover', 'border-red-300-active', 'bg-red-100', 'bg-maroon-100-hover', 'bg-red-300-active');

  const foundCtaLink = ctaLinkCell?.querySelector('a');
  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href;
    ctaLink.target = '_blank'; // From original HTML
  }

  const ctaLabelSpan = document.createElement('span');
  ctaLabelSpan.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
  ctaLabelSpan.textContent = ctaLabelCell?.textContent.trim() || '';
  ctaLink.append(ctaLabelSpan);

  if (ctaLink.target === '_blank') {
    const screenReaderSpan = document.createElement('span');
    screenReaderSpan.classList.add('cmp-link__screen-reader-only');
    screenReaderSpan.textContent = 'opens in a new tab';
    ctaLink.append(screenReaderSpan);
  }

  moveInstrumentation(ctaLinkRow, ctaLink);
  moveInstrumentation(ctaLabelRow, ctaLink);
  ctaWrapper.append(ctaLink);

  block.innerHTML = '';
  block.append(section);
}
