import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Destructure root rows based on BlockJson model
  // [title, subtext, socialCardsContainer, ctaLabel, ctaLink, ...socialCardItemRows]
  // Note: socialCards is a container field, its item rows appear after the root fields.
  const [titleRow, subtextRow, ctaLabelRow, ctaLinkRow, ...socialCardItemRows] = [...block.children];

  const section = document.createElement('section');
  section.classList.add('stay-social', 'pt-14', 'py-lg-11', 'bg-cream-300');

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  section.append(container);

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
  moveInstrumentation(titleRow, title);
  title.textContent = titleRow.children[0]?.textContent.trim() || ''; // Access content from the cell
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
  moveInstrumentation(subtextRow, subtext);
  subtext.textContent = subtextRow.children[0]?.textContent.trim() || ''; // Access content from the cell
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
    'mx-auto',
  );
  mainDiv.append(cardsList);

  // Social Card Items
  socialCardItemRows.forEach((row) => {
    // For social-card-item, the schema is fixed: [image, link]
    const [cardImageCell, cardLinkCell] = [...row.children];

    const li = document.createElement('li');
    li.classList.add('stay-social__card', 'overflow-hidden', 'ratio');

    const cardLink = document.createElement('a');
    cardLink.classList.add(
      'stay-social__card--link',
      'd-block',
      'w-100',
      'h-100',
    );
    const foundLink = cardLinkCell?.querySelector('a');
    if (foundLink) {
      cardLink.href = foundLink.href;
      cardLink.target = '_blank';
      cardLink.rel = 'noopener noreferrer';
      const screenReaderSpan = document.createElement('span');
      screenReaderSpan.classList.add('cmp-link__screen-reader-only');
      screenReaderSpan.textContent = 'opens in a new tab';
      cardLink.append(screenReaderSpan);
    }
    moveInstrumentation(row, cardLink); // Move instrumentation from the row to the new link

    if (cardImageCell) {
      const picture = cardImageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        if (img) {
          const optimizedPic = createOptimizedPicture(
            img.src,
            img.alt,
            false,
            [{ width: '750' }],
          );
          const optimizedImg = optimizedPic.querySelector('img');
          if (optimizedImg) {
            optimizedImg.classList.add(
              'stay-social__card--image',
              'w-100',
              'h-100',
              'object-fit-cover',
            );
          }
          // Replace the original picture with the optimized one
          picture.replaceWith(optimizedPic);
        }
        cardLink.prepend(picture); // Prepend the (now optimized) picture to the link
      }
    }

    // Determine ratio class based on original HTML examples.
    // The original HTML has specific ratios for each card, so we'll try to replicate that.
    // This logic is a placeholder; ideally, ratios would be authorable or derived from image metadata.
    // For now, we'll alternate based on the original HTML's pattern (1x1, 9x16, 1x1, 9x16...)
    const cardIndex = socialCardItemRows.indexOf(row);
    if (cardIndex % 2 === 0) { // First, third, fifth card etc.
      li.classList.add('ratio-1x1');
    } else { // Second, fourth, sixth card etc.
      li.classList.add('ratio-9x16');
    }

    li.append(cardLink);
    cardsList.append(li);
  });

  // CTA Link
  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add(
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'mt-8',
    'mt-lg-10',
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
    'bg-red-300-active',
  );

  const foundCtaLink = ctaLinkRow?.querySelector('a');
  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href;
    ctaLink.target = '_blank';
    ctaLink.rel = 'noopener noreferrer';
    const screenReaderSpan = document.createElement('span');
    screenReaderSpan.classList.add('cmp-link__screen-reader-only');
    screenReaderSpan.textContent = 'opens in a new tab';
    ctaLink.append(screenReaderSpan);
  }
  moveInstrumentation(ctaLinkRow, ctaLink);

  const ctaLabelSpan = document.createElement('span');
  ctaLabelSpan.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
  ctaLabelSpan.textContent = ctaLabelRow.children[0]?.textContent.trim() || ''; // Access content from the cell
  moveInstrumentation(ctaLabelRow, ctaLabelSpan);
  ctaLink.prepend(ctaLabelSpan);

  ctaWrapper.append(ctaLink);

  block.replaceChildren(section);
}
