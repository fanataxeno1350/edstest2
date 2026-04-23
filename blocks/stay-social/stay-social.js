import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  const section = document.createElement('section');
  section.classList.add('stay-social', 'pt-14', 'py-lg-11', 'bg-cream-300');

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  section.append(container);

  // Title
  const titleCell = rows[0].firstElementChild;
  const title = document.createElement('h2');
  title.classList.add(
    'stay-social__title',
    'font-24',
    'leading-34',
    'text-dark-gray-100',
    'font-baskerville',
    'font-sm-40',
    'text-center',
    'fw-bold'
  );
  title.textContent = titleCell.textContent.trim();
  moveInstrumentation(titleCell, title);
  container.append(title);

  // Subtext
  const subtextCell = rows[1].firstElementChild;
  const subtext = document.createElement('h3');
  subtext.classList.add(
    'stay-social__subtext',
    'font-16',
    'leading-24',
    'text-dark-gray-100',
    'font-sm-18',
    'text-center',
    'fw-medium',
    'mt-4'
  );
  subtext.textContent = subtextCell.textContent.trim();
  moveInstrumentation(subtextCell, subtext);
  container.append(subtext);

  const mainDiv = document.createElement('div');
  mainDiv.classList.add('stay-social__main', 'mt-8');
  container.append(mainDiv);

  const cardsList = document.createElement('ul');
  cardsList.classList.add(
    'stay-social__cards',
    'd-grid',
    'gap-5',
    'gap-sm-8',
    'w-fit',
    'mx-auto'
  );
  mainDiv.append(cardsList);

  // Social Cards (item rows start from index 4, which is rows[4])
  // The model has 5 root fields: title, subtext, cards (container), cta-label, cta-link
  // So, item rows for 'cards' start after the first two text fields (title, subtext)
  // and before the last two fields (cta-label, cta-link).
  // The first two rows are title and subtext.
  // The next two rows are cta-label and cta-link.
  // So, card rows are from index 2 up to rows.length - 2.
  const cardRows = rows.slice(4); // All rows after the initial 4 root fields (title, subtext, cta-label, cta-link) are card items.
  const ctaLabelCell = rows[2].firstElementChild; // Corrected index based on model
  const ctaLinkCell = rows[3].firstElementChild; // Corrected index based on model

  cardRows.forEach((row) => {
    const [imageCellWrapper, linkCellWrapper] = [...row.children]; // Destructure cells for image and link

    const cardItem = document.createElement('li');
    cardItem.classList.add(
      'stay-social__card',
      'overflow-hidden',
      'ratio-1x1',
      'ratio'
    );

    const cardLink = document.createElement('a');
    cardLink.classList.add(
      'stay-social__card--link',
      'd-block',
      'w-100',
      'h-100'
    );
    cardLink.target = '_blank';

    const imageCell = imageCellWrapper.querySelector('picture');
    const linkAnchor = linkCellWrapper.querySelector('a'); // Get the anchor from the link cell

    if (linkAnchor) {
      cardLink.href = linkAnchor.href;
      const screenReaderSpan = document.createElement('span');
      screenReaderSpan.classList.add('cmp-link__screen-reader-only');
      screenReaderSpan.textContent = 'opens in a new tab';
      cardLink.append(screenReaderSpan);
    }

    if (imageCell) {
      const img = imageCell.querySelector('img');
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
        { width: '600' },
      ]);
      optimizedPic
        .querySelector('img')
        .classList.add('stay-social__card--image', 'w-100', 'h-100', 'object-fit-cover');
      moveInstrumentation(imageCellWrapper, optimizedPic); // Pass the original cell wrapper for instrumentation
      cardLink.prepend(optimizedPic);
    }

    moveInstrumentation(row, cardItem);
    cardItem.append(cardLink);
    cardsList.append(cardItem);
  });

  // CTA
  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add(
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'mt-8',
    'mt-lg-10'
  );
  section.append(ctaWrapper);

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
    'bg-red-300-active'
  );
  ctaLink.target = '_blank';

  const ctaAnchor = ctaLinkCell.querySelector('a'); // Get the anchor from the CTA link cell
  if (ctaAnchor) {
    ctaLink.href = ctaAnchor.href;
    const screenReaderSpan = document.createElement('span');
    screenReaderSpan.classList.add('cmp-link__screen-reader-only');
    screenReaderSpan.textContent = 'opens in a new tab';
    ctaLink.append(screenReaderSpan);
  }

  const ctaLabelSpan = document.createElement('span');
  ctaLabelSpan.classList.add(
    'svasti-cta__label',
    'fw-semibold',
    'fs-default',
    'leading-26'
  );
  ctaLabelSpan.textContent = ctaLabelCell.textContent.trim();
  ctaLink.prepend(ctaLabelSpan);

  moveInstrumentation(ctaLabelCell.parentElement, ctaLink);
  moveInstrumentation(ctaLinkCell.parentElement, ctaLink);
  ctaWrapper.append(ctaLink);

  block.innerHTML = '';
  block.append(section);
}
