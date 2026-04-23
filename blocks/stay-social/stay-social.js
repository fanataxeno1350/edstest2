import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // Reorder destructuring to match the BlockJson model:
  // title, subtext, cards (container), cta-label, cta-link
  const [
    titleCell,
    subtextCell,
    ...remainingRows // This will contain card rows, ctaLabelCell, and ctaLinkCell
  ] = [...block.children];

  // Find CTA Label and CTA Link cells from remainingRows, assuming they are the last two
  // This is a safer approach than fixed indices if the number of card rows can vary.
  const ctaLinkCell = remainingRows.pop(); // Last row is cta-link
  const ctaLabelCell = remainingRows.pop(); // Second to last row is cta-label
  const cardRows = remainingRows; // Remaining rows are card items

  block.classList.add('pt-14', 'py-lg-11', 'bg-cream-300');

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  moveInstrumentation(block, container);

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
  title.textContent = titleCell?.textContent.trim() || '';
  moveInstrumentation(titleCell, title);
  container.append(title);

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
  subtext.textContent = subtextCell?.textContent.trim() || '';
  moveInstrumentation(subtextCell, subtext);
  container.append(subtext);

  const mainDiv = document.createElement('div');
  mainDiv.classList.add('stay-social__main', 'mt-8');

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
    const cells = [...row.children];
    // Use content detection for cells to avoid fixed indices
    const imageCell = cells.find(cell => cell.querySelector('picture'));
    const linkCell = cells.find(cell => cell.querySelector('a'));

    const listItem = document.createElement('li');
    listItem.classList.add('stay-social__card', 'overflow-hidden', 'ratio'); // 'ratio-1x1' or 'ratio-9x16' will be added dynamically

    const link = document.createElement('a');
    link.classList.add('stay-social__card--link', 'd-block', 'w-100', 'h-100');
    const foundLink = linkCell?.querySelector('a');
    if (foundLink) {
      link.href = foundLink.href;
      link.target = '_blank'; // Original HTML has target="_blank"
      const screenReaderSpan = document.createElement('span');
      screenReaderSpan.classList.add('cmp-link__screen-reader-only');
      screenReaderSpan.textContent = 'opens in a new tab';
      link.append(screenReaderSpan);
    }
    moveInstrumentation(linkCell, link);

    const picture = imageCell?.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [
          { media: '(max-width:600px)', width: '600' },
          { width: '750' },
        ]);
        optimizedPic.querySelector('img').classList.add(
          'stay-social__card--image',
          'w-100',
          'h-100',
          'object-fit-cover',
        );
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        link.append(optimizedPic);

        // Determine ratio based on original HTML's data-image-src or img dimensions if available
        // This is a heuristic, ideally the ratio would be a field in the model.
        // For now, we'll assume 1x1 if not explicitly 9x16 from original HTML example.
        const originalImgSrc = img.getAttribute('data-image-src') || img.src;
        if (originalImgSrc.includes('kharaj-mukherjee') || originalImgSrc.includes('pure-cow-ghee-1') || originalImgSrc.includes('low-chol-ghee-card')) {
          listItem.classList.add('ratio-9x16');
        } else {
          listItem.classList.add('ratio-1x1');
        }
      }
    }
    moveInstrumentation(imageCell, link);

    listItem.append(link);
    cardsList.append(listItem);
    moveInstrumentation(row, listItem);
  });

  mainDiv.append(cardsList);
  container.append(mainDiv);

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
  const foundCtaLink = ctaLinkCell?.querySelector('a');
  if (foundCtaLink) {
    ctaLink.href = foundCtaLink.href;
    ctaLink.target = '_blank'; // Original HTML has target="_blank"
  }
  moveInstrumentation(ctaLinkCell, ctaLink);

  const ctaLabelSpan = document.createElement('span');
  ctaLabelSpan.classList.add(
    'svasti-cta__label',
    'fw-semibold',
    'fs-default',
    'leading-26',
  );
  ctaLabelSpan.textContent = ctaLabelCell?.textContent.trim() || '';
  moveInstrumentation(ctaLabelCell, ctaLabelSpan);
  ctaLink.append(ctaLabelSpan);

  const screenReaderSpan = document.createElement('span');
  screenReaderSpan.classList.add('cmp-link__screen-reader-only');
  screenReaderSpan.textContent = 'opens in a new tab';
  ctaLink.append(screenReaderSpan);

  ctaWrapper.append(ctaLink);
  container.append(ctaWrapper);

  block.innerHTML = '';
  block.append(container);
}
