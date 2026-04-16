import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const [
    titleRow,
    subtextRow,
    ctaLabelRow, // This was ctaLabelRow in the original, but should be ctaLinkRow based on BlockJson
    ctaLinkRow,  // This was ctaLinkRow in the original, but should be ctaLabelRow based on BlockJson
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
  container.appendChild(title);

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
  container.appendChild(subtext);

  const main = document.createElement('div');
  main.classList.add('stay-social__main', 'mt-8');
  container.appendChild(main);

  // Social Cards
  if (cardRows.length > 0) {
    const cardsList = document.createElement('ul');
    cardsList.classList.add(
      'stay-social__cards',
      'd-grid',
      'gap-5',
      'gap-sm-8',
      'w-fit',
      'mx-auto',
    );

    cardRows.forEach((row) => {
      const [imageCell, linkCell] = [...row.children];

      const cardItem = document.createElement('li');
      cardItem.classList.add(
        'stay-social__card',
        'overflow-hidden',
        'ratio-1x1', // Default, will be overridden by content
        'ratio',
      );

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
        cardLink.target = '_blank'; // Assuming external links based on original HTML
      }
      moveInstrumentation(linkCell, cardLink);

      const picture = imageCell.querySelector('picture');
      if (picture) {
        const img = picture.querySelector('img');
        const optimizedPic = createOptimizedPicture(
          img.src,
          img.alt,
          false,
          [{ width: '750' }],
        );
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        optimizedPic.querySelector('img').classList.add(
          'stay-social__card--image',
          'w-100',
          'h-100',
          'object-fit-cover',
        );
        cardLink.appendChild(optimizedPic);

        // Determine ratio based on image dimensions if available, otherwise default
        const tempImg = new Image();
        tempImg.onload = () => {
          if (tempImg.naturalWidth && tempImg.naturalHeight) {
            if (tempImg.naturalWidth / tempImg.naturalHeight > 1) {
              cardItem.classList.remove('ratio-9x16');
              cardItem.classList.add('ratio-1x1');
            } else {
              cardItem.classList.remove('ratio-1x1');
              cardItem.classList.add('ratio-9x16');
            }
          }
        };
        tempImg.src = img.src;
      }

      const screenReaderSpan = document.createElement('span');
      screenReaderSpan.classList.add('cmp-link__screen-reader-only');
      screenReaderSpan.textContent = 'opens in a new tab';
      cardLink.appendChild(screenReaderSpan);

      cardItem.appendChild(cardLink);
      moveInstrumentation(row, cardItem);
      cardsList.appendChild(cardItem);
    });
    main.appendChild(cardsList);
  }

  // CTA Button
  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add(
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'mt-8',
    'mt-lg-10',
  );

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
  const foundCtaLink = ctaLinkRow.querySelector('a'); // Corrected to ctaLinkRow
  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href;
    ctaLink.target = '_blank'; // Assuming external links based on original HTML
  }
  moveInstrumentation(ctaLinkRow, ctaLink); // Corrected to ctaLinkRow

  const ctaLabelSpan = document.createElement('span');
  ctaLabelSpan.classList.add(
    'svasti-cta__label',
    'fw-semibold',
    'fs-default',
    'leading-26',
  );
  ctaLabelSpan.textContent = ctaLabelRow.firstElementChild.textContent.trim(); // Corrected to ctaLabelRow
  moveInstrumentation(ctaLabelRow, ctaLabelSpan); // Corrected to ctaLabelRow
  ctaLink.appendChild(ctaLabelSpan);

  const ctaScreenReaderSpan = document.createElement('span');
  ctaScreenReaderSpan.classList.add('cmp-link__screen-reader-only');
  ctaScreenReaderSpan.textContent = 'opens in a new tab';
  ctaLink.appendChild(ctaScreenReaderSpan);

  ctaWrapper.appendChild(ctaLink);
  container.appendChild(ctaWrapper);

  block.innerHTML = '';
  block.appendChild(container);
}
