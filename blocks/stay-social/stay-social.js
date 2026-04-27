import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    titleRow,
    subtextRow,
    ctaLabelRow,
    ctaLinkRow,
    ...cardRows
  ] = [...block.children];

  block.classList.add('pt-14', 'py-lg-11', 'bg-cream-300');

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  moveInstrumentation(block, container);

  // Title
  const title = document.createElement('h2');
  title.classList.add(
    'stay-social__title',
    'font-24',
    'leading-34',
    'text-dark-gray-100',
    'font-baskerville',
    'font-sm-40',
    'text-center',
    'fw-bold',
  );
  title.textContent = titleRow.firstElementChild.textContent.trim();
  moveInstrumentation(titleRow, title);
  container.append(title);

  // Subtext
  const subtext = document.createElement('h3');
  subtext.classList.add(
    'stay-social__subtext',
    'font-16',
    'leading-24',
    'text-dark-gray-100',
    'font-sm-18',
    'text-center',
    'fw-medium',
    'mt-4',
  );
  subtext.textContent = subtextRow.firstElementChild.textContent.trim();
  moveInstrumentation(subtextRow, subtext);
  container.append(subtext);

  // Main content wrapper for cards
  const mainWrapper = document.createElement('div');
  mainWrapper.classList.add('stay-social__main', 'mt-8');
  container.append(mainWrapper);

  // Cards list
  const cardsList = document.createElement('ul');
  cardsList.classList.add(
    'stay-social__cards',
    'd-grid',
    'gap-5',
    'gap-sm-8',
    'w-fit',
    'mx-auto',
  );
  mainWrapper.append(cardsList);

  cardRows.forEach((row) => {
    const [imageCell, linkCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('stay-social__card', 'overflow-hidden', 'ratio');
    // Check for ratio-9x16 class from original HTML
    if (row.firstElementChild.classList.contains('ratio-9x16')) {
      li.classList.add('ratio-9x16');
    } else {
      li.classList.add('ratio-1x1'); // Default if not 9x16
    }

    const cardLink = document.createElement('a');
    cardLink.classList.add(
      'stay-social__card--link',
      'd-block',
      'w-100',
      'h-100',
    );
    const foundLink = linkCell.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank'; // Assuming all social links open in new tab
      const screenReaderSpan = document.createElement('span');
      screenReaderSpan.classList.add('cmp-link__screen-reader-only');
      screenReaderSpan.textContent = 'opens in a new tab';
      cardLink.append(screenReaderSpan);
    }
    moveInstrumentation(linkCell, cardLink);

    const picture = imageCell.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        optimizedPic.querySelector('img').classList.add('stay-social__card--image', 'w-100', 'h-100', 'object-fit-cover');
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        cardLink.append(optimizedPic);
      }
    }
    moveInstrumentation(imageCell, li); // Move instrumentation from imageCell to li
    li.append(cardLink);
    cardsList.append(li);
  });

  // CTA Button
  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add(
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'mt-8',
    'mt-lg-10',
  );
  container.append(ctaWrapper);

  const ctaLink = document.createElement('a');
  ctaLink.classList.add(
    'svasti-cta',
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

  const ctaLabel = ctaLabelRow.firstElementChild.textContent.trim();
  const ctaUrl = ctaLinkRow.querySelector('a')?.href;

  if (ctaUrl) {
    ctaLink.href = ctaUrl;
    ctaLink.target = '_blank'; // Assuming CTA also opens in new tab
    const screenReaderSpan = document.createElement('span');
    screenReaderSpan.classList.add('cmp-link__screen-reader-only');
    screenReaderSpan.textContent = 'opens in a new tab';
    ctaLink.append(screenReaderSpan);
  }
  moveInstrumentation(ctaLinkRow, ctaLink);

  const ctaLabelSpan = document.createElement('span');
  ctaLabelSpan.classList.add(
    'svasti-cta__label',
    'fw-semibold',
    'fs-default',
    'leading-26',
  );
  ctaLabelSpan.textContent = ctaLabel;
  moveInstrumentation(ctaLabelRow, ctaLabelSpan);
  ctaLink.prepend(ctaLabelSpan); // Prepend so screen reader span is after label

  ctaWrapper.append(ctaLink);

  block.replaceChildren(container);
}
