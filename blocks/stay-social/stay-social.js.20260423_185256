import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const children = [...block.children];

  const section = document.createElement('section');
  section.classList.add('stay-social', 'pt-14', 'py-lg-11', 'bg-cream-300');

  const container = document.createElement('div');
  container.classList.add('container', 'gx-8', 'gx-sm-0');
  section.append(container);

  // Title
  // Find the title row by checking for a cell that contains only text and no picture or link
  const titleRow = children.find(
    (row) => row.firstElementChild && !row.firstElementChild.querySelector('picture') && !row.firstElementChild.querySelector('a') && row.firstElementChild.textContent.trim() && row.children.length === 1,
  );
  const titleCell = titleRow?.firstElementChild;
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
  if (titleRow) {
    moveInstrumentation(titleRow, title);
    container.append(title);
  }


  // Subtext
  // Find the subtext row, which should be the next single-cell text row after the title
  const subtextRow = children.find(
    (row) => row !== titleRow && row.firstElementChild && !row.firstElementChild.querySelector('picture') && !row.firstElementChild.querySelector('a') && row.firstElementChild.textContent.trim() && row.children.length === 1,
  );
  const subtextCell = subtextRow?.firstElementChild;
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
  if (subtextRow) {
    moveInstrumentation(subtextRow, subtext);
    container.append(subtext);
  }

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

  const ctaWrapper = document.createElement('div');
  ctaWrapper.classList.add(
    'd-flex',
    'align-items-center',
    'justify-content-center',
    'mt-8',
    'mt-lg-10',
  );
  section.append(ctaWrapper);

  // Process item rows (all remaining children after title and subtext)
  const itemRows = children.filter((row) => row !== titleRow && row !== subtextRow);

  itemRows.forEach((row) => {
    const cells = [...row.children];

    if (cells.length === 2) {
      const [cell0, cell1] = cells;

      // Differentiate between stay-social-card and stay-social-cta
      // stay-social-card has an image in the first cell
      // stay-social-cta has text in the first cell and a link in the second
      const isCard = cell0.querySelector('picture');
      const isCta = !isCard && cell0.textContent.trim() && cell1.querySelector('a');

      if (isCard) {
        // stay-social-card
        const imageCell = cell0;
        const linkCell = cell1;

        const li = document.createElement('li');
        li.classList.add(
          'stay-social__card',
          'overflow-hidden',
          'ratio-1x1', // Default ratio, adjust if needed based on content
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
          const screenReaderSpan = document.createElement('span');
          screenReaderSpan.classList.add('cmp-link__screen-reader-only');
          screenReaderSpan.textContent = 'opens in a new tab';
          cardLink.append(screenReaderSpan);
        }

        const picture = imageCell.querySelector('picture');
        if (picture) {
          const img = picture.querySelector('img');
          if (img) {
            const optimizedPic = createOptimizedPicture(
              img.src,
              img.alt,
              false,
              [{ width: '750' }],
            );
            optimizedPic
              .querySelector('img')
              .classList.add(
                'stay-social__card--image',
                'w-100',
                'h-100',
                'object-fit-cover',
              );
            cardLink.append(optimizedPic);
            moveInstrumentation(imageCell, optimizedPic);
          }
        }
        moveInstrumentation(row, li);
        li.append(cardLink);
        cardsList.append(li);
      } else if (isCta) {
        // stay-social-cta
        const labelCell = cell0;
        const linkCell = cell1;

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

        const foundLink = linkCell.querySelector('a');
        if (foundLink) {
          ctaLink.href = foundLink.href;
          ctaLink.target = '_blank'; // Assuming external links
          const screenReaderSpan = document.createElement('span');
          screenReaderSpan.classList.add('cmp-link__screen-reader-only');
          screenReaderSpan.textContent = 'opens in a new tab';
          ctaLink.append(screenReaderSpan);
        }

        const ctaLabel = document.createElement('span');
        ctaLabel.classList.add('svasti-cta__label', 'fw-semibold', 'fs-default', 'leading-26');
        ctaLabel.textContent = labelCell.textContent.trim();
        ctaLink.prepend(ctaLabel);

        moveInstrumentation(row, ctaLink);
        ctaWrapper.append(ctaLink);
      }
    }
  });

  block.replaceWith(section);
}
